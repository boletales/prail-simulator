module Internal.Layout.Types.Layout
  ( FloorData(..)
  , JointData(..)
  , Layout(..)
  , RouteQueueElement(..)
  , Traffic
  , getJointAbsPos
  , getJoints
  , getNewRailPos
  , getRailNode
  , getRailTraffic
  , isRailClear
  , modifyRailNode
  , selectRailNode
  , updateRailNodeAt
  )
  where

import Prelude (bind, join, pure, ($), (+), (-), (<), (<$>), (<*>), (>=>))
import Internal.Types (IntJoint, Pos, RelPos(..), SectionArray, canJoin, convertRelPos, poszero, reversePos, reverseRelPos, saIndex, toAbsPos)
import Data.Newtype (class Newtype, unwrap)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Array (foldM)
import Data.Int (round)
import JS.Map.Primitive as JSM

import Internal.Layout.Types.Base (IntNode, IntReserve)
import Internal.Layout.Types.Signal (SignalColor)
import Internal.Layout.Types.RailNode (RailNode, RailNode_(..), getRailJointAbsPos)
import Internal.Layout.Types.Train (Trainset)

newtype JointData = JointData {pos :: Pos, nodeid :: IntNode, jointid :: IntJoint}

newtype FloorData = FloorData {height :: Number, width :: Number}

newtype Layout = Layout {
    version :: Int,
    floor :: FloorData,
    rails :: JSM.Map IntNode RailNode,
    trains :: Array Trainset,
    signalcolors :: Array (Array (Array SignalColor)),
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

newtype RouteQueueElement = RouteQueueElement {
      time       :: Number
    , retryafter :: Number
    , nodeid     :: IntNode
    , jointid    :: IntJoint
    , routeid    :: Int
    , trainid    :: Int
  }

type Traffic = Array (Array (Array Int))


getJointAbsPos :: Layout -> IntNode -> IntJoint -> Maybe Pos
getJointAbsPos (Layout layout) nodeid jointid =
  (\r -> getRailJointAbsPos r jointid) <$> (getRailNode (Layout layout) nodeid)

selectRailNode :: JSM.Map IntNode RailNode -> IntNode -> Maybe RailNode
selectRailNode rails nodeid = JSM.lookup nodeid rails

updateRailNodeAt :: RailNode -> IntNode -> JSM.Map IntNode RailNode -> Maybe (JSM.Map IntNode RailNode)
updateRailNodeAt newRail nodeid rails = do
  _ <- JSM.lookup nodeid rails
  Just $ JSM.insert nodeid newRail rails
  
modifyRailNode :: (RailNode -> RailNode) -> IntNode -> JSM.Map IntNode RailNode -> Maybe (JSM.Map IntNode RailNode)
modifyRailNode f nodeid rails = do
  r <- JSM.lookup nodeid rails
  Just $ JSM.insert nodeid (f r) rails


getRailNode :: Layout -> IntNode -> Maybe RailNode
getRailNode (Layout l) nodeid = selectRailNode l.rails nodeid

getRailTraffic ∷ Layout → IntNode → Maybe (Array (Array Int))
getRailTraffic (Layout l) nodeid = do
  RailNode r <- JSM.lookup nodeid l.rails
  Just r.traffic

isRailClear ∷ Layout → IntNode → Maybe Boolean
isRailClear (Layout l) nodeid = do
  RailNode r <- JSM.lookup nodeid l.rails
  Just r.isclear

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
  let jrel i = (unwrap node.rail).getJointPos i
      conv i = convertRelPos ((unwrap node.rail).getJointPos i) (reverseRelPos (RelPos poszero))
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