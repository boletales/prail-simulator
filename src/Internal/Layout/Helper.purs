module Internal.Layout.Helper where

import Prelude
import Data.Maybe
import Data.Array
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