module Internal.Layout.Operation where

import Prelude
import Data.Newtype
import Data.Maybe
import Data.Array
import Internal.Types
import Internal.Layout.Types
import Internal.Layout.Helper
import Internal.Layout.Signal
import Internal.Layout.DrawInfo
import Data.Int
import Data.Foldable (foldM, maximum, sum)
import Data.FoldableWithIndex (allWithIndex, findWithIndex)

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
              nodeid : IntNode $ length (layout.rails),
              instanceid : 0,
              state : (unwrap rail').defaultState,
              rail : rail',
              connections : [{from: from, nodeid: selectednode, jointid: selectedjoint}],
              signals : [],
              invalidRoutes : [],
              reserves : [],
              pos : poszero,
              drawinfos : [],
              note : "",
              color : []
            }
      addRail (Layout layout) node
    )

shiftIndex :: forall a. (Newtype a Int) => a -> a -> a
shiftIndex deleted i =
  if unwrap i < unwrap deleted
  then wrap $ unwrap i
  else wrap $ unwrap i - 1

shiftRailIndex_Node :: forall x. IntNode -> RailNode_ x -> RailNode_ x
shiftRailIndex_Node deleted (RailNode ri) =
  RailNode $ ri {
      nodeid = shiftIndex deleted ri.nodeid 
    , connections   = (\c -> c {nodeid = shiftIndex deleted c.nodeid}) <$> ri.connections
    , signals       = (\(Signal       s) -> Signal       $ s {nodeid = shiftIndex deleted s.nodeid}) <$> ri.signals
    , invalidRoutes = (\(InvalidRoute s) -> InvalidRoute $ s {nodeid = shiftIndex deleted s.nodeid}) <$> ri.invalidRoutes
  }

shiftRailIndex_Train :: forall x. IntNode -> Trainset_ x -> Trainset_ x
shiftRailIndex_Train deleted (Trainset t) = Trainset $ t {
    route = (\(TrainRoute r) -> TrainRoute $ r {nodeid = shiftIndex deleted r.nodeid}) <$> t.route
  }


removeRail :: Layout -> IntNode -> Layout
removeRail (Layout layout) nodeid = 
    let layout' = 
          case getRailNode (Layout layout) nodeid of
            Just (RailNode ri) -> unwrap $  foldl (\l j -> removeSignal l nodeid j) (Layout layout) (unwrap ri.rail).getJoints
            Nothing -> layout
    in  updateSignalRoutes $ Layout $ layout' {
          updatecount = layout'.updatecount + 1,
          rails = (\(RailNode ri) -> 
                    shiftRailIndex_Node nodeid $ 
                      RailNode $ ri {
                          connections = filter (\{nodeid:i} -> i /= nodeid) ri.connections
                        }
                    )<$> (fromMaybe layout'.rails $ deleteAt (unwrap nodeid) layout'.rails),
          jointData = (map $ map $ map $ filter (\(JointData d) -> d.nodeid /= nodeid) >>> map (\(JointData d) -> JointData $ d {nodeid = shiftIndex nodeid d.nodeid})) layout'.jointData,
          trains = shiftRailIndex_Train nodeid <$> layout'.trains
          -- TODO: shift signalrule queue
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
        let newnode = recalcInstanceDrawInfo $ RailNode $ node {
                connections =
                  node.connections
                  <> ((\{jointData:(JointData {pos: _, nodeid: nodeid, jointid: jointid}), jointid:j} 
                          -> {from: j, nodeid: nodeid, jointid: jointid}
                      ) <$> newconnections),
                instanceid = layout.instancecount,
                pos = pos
              }
            newrails =
              foldl (\rs {jointData:(JointData {pos: _, nodeid: nodeid, jointid: jointid}), jointid:j} ->
                  fromMaybe rs 
                    (modifyAt (unwrap nodeid) (\(RailNode n) ->
                      RailNode $ n {connections = n.connections <> [{from : jointid, nodeid : node.nodeid, jointid :j}]}
                    ) rs
                  )
                ) layout.rails connections
              <> [newnode]
        in Just $ updateSignalRoutes $ 
                  (\l -> foldl (\l' {jointid: j, pos: p} -> addJoint l' p node.nodeid j) l joints)
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
  foldl (\l (RailNode r) -> fromMaybe l $ addRailWithPos l (RailNode (r {connections = []})) r.pos) (Layout (layout { rails = [], jointData = saEmpty})) (layout.rails)

removeSignal :: Layout -> IntNode -> IntJoint -> Layout
removeSignal (Layout layout) nodeid jointid = 
  updateSignalRoutes $ Layout $ layout {
    updatecount = layout.updatecount + 1, 
    rails = fromMaybe layout.rails $ modifyAt (unwrap nodeid) (\(RailNode ri) -> RailNode $ ri {signals = filter (\(Signal s) -> s.jointid /= jointid) ri.signals, invalidRoutes = filter (\(InvalidRoute s) -> s.jointid /= jointid) ri.invalidRoutes}) layout.rails
  }



setManualStop :: Layout -> IntNode -> IntJoint -> Boolean -> Layout
setManualStop (Layout layout) nodeid jointid stop = fromMaybe (Layout layout) do
  (RailNode ri) <- getRailNode (Layout layout) nodeid
  {index : i, value: (Signal signal)} <- findWithIndex (\_ (Signal s) -> s.jointid == jointid) ri.signals
  newSignals <- updateAt i (Signal $ signal {manualStop = stop}) ri.signals
  let newRail = RailNode $ ri {signals = newSignals}
  newRails <- updateAt (unwrap nodeid) newRail layout.rails
  pure $ Layout $ layout {rails = newRails}


updateRailNode :: RailNode -> IntJoint -> {instance :: RailNode, newjoint :: IntJoint, shapes :: Array (RailShape Pos)}
updateRailNode (RailNode ri) j =
  let {newjoint, newstate, shape} = (unwrap ri.rail).getNewState j (ri.state)
  in  {instance : RailNode $ ri {state = newstate, reserves = filter (\x -> x.jointid /= j) ri.reserves}, newjoint, shapes : (absShape ri.pos) <$> shape}


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

    rails' <- modifyAt (unwrap nodeid) (\(RailNode ri') -> RailNode $ ri' {signals = ri'.signals <> [signal]}) layout.rails
    Just $ updateSignalRoutes $ Layout $ layout {updatecount = layout.updatecount + 1, rails = rails'}

updateTraffic :: Layout -> Layout
updateTraffic (Layout layout) =
  let {traffic, isclear} = 
        foldl (\{traffic, isclear} (Trainset trainset) ->
            foldl (\{traffic, isclear} (TrainRoute route) ->
                {
                  traffic: fromMaybe traffic $ modifyAt (unwrap route.nodeid) (\d -> fromMaybe d $ modifyAt (unwrap route.jointid) (_ <> [trainset.trainid]) d) traffic
                , isclear: fromMaybe isclear $ modifyAt (unwrap route.nodeid) (\_ -> false) isclear
                }
              ) {traffic, isclear} trainset.route
          ) ({traffic: map (\(RailNode r) ->  replicate (length (unwrap r.rail).getJoints) []) layout.rails, isclear: replicate (length layout.rails) true}) layout.trains
  in Layout $ layout {traffic = traffic, isclear = isclear}

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
    newrails' <- updateAt (unwrap nodeid) (RailNode $ ri {state = newstate, reserves = ri.reserves <> [{jointid : jointenter, reserveid: reserveidHere}]}) newrails
    if (newstate /= ri.state && traffic') || programmedroute && (sigHere.restraint || any (\{jointid, reserveid} -> jointenter /= jointid && ((unwrap ri.rail).isBlocked jointenter ri.state jointid || (unwrap ri.rail).isBlocked jointenter newstate jointid) && any (\a -> a.reserveid == reserveid) layout.activeReserves) ri.reserves)
    then Nothing
    else Just {traffic: traffic', newrails: newrails'}
  ) {traffic: false, newrails: if programmedroute then layout.rails else map (\(RailNode r) -> if r.nodeid == nodeidHere then RailNode $ r {signals = map (\(Signal s) -> if s.jointid == jointidHere then Signal $ s {manualStop = true} else (Signal s)) r.signals} else (RailNode r)) layout.rails } target

  pure $ {layout: (forceUpdate >>> layoutUpdate >>> newreserve reserver reserveidHere) (Layout $ layout {rails = newrails}), reserveid: reserveidHere}

tryOpenRouteFor_ffi ∷ Layout → IntNode → IntJoint → Int → { layout ∷ Layout , result ∷ Boolean }
tryOpenRouteFor_ffi (Layout layout) nodeid jointid routeid = maybe {layout : (Layout layout), result: false} (\l -> {layout: l.layout, result:true}) (tryOpenRouteFor (Layout layout) nodeid jointid routeid (-1))



addTrainset :: Layout -> Int -> IntJoint -> Array CarType -> Layout
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
        rail <- layout.rails !! nodeid
        start <- find (\c -> c.from == jointid) $ (unwrap rail).connections
        newtrain <- go [] start.nodeid start.jointid ((toNumber $ length types) * (carLength + carMargin) - carMargin)
        Just $ Layout $ layout {traincount = layout.traincount + 1, trains = layout.trains <> [newtrain]}
      )





setRailColor :: Layout -> IntNode -> Array ColorOption -> Layout
setRailColor (Layout layout) nodeid coloroption = forceUpdate $
    Layout $ layout {
        rails = (fromMaybe layout.rails $ modifyAt (unwrap nodeid) (\(RailNode ri) -> recalcInstanceDrawInfo $ RailNode $ ri {color = coloroption}) layout.rails)
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

    rails' <- modifyAt (unwrap nodeid) (\(RailNode ri') -> RailNode $ ri' {invalidRoutes = ri'.invalidRoutes <> [signal]}) layout.rails
    Just $ updateSignalRoutes $ Layout $ layout {updatecount = layout.updatecount + 1, rails = rails'}