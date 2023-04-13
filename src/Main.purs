module Main
  ( decodeLayout
  , defaultLayout
  , encodeLayout
  , isArc
  , module Ex
  , shapeToData
  , splitSize
  )
  where

import Data.Array (catMaybes, filter, find, foldl, length, mapWithIndex, reverse, sort, (!!))
import Data.Maybe (Maybe(..), fromMaybe, isNothing, maybe)
import Data.Newtype (class Newtype, unwrap)
import Data.Number (abs, cos, pi, round, sign, sin)
import Foreign  (Foreign, ForeignError, isArray, isNull, isUndefined, readNumber, unsafeFromForeign, unsafeToForeign)
import Internal.Layout
import Internal.Rails
import Internal.Types
import Prelude

import Control.Monad.Except (runExceptT, ExceptT)
import Data.Either (either, fromRight, hush)
import Data.Function (on)
import Data.Identity (Identity)
import Data.List.Types (NonEmptyList)
import Foreign.Object as FO
import Internal.Layout as Ex
import Internal.Rails as Ex
import Internal.Types as Ex
import Prelude as Prelude
import Data.String.Regex        as Re
import Data.String.Regex.Flags  as Re
import Data.String.Regex.Unsafe as Re
import Data.String as St
import Data.Int as Int


ifUndefinedDefault :: forall a. a -> a -> a
ifUndefinedDefault d x =
  let f = unsafeToForeign x
  in  if isUndefined f || isNull f
      then d
      else x

defaultnode :: RailNode
defaultnode = RailNode {
            nodeid : 0,
            instanceid : 0,
            state : IntState 0,
            rail : straightRail,
            connections : [],
            signals : [],
            invalidRoutes : [],
            reserves : [],
            pos : reversePos poszero,
            note: ""
          }

defaultLayout ∷ Layout
defaultLayout = 
    let jrel i = unwrap $ (unwrap (unwrap defaultnode).rail).getJointPos i
    in ((\l -> foldl (\l' j -> addJoint l' (jrel j) (unwrap defaultnode).nodeid j) l (unwrap (unwrap defaultnode).rail).getJoints) $ Layout {
          instancecount: 1,
          traincount: 0,
          updatecount: 0,
          time : 0.0,
          speed : 1.0,
          rails : [defaultnode],
          trains : [],
          traffic : [],
          isclear : [],
          signalcolors : [],
          jointData : saEmpty,
          version : 2
        }
    )



rails :: Array Rail
rails = [
      autoTurnOutLPlusRail
    , curveLRail
    , slopeRail
    , slopeCurveLRail
    , straightRail
    , halfRail
    , quarterRail
    , converterRail
    , turnOutLPlusRail
    , outerCurveLRail
    , toDoubleLPlusRail
    , scissorsRail
    , doubleToWideLRail
    , doubleTurnoutLPlusRail
    , longRail
    , doubleWidthSLRail
    , crossoverLRail
    , diamondRail
  ]

type EncodedSignalRule = String
type EncodedSignal = { signalname :: String, nodeid :: Int, jointid :: IntJoint, manualStop :: Boolean, rules :: Array EncodedSignalRule}
type EncodedRail = {name :: String, flipped :: Boolean, opposed :: Boolean}
type EncodedRailNode = {nodeid :: Int, instanceid :: Int, rail :: EncodedRail, state :: IntState, signals :: Array EncodedSignal, invalidRoutes :: Array (InvalidRoute), connections :: Array ({from :: IntJoint, nodeid :: Int, jointid :: IntJoint}), reserves :: Array ({reserveid :: IntReserve, jointid :: IntJoint}), pos  :: Pos, note :: String}
type EncodedLayout = {rails :: Array EncodedRailNode, trains :: Array EncodedTrainset, time :: Number, speed :: Number, version :: Int}
type EncodedTrainset = Trainset_ Int
type EncodedRoute = TrainRoute_ Int

encodeRail :: Rail -> EncodedRail
encodeRail (RailGen r) = {
      name: r.name
    , flipped: r.flipped
    , opposed: r.opposed
  }

roundNumber :: Number -> Number
roundNumber num = round (num * 100000.0) / 100000.0

roundPos :: Pos -> Pos
roundPos (Pos {coord: Coord coord, angle, isPlus}) = Pos {
    coord: Coord {x: roundNumber coord.x, y: roundNumber coord.y, z: roundNumber coord.z},
    angle: fromRadian (roundNumber (toRadian angle)),
    isPlus
  }

encodeRailNode :: RailNode -> EncodedRailNode
encodeRailNode (RailNode {
      nodeid
    , instanceid
    , rail
    , state
    , connections
    , signals
    , invalidRoutes
    , reserves
    , pos
    , note
  }) = {
      nodeid
    , instanceid
    , rail:encodeRail rail
    , state
    , connections
    , signals : encodeSignal <$> signals
    , invalidRoutes
    , reserves
    , pos: roundPos pos
    , note
  }

encodeTrainset :: Trainset -> EncodedTrainset
encodeTrainset (Trainset {
      types
    , route
    , distanceToNext
    , distanceFromOldest
    , speed
    , trainid
    , flipped
    , respectSignals
    , realAcceralation
    , notch
    , signalRestriction
    , note
  }) = Trainset {
      types
    , route : encodeTrainRoute <$> route
    , distanceToNext     : roundNumber distanceToNext    
    , distanceFromOldest : roundNumber distanceFromOldest
    , speed              : roundNumber speed             
    , trainid
    , flipped
    , respectSignals
    , realAcceralation
    , notch
    , signalRestriction
    , note
  }

encodeTrainRoute :: TrainRoute -> EncodedRoute
encodeTrainRoute (TrainRoute {
      nodeid 
    , jointid
    , railinstance
    , shapes
    , length
  }) = TrainRoute {
      nodeid 
    , jointid
    , railinstance : (unwrap railinstance).instanceid
    , shapes
    , length
  }

encodeSignal :: Signal -> EncodedSignal
encodeSignal (Signal {
      signalname
    , nodeid
    , jointid
    , manualStop
    , rules
  }) = {
      signalname
    , nodeid
    , jointid
    , manualStop
    , rules : encodeSignalRule <$> rules
  }

encodeSignalRule :: SignalRule -> EncodedSignalRule
encodeSignalRule rule =
  case rule of
    RuleOpen       tag route   -> "o " <> Re.source tag <> " " <> show route
    RuleUpdate     tag from to -> "u " <> Re.source tag <> " " <> Re.source from <> " " <> to
    RuleStop       tag         -> "s " <> Re.source tag <> " "
    RuleStopOpen   tag route   -> "O " <> Re.source tag <> " " <> show route
    RuleStopUpdate tag from to -> "U " <> Re.source tag <> " " <> Re.source from <> " " <> to
    RuleReverse    tag         -> "r " <> Re.source tag <> " "

encodeLayout :: Layout -> EncodedLayout
encodeLayout (Layout layout) = {
    rails: encodeRailNode <$> layout.rails,
    trains: encodeTrainset <$> layout.trains,
    time: layout.time,
    speed: layout.speed,
    version: layout.version
  }

decodeRail :: EncodedRail -> Maybe Rail
decodeRail {name: name, flipped: flipped, opposed: opposed} =
  ((if flipped
  then flipRail
  else identity) >>>
  (if opposed
  then opposeRail
  else identity)) <$> (find (\(RailGen r) -> r.name == name) rails)

decodeRailNode :: EncodedRailNode -> Maybe RailNode
decodeRailNode ({
      nodeid
    , instanceid
    , rail
    , state
    , connections
    , signals
    , invalidRoutes
    , reserves
    , pos
    , note
  }) = RailNode <$> {
      nodeid
    , instanceid
    , rail:_
    , state
    , connections
    , signals: decodeSignal <$> ifUndefinedDefault [] signals
    , invalidRoutes: ifUndefinedDefault [] invalidRoutes
    , reserves: ifUndefinedDefault [] reserves
    , pos: pos
    , note: ifUndefinedDefault "" note
  } <$> decodeRail rail

decodeRailNode_v1 :: RailNode_ EncodedRail -> Maybe RailNode
decodeRailNode_v1 (RailNode {
      nodeid
    , instanceid
    , rail
    , state
    , connections
    , signals
    , invalidRoutes
    , reserves
    , note
  }) = RailNode <$> {
      nodeid
    , instanceid
    , rail:_
    , state
    , connections
    , signals: ifUndefinedDefault [] signals
    , invalidRoutes: ifUndefinedDefault [] invalidRoutes
    , reserves: ifUndefinedDefault [] reserves
    , pos: poszero
    , note: ifUndefinedDefault "" note
  } <$> decodeRail rail

decodeRailInstance :: RailInstance_ EncodedRail -> Maybe RailNode
decodeRailInstance (RailInstance {node:node, instanceid:instanceid, pos:pos}) = (\(RailNode n) -> RailNode (n {pos = pos, instanceid = instanceid})) <$> decodeRailNode_v1 node 


type RailInstance = RailInstance_ Rail
newtype RailInstance_ x = RailInstance {
    node :: RailNode_ x,
    instanceid :: Int,
    pos  :: Pos
  }
derive instance Newtype (RailInstance_ x) _

decodeTrainset :: Array RailNode -> EncodedTrainset -> Trainset
decodeTrainset rs (Trainset {
      types
    , route
    , distanceToNext
    , distanceFromOldest
    , speed
    , trainid
    , flipped
    , respectSignals
    , realAcceralation
    , notch
    , signalRestriction
    , note
  }) = Trainset {
      types
    , route : decodeTrainRoute rs <$> route
    , distanceToNext
    , distanceFromOldest
    , speed
    , trainid
    , flipped
    , respectSignals
    , realAcceralation
    , notch
    , signalRestriction
    , note : ifUndefinedDefault "" note
  }

decodeTrainRoute :: Array RailNode ->  EncodedRoute -> TrainRoute
decodeTrainRoute rs (TrainRoute {
      nodeid 
    , jointid
    , railinstance
    , shapes
    , length
  }) = TrainRoute {
            nodeid 
          , jointid
          , railinstance : fromMaybe defaultnode $ rs !! railinstance
          , shapes
          , length
        }

decodeSignal :: EncodedSignal -> Signal
decodeSignal ( {
      signalname
    , nodeid
    , jointid
    , manualStop
    , rules
  }) = Signal {
      signalname
    , nodeid
    , jointid
    , routes     : []
    , indication : []
    , routecond  : []
    , colors     : []
    , manualStop
    , rules : ifUndefinedDefault [] (catMaybes $ (\r -> decodeSignalRule (ifUndefinedDefault "" r)) <$> rules)
  }

decodeSignalRule :: EncodedSignalRule -> Maybe SignalRule
decodeSignalRule rule =
  let rule_ = Re.replace (Re.unsafeRegex  "\\s*" Re.global) " " $ St.trim rule
      spl   = St.split (St.Pattern " ") rule_
  in case spl !! 0 of
      Just "o" -> (\tag route   -> RuleOpen       tag route  ) <$> ((\x -> hush (Re.regex x Re.noFlags)) =<< spl !! 1) <*> (Int.fromString =<< spl !! 2)
      Just "u" -> (\tag from to -> RuleUpdate     tag from to) <$> ((\x -> hush (Re.regex x Re.noFlags)) =<< spl !! 1) <*> ((\x -> hush (Re.regex x Re.noFlags)) =<< spl !! 2) <*> spl !! 3
      Just "s" -> (\tag         -> RuleStop       tag        ) <$> ((\x -> hush (Re.regex x Re.noFlags)) =<< spl !! 1)
      Just "O" -> (\tag route   -> RuleStopOpen   tag route  ) <$> ((\x -> hush (Re.regex x Re.noFlags)) =<< spl !! 1) <*> (Int.fromString =<< spl !! 2)
      Just "U" -> (\tag from to -> RuleStopUpdate tag from to) <$> ((\x -> hush (Re.regex x Re.noFlags)) =<< spl !! 1) <*> ((\x -> hush (Re.regex x Re.noFlags)) =<< spl !! 2) <*> spl !! 3
      Just "r" -> (\tag         -> RuleReverse    tag        ) <$> ((\x -> hush (Re.regex x Re.noFlags)) =<< spl !! 1)
      _        -> Nothing

decodeLayout :: {rails :: Array(Foreign), trains :: Foreign, signals :: Foreign, time :: Foreign, speed :: Foreign, version:: Int} -> Layout
decodeLayout {rails: r, trains: t, time: time, speed: speed, version: v} =
  decodeLayout' {
      rails: unsafeFromForeign <$> r
    , trains: if isArray t then unsafeFromForeign t else []
    , time : fromRight 0.0 $ unwrap $ runExceptT $ (readNumber time  :: ExceptT (NonEmptyList ForeignError) Identity Number)
    , speed: fromRight 1.0 $ unwrap $ runExceptT $ (readNumber speed :: ExceptT (NonEmptyList ForeignError) Identity Number)
    , version: v
  }

decodeLayout' :: EncodedLayout -> Layout
decodeLayout' {rails: rarr, trains: tarr, time: traw, speed: sraw, version: ver} =
  let rawrails = 
        if ver <= 1
          then (decodeRailInstance <<< unsafeFromForeign <<< unsafeToForeign) <$> rarr
          else decodeRailNode <$> rarr
      deleted = (mapWithIndex (\i r -> {index: i, isdeleted: isNothing r}) >>> filter (\r -> r.isdeleted) >>> map (\r -> r.index)) rawrails
      rs = catMaybes rawrails
      ts = decodeTrainset rs <$> tarr
      l0 = Layout {
          jointData : saEmpty, 
          rails : rs,
          trains : ts,
          updatecount: 0,
          instancecount: 1 + foldl (\x (RailNode r) -> Prelude.max x r.instanceid) (-1) rs ,
          traincount: 1 + foldl (\x (Trainset t) -> Prelude.max x t.trainid) (-1) ts,
          version: 2,
          time  : ifUndefinedDefault 0.0 traw,
          speed : ifUndefinedDefault 1.0 sraw,
          traffic : [],
          isclear : [],
          signalcolors : []
        }
      (Layout layout) = foldl removeRail l0 (reverse $ sort deleted)
      joints = (do
          (RailNode r) <- layout.rails
          let nodeid = r.nodeid
          jointid <- (unwrap r.rail).getJoints
          pos <- maybe [] pure $ getJointAbsPos (Layout layout) nodeid jointid
          pure {nodeid: nodeid, jointid: jointid, pos: pos}
        )
      (Layout layout') =
        updateSignalRoutes $
        foldl (\l j -> addJoint l j.pos j.nodeid j.jointid) (Layout layout) joints
  in  if length layout'.rails == 0 then defaultLayout else (Layout layout')

isArc ::  RailShape Pos -> Boolean
isArc shape = reverseAngle (unwrap (unwrap shape).start).angle /= (unwrap (unwrap shape).end).angle

splitSize ::  RailShape Pos -> Int
splitSize shape = 
  if    on (==) (\p -> (unwrap (unwrap p).coord).z) (unwrap shape).start (unwrap shape).end
     && reverseAngle (unwrap (unwrap shape).start).angle == (unwrap (unwrap shape).end).angle
  then 1
  else 5

shapeToData ::  RailShape Pos -> Foreign
shapeToData (RailShape shape) = 
  let (Pos p1) = shape.start
      (Pos p2) = shape.end
      a1 = toRadian $ reverseAngle p1.angle
      a2 = toRadian                p2.angle
  in if reverseAngle p1.angle == p2.angle
    then unsafeToForeign {type: "straight", angle:a1 , start : p1, end : p2}
    else  let _r  = (cos a1 * ((unwrap p2.coord).x - (unwrap p1.coord).x) + sin a1 * ((unwrap p2.coord).y - (unwrap p1.coord).y)) / sin (a2 - a1)
              r   = abs _r
              a1' = a1 - pi/2.0 * sign _r
              -- a2' = a2 - pi/2.0 * sign _r
              x0  = (unwrap p1.coord).x - r * cos a1'
              y0  = (unwrap p1.coord).y - r * sin a1'
          in unsafeToForeign {type: "arc", center : Coord {x:x0, y:y0, z:((unwrap p1.coord).z+(unwrap p2.coord).z)/2.0}, radius : r, startangle : a1', endangle : a1'}