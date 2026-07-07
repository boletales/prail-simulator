-- レイアウトが返り値の「動的」な関数群

module Internal.Layout.Operation
  ( addInvalidRoute
  , addJoint
  , addRail
  , addSignal
  , addTrainset
  , autoAdd
  , fixBrokenConnections
  , flipTrain
  , forceUpdate
  , layoutUpdate
  , layoutUpdate_NoManualStop
  , removeRail
  , removeSignal
  , setManualStop
  , setRailColor
  , tryOpenRouteFor
  , tryOpenRouteFor_ffi
  )
  where

import Prelude (bind, discard, map, negate, not, pure, show, unit, ($), (&&), (*), (+), (-), (/=), (<), (<$>), (<>), (=<<), (==), (>), (>>=), (>>>), (||))
import Data.Newtype (class Newtype, unwrap, wrap)
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Array (all, any, catMaybes, deleteAt, elem, filter, find, foldl, head, length, modifyAt, replicate, reverse, uncons, updateAt, (!!))
import Internal.Types (ColorOption, IntJoint, Pos(..), Rail, canJoin, opposeRail, poszero, reverseShapes, saEmpty, saModifyAt, shapeLength, toAbsPos)
import Internal.Layout.Types (CarType, IntNode(..), IntReserve(..), InvalidRoute(..), JointData(..), Layout(..), RailNode, RailNode_(..), Signal(..), SignalRoute(..), TrainRoute_(..), Trainset, Trainset_(..), signalAlart, signalCaution, signalReduce, signalRulePhase_unfired, signalStop)
import Internal.Layout.Helper (getJointAbsPos, getJoints, getNewRailPos, getNextJoint, getRailNode, getRouteInfo, recalcInstanceDrawInfo, selectRail)
import JS.Map.Primitive as JSM
import Internal.Layout.Signal (hasTraffic, updateSignalIndication, updateSignalRoutes)
import Internal.Layout.Params (carLength, carMargin)
import Data.Int
import Data.Foldable (foldM, sum)
import Data.FoldableWithIndex (findWithIndex)

flipTrain :: Trainset -> Trainset
flipTrain (Trainset t0) = Trainset $ t0 {
    --  types = reverse $ (\(CarType t) -> CarType $ t {flipped = not t.flipped}) <$> t0.types
      route = reverse $ (\(TrainRoute r) -> TrainRoute $ r {jointid = getNextJoint r.railinstance r.jointid, shapes = reverseShapes r.shapes}) <$> t0.route 
    , distanceToNext     = t0.distanceFromOldest
    , distanceFromOldest = t0.distanceToNext
    , flipped = not t0.flipped
  }


autoAdd :: Layout -> IntNode -> IntJoint -> Rail -> IntJoint -> Layout
autoAdd (Layout layout) selectednode selectedjoint rail from =
  fromMaybe (Layout layout) $ (do
      Pos to <- getJointAbsPos (Layout layout) selectednode selectedjoint
      let rail' =
            if to.isPlus == (unwrap $ unwrap $ (unwrap rail).getJointPos from).isPlus
            then opposeRail rail
            else rail
      let node = RailNode {
              nodeid : IntNode layout.instancecount,
              instanceid : layout.instancecount,
              state : (unwrap rail').defaultState,
              rail : rail',
              connections : [{from: from, nodeid: selectednode, jointid: selectedjoint}],
              signals : [],
              invalidRoutes : [],
              reserves : [],
              pos : poszero,
              drawinfos : [],
              note : "",
              color : [],
              traffic : replicate (length (unwrap rail').getJoints) [],
              isclear : true
            }
      addRail (Layout layout) node
    )

modifyRailNode :: (RailNode -> RailNode) -> IntNode -> JSM.Map IntNode RailNode -> Maybe (JSM.Map IntNode RailNode)
modifyRailNode f nodeid rails = do
  r <- JSM.lookup nodeid rails
  Just $ JSM.insert nodeid (f r) rails

updateRailNodeAt :: RailNode -> IntNode -> JSM.Map IntNode RailNode -> Maybe (JSM.Map IntNode RailNode)
updateRailNodeAt newRail nodeid rails = do
  _ <- JSM.lookup nodeid rails
  Just $ JSM.insert nodeid newRail rails


removeRail :: Layout -> IntNode -> Layout
removeRail (Layout layout) nodeid = 
    let layout' = 
          case getRailNode (Layout layout) nodeid of
            Just (RailNode ri) -> unwrap $  foldl (\l j -> removeSignal l nodeid j) (Layout layout) (unwrap ri.rail).getJoints
            Nothing -> layout
    in  updateSignalRoutes $ Layout $ layout' {
          updatecount = layout'.updatecount + 1,
          rails = map (\(RailNode ri) -> 
                      RailNode $ ri {
                          connections = filter (\{nodeid:i} -> i /= nodeid) ri.connections
                        }
                    ) (JSM.delete nodeid layout'.rails),
          jointData = (map $ map $ map $ filter (\(JointData d) -> d.nodeid /= nodeid)) layout'.jointData,
          trains = layout'.trains
        }



forceUpdate :: Layout -> Layout
forceUpdate (Layout layout)= 
  Layout $ layout{
            updatecount = layout.updatecount + 1
    }

addRail :: Layout -> RailNode -> Maybe Layout
addRail l n = 
  addRailWithPos l n =<< getNewRailPos l n

addRailWithPos :: Layout -> RailNode -> Pos -> Maybe Layout
addRailWithPos (Layout layout) (RailNode node) pos = 
  let jrel i = (unwrap node.rail).getJointPos i
      joints = (\j -> {jointid: j, pos: (toAbsPos pos (jrel j))}) <$> ((unwrap node.rail).getJoints)
      cfroms = (\{from:f} -> f) <$> node.connections
      givenconnections = ((\{from : f, nodeid : n, jointid : j} -> {jointData:JointData {pos : poszero, nodeid : n, jointid : j}, jointid:f}) <$> node.connections)
      newconnections =  
        (catMaybes $ (\{jointid: j, pos: p} ->
          if elem j cfroms
          then Nothing
          else (filter (\(JointData jd) -> canJoin p jd.pos) >>> head >>> (map (\jdata -> {jointData:jdata, jointid:j})))
                  (getJoints (Layout layout) p)
        ) <$> joints)
      connections = givenconnections <> newconnections

      cond = 
        foldl (&&) true $ map (\{jointData:(JointData {pos: _, nodeid: nodeid, jointid: jointid}), jointid:_} ->
            fromMaybe true $ (\(RailNode n) -> all (\c -> c.from /= jointid) n.connections) <$> getRailNode (Layout layout) nodeid
          ) connections
  in if cond then
        let newnodeId = IntNode layout.instancecount
            newnode = recalcInstanceDrawInfo $ RailNode $ node {
                nodeid = newnodeId,
                connections =
                  node.connections
                  <> ((\{jointData:(JointData {pos: _, nodeid: nodeid, jointid: jointid}), jointid:j} 
                          -> {from: j, nodeid: nodeid, jointid: jointid}
                      ) <$> newconnections),
                instanceid = layout.instancecount,
                pos = pos,
                traffic = replicate (length (unwrap node.rail).getJoints) [],
                isclear = true
              }
            newrails =
              JSM.insert newnodeId newnode $
              foldl (\rs {jointData:(JointData {pos: _, nodeid: nodeid, jointid: jointid}), jointid:j} ->
                  fromMaybe rs 
                    (modifyRailNode (\(RailNode n) ->
                      RailNode $ n {connections = n.connections <> [{from : jointid, nodeid : newnodeId, jointid :j}]}
                    ) nodeid rs
                  )
                ) layout.rails connections
        in Just $ updateSignalRoutes $ 
                  (\l -> foldl (\l' {jointid: j, pos: p} -> addJoint l' p newnodeId j) l joints)
                    $ Layout $ layout{
                            updatecount = layout.updatecount + 1
                          , rails = newrails
                          , instancecount =  layout.instancecount + 1
                    }
      else Nothing

addJoint :: Layout -> Pos -> IntNode -> IntJoint -> Layout
addJoint (Layout layout) pos nodeid jointid = 
  let coord = (unwrap (unwrap pos).coord)
  in Layout $ layout {
      jointData = 
        (                          saModifyAt (round coord.z) saEmpty)
          (fromMaybe saEmpty >>>  (saModifyAt (round coord.x) saEmpty)
            (fromMaybe saEmpty >>> saModifyAt (round coord.y) []
              (\ma -> (fromMaybe [] ma <> [JointData {pos: pos, nodeid: nodeid, jointid: jointid}]))
            )
          )
        layout.jointData
    }

fixBrokenConnections :: Layout -> Layout
fixBrokenConnections (Layout layout) =
  foldl (\l (RailNode r) -> fromMaybe l $ addRailWithPos l (RailNode (r {connections = []})) r.pos) (Layout (layout { rails = JSM.empty, jointData = saEmpty})) (JSM.values layout.rails)

removeSignal :: Layout -> IntNode -> IntJoint -> Layout
removeSignal (Layout layout) nodeid jointid = 
  updateSignalRoutes $ Layout $ layout {
    updatecount = layout.updatecount + 1, 
    rails = fromMaybe layout.rails $ modifyRailNode (\(RailNode ri) -> RailNode $ ri {signals = filter (\(Signal s) -> s.jointid /= jointid) ri.signals, invalidRoutes = filter (\(InvalidRoute s) -> s.jointid /= jointid) ri.invalidRoutes}) nodeid layout.rails
  }



setManualStop :: Layout -> IntNode -> IntJoint -> Boolean -> Layout
setManualStop (Layout layout) nodeid jointid stop = fromMaybe (Layout layout) do
  (RailNode ri) <- getRailNode (Layout layout) nodeid
  {index : i, value: (Signal signal)} <- findWithIndex (\_ (Signal s) -> s.jointid == jointid) ri.signals
  newSignals <- updateAt i (Signal $ signal {manualStop = stop}) ri.signals
  let newRail = RailNode $ ri {signals = newSignals}
  newRails <- updateRailNodeAt newRail nodeid layout.rails
  pure $ Layout $ layout {rails = newRails}




addSignal :: Layout -> IntNode -> IntJoint -> Layout
addSignal (Layout layout) nodeid jointid = fromMaybe (Layout layout) $
  let signal = Signal {
            signalname : show nodeid <> "_" <> show jointid
          , nodeid
          , jointid 
          , routes : []
          , colors : [signalStop, signalAlart, signalCaution, signalReduce]
          , routecond : []
          , indication : []
          , rules : []
          , manualStop : false
          , restraint : false
        }
  in  do
    (RailNode ri) <- getRailNode (Layout layout) nodeid
    if any (\(Signal s) -> s.jointid == jointid) ri.signals || any (\(InvalidRoute s) -> s.jointid == jointid) ri.invalidRoutes
    then Nothing
    else pure unit

    rails' <- modifyRailNode (\(RailNode ri') -> RailNode $ ri' {signals = ri'.signals <> [signal]}) nodeid layout.rails
    Just $ updateSignalRoutes $ Layout $ layout {updatecount = layout.updatecount + 1, rails = rails'}

updateTraffic :: Layout -> Layout
updateTraffic (Layout layout) =
  let clearedRails = JSM.mapWithKey (\_ (RailNode r) -> RailNode $ r {traffic = replicate (length (unwrap r.rail).getJoints) [], isclear = true}) layout.rails
      rails' = 
        foldl (\rails (Trainset trainset) ->
            foldl (\rails (TrainRoute route) ->
                fromMaybe rails do
                  (RailNode r) <- JSM.lookup route.nodeid rails
                  traffic' <- modifyAt (unwrap route.jointid) (\d -> d <> [trainset.trainid]) r.traffic
                  let newRail = RailNode $ r {traffic = traffic', isclear = false}
                  pure $ JSM.insert route.nodeid newRail rails
              ) rails trainset.route
          ) clearedRails layout.trains
  in Layout $ layout {rails = rails'}

newreserve :: Int -> IntReserve -> Layout -> Layout
newreserve reserver reserveid (Layout layout) =
  Layout $ layout {activeReserves = [{reserveid, reserver}] <> layout.activeReserves}

updateReserves :: Layout -> Layout
updateReserves (Layout layout) =
  Layout $ layout {activeReserves = catMaybes $ (\reserver -> find (\reserve -> reserve.reserver == reserver) layout.activeReserves) <$> ((unwrap >>> (_.trainid)) <$> layout.trains)}

layoutUpdate :: Layout -> Layout
layoutUpdate = updateTraffic >>> updateReserves >>> updateSignalIndication true

layoutUpdate_NoManualStop :: Layout -> Layout
layoutUpdate_NoManualStop = updateTraffic >>> updateReserves >>> updateSignalIndication false

-- reserveは無効化した
tryOpenRouteFor :: Layout -> IntNode -> IntJoint -> Int -> Int -> Maybe {layout :: Layout, reserveid :: IntReserve}
tryOpenRouteFor (Layout layout) nodeidHere jointidHere routeid reserver = do
  (RailNode riHere) <- getRailNode (Layout layout) nodeidHere
  (Signal sigHere) <- find (\(Signal s) -> s.jointid == jointidHere) riHere.signals
  (SignalRoute routeHere) <- sigHere.routes !! routeid
  let reserveidHere = IntReserve $ layout.updatecount + 1
  let programmedroute = reserver /= -1

  let go {nodeid, jointid} rs = -- 開通させる進路の先、シンプルな信号機がつづくかぎりたどる
        case getRailNode (Layout layout) nodeid >>= (\(RailNode ri) -> find (\(Signal s) -> s.jointid == jointid) ri.signals) of
          Nothing -> rs
          Just (Signal s) -> 
            case uncons s.routes of
              Nothing -> rs
              Just {head: (SignalRoute x), tail: xs} ->
                if length xs > 0 || not x.isSimple
                then rs
                else go (x.nextsignal) (rs <> x.rails)
  let target = go routeHere.nextsignal routeHere.rails -- 操作した信号機から次のシンプルでない信号機までの進路

  {traffic:_, newrails} <- foldM (\{traffic, newrails} {nodeid, jointenter, jointexit} -> do
    (RailNode ri) <- getRailNode (Layout layout) nodeid
    let traffic' = traffic || hasTraffic (Layout layout) (RailNode ri)
    newstate <- (unwrap ri.rail).getRoute ri.state jointenter jointexit
    newrails' <- updateRailNodeAt (RailNode $ ri {state = newstate, reserves = ri.reserves <> [{jointid : jointenter, reserveid: reserveidHere}]}) nodeid newrails
    if (newstate /= ri.state && traffic') || programmedroute && (sigHere.restraint || any (\{jointid, reserveid} -> jointenter /= jointid && ((unwrap ri.rail).isBlocked jointenter ri.state jointid || (unwrap ri.rail).isBlocked jointenter newstate jointid) && any (\a -> a.reserveid == reserveid) layout.activeReserves) ri.reserves)
    then Nothing
    else Just {traffic: traffic', newrails: newrails'}
  ) {traffic: false, newrails: if programmedroute then layout.rails else map (\(RailNode r) -> if r.nodeid == nodeidHere then RailNode $ r {signals = map (\(Signal s) -> if s.jointid == jointidHere then Signal $ s {manualStop = true} else (Signal s)) r.signals} else (RailNode r)) layout.rails } target

  pure $ {layout: (forceUpdate >>> layoutUpdate >>> newreserve reserver reserveidHere) (Layout $ layout {rails = newrails}), reserveid: reserveidHere}

tryOpenRouteFor_ffi ∷ Layout → IntNode → IntJoint → Int → { layout ∷ Layout , result ∷ Boolean }
tryOpenRouteFor_ffi (Layout layout) nodeid jointid routeid = maybe {layout : (Layout layout), result: false} (\l -> {layout: l.layout, result:true}) (tryOpenRouteFor (Layout layout) nodeid jointid routeid (-1))



addTrainset :: Layout -> IntNode -> IntJoint -> Array CarType -> Layout
addTrainset (Layout layout) nodeid jointid types =
    let go rs nid jid len = do
          rail <- getRailNode (Layout layout) nid
          let info = getRouteInfo rail jid
          let lenhere = sum $ shapeLength <$> info.shapes
          if lenhere < len
          then do
            cdata <- find (\c -> c.from == info.newjoint) $ (unwrap rail).connections
            go ([TrainRoute {
                        nodeid  : nid
                      , jointid : jid
                      , railinstance : rail
                      , shapes : info.shapes
                      , length : lenhere
                    }] <> rs)
              cdata.nodeid cdata.jointid (len - lenhere)
          else
            Just $ Trainset {
                  types : types
                , route      :
                    [TrainRoute {
                        nodeid  : nid
                      , jointid : jid
                      , railinstance : rail
                      , shapes : info.shapes
                      , length : lenhere
                    }] <> rs
                , distanceToNext : lenhere - len
                , distanceFromOldest : 0.0
                , speed : 0.0
                , trainid : layout.traincount
                , flipped : false
                , respectSignals : false
                , realAcceralation : false
                , notch : 0
                , signalRestriction : 0.0
                , note : ""
                , tags : []
                , signalRulePhase : signalRulePhase_unfired
              }
          
  in  fromMaybe (Layout layout) (do
        rail <- getRailNode (Layout layout) nodeid
        start <- find (\c -> c.from == jointid) $ (unwrap rail).connections
        newtrain <- go [] start.nodeid start.jointid ((toNumber $ length types) * (carLength + carMargin) - carMargin)
        Just $ Layout $ layout {traincount = layout.traincount + 1, trains = layout.trains <> [newtrain]}
      )





setRailColor :: Layout -> IntNode -> Array ColorOption -> Layout
setRailColor (Layout layout) nodeid coloroption = forceUpdate $
    Layout $ layout {
        rails = (fromMaybe layout.rails $ modifyRailNode (\(RailNode ri) -> recalcInstanceDrawInfo $ RailNode $ ri {color = coloroption}) nodeid layout.rails)
      }

addInvalidRoute :: Layout -> IntNode -> IntJoint -> Layout
addInvalidRoute (Layout layout) nodeid jointid = fromMaybe (Layout layout) $
  let signal = InvalidRoute {
            nodeid
          , jointid 
        }
  in  do
    (RailNode ri) <- getRailNode (Layout layout) nodeid
    if any (\(Signal s) -> s.jointid == jointid) ri.signals || any (\(InvalidRoute s) -> s.jointid == jointid) ri.invalidRoutes
    then Nothing
    else pure unit

    rails' <- modifyRailNode (\(RailNode ri') -> RailNode $ ri' {invalidRoutes = ri'.invalidRoutes <> [signal]}) nodeid layout.rails
    Just $ updateSignalRoutes $ Layout $ layout {updatecount = layout.updatecount + 1, rails = rails'}