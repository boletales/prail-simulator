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
import Internal.Rails (crossoverTripleLRail)
import Internal.Rails as Ex
import Internal.Types as Ex

fromJust = Ex.fromJust

decodeLayout              = Ex.decodeLayout              
decodeSignalRules         = Ex.decodeSignalRules         
defaultLayout             = Ex.defaultLayout             
encodeLayout              = Ex.encodeLayout              
encodeSignalRules         = Ex.encodeSignalRules         
isArc                     = Ex.isArc                     
shapeToData               = Ex.shapeToData               
splitSize                 = Ex.splitSize                 

-- Internal.Layout
addInvalidRoute           = Ex.addInvalidRoute           
addJoint                  = Ex.addJoint                  
addRail                   = Ex.addRail                   
addSignal                 = Ex.addSignal                 
addTrainset               = Ex.addTrainset               
autoAdd                   = Ex.autoAdd                   
brakePattern              = Ex.brakePattern              
fixBrokenConnections      = Ex.fixBrokenConnections      
flipTrain                 = Ex.flipTrain                 
forceUpdate               = Ex.forceUpdate               
getJointAbsPos            = Ex.getJointAbsPos            
getJoints                 = Ex.getJoints                 
getMaxNotch               = Ex.getMaxNotch               
getNewRailPos             = Ex.getNewRailPos             
getNextSignal             = Ex.getNextSignal             
getMarginFromBrakePattern = Ex.getMarginFromBrakePattern
layoutDrawInfo            = Ex.layoutDrawInfo            
layoutTick                = Ex.layoutTick                
layoutUpdate              = Ex.layoutUpdate              
layoutUpdate_NoManualStop = Ex.layoutUpdate_NoManualStop 
removeRail                = Ex.removeRail                
removeSignal              = Ex.removeSignal              
speedScale                = Ex.speedScale                
setRailColor              = Ex.setRailColor
trainsetDrawInfo          = Ex.trainsetDrawInfo          
trainsetLength            = Ex.trainsetLength            
tryOpenRouteFor_ffi       = Ex.tryOpenRouteFor_ffi       

-- Internal.Rails
autoTurnOutLPlusRail      = Ex.autoTurnOutLPlusRail      
autoTurnOutRPlusRail      = Ex.autoTurnOutRPlusRail      
converterRail             = Ex.converterRail             
crossoverLRail            = Ex.crossoverLRail            
crossoverRRail            = Ex.crossoverRRail            
crossoverTripleLRail      = Ex.crossoverTripleLRail
crossoverTripleRRail      = Ex.crossoverTripleRRail
curveLRail                = Ex.curveLRail                
curveRRail                = Ex.curveRRail                
diamondRail               = Ex.diamondRail               
doubleToWideLRail         = Ex.doubleToWideLRail         
doubleToWideRRail         = Ex.doubleToWideRRail         
doubleTurnoutLPlusRail    = Ex.doubleTurnoutLPlusRail    
doubleTurnoutRPlusRail    = Ex.doubleTurnoutRPlusRail    
doubleWidthSLRail         = Ex.doubleWidthSLRail         
doubleWidthSRRail         = Ex.doubleWidthSRRail         
halfRail                  = Ex.halfRail                  
longRail                  = Ex.longRail                  
outerCurveLRail           = Ex.outerCurveLRail           
outerCurveRRail           = Ex.outerCurveRRail           
quarterRail               = Ex.quarterRail               
scissorsRail              = Ex.scissorsRail              
slopeCurveLRail           = Ex.slopeCurveLRail           
slopeCurveRRail           = Ex.slopeCurveRRail           
slopeRail                 = Ex.slopeRail                 
straightRail              = Ex.straightRail              
toDoubleLPlusRail         = Ex.toDoubleLPlusRail         
toDoubleRPlusRail         = Ex.toDoubleRPlusRail         
turnOutLPlusRail          = Ex.turnOutLPlusRail          
turnOutRPlusRail          = Ex.turnOutRPlusRail          
halfSlopeRail             = Ex.halfSlopeRail
quarterSlopeRail          = Ex.quarterSlopeRail

-- Internal.Types         = Ex.-- Internal.Types         
canJoin                   = Ex.canJoin                   
flipRail                  = Ex.flipRail                  
getDividingPoint_rel      = Ex.getDividingPoint_rel      
poszero                   = Ex.poszero                   
shapeLength               = Ex.shapeLength               
slipShapes                = Ex.slipShapes                
