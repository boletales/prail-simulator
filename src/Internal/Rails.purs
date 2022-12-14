module Internal.Rails
  ( JointsDouble(..)
  , JointsDoublePoint(..)
  , JointsPoint(..)
  , JointsSimple(..)
  , StateScissors(..)
  , StatesAutoPoint(..)
  , StatesCrossOver(..)
  , StatesDoublePoint(..)
  , StatesPoint(..)
  , StatesSolid(..)
  , autoTurnOutLPlusRail
  , autoTurnOutRPlusRail
  , converterRail
  , curveLRail
  , curveRRail
  , doubleToWideLRail
  , doubleToWideRRail
  , doubleTurnoutLPlusRail
  , doubleTurnoutRPlusRail
  , doubleWidthSLRail
  , doubleWidthSRRail
  , halfRail
  , longRail
  , outerCurveLRail
  , outerCurveRRail
  , quarterRail
  , scissorsRail
  , slopeCurveLRail
  , slopeCurveRRail
  , slopeRail
  , straightRail
  , toDoubleLPlusRail
  , toDoubleRPlusRail
  , turnOutLPlusRail
  , turnOutRPlusRail
  )
  where

import Data.Generic.Rep
import Data.Maybe
import Data.Newtype
import Data.Number
import Prelude
import Type.Proxy
import Data.Array

import Data.Symbol (class IsSymbol)
import Data.Traversable (scanl)
import Record as R
import Type.Row as R
import Type.RowList as RL

import Internal.Types




data StatesSolid       = StateSolid
derive instance Eq StatesSolid
derive instance genericStatesSolid       :: Generic StatesSolid       _
instance Default StatesSolid       where
  default = StateSolid

newtype StatesPoint       = StatePoint {turnout :: Boolean}
derive instance Eq StatesPoint
derive instance Newtype StatesPoint _
derive instance genericStatesPoint       :: Generic StatesPoint       _
instance Default  StatesPoint       where
  default = StatePoint {turnout : false}

newtype StatesDoublePoint = StateDP {innerturnout :: Boolean, outerturnout :: Boolean}
derive instance Eq StatesDoublePoint
derive instance Newtype StatesDoublePoint _
derive instance genericStatesDoublePoint :: Generic StatesDoublePoint _
instance Default  StatesDoublePoint where
  default = StateDP {innerturnout : false, outerturnout : false}

newtype StatesCrossOver   = StateCO {innerturnout :: Boolean, outerturnout :: Boolean}
derive instance Eq StatesCrossOver
derive instance Newtype StatesCrossOver _
derive instance genericStatesCrossOver   :: Generic StatesCrossOver   _
instance Default  StatesCrossOver   where
  default = StateCO {innerturnout : false, outerturnout : false}

newtype StatesAutoPoint   = StateAP {turnout :: Boolean, auto :: Boolean}
derive instance Eq StatesAutoPoint
derive instance Newtype StatesAutoPoint _
derive instance genericStatesAutoPoint   :: Generic StatesAutoPoint   _
instance Default  StatesAutoPoint   where
  default = StateAP {turnout : false, auto : false}


data StateScissors   = StateSP_P | StateSP_S | StateSP_N
derive instance Eq StateScissors
derive instance genericStateScissors   :: Generic StateScissors   _
instance Default  StateScissors   where
  default = StateSP_S


data JointsSimple      = JointBegin | JointEnd
derive instance Eq JointsSimple
derive instance genericJointsSimple     :: Generic JointsSimple      _
data JointsPoint       = JointEnter | JointMain | JointSub
derive instance Eq JointsPoint
derive instance genericJointsPoint      :: Generic JointsPoint       _
data JointsDouble      = JointOuterBegin | JointInnerEnd | JointInnerBegin | JointOuterEnd
derive instance Eq JointsDouble
derive instance genericJointsDouble     :: Generic JointsDouble      _
data JointsDoublePoint = JointOuterEnter | JointInnerEnter | JointInnerMain | JointOuterMain | JointInnerSub | JointOuterSub
derive instance Eq JointsDoublePoint
derive instance genericJointsDoublePoint:: Generic JointsDoublePoint _


noAdditionals x =  DrawInfo {rails: x, additionals: []}

straightRail :: Rail
straightRail = 
  let pb = RelPos (Pos {coord: Coord{x: 0.0, y: 0.0, z:0.0}, angle: angle8 4, isPlus: false})
      pe = RelPos (Pos {coord: Coord{x: 1.0, y: 0.0, z:0.0}, angle: angle8 0, isPlus: true})
      r0 = [railShape {start: pb, end:pe}]
  in toRail $ RailGen {
      name : "straight"
      ,flipped : false
      ,opposed : false
      ,getDrawInfo : \_ ->
         noAdditionals $ blueRail <$> r0
      ,defaultState : StateSolid
      ,getJoints    : serialAll
      ,getStates    : serialAll
      ,getOrigin    : JointBegin
      ,getJointPos : \j -> case j of
        JointBegin -> pb
        JointEnd   -> pe
      ,getNewState : \j s -> case j of
        JointBegin -> {newjoint: JointEnd  , newstate:s, shape: r0}
        JointEnd   -> {newjoint: JointBegin, newstate:s, shape: reverseShapes r0}

      ,getRoute  : \s f t  -> if f /= t then Just s else Nothing
      ,isLocked  : \j s s' -> false
      ,isBlocked : \j s j' -> true
      ,isSimple  : true
    }

longRail :: Rail
longRail = 
  let pb = RelPos (Pos {coord: Coord{x: 0.0, y: 0.0, z:0.0}, angle: angle8 4, isPlus: false})
      pe = RelPos (Pos {coord: Coord{x: 2.0, y: 0.0, z:0.0}, angle: angle8 0, isPlus: true})
      r0 = [railShape {start: pb, end:pe}]
  in toRail $ RailGen {
      name : "long"
      ,flipped : false
      ,opposed : false
      ,getDrawInfo : \_ ->
         noAdditionals $ blueRail <$> r0
      ,defaultState : StateSolid
      ,getJoints    : serialAll
      ,getStates    : serialAll
      ,getOrigin    : JointBegin
      ,getJointPos : \j -> case j of
        JointBegin -> pb
        JointEnd   -> pe
      ,getNewState : \j s -> case j of
        JointBegin -> {newjoint: JointEnd  , newstate:s, shape: r0}
        JointEnd   -> {newjoint: JointBegin, newstate:s, shape: reverseShapes r0}

      ,getRoute  : \s f t  -> if f /= t then Just s else Nothing
      ,isLocked  : \j s s' -> false
      ,isBlocked : \j s j' -> true
      ,isSimple  : true
    }

halfRail :: Rail
halfRail = 
  let pb = RelPos (Pos {coord: Coord{x: 0.0, y: 0.0, z:0.0}, angle: angle8 4, isPlus: false})
      pe = RelPos (Pos {coord: Coord{x: 0.5, y: 0.0, z:0.0}, angle: angle8 0, isPlus: true})
      r0 = [railShape {start: pb, end:pe}]
  in toRail $ RailGen {
      name : "half"
      ,flipped : false
      ,opposed : false
      ,getDrawInfo : \_ ->
         noAdditionals $ blueRail <$> r0
      ,defaultState : StateSolid
      ,getJoints    : serialAll
      ,getStates    : serialAll
      ,getOrigin    : JointBegin
      ,getJointPos : \j -> case j of
        JointBegin -> pb
        JointEnd   -> pe
      ,getNewState : \j s -> case j of
        JointBegin -> {newjoint: JointEnd  , newstate:s, shape: r0}
        JointEnd   -> {newjoint: JointBegin, newstate:s, shape: reverseShapes r0}
        
      ,getRoute  : \s f t  -> if f /= t then Just s else Nothing
      ,isLocked  : \j s s' -> false
      ,isBlocked : \j s j' -> true
      ,isSimple  : true
    }

quarterRail :: Rail
quarterRail = 
  let pb = RelPos (Pos {coord: Coord{x: 0.0, y: 0.0, z:0.0}, angle: angle8 4, isPlus: false})
      pe = RelPos (Pos {coord: Coord{x: 0.25, y: 0.0, z:0.0}, angle: angle8 0, isPlus: true})
      r0 = [railShape {start: pb, end:pe}]
  in toRail $ RailGen {
      name : "quarter"
      ,flipped : false
      ,opposed : false
      ,getDrawInfo : \_ ->
         noAdditionals $ blueRail <$> r0
      ,defaultState : StateSolid
      ,getJoints    : serialAll
      ,getStates    : serialAll
      ,getOrigin    : JointBegin
      ,getJointPos : \j -> case j of
        JointBegin -> pb
        JointEnd   -> pe
      ,getNewState : \j s -> case j of
        JointBegin -> {newjoint: JointEnd  , newstate:s, shape: r0}
        JointEnd   -> {newjoint: JointBegin, newstate:s, shape: reverseShapes r0}
        
      ,getRoute  : \s f t  -> if f /= t then Just s else Nothing
      ,isLocked  : \j s s' -> false
      ,isBlocked : \j s j' -> true
      ,isSimple  : true
    }
converterRail :: Rail
converterRail = 
  let pb = RelPos (Pos {coord: Coord{x: 0.0, y: 0.0, z:0.0}, angle: angle8 4, isPlus: false})
      pe = RelPos (Pos {coord: Coord{x: 0.25, y: 0.0, z:0.0}, angle: angle8 0, isPlus: false})
      r0 = [railShape {start: pb, end:pe}]
  in toRail $ RailGen {
      name : "converter"
      ,flipped : false
      ,opposed : false
      ,getDrawInfo : \_ ->
         noAdditionals $ blueRail <$> r0
      ,defaultState : StateSolid
      ,getJoints    : serialAll
      ,getStates    : serialAll
      ,getOrigin    : JointBegin
      ,getJointPos : \j -> case j of
        JointBegin -> pb
        JointEnd   -> pe
      ,getNewState : \j s -> case j of
        JointBegin -> {newjoint: JointEnd  , newstate:s, shape: r0}
        JointEnd   -> {newjoint: JointBegin, newstate:s, shape: reverseShapes r0}
        
      ,getRoute  : \s f t  -> if f /= t then Just s else Nothing
      ,isLocked  : \j s s' -> false
      ,isBlocked : \j s j' -> true
      ,isSimple  : true
    }
slopeRail :: Rail
slopeRail = 
  let pb = RelPos (Pos {coord: Coord{x: 0.0, y: 0.0, z:0.0}, angle: angle8 4, isPlus: false})
      pe = RelPos (Pos {coord: Coord{x: 2.0, y: 0.0, z:1.0}, angle: angle8 0, isPlus: true})
      r0 = [railShape {start: pb, end:pe}]
  in toRail $ RailGen {
      name : "slope"
      ,flipped : false
      ,opposed : false
      ,getDrawInfo : \_ ->
        noAdditionals $ blueRail <$> r0
      ,defaultState : StateSolid
      ,getJoints    : serialAll
      ,getStates    : serialAll
      ,getOrigin    : JointBegin
      ,getJointPos : \j -> case j of
        JointBegin -> pb
        JointEnd   -> pe
      ,getNewState : \j s -> case j of
        JointBegin -> {newjoint: JointEnd  , newstate:s, shape:               r0}
        JointEnd   -> {newjoint: JointBegin, newstate:s, shape: reverseShapes r0}
        
      ,getRoute  : \s f t  -> if f /= t then Just s else Nothing
      ,isLocked  : \j s s' -> false
      ,isBlocked : \j s j' -> true
      ,isSimple  : true
    }

curveLRail :: Rail
curveLRail = 
  let pb = RelPos (Pos {coord: Coord{x: 0.0     , y: 0.0           , z:0.0}, angle: angle8 4, isPlus: false})
      pe = RelPos (Pos {coord: Coord{x: sqrt 0.5, y: 1.0 - sqrt 0.5, z:0.0}, angle: angle8 1, isPlus: true}) 
      r0 = [railShape {start: pb, end:pe}]
  in toRail $ RailGen {
    name : "curve"
    ,flipped : false
    ,opposed : false
    ,getDrawInfo : \_ ->
      noAdditionals $ blueRail <$> r0
    ,defaultState : StateSolid
    ,getJoints    : serialAll
    ,getStates    : serialAll
    ,getOrigin    : JointBegin
    ,getJointPos : \j -> case j of
      JointBegin -> pb
      JointEnd   -> pe
    ,getNewState : \j s -> case j of
        JointBegin -> {newjoint: JointEnd  , newstate:s, shape:               r0}
        JointEnd   -> {newjoint: JointBegin, newstate:s, shape: reverseShapes r0}
        
    ,getRoute  : \s f t  -> if f /= t then Just s else Nothing
    ,isLocked  : \j s s' -> false
    ,isBlocked : \j s j' -> true
    ,isSimple  : true
  }

curveRRail ∷ RailGen Int Int
curveRRail = flipRail curveLRail

slopeCurveLRail :: Rail
slopeCurveLRail = 
  let pb = RelPos (Pos {coord: Coord{x: 0.0     , y: 0.0           , z:0.0}, angle: angle8 4, isPlus: false})
      pe = RelPos (Pos {coord: Coord{x: sqrt 0.5, y: 1.0 - sqrt 0.5, z:0.25}, angle: angle8 1, isPlus: true}) 
      r0 = [railShape {start: pb, end:pe}]
  in toRail $ RailGen {
    name : "slopecurve"
    ,flipped : false
    ,opposed : false
    ,getDrawInfo : \_ ->
      noAdditionals $ blueRail <$> r0
    ,defaultState : StateSolid
    ,getJoints    : serialAll
    ,getStates    : serialAll
    ,getOrigin    : JointBegin
    ,getJointPos : \j -> case j of
      JointBegin -> pb
      JointEnd   -> pe
    ,getNewState : \j s -> case j of
        JointBegin -> {newjoint: JointEnd  , newstate:s, shape:               r0}
        JointEnd   -> {newjoint: JointBegin, newstate:s, shape: reverseShapes r0}
        
    ,getRoute  : \s f t  -> if f /= t then Just s else Nothing
    ,isLocked  : \j s s' -> false
    ,isBlocked : \j s j' -> true
    ,isSimple  : true
  }
slopeCurveRRail ∷ RailGen Int Int
slopeCurveRRail = flipRail slopeCurveLRail

outerCurveLRail :: Rail
outerCurveLRail = 
  let scale = 1.0 + doubleRailWidth
      pb = RelPos (Pos {coord: Coord{x: 0.0             , y: 0.0                   , z:0.0}, angle: angle8 4, isPlus: false})
      pe = RelPos (Pos {coord: Coord{x: (sqrt 0.5)*scale, y: (1.0 - sqrt 0.5)*scale, z:0.0}, angle: angle8 1, isPlus: true}) 
      r0 = [railShape {start :pb, end: pe}]
  in toRail $ RailGen {
    name : "outercurve"
    ,flipped : false
    ,opposed : false
    ,getDrawInfo : \_ ->
      noAdditionals $ blueRail <$> r0
    ,defaultState : StateSolid
    ,getJoints    : serialAll
    ,getStates    : serialAll
    ,getOrigin    : JointBegin
    ,getJointPos : \j -> case j of
      JointBegin -> pb
      JointEnd   -> pe
    ,getNewState : \j s -> case j of
      JointBegin -> {newjoint: JointEnd  , newstate:s, shape: r0}
      JointEnd   -> {newjoint: JointBegin, newstate:s, shape: reverseShapes r0}

    ,getRoute  : \s f t  -> if f /= t then Just s else Nothing
    ,isLocked  : \j s s' -> false
    ,isBlocked : \j s j' -> true
    ,isSimple  : true
  }

outerCurveRRail = flipRail outerCurveLRail


doubleWidthSLRail :: Rail
doubleWidthSLRail = 
  let anglep = fromRadian $ calcMidAngle 1.0 doubleRailWidth
      pe  = RelPos (Pos {coord: Coord{x: 0.0, y: 0.0                , z:0.0}, angle: angle8 4            , isPlus: false})
      ps  = RelPos (Pos {coord: Coord{x: 1.0, y: doubleRailWidth    , z:0.0}, angle: angle8 0            , isPlus: true })
      r1 = slipShapes {start: pe, end: ps}
  in toRail $ RailGen {
      name : "doublewidths"
      ,flipped : false
      ,opposed : false
      ,getDrawInfo : \_ ->
        noAdditionals $ blueRail <$> r1
      ,defaultState : StateSolid
      ,getJoints    : serialAll
      ,getStates    : serialAll
      ,getOrigin    : JointBegin
      ,getJointPos : \j -> case j of
        JointBegin -> pe
        JointEnd   -> ps
      ,getNewState : \j s -> case j of
        JointEnd   -> {newjoint: JointBegin, newstate: s, shape: reverseShapes r1}
        JointBegin -> 
             {newjoint: JointEnd , newstate:s, shape: r1}

      ,getRoute  : \s f t  -> 
                      case f of
                        JointBegin ->
                          case t of
                            JointBegin -> Nothing
                            JointEnd   -> Just s
                        JointEnd ->
                          case t of
                            JointBegin -> Just s
                            JointEnd   -> Nothing
      ,isLocked  : \j s s' -> false
      ,isBlocked : \j s j' -> true
      ,isSimple  : true
    }

doubleWidthSRRail ∷ RailGen Int Int
doubleWidthSRRail = flipRail doubleWidthSLRail

turnOutLPlusRail :: Rail
turnOutLPlusRail = 
  let pe  = RelPos (Pos {coord: Coord{x: 0.0     , y: 0.0           , z:0.0}, angle: angle8 4, isPlus: false})
      pm  = RelPos (Pos {coord: Coord{x: 1.0     , y: 0.0           , z:0.0}, angle: angle8 0, isPlus: true })
      ps  = RelPos (Pos {coord: Coord{x: sqrt 0.5, y: 1.0 - sqrt 0.5, z:0.0}, angle: angle8 1, isPlus: true})
      r0 = [railShape {start: pe, end:pm}]
      r1 = [railShape {start: pe, end:ps}]
  in toRail $ RailGen {
      name : "turnout"
      ,flipped : false
      ,opposed : false
      ,getDrawInfo : \(StatePoint s) ->
        if s.turnout
        then noAdditionals $ join [grayRail <$> r0, blueRail <$> r1]
        else noAdditionals $ join [grayRail <$> r1, blueRail <$> r0]
      ,defaultState : StatePoint {turnout: false}
      ,getJoints    : serialAll
      ,getStates    : serialAll
      ,getOrigin    : JointEnter
      ,getJointPos : \j -> case j of
        JointEnter -> pe
        JointMain  -> pm
        JointSub   -> ps
      ,getNewState : \j (StatePoint s) -> case j of
        JointMain  -> {newjoint: JointEnter, newstate: StatePoint {turnout: false}, shape: reverseShapes r0}
        JointSub   -> {newjoint: JointEnter, newstate: StatePoint {turnout: true }, shape: reverseShapes r1}
        JointEnter -> 
          if s.turnout
            then {newjoint: JointSub , newstate:StatePoint s, shape: r1}
            else {newjoint: JointMain, newstate:StatePoint s, shape: r0}
        
      ,getRoute  : \s f t  -> 
                      case f of
                        JointEnter ->
                          case t of
                            JointEnter -> Nothing
                            JointMain  -> Just $ StatePoint $ (unwrap s) {turnout= false}
                            JointSub   -> Just $ StatePoint $ (unwrap s) {turnout= true}
                        JointMain ->
                          case t of
                            JointEnter -> Just $ StatePoint $ (unwrap s) {turnout= false}
                            JointMain  -> Nothing
                            JointSub   -> Nothing
                        JointSub ->
                          case t of
                            JointEnter -> Just $ StatePoint $ (unwrap s) {turnout= true}
                            JointMain  -> Nothing
                            JointSub   -> Nothing
      ,isLocked  : \j s s' -> (unwrap s).turnout /= (unwrap s').turnout
      ,isBlocked : \j s j' -> true
      ,isSimple  : false
    }

turnOutRPlusRail = flipRail turnOutLPlusRail

autoTurnOutLPlusRail :: Rail
autoTurnOutLPlusRail = 
  let pe = RelPos (Pos {coord: Coord{x: 0.0           , y: 0.0           , z:0.0}, angle: angle8 4, isPlus: false})
      pp = RelPos (Pos {coord: Coord{x: 0.5           , y: 0.0           , z:0.0}, angle: angle8 0, isPlus: true })
      pP = RelPos (Pos {coord: Coord{x: 0.5           , y: 0.0           , z:0.0}, angle: angle8 4, isPlus: false})
      pm = RelPos (Pos {coord: Coord{x: 1.5           , y: 0.0           , z:0.0}, angle: angle8 0, isPlus: true })
      ps = RelPos (Pos {coord: Coord{x: 0.5 + sqrt 0.5, y: 1.0 - sqrt 0.5, z:0.0}, angle: angle8 1, isPlus: true})
      r_ = [railShape {start: pe, end:pp}]
      r0 = [railShape {start: pP, end:pm}]
      r1 = [railShape {start: pP, end:ps}]
  in toRail $ RailGen {
    name : "autoturnout"
    ,flipped : false
    ,opposed : false
    ,getDrawInfo : \(StateAP s) ->
        if s.auto
        then
          if s.turnout
          then noAdditionals $ join [(\s -> DrawRail {color : "#33a", shape : s}) <$> r0, blueRail <$> r_, blueRail <$> r1]
          else noAdditionals $ join [(\s -> DrawRail {color : "#33a", shape : s}) <$> r1, blueRail <$> r_, blueRail <$> r0]
        else
          if s.turnout
          then noAdditionals $ join [(\s -> DrawRail {color : "#866", shape : s}) <$> r0, blueRail <$> r_, blueRail <$> r1]
          else noAdditionals $ join [(\s -> DrawRail {color : "#866", shape : s}) <$> r1, blueRail <$> r_, blueRail <$> r0]
    ,defaultState : StateAP {turnout: false, auto: true}
    ,getJoints    : serialAll
    ,getStates    : serialAll
    ,getOrigin    : JointEnter
    ,getJointPos : \j -> case j of
      JointEnter -> pe
      JointMain  -> pm
      JointSub   -> ps
    ,getNewState : \j (StateAP s) -> case j of
        JointMain  -> {newjoint: JointEnter, newstate: StateAP s, shape: reverseShapes (r_ <> r0)}
        JointSub   -> {newjoint: JointEnter, newstate: StateAP s, shape: reverseShapes (r_ <> r1)}
        JointEnter -> 
          if s.auto 
          then 
            if s.turnout
              then {newjoint: JointMain, newstate: StateAP {turnout: false, auto: true}, shape: r_ <> r0}
              else {newjoint: JointSub , newstate: StateAP {turnout: true , auto: true}, shape: r_ <> r1}
          else
            if s.turnout
              then {newjoint: JointSub , newstate: StateAP s, shape: r_ <> r1}
              else {newjoint: JointMain, newstate: StateAP s, shape: r_ <> r0}

    ,getRoute  : \s f t  -> 
                    case f of
                      JointEnter ->
                        case t of
                          JointEnter -> Nothing
                          JointMain  -> Just $ StateAP $ (unwrap s) {turnout= false , auto=false}
                          JointSub   -> Just $ StateAP $ (unwrap s) {turnout= true  , auto=false}
                      JointMain ->
                        case t of
                          JointEnter -> Just $ StateAP $ (unwrap s) {turnout= false , auto=false}
                          JointMain  -> Nothing
                          JointSub   -> Nothing
                      JointSub ->
                        case t of
                          JointEnter -> Just $ StateAP $ (unwrap s) {turnout= true , auto=false}
                          JointMain  -> Nothing
                          JointSub   -> Nothing
    ,isLocked  : \j s s' -> (unwrap s).turnout /= (unwrap s').turnout
    ,isBlocked : \j s j' -> true
    ,isSimple  : false
  }

autoTurnOutRPlusRail = flipRail autoTurnOutLPlusRail

doubleRailWidth = 6.0/21.4


calcMidAngle x y =
  let r = (y `pow` 2.0 + x `pow`2.0) / (2.0*y)
  in  asin (x/r)

toDoubleLPlusRail :: Rail
toDoubleLPlusRail = 
  let anglep = fromRadian $ calcMidAngle 1.0 doubleRailWidth
      pe  = RelPos (Pos {coord: Coord{x: 0.0, y: 0.0                , z:0.0}, angle: angle8 4            , isPlus: false})
      pm  = RelPos (Pos {coord: Coord{x: 1.0, y: 0.0                , z:0.0}, angle: angle8 0            , isPlus: true })
      pp  = RelPos (Pos {coord: Coord{x: 0.5, y: doubleRailWidth/2.0, z:0.0}, angle: anglep              , isPlus: true })
      pP  = RelPos (Pos {coord: Coord{x: 0.5, y: doubleRailWidth/2.0, z:0.0}, angle: reverseAngle anglep , isPlus: false})
      ps  = RelPos (Pos {coord: Coord{x: 1.0, y: doubleRailWidth    , z:0.0}, angle: angle8 0            , isPlus: true })
      r0 = [railShape {start: pe, end: pm}]
      r1 = slipShapes {start: pe, end: ps}
  in toRail $ RailGen {
      name : "todouble"
      ,flipped : false
      ,opposed : false
      ,getDrawInfo : \(StatePoint s) ->
        if s.turnout
        then noAdditionals $ join [grayRail <$> r0, blueRail <$> r1]
        else noAdditionals $ join [grayRail <$> r1, blueRail <$> r0]
      ,defaultState : StatePoint {turnout: false}
      ,getJoints    : serialAll
      ,getStates    : serialAll
      ,getOrigin    : JointEnter
      ,getJointPos : \j -> case j of
        JointEnter -> pe
        JointMain  -> pm
        JointSub   -> ps
      ,getNewState : \j (StatePoint s) -> case j of
        JointMain  -> {newjoint: JointEnter, newstate: StatePoint {turnout: false}, shape: reverseShapes r0}
        JointSub   -> {newjoint: JointEnter, newstate: StatePoint {turnout: true }, shape: reverseShapes r1}
        JointEnter -> 
          if s.turnout
            then {newjoint: JointSub , newstate:StatePoint s, shape: r1}
            else {newjoint: JointMain, newstate:StatePoint s, shape: r0}

      ,getRoute  : \s f t  -> 
                      case f of
                        JointEnter ->
                          case t of
                            JointEnter -> Nothing
                            JointMain  -> Just $ StatePoint $ (unwrap s) {turnout= false}
                            JointSub   -> Just $ StatePoint $ (unwrap s) {turnout= true}
                        JointMain ->
                          case t of
                            JointEnter -> Just $ StatePoint $ (unwrap s) {turnout= false}
                            JointMain  -> Nothing
                            JointSub   -> Nothing
                        JointSub ->
                          case t of
                            JointEnter -> Just $ StatePoint $ (unwrap s) {turnout= true}
                            JointMain  -> Nothing
                            JointSub   -> Nothing
      ,isLocked  : \j s s' -> (unwrap s).turnout /= (unwrap s').turnout
      ,isBlocked : \j s j' -> true
      ,isSimple  : false
    }

toDoubleRPlusRail ∷ RailGen Int Int
toDoubleRPlusRail = flipRail toDoubleLPlusRail


scissorsRail :: Rail
scissorsRail = 
  let pib = RelPos (Pos {coord: Coord{x: 1.0 , y: -doubleRailWidth    , z:0.0}, angle: angle8 0    , isPlus: false})
      pie = RelPos (Pos {coord: Coord{x: 0.0 , y: -doubleRailWidth    , z:0.0}, angle: angle8 4    , isPlus: true}) 
      pob = RelPos (Pos {coord: Coord{x: 0.0 , y:  0.0                , z:0.0}, angle: angle8 4    , isPlus: true})
      poe = RelPos (Pos {coord: Coord{x: 1.0 , y:  0.0                , z:0.0}, angle: angle8 0    , isPlus: false}) 
      ppp = RelPos (Pos {coord: Coord{x: 0.5 , y: -doubleRailWidth/2.0, z:0.0}, angle: anglen 12 11, isPlus: true }) 
      pPp = RelPos (Pos {coord: Coord{x: 0.5 , y: -doubleRailWidth/2.0, z:0.0}, angle: anglen 12 5 , isPlus: false}) 
      ppn = RelPos (Pos {coord: Coord{x: 0.5 , y: -doubleRailWidth/2.0, z:0.0}, angle: anglen 12 1 , isPlus: true }) 
      pPn = RelPos (Pos {coord: Coord{x: 0.5 , y: -doubleRailWidth/2.0, z:0.0}, angle: anglen 12 7 , isPlus: false}) 
      ro = [railShape {start :pob, end: poe}]
      ri = [railShape {start :pib, end: pie}]
      rp = slipShapes {start :pob, end: pib}
      rn = slipShapes {start :pie, end: poe}
  in toRail $ RailGen {
    name : "scissors"
    ,flipped : false
    ,opposed : false
    ,getDrawInfo : \s ->
      case s of
        StateSP_P -> noAdditionals $ 
                         (grayRail <$> ri) 
                      <> (grayRail <$> ro)
                      <> (grayRail <$> rn)
                      <> (blueRail <$> rp)
        StateSP_S -> noAdditionals $ 
                         (grayRail <$> rn)
                      <> (grayRail <$> rp)
                      <> (blueRail <$> ri) 
                      <> (blueRail <$> ro)
        StateSP_N -> noAdditionals $ 
                         (grayRail <$> ri) 
                      <> (grayRail <$> ro)
                      <> (grayRail <$> rp)
                      <> (blueRail <$> rn)
      
    ,defaultState : StateSP_S
    ,getJoints    : serialAll
    ,getStates    : serialAll
    ,getOrigin    : JointOuterBegin
    ,getJointPos : \j -> case j of
      JointOuterBegin -> pob
      JointOuterEnd   -> poe
      JointInnerBegin -> pib
      JointInnerEnd   -> pie
    ,getNewState : \j s ->
      case s of
        StateSP_P -> 
          case j of
            JointInnerBegin -> {newjoint: JointOuterBegin , newstate:StateSP_P, shape: reverseShapes rp}
            JointInnerEnd   -> {newjoint: JointInnerBegin , newstate:StateSP_S, shape: reverseShapes ri}
            JointOuterBegin -> {newjoint: JointInnerBegin , newstate:StateSP_P, shape:               rp}
            JointOuterEnd   -> {newjoint: JointOuterBegin , newstate:StateSP_S, shape: reverseShapes ro}
        StateSP_S ->
          case j of
            JointInnerBegin -> {newjoint: JointInnerEnd   , newstate:StateSP_S, shape:               ri} 
            JointInnerEnd   -> {newjoint: JointInnerBegin , newstate:StateSP_S, shape: reverseShapes ri}
            JointOuterBegin -> {newjoint: JointOuterEnd   , newstate:StateSP_S, shape:               ro}
            JointOuterEnd   -> {newjoint: JointOuterBegin , newstate:StateSP_S, shape: reverseShapes ro}
        StateSP_N ->
          case j of
            JointInnerBegin -> {newjoint: JointInnerEnd   , newstate:StateSP_S, shape:               ri}
            JointInnerEnd   -> {newjoint: JointOuterEnd   , newstate:StateSP_N, shape:               rn}
            JointOuterBegin -> {newjoint: JointOuterEnd   , newstate:StateSP_S, shape:               ro}
            JointOuterEnd   -> {newjoint: JointInnerEnd   , newstate:StateSP_N, shape: reverseShapes rn}

      ,getRoute  : \s f t  -> 
                      case f of
                        JointInnerBegin -> 
                          case t of
                            JointInnerBegin -> Nothing
                            JointInnerEnd   -> Just StateSP_S
                            JointOuterBegin -> Just StateSP_P
                            JointOuterEnd   -> Nothing
                        JointInnerEnd   -> 
                          case t of
                            JointInnerBegin -> Just StateSP_S
                            JointInnerEnd   -> Nothing
                            JointOuterBegin -> Nothing
                            JointOuterEnd   -> Just StateSP_N
                        JointOuterBegin -> 
                          case t of
                            JointInnerBegin -> Just StateSP_P
                            JointInnerEnd   -> Nothing
                            JointOuterBegin -> Nothing
                            JointOuterEnd   -> Just StateSP_S
                        JointOuterEnd   -> 
                          case t of
                            JointInnerBegin -> Nothing
                            JointInnerEnd   -> Just StateSP_N
                            JointOuterBegin -> Just StateSP_S
                            JointOuterEnd   -> Nothing
      ,isLocked  : \j s s' -> s /= s'
      ,isBlocked : \j s j' -> 
                      if s /= StateSP_S then true
                        else case j' of
                              JointInnerBegin -> j == JointInnerEnd
                              JointInnerEnd   -> j == JointInnerBegin
                              JointOuterBegin -> j == JointOuterEnd
                              JointOuterEnd   -> j == JointOuterBegin
      ,isSimple  : false
  }


doubleTurnoutLPlusRail :: Rail
doubleTurnoutLPlusRail = 
  let scale = 1.0 + doubleRailWidth
      poe = RelPos (Pos {coord: Coord{x: 0.0             , y: 0.0                                       , z:0.0}, angle: angle8 4, isPlus: false}) 
      pie = RelPos (Pos {coord: Coord{x: 0.0             , y: -doubleRailWidth                          , z:0.0}, angle: angle8 4, isPlus: false}) 
      pom = RelPos (Pos {coord: Coord{x: 1.0             , y: 0.0                                       , z:0.0}, angle: angle8 0, isPlus: true }) 
      pim = RelPos (Pos {coord: Coord{x: 1.0             , y: -doubleRailWidth                          , z:0.0}, angle: angle8 0, isPlus: true }) 
      pos = RelPos (Pos {coord: Coord{x: (sqrt 0.5)      , y:  1.0 - (sqrt 0.5)                         , z:0.0}, angle: angle8 1, isPlus: true }) 
      pis = RelPos (Pos {coord: Coord{x: (sqrt 0.5)*scale, y: (1.0 - (sqrt 0.5))*scale -doubleRailWidth , z:0.0}, angle: angle8 1, isPlus: true }) 
      rom = [railShape {start :poe, end: pom}]
      ros = [railShape {start :poe, end: pos}]
      rim = [railShape {start :pie, end: pim}]
      ris = [railShape {start :pie, end: pis}]
  in toRail $ RailGen {
    name : "doubleTurnout"
    ,flipped : false
    ,opposed : false
    ,getDrawInfo : \(StateDP s) ->
      if s.outerturnout
      then
        if s.innerturnout
        then noAdditionals $ 
                 (grayRail <$> rom)
              <> (grayRail <$> rim)
              <> (blueRail <$> ros)
              <> (blueRail <$> ris)
        else noAdditionals $ 
                 (grayRail <$> rom)
              <> (grayRail <$> ris)
              <> (blueRail <$> ros)
              <> (blueRail <$> rim)
      else
        if s.innerturnout
        then noAdditionals $ 
                 (grayRail <$> ros)
              <> (grayRail <$> rim)
              <> (blueRail <$> rom)
              <> (blueRail <$> ris)
        else noAdditionals $ 
                 (grayRail <$> ros)
              <> (grayRail <$> ris)
              <> (blueRail <$> rom)
              <> (blueRail <$> rim)
      
    ,defaultState : StateDP {innerturnout: false, outerturnout: false}
    ,getJoints    : serialAll
    ,getStates    : serialAll
    ,getOrigin    : JointOuterEnter
    ,getJointPos : \j -> case j of
      JointOuterEnter -> poe
      JointOuterMain  -> pom
      JointOuterSub   -> pos
      JointInnerEnter -> pie
      JointInnerMain  -> pim
      JointInnerSub   -> pis
    ,getNewState : \j (StateDP s) ->
      case j of
        JointOuterEnter -> 
          if s.outerturnout
            then {newjoint: JointOuterSub  , newstate: (StateDP s), shape: ros}
            else {newjoint: JointOuterMain , newstate: (StateDP s), shape: rom}
        JointOuterMain  -> 
          if s.outerturnout
            then {newjoint: JointOuterEnter, newstate: (StateDP $ s{outerturnout = false}), shape: reverseShapes rom}
            else {newjoint: JointOuterEnter, newstate: (StateDP $ s{outerturnout = false}), shape: reverseShapes rom}
        JointOuterSub   -> 
          if s.outerturnout
            then {newjoint: JointOuterEnter, newstate: (StateDP $ s{outerturnout = true}), shape: reverseShapes ros}
            else {newjoint: JointOuterEnter, newstate: (StateDP $ s{outerturnout = true}), shape: reverseShapes ros}
        JointInnerEnter -> 
          if s.innerturnout
            then {newjoint: JointInnerSub  , newstate: (StateDP s), shape: ris}
            else {newjoint: JointInnerMain , newstate: (StateDP s), shape: rim}
        JointInnerMain  -> 
          if s.innerturnout
            then {newjoint: JointInnerEnter, newstate: (StateDP $ s{innerturnout = false}), shape: reverseShapes rim}
            else {newjoint: JointInnerEnter, newstate: (StateDP $ s{innerturnout = false}), shape: reverseShapes rim}
        JointInnerSub   -> 
          if s.innerturnout
            then {newjoint: JointInnerEnter, newstate: (StateDP $ s{innerturnout = true}), shape: reverseShapes ris}
            else {newjoint: JointInnerEnter, newstate: (StateDP $ s{innerturnout = true}), shape: reverseShapes ris}

      ,getRoute  : \s f t  -> 
                      case f of
                        JointOuterEnter -> 
                          case t of
                            JointOuterEnter -> Nothing
                            JointOuterMain  -> Just $ StateDP $ (unwrap s){innerturnout = false}
                            JointOuterSub   -> Just $ StateDP $ (unwrap s){innerturnout = true}
                            JointInnerEnter -> Nothing
                            JointInnerMain  -> Nothing
                            JointInnerSub   -> Nothing
                        JointOuterMain  -> 
                          case t of
                            JointOuterEnter -> Just $ StateDP $ (unwrap s){innerturnout = false}
                            JointOuterMain  -> Nothing
                            JointOuterSub   -> Nothing
                            JointInnerEnter -> Nothing
                            JointInnerMain  -> Nothing
                            JointInnerSub   -> Nothing
                        JointOuterSub   -> 
                          case t of
                            JointOuterEnter -> Just $ StateDP $ (unwrap s){innerturnout = true}
                            JointOuterMain  -> Nothing
                            JointOuterSub   -> Nothing
                            JointInnerEnter -> Nothing
                            JointInnerMain  -> Nothing
                            JointInnerSub   -> Nothing
                        JointInnerEnter -> 
                          case t of
                            JointOuterEnter -> Nothing
                            JointOuterMain  -> Nothing
                            JointOuterSub   -> Nothing
                            JointInnerEnter -> Nothing
                            JointInnerMain  -> Just $ StateDP $ (unwrap s){outerturnout = false}
                            JointInnerSub   -> Just $ StateDP $ (unwrap s){outerturnout = true}
                        JointInnerMain  -> 
                          case t of
                            JointOuterEnter -> Nothing
                            JointOuterMain  -> Nothing
                            JointOuterSub   -> Nothing
                            JointInnerEnter -> Just $ StateDP $ (unwrap s){outerturnout = false}
                            JointInnerMain  -> Nothing
                            JointInnerSub   -> Nothing
                        JointInnerSub   -> 
                          case t of
                            JointOuterEnter -> Nothing
                            JointOuterMain  -> Nothing
                            JointOuterSub   -> Nothing
                            JointInnerEnter -> Just $ StateDP $ (unwrap s){outerturnout = true}
                            JointInnerMain  -> Nothing
                            JointInnerSub   -> Nothing
      ,isLocked  : \j s s' ->
                      case j of
                        JointOuterEnter -> (unwrap s).outerturnout /= (unwrap s).outerturnout
                        JointOuterMain  -> (unwrap s).outerturnout /= (unwrap s).outerturnout
                        JointOuterSub   -> (unwrap s).outerturnout /= (unwrap s).outerturnout
                        JointInnerEnter -> (unwrap s).innerturnout /= (unwrap s).innerturnout
                        JointInnerMain  -> (unwrap s).innerturnout /= (unwrap s).innerturnout
                        JointInnerSub   -> (unwrap s).innerturnout /= (unwrap s).innerturnout
      ,isBlocked : \j s j' -> 
                      case j of
                        JointOuterEnter -> 
                          case j' of
                            JointOuterEnter -> true
                            JointOuterMain  -> true
                            JointOuterSub   -> true
                            JointInnerEnter -> not (unwrap s).outerturnout && (unwrap s).innerturnout
                            JointInnerMain  -> false
                            JointInnerSub   -> not (unwrap s).outerturnout
                        JointOuterMain  -> 
                          case j' of
                            JointOuterEnter -> true
                            JointOuterMain  -> true
                            JointOuterSub   -> true
                            JointInnerEnter -> (unwrap s).innerturnout
                            JointInnerMain  -> false
                            JointInnerSub   -> true
                        JointOuterSub   -> 
                          case j' of
                            JointOuterEnter -> true
                            JointOuterMain  -> true
                            JointOuterSub   -> true
                            JointInnerEnter -> false
                            JointInnerMain  -> false
                            JointInnerSub   -> false
                        JointInnerEnter -> 
                          case j' of
                            JointOuterEnter -> not (unwrap s).outerturnout && (unwrap s).innerturnout
                            JointOuterMain  -> (unwrap s).innerturnout
                            JointOuterSub   -> false
                            JointInnerEnter -> true
                            JointInnerMain  -> true
                            JointInnerSub   -> true
                        JointInnerMain  -> 
                          case j' of
                            JointOuterEnter -> false
                            JointOuterMain  -> false
                            JointOuterSub   -> false
                            JointInnerEnter -> true
                            JointInnerMain  -> true
                            JointInnerSub   -> true
                        JointInnerSub   -> 
                          case j' of
                            JointOuterEnter -> not (unwrap s).outerturnout
                            JointOuterMain  -> true
                            JointOuterSub   -> false
                            JointInnerEnter -> true
                            JointInnerMain  -> true
                            JointInnerSub   -> true
      ,isSimple  : false
  }

doubleTurnoutRPlusRail = flipRail doubleTurnoutLPlusRail

wideRailWidth = 16.1/21.4

doubleToWideLRail :: Rail
doubleToWideLRail = 
  let anglep = fromRadian $ calcMidAngle 1.25 0.5
      angleq = fromRadian $ calcMidAngle 1.25 (0.5 - doubleRailWidth)
      pib = RelPos (Pos {coord: Coord{x: 1.25  , y: -doubleRailWidth             , z:0.0}, angle: angle8 0            , isPlus: false})
      pie = RelPos (Pos {coord: Coord{x: 0.0   , y: -doubleRailWidth             , z:0.0}, angle: angle8 4            , isPlus: false}) 
      pob = RelPos (Pos {coord: Coord{x: 0.0   , y:  0.0                         , z:0.0}, angle: angle8 4            , isPlus: false})
      poe = RelPos (Pos {coord: Coord{x: 1.25  , y:  0.5 - doubleRailWidth       , z:0.0}, angle: angle8 0            , isPlus: true }) 
      ppn = RelPos (Pos {coord: Coord{x: 0.625 , y:  0.25 - doubleRailWidth      , z:0.0}, angle: anglep              , isPlus: true }) 
      pPn = RelPos (Pos {coord: Coord{x: 0.625 , y:  0.25 - doubleRailWidth      , z:0.0}, angle: reverseAngle anglep , isPlus: false}) 
      pqn = RelPos (Pos {coord: Coord{x: 0.625 , y:  (0.5 - doubleRailWidth)/2.0 , z:0.0}, angle: angleq              , isPlus: true }) 
      pQn = RelPos (Pos {coord: Coord{x: 0.625 , y:  (0.5 - doubleRailWidth)/2.0 , z:0.0}, angle: reverseAngle angleq , isPlus: false}) 
      ro = slipShapes {start :pob, end: poe}
      ri = [railShape {start :pib, end: pie}]
      rn = slipShapes {start :pie, end: poe}
  in toRail $ RailGen {
    name : "doubletowide"
    ,flipped : false
    ,opposed : false
    ,getDrawInfo : \(StateDP s) ->
      if s.outerturnout
      then
        if s.innerturnout
        then noAdditionals $ 
                 (grayRail <$> ri)
              <> (grayRail <$> ro)
              <> (blueRail <$> rn)
        else noAdditionals $ 
                 (grayRail <$> ro)
              <> (blueRail <$> ri)
              <> (blueRail <$> rn)
      else
        if s.innerturnout
        then noAdditionals $ 
                 (grayRail <$> ri)
              <> (blueRail <$> ro)
              <> (blueRail <$> rn)
        else noAdditionals $ 
                 (grayRail <$> rn)
              <> (blueRail <$> ri)
              <> (blueRail <$> ro)
      
    ,defaultState : StateDP {innerturnout: false, outerturnout: false}
    ,getJoints    : serialAll
    ,getStates    : serialAll
    ,getOrigin    : JointOuterBegin
    ,getJointPos : \j -> case j of
      JointOuterBegin -> pob
      JointOuterEnd   -> poe
      JointInnerBegin -> pib
      JointInnerEnd   -> pie
    ,getNewState : \j (StateDP s) ->
      if s.outerturnout
      then
        if s.innerturnout
        then
          case j of
            JointInnerBegin -> {newjoint: JointInnerEnd   , newstate:(StateDP s{innerturnout = false}), shape:               ri} 
            JointInnerEnd   -> {newjoint: JointOuterEnd   , newstate:(StateDP s                      ), shape:               rn}
            JointOuterBegin -> {newjoint: JointOuterEnd   , newstate:(StateDP s{outerturnout = false}), shape:               ro}
            JointOuterEnd   -> {newjoint: JointInnerEnd   , newstate:(StateDP s                      ), shape: reverseShapes rn}
        else
          case j of
            JointInnerBegin -> {newjoint: JointInnerEnd   , newstate:(StateDP s                      ), shape:               ri} 
            JointInnerEnd   -> {newjoint: JointInnerBegin , newstate:(StateDP s                      ), shape: reverseShapes ri}
            JointOuterBegin -> {newjoint: JointOuterEnd   , newstate:(StateDP s{outerturnout = false}), shape:               ro}
            JointOuterEnd   -> {newjoint: JointInnerEnd   , newstate:(StateDP s{innerturnout = true }), shape: reverseShapes rn}
      else
        if s.innerturnout
        then
          case j of
            JointInnerBegin -> {newjoint: JointInnerEnd   , newstate:(StateDP s{innerturnout = false}), shape:               ri} 
            JointInnerEnd   -> {newjoint: JointOuterEnd   , newstate:(StateDP s{outerturnout = true} ), shape:               rn}
            JointOuterBegin -> {newjoint: JointOuterEnd   , newstate:(StateDP s                      ), shape:               ro}
            JointOuterEnd   -> {newjoint: JointOuterBegin , newstate:(StateDP s                      ), shape: reverseShapes ro}
        else
          case j of
            JointInnerBegin -> {newjoint: JointInnerEnd   , newstate:(StateDP s                      ), shape:               ri} 
            JointInnerEnd   -> {newjoint: JointInnerBegin , newstate:(StateDP s                      ), shape: reverseShapes ri}
            JointOuterBegin -> {newjoint: JointOuterEnd   , newstate:(StateDP s                      ), shape:               ro}
            JointOuterEnd   -> {newjoint: JointOuterBegin , newstate:(StateDP s                      ), shape: reverseShapes ro}

      ,getRoute  : \s f t  -> 
                      case f of
                        JointInnerBegin -> 
                          case t of
                            JointInnerBegin -> Nothing
                            JointInnerEnd   -> Just $ StateDP $ (unwrap s) {innerturnout = false}
                            JointOuterBegin -> Nothing
                            JointOuterEnd   -> Nothing
                        JointInnerEnd   -> 
                          case t of
                            JointInnerBegin -> Just $ StateDP $ (unwrap s) {innerturnout = false}
                            JointInnerEnd   -> Nothing
                            JointOuterBegin -> Nothing
                            JointOuterEnd   -> Just $ StateDP $ (unwrap s) {innerturnout = true, outerturnout = true}
                        JointOuterBegin -> 
                          case t of
                            JointInnerBegin -> Nothing
                            JointInnerEnd   -> Nothing
                            JointOuterBegin -> Nothing
                            JointOuterEnd   -> Just $ StateDP $ (unwrap s) {outerturnout = false}
                        JointOuterEnd   -> 
                          case t of
                            JointInnerBegin -> Nothing
                            JointInnerEnd   -> Just $ StateDP $ (unwrap s) {innerturnout = true, outerturnout = true}
                            JointOuterBegin -> Just $ StateDP $ (unwrap s) {outerturnout = false}
                            JointOuterEnd   -> Nothing
      ,isLocked  : \j s s' ->
                      case j of
                        JointInnerBegin -> (unwrap s).innerturnout /= (unwrap s).innerturnout
                        JointInnerEnd   -> (unwrap s).innerturnout /= (unwrap s).innerturnout
                        JointOuterBegin -> (unwrap s).outerturnout /= (unwrap s).outerturnout
                        JointOuterEnd   -> (unwrap s).outerturnout /= (unwrap s).outerturnout
      ,isBlocked : \j s j' -> 
                      if (unwrap s).innerturnout || (unwrap s).outerturnout then true
                        else case j' of
                              JointInnerBegin -> j == JointInnerEnd
                              JointInnerEnd   -> j == JointInnerBegin
                              JointOuterBegin -> j == JointOuterEnd
                              JointOuterEnd   -> j == JointOuterBegin
      ,isSimple  : false
  }

doubleToWideRRail = flipRail doubleToWideLRail
