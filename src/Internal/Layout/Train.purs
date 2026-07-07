-- 列車の挙動に関する関数群

module Internal.Layout.Train
  ( acceralate
  , addRouteQueue
  , getMarginFromBrakePattern
  , getMaxNotch
  , getMaxNotchWithNextSignal
  , movefoward
  , trainsetLength
  )
  where

import Prelude (bind, map, max, min, negate, ($), (*), (+), (-), (/), (/=), (<), (<$>), (<=), (<>), (==), (>), (||))
import Data.Newtype (unwrap)
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Array (any, filter, find, foldl, head, unsnoc)
import Internal.Types (IntJoint, shapeLength)
import Internal.Layout.Types (IntNode, Layout(..), RailNode, RailNode_(..), RouteQueueElement(..), Signal(..), SignalRule(..), TrainRoute_(..), TrainTag, Trainset, Trainset_(..), signalRulePhase_unfired)
import Internal.Layout.Helper (getNextJoint, getRailNode, signalToSpeed, updateRailNode)
import JS.Map.Primitive as JSM
import Internal.Layout.Params (baseaccr, basedccr, brakePattern, speedScale, carLength, carMargin)
import Internal.Layout.Signal (getNextSignal)
import Data.Int (toNumber)
import Data.String.Regex (test) as Re
import Data.Foldable (sum, length)
import Data.Number (infinity)
import Data.Function (on)

updateRailNodeAt :: RailNode -> IntNode -> JSM.Map IntNode RailNode -> Maybe (JSM.Map IntNode RailNode)
updateRailNodeAt newRail nodeid rails = do
  _ <- JSM.lookup nodeid rails
  Just $ JSM.insert nodeid newRail rails



getMaxNotchWithNextSignal :: forall x. { distance ∷ Number , sections ∷ Int , signal ∷ Maybe Signal } -> Trainset_ x -> Int
getMaxNotchWithNextSignal nextsignal (Trainset t2) =
  if t2.respectSignals
  then if t2.signalRestriction < t2.speed || brakePatternCheck t2.speed nextsignal t2.tags
        then -8
        else if t2.signalRestriction < t2.speed + speedScale * 5.0
              then 0
              else 5
  else 5

getMaxNotch :: Layout -> Trainset -> Int
getMaxNotch (Layout layout) (Trainset t0) =
  let nextsignal = getNextSignal (Layout layout) (Trainset t0)
  in  getMaxNotchWithNextSignal nextsignal (Trainset t0)

getMarginFromBrakePattern :: Layout -> Trainset -> Number
getMarginFromBrakePattern (Layout layout) (Trainset t0) =
  let nextsignal = getNextSignal (Layout layout) (Trainset t0)
  in  nextsignal.distance - brakePatternDist t0.speed nextsignal t0.tags

addRouteQueue :: Layout -> IntNode -> IntJoint -> Int -> Int -> Layout
addRouteQueue l n j r t = Layout $ (unwrap l) {routequeue = (unwrap l).routequeue <> [RouteQueueElement {jointid: j, nodeid: n, routeid: r, time: (unwrap l).time, retryafter: (unwrap l).time, trainid: t}]}



brakePatternCheck :: Number -> {signal :: Maybe Signal, sections :: Int, distance :: Number} -> Array TrainTag -> Boolean
brakePatternCheck speed signaldata tags =
  signaldata.distance < brakePatternDist speed signaldata tags

brakePatternDist :: Number -> {signal :: Maybe Signal, sections :: Int, distance :: Number} -> Array TrainTag -> Number
brakePatternDist speed signaldata tags =
  let restriction = maybe 15.0 (getRestriction tags) signaldata.signal
  in  if speed < restriction then -infinity
      else brakePattern speed restriction

acceralate :: Trainset -> Int -> Number -> Trainset
acceralate (Trainset t0) notch dt = Trainset $ t0 {
    speed = max 0.0 $ t0.speed + dt * calcAcceralation notch t0.speed
  }

calcAcceralation :: Int -> Number -> Number
calcAcceralation notch speed =
  let dccr = - speed * speed * 0.001
      magic1 = 21.0
      magic2 = 40.0
  in  dccr +
    (if notch == 0 
      then 0.0
      else 
        if notch > 0 then 
          if speed / speedScale / magic1 < toNumber notch - 0.5 then
            if speed / speedScale < magic2 then
              baseaccr
            else
              baseaccr / (speed / speedScale / magic2)
          else baseaccr / (speed / speedScale / magic2) * (max 0.0 $ (toNumber notch - 0.5 - speed / speedScale / magic1) * 2.0 + 1.0)
        else
          basedccr * (toNumber notch)/8.0)

getRestriction :: Array TrainTag -> Signal -> Number
getRestriction tags signal = 
  foldl (\s r -> 
            case r of
              RuleSpeed tag s' _ -> if any (Re.test tag) (map unwrap tags)
                                    then min s (toNumber s' * speedScale)
                                    else s
              _                  -> s
            ) (if (unwrap signal).manualStop || (unwrap signal).restraint then 0.0 else signalToSpeed signal) (unwrap signal).rules

movefoward :: Layout -> Trainset -> Number -> {newlayout :: Layout, newtrainset :: Trainset}
movefoward (Layout layout) (Trainset t0) dt =
  let dx = dt * t0.speed
      (Trainset t1) = Trainset $ t0 {distanceToNext = t0.distanceToNext - dx, distanceFromOldest = t0.distanceFromOldest + dx}
      (Trainset t2) = 
        case unsnoc t1.route of
          Nothing -> Trainset t1
          Just {init : rs, last : (TrainRoute r)} ->
            if t1.distanceFromOldest <= r.length
              then Trainset t1
              else Trainset $ t1 {route = rs, distanceFromOldest = t1.distanceFromOldest - r.length}
    in  if 0.0 <= t2.distanceToNext 
          then {newlayout : Layout layout, newtrainset : Trainset t2}
          else 
            case (do
                (TrainRoute r) <- head t2.route
                let jointexit = getNextJoint r.railinstance r.jointid
                cdata <- find (\c -> c.from == jointexit) $ (unwrap r.railinstance).connections
                nextRail <- getRailNode (Layout layout) cdata.nodeid
                let updatedroute = updateRailNode nextRail cdata.jointid
                let newinstance = (\(RailNode rn) -> RailNode $ rn {reserves = filter (\r' -> r'.jointid /= cdata.jointid) rn.reserves}) $ updatedroute.instance
                let slength = sum (shapeLength <$> updatedroute.shapes)
                let t3 = Trainset $ t2 {
                      route = [TrainRoute {
                              nodeid  : cdata.nodeid
                            , jointid : cdata.jointid
                            , railinstance : nextRail
                            , shapes : updatedroute.shapes
                            , length : slength
                          }
                        ] <> t2.route
                    , distanceToNext = t2.distanceToNext + slength
                    , signalRestriction = max (speedScale * 15.0) $ maybe t2.signalRestriction (getRestriction t2.tags) (find (\(Signal s) -> s.jointid == jointexit) (unwrap r.railinstance).signals)
                    , signalRulePhase = if any (\(Signal s) -> s.jointid == jointexit) (unwrap r.railinstance).signals then signalRulePhase_unfired else t2.signalRulePhase
                  }
                Just {newlayout :
                  let oldrail = getRailNode (Layout layout) cdata.nodeid
                  in  if on (==) (map (\x -> (unwrap x).state)) oldrail (Just updatedroute.instance)
                        then 
                          Layout $ layout {
                            rails = fromMaybe layout.rails $ updateRailNodeAt newinstance cdata.nodeid layout.rails
                          }
                        else 
                          Layout $ layout {
                              updatecount = layout.updatecount + 1
                            , rails = fromMaybe layout.rails $ updateRailNodeAt newinstance cdata.nodeid layout.rails
                          }
                , newtrainset : t3}
              ) of
            Just x -> x
            Nothing -> 
              if t2.distanceToNext <= 0.0 then {newlayout : Layout layout, newtrainset : Trainset t0} else movefoward (Layout layout) (Trainset t0) (t0.distanceToNext / t0.speed * 0.9)


trainsetLength ∷ forall t. Trainset_ t → Number
trainsetLength (Trainset t) = (toNumber $ length t.types) * (carLength + carMargin) - carMargin