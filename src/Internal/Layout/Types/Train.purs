module Internal.Layout.Types.Train where

import Prelude (class Eq)
import Internal.Types
import Data.Newtype (class Newtype)

import Internal.Layout.Types.RailNode (RailNode)
import Internal.Layout.Types.Base (IntNode)

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

signalRulePhase_unfired ∷ SignalRulePhase
signalRulePhase_unfired      = SignalRulePhase 0

signalRulePhase_fired ∷ SignalRulePhase
signalRulePhase_fired        = SignalRulePhase 1

signalRulePhase_stoppedFired ∷ SignalRulePhase
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