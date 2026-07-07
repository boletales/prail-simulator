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

type SerializableRail = RailGen IntJoint IntState

fromJust ∷ ∀ (a ∷ Type). Partial ⇒ Maybe a → a
fromJust = Ex.fromJust

decodeLayout ∷ { activeReserves ∷ Foreign , floor ∷ Foreign , rails ∷ Foreign , routequeue ∷ Foreign , signals ∷ Foreign , speed ∷ Foreign , time ∷ Foreign , trains ∷ Foreign , version ∷ Int } → Layout
decodeLayout              = Ex.decodeLayout              
decodeSignalRules ∷ Array String → Array SignalRule
decodeSignalRules         = Ex.decodeSignalRules         
defaultLayout ∷ Layout
defaultLayout             = Ex.defaultLayout             
encodeLayout ∷ Layout → { activeReserves ∷ Array { reserveid :: IntReserve , reserver :: Int } , floor ∷ FloorData , rails ∷ Array { color :: Array ColorOption , connections :: Array { from :: IntJoint , jointid :: IntJoint , nodeid :: IntNode } , instanceid :: Int , invalidRoutes :: Array InvalidRoute , nodeid :: IntNode , note :: String , pos :: Pos , rail :: { flipped :: Boolean , name :: String , opposed :: Boolean } , reserves :: Array { jointid :: IntJoint , reserveid :: IntReserve } , signals :: Array { jointid :: IntJoint , manualStop :: Boolean , nodeid :: IntNode , restraint :: Boolean , rules :: Array String , signalname :: String } , state :: IntState } , routequeue ∷ Array RouteQueueElement , speed ∷ Number , time ∷ Number , trains ∷ Array (Trainset_ Int) , version ∷ Int }
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
addRail ∷ Layout → RailNode_ (SerializableRail) → Maybe Layout
addRail                   = Ex.addRail                   
addSignal ∷ Layout → IntNode → IntJoint → Layout
addSignal                 = Ex.addSignal                 
addTrainset ∷ Layout → Int → IntJoint → Array CarType → Layout
addTrainset               = Ex.addTrainset               
autoAdd ∷ Layout → IntNode → IntJoint → SerializableRail → IntJoint → Layout
autoAdd                   = Ex.autoAdd                   
brakePattern ∷ Number → Number → Number
brakePattern              = Ex.brakePattern              
fixBrokenConnections ∷ Layout → Layout
fixBrokenConnections      = Ex.fixBrokenConnections      
flipTrain ∷ Trainset_ (RailNode_ (SerializableRail)) → Trainset_ (RailNode_ (SerializableRail))
flipTrain                 = Ex.flipTrain                 
forceUpdate ∷ Layout → Layout
forceUpdate               = Ex.forceUpdate               
getJointAbsPos ∷ Layout → IntNode → IntJoint → Maybe Pos
getJointAbsPos            = Ex.getJointAbsPos            
getJoints ∷ Layout → Pos → Array JointData
getJoints                 = Ex.getJoints                 
getMaxNotch ∷ Layout → Trainset_ (RailNode_ (SerializableRail)) → Int
getMaxNotch               = Ex.getMaxNotch               
getNewRailPos ∷ Layout → RailNode_ (SerializableRail) → Maybe Pos
getNewRailPos             = Ex.getNewRailPos             
getNextSignal ∷ Layout → Trainset_ (RailNode_ (SerializableRail)) → { distance ∷ Number , sections ∷ Int , signal ∷ Maybe Signal }
getNextSignal             = Ex.getNextSignal             
getMarginFromBrakePattern ∷ Layout → Trainset_ (RailNode_ (SerializableRail)) → Number
getMarginFromBrakePattern = Ex.getMarginFromBrakePattern
layoutDrawInfo ∷ Layout → { floor ∷ FloorData , invalidRoutes ∷ Array (Array { pos :: Pos , signal :: InvalidRoute } ) , rails ∷ Array { additionals :: Array (DrawAdditional Pos) , instance :: RailNode_ (SerializableRail) , joints :: Array Pos , rails :: Array (DrawRail Pos String) } , signals ∷ Array (Array { indication :: Array Int , pos :: Pos , signal :: Signal } ) , trains ∷ Array TrainsetDrawInfo }
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
trainsetDrawInfo ∷ Trainset_ (RailNode_ (SerializableRail)) → TrainsetDrawInfo
trainsetDrawInfo          = Ex.trainsetDrawInfo          
trainsetLength ∷ ∀ (t ∷ Type). Trainset_ t → Number
trainsetLength            = Ex.trainsetLength            
tryOpenRouteFor_ffi ∷ Layout → IntNode → IntJoint → Int → { layout ∷ Layout , result ∷ Boolean }
tryOpenRouteFor_ffi       = Ex.tryOpenRouteFor_ffi       

-- Internal.Rails
autoTurnOutLPlusRail ∷ SerializableRail
autoTurnOutLPlusRail      = Ex.autoTurnOutLPlusRail      
autoTurnOutRPlusRail ∷ SerializableRail
autoTurnOutRPlusRail      = Ex.autoTurnOutRPlusRail      
converterRail ∷ SerializableRail
converterRail             = Ex.converterRail             
crossoverLRail ∷ SerializableRail
crossoverLRail            = Ex.crossoverLRail            
crossoverRRail ∷ SerializableRail
crossoverRRail            = Ex.crossoverRRail            
crossoverShortLRail ∷ SerializableRail
crossoverShortLRail      = Ex.crossoverShortLRail
crossoverShortRRail ∷ SerializableRail
crossoverShortRRail      = Ex.crossoverShortRRail
crossoverTripleLRail ∷ SerializableRail
crossoverTripleLRail      = Ex.crossoverTripleLRail
crossoverTripleRRail ∷ SerializableRail
crossoverTripleRRail      = Ex.crossoverTripleRRail
curveLRail ∷ SerializableRail
curveLRail                = Ex.curveLRail                
curveRRail ∷ SerializableRail
curveRRail                = Ex.curveRRail                
diamondRail ∷ SerializableRail
diamondRail               = Ex.diamondRail               
doubleToWideLRail ∷ SerializableRail
doubleToWideLRail         = Ex.doubleToWideLRail         
doubleToWideRRail ∷ SerializableRail
doubleToWideRRail         = Ex.doubleToWideRRail         
doubleTurnoutLPlusRail ∷ SerializableRail
doubleTurnoutLPlusRail    = Ex.doubleTurnoutLPlusRail    
doubleTurnoutRPlusRail ∷ SerializableRail
doubleTurnoutRPlusRail    = Ex.doubleTurnoutRPlusRail    
doubleWidthSLRail ∷ SerializableRail
doubleWidthSLRail         = Ex.doubleWidthSLRail         
doubleWidthSRRail ∷ SerializableRail
doubleWidthSRRail         = Ex.doubleWidthSRRail         
halfRail ∷ SerializableRail
halfRail                  = Ex.halfRail                  
longRail ∷ SerializableRail
longRail                  = Ex.longRail                  
outerCurveLRail ∷ SerializableRail
outerCurveLRail           = Ex.outerCurveLRail           
outerCurveRRail ∷ SerializableRail
outerCurveRRail           = Ex.outerCurveRRail           
quarterRail ∷ SerializableRail
quarterRail               = Ex.quarterRail               
scissorsRail ∷ SerializableRail
scissorsRail              = Ex.scissorsRail              
slopeCurveLRail ∷ SerializableRail
slopeCurveLRail           = Ex.slopeCurveLRail           
slopeCurveRRail ∷ SerializableRail
slopeCurveRRail           = Ex.slopeCurveRRail           
slopeRail ∷ SerializableRail
slopeRail                 = Ex.slopeRail                 
straightRail ∷ SerializableRail
straightRail              = Ex.straightRail              
toDoubleLPlusRail ∷ SerializableRail
toDoubleLPlusRail         = Ex.toDoubleLPlusRail         
toDoubleRPlusRail ∷ SerializableRail
toDoubleRPlusRail         = Ex.toDoubleRPlusRail         
toDoubleShortLPlusRail ∷ SerializableRail
toDoubleShortLPlusRail    = Ex.toDoubleShortLPlusRail
toDoubleShortRPlusRail ∷ SerializableRail
toDoubleShortRPlusRail    = Ex.toDoubleShortRPlusRail
halfScissorsLRail ∷ SerializableRail
halfScissorsLRail         = Ex.halfScissorsLRail
halfScissorsRRail ∷ SerializableRail
halfScissorsRRail         = Ex.halfScissorsRRail
turnOutLPlusRail ∷ SerializableRail
turnOutLPlusRail          = Ex.turnOutLPlusRail          
turnOutRPlusRail ∷ SerializableRail
turnOutRPlusRail          = Ex.turnOutRPlusRail          
halfSlopeRail ∷ SerializableRail
halfSlopeRail             = Ex.halfSlopeRail
quarterSlopeRail ∷ SerializableRail
quarterSlopeRail          = Ex.quarterSlopeRail

-- Internal.Types         = Ex.-- Internal.Types         
canJoin ∷ Pos → Pos → Boolean
canJoin                   = Ex.canJoin                   
flipRail ∷ SerializableRail → SerializableRail
flipRail                  = Ex.flipRail                  
getDividingPoint_rel ∷ Pos → Pos → Number → Number → Pos
getDividingPoint_rel      = Ex.getDividingPoint_rel      
poszero ∷ Pos
poszero                   = Ex.poszero                   
shapeLength ∷ RailShape Pos → Number
shapeLength               = Ex.shapeLength               
slipShapes ∷ ∀ (x ∷ Type). Newtype x Pos ⇒ { end ∷ x , start ∷ x } → Array (RailShape x)
slipShapes                = Ex.slipShapes                
