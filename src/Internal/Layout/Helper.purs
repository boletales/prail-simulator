-- レイアウトや構成要素の情報を得る「静的」な関数群

module Internal.Layout.Helper
  ( (!!?)
  , digestIndication
  , getJointAbsPos
  , getJoints
  , getNewRailPos
  , getNextJoint
  , getRailJointAbsPos
  , getRailNode
  , getRailTraffic
  , getRouteInfo
  , indexMaybe
  , instanceDrawInfo
  , isRailClear
  , recalcInstanceDrawInfo
  , signalToSpeed
  , updateRailNode
  , selectRail
  )
  where

import Prelude
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Array (filter, foldM, index, find, (!!))
import Data.Int (round)
import Data.Newtype (unwrap)
import Data.Foldable (maximum)
import JS.Map.Primitive as JSM
import Internal.Layout.Types (IntNode(..), JointData, Layout(..), RailNode, RailNode_(..), Signal, signalStop) 
import Internal.Layout.Params
import Internal.Types (DrawInfo, IntJoint, Pos, RailShape, RealColor, RelPos(..), absDrawInfo, absShape, applyColorOption, brokenDrawInfo, canJoin, convertRelPos, poszero, reversePos, reverseRelPos, saIndex, toAbsPos)

indexMaybe ∷ ∀ (t192 ∷ Type). Array (Maybe t192) → Int → Maybe t192
indexMaybe a = index a >>> join
infixl 8 indexMaybe as !!?


getRailJointAbsPos :: RailNode -> IntJoint -> Pos
getRailJointAbsPos (RailNode ri) jointid =
  toAbsPos (ri.pos) ((unwrap ri.rail).getJointPos jointid)

getJointAbsPos :: Layout -> IntNode -> IntJoint -> Maybe Pos
getJointAbsPos (Layout layout) nodeid jointid =
  (\r -> getRailJointAbsPos r jointid) <$> (getRailNode (Layout layout) nodeid)



selectRail :: JSM.Map IntNode RailNode -> IntNode -> Maybe RailNode
selectRail rails nodeid = JSM.lookup nodeid rails



getRailNode :: Layout -> IntNode -> Maybe RailNode
getRailNode (Layout l) nodeid = selectRail l.rails nodeid

getRailTraffic ∷ Layout → IntNode → Maybe (Array (Array Int))
getRailTraffic (Layout l) nodeid = do
  RailNode r <- JSM.lookup nodeid l.rails
  Just r.traffic

isRailClear ∷ Layout → IntNode → Maybe Boolean
isRailClear (Layout l) nodeid = do
  RailNode r <- JSM.lookup nodeid l.rails
  Just r.isclear

getRouteInfo :: RailNode -> IntJoint -> {newjoint :: IntJoint, shapes :: Array (RailShape Pos)}
getRouteInfo (RailNode ri) j =
  let {newjoint, newstate:_, shape} = (unwrap ri.rail).getNewState j (ri.state)
  in  {newjoint, shapes : (absShape ri.pos) <$> shape}

getNextJoint :: RailNode -> IntJoint -> IntJoint
getNextJoint (RailNode ri) j =
  let {newjoint, newstate:_, shape:_} = (unwrap ri.rail).getNewState j (ri.state)
  in  newjoint



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


instanceDrawInfos :: RailNode -> Array (DrawInfo Pos RealColor)
instanceDrawInfos (RailNode node) =
  ((unwrap node.rail).getDrawInfo
    >>> applyColorOption (node.color) 
    >>> absDrawInfo node.pos
  ) <$> (unwrap node.rail).getStates

instanceDrawInfo :: RailNode -> DrawInfo Pos RealColor
instanceDrawInfo (RailNode node) =
  fromMaybe brokenDrawInfo $ node.drawinfos !! (unwrap node.state)


recalcInstanceDrawInfo :: RailNode -> RailNode
recalcInstanceDrawInfo (RailNode node) =
  RailNode $ node {drawinfos = instanceDrawInfos (RailNode node)}


signalToSpeed :: Signal -> Number 
signalToSpeed = digestIndication >>> indicationToSpeed

digestIndication :: Signal -> Int
digestIndication signal = if (unwrap signal).manualStop || (unwrap signal).restraint then signalStop else fromMaybe signalStop $ maximum ((unwrap signal).indication)
