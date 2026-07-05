module Internal.Layout.DrawInfo where

import Prelude
import Data.Newtype
import Data.Maybe
import Data.Array
import Internal.Types
import Internal.Layout.Types
import Internal.Layout.Helper
import Data.Int


layoutDrawInfo :: Layout -> {
      rails :: Array {rails :: Array (DrawRail Pos RealColor), additionals :: Array (DrawAdditional Pos), joints :: Array Pos, instance :: RailNode}
    , signals :: Array (Array {indication :: Array Int, pos :: Pos, signal :: Signal})
    , invalidRoutes :: Array (Array {pos :: Pos, signal :: InvalidRoute})
    , trains ::  Array TrainsetDrawInfo
    , floor  :: FloorData
  }
layoutDrawInfo (Layout layout) =
  {
      rails : (\r -> let (DrawInfo ide) = instanceDrawInfo r 
                      in  {
                              rails: ide.rails
                            , additionals: ide.additionals
                            , joints: getRailJointAbsPos r <$> (unwrap (unwrap r).rail).getJoints
                            , instance : r
                          }) <$> layout.rails

      , signals : (\(RailNode ri) -> map (\(Signal s) -> {
          indication : s.indication,
          pos    : fromMaybe poszero $ getJointAbsPos (Layout layout) s.nodeid s.jointid,
          signal : (Signal s)
        }) ri.signals) <$> layout.rails

      , invalidRoutes : (\(RailNode ri) -> map (\(InvalidRoute s) -> {
          pos    : fromMaybe poszero $ getJointAbsPos (Layout layout) s.nodeid s.jointid,
          signal : (InvalidRoute s)
        }) ri.invalidRoutes) <$> layout.rails

      , trains : trainsetDrawInfo <$> layout.trains
      
      , floor  : layout.floor
  }


instanceDrawInfos :: RailNode -> Array (DrawInfo Pos RealColor)
instanceDrawInfos (RailNode node) =
  ((unwrap node.rail).getDrawInfo
    >>> applyColorOption (node.color) 
    >>> absDrawInfo node.pos
  ) <$> (unwrap node.rail).getStates

recalcInstanceDrawInfo :: RailNode -> RailNode
recalcInstanceDrawInfo (RailNode node) =
  RailNode $ node {drawinfos = instanceDrawInfos (RailNode node)}

instanceDrawInfo :: RailNode -> DrawInfo Pos RealColor
instanceDrawInfo (RailNode node) =
  fromMaybe brokenDrawInfo $ node.drawinfos !! (unwrap node.state)



carLength ∷ Number
carLength = 10.0 / 21.4
carMargin ∷ Number
carMargin = 1.0 / 21.4
trainsetLength ∷ forall t. Trainset_ t → Number
trainsetLength (Trainset t) = (toNumber $ length t.types) * (carLength + carMargin) - carMargin
wheelWidth ∷ Number
wheelWidth = 3.4 / 21.4
wheelMargin ∷ Number
wheelMargin = 2.0 / 21.4


newtype TrainsetDrawInfo = TrainsetDrawInfo ({
      trainid :: Int
    , tags :: Array TrainTag
    , cars :: Array {head :: {r :: Pos, l :: Pos, m :: Pos}, tail :: {r :: Pos, l :: Pos, m :: Pos}, type :: CarType}
    , flipped :: Boolean
    , note :: String
  })
trainsetDrawInfo :: Trainset -> TrainsetDrawInfo
trainsetDrawInfo (Trainset t) =
  let shapes = ((\(TrainRoute r) -> reverse r.shapes) =<< t.route)

      getpos' w d' i =
        case shapes !! i of
          Just (RailShape s) ->
            if s.length < d'
              then getpos' w (d' - s.length) (i + 1)
              else getDividingPoint_rel s.start s.end w (1.0 - d' / s.length)
          Nothing -> poszero

      getpos d w = getpos' w d 0

      -- headpos = (fromMaybe 0.0 (((flip bind) (unwrap >>> _.shapes) >>> head >>> map (unwrap >>> _.length)) t.route)) - 
  in  TrainsetDrawInfo $ {tags: t.tags, note : t.note, flipped : t.flipped, trainid : t.trainid, cars: mapWithIndex (\i ct -> 
          let d = ((toNumber i) * (carLength + carMargin)) + t.distanceToNext
              dh = d + wheelMargin
              dt = d + carLength - wheelMargin
          in {type : ct, head : {r : getpos dh (-wheelWidth/2.0), l : getpos dh ( wheelWidth/2.0), m : getpos dh 0.0}, tail : {r : getpos dt (-wheelWidth/2.0), l : getpos dt ( wheelWidth/2.0), m : getpos dt 0.0}}
        ) t.types}