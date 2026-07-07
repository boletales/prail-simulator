module Internal.Types.SectionArray
  ( SectionArray(..)
  , saEmpty
  , saIndex
  , saModifyAt
  )
  where


import Prelude
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Array (modifyAt, replicate, (!!))

newtype SectionArray a = SectionArray {
    arraydata :: Array a,
    head :: Int,
    end :: Int
  }

instance Functor SectionArray where
  map f (SectionArray sa) = SectionArray {
    arraydata : f <$> sa.arraydata,
    head : sa.head,
    end : sa.end
  }

saEmpty ∷ ∀ (t115 ∷ Type). SectionArray t115
saEmpty = SectionArray {
    arraydata : [],
    head : 0,
    end : 0
  }

saIndex ∷ ∀ (t109 ∷ Type). Int → SectionArray t109 → Maybe t109
saIndex i (SectionArray sa) = sa.arraydata !! (i - sa.head)

saModifyAt :: forall a. Int -> a -> (Maybe a -> a) -> SectionArray a -> SectionArray a
saModifyAt i d f (SectionArray sa) = 
  if i < sa.head
    then SectionArray {
            arraydata : [f Nothing] <> replicate (sa.head - i - 1) d <> sa.arraydata,
            head : i,
            end : sa.end
          }
  else if sa.end <= i 
    then SectionArray {
            arraydata : sa.arraydata <> replicate (i - sa.end) d <> [f Nothing] ,
            head : sa.head,
            end : i+1
          }
    else SectionArray {
            arraydata : fromMaybe (sa.arraydata) (modifyAt (i - sa.head) (Just >>> f) sa.arraydata)  ,
            head : sa.head,
            end : sa.end
          }