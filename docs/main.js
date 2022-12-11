// output/Control.Apply/foreign.js
var arrayApply = function(fs) {
  return function(xs) {
    var l = fs.length;
    var k = xs.length;
    var result = new Array(l * k);
    var n = 0;
    for (var i = 0; i < l; i++) {
      var f = fs[i];
      for (var j = 0; j < k; j++) {
        result[n++] = f(xs[j]);
      }
    }
    return result;
  };
};

// output/Control.Semigroupoid/index.js
var semigroupoidFn = {
  compose: function(f) {
    return function(g) {
      return function(x) {
        return f(g(x));
      };
    };
  }
};
var compose = function(dict) {
  return dict.compose;
};

// output/Control.Category/index.js
var identity = function(dict) {
  return dict.identity;
};
var categoryFn = {
  identity: function(x) {
    return x;
  },
  Semigroupoid0: function() {
    return semigroupoidFn;
  }
};

// output/Data.Boolean/index.js
var otherwise = true;

// output/Data.Function/index.js
var on = function(f) {
  return function(g) {
    return function(x) {
      return function(y) {
        return f(g(x))(g(y));
      };
    };
  };
};
var flip = function(f) {
  return function(b) {
    return function(a) {
      return f(a)(b);
    };
  };
};
var $$const = function(a) {
  return function(v) {
    return a;
  };
};

// output/Data.Functor/foreign.js
var arrayMap = function(f) {
  return function(arr) {
    var l = arr.length;
    var result = new Array(l);
    for (var i = 0; i < l; i++) {
      result[i] = f(arr[i]);
    }
    return result;
  };
};

// output/Type.Proxy/index.js
var $$Proxy = /* @__PURE__ */ function() {
  function $$Proxy2() {
  }
  ;
  $$Proxy2.value = new $$Proxy2();
  return $$Proxy2;
}();

// output/Data.Functor/index.js
var map = function(dict) {
  return dict.map;
};
var functorFn = {
  map: /* @__PURE__ */ compose(semigroupoidFn)
};
var functorArray = {
  map: arrayMap
};

// output/Control.Apply/index.js
var applyArray = {
  apply: arrayApply,
  Functor0: function() {
    return functorArray;
  }
};
var apply = function(dict) {
  return dict.apply;
};

// output/Control.Applicative/index.js
var pure = function(dict) {
  return dict.pure;
};
var applicativeArray = {
  pure: function(x) {
    return [x];
  },
  Apply0: function() {
    return applyArray;
  }
};

// output/Control.Bind/foreign.js
var arrayBind = function(arr) {
  return function(f) {
    var result = [];
    for (var i = 0, l = arr.length; i < l; i++) {
      Array.prototype.push.apply(result, f(arr[i]));
    }
    return result;
  };
};

// output/Control.Bind/index.js
var identity2 = /* @__PURE__ */ identity(categoryFn);
var bindArray = {
  bind: arrayBind,
  Apply0: function() {
    return applyArray;
  }
};
var bind = function(dict) {
  return dict.bind;
};
var bindFlipped = function(dictBind) {
  return flip(bind(dictBind));
};
var composeKleisli = function(dictBind) {
  var bind1 = bind(dictBind);
  return function(f) {
    return function(g) {
      return function(a) {
        return bind1(f(a))(g);
      };
    };
  };
};
var join = function(dictBind) {
  var bind1 = bind(dictBind);
  return function(m) {
    return bind1(m)(identity2);
  };
};

// output/Data.Array/foreign.js
var range = function(start) {
  return function(end) {
    var step = start > end ? -1 : 1;
    var result = new Array(step * (end - start) + 1);
    var i = start, n = 0;
    while (i !== end) {
      result[n++] = i;
      i += step;
    }
    result[n] = i;
    return result;
  };
};
var replicateFill = function(count) {
  return function(value) {
    if (count < 1) {
      return [];
    }
    var result = new Array(count);
    return result.fill(value);
  };
};
var replicatePolyfill = function(count) {
  return function(value) {
    var result = [];
    var n = 0;
    for (var i = 0; i < count; i++) {
      result[n++] = value;
    }
    return result;
  };
};
var replicate = typeof Array.prototype.fill === "function" ? replicateFill : replicatePolyfill;
var fromFoldableImpl = function() {
  function Cons2(head2, tail) {
    this.head = head2;
    this.tail = tail;
  }
  var emptyList = {};
  function curryCons(head2) {
    return function(tail) {
      return new Cons2(head2, tail);
    };
  }
  function listToArray(list) {
    var result = [];
    var count = 0;
    var xs = list;
    while (xs !== emptyList) {
      result[count++] = xs.head;
      xs = xs.tail;
    }
    return result;
  }
  return function(foldr2) {
    return function(xs) {
      return listToArray(foldr2(curryCons)(emptyList)(xs));
    };
  };
}();
var length = function(xs) {
  return xs.length;
};
var indexImpl = function(just) {
  return function(nothing) {
    return function(xs) {
      return function(i) {
        return i < 0 || i >= xs.length ? nothing : just(xs[i]);
      };
    };
  };
};
var findIndexImpl = function(just) {
  return function(nothing) {
    return function(f) {
      return function(xs) {
        for (var i = 0, l = xs.length; i < l; i++) {
          if (f(xs[i]))
            return just(i);
        }
        return nothing;
      };
    };
  };
};
var _deleteAt = function(just) {
  return function(nothing) {
    return function(i) {
      return function(l) {
        if (i < 0 || i >= l.length)
          return nothing;
        var l1 = l.slice();
        l1.splice(i, 1);
        return just(l1);
      };
    };
  };
};
var _updateAt = function(just) {
  return function(nothing) {
    return function(i) {
      return function(a) {
        return function(l) {
          if (i < 0 || i >= l.length)
            return nothing;
          var l1 = l.slice();
          l1[i] = a;
          return just(l1);
        };
      };
    };
  };
};
var reverse = function(l) {
  return l.slice().reverse();
};
var filter = function(f) {
  return function(xs) {
    return xs.filter(f);
  };
};
var sortByImpl = function() {
  function mergeFromTo(compare2, fromOrdering, xs1, xs2, from2, to2) {
    var mid;
    var i;
    var j;
    var k;
    var x;
    var y;
    var c;
    mid = from2 + (to2 - from2 >> 1);
    if (mid - from2 > 1)
      mergeFromTo(compare2, fromOrdering, xs2, xs1, from2, mid);
    if (to2 - mid > 1)
      mergeFromTo(compare2, fromOrdering, xs2, xs1, mid, to2);
    i = from2;
    j = mid;
    k = from2;
    while (i < mid && j < to2) {
      x = xs2[i];
      y = xs2[j];
      c = fromOrdering(compare2(x)(y));
      if (c > 0) {
        xs1[k++] = y;
        ++j;
      } else {
        xs1[k++] = x;
        ++i;
      }
    }
    while (i < mid) {
      xs1[k++] = xs2[i++];
    }
    while (j < to2) {
      xs1[k++] = xs2[j++];
    }
  }
  return function(compare2) {
    return function(fromOrdering) {
      return function(xs) {
        var out;
        if (xs.length < 2)
          return xs;
        out = xs.slice(0);
        mergeFromTo(compare2, fromOrdering, out, xs.slice(0), 0, xs.length);
        return out;
      };
    };
  };
}();
var slice = function(s) {
  return function(e) {
    return function(l) {
      return l.slice(s, e);
    };
  };
};
var zipWith = function(f) {
  return function(xs) {
    return function(ys) {
      var l = xs.length < ys.length ? xs.length : ys.length;
      var result = new Array(l);
      for (var i = 0; i < l; i++) {
        result[i] = f(xs[i])(ys[i]);
      }
      return result;
    };
  };
};
var all = function(p) {
  return function(xs) {
    var len = xs.length;
    for (var i = 0; i < len; i++) {
      if (!p(xs[i]))
        return false;
    }
    return true;
  };
};
var unsafeIndexImpl = function(xs) {
  return function(n) {
    return xs[n];
  };
};

// output/Data.Semigroup/foreign.js
var concatArray = function(xs) {
  return function(ys) {
    if (xs.length === 0)
      return ys;
    if (ys.length === 0)
      return xs;
    return xs.concat(ys);
  };
};

// output/Data.Symbol/index.js
var reflectSymbol = function(dict) {
  return dict.reflectSymbol;
};

// output/Record.Unsafe/foreign.js
var unsafeGet = function(label) {
  return function(rec) {
    return rec[label];
  };
};
var unsafeSet = function(label) {
  return function(value) {
    return function(rec) {
      var copy = {};
      for (var key in rec) {
        if ({}.hasOwnProperty.call(rec, key)) {
          copy[key] = rec[key];
        }
      }
      copy[label] = value;
      return copy;
    };
  };
};
var unsafeDelete = function(label) {
  return function(rec) {
    var copy = {};
    for (var key in rec) {
      if (key !== label && {}.hasOwnProperty.call(rec, key)) {
        copy[key] = rec[key];
      }
    }
    return copy;
  };
};

// output/Data.Semigroup/index.js
var semigroupArray = {
  append: concatArray
};
var append = function(dict) {
  return dict.append;
};

// output/Data.Bounded/foreign.js
var topInt = 2147483647;
var bottomInt = -2147483648;
var topChar = String.fromCharCode(65535);
var bottomChar = String.fromCharCode(0);
var topNumber = Number.POSITIVE_INFINITY;
var bottomNumber = Number.NEGATIVE_INFINITY;

// output/Data.Ord/foreign.js
var unsafeCompareImpl = function(lt) {
  return function(eq5) {
    return function(gt) {
      return function(x) {
        return function(y) {
          return x < y ? lt : x === y ? eq5 : gt;
        };
      };
    };
  };
};
var ordIntImpl = unsafeCompareImpl;

// output/Data.Eq/foreign.js
var refEq = function(r1) {
  return function(r2) {
    return r1 === r2;
  };
};
var eqBooleanImpl = refEq;
var eqIntImpl = refEq;
var eqNumberImpl = refEq;

// output/Data.Eq/index.js
var eqNumber = {
  eq: eqNumberImpl
};
var eqInt = {
  eq: eqIntImpl
};
var eqBoolean = {
  eq: eqBooleanImpl
};
var eq = function(dict) {
  return dict.eq;
};
var eq2 = /* @__PURE__ */ eq(eqBoolean);
var notEq = function(dictEq) {
  var eq32 = eq(dictEq);
  return function(x) {
    return function(y) {
      return eq2(eq32(x)(y))(false);
    };
  };
};

// output/Data.Ordering/index.js
var LT = /* @__PURE__ */ function() {
  function LT2() {
  }
  ;
  LT2.value = new LT2();
  return LT2;
}();
var GT = /* @__PURE__ */ function() {
  function GT2() {
  }
  ;
  GT2.value = new GT2();
  return GT2;
}();
var EQ = /* @__PURE__ */ function() {
  function EQ2() {
  }
  ;
  EQ2.value = new EQ2();
  return EQ2;
}();

// output/Data.Ring/foreign.js
var intSub = function(x) {
  return function(y) {
    return x - y | 0;
  };
};
var numSub = function(n1) {
  return function(n2) {
    return n1 - n2;
  };
};

// output/Data.Semiring/foreign.js
var intAdd = function(x) {
  return function(y) {
    return x + y | 0;
  };
};
var intMul = function(x) {
  return function(y) {
    return x * y | 0;
  };
};
var numAdd = function(n1) {
  return function(n2) {
    return n1 + n2;
  };
};
var numMul = function(n1) {
  return function(n2) {
    return n1 * n2;
  };
};

// output/Data.Semiring/index.js
var zero = function(dict) {
  return dict.zero;
};
var semiringNumber = {
  add: numAdd,
  zero: 0,
  mul: numMul,
  one: 1
};
var semiringInt = {
  add: intAdd,
  zero: 0,
  mul: intMul,
  one: 1
};
var add = function(dict) {
  return dict.add;
};

// output/Data.Ring/index.js
var sub = function(dict) {
  return dict.sub;
};
var ringNumber = {
  sub: numSub,
  Semiring0: function() {
    return semiringNumber;
  }
};
var ringInt = {
  sub: intSub,
  Semiring0: function() {
    return semiringInt;
  }
};
var negate = function(dictRing) {
  var sub1 = sub(dictRing);
  var zero2 = zero(dictRing.Semiring0());
  return function(a) {
    return sub1(zero2)(a);
  };
};

// output/Data.Ord/index.js
var ordInt = /* @__PURE__ */ function() {
  return {
    compare: ordIntImpl(LT.value)(EQ.value)(GT.value),
    Eq0: function() {
      return eqInt;
    }
  };
}();
var compare = function(dict) {
  return dict.compare;
};
var max = function(dictOrd) {
  var compare3 = compare(dictOrd);
  return function(x) {
    return function(y) {
      var v = compare3(x)(y);
      if (v instanceof LT) {
        return y;
      }
      ;
      if (v instanceof EQ) {
        return x;
      }
      ;
      if (v instanceof GT) {
        return x;
      }
      ;
      throw new Error("Failed pattern match at Data.Ord (line 181, column 3 - line 184, column 12): " + [v.constructor.name]);
    };
  };
};

// output/Data.Bounded/index.js
var top = function(dict) {
  return dict.top;
};
var boundedInt = {
  top: topInt,
  bottom: bottomInt,
  Ord0: function() {
    return ordInt;
  }
};
var bottom = function(dict) {
  return dict.bottom;
};

// output/Data.Generic.Rep/index.js
var Inl = /* @__PURE__ */ function() {
  function Inl2(value0) {
    this.value0 = value0;
  }
  ;
  Inl2.create = function(value0) {
    return new Inl2(value0);
  };
  return Inl2;
}();
var Inr = /* @__PURE__ */ function() {
  function Inr2(value0) {
    this.value0 = value0;
  }
  ;
  Inr2.create = function(value0) {
    return new Inr2(value0);
  };
  return Inr2;
}();
var NoArguments = /* @__PURE__ */ function() {
  function NoArguments2() {
  }
  ;
  NoArguments2.value = new NoArguments2();
  return NoArguments2;
}();
var Constructor = function(x) {
  return x;
};
var Argument = function(x) {
  return x;
};
var to = function(dict) {
  return dict.to;
};
var from = function(dict) {
  return dict.from;
};

// output/Data.Maybe/index.js
var identity3 = /* @__PURE__ */ identity(categoryFn);
var Nothing = /* @__PURE__ */ function() {
  function Nothing2() {
  }
  ;
  Nothing2.value = new Nothing2();
  return Nothing2;
}();
var Just = /* @__PURE__ */ function() {
  function Just2(value0) {
    this.value0 = value0;
  }
  ;
  Just2.create = function(value0) {
    return new Just2(value0);
  };
  return Just2;
}();
var maybe = function(v) {
  return function(v1) {
    return function(v2) {
      if (v2 instanceof Nothing) {
        return v;
      }
      ;
      if (v2 instanceof Just) {
        return v1(v2.value0);
      }
      ;
      throw new Error("Failed pattern match at Data.Maybe (line 237, column 1 - line 237, column 51): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
    };
  };
};
var isNothing = /* @__PURE__ */ maybe(true)(/* @__PURE__ */ $$const(false));
var isJust = /* @__PURE__ */ maybe(false)(/* @__PURE__ */ $$const(true));
var functorMaybe = {
  map: function(v) {
    return function(v1) {
      if (v1 instanceof Just) {
        return new Just(v(v1.value0));
      }
      ;
      return Nothing.value;
    };
  }
};
var map2 = /* @__PURE__ */ map(functorMaybe);
var fromMaybe = function(a) {
  return maybe(a)(identity3);
};
var applyMaybe = {
  apply: function(v) {
    return function(v1) {
      if (v instanceof Just) {
        return map2(v.value0)(v1);
      }
      ;
      if (v instanceof Nothing) {
        return Nothing.value;
      }
      ;
      throw new Error("Failed pattern match at Data.Maybe (line 67, column 1 - line 69, column 30): " + [v.constructor.name, v1.constructor.name]);
    };
  },
  Functor0: function() {
    return functorMaybe;
  }
};
var bindMaybe = {
  bind: function(v) {
    return function(v1) {
      if (v instanceof Just) {
        return v1(v.value0);
      }
      ;
      if (v instanceof Nothing) {
        return Nothing.value;
      }
      ;
      throw new Error("Failed pattern match at Data.Maybe (line 125, column 1 - line 127, column 28): " + [v.constructor.name, v1.constructor.name]);
    };
  },
  Apply0: function() {
    return applyMaybe;
  }
};
var applicativeMaybe = /* @__PURE__ */ function() {
  return {
    pure: Just.create,
    Apply0: function() {
      return applyMaybe;
    }
  };
}();
var monadMaybe = {
  Applicative0: function() {
    return applicativeMaybe;
  },
  Bind1: function() {
    return bindMaybe;
  }
};

// output/Data.EuclideanRing/foreign.js
var intDegree = function(x) {
  return Math.min(Math.abs(x), 2147483647);
};
var intDiv = function(x) {
  return function(y) {
    if (y === 0)
      return 0;
    return y > 0 ? Math.floor(x / y) : -Math.floor(x / -y);
  };
};
var intMod = function(x) {
  return function(y) {
    if (y === 0)
      return 0;
    var yy = Math.abs(y);
    return (x % yy + yy) % yy;
  };
};

// output/Data.CommutativeRing/index.js
var commutativeRingInt = {
  Ring0: function() {
    return ringInt;
  }
};

// output/Data.EuclideanRing/index.js
var mod = function(dict) {
  return dict.mod;
};
var euclideanRingInt = {
  degree: intDegree,
  div: intDiv,
  mod: intMod,
  CommutativeRing0: function() {
    return commutativeRingInt;
  }
};
var div = function(dict) {
  return dict.div;
};

// output/Data.Monoid/index.js
var mempty = function(dict) {
  return dict.mempty;
};

// output/Data.Array.ST/foreign.js
var sortByImpl2 = function() {
  function mergeFromTo(compare2, fromOrdering, xs1, xs2, from2, to2) {
    var mid;
    var i;
    var j;
    var k;
    var x;
    var y;
    var c;
    mid = from2 + (to2 - from2 >> 1);
    if (mid - from2 > 1)
      mergeFromTo(compare2, fromOrdering, xs2, xs1, from2, mid);
    if (to2 - mid > 1)
      mergeFromTo(compare2, fromOrdering, xs2, xs1, mid, to2);
    i = from2;
    j = mid;
    k = from2;
    while (i < mid && j < to2) {
      x = xs2[i];
      y = xs2[j];
      c = fromOrdering(compare2(x)(y));
      if (c > 0) {
        xs1[k++] = y;
        ++j;
      } else {
        xs1[k++] = x;
        ++i;
      }
    }
    while (i < mid) {
      xs1[k++] = xs2[i++];
    }
    while (j < to2) {
      xs1[k++] = xs2[j++];
    }
  }
  return function(compare2) {
    return function(fromOrdering) {
      return function(xs) {
        return function() {
          if (xs.length < 2)
            return xs;
          mergeFromTo(compare2, fromOrdering, xs, xs.slice(0), 0, xs.length);
          return xs;
        };
      };
    };
  };
}();

// output/Data.HeytingAlgebra/foreign.js
var boolConj = function(b1) {
  return function(b2) {
    return b1 && b2;
  };
};
var boolDisj = function(b1) {
  return function(b2) {
    return b1 || b2;
  };
};
var boolNot = function(b) {
  return !b;
};

// output/Data.HeytingAlgebra/index.js
var not = function(dict) {
  return dict.not;
};
var disj = function(dict) {
  return dict.disj;
};
var heytingAlgebraBoolean = {
  ff: false,
  tt: true,
  implies: function(a) {
    return function(b) {
      return disj(heytingAlgebraBoolean)(not(heytingAlgebraBoolean)(a))(b);
    };
  },
  conj: boolConj,
  disj: boolDisj,
  not: boolNot
};
var conj = function(dict) {
  return dict.conj;
};

// output/Data.Foldable/foreign.js
var foldrArray = function(f) {
  return function(init3) {
    return function(xs) {
      var acc = init3;
      var len = xs.length;
      for (var i = len - 1; i >= 0; i--) {
        acc = f(xs[i])(acc);
      }
      return acc;
    };
  };
};
var foldlArray = function(f) {
  return function(init3) {
    return function(xs) {
      var acc = init3;
      var len = xs.length;
      for (var i = 0; i < len; i++) {
        acc = f(acc)(xs[i]);
      }
      return acc;
    };
  };
};

// output/Unsafe.Coerce/foreign.js
var unsafeCoerce2 = function(x) {
  return x;
};

// output/Safe.Coerce/index.js
var coerce = function() {
  return unsafeCoerce2;
};

// output/Data.Newtype/index.js
var coerce2 = /* @__PURE__ */ coerce();
var wrap = function() {
  return coerce2;
};
var unwrap = function() {
  return coerce2;
};
var over2 = function() {
  return function() {
    return function(v) {
      return coerce2;
    };
  };
};
var over = function() {
  return function() {
    return function(v) {
      return coerce2;
    };
  };
};

// output/Data.Foldable/index.js
var foldr = function(dict) {
  return dict.foldr;
};
var foldl = function(dict) {
  return dict.foldl;
};
var sum = function(dictFoldable) {
  var foldl22 = foldl(dictFoldable);
  return function(dictSemiring) {
    return foldl22(add(dictSemiring))(zero(dictSemiring));
  };
};
var foldMapDefaultR = function(dictFoldable) {
  var foldr2 = foldr(dictFoldable);
  return function(dictMonoid) {
    var append4 = append(dictMonoid.Semigroup0());
    var mempty2 = mempty(dictMonoid);
    return function(f) {
      return foldr2(function(x) {
        return function(acc) {
          return append4(f(x))(acc);
        };
      })(mempty2);
    };
  };
};
var foldableArray = {
  foldr: foldrArray,
  foldl: foldlArray,
  foldMap: function(dictMonoid) {
    return foldMapDefaultR(foldableArray)(dictMonoid);
  }
};
var foldM = function(dictFoldable) {
  var foldl22 = foldl(dictFoldable);
  return function(dictMonad) {
    var bind4 = bind(dictMonad.Bind1());
    var pure4 = pure(dictMonad.Applicative0());
    return function(f) {
      return function(b0) {
        return foldl22(function(b) {
          return function(a) {
            return bind4(b)(flip(f)(a));
          };
        })(pure4(b0));
      };
    };
  };
};

// output/Data.Traversable/foreign.js
var traverseArrayImpl = function() {
  function array1(a) {
    return [a];
  }
  function array2(a) {
    return function(b) {
      return [a, b];
    };
  }
  function array3(a) {
    return function(b) {
      return function(c) {
        return [a, b, c];
      };
    };
  }
  function concat2(xs) {
    return function(ys) {
      return xs.concat(ys);
    };
  }
  return function(apply6) {
    return function(map8) {
      return function(pure4) {
        return function(f) {
          return function(array) {
            function go(bot, top3) {
              switch (top3 - bot) {
                case 0:
                  return pure4([]);
                case 1:
                  return map8(array1)(f(array[bot]));
                case 2:
                  return apply6(map8(array2)(f(array[bot])))(f(array[bot + 1]));
                case 3:
                  return apply6(apply6(map8(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                default:
                  var pivot = bot + Math.floor((top3 - bot) / 4) * 2;
                  return apply6(map8(concat2)(go(bot, pivot)))(go(pivot, top3));
              }
            }
            return go(0, array.length);
          };
        };
      };
    };
  };
}();

// output/Data.Array/index.js
var apply2 = /* @__PURE__ */ apply(applyMaybe);
var map1 = /* @__PURE__ */ map(functorMaybe);
var updateAt = /* @__PURE__ */ function() {
  return _updateAt(Just.create)(Nothing.value);
}();
var unsafeIndex = function() {
  return unsafeIndexImpl;
};
var unsafeIndex1 = /* @__PURE__ */ unsafeIndex();
var sortBy = function(comp) {
  return sortByImpl(comp)(function(v) {
    if (v instanceof GT) {
      return 1;
    }
    ;
    if (v instanceof EQ) {
      return 0;
    }
    ;
    if (v instanceof LT) {
      return -1 | 0;
    }
    ;
    throw new Error("Failed pattern match at Data.Array (line 870, column 31 - line 873, column 11): " + [v.constructor.name]);
  });
};
var sort = function(dictOrd) {
  var compare2 = compare(dictOrd);
  return function(xs) {
    return sortBy(compare2)(xs);
  };
};
var singleton2 = function(a) {
  return [a];
};
var $$null = function(xs) {
  return length(xs) === 0;
};
var mapWithIndex = function(f) {
  return function(xs) {
    return zipWith(f)(range(0)(length(xs) - 1 | 0))(xs);
  };
};
var init = function(xs) {
  if ($$null(xs)) {
    return Nothing.value;
  }
  ;
  if (otherwise) {
    return new Just(slice(0)(length(xs) - 1 | 0)(xs));
  }
  ;
  throw new Error("Failed pattern match at Data.Array (line 339, column 1 - line 339, column 45): " + [xs.constructor.name]);
};
var index = /* @__PURE__ */ function() {
  return indexImpl(Just.create)(Nothing.value);
}();
var last = function(xs) {
  return index(xs)(length(xs) - 1 | 0);
};
var unsnoc = function(xs) {
  return apply2(map1(function(v) {
    return function(v1) {
      return {
        init: v,
        last: v1
      };
    };
  })(init(xs)))(last(xs));
};
var modifyAt = function(i) {
  return function(f) {
    return function(xs) {
      var go = function(x) {
        return updateAt(i)(f(x))(xs);
      };
      return maybe(Nothing.value)(go)(index(xs)(i));
    };
  };
};
var head = function(xs) {
  return index(xs)(0);
};
var foldl2 = /* @__PURE__ */ foldl(foldableArray);
var findIndex = /* @__PURE__ */ function() {
  return findIndexImpl(Just.create)(Nothing.value);
}();
var find2 = function(f) {
  return function(xs) {
    return map1(unsafeIndex1(xs))(findIndex(f)(xs));
  };
};
var elemIndex = function(dictEq) {
  var eq22 = eq(dictEq);
  return function(x) {
    return findIndex(function(v) {
      return eq22(v)(x);
    });
  };
};
var elem2 = function(dictEq) {
  var elemIndex1 = elemIndex(dictEq);
  return function(a) {
    return function(arr) {
      return isJust(elemIndex1(a)(arr));
    };
  };
};
var deleteAt = /* @__PURE__ */ function() {
  return _deleteAt(Just.create)(Nothing.value);
}();
var concatMap = /* @__PURE__ */ flip(/* @__PURE__ */ bind(bindArray));
var mapMaybe = function(f) {
  return concatMap(function() {
    var $190 = maybe([])(singleton2);
    return function($191) {
      return $190(f($191));
    };
  }());
};
var catMaybes = /* @__PURE__ */ mapMaybe(/* @__PURE__ */ identity(categoryFn));

// output/Data.Number/foreign.js
var isFiniteImpl = isFinite;
var abs = Math.abs;
var asin = Math.asin;
var cos = Math.cos;
var floor = Math.floor;
var pow = function(n) {
  return function(p) {
    return Math.pow(n, p);
  };
};
var round = Math.round;
var sign = Math.sign ? Math.sign : function(x) {
  return x === 0 || x !== x ? x : x < 0 ? -1 : 1;
};
var sin = Math.sin;
var sqrt = Math.sqrt;

// output/Data.Number/index.js
var pi = 3.141592653589793;

// output/Foreign/foreign.js
var isArray = Array.isArray || function(value) {
  return Object.prototype.toString.call(value) === "[object Array]";
};

// output/Data.Int/foreign.js
var fromNumberImpl = function(just) {
  return function(nothing) {
    return function(n) {
      return (n | 0) === n ? just(n) : nothing;
    };
  };
};
var toNumber = function(n) {
  return n;
};

// output/Data.Int/index.js
var top2 = /* @__PURE__ */ top(boundedInt);
var bottom2 = /* @__PURE__ */ bottom(boundedInt);
var fromNumber = /* @__PURE__ */ function() {
  return fromNumberImpl(Just.create)(Nothing.value);
}();
var unsafeClamp = function(x) {
  if (!isFiniteImpl(x)) {
    return 0;
  }
  ;
  if (x >= toNumber(top2)) {
    return top2;
  }
  ;
  if (x <= toNumber(bottom2)) {
    return bottom2;
  }
  ;
  if (otherwise) {
    return fromMaybe(0)(fromNumber(x));
  }
  ;
  throw new Error("Failed pattern match at Data.Int (line 72, column 1 - line 72, column 29): " + [x.constructor.name]);
};
var round2 = function($37) {
  return unsafeClamp(round($37));
};

// output/Foreign/index.js
var unsafeToForeign = unsafeCoerce2;
var unsafeFromForeign = unsafeCoerce2;

// output/Internal.Types.Pos/index.js
var sub2 = /* @__PURE__ */ sub(ringNumber);
var add2 = /* @__PURE__ */ add(semiringNumber);
var over22 = /* @__PURE__ */ over2()();
var unwrap2 = /* @__PURE__ */ unwrap();
var eq3 = /* @__PURE__ */ eq(eqNumber);
var notEq2 = /* @__PURE__ */ notEq(eqBoolean);
var Coord = function(x) {
  return x;
};
var Angle = function(x) {
  return x;
};
var Pos = function(x) {
  return x;
};
var RelPos = function(x) {
  return x;
};
var rrem = function(a) {
  return function(b) {
    return a - floor(a / b) * b;
  };
};
var poszero = {
  coord: {
    x: 0,
    y: 0,
    z: 0
  },
  angle: 0,
  isPlus: false
};
var planeDistance = function(v) {
  return function(v1) {
    return sqrt(pow(v1.coord.x - v.coord.x)(2) + pow(v1.coord.y - v.coord.y)(2));
  };
};
var fromRadian = Angle;
var angleSize = /* @__PURE__ */ function() {
  return pi * 2;
}();
var angleSub = function(v) {
  return function(v1) {
    var tmp = rrem(v - v1)(angleSize);
    var $45 = tmp > angleSize / 2;
    if ($45) {
      return tmp - angleSize;
    }
    ;
    return tmp;
  };
};
var anglen = function(n) {
  return function(i) {
    return toNumber(i) * angleSize / toNumber(n);
  };
};
var reverseAngle = function(v) {
  return v + angleSize / 2;
};
var reversePos = function(v) {
  return {
    coord: v.coord,
    angle: reverseAngle(v.angle),
    isPlus: v.isPlus
  };
};
var toRadian = function(v) {
  return v * pi * 2 / angleSize;
};
var convertRelPos = function(v) {
  return function(v1) {
    return {
      coord: {
        x: cos(toRadian(reverseAngle(v.angle))) * (v1.coord.x - v.coord.x) + sin(toRadian(reverseAngle(v.angle))) * (v1.coord.y - v.coord.y),
        y: cos(toRadian(reverseAngle(v.angle))) * (v1.coord.y - v.coord.y) - sin(toRadian(reverseAngle(v.angle))) * (v1.coord.x - v.coord.x),
        z: v1.coord.z - v.coord.z
      },
      angle: over22(Angle)(sub2)(v1.angle)(reverseAngle(v.angle)),
      isPlus: v.isPlus
    };
  };
};
var toAbsPos = function(v) {
  return function(v1) {
    return {
      coord: {
        x: v.coord.x + (cos(toRadian(v.angle) + pi) * v1.coord.x - sin(toRadian(v.angle) + pi) * v1.coord.y),
        y: v.coord.y + (cos(toRadian(v.angle) + pi) * v1.coord.y + sin(toRadian(v.angle) + pi) * v1.coord.x),
        z: v.coord.z + v1.coord.z
      },
      angle: reverseAngle(over22(Angle)(add2)(v.angle)(v1.angle)),
      isPlus: v1.isPlus
    };
  };
};
var eqAngle = {
  eq: function(v) {
    return function(v1) {
      var r = abs(rrem(v - v1)(angleSize));
      return r < 0.01 || abs(r - angleSize) < 0.01;
    };
  }
};
var eq12 = /* @__PURE__ */ eq(eqAngle);
var canJoin = function(p1) {
  return function(p2) {
    return eq12(reverseAngle(unwrap2(p1).angle))(unwrap2(p2).angle) && (planeDistance(p1)(p2) < 0.05 && (on(eq3)(function(v) {
      return v.coord.z;
    })(p1)(p2) && on(notEq2)(function(v) {
      return v.isPlus;
    })(p1)(p2)));
  };
};
var getDividingPoint_rel = function(v) {
  return function(v1) {
    return function(width) {
      return function(t) {
        var divpcos = function(a) {
          return function(b) {
            return a + (b - a) * (1 - cos(t * pi)) / 2;
          };
        };
        var divp = function(a) {
          return function(b) {
            return a * (1 - t) + b * t;
          };
        };
        var a2 = toRadian(v1.angle);
        var a1 = toRadian(reverseAngle(v.angle));
        var at = a1 + toRadian(angleSub(v1.angle)(reverseAngle(v.angle))) * t;
        var $76 = eq12(reverseAngle(v.angle))(v1.angle);
        if ($76) {
          return {
            angle: v1.angle,
            isPlus: v1.isPlus,
            coord: {
              x: divp(unwrap2(v.coord).x)(unwrap2(v1.coord).x) + width * sin(a1),
              y: divp(unwrap2(v.coord).y)(unwrap2(v1.coord).y) - width * cos(a1),
              z: divpcos(unwrap2(v.coord).z)(unwrap2(v1.coord).z)
            }
          };
        }
        ;
        var _r = (cos(a1) * (unwrap2(v1.coord).x - unwrap2(v.coord).x) + sin(a1) * (unwrap2(v1.coord).y - unwrap2(v.coord).y)) / sin(a2 - a1);
        var a1$prime = a1 - pi / 2 * sign(_r);
        var a2$prime = a2 - pi / 2 * sign(_r);
        var at$prime = at - pi / 2 * sign(_r);
        var r = abs(_r);
        var x0 = unwrap2(v.coord).x - r * cos(a1$prime);
        var y0 = unwrap2(v.coord).y - r * sin(a1$prime);
        return {
          angle: fromRadian(at),
          isPlus: v1.isPlus,
          coord: {
            x: x0 + r * cos(at$prime) + width * sin(at),
            y: y0 + r * sin(at$prime) - width * cos(at),
            z: divp(unwrap2(v.coord).z)(unwrap2(v1.coord).z)
          }
        };
      };
    };
  };
};
var partLength = function(v) {
  return function(v1) {
    var a2 = toRadian(v1.angle);
    var a1 = toRadian(reverseAngle(v.angle));
    var pd = function() {
      var $79 = eq12(reverseAngle(v.angle))(v1.angle);
      if ($79) {
        return planeDistance(v)(v1);
      }
      ;
      return abs((cos(a1) * (unwrap2(v1.coord).x - unwrap2(v.coord).x) + sin(a1) * (unwrap2(v1.coord).y - unwrap2(v.coord).y)) / sin(a2 - a1) * toRadian(angleSub(v1.angle)(reverseAngle(v.angle))));
    }();
    return sqrt(pow(unwrap2(v1.coord).z - unwrap2(v.coord).z)(2) + pow(pd)(2));
  };
};
var angle8 = /* @__PURE__ */ anglen(8);

// output/Record/index.js
var insert = function(dictIsSymbol) {
  var reflectSymbol2 = reflectSymbol(dictIsSymbol);
  return function() {
    return function() {
      return function(l) {
        return function(a) {
          return function(r) {
            return unsafeSet(reflectSymbol2(l))(a)(r);
          };
        };
      };
    };
  };
};
var get = function(dictIsSymbol) {
  var reflectSymbol2 = reflectSymbol(dictIsSymbol);
  return function() {
    return function(l) {
      return function(r) {
        return unsafeGet(reflectSymbol2(l))(r);
      };
    };
  };
};
var $$delete = function(dictIsSymbol) {
  var reflectSymbol2 = reflectSymbol(dictIsSymbol);
  return function() {
    return function() {
      return function(l) {
        return function(r) {
          return unsafeDelete(reflectSymbol2(l))(r);
        };
      };
    };
  };
};

// output/Internal.Types.Serial/index.js
var map3 = /* @__PURE__ */ map(functorArray);
var map12 = /* @__PURE__ */ map(functorMaybe);
var apply3 = /* @__PURE__ */ apply(applyMaybe);
var mod2 = /* @__PURE__ */ mod(euclideanRingInt);
var div2 = /* @__PURE__ */ div(euclideanRingInt);
var rowListSerializeNilRow = function() {
  return {
    rlfromSerial: function(v) {
      return function(i) {
        var $94 = 0 <= i && i < 1;
        if ($94) {
          return new Just({});
        }
        ;
        return Nothing.value;
      };
    },
    rltoSerial: function(v) {
      return function(v1) {
        return 0;
      };
    },
    rllengthSerial: function(v) {
      return 1;
    }
  };
};
var intSerializeNoArguments = {
  fromSerial: function(i) {
    var $95 = 0 <= i && i < 1;
    if ($95) {
      return new Just(NoArguments.value);
    }
    ;
    return Nothing.value;
  },
  toSerial: /* @__PURE__ */ $$const(0),
  lengthSerial: /* @__PURE__ */ $$const(1)
};
var intSerializeBoolean = {
  fromSerial: function(i) {
    if (i === 0) {
      return new Just(false);
    }
    ;
    if (i === 1) {
      return new Just(true);
    }
    ;
    return Nothing.value;
  },
  toSerial: function(b) {
    if (b) {
      return 1;
    }
    ;
    return 0;
  },
  lengthSerial: /* @__PURE__ */ $$const(2)
};
var toSerial = function(dict) {
  return dict.toSerial;
};
var rltoSerial = function(dict) {
  return dict.rltoSerial;
};
var rllengthSerial = function(dict) {
  return dict.rllengthSerial;
};
var rlfromSerial = function(dict) {
  return dict.rlfromSerial;
};
var intSerializeRecord = function() {
  return function(dictRowListSerialize) {
    return {
      fromSerial: rlfromSerial(dictRowListSerialize)($$Proxy.value),
      toSerial: rltoSerial(dictRowListSerialize)($$Proxy.value),
      lengthSerial: $$const(rllengthSerial(dictRowListSerialize)($$Proxy.value))
    };
  };
};
var lengthSerial = function(dict) {
  return dict.lengthSerial;
};
var fromSerial = function(dict) {
  return dict.fromSerial;
};
var serialAll = function(dictIntSerialize) {
  return catMaybes(map3(fromSerial(dictIntSerialize))(range(0)(lengthSerial(dictIntSerialize)($$Proxy.value) - 1 | 0)));
};
var intSerialize = function(dictGeneric) {
  var to2 = to(dictGeneric);
  var from2 = from(dictGeneric);
  return function(dictIntSerialize) {
    var fromSerial1 = fromSerial(dictIntSerialize);
    var lengthSerial1 = lengthSerial(dictIntSerialize);
    return {
      fromSerial: function(i) {
        return map12(to2)(fromSerial1(i));
      },
      toSerial: function() {
        var $121 = toSerial(dictIntSerialize);
        return function($122) {
          return $121(from2($122));
        };
      }(),
      lengthSerial: function(v) {
        return lengthSerial1($$Proxy.value);
      }
    };
  };
};
var intSerializeArgument = function(dictIntSerialize) {
  var lengthSerial1 = lengthSerial(dictIntSerialize);
  var fromSerial1 = fromSerial(dictIntSerialize);
  var toSerial1 = toSerial(dictIntSerialize);
  return {
    fromSerial: function(i) {
      var l1 = lengthSerial1($$Proxy.value);
      var $104 = 0 <= i && i < l1;
      if ($104) {
        return map12(Argument)(fromSerial1(i));
      }
      ;
      return Nothing.value;
    },
    toSerial: function(v) {
      return toSerial1(v);
    },
    lengthSerial: $$const(lengthSerial1($$Proxy.value))
  };
};
var intSerializeConstructor = function(dictIntSerialize) {
  var lengthSerial1 = lengthSerial(dictIntSerialize);
  var fromSerial1 = fromSerial(dictIntSerialize);
  var toSerial1 = toSerial(dictIntSerialize);
  return {
    fromSerial: function(i) {
      var l1 = lengthSerial1($$Proxy.value);
      var $106 = 0 <= i && i < l1;
      if ($106) {
        return map12(Constructor)(fromSerial1(i));
      }
      ;
      return Nothing.value;
    },
    toSerial: function(v) {
      return toSerial1(v);
    },
    lengthSerial: $$const(lengthSerial1($$Proxy.value))
  };
};
var intSerializeSum = function(dictIntSerialize) {
  var lengthSerial1 = lengthSerial(dictIntSerialize);
  var fromSerial1 = fromSerial(dictIntSerialize);
  var toSerial1 = toSerial(dictIntSerialize);
  return function(dictIntSerialize1) {
    var lengthSerial2 = lengthSerial(dictIntSerialize1);
    var fromSerial2 = fromSerial(dictIntSerialize1);
    var toSerial2 = toSerial(dictIntSerialize1);
    return {
      fromSerial: function(i) {
        var l2 = lengthSerial2($$Proxy.value);
        var l1 = lengthSerial1($$Proxy.value);
        var $112 = 0 <= i && i < l1;
        if ($112) {
          return map12(Inl.create)(fromSerial1(i));
        }
        ;
        var $113 = i < (l1 + l2 | 0);
        if ($113) {
          return map12(Inr.create)(fromSerial2(i - l1 | 0));
        }
        ;
        return Nothing.value;
      },
      toSerial: function(x$prime) {
        if (x$prime instanceof Inl) {
          return toSerial1(x$prime.value0);
        }
        ;
        if (x$prime instanceof Inr) {
          return toSerial2(x$prime.value0) + lengthSerial1($$Proxy.value) | 0;
        }
        ;
        throw new Error("Failed pattern match at Internal.Types.Serial (line 100, column 26 - line 102, column 85): " + [x$prime.constructor.name]);
      },
      lengthSerial: $$const(lengthSerial1($$Proxy.value) + lengthSerial2($$Proxy.value) | 0)
    };
  };
};
var rowListSerializeCons = function() {
  return function(dictIsSymbol) {
    var insert2 = insert(dictIsSymbol)()();
    var get2 = get(dictIsSymbol)();
    var $$delete2 = $$delete(dictIsSymbol)()();
    return function(dictIntSerialize) {
      var lengthSerial1 = lengthSerial(dictIntSerialize);
      var fromSerial1 = fromSerial(dictIntSerialize);
      var toSerial1 = toSerial(dictIntSerialize);
      return function(dictRowListSerialize) {
        var rllengthSerial1 = rllengthSerial(dictRowListSerialize);
        var rlfromSerial1 = rlfromSerial(dictRowListSerialize);
        var rltoSerial1 = rltoSerial(dictRowListSerialize);
        return function() {
          return function() {
            return function() {
              return {
                rlfromSerial: function(v) {
                  return function(i) {
                    var l2 = rllengthSerial1($$Proxy.value);
                    var l1 = lengthSerial1($$Proxy.value);
                    var $117 = 0 <= i && i < (l1 * l2 | 0);
                    if ($117) {
                      return apply3(map12(insert2($$Proxy.value))(fromSerial1(mod2(i)(l1))))(rlfromSerial1($$Proxy.value)(div2(i)(l1)));
                    }
                    ;
                    return Nothing.value;
                  };
                },
                rltoSerial: function(v) {
                  return function(v1) {
                    return toSerial1(get2($$Proxy.value)(v1)) + (rltoSerial1($$Proxy.value)($$delete2($$Proxy.value)(v1)) * rllengthSerial1($$Proxy.value) | 0) | 0;
                  };
                },
                rllengthSerial: $$const(lengthSerial1($$Proxy.value) * rllengthSerial1($$Proxy.value) | 0)
              };
            };
          };
        };
      };
    };
  };
};

// output/Internal.Types.Rail/index.js
var map4 = /* @__PURE__ */ map(functorArray);
var unwrap3 = /* @__PURE__ */ unwrap();
var negate2 = /* @__PURE__ */ negate(ringNumber);
var over3 = /* @__PURE__ */ over()();
var wrap2 = /* @__PURE__ */ wrap();
var map13 = /* @__PURE__ */ map(functorMaybe);
var apply4 = /* @__PURE__ */ apply(applyMaybe);
var RailShape = function(x) {
  return x;
};
var DrawAdditional = function(x) {
  return x;
};
var DrawRail = function(x) {
  return x;
};
var DrawInfo = function(x) {
  return x;
};
var RailGen = function(x) {
  return x;
};
var shapeLength = function(v) {
  return partLength(v.start)(v.end);
};
var reverseShapes = /* @__PURE__ */ function() {
  var $114 = map4(function(v) {
    return {
      start: v.end,
      end: v.start,
      length: v.length
    };
  });
  return function($115) {
    return $114(reverse($115));
  };
}();
var railShape = function() {
  return function(v) {
    return {
      start: v.start,
      end: v.end,
      length: partLength(unwrap3(v.start))(unwrap3(v.end))
    };
  };
};
var railShape1 = /* @__PURE__ */ railShape();
var opposeRelPos = function(v) {
  return {
    coord: v.coord,
    angle: v.angle,
    isPlus: !v.isPlus
  };
};
var opposeShape = function(v) {
  return {
    start: opposeRelPos(v.start),
    end: opposeRelPos(v.end),
    length: v.length
  };
};
var opposeDrawRail = function(v) {
  return {
    color: v.color,
    shape: opposeShape(v.shape)
  };
};
var opposeAdditional = function(v) {
  return {
    parttype: v.parttype,
    pos: opposeRelPos(v.pos)
  };
};
var opposeRail = function(v) {
  return {
    name: v.name,
    flipped: v.flipped,
    opposed: !v.opposed,
    defaultState: v.defaultState,
    getJoints: v.getJoints,
    getStates: v.getStates,
    getOrigin: v.getOrigin,
    getJointPos: function($116) {
      return opposeRelPos(v.getJointPos($116));
    },
    getNewState: v.getNewState,
    getDrawInfo: function(x) {
      var v2 = v.getDrawInfo(x);
      return {
        rails: map4(opposeDrawRail)(v2.rails),
        additionals: map4(opposeAdditional)(v2.additionals)
      };
    }
  };
};
var gray = "#668";
var grayRail = function(s) {
  return {
    color: gray,
    shape: s
  };
};
var flipRelCoord = function(v) {
  return {
    x: v.x,
    y: -v.y,
    z: v.z
  };
};
var flipRelPos = function(v) {
  return {
    coord: flipRelCoord(v.coord),
    angle: over3(Angle)(negate2)(v.angle),
    isPlus: v.isPlus
  };
};
var flipShape = function(v) {
  return {
    start: flipRelPos(v.start),
    end: flipRelPos(v.end),
    length: v.length
  };
};
var flipDrawRail = function(v) {
  return {
    color: v.color,
    shape: flipShape(v.shape)
  };
};
var flipAdditional = function(v) {
  return {
    parttype: v.parttype,
    pos: flipRelPos(v.pos)
  };
};
var flipRail = function(v) {
  return {
    name: v.name,
    flipped: !v.flipped,
    opposed: v.opposed,
    defaultState: v.defaultState,
    getJoints: v.getJoints,
    getStates: v.getStates,
    getOrigin: v.getOrigin,
    getJointPos: function($117) {
      return flipRelPos(v.getJointPos($117));
    },
    getNewState: function(x) {
      return function(y) {
        return function(v2) {
          return {
            newstate: v2.newstate,
            newjoint: v2.newjoint,
            shape: map4(flipShape)(v2.shape)
          };
        }(v.getNewState(x)(y));
      };
    },
    getDrawInfo: function(x) {
      var v2 = v.getDrawInfo(x);
      return {
        rails: map4(flipDrawRail)(v2.rails),
        additionals: map4(flipAdditional)(v2.additionals)
      };
    }
  };
};
var calcMidAngle = function(x) {
  return function(y) {
    var r = (pow(y)(2) + pow(x)(2)) / (2 * y);
    return asin(x / r);
  };
};
var slipShapes = function() {
  return function(v) {
    var pp = wrap2(wrap2(function() {
      var v1 = unwrap3(getDividingPoint_rel(unwrap3(v.start))(unwrap3(v.end))(0)(0.5));
      var $91 = {};
      for (var $92 in v1) {
        if ({}.hasOwnProperty.call(v1, $92)) {
          $91[$92] = v1[$92];
        }
        ;
      }
      ;
      $91.angle = function() {
        var c2 = unwrap3(unwrap3(unwrap3(v.end)).coord);
        var c1 = unwrap3(unwrap3(unwrap3(v.start)).coord);
        var dx = c2.x - c1.x;
        var dy = c2.y - c1.y;
        var a2 = toRadian(unwrap3(unwrap3(v.end)).angle);
        return fromRadian(toRadian(unwrap3(unwrap3(v.end)).angle) + calcMidAngle(cos(a2) * dx + sin(a2) * dy)(cos(a2) * dy - sin(a2) * dx));
      }();
      return $91;
    }()));
    return [railShape1({
      start: v.start,
      end: pp
    }), railShape1({
      start: wrap2(reversePos(unwrap3(pp))),
      end: v.end
    })];
  };
};
var brokenDrawInfo = {
  rails: [],
  additionals: []
};
var toRail = function(dictIntSerialize) {
  var toSerial2 = toSerial(dictIntSerialize);
  var fromSerial2 = fromSerial(dictIntSerialize);
  return function(dictIntSerialize1) {
    var toSerial1 = toSerial(dictIntSerialize1);
    var fromSerial1 = fromSerial(dictIntSerialize1);
    return function(v) {
      return {
        name: v.name,
        flipped: v.flipped,
        opposed: v.opposed,
        defaultState: toSerial1(v.defaultState),
        getJoints: map4(toSerial2)(v.getJoints),
        getStates: map4(toSerial1)(v.getStates),
        getOrigin: toSerial2(v.getOrigin),
        getJointPos: function(j) {
          return fromMaybe(poszero)(map13(v.getJointPos)(fromSerial2(j)));
        },
        getNewState: function(j) {
          return function(s) {
            return fromMaybe({
              newjoint: j,
              newstate: s,
              shape: []
            })(map13(function(ns) {
              return {
                newjoint: toSerial2(ns.newjoint),
                newstate: toSerial1(ns.newstate),
                shape: ns.shape
              };
            })(apply4(map13(v.getNewState)(fromSerial2(j)))(fromSerial1(s))));
          };
        },
        getDrawInfo: function(s) {
          return fromMaybe(brokenDrawInfo)(map13(v.getDrawInfo)(fromSerial1(s)));
        }
      };
    };
  };
};
var blue = "#37d";
var blueRail = function(s) {
  return {
    color: blue,
    shape: s
  };
};
var absShape = function(p) {
  return function(v) {
    return {
      start: toAbsPos(p)(v.start),
      end: toAbsPos(p)(v.end),
      length: v.length
    };
  };
};
var absParts = function(p) {
  return function(v) {
    return {
      color: v.color,
      shape: absShape(p)(v.shape)
    };
  };
};
var absAdditional = function(p) {
  return function(v) {
    return {
      parttype: v.parttype,
      pos: toAbsPos(p)(v.pos)
    };
  };
};
var absDrawInfo = function(p) {
  return function(v) {
    return {
      rails: map4(absParts(p))(v.rails),
      additionals: map4(absAdditional(p))(v.additionals)
    };
  };
};

// output/Internal.Layout/index.js
var map5 = /* @__PURE__ */ map(functorArray);
var unwrap4 = /* @__PURE__ */ unwrap();
var append2 = /* @__PURE__ */ append(semigroupArray);
var bind2 = /* @__PURE__ */ bind(bindMaybe);
var sum2 = /* @__PURE__ */ sum(foldableArray)(semiringNumber);
var join2 = /* @__PURE__ */ join(bindMaybe);
var join1 = /* @__PURE__ */ join(bindArray);
var apply5 = /* @__PURE__ */ apply(applyArray);
var composeKleisli2 = /* @__PURE__ */ composeKleisli(bindMaybe);
var map14 = /* @__PURE__ */ map(functorMaybe);
var foldM3 = /* @__PURE__ */ foldM(foldableArray)(monadMaybe);
var apply1 = /* @__PURE__ */ apply(applyMaybe);
var pure2 = /* @__PURE__ */ pure(applicativeMaybe);
var bindFlipped2 = /* @__PURE__ */ bindFlipped(bindArray);
var elem3 = /* @__PURE__ */ elem2(eqInt);
var conj2 = /* @__PURE__ */ conj(heytingAlgebraBoolean);
var bindFlipped1 = /* @__PURE__ */ bindFlipped(bindMaybe);
var SectionArray = function(x) {
  return x;
};
var Route = function(x) {
  return x;
};
var RailNode = function(x) {
  return x;
};
var RailInstance = function(x) {
  return x;
};
var JointData = function(x) {
  return x;
};
var CarType = function(x) {
  return x;
};
var TrainsetDrawInfo = function(x) {
  return x;
};
var Trainset = function(x) {
  return x;
};
var Layout = function(x) {
  return x;
};
var functorSectionArray = {
  map: function(f) {
    return function(v) {
      return {
        arraydata: map5(f)(v.arraydata),
        head: v.head,
        end: v.end
      };
    };
  }
};
var map22 = /* @__PURE__ */ map(functorSectionArray);
var wheelWidth = /* @__PURE__ */ function() {
  return 3.4 / 21.4;
}();
var wheelMargin = /* @__PURE__ */ function() {
  return 2 / 21.4;
}();
var updateRailInstance = function(v) {
  return function(j) {
    var v1 = unwrap4(unwrap4(v.node).rail).getNewState(j)(unwrap4(v.node).state);
    return {
      instance: {
        node: function() {
          var v3 = unwrap4(v.node);
          return {
            nodeid: v3.nodeid,
            rail: v3.rail,
            state: v1.newstate,
            connections: v3.connections
          };
        }(),
        instanceid: v.instanceid,
        pos: v.pos
      },
      newjoint: v1.newjoint,
      shapes: map5(absShape(v.pos))(v1.shape)
    };
  };
};
var shiftIndex = function(deleted) {
  return function(i) {
    var $121 = i < deleted;
    if ($121) {
      return i;
    }
    ;
    return i - 1 | 0;
  };
};
var shiftRailIndex = function(deleted) {
  return function(v) {
    return {
      node: function() {
        var v2 = unwrap4(v.node);
        return {
          nodeid: shiftIndex(deleted)(unwrap4(v.node).nodeid),
          rail: v2.rail,
          state: v2.state,
          connections: map5(function(c) {
            return {
              nodeid: shiftIndex(deleted)(c.nodeid),
              from: c.from,
              jointid: c.jointid
            };
          })(unwrap4(v.node).connections)
        };
      }(),
      instanceid: v.instanceid,
      pos: v.pos
    };
  };
};
var saModifyAt = function(i) {
  return function(d) {
    return function(f) {
      return function(v) {
        var $128 = i < v.head;
        if ($128) {
          return {
            arraydata: append2([f(Nothing.value)])(append2(replicate((v.head - i | 0) - 1 | 0)(d))(v.arraydata)),
            head: i,
            end: v.end
          };
        }
        ;
        var $129 = v.end <= i;
        if ($129) {
          return {
            arraydata: append2(v.arraydata)(append2(replicate(i - v.end | 0)(d))([f(Nothing.value)])),
            head: v.head,
            end: i + 1 | 0
          };
        }
        ;
        return {
          arraydata: fromMaybe(v.arraydata)(modifyAt(i - v.head | 0)(function($240) {
            return f(Just.create($240));
          })(v.arraydata)),
          head: v.head,
          end: v.end
        };
      };
    };
  };
};
var saIndex = function(i) {
  return function(v) {
    return index(v.arraydata)(i - v.head | 0);
  };
};
var saEmpty = {
  arraydata: [],
  head: 0,
  end: 0
};
var removeRail = function(v) {
  return function(nodeid) {
    return {
      version: v.version,
      rails: map5(function(v2) {
        return shiftRailIndex(nodeid)({
          node: function() {
            var v4 = unwrap4(v2.node);
            return {
              nodeid: v4.nodeid,
              rail: v4.rail,
              state: v4.state,
              connections: filter(function(v5) {
                return v5.nodeid !== nodeid;
              })(unwrap4(v2.node).connections)
            };
          }(),
          instanceid: v2.instanceid,
          pos: v2.pos
        });
      })(fromMaybe(v.rails)(deleteAt(nodeid)(v.rails))),
      trains: v.trains,
      instancecount: v.instancecount,
      traincount: v.traincount,
      jointData: map22(map22(map22(function() {
        var $241 = map5(function(v2) {
          return {
            pos: v2.pos,
            nodeid: shiftIndex(nodeid)(v2.nodeid),
            jointid: v2.jointid
          };
        });
        var $242 = filter(function(v2) {
          return v2.nodeid !== nodeid;
        });
        return function($243) {
          return $241($242($243));
        };
      }())))(v.jointData)
    };
  };
};
var movefoward = function($copy_v) {
  return function($copy_v1) {
    return function($copy_dt) {
      var $tco_var_v = $copy_v;
      var $tco_var_v1 = $copy_v1;
      var $tco_done = false;
      var $tco_result;
      function $tco_loop(v, v1, dt) {
        var dx = dt * v1.speed;
        var v2 = {
          types: v1.types,
          route: v1.route,
          distanceToNext: v1.distanceToNext - dx,
          distanceFromOldest: v1.distanceFromOldest + dx,
          speed: v1.speed,
          trainid: v1.trainid
        };
        var v3 = function() {
          var v42 = unsnoc(v2.route);
          if (v42 instanceof Nothing) {
            return v2;
          }
          ;
          if (v42 instanceof Just) {
            var $144 = v2.distanceFromOldest <= v42.value0.last.length;
            if ($144) {
              return v2;
            }
            ;
            return {
              types: v2.types,
              route: v42.value0.init,
              distanceToNext: v2.distanceToNext,
              distanceFromOldest: v2.distanceFromOldest - v42.value0.last.length,
              speed: v2.speed,
              trainid: v2.trainid
            };
          }
          ;
          throw new Error("Failed pattern match at Internal.Layout (line 414, column 9 - line 419, column 101): " + [v42.constructor.name]);
        }();
        var $149 = 0 <= v3.distanceToNext;
        if ($149) {
          $tco_done = true;
          return {
            newlayout: v,
            newtrainset: v3
          };
        }
        ;
        var v4 = bind2(head(v3.route))(function(v5) {
          return bind2(find2(function(c) {
            return c.from === updateRailInstance(v5.railinstance)(v5.jointid).newjoint;
          })(unwrap4(unwrap4(v5.railinstance).node).connections))(function(cdata) {
            return bind2(index(v.rails)(cdata.nodeid))(function(nextRail) {
              var routedata = updateRailInstance(nextRail)(cdata.jointid);
              var slength = sum2(map5(shapeLength)(routedata.shapes));
              var t3 = {
                types: v3.types,
                route: append2([{
                  nodeid: cdata.nodeid,
                  jointid: cdata.jointid,
                  railinstance: nextRail,
                  shapes: routedata.shapes,
                  length: slength
                }])(v3.route),
                distanceToNext: v3.distanceToNext + slength,
                distanceFromOldest: v3.distanceFromOldest,
                speed: v3.speed,
                trainid: v3.trainid
              };
              return new Just({
                newlayout: {
                  version: v.version,
                  rails: fromMaybe(v.rails)(updateAt(cdata.nodeid)(routedata.instance)(v.rails)),
                  trains: v.trains,
                  instancecount: v.instancecount,
                  traincount: v.traincount,
                  jointData: v.jointData
                },
                newtrainset: t3
              });
            });
          });
        });
        if (v4 instanceof Just) {
          $tco_done = true;
          return v4.value0;
        }
        ;
        if (v4 instanceof Nothing) {
          var $153 = v3.distanceToNext === 0;
          if ($153) {
            $tco_done = true;
            return {
              newlayout: v,
              newtrainset: v1
            };
          }
          ;
          $tco_var_v = v;
          $tco_var_v1 = v1;
          $copy_dt = v1.distanceToNext / v1.speed * 0.9;
          return;
        }
        ;
        throw new Error("Failed pattern match at Internal.Layout (line 423, column 13 - line 444, column 185): " + [v4.constructor.name]);
      }
      ;
      while (!$tco_done) {
        $tco_result = $tco_loop($tco_var_v, $tco_var_v1, $copy_dt);
      }
      ;
      return $tco_result;
    };
  };
};
var moveTrains = function(dt) {
  return function(v) {
    return foldl2(function(l) {
      return function(t) {
        var v1 = movefoward(l)(t)(dt);
        var v2 = unwrap4(v1.newlayout);
        return {
          version: v2.version,
          rails: v2.rails,
          trains: append2(unwrap4(v1.newlayout).trains)([v1.newtrainset]),
          instancecount: v2.instancecount,
          traincount: v2.traincount,
          jointData: v2.jointData
        };
      };
    })({
      version: v.version,
      rails: v.rails,
      trains: [],
      instancecount: v.instancecount,
      traincount: v.traincount,
      jointData: v.jointData
    })(v.trains);
  };
};
var layoutTick = /* @__PURE__ */ function() {
  return moveTrains(1 / 60);
}();
var instanceDrawInfo = function(v) {
  return absDrawInfo(v.pos)(unwrap4(unwrap4(v.node).rail).getDrawInfo(unwrap4(v.node).state));
};
var getRailJointAbsPos = function(r) {
  return function(jointid) {
    return toAbsPos(unwrap4(r).pos)(unwrap4(unwrap4(unwrap4(r).node).rail).getJointPos(jointid));
  };
};
var getJoints = function(v) {
  return function(joint) {
    var getrange = function(r) {
      var i = round2(r);
      var $162 = round2(r - 0.1) < i;
      if ($162) {
        return [i - 1 | 0, i];
      }
      ;
      var $163 = i < round2(r + 0.1);
      if ($163) {
        return [i, i + 1 | 0];
      }
      ;
      return [i];
    };
    var coord = unwrap4(unwrap4(joint).coord);
    var rx = getrange(coord.x);
    var ry = getrange(coord.y);
    var rz = getrange(coord.z);
    return join1(apply5(apply5(map5(function(x) {
      return function(y) {
        return function(z) {
          return fromMaybe([])(composeKleisli2(saIndex(z))(composeKleisli2(saIndex(x))(saIndex(y)))(v.jointData));
        };
      };
    })(rx))(ry))(rz));
  };
};
var getJointAbsPos = function(v) {
  return function(nodeid) {
    return function(jointid) {
      return map14(function(r) {
        return getRailJointAbsPos(r)(jointid);
      })(index(v.rails)(nodeid));
    };
  };
};
var getNewRailPos = function(v) {
  return function(v1) {
    var origin = unwrap4(v1.rail).getJointPos(unwrap4(v1.rail).getOrigin);
    var jrel = function(i) {
      return unwrap4(v1.rail).getJointPos(i);
    };
    var conv = function(i) {
      return convertRelPos(unwrap4(v1.rail).getJointPos(i))(origin);
    };
    return join2(foldM3(function(mposofzero) {
      return function(v2) {
        if (mposofzero instanceof Nothing) {
          return new Just(apply1(map14(toAbsPos)(map14(reversePos)(getJointAbsPos(v)(v2.nodeid)(v2.jointid))))(pure2(conv(v2.from))));
        }
        ;
        if (mposofzero instanceof Just) {
          var $171 = fromMaybe(false)(map14(canJoin(toAbsPos(mposofzero.value0)(jrel(v2.from))))(getJointAbsPos(v)(v2.nodeid)(v2.jointid)));
          if ($171) {
            return new Just(mposofzero);
          }
          ;
          return Nothing.value;
        }
        ;
        throw new Error("Failed pattern match at Internal.Layout (line 273, column 11 - line 280, column 27): " + [mposofzero.constructor.name]);
      };
    })(Nothing.value)(v1.connections));
  };
};
var carMargin = /* @__PURE__ */ function() {
  return 1 / 21.4;
}();
var carLength = /* @__PURE__ */ function() {
  return 10 / 21.4;
}();
var trainsetDrawInfo = function(v) {
  var shapes = bindFlipped2(function(v1) {
    return reverse(v1.shapes);
  })(v.route);
  var getpos$prime = function($copy_w) {
    return function($copy_d$prime) {
      return function($copy_i) {
        var $tco_var_w = $copy_w;
        var $tco_var_d$prime = $copy_d$prime;
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(w, d$prime, i) {
          var v1 = index(shapes)(i);
          if (v1 instanceof Just) {
            var $179 = v1.value0.length < d$prime;
            if ($179) {
              $tco_var_w = w;
              $tco_var_d$prime = d$prime - v1.value0.length;
              $copy_i = i + 1 | 0;
              return;
            }
            ;
            $tco_done = true;
            return getDividingPoint_rel(v1.value0.start)(v1.value0.end)(w)(1 - d$prime / v1.value0.length);
          }
          ;
          if (v1 instanceof Nothing) {
            $tco_done = true;
            return poszero;
          }
          ;
          throw new Error("Failed pattern match at Internal.Layout (line 150, column 9 - line 155, column 29): " + [v1.constructor.name]);
        }
        ;
        while (!$tco_done) {
          $tco_result = $tco_loop($tco_var_w, $tco_var_d$prime, $copy_i);
        }
        ;
        return $tco_result;
      };
    };
  };
  var getpos = function(d) {
    return function(w) {
      return getpos$prime(w)(d)(0);
    };
  };
  return {
    trainid: v.trainid,
    cars: mapWithIndex(function(i) {
      return function(ct) {
        var d = toNumber(i) * (carLength + carMargin) - carMargin + v.distanceToNext;
        var dh = d + wheelMargin;
        var dt = d + carLength - wheelMargin;
        return {
          type: ct,
          head: {
            r: getpos(dh)(-wheelWidth / 2),
            l: getpos(dh)(wheelWidth / 2)
          },
          tail: {
            r: getpos(dt)(-wheelWidth / 2),
            l: getpos(dt)(wheelWidth / 2)
          }
        };
      };
    })(v.types)
  };
};
var layoutDrawInfo = function(v) {
  return {
    rails: map5(function(r) {
      var v1 = instanceDrawInfo(r);
      return {
        rails: v1.rails,
        additionals: v1.additionals,
        joints: map5(getRailJointAbsPos(r))(unwrap4(unwrap4(unwrap4(r).node).rail).getJoints),
        instance: r
      };
    })(v.rails),
    trains: map5(trainsetDrawInfo)(v.trains)
  };
};
var trainsetLength = function(v) {
  return toNumber(length(v.types)) * (carLength + carMargin) - carMargin;
};
var addTrainset = function(v) {
  return function(nodeid) {
    return function(jointid) {
      return function(types) {
        var go = function(rs) {
          return function(nid) {
            return function(jid) {
              return function(len) {
                return bind2(index(v.rails)(nid))(function(rail) {
                  var info = updateRailInstance(rail)(jid);
                  var lenhere = sum2(map5(shapeLength)(info.shapes));
                  var $188 = lenhere < len;
                  if ($188) {
                    return bind2(find2(function(c) {
                      return c.from === info.newjoint;
                    })(unwrap4(unwrap4(rail).node).connections))(function(cdata) {
                      return go(append2([{
                        nodeid: nid,
                        jointid: jid,
                        railinstance: rail,
                        shapes: info.shapes,
                        length: lenhere
                      }])(rs))(cdata.nodeid)(cdata.jointid)(len - lenhere);
                    });
                  }
                  ;
                  return new Just({
                    types,
                    route: append2([{
                      nodeid: nid,
                      jointid: jid,
                      railinstance: rail,
                      shapes: info.shapes,
                      length: lenhere
                    }])(rs),
                    distanceToNext: lenhere - len,
                    distanceFromOldest: 0,
                    speed: 0,
                    trainid: v.traincount
                  });
                });
              };
            };
          };
        };
        return fromMaybe(v)(bind2(index(v.rails)(nodeid))(function(rail) {
          return bind2(find2(function(c) {
            return c.from === jointid;
          })(unwrap4(unwrap4(rail).node).connections))(function(start) {
            return bind2(go([])(start.nodeid)(start.jointid)(toNumber(length(types)) * (carLength + carMargin) - carMargin))(function(newtrain) {
              return new Just({
                version: v.version,
                rails: v.rails,
                trains: append2(v.trains)([newtrain]),
                instancecount: v.instancecount,
                traincount: v.traincount + 1 | 0,
                jointData: v.jointData
              });
            });
          });
        }));
      };
    };
  };
};
var addJoint = function(v) {
  return function(pos) {
    return function(nodeid) {
      return function(jointid) {
        var coord = unwrap4(unwrap4(pos).coord);
        return {
          version: v.version,
          rails: v.rails,
          trains: v.trains,
          instancecount: v.instancecount,
          traincount: v.traincount,
          jointData: saModifyAt(round2(coord.z))(saEmpty)(function() {
            var $246 = saModifyAt(round2(coord.x))(saEmpty)(function() {
              var $249 = saModifyAt(round2(coord.y))([])(function(ma) {
                return append2(fromMaybe([])(ma))([{
                  pos,
                  nodeid,
                  jointid
                }]);
              });
              var $250 = fromMaybe(saEmpty);
              return function($251) {
                return $249($250($251));
              };
            }());
            var $247 = fromMaybe(saEmpty);
            return function($248) {
              return $246($247($248));
            };
          }())(v.jointData)
        };
      };
    };
  };
};
var addRailWithPos = function(v) {
  return function(v1) {
    return function(pos) {
      var jrel = function(i) {
        return unwrap4(v1.rail).getJointPos(i);
      };
      var joints = map5(function(j) {
        return {
          jointid: j,
          pos: toAbsPos(pos)(jrel(j))
        };
      })(unwrap4(v1.rail).getJoints);
      var givenconnections = map5(function(v2) {
        return {
          jointData: {
            pos: poszero,
            nodeid: v2.nodeid,
            jointid: v2.jointid
          },
          jointid: v2.from
        };
      })(v1.connections);
      var cfroms = map5(function(v2) {
        return v2.from;
      })(v1.connections);
      var newconnections = catMaybes(map5(function(v2) {
        var $203 = elem3(v2.jointid)(cfroms);
        if ($203) {
          return Nothing.value;
        }
        ;
        return function() {
          var $252 = map14(function(jdata) {
            return {
              jointData: jdata,
              jointid: v2.jointid
            };
          });
          return function($253) {
            return $252(head($253));
          };
        }()(filter(function(v3) {
          return canJoin(v2.pos)(v3.pos);
        })(getJoints(v)(v2.pos)));
      })(joints));
      var connections = append2(givenconnections)(newconnections);
      var cond = foldl2(conj2)(true)(map5(function(v2) {
        return fromMaybe(true)(map14(function(v3) {
          return all(function(c) {
            return c.from !== v2.jointData.jointid;
          })(v3.node.connections);
        })(index(v.rails)(v2.jointData.nodeid)));
      })(connections));
      if (cond) {
        var newnode = {
          nodeid: v1.nodeid,
          rail: v1.rail,
          state: v1.state,
          connections: append2(v1.connections)(map5(function(v3) {
            return {
              from: v3.jointid,
              nodeid: v3.jointData.nodeid,
              jointid: v3.jointData.jointid
            };
          })(newconnections))
        };
        var newrails = append2(foldl2(function(rs) {
          return function(v2) {
            return fromMaybe(rs)(modifyAt(v2.jointData.nodeid)(function(v3) {
              return {
                node: function(v5) {
                  return {
                    nodeid: v5.nodeid,
                    rail: v5.rail,
                    state: v5.state,
                    connections: append2(v5.connections)([{
                      from: v2.jointData.jointid,
                      nodeid: v1.nodeid,
                      jointid: v2.jointid
                    }])
                  };
                }(v3.node),
                instanceid: v3.instanceid,
                pos: v3.pos
              };
            })(rs));
          };
        })(v.rails)(connections))([{
          node: newnode,
          instanceid: v.instancecount,
          pos
        }]);
        return new Just(function(l) {
          return foldl2(function(l$prime) {
            return function(v2) {
              return addJoint(l$prime)(v2.pos)(v1.nodeid)(v2.jointid);
            };
          })(l)(joints);
        }({
          version: v.version,
          rails: newrails,
          trains: v.trains,
          instancecount: v.instancecount + 1 | 0,
          traincount: v.traincount,
          jointData: v.jointData
        }));
      }
      ;
      return Nothing.value;
    };
  };
};
var addRail = function(l) {
  return function(n) {
    return bindFlipped1(addRailWithPos(l)(n))(getNewRailPos(l)(n));
  };
};
var autoAdd = function(v) {
  return function(selectednode) {
    return function(selectedjoint) {
      return function(rail) {
        return function(from2) {
          return fromMaybe(v)(bind2(getJointAbsPos(v)(selectednode)(selectedjoint))(function(v1) {
            var rail$prime = function() {
              var $239 = v1.isPlus === unwrap4(unwrap4(unwrap4(rail).getJointPos(from2))).isPlus;
              if ($239) {
                return opposeRail(rail);
              }
              ;
              return rail;
            }();
            var node = {
              nodeid: length(v.rails),
              state: unwrap4(rail$prime).defaultState,
              rail: rail$prime,
              connections: [{
                from: from2,
                nodeid: selectednode,
                jointid: selectedjoint
              }]
            };
            return addRail(v)(node);
          }));
        };
      };
    };
  };
};

// output/Internal.Rails/index.js
var railShape2 = /* @__PURE__ */ railShape();
var intSerializeConstructor2 = /* @__PURE__ */ intSerializeConstructor(intSerializeNoArguments);
var intSerializeSum2 = /* @__PURE__ */ intSerializeSum(intSerializeConstructor2);
var intSerializeSum1 = /* @__PURE__ */ intSerializeSum2(intSerializeConstructor2);
var map6 = /* @__PURE__ */ map(functorArray);
var intSerializeSum22 = /* @__PURE__ */ intSerializeSum2(intSerializeSum1);
var intSerializeRecord2 = /* @__PURE__ */ intSerializeRecord();
var rowListSerializeCons2 = /* @__PURE__ */ rowListSerializeCons();
var rowListSerializeNilRow2 = /* @__PURE__ */ rowListSerializeNilRow();
var rowListSerializeCons1 = /* @__PURE__ */ rowListSerializeCons2({
  reflectSymbol: function() {
    return "turnout";
  }
})(intSerializeBoolean)(rowListSerializeNilRow2)()()();
var join3 = /* @__PURE__ */ join(bindArray);
var intSerializeSum3 = /* @__PURE__ */ intSerializeSum2(intSerializeSum22);
var append3 = /* @__PURE__ */ append(semigroupArray);
var slipShapes2 = /* @__PURE__ */ slipShapes();
var StateSP_P = /* @__PURE__ */ function() {
  function StateSP_P2() {
  }
  ;
  StateSP_P2.value = new StateSP_P2();
  return StateSP_P2;
}();
var StateSP_S = /* @__PURE__ */ function() {
  function StateSP_S2() {
  }
  ;
  StateSP_S2.value = new StateSP_S2();
  return StateSP_S2;
}();
var StateSP_N = /* @__PURE__ */ function() {
  function StateSP_N2() {
  }
  ;
  StateSP_N2.value = new StateSP_N2();
  return StateSP_N2;
}();
var StateSolid = /* @__PURE__ */ function() {
  function StateSolid2() {
  }
  ;
  StateSolid2.value = new StateSolid2();
  return StateSolid2;
}();
var StatePoint = function(x) {
  return x;
};
var StateDP = function(x) {
  return x;
};
var StateCO = function(x) {
  return x;
};
var StateAP = function(x) {
  return x;
};
var JointBegin = /* @__PURE__ */ function() {
  function JointBegin2() {
  }
  ;
  JointBegin2.value = new JointBegin2();
  return JointBegin2;
}();
var JointEnd = /* @__PURE__ */ function() {
  function JointEnd2() {
  }
  ;
  JointEnd2.value = new JointEnd2();
  return JointEnd2;
}();
var JointEnter = /* @__PURE__ */ function() {
  function JointEnter2() {
  }
  ;
  JointEnter2.value = new JointEnter2();
  return JointEnter2;
}();
var JointMain = /* @__PURE__ */ function() {
  function JointMain2() {
  }
  ;
  JointMain2.value = new JointMain2();
  return JointMain2;
}();
var JointSub = /* @__PURE__ */ function() {
  function JointSub2() {
  }
  ;
  JointSub2.value = new JointSub2();
  return JointSub2;
}();
var JointOuterEnter = /* @__PURE__ */ function() {
  function JointOuterEnter2() {
  }
  ;
  JointOuterEnter2.value = new JointOuterEnter2();
  return JointOuterEnter2;
}();
var JointInnerEnter = /* @__PURE__ */ function() {
  function JointInnerEnter2() {
  }
  ;
  JointInnerEnter2.value = new JointInnerEnter2();
  return JointInnerEnter2;
}();
var JointInnerMain = /* @__PURE__ */ function() {
  function JointInnerMain2() {
  }
  ;
  JointInnerMain2.value = new JointInnerMain2();
  return JointInnerMain2;
}();
var JointOuterMain = /* @__PURE__ */ function() {
  function JointOuterMain2() {
  }
  ;
  JointOuterMain2.value = new JointOuterMain2();
  return JointOuterMain2;
}();
var JointInnerSub = /* @__PURE__ */ function() {
  function JointInnerSub2() {
  }
  ;
  JointInnerSub2.value = new JointInnerSub2();
  return JointInnerSub2;
}();
var JointOuterSub = /* @__PURE__ */ function() {
  function JointOuterSub2() {
  }
  ;
  JointOuterSub2.value = new JointOuterSub2();
  return JointOuterSub2;
}();
var JointOuterBegin = /* @__PURE__ */ function() {
  function JointOuterBegin2() {
  }
  ;
  JointOuterBegin2.value = new JointOuterBegin2();
  return JointOuterBegin2;
}();
var JointInnerEnd = /* @__PURE__ */ function() {
  function JointInnerEnd2() {
  }
  ;
  JointInnerEnd2.value = new JointInnerEnd2();
  return JointInnerEnd2;
}();
var JointInnerBegin = /* @__PURE__ */ function() {
  function JointInnerBegin2() {
  }
  ;
  JointInnerBegin2.value = new JointInnerBegin2();
  return JointInnerBegin2;
}();
var JointOuterEnd = /* @__PURE__ */ function() {
  function JointOuterEnd2() {
  }
  ;
  JointOuterEnd2.value = new JointOuterEnd2();
  return JointOuterEnd2;
}();
var noAdditionals = function(x) {
  return {
    rails: x,
    additionals: []
  };
};
var genericStatesscissors = {
  to: function(x) {
    if (x instanceof Inl) {
      return StateSP_P.value;
    }
    ;
    if (x instanceof Inr && x.value0 instanceof Inl) {
      return StateSP_S.value;
    }
    ;
    if (x instanceof Inr && x.value0 instanceof Inr) {
      return StateSP_N.value;
    }
    ;
    throw new Error("Failed pattern match at Internal.Rails (line 83, column 1 - line 83, column 70): " + [x.constructor.name]);
  },
  from: function(x) {
    if (x instanceof StateSP_P) {
      return new Inl(NoArguments.value);
    }
    ;
    if (x instanceof StateSP_S) {
      return new Inr(new Inl(NoArguments.value));
    }
    ;
    if (x instanceof StateSP_N) {
      return new Inr(new Inr(NoArguments.value));
    }
    ;
    throw new Error("Failed pattern match at Internal.Rails (line 83, column 1 - line 83, column 70): " + [x.constructor.name]);
  }
};
var intSerialize2 = /* @__PURE__ */ intSerialize(genericStatesscissors)(intSerializeSum22);
var genericStatesSolid = {
  to: function(x) {
    return StateSolid.value;
  },
  from: function(x) {
    return NoArguments.value;
  }
};
var intSerialize1 = /* @__PURE__ */ intSerialize(genericStatesSolid)(intSerializeConstructor2);
var serialAll2 = /* @__PURE__ */ serialAll(intSerialize1);
var genericStatesPoint = {
  to: function(x) {
    return x;
  },
  from: function(x) {
    return x;
  }
};
var intSerialize22 = /* @__PURE__ */ intSerialize(genericStatesPoint)(/* @__PURE__ */ intSerializeConstructor(/* @__PURE__ */ intSerializeArgument(/* @__PURE__ */ intSerializeRecord2(rowListSerializeCons1))));
var serialAll1 = /* @__PURE__ */ serialAll(intSerialize22);
var genericStatesDoublePoint = {
  to: function(x) {
    return x;
  },
  from: function(x) {
    return x;
  }
};
var intSerialize3 = /* @__PURE__ */ intSerialize(genericStatesDoublePoint)(/* @__PURE__ */ intSerializeConstructor(/* @__PURE__ */ intSerializeArgument(/* @__PURE__ */ intSerializeRecord2(/* @__PURE__ */ rowListSerializeCons2({
  reflectSymbol: function() {
    return "innerturnout";
  }
})(intSerializeBoolean)(/* @__PURE__ */ rowListSerializeCons2({
  reflectSymbol: function() {
    return "outerturnout";
  }
})(intSerializeBoolean)(rowListSerializeNilRow2)()()())()()()))));
var serialAll22 = /* @__PURE__ */ serialAll(intSerialize3);
var genericStatesAutoPoint = {
  to: function(x) {
    return x;
  },
  from: function(x) {
    return x;
  }
};
var intSerialize4 = /* @__PURE__ */ intSerialize(genericStatesAutoPoint)(/* @__PURE__ */ intSerializeConstructor(/* @__PURE__ */ intSerializeArgument(/* @__PURE__ */ intSerializeRecord2(/* @__PURE__ */ rowListSerializeCons2({
  reflectSymbol: function() {
    return "auto";
  }
})(intSerializeBoolean)(rowListSerializeCons1)()()()))));
var genericJointsSimple = {
  to: function(x) {
    if (x instanceof Inl) {
      return JointBegin.value;
    }
    ;
    if (x instanceof Inr) {
      return JointEnd.value;
    }
    ;
    throw new Error("Failed pattern match at Internal.Rails (line 89, column 1 - line 89, column 71): " + [x.constructor.name]);
  },
  from: function(x) {
    if (x instanceof JointBegin) {
      return new Inl(NoArguments.value);
    }
    ;
    if (x instanceof JointEnd) {
      return new Inr(NoArguments.value);
    }
    ;
    throw new Error("Failed pattern match at Internal.Rails (line 89, column 1 - line 89, column 71): " + [x.constructor.name]);
  }
};
var intSerialize5 = /* @__PURE__ */ intSerialize(genericJointsSimple)(intSerializeSum1);
var toRail2 = /* @__PURE__ */ toRail(intSerialize5)(intSerialize1);
var serialAll3 = /* @__PURE__ */ serialAll(intSerialize5);
var halfRail = /* @__PURE__ */ function() {
  var pe = {
    coord: {
      x: 0.5,
      y: 0,
      z: 0
    },
    angle: angle8(0),
    isPlus: true
  };
  var pb = {
    coord: {
      x: 0,
      y: 0,
      z: 0
    },
    angle: angle8(4),
    isPlus: false
  };
  var r0 = [railShape2({
    start: pb,
    end: pe
  })];
  return toRail2({
    name: "half",
    flipped: false,
    opposed: false,
    getDrawInfo: function(v) {
      return noAdditionals(map6(blueRail)(r0));
    },
    defaultState: StateSolid.value,
    getJoints: serialAll3,
    getStates: serialAll2,
    getOrigin: JointBegin.value,
    getJointPos: function(j) {
      if (j instanceof JointBegin) {
        return pb;
      }
      ;
      if (j instanceof JointEnd) {
        return pe;
      }
      ;
      throw new Error("Failed pattern match at Internal.Rails (line 161, column 28 - line 163, column 25): " + [j.constructor.name]);
    },
    getNewState: function(j) {
      return function(s) {
        if (j instanceof JointBegin) {
          return {
            newjoint: JointEnd.value,
            newstate: s,
            shape: r0
          };
        }
        ;
        if (j instanceof JointEnd) {
          return {
            newjoint: JointBegin.value,
            newstate: s,
            shape: reverseShapes(r0)
          };
        }
        ;
        throw new Error("Failed pattern match at Internal.Rails (line 164, column 30 - line 166, column 82): " + [j.constructor.name]);
      };
    }
  });
}();
var longRail = /* @__PURE__ */ function() {
  var pe = {
    coord: {
      x: 2,
      y: 0,
      z: 0
    },
    angle: angle8(0),
    isPlus: true
  };
  var pb = {
    coord: {
      x: 0,
      y: 0,
      z: 0
    },
    angle: angle8(4),
    isPlus: false
  };
  var r0 = [railShape2({
    start: pb,
    end: pe
  })];
  return toRail2({
    name: "long",
    flipped: false,
    opposed: false,
    getDrawInfo: function(v) {
      return noAdditionals(map6(blueRail)(r0));
    },
    defaultState: StateSolid.value,
    getJoints: serialAll3,
    getStates: serialAll2,
    getOrigin: JointBegin.value,
    getJointPos: function(j) {
      if (j instanceof JointBegin) {
        return pb;
      }
      ;
      if (j instanceof JointEnd) {
        return pe;
      }
      ;
      throw new Error("Failed pattern match at Internal.Rails (line 138, column 28 - line 140, column 25): " + [j.constructor.name]);
    },
    getNewState: function(j) {
      return function(s) {
        if (j instanceof JointBegin) {
          return {
            newjoint: JointEnd.value,
            newstate: s,
            shape: r0
          };
        }
        ;
        if (j instanceof JointEnd) {
          return {
            newjoint: JointBegin.value,
            newstate: s,
            shape: reverseShapes(r0)
          };
        }
        ;
        throw new Error("Failed pattern match at Internal.Rails (line 141, column 30 - line 143, column 82): " + [j.constructor.name]);
      };
    }
  });
}();
var quarterRail = /* @__PURE__ */ function() {
  var pe = {
    coord: {
      x: 0.25,
      y: 0,
      z: 0
    },
    angle: angle8(0),
    isPlus: true
  };
  var pb = {
    coord: {
      x: 0,
      y: 0,
      z: 0
    },
    angle: angle8(4),
    isPlus: false
  };
  var r0 = [railShape2({
    start: pb,
    end: pe
  })];
  return toRail2({
    name: "quarter",
    flipped: false,
    opposed: false,
    getDrawInfo: function(v) {
      return noAdditionals(map6(blueRail)(r0));
    },
    defaultState: StateSolid.value,
    getJoints: serialAll3,
    getStates: serialAll2,
    getOrigin: JointBegin.value,
    getJointPos: function(j) {
      if (j instanceof JointBegin) {
        return pb;
      }
      ;
      if (j instanceof JointEnd) {
        return pe;
      }
      ;
      throw new Error("Failed pattern match at Internal.Rails (line 184, column 28 - line 186, column 25): " + [j.constructor.name]);
    },
    getNewState: function(j) {
      return function(s) {
        if (j instanceof JointBegin) {
          return {
            newjoint: JointEnd.value,
            newstate: s,
            shape: r0
          };
        }
        ;
        if (j instanceof JointEnd) {
          return {
            newjoint: JointBegin.value,
            newstate: s,
            shape: reverseShapes(r0)
          };
        }
        ;
        throw new Error("Failed pattern match at Internal.Rails (line 187, column 30 - line 189, column 82): " + [j.constructor.name]);
      };
    }
  });
}();
var slopeCurveLRail = /* @__PURE__ */ function() {
  var pe = {
    coord: {
      x: sqrt(0.5),
      y: 1 - sqrt(0.5),
      z: 0.25
    },
    angle: angle8(1),
    isPlus: true
  };
  var pb = {
    coord: {
      x: 0,
      y: 0,
      z: 0
    },
    angle: angle8(4),
    isPlus: false
  };
  var r0 = [railShape2({
    start: pb,
    end: pe
  })];
  return toRail2({
    name: "slopecurve",
    flipped: false,
    opposed: false,
    getDrawInfo: function(v) {
      return noAdditionals(map6(blueRail)(r0));
    },
    defaultState: StateSolid.value,
    getJoints: serialAll3,
    getStates: serialAll2,
    getOrigin: JointBegin.value,
    getJointPos: function(j) {
      if (j instanceof JointBegin) {
        return pb;
      }
      ;
      if (j instanceof JointEnd) {
        return pe;
      }
      ;
      throw new Error("Failed pattern match at Internal.Rails (line 277, column 26 - line 279, column 23): " + [j.constructor.name]);
    },
    getNewState: function(j) {
      return function(s) {
        if (j instanceof JointBegin) {
          return {
            newjoint: JointEnd.value,
            newstate: s,
            shape: r0
          };
        }
        ;
        if (j instanceof JointEnd) {
          return {
            newjoint: JointBegin.value,
            newstate: s,
            shape: reverseShapes(r0)
          };
        }
        ;
        throw new Error("Failed pattern match at Internal.Rails (line 280, column 28 - line 282, column 82): " + [j.constructor.name]);
      };
    }
  });
}();
var slopeCurveRRail = /* @__PURE__ */ flipRail(slopeCurveLRail);
var slopeRail = /* @__PURE__ */ function() {
  var pe = {
    coord: {
      x: 2,
      y: 0,
      z: 1
    },
    angle: angle8(0),
    isPlus: true
  };
  var pb = {
    coord: {
      x: 0,
      y: 0,
      z: 0
    },
    angle: angle8(4),
    isPlus: false
  };
  var r0 = [railShape2({
    start: pb,
    end: pe
  })];
  return toRail2({
    name: "slope",
    flipped: false,
    opposed: false,
    getDrawInfo: function(v) {
      return noAdditionals(map6(blueRail)(r0));
    },
    defaultState: StateSolid.value,
    getJoints: serialAll3,
    getStates: serialAll2,
    getOrigin: JointBegin.value,
    getJointPos: function(j) {
      if (j instanceof JointBegin) {
        return pb;
      }
      ;
      if (j instanceof JointEnd) {
        return pe;
      }
      ;
      throw new Error("Failed pattern match at Internal.Rails (line 228, column 28 - line 230, column 25): " + [j.constructor.name]);
    },
    getNewState: function(j) {
      return function(s) {
        if (j instanceof JointBegin) {
          return {
            newjoint: JointEnd.value,
            newstate: s,
            shape: r0
          };
        }
        ;
        if (j instanceof JointEnd) {
          return {
            newjoint: JointBegin.value,
            newstate: s,
            shape: reverseShapes(r0)
          };
        }
        ;
        throw new Error("Failed pattern match at Internal.Rails (line 231, column 30 - line 233, column 82): " + [j.constructor.name]);
      };
    }
  });
}();
var straightRail = /* @__PURE__ */ function() {
  var pe = {
    coord: {
      x: 1,
      y: 0,
      z: 0
    },
    angle: angle8(0),
    isPlus: true
  };
  var pb = {
    coord: {
      x: 0,
      y: 0,
      z: 0
    },
    angle: angle8(4),
    isPlus: false
  };
  var r0 = [railShape2({
    start: pb,
    end: pe
  })];
  return toRail2({
    name: "straight",
    flipped: false,
    opposed: false,
    getDrawInfo: function(v) {
      return noAdditionals(map6(blueRail)(r0));
    },
    defaultState: StateSolid.value,
    getJoints: serialAll3,
    getStates: serialAll2,
    getOrigin: JointBegin.value,
    getJointPos: function(j) {
      if (j instanceof JointBegin) {
        return pb;
      }
      ;
      if (j instanceof JointEnd) {
        return pe;
      }
      ;
      throw new Error("Failed pattern match at Internal.Rails (line 115, column 28 - line 117, column 25): " + [j.constructor.name]);
    },
    getNewState: function(j) {
      return function(s) {
        if (j instanceof JointBegin) {
          return {
            newjoint: JointEnd.value,
            newstate: s,
            shape: r0
          };
        }
        ;
        if (j instanceof JointEnd) {
          return {
            newjoint: JointBegin.value,
            newstate: s,
            shape: reverseShapes(r0)
          };
        }
        ;
        throw new Error("Failed pattern match at Internal.Rails (line 118, column 30 - line 120, column 82): " + [j.constructor.name]);
      };
    }
  });
}();
var genericJointsPoint = {
  to: function(x) {
    if (x instanceof Inl) {
      return JointEnter.value;
    }
    ;
    if (x instanceof Inr && x.value0 instanceof Inl) {
      return JointMain.value;
    }
    ;
    if (x instanceof Inr && x.value0 instanceof Inr) {
      return JointSub.value;
    }
    ;
    throw new Error("Failed pattern match at Internal.Rails (line 91, column 1 - line 91, column 71): " + [x.constructor.name]);
  },
  from: function(x) {
    if (x instanceof JointEnter) {
      return new Inl(NoArguments.value);
    }
    ;
    if (x instanceof JointMain) {
      return new Inr(new Inl(NoArguments.value));
    }
    ;
    if (x instanceof JointSub) {
      return new Inr(new Inr(NoArguments.value));
    }
    ;
    throw new Error("Failed pattern match at Internal.Rails (line 91, column 1 - line 91, column 71): " + [x.constructor.name]);
  }
};
var intSerialize6 = /* @__PURE__ */ intSerialize(genericJointsPoint)(intSerializeSum22);
var toRail1 = /* @__PURE__ */ toRail(intSerialize6);
var toRail22 = /* @__PURE__ */ toRail1(intSerialize22);
var serialAll4 = /* @__PURE__ */ serialAll(intSerialize6);
var turnOutLPlusRail = /* @__PURE__ */ function() {
  var ps = {
    coord: {
      x: sqrt(0.5),
      y: 1 - sqrt(0.5),
      z: 0
    },
    angle: angle8(1),
    isPlus: true
  };
  var pm = {
    coord: {
      x: 1,
      y: 0,
      z: 0
    },
    angle: angle8(0),
    isPlus: true
  };
  var pe = {
    coord: {
      x: 0,
      y: 0,
      z: 0
    },
    angle: angle8(4),
    isPlus: false
  };
  var r0 = [railShape2({
    start: pe,
    end: pm
  })];
  var r1 = [railShape2({
    start: pe,
    end: ps
  })];
  return toRail22({
    name: "turnout",
    flipped: false,
    opposed: false,
    getDrawInfo: function(v) {
      if (v.turnout) {
        return noAdditionals(join3([map6(grayRail)(r0), map6(blueRail)(r1)]));
      }
      ;
      return noAdditionals(join3([map6(grayRail)(r1), map6(blueRail)(r0)]));
    },
    defaultState: {
      turnout: false
    },
    getJoints: serialAll4,
    getStates: serialAll1,
    getOrigin: JointEnter.value,
    getJointPos: function(j) {
      if (j instanceof JointEnter) {
        return pe;
      }
      ;
      if (j instanceof JointMain) {
        return pm;
      }
      ;
      if (j instanceof JointSub) {
        return ps;
      }
      ;
      throw new Error("Failed pattern match at Internal.Rails (line 306, column 28 - line 309, column 25): " + [j.constructor.name]);
    },
    getNewState: function(j) {
      return function(v) {
        if (j instanceof JointMain) {
          return {
            newjoint: JointEnter.value,
            newstate: {
              turnout: false
            },
            shape: reverseShapes(r0)
          };
        }
        ;
        if (j instanceof JointSub) {
          return {
            newjoint: JointEnter.value,
            newstate: {
              turnout: true
            },
            shape: reverseShapes(r1)
          };
        }
        ;
        if (j instanceof JointEnter) {
          if (v.turnout) {
            return {
              newjoint: JointSub.value,
              newstate: v,
              shape: r1
            };
          }
          ;
          return {
            newjoint: JointMain.value,
            newstate: v,
            shape: r0
          };
        }
        ;
        throw new Error("Failed pattern match at Internal.Rails (line 310, column 43 - line 316, column 73): " + [j.constructor.name]);
      };
    }
  });
}();
var turnOutRPlusRail = /* @__PURE__ */ flipRail(turnOutLPlusRail);
var genericJointsDoublePoint = {
  to: function(x) {
    if (x instanceof Inl) {
      return JointOuterEnter.value;
    }
    ;
    if (x instanceof Inr && x.value0 instanceof Inl) {
      return JointInnerEnter.value;
    }
    ;
    if (x instanceof Inr && (x.value0 instanceof Inr && x.value0.value0 instanceof Inl)) {
      return JointInnerMain.value;
    }
    ;
    if (x instanceof Inr && (x.value0 instanceof Inr && (x.value0.value0 instanceof Inr && x.value0.value0.value0 instanceof Inl))) {
      return JointOuterMain.value;
    }
    ;
    if (x instanceof Inr && (x.value0 instanceof Inr && (x.value0.value0 instanceof Inr && (x.value0.value0.value0 instanceof Inr && x.value0.value0.value0.value0 instanceof Inl)))) {
      return JointInnerSub.value;
    }
    ;
    if (x instanceof Inr && (x.value0 instanceof Inr && (x.value0.value0 instanceof Inr && (x.value0.value0.value0 instanceof Inr && x.value0.value0.value0.value0 instanceof Inr)))) {
      return JointOuterSub.value;
    }
    ;
    throw new Error("Failed pattern match at Internal.Rails (line 95, column 1 - line 95, column 71): " + [x.constructor.name]);
  },
  from: function(x) {
    if (x instanceof JointOuterEnter) {
      return new Inl(NoArguments.value);
    }
    ;
    if (x instanceof JointInnerEnter) {
      return new Inr(new Inl(NoArguments.value));
    }
    ;
    if (x instanceof JointInnerMain) {
      return new Inr(new Inr(new Inl(NoArguments.value)));
    }
    ;
    if (x instanceof JointOuterMain) {
      return new Inr(new Inr(new Inr(new Inl(NoArguments.value))));
    }
    ;
    if (x instanceof JointInnerSub) {
      return new Inr(new Inr(new Inr(new Inr(new Inl(NoArguments.value)))));
    }
    ;
    if (x instanceof JointOuterSub) {
      return new Inr(new Inr(new Inr(new Inr(new Inr(NoArguments.value)))));
    }
    ;
    throw new Error("Failed pattern match at Internal.Rails (line 95, column 1 - line 95, column 71): " + [x.constructor.name]);
  }
};
var intSerialize7 = /* @__PURE__ */ intSerialize(genericJointsDoublePoint)(/* @__PURE__ */ intSerializeSum2(/* @__PURE__ */ intSerializeSum2(intSerializeSum3)));
var genericJointsDouble = {
  to: function(x) {
    if (x instanceof Inl) {
      return JointOuterBegin.value;
    }
    ;
    if (x instanceof Inr && x.value0 instanceof Inl) {
      return JointInnerEnd.value;
    }
    ;
    if (x instanceof Inr && (x.value0 instanceof Inr && x.value0.value0 instanceof Inl)) {
      return JointInnerBegin.value;
    }
    ;
    if (x instanceof Inr && (x.value0 instanceof Inr && x.value0.value0 instanceof Inr)) {
      return JointOuterEnd.value;
    }
    ;
    throw new Error("Failed pattern match at Internal.Rails (line 93, column 1 - line 93, column 71): " + [x.constructor.name]);
  },
  from: function(x) {
    if (x instanceof JointOuterBegin) {
      return new Inl(NoArguments.value);
    }
    ;
    if (x instanceof JointInnerEnd) {
      return new Inr(new Inl(NoArguments.value));
    }
    ;
    if (x instanceof JointInnerBegin) {
      return new Inr(new Inr(new Inl(NoArguments.value)));
    }
    ;
    if (x instanceof JointOuterEnd) {
      return new Inr(new Inr(new Inr(NoArguments.value)));
    }
    ;
    throw new Error("Failed pattern match at Internal.Rails (line 93, column 1 - line 93, column 71): " + [x.constructor.name]);
  }
};
var intSerialize8 = /* @__PURE__ */ intSerialize(genericJointsDouble)(intSerializeSum3);
var toRail3 = /* @__PURE__ */ toRail(intSerialize8);
var serialAll5 = /* @__PURE__ */ serialAll(intSerialize8);
var doubleRailWidth = /* @__PURE__ */ function() {
  return 6 / 21.4;
}();
var doubleTurnoutLPlusRail = /* @__PURE__ */ function() {
  var scale = 1 + doubleRailWidth;
  var pos = {
    coord: {
      x: sqrt(0.5),
      y: 1 - sqrt(0.5),
      z: 0
    },
    angle: angle8(1),
    isPlus: true
  };
  var pom = {
    coord: {
      x: 1,
      y: 0,
      z: 0
    },
    angle: angle8(0),
    isPlus: true
  };
  var poe = {
    coord: {
      x: 0,
      y: 0,
      z: 0
    },
    angle: angle8(4),
    isPlus: false
  };
  var rom = [railShape2({
    start: poe,
    end: pom
  })];
  var ros = [railShape2({
    start: poe,
    end: pos
  })];
  var pis = {
    coord: {
      x: sqrt(0.5) * scale,
      y: (1 - sqrt(0.5)) * scale - doubleRailWidth,
      z: 0
    },
    angle: angle8(1),
    isPlus: true
  };
  var pim = {
    coord: {
      x: 1,
      y: -doubleRailWidth,
      z: 0
    },
    angle: angle8(0),
    isPlus: true
  };
  var pie = {
    coord: {
      x: 0,
      y: -doubleRailWidth,
      z: 0
    },
    angle: angle8(4),
    isPlus: false
  };
  var rim = [railShape2({
    start: pie,
    end: pim
  })];
  var ris = [railShape2({
    start: pie,
    end: pis
  })];
  return toRail(intSerialize7)(intSerialize3)({
    name: "doubleTurnout",
    flipped: false,
    opposed: false,
    getDrawInfo: function(v) {
      if (v.outerturnout) {
        if (v.innerturnout) {
          return noAdditionals(append3(map6(grayRail)(rom))(append3(map6(grayRail)(rim))(append3(map6(blueRail)(ros))(map6(blueRail)(ris)))));
        }
        ;
        return noAdditionals(append3(map6(grayRail)(rom))(append3(map6(grayRail)(ris))(append3(map6(blueRail)(ros))(map6(blueRail)(rim)))));
      }
      ;
      if (v.innerturnout) {
        return noAdditionals(append3(map6(grayRail)(ros))(append3(map6(grayRail)(rim))(append3(map6(blueRail)(rom))(map6(blueRail)(ris)))));
      }
      ;
      return noAdditionals(append3(map6(grayRail)(ros))(append3(map6(grayRail)(ris))(append3(map6(blueRail)(rom))(map6(blueRail)(rim)))));
    },
    defaultState: {
      innerturnout: false,
      outerturnout: false
    },
    getJoints: serialAll(intSerialize7),
    getStates: serialAll22,
    getOrigin: JointOuterEnter.value,
    getJointPos: function(j) {
      if (j instanceof JointOuterEnter) {
        return poe;
      }
      ;
      if (j instanceof JointOuterMain) {
        return pom;
      }
      ;
      if (j instanceof JointOuterSub) {
        return pos;
      }
      ;
      if (j instanceof JointInnerEnter) {
        return pie;
      }
      ;
      if (j instanceof JointInnerMain) {
        return pim;
      }
      ;
      if (j instanceof JointInnerSub) {
        return pis;
      }
      ;
      throw new Error("Failed pattern match at Internal.Rails (line 558, column 26 - line 564, column 29): " + [j.constructor.name]);
    },
    getNewState: function(j) {
      return function(v) {
        if (j instanceof JointOuterEnter) {
          if (v.outerturnout) {
            return {
              newjoint: JointOuterSub.value,
              newstate: v,
              shape: ros
            };
          }
          ;
          return {
            newjoint: JointOuterMain.value,
            newstate: v,
            shape: rom
          };
        }
        ;
        if (j instanceof JointOuterMain) {
          if (v.outerturnout) {
            return {
              newjoint: JointOuterEnter.value,
              newstate: {
                innerturnout: v.innerturnout,
                outerturnout: false
              },
              shape: reverseShapes(rom)
            };
          }
          ;
          return {
            newjoint: JointOuterEnter.value,
            newstate: {
              innerturnout: v.innerturnout,
              outerturnout: false
            },
            shape: reverseShapes(rom)
          };
        }
        ;
        if (j instanceof JointOuterSub) {
          if (v.outerturnout) {
            return {
              newjoint: JointOuterEnter.value,
              newstate: {
                innerturnout: v.innerturnout,
                outerturnout: true
              },
              shape: reverseShapes(ros)
            };
          }
          ;
          return {
            newjoint: JointOuterEnter.value,
            newstate: {
              innerturnout: v.innerturnout,
              outerturnout: true
            },
            shape: reverseShapes(ros)
          };
        }
        ;
        if (j instanceof JointInnerEnter) {
          if (v.innerturnout) {
            return {
              newjoint: JointInnerSub.value,
              newstate: v,
              shape: ris
            };
          }
          ;
          return {
            newjoint: JointInnerMain.value,
            newstate: v,
            shape: rim
          };
        }
        ;
        if (j instanceof JointInnerMain) {
          if (v.innerturnout) {
            return {
              newjoint: JointOuterEnter.value,
              newstate: {
                innerturnout: false,
                outerturnout: v.outerturnout
              },
              shape: reverseShapes(rim)
            };
          }
          ;
          return {
            newjoint: JointOuterEnter.value,
            newstate: {
              innerturnout: false,
              outerturnout: v.outerturnout
            },
            shape: reverseShapes(rim)
          };
        }
        ;
        if (j instanceof JointInnerSub) {
          if (v.innerturnout) {
            return {
              newjoint: JointOuterEnter.value,
              newstate: {
                innerturnout: true,
                outerturnout: v.outerturnout
              },
              shape: reverseShapes(ris)
            };
          }
          ;
          return {
            newjoint: JointOuterEnter.value,
            newstate: {
              innerturnout: true,
              outerturnout: v.outerturnout
            },
            shape: reverseShapes(ris)
          };
        }
        ;
        throw new Error("Failed pattern match at Internal.Rails (line 566, column 7 - line 590, column 117): " + [j.constructor.name]);
      };
    }
  });
}();
var doubleTurnoutRPlusRail = /* @__PURE__ */ flipRail(doubleTurnoutLPlusRail);
var outerCurveLRail = /* @__PURE__ */ function() {
  var scale = 1 + doubleRailWidth;
  var pe = {
    coord: {
      x: sqrt(0.5) * scale,
      y: (1 - sqrt(0.5)) * scale,
      z: 0
    },
    angle: angle8(1),
    isPlus: true
  };
  var pb = {
    coord: {
      x: 0,
      y: 0,
      z: 0
    },
    angle: angle8(4),
    isPlus: false
  };
  var r0 = [railShape2({
    start: pb,
    end: pe
  })];
  return toRail2({
    name: "outercurve",
    flipped: false,
    opposed: false,
    getDrawInfo: function(v) {
      return noAdditionals(map6(blueRail)(r0));
    },
    defaultState: StateSolid.value,
    getJoints: serialAll3,
    getStates: serialAll2,
    getOrigin: JointBegin.value,
    getJointPos: function(j) {
      if (j instanceof JointBegin) {
        return pb;
      }
      ;
      if (j instanceof JointEnd) {
        return pe;
      }
      ;
      throw new Error("Failed pattern match at Internal.Rails (line 431, column 26 - line 433, column 23): " + [j.constructor.name]);
    },
    getNewState: function(j) {
      return function(s) {
        if (j instanceof JointBegin) {
          return {
            newjoint: JointEnd.value,
            newstate: s,
            shape: r0
          };
        }
        ;
        if (j instanceof JointEnd) {
          return {
            newjoint: JointBegin.value,
            newstate: s,
            shape: reverseShapes(r0)
          };
        }
        ;
        throw new Error("Failed pattern match at Internal.Rails (line 434, column 28 - line 436, column 80): " + [j.constructor.name]);
      };
    }
  });
}();
var outerCurveRRail = /* @__PURE__ */ flipRail(outerCurveLRail);
var scissorsRail = /* @__PURE__ */ function() {
  var ppp = {
    coord: {
      x: 0.5,
      y: -doubleRailWidth / 2,
      z: 0
    },
    angle: anglen(12)(11),
    isPlus: true
  };
  var ppn = {
    coord: {
      x: 0.5,
      y: -doubleRailWidth / 2,
      z: 0
    },
    angle: anglen(12)(1),
    isPlus: true
  };
  var poe = {
    coord: {
      x: 1,
      y: 0,
      z: 0
    },
    angle: angle8(0),
    isPlus: false
  };
  var pob = {
    coord: {
      x: 0,
      y: 0,
      z: 0
    },
    angle: angle8(4),
    isPlus: true
  };
  var ro = [railShape2({
    start: pob,
    end: poe
  })];
  var pie = {
    coord: {
      x: 0,
      y: -doubleRailWidth,
      z: 0
    },
    angle: angle8(4),
    isPlus: true
  };
  var rn = slipShapes2({
    start: pie,
    end: poe
  });
  var pib = {
    coord: {
      x: 1,
      y: -doubleRailWidth,
      z: 0
    },
    angle: angle8(0),
    isPlus: false
  };
  var ri = [railShape2({
    start: pib,
    end: pie
  })];
  var rp = slipShapes2({
    start: pob,
    end: pib
  });
  var pPp = {
    coord: {
      x: 0.5,
      y: -doubleRailWidth / 2,
      z: 0
    },
    angle: anglen(12)(5),
    isPlus: false
  };
  var pPn = {
    coord: {
      x: 0.5,
      y: -doubleRailWidth / 2,
      z: 0
    },
    angle: anglen(12)(7),
    isPlus: false
  };
  return toRail3(intSerialize2)({
    name: "scissors",
    flipped: false,
    opposed: false,
    getDrawInfo: function(s) {
      if (s instanceof StateSP_P) {
        return noAdditionals(append3(map6(grayRail)(ri))(append3(map6(grayRail)(ro))(append3(map6(grayRail)(rn))(map6(blueRail)(rp)))));
      }
      ;
      if (s instanceof StateSP_S) {
        return noAdditionals(append3(map6(grayRail)(rn))(append3(map6(grayRail)(rp))(append3(map6(blueRail)(ri))(map6(blueRail)(ro)))));
      }
      ;
      if (s instanceof StateSP_N) {
        return noAdditionals(append3(map6(grayRail)(ri))(append3(map6(grayRail)(ro))(append3(map6(grayRail)(rp))(map6(blueRail)(rn)))));
      }
      ;
      throw new Error("Failed pattern match at Internal.Rails (line 461, column 7 - line 476, column 43): " + [s.constructor.name]);
    },
    defaultState: StateSP_S.value,
    getJoints: serialAll5,
    getStates: serialAll(intSerialize2),
    getOrigin: JointOuterBegin.value,
    getJointPos: function(j) {
      if (j instanceof JointOuterBegin) {
        return pob;
      }
      ;
      if (j instanceof JointOuterEnd) {
        return poe;
      }
      ;
      if (j instanceof JointInnerBegin) {
        return pib;
      }
      ;
      if (j instanceof JointInnerEnd) {
        return pie;
      }
      ;
      throw new Error("Failed pattern match at Internal.Rails (line 482, column 26 - line 486, column 29): " + [j.constructor.name]);
    },
    getNewState: function(j) {
      return function(s) {
        if (s instanceof StateSP_P) {
          if (j instanceof JointInnerBegin) {
            return {
              newjoint: JointOuterBegin.value,
              newstate: StateSP_P.value,
              shape: reverseShapes(rp)
            };
          }
          ;
          if (j instanceof JointInnerEnd) {
            return {
              newjoint: JointInnerBegin.value,
              newstate: StateSP_S.value,
              shape: reverseShapes(ri)
            };
          }
          ;
          if (j instanceof JointOuterBegin) {
            return {
              newjoint: JointInnerBegin.value,
              newstate: StateSP_P.value,
              shape: rp
            };
          }
          ;
          if (j instanceof JointOuterEnd) {
            return {
              newjoint: JointOuterBegin.value,
              newstate: StateSP_S.value,
              shape: reverseShapes(ro)
            };
          }
          ;
          throw new Error("Failed pattern match at Internal.Rails (line 490, column 11 - line 494, column 105): " + [j.constructor.name]);
        }
        ;
        if (s instanceof StateSP_S) {
          if (j instanceof JointInnerBegin) {
            return {
              newjoint: JointInnerEnd.value,
              newstate: StateSP_S.value,
              shape: ri
            };
          }
          ;
          if (j instanceof JointInnerEnd) {
            return {
              newjoint: JointInnerBegin.value,
              newstate: StateSP_S.value,
              shape: reverseShapes(ri)
            };
          }
          ;
          if (j instanceof JointOuterBegin) {
            return {
              newjoint: JointOuterEnd.value,
              newstate: StateSP_S.value,
              shape: ro
            };
          }
          ;
          if (j instanceof JointOuterEnd) {
            return {
              newjoint: JointOuterBegin.value,
              newstate: StateSP_S.value,
              shape: reverseShapes(ro)
            };
          }
          ;
          throw new Error("Failed pattern match at Internal.Rails (line 496, column 11 - line 500, column 105): " + [j.constructor.name]);
        }
        ;
        if (s instanceof StateSP_N) {
          if (j instanceof JointInnerBegin) {
            return {
              newjoint: JointInnerEnd.value,
              newstate: StateSP_S.value,
              shape: ri
            };
          }
          ;
          if (j instanceof JointInnerEnd) {
            return {
              newjoint: JointOuterEnd.value,
              newstate: StateSP_P.value,
              shape: rn
            };
          }
          ;
          if (j instanceof JointOuterBegin) {
            return {
              newjoint: JointOuterEnd.value,
              newstate: StateSP_S.value,
              shape: ro
            };
          }
          ;
          if (j instanceof JointOuterEnd) {
            return {
              newjoint: JointInnerEnd.value,
              newstate: StateSP_P.value,
              shape: reverseShapes(rn)
            };
          }
          ;
          throw new Error("Failed pattern match at Internal.Rails (line 502, column 11 - line 506, column 105): " + [j.constructor.name]);
        }
        ;
        throw new Error("Failed pattern match at Internal.Rails (line 488, column 7 - line 506, column 105): " + [s.constructor.name]);
      };
    }
  });
}();
var curveLRail = /* @__PURE__ */ function() {
  var pe = {
    coord: {
      x: sqrt(0.5),
      y: 1 - sqrt(0.5),
      z: 0
    },
    angle: angle8(1),
    isPlus: true
  };
  var pb = {
    coord: {
      x: 0,
      y: 0,
      z: 0
    },
    angle: angle8(4),
    isPlus: false
  };
  var r0 = [railShape2({
    start: pb,
    end: pe
  })];
  return toRail2({
    name: "curve",
    flipped: false,
    opposed: false,
    getDrawInfo: function(v) {
      return noAdditionals(map6(blueRail)(r0));
    },
    defaultState: StateSolid.value,
    getJoints: serialAll3,
    getStates: serialAll2,
    getOrigin: JointBegin.value,
    getJointPos: function(j) {
      if (j instanceof JointBegin) {
        return pb;
      }
      ;
      if (j instanceof JointEnd) {
        return pe;
      }
      ;
      throw new Error("Failed pattern match at Internal.Rails (line 251, column 26 - line 253, column 23): " + [j.constructor.name]);
    },
    getNewState: function(j) {
      return function(s) {
        if (j instanceof JointBegin) {
          return {
            newjoint: JointEnd.value,
            newstate: s,
            shape: r0
          };
        }
        ;
        if (j instanceof JointEnd) {
          return {
            newjoint: JointBegin.value,
            newstate: s,
            shape: reverseShapes(r0)
          };
        }
        ;
        throw new Error("Failed pattern match at Internal.Rails (line 254, column 28 - line 256, column 82): " + [j.constructor.name]);
      };
    }
  });
}();
var curveRRail = /* @__PURE__ */ flipRail(curveLRail);
var converterRail = /* @__PURE__ */ function() {
  var pe = {
    coord: {
      x: 0.25,
      y: 0,
      z: 0
    },
    angle: angle8(0),
    isPlus: false
  };
  var pb = {
    coord: {
      x: 0,
      y: 0,
      z: 0
    },
    angle: angle8(4),
    isPlus: false
  };
  var r0 = [railShape2({
    start: pb,
    end: pe
  })];
  return toRail2({
    name: "converter",
    flipped: false,
    opposed: false,
    getDrawInfo: function(v) {
      return noAdditionals(map6(blueRail)(r0));
    },
    defaultState: StateSolid.value,
    getJoints: serialAll3,
    getStates: serialAll2,
    getOrigin: JointBegin.value,
    getJointPos: function(j) {
      if (j instanceof JointBegin) {
        return pb;
      }
      ;
      if (j instanceof JointEnd) {
        return pe;
      }
      ;
      throw new Error("Failed pattern match at Internal.Rails (line 206, column 28 - line 208, column 25): " + [j.constructor.name]);
    },
    getNewState: function(j) {
      return function(s) {
        if (j instanceof JointBegin) {
          return {
            newjoint: JointEnd.value,
            newstate: s,
            shape: r0
          };
        }
        ;
        if (j instanceof JointEnd) {
          return {
            newjoint: JointBegin.value,
            newstate: s,
            shape: reverseShapes(r0)
          };
        }
        ;
        throw new Error("Failed pattern match at Internal.Rails (line 209, column 30 - line 211, column 82): " + [j.constructor.name]);
      };
    }
  });
}();
var calcMidAngle2 = function(x) {
  return function(y) {
    var r = (pow(y)(2) + pow(x)(2)) / (2 * y);
    return asin(x / r);
  };
};
var doubleToWideLRail = /* @__PURE__ */ function() {
  var poe = {
    coord: {
      x: 1.25,
      y: 0.5 - doubleRailWidth,
      z: 0
    },
    angle: angle8(0),
    isPlus: true
  };
  var pob = {
    coord: {
      x: 0,
      y: 0,
      z: 0
    },
    angle: angle8(4),
    isPlus: false
  };
  var ro = slipShapes2({
    start: pob,
    end: poe
  });
  var pie = {
    coord: {
      x: 0,
      y: -doubleRailWidth,
      z: 0
    },
    angle: angle8(4),
    isPlus: false
  };
  var rn = slipShapes2({
    start: pie,
    end: poe
  });
  var pib = {
    coord: {
      x: 1.25,
      y: -doubleRailWidth,
      z: 0
    },
    angle: angle8(0),
    isPlus: false
  };
  var ri = [railShape2({
    start: pib,
    end: pie
  })];
  var angleq = fromRadian(calcMidAngle2(1.25)(0.5 - doubleRailWidth));
  var pQn = {
    coord: {
      x: 0.625,
      y: (0.5 - doubleRailWidth) / 2,
      z: 0
    },
    angle: reverseAngle(angleq),
    isPlus: false
  };
  var pqn = {
    coord: {
      x: 0.625,
      y: (0.5 - doubleRailWidth) / 2,
      z: 0
    },
    angle: angleq,
    isPlus: true
  };
  var anglep = fromRadian(calcMidAngle2(1.25)(0.5));
  var pPn = {
    coord: {
      x: 0.625,
      y: 0.25 - doubleRailWidth,
      z: 0
    },
    angle: reverseAngle(anglep),
    isPlus: false
  };
  var ppn = {
    coord: {
      x: 0.625,
      y: 0.25 - doubleRailWidth,
      z: 0
    },
    angle: anglep,
    isPlus: true
  };
  return toRail3(intSerialize3)({
    name: "doubletowide",
    flipped: false,
    opposed: false,
    getDrawInfo: function(v) {
      if (v.outerturnout) {
        if (v.innerturnout) {
          return noAdditionals(append3(map6(grayRail)(ri))(append3(map6(grayRail)(ro))(map6(blueRail)(rn))));
        }
        ;
        return noAdditionals(append3(map6(grayRail)(ro))(append3(map6(blueRail)(ri))(map6(blueRail)(rn))));
      }
      ;
      if (v.innerturnout) {
        return noAdditionals(append3(map6(grayRail)(ri))(append3(map6(blueRail)(ro))(map6(blueRail)(rn))));
      }
      ;
      return noAdditionals(append3(map6(grayRail)(rn))(append3(map6(blueRail)(ri))(map6(blueRail)(ro))));
    },
    defaultState: {
      innerturnout: false,
      outerturnout: false
    },
    getJoints: serialAll5,
    getStates: serialAll22,
    getOrigin: JointOuterBegin.value,
    getJointPos: function(j) {
      if (j instanceof JointOuterBegin) {
        return pob;
      }
      ;
      if (j instanceof JointOuterEnd) {
        return poe;
      }
      ;
      if (j instanceof JointInnerBegin) {
        return pib;
      }
      ;
      if (j instanceof JointInnerEnd) {
        return pie;
      }
      ;
      throw new Error("Failed pattern match at Internal.Rails (line 643, column 26 - line 647, column 29): " + [j.constructor.name]);
    },
    getNewState: function(j) {
      return function(v) {
        if (v.outerturnout) {
          if (v.innerturnout) {
            if (j instanceof JointInnerBegin) {
              return {
                newjoint: JointInnerEnd.value,
                newstate: {
                  innerturnout: false,
                  outerturnout: v.outerturnout
                },
                shape: ri
              };
            }
            ;
            if (j instanceof JointInnerEnd) {
              return {
                newjoint: JointOuterEnd.value,
                newstate: v,
                shape: rn
              };
            }
            ;
            if (j instanceof JointOuterBegin) {
              return {
                newjoint: JointOuterEnd.value,
                newstate: {
                  innerturnout: v.innerturnout,
                  outerturnout: false
                },
                shape: ro
              };
            }
            ;
            if (j instanceof JointOuterEnd) {
              return {
                newjoint: JointInnerEnd.value,
                newstate: v,
                shape: reverseShapes(rn)
              };
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 653, column 11 - line 657, column 129): " + [j.constructor.name]);
          }
          ;
          if (j instanceof JointInnerBegin) {
            return {
              newjoint: JointInnerEnd.value,
              newstate: v,
              shape: ri
            };
          }
          ;
          if (j instanceof JointInnerEnd) {
            return {
              newjoint: JointInnerBegin.value,
              newstate: v,
              shape: reverseShapes(ri)
            };
          }
          ;
          if (j instanceof JointOuterBegin) {
            return {
              newjoint: JointOuterEnd.value,
              newstate: {
                innerturnout: v.innerturnout,
                outerturnout: false
              },
              shape: ro
            };
          }
          ;
          if (j instanceof JointOuterEnd) {
            return {
              newjoint: JointInnerEnd.value,
              newstate: {
                innerturnout: true,
                outerturnout: v.outerturnout
              },
              shape: reverseShapes(rn)
            };
          }
          ;
          throw new Error("Failed pattern match at Internal.Rails (line 659, column 11 - line 663, column 129): " + [j.constructor.name]);
        }
        ;
        if (v.innerturnout) {
          if (j instanceof JointInnerBegin) {
            return {
              newjoint: JointInnerEnd.value,
              newstate: {
                innerturnout: false,
                outerturnout: v.outerturnout
              },
              shape: ri
            };
          }
          ;
          if (j instanceof JointInnerEnd) {
            return {
              newjoint: JointOuterEnd.value,
              newstate: {
                innerturnout: v.innerturnout,
                outerturnout: true
              },
              shape: rn
            };
          }
          ;
          if (j instanceof JointOuterBegin) {
            return {
              newjoint: JointOuterEnd.value,
              newstate: v,
              shape: ro
            };
          }
          ;
          if (j instanceof JointOuterEnd) {
            return {
              newjoint: JointOuterBegin.value,
              newstate: v,
              shape: reverseShapes(ro)
            };
          }
          ;
          throw new Error("Failed pattern match at Internal.Rails (line 667, column 11 - line 671, column 129): " + [j.constructor.name]);
        }
        ;
        if (j instanceof JointInnerBegin) {
          return {
            newjoint: JointInnerEnd.value,
            newstate: v,
            shape: ri
          };
        }
        ;
        if (j instanceof JointInnerEnd) {
          return {
            newjoint: JointInnerBegin.value,
            newstate: v,
            shape: reverseShapes(ri)
          };
        }
        ;
        if (j instanceof JointOuterBegin) {
          return {
            newjoint: JointOuterEnd.value,
            newstate: v,
            shape: ro
          };
        }
        ;
        if (j instanceof JointOuterEnd) {
          return {
            newjoint: JointOuterBegin.value,
            newstate: v,
            shape: reverseShapes(ro)
          };
        }
        ;
        throw new Error("Failed pattern match at Internal.Rails (line 673, column 11 - line 677, column 129): " + [j.constructor.name]);
      };
    }
  });
}();
var doubleToWideRRail = /* @__PURE__ */ flipRail(doubleToWideLRail);
var toDoubleLPlusRail = /* @__PURE__ */ function() {
  var ps = {
    coord: {
      x: 1,
      y: doubleRailWidth,
      z: 0
    },
    angle: angle8(0),
    isPlus: true
  };
  var pm = {
    coord: {
      x: 1,
      y: 0,
      z: 0
    },
    angle: angle8(0),
    isPlus: true
  };
  var pe = {
    coord: {
      x: 0,
      y: 0,
      z: 0
    },
    angle: angle8(4),
    isPlus: false
  };
  var r0 = [railShape2({
    start: pe,
    end: pm
  })];
  var r1 = slipShapes2({
    start: pe,
    end: ps
  });
  var anglep = fromRadian(calcMidAngle2(1)(doubleRailWidth));
  var pP = {
    coord: {
      x: 0.5,
      y: doubleRailWidth / 2,
      z: 0
    },
    angle: reverseAngle(anglep),
    isPlus: false
  };
  var pp = {
    coord: {
      x: 0.5,
      y: doubleRailWidth / 2,
      z: 0
    },
    angle: anglep,
    isPlus: true
  };
  return toRail22({
    name: "todouble",
    flipped: false,
    opposed: false,
    getDrawInfo: function(v) {
      if (v.turnout) {
        return noAdditionals(join3([map6(grayRail)(r0), map6(blueRail)(r1)]));
      }
      ;
      return noAdditionals(join3([map6(grayRail)(r1), map6(blueRail)(r0)]));
    },
    defaultState: {
      turnout: false
    },
    getJoints: serialAll4,
    getStates: serialAll1,
    getOrigin: JointEnter.value,
    getJointPos: function(j) {
      if (j instanceof JointEnter) {
        return pe;
      }
      ;
      if (j instanceof JointMain) {
        return pm;
      }
      ;
      if (j instanceof JointSub) {
        return ps;
      }
      ;
      throw new Error("Failed pattern match at Internal.Rails (line 399, column 28 - line 402, column 25): " + [j.constructor.name]);
    },
    getNewState: function(j) {
      return function(v) {
        if (j instanceof JointMain) {
          return {
            newjoint: JointEnter.value,
            newstate: {
              turnout: false
            },
            shape: reverseShapes(r0)
          };
        }
        ;
        if (j instanceof JointSub) {
          return {
            newjoint: JointEnter.value,
            newstate: {
              turnout: true
            },
            shape: reverseShapes(r1)
          };
        }
        ;
        if (j instanceof JointEnter) {
          if (v.turnout) {
            return {
              newjoint: JointSub.value,
              newstate: v,
              shape: r1
            };
          }
          ;
          return {
            newjoint: JointMain.value,
            newstate: v,
            shape: r0
          };
        }
        ;
        throw new Error("Failed pattern match at Internal.Rails (line 403, column 43 - line 409, column 73): " + [j.constructor.name]);
      };
    }
  });
}();
var toDoubleRPlusRail = /* @__PURE__ */ flipRail(toDoubleLPlusRail);
var autoTurnOutLPlusRail = /* @__PURE__ */ function() {
  var ps = {
    coord: {
      x: 0.5 + sqrt(0.5),
      y: 1 - sqrt(0.5),
      z: 0
    },
    angle: angle8(1),
    isPlus: true
  };
  var pp = {
    coord: {
      x: 0.5,
      y: 0,
      z: 0
    },
    angle: angle8(0),
    isPlus: true
  };
  var pm = {
    coord: {
      x: 1.5,
      y: 0,
      z: 0
    },
    angle: angle8(0),
    isPlus: true
  };
  var pe = {
    coord: {
      x: 0,
      y: 0,
      z: 0
    },
    angle: angle8(4),
    isPlus: false
  };
  var r_ = [railShape2({
    start: pe,
    end: pp
  })];
  var pP = {
    coord: {
      x: 0.5,
      y: 0,
      z: 0
    },
    angle: angle8(4),
    isPlus: false
  };
  var r0 = [railShape2({
    start: pP,
    end: pm
  })];
  var r1 = [railShape2({
    start: pP,
    end: ps
  })];
  return toRail1(intSerialize4)({
    name: "autoturnout",
    flipped: false,
    opposed: false,
    getDrawInfo: function(v) {
      if (v.auto) {
        if (v.turnout) {
          return noAdditionals(join3([map6(function(s1) {
            return {
              color: "#33a",
              shape: s1
            };
          })(r0), map6(blueRail)(r_), map6(blueRail)(r1)]));
        }
        ;
        return noAdditionals(join3([map6(function(s1) {
          return {
            color: "#33a",
            shape: s1
          };
        })(r1), map6(blueRail)(r_), map6(blueRail)(r0)]));
      }
      ;
      if (v.turnout) {
        return noAdditionals(join3([map6(function(s1) {
          return {
            color: "#866",
            shape: s1
          };
        })(r0), map6(blueRail)(r_), map6(blueRail)(r1)]));
      }
      ;
      return noAdditionals(join3([map6(function(s1) {
        return {
          color: "#866",
          shape: s1
        };
      })(r1), map6(blueRail)(r_), map6(blueRail)(r0)]));
    },
    defaultState: {
      turnout: false,
      auto: true
    },
    getJoints: serialAll4,
    getStates: serialAll(intSerialize4),
    getOrigin: JointEnter.value,
    getJointPos: function(j) {
      if (j instanceof JointEnter) {
        return pe;
      }
      ;
      if (j instanceof JointMain) {
        return pm;
      }
      ;
      if (j instanceof JointSub) {
        return ps;
      }
      ;
      throw new Error("Failed pattern match at Internal.Rails (line 349, column 26 - line 352, column 23): " + [j.constructor.name]);
    },
    getNewState: function(j) {
      return function(v) {
        if (j instanceof JointMain) {
          return {
            newjoint: JointEnter.value,
            newstate: v,
            shape: reverseShapes(append3(r_)(r0))
          };
        }
        ;
        if (j instanceof JointSub) {
          return {
            newjoint: JointEnter.value,
            newstate: v,
            shape: reverseShapes(append3(r_)(r1))
          };
        }
        ;
        if (j instanceof JointEnter) {
          if (v.auto) {
            if (v.turnout) {
              return {
                newjoint: JointMain.value,
                newstate: {
                  turnout: false,
                  auto: true
                },
                shape: append3(r_)(r0)
              };
            }
            ;
            return {
              newjoint: JointSub.value,
              newstate: {
                turnout: true,
                auto: true
              },
              shape: append3(r_)(r1)
            };
          }
          ;
          if (v.turnout) {
            return {
              newjoint: JointSub.value,
              newstate: v,
              shape: append3(r_)(r1)
            };
          }
          ;
          return {
            newjoint: JointMain.value,
            newstate: v,
            shape: append3(r_)(r0)
          };
        }
        ;
        throw new Error("Failed pattern match at Internal.Rails (line 353, column 38 - line 365, column 79): " + [j.constructor.name]);
      };
    }
  });
}();
var autoTurnOutRPlusRail = /* @__PURE__ */ flipRail(autoTurnOutLPlusRail);

// output/Main/index.js
var eq4 = /* @__PURE__ */ eq(eqNumber);
var unwrap5 = /* @__PURE__ */ unwrap();
var eq13 = /* @__PURE__ */ eq(eqAngle);
var notEq3 = /* @__PURE__ */ notEq(eqAngle);
var map7 = /* @__PURE__ */ map(functorArray);
var map15 = /* @__PURE__ */ map(functorMaybe);
var identity4 = /* @__PURE__ */ identity(categoryFn);
var map23 = /* @__PURE__ */ map(functorFn);
var max3 = /* @__PURE__ */ max(ordInt);
var sort2 = /* @__PURE__ */ sort(ordInt);
var bind3 = /* @__PURE__ */ bind(bindArray);
var pure3 = /* @__PURE__ */ pure(applicativeArray);
var splitSize = function(shape) {
  var $45 = on(eq4)(function(p) {
    return unwrap5(unwrap5(p).coord).z;
  })(unwrap5(shape).start)(unwrap5(shape).end) && eq13(reverseAngle(unwrap5(unwrap5(shape).start).angle))(unwrap5(unwrap5(shape).end).angle);
  if ($45) {
    return 1;
  }
  ;
  return 5;
};
var shapeToData = function(v) {
  var a2 = toRadian(v.end.angle);
  var a1 = toRadian(reverseAngle(v.start.angle));
  var $49 = eq13(reverseAngle(v.start.angle))(v.end.angle);
  if ($49) {
    return unsafeToForeign({
      type: "straight",
      angle: a1,
      start: v.start,
      end: v.end
    });
  }
  ;
  var _r = (cos(a1) * (unwrap5(v.end.coord).x - unwrap5(v.start.coord).x) + sin(a1) * (unwrap5(v.end.coord).y - unwrap5(v.start.coord).y)) / sin(a2 - a1);
  var a1$prime = a1 - pi / 2 * sign(_r);
  var a2$prime = a2 - pi / 2 * sign(_r);
  var r = abs(_r);
  var x0 = unwrap5(v.start.coord).x - r * cos(a1$prime);
  var y0 = unwrap5(v.start.coord).y - r * sin(a1$prime);
  return unsafeToForeign({
    type: "arc",
    center: {
      x: x0,
      y: y0,
      z: (unwrap5(v.start.coord).z + unwrap5(v.end.coord).z) / 2
    },
    radius: r,
    startangle: a1$prime,
    endangle: a1$prime
  });
};
var rails = [autoTurnOutLPlusRail, curveLRail, slopeRail, slopeCurveLRail, straightRail, halfRail, quarterRail, converterRail, turnOutLPlusRail, outerCurveLRail, toDoubleLPlusRail, scissorsRail, doubleToWideLRail, doubleTurnoutLPlusRail, longRail];
var isArc = function(shape) {
  return notEq3(reverseAngle(unwrap5(unwrap5(shape).start).angle))(unwrap5(unwrap5(shape).end).angle);
};
var encodeRoute = function(v) {
  return {
    nodeid: v.nodeid,
    jointid: v.jointid,
    railinstance: unwrap5(v.railinstance).instanceid,
    shapes: v.shapes,
    length: v.length
  };
};
var encodeTrainset = function(v) {
  return {
    types: v.types,
    route: map7(encodeRoute)(v.route),
    distanceToNext: v.distanceToNext,
    distanceFromOldest: v.distanceFromOldest,
    speed: v.speed,
    trainid: v.trainid
  };
};
var encodeRail = function(v) {
  return {
    name: v.name,
    flipped: v.flipped,
    opposed: v.opposed
  };
};
var encodeRailNode = function(v) {
  return {
    nodeid: v.nodeid,
    rail: encodeRail(v.rail),
    state: v.state,
    connections: v.connections
  };
};
var encodeRailInstance = function(v) {
  return {
    node: encodeRailNode(v.node),
    instanceid: v.instanceid,
    pos: v.pos
  };
};
var encodeLayout = function(v) {
  return {
    rails: map7(encodeRailInstance)(v.rails),
    trains: map7(encodeTrainset)(v.trains),
    version: v.version
  };
};
var defaultLayout = /* @__PURE__ */ function() {
  var node = {
    nodeid: 0,
    state: 0,
    rail: straightRail,
    connections: []
  };
  var rinst = {
    node,
    instanceid: 0,
    pos: reversePos(poszero)
  };
  var jrel = function(i) {
    return unwrap5(unwrap5(node.rail).getJointPos(i));
  };
  return function(l) {
    return foldl2(function(l$prime) {
      return function(j) {
        return addJoint(l$prime)(jrel(j))(node.nodeid)(j);
      };
    })(l)(unwrap5(node.rail).getJoints);
  }({
    instancecount: 1,
    traincount: 0,
    rails: [rinst],
    trains: [],
    jointData: saEmpty,
    version: 1
  });
}();
var decodeRoute = function(rs) {
  return function(v) {
    var defaultnode = {
      nodeid: 0,
      state: 0,
      rail: straightRail,
      connections: []
    };
    var rinst = {
      node: defaultnode,
      instanceid: 0,
      pos: reversePos(poszero)
    };
    return {
      nodeid: v.nodeid,
      jointid: v.jointid,
      railinstance: fromMaybe(rinst)(index(rs)(v.railinstance)),
      shapes: v.shapes,
      length: v.length
    };
  };
};
var decodeTrainset = function(rs) {
  return function(v) {
    return {
      types: v.types,
      route: map7(decodeRoute(rs))(v.route),
      distanceToNext: v.distanceToNext,
      distanceFromOldest: v.distanceFromOldest,
      speed: v.speed,
      trainid: v.trainid
    };
  };
};
var decodeRail = function(v) {
  return map15(function() {
    var $120 = function() {
      if (v.opposed) {
        return opposeRail;
      }
      ;
      return identity4;
    }();
    var $121 = function() {
      if (v.flipped) {
        return flipRail;
      }
      ;
      return identity4;
    }();
    return function($122) {
      return $120($121($122));
    };
  }())(find2(function(v1) {
    return v1.name === v.name;
  })(rails));
};
var decodeRailNode = function(v) {
  return map15(map23(RailNode)(function(v1) {
    return {
      nodeid: v.nodeid,
      rail: v1,
      state: v.state,
      connections: v.connections
    };
  }))(decodeRail(v.rail));
};
var decodeRailInstance = function(v) {
  return map15(map23(RailInstance)(function(v1) {
    return {
      node: v1,
      instanceid: v.instanceid,
      pos: v.pos
    };
  }))(decodeRailNode(v.node));
};
var decodeLayout$prime = function(v) {
  var rawrails = map7(decodeRailInstance)(v.rails);
  var rs = catMaybes(rawrails);
  var ts = map7(decodeTrainset(rs))(v.trains);
  var l0 = {
    jointData: saEmpty,
    rails: map7(function(v12) {
      return {
        node: v12.node,
        instanceid: unwrap5(v12.node).nodeid,
        pos: v12.pos
      };
    })(rs),
    trains: ts,
    instancecount: length(rs),
    traincount: 1 + foldl2(function(x) {
      return function(v12) {
        return max3(x)(v12.trainid);
      };
    })(-1 | 0)(ts) | 0,
    version: v.version
  };
  var deleted = function() {
    var $123 = map7(function(r) {
      return r.index;
    });
    var $124 = filter(function(r) {
      return r.isdeleted;
    });
    return function($125) {
      return $123($124($125));
    };
  }()(mapWithIndex(function(i) {
    return function(r) {
      return {
        index: i,
        isdeleted: isNothing(r)
      };
    };
  })(rawrails));
  var defaultnode = {
    nodeid: 0,
    state: 0,
    rail: straightRail,
    connections: []
  };
  var rinst = {
    node: defaultnode,
    instanceid: 0,
    pos: reversePos(poszero)
  };
  var v1 = foldl2(removeRail)(l0)(reverse(sort2(deleted)));
  var joints = bind3(v1.rails)(function(v22) {
    var nodeid = unwrap5(v22.node).nodeid;
    return bind3(unwrap5(unwrap5(v22.node).rail).getJoints)(function(jointid) {
      return bind3(maybe([])(pure3)(getJointAbsPos(v1)(nodeid)(jointid)))(function(pos) {
        return pure3({
          nodeid,
          jointid,
          pos
        });
      });
    });
  });
  var v2 = foldl2(function(l) {
    return function(j) {
      return addJoint(l)(j.pos)(j.nodeid)(j.jointid);
    };
  })(v1)(joints);
  var $111 = length(v2.rails) === 0;
  if ($111) {
    return defaultLayout;
  }
  ;
  return v2;
};
var decodeLayout = function(v) {
  return decodeLayout$prime({
    rails: map7(unsafeFromForeign)(v.rails),
    trains: function() {
      var $116 = isArray(v.trains);
      if ($116) {
        return unsafeFromForeign(v.trains);
      }
      ;
      return [];
    }(),
    version: v.version
  });
};
export {
  CarType,
  Coord,
  DrawAdditional,
  DrawInfo,
  DrawRail,
  JointBegin,
  JointData,
  JointEnd,
  JointEnter,
  JointInnerBegin,
  JointInnerEnd,
  JointInnerEnter,
  JointInnerMain,
  JointInnerSub,
  JointMain,
  JointOuterBegin,
  JointOuterEnd,
  JointOuterEnter,
  JointOuterMain,
  JointOuterSub,
  JointSub,
  Layout,
  Pos,
  RailGen,
  RailInstance,
  RailNode,
  RailShape,
  RelPos,
  Route,
  SectionArray,
  StateAP,
  StateCO,
  StateDP,
  StatePoint,
  StateSolid,
  Trainset,
  TrainsetDrawInfo,
  absDrawInfo,
  absParts,
  absShape,
  addJoint,
  addRail,
  addTrainset,
  angle8,
  anglen,
  autoAdd,
  autoTurnOutLPlusRail,
  autoTurnOutRPlusRail,
  blue,
  blueRail,
  canJoin,
  convertRelPos,
  converterRail,
  curveLRail,
  curveRRail,
  decodeLayout,
  defaultLayout,
  doubleToWideLRail,
  doubleToWideRRail,
  doubleTurnoutLPlusRail,
  doubleTurnoutRPlusRail,
  encodeLayout,
  flipRail,
  fromRadian,
  getDividingPoint_rel,
  getJointAbsPos,
  getJoints,
  getNewRailPos,
  gray,
  grayRail,
  halfRail,
  isArc,
  layoutDrawInfo,
  layoutTick,
  longRail,
  opposeRail,
  outerCurveLRail,
  outerCurveRRail,
  partLength,
  poszero,
  quarterRail,
  railShape,
  removeRail,
  reverseAngle,
  reversePos,
  reverseShapes,
  saEmpty,
  scissorsRail,
  serialAll,
  shapeLength,
  shapeToData,
  shiftRailIndex,
  slipShapes,
  slopeCurveLRail,
  slopeCurveRRail,
  slopeRail,
  splitSize,
  straightRail,
  toAbsPos,
  toDoubleLPlusRail,
  toDoubleRPlusRail,
  toRadian,
  toRail,
  trainsetDrawInfo,
  trainsetLength,
  turnOutLPlusRail,
  turnOutRPlusRail
};
