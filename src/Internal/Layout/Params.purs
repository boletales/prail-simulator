-- 物理的な定数群

module Internal.Layout.Params
  ( baseaccr
  , basedccr
  , brakePattern
  , carLength
  , carMargin
  , indicationToSpeed
  , speedScale
  , wheelMargin
  , wheelWidth
  )
  where

import Prelude

baseaccr ∷ Number
baseaccr = 0.4
basedccr ∷ Number
basedccr = 0.6

brakePattern ∷ Number → Number → Number
brakePattern speed finalspeed = 
  let a = basedccr
      t = (speed - finalspeed) / a
  in 0.2 + max 0.0 (finalspeed * t + 0.5 * a * t * t)


indicationToSpeed ∷ Int → Number
indicationToSpeed i =
  case i of
    0 ->   0.0 * speedScale
    1 ->  25.0 * speedScale
    2 ->  45.0 * speedScale
    3 ->  65.0 * speedScale
    4 -> 100.0 * speedScale
    _ -> 100.0 * speedScale


speedScale ∷ Number
speedScale = 3.0 / 120.0

cmToUnitLength ∷ Number -> Number
cmToUnitLength cm = cm / 21.4

carLength ∷ Number
carLength = cmToUnitLength 10.0
carMargin ∷ Number
carMargin = cmToUnitLength 1.0
wheelWidth ∷ Number
wheelWidth = cmToUnitLength 3.4
wheelMargin ∷ Number
wheelMargin = cmToUnitLength 2.0