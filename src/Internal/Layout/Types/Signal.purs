module Internal.Layout.Types.Signal
  ( InvalidRoute(..)
  , Signal(..)
  , SignalColor
  , SignalRoute(..)
  , SignalRule(..)
  , TrainTagPattern
  , getTag
  , isComplex
  , signalAlart
  , signalCaution
  , signalClear
  , signalReduce
  , signalStop
  )
  where

import Internal.Types (IntJoint)
import Data.Newtype (class Newtype)
import Data.String.Regex (Regex)
import Data.String.Regex.Flags (noFlags) as Re
import Data.String.Regex.Unsafe (unsafeRegex) as Re

import Internal.Layout.Types.Base

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


type SignalColor = Int

signalStop ∷ Int
signalStop = 0
signalAlart ∷ Int
signalAlart = 1
signalCaution ∷ Int
signalCaution = 2
signalReduce ∷ Int
signalReduce = 3
signalClear ∷ Int
signalClear = 4


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