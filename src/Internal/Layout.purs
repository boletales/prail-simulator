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
  , Trainset
  , TrainsetDrawInfo(..)
  , Trainset_(..)
  , addJoint
  , addRail
  , addTrainset
  , autoAdd
  , getJointAbsPos
  , getJoints
  , getNewRailPos
  , layoutDrawInfo
  , layoutTick
  , removeRail
  , saEmpty
  , shiftRailIndex
  , trainsetDrawInfo
  , trainsetLength
  )
  where

import Data.Array
import Data.Int
import Data.Maybe
import Data.Either
import Data.Newtype
import Internal.Types
import Prelude

import Control.Monad.List.Trans (foldl')
import Data.Foldable (foldM, sum)

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
    instancecount :: Int,
    traincount :: Int,
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
  in  TrainsetDrawInfo $ {trainid : t.trainid, cars: mapWithIndex (\i ct -> 
          let d = ((toNumber i) * (carLength + carMargin) - carMargin) + t.distanceToNext
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
              }
          
  in  fromMaybe (Layout layout) (do
        rail <- layout.rails !! nodeid
        start <- find (\c -> c.from == jointid) $ (unwrap (unwrap rail).node).connections
        newtrain <- go [] start.nodeid start.jointid ((toNumber $ length types) * (carLength + carMargin) - carMargin)
        Just $ Layout $ layout {traincount = layout.traincount + 1, trains = layout.trains <> [newtrain]}
      )

layoutDrawInfo :: Layout -> {
      rails :: Array {rails :: Array (DrawRail Pos), additionals :: Array (DrawAdditional Pos), joints :: Array Pos, instance :: RailInstance}
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
              <> [RailInstance {node:newnode, instanceid: layout.instancecount, pos:pos}]
        in Just $ (\l -> foldl (\l' {jointid: j, pos: p} -> addJoint l' p node.nodeid j) l joints)
                    $ Layout $ layout{
                            rails = newrails
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
removeRail (Layout layout) nodeid = Layout $ layout {
    rails = (\(RailInstance r) -> 
              shiftRailIndex nodeid $ 
              RailInstance $ r {
                  node = RailNode $ (unwrap r.node) {
                    connections = filter (\{nodeid:i} -> i /= nodeid) (unwrap r.node).connections
                  }
                })
              <$> (fromMaybe layout.rails $ deleteAt nodeid layout.rails),
    jointData = (map $ map $ map $ filter (\(JointData d) -> d.nodeid /= nodeid) >>> map (\(JointData d) -> JointData $ d {nodeid = shiftIndex nodeid d.nodeid})) layout.jointData
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
  }
derive instance Newtype (Trainset_ x) _

moveTrains :: Number -> Layout -> Layout
moveTrains dt (Layout layout) =
  foldl (\l t ->
      let {newlayout, newtrainset} = movefoward l t dt
      in Layout $ (unwrap newlayout) {trains = (unwrap newlayout).trains <> [newtrainset]}
    ) (Layout $ layout {trains = []}) (layout.trains)

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
                Just {newlayout : Layout $ layout {rails = fromMaybe layout.rails $ updateAt cdata.nodeid routedata.instance layout.rails}, newtrainset : t3}
              ) of
            Just x -> x
            Nothing -> 
              if t2.distanceToNext == 0.0 then {newlayout : Layout layout, newtrainset : Trainset t0} else movefoward (Layout layout) (Trainset t0) (t0.distanceToNext / t0.speed * 0.9)

layoutTick :: Layout -> Layout
layoutTick =
  moveTrains (1.0/60.0)