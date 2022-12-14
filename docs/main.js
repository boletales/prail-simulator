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

// output/Data.Unit/foreign.js
var unit = void 0;

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
var $$void = function(dictFunctor) {
  return map(dictFunctor)($$const(unit));
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
var when = function(dictApplicative) {
  var pure1 = pure(dictApplicative);
  return function(v) {
    return function(v1) {
      if (v) {
        return v1;
      }
      ;
      if (!v) {
        return pure1(unit);
      }
      ;
      throw new Error("Failed pattern match at Control.Applicative (line 63, column 1 - line 63, column 63): " + [v.constructor.name, v1.constructor.name]);
    };
  };
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
var discard = function(dict) {
  return dict.discard;
};
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
var discardUnit = {
  discard: function(dictBind) {
    return bind(dictBind);
  }
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
var findLastIndexImpl = function(just) {
  return function(nothing) {
    return function(f) {
      return function(xs) {
        for (var i = xs.length - 1; i >= 0; i--) {
          if (f(xs[i]))
            return just(i);
        }
        return nothing;
      };
    };
  };
};
var _insertAt = function(just) {
  return function(nothing) {
    return function(i) {
      return function(a) {
        return function(l) {
          if (i < 0 || i > l.length)
            return nothing;
          var l1 = l.slice();
          l1.splice(i, 0, a);
          return just(l1);
        };
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
var any = function(p) {
  return function(xs) {
    var len = xs.length;
    for (var i = 0; i < len; i++) {
      if (p(xs[i]))
        return true;
    }
    return false;
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

// output/Control.Monad/index.js
var ap = function(dictMonad) {
  var bind4 = bind(dictMonad.Bind1());
  var pure4 = pure(dictMonad.Applicative0());
  return function(f) {
    return function(a) {
      return bind4(f)(function(f$prime) {
        return bind4(a)(function(a$prime) {
          return pure4(f$prime(a$prime));
        });
      });
    };
  };
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
var eqOrdering = {
  eq: function(v) {
    return function(v1) {
      if (v instanceof LT && v1 instanceof LT) {
        return true;
      }
      ;
      if (v instanceof GT && v1 instanceof GT) {
        return true;
      }
      ;
      if (v instanceof EQ && v1 instanceof EQ) {
        return true;
      }
      ;
      return false;
    };
  }
};

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
var comparing = function(dictOrd) {
  var compare3 = compare(dictOrd);
  return function(f) {
    return function(x) {
      return function(y) {
        return compare3(f(x))(f(y));
      };
    };
  };
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

// output/Data.Show/foreign.js
var showIntImpl = function(n) {
  return n.toString();
};

// output/Data.Show/index.js
var showInt = {
  show: showIntImpl
};
var show = function(dict) {
  return dict.show;
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
var genericMaybe = {
  to: function(x) {
    if (x instanceof Inl) {
      return Nothing.value;
    }
    ;
    if (x instanceof Inr) {
      return new Just(x.value0);
    }
    ;
    throw new Error("Failed pattern match at Data.Maybe (line 227, column 1 - line 227, column 52): " + [x.constructor.name]);
  },
  from: function(x) {
    if (x instanceof Nothing) {
      return new Inl(NoArguments.value);
    }
    ;
    if (x instanceof Just) {
      return new Inr(x.value0);
    }
    ;
    throw new Error("Failed pattern match at Data.Maybe (line 227, column 1 - line 227, column 52): " + [x.constructor.name]);
  }
};
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
var fromJust = function() {
  return function(v) {
    if (v instanceof Just) {
      return v.value0;
    }
    ;
    throw new Error("Failed pattern match at Data.Maybe (line 288, column 1 - line 288, column 46): " + [v.constructor.name]);
  };
};
var eqMaybe = function(dictEq) {
  var eq5 = eq(dictEq);
  return {
    eq: function(x) {
      return function(y) {
        if (x instanceof Nothing && y instanceof Nothing) {
          return true;
        }
        ;
        if (x instanceof Just && y instanceof Just) {
          return eq5(x.value0)(y.value0);
        }
        ;
        return false;
      };
    }
  };
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

// output/Control.Monad.ST.Internal/foreign.js
var map_ = function(f) {
  return function(a) {
    return function() {
      return f(a());
    };
  };
};
var pure_ = function(a) {
  return function() {
    return a;
  };
};
var bind_ = function(a) {
  return function(f) {
    return function() {
      return f(a())();
    };
  };
};
var foreach = function(as) {
  return function(f) {
    return function() {
      for (var i = 0, l = as.length; i < l; i++) {
        f(as[i])();
      }
    };
  };
};

// output/Control.Monad.ST.Internal/index.js
var $runtime_lazy = function(name2, moduleName, init3) {
  var state2 = 0;
  var val;
  return function(lineNumber) {
    if (state2 === 2)
      return val;
    if (state2 === 1)
      throw new ReferenceError(name2 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
    state2 = 1;
    val = init3();
    state2 = 2;
    return val;
  };
};
var functorST = {
  map: map_
};
var monadST = {
  Applicative0: function() {
    return applicativeST;
  },
  Bind1: function() {
    return bindST;
  }
};
var bindST = {
  bind: bind_,
  Apply0: function() {
    return $lazy_applyST(0);
  }
};
var applicativeST = {
  pure: pure_,
  Apply0: function() {
    return $lazy_applyST(0);
  }
};
var $lazy_applyST = /* @__PURE__ */ $runtime_lazy("applyST", "Control.Monad.ST.Internal", function() {
  return {
    apply: ap(monadST),
    Functor0: function() {
      return functorST;
    }
  };
});

// output/Data.Array.ST/foreign.js
var pushAll = function(as) {
  return function(xs) {
    return function() {
      return xs.push.apply(xs, as);
    };
  };
};
var unsafeFreeze = function(xs) {
  return function() {
    return xs;
  };
};
var unsafeThaw = function(xs) {
  return function() {
    return xs;
  };
};
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

// output/Data.Array.ST/index.js
var push = function(a) {
  return pushAll([a]);
};

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
var tt = function(dict) {
  return dict.tt;
};
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

// output/Data.Tuple/index.js
var Tuple = /* @__PURE__ */ function() {
  function Tuple2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  Tuple2.create = function(value0) {
    return function(value1) {
      return new Tuple2(value0, value1);
    };
  };
  return Tuple2;
}();
var snd = function(v) {
  return v.value1;
};
var fst = function(v) {
  return v.value0;
};

// output/Data.Monoid.Conj/index.js
var Conj = function(x) {
  return x;
};
var semigroupConj = function(dictHeytingAlgebra) {
  var conj3 = conj(dictHeytingAlgebra);
  return {
    append: function(v) {
      return function(v1) {
        return conj3(v)(v1);
      };
    }
  };
};
var monoidConj = function(dictHeytingAlgebra) {
  var semigroupConj1 = semigroupConj(dictHeytingAlgebra);
  return {
    mempty: tt(dictHeytingAlgebra),
    Semigroup0: function() {
      return semigroupConj1;
    }
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
    return function(map9) {
      return function(pure4) {
        return function(f) {
          return function(array) {
            function go(bot, top3) {
              switch (top3 - bot) {
                case 0:
                  return pure4([]);
                case 1:
                  return map9(array1)(f(array[bot]));
                case 2:
                  return apply6(map9(array2)(f(array[bot])))(f(array[bot + 1]));
                case 3:
                  return apply6(apply6(map9(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                default:
                  var pivot = bot + Math.floor((top3 - bot) / 4) * 2;
                  return apply6(map9(concat2)(go(bot, pivot)))(go(pivot, top3));
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
var map3 = /* @__PURE__ */ map(functorST);
var when2 = /* @__PURE__ */ when(applicativeST);
var $$void2 = /* @__PURE__ */ $$void(functorST);
var apply2 = /* @__PURE__ */ apply(applyMaybe);
var map1 = /* @__PURE__ */ map(functorMaybe);
var map22 = /* @__PURE__ */ map(functorArray);
var fromJust2 = /* @__PURE__ */ fromJust();
var notEq2 = /* @__PURE__ */ notEq(eqOrdering);
var eq12 = /* @__PURE__ */ eq(eqOrdering);
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
var sortWith = function(dictOrd) {
  var comparing2 = comparing(dictOrd);
  return function(f) {
    return sortBy(comparing2(f));
  };
};
var sortWith1 = /* @__PURE__ */ sortWith(ordInt);
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
var insertAt = /* @__PURE__ */ function() {
  return _insertAt(Just.create)(Nothing.value);
}();
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
var nubBy = function(comp) {
  return function(xs) {
    var indexedAndSorted = sortBy(function(x) {
      return function(y) {
        return comp(snd(x))(snd(y));
      };
    })(mapWithIndex(Tuple.create)(xs));
    var v = head(indexedAndSorted);
    if (v instanceof Nothing) {
      return [];
    }
    ;
    if (v instanceof Just) {
      return map22(snd)(sortWith1(fst)(function __do() {
        var result = unsafeThaw(singleton2(v.value0))();
        foreach(indexedAndSorted)(function(v1) {
          return function __do2() {
            var lst = map3(function() {
              var $184 = function($186) {
                return fromJust2(last($186));
              };
              return function($185) {
                return snd($184($185));
              };
            }())(unsafeFreeze(result))();
            return when2(notEq2(comp(lst)(v1.value1))(EQ.value))($$void2(push(v1)(result)))();
          };
        })();
        return unsafeFreeze(result)();
      }()));
    }
    ;
    throw new Error("Failed pattern match at Data.Array (line 1085, column 17 - line 1093, column 29): " + [v.constructor.name]);
  };
};
var nub = function(dictOrd) {
  return nubBy(compare(dictOrd));
};
var foldl2 = /* @__PURE__ */ foldl(foldableArray);
var findLastIndex = /* @__PURE__ */ function() {
  return findLastIndexImpl(Just.create)(Nothing.value);
}();
var insertBy = function(cmp) {
  return function(x) {
    return function(ys) {
      var i = maybe(0)(function(v) {
        return v + 1 | 0;
      })(findLastIndex(function(y) {
        return eq12(cmp(x)(y))(GT.value);
      })(ys));
      return fromJust2(insertAt(i)(x)(ys));
    };
  };
};
var insert = function(dictOrd) {
  return insertBy(compare(dictOrd));
};
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

// output/Data.FunctorWithIndex/foreign.js
var mapWithIndexArray = function(f) {
  return function(xs) {
    var l = xs.length;
    var result = Array(l);
    for (var i = 0; i < l; i++) {
      result[i] = f(i)(xs[i]);
    }
    return result;
  };
};

// output/Data.FunctorWithIndex/index.js
var mapWithIndex2 = function(dict) {
  return dict.mapWithIndex;
};
var functorWithIndexArray = {
  mapWithIndex: mapWithIndexArray,
  Functor0: function() {
    return functorArray;
  }
};

// output/Data.FoldableWithIndex/index.js
var foldr8 = /* @__PURE__ */ foldr(foldableArray);
var mapWithIndex3 = /* @__PURE__ */ mapWithIndex2(functorWithIndexArray);
var foldl8 = /* @__PURE__ */ foldl(foldableArray);
var unwrap2 = /* @__PURE__ */ unwrap();
var foldrWithIndex = function(dict) {
  return dict.foldrWithIndex;
};
var foldMapWithIndexDefaultR = function(dictFoldableWithIndex) {
  var foldrWithIndex1 = foldrWithIndex(dictFoldableWithIndex);
  return function(dictMonoid) {
    var append4 = append(dictMonoid.Semigroup0());
    var mempty2 = mempty(dictMonoid);
    return function(f) {
      return foldrWithIndex1(function(i) {
        return function(x) {
          return function(acc) {
            return append4(f(i)(x))(acc);
          };
        };
      })(mempty2);
    };
  };
};
var foldableWithIndexArray = {
  foldrWithIndex: function(f) {
    return function(z) {
      var $291 = foldr8(function(v) {
        return function(y) {
          return f(v.value0)(v.value1)(y);
        };
      })(z);
      var $292 = mapWithIndex3(Tuple.create);
      return function($293) {
        return $291($292($293));
      };
    };
  },
  foldlWithIndex: function(f) {
    return function(z) {
      var $294 = foldl8(function(y) {
        return function(v) {
          return f(v.value0)(y)(v.value1);
        };
      })(z);
      var $295 = mapWithIndex3(Tuple.create);
      return function($296) {
        return $294($295($296));
      };
    };
  },
  foldMapWithIndex: function(dictMonoid) {
    return foldMapWithIndexDefaultR(foldableWithIndexArray)(dictMonoid);
  },
  Foldable0: function() {
    return foldableArray;
  }
};
var foldMapWithIndex = function(dict) {
  return dict.foldMapWithIndex;
};
var allWithIndex = function(dictFoldableWithIndex) {
  var foldMapWithIndex1 = foldMapWithIndex(dictFoldableWithIndex);
  return function(dictHeytingAlgebra) {
    var foldMapWithIndex2 = foldMapWithIndex1(monoidConj(dictHeytingAlgebra));
    return function(t) {
      var $321 = foldMapWithIndex2(function(i) {
        var $323 = t(i);
        return function($324) {
          return Conj($323($324));
        };
      });
      return function($322) {
        return unwrap2($321($322));
      };
    };
  };
};

// output/Foreign/index.js
var unsafeToForeign = unsafeCoerce2;
var unsafeFromForeign = unsafeCoerce2;

// output/Internal.Types.Pos/index.js
var sub2 = /* @__PURE__ */ sub(ringNumber);
var add2 = /* @__PURE__ */ add(semiringNumber);
var over22 = /* @__PURE__ */ over2()();
var unwrap3 = /* @__PURE__ */ unwrap();
var eq3 = /* @__PURE__ */ eq(eqNumber);
var notEq3 = /* @__PURE__ */ notEq(eqBoolean);
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
var eq13 = /* @__PURE__ */ eq(eqAngle);
var canJoin = function(p1) {
  return function(p2) {
    return eq13(reverseAngle(unwrap3(p1).angle))(unwrap3(p2).angle) && (planeDistance(p1)(p2) < 0.05 && (on(eq3)(function(v) {
      return v.coord.z;
    })(p1)(p2) && on(notEq3)(function(v) {
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
        var $76 = eq13(reverseAngle(v.angle))(v1.angle);
        if ($76) {
          return {
            angle: v1.angle,
            isPlus: v1.isPlus,
            coord: {
              x: divp(unwrap3(v.coord).x)(unwrap3(v1.coord).x) + width * sin(a1),
              y: divp(unwrap3(v.coord).y)(unwrap3(v1.coord).y) - width * cos(a1),
              z: divpcos(unwrap3(v.coord).z)(unwrap3(v1.coord).z)
            }
          };
        }
        ;
        var _r = (cos(a1) * (unwrap3(v1.coord).x - unwrap3(v.coord).x) + sin(a1) * (unwrap3(v1.coord).y - unwrap3(v.coord).y)) / sin(a2 - a1);
        var a1$prime = a1 - pi / 2 * sign(_r);
        var a2$prime = a2 - pi / 2 * sign(_r);
        var at$prime = at - pi / 2 * sign(_r);
        var r = abs(_r);
        var x0 = unwrap3(v.coord).x - r * cos(a1$prime);
        var y0 = unwrap3(v.coord).y - r * sin(a1$prime);
        return {
          angle: fromRadian(at),
          isPlus: v1.isPlus,
          coord: {
            x: x0 + r * cos(at$prime) + width * sin(at),
            y: y0 + r * sin(at$prime) - width * cos(at),
            z: divp(unwrap3(v.coord).z)(unwrap3(v1.coord).z)
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
      var $79 = eq13(reverseAngle(v.angle))(v1.angle);
      if ($79) {
        return planeDistance(v)(v1);
      }
      ;
      return abs((cos(a1) * (unwrap3(v1.coord).x - unwrap3(v.coord).x) + sin(a1) * (unwrap3(v1.coord).y - unwrap3(v.coord).y)) / sin(a2 - a1) * toRadian(angleSub(v1.angle)(reverseAngle(v.angle))));
    }();
    return sqrt(pow(unwrap3(v1.coord).z - unwrap3(v.coord).z)(2) + pow(pd)(2));
  };
};
var angle8 = /* @__PURE__ */ anglen(8);

// output/Record/index.js
var insert2 = function(dictIsSymbol) {
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
var map4 = /* @__PURE__ */ map(functorArray);
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
  return catMaybes(map4(fromSerial(dictIntSerialize))(range(0)(lengthSerial(dictIntSerialize)($$Proxy.value) - 1 | 0)));
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
    var insert4 = insert2(dictIsSymbol)()();
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
                      return apply3(map12(insert4($$Proxy.value))(fromSerial1(mod2(i)(l1))))(rlfromSerial1($$Proxy.value)(div2(i)(l1)));
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
var map5 = /* @__PURE__ */ map(functorArray);
var unwrap4 = /* @__PURE__ */ unwrap();
var negate2 = /* @__PURE__ */ negate(ringNumber);
var over3 = /* @__PURE__ */ over()();
var wrap2 = /* @__PURE__ */ wrap();
var map13 = /* @__PURE__ */ map(functorMaybe);
var apply4 = /* @__PURE__ */ apply(applyMaybe);
var intSerialize2 = /* @__PURE__ */ intSerialize(genericMaybe);
var intSerializeSum2 = /* @__PURE__ */ intSerializeSum(/* @__PURE__ */ intSerializeConstructor(intSerializeNoArguments));
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
  var $133 = map5(function(v) {
    return {
      start: v.end,
      end: v.start,
      length: v.length
    };
  });
  return function($134) {
    return $133(reverse($134));
  };
}();
var railShape = function() {
  return function(v) {
    return {
      start: v.start,
      end: v.end,
      length: partLength(unwrap4(v.start))(unwrap4(v.end))
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
    getJointPos: function($135) {
      return opposeRelPos(v.getJointPos($135));
    },
    getNewState: v.getNewState,
    getDrawInfo: function(x) {
      var v2 = v.getDrawInfo(x);
      return {
        rails: map5(opposeDrawRail)(v2.rails),
        additionals: map5(opposeAdditional)(v2.additionals)
      };
    },
    getRoute: v.getRoute,
    isLocked: v.isLocked,
    isBlocked: v.isBlocked,
    isSimple: v.isSimple
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
    getJointPos: function($136) {
      return flipRelPos(v.getJointPos($136));
    },
    getNewState: function(x) {
      return function(y) {
        return function(v2) {
          return {
            newstate: v2.newstate,
            newjoint: v2.newjoint,
            shape: map5(flipShape)(v2.shape)
          };
        }(v.getNewState(x)(y));
      };
    },
    getDrawInfo: function(x) {
      var v2 = v.getDrawInfo(x);
      return {
        rails: map5(flipDrawRail)(v2.rails),
        additionals: map5(flipAdditional)(v2.additionals)
      };
    },
    getRoute: v.getRoute,
    isLocked: v.isLocked,
    isBlocked: v.isBlocked,
    isSimple: v.isSimple
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
      var v1 = unwrap4(getDividingPoint_rel(unwrap4(v.start))(unwrap4(v.end))(0)(0.5));
      var $110 = {};
      for (var $111 in v1) {
        if ({}.hasOwnProperty.call(v1, $111)) {
          $110[$111] = v1[$111];
        }
        ;
      }
      ;
      $110.angle = function() {
        var c2 = unwrap4(unwrap4(unwrap4(v.end)).coord);
        var c1 = unwrap4(unwrap4(unwrap4(v.start)).coord);
        var dx = c2.x - c1.x;
        var dy = c2.y - c1.y;
        var a2 = toRadian(unwrap4(unwrap4(v.end)).angle);
        return fromRadian(toRadian(unwrap4(unwrap4(v.end)).angle) + calcMidAngle(cos(a2) * dx + sin(a2) * dy)(cos(a2) * dy - sin(a2) * dx));
      }();
      return $110;
    }()));
    return [railShape1({
      start: v.start,
      end: pp
    }), railShape1({
      start: wrap2(reversePos(unwrap4(pp))),
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
    var toSerial22 = toSerial(intSerialize2(intSerializeSum2(intSerializeConstructor(intSerializeArgument(dictIntSerialize1)))));
    return function(v) {
      return {
        name: v.name,
        flipped: v.flipped,
        opposed: v.opposed,
        defaultState: toSerial1(v.defaultState),
        getJoints: map5(toSerial2)(v.getJoints),
        getStates: map5(toSerial1)(v.getStates),
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
        },
        getRoute: function(s) {
          return function(f) {
            return function(t) {
              return map13(toSerial22)(apply4(apply4(map13(v.getRoute)(fromSerial1(s)))(fromSerial2(f)))(fromSerial2(t)));
            };
          };
        },
        isLocked: function(j) {
          return function(s) {
            return function(s$prime) {
              return fromMaybe(true)(apply4(apply4(map13(v.isLocked)(fromSerial2(j)))(fromSerial1(s)))(fromSerial1(s$prime)));
            };
          };
        },
        isBlocked: function(j) {
          return function(s) {
            return function(j$prime) {
              return fromMaybe(true)(apply4(apply4(map13(v.isBlocked)(fromSerial2(j)))(fromSerial1(s)))(fromSerial2(j$prime)));
            };
          };
        },
        isSimple: v.isSimple
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
      rails: map5(absParts(p))(v.rails),
      additionals: map5(absAdditional(p))(v.additionals)
    };
  };
};

// output/Internal.Layout/index.js
var map6 = /* @__PURE__ */ map(functorArray);
var append2 = /* @__PURE__ */ append(semigroupArray);
var unwrap5 = /* @__PURE__ */ unwrap();
var bindFlipped2 = /* @__PURE__ */ bindFlipped(bindArray);
var conj2 = /* @__PURE__ */ conj(heytingAlgebraBoolean);
var allWithIndex2 = /* @__PURE__ */ allWithIndex(foldableWithIndexArray)(heytingAlgebraBoolean);
var map14 = /* @__PURE__ */ map(functorMaybe);
var bindFlipped1 = /* @__PURE__ */ bindFlipped(bindMaybe);
var bind2 = /* @__PURE__ */ bind(bindMaybe);
var identity4 = /* @__PURE__ */ identity(categoryFn);
var nub3 = /* @__PURE__ */ nub(ordInt);
var elem3 = /* @__PURE__ */ elem2(eqInt);
var insert3 = /* @__PURE__ */ insert(ordInt);
var sum2 = /* @__PURE__ */ sum(foldableArray)(semiringNumber);
var eq14 = /* @__PURE__ */ eq(/* @__PURE__ */ eqMaybe(eqInt));
var join2 = /* @__PURE__ */ join(bindMaybe);
var join1 = /* @__PURE__ */ join(bindArray);
var apply5 = /* @__PURE__ */ apply(applyArray);
var composeKleisli2 = /* @__PURE__ */ composeKleisli(bindMaybe);
var foldM3 = /* @__PURE__ */ foldM(foldableArray)(monadMaybe);
var apply1 = /* @__PURE__ */ apply(applyMaybe);
var pure2 = /* @__PURE__ */ pure(applicativeMaybe);
var show2 = /* @__PURE__ */ show(showInt);
var discard2 = /* @__PURE__ */ discard(discardUnit)(bindMaybe);
var SignalRoute = function(x) {
  return x;
};
var Signal = function(x) {
  return x;
};
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
        arraydata: map6(f)(v.arraydata),
        head: v.head,
        end: v.end
      };
    };
  }
};
var map23 = /* @__PURE__ */ map(functorSectionArray);
var wheelWidth = /* @__PURE__ */ function() {
  return 3.4 / 21.4;
}();
var wheelMargin = /* @__PURE__ */ function() {
  return 2 / 21.4;
}();
var updateTraffic = function(v) {
  return {
    version: v.version,
    rails: v.rails,
    trains: v.trains,
    signalcolors: v.signalcolors,
    traffic: foldl2(function(traffic) {
      return function(v2) {
        return foldl2(function(traffic1) {
          return function(v3) {
            return fromMaybe(traffic1)(modifyAt(v3.nodeid)(function(d) {
              return fromMaybe(d)(modifyAt(v3.jointid)(function(v4) {
                return append2(v4)([v2.trainid]);
              })(d));
            })(traffic1));
          };
        })(traffic)(v2.route);
      };
    })(map6(function(v2) {
      return replicate(length(unwrap5(unwrap5(v2.node).rail).getJoints))([]);
    })(v.rails))(v.trains),
    instancecount: v.instancecount,
    traincount: v.traincount,
    updatecount: v.updatecount,
    jointData: v.jointData
  };
};
var updateRailInstance = function(v) {
  return function(j) {
    var v1 = unwrap5(unwrap5(v.node).rail).getNewState(j)(unwrap5(v.node).state);
    return {
      instance: {
        node: function() {
          var v3 = unwrap5(v.node);
          return {
            nodeid: v3.nodeid,
            rail: v3.rail,
            state: v1.newstate,
            connections: v3.connections
          };
        }(),
        instanceid: v.instanceid,
        signals: v.signals,
        wrongways: v.wrongways,
        pos: v.pos
      },
      newjoint: v1.newjoint,
      shapes: map6(absShape(v.pos))(v1.shape)
    };
  };
};
var signalStop = 0;
var signalReduce = 3;
var signalClear = 4;
var updateSignalColor = function(v) {
  var signals = bindFlipped2(function($405) {
    return function(v1) {
      return v1.signals;
    }(unwrap5($405));
  })(v.rails);
  var blockingData = map6(function(v1) {
    return {
      rail: v1,
      signals: map6(function(v2) {
        return {
          signal: v2,
          routes: map6(function(v3) {
            return {
              route: v3,
              routecond: all(function(v4) {
                return maybe(false)(function(v5) {
                  var nr = unwrap5(unwrap5(v5.node).rail).getNewState(v4.jointenter)(unwrap5(v5.node).state);
                  return nr.newjoint === v4.jointexit && nr.newstate === unwrap5(v5.node).state;
                })(index(v.rails)(v4.nodeid));
              })(v3.rails),
              clearcond: all(function(v4) {
                return maybe(false)(function(ri1) {
                  var state2 = unwrap5(unwrap5(ri1).node).state;
                  var rail = unwrap5(unwrap5(unwrap5(ri1).node).rail);
                  var v5 = index(v.traffic)(v4.nodeid);
                  if (v5 instanceof Just) {
                    return allWithIndex2(function(i) {
                      return function(t) {
                        var $213 = length(t) === 0;
                        if ($213) {
                          return true;
                        }
                        ;
                        return !rail.isBlocked(i)(state2)(v4.jointenter);
                      };
                    })(v5.value0);
                  }
                  ;
                  if (v5 instanceof Nothing) {
                    return false;
                  }
                  ;
                  throw new Error("Failed pattern match at Internal.Layout (line 577, column 42 - line 584, column 59): " + [v5.constructor.name]);
                })(index(v.rails)(v4.nodeid));
              })(v3.rails),
              directioncond: function() {
                var v4 = last(v3.rails);
                if (v4 instanceof Just) {
                  var go = function($copy_nid) {
                    return function($copy_jid) {
                      var $tco_var_nid = $copy_nid;
                      var $tco_done = false;
                      var $tco_result;
                      function $tco_loop(nid, jid) {
                        var v5 = index(v.rails)(nid);
                        if (v5 instanceof Nothing) {
                          $tco_done = true;
                          return true;
                        }
                        ;
                        if (v5 instanceof Just) {
                          var $220 = unwrap5(unwrap5(unwrap5(v5.value0).node).rail).isSimple;
                          if ($220) {
                            var jidexit = updateRailInstance(v5.value0)(jid).newjoint;
                            var v6 = map14(length)(bindFlipped1(function(v72) {
                              return index(v72)(jidexit);
                            })(index(v.traffic)(nid)));
                            if (v6 instanceof Just && v6.value0 === 0) {
                              var v7 = find2(function(c) {
                                return c.from === jidexit;
                              })(unwrap5(unwrap5(v5.value0).node).connections);
                              if (v7 instanceof Nothing) {
                                $tco_done = true;
                                return true;
                              }
                              ;
                              if (v7 instanceof Just) {
                                $tco_var_nid = v7.value0.nodeid;
                                $copy_jid = v7.value0.jointid;
                                return;
                              }
                              ;
                              throw new Error("Failed pattern match at Internal.Layout (line 598, column 45 - line 600, column 90): " + [v7.constructor.name]);
                            }
                            ;
                            $tco_done = true;
                            return false;
                          }
                          ;
                          $tco_done = true;
                          return true;
                        }
                        ;
                        throw new Error("Failed pattern match at Internal.Layout (line 590, column 31 - line 602, column 44): " + [v5.constructor.name]);
                      }
                      ;
                      while (!$tco_done) {
                        $tco_result = $tco_loop($tco_var_nid, $copy_jid);
                      }
                      ;
                      return $tco_result;
                    };
                  };
                  return go(v4.value0.nodeid)(v4.value0.jointenter);
                }
                ;
                if (v4 instanceof Nothing) {
                  return false;
                }
                ;
                throw new Error("Failed pattern match at Internal.Layout (line 587, column 21 - line 604, column 39): " + [v4.constructor.name]);
              }()
            };
          })(v2.routes)
        };
      })(v1.signals)
    };
  })(v.rails);
  var filtered = map6(function(rbd) {
    return map6(function(bd) {
      return filter(function(d) {
        return d.routecond;
      })(bd.routes);
    })(rbd.signals);
  })(blockingData);
  var colors = map6(function(rbd) {
    return {
      node: rbd.rail.node,
      instanceid: rbd.rail.instanceid,
      signals: map6(function(bd) {
        var v2 = unwrap5(bd.signal);
        return {
          signalname: v2.signalname,
          nodeid: v2.nodeid,
          jointid: v2.jointid,
          routes: v2.routes,
          colors: v2.colors,
          indication: map6(function(d) {
            var $232 = d.routecond && (d.clearcond && d.directioncond);
            if ($232) {
              var go = function($copy_n) {
                return function($copy_v3) {
                  var $tco_var_n = $copy_n;
                  var $tco_done1 = false;
                  var $tco_result;
                  function $tco_loop(n, v3) {
                    var $235 = n >= length(unwrap5(bd.signal).colors);
                    if ($235) {
                      $tco_done1 = true;
                      return signalClear;
                    }
                    ;
                    var v4 = bind2(index(filtered)(v3.nodeid))(function(v52) {
                      return index(v52)(v3.jointid);
                    });
                    if (v4 instanceof Just) {
                      var v5 = head(v4.value0);
                      if (v5 instanceof Just) {
                        var $238 = v5.value0.routecond && (v5.value0.clearcond && v5.value0.directioncond);
                        if ($238) {
                          $tco_var_n = n + 1 | 0;
                          $copy_v3 = unwrap5(v5.value0.route).nextsignal;
                          return;
                        }
                        ;
                        $tco_done1 = true;
                        return fromMaybe(signalClear)(index(unwrap5(bd.signal).colors)(n));
                      }
                      ;
                      if (v5 instanceof Nothing) {
                        $tco_done1 = true;
                        return fromMaybe(signalClear)(index(unwrap5(bd.signal).colors)(n));
                      }
                      ;
                      throw new Error("Failed pattern match at Internal.Layout (line 620, column 33 - line 625, column 100): " + [v5.constructor.name]);
                    }
                    ;
                    if (v4 instanceof Nothing) {
                      $tco_done1 = true;
                      return fromMaybe(signalClear)(index(unwrap5(bd.signal).colors)(n));
                    }
                    ;
                    throw new Error("Failed pattern match at Internal.Layout (line 618, column 29 - line 626, column 96): " + [v4.constructor.name]);
                  }
                  ;
                  while (!$tco_done1) {
                    $tco_result = $tco_loop($tco_var_n, $copy_v3);
                  }
                  ;
                  return $tco_result;
                };
              };
              return go(0)({
                nodeid: unwrap5(bd.signal).nodeid,
                jointid: unwrap5(bd.signal).jointid
              });
            }
            ;
            return signalStop;
          })(bd.routes)
        };
      })(rbd.signals),
      wrongways: rbd.rail.wrongways,
      pos: rbd.rail.pos
    };
  })(blockingData);
  return {
    version: v.version,
    rails: colors,
    trains: v.trains,
    signalcolors: v.signalcolors,
    traffic: v.traffic,
    instancecount: v.instancecount,
    traincount: v.traincount,
    updatecount: v.updatecount,
    jointData: v.jointData
  };
};
var signalCaution = 2;
var shiftIndex = function(deleted) {
  return function(i) {
    var $243 = i < deleted;
    if ($243) {
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
        var v2 = unwrap5(v.node);
        return {
          nodeid: shiftIndex(deleted)(unwrap5(v.node).nodeid),
          rail: v2.rail,
          state: v2.state,
          connections: map6(function(c) {
            return {
              nodeid: shiftIndex(deleted)(c.nodeid),
              from: c.from,
              jointid: c.jointid
            };
          })(unwrap5(v.node).connections)
        };
      }(),
      instanceid: v.instanceid,
      signals: v.signals,
      wrongways: v.wrongways,
      pos: v.pos
    };
  };
};
var searchmax = 30;
var updateSignalRoutes = function(v) {
  return {
    version: v.version,
    rails: map6(function(v2) {
      return {
        node: v2.node,
        instanceid: v2.instanceid,
        signals: map6(function(v4) {
          return {
            signalname: v4.signalname,
            nodeid: v4.nodeid,
            jointid: v4.jointid,
            routes: function() {
              var go = function(nid) {
                return function(jid) {
                  return function(rails2) {
                    return function(rids) {
                      var $249 = length(rails2) > searchmax;
                      if ($249) {
                        return [];
                      }
                      ;
                      var v62 = index(v.rails)(nid);
                      if (v62 instanceof Nothing) {
                        return [];
                      }
                      ;
                      if (v62 instanceof Just) {
                        var jidexits = function() {
                          var $251 = unwrap5(unwrap5(unwrap5(v62.value0).node).rail).flipped;
                          if ($251) {
                            return reverse;
                          }
                          ;
                          return identity4;
                        }()(nub3(map6(function() {
                          var $406 = unwrap5(unwrap5(unwrap5(v62.value0).node).rail).getNewState(jid);
                          return function($407) {
                            return function(v72) {
                              return v72.newjoint;
                            }($406($407));
                          };
                        }())(unwrap5(unwrap5(unwrap5(v62.value0).node).rail).getStates)));
                        return bindFlipped2(function(jid$prime) {
                          var v72 = find2(function(s) {
                            return s.jointid === jid$prime;
                          })(unwrap5(v62.value0).wrongways);
                          if (v72 instanceof Nothing) {
                            var v8 = find2(function(v92) {
                              return v92.jointid === jid$prime;
                            })(unwrap5(v62.value0).signals);
                            if (v8 instanceof Nothing) {
                              var v9 = find2(function(c) {
                                return c.from === jid$prime;
                              })(unwrap5(unwrap5(v62.value0).node).connections);
                              if (v9 instanceof Nothing) {
                                return [];
                              }
                              ;
                              if (v9 instanceof Just) {
                                var $256 = elem3(v9.value0.nodeid)(rids);
                                if ($256) {
                                  return [];
                                }
                                ;
                                return go(v9.value0.nodeid)(v9.value0.jointid)(append2(rails2)([{
                                  nodeid: nid,
                                  jointenter: jid,
                                  jointexit: jid$prime
                                }]))(insert3(v9.value0.nodeid)(rids));
                              }
                              ;
                              throw new Error("Failed pattern match at Internal.Layout (line 655, column 41 - line 659, column 152): " + [v9.constructor.name]);
                            }
                            ;
                            if (v8 instanceof Just) {
                              return [{
                                nextsignal: {
                                  nodeid: nid,
                                  jointid: jid$prime
                                },
                                rails: append2(rails2)([{
                                  nodeid: nid,
                                  jointenter: jid,
                                  jointexit: jid$prime
                                }])
                              }];
                            }
                            ;
                            throw new Error("Failed pattern match at Internal.Layout (line 653, column 37 - line 660, column 180): " + [v8.constructor.name]);
                          }
                          ;
                          if (v72 instanceof Just) {
                            return [];
                          }
                          ;
                          throw new Error("Failed pattern match at Internal.Layout (line 651, column 33 - line 661, column 48): " + [v72.constructor.name]);
                        })(jidexits);
                      }
                      ;
                      throw new Error("Failed pattern match at Internal.Layout (line 646, column 27 - line 662, column 45): " + [v62.constructor.name]);
                    };
                  };
                };
              };
              var v6 = index(v.rails)(v4.nodeid);
              if (v6 instanceof Nothing) {
                return [];
              }
              ;
              if (v6 instanceof Just) {
                var v7 = find2(function(c) {
                  return c.from === v4.jointid;
                })(unwrap5(unwrap5(v6.value0).node).connections);
                if (v7 instanceof Nothing) {
                  return [];
                }
                ;
                if (v7 instanceof Just) {
                  return go(v7.value0.nodeid)(v7.value0.jointid)([])([]);
                }
                ;
                throw new Error("Failed pattern match at Internal.Layout (line 666, column 27 - line 668, column 78): " + [v7.constructor.name]);
              }
              ;
              throw new Error("Failed pattern match at Internal.Layout (line 663, column 22 - line 668, column 78): " + [v6.constructor.name]);
            }(),
            colors: v4.colors,
            indication: v4.indication
          };
        })(v2.signals),
        wrongways: v2.wrongways,
        pos: v2.pos
      };
    })(v.rails),
    trains: v.trains,
    signalcolors: v.signalcolors,
    traffic: v.traffic,
    instancecount: v.instancecount,
    traincount: v.traincount,
    updatecount: v.updatecount,
    jointData: v.jointData
  };
};
var saModifyAt = function(i) {
  return function(d) {
    return function(f) {
      return function(v) {
        var $273 = i < v.head;
        if ($273) {
          return {
            arraydata: append2([f(Nothing.value)])(append2(replicate((v.head - i | 0) - 1 | 0)(d))(v.arraydata)),
            head: i,
            end: v.end
          };
        }
        ;
        var $274 = v.end <= i;
        if ($274) {
          return {
            arraydata: append2(v.arraydata)(append2(replicate(i - v.end | 0)(d))([f(Nothing.value)])),
            head: v.head,
            end: i + 1 | 0
          };
        }
        ;
        return {
          arraydata: fromMaybe(v.arraydata)(modifyAt(i - v.head | 0)(function($408) {
            return f(Just.create($408));
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
var removeSignal = function(v) {
  return function(nodeid) {
    return function(jointid) {
      return updateSignalRoutes({
        version: v.version,
        rails: fromMaybe(v.rails)(modifyAt(nodeid)(function(v2) {
          return {
            node: v2.node,
            instanceid: v2.instanceid,
            signals: filter(function(v4) {
              return v4.jointid !== jointid;
            })(v2.signals),
            wrongways: v2.wrongways,
            pos: v2.pos
          };
        })(v.rails)),
        trains: v.trains,
        signalcolors: v.signalcolors,
        traffic: v.traffic,
        instancecount: v.instancecount,
        traincount: v.traincount,
        updatecount: v.updatecount + 1 | 0,
        jointData: v.jointData
      });
    };
  };
};
var removeRail = function(v) {
  return function(nodeid) {
    var layout$prime = function() {
      var v1 = index(v.rails)(nodeid);
      if (v1 instanceof Just) {
        return unwrap5(foldl2(function(l) {
          return function(j) {
            return removeSignal(l)(nodeid)(j);
          };
        })(v)(unwrap5(unwrap5(unwrap5(v1.value0).node).rail).getJoints));
      }
      ;
      if (v1 instanceof Nothing) {
        return v;
      }
      ;
      throw new Error("Failed pattern match at Internal.Layout (line 400, column 11 - line 402, column 30): " + [v1.constructor.name]);
    }();
    return updateSignalRoutes({
      version: layout$prime.version,
      rails: map6(function(v2) {
        return shiftRailIndex(nodeid)({
          node: function() {
            var v4 = unwrap5(v2.node);
            return {
              nodeid: v4.nodeid,
              rail: v4.rail,
              state: v4.state,
              connections: filter(function(v5) {
                return v5.nodeid !== nodeid;
              })(unwrap5(v2.node).connections)
            };
          }(),
          instanceid: v2.instanceid,
          signals: v2.signals,
          wrongways: v2.wrongways,
          pos: v2.pos
        });
      })(fromMaybe(layout$prime.rails)(deleteAt(nodeid)(layout$prime.rails))),
      trains: layout$prime.trains,
      signalcolors: layout$prime.signalcolors,
      traffic: layout$prime.traffic,
      instancecount: layout$prime.instancecount,
      traincount: layout$prime.traincount,
      updatecount: layout$prime.updatecount + 1 | 0,
      jointData: map23(map23(map23(function() {
        var $409 = map6(function(v2) {
          return {
            pos: v2.pos,
            nodeid: shiftIndex(nodeid)(v2.nodeid),
            jointid: v2.jointid
          };
        });
        var $410 = filter(function(v2) {
          return v2.nodeid !== nodeid;
        });
        return function($411) {
          return $409($410($411));
        };
      }())))(layout$prime.jointData)
    });
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
          trainid: v1.trainid,
          flipped: v1.flipped
        };
        var v3 = function() {
          var v42 = unsnoc(v2.route);
          if (v42 instanceof Nothing) {
            return v2;
          }
          ;
          if (v42 instanceof Just) {
            var $296 = v2.distanceFromOldest <= v42.value0.last.length;
            if ($296) {
              return v2;
            }
            ;
            return {
              types: v2.types,
              route: v42.value0.init,
              distanceToNext: v2.distanceToNext,
              distanceFromOldest: v2.distanceFromOldest - v42.value0.last.length,
              speed: v2.speed,
              trainid: v2.trainid,
              flipped: v2.flipped
            };
          }
          ;
          throw new Error("Failed pattern match at Internal.Layout (line 467, column 9 - line 472, column 101): " + [v42.constructor.name]);
        }();
        var $301 = 0 <= v3.distanceToNext;
        if ($301) {
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
          })(unwrap5(unwrap5(v5.railinstance).node).connections))(function(cdata) {
            return bind2(index(v.rails)(cdata.nodeid))(function(nextRail) {
              var routedata = updateRailInstance(nextRail)(cdata.jointid);
              var slength = sum2(map6(shapeLength)(routedata.shapes));
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
                trainid: v3.trainid,
                flipped: v3.flipped
              };
              return new Just({
                newlayout: function() {
                  var oldrail = index(v.rails)(cdata.nodeid);
                  var $303 = on(eq14)(map14(function(x) {
                    return unwrap5(unwrap5(x).node).state;
                  }))(oldrail)(new Just(routedata.instance));
                  if ($303) {
                    return v;
                  }
                  ;
                  return {
                    version: v.version,
                    rails: fromMaybe(v.rails)(updateAt(cdata.nodeid)(routedata.instance)(v.rails)),
                    trains: v.trains,
                    signalcolors: v.signalcolors,
                    traffic: v.traffic,
                    instancecount: v.instancecount,
                    traincount: v.traincount,
                    updatecount: v.updatecount + 1 | 0,
                    jointData: v.jointData
                  };
                }(),
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
          var $306 = v3.distanceToNext === 0;
          if ($306) {
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
        throw new Error("Failed pattern match at Internal.Layout (line 476, column 13 - line 506, column 185): " + [v4.constructor.name]);
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
        var v2 = unwrap5(v1.newlayout);
        return {
          version: v2.version,
          rails: v2.rails,
          trains: append2(unwrap5(v1.newlayout).trains)([v1.newtrainset]),
          signalcolors: v2.signalcolors,
          traffic: v2.traffic,
          instancecount: v2.instancecount,
          traincount: v2.traincount,
          updatecount: v2.updatecount,
          jointData: v2.jointData
        };
      };
    })({
      version: v.version,
      rails: v.rails,
      trains: [],
      signalcolors: v.signalcolors,
      traffic: v.traffic,
      instancecount: v.instancecount,
      traincount: v.traincount,
      updatecount: v.updatecount,
      jointData: v.jointData
    })(v.trains);
  };
};
var layoutUpdate = function($412) {
  return updateSignalColor(updateTraffic($412));
};
var layoutTick = /* @__PURE__ */ function() {
  return moveTrains(1 / 60);
}();
var instanceDrawInfo = function(v) {
  return absDrawInfo(v.pos)(unwrap5(unwrap5(v.node).rail).getDrawInfo(unwrap5(v.node).state));
};
var getRailJointAbsPos = function(r) {
  return function(jointid) {
    return toAbsPos(unwrap5(r).pos)(unwrap5(unwrap5(unwrap5(r).node).rail).getJointPos(jointid));
  };
};
var getJoints = function(v) {
  return function(joint) {
    var getrange = function(r) {
      var i = round2(r);
      var $315 = round2(r - 0.1) < i;
      if ($315) {
        return [i - 1 | 0, i];
      }
      ;
      var $316 = i < round2(r + 0.1);
      if ($316) {
        return [i, i + 1 | 0];
      }
      ;
      return [i];
    };
    var coord = unwrap5(unwrap5(joint).coord);
    var rx = getrange(coord.x);
    var ry = getrange(coord.y);
    var rz = getrange(coord.z);
    return join1(apply5(apply5(map6(function(x) {
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
    var origin = unwrap5(v1.rail).getJointPos(unwrap5(v1.rail).getOrigin);
    var jrel = function(i) {
      return unwrap5(v1.rail).getJointPos(i);
    };
    var conv = function(i) {
      return convertRelPos(unwrap5(v1.rail).getJointPos(i))(origin);
    };
    return join2(foldM3(function(mposofzero) {
      return function(v2) {
        if (mposofzero instanceof Nothing) {
          return new Just(apply1(map14(toAbsPos)(map14(reversePos)(getJointAbsPos(v)(v2.nodeid)(v2.jointid))))(pure2(conv(v2.from))));
        }
        ;
        if (mposofzero instanceof Just) {
          var $324 = fromMaybe(false)(map14(canJoin(toAbsPos(mposofzero.value0)(jrel(v2.from))))(getJointAbsPos(v)(v2.nodeid)(v2.jointid)));
          if ($324) {
            return new Just(mposofzero);
          }
          ;
          return Nothing.value;
        }
        ;
        throw new Error("Failed pattern match at Internal.Layout (line 301, column 11 - line 308, column 27): " + [mposofzero.constructor.name]);
      };
    })(Nothing.value)(v1.connections));
  };
};
var forceUpdate = function(v) {
  return {
    version: v.version,
    rails: v.rails,
    trains: v.trains,
    signalcolors: v.signalcolors,
    traffic: v.traffic,
    instancecount: v.instancecount,
    traincount: v.traincount,
    updatecount: v.updatecount + 1 | 0,
    jointData: v.jointData
  };
};
var flipTrain = function(v) {
  return {
    types: v.types,
    route: reverse(map6(function(v2) {
      return {
        nodeid: v2.nodeid,
        jointid: updateRailInstance(v2.railinstance)(v2.jointid).newjoint,
        railinstance: v2.railinstance,
        shapes: reverseShapes(v2.shapes),
        length: v2.length
      };
    })(v.route)),
    distanceToNext: v.distanceFromOldest,
    distanceFromOldest: v.distanceToNext,
    speed: v.speed,
    trainid: v.trainid,
    flipped: !v.flipped
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
            var $335 = v1.value0.length < d$prime;
            if ($335) {
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
          throw new Error("Failed pattern match at Internal.Layout (line 171, column 9 - line 176, column 29): " + [v1.constructor.name]);
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
    flipped: v.flipped,
    trainid: v.trainid,
    cars: mapWithIndex(function(i) {
      return function(ct) {
        var d = toNumber(i) * (carLength + carMargin) + v.distanceToNext;
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
    rails: map6(function(r) {
      var v1 = instanceDrawInfo(r);
      return {
        rails: v1.rails,
        additionals: v1.additionals,
        joints: map6(getRailJointAbsPos(r))(unwrap5(unwrap5(unwrap5(r).node).rail).getJoints),
        instance: r
      };
    })(v.rails),
    signals: map6(function(v1) {
      return map6(function(v2) {
        return {
          indication: v2.indication,
          pos: fromMaybe(poszero)(getJointAbsPos(v)(v2.nodeid)(v2.jointid)),
          signal: v2
        };
      })(v1.signals);
    })(v.rails),
    trains: map6(trainsetDrawInfo)(v.trains)
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
                  var lenhere = sum2(map6(shapeLength)(info.shapes));
                  var $346 = lenhere < len;
                  if ($346) {
                    return bind2(find2(function(c) {
                      return c.from === info.newjoint;
                    })(unwrap5(unwrap5(rail).node).connections))(function(cdata) {
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
                    trainid: v.traincount,
                    flipped: false
                  });
                });
              };
            };
          };
        };
        return fromMaybe(v)(bind2(index(v.rails)(nodeid))(function(rail) {
          return bind2(find2(function(c) {
            return c.from === jointid;
          })(unwrap5(unwrap5(rail).node).connections))(function(start) {
            return bind2(go([])(start.nodeid)(start.jointid)(toNumber(length(types)) * (carLength + carMargin) - carMargin))(function(newtrain) {
              return new Just({
                version: v.version,
                rails: v.rails,
                trains: append2(v.trains)([newtrain]),
                signalcolors: v.signalcolors,
                traffic: v.traffic,
                instancecount: v.instancecount,
                traincount: v.traincount + 1 | 0,
                updatecount: v.updatecount,
                jointData: v.jointData
              });
            });
          });
        }));
      };
    };
  };
};
var addSignal = function(v) {
  return function(nodeid) {
    return function(jointid) {
      return fromMaybe(v)(function() {
        var signal = {
          signalname: show2(nodeid) + ("_" + show2(nodeid)),
          nodeid,
          jointid,
          routes: [],
          colors: [signalStop, signalCaution, signalReduce],
          indication: []
        };
        return bind2(index(v.rails)(nodeid))(function(v1) {
          return discard2(function() {
            var $352 = any(function(v2) {
              return v2.jointid === jointid;
            })(v1.signals);
            if ($352) {
              return Nothing.value;
            }
            ;
            return pure2(unit);
          }())(function() {
            return bind2(modifyAt(nodeid)(function(v2) {
              return {
                node: v2.node,
                instanceid: v2.instanceid,
                signals: append2(v2.signals)([signal]),
                wrongways: v2.wrongways,
                pos: v2.pos
              };
            })(v.rails))(function(rails$prime) {
              return new Just(updateSignalRoutes({
                version: v.version,
                rails: rails$prime,
                trains: v.trains,
                signalcolors: v.signalcolors,
                traffic: v.traffic,
                instancecount: v.instancecount,
                traincount: v.traincount,
                updatecount: v.updatecount + 1 | 0,
                jointData: v.jointData
              }));
            });
          });
        });
      }());
    };
  };
};
var addJoint = function(v) {
  return function(pos) {
    return function(nodeid) {
      return function(jointid) {
        var coord = unwrap5(unwrap5(pos).coord);
        return {
          version: v.version,
          rails: v.rails,
          trains: v.trains,
          signalcolors: v.signalcolors,
          traffic: v.traffic,
          instancecount: v.instancecount,
          traincount: v.traincount,
          updatecount: v.updatecount,
          jointData: saModifyAt(round2(coord.z))(saEmpty)(function() {
            var $415 = saModifyAt(round2(coord.x))(saEmpty)(function() {
              var $418 = saModifyAt(round2(coord.y))([])(function(ma) {
                return append2(fromMaybe([])(ma))([{
                  pos,
                  nodeid,
                  jointid
                }]);
              });
              var $419 = fromMaybe(saEmpty);
              return function($420) {
                return $418($419($420));
              };
            }());
            var $416 = fromMaybe(saEmpty);
            return function($417) {
              return $415($416($417));
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
        return unwrap5(v1.rail).getJointPos(i);
      };
      var joints = map6(function(j) {
        return {
          jointid: j,
          pos: toAbsPos(pos)(jrel(j))
        };
      })(unwrap5(v1.rail).getJoints);
      var givenconnections = map6(function(v2) {
        return {
          jointData: {
            pos: poszero,
            nodeid: v2.nodeid,
            jointid: v2.jointid
          },
          jointid: v2.from
        };
      })(v1.connections);
      var cfroms = map6(function(v2) {
        return v2.from;
      })(v1.connections);
      var newconnections = catMaybes(map6(function(v2) {
        var $368 = elem3(v2.jointid)(cfroms);
        if ($368) {
          return Nothing.value;
        }
        ;
        return function() {
          var $421 = map14(function(jdata) {
            return {
              jointData: jdata,
              jointid: v2.jointid
            };
          });
          return function($422) {
            return $421(head($422));
          };
        }()(filter(function(v3) {
          return canJoin(v2.pos)(v3.pos);
        })(getJoints(v)(v2.pos)));
      })(joints));
      var connections = append2(givenconnections)(newconnections);
      var cond = foldl2(conj2)(true)(map6(function(v2) {
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
          connections: append2(v1.connections)(map6(function(v3) {
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
                signals: v3.signals,
                wrongways: v3.wrongways,
                pos: v3.pos
              };
            })(rs));
          };
        })(v.rails)(connections))([{
          node: newnode,
          instanceid: v.instancecount,
          pos,
          signals: [],
          wrongways: []
        }]);
        return new Just(updateSignalRoutes(function(l) {
          return foldl2(function(l$prime) {
            return function(v2) {
              return addJoint(l$prime)(v2.pos)(v1.nodeid)(v2.jointid);
            };
          })(l)(joints);
        }({
          version: v.version,
          rails: newrails,
          trains: v.trains,
          signalcolors: v.signalcolors,
          traffic: v.traffic,
          instancecount: v.instancecount + 1 | 0,
          traincount: v.traincount,
          updatecount: v.updatecount + 1 | 0,
          jointData: v.jointData
        })));
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
              var $404 = v1.isPlus === unwrap5(unwrap5(unwrap5(rail).getJointPos(from2))).isPlus;
              if ($404) {
                return opposeRail(rail);
              }
              ;
              return rail;
            }();
            var node = {
              nodeid: length(v.rails),
              state: unwrap5(rail$prime).defaultState,
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
var intSerializeSum3 = /* @__PURE__ */ intSerializeSum(intSerializeConstructor2);
var intSerializeSum1 = /* @__PURE__ */ intSerializeSum3(intSerializeConstructor2);
var map7 = /* @__PURE__ */ map(functorArray);
var intSerializeSum22 = /* @__PURE__ */ intSerializeSum3(intSerializeSum1);
var intSerializeRecord2 = /* @__PURE__ */ intSerializeRecord();
var rowListSerializeCons2 = /* @__PURE__ */ rowListSerializeCons();
var rowListSerializeNilRow2 = /* @__PURE__ */ rowListSerializeNilRow();
var rowListSerializeCons1 = /* @__PURE__ */ rowListSerializeCons2({
  reflectSymbol: function() {
    return "turnout";
  }
})(intSerializeBoolean)(rowListSerializeNilRow2)()()();
var join3 = /* @__PURE__ */ join(bindArray);
var unwrap6 = /* @__PURE__ */ unwrap();
var intSerializeSum32 = /* @__PURE__ */ intSerializeSum3(intSerializeSum22);
var append3 = /* @__PURE__ */ append(semigroupArray);
var slipShapes2 = /* @__PURE__ */ slipShapes();
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
var eqStateScissors = {
  eq: function(x) {
    return function(y) {
      if (x instanceof StateSP_P && y instanceof StateSP_P) {
        return true;
      }
      ;
      if (x instanceof StateSP_S && y instanceof StateSP_S) {
        return true;
      }
      ;
      if (x instanceof StateSP_N && y instanceof StateSP_N) {
        return true;
      }
      ;
      return false;
    };
  }
};
var notEq1 = /* @__PURE__ */ notEq(eqStateScissors);
var eqJointsSimple = {
  eq: function(x) {
    return function(y) {
      if (x instanceof JointBegin && y instanceof JointBegin) {
        return true;
      }
      ;
      if (x instanceof JointEnd && y instanceof JointEnd) {
        return true;
      }
      ;
      return false;
    };
  }
};
var notEq22 = /* @__PURE__ */ notEq(eqJointsSimple);
var eqJointsDouble = {
  eq: function(x) {
    return function(y) {
      if (x instanceof JointOuterBegin && y instanceof JointOuterBegin) {
        return true;
      }
      ;
      if (x instanceof JointInnerEnd && y instanceof JointInnerEnd) {
        return true;
      }
      ;
      if (x instanceof JointInnerBegin && y instanceof JointInnerBegin) {
        return true;
      }
      ;
      if (x instanceof JointOuterEnd && y instanceof JointOuterEnd) {
        return true;
      }
      ;
      return false;
    };
  }
};
var eq15 = /* @__PURE__ */ eq(eqJointsDouble);
var noAdditionals = function(x) {
  return {
    rails: x,
    additionals: []
  };
};
var genericStatesSolid = {
  to: function(x) {
    return StateSolid.value;
  },
  from: function(x) {
    return NoArguments.value;
  }
};
var intSerialize3 = /* @__PURE__ */ intSerialize(genericStatesSolid)(intSerializeConstructor2);
var serialAll2 = /* @__PURE__ */ serialAll(intSerialize3);
var genericStatesPoint = {
  to: function(x) {
    return x;
  },
  from: function(x) {
    return x;
  }
};
var intSerialize1 = /* @__PURE__ */ intSerialize(genericStatesPoint)(/* @__PURE__ */ intSerializeConstructor(/* @__PURE__ */ intSerializeArgument(/* @__PURE__ */ intSerializeRecord2(rowListSerializeCons1))));
var serialAll1 = /* @__PURE__ */ serialAll(intSerialize1);
var genericStatesDoublePoint = {
  to: function(x) {
    return x;
  },
  from: function(x) {
    return x;
  }
};
var intSerialize22 = /* @__PURE__ */ intSerialize(genericStatesDoublePoint)(/* @__PURE__ */ intSerializeConstructor(/* @__PURE__ */ intSerializeArgument(/* @__PURE__ */ intSerializeRecord2(/* @__PURE__ */ rowListSerializeCons2({
  reflectSymbol: function() {
    return "innerturnout";
  }
})(intSerializeBoolean)(/* @__PURE__ */ rowListSerializeCons2({
  reflectSymbol: function() {
    return "outerturnout";
  }
})(intSerializeBoolean)(rowListSerializeNilRow2)()()())()()()))));
var serialAll22 = /* @__PURE__ */ serialAll(intSerialize22);
var genericStatesAutoPoint = {
  to: function(x) {
    return x;
  },
  from: function(x) {
    return x;
  }
};
var intSerialize32 = /* @__PURE__ */ intSerialize(genericStatesAutoPoint)(/* @__PURE__ */ intSerializeConstructor(/* @__PURE__ */ intSerializeArgument(/* @__PURE__ */ intSerializeRecord2(/* @__PURE__ */ rowListSerializeCons2({
  reflectSymbol: function() {
    return "auto";
  }
})(intSerializeBoolean)(rowListSerializeCons1)()()()))));
var genericStateScissors = {
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
    throw new Error("Failed pattern match at Internal.Rails (line 96, column 1 - line 96, column 68): " + [x.constructor.name]);
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
    throw new Error("Failed pattern match at Internal.Rails (line 96, column 1 - line 96, column 68): " + [x.constructor.name]);
  }
};
var intSerialize4 = /* @__PURE__ */ intSerialize(genericStateScissors)(intSerializeSum22);
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
    throw new Error("Failed pattern match at Internal.Rails (line 103, column 1 - line 103, column 71): " + [x.constructor.name]);
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
    throw new Error("Failed pattern match at Internal.Rails (line 103, column 1 - line 103, column 71): " + [x.constructor.name]);
  }
};
var intSerialize5 = /* @__PURE__ */ intSerialize(genericJointsSimple)(intSerializeSum1);
var toRail2 = /* @__PURE__ */ toRail(intSerialize5)(intSerialize3);
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
      return noAdditionals(map7(blueRail)(r0));
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
      throw new Error("Failed pattern match at Internal.Rails (line 188, column 28 - line 190, column 25): " + [j.constructor.name]);
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
        throw new Error("Failed pattern match at Internal.Rails (line 191, column 30 - line 193, column 82): " + [j.constructor.name]);
      };
    },
    getRoute: function(s) {
      return function(f) {
        return function(t) {
          var $268 = notEq22(f)(t);
          if ($268) {
            return new Just(s);
          }
          ;
          return Nothing.value;
        };
      };
    },
    isLocked: function(j) {
      return function(s) {
        return function(s$prime) {
          return false;
        };
      };
    },
    isBlocked: function(j) {
      return function(s) {
        return function(j$prime) {
          return true;
        };
      };
    },
    isSimple: true
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
      return noAdditionals(map7(blueRail)(r0));
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
      throw new Error("Failed pattern match at Internal.Rails (line 160, column 28 - line 162, column 25): " + [j.constructor.name]);
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
        throw new Error("Failed pattern match at Internal.Rails (line 163, column 30 - line 165, column 82): " + [j.constructor.name]);
      };
    },
    getRoute: function(s) {
      return function(f) {
        return function(t) {
          var $271 = notEq22(f)(t);
          if ($271) {
            return new Just(s);
          }
          ;
          return Nothing.value;
        };
      };
    },
    isLocked: function(j) {
      return function(s) {
        return function(s$prime) {
          return false;
        };
      };
    },
    isBlocked: function(j) {
      return function(s) {
        return function(j$prime) {
          return true;
        };
      };
    },
    isSimple: true
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
      return noAdditionals(map7(blueRail)(r0));
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
      throw new Error("Failed pattern match at Internal.Rails (line 216, column 28 - line 218, column 25): " + [j.constructor.name]);
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
        throw new Error("Failed pattern match at Internal.Rails (line 219, column 30 - line 221, column 82): " + [j.constructor.name]);
      };
    },
    getRoute: function(s) {
      return function(f) {
        return function(t) {
          var $274 = notEq22(f)(t);
          if ($274) {
            return new Just(s);
          }
          ;
          return Nothing.value;
        };
      };
    },
    isLocked: function(j) {
      return function(s) {
        return function(s$prime) {
          return false;
        };
      };
    },
    isBlocked: function(j) {
      return function(s) {
        return function(j$prime) {
          return true;
        };
      };
    },
    isSimple: true
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
      return noAdditionals(map7(blueRail)(r0));
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
      throw new Error("Failed pattern match at Internal.Rails (line 329, column 26 - line 331, column 23): " + [j.constructor.name]);
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
        throw new Error("Failed pattern match at Internal.Rails (line 332, column 28 - line 334, column 82): " + [j.constructor.name]);
      };
    },
    getRoute: function(s) {
      return function(f) {
        return function(t) {
          var $277 = notEq22(f)(t);
          if ($277) {
            return new Just(s);
          }
          ;
          return Nothing.value;
        };
      };
    },
    isLocked: function(j) {
      return function(s) {
        return function(s$prime) {
          return false;
        };
      };
    },
    isBlocked: function(j) {
      return function(s) {
        return function(j$prime) {
          return true;
        };
      };
    },
    isSimple: true
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
      return noAdditionals(map7(blueRail)(r0));
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
      throw new Error("Failed pattern match at Internal.Rails (line 270, column 28 - line 272, column 25): " + [j.constructor.name]);
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
        throw new Error("Failed pattern match at Internal.Rails (line 273, column 30 - line 275, column 82): " + [j.constructor.name]);
      };
    },
    getRoute: function(s) {
      return function(f) {
        return function(t) {
          var $280 = notEq22(f)(t);
          if ($280) {
            return new Just(s);
          }
          ;
          return Nothing.value;
        };
      };
    },
    isLocked: function(j) {
      return function(s) {
        return function(s$prime) {
          return false;
        };
      };
    },
    isBlocked: function(j) {
      return function(s) {
        return function(j$prime) {
          return true;
        };
      };
    },
    isSimple: true
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
      return noAdditionals(map7(blueRail)(r0));
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
      throw new Error("Failed pattern match at Internal.Rails (line 132, column 28 - line 134, column 25): " + [j.constructor.name]);
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
        throw new Error("Failed pattern match at Internal.Rails (line 135, column 30 - line 137, column 82): " + [j.constructor.name]);
      };
    },
    getRoute: function(s) {
      return function(f) {
        return function(t) {
          var $283 = notEq22(f)(t);
          if ($283) {
            return new Just(s);
          }
          ;
          return Nothing.value;
        };
      };
    },
    isLocked: function(j) {
      return function(s) {
        return function(s$prime) {
          return false;
        };
      };
    },
    isBlocked: function(j) {
      return function(s) {
        return function(j$prime) {
          return true;
        };
      };
    },
    isSimple: true
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
    throw new Error("Failed pattern match at Internal.Rails (line 106, column 1 - line 106, column 71): " + [x.constructor.name]);
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
    throw new Error("Failed pattern match at Internal.Rails (line 106, column 1 - line 106, column 71): " + [x.constructor.name]);
  }
};
var intSerialize6 = /* @__PURE__ */ intSerialize(genericJointsPoint)(intSerializeSum22);
var toRail1 = /* @__PURE__ */ toRail(intSerialize6);
var toRail22 = /* @__PURE__ */ toRail1(intSerialize1);
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
        return noAdditionals(join3([map7(grayRail)(r0), map7(blueRail)(r1)]));
      }
      ;
      return noAdditionals(join3([map7(grayRail)(r1), map7(blueRail)(r0)]));
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
      throw new Error("Failed pattern match at Internal.Rails (line 437, column 28 - line 440, column 25): " + [j.constructor.name]);
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
        throw new Error("Failed pattern match at Internal.Rails (line 441, column 43 - line 447, column 73): " + [j.constructor.name]);
      };
    },
    getRoute: function(s) {
      return function(f) {
        return function(t) {
          if (f instanceof JointEnter) {
            if (t instanceof JointEnter) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointMain) {
              return new Just(function() {
                var v = unwrap6(s);
                return {
                  turnout: false
                };
              }());
            }
            ;
            if (t instanceof JointSub) {
              return new Just(function() {
                var v = unwrap6(s);
                return {
                  turnout: true
                };
              }());
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 452, column 27 - line 455, column 89): " + [t.constructor.name]);
          }
          ;
          if (f instanceof JointMain) {
            if (t instanceof JointEnter) {
              return new Just(function() {
                var v = unwrap6(s);
                return {
                  turnout: false
                };
              }());
            }
            ;
            if (t instanceof JointMain) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointSub) {
              return Nothing.value;
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 457, column 27 - line 460, column 50): " + [t.constructor.name]);
          }
          ;
          if (f instanceof JointSub) {
            if (t instanceof JointEnter) {
              return new Just(function() {
                var v = unwrap6(s);
                return {
                  turnout: true
                };
              }());
            }
            ;
            if (t instanceof JointMain) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointSub) {
              return Nothing.value;
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 462, column 27 - line 465, column 50): " + [t.constructor.name]);
          }
          ;
          throw new Error("Failed pattern match at Internal.Rails (line 450, column 23 - line 465, column 50): " + [f.constructor.name]);
        };
      };
    },
    isLocked: function(j) {
      return function(s) {
        return function(s$prime) {
          return unwrap6(s).turnout !== unwrap6(s$prime).turnout;
        };
      };
    },
    isBlocked: function(j) {
      return function(s) {
        return function(j$prime) {
          return true;
        };
      };
    },
    isSimple: false
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
    throw new Error("Failed pattern match at Internal.Rails (line 112, column 1 - line 112, column 71): " + [x.constructor.name]);
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
    throw new Error("Failed pattern match at Internal.Rails (line 112, column 1 - line 112, column 71): " + [x.constructor.name]);
  }
};
var intSerialize7 = /* @__PURE__ */ intSerialize(genericJointsDoublePoint)(/* @__PURE__ */ intSerializeSum3(/* @__PURE__ */ intSerializeSum3(intSerializeSum32)));
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
    throw new Error("Failed pattern match at Internal.Rails (line 109, column 1 - line 109, column 71): " + [x.constructor.name]);
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
    throw new Error("Failed pattern match at Internal.Rails (line 109, column 1 - line 109, column 71): " + [x.constructor.name]);
  }
};
var intSerialize8 = /* @__PURE__ */ intSerialize(genericJointsDouble)(intSerializeSum32);
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
  return toRail(intSerialize7)(intSerialize22)({
    name: "doubleTurnout",
    flipped: false,
    opposed: false,
    getDrawInfo: function(v) {
      if (v.outerturnout) {
        if (v.innerturnout) {
          return noAdditionals(append3(map7(grayRail)(rom))(append3(map7(grayRail)(rim))(append3(map7(blueRail)(ros))(map7(blueRail)(ris)))));
        }
        ;
        return noAdditionals(append3(map7(grayRail)(rom))(append3(map7(grayRail)(ris))(append3(map7(blueRail)(ros))(map7(blueRail)(rim)))));
      }
      ;
      if (v.innerturnout) {
        return noAdditionals(append3(map7(grayRail)(ros))(append3(map7(grayRail)(rim))(append3(map7(blueRail)(rom))(map7(blueRail)(ris)))));
      }
      ;
      return noAdditionals(append3(map7(grayRail)(ros))(append3(map7(grayRail)(ris))(append3(map7(blueRail)(rom))(map7(blueRail)(rim)))));
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
      throw new Error("Failed pattern match at Internal.Rails (line 762, column 26 - line 768, column 29): " + [j.constructor.name]);
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
              newjoint: JointInnerEnter.value,
              newstate: {
                innerturnout: false,
                outerturnout: v.outerturnout
              },
              shape: reverseShapes(rim)
            };
          }
          ;
          return {
            newjoint: JointInnerEnter.value,
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
              newjoint: JointInnerEnter.value,
              newstate: {
                innerturnout: true,
                outerturnout: v.outerturnout
              },
              shape: reverseShapes(ris)
            };
          }
          ;
          return {
            newjoint: JointInnerEnter.value,
            newstate: {
              innerturnout: true,
              outerturnout: v.outerturnout
            },
            shape: reverseShapes(ris)
          };
        }
        ;
        throw new Error("Failed pattern match at Internal.Rails (line 770, column 7 - line 794, column 117): " + [j.constructor.name]);
      };
    },
    getRoute: function(s) {
      return function(f) {
        return function(t) {
          if (f instanceof JointOuterEnter) {
            if (t instanceof JointOuterEnter) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointOuterMain) {
              return new Just(function() {
                var v = unwrap6(s);
                return {
                  innerturnout: false,
                  outerturnout: v.outerturnout
                };
              }());
            }
            ;
            if (t instanceof JointOuterSub) {
              return new Just(function() {
                var v = unwrap6(s);
                return {
                  innerturnout: true,
                  outerturnout: v.outerturnout
                };
              }());
            }
            ;
            if (t instanceof JointInnerEnter) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointInnerMain) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointInnerSub) {
              return Nothing.value;
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 799, column 27 - line 805, column 55): " + [t.constructor.name]);
          }
          ;
          if (f instanceof JointOuterMain) {
            if (t instanceof JointOuterEnter) {
              return new Just(function() {
                var v = unwrap6(s);
                return {
                  innerturnout: false,
                  outerturnout: v.outerturnout
                };
              }());
            }
            ;
            if (t instanceof JointOuterMain) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointOuterSub) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointInnerEnter) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointInnerMain) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointInnerSub) {
              return Nothing.value;
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 807, column 27 - line 813, column 55): " + [t.constructor.name]);
          }
          ;
          if (f instanceof JointOuterSub) {
            if (t instanceof JointOuterEnter) {
              return new Just(function() {
                var v = unwrap6(s);
                return {
                  innerturnout: true,
                  outerturnout: v.outerturnout
                };
              }());
            }
            ;
            if (t instanceof JointOuterMain) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointOuterSub) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointInnerEnter) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointInnerMain) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointInnerSub) {
              return Nothing.value;
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 815, column 27 - line 821, column 55): " + [t.constructor.name]);
          }
          ;
          if (f instanceof JointInnerEnter) {
            if (t instanceof JointOuterEnter) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointOuterMain) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointOuterSub) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointInnerEnter) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointInnerMain) {
              return new Just(function() {
                var v = unwrap6(s);
                return {
                  innerturnout: v.innerturnout,
                  outerturnout: false
                };
              }());
            }
            ;
            if (t instanceof JointInnerSub) {
              return new Just(function() {
                var v = unwrap6(s);
                return {
                  innerturnout: v.innerturnout,
                  outerturnout: true
                };
              }());
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 823, column 27 - line 829, column 96): " + [t.constructor.name]);
          }
          ;
          if (f instanceof JointInnerMain) {
            if (t instanceof JointOuterEnter) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointOuterMain) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointOuterSub) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointInnerEnter) {
              return new Just(function() {
                var v = unwrap6(s);
                return {
                  innerturnout: v.innerturnout,
                  outerturnout: false
                };
              }());
            }
            ;
            if (t instanceof JointInnerMain) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointInnerSub) {
              return Nothing.value;
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 831, column 27 - line 837, column 55): " + [t.constructor.name]);
          }
          ;
          if (f instanceof JointInnerSub) {
            if (t instanceof JointOuterEnter) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointOuterMain) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointOuterSub) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointInnerEnter) {
              return new Just(function() {
                var v = unwrap6(s);
                return {
                  innerturnout: v.innerturnout,
                  outerturnout: true
                };
              }());
            }
            ;
            if (t instanceof JointInnerMain) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointInnerSub) {
              return Nothing.value;
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 839, column 27 - line 845, column 55): " + [t.constructor.name]);
          }
          ;
          throw new Error("Failed pattern match at Internal.Rails (line 797, column 23 - line 845, column 55): " + [f.constructor.name]);
        };
      };
    },
    isLocked: function(j) {
      return function(s) {
        return function(s$prime) {
          if (j instanceof JointOuterEnter) {
            return unwrap6(s).outerturnout !== unwrap6(s).outerturnout;
          }
          ;
          if (j instanceof JointOuterMain) {
            return unwrap6(s).outerturnout !== unwrap6(s).outerturnout;
          }
          ;
          if (j instanceof JointOuterSub) {
            return unwrap6(s).outerturnout !== unwrap6(s).outerturnout;
          }
          ;
          if (j instanceof JointInnerEnter) {
            return unwrap6(s).innerturnout !== unwrap6(s).innerturnout;
          }
          ;
          if (j instanceof JointInnerMain) {
            return unwrap6(s).innerturnout !== unwrap6(s).innerturnout;
          }
          ;
          if (j instanceof JointInnerSub) {
            return unwrap6(s).innerturnout !== unwrap6(s).innerturnout;
          }
          ;
          throw new Error("Failed pattern match at Internal.Rails (line 847, column 23 - line 853, column 94): " + [j.constructor.name]);
        };
      };
    },
    isBlocked: function(j) {
      return function(s) {
        return function(j$prime) {
          if (j instanceof JointOuterEnter) {
            if (j$prime instanceof JointOuterEnter) {
              return true;
            }
            ;
            if (j$prime instanceof JointOuterMain) {
              return true;
            }
            ;
            if (j$prime instanceof JointOuterSub) {
              return true;
            }
            ;
            if (j$prime instanceof JointInnerEnter) {
              return !unwrap6(s).outerturnout && unwrap6(s).innerturnout;
            }
            ;
            if (j$prime instanceof JointInnerMain) {
              return false;
            }
            ;
            if (j$prime instanceof JointInnerSub) {
              return !unwrap6(s).outerturnout;
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 857, column 27 - line 863, column 75): " + [j$prime.constructor.name]);
          }
          ;
          if (j instanceof JointOuterMain) {
            if (j$prime instanceof JointOuterEnter) {
              return true;
            }
            ;
            if (j$prime instanceof JointOuterMain) {
              return true;
            }
            ;
            if (j$prime instanceof JointOuterSub) {
              return true;
            }
            ;
            if (j$prime instanceof JointInnerEnter) {
              return unwrap6(s).innerturnout;
            }
            ;
            if (j$prime instanceof JointInnerMain) {
              return false;
            }
            ;
            if (j$prime instanceof JointInnerSub) {
              return true;
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 865, column 27 - line 871, column 52): " + [j$prime.constructor.name]);
          }
          ;
          if (j instanceof JointOuterSub) {
            if (j$prime instanceof JointOuterEnter) {
              return true;
            }
            ;
            if (j$prime instanceof JointOuterMain) {
              return true;
            }
            ;
            if (j$prime instanceof JointOuterSub) {
              return true;
            }
            ;
            if (j$prime instanceof JointInnerEnter) {
              return false;
            }
            ;
            if (j$prime instanceof JointInnerMain) {
              return false;
            }
            ;
            if (j$prime instanceof JointInnerSub) {
              return false;
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 873, column 27 - line 879, column 53): " + [j$prime.constructor.name]);
          }
          ;
          if (j instanceof JointInnerEnter) {
            if (j$prime instanceof JointOuterEnter) {
              return !unwrap6(s).outerturnout && unwrap6(s).innerturnout;
            }
            ;
            if (j$prime instanceof JointOuterMain) {
              return unwrap6(s).innerturnout;
            }
            ;
            if (j$prime instanceof JointOuterSub) {
              return false;
            }
            ;
            if (j$prime instanceof JointInnerEnter) {
              return true;
            }
            ;
            if (j$prime instanceof JointInnerMain) {
              return true;
            }
            ;
            if (j$prime instanceof JointInnerSub) {
              return true;
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 881, column 27 - line 887, column 52): " + [j$prime.constructor.name]);
          }
          ;
          if (j instanceof JointInnerMain) {
            if (j$prime instanceof JointOuterEnter) {
              return false;
            }
            ;
            if (j$prime instanceof JointOuterMain) {
              return false;
            }
            ;
            if (j$prime instanceof JointOuterSub) {
              return false;
            }
            ;
            if (j$prime instanceof JointInnerEnter) {
              return true;
            }
            ;
            if (j$prime instanceof JointInnerMain) {
              return true;
            }
            ;
            if (j$prime instanceof JointInnerSub) {
              return true;
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 889, column 27 - line 895, column 52): " + [j$prime.constructor.name]);
          }
          ;
          if (j instanceof JointInnerSub) {
            if (j$prime instanceof JointOuterEnter) {
              return !unwrap6(s).outerturnout;
            }
            ;
            if (j$prime instanceof JointOuterMain) {
              return true;
            }
            ;
            if (j$prime instanceof JointOuterSub) {
              return false;
            }
            ;
            if (j$prime instanceof JointInnerEnter) {
              return true;
            }
            ;
            if (j$prime instanceof JointInnerMain) {
              return true;
            }
            ;
            if (j$prime instanceof JointInnerSub) {
              return true;
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 897, column 27 - line 903, column 52): " + [j$prime.constructor.name]);
          }
          ;
          throw new Error("Failed pattern match at Internal.Rails (line 855, column 23 - line 903, column 52): " + [j.constructor.name]);
        };
      };
    },
    isSimple: false
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
      return noAdditionals(map7(blueRail)(r0));
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
      throw new Error("Failed pattern match at Internal.Rails (line 360, column 26 - line 362, column 23): " + [j.constructor.name]);
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
        throw new Error("Failed pattern match at Internal.Rails (line 363, column 28 - line 365, column 80): " + [j.constructor.name]);
      };
    },
    getRoute: function(s) {
      return function(f) {
        return function(t) {
          var $364 = notEq22(f)(t);
          if ($364) {
            return new Just(s);
          }
          ;
          return Nothing.value;
        };
      };
    },
    isLocked: function(j) {
      return function(s) {
        return function(s$prime) {
          return false;
        };
      };
    },
    isBlocked: function(j) {
      return function(s) {
        return function(j$prime) {
          return true;
        };
      };
    },
    isSimple: true
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
  return toRail3(intSerialize4)({
    name: "scissors",
    flipped: false,
    opposed: false,
    getDrawInfo: function(s) {
      if (s instanceof StateSP_P) {
        return noAdditionals(append3(map7(grayRail)(ri))(append3(map7(grayRail)(ro))(append3(map7(grayRail)(rn))(map7(blueRail)(rp)))));
      }
      ;
      if (s instanceof StateSP_S) {
        return noAdditionals(append3(map7(grayRail)(rn))(append3(map7(grayRail)(rp))(append3(map7(blueRail)(ri))(map7(blueRail)(ro)))));
      }
      ;
      if (s instanceof StateSP_N) {
        return noAdditionals(append3(map7(grayRail)(ri))(append3(map7(grayRail)(ro))(append3(map7(grayRail)(rp))(map7(blueRail)(rn)))));
      }
      ;
      throw new Error("Failed pattern match at Internal.Rails (line 629, column 7 - line 644, column 43): " + [s.constructor.name]);
    },
    defaultState: StateSP_S.value,
    getJoints: serialAll5,
    getStates: serialAll(intSerialize4),
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
      throw new Error("Failed pattern match at Internal.Rails (line 650, column 26 - line 654, column 29): " + [j.constructor.name]);
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
          throw new Error("Failed pattern match at Internal.Rails (line 658, column 11 - line 662, column 105): " + [j.constructor.name]);
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
          throw new Error("Failed pattern match at Internal.Rails (line 664, column 11 - line 668, column 105): " + [j.constructor.name]);
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
              newstate: StateSP_N.value,
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
              newstate: StateSP_N.value,
              shape: reverseShapes(rn)
            };
          }
          ;
          throw new Error("Failed pattern match at Internal.Rails (line 670, column 11 - line 674, column 105): " + [j.constructor.name]);
        }
        ;
        throw new Error("Failed pattern match at Internal.Rails (line 656, column 7 - line 674, column 105): " + [s.constructor.name]);
      };
    },
    getRoute: function(s) {
      return function(f) {
        return function(t) {
          if (f instanceof JointInnerBegin) {
            if (t instanceof JointInnerBegin) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointInnerEnd) {
              return new Just(StateSP_S.value);
            }
            ;
            if (t instanceof JointOuterBegin) {
              return new Just(StateSP_P.value);
            }
            ;
            if (t instanceof JointOuterEnd) {
              return Nothing.value;
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 679, column 27 - line 683, column 55): " + [t.constructor.name]);
          }
          ;
          if (f instanceof JointInnerEnd) {
            if (t instanceof JointInnerBegin) {
              return new Just(StateSP_S.value);
            }
            ;
            if (t instanceof JointInnerEnd) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointOuterBegin) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointOuterEnd) {
              return new Just(StateSP_N.value);
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 685, column 27 - line 689, column 62): " + [t.constructor.name]);
          }
          ;
          if (f instanceof JointOuterBegin) {
            if (t instanceof JointInnerBegin) {
              return new Just(StateSP_P.value);
            }
            ;
            if (t instanceof JointInnerEnd) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointOuterBegin) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointOuterEnd) {
              return new Just(StateSP_S.value);
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 691, column 27 - line 695, column 62): " + [t.constructor.name]);
          }
          ;
          if (f instanceof JointOuterEnd) {
            if (t instanceof JointInnerBegin) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointInnerEnd) {
              return new Just(StateSP_N.value);
            }
            ;
            if (t instanceof JointOuterBegin) {
              return new Just(StateSP_S.value);
            }
            ;
            if (t instanceof JointOuterEnd) {
              return Nothing.value;
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 697, column 27 - line 701, column 55): " + [t.constructor.name]);
          }
          ;
          throw new Error("Failed pattern match at Internal.Rails (line 677, column 23 - line 701, column 55): " + [f.constructor.name]);
        };
      };
    },
    isLocked: function(j) {
      return function(s) {
        return function(s$prime) {
          return notEq1(s)(s$prime);
        };
      };
    },
    isBlocked: function(j) {
      return function(s) {
        return function(j$prime) {
          var $376 = notEq1(s)(StateSP_S.value);
          if ($376) {
            return true;
          }
          ;
          if (j$prime instanceof JointInnerBegin) {
            return eq15(j)(JointInnerEnd.value);
          }
          ;
          if (j$prime instanceof JointInnerEnd) {
            return eq15(j)(JointInnerBegin.value);
          }
          ;
          if (j$prime instanceof JointOuterBegin) {
            return eq15(j)(JointOuterEnd.value);
          }
          ;
          if (j$prime instanceof JointOuterEnd) {
            return eq15(j)(JointOuterBegin.value);
          }
          ;
          throw new Error("Failed pattern match at Internal.Rails (line 705, column 30 - line 709, column 70): " + [j$prime.constructor.name]);
        };
      };
    },
    isSimple: false
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
      return noAdditionals(map7(blueRail)(r0));
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
      throw new Error("Failed pattern match at Internal.Rails (line 298, column 26 - line 300, column 23): " + [j.constructor.name]);
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
        throw new Error("Failed pattern match at Internal.Rails (line 301, column 28 - line 303, column 82): " + [j.constructor.name]);
      };
    },
    getRoute: function(s) {
      return function(f) {
        return function(t) {
          var $380 = notEq22(f)(t);
          if ($380) {
            return new Just(s);
          }
          ;
          return Nothing.value;
        };
      };
    },
    isLocked: function(j) {
      return function(s) {
        return function(s$prime) {
          return false;
        };
      };
    },
    isBlocked: function(j) {
      return function(s) {
        return function(j$prime) {
          return true;
        };
      };
    },
    isSimple: true
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
      return noAdditionals(map7(blueRail)(r0));
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
      throw new Error("Failed pattern match at Internal.Rails (line 243, column 28 - line 245, column 25): " + [j.constructor.name]);
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
        throw new Error("Failed pattern match at Internal.Rails (line 246, column 30 - line 248, column 82): " + [j.constructor.name]);
      };
    },
    getRoute: function(s) {
      return function(f) {
        return function(t) {
          var $383 = notEq22(f)(t);
          if ($383) {
            return new Just(s);
          }
          ;
          return Nothing.value;
        };
      };
    },
    isLocked: function(j) {
      return function(s) {
        return function(s$prime) {
          return false;
        };
      };
    },
    isBlocked: function(j) {
      return function(s) {
        return function(j$prime) {
          return true;
        };
      };
    },
    isSimple: true
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
  return toRail3(intSerialize22)({
    name: "doubletowide",
    flipped: false,
    opposed: false,
    getDrawInfo: function(v) {
      if (v.outerturnout) {
        if (v.innerturnout) {
          return noAdditionals(append3(map7(grayRail)(ri))(append3(map7(grayRail)(ro))(map7(blueRail)(rn))));
        }
        ;
        return noAdditionals(append3(map7(grayRail)(ro))(append3(map7(blueRail)(ri))(map7(blueRail)(rn))));
      }
      ;
      if (v.innerturnout) {
        return noAdditionals(append3(map7(grayRail)(ri))(append3(map7(blueRail)(ro))(map7(blueRail)(rn))));
      }
      ;
      return noAdditionals(append3(map7(grayRail)(rn))(append3(map7(blueRail)(ri))(map7(blueRail)(ro))));
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
      throw new Error("Failed pattern match at Internal.Rails (line 957, column 26 - line 961, column 29): " + [j.constructor.name]);
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
            throw new Error("Failed pattern match at Internal.Rails (line 967, column 11 - line 971, column 129): " + [j.constructor.name]);
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
          throw new Error("Failed pattern match at Internal.Rails (line 973, column 11 - line 977, column 129): " + [j.constructor.name]);
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
          throw new Error("Failed pattern match at Internal.Rails (line 981, column 11 - line 985, column 129): " + [j.constructor.name]);
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
        throw new Error("Failed pattern match at Internal.Rails (line 987, column 11 - line 991, column 129): " + [j.constructor.name]);
      };
    },
    getRoute: function(s) {
      return function(f) {
        return function(t) {
          if (f instanceof JointInnerBegin) {
            if (t instanceof JointInnerBegin) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointInnerEnd) {
              return new Just(function() {
                var v = unwrap6(s);
                return {
                  innerturnout: false,
                  outerturnout: v.outerturnout
                };
              }());
            }
            ;
            if (t instanceof JointOuterBegin) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointOuterEnd) {
              return Nothing.value;
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 996, column 27 - line 1000, column 55): " + [t.constructor.name]);
          }
          ;
          if (f instanceof JointInnerEnd) {
            if (t instanceof JointInnerBegin) {
              return new Just(function() {
                var v = unwrap6(s);
                return {
                  innerturnout: false,
                  outerturnout: v.outerturnout
                };
              }());
            }
            ;
            if (t instanceof JointInnerEnd) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointOuterBegin) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointOuterEnd) {
              return new Just(function() {
                var v = unwrap6(s);
                return {
                  innerturnout: true,
                  outerturnout: true
                };
              }());
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 1002, column 27 - line 1006, column 118): " + [t.constructor.name]);
          }
          ;
          if (f instanceof JointOuterBegin) {
            if (t instanceof JointInnerBegin) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointInnerEnd) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointOuterBegin) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointOuterEnd) {
              return new Just(function() {
                var v = unwrap6(s);
                return {
                  innerturnout: v.innerturnout,
                  outerturnout: false
                };
              }());
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 1008, column 27 - line 1012, column 98): " + [t.constructor.name]);
          }
          ;
          if (f instanceof JointOuterEnd) {
            if (t instanceof JointInnerBegin) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointInnerEnd) {
              return new Just(function() {
                var v = unwrap6(s);
                return {
                  innerturnout: true,
                  outerturnout: true
                };
              }());
            }
            ;
            if (t instanceof JointOuterBegin) {
              return new Just(function() {
                var v = unwrap6(s);
                return {
                  innerturnout: v.innerturnout,
                  outerturnout: false
                };
              }());
            }
            ;
            if (t instanceof JointOuterEnd) {
              return Nothing.value;
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 1014, column 27 - line 1018, column 55): " + [t.constructor.name]);
          }
          ;
          throw new Error("Failed pattern match at Internal.Rails (line 994, column 23 - line 1018, column 55): " + [f.constructor.name]);
        };
      };
    },
    isLocked: function(j) {
      return function(s) {
        return function(s$prime) {
          if (j instanceof JointInnerBegin) {
            return unwrap6(s).innerturnout !== unwrap6(s).innerturnout;
          }
          ;
          if (j instanceof JointInnerEnd) {
            return unwrap6(s).innerturnout !== unwrap6(s).innerturnout;
          }
          ;
          if (j instanceof JointOuterBegin) {
            return unwrap6(s).outerturnout !== unwrap6(s).outerturnout;
          }
          ;
          if (j instanceof JointOuterEnd) {
            return unwrap6(s).outerturnout !== unwrap6(s).outerturnout;
          }
          ;
          throw new Error("Failed pattern match at Internal.Rails (line 1020, column 23 - line 1024, column 94): " + [j.constructor.name]);
        };
      };
    },
    isBlocked: function(j) {
      return function(s) {
        return function(j$prime) {
          var $403 = unwrap6(s).innerturnout || unwrap6(s).outerturnout;
          if ($403) {
            return true;
          }
          ;
          if (j$prime instanceof JointInnerBegin) {
            return eq15(j)(JointInnerEnd.value);
          }
          ;
          if (j$prime instanceof JointInnerEnd) {
            return eq15(j)(JointInnerBegin.value);
          }
          ;
          if (j$prime instanceof JointOuterBegin) {
            return eq15(j)(JointOuterEnd.value);
          }
          ;
          if (j$prime instanceof JointOuterEnd) {
            return eq15(j)(JointOuterBegin.value);
          }
          ;
          throw new Error("Failed pattern match at Internal.Rails (line 1027, column 30 - line 1031, column 70): " + [j$prime.constructor.name]);
        };
      };
    },
    isSimple: false
  });
}();
var doubleToWideRRail = /* @__PURE__ */ flipRail(doubleToWideLRail);
var doubleWidthSLRail = /* @__PURE__ */ function() {
  var ps = {
    coord: {
      x: 1,
      y: doubleRailWidth,
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
  var r1 = slipShapes2({
    start: pe,
    end: ps
  });
  var anglep = fromRadian(calcMidAngle2(1)(doubleRailWidth));
  return toRail2({
    name: "doublewidths",
    flipped: false,
    opposed: false,
    getDrawInfo: function(v) {
      return noAdditionals(map7(blueRail)(r1));
    },
    defaultState: StateSolid.value,
    getJoints: serialAll3,
    getStates: serialAll2,
    getOrigin: JointBegin.value,
    getJointPos: function(j) {
      if (j instanceof JointBegin) {
        return pe;
      }
      ;
      if (j instanceof JointEnd) {
        return ps;
      }
      ;
      throw new Error("Failed pattern match at Internal.Rails (line 392, column 28 - line 394, column 25): " + [j.constructor.name]);
    },
    getNewState: function(j) {
      return function(s) {
        if (j instanceof JointEnd) {
          return {
            newjoint: JointBegin.value,
            newstate: s,
            shape: reverseShapes(r1)
          };
        }
        ;
        if (j instanceof JointBegin) {
          return {
            newjoint: JointEnd.value,
            newstate: s,
            shape: r1
          };
        }
        ;
        throw new Error("Failed pattern match at Internal.Rails (line 395, column 30 - line 398, column 58): " + [j.constructor.name]);
      };
    },
    getRoute: function(s) {
      return function(f) {
        return function(t) {
          if (f instanceof JointBegin) {
            if (t instanceof JointBegin) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointEnd) {
              return new Just(s);
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 403, column 27 - line 405, column 49): " + [t.constructor.name]);
          }
          ;
          if (f instanceof JointEnd) {
            if (t instanceof JointBegin) {
              return new Just(s);
            }
            ;
            if (t instanceof JointEnd) {
              return Nothing.value;
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 407, column 27 - line 409, column 50): " + [t.constructor.name]);
          }
          ;
          throw new Error("Failed pattern match at Internal.Rails (line 401, column 23 - line 409, column 50): " + [f.constructor.name]);
        };
      };
    },
    isLocked: function(j) {
      return function(s) {
        return function(s$prime) {
          return false;
        };
      };
    },
    isBlocked: function(j) {
      return function(s) {
        return function(j$prime) {
          return true;
        };
      };
    },
    isSimple: true
  });
}();
var doubleWidthSRRail = /* @__PURE__ */ flipRail(doubleWidthSLRail);
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
        return noAdditionals(join3([map7(grayRail)(r0), map7(blueRail)(r1)]));
      }
      ;
      return noAdditionals(join3([map7(grayRail)(r1), map7(blueRail)(r0)]));
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
      throw new Error("Failed pattern match at Internal.Rails (line 572, column 28 - line 575, column 25): " + [j.constructor.name]);
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
        throw new Error("Failed pattern match at Internal.Rails (line 576, column 43 - line 582, column 73): " + [j.constructor.name]);
      };
    },
    getRoute: function(s) {
      return function(f) {
        return function(t) {
          if (f instanceof JointEnter) {
            if (t instanceof JointEnter) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointMain) {
              return new Just(function() {
                var v = unwrap6(s);
                return {
                  turnout: false
                };
              }());
            }
            ;
            if (t instanceof JointSub) {
              return new Just(function() {
                var v = unwrap6(s);
                return {
                  turnout: true
                };
              }());
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 587, column 27 - line 590, column 89): " + [t.constructor.name]);
          }
          ;
          if (f instanceof JointMain) {
            if (t instanceof JointEnter) {
              return new Just(function() {
                var v = unwrap6(s);
                return {
                  turnout: false
                };
              }());
            }
            ;
            if (t instanceof JointMain) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointSub) {
              return Nothing.value;
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 592, column 27 - line 595, column 50): " + [t.constructor.name]);
          }
          ;
          if (f instanceof JointSub) {
            if (t instanceof JointEnter) {
              return new Just(function() {
                var v = unwrap6(s);
                return {
                  turnout: true
                };
              }());
            }
            ;
            if (t instanceof JointMain) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointSub) {
              return Nothing.value;
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 597, column 27 - line 600, column 50): " + [t.constructor.name]);
          }
          ;
          throw new Error("Failed pattern match at Internal.Rails (line 585, column 23 - line 600, column 50): " + [f.constructor.name]);
        };
      };
    },
    isLocked: function(j) {
      return function(s) {
        return function(s$prime) {
          return unwrap6(s).turnout !== unwrap6(s$prime).turnout;
        };
      };
    },
    isBlocked: function(j) {
      return function(s) {
        return function(j$prime) {
          return true;
        };
      };
    },
    isSimple: false
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
  return toRail1(intSerialize32)({
    name: "autoturnout",
    flipped: false,
    opposed: false,
    getDrawInfo: function(v) {
      if (v.auto) {
        if (v.turnout) {
          return noAdditionals(join3([map7(function(s1) {
            return {
              color: "#33a",
              shape: s1
            };
          })(r0), map7(blueRail)(r_), map7(blueRail)(r1)]));
        }
        ;
        return noAdditionals(join3([map7(function(s1) {
          return {
            color: "#33a",
            shape: s1
          };
        })(r1), map7(blueRail)(r_), map7(blueRail)(r0)]));
      }
      ;
      if (v.turnout) {
        return noAdditionals(join3([map7(function(s1) {
          return {
            color: "#866",
            shape: s1
          };
        })(r0), map7(blueRail)(r_), map7(blueRail)(r1)]));
      }
      ;
      return noAdditionals(join3([map7(function(s1) {
        return {
          color: "#866",
          shape: s1
        };
      })(r1), map7(blueRail)(r_), map7(blueRail)(r0)]));
    },
    defaultState: {
      turnout: false,
      auto: true
    },
    getJoints: serialAll4,
    getStates: serialAll(intSerialize32),
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
      throw new Error("Failed pattern match at Internal.Rails (line 501, column 26 - line 504, column 23): " + [j.constructor.name]);
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
        throw new Error("Failed pattern match at Internal.Rails (line 505, column 38 - line 517, column 79): " + [j.constructor.name]);
      };
    },
    getRoute: function(s) {
      return function(f) {
        return function(t) {
          if (f instanceof JointEnter) {
            if (t instanceof JointEnter) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointMain) {
              return new Just(function() {
                var v = unwrap6(s);
                return {
                  turnout: false,
                  auto: false
                };
              }());
            }
            ;
            if (t instanceof JointSub) {
              return new Just(function() {
                var v = unwrap6(s);
                return {
                  turnout: true,
                  auto: false
                };
              }());
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 522, column 25 - line 525, column 98): " + [t.constructor.name]);
          }
          ;
          if (f instanceof JointMain) {
            if (t instanceof JointEnter) {
              return new Just(function() {
                var v = unwrap6(s);
                return {
                  turnout: false,
                  auto: false
                };
              }());
            }
            ;
            if (t instanceof JointMain) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointSub) {
              return Nothing.value;
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 527, column 25 - line 530, column 48): " + [t.constructor.name]);
          }
          ;
          if (f instanceof JointSub) {
            if (t instanceof JointEnter) {
              return new Just(function() {
                var v = unwrap6(s);
                return {
                  turnout: true,
                  auto: false
                };
              }());
            }
            ;
            if (t instanceof JointMain) {
              return Nothing.value;
            }
            ;
            if (t instanceof JointSub) {
              return Nothing.value;
            }
            ;
            throw new Error("Failed pattern match at Internal.Rails (line 532, column 25 - line 535, column 48): " + [t.constructor.name]);
          }
          ;
          throw new Error("Failed pattern match at Internal.Rails (line 520, column 21 - line 535, column 48): " + [f.constructor.name]);
        };
      };
    },
    isLocked: function(j) {
      return function(s) {
        return function(s$prime) {
          return unwrap6(s).turnout !== unwrap6(s$prime).turnout;
        };
      };
    },
    isBlocked: function(j) {
      return function(s) {
        return function(j$prime) {
          return true;
        };
      };
    },
    isSimple: false
  });
}();
var autoTurnOutRPlusRail = /* @__PURE__ */ flipRail(autoTurnOutLPlusRail);

// output/Main/index.js
var eq4 = /* @__PURE__ */ eq(eqNumber);
var unwrap7 = /* @__PURE__ */ unwrap();
var eq16 = /* @__PURE__ */ eq(eqAngle);
var notEq4 = /* @__PURE__ */ notEq(eqAngle);
var map8 = /* @__PURE__ */ map(functorArray);
var map15 = /* @__PURE__ */ map(functorMaybe);
var identity5 = /* @__PURE__ */ identity(categoryFn);
var map24 = /* @__PURE__ */ map(functorFn);
var max3 = /* @__PURE__ */ max(ordInt);
var sort2 = /* @__PURE__ */ sort(ordInt);
var bind3 = /* @__PURE__ */ bind(bindArray);
var pure3 = /* @__PURE__ */ pure(applicativeArray);
var splitSize = function(shape) {
  var $47 = on(eq4)(function(p) {
    return unwrap7(unwrap7(p).coord).z;
  })(unwrap7(shape).start)(unwrap7(shape).end) && eq16(reverseAngle(unwrap7(unwrap7(shape).start).angle))(unwrap7(unwrap7(shape).end).angle);
  if ($47) {
    return 1;
  }
  ;
  return 5;
};
var shapeToData = function(v) {
  var a2 = toRadian(v.end.angle);
  var a1 = toRadian(reverseAngle(v.start.angle));
  var $51 = eq16(reverseAngle(v.start.angle))(v.end.angle);
  if ($51) {
    return unsafeToForeign({
      type: "straight",
      angle: a1,
      start: v.start,
      end: v.end
    });
  }
  ;
  var _r = (cos(a1) * (unwrap7(v.end.coord).x - unwrap7(v.start.coord).x) + sin(a1) * (unwrap7(v.end.coord).y - unwrap7(v.start.coord).y)) / sin(a2 - a1);
  var a1$prime = a1 - pi / 2 * sign(_r);
  var a2$prime = a2 - pi / 2 * sign(_r);
  var r = abs(_r);
  var x0 = unwrap7(v.start.coord).x - r * cos(a1$prime);
  var y0 = unwrap7(v.start.coord).y - r * sin(a1$prime);
  return unsafeToForeign({
    type: "arc",
    center: {
      x: x0,
      y: y0,
      z: (unwrap7(v.start.coord).z + unwrap7(v.end.coord).z) / 2
    },
    radius: r,
    startangle: a1$prime,
    endangle: a1$prime
  });
};
var rails = [autoTurnOutLPlusRail, curveLRail, slopeRail, slopeCurveLRail, straightRail, halfRail, quarterRail, converterRail, turnOutLPlusRail, outerCurveLRail, toDoubleLPlusRail, scissorsRail, doubleToWideLRail, doubleTurnoutLPlusRail, longRail, doubleWidthSLRail];
var isArc = function(shape) {
  return notEq4(reverseAngle(unwrap7(unwrap7(shape).start).angle))(unwrap7(unwrap7(shape).end).angle);
};
var encodeRoute = function(v) {
  return {
    nodeid: v.nodeid,
    jointid: v.jointid,
    railinstance: unwrap7(v.railinstance).instanceid,
    shapes: v.shapes,
    length: v.length
  };
};
var encodeTrainset = function(v) {
  return {
    types: v.types,
    route: map8(encodeRoute)(v.route),
    distanceToNext: v.distanceToNext,
    distanceFromOldest: v.distanceFromOldest,
    speed: v.speed,
    trainid: v.trainid,
    flipped: v.flipped
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
    pos: v.pos,
    signals: v.signals,
    wrongways: v.wrongways
  };
};
var encodeLayout = function(v) {
  return {
    rails: map8(encodeRailInstance)(v.rails),
    trains: map8(encodeTrainset)(v.trains),
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
    pos: reversePos(poszero),
    signals: [],
    wrongways: []
  };
  var jrel = function(i) {
    return unwrap7(unwrap7(node.rail).getJointPos(i));
  };
  return function(l) {
    return foldl2(function(l$prime) {
      return function(j) {
        return addJoint(l$prime)(jrel(j))(node.nodeid)(j);
      };
    })(l)(unwrap7(node.rail).getJoints);
  }({
    instancecount: 1,
    traincount: 0,
    updatecount: 0,
    rails: [rinst],
    trains: [],
    traffic: [],
    signalcolors: [],
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
      pos: reversePos(poszero),
      signals: [],
      wrongways: []
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
      route: map8(decodeRoute(rs))(v.route),
      distanceToNext: v.distanceToNext,
      distanceFromOldest: v.distanceFromOldest,
      speed: v.speed,
      trainid: v.trainid,
      flipped: v.flipped
    };
  };
};
var decodeRail = function(v) {
  return map15(function() {
    var $141 = function() {
      if (v.opposed) {
        return opposeRail;
      }
      ;
      return identity5;
    }();
    var $142 = function() {
      if (v.flipped) {
        return flipRail;
      }
      ;
      return identity5;
    }();
    return function($143) {
      return $141($142($143));
    };
  }())(find2(function(v1) {
    return v1.name === v.name;
  })(rails));
};
var decodeRailNode = function(v) {
  return map15(map24(RailNode)(function(v1) {
    return {
      nodeid: v.nodeid,
      rail: v1,
      state: v.state,
      connections: v.connections
    };
  }))(decodeRail(v.rail));
};
var decodeRailInstance = function(v) {
  return map15(map24(RailInstance)(function(v1) {
    return {
      node: v1,
      instanceid: v.instanceid,
      pos: v.pos,
      signals: v.signals,
      wrongways: v.wrongways
    };
  }))(decodeRailNode(v.node));
};
var decodeLayout$prime = function(v) {
  var rawrails = map8(decodeRailInstance)(v.rails);
  var rs = catMaybes(rawrails);
  var ts = map8(decodeTrainset(rs))(v.trains);
  var l0 = {
    jointData: saEmpty,
    rails: map8(function(v12) {
      return {
        node: v12.node,
        instanceid: unwrap7(v12.node).nodeid,
        signals: v12.signals,
        wrongways: v12.wrongways,
        pos: v12.pos
      };
    })(rs),
    trains: ts,
    updatecount: 0,
    instancecount: length(rs),
    traincount: 1 + foldl2(function(x) {
      return function(v12) {
        return max3(x)(v12.trainid);
      };
    })(-1 | 0)(ts) | 0,
    version: v.version,
    traffic: [],
    signalcolors: []
  };
  var deleted = function() {
    var $144 = map8(function(r) {
      return r.index;
    });
    var $145 = filter(function(r) {
      return r.isdeleted;
    });
    return function($146) {
      return $144($145($146));
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
    pos: reversePos(poszero),
    signals: [],
    wrongways: []
  };
  var v1 = foldl2(removeRail)(l0)(reverse(sort2(deleted)));
  var joints = bind3(v1.rails)(function(v22) {
    var nodeid = unwrap7(v22.node).nodeid;
    return bind3(unwrap7(unwrap7(v22.node).rail).getJoints)(function(jointid) {
      return bind3(maybe([])(pure3)(getJointAbsPos(v1)(nodeid)(jointid)))(function(pos) {
        return pure3({
          nodeid,
          jointid,
          pos
        });
      });
    });
  });
  var v2 = updateSignalRoutes(foldl2(function(l) {
    return function(j) {
      return addJoint(l)(j.pos)(j.nodeid)(j.jointid);
    };
  })(v1)(joints));
  var $131 = length(v2.rails) === 0;
  if ($131) {
    return defaultLayout;
  }
  ;
  return v2;
};
var decodeLayout = function(v) {
  return decodeLayout$prime({
    rails: map8(unsafeFromForeign)(v.rails),
    trains: function() {
      var $136 = isArray(v.trains);
      if ($136) {
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
  Signal,
  SignalRoute,
  StateAP,
  StateCO,
  StateDP,
  StatePoint,
  StateSP_N,
  StateSP_P,
  StateSP_S,
  StateSolid,
  Trainset,
  TrainsetDrawInfo,
  absDrawInfo,
  absParts,
  absShape,
  addJoint,
  addRail,
  addSignal,
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
  doubleWidthSLRail,
  doubleWidthSRRail,
  encodeLayout,
  flipRail,
  flipTrain,
  forceUpdate,
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
  layoutUpdate,
  longRail,
  opposeRail,
  outerCurveLRail,
  outerCurveRRail,
  partLength,
  poszero,
  quarterRail,
  railShape,
  removeRail,
  removeSignal,
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
  turnOutRPlusRail,
  updateSignalColor,
  updateSignalRoutes,
  updateTraffic
};
