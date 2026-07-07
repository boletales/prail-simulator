module Main
  ( addInvalidRoute
  , addJoint
  , addRail
  , addSignal
  , addTrainset
  , autoAdd
  , autoTurnOutLPlusRail
  , autoTurnOutRPlusRail
  , brakePattern
  , canJoin
  , converterRail
  , crossoverLRail
  , crossoverRRail
  , crossoverShortLRail
  , crossoverShortRRail
  , crossoverTripleLRail
  , crossoverTripleRRail
  , curveLRail
  , curveRRail
  , decodeLayout
  , decodeSignalRules
  , defaultLayout
  , diamondRail
  , doubleToWideLRail
  , doubleToWideRRail
  , doubleTurnoutLPlusRail
  , doubleTurnoutRPlusRail
  , doubleWidthSLRail
  , doubleWidthSRRail
  , encodeLayout
  , encodeSignalRules
  , fixBrokenConnections
  , flipRail
  , flipTrain
  , forceUpdate
  , fromJust
  , getDividingPoint_rel
  , getJointAbsPos
  , getJoints
  , getMarginFromBrakePattern
  , getMaxNotch
  , getNewRailPos
  , getNextSignal
  , getRailNode
  , halfRail
  , halfScissorsLRail
  , halfScissorsRRail
  , halfSlopeRail
  , isArc
  , layoutDrawInfo
  , layoutTick
  , layoutUpdate
  , layoutUpdate_NoManualStop
  , longRail
  , outerCurveLRail
  , outerCurveRRail
  , poszero
  , quarterRail
  , quarterSlopeRail
  , removeRail
  , removeSignal
  , scissorsRail
  , setRailColor
  , shapeLength
  , shapeToData
  , slipShapes
  , slopeCurveLRail
  , slopeCurveRRail
  , slopeRail
  , speedScale
  , splitSize
  , straightRail
  , toDoubleLPlusRail
  , toDoubleRPlusRail
  , toDoubleShortLPlusRail
  , toDoubleShortRPlusRail
  , trainsetDrawInfo
  , trainsetLength
  , tryOpenRouteFor_ffi
  , turnOutLPlusRail
  , turnOutRPlusRail
  )
  where

import Data.Maybe as Ex
import Internal.JSON as Ex
import Internal.Layout as Ex
import Internal.Rails as Ex
import Internal.Types as Ex

import Internal.Layout (CarType, FloorData, IntNode, IntReserve, InvalidRoute, JointData, Layout, RailNode_, RouteQueueElement, Signal, SignalRule, TrainsetDrawInfo, Trainset_)
import Internal.Types (ColorOption, DrawAdditional, DrawRail, IntJoint, IntState, Pos, RailGen, RailShape)
import Data.Maybe (Maybe)
import Data.Newtype (class Newtype)
import Foreign

type Rail = RailGen IntJoint IntState

fromJust ∷ ∀ (a ∷ Type). Partial ⇒ Maybe a → a
fromJust = Ex.fromJust

decodeLayout ∷ { activeReserves ∷ Foreign , floor ∷ Foreign , rails ∷ Foreign , routequeue ∷ Foreign , signals ∷ Foreign , speed ∷ Foreign , time ∷ Foreign , trains ∷ Foreign , version ∷ Int } → Layout
decodeLayout              = Ex.decodeLayout              
decodeSignalRules ∷ Array String → Array SignalRule
decodeSignalRules         = Ex.decodeSignalRules         
defaultLayout ∷ Layout
defaultLayout             = Ex.defaultLayout             
encodeLayout ∷ Layout → { activeReserves ∷ Array { reserveid :: IntReserve , reserver :: Int } , floor ∷ FloorData , rails ∷ Array { color :: Array ColorOption , connections :: Array { from :: IntJoint , jointid :: IntJoint , nodeid :: IntNode } , invalidRoutes :: Array InvalidRoute , nodeid :: IntNode , note :: String , pos :: Pos , rail :: { flipped :: Boolean , name :: String , opposed :: Boolean } , reserves :: Array { jointid :: IntJoint , reserveid :: IntReserve } , signals :: Array { jointid :: IntJoint , manualStop :: Boolean , nodeid :: IntNode , restraint :: Boolean , rules :: Array String , signalname :: String } , state :: IntState } , routequeue ∷ Array RouteQueueElement , speed ∷ Number , time ∷ Number , trains ∷ Array (Trainset_ IntNode) , version ∷ Int }
encodeLayout              = Ex.encodeLayout              
encodeSignalRules ∷ Array SignalRule → Array String
encodeSignalRules         = Ex.encodeSignalRules         
isArc ∷ RailShape Pos → Boolean
isArc                     = Ex.isArc                     
shapeToData ∷ RailShape Pos → Foreign
shapeToData               = Ex.shapeToData               
splitSize ∷ RailShape Pos → Int
splitSize                 = Ex.splitSize                 

-- Internal.Layout
addInvalidRoute ∷ Layout → IntNode → IntJoint → Layout
addInvalidRoute           = Ex.addInvalidRoute           
addJoint ∷ Layout → Pos → IntNode → IntJoint → Layout
addJoint                  = Ex.addJoint                  
addRail ∷ Layout → RailNode_ (Rail) → Maybe Layout
addRail                   = Ex.addRail                   
addSignal ∷ Layout → IntNode → IntJoint → Layout
addSignal                 = Ex.addSignal                 
addTrainset ∷ Layout → IntNode → IntJoint → Array CarType → Layout
addTrainset               = Ex.addTrainset               
autoAdd ∷ Layout → IntNode → IntJoint → Rail → IntJoint → Layout
autoAdd                   = Ex.autoAdd                   
brakePattern ∷ Number → Number → Number
brakePattern              = Ex.brakePattern              
fixBrokenConnections ∷ Layout → Layout
fixBrokenConnections      = Ex.fixBrokenConnections      
flipTrain ∷ Trainset_ (RailNode_ (Rail)) → Trainset_ (RailNode_ (Rail))
flipTrain                 = Ex.flipTrain                 
forceUpdate ∷ Layout → Layout
forceUpdate               = Ex.forceUpdate               
getJointAbsPos ∷ Layout → IntNode → IntJoint → Maybe Pos
getJointAbsPos            = Ex.getJointAbsPos            
getJoints ∷ Layout → Pos → Array JointData
getJoints                 = Ex.getJoints                 
getMaxNotch ∷ Layout → Trainset_ (RailNode_ (Rail)) → Int
getMaxNotch               = Ex.getMaxNotch               
getNewRailPos ∷ Layout → RailNode_ (Rail) → Maybe Pos
getNewRailPos             = Ex.getNewRailPos             
getRailNode ∷ Layout → IntNode → Maybe (RailNode_ Rail)
getRailNode               = Ex.getRailNode
getNextSignal ∷ Layout → Trainset_ (RailNode_ (Rail)) → { distance ∷ Number , sections ∷ Int , signal ∷ Maybe Signal }
getNextSignal             = Ex.searchNextSignal             
getMarginFromBrakePattern ∷ Layout → Trainset_ (RailNode_ (Rail)) → Number
getMarginFromBrakePattern = Ex.getMarginFromBrakePattern
layoutDrawInfo ∷ Layout → { floor ∷ FloorData , invalidRoutes ∷ Array (Array { pos :: Pos , signal :: InvalidRoute } ) , rails ∷ Array { additionals :: Array (DrawAdditional Pos) , instance :: RailNode_ (Rail) , joints :: Array Pos , rails :: Array (DrawRail Pos String) } , signals ∷ Array (Array { indication :: Array Int , pos :: Pos , signal :: Signal } ) , trains ∷ Array TrainsetDrawInfo }
layoutDrawInfo            = Ex.layoutDrawInfo            
layoutTick ∷ Layout → Layout
layoutTick                = Ex.layoutTick                
layoutUpdate ∷ Layout → Layout
layoutUpdate              = Ex.layoutUpdate              
layoutUpdate_NoManualStop ∷ Layout → Layout
layoutUpdate_NoManualStop = Ex.layoutUpdate_NoManualStop 
removeRail ∷ Layout → IntNode → Layout
removeRail                = Ex.removeRail                
removeSignal ∷ Layout → IntNode → IntJoint → Layout
removeSignal              = Ex.removeSignal              
speedScale ∷ Number
speedScale                = Ex.speedScale                
setRailColor ∷ Layout → IntNode → Array ColorOption → Layout
setRailColor              = Ex.setRailColor
trainsetDrawInfo ∷ Trainset_ (RailNode_ (Rail)) → TrainsetDrawInfo
trainsetDrawInfo          = Ex.trainsetDrawInfo          
trainsetLength ∷ ∀ (t ∷ Type). Trainset_ t → Number
trainsetLength            = Ex.trainsetLength            
tryOpenRouteFor_ffi ∷ Layout → IntNode → IntJoint → Int → { layout ∷ Layout , result ∷ Boolean }
tryOpenRouteFor_ffi       = Ex.tryOpenRouteFor_ffi       

-- Internal.Rails
autoTurnOutLPlusRail ∷ Rail
autoTurnOutLPlusRail      = Ex.autoTurnOutLPlusRail      
autoTurnOutRPlusRail ∷ Rail
autoTurnOutRPlusRail      = Ex.autoTurnOutRPlusRail      
converterRail ∷ Rail
converterRail             = Ex.converterRail             
crossoverLRail ∷ Rail
crossoverLRail            = Ex.crossoverLRail            
crossoverRRail ∷ Rail
crossoverRRail            = Ex.crossoverRRail            
crossoverShortLRail ∷ Rail
crossoverShortLRail      = Ex.crossoverShortLRail
crossoverShortRRail ∷ Rail
crossoverShortRRail      = Ex.crossoverShortRRail
crossoverTripleLRail ∷ Rail
crossoverTripleLRail      = Ex.crossoverTripleLRail
crossoverTripleRRail ∷ Rail
crossoverTripleRRail      = Ex.crossoverTripleRRail
curveLRail ∷ Rail
curveLRail                = Ex.curveLRail                
curveRRail ∷ Rail
curveRRail                = Ex.curveRRail                
diamondRail ∷ Rail
diamondRail               = Ex.diamondRail               
doubleToWideLRail ∷ Rail
doubleToWideLRail         = Ex.doubleToWideLRail         
doubleToWideRRail ∷ Rail
doubleToWideRRail         = Ex.doubleToWideRRail         
doubleTurnoutLPlusRail ∷ Rail
doubleTurnoutLPlusRail    = Ex.doubleTurnoutLPlusRail    
doubleTurnoutRPlusRail ∷ Rail
doubleTurnoutRPlusRail    = Ex.doubleTurnoutRPlusRail    
doubleWidthSLRail ∷ Rail
doubleWidthSLRail         = Ex.doubleWidthSLRail         
doubleWidthSRRail ∷ Rail
doubleWidthSRRail         = Ex.doubleWidthSRRail         
halfRail ∷ Rail
halfRail                  = Ex.halfRail                  
longRail ∷ Rail
longRail                  = Ex.longRail                  
outerCurveLRail ∷ Rail
outerCurveLRail           = Ex.outerCurveLRail           
outerCurveRRail ∷ Rail
outerCurveRRail           = Ex.outerCurveRRail           
quarterRail ∷ Rail
quarterRail               = Ex.quarterRail               
scissorsRail ∷ Rail
scissorsRail              = Ex.scissorsRail              
slopeCurveLRail ∷ Rail
slopeCurveLRail           = Ex.slopeCurveLRail           
slopeCurveRRail ∷ Rail
slopeCurveRRail           = Ex.slopeCurveRRail           
slopeRail ∷ Rail
slopeRail                 = Ex.slopeRail                 
straightRail ∷ Rail
straightRail              = Ex.straightRail              
toDoubleLPlusRail ∷ Rail
toDoubleLPlusRail         = Ex.toDoubleLPlusRail         
toDoubleRPlusRail ∷ Rail
toDoubleRPlusRail         = Ex.toDoubleRPlusRail         
toDoubleShortLPlusRail ∷ Rail
toDoubleShortLPlusRail    = Ex.toDoubleShortLPlusRail
toDoubleShortRPlusRail ∷ Rail
toDoubleShortRPlusRail    = Ex.toDoubleShortRPlusRail
halfScissorsLRail ∷ Rail
halfScissorsLRail         = Ex.halfScissorsLRail
halfScissorsRRail ∷ Rail
halfScissorsRRail         = Ex.halfScissorsRRail
turnOutLPlusRail ∷ Rail
turnOutLPlusRail          = Ex.turnOutLPlusRail          
turnOutRPlusRail ∷ Rail
turnOutRPlusRail          = Ex.turnOutRPlusRail          
halfSlopeRail ∷ Rail
halfSlopeRail             = Ex.halfSlopeRail
quarterSlopeRail ∷ Rail
quarterSlopeRail          = Ex.quarterSlopeRail

-- Internal.Types         = Ex.-- Internal.Types         
canJoin ∷ Pos → Pos → Boolean
canJoin                   = Ex.canJoin                   
flipRail ∷ Rail → Rail
flipRail                  = Ex.flipRail                  
getDividingPoint_rel ∷ Pos → Pos → Number → Number → Pos
getDividingPoint_rel      = Ex.getDividingPoint_rel      
poszero ∷ Pos
poszero                   = Ex.poszero                   
shapeLength ∷ RailShape Pos → Number
shapeLength               = Ex.shapeLength               
slipShapes ∷ ∀ (x ∷ Type). Newtype x Pos ⇒ { end ∷ x , start ∷ x } → Array (RailShape x)
slipShapes                = Ex.slipShapes                
