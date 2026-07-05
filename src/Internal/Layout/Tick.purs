module Internal.Layout.Tick where

import Prelude
import Data.Newtype
import Data.Maybe
import Data.Array
import Internal.Types
import Internal.Layout.Types
import Internal.Layout.Helper
import Internal.Layout.Signal
import Internal.Layout.DrawInfo
import Internal.Layout.Operation
import Internal.Layout.Train
import Data.Int
import Data.String.Regex
import Data.String.Regex as Re
import Data.String.Regex.Flags as Re
import Data.String.Regex.Unsafe as Re
import Data.Foldable (foldM, maximum, sum)
import Data.Number (infinity)
import Data.Function (on)
import Data.FoldableWithIndex (allWithIndex, findWithIndex)


trainTick :: Layout -> Trainset -> Number -> {newlayout :: Layout, newtrainset :: Trainset}
trainTick (Layout layout) (Trainset t0) dt =
  let nextsignal = getNextSignal (Layout layout) (Trainset t0)
      {-
      {reservedlayout, reserved} = fromMaybe {reservedlayout :(Layout layout), reserved : t0.reserved} $ do
            (Signal s) <- nextsignal.signal
            if any (\r -> r.nodeid == s.nodeid && r.jointid == s.jointid) t0.reserved then Nothing else pure unit
            p <- find (\{nodeid, jointid} -> nodeid == s.nodeid && jointid == s.jointid) t0.program
            l' <- tryOpenRouteFor (Layout layout) p.nodeid p.jointid p.routeid
            l'' <- unlockManualStop l'.layout p.nodeid p.jointid
            pure {reservedlayout : l'', reserved : t0.reserved <> [{nodeid : p.nodeid, jointid : p.jointid, routeid : p.routeid, reserveid: l'.reserveid}]}
      
      reverseOn = maybe false (\(Signal s) -> any (\r -> r.nodeid == s.nodeid && r.jointid == s.jointid) t0.reverseOn) nextsignal.signal 
      -}

      -- reverseOn = false

      {firedlayout, firedtrain: Trainset t1} =
        case nextsignal.signal of
          Nothing     -> {firedlayout:Layout layout, firedtrain:Trainset t0}
          Just (Signal signal) ->
            if t0.signalRulePhase == signalRulePhase_unfired then
              (\{l, t} -> {firedlayout:l, firedtrain: Trainset $ (unwrap t) {signalRulePhase = signalRulePhase_fired}}) $ foldl (\{l, t} r -> 
                let tag = getTag r
                in  if any (Re.test tag) (map unwrap t0.tags)
                    then case r of
                          RuleComment              _ -> {l, t}
                          RuleComplex              _ -> {l, t}
                          RuleSpeed      _ _       _ -> {l, t}
                          RuleOpen       _ route   _ -> {l:addRouteQueue l signal.nodeid signal.jointid route t0.trainid, t}
                          RuleUpdate     _ from to _ -> {l:l, t:Trainset $ (unwrap t) {tags = (\told -> wrap $ replace from to (unwrap told)) <$> (unwrap t).tags}}
                          RuleStop       _         _ -> {l:setManualStop l signal.nodeid signal.jointid true, t}
                          RuleStopOpen   _ _       _ -> {l:setManualStop l signal.nodeid signal.jointid true, t}
                          RuleStopUpdate _ _ _     _ -> {l:setManualStop l signal.nodeid signal.jointid true, t}
                          RuleReverse    _         _ -> {l:setManualStop l signal.nodeid signal.jointid true, t}
                          RuleReverseUpdate _ _ _  _ -> {l:setManualStop l signal.nodeid signal.jointid true, t}
                    else {l, t}
            ) {l:Layout layout, t:Trainset t0} signal.rules
            else if t0.signalRulePhase == signalRulePhase_fired && t0.speed == 0.0 then
              (\{f, l, t} -> {firedlayout:l, firedtrain: (if f then flipTrain else identity) $ if (unwrap t).signalRulePhase == signalRulePhase_fired then Trainset $ (unwrap t) {signalRulePhase = signalRulePhase_stoppedFired} else t}) $ foldl (\{f, l, t} r -> 
                let tag = getTag r
                in  if any (Re.test tag) (map unwrap t0.tags)
                    then case r of
                          RuleComment                 _ -> {f, l, t}
                          RuleComplex                 _ -> {f, l, t}
                          RuleSpeed      _ _          _ -> {f, l, t}
                          RuleOpen       _ _          _ -> {f, l, t}
                          RuleUpdate     _ _ _        _ -> {f, l, t}
                          RuleStop       _            _ -> {f, l, t}
                          RuleStopOpen   _ route      _ -> {f, l:addRouteQueue l signal.nodeid signal.jointid route t0.trainid, t}
                          RuleStopUpdate _ from to    _ -> {f, l:l, t:Trainset $ (unwrap t) {tags = (\told -> wrap $ replace from to (unwrap told)) <$> (unwrap t).tags}}
                          RuleReverse    _            _ -> {f: true, l:l, t:(Trainset $ (unwrap t) {signalRulePhase = signalRulePhase_unfired})}
                          RuleReverseUpdate _ from to _ -> {f: true, l:l, t:Trainset $ (unwrap t) {tags = (\told -> wrap $ replace from to (unwrap told)) <$> (unwrap t).tags, signalRulePhase = signalRulePhase_unfired}}
                    else {f, l, t}
              ) {f: false, l:Layout layout, t:Trainset t0} signal.rules
            else {firedlayout:Layout layout, firedtrain:Trainset t0}
                
      (Trainset t2) = Trainset $ t1 {signalRestriction = max t1.signalRestriction (maybe (speedScale * 25.0) signalToSpeed nextsignal.signal)}
      
      notch = min (t2.notch) (getMaxNotch_ nextsignal (Trainset t2))
      
      (Trainset t3) = if t2.realAcceralation
            then acceralate (Trainset t2) notch dt
            else (Trainset t2)

      (Trainset t4) = Trainset (t3 {route = catMaybes $ map (\(TrainRoute r) -> (\ri -> TrainRoute r {railinstance = ri}) <$> getRailNode firedlayout r.nodeid ) t3.route})
  
  in movefoward firedlayout (Trainset t4) dt

moveTrains :: Number -> Layout -> Layout
moveTrains dt (Layout layout) =
  foldl (\l t ->
      let {newlayout, newtrainset} = trainTick l t dt
      in Layout $ (unwrap newlayout) {trains = (unwrap newlayout).trains <> [newtrainset]}
    ) (Layout $ layout {trains = []}) (layout.trains)

layoutTick :: Layout -> Layout
layoutTick (Layout l) =
  (
    moveTrains (l.speed / 60.0) >>> layoutUpdate >>> (\(Layout l')->
        (\{layout, queuenew} -> Layout $ (unwrap layout) {routequeue = queuenew}) $ foldl (\{layout: l'', queuenew} (RouteQueueElement x) ->
          if l'.time < x.retryafter
          then {layout: l'', queuenew: queuenew <> [RouteQueueElement x]}
          else case tryOpenRouteFor l'' x.nodeid x.jointid x.routeid x.trainid of
                Nothing -> {layout: l'', queuenew: queuenew <> [RouteQueueElement $ x {retryafter = l'.time + 0.25}]}
                Just {layout} -> {layout: setManualStop layout x.nodeid x.jointid false, queuenew: queuenew}
        ) {layout: Layout l', queuenew: []} l'.routequeue
      ) >>> (\(Layout l') -> Layout (l' {time = l.time + l.speed / 60.0}) )
  ) (Layout l)



-- derive instance IntSerialize SignalColor

