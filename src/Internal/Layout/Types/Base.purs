module Internal.Layout.Types.Base where

import Prelude (class Eq, class Ord, class Show, show, (>>>))
import Data.Newtype (class Newtype, unwrap)
import JS.Map.Primitive.Key (class Key) 



newtype IntNode = IntNode Int
instance Show IntNode where
  show = unwrap >>> show
derive instance Ord IntNode
derive instance Eq IntNode
derive instance Newtype IntNode _

instance Key IntNode


newtype IntReserve = IntReserve Int
derive instance Eq IntReserve 