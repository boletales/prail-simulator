module Internal.Types.Pos where

import Internal.Types.Serial

import Data.Generic.Rep
import Data.Int
import Data.Maybe
import Data.Newtype
import Data.Number
import Data.Number as Number
import Prelude
import Prelude
import Type.Proxy

import Data.Function
import Data.Symbol (class IsSymbol)
import Data.Traversable (scanl)
import Record as R
import Type.Row as R
import Type.RowList as RL

newtype Angle = Angle Number
derive instance Newtype Angle _
instance Eq Angle where
  eq (Angle a) (Angle b) =
    let r = abs ((a - b) `rrem` angleSize)
    in r < 0.01 || abs ((r - angleSize)) < 0.01

angleSize ∷ Number
angleSize = pi * 2.0

anglen ∷ Int → Int → Angle
anglen n i = Angle (toNumber i * (angleSize) / toNumber n)
angle8 ∷ Int → Angle
angle8 = anglen 8

rrem ∷ Number → Number → Number
rrem a b = a - Number.floor (a/b) * b

angleSub ∷ Angle → Angle → Angle
angleSub (Angle a) (Angle b) = 
  let tmp = (a - b) `rrem` angleSize
  in  Angle $ if tmp > angleSize/2.0
      then tmp - angleSize
      else tmp

reverseAngle :: Angle -> Angle
reverseAngle (Angle i) = Angle (i + angleSize / 2.0)

toRadian :: Angle -> Number
toRadian (Angle i) = i * pi * 2.0 / angleSize

fromRadian = Angle

newtype Pos = Pos {
    coord :: Coord,
    angle :: Angle,
    isPlus :: Boolean
  }
derive instance Newtype Pos _

newtype Coord = Coord {
    x :: Number,
    y :: Number,
    z :: Number
  }
derive instance Newtype Coord _


poszero ∷ Pos
poszero = Pos {
    coord: Coord {x:0.0, y:0.0, z:0.0},
    angle: Angle 0.0,
    isPlus: false
  }

newtype RelPos = RelPos Pos
derive instance Newtype RelPos _


reversePos :: Pos -> Pos
reversePos (Pos p) = Pos $ p {angle = reverseAngle p.angle}

toAbsPos :: Pos -> RelPos -> Pos
toAbsPos (Pos {coord: Coord c1, angle: a1, isPlus:_}) (RelPos (Pos {coord: Coord c2, angle: a2, isPlus:p2})) = Pos {
      coord: Coord {
            x:c1.x + (cos (toRadian a1 + pi) * c2.x - sin (toRadian a1 + pi) * c2.y)
          , y:c1.y + (cos (toRadian a1 + pi) * c2.y + sin (toRadian a1 + pi) * c2.x)
          , z:c1.z + c2.z
        }
    , angle: reverseAngle $ over2 Angle add a1 a2
    , isPlus: p2
  }

convertRelPos :: RelPos -> RelPos -> RelPos
convertRelPos (RelPos (Pos {coord: Coord c1, angle: a1, isPlus:p1})) (RelPos (Pos {coord: Coord c2, angle: a2, isPlus:p2})) = RelPos $ Pos {
      coord: Coord {
            x:cos (toRadian (reverseAngle a1)) * (c2.x - c1.x) + sin (toRadian (reverseAngle a1)) * (c2.y - c1.y)
          , y:cos (toRadian (reverseAngle a1)) * (c2.y - c1.y) - sin (toRadian (reverseAngle a1)) * (c2.x - c1.x)
          , z:c2.z - c1.z
        }
    , angle: over2 Angle sub a2 (reverseAngle a1)
    , isPlus: p1
  }


planeDistance :: Pos -> Pos -> Number
planeDistance (Pos {coord: Coord c1}) (Pos {coord: Coord c2}) =
  sqrt $ Number.pow (c2.x - c1.x) 2.0 + Number.pow (c2.y - c1.y) 2.0

canJoin :: Pos -> Pos -> Boolean
canJoin p1 p2 =
     reverseAngle (unwrap p1).angle == (unwrap p2).angle 
  && planeDistance p1 p2 < 0.05
  && on (==) (\(Pos {coord: Coord {z:z}}) -> z) p1 p2
  && on (/=) (\(Pos {isPlus: isPlus}) -> isPlus) p1 p2


partLength :: Pos -> Pos -> Number
partLength (Pos p1) (Pos p2) =
  let a1 = toRadian $ reverseAngle p1.angle
      a2 = toRadian                p2.angle
      pd = if reverseAngle p1.angle == p2.angle
            then planeDistance (Pos p1) (Pos p2)
            else abs $ (cos a1 * ((unwrap p2.coord).x - (unwrap p1.coord).x) + sin a1 * ((unwrap p2.coord).y - (unwrap p1.coord).y)) / sin (a2 - a1) * (toRadian (angleSub p2.angle (reverseAngle p1.angle)))
  in  sqrt $ Number.pow ((unwrap p2.coord).z - (unwrap p1.coord).z) 2.0 + Number.pow pd 2.0

getDividingPoint_rel :: Pos -> Pos -> Number -> Number -> Pos
getDividingPoint_rel (Pos p1) (Pos p2) width t =
  let a1 = toRadian $ reverseAngle p1.angle
      a2 = toRadian                p2.angle
      divp a b = a * (1.0 - t) + b * t
      divpcos a b = a + (b-a)*(1.0-cos(t*pi))/2.0
      at = a1 + (toRadian $ p2.angle `angleSub` (reverseAngle p1.angle)) * t
  in if reverseAngle p1.angle == p2.angle
    then Pos {angle: p2.angle, isPlus:p2.isPlus , coord: Coord {x: divp (unwrap p1.coord).x (unwrap p2.coord).x + width * sin a1, y: divp (unwrap p1.coord).y (unwrap p2.coord).y - width * cos a1, z: divpcos (unwrap p1.coord).z (unwrap p2.coord).z}}
    else  let _r  = (cos a1 * ((unwrap p2.coord).x - (unwrap p1.coord).x) + sin a1 * ((unwrap p2.coord).y - (unwrap p1.coord).y)) / sin (a2 - a1)
              r   = abs _r
              a1' = a1 - pi/2.0 * sign _r
              a2' = a2 - pi/2.0 * sign _r
              at' = at - pi/2.0 * sign _r
              x0  = (unwrap p1.coord).x - r * cos a1'
              y0  = (unwrap p1.coord).y - r * sin a1'
          in Pos {angle: fromRadian at, isPlus:p2.isPlus , coord: Coord {x: x0 + r * cos at' + width * sin at, y: y0 + r * sin at' - width * cos at, z: divp (unwrap p1.coord).z (unwrap p2.coord).z}}

getDividingPoint_abs :: Pos -> Pos -> Number -> Pos
getDividingPoint_abs p1 p2 d = getDividingPoint_rel p1 p2 0.0 (d / partLength p1 p2)