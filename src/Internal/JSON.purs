module Internal.JSON
  ( 
    decodeLayout
  , decodeSignalRules
  , defaultLayout
  , encodeLayout
  , encodeSignalRules
  , isArc
  , shapeToData
  , splitSize
  )
  where

import Internal.Rails (autoTurnOutLPlusRail, converterRail, crossoverLRail, crossoverShortLRail, crossoverTripleLRail, curveLRail, diamondRail, doubleToWideLRail, doubleTurnoutLPlusRail, doubleWidthSLRail, halfRail, halfScissorsLRail, halfSlopeRail, longRail, outerCurveLRail, quarterRail, quarterSlopeRail, scissorsRail, slopeCurveLRail, slopeRail, straightRail, toDoubleLPlusRail, toDoubleShortLPlusRail, turnOutLPlusRail)
import Prelude (bind, identity, map, negate, pure, show, ($), (&&), (*), (+), (-), (/), (/=), (<$>), (<*>), (<<<), (<=), (<>), (=<<), (==), (>>>), (||))

import Control.Monad.Except (runExceptT, ExceptT)
import Data.Array (catMaybes, filter, find, foldl, length, mapWithIndex, reverse, sort, replicate, (!!))
import Data.Either (fromRight, hush)
import Data.Function (on)
import Data.Identity (Identity)
import Data.Int as Int
import Data.List.Types (NonEmptyList)
import Data.Maybe (Maybe(..), fromMaybe, isNothing, maybe)
import Data.Newtype (class Newtype, unwrap)
import Data.Number (abs, cos, pi, round, sign, sin)
import Data.String (Pattern(..), split) as St
import Data.String.Regex (regex, replace, source) as Re
import Data.String.Regex.Flags (global, noFlags) as Re
import Data.String.Regex.Unsafe (unsafeRegex) as Re
import Data.String.Utils (trimStart) as St
import Foreign (Foreign, ForeignError, isArray, isNull, isUndefined, readNumber, unsafeFromForeign, unsafeToForeign)
import JS.Map.Primitive as JSM
import Internal.Layout (FloorData(..), IntNode(..), IntReserve, InvalidRoute(..), Layout(..), RailNode, RailNode_(..), RouteQueueElement, Signal(..), SignalRule(..), TrainRoute, TrainRoute_(..), Trainset, Trainset_(..), addJoint, getJointAbsPos, removeRail, signalRulePhase_unfired, updateSignalRoutes, selectRail, refreshNodeDrawInfo)
import Internal.Types (Coord(..), IntJoint, IntState(..), Pos(..), Rail, RailGen(..), RailShape(..), flipRail, fromRadian, opposeRail, poszero, reverseAngle, reversePos, saEmpty, toRadian, ColorOption)
import Prelude as Prelude
import Data.Tuple (Tuple(..))


ifUndefinedDefault :: forall a. a -> a -> a
ifUndefinedDefault d x =
  let f = unsafeToForeign x
  in  if isUndefined f || isNull f
      then d
      else x

defaultnode :: RailNode
defaultnode = RailNode {
            nodeid : IntNode 0,
            state : IntState 0,
            rail : straightRail,
            connections : [],
            signals : [],
            invalidRoutes : [],
            reserves : [],
            drawinfos : [],
            pos : reversePos poszero,
            note: "",
            color: [],
            traffic : [[], []],
            isclear : true
          }

defaultLayout ∷ Layout
defaultLayout = 
    let jrel i = unwrap $ (unwrap (unwrap defaultnode).rail).getJointPos i
    in ((\l -> foldl (\l' j -> addJoint l' (jrel j) (unwrap defaultnode).nodeid j) l (unwrap (unwrap defaultnode).rail).getJoints) $ Layout {
          instancecount: 1,
          traincount: 0,
          updatecount: 0,
          floor: FloorData {height: 500.0, width: 500.0},
          time : 0.0,
          speed : 1.0,
          rails : JSM.singleton (unwrap defaultnode).nodeid defaultnode,
          trains : [],
          signalcolors : [],
          routequeue : [],
          jointData : saEmpty,
          version : 2,
          activeReserves : []
        }
    )

defaultFloorData ∷ FloorData
defaultFloorData = 
  FloorData {
    height: 500.0,
    width:  500.0
  }

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
    , toDoubleShortLPlusRail
    , halfScissorsLRail
    , scissorsRail
    , doubleToWideLRail
    , doubleTurnoutLPlusRail
    , longRail
    , doubleWidthSLRail
    , crossoverLRail
    , crossoverShortLRail
    , crossoverTripleLRail
    , diamondRail
    , halfSlopeRail
    , quarterSlopeRail
  ]

type EncodedSignalRule = String
type EncodedSignal = { signalname :: String, nodeid :: IntNode, jointid :: IntJoint, manualStop :: Boolean, restraint :: Boolean, rules :: Array EncodedSignalRule}
type EncodedRail = {name :: String, flipped :: Boolean, opposed :: Boolean}
type EncodedRailNode = {nodeid :: IntNode, rail :: EncodedRail, state :: IntState, signals :: Array EncodedSignal, invalidRoutes :: Array (InvalidRoute), connections :: Array ({from :: IntJoint, nodeid :: IntNode, jointid :: IntJoint}), reserves :: Array ({reserveid :: IntReserve, jointid :: IntJoint}), pos  :: Pos, note :: String, color :: Array ColorOption}
type EncodedLayout = {floor :: FloorData , rails :: Array EncodedRailNode, trains :: Array EncodedTrainset, time :: Number, speed :: Number, version :: Int, routequeue :: Array RouteQueueElement, activeReserves :: Array {reserveid :: IntReserve, reserver :: Int}}
type EncodedTrainset = Trainset_ IntNode
type EncodedRoute = TrainRoute_ IntNode

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
    , rail
    , state
    , connections
    , signals
    , invalidRoutes
    , reserves
    , pos
    , note
    , color
  }) = {
      nodeid
    , rail:encodeRail rail
    , state
    , connections
    , signals : encodeSignal <$> signals
    , invalidRoutes
    , reserves
    , pos: roundPos pos
    , note
    , color
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
    , tags
    , signalRulePhase
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
    , tags
    , signalRulePhase
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
    , railinstance : (unwrap railinstance).nodeid
    , shapes
    , length
  }

encodeSignal :: Signal -> EncodedSignal
encodeSignal (Signal {
      signalname
    , nodeid
    , jointid
    , manualStop
    , restraint
    , rules
  }) = {
      signalname
    , nodeid
    , jointid
    , manualStop
    , restraint
    , rules : encodeSignalRule <$> rules
  }

encodeSignalRule :: SignalRule -> EncodedSignalRule
encodeSignalRule rule =
  case rule of
    RuleComment                   comment ->                                                                comment
    RuleComplex                   comment -> "c "                                                        <> comment
    RuleSpeed         tag route   comment -> "m " <> Re.source tag <> " " <> show route                  <> if comment == "" then "" else (" " <> comment)
    RuleOpen          tag route   comment -> "o " <> Re.source tag <> " " <> show route                  <> if comment == "" then "" else (" " <> comment)
    RuleUpdate        tag from to comment -> "u " <> Re.source tag <> " " <> Re.source from <> " " <> to <> if comment == "" then "" else (" " <> comment)
    RuleStop          tag         comment -> "s " <> Re.source tag                                       <> if comment == "" then "" else (" " <> comment)
    RuleStopOpen      tag route   comment -> "O " <> Re.source tag <> " " <> show route                  <> if comment == "" then "" else (" " <> comment)
    RuleStopUpdate    tag from to comment -> "U " <> Re.source tag <> " " <> Re.source from <> " " <> to <> if comment == "" then "" else (" " <> comment)
    RuleReverse       tag         comment -> "r " <> Re.source tag                                       <> if comment == "" then "" else (" " <> comment)
    RuleReverseUpdate tag from to comment -> "R " <> Re.source tag <> " " <> Re.source from <> " " <> to <> if comment == "" then "" else (" " <> comment)

encodeSignalRules :: Array SignalRule -> Array EncodedSignalRule
encodeSignalRules = map encodeSignalRule

encodeLayout :: Layout -> EncodedLayout
encodeLayout (Layout layout) = {
    rails: encodeRailNode <$> JSM.values layout.rails,
    trains: encodeTrainset <$> layout.trains,
    floor: layout.floor,
    time: layout.time,
    speed: layout.speed,
    version: layout.version,
    routequeue: layout.routequeue,
    activeReserves: layout.activeReserves
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
    , rail
    , state
    , connections
    , signals
    , invalidRoutes
    , reserves
    , pos
    , note
    , color
  }) = (\r -> refreshNodeDrawInfo $ RailNode {
      nodeid
    , rail: r
    , state
    , connections
    , signals: decodeSignal <$> ifUndefinedDefault [] signals
    , invalidRoutes: ifUndefinedDefault [] invalidRoutes
    , reserves: ifUndefinedDefault [] reserves
    , pos: pos
    , note: ifUndefinedDefault "" note
    , drawinfos: []
    , color: ifUndefinedDefault [] color
    , traffic: replicate (length (unwrap r).getJoints) []
    , isclear: true
  }) <$> decodeRail rail

decodeRailNode_v1 :: RailNode_ EncodedRail -> Maybe RailNode
decodeRailNode_v1 (RailNode {
      nodeid
    , rail
    , state
    , connections
    , signals
    , invalidRoutes
    , reserves
    , note
    , color
  }) = (\r -> refreshNodeDrawInfo $ RailNode {
      nodeid
    , rail: r
    , state
    , connections
    , signals: ifUndefinedDefault [] signals
    , invalidRoutes: ifUndefinedDefault [] invalidRoutes
    , reserves: ifUndefinedDefault [] reserves
    , pos: poszero
    , drawinfos: []
    , note: ifUndefinedDefault "" note
    , color: ifUndefinedDefault [] color
    , traffic: replicate (length (unwrap r).getJoints) []
    , isclear: true
  }) <$> decodeRail rail

decodeRailInstance :: RailInstance_ EncodedRail -> Maybe RailNode
decodeRailInstance (RailInstance {node:node, pos:pos}) = (\(RailNode n) -> RailNode (n {pos = pos})) <$> decodeRailNode_v1 node 


type RailInstance = RailInstance_ Rail
newtype RailInstance_ x = RailInstance {
    node :: RailNode_ x,
    pos  :: Pos
  }
derive instance Newtype (RailInstance_ x) _

decodeTrainset :: Int -> Array RailNode -> JSM.Map IntNode RailNode -> EncodedTrainset -> Trainset
decodeTrainset ver rsArray rsMap (Trainset {
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
    , tags
    , signalRulePhase
  }) = Trainset {
      types
    , route : decodeTrainRoute ver rsArray rsMap <$> route
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
    , tags : ifUndefinedDefault [] tags
    , signalRulePhase : ifUndefinedDefault signalRulePhase_unfired signalRulePhase
  }


decodeTrainRoute :: Int -> Array RailNode -> JSM.Map IntNode RailNode -> EncodedRoute -> TrainRoute
decodeTrainRoute ver rsArray rsMap (TrainRoute {
      nodeid 
    , jointid
    , railinstance
    , shapes
    , length
  }) = TrainRoute {
            nodeid 
          , jointid
          , railinstance : fromMaybe defaultnode $ 
              if ver <= 2
                then rsArray !! (unwrap railinstance)
                else selectRail rsMap railinstance
          , shapes
          , length
        }

decodeSignal :: EncodedSignal -> Signal
decodeSignal ( {
      signalname
    , nodeid
    , jointid
    , manualStop
    , restraint
    , rules
  }) = Signal {
      signalname
    , nodeid
    , jointid
    , routes     : []
    , indication : []
    , routecond  : []
    , colors     : []
    , manualStop  : ifUndefinedDefault false manualStop
    , restraint   : ifUndefinedDefault false restraint 
    , rules : decodeSignalRules (ifUndefinedDefault [] rules)
  }

decodeSignalRules :: Array String -> Array SignalRule
decodeSignalRules rules = (\r -> decodeSignalRule (ifUndefinedDefault "" r)) <$> rules

decodeSignalRule :: EncodedSignalRule -> SignalRule
decodeSignalRule rule =
  let rule_ = Re.replace (Re.unsafeRegex  "\\s+" Re.global) " " $ St.trimStart rule
      spl   = St.split (St.Pattern " ") rule_
  in fromMaybe (RuleComment rule) $ case spl !! 0 of
      Just "c" ->RuleComplex       <$>                                                                                                                              Just (Re.replace (Re.unsafeRegex  "^\\s*."                         Re.noFlags) "" rule)
      Just "m" ->RuleSpeed         <$> ((\x -> hush (Re.regex x Re.noFlags)) =<< spl !! 1) <*> (Int.fromString =<< spl !! 2)                                    <*> Just (Re.replace (Re.unsafeRegex  "^\\s*.\\s+\\S*\\s+\\S*"         Re.noFlags) "" rule)
      Just "o" ->RuleOpen          <$> ((\x -> hush (Re.regex x Re.noFlags)) =<< spl !! 1) <*> (Int.fromString =<< spl !! 2)                                    <*> Just (Re.replace (Re.unsafeRegex  "^\\s*.\\s+\\S*\\s+\\S*"         Re.noFlags) "" rule)
      Just "u" ->RuleUpdate        <$> ((\x -> hush (Re.regex x Re.noFlags)) =<< spl !! 1) <*> ((\x -> hush (Re.regex x Re.noFlags)) =<< spl !! 2) <*> spl !! 3 <*> Just (Re.replace (Re.unsafeRegex  "^\\s*.\\s+\\S*\\s+\\S*\\s+\\S*" Re.noFlags) "" rule)
      Just "s" ->RuleStop          <$> ((\x -> hush (Re.regex x Re.noFlags)) =<< spl !! 1)                                                                      <*> Just (Re.replace (Re.unsafeRegex  "^\\s*.\\s+\\S*"                 Re.noFlags) "" rule)
      Just "O" ->RuleStopOpen      <$> ((\x -> hush (Re.regex x Re.noFlags)) =<< spl !! 1) <*> (Int.fromString =<< spl !! 2)                                    <*> Just (Re.replace (Re.unsafeRegex  "^\\s*.\\s+\\S*\\s+\\S*"         Re.noFlags) "" rule)
      Just "U" ->RuleStopUpdate    <$> ((\x -> hush (Re.regex x Re.noFlags)) =<< spl !! 1) <*> ((\x -> hush (Re.regex x Re.noFlags)) =<< spl !! 2) <*> spl !! 3 <*> Just (Re.replace (Re.unsafeRegex  "^\\s*.\\s+\\S*\\s+\\S*\\s+\\S*" Re.noFlags) "" rule)
      Just "r" ->RuleReverse       <$> ((\x -> hush (Re.regex x Re.noFlags)) =<< spl !! 1)                                                                      <*> Just (Re.replace (Re.unsafeRegex  "^\\s*.\\s+\\S*"                 Re.noFlags) "" rule)
      Just "R" ->RuleReverseUpdate <$> ((\x -> hush (Re.regex x Re.noFlags)) =<< spl !! 1) <*> ((\x -> hush (Re.regex x Re.noFlags)) =<< spl !! 2) <*> spl !! 3 <*> Just (Re.replace (Re.unsafeRegex  "^\\s*.\\s+\\S*\\s+\\S*\\s+\\S*" Re.noFlags) "" rule)
      _        -> Nothing

decodeLayout :: {floor :: Foreign, rails :: Foreign, trains :: Foreign, signals :: Foreign, time :: Foreign, speed :: Foreign, version:: Int, routequeue :: Foreign, activeReserves :: Foreign} -> Layout
decodeLayout {floor: f, rails: r, trains: t, time: time, speed: speed, version: v, routequeue:routequeue, activeReserves:activeReserves} =
  decodeLayout' {
      floor : unsafeFromForeign f
    , rails: unsafeFromForeign <$> (if isArray r then unsafeFromForeign r else [])
    , trains: if isArray t then unsafeFromForeign t else []
    , time : fromRight 0.0 $ unwrap $ runExceptT $ (readNumber time  :: ExceptT (NonEmptyList ForeignError) Identity Number)
    , speed: fromRight 1.0 $ unwrap $ runExceptT $ (readNumber speed :: ExceptT (NonEmptyList ForeignError) Identity Number)
    , version: v
    , routequeue: if isArray routequeue then unsafeFromForeign routequeue else []
    , activeReserves: if isArray activeReserves then unsafeFromForeign activeReserves else []
  }

decodeLayout' :: EncodedLayout -> Layout
decodeLayout' {floor: floor, rails: rarr, trains: tarr, time: traw, speed: sraw, routequeue: routequeue, version: ver, activeReserves:activeReserves} =
  let rawrails = 
        if ver <= 1
          then (decodeRailInstance <<< unsafeFromForeign <<< unsafeToForeign) <$> rarr
          else decodeRailNode <$> rarr
      deleted = (mapWithIndex (\i r -> {index: IntNode i, isdeleted: isNothing r}) >>> filter (\r -> r.isdeleted) >>> map (\r -> r.index)) rawrails
      rs = catMaybes rawrails
      ts = decodeTrainset ver rs (JSM.fromFoldable (map (\r@(RailNode rn) -> Tuple rn.nodeid r) rs)) <$> tarr
      l0 = Layout {
          floor: ifUndefinedDefault defaultFloorData floor,
          jointData : saEmpty, 
          rails : JSM.fromFoldable (map (\r@(RailNode rn) -> Tuple rn.nodeid r) rs),
          trains : ts,
          updatecount: 0,
          instancecount: 1 + foldl (\x (RailNode r) -> Prelude.max x (unwrap r.nodeid)) (-1) rs ,
          traincount: 1 + foldl (\x (Trainset t) -> Prelude.max x t.trainid) (-1) ts,
          version: 2,
          time  : ifUndefinedDefault 0.0 traw,
          speed : ifUndefinedDefault 1.0 sraw,
          routequeue : ifUndefinedDefault [] routequeue,
          signalcolors : [],
          activeReserves : ifUndefinedDefault [] activeReserves

        }
      (Layout layout) = foldl removeRail l0 (reverse $ sort deleted)

      migrateToV3 :: Layout -> Layout
      migrateToV3 (Layout l) =
        let
          findInstanceId :: IntNode -> IntNode
          findInstanceId origNodeId =
            case selectRail l.rails origNodeId of
              Just (RailNode r) -> r.nodeid
              Nothing -> origNodeId

          migrateRail :: RailNode -> RailNode
          migrateRail (RailNode r) =
            let
              newConnections = map (\c -> c { nodeid = findInstanceId c.nodeid }) r.connections
              newSignals = map (\(Signal s) -> Signal $ s { nodeid = r.nodeid }) r.signals
              newInvalidRoutes = map (\(InvalidRoute s) -> InvalidRoute $ s { nodeid = r.nodeid }) r.invalidRoutes
            in RailNode $ r {
                nodeid = r.nodeid
              , connections = newConnections
              , signals = newSignals
              , invalidRoutes = newInvalidRoutes
              }

          migrateTrain :: Trainset -> Trainset
          migrateTrain (Trainset t) =
            let
              migrateRoute (TrainRoute r) =
                let
                  newId = findInstanceId r.nodeid
                  newRail = case selectRail migratedRails newId of
                              Just rl -> rl
                              Nothing -> r.railinstance
                in TrainRoute $ r {
                    nodeid = newId
                  , railinstance = newRail
                  }
            in Trainset $ t { route = map migrateRoute t.route }

          migratedRails = JSM.fromFoldable (map (\r@(RailNode rn) -> Tuple rn.nodeid r) (map migrateRail (JSM.values l.rails)))
          migratedTrains = map migrateTrain l.trains
        in Layout $ l {
            rails = migratedRails
          , trains = migratedTrains
          , version = 3
          }

      migratedLayout =
        if ver <= 2
          then migrateToV3 (Layout layout)
          else Layout layout

      joints = (do
          let (Layout ml) = migratedLayout
          (RailNode r) <- JSM.values ml.rails
          let nodeid = r.nodeid
          jointid <- (unwrap r.rail).getJoints
          pos <- maybe [] pure $ getJointAbsPos migratedLayout nodeid jointid
          pure {nodeid: nodeid, jointid: jointid, pos: pos}
        )
      (Layout layout') =
        updateSignalRoutes $
        foldl (\l j -> addJoint l j.pos j.nodeid j.jointid) migratedLayout joints
  in  if JSM.size layout'.rails == 0 then defaultLayout else (Layout layout')

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