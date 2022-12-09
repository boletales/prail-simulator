module Internal.Types.Serial where

import Prelude

import Data.Generic.Rep
import Data.Maybe
import Data.Array
import Data.Maybe
import Prelude
import Type.Proxy

import Data.Symbol (class IsSymbol)
import Record as R
import Type.Row as R
import Type.RowList as RL


unsafeToSerial = fromJust <<< fromSerial

proxy :: forall a. a -> Proxy a
proxy = const Proxy

class RowListSerialize ::  RL.RowList Type -> Row Type -> Constraint
class RowListSerialize list row | list -> row where
  rlfromSerial   :: Proxy list -> Int      -> Maybe { | row}
  rltoSerial     :: Proxy list -> { | row} -> Int
  rllengthSerial :: Proxy list             -> Int

instance (RL.RowToList () (RL.Nil)) => RowListSerialize RL.Nil () where
  rlfromSerial   = \_ i -> if 0 <= i && i < 1 then Just {} else Nothing
  rltoSerial     = \_ _ -> 0
  rllengthSerial = \_   -> 1

instance (RL.RowToList row (RL.Cons n x xs), IsSymbol n, IntSerialize x, RowListSerialize xs rs', RL.RowToList rs' xs, R.Cons n x rs' row, R.Lacks n rs') => RowListSerialize (RL.Cons n x xs) row where
  rlfromSerial   = (\_ i -> 
                    let l1 = lengthSerial (Proxy :: Proxy x) 
                        l2 = rllengthSerial (Proxy :: Proxy xs)
                    in if 0 <= i && i < l1*l2  then ((R.insert (Proxy :: Proxy n)) <$> fromSerial (i `mod` l1) <*> rlfromSerial (Proxy :: Proxy xs) (i `div` l1)) else Nothing)
  rltoSerial     = \_ (rec :: Record row)  -> toSerial (R.get (Proxy :: Proxy n) rec) + (rltoSerial (Proxy :: Proxy xs) (R.delete (Proxy :: Proxy n) rec) * rllengthSerial (Proxy :: Proxy xs))
  rllengthSerial = const $ lengthSerial (Proxy :: Proxy x) * rllengthSerial (Proxy :: Proxy xs)


class IntSerialize a where
  fromSerial   :: Int -> Maybe a
  toSerial     :: a   -> Int
  lengthSerial :: Proxy a -> Int

serialAll :: forall a. IntSerialize a => Array a
serialAll = catMaybes $ fromSerial <$> (range 0 (lengthSerial (Proxy :: Proxy a) - 1))

instance IntSerialize Boolean where
  fromSerial     = \i -> case i of 
                    0 -> Just false
                    1 -> Just true
                    _ -> Nothing
  toSerial   = \b -> if b then 1 else 0
  lengthSerial = const 2

else instance (RL.RowToList row rl, RowListSerialize rl row) => IntSerialize {|row} where
  fromSerial   = rlfromSerial (Proxy :: Proxy rl)
  toSerial     = rltoSerial (Proxy :: Proxy rl)
  lengthSerial = const $ rllengthSerial (Proxy :: Proxy rl)

else instance IntSerialize (NoArguments) where
  fromSerial   = \i -> if 0 <= i && i < 1 then (Just NoArguments) else Nothing
  toSerial     = const 0
  lengthSerial = const 1

else instance (IntSerialize a1) => IntSerialize (Argument a1) where
  fromSerial   = \i -> 
                    let l1 = lengthSerial (Proxy :: Proxy a1) 
                    in if 0 <= i && i < l1 then (Argument <$> fromSerial i) else Nothing
  toSerial     = (\(Argument x) -> toSerial x)
  lengthSerial = const $ lengthSerial (Proxy :: Proxy a1)

else instance (IntSerialize a1) => IntSerialize (Constructor n a1) where
  fromSerial   = \i -> 
                    let l1 = lengthSerial (Proxy :: Proxy a1) 
                    in if 0 <= i && i < l1 then (Constructor <$> fromSerial i) else Nothing
  toSerial     = (\(Constructor x) -> toSerial x)
  lengthSerial = const $ lengthSerial (Proxy :: Proxy a1)

else instance (Generic a (Product a1 a2), IntSerialize a1, IntSerialize a2)=> IntSerialize (Product a1 a2) where
  fromSerial   = \i -> 
                    let l1 = lengthSerial (Proxy :: Proxy a1) 
                        l2 = lengthSerial (Proxy :: Proxy a2)
                    in if 0 <= i && i < l1*l2  then (Product <$> fromSerial (i `mod` l1) <*> fromSerial (i `div` l1)) else Nothing
  toSerial     = (\(Product x y) -> toSerial x + (toSerial y * lengthSerial (Proxy :: Proxy a1)))
  lengthSerial = const $ lengthSerial (Proxy :: Proxy a1) * lengthSerial (Proxy :: Proxy a2)

else instance (IntSerialize a1, IntSerialize a2)=> IntSerialize (Sum a1 a2) where
  fromSerial   = \i -> 
                    let l1 = lengthSerial (Proxy :: Proxy a1) 
                        l2 = lengthSerial (Proxy :: Proxy a2)
                    in if 0 <= i && i < l1 
                        then (Inl <$> fromSerial i) 
                        else if i < l1+l2  
                          then (Inr <$> fromSerial (i - l1))  
                          else Nothing
  toSerial     = (\x' -> case x' of
                              Inl x -> toSerial x
                              Inr x -> toSerial x + lengthSerial (Proxy :: Proxy a1) 
                            )
  lengthSerial = const $ lengthSerial (Proxy :: Proxy a1) +  lengthSerial (Proxy :: Proxy a2)

else instance (Generic a rep, IntSerialize rep) => IntSerialize a where
  fromSerial = \i -> to <$> fromSerial i
  toSerial   = from >>> toSerial
  lengthSerial = \_ -> lengthSerial (Proxy :: Proxy rep)