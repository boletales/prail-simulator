-- レイアウト固有の構造体

module Internal.Layout.Types
  ( CarType(..)
  , FloorData(..)
  , IntNode(..)
  , IntReserve(..)
  , InvalidRoute(..)
  , JointData(..)
  , Layout(..)
  , RailNode
  , RailNode_(..)
  , RouteQueueElement(..)
  , Signal(..)
  , SignalColor
  , SignalRoute(..)
  , SignalRule(..)
  , SignalRulePhase(..)
  , Traffic
  , TrainRoute
  , TrainRoute_(..)
  , TrainTag(..)
  , TrainTagPattern
  , Trainset
  , Trainset_(..)
  , getTag
  , isComplex
  , signalAlart
  , signalCaution
  , signalClear
  , signalReduce
  , signalRulePhase_fired
  , signalRulePhase_stoppedFired
  , signalRulePhase_unfired
  , signalStop
  )
  where

import Prelude (class Eq, class Ord, class Show, show, (>>>))
import Internal.Types (ColorOption, DrawInfo, IntJoint, IntState, Pos, Rail, RailShape, RealColor, SectionArray)
import Data.Newtype (class Newtype, unwrap)
import Data.String.Regex
import Data.String.Regex.Flags (noFlags) as Re
import Data.String.Regex.Unsafe (unsafeRegex) as Re

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
    color :: Array ColorOption,
    drawinfos :: Array (DrawInfo Pos RealColor)
  }
derive instance Newtype (RailNode_ x) _

newtype IntNode = IntNode Int
instance Show IntNode where
  show = unwrap >>> show
derive instance Ord IntNode
derive instance Eq IntNode
derive instance Newtype IntNode _

newtype JointData = JointData {pos :: Pos, nodeid :: IntNode, jointid :: IntJoint}

newtype FloorData = FloorData {height :: Number, width :: Number}

newtype Layout = Layout {
    version :: Int,
    floor :: FloorData,
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