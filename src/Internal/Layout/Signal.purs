-- 信号ロジック

module Internal.Layout.Signal
  ( getNextSignal
  , hasTraffic
  , signalSearchDepth
  , updateSignalIndication
  , updateSignalRoutes
  )
  where

import Prelude (compare, identity, map, not, ($), (&&), (*), (+), (/=), (<), (<$>), (<<<), (<>), (=<<), (==), (>), (>=), (>>=), (>>>), (||))
import Data.Newtype (unwrap)
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Array (all, any, elem, filter, find, head, insert, last, length, nubBy, reverse, zipWith, (!!))
import Internal.Types (IntJoint(..), shapeLength)
import Internal.Layout.Types (InvalidRoute(..), Layout(..), RailNode, RailNode_(..), Signal(..), SignalRoute(..), TrainRoute_(..), Trainset, Trainset_(..), isComplex, signalAlart, signalCaution, signalClear, signalReduce, signalStop)
import Internal.Layout.Helper (getNextJoint, getRailNode, getRailTraffic, getRouteInfo, isRailClear)
import JS.Map.Primitive as JSM
import Internal.Layout.Params
import Data.Function (on)
import Data.Foldable (maximum, sum)
import Data.FoldableWithIndex (allWithIndex)

signalSearchDepth :: Int
signalSearchDepth = 30

updateSignalRoutes :: Layout -> Layout
updateSignalRoutes (Layout layout) = 
  Layout $ layout {
    rails = 
      map (\(RailNode ri) -> RailNode $ ri {signals = map (\(Signal signal) -> 
              Signal $ signal {
                routes =
                  let go {nid, jid, rails, rids, isSimple, len} =
                        if length rails > signalSearchDepth then [] else
                          case getRailNode (Layout layout) nid of
                            Nothing -> []
                            Just (RailNode ri') ->
                              let newstates = (if (unwrap ri'.rail).flipped then reverse else identity) $ nubBy (compare `on` (_.newjoint)) $ ((unwrap ri'.rail).getNewState jid) <$> (unwrap ri'.rail).getStates
                              in  (\{newjoint : jid', shape : s} ->
                                case find (\(InvalidRoute s') -> s'.jointid == jid') ri'.invalidRoutes of
                                  Nothing -> 
                                    let newrails = rails <> [{nodeid : nid, jointenter : jid, jointexit : jid'}]
                                        newlen = len + sum (((_.length) <<< unwrap) <$> s)
                                    in  case find (\(Signal s') -> s'.jointid == jid') ri'.signals of
                                          Nothing -> 
                                            case find (\c -> c.from == jid') $ ri'.connections of
                                              Nothing -> []
                                              Just {nodeid, jointid} -> 
                                                if elem nodeid rids then []
                                                else go {nid: nodeid, jid: jointid, rails: newrails, rids: (insert nodeid rids), isSimple: (isSimple && (unwrap ri'.rail).isSimple), len: newlen}
                                          Just _  -> [SignalRoute {nextsignal : {nodeid : nid, jointid : jid'}, rails : newrails, isSimple, length : newlen}]
                                  Just _  -> []
                              ) =<< newstates
                  in case getRailNode (Layout layout) signal.nodeid of
                        Nothing -> []
                        Just (RailNode ri') ->
                          case find (\c -> c.from == signal.jointid) $ ri'.connections of
                            Nothing -> []
                            Just {nodeid, jointid} -> go {nid: nodeid, jid: jointid, rails: [], rids: [], isSimple: true, len: 0.0}
              }
      ) ri.signals} ) layout.rails
  }


getNextSignal :: Layout -> Trainset -> {signal :: Maybe Signal, sections :: Int, distance :: Number}
getNextSignal (Layout layout) (Trainset trainset) =
  case head trainset.route of
    Nothing -> {signal: Nothing, sections: 0, distance: 0.0}
    Just (TrainRoute {nodeid, jointid}) ->
      let go nid jid sectionsold distanceold isfirst =
            if sectionsold > signalSearchDepth then {signal: Nothing, sections: sectionsold, distance: distanceold} else
              case getRailNode (Layout layout) nid of
                Nothing -> {signal: Nothing, sections: sectionsold, distance: distanceold}
                Just (RailNode ri) ->
                  let next = getRouteInfo (RailNode ri) jid
                      sections = sectionsold + 1
                      distance = if isfirst then distanceold else distanceold + sum (shapeLength <$> next.shapes)
                  in case find (\(InvalidRoute s) -> s.jointid == next.newjoint) ri.invalidRoutes of
                      Nothing -> 
                        case find (\(Signal s) -> s.jointid == next.newjoint) ri.signals of
                          Nothing -> 
                            case find (\c -> c.from == next.newjoint) $ ri.connections of
                              Nothing -> {signal: Nothing, sections, distance}
                              Just {nodeid:nodeid', jointid:jointid'} -> 
                                go nodeid' jointid' sections distance false
                          Just s  -> {signal: Just s, sections, distance}
                      Just _ -> {signal: Nothing, sections, distance}
      in go nodeid jointid 0 trainset.distanceToNext true


hasTraffic :: Layout -> RailNode -> Boolean
hasTraffic (Layout layout) (RailNode ri) =
  if maybe false (any (\t -> length t > 0)) (getRailTraffic (Layout layout) ri.nodeid) then true
  else let go nid jid depth =
              if depth > signalSearchDepth then false
              else
                case getRailNode (Layout layout) nid of
                  Nothing -> false
                  Just (RailNode ri') ->
                    if any (\x -> (unwrap x).jointid == jid) ri'.signals || any (\x -> (unwrap x).jointid == jid) ri'.invalidRoutes
                    then false
                    else
                      let jointexit = (getRouteInfo (RailNode ri') jid).newjoint
                      in case getRailTraffic (Layout layout) nid of
                          Nothing -> false
                          Just ts -> 
                            case ts !! (unwrap jointexit) of
                              Nothing -> false
                              Just ts' -> 
                                if length ts' > 0 then true
                                else
                                  case find (\c -> c.from == jointexit) $ ri'.connections of
                                    Nothing -> false
                                    Just cdata -> go cdata.nodeid cdata.jointid (depth + 1)
            in any identity $ (\cdata -> go cdata.nodeid cdata.jointid 0) <$> ri.connections


updateSignalIndication :: Boolean -> Layout -> Layout
updateSignalIndication changeManualStop (Layout layout) = 
  let -- signals = (unwrap >>> (_.signals)) =<< layout.rails
      blockingData = 
        map (\(RailNode ri) -> {rail :ri, signals :map (\(Signal signal) ->{
            signal : (Signal signal),
            routes : map (\(SignalRoute route) ->
                      let routecond = all (\{nodeid, jointenter, jointexit} ->  -- 進路が開通している
                                    case (getRailNode (Layout layout) nodeid) of
                                      Just (RailNode ri') ->
                                        let rail = (unwrap ri'.rail)
                                            state = (ri'.state)
                                            nr = rail.getNewState jointenter state
                                        in  nr.newjoint == jointexit && rail.isLegal jointenter state
                                      Nothing -> false

                                  ) route.rails

                          clearcond = all (\{nodeid, jointenter, jointexit:_} -> --進路内に他の列車がいない
                              if isRailClear (Layout layout) nodeid== Just true
                              then true
                              else case getRailTraffic (Layout layout) nodeid of
                                      Just ts ->
                                        maybe false (\(RailNode ri') ->
                                                let rail = (unwrap ri'.rail)
                                                    state = (ri'.state)
                                                in  allWithIndex (\i t ->
                                                      if length t == 0
                                                      then true
                                                      else not $ rail.isBlocked (IntJoint i) state jointenter 
                                                    ) ts
                                              ) (getRailNode (Layout layout) nodeid)
                                      Nothing -> false
                            ) route.rails
                          
                          cond = if routecond && clearcond
                                  then -- 単線部で、信号の先に対向列車がいない
                                    case last (route.rails) of
                                      Just {nodeid, jointenter, jointexit:_} ->
                                        let go nid jid cnt =
                                              if cnt > signalSearchDepth*4 then true
                                              else case getRailNode (Layout layout) nid of
                                                Nothing -> false -- 該当する線路がなかったら（こんなことにはならないと思うが）赤
                                                Just ri' ->
                                                  if (unwrap (unwrap ri').rail).isSimple
                                                  then
                                                    let jidexit = getNextJoint ri' jid
                                                    in  if isRailClear (Layout layout) nid == Just true
                                                        then      case find (\c -> c.from == jidexit) $ (unwrap ri').connections of
                                                                    Nothing -> true -- 線路がここで終わっていたら探索終了
                                                                    Just {nodeid:_, jointid} -> go nodeid jointid (cnt + 1)
                                                        else  case length <$> ((_ !! (unwrap jidexit)) =<< (getRailTraffic (Layout layout) nid)) of
                                                                Just 0  -> 
                                                                  case find (\c -> c.from == jidexit) $ (unwrap ri').connections of
                                                                    Nothing -> true -- 線路がここで終わっていたら探索終了
                                                                    Just {nodeid:_, jointid} -> go nodeid jointid (cnt + 1)
                                                                _       -> false -- 対向列車がいたら赤
                                                  else true -- 進路がシンプルでなかったらなんとかなるであろう！（楽観）
                                        in  go nodeid jointenter 0
                                      Nothing -> false -- 進路の長さが0なら赤
                                  else false -- 進路未開通か占有済みなら赤
                in {
                  route: (SignalRoute route),
                  routecond : routecond,
                  manualStop : signal.manualStop,
                  restraint  : signal.restraint,
                  cond : cond
                }
              ) signal.routes
            }
          ) ri.signals}
        ) layout.rails
      filtered = map (\rbd -> map (\bd -> bd {routes = filter (\d -> d.cond) bd.routes}) rbd.signals) blockingData
      colored =
        map (\rbd -> RailNode $ (rbd.rail) {signals = map (\bd -> Signal $ (unwrap bd.signal) {
              routecond = (_.routecond) <$> bd.routes,
              manualStop = 
                    (unwrap bd.signal).manualStop
                 || changeManualStop                --赤現示ロック可
                       && not (length bd.routes < 2 --自動閉塞信号でない
                            && all (\bdr -> (unwrap bdr.route).isSimple) bd.routes
                            && all (isComplex >>> not) (unwrap bd.signal).rules
                          )
                      && (any identity (zipWith (\route routecond -> (routecond /= route.routecond) ) bd.routes (unwrap bd.signal).routecond) || any identity (zipWith (\route indication -> ((indication > 0) && not route.cond)) bd.routes (unwrap bd.signal).indication)),
              indication =
                map (\d ->
                  if d.cond then
                    let go len {nodeid, jointid} =
                          if len >= brakePattern (indicationToSpeed signalClear) 0.0 then (Just signalClear)
                          else
                            case (JSM.lookup nodeid filtered) >>= (find (\bd' -> (unwrap bd'.signal).jointid == jointid)) of
                              Just bd' ->
                                case head bd'.routes of
                                  Just d' ->
                                    if d'.cond && ((not d'.manualStop && not d'.restraint) || len == 0.0)
                                    then go (len + (unwrap d'.route).length) ((unwrap d'.route).nextsignal)
                                    else     maximum $ filter (\color -> len >= brakePattern (indicationToSpeed color) 0.0) [signalStop, signalAlart, signalCaution, signalReduce]
                                  Nothing -> maximum $ filter (\color -> len >= brakePattern (indicationToSpeed color) 0.0) [signalStop, signalAlart, signalCaution, signalReduce]
                              Nothing ->     maximum $ filter (\color -> len >= brakePattern (indicationToSpeed color) 0.0) [signalStop, signalAlart, signalCaution, signalReduce]
                    in fromMaybe signalStop $ go 0.0 {nodeid : (unwrap bd.signal).nodeid, jointid : (unwrap bd.signal).jointid}
                  else signalStop
                ) bd.routes
            }
          ) rbd.signals}
        ) blockingData
  in Layout $ layout {rails = colored}



