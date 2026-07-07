module Internal.Layout.Types.RailNode where

import Prelude (($), (<$>), (>>>))
import Internal.Types
import Data.Newtype (class Newtype, unwrap)
import Data.Maybe (fromMaybe)
import Data.Array ((!!))

import Internal.Layout.Types.Signal (InvalidRoute, Signal)
import Internal.Layout.Types.Base (IntNode, IntReserve)

type RailNode = RailNode_ Rail
newtype RailNode_ x = RailNode {
    nodeid :: IntNode,
    rail :: x,
    state :: IntState,
    signals :: Array (Signal),
    invalidRoutes :: Array (InvalidRoute),
    connections :: Array ({from :: IntJoint, nodeid :: IntNode, jointid :: IntJoint}),
    reserves :: Array ({reserveid :: IntReserve, jointid :: IntJoint}),
    pos  :: Pos,
    note :: String,
    color :: Array ColorOption,
    drawinfos :: Array (DrawInfo Pos RealColor),
    traffic :: Array (Array Int),
    isclear :: Boolean
  }
derive instance Newtype (RailNode_ x) _

getNodeDrawInfo :: RailNode -> DrawInfo Pos RealColor
getNodeDrawInfo (RailNode node) =
  fromMaybe brokenDrawInfo $ node.drawinfos !! (unwrap node.state)

refreshNodeDrawInfo :: RailNode -> RailNode
refreshNodeDrawInfo (RailNode node) =
  RailNode $ node {drawinfos = ((unwrap node.rail).getDrawInfo
    >>> applyColorOption (node.color) 
    >>> absDrawInfo node.pos
  ) <$> (unwrap node.rail).getStates
  }

getRailJointAbsPos :: RailNode -> IntJoint -> Pos
getRailJointAbsPos (RailNode ri) jointid =
  toAbsPos (ri.pos) ((unwrap ri.rail).getJointPos jointid)
  
getRouteInfo :: RailNode -> IntJoint -> {newjoint :: IntJoint, shapes :: Array (RailShape Pos)}
getRouteInfo (RailNode ri) j =
  let {newjoint, newstate:_, shape} = (unwrap ri.rail).getNewState j (ri.state)
  in  {newjoint, shapes : (absShape ri.pos) <$> shape}

getNextJoint :: RailNode -> IntJoint -> IntJoint
getNextJoint (RailNode ri) j =
  let {newjoint, newstate:_, shape:_} = (unwrap ri.rail).getNewState j (ri.state)
  in  newjoint