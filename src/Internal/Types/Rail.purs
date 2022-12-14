module Internal.Types.Rail where

import Data.Generic.Rep
import Data.Maybe
import Data.Newtype
import Data.Number
import Internal.Types.Pos
import Internal.Types.Serial
import Prelude
import Prelude
import Type.Proxy

import Data.Array (reverse, any)
import Data.Symbol (class IsSymbol)
import Data.Traversable (scanl)
import Record as R
import Type.Row as R
import Type.RowList as RL




newtype DrawRail p = 
  DrawRail {color :: Color, shape :: RailShape p}
newtype DrawAdditional p = 
  DrawAdditional {parttype :: String, pos :: p}

newtype DrawInfo p = DrawInfo {rails :: Array (DrawRail p), additionals :: Array (DrawAdditional p)}

brokenDrawInfo :: forall p. DrawInfo p
brokenDrawInfo = DrawInfo {rails : [], additionals : []}

type Color = String

blue = "#37d"
blueRail s = DrawRail {color : blue, shape : s}

gray = "#668"
grayRail s = DrawRail {color : gray, shape : s}


newtype RailShape p =
  RailShape {start :: p, end :: p, length :: Number}

derive instance Newtype (RailShape p) _


railShape ∷ forall x. Newtype x Pos => { end ∷ x , start ∷ x } → RailShape x
railShape {start : p1, end : p2} = RailShape {start : p1, end : p2, length : partLength (unwrap p1) (unwrap p2)}


calcMidAngle x y =
  let r = (y `pow` 2.0 + x `pow`2.0) / (2.0*y)
  in  asin (x/r)

slipShapes ∷ forall x. Newtype x Pos => { end ∷ x , start ∷ x } → Array (RailShape x)
slipShapes {start : p1, end : p2} = 
  let pp = wrap $ wrap $ (unwrap $ getDividingPoint_rel (unwrap p1) (unwrap p2) 0.0 0.5) {
              angle= 
                let a2 = toRadian (unwrap (unwrap p2)).angle
                    c1 = (unwrap (unwrap (unwrap p1)).coord)
                    c2 = (unwrap (unwrap (unwrap p2)).coord)
                    dx = c2.x - c1.x
                    dy = c2.y - c1.y
                in fromRadian $ (toRadian (unwrap (unwrap p2)).angle + calcMidAngle (cos a2 * dx + sin a2 * dy) (cos a2 * dy - sin a2 * dx))
            }
  in [railShape {start : p1, end : pp}, railShape {start : wrap $ reversePos (unwrap pp), end : p2}]

shapeLength :: RailShape Pos -> Number
shapeLength (RailShape s) = partLength s.start s.end


absShape :: Pos -> RailShape RelPos -> RailShape Pos
absShape p (RailShape {start : s, end : e, length:l}) = RailShape {start : toAbsPos p s, end : toAbsPos p e, length:l}           

absParts :: Pos -> DrawRail RelPos -> DrawRail Pos
absParts p (DrawRail {color : c, shape : s}) = DrawRail {color : c, shape : (absShape p s)} 

absAdditional :: Pos -> DrawAdditional RelPos -> DrawAdditional Pos
absAdditional p (DrawAdditional {parttype : t, pos : r}) = DrawAdditional {parttype : t, pos : toAbsPos p r} 

absDrawInfo :: Pos -> DrawInfo RelPos -> DrawInfo Pos
absDrawInfo p (DrawInfo {rails : ps, additionals : as}) = DrawInfo {rails : absParts p <$> ps, additionals : absAdditional p <$> as}

newtype RailGen joint state = RailGen {
    name         :: String,
    flipped      :: Boolean,
    opposed      :: Boolean,
    defaultState :: state,
    getJoints    :: Array joint,
    getStates    :: Array state,
    getOrigin    :: joint,
    getJointPos  :: joint -> RelPos,
    getNewState  :: joint -> state -> {newjoint :: joint, newstate :: state, shape :: Array (RailShape RelPos)},
    getDrawInfo  :: state -> (DrawInfo RelPos),
    getRoute     :: state -> joint -> joint -> Maybe state,
    isLocked     :: joint -> state -> state -> Boolean,
    isBlocked    :: joint -> state -> joint -> Boolean,
    isSimple     :: Boolean
  }
derive instance Newtype (RailGen a b) _

interlockRoute :: forall j s. RailGen j s -> Array j -> s -> j -> j -> Maybe s
interlockRoute (RailGen rail) locks now from to = 
  case rail.getRoute now from to of
    Nothing -> Nothing
    Just newstate ->
      if any (\l -> rail.isLocked l now newstate) locks
      then Nothing
      else if any (\l -> rail.isBlocked l newstate from) locks
           then Nothing
           else Just newstate

type Rail = RailGen Int Int

class Default a where
  default :: a

toRail :: forall joint state.
            IntSerialize joint => IntSerialize state =>
            RailGen joint state -> Rail
toRail (RailGen rgen) = RailGen {
    name: rgen.name,
    flipped: rgen.flipped,
    opposed: rgen.opposed,
    defaultState: toSerial (rgen.defaultState :: state),
    getJoints   : toSerial <$> rgen.getJoints,
    getStates   : toSerial <$> rgen.getStates,
    getOrigin   : toSerial (rgen.getOrigin :: joint),
    getJointPos: \j   -> fromMaybe 
                            (RelPos poszero)           
                            (rgen.getJointPos <$> fromSerial j),

    getNewState: \j s -> fromMaybe
                            {newjoint: j, newstate: s, shape: []} 
                            ((\ns -> {newjoint: toSerial ns.newjoint, newstate: toSerial ns.newstate, shape: ns.shape})
                              <$> (rgen.getNewState <$> fromSerial j <*> fromSerial s)),

    getDrawInfo: \s -> fromMaybe
                            brokenDrawInfo
                            (rgen.getDrawInfo <$> fromSerial s),

    getRoute : \s f t  -> toSerial <$>   (rgen.getRoute  <$> fromSerial s <*> fromSerial f <*> fromSerial t ),
    isLocked : \j s s' -> fromMaybe true (rgen.isLocked  <$> fromSerial j <*> fromSerial s <*> fromSerial s'),
    isBlocked: \j s j' -> fromMaybe true (rgen.isBlocked <$> fromSerial j <*> fromSerial s <*> fromSerial j'),
    isSimple : rgen.isSimple
  }

{-
fromRail :: forall joint state.
            IntSerialize joint => IntSerialize state => Default state => Default state =>
            Rail -> RailGen joint state 
fromRail (RailGen rail) = RailGen {
    name: rail.name,
    defaultState: fromMaybe default (fromSerial rail.defaultState),
    getOrigin   : fromMaybe default (fromSerial rail.getOrigin),
    getJointPos: \j   -> (rail.getJointPos (toSerial j)),

    getNewState: \j s -> fromMaybe
                            {newjoint: j, newstate: s, shape: []} 
                            ((do
                                let {newjoint: mnj, newstate: mns, shape:sh} = rail.getNewState (toSerial j) (toSerial s)
                                nj <- fromSerial mnj
                                ns <- fromSerial mns
                                pure {newjoint: nj, newstate: ns, shape: sh}
                              )),
    
    getDrawInfo: \s -> (rail.getDrawInfo (toSerial s))
  }
-}



flipShape (RailShape {start:s, end:e, length:l}) = RailShape {start:flipRelPos s, end:flipRelPos e, length:l}

flipDrawRail (DrawRail {color : c, shape : s}) = DrawRail {color : c, shape : flipShape s}
flipAdditional (DrawAdditional {parttype: s, pos : p}) = DrawAdditional {parttype: s, pos : flipRelPos p}


opposeShape (RailShape {start:s, end:e, length:l}) = RailShape {start:opposeRelPos s, end:opposeRelPos e, length:l}

opposeDrawRail (DrawRail {color : c, shape : s}) = DrawRail {color : c, shape : opposeShape s}
opposeAdditional (DrawAdditional {parttype: s, pos : p}) = DrawAdditional {parttype: s, pos : opposeRelPos p}

flipRelCoord ∷ Coord → Coord
flipRelCoord (Coord {x:x, y:y, z:z}) = Coord {x:x, y:(-y), z:z}

flipRelPos :: RelPos -> RelPos
flipRelPos (RelPos (Pos p)) = RelPos (Pos {
    coord: flipRelCoord p.coord,
    angle : over Angle negate p.angle,
    isPlus : p.isPlus
  })


opposeRelPos :: RelPos -> RelPos
opposeRelPos (RelPos (Pos p)) = RelPos (Pos $ p {
    isPlus = not p.isPlus
  })

flipRail :: forall x y. RailGen x y -> RailGen x y
flipRail (RailGen r) = RailGen $ r {
    flipped = not r.flipped,
    getJointPos  = r.getJointPos >>> flipRelPos,
    getNewState  = \x y -> (\{newstate:ns, newjoint:nj, shape:s} -> {newstate:ns, newjoint:nj, shape:flipShape <$> s}) (r.getNewState x y),
    getDrawInfo  = \x   -> 
      let DrawInfo de = (r.getDrawInfo x)
      in  DrawInfo {
              rails       : flipDrawRail <$> de.rails
            , additionals : flipAdditional <$> de.additionals
          }
  }

opposeRail :: forall x y. RailGen x y -> RailGen x y
opposeRail (RailGen r) = RailGen $ r {
    opposed = not r.opposed,
    getJointPos  = r.getJointPos >>> opposeRelPos,
    getDrawInfo  = \x   -> 
      let DrawInfo de = (r.getDrawInfo x)
      in  DrawInfo {
              rails       : opposeDrawRail <$> de.rails
            , additionals : opposeAdditional <$> de.additionals
          }
  }


reverseShapes :: forall x. Array (RailShape x) -> Array (RailShape x)
reverseShapes = reverse >>> map (\(RailShape s) -> RailShape {start: s.end, end: s.start, length: s.length})