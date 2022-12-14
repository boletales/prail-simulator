module Internal.Layout
  ( CarType(..)
  , JointData(..)
  , Layout(..)
  , RailInstance
  , RailInstance_(..)
  , RailNode
  , RailNode_(..)
  , Route
  , Route_(..)
  , SectionArray(..)
  , Signal(..)
  , SignalColor(..)
  , SignalRoute(..)
  , Traffic
  , Trainset
  , TrainsetDrawInfo(..)
  , Trainset_(..)
  , addJoint
  , addRail
  , addSignal
  , addTrainset
  , autoAdd
  , flipTrain
  , forceUpdate
  , getJointAbsPos
  , getJoints
  , getNewRailPos
  , layoutDrawInfo
  , layoutTick
  , layoutUpdate
  , removeRail
  , removeSignal
  , saEmpty
  , shiftRailIndex
  , trainsetDrawInfo
  , trainsetLength
  , updateSignalColor
  , updateSignalRoutes
  , updateTraffic
  )
  where

import Data.Array
import Data.Either
import Data.Int
import Data.Maybe
import Data.Newtype
import Internal.Types
import Prelude

import Control.Bind (bindFlipped)
import Control.Monad.List.Trans (foldl')
import Data.Foldable (foldM, sum)
import Data.FoldableWithIndex (allWithIndex, findMapWithIndex)
import Data.Function (on)

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

type RailNode = RailNode_ Rail
newtype RailNode_ x = RailNode {
    nodeid :: Int,
    rail :: x,
    state :: Int,
    connections :: Array ({from :: Int, nodeid :: Int, jointid :: Int})
  }
derive instance Newtype (RailNode_ x) _

type RailInstance = RailInstance_ Rail
newtype RailInstance_ x = RailInstance {
    node :: RailNode_ x,
    instanceid :: Int,
    signals :: Array (Signal),
    wrongways :: Array ({jointid :: Int}),
    pos  :: Pos
  }
derive instance Newtype (RailInstance_ x) _

updateRailInstance :: forall j s. RailInstance -> Int -> {instance :: RailInstance, newjoint :: Int, shapes :: Array (RailShape Pos)}
updateRailInstance (RailInstance ri) j =
  let {newjoint, newstate, shape} = (unwrap (unwrap ri.node).rail).getNewState j ((unwrap ri.node).state)
  in  {instance : RailInstance $ ri {node = RailNode $ (unwrap ri.node) {state = newstate}}, newjoint, shapes : (absShape ri.pos) <$> shape}
newtype JointData = JointData {pos :: Pos, nodeid :: Int, jointid :: Int}

newtype Layout = Layout {
    version :: Int,
    rails :: Array RailInstance,
    trains :: Array Trainset,
    signalcolors :: Array (Array (Array SignalColor)),
    traffic :: Traffic,
    instancecount :: Int,
    traincount :: Int,
    updatecount :: Int,
    jointData :: SectionArray (SectionArray (SectionArray (Array JointData)))
  }
derive instance Newtype Layout _

instanceDrawInfo :: RailInstance -> DrawInfo Pos
instanceDrawInfo (RailInstance i) =
  absDrawInfo i.pos $ (unwrap (unwrap i.node).rail).getDrawInfo (unwrap i.node).state



carLength = 10.0 / 21.4
carMargin = 1.0 / 21.4
trainsetLength (Trainset t) = (toNumber $ length t.types) * (carLength + carMargin) - carMargin
wheelWidth = 3.4 / 21.4
wheelMargin = 2.0 / 21.4


newtype TrainsetDrawInfo = TrainsetDrawInfo ({
      trainid :: Int
    , cars :: Array {head :: {r :: Pos, l :: Pos}, tail :: {r :: Pos, l :: Pos}, type :: CarType}
    , flipped :: Boolean
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
      shapes = ((\(Route r) -> reverse r.shapes) =<< t.route)

      getpos' w d' i =
        case shapes !! i of
          Just (RailShape s) ->
            if s.length < d'
              then getpos' w (d' - s.length) (i + 1)
              else getDividingPoint_rel s.start s.end w (1.0 - d' / s.length)
          Nothing -> poszero

      getpos d w = getpos' w d 0

      -- headpos = (fromMaybe 0.0 (((flip bind) (unwrap >>> _.shapes) >>> head >>> map (unwrap >>> _.length)) t.route)) - 
  in  TrainsetDrawInfo $ {flipped : t.flipped, trainid : t.trainid, cars: mapWithIndex (\i ct -> 
          let d = ((toNumber i) * (carLength + carMargin)) + t.distanceToNext
              dh = d + wheelMargin
              dt = d + carLength - wheelMargin
          in {type : ct, head : {r : getpos dh (-wheelWidth/2.0), l : getpos dh ( wheelWidth/2.0)}, tail : {r : getpos dt (-wheelWidth/2.0), l : getpos dt ( wheelWidth/2.0)}}
        ) t.types}

addTrainset :: Layout -> Int -> Int -> Array CarType -> Layout
addTrainset (Layout layout) nodeid jointid types =
    let go rs nid jid len = do
          rail <- layout.rails !! nid
          let info = updateRailInstance rail jid
          let lenhere = sum $ shapeLength <$> info.shapes
          if lenhere < len
          then do
            cdata <- find (\c -> c.from == info.newjoint) $ (unwrap (unwrap rail).node).connections
            go ([Route {
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
                    [Route {
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
              }
          
  in  fromMaybe (Layout layout) (do
        rail <- layout.rails !! nodeid
        start <- find (\c -> c.from == jointid) $ (unwrap (unwrap rail).node).connections
        newtrain <- go [] start.nodeid start.jointid ((toNumber $ length types) * (carLength + carMargin) - carMargin)
        Just $ Layout $ layout {traincount = layout.traincount + 1, trains = layout.trains <> [newtrain]}
      )

layoutDrawInfo :: Layout -> {
      rails :: Array {rails :: Array (DrawRail Pos), additionals :: Array (DrawAdditional Pos), joints :: Array Pos, instance :: RailInstance}
    , signals :: Array (Array {indication :: Array Int, pos :: Pos, signal :: Signal})
    , trains ::  Array TrainsetDrawInfo
  }
layoutDrawInfo (Layout layout) =
  {
      rails : (\r -> let (DrawInfo ide) = instanceDrawInfo r 
         in  {
                rails: ide.rails
              , additionals: ide.additionals
              , joints: getRailJointAbsPos r <$> (unwrap (unwrap (unwrap r).node).rail).getJoints
              , instance : r
             }) <$> layout.rails
      , signals : (\(RailInstance ri) -> map (\(Signal s) -> {
          indication : s.indication,
          pos    : fromMaybe poszero $ getJointAbsPos (Layout layout) s.nodeid s.jointid,
          signal : (Signal s)
        }) ri.signals) <$> layout.rails
      , trains : trainsetDrawInfo <$> layout.trains
  }

indexMaybe ∷ ∀ (t192 ∷ Type). Array (Maybe t192) → Int → Maybe t192
indexMaybe a = index a >>> join
infixl 8 indexMaybe as !!?


getRailJointAbsPos :: RailInstance -> Int -> Pos
getRailJointAbsPos r jointid =
  toAbsPos ((unwrap r).pos) ((unwrap (unwrap (unwrap r).node).rail).getJointPos jointid)

getJointAbsPos :: Layout -> Int -> Int -> Maybe Pos
getJointAbsPos (Layout layout) nodeid jointid =
  (\r -> getRailJointAbsPos r jointid) <$> (layout.rails !! nodeid)

addJoint :: Layout -> Pos -> Int -> Int -> Layout
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
            fromMaybe true $ (\(RailInstance {node: RailNode n}) -> all (\c -> c.from /= jointid) n.connections) <$> layout.rails !! nodeid
          ) connections
  in if cond then
        let newnode = RailNode $ node {
                connections =
                  node.connections
                  <> ((\{jointData:(JointData {pos: _, nodeid: nodeid, jointid: jointid}), jointid:j} 
                          -> {from: j, nodeid: nodeid, jointid: jointid}
                      ) <$> newconnections)
              }
            newrails =
              foldl (\rs {jointData:(JointData {pos: _, nodeid: nodeid, jointid: jointid}), jointid:j} ->
                  fromMaybe rs 
                    (modifyAt nodeid (\(RailInstance r) ->
                      RailInstance $ r {node = (\(RailNode n) -> RailNode $ n {connections = n.connections <> [{from : jointid, nodeid : node.nodeid, jointid :j}]}) r.node}
                    ) rs
                  )
                ) layout.rails connections
              <> [RailInstance {node:newnode, instanceid: layout.instancecount, pos:pos, signals : [], wrongways : []}]
        in Just $ updateSignalRoutes $ 
                  (\l -> foldl (\l' {jointid: j, pos: p} -> addJoint l' p node.nodeid j) l joints)
                    $ Layout $ layout{
                            updatecount = layout.updatecount + 1
                          , rails = newrails
                          , instancecount =  layout.instancecount + 1
                    }
      else Nothing

autoAdd :: Layout -> Int -> Int -> Rail -> Int -> Layout
autoAdd (Layout layout) selectednode selectedjoint rail from =
  fromMaybe (Layout layout) $ (do
      Pos to <- getJointAbsPos (Layout layout) selectednode selectedjoint
      let rail' =
            if to.isPlus == (unwrap $ unwrap $ (unwrap rail).getJointPos from).isPlus
            then opposeRail rail
            else rail
      let node = RailNode {
              nodeid : length (layout.rails),
              state : (unwrap rail').defaultState,
              rail : rail',
              connections : [{from: from, nodeid: selectednode, jointid: selectedjoint}]
            }
      addRail (Layout layout) node
    )

shiftIndex :: Int -> Int -> Int
shiftIndex deleted i =
  if i < deleted
  then i
  else i - 1

shiftRailIndex :: forall x. Int -> RailInstance_ x -> RailInstance_ x
shiftRailIndex deleted (RailInstance r) =
  RailInstance $ r {node = RailNode $ (unwrap r.node) {
      nodeid = shiftIndex deleted (unwrap r.node).nodeid 
    , connections = (\c -> c {nodeid = shiftIndex deleted c.nodeid}) <$> (unwrap r.node).connections
  }}

removeRail :: Layout -> Int -> Layout
removeRail (Layout layout) nodeid = 
    let layout' = 
          case layout.rails !! nodeid of
            Just ri -> unwrap $  foldl (\l j -> removeSignal l nodeid j) (Layout layout) (unwrap (unwrap (unwrap ri).node).rail).getJoints
            Nothing -> layout
    in  updateSignalRoutes $ Layout $ layout' {
          updatecount = layout'.updatecount + 1,
          rails = (\(RailInstance r) -> 
                    shiftRailIndex nodeid $ 
                    RailInstance $ r {
                        node = RailNode $ (unwrap r.node) {
                          connections = filter (\{nodeid:i} -> i /= nodeid) (unwrap r.node).connections
                        }
                      })
                    <$> (fromMaybe layout'.rails $ deleteAt nodeid layout'.rails),
          jointData = (map $ map $ map $ filter (\(JointData d) -> d.nodeid /= nodeid) >>> map (\(JointData d) -> JointData $ d {nodeid = shiftIndex nodeid d.nodeid})) layout'.jointData
        }


type Route = Route_ RailInstance
newtype Route_ x = Route {
      nodeid :: Int
    , jointid :: Int
    , railinstance :: x
    , shapes :: Array (RailShape Pos)
    , length :: Number
  }
derive instance Newtype (Route_ x) _


newtype CarType = CarType {
      type :: String
    , flipped :: Boolean
  }
derive instance Newtype CarType _

type Trainset = Trainset_ RailInstance
newtype Trainset_ x = Trainset {
      types :: Array CarType
    , route      :: Array (Route_ x)
    , distanceToNext :: Number
    , distanceFromOldest :: Number
    , speed :: Number
    , trainid :: Int
    , flipped :: Boolean
  }
derive instance Newtype (Trainset_ x) _

moveTrains :: Number -> Layout -> Layout
moveTrains dt (Layout layout) =
  foldl (\l t ->
      let {newlayout, newtrainset} = movefoward l t dt
      in Layout $ (unwrap newlayout) {trains = (unwrap newlayout).trains <> [newtrainset]}
    ) (Layout $ layout {trains = []}) (layout.trains)

flipTrain :: Trainset -> Trainset
flipTrain (Trainset t0) = Trainset $ t0 {
    --  types = reverse $ (\(CarType t) -> CarType $ t {flipped = not t.flipped}) <$> t0.types
      route = reverse $ (\(Route r) -> Route $ r {jointid = (updateRailInstance r.railinstance r.jointid).newjoint, shapes = reverseShapes r.shapes}) <$> t0.route 
    , distanceToNext     = t0.distanceFromOldest
    , distanceFromOldest = t0.distanceToNext
    , flipped = not t0.flipped
  }

movefoward :: Layout -> Trainset -> Number -> {newlayout :: Layout, newtrainset :: Trainset}
movefoward (Layout layout) (Trainset t0) dt =
  let dx = dt * t0.speed
      (Trainset t1) = Trainset $ t0 {distanceToNext = t0.distanceToNext - dx, distanceFromOldest = t0.distanceFromOldest + dx}
      (Trainset t2) = 
        case unsnoc t1.route of
          Nothing -> Trainset t1
          Just {init : rs, last : (Route r)} ->
            if t1.distanceFromOldest <= r.length
              then Trainset t1
              else Trainset $ t1 {route = rs, distanceFromOldest = t1.distanceFromOldest - r.length}
    in  if 0.0 <= t2.distanceToNext 
          then {newlayout : Layout layout, newtrainset : Trainset t2}
          else 
            case (do
                (Route r) <- head t2.route
                cdata <- find (\c -> c.from == (updateRailInstance r.railinstance r.jointid).newjoint) $ (unwrap (unwrap r.railinstance).node).connections
                nextRail <- layout.rails !! cdata.nodeid
                let routedata = updateRailInstance nextRail cdata.jointid
                let slength = sum (shapeLength <$> routedata.shapes)
                let t3 = Trainset $ t2 {
                      route = [Route {
                              nodeid  : cdata.nodeid
                            , jointid : cdata.jointid
                            , railinstance : nextRail
                            , shapes : routedata.shapes
                            , length : slength
                          }
                        ] <> t2.route
                    , distanceToNext = t2.distanceToNext + slength
                  }
                Just {newlayout :
                  let oldrail = layout.rails !! cdata.nodeid
                  in  if on (==) (map (\x -> (unwrap (unwrap x).node).state)) oldrail (Just routedata.instance)
                        then Layout layout
                        else 
                          Layout $ layout {
                              updatecount = layout.updatecount + 1
                            , rails = fromMaybe layout.rails $ updateAt cdata.nodeid routedata.instance layout.rails
                          }
                , newtrainset : t3}
              ) of
            Just x -> x
            Nothing -> 
              if t2.distanceToNext == 0.0 then {newlayout : Layout layout, newtrainset : Trainset t0} else movefoward (Layout layout) (Trainset t0) (t0.distanceToNext / t0.speed * 0.9)

layoutTick :: Layout -> Layout
layoutTick =
  moveTrains (1.0/60.0) 

layoutUpdate :: Layout -> Layout
layoutUpdate = updateTraffic >>> updateSignalColor



newtype SignalRoute = SignalRoute {
      rails :: Array {nodeid :: Int, jointenter :: Int, jointexit :: Int}
    , nextsignal :: {nodeid :: Int, jointid :: Int}
  }
derive instance Newtype SignalRoute _

newtype Signal = Signal {
      signalname :: String
    , nodeid :: Int
    , jointid :: Int
    , routes :: Array SignalRoute
    , colors :: Array SignalColor
    , indication :: Array SignalColor
  }
derive instance Newtype Signal _

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
  Layout $ layout {traffic =
    foldl (\traffic (Trainset trainset) ->
        foldl (\traffic (Route route) ->
            fromMaybe traffic $ modifyAt route.nodeid (\d -> fromMaybe d $ modifyAt route.jointid (_ <> [trainset.trainid]) d) traffic
          ) traffic trainset.route
      ) (map (\(RailInstance r) -> replicate (length (unwrap (unwrap r.node).rail).getJoints) []) layout.rails) layout.trains
  }

updateSignalColor :: Layout -> Layout
updateSignalColor (Layout layout) = 
  let signals = (unwrap >>> (_.signals)) =<< layout.rails
      blockingData = 
        map (\(RailInstance ri) -> {rail :ri, signals :map (\(Signal signal) ->{
            signal : (Signal signal),
            routes : map (\(SignalRoute route) ->
                {
                  route: (SignalRoute route),
                  routecond : all (\{nodeid, jointenter, jointexit} -> maybe false (\(RailInstance ri) ->
                                      let nr = (unwrap (unwrap ri.node).rail).getNewState jointenter ((unwrap ri.node).state)
                                      in  nr.newjoint == jointexit && nr.newstate == (unwrap ri.node).state
                                    ) (layout.rails !! nodeid) ) route.rails,
                  clearcond : all (\{nodeid, jointenter, jointexit} -> maybe false (\ri ->
                                      let rail = (unwrap (unwrap (unwrap ri).node).rail)
                                          state = (unwrap (unwrap ri).node).state
                                      in case layout.traffic !! nodeid of 
                                          Just ts ->
                                            allWithIndex (\i t ->
                                              if length t == 0
                                              then true
                                              else not $ rail.isBlocked i state jointenter 
                                            ) ts
                                          Nothing -> false
                                    ) (layout.rails !! nodeid) ) route.rails,
                  directioncond : 
                    case last (route.rails) of
                      Just {nodeid, jointenter, jointexit} ->
                        let go nid jid =
                              case layout.rails !! nid of
                                Nothing -> true
                                Just ri ->
                                  if (unwrap (unwrap (unwrap ri).node).rail).isSimple
                                  then
                                    let jidexit = (updateRailInstance ri jid).newjoint
                                    in  case length <$> ((_ !! jidexit) =<< (layout.traffic !! nid)) of
                                          Just 0  -> 
                                            case find (\c -> c.from == jidexit) $ (unwrap (unwrap ri).node).connections of
                                              Nothing -> true
                                              Just {nodeid, jointid} -> go nodeid jointid
                                          _       -> false
                                  else true
                        in  go nodeid jointenter
                      Nothing -> false
                }
              ) signal.routes
            }
          ) ri.signals}
        ) layout.rails
      filtered = map (\rbd -> map (\bd -> filter (\d -> d.routecond) bd.routes) rbd.signals) blockingData
      colors =
        map (\rbd -> RailInstance $ (rbd.rail) {signals = map (\bd -> Signal $ (unwrap bd.signal) {indication=
                map (\d ->
                  if d.routecond && d.clearcond && d.directioncond then
                    let go n {nodeid, jointid} =
                          if n >= length (unwrap bd.signal).colors then signalClear
                          else
                            case (filtered !! nodeid) >>= (_ !! jointid) of
                              Just bd' ->
                                case head bd' of
                                  Just d ->
                                    if d.routecond && d.clearcond && d.directioncond 
                                    then go (n+1) ((unwrap d.route).nextsignal)
                                    else fromMaybe signalClear ((unwrap bd.signal).colors !! n)
                                  Nothing -> fromMaybe signalClear ((unwrap bd.signal).colors !! n)
                              Nothing -> fromMaybe signalClear ((unwrap bd.signal).colors !! n)
                    in go 0 {nodeid : (unwrap bd.signal).nodeid, jointid : (unwrap bd.signal).jointid}
                  else signalStop
                ) bd.routes
            }
          ) rbd.signals}
        ) blockingData
  in Layout $ layout {rails = colors}

searchmax :: Int
searchmax = 30
updateSignalRoutes :: Layout -> Layout
updateSignalRoutes (Layout layout) = 
  Layout $ layout {
    rails = 
      map (\(RailInstance ri) -> RailInstance ri { signals = map (\(Signal signal) -> 
              Signal $ signal {
                routes =
                  let go nid jid rails rids =
                        if length rails > searchmax then [] else
                          case layout.rails !! nid of
                            Nothing -> []
                            Just ri ->
                              let jidexits = (if (unwrap (unwrap (unwrap ri).node).rail).flipped then reverse else identity) $ nub $ ((unwrap (unwrap (unwrap ri).node).rail).getNewState jid >>> (_.newjoint)) <$> (unwrap (unwrap (unwrap ri).node).rail).getStates
                              in  (\jid' ->
                                case find (\s -> s.jointid == jid') (unwrap ri).wrongways of
                                  Nothing -> 
                                    case find (\(Signal s) -> s.jointid == jid') (unwrap ri).signals of
                                      Nothing -> 
                                        case find (\c -> c.from == jid') $ (unwrap (unwrap ri).node).connections of
                                          Nothing -> []
                                          Just {nodeid, jointid} -> 
                                            if elem nodeid rids then []
                                            else go nodeid jointid (rails <> [{nodeid : nid, jointenter : jid, jointexit : jid'}]) (insert nodeid rids)
                                      Just s  -> [SignalRoute {nextsignal : {nodeid : nid, jointid : jid'}, rails : rails <> [{nodeid : nid, jointenter : jid, jointexit : jid'}]}]
                                  Just s  -> []
                              ) =<< jidexits
                  in case layout.rails !! signal.nodeid of
                        Nothing -> []
                        Just ri ->
                          case find (\c -> c.from == signal.jointid) $ (unwrap (unwrap ri).node).connections of
                            Nothing -> []
                            Just {nodeid, jointid} -> go nodeid jointid [] []
              }
      ) ri.signals} ) layout.rails
  }


addSignal :: Layout -> Int -> Int -> Layout
addSignal (Layout layout) nodeid jointid = fromMaybe (Layout layout) $
  let signal = Signal {
            signalname : show nodeid <> "_" <> show nodeid
          , nodeid
          , jointid 
          , routes : []
          , colors : [signalStop, signalCaution, signalReduce]
          , indication : []
        }
  in  do
    (RailInstance ri) <- layout.rails !! nodeid
    if any (\(Signal s) -> s.jointid == jointid) ri.signals
    then Nothing
    else pure unit

    rails' <- modifyAt nodeid (\(RailInstance ri) -> RailInstance $ ri {signals = ri.signals <> [signal]}) layout.rails
    Just $ updateSignalRoutes $ Layout $ layout {updatecount = layout.updatecount + 1, rails = rails'}


removeSignal :: Layout -> Int -> Int -> Layout
removeSignal (Layout layout) nodeid jointid = 
  updateSignalRoutes $ Layout $ layout {
    updatecount = layout.updatecount + 1, 
    rails = fromMaybe layout.rails $ modifyAt nodeid (\(RailInstance ri) -> RailInstance $ ri {signals = filter (\(Signal s) -> s.jointid /= jointid) ri.signals}) layout.rails
  }