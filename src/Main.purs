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

import Data.Array
import Data.Maybe
import Data.Newtype
import Data.Number
import Foreign
import Internal.Layout
import Internal.Rails
import Internal.Types
import Prelude

import Control.Monad.Except (runExceptT)
import Data.Either (either)
import Data.FoldableWithIndex (foldlWithIndex)
import Data.Function (on)
import Data.Identity (Identity)
import Effect (Effect)
import Foreign.Object as FO
import Internal.Layout as Ex
import Internal.Rails as Ex
import Internal.Types as Ex
import Prelude as Prelude


defaultLayout ∷ Layout
defaultLayout = 
    let node = {
            nodeid : 0,
            state : 0,
            rail : straightRail,
            connections : []
          }
        rinst = RailInstance {
            node : RailNode node,
            instanceid: 0,
            pos : reversePos poszero,
            signals:[],
            wrongways:[]
          }
        jrel i = unwrap $ (unwrap node.rail).getJointPos i
    in ((\l -> foldl (\l' j -> addJoint l' (jrel j) node.nodeid j) l (unwrap node.rail).getJoints) $ Layout {
          instancecount: 1,
          traincount: 0,
          updatecount: 0,
          rails : [rinst],
          trains : [],
          traffic : [],
          signalcolors : [],
          jointData : saEmpty,
          version : 1
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
  ]

type EncodedSignal = Signal
type EncodedRail = {name :: String, flipped :: Boolean, opposed :: Boolean}
type EncodedLayout = {rails :: Array(RailInstance_ EncodedRail), trains :: Array EncodedTrainset, version :: Int}
type EncodedTrainset = Trainset_ Int
type EncodedRoute = Route_ Int

encodeRail :: Rail -> EncodedRail
encodeRail (RailGen r) = {name: r.name, flipped: r.flipped, opposed: r.opposed}

encodeRailNode :: RailNode -> RailNode_ EncodedRail
encodeRailNode (RailNode {nodeid:nodeid, rail:rail, state:state, connections:connections}) = RailNode {nodeid:nodeid, rail:encodeRail rail, state:state, connections:connections}

encodeRailInstance :: RailInstance -> RailInstance_ EncodedRail
encodeRailInstance (RailInstance {node:node, instanceid:instanceid, pos:pos, signals:signals, wrongways:wrongways}) = RailInstance {node:encodeRailNode node, instanceid:instanceid, pos:pos, signals:signals, wrongways:wrongways}

encodeTrainset :: Trainset -> EncodedTrainset
encodeTrainset (Trainset {
      types
    , route
    , distanceToNext
    , distanceFromOldest
    , speed
    , trainid
    , flipped
  }) = Trainset {
      types
    , route : encodeRoute <$> route
    , distanceToNext
    , distanceFromOldest
    , speed
    , trainid
    , flipped
  }

encodeRoute :: Route -> EncodedRoute
encodeRoute (Route {
      nodeid 
    , jointid
    , railinstance
    , shapes
    , length
  }) = Route {
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
    , routes
    , indication
    , colors
  }) = Signal {
      signalname
    , nodeid
    , jointid
    , colors
    , indication : []
    , routes : []
  }

encodeLayout :: Layout -> EncodedLayout
encodeLayout (Layout layout) = {
    rails: encodeRailInstance <$> layout.rails,
    trains: encodeTrainset <$> layout.trains,
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

decodeRailNode :: RailNode_ EncodedRail -> Maybe RailNode
decodeRailNode (RailNode {nodeid:nodeid, rail:rail, state:state, connections:connections}) = RailNode <$> {nodeid:nodeid, rail:_, state:state, connections:connections} <$> decodeRail rail

decodeRailInstance :: RailInstance_ EncodedRail -> Maybe RailInstance
decodeRailInstance (RailInstance {node:node, instanceid:instanceid, pos:pos, signals: signals, wrongways: wrongways}) = RailInstance <$> {node:_, instanceid: instanceid, pos:pos, signals: signals, wrongways: wrongways} <$> decodeRailNode node 

decodeTrainset :: Array RailInstance -> EncodedTrainset -> Trainset
decodeTrainset rs (Trainset {
      types
    , route
    , distanceToNext
    , distanceFromOldest
    , speed
    , trainid
    , flipped
  }) = Trainset {
      types
    , route : decodeRoute rs <$> route
    , distanceToNext
    , distanceFromOldest
    , speed
    , trainid
    , flipped
  }

decodeRoute :: Array RailInstance ->  EncodedRoute -> Route
decodeRoute rs (Route {
      nodeid 
    , jointid
    , railinstance
    , shapes
    , length
  }) = 
    let 
      defaultnode = {
            nodeid : 0,
            state : 0,
            rail : straightRail,
            connections : []
          }
      rinst = RailInstance {
          node : RailNode defaultnode,
          instanceid: 0,
          pos : reversePos poszero,
          signals : [],
          wrongways : []
        }
    in Route {
            nodeid 
          , jointid
          , railinstance : fromMaybe rinst $ rs !! railinstance
          , shapes
          , length
        }

decodeSignal :: EncodedSignal -> Signal
decodeSignal ( Signal {
      signalname
    , nodeid
    , jointid
    , colors
  }) = Signal {
      signalname
    , nodeid
    , jointid
    , routes : []
    , indication : []
    , colors
  }

decodeLayout :: {rails :: Array(Foreign), trains :: Foreign, signals :: Foreign, version:: Int} -> Layout
decodeLayout {rails: r, trains: t, signals : s, version: v} =
  decodeLayout' {
      rails: unsafeFromForeign <$> r
    , trains: if isArray t then unsafeFromForeign t else []
    , version: v
  }

decodeLayout' :: EncodedLayout -> Layout
decodeLayout' {rails: rarr, trains: tarr, version: ver} =
  let rawrails = decodeRailInstance <$> rarr
      deleted = (mapWithIndex (\i r -> {index: i, isdeleted: isNothing r}) >>> filter (\r -> r.isdeleted) >>> map (\r -> r.index)) rawrails
      defaultnode = {
            nodeid : 0,
            state : 0,
            rail : straightRail,
            connections : []
          }
      rinst = RailInstance {
          node : RailNode defaultnode,
          instanceid: 0,
          pos : reversePos poszero,
          signals : [],
          wrongways : []
        }
      rs = catMaybes rawrails
      ts = decodeTrainset rs <$> tarr
      l0 = Layout {
          jointData:saEmpty, 
          rails:(\(RailInstance ri) -> RailInstance $ ri {instanceid = (unwrap (ri.node)).nodeid})<$>rs,
          trains : ts,
          updatecount: 0,
          instancecount: length rs,
          traincount: 1 + foldl (\x (Trainset t) -> Prelude.max x t.trainid) (-1) ts,
          version: ver,
          traffic : [],
          signalcolors : []
        }
      (Layout layout) = foldl removeRail l0 (reverse $ sort deleted)
      joints = (do
          (RailInstance r) <- layout.rails
          let nodeid = (unwrap r.node).nodeid
          jointid <- (unwrap (unwrap r.node).rail).getJoints
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
              a2' = a2 - pi/2.0 * sign _r
              x0  = (unwrap p1.coord).x - r * cos a1'
              y0  = (unwrap p1.coord).y - r * sin a1'
          in unsafeToForeign {type: "arc", center : Coord {x:x0, y:y0, z:((unwrap p1.coord).z+(unwrap p2.coord).z)/2.0}, radius : r, startangle : a1', endangle : a1'}