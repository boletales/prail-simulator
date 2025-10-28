module Internal.Types.Rail where

import Data.Maybe
import Data.Newtype
import Data.Number
import Internal.Types.Pos
import Internal.Types.Serial
import Prelude


import Partial.Unsafe
import Data.Array




newtype DrawRail p c = 
  DrawRail {color :: c, shape :: RailShape p}
newtype DrawAdditional p = 
  DrawAdditional {parttype :: String, pos :: p}

newtype DrawInfo p c = DrawInfo {rails :: Array (DrawRail p c), additionals :: Array (DrawAdditional p)}

applyColorOption :: forall p. Array ColorOption -> DrawInfo p ColorType -> DrawInfo p RealColor
applyColorOption opts (DrawInfo de) = 
  DrawInfo {
    rails : (\(DrawRail {color : ct, shape : s}) -> DrawRail {color : toRealColor opts ct, shape : s}) <$> de.rails,
    additionals : de.additionals
  }

brokenDrawInfo :: forall p c. DrawInfo p c
brokenDrawInfo = DrawInfo {rails : [], additionals : []}

type RealColor = String
data ColorType =
    ColorActive
  | ColorPassive
  | ColorAuto
  | ColorFixed
derive instance Eq ColorType

defaultColor :: ColorType -> RealColor
defaultColor ct = case ct of
  ColorActive   -> "#37d"
  ColorPassive  -> "#668"
  ColorAuto     -> "#33a"
  ColorFixed    -> "#866"

instance Show ColorType where
  show ct = case ct of
    ColorActive   -> "active"
    ColorPassive  -> "passive"
    ColorAuto     -> "auto"
    ColorFixed    -> "fixed"
newtype ColorOption = ColorOption {
    colortype :: String,
    color :: RealColor
  }

derive instance Newtype ColorOption _

toRealColor :: Array ColorOption -> ColorType -> RealColor
toRealColor opts ct = 
  let m = find (\(ColorOption o) -> o.colortype == show ct) opts
  in case m of
    Just (ColorOption o) -> o.color
    Nothing -> defaultColor ct


activeRail ∷ ∀ (p806 ∷ Type). RailShape p806 → DrawRail p806 ColorType
activeRail s = DrawRail {color : ColorActive, shape : s}

passiveRail ∷ ∀ (p259 ∷ Type). RailShape p259 → DrawRail p259 ColorType
passiveRail s = DrawRail {color : ColorPassive, shape : s}


newtype RailShape p =
  RailShape {start :: p, end :: p, length :: Number}

derive instance Newtype (RailShape p) _


railShape ∷ forall x. Newtype x Pos => { end ∷ x , start ∷ x } → RailShape x
railShape {start : p1, end : p2} = RailShape {start : p1, end : p2, length : partLength (unwrap p1) (unwrap p2)}


calcMidAngle ∷ Number → Number → Number
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

absParts :: forall c. Pos -> DrawRail RelPos c -> DrawRail Pos c
absParts p (DrawRail {color : c, shape : s}) = DrawRail {color : c, shape : (absShape p s)} 

absAdditional :: Pos -> DrawAdditional RelPos -> DrawAdditional Pos
absAdditional p (DrawAdditional {parttype : t, pos : r}) = DrawAdditional {parttype : t, pos : toAbsPos p r} 

absDrawInfo :: forall c. Pos -> DrawInfo RelPos c -> DrawInfo Pos c
absDrawInfo p (DrawInfo {rails : ps, additionals : as}) = DrawInfo {rails : absParts p <$> ps, additionals : absAdditional p <$> as}

newtype RailGen joint state = RailGen {
    name         :: String,
    flipped      :: Boolean,
    opposed      :: Boolean,
    defaultState :: state,
    getJoints    :: Array joint,
    getStates    :: Array state,
    origin    :: joint,
    getJointPos  :: joint -> RelPos,
    getNewState  :: joint -> state -> {newjoint :: joint, newstate :: state, shape :: Array (RailShape RelPos)},
    getDrawInfo  :: state -> (DrawInfo RelPos ColorType),
    getRoute     :: state -> joint -> joint -> Maybe state,
    isLegal      :: joint -> state -> Boolean,
    lockedBy     :: state -> state -> Array joint,
    isBlocked    :: joint -> state -> joint -> Boolean,
    isSimple     :: Boolean
  }
derive instance Newtype (RailGen a b) _


newtype IntJoint = IntJoint Int
instance Show IntJoint where
  show = unwrap >>> show
derive instance Ord IntJoint
derive instance Eq IntJoint
derive instance Newtype IntJoint _

newtype IntState = IntState Int
instance Show IntState where
  show = unwrap >>> show
derive instance Ord IntState
derive instance Eq IntState
derive instance Newtype IntState _

type Rail = RailGen IntJoint IntState 

class Default a where
  default :: a

toSerialJ ∷ ∀ (b123 ∷ Type). IntSerialize b123 ⇒ b123 → IntJoint
toSerialJ = toSerial >>> IntJoint
toSerialS ∷ ∀ (b116 ∷ Type). IntSerialize b116 ⇒ b116 → IntState
toSerialS = toSerial >>> IntState

fromSerialJ ∷ ∀ (b123 ∷ Type). IntSerialize b123 ⇒ IntJoint → Maybe b123
fromSerialJ = unwrap >>> fromSerial
fromSerialS ∷ ∀ (b116 ∷ Type). IntSerialize b116 ⇒ IntState → Maybe b116
fromSerialS = unwrap >>> fromSerial

fallbackindex1 :: forall e. e -> Array e -> Int -> e
fallbackindex1 e a1 x = 
  if x < length a1
  then unsafePartial $ unsafeIndex a1 x
  else e

fallbackindex2 :: forall e. e -> Array (Array e) -> Int -> Int -> e
fallbackindex2 e a1 x y = 
  if x < length a1
  then  if y < length (unsafePartial $ unsafeIndex a1 x) 
        then unsafePartial $ unsafeIndex (unsafePartial $ unsafeIndex a1 x) y
        else e
  else e

fallbackindex3 :: forall e. e -> Array (Array (Array e)) -> Int -> Int -> Int -> e
fallbackindex3 e a1 x y z = 
  if x < length a1
  then  if y < length (unsafePartial $ unsafeIndex a1 x) 
        then  if z < length (unsafePartial $ unsafeIndex (unsafePartial $ unsafeIndex a1 x) y)
              then unsafePartial $ unsafeIndex (unsafePartial $ unsafeIndex (unsafePartial $ unsafeIndex a1 x) y) z
              else e
        else e
  else e

flipDrawInfo :: forall c. DrawInfo RelPos c → DrawInfo RelPos c
flipDrawInfo   (DrawInfo de) = DrawInfo {rails: flipDrawRail   <$> de.rails, additionals : flipAdditional   <$> de.additionals}

opposeDrawInfo :: forall c. DrawInfo RelPos c → DrawInfo RelPos c
opposeDrawInfo (DrawInfo de) = DrawInfo {rails: opposeDrawRail <$> de.rails, additionals : opposeAdditional <$> de.additionals}

toRail:: forall joint state.
             IntSerialize joint => IntSerialize state =>
             RailGen joint state -> Rail
toRail = toRail_ >>> memorizeRail

toRail_ :: forall joint state.
             IntSerialize joint => IntSerialize state =>
             RailGen joint state -> Rail
toRail_ (RailGen rgen) = 
  let getJoints = rgen.getJoints <#> toSerialJ
      getStates = rgen.getStates <#> toSerialS
  in RailGen {
    name: rgen.name,
    flipped: rgen.flipped,
    opposed: rgen.opposed,
    defaultState: toSerialS (rgen.defaultState :: state),
    getJoints   : getJoints,
    getStates   : getStates,
    origin   : toSerialJ (rgen.origin :: joint),
    getJointPos: \(IntJoint j)                            -> fromMaybe (RelPos poszero)                                        $  rgen.getJointPos <$> (fromSerial j)                                       ,
    getNewState: \(IntJoint j) (IntState s)               -> fromMaybe {newjoint: IntJoint j, newstate: IntState s, shape: []} $ (rgen.getNewState <$> (fromSerial j) <*> (fromSerial s)) <#> (\ns -> {newjoint: toSerialJ ns.newjoint, newstate: toSerialS ns.newstate, shape: ns.shape})                    ,
    getDrawInfo: \(IntState s)                            -> fromMaybe brokenDrawInfo                                          $  rgen.getDrawInfo <$> (fromSerial s)                                       ,
    getRoute   : \(IntState s) (IntJoint f) (IntJoint t)  -> fromMaybe Nothing                                                 $ (rgen.getRoute    <$> (fromSerial s) <*> (fromSerial f) <*> (fromSerial t)) <#> (map toSerialS),
    isLegal    : \(IntJoint j) (IntState s)               -> fromMaybe false                                                   $  rgen.isLegal     <$> (fromSerial j) <*> (fromSerial s)                    ,
    lockedBy   : \(IntState s) (IntState s')              -> fromMaybe []                                                      $ (rgen.lockedBy    <$> (fromSerial s) <*> (fromSerial s')) <#> (map toSerialJ),
    isBlocked  : \(IntJoint j) (IntState s) (IntJoint j') -> fromMaybe false                                                   $  rgen.isBlocked   <$> (fromSerial j) <*> (fromSerial s) <*> (fromSerial j'),
    isSimple   : rgen.isSimple
  }

newstate_fallback ∷ ∀ (t255 ∷ Type). { newjoint ∷ IntJoint , newstate ∷ IntState , shape ∷ Array t255 }
newstate_fallback = {newjoint: IntJoint 0, newstate: IntState 0, shape: []}
memorizeRail :: Rail -> Rail
memorizeRail (RailGen rgen) = 
  let getJoints = rgen.getJoints
      getStates = rgen.getStates
      getJointPos_memo = rgen.getJoints <#> rgen.getJointPos
      getNewState_memo = (rgen.getJoints <#> (\j -> rgen.getStates <#> (\s -> (\ns -> {newjoint: ns.newjoint, newstate: ns.newstate, shape: ns.shape}) $ rgen.getNewState j s)))
      getDrawInfo_memo = rgen.getStates <#> rgen.getDrawInfo
      getRoute_memo   = (rgen.getStates <#> (\x -> rgen.getJoints <#> (\y -> rgen.getJoints <#> (\z -> rgen.getRoute x y z))))
      isLegal_memo    = (rgen.getJoints <#> (\x -> rgen.getStates <#> (\y ->                           rgen.isLegal   x y   )))
      lockedBy_memo   = (rgen.getStates <#> (\x -> rgen.getStates <#> (\y ->                          (rgen.lockedBy  x y)  )))
      isBlocked_memo  = (rgen.getJoints <#> (\x -> rgen.getStates <#> (\y -> rgen.getJoints <#> (\z -> rgen.isBlocked x y z))))
  in RailGen {
    name: rgen.name,
    flipped: rgen.flipped,
    opposed: rgen.opposed,
    defaultState: rgen.defaultState,
    getJoints   : getJoints,
    getStates   : getStates,
    origin   : rgen.origin,
    getJointPos: \(IntJoint j)                            -> fallbackindex1 (RelPos poszero) getJointPos_memo j,
    getNewState: \(IntJoint j) (IntState s)               -> fallbackindex2 newstate_fallback getNewState_memo j s,
    getDrawInfo: \(IntState s)                            -> fallbackindex1 brokenDrawInfo   getDrawInfo_memo s,
    getRoute   : \(IntState s) (IntJoint f) (IntJoint t)  -> fallbackindex3 Nothing          getRoute_memo s f t,
    isLegal    : \(IntJoint j) (IntState s)               -> fallbackindex2 false            isLegal_memo   j s    ,
    lockedBy   : \(IntState s) (IntState s')              -> fallbackindex2 []               lockedBy_memo  s s'   ,
    isBlocked  : \(IntJoint j) (IntState s) (IntJoint j') -> fallbackindex3 false            isBlocked_memo j s  j',
    isSimple   : rgen.isSimple
  }
{-
flipRail :: Rail -> Rail
flipRail (RailGen rgen) = 
  let getJoints        = rgen.getJoints
      getStates        = rgen.getStates
      getJointPos_memo = rgen.getJoints <#> rgen.getJointPos <#> flipRelPos
      getNewState_memo = (rgen.getJoints <#> (\j -> rgen.getStates <#> (\s -> (\ns -> {newjoint: ns.newjoint, newstate: ns.newstate, shape: flipShape <$> ns.shape}) $ rgen.getNewState j s)))
      getDrawInfo_memo = rgen.getStates <#> rgen.getDrawInfo <#> (\(DrawInfo de ) -> DrawInfo {rails: flipDrawRail <$> de.rails , additionals : flipAdditional <$> de.additionals})
      getRoute_memo    = (rgen.getStates <#> (\x -> rgen.getJoints <#> (\y -> rgen.getJoints <#> (\z -> rgen.getRoute x y z))))
      isLegal_memo     = (rgen.getJoints <#> (\x -> rgen.getStates <#> (\y ->                           rgen.isLegal   x y   )))
      lockedBy_memo    = (rgen.getStates <#> (\x -> rgen.getStates <#> (\y ->                          (rgen.lockedBy  x y)  )))
      isBlocked_memo   = (rgen.getJoints <#> (\x -> rgen.getStates <#> (\y -> rgen.getJoints <#> (\z -> rgen.isBlocked x y z))))
  in RailGen {
    name: rgen.name,
    flipped:  not rgen.flipped,
    opposed: rgen.opposed,
    defaultState: rgen.defaultState,
    getJoints   : getJoints,
    getStates   : getStates,
    origin   : rgen.origin,
    getJointPos: \(IntJoint j)   -> fromMaybe (RelPos poszero) (getJointPos_memo !! j),

    getNewState: \(IntJoint j) (IntState s) -> fromMaybe {newjoint: IntJoint j, newstate: IntState s, shape: []} ((getNewState_memo !! j) >>= (_ !! s)),

    getDrawInfo: \(IntState s) -> fromMaybe brokenDrawInfo ((getDrawInfo_memo !! s)),

    getRoute : \(IntState s) (IntJoint f) (IntJoint t)  -> join            ((getRoute_memo  !! s) >>= (_ !! f) >>= (_ !! t )),
    isLegal  : \(IntJoint j) (IntState s)               -> fromMaybe false ((isLegal_memo   !! j) >>= (_ !! s)              ),
    lockedBy : \(IntState s) (IntState s')              -> fromMaybe []    ((lockedBy_memo  !! s) >>= (_ !! s')             ),
    isBlocked: \(IntJoint j) (IntState s) (IntJoint j') -> fromMaybe false ((isBlocked_memo !! j) >>= (_ !! s) >>= (_ !! j')),
    isSimple : rgen.isSimple
  }

opposeRail :: Rail -> Rail
opposeRail (RailGen rgen) = 
  let getJoints = rgen.getJoints
      getStates = rgen.getStates
      getJointPos_memo = rgen.getJoints <#> rgen.getJointPos <#> opposeRelPos
      getNewState_memo = (rgen.getJoints <#> (\j -> rgen.getStates <#> (\s -> (\ns -> {newjoint: ns.newjoint, newstate: ns.newstate, shape: ns.shape}) $ rgen.getNewState j s)))
      getDrawInfo_memo = rgen.getStates <#> rgen.getDrawInfo <#> (\(DrawInfo de) -> DrawInfo {rails: opposeDrawRail <$> de.rails, additionals : opposeAdditional <$> de.additionals})
      getRoute_memo   = (rgen.getStates <#> (\x -> rgen.getJoints <#> (\y -> rgen.getJoints <#> (\z -> rgen.getRoute x y z))))
      isLegal_memo    = (rgen.getJoints <#> (\x -> rgen.getStates <#> (\y ->                           rgen.isLegal   x y   )))
      lockedBy_memo   = (rgen.getStates <#> (\x -> rgen.getStates <#> (\y ->                          (rgen.lockedBy  x y)  )))
      isBlocked_memo  = (rgen.getJoints <#> (\x -> rgen.getStates <#> (\y -> rgen.getJoints <#> (\z -> rgen.isBlocked x y z))))
  in RailGen {
    name: rgen.name,
    flipped: rgen.flipped,
    opposed: not rgen.opposed,
    defaultState: rgen.defaultState,
    getJoints   : getJoints,
    getStates   : getStates,
    origin   : rgen.origin,
    getJointPos: \(IntJoint j)   -> fromMaybe (RelPos poszero) (getJointPos_memo !! j),

    getNewState: \(IntJoint j) (IntState s) -> fromMaybe {newjoint: IntJoint j, newstate: IntState s, shape: []} ((getNewState_memo !! j) >>= (_ !! s)),

    getDrawInfo: \(IntState s) -> fromMaybe brokenDrawInfo ((getDrawInfo_memo !! s)),

    getRoute : \(IntState s) (IntJoint f) (IntJoint t)  -> join            ((getRoute_memo  !! s) >>= (_ !! f) >>= (_ !! t )),
    isLegal  : \(IntJoint j) (IntState s)               -> fromMaybe false ((isLegal_memo   !! j) >>= (_ !! s)              ),
    lockedBy : \(IntState s) (IntState s')              -> fromMaybe []    ((lockedBy_memo  !! s) >>= (_ !! s')             ),
    isBlocked: \(IntJoint j) (IntState s) (IntJoint j') -> fromMaybe false ((isBlocked_memo !! j) >>= (_ !! s) >>= (_ !! j')),
    isSimple : rgen.isSimple
  }
-}

{-
fromRail :: forall joint state.
            IntSerialize joint => IntSerialize state => Default state => Default state =>
            Rail -> RailGen joint state 
fromRail (RailGen rail) = RailGen {
    name: rail.name,
    defaultState: fromMaybe default (fromSerial rail.defaultState),
    origin   : fromMaybe default (fromSerial rail.origin),
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



flipShape ∷ RailShape RelPos → RailShape RelPos
flipShape (RailShape {start:s, end:e, length:l}) = RailShape {start:flipRelPos s, end:flipRelPos e, length:l}

flipDrawRail ∷ forall c. DrawRail RelPos c → DrawRail RelPos c
flipDrawRail (DrawRail {color : c, shape : s}) = DrawRail {color : c, shape : flipShape s}
flipAdditional ∷ DrawAdditional RelPos → DrawAdditional RelPos
flipAdditional (DrawAdditional {parttype: s, pos : p}) = DrawAdditional {parttype: s, pos : flipRelPos p}


opposeShape ∷ RailShape RelPos → RailShape RelPos
opposeShape (RailShape {start:s, end:e, length:l}) = RailShape {start:opposeRelPos s, end:opposeRelPos e, length:l}

opposeDrawRail ∷ forall c. DrawRail RelPos c → DrawRail RelPos c
opposeDrawRail (DrawRail {color : c, shape : s}) = DrawRail {color : c, shape : opposeShape s}
opposeAdditional ∷ DrawAdditional RelPos → DrawAdditional RelPos
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

flipRail_ :: forall x y. RailGen x y -> RailGen x y
flipRail_ (RailGen r) = RailGen $ r {
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

opposeRail_ :: forall x y. RailGen x y -> RailGen x y
opposeRail_ (RailGen r) = RailGen $ r {
    opposed = not r.opposed,
    getJointPos  = r.getJointPos >>> opposeRelPos,
    getDrawInfo  = \x   -> 
      let DrawInfo de = (r.getDrawInfo x)
      in  DrawInfo {
              rails       : opposeDrawRail <$> de.rails
            , additionals : opposeAdditional <$> de.additionals
          }
  }

flipRail :: Rail -> Rail
flipRail = flipRail_ >>> memorizeRail

opposeRail :: Rail -> Rail
opposeRail = opposeRail_ >>> memorizeRail

reverseShapes :: forall x. Array (RailShape x) -> Array (RailShape x)
reverseShapes = reverse >>> map (\(RailShape s) -> RailShape {start: s.end, end: s.start, length: s.length})
