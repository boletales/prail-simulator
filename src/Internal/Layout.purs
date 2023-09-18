module Internal.Layout
  ( CarType(..)
  , IntNode(..)
  , IntReserve(..)
  , InvalidRoute(..)
  , JointData(..)
  , Layout(..)
  , RailNode
  , RailNode_(..)
  , RouteQueueElement(..)
  , SectionArray(..)
  , Signal(..)
  , SignalColor(..)
  , SignalRoute(..)
  , SignalRule(..)
  , SignalRulePhase(..)
  , Traffic
  , TrainRoute
  , TrainRoute_(..)
  , TrainTag(..)
  , TrainTagPattern(..)
  , Trainset
  , TrainsetDrawInfo(..)
  , Trainset_(..)
  , addInvalidRoute
  , addJoint
  , addRail
  , addSignal
  , addTrainset
  , autoAdd
  , brakePattern
  , digestIndication
  , fixBrokenConnections
  , flipTrain
  , forceUpdate
  , getJointAbsPos
  , getJoints
  , getMarginFromBrakePattern
  , getMaxNotch
  , getNewRailPos
  , getNextSignal
  , layoutDrawInfo
  , layoutTick
  , layoutUpdate
  , layoutUpdate_NoManualStop
  , recalcInstanceDrawInfo
  , removeRail
  , removeSignal
  , saEmpty
  , signalRulePhase_fired
  , signalRulePhase_stoppedFired
  , signalRulePhase_unfired
  , speedScale
  , trainsetDrawInfo
  , trainsetLength
  , tryOpenRouteFor
  , tryOpenRouteFor_ffi
  , updateSignalIndication
  , updateSignalRoutes
  , updateTraffic
  )
  where

import Data.Array
import Data.Either
import Data.Int
import Data.Maybe
import Data.Newtype
import Data.String.Regex
import Internal.Types
import Prelude

import Data.Foldable (foldM, maximum, sum)
import Data.FoldableWithIndex (allWithIndex, findWithIndex)
import Data.Function (on)
import Data.Number (infinity)
import Data.String.Regex as Re
import Data.String.Regex.Flags as Re
import Data.String.Regex.Unsafe as Re
import Internal.Types.Rail (brokenDrawInfo)

newtype SectionArray a = SectionArray {
    arraydata :: Array a,
    head :: Int,
    end :: Int
  }

instance Functor SectionArray where
  map f (SectionArray sa) = SectionArray {
    arraydata : f <$> sa.arraydata,
    head : sa.head,
    end : sa.end
  }

saEmpty ∷ ∀ (t115 ∷ Type). SectionArray t115
saEmpty = SectionArray {
    arraydata : [],
    head : 0,
    end : 0
  }

saIndex ∷ ∀ (t109 ∷ Type). Int → SectionArray t109 → Maybe t109
saIndex i (SectionArray sa) = sa.arraydata !! (i - sa.head)

saModifyAt :: forall a. Int -> a -> (Maybe a -> a) -> SectionArray a -> SectionArray a
saModifyAt i d f (SectionArray sa) = 
  if i < sa.head
    then SectionArray {
            arraydata : [f Nothing] <> replicate (sa.head - i - 1) d <> sa.arraydata,
            head : i,
            end : sa.end
          }
  else if sa.end <= i 
    then SectionArray {
            arraydata : sa.arraydata <> replicate (i - sa.end) d <> [f Nothing] ,
            head : sa.head,
            end : i+1
          }
    else SectionArray {
            arraydata : fromMaybe (sa.arraydata) (modifyAt (i - sa.head) (Just >>> f) sa.arraydata)  ,
            head : sa.head,
            end : sa.end
          }

newtype IntReserve = IntReserve Int
derive instance Eq IntReserve 

type RailNode = RailNode_ Rail
newtype RailNode_ x = RailNode {
    nodeid :: IntNode,
    instanceid :: Int,
    rail :: x,
    state :: IntState,
    signals :: Array (Signal),
    invalidRoutes :: Array (InvalidRoute),
    connections :: Array ({from :: IntJoint, nodeid :: IntNode, jointid :: IntJoint}),
    reserves :: Array ({reserveid :: IntReserve, jointid :: IntJoint}),
    pos  :: Pos,
    note :: String,
    drawinfos :: Array (DrawInfo Pos)
  }
derive instance Newtype (RailNode_ x) _

newtype IntNode = IntNode Int
instance Show IntNode where
  show = unwrap >>> show
derive instance Ord IntNode
derive instance Eq IntNode
derive instance Newtype IntNode _

updateRailNode :: forall j s. RailNode -> IntJoint -> {instance :: RailNode, newjoint :: IntJoint, shapes :: Array (RailShape Pos)}
updateRailNode (RailNode ri) j =
  let {newjoint, newstate, shape} = (unwrap ri.rail).getNewState j (ri.state)
  in  {instance : RailNode $ ri {state = newstate, reserves = filter (\x -> x.jointid /= j) ri.reserves}, newjoint, shapes : (absShape ri.pos) <$> shape}

getRouteInfo :: forall j s. RailNode -> IntJoint -> {newjoint :: IntJoint, shapes :: Array (RailShape Pos)}
getRouteInfo (RailNode ri) j =
  let {newjoint, newstate, shape} = (unwrap ri.rail).getNewState j (ri.state)
  in  {newjoint, shapes : (absShape ri.pos) <$> shape}

getNextJoint :: forall j s. RailNode -> IntJoint -> IntJoint
getNextJoint (RailNode ri) j =
  let {newjoint, newstate, shape} = (unwrap ri.rail).getNewState j (ri.state)
  in  newjoint

newtype JointData = JointData {pos :: Pos, nodeid :: IntNode, jointid :: IntJoint}

newtype Layout = Layout {
    version :: Int,
    rails :: Array RailNode,
    trains :: Array Trainset,
    signalcolors :: Array (Array (Array SignalColor)),
    traffic :: Traffic,
    isclear :: Array Boolean,
    instancecount :: Int,
    traincount :: Int,
    updatecount :: Int,
    jointData :: SectionArray (SectionArray (SectionArray (Array JointData))),
    routequeue :: Array RouteQueueElement,
    time :: Number,
    speed :: Number,
    activeReserves :: Array ({reserveid :: IntReserve, reserver :: Int})
  }
derive instance Newtype Layout _

instanceDrawInfo :: RailNode -> DrawInfo Pos
instanceDrawInfo (RailNode node) =
  fromMaybe brokenDrawInfo $ node.drawinfos !! (unwrap node.state)

instanceDrawInfos :: RailNode -> Array (DrawInfo Pos)
instanceDrawInfos (RailNode node) =
  absDrawInfo node.pos <$> (unwrap node.rail).getDrawInfo <$> (unwrap node.rail).getStates

recalcInstanceDrawInfo :: RailNode -> RailNode
recalcInstanceDrawInfo (RailNode node) =
  RailNode $ node {drawinfos = instanceDrawInfos (RailNode node)}


carLength = 10.0 / 21.4
carMargin = 1.0 / 21.4
trainsetLength (Trainset t) = (toNumber $ length t.types) * (carLength + carMargin) - carMargin
wheelWidth = 3.4 / 21.4
wheelMargin = 2.0 / 21.4


newtype TrainsetDrawInfo = TrainsetDrawInfo ({
      trainid :: Int
    , tags :: Array TrainTag
    , cars :: Array {head :: {r :: Pos, l :: Pos, m :: Pos}, tail :: {r :: Pos, l :: Pos, m :: Pos}, type :: CarType}
    , flipped :: Boolean
    , note :: String
  })
trainsetDrawInfo :: Trainset -> TrainsetDrawInfo
trainsetDrawInfo (Trainset t) =
  let {-
      getpos d w =
        fromLeft poszero 
          $ foldM (\d' (RailShape s) ->
                if s.length < d'
                  then Right (d' - s.length)
                  else Left (getDividingPoint_rel s.start s.end w (1.0 - d' / s.length))
              ) d ((\(Route r) -> reverse r.shapes) =<< t.route)
      -}
      shapes = ((\(TrainRoute r) -> reverse r.shapes) =<< t.route)

      getpos' w d' i =
        case shapes !! i of
          Just (RailShape s) ->
            if s.length < d'
              then getpos' w (d' - s.length) (i + 1)
              else getDividingPoint_rel s.start s.end w (1.0 - d' / s.length)
          Nothing -> poszero

      getpos d w = getpos' w d 0

      -- headpos = (fromMaybe 0.0 (((flip bind) (unwrap >>> _.shapes) >>> head >>> map (unwrap >>> _.length)) t.route)) - 
  in  TrainsetDrawInfo $ {tags: t.tags, note : t.note, flipped : t.flipped, trainid : t.trainid, cars: mapWithIndex (\i ct -> 
          let d = ((toNumber i) * (carLength + carMargin)) + t.distanceToNext
              dh = d + wheelMargin
              dt = d + carLength - wheelMargin
          in {type : ct, head : {r : getpos dh (-wheelWidth/2.0), l : getpos dh ( wheelWidth/2.0), m : getpos dh 0.0}, tail : {r : getpos dt (-wheelWidth/2.0), l : getpos dt ( wheelWidth/2.0), m : getpos dt 0.0}}
        ) t.types}

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

layoutDrawInfo :: Layout -> {
      rails :: Array {rails :: Array (DrawRail Pos), additionals :: Array (DrawAdditional Pos), joints :: Array Pos, instance :: RailNode}
    , signals :: Array (Array {indication :: Array Int, pos :: Pos, signal :: Signal})
    , invalidRoutes :: Array (Array {pos :: Pos, signal :: InvalidRoute})
    , trains ::  Array TrainsetDrawInfo
  }
layoutDrawInfo (Layout layout) =
  {
      rails : (\r -> let (DrawInfo ide) = instanceDrawInfo r 
         in  {
                rails: ide.rails
              , additionals: ide.additionals
              , joints: getRailJointAbsPos r <$> (unwrap (unwrap r).rail).getJoints
              , instance : r
             }) <$> layout.rails
      , signals : (\(RailNode ri) -> map (\(Signal s) -> {
          indication : s.indication,
          pos    : fromMaybe poszero $ getJointAbsPos (Layout layout) s.nodeid s.jointid,
          signal : (Signal s)
        }) ri.signals) <$> layout.rails
      , invalidRoutes : (\(RailNode ri) -> map (\(InvalidRoute s) -> {
          pos    : fromMaybe poszero $ getJointAbsPos (Layout layout) s.nodeid s.jointid,
          signal : (InvalidRoute s)
        }) ri.invalidRoutes) <$> layout.rails
      , trains : trainsetDrawInfo <$> layout.trains
  }

indexMaybe ∷ ∀ (t192 ∷ Type). Array (Maybe t192) → Int → Maybe t192
indexMaybe a = index a >>> join
infixl 8 indexMaybe as !!?


getRailJointAbsPos :: RailNode -> IntJoint -> Pos
getRailJointAbsPos (RailNode ri) jointid =
  toAbsPos (ri.pos) ((unwrap ri.rail).getJointPos jointid)

getJointAbsPos :: Layout -> IntNode -> IntJoint -> Maybe Pos
getJointAbsPos (Layout layout) nodeid jointid =
  (\r -> getRailJointAbsPos r jointid) <$> (getRailNode (Layout layout) nodeid)

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

getJoints :: Layout -> Pos -> Array JointData
getJoints (Layout layout) joint = 
  let coord = (unwrap (unwrap joint).coord)
      range = 0.1
      getrange r = 
        let i = round r
        in if round (r - range) < i
            then [i-1, i]
            else if i < round (r + range) 
              then [i, i+1]
              else [i]
      rx = getrange coord.x
      ry = getrange coord.y
      rz = getrange coord.z
  in join $ ((\x y z -> fromMaybe [] $ (saIndex z >=> saIndex x >=> saIndex y) layout.jointData)) <$> rx <*> ry <*> rz

getNewRailPos :: Layout -> RailNode -> Maybe Pos
getNewRailPos (Layout layout) (RailNode node) = 
  let origin = (unwrap node.rail).getJointPos (unwrap node.rail).getOrigin
      jrel i = (unwrap node.rail).getJointPos i
      conv i = convertRelPos ((unwrap node.rail).getJointPos i) origin
  in  join $ foldM (\mposofzero {from : i, nodeid : nodeid, jointid : jointid} -> 
          case mposofzero of
            Nothing -> Just (
                toAbsPos <$> (reversePos <$> getJointAbsPos (Layout layout) nodeid jointid) <*> (pure $ conv i)
              )
            Just pos ->
              if fromMaybe false $ canJoin (toAbsPos pos (jrel i)) <$> (getJointAbsPos (Layout layout) nodeid jointid)
              then Just mposofzero
              else Nothing
        ) (Nothing) node.connections


forceUpdate :: Layout -> Layout
forceUpdate (Layout layout)= 
  Layout $ layout{
            updatecount = layout.updatecount + 1
    }

getRailNode :: Layout -> IntNode -> Maybe RailNode
getRailNode (Layout l) (IntNode i) = l.rails !! i

getRailTraffic (Layout l) (IntNode i) = l.traffic !! i
isRailClear (Layout l) (IntNode i) = l.isclear !! i

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
        foldl (&&) true $ map (\{jointData:(JointData {pos: _, nodeid: nodeid, jointid: jointid}), jointid:j} ->
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

fixBrokenConnections :: Layout -> Layout
fixBrokenConnections (Layout layout) =
  foldl (\l (RailNode r) -> fromMaybe l $ addRailWithPos l (RailNode (r {connections = []})) r.pos) (Layout (layout { rails = [], jointData = saEmpty})) (layout.rails)

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
              note : ""
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


type TrainRoute = TrainRoute_ RailNode
newtype TrainRoute_ x = TrainRoute {
      nodeid :: IntNode
    , jointid :: IntJoint
    , railinstance :: x
    , shapes :: Array (RailShape Pos)
    , length :: Number
  }
derive instance Newtype (TrainRoute_ x) _


newtype CarType = CarType {
      type :: String
    , flipped :: Boolean
  }
derive instance Newtype CarType _

newtype SignalRulePhase = SignalRulePhase Int
derive instance Eq SignalRulePhase
derive instance Newtype SignalRulePhase _

signalRulePhase_unfired      = SignalRulePhase 0
signalRulePhase_fired        = SignalRulePhase 1
signalRulePhase_stoppedFired = SignalRulePhase 3

newtype TrainTag = TrainTag String
derive instance Eq TrainTag
derive instance Newtype TrainTag _

type Trainset = Trainset_ RailNode
newtype Trainset_ x = Trainset {
      types :: Array CarType
    , route      :: Array (TrainRoute_ x)
    , distanceToNext :: Number
    , distanceFromOldest :: Number
    , speed :: Number
    , trainid :: Int
    , flipped :: Boolean
    , signalRestriction :: Number
    , respectSignals :: Boolean
    , realAcceralation :: Boolean
    , notch :: Int
    , note :: String
    , tags :: Array TrainTag
    , signalRulePhase :: SignalRulePhase
  }
derive instance Newtype (Trainset_ x) _

moveTrains :: Number -> Layout -> Layout
moveTrains dt (Layout layout) =
  foldl (\l t ->
      let {newlayout, newtrainset} = trainTick l t dt
      in Layout $ (unwrap newlayout) {trains = (unwrap newlayout).trains <> [newtrainset]}
    ) (Layout $ layout {trains = []}) (layout.trains)

flipTrain :: Trainset -> Trainset
flipTrain (Trainset t0) = Trainset $ t0 {
    --  types = reverse $ (\(CarType t) -> CarType $ t {flipped = not t.flipped}) <$> t0.types
      route = reverse $ (\(TrainRoute r) -> TrainRoute $ r {jointid = getNextJoint r.railinstance r.jointid, shapes = reverseShapes r.shapes}) <$> t0.route 
    , distanceToNext     = t0.distanceFromOldest
    , distanceFromOldest = t0.distanceToNext
    , flipped = not t0.flipped
  }

speedScale ∷ Number
speedScale = 3.0 / 120.0

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

      reverseOn = false

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

getMaxNotch_ :: forall x. { distance ∷ Number , sections ∷ Int , signal ∷ Maybe Signal } -> Trainset_ x -> Int
getMaxNotch_ nextsignal (Trainset t2) =
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
  in  getMaxNotch_ nextsignal (Trainset t0)

getMarginFromBrakePattern :: Layout -> Trainset -> Number
getMarginFromBrakePattern (Layout layout) (Trainset t0) =
  let nextsignal = getNextSignal (Layout layout) (Trainset t0)
  in  nextsignal.distance - brakePatternDist t0.speed nextsignal t0.tags

addRouteQueue :: Layout -> IntNode -> IntJoint -> Int -> Int -> Layout
addRouteQueue l n j r t = Layout $ (unwrap l) {routequeue = (unwrap l).routequeue <> [RouteQueueElement {jointid: j, nodeid: n, routeid: r, time: (unwrap l).time, retryafter: (unwrap l).time, trainid: t}]}

indicationToSpeed ∷ Int → Number
indicationToSpeed i =
  case i of
    0 ->   0.0 * speedScale
    1 ->  25.0 * speedScale
    2 ->  45.0 * speedScale
    3 ->  65.0 * speedScale
    4 -> 100.0 * speedScale
    _ -> 100.0 * speedScale

signalToSpeed :: Signal -> Number 
signalToSpeed = digestIndication >>> indicationToSpeed

digestIndication :: Signal -> Int
digestIndication signal = if (unwrap signal).manualStop || (unwrap signal).restraint then signalStop else fromMaybe signalStop $ maximum ((unwrap signal).indication)

brakePatternCheck :: Number -> {signal :: Maybe Signal, sections :: Int, distance :: Number} -> Array TrainTag -> Boolean
brakePatternCheck speed signaldata tags =
  signaldata.distance < brakePatternDist speed signaldata tags

brakePatternDist :: Number -> {signal :: Maybe Signal, sections :: Int, distance :: Number} -> Array TrainTag -> Number
brakePatternDist speed signaldata tags =
  let restriction = maybe 15.0 (getRestriction tags) signaldata.signal
  in  if speed < restriction then -infinity
      else brakePattern speed restriction
brakePattern ∷ Number → Number → Number
brakePattern speed finalspeed = 
  let a = basedccr
      t = (speed - finalspeed) / a
  in 0.2 + max 0.0 (finalspeed * t + 0.5 * a * t * t)

acceralate :: Trainset -> Int -> Number -> Trainset
acceralate (Trainset t0) notch dt = Trainset $ t0 {
    speed = max 0.0 $ t0.speed + dt * calcAcceralation notch t0.speed
  }

baseaccr = 0.4
basedccr = 0.6

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
                let newinstance = (\(RailNode rn) -> RailNode $ rn {reserves = filter (\r -> r.jointid /= cdata.jointid) rn.reserves}) $ updatedroute.instance
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
                            rails = fromMaybe layout.rails $ updateAt (unwrap cdata.nodeid) newinstance layout.rails
                          }
                        else 
                          Layout $ layout {
                              updatecount = layout.updatecount + 1
                            , rails = fromMaybe layout.rails $ updateAt (unwrap cdata.nodeid) newinstance layout.rails
                          }
                , newtrainset : t3}
              ) of
            Just x -> x
            Nothing -> 
              if t2.distanceToNext == 0.0 then {newlayout : Layout layout, newtrainset : Trainset t0} else movefoward (Layout layout) (Trainset t0) (t0.distanceToNext / t0.speed * 0.9)

getNextSignal :: Layout -> Trainset -> {signal :: Maybe Signal, sections :: Int, distance :: Number}
getNextSignal (Layout layout) (Trainset trainset) =
  case head trainset.route of
    Nothing -> {signal: Nothing, sections: 0, distance: 0.0}
    Just (TrainRoute {nodeid, jointid}) ->
      let go nid jid sectionsold distanceold isfirst =
            if sectionsold > searchmax then {signal: Nothing, sections: sectionsold, distance: distanceold} else
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
                              Just {nodeid, jointid} -> 
                                go nodeid jointid sections distance false
                          Just s  -> {signal: Just s, sections, distance}
                      Just s  -> {signal: Nothing, sections, distance}
      in go nodeid jointid 0 trainset.distanceToNext true


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

type TrainTagPattern = Regex

data SignalRule = 
    RuleComment                                              String
  | RuleComplex                                              String
  | RuleSpeed         TrainTagPattern Int                    String
  | RuleOpen          TrainTagPattern Int                    String
  | RuleUpdate        TrainTagPattern TrainTagPattern String String
  | RuleStop          TrainTagPattern                        String
  | RuleStopOpen      TrainTagPattern Int                    String
  | RuleStopUpdate    TrainTagPattern TrainTagPattern String String
  | RuleReverse       TrainTagPattern                        String
  | RuleReverseUpdate TrainTagPattern TrainTagPattern String String

isComplex :: SignalRule -> Boolean
isComplex (RuleComplex _) = true
isComplex _               = false

getTag ∷ SignalRule → TrainTagPattern
getTag rule = 
  case rule of
    RuleComment               _ -> Re.unsafeRegex "(?!.*)" Re.noFlags
    RuleComplex               _ -> Re.unsafeRegex "(?!.*)" Re.noFlags
    RuleSpeed         tag _   _ -> tag
    RuleOpen          tag _   _ -> tag
    RuleUpdate        tag _ _ _ -> tag
    RuleStop          tag     _ -> tag
    RuleStopOpen      tag _   _ -> tag
    RuleStopUpdate    tag _ _ _ -> tag
    RuleReverse       tag     _ -> tag
    RuleReverseUpdate tag _ _ _ -> tag

{-
matchSignalRuleStop :: forall x. Trainset_ x -> SignalRule -> Boolean
matchSignalRuleStop train rule =
  case rule of
    RuleOpen       tag _   -> false
    RuleUpdate     tag _ _ -> false
    RuleStop       tag     -> (unwrap train).signalRulePhase == signalRulePhase_unfired
    RuleStopOpen   tag _   -> (unwrap train).signalRulePhase == signalRulePhase_unfired
    RuleStopUpdate tag _ _ -> (unwrap train).signalRulePhase == signalRulePhase_unfired
    RuleReverse    tag     -> (unwrap train).signalRulePhase == signalRulePhase_unfired

matchSignalRule :: forall x. Trainset_ x -> SignalRule -> Boolean
matchSignalRule train rule =
  case rule of
    RuleOpen       tag _   -> (unwrap train).signalRulePhase == signalRulePhase_unfired
    RuleUpdate     tag _ _ -> (unwrap train).signalRulePhase == signalRulePhase_unfired
    RuleStop       tag     -> false
    RuleStopOpen   tag _   -> (unwrap train).signalRulePhase == signalRulePhase_stopped && (unwrap train).speed == 0.0
    RuleStopUpdate tag _ _ -> (unwrap train).signalRulePhase == signalRulePhase_stopped && (unwrap train).speed == 0.0
    RuleReverse    tag     -> (unwrap train).signalRulePhase == signalRulePhase_stopped && (unwrap train).speed == 0.0
-}

newtype RouteQueueElement = RouteQueueElement {
      time       :: Number
    , retryafter :: Number
    , nodeid     :: IntNode
    , jointid    :: IntJoint
    , routeid    :: Int
    , trainid    :: Int
  }

newtype SignalRoute = SignalRoute {
      rails :: Array {nodeid :: IntNode, jointenter :: IntJoint, jointexit :: IntJoint}
    , length :: Number
    , nextsignal :: {nodeid :: IntNode, jointid :: IntJoint}
    , isSimple :: Boolean
  }
derive instance Newtype SignalRoute _

newtype Signal = Signal {
      signalname :: String
    , nodeid :: IntNode
    , jointid :: IntJoint
    , routes :: Array SignalRoute
    , routecond :: Array Boolean
    , colors :: Array SignalColor
    , indication :: Array SignalColor
    , manualStop :: Boolean
    , restraint  :: Boolean
    , rules      :: Array SignalRule
  }
derive instance Newtype Signal _

newtype InvalidRoute = InvalidRoute {
      nodeid :: IntNode
    , jointid :: IntJoint
  }
derive instance Newtype InvalidRoute _

type Traffic = Array (Array (Array Int))

type SignalColor = Int
{-
    Stop
  | Alart
  | Caution
  | Reduce
  | Clear
-}

signalStop = 0
signalAlart = 1
signalCaution = 2
signalReduce = 3
signalClear = 4
-- derive instance IntSerialize SignalColor

updateTraffic :: Layout -> Layout
updateTraffic (Layout layout) =
  let {traffic, isclear} = 
        foldl (\{traffic, isclear} (Trainset trainset) ->
            foldl (\{traffic, isclear} (TrainRoute route) ->
                {
                  traffic: fromMaybe traffic $ modifyAt (unwrap route.nodeid) (\d -> fromMaybe d $ modifyAt (unwrap route.jointid) (_ <> [trainset.trainid]) d) traffic
                , isclear: fromMaybe isclear $ modifyAt (unwrap route.nodeid) (\d -> false) isclear
                }
              ) {traffic, isclear} trainset.route
          ) ({traffic: map (\(RailNode r) ->  replicate (length (unwrap r.rail).getJoints) []) layout.rails, isclear: replicate (length layout.rails) true}) layout.trains
  in Layout $ layout {traffic = traffic, isclear = isclear}

updateSignalIndication :: Boolean -> Layout -> Layout
updateSignalIndication changeManualStop (Layout layout) = 
  let signals = (unwrap >>> (_.signals)) =<< layout.rails
      blockingData = 
        map (\(RailNode ri) -> {rail :ri, signals :map (\(Signal signal) ->{
            signal : (Signal signal),
            routes : map (\(SignalRoute route) ->
                      let routecond = all (\{nodeid, jointenter, jointexit} ->  -- 進路が開通している
                                    case (getRailNode (Layout layout) nodeid) of
                                      Just (RailNode ri) ->
                                        let rail = (unwrap ri.rail)
                                            state = (ri.state)
                                            nr = rail.getNewState jointenter state
                                        in  nr.newjoint == jointexit && rail.isLegal jointenter state
                                      Nothing -> false

                                  ) route.rails

                          clearcond = all (\{nodeid, jointenter, jointexit} -> --進路内に他の列車がいない
                              if isRailClear (Layout layout) nodeid== Just true
                              then true
                              else case getRailTraffic (Layout layout) nodeid of
                                      Just ts ->
                                        maybe false (\(RailNode ri) ->
                                                let rail = (unwrap ri.rail)
                                                    state = (ri.state)
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
                                      Just {nodeid, jointenter, jointexit} ->
                                        let go nid jid cnt =
                                              if cnt > searchmax*4 then true
                                              else case getRailNode (Layout layout) nid of
                                                Nothing -> false -- 該当する線路がなかったら（こんなことにはならないと思うが）赤
                                                Just ri ->
                                                  if (unwrap (unwrap ri).rail).isSimple
                                                  then
                                                    let jidexit = getNextJoint ri jid
                                                    in  if isRailClear (Layout layout) nid == Just true
                                                        then      case find (\c -> c.from == jidexit) $ (unwrap ri).connections of
                                                                    Nothing -> true -- 線路がここで終わっていたら探索終了
                                                                    Just {nodeid, jointid} -> go nodeid jointid (cnt + 1)
                                                        else  case length <$> ((_ !! (unwrap jidexit)) =<< (getRailTraffic (Layout layout) nid)) of
                                                                Just 0  -> 
                                                                  case find (\c -> c.from == jidexit) $ (unwrap ri).connections of
                                                                    Nothing -> true -- 線路がここで終わっていたら探索終了
                                                                    Just {nodeid, jointid} -> go nodeid jointid (cnt + 1)
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
                            case (filtered !! (unwrap nodeid)) >>= (find (\bd -> (unwrap bd.signal).jointid == jointid)) of
                              Just bd' ->
                                case head bd'.routes of
                                  Just d ->
                                    if d.cond && ((not d.manualStop && not d.restraint) || len == 0.0)
                                    then go (len + (unwrap d.route).length) ((unwrap d.route).nextsignal)
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

searchmax :: Int
searchmax = 30
updateSignalRoutes :: Layout -> Layout
updateSignalRoutes (Layout layout) = 
  Layout $ layout {
    rails = 
      map (\(RailNode ri) -> RailNode $ ri {signals = map (\(Signal signal) -> 
              Signal $ signal {
                routes =
                  let go {nid, jid, rails, rids, isSimple, len} =
                        if length rails > searchmax then [] else
                          case getRailNode (Layout layout) nid of
                            Nothing -> []
                            Just (RailNode ri') ->
                              let newstates = (if (unwrap ri'.rail).flipped then reverse else identity) $ nubBy (compare `on` (_.newjoint)) $ ((unwrap ri'.rail).getNewState jid) <$> (unwrap ri'.rail).getStates
                              in  (\{newjoint : jid', shape : s} ->
                                case find (\(InvalidRoute s) -> s.jointid == jid') ri'.invalidRoutes of
                                  Nothing -> 
                                    let newrails = rails <> [{nodeid : nid, jointenter : jid, jointexit : jid'}]
                                        newlen = len + sum (((_.length) <<< unwrap) <$> s)
                                    in  case find (\(Signal s) -> s.jointid == jid') ri'.signals of
                                          Nothing -> 
                                            case find (\c -> c.from == jid') $ ri'.connections of
                                              Nothing -> []
                                              Just {nodeid, jointid} -> 
                                                if elem nodeid rids then []
                                                else go {nid: nodeid, jid: jointid, rails: newrails, rids: (insert nodeid rids), isSimple: (isSimple && (unwrap ri'.rail).isSimple), len: newlen}
                                          Just s  -> [SignalRoute {nextsignal : {nodeid : nid, jointid : jid'}, rails : newrails, isSimple, length : newlen}]
                                  Just s  -> []
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

    rails' <- modifyAt (unwrap nodeid) (\(RailNode ri) -> RailNode $ ri {invalidRoutes = ri.invalidRoutes <> [signal]}) layout.rails
    Just $ updateSignalRoutes $ Layout $ layout {updatecount = layout.updatecount + 1, rails = rails'}

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

    rails' <- modifyAt (unwrap nodeid) (\(RailNode ri) -> RailNode $ ri {signals = ri.signals <> [signal]}) layout.rails
    Just $ updateSignalRoutes $ Layout $ layout {updatecount = layout.updatecount + 1, rails = rails'}


removeSignal :: Layout -> IntNode -> IntJoint -> Layout
removeSignal (Layout layout) nodeid jointid = 
  updateSignalRoutes $ Layout $ layout {
    updatecount = layout.updatecount + 1, 
    rails = fromMaybe layout.rails $ modifyAt (unwrap nodeid) (\(RailNode ri) -> RailNode $ ri {signals = filter (\(Signal s) -> s.jointid /= jointid) ri.signals, invalidRoutes = filter (\(InvalidRoute s) -> s.jointid /= jointid) ri.invalidRoutes}) layout.rails
  }

hasTraffic :: Layout -> RailNode -> Boolean
hasTraffic (Layout layout) (RailNode ri) =
  if maybe false (any (\t -> length t > 0)) (getRailTraffic (Layout layout) ri.nodeid) then true
  else let go nid jid depth =
              if depth > searchmax then false
              else
                case getRailNode (Layout layout) nid of
                  Nothing -> false
                  Just (RailNode ri) ->
                    if any (\x -> (unwrap x).jointid == jid) ri.signals || any (\x -> (unwrap x).jointid == jid) ri.invalidRoutes
                    then false
                    else
                      let jointexit = (getRouteInfo (RailNode ri) jid).newjoint
                      in case getRailTraffic (Layout layout) nid of
                          Nothing -> false
                          Just ts -> 
                            case ts !! (unwrap jointexit) of
                              Nothing -> false
                              Just ts -> 
                                if length ts > 0 then true
                                else
                                  case find (\c -> c.from == jointexit) $ ri.connections of
                                    Nothing -> false
                                    Just cdata -> go cdata.nodeid cdata.jointid (depth + 1)
            in any identity $ (\cdata -> go cdata.nodeid cdata.jointid 0) <$> ri.connections

setManualStop :: Layout -> IntNode -> IntJoint -> Boolean -> Layout
setManualStop (Layout layout) nodeid jointid stop = fromMaybe (Layout layout) do
  (RailNode ri) <- getRailNode (Layout layout) nodeid
  {index : i, value: (Signal signal)} <- findWithIndex (\_ (Signal s) -> s.jointid == jointid) ri.signals
  newSignals <- updateAt i (Signal $ signal {manualStop = stop}) ri.signals
  let newRail = RailNode $ ri {signals = newSignals}
  newRails <- updateAt (unwrap nodeid) newRail layout.rails
  pure $ Layout $ layout {rails = newRails}

-- reserveは無効化した
tryOpenRouteFor :: Layout -> IntNode -> IntJoint -> Int -> Int -> Maybe {layout :: Layout, reserveid :: IntReserve}
tryOpenRouteFor (Layout layout) nodeid jointid routeid reserver = do
  (RailNode ri) <- getRailNode (Layout layout) nodeid
  (Signal s) <- find (\(Signal s) -> s.jointid == jointid) ri.signals
  (SignalRoute r) <- s.routes !! routeid
  let reserveid = IntReserve $ layout.updatecount + 1
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
  let target = go r.nextsignal r.rails -- 操作した信号機から次のシンプルでない信号機までの進路

  {traffic, newrails} <- foldM (\{traffic, newrails} {nodeid, jointenter, jointexit} -> do
    (RailNode ri) <- getRailNode (Layout layout) nodeid
    let traffic' = traffic || hasTraffic (Layout layout) (RailNode ri)
    newstate <- (unwrap ri.rail).getRoute ri.state jointenter jointexit
    newrails' <- updateAt (unwrap nodeid) (RailNode $ ri {state = newstate, reserves = ri.reserves <> [{jointid : jointenter, reserveid}]}) newrails
    if (newstate /= ri.state && traffic') || programmedroute && (s.restraint || any (\{jointid, reserveid} -> jointenter /= jointid && ((unwrap ri.rail).isBlocked jointenter ri.state jointid || (unwrap ri.rail).isBlocked jointenter newstate jointid) && any (\a -> a.reserveid == reserveid) layout.activeReserves) ri.reserves)
    then Nothing
    else Just {traffic: traffic', newrails: newrails'}
  ) {traffic: false, newrails: if programmedroute then layout.rails else map (\(RailNode r) -> if r.nodeid == nodeid then RailNode $ r {signals = map (\(Signal s) -> if s.jointid == jointid then Signal $ s {manualStop = true} else (Signal s)) r.signals} else (RailNode r)) layout.rails } target


  pure $ {layout: (forceUpdate >>> layoutUpdate >>> newreserve reserver reserveid) (Layout $ layout {rails = newrails}), reserveid}

tryOpenRouteFor_ffi (Layout layout) nodeid jointid routeid = maybe {layout : (Layout layout), result: false} (\l -> {layout: l.layout, result:true}) (tryOpenRouteFor (Layout layout) nodeid jointid routeid (-1))