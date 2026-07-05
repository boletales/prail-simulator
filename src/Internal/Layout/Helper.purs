module Internal.Layout.Helper where

import Prelude
import Data.Maybe
import Data.Array
import Data.Int
import Data.Newtype
import Internal.Layout.Types
import Internal.Types

indexMaybe ∷ ∀ (t192 ∷ Type). Array (Maybe t192) → Int → Maybe t192
indexMaybe a = index a >>> join
infixl 8 indexMaybe as !!?


getRailJointAbsPos :: RailNode -> IntJoint -> Pos
getRailJointAbsPos (RailNode ri) jointid =
  toAbsPos (ri.pos) ((unwrap ri.rail).getJointPos jointid)

getJointAbsPos :: Layout -> IntNode -> IntJoint -> Maybe Pos
getJointAbsPos (Layout layout) nodeid jointid =
  (\r -> getRailJointAbsPos r jointid) <$> (getRailNode (Layout layout) nodeid)



getRailNode :: Layout -> IntNode -> Maybe RailNode
getRailNode (Layout l) (IntNode i) = l.rails !! i

getRailTraffic ∷ Layout → IntNode → Maybe (Array (Array Int))
getRailTraffic (Layout l) (IntNode i) = l.traffic !! i

isRailClear ∷ Layout → IntNode → Maybe Boolean
isRailClear (Layout l) (IntNode i) = l.isclear !! i

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