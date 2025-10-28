// output-es/runtime.js
function fail() {
  throw new Error("Failed pattern match");
}
function intDiv(x, y) {
  if (y > 0) return Math.floor(x / y);
  if (y < 0) return -Math.floor(x / -y);
  return 0;
}

// output-es/Record.Unsafe/foreign.js
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

// output-es/Type.Proxy/index.js
var $$$Proxy = () => ({ tag: "Proxy" });
var $$Proxy = /* @__PURE__ */ $$$Proxy();

// output-es/Data.Show/foreign.js
var showIntImpl = function(n) {
  return n.toString();
};

// output-es/Data.Generic.Rep/index.js
var $NoArguments = () => ({ tag: "NoArguments" });
var $Sum = (tag, _1) => ({ tag, _1 });
var NoArguments = /* @__PURE__ */ $NoArguments();

// output-es/Data.Ordering/index.js
var $Ordering = (tag) => tag;
var LT = /* @__PURE__ */ $Ordering("LT");
var GT = /* @__PURE__ */ $Ordering("GT");
var EQ = /* @__PURE__ */ $Ordering("EQ");

// output-es/Data.Maybe/index.js
var $Maybe = (tag, _1) => ({ tag, _1 });
var Nothing = /* @__PURE__ */ $Maybe("Nothing");
var Just = (value0) => $Maybe("Just", value0);
var fromJust = () => (v) => {
  if (v.tag === "Just") {
    return v._1;
  }
  fail();
};

// output-es/Data.Functor/foreign.js
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

// output-es/Control.Apply/foreign.js
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

// output-es/Control.Bind/foreign.js
var arrayBind = function(arr) {
  return function(f) {
    var result = [];
    for (var i = 0, l = arr.length; i < l; i++) {
      Array.prototype.push.apply(result, f(arr[i]));
    }
    return result;
  };
};

// output-es/Control.Bind/index.js
var identity = (x) => x;

// output-es/Data.Either/index.js
var $Either = (tag, _1) => ({ tag, _1 });
var Left = (value0) => $Either("Left", value0);
var Right = (value0) => $Either("Right", value0);

// output-es/Data.Identity/index.js
var Identity = (x) => x;
var functorIdentity = { map: (f) => (m) => f(m) };
var applyIdentity = { apply: (v) => (v1) => v(v1), Functor0: () => functorIdentity };
var bindIdentity = { bind: (v) => (f) => f(v), Apply0: () => applyIdentity };
var applicativeIdentity = { pure: Identity, Apply0: () => applyIdentity };
var monadIdentity = { Applicative0: () => applicativeIdentity, Bind1: () => bindIdentity };

// output-es/Data.Foldable/foreign.js
var foldrArray = function(f) {
  return function(init) {
    return function(xs) {
      var acc = init;
      var len = xs.length;
      for (var i = len - 1; i >= 0; i--) {
        acc = f(xs[i])(acc);
      }
      return acc;
    };
  };
};
var foldlArray = function(f) {
  return function(init) {
    return function(xs) {
      var acc = init;
      var len = xs.length;
      for (var i = 0; i < len; i++) {
        acc = f(acc)(xs[i]);
      }
      return acc;
    };
  };
};

// output-es/Data.Foldable/index.js
var foldableArray = {
  foldr: foldrArray,
  foldl: foldlArray,
  foldMap: (dictMonoid) => {
    const mempty = dictMonoid.mempty;
    return (f) => foldableArray.foldr((x) => (acc) => dictMonoid.Semigroup0().append(f(x))(acc))(mempty);
  }
};

// output-es/Data.Tuple/index.js
var $Tuple = (_1, _2) => ({ tag: "Tuple", _1, _2 });
var Tuple = (value0) => (value1) => $Tuple(value0, value1);
var snd = (v) => v._2;
var fst = (v) => v._1;

// output-es/Data.FunctorWithIndex/foreign.js
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

// output-es/Data.Eq/foreign.js
var refEq = function(r1) {
  return function(r2) {
    return r1 === r2;
  };
};
var eqIntImpl = refEq;
var eqNumberImpl = refEq;

// output-es/Data.Eq/index.js
var eqNumber = { eq: eqNumberImpl };
var eqInt = { eq: eqIntImpl };

// output-es/Data.Ord/foreign.js
var unsafeCompareImpl = function(lt) {
  return function(eq) {
    return function(gt) {
      return function(x) {
        return function(y) {
          return x < y ? lt : x === y ? eq : gt;
        };
      };
    };
  };
};
var ordIntImpl = unsafeCompareImpl;
var ordNumberImpl = unsafeCompareImpl;

// output-es/Data.Ord/index.js
var ordNumber = { compare: /* @__PURE__ */ ordNumberImpl(LT)(EQ)(GT), Eq0: () => eqNumber };
var ordInt = { compare: /* @__PURE__ */ ordIntImpl(LT)(EQ)(GT), Eq0: () => eqInt };

// output-es/Unsafe.Coerce/foreign.js
var unsafeCoerce = function(x) {
  return x;
};

// output-es/Data.Array/foreign.js
var rangeImpl = function(start, end) {
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
var replicateFill = function(count, value) {
  if (count < 1) {
    return [];
  }
  var result = new Array(count);
  return result.fill(value);
};
var replicatePolyfill = function(count, value) {
  var result = [];
  var n = 0;
  for (var i = 0; i < count; i++) {
    result[n++] = value;
  }
  return result;
};
var replicateImpl = typeof Array.prototype.fill === "function" ? replicateFill : replicatePolyfill;
var unconsImpl = function(empty, next, xs) {
  return xs.length === 0 ? empty({}) : next(xs[0])(xs.slice(1));
};
var findIndexImpl = function(just, nothing, f, xs) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (f(xs[i])) return just(i);
  }
  return nothing;
};
var findLastIndexImpl = function(just, nothing, f, xs) {
  for (var i = xs.length - 1; i >= 0; i--) {
    if (f(xs[i])) return just(i);
  }
  return nothing;
};
var _insertAt = function(just, nothing, i, a, l) {
  if (i < 0 || i > l.length) return nothing;
  var l1 = l.slice();
  l1.splice(i, 0, a);
  return just(l1);
};
var _deleteAt = function(just, nothing, i, l) {
  if (i < 0 || i >= l.length) return nothing;
  var l1 = l.slice();
  l1.splice(i, 1);
  return just(l1);
};
var _updateAt = function(just, nothing, i, a, l) {
  if (i < 0 || i >= l.length) return nothing;
  var l1 = l.slice();
  l1[i] = a;
  return just(l1);
};
var reverse = function(l) {
  return l.slice().reverse();
};
var filterImpl = function(f, xs) {
  return xs.filter(f);
};
var sortByImpl2 = /* @__PURE__ */ (function() {
  function mergeFromTo(compare, fromOrdering, xs1, xs2, from, to) {
    var mid;
    var i;
    var j;
    var k;
    var x;
    var y;
    var c;
    mid = from + (to - from >> 1);
    if (mid - from > 1) mergeFromTo(compare, fromOrdering, xs2, xs1, from, mid);
    if (to - mid > 1) mergeFromTo(compare, fromOrdering, xs2, xs1, mid, to);
    i = from;
    j = mid;
    k = from;
    while (i < mid && j < to) {
      x = xs2[i];
      y = xs2[j];
      c = fromOrdering(compare(x)(y));
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
    while (j < to) {
      xs1[k++] = xs2[j++];
    }
  }
  return function(compare, fromOrdering, xs) {
    var out;
    if (xs.length < 2) return xs;
    out = xs.slice(0);
    mergeFromTo(compare, fromOrdering, out, xs.slice(0), 0, xs.length);
    return out;
  };
})();
var sliceImpl = function(s, e, l) {
  return l.slice(s, e);
};
var zipWithImpl = function(f, xs, ys) {
  var l = xs.length < ys.length ? xs.length : ys.length;
  var result = new Array(l);
  for (var i = 0; i < l; i++) {
    result[i] = f(xs[i])(ys[i]);
  }
  return result;
};
var anyImpl = function(p, xs) {
  var len = xs.length;
  for (var i = 0; i < len; i++) {
    if (p(xs[i])) return true;
  }
  return false;
};
var allImpl = function(p, xs) {
  var len = xs.length;
  for (var i = 0; i < len; i++) {
    if (!p(xs[i])) return false;
  }
  return true;
};

// output-es/Data.Array/index.js
var sortBy = (comp) => ($0) => sortByImpl2(
  comp,
  (v) => {
    if (v === "GT") {
      return 1;
    }
    if (v === "EQ") {
      return 0;
    }
    if (v === "LT") {
      return -1;
    }
    fail();
  },
  $0
);
var sortWith = (dictOrd) => (f) => sortBy((x) => (y) => dictOrd.compare(f(x))(f(y)));
var unsnoc = (xs) => {
  if (xs.length === 0) {
    const $02 = xs.length - 1 | 0;
    return Nothing;
  }
  const $0 = xs.length - 1 | 0;
  if ($0 >= 0 && $0 < xs.length) {
    return $Maybe("Just", { init: sliceImpl(0, xs.length - 1 | 0, xs), last: xs[$0] });
  }
  return Nothing;
};
var modifyAt = (i) => (f) => (xs) => {
  if (i >= 0 && i < xs.length) {
    return _updateAt(Just, Nothing, i, f(xs[i]), xs);
  }
  return Nothing;
};
var nubBy = (comp) => (xs) => {
  const indexedAndSorted = sortBy((x) => (y) => comp(x._2)(y._2))(mapWithIndexArray(Tuple)(xs));
  if (0 < indexedAndSorted.length) {
    return arrayMap(snd)(sortWith(ordInt)(fst)((() => {
      const result = [indexedAndSorted[0]];
      for (const v1 of indexedAndSorted) {
        const $0 = comp((() => {
          const $02 = result.length - 1 | 0;
          if ($02 >= 0 && $02 < result.length) {
            return result[$02]._2;
          }
          fail();
        })())(v1._2);
        if ($0 === "LT" || $0 === "GT" || $0 !== "EQ") {
          result.push(v1);
        }
      }
      return result;
    })()));
  }
  return [];
};
var insertBy = (cmp) => (x) => (ys) => {
  const $0 = _insertAt(
    Just,
    Nothing,
    (() => {
      const $02 = findLastIndexImpl(Just, Nothing, (y) => cmp(x)(y) === "GT", ys);
      if ($02.tag === "Nothing") {
        return 0;
      }
      if ($02.tag === "Just") {
        return $02._1 + 1 | 0;
      }
      fail();
    })(),
    x,
    ys
  );
  if ($0.tag === "Just") {
    return $0._1;
  }
  fail();
};
var find = (f) => (xs) => {
  const $0 = findIndexImpl(Just, Nothing, f, xs);
  if ($0.tag === "Just") {
    return $Maybe("Just", xs[$0._1]);
  }
  return Nothing;
};
var filter = ($0) => ($1) => filterImpl($0, $1);
var elem = (dictEq) => (a) => (arr) => {
  const $0 = findIndexImpl(Just, Nothing, (v) => dictEq.eq(v)(a), arr);
  if ($0.tag === "Nothing") {
    return false;
  }
  if ($0.tag === "Just") {
    return true;
  }
  fail();
};
var concatMap = (b) => (a) => arrayBind(a)(b);
var mapMaybe = (f) => concatMap((x) => {
  const $0 = f(x);
  if ($0.tag === "Nothing") {
    return [];
  }
  if ($0.tag === "Just") {
    return [$0._1];
  }
  fail();
});

// output-es/Data.Number/foreign.js
var infinity = Infinity;
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

// output-es/Data.Int/foreign.js
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
var fromStringAsImpl = function(just) {
  return function(nothing) {
    return function(radix) {
      var digits;
      if (radix < 11) {
        digits = "[0-" + (radix - 1).toString() + "]";
      } else if (radix === 11) {
        digits = "[0-9a]";
      } else {
        digits = "[0-9a-" + String.fromCharCode(86 + radix) + "]";
      }
      var pattern = new RegExp("^[\\+\\-]?" + digits + "+$", "i");
      return function(s) {
        if (pattern.test(s)) {
          var i = parseInt(s, radix);
          return (i | 0) === i ? just(i) : nothing;
        } else {
          return nothing;
        }
      };
    };
  };
};

// output-es/Data.Int/index.js
var fromStringAs = /* @__PURE__ */ fromStringAsImpl(Just)(Nothing);
var fromString = /* @__PURE__ */ fromStringAs(10);
var fromNumber = /* @__PURE__ */ fromNumberImpl(Just)(Nothing);
var unsafeClamp = (x) => {
  if (!isFiniteImpl(x)) {
    return 0;
  }
  if (x >= toNumber(2147483647)) {
    return 2147483647;
  }
  if (x <= toNumber(-2147483648)) {
    return -2147483648;
  }
  const $0 = fromNumber(x);
  if ($0.tag === "Nothing") {
    return 0;
  }
  if ($0.tag === "Just") {
    return $0._1;
  }
  fail();
};

// output-es/Data.String.Common/foreign.js
var split = function(sep) {
  return function(s) {
    return s.split(sep);
  };
};

// output-es/Data.String.Regex/foreign.js
var regexImpl = function(left) {
  return function(right) {
    return function(s1) {
      return function(s2) {
        try {
          return right(new RegExp(s1, s2));
        } catch (e) {
          return left(e.message);
        }
      };
    };
  };
};
var source = function(r) {
  return r.source;
};
var test = function(r) {
  return function(s) {
    var lastIndex = r.lastIndex;
    var result = r.test(s);
    r.lastIndex = lastIndex;
    return result;
  };
};
var replace2 = function(r) {
  return function(s1) {
    return function(s2) {
      return s2.replace(r, s1);
    };
  };
};

// output-es/Data.String.Regex/index.js
var regex = (s) => (f) => regexImpl(Left)(Right)(s)((f.global ? "g" : "") + (f.ignoreCase ? "i" : "") + (f.multiline ? "m" : "") + (f.dotAll ? "s" : "") + (f.sticky ? "y" : "") + (f.unicode ? "u" : ""));

// output-es/Data.String.Regex.Flags/index.js
var noFlags = { global: false, ignoreCase: false, multiline: false, dotAll: false, sticky: false, unicode: false };
var global = { global: true, ignoreCase: false, multiline: false, dotAll: false, sticky: false, unicode: false };

// output-es/Partial/foreign.js
var _crashWith = function(msg) {
  throw new Error(msg);
};

// output-es/Data.String.Regex.Unsafe/index.js
var unsafeRegex = (s) => (f) => {
  const $0 = regex(s)(f);
  if ($0.tag === "Left") {
    return _crashWith($0._1);
  }
  if ($0.tag === "Right") {
    return $0._1;
  }
  fail();
};

// output-es/Control.Monad.Except.Trans/index.js
var bindExceptT = (dictMonad) => ({
  bind: (v) => (k) => dictMonad.Bind1().bind(v)((v2) => {
    if (v2.tag === "Left") {
      return dictMonad.Applicative0().pure($Either("Left", v2._1));
    }
    if (v2.tag === "Right") {
      return k(v2._1);
    }
    fail();
  }),
  Apply0: () => applyExceptT(dictMonad)
});
var applyExceptT = (dictMonad) => {
  const $0 = dictMonad.Bind1().Apply0().Functor0();
  const functorExceptT1 = {
    map: (f) => $0.map((m) => {
      if (m.tag === "Left") {
        return $Either("Left", m._1);
      }
      if (m.tag === "Right") {
        return $Either("Right", f(m._1));
      }
      fail();
    })
  };
  return {
    apply: (() => {
      const $1 = bindExceptT(dictMonad);
      return (f) => (a) => $1.bind(f)((f$p) => $1.bind(a)((a$p) => applicativeExceptT(dictMonad).pure(f$p(a$p))));
    })(),
    Functor0: () => functorExceptT1
  };
};
var applicativeExceptT = (dictMonad) => ({ pure: (x) => dictMonad.Applicative0().pure($Either("Right", x)), Apply0: () => applyExceptT(dictMonad) });
var monadThrowExceptT = (dictMonad) => {
  const monadExceptT1 = { Applicative0: () => applicativeExceptT(dictMonad), Bind1: () => bindExceptT(dictMonad) };
  return { throwError: (x) => dictMonad.Applicative0().pure($Either("Left", x)), Monad0: () => monadExceptT1 };
};

// output-es/Data.NonEmpty/index.js
var $NonEmpty = (_1, _2) => ({ tag: "NonEmpty", _1, _2 });

// output-es/Data.List.Types/index.js
var $List = (tag, _1, _2) => ({ tag, _1, _2 });
var Nil = /* @__PURE__ */ $List("Nil");

// output-es/Foreign/foreign.js
function tagOf(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}
function isNull(value) {
  return value === null;
}
function isUndefined(value) {
  return value === void 0;
}
var isArray = Array.isArray || function(value) {
  return Object.prototype.toString.call(value) === "[object Array]";
};

// output-es/Foreign/index.js
var $ForeignError = (tag, _1, _2) => ({ tag, _1, _2 });
var unsafeReadTagged = (dictMonad) => (tag) => (value) => {
  if (tagOf(value) === tag) {
    return applicativeExceptT(dictMonad).pure(value);
  }
  return monadThrowExceptT(dictMonad).throwError($NonEmpty($ForeignError("TypeMismatch", tag, tagOf(value)), Nil));
};

// output-es/Data.FoldableWithIndex/index.js
var foldableWithIndexArray = {
  foldrWithIndex: (f) => (z) => {
    const $0 = foldrArray((v) => {
      const $02 = v._1;
      const $12 = v._2;
      return (y) => f($02)($12)(y);
    })(z);
    const $1 = mapWithIndexArray(Tuple);
    return (x) => $0($1(x));
  },
  foldlWithIndex: (f) => (z) => {
    const $0 = foldlArray((y) => (v) => f(v._1)(y)(v._2))(z);
    const $1 = mapWithIndexArray(Tuple);
    return (x) => $0($1(x));
  },
  foldMapWithIndex: (dictMonoid) => {
    const mempty = dictMonoid.mempty;
    return (f) => foldableWithIndexArray.foldrWithIndex((i) => (x) => (acc) => dictMonoid.Semigroup0().append(f(i)(x))(acc))(mempty);
  },
  Foldable0: () => foldableArray
};

// output-es/Data.HeytingAlgebra/foreign.js
var boolConj = function(b1) {
  return function(b2) {
    return b1 && b2;
  };
};

// output-es/Data.Semiring/foreign.js
var numAdd = function(n1) {
  return function(n2) {
    return n1 + n2;
  };
};

// output-es/Internal.Types.Pos/index.js
var poszero = { coord: { x: 0, y: 0, z: 0 }, angle: 0, isPlus: false };
var planeDistance = (v) => (v1) => sqrt(pow(v1.coord.x - v.coord.x)(2) + pow(v1.coord.y - v.coord.y)(2));
var angleSub = (v) => (v1) => {
  const $0 = v - v1;
  const tmp = $0 - floor($0 / 6.283185307179586) * 6.283185307179586;
  if (tmp > 3.141592653589793) {
    return tmp - 6.283185307179586;
  }
  return tmp;
};
var convertRelPos = (v) => (v1) => ({
  coord: {
    x: cos(v.angle + 3.141592653589793) * (v1.coord.x - v.coord.x) + sin(v.angle + 3.141592653589793) * (v1.coord.y - v.coord.y),
    y: cos(v.angle + 3.141592653589793) * (v1.coord.y - v.coord.y) - sin(v.angle + 3.141592653589793) * (v1.coord.x - v.coord.x),
    z: v1.coord.z - v.coord.z
  },
  angle: v1.angle - (v.angle + 3.141592653589793),
  isPlus: v.isPlus === v1.isPlus
});
var toAbsPos = (v) => (v1) => ({
  coord: {
    x: v.coord.x + (cos(v.angle + 3.141592653589793) * v1.coord.x - sin(v.angle + 3.141592653589793) * v1.coord.y),
    y: v.coord.y + cos(v.angle + 3.141592653589793) * v1.coord.y + sin(v.angle + 3.141592653589793) * v1.coord.x,
    z: v.coord.z + v1.coord.z
  },
  angle: v.angle + v1.angle + 3.141592653589793,
  isPlus: v1.isPlus
});
var eqAngle = {
  eq: (v) => (v1) => {
    const r = abs((() => {
      const $0 = v - v1;
      return $0 - floor($0 / 6.283185307179586) * 6.283185307179586;
    })());
    return r < 0.01 || abs(r - 6.283185307179586) < 0.01;
  }
};
var canJoin = (p1) => (p2) => eqAngle.eq(p1.angle + 3.141592653589793)(p2.angle) && planeDistance(p1)(p2) < 0.05 && p1.coord.z === p2.coord.z && p1.isPlus !== p2.isPlus;
var getDividingPoint_rel = (v) => (v1) => (width) => (t) => {
  const a1 = v.angle + 3.141592653589793;
  const at = a1 + angleSub(v1.angle)(v.angle + 3.141592653589793) * t;
  if (eqAngle.eq(v.angle + 3.141592653589793)(v1.angle)) {
    return {
      angle: v1.angle,
      isPlus: v1.isPlus,
      coord: {
        x: v.coord.x * (1 - t) + v1.coord.x * t + width * sin(a1),
        y: v.coord.y * (1 - t) + v1.coord.y * t - width * cos(a1),
        z: v.coord.z + (v1.coord.z - v.coord.z) * (1 - cos(t * 3.141592653589793)) / 2
      }
    };
  }
  const _r = (cos(a1) * (v1.coord.x - v.coord.x) + sin(a1) * (v1.coord.y - v.coord.y)) / sin(v1.angle - a1);
  const a1$p = a1 - 1.5707963267948966 * sign(_r);
  const at$p = at - 1.5707963267948966 * sign(_r);
  const r = abs(_r);
  return {
    angle: at,
    isPlus: v1.isPlus,
    coord: {
      x: v.coord.x - r * cos(a1$p) + r * cos(at$p) + width * sin(at),
      y: v.coord.y - r * sin(a1$p) + r * sin(at$p) - width * cos(at),
      z: v.coord.z * (1 - t) + v1.coord.z * t
    }
  };
};
var partLength = (v) => (v1) => {
  const a1 = v.angle + 3.141592653589793;
  return sqrt(pow(v1.coord.z - v.coord.z)(2) + pow(eqAngle.eq(v.angle + 3.141592653589793)(v1.angle) ? planeDistance(v)(v1) : abs((cos(a1) * (v1.coord.x - v.coord.x) + sin(a1) * (v1.coord.y - v.coord.y)) / sin(v1.angle - a1) * angleSub(v1.angle)(v.angle + 3.141592653589793)))(2));
};

// output-es/Internal.Types.Rail/index.js
var $ColorType = (tag) => tag;
var ColorActive = /* @__PURE__ */ $ColorType("ColorActive");
var ColorPassive = /* @__PURE__ */ $ColorType("ColorPassive");
var ColorAuto = /* @__PURE__ */ $ColorType("ColorAuto");
var ColorFixed = /* @__PURE__ */ $ColorType("ColorFixed");
var eqIntJoint = { eq: (x) => (y) => x === y };
var shapeLength = (v) => partLength(v.start)(v.end);
var reverseShapes = /* @__PURE__ */ (() => {
  const $0 = arrayMap((v) => ({ start: v.end, end: v.start, length: v.length }));
  return (x) => $0(reverse(x));
})();
var passiveRail = (s) => ({ color: ColorPassive, shape: s });
var opposeDrawRail = (v) => ({ color: v.color, shape: { start: { ...v.shape.start, isPlus: !v.shape.start.isPlus }, end: { ...v.shape.end, isPlus: !v.shape.end.isPlus }, length: v.shape.length } });
var opposeAdditional = (v) => ({ parttype: v.parttype, pos: { ...v.pos, isPlus: !v.pos.isPlus } });
var opposeRail_ = (v) => ({
  ...v,
  opposed: !v.opposed,
  getJointPos: (x) => {
    const $0 = v.getJointPos(x);
    return { ...$0, isPlus: !$0.isPlus };
  },
  getDrawInfo: (x) => {
    const $0 = v.getDrawInfo(x);
    return { rails: arrayMap(opposeDrawRail)($0.rails), additionals: arrayMap(opposeAdditional)($0.additionals) };
  }
});
var newstate_fallback = { newjoint: 0, newstate: 0, shape: [] };
var flipShape = (v) => ({
  start: { coord: { x: v.start.coord.x, y: -v.start.coord.y, z: v.start.coord.z }, angle: -v.start.angle, isPlus: v.start.isPlus },
  end: { coord: { x: v.end.coord.x, y: -v.end.coord.y, z: v.end.coord.z }, angle: -v.end.angle, isPlus: v.end.isPlus },
  length: v.length
});
var flipDrawRail = (v) => ({
  color: v.color,
  shape: {
    start: { coord: { x: v.shape.start.coord.x, y: -v.shape.start.coord.y, z: v.shape.start.coord.z }, angle: -v.shape.start.angle, isPlus: v.shape.start.isPlus },
    end: { coord: { x: v.shape.end.coord.x, y: -v.shape.end.coord.y, z: v.shape.end.coord.z }, angle: -v.shape.end.angle, isPlus: v.shape.end.isPlus },
    length: v.shape.length
  }
});
var flipAdditional = (v) => ({ parttype: v.parttype, pos: { coord: { x: v.pos.coord.x, y: -v.pos.coord.y, z: v.pos.coord.z }, angle: -v.pos.angle, isPlus: v.pos.isPlus } });
var flipRail_ = (v) => ({
  ...v,
  flipped: !v.flipped,
  getJointPos: (x) => {
    const $0 = v.getJointPos(x);
    return { coord: { x: $0.coord.x, y: -$0.coord.y, z: $0.coord.z }, angle: -$0.angle, isPlus: $0.isPlus };
  },
  getNewState: (x) => (y) => {
    const $0 = v.getNewState(x)(y);
    return { newstate: $0.newstate, newjoint: $0.newjoint, shape: arrayMap(flipShape)($0.shape) };
  },
  getDrawInfo: (x) => {
    const $0 = v.getDrawInfo(x);
    return { rails: arrayMap(flipDrawRail)($0.rails), additionals: arrayMap(flipAdditional)($0.additionals) };
  }
});
var toRealColor = (opts) => (ct) => {
  const m = find((v) => {
    if (ct === "ColorActive") {
      return v.colortype === "active";
    }
    if (ct === "ColorPassive") {
      return v.colortype === "passive";
    }
    if (ct === "ColorAuto") {
      return v.colortype === "auto";
    }
    if (ct === "ColorFixed") {
      return v.colortype === "fixed";
    }
    fail();
  })(opts);
  if (m.tag === "Just") {
    return m._1.color;
  }
  if (m.tag === "Nothing") {
    if (ct === "ColorActive") {
      return "#37d";
    }
    if (ct === "ColorPassive") {
      return "#668";
    }
    if (ct === "ColorAuto") {
      return "#33a";
    }
    if (ct === "ColorFixed") {
      return "#866";
    }
  }
  fail();
};
var calcMidAngle = (x) => (y) => asin(x / ((pow(y)(2) + pow(x)(2)) / (2 * y)));
var slipShapes = () => (v) => {
  const pp = {
    ...getDividingPoint_rel(v.start)(v.end)(0)(0.5),
    angle: (() => {
      const dx = v.end.coord.x - v.start.coord.x;
      const dy = v.end.coord.y - v.start.coord.y;
      return v.end.angle + calcMidAngle(cos(v.end.angle) * dx + sin(v.end.angle) * dy)(cos(v.end.angle) * dy - sin(v.end.angle) * dx);
    })()
  };
  return [
    { start: v.start, end: pp, length: partLength(v.start)(pp) },
    (() => {
      const $0 = { ...pp, angle: pp.angle + 3.141592653589793 };
      return { start: $0, end: v.end, length: partLength($0)(v.end) };
    })()
  ];
};
var brokenDrawInfo = { rails: [], additionals: [] };
var memorizeRail = (v) => {
  const lockedBy_memo = arrayMap((x) => arrayMap((y) => v.lockedBy(x)(y))(v.getStates))(v.getStates);
  const isLegal_memo = arrayMap((x) => arrayMap((y) => v.isLegal(x)(y))(v.getStates))(v.getJoints);
  const isBlocked_memo = arrayMap((x) => arrayMap((y) => arrayMap((z) => v.isBlocked(x)(y)(z))(v.getJoints))(v.getStates))(v.getJoints);
  const getRoute_memo = arrayMap((x) => arrayMap((y) => arrayMap((z) => v.getRoute(x)(y)(z))(v.getJoints))(v.getJoints))(v.getStates);
  const getNewState_memo = arrayMap((j) => arrayMap((s) => {
    const $0 = v.getNewState(j)(s);
    return { newjoint: $0.newjoint, newstate: $0.newstate, shape: $0.shape };
  })(v.getStates))(v.getJoints);
  const getJointPos_memo = arrayMap(v.getJointPos)(v.getJoints);
  const getDrawInfo_memo = arrayMap(v.getDrawInfo)(v.getStates);
  return {
    name: v.name,
    flipped: v.flipped,
    opposed: v.opposed,
    defaultState: v.defaultState,
    getJoints: v.getJoints,
    getStates: v.getStates,
    origin: v.origin,
    getJointPos: (v1) => {
      if (v1 < getJointPos_memo.length) {
        return getJointPos_memo[v1];
      }
      return poszero;
    },
    getNewState: (v1) => (v2) => {
      if (v1 < getNewState_memo.length && v2 < getNewState_memo[v1].length) {
        return getNewState_memo[v1][v2];
      }
      return newstate_fallback;
    },
    getDrawInfo: (v1) => {
      if (v1 < getDrawInfo_memo.length) {
        return getDrawInfo_memo[v1];
      }
      return brokenDrawInfo;
    },
    getRoute: (v1) => (v2) => (v3) => {
      if (v1 < getRoute_memo.length && v2 < getRoute_memo[v1].length && v3 < getRoute_memo[v1][v2].length) {
        return getRoute_memo[v1][v2][v3];
      }
      return Nothing;
    },
    isLegal: (v1) => (v2) => v1 < isLegal_memo.length && v2 < isLegal_memo[v1].length && isLegal_memo[v1][v2],
    lockedBy: (v1) => (v2) => {
      if (v1 < lockedBy_memo.length && v2 < lockedBy_memo[v1].length) {
        return lockedBy_memo[v1][v2];
      }
      return [];
    },
    isBlocked: (v1) => (v2) => (v3) => v1 < isBlocked_memo.length && v2 < isBlocked_memo[v1].length && v3 < isBlocked_memo[v1][v2].length && isBlocked_memo[v1][v2][v3],
    isSimple: v.isSimple
  };
};
var flipRail = (x) => memorizeRail(flipRail_(x));
var opposeRail = (x) => memorizeRail(opposeRail_(x));
var toRail_ = (dictIntSerialize) => (dictIntSerialize1) => (v) => ({
  name: v.name,
  flipped: v.flipped,
  opposed: v.opposed,
  defaultState: dictIntSerialize1.toSerial(v.defaultState),
  getJoints: arrayMap((x) => dictIntSerialize.toSerial(x))(v.getJoints),
  getStates: arrayMap((x) => dictIntSerialize1.toSerial(x))(v.getStates),
  origin: dictIntSerialize.toSerial(v.origin),
  getJointPos: (v1) => {
    const $0 = dictIntSerialize.fromSerial(v1);
    if ($0.tag === "Just") {
      return v.getJointPos($0._1);
    }
    return poszero;
  },
  getNewState: (v1) => (v2) => {
    const $0 = dictIntSerialize.fromSerial(v1);
    if ($0.tag === "Just") {
      const $1 = dictIntSerialize1.fromSerial(v2);
      if ($1.tag === "Just") {
        return {
          newjoint: dictIntSerialize.toSerial(v.getNewState($0._1)($1._1).newjoint),
          newstate: dictIntSerialize1.toSerial(v.getNewState($0._1)($1._1).newstate),
          shape: v.getNewState($0._1)($1._1).shape
        };
      }
    }
    return { newjoint: v1, newstate: v2, shape: [] };
  },
  getDrawInfo: (v1) => {
    const $0 = dictIntSerialize1.fromSerial(v1);
    if ($0.tag === "Just") {
      return v.getDrawInfo($0._1);
    }
    return brokenDrawInfo;
  },
  getRoute: (v1) => (v2) => (v3) => {
    const $0 = dictIntSerialize1.fromSerial(v1);
    if ($0.tag === "Just") {
      const $1 = dictIntSerialize.fromSerial(v2);
      if ($1.tag === "Just") {
        const $2 = dictIntSerialize.fromSerial(v3);
        if ($2.tag === "Just" && v.getRoute($0._1)($1._1)($2._1).tag === "Just") {
          return $Maybe("Just", dictIntSerialize1.toSerial(v.getRoute($0._1)($1._1)($2._1)._1));
        }
      }
    }
    return Nothing;
  },
  isLegal: (v1) => (v2) => {
    const $0 = dictIntSerialize.fromSerial(v1);
    return $0.tag === "Just" && (() => {
      const $1 = dictIntSerialize1.fromSerial(v2);
      return $1.tag === "Just" && v.isLegal($0._1)($1._1);
    })();
  },
  lockedBy: (v1) => (v2) => {
    const $0 = dictIntSerialize1.fromSerial(v1);
    if ($0.tag === "Just") {
      const $1 = dictIntSerialize1.fromSerial(v2);
      if ($1.tag === "Just") {
        return arrayMap((x) => dictIntSerialize.toSerial(x))(v.lockedBy($0._1)($1._1));
      }
    }
    return [];
  },
  isBlocked: (v1) => (v2) => (v3) => {
    const $0 = dictIntSerialize.fromSerial(v1);
    return $0.tag === "Just" && (() => {
      const $1 = dictIntSerialize1.fromSerial(v2);
      return $1.tag === "Just" && (() => {
        const $2 = dictIntSerialize.fromSerial(v3);
        return $2.tag === "Just" && v.isBlocked($0._1)($1._1)($2._1);
      })();
    })();
  },
  isSimple: v.isSimple
});
var applyColorOption = (opts) => (v) => ({ rails: arrayMap((v1) => ({ color: toRealColor(opts)(v1.color), shape: v1.shape }))(v.rails), additionals: v.additionals });
var activeRail = (s) => ({ color: ColorActive, shape: s });
var absShape = (p) => (v) => ({ start: toAbsPos(p)(v.start), end: toAbsPos(p)(v.end), length: v.length });
var absParts = (p) => (v) => ({ color: v.color, shape: absShape(p)(v.shape) });
var absAdditional = (p) => (v) => ({ parttype: v.parttype, pos: toAbsPos(p)(v.pos) });
var absDrawInfo = (p) => (v) => ({ rails: arrayMap(absParts(p))(v.rails), additionals: arrayMap(absAdditional(p))(v.additionals) });

// output-es/Internal.Layout/index.js
var $SignalRule = (tag, _1, _2, _3, _4) => ({ tag, _1, _2, _3, _4 });
var identity5 = (x) => x;
var findWithIndex = (p) => foldableWithIndexArray.foldlWithIndex((v) => (v1) => (v2) => {
  if (v1.tag === "Nothing" && p(v)(v2)) {
    return $Maybe("Just", { index: v, value: v2 });
  }
  return v1;
})(Nothing);
var sum = /* @__PURE__ */ foldlArray(numAdd)(0);
var foldM = (f) => (b0) => foldlArray((b) => (a) => {
  if (b.tag === "Just") {
    return f(b._1)(a);
  }
  if (b.tag === "Nothing") {
    return Nothing;
  }
  fail();
})($Maybe("Just", b0));
var maximum = /* @__PURE__ */ foldlArray((v) => (v1) => {
  if (v.tag === "Nothing") {
    return $Maybe("Just", v1);
  }
  if (v.tag === "Just") {
    return $Maybe("Just", v._1 > v1 ? v._1 : v1);
  }
  fail();
})(Nothing);
var min2 = (x) => (y) => {
  const v = ordNumber.compare(x)(y);
  if (v === "LT") {
    return x;
  }
  if (v === "EQ") {
    return x;
  }
  if (v === "GT") {
    return y;
  }
  fail();
};
var max2 = (x) => (y) => {
  const v = ordNumber.compare(x)(y);
  if (v === "LT") {
    return y;
  }
  if (v === "EQ") {
    return x;
  }
  if (v === "GT") {
    return x;
  }
  fail();
};
var allWithIndex = /* @__PURE__ */ (() => {
  const foldMapWithIndex2 = foldableWithIndexArray.foldMapWithIndex(/* @__PURE__ */ (() => {
    const semigroupConj1 = { append: (v) => (v1) => v && v1 };
    return { mempty: true, Semigroup0: () => semigroupConj1 };
  })());
  return (t) => foldMapWithIndex2((i) => t(i));
})();
var min1 = (x) => (y) => {
  const v = ordInt.compare(x)(y);
  if (v === "LT") {
    return x;
  }
  if (v === "EQ") {
    return x;
  }
  if (v === "GT") {
    return y;
  }
  fail();
};
var functorSectionArray = { map: (f) => (v) => ({ arraydata: arrayMap(f)(v.arraydata), head: v.head, end: v.end }) };
var eqIntNode = { eq: (x) => (y) => x === y };
var ordIntNode = { compare: (x) => (y) => ordInt.compare(x)(y), Eq0: () => eqIntNode };
var updateTraffic = (v) => {
  const v1 = foldlArray((v2) => {
    const $0 = v2.isclear;
    const $1 = v2.traffic;
    return (v3) => foldlArray((v4) => {
      const $2 = v4.isclear;
      const $3 = v4.traffic;
      return (v5) => ({
        traffic: (() => {
          const $4 = modifyAt(v5.nodeid)((d) => {
            const $42 = modifyAt(v5.jointid)((v6) => [...v6, v3.trainid])(d);
            if ($42.tag === "Nothing") {
              return d;
            }
            if ($42.tag === "Just") {
              return $42._1;
            }
            fail();
          })($3);
          if ($4.tag === "Nothing") {
            return $3;
          }
          if ($4.tag === "Just") {
            return $4._1;
          }
          fail();
        })(),
        isclear: (() => {
          const $4 = modifyAt(v5.nodeid)((v6) => false)($2);
          if ($4.tag === "Nothing") {
            return $2;
          }
          if ($4.tag === "Just") {
            return $4._1;
          }
          fail();
        })()
      });
    })({ traffic: $1, isclear: $0 })(v3.route);
  })({ traffic: arrayMap((v2) => replicateImpl(v2.rail.getJoints.length, []))(v.rails), isclear: replicateImpl(v.rails.length, true) })(v.trains);
  return { ...v, traffic: v1.traffic, isclear: v1.isclear };
};
var updateReserves = (v) => ({
  ...v,
  activeReserves: mapMaybe((x) => x)(arrayMap((reserver) => find((reserve) => reserve.reserver === reserver)(v.activeReserves))(arrayMap((x) => x.trainid)(v.trains)))
});
var updateRailNode = (v) => (j) => {
  const v1 = v.rail.getNewState(j)(v.state);
  return {
    instance: { ...v, state: v1.newstate, reserves: filterImpl((x) => x.jointid !== j, v.reserves) },
    newjoint: v1.newjoint,
    shapes: arrayMap(absShape(v.pos))(v1.shape)
  };
};
var shiftRailIndex_Node = (deleted) => (v) => ({
  ...v,
  nodeid: v.nodeid < deleted ? v.nodeid : v.nodeid - 1 | 0,
  connections: arrayMap((c) => ({ ...c, nodeid: c.nodeid < deleted ? c.nodeid : c.nodeid - 1 | 0 }))(v.connections),
  signals: arrayMap((v2) => ({ ...v2, nodeid: v2.nodeid < deleted ? v2.nodeid : v2.nodeid - 1 | 0 }))(v.signals),
  invalidRoutes: arrayMap((v2) => ({ ...v2, nodeid: v2.nodeid < deleted ? v2.nodeid : v2.nodeid - 1 | 0 }))(v.invalidRoutes)
});
var shiftRailIndex_Train = (deleted) => (v) => ({ ...v, route: arrayMap((v2) => ({ ...v2, nodeid: v2.nodeid < deleted ? v2.nodeid : v2.nodeid - 1 | 0 }))(v.route) });
var saModifyAt = (i) => (d) => (f) => (v) => {
  if (i < v.head) {
    return { arraydata: [f(Nothing), ...replicateImpl((v.head - i | 0) - 1 | 0, d), ...v.arraydata], head: i, end: v.end };
  }
  if (v.end <= i) {
    return { arraydata: [...v.arraydata, ...replicateImpl(i - v.end | 0, d), f(Nothing)], head: v.head, end: i + 1 | 0 };
  }
  return {
    arraydata: (() => {
      const $0 = modifyAt(i - v.head | 0)((x) => f($Maybe("Just", x)))(v.arraydata);
      if ($0.tag === "Nothing") {
        return v.arraydata;
      }
      if ($0.tag === "Just") {
        return $0._1;
      }
      fail();
    })(),
    head: v.head,
    end: v.end
  };
};
var saEmpty = { arraydata: [], head: 0, end: 0 };
var instanceDrawInfos = (v) => arrayMap((x) => absDrawInfo(v.pos)(applyColorOption(v.color)(v.rail.getDrawInfo(x))))(v.rail.getStates);
var instanceDrawInfo = (v) => {
  if (v.state >= 0 && v.state < v.drawinfos.length) {
    return v.drawinfos[v.state];
  }
  return brokenDrawInfo;
};
var getTag = (rule) => {
  if (rule.tag === "RuleComment") {
    return unsafeRegex("(?!.*)")(noFlags);
  }
  if (rule.tag === "RuleComplex") {
    return unsafeRegex("(?!.*)")(noFlags);
  }
  if (rule.tag === "RuleSpeed") {
    return rule._1;
  }
  if (rule.tag === "RuleOpen") {
    return rule._1;
  }
  if (rule.tag === "RuleUpdate") {
    return rule._1;
  }
  if (rule.tag === "RuleStop") {
    return rule._1;
  }
  if (rule.tag === "RuleStopOpen") {
    return rule._1;
  }
  if (rule.tag === "RuleStopUpdate") {
    return rule._1;
  }
  if (rule.tag === "RuleReverse") {
    return rule._1;
  }
  if (rule.tag === "RuleReverseUpdate") {
    return rule._1;
  }
  fail();
};
var getRouteInfo = (v) => (j) => {
  const v1 = v.rail.getNewState(j)(v.state);
  return { newjoint: v1.newjoint, shapes: arrayMap(absShape(v.pos))(v1.shape) };
};
var hasTraffic = (v) => (v1) => {
  if (v1.nodeid >= 0 && v1.nodeid < v.traffic.length && anyImpl((t) => t.length > 0, v.traffic[v1.nodeid])) {
    return true;
  }
  const go = (nid) => (jid) => (depth) => {
    if (depth > 30) {
      return false;
    }
    return nid >= 0 && nid < v.rails.length && (() => {
      if (anyImpl((x) => x.jointid === jid, v.rails[nid].signals) || anyImpl((x) => x.jointid === jid, v.rails[nid].invalidRoutes)) {
        return false;
      }
      const jointexit = getRouteInfo(v.rails[nid])(jid).newjoint;
      return nid >= 0 && nid < v.traffic.length && jointexit >= 0 && jointexit < v.traffic[nid].length && (() => {
        if (v.traffic[nid][jointexit].length > 0) {
          return true;
        }
        const v5 = find((c) => c.from === jointexit)(v.rails[nid].connections);
        if (v5.tag === "Nothing") {
          return false;
        }
        if (v5.tag === "Just") {
          return go(v5._1.nodeid)(v5._1.jointid)(depth + 1 | 0);
        }
        fail();
      })();
    })();
  };
  return anyImpl(identity5, arrayMap((cdata) => go(cdata.nodeid)(cdata.jointid)(0))(v1.connections));
};
var setManualStop = (v) => (nodeid) => (jointid) => (stop) => {
  if (nodeid >= 0 && nodeid < v.rails.length) {
    const $0 = v.rails[nodeid];
    const $1 = findWithIndex((v2) => (v3) => v3.jointid === jointid)($0.signals);
    if ($1.tag === "Just") {
      const $2 = _updateAt(Just, Nothing, $1._1.index, { ...$1._1.value, manualStop: stop }, $0.signals);
      if ($2.tag === "Just") {
        const $3 = _updateAt(Just, Nothing, nodeid, { ...$0, signals: $2._1 }, v.rails);
        if ($3.tag === "Just") {
          return { ...v, rails: $3._1 };
        }
        if ($3.tag === "Nothing") {
          return v;
        }
        fail();
      }
      if ($2.tag === "Nothing") {
        return v;
      }
      fail();
    }
    if ($1.tag === "Nothing") {
      return v;
    }
    fail();
  }
  return v;
};
var updateSignalRoutes = (v) => ({
  ...v,
  rails: arrayMap((v2) => ({
    ...v2,
    signals: arrayMap((v4) => ({
      ...v4,
      routes: (() => {
        const go = (v6) => {
          if (v6.rails.length > 30) {
            return [];
          }
          const v7 = v6.nid >= 0 && v6.nid < v.rails.length ? $Maybe("Just", v.rails[v6.nid]) : Nothing;
          if (v7.tag === "Nothing") {
            return [];
          }
          if (v7.tag === "Just") {
            const $0 = v7._1;
            return arrayBind(($0.rail.flipped ? reverse : identity5)(nubBy((x) => (y) => ordInt.compare(x.newjoint)(y.newjoint))(arrayMap($0.rail.getNewState(v6.jid))($0.rail.getStates))))((v8) => {
              const $1 = v8.newjoint;
              const v9 = find((v10) => v10.jointid === $1)($0.invalidRoutes);
              if (v9.tag === "Nothing") {
                const newrails = [...v6.rails, { nodeid: v6.nid, jointenter: v6.jid, jointexit: $1 }];
                const newlen = v6.len + sum(arrayMap((x) => x.length)(v8.shape));
                const v10 = find((v11) => v11.jointid === $1)($0.signals);
                if (v10.tag === "Nothing") {
                  const v11 = find((c) => c.from === $1)($0.connections);
                  if (v11.tag === "Nothing") {
                    return [];
                  }
                  if (v11.tag === "Just") {
                    if (elem(eqIntNode)(v11._1.nodeid)(v6.rids)) {
                      return [];
                    }
                    return go({
                      nid: v11._1.nodeid,
                      jid: v11._1.jointid,
                      rails: newrails,
                      rids: insertBy(ordIntNode.compare)(v11._1.nodeid)(v6.rids),
                      isSimple: v6.isSimple && $0.rail.isSimple,
                      len: newlen
                    });
                  }
                  fail();
                }
                if (v10.tag === "Just") {
                  return [{ nextsignal: { nodeid: v6.nid, jointid: $1 }, rails: newrails, isSimple: v6.isSimple, length: newlen }];
                }
                fail();
              }
              if (v9.tag === "Just") {
                return [];
              }
              fail();
            });
          }
          fail();
        };
        if (v4.nodeid >= 0 && v4.nodeid < v.rails.length) {
          const v7 = find((c) => c.from === v4.jointid)(v.rails[v4.nodeid].connections);
          if (v7.tag === "Nothing") {
            return [];
          }
          if (v7.tag === "Just") {
            return go({ nid: v7._1.nodeid, jid: v7._1.jointid, rails: [], rids: [], isSimple: true, len: 0 });
          }
          fail();
        }
        return [];
      })()
    }))(v2.signals)
  }))(v.rails)
});
var removeSignal = (v) => (nodeid) => (jointid) => updateSignalRoutes({
  ...v,
  updatecount: v.updatecount + 1 | 0,
  rails: (() => {
    const $0 = modifyAt(nodeid)((v2) => ({ ...v2, signals: filterImpl((v4) => v4.jointid !== jointid, v2.signals), invalidRoutes: filterImpl((v4) => v4.jointid !== jointid, v2.invalidRoutes) }))(v.rails);
    if ($0.tag === "Nothing") {
      return v.rails;
    }
    if ($0.tag === "Just") {
      return $0._1;
    }
    fail();
  })()
});
var removeRail = (v) => (nodeid) => {
  const v1 = nodeid >= 0 && nodeid < v.rails.length ? $Maybe("Just", v.rails[nodeid]) : Nothing;
  const layout$p = (() => {
    if (v1.tag === "Just") {
      return foldlArray((l) => (j) => removeSignal(l)(nodeid)(j))(v)(v1._1.rail.getJoints);
    }
    if (v1.tag === "Nothing") {
      return v;
    }
    fail();
  })();
  return updateSignalRoutes({
    ...layout$p,
    updatecount: layout$p.updatecount + 1 | 0,
    rails: arrayMap((v2) => shiftRailIndex_Node(nodeid)({ ...v2, connections: filterImpl((v4) => v4.nodeid !== nodeid, v2.connections) }))((() => {
      const $0 = _deleteAt(Just, Nothing, nodeid, layout$p.rails);
      if ($0.tag === "Nothing") {
        return layout$p.rails;
      }
      if ($0.tag === "Just") {
        return $0._1;
      }
      fail();
    })()),
    jointData: {
      arraydata: arrayMap(functorSectionArray.map(functorSectionArray.map((() => {
        const $0 = filter((v2) => v2.nodeid !== nodeid);
        const $1 = arrayMap((v2) => ({ ...v2, nodeid: v2.nodeid < nodeid ? v2.nodeid : v2.nodeid - 1 | 0 }));
        return (x) => $1($0(x));
      })())))(layout$p.jointData.arraydata),
      head: layout$p.jointData.head,
      end: layout$p.jointData.end
    },
    trains: arrayMap(shiftRailIndex_Train(nodeid))(layout$p.trains)
  });
};
var getRailJointAbsPos = (v) => (jointid) => toAbsPos(v.pos)(v.rail.getJointPos(jointid));
var getNextSignal = (v) => (v1) => {
  const v2 = 0 < v1.route.length ? $Maybe("Just", v1.route[0]) : Nothing;
  if (v2.tag === "Nothing") {
    return { signal: Nothing, sections: 0, distance: 0 };
  }
  if (v2.tag === "Just") {
    const go = (go$a0$copy) => (go$a1$copy) => (go$a2$copy) => (go$a3$copy) => (go$a4$copy) => {
      let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$a2 = go$a2$copy, go$a3 = go$a3$copy, go$a4 = go$a4$copy, go$c = true, go$r;
      while (go$c) {
        const nid = go$a0, jid = go$a1, sectionsold = go$a2, distanceold = go$a3, isfirst = go$a4;
        if (sectionsold > 30) {
          go$c = false;
          go$r = { signal: Nothing, sections: sectionsold, distance: distanceold };
          continue;
        }
        if (nid >= 0 && nid < v.rails.length) {
          const sections = sectionsold + 1 | 0;
          const next = getRouteInfo(v.rails[nid])(jid);
          const distance = isfirst ? distanceold : distanceold + sum(arrayMap(shapeLength)(next.shapes));
          const v4 = find((v5) => v5.jointid === next.newjoint)(v.rails[nid].invalidRoutes);
          if (v4.tag === "Nothing") {
            const v5 = find((v6) => v6.jointid === next.newjoint)(v.rails[nid].signals);
            if (v5.tag === "Nothing") {
              const v6 = find((c) => c.from === next.newjoint)(v.rails[nid].connections);
              if (v6.tag === "Nothing") {
                go$c = false;
                go$r = { signal: Nothing, sections, distance };
                continue;
              }
              if (v6.tag === "Just") {
                go$a0 = v6._1.nodeid;
                go$a1 = v6._1.jointid;
                go$a2 = sections;
                go$a3 = distance;
                go$a4 = false;
                continue;
              }
              fail();
            }
            if (v5.tag === "Just") {
              go$c = false;
              go$r = { signal: $Maybe("Just", v5._1), sections, distance };
              continue;
            }
            fail();
          }
          if (v4.tag === "Just") {
            go$c = false;
            go$r = { signal: Nothing, sections, distance };
            continue;
          }
          fail();
        }
        go$c = false;
        go$r = { signal: Nothing, sections: sectionsold, distance: distanceold };
      }
      return go$r;
    };
    return go(v2._1.nodeid)(v2._1.jointid)(0)(v1.distanceToNext)(true);
  }
  fail();
};
var getJoints = (v) => (joint) => arrayBind(arrayApply(arrayApply(arrayMap((x) => (y) => (z) => {
  const $0 = z - v.jointData.head | 0;
  if ($0 >= 0 && $0 < v.jointData.arraydata.length) {
    const $1 = x - v.jointData.arraydata[$0].head | 0;
    if ($1 >= 0 && $1 < v.jointData.arraydata[$0].arraydata.length) {
      const $2 = y - v.jointData.arraydata[$0].arraydata[$1].head | 0;
      if ($2 >= 0 && $2 < v.jointData.arraydata[$0].arraydata[$1].arraydata.length) {
        return v.jointData.arraydata[$0].arraydata[$1].arraydata[$2];
      }
    }
  }
  return [];
})((() => {
  const i = unsafeClamp(round(joint.coord.x));
  if (unsafeClamp(round(joint.coord.x - 0.1)) < i) {
    return [i - 1 | 0, i];
  }
  if (i < unsafeClamp(round(joint.coord.x + 0.1))) {
    return [i, i + 1 | 0];
  }
  return [i];
})()))((() => {
  const i = unsafeClamp(round(joint.coord.y));
  if (unsafeClamp(round(joint.coord.y - 0.1)) < i) {
    return [i - 1 | 0, i];
  }
  if (i < unsafeClamp(round(joint.coord.y + 0.1))) {
    return [i, i + 1 | 0];
  }
  return [i];
})()))((() => {
  const i = unsafeClamp(round(joint.coord.z));
  if (unsafeClamp(round(joint.coord.z - 0.1)) < i) {
    return [i - 1 | 0, i];
  }
  if (i < unsafeClamp(round(joint.coord.z + 0.1))) {
    return [i, i + 1 | 0];
  }
  return [i];
})()))(identity);
var getJointAbsPos = (v) => (nodeid) => (jointid) => {
  if (nodeid >= 0 && nodeid < v.rails.length) {
    return $Maybe("Just", toAbsPos(v.rails[nodeid].pos)(v.rails[nodeid].rail.getJointPos(jointid)));
  }
  return Nothing;
};
var getNewRailPos = (v) => (v1) => {
  const $0 = foldM((mposofzero) => (v2) => {
    if (mposofzero.tag === "Nothing") {
      return $Maybe(
        "Just",
        (() => {
          const $02 = getJointAbsPos(v)(v2.nodeid)(v2.jointid);
          if ($02.tag === "Just") {
            return $Maybe(
              "Just",
              toAbsPos({ ...$02._1, angle: $02._1.angle + 3.141592653589793 })(convertRelPos(v1.rail.getJointPos(v2.from))({
                ...poszero,
                angle: 3.141592653589793
              }))
            );
          }
          return Nothing;
        })()
      );
    }
    if (mposofzero.tag === "Just") {
      if ((() => {
        const $02 = getJointAbsPos(v)(v2.nodeid)(v2.jointid);
        return $02.tag === "Just" && canJoin(toAbsPos(mposofzero._1)(v1.rail.getJointPos(v2.from)))($02._1);
      })()) {
        return $Maybe("Just", mposofzero);
      }
      return Nothing;
    }
    fail();
  })(Nothing)(v1.connections);
  if ($0.tag === "Just") {
    return $0._1;
  }
  if ($0.tag === "Nothing") {
    return Nothing;
  }
  fail();
};
var forceUpdate = (v) => ({ ...v, updatecount: v.updatecount + 1 | 0 });
var setRailColor = (v) => (nodeid) => (coloroption) => ({
  ...v,
  rails: (() => {
    const $0 = modifyAt(nodeid)((v2) => {
      const $02 = { ...v2, color: coloroption };
      return { ...$02, drawinfos: instanceDrawInfos($02) };
    })(v.rails);
    if ($0.tag === "Nothing") {
      return v.rails;
    }
    if ($0.tag === "Just") {
      return $0._1;
    }
    fail();
  })(),
  updatecount: v.updatecount + 1 | 0
});
var flipTrain = (v) => ({
  ...v,
  route: reverse(arrayMap((v2) => ({ ...v2, jointid: v2.railinstance.rail.getNewState(v2.jointid)(v2.railinstance.state).newjoint, shapes: reverseShapes(v2.shapes) }))(v.route)),
  distanceToNext: v.distanceFromOldest,
  distanceFromOldest: v.distanceToNext,
  flipped: !v.flipped
});
var digestIndication = (signal) => {
  if (signal.manualStop || signal.restraint) {
    return 0;
  }
  const $0 = maximum(signal.indication);
  if ($0.tag === "Nothing") {
    return 0;
  }
  if ($0.tag === "Just") {
    return $0._1;
  }
  fail();
};
var signalToSpeed = (x) => {
  const $0 = digestIndication(x);
  if ($0 === 0) {
    return 0;
  }
  if ($0 === 1) {
    return 0.625;
  }
  if ($0 === 2) {
    return 1.125;
  }
  if ($0 === 3) {
    return 1.625;
  }
  return 2.5;
};
var getRestriction = (tags) => (signal) => foldlArray((s) => (r) => {
  if (r.tag === "RuleSpeed" && anyImpl(test(r._1), arrayMap(unsafeCoerce)(tags))) {
    return min2(s)(toNumber(r._2) * 0.025);
  }
  return s;
})(signal.manualStop || signal.restraint ? 0 : signalToSpeed(signal))(signal.rules);
var movefoward = (movefoward$a0$copy) => (movefoward$a1$copy) => (movefoward$a2$copy) => {
  let movefoward$a0 = movefoward$a0$copy, movefoward$a1 = movefoward$a1$copy, movefoward$a2 = movefoward$a2$copy, movefoward$c = true, movefoward$r;
  while (movefoward$c) {
    const v = movefoward$a0, v1 = movefoward$a1, dt = movefoward$a2;
    const dx = dt * v1.speed;
    const $0 = { ...v1, distanceToNext: v1.distanceToNext - dx, distanceFromOldest: v1.distanceFromOldest + dx };
    const v4 = unsnoc($0.route);
    const $1 = (() => {
      if (v4.tag === "Nothing") {
        return $0;
      }
      if (v4.tag === "Just") {
        if ($0.distanceFromOldest <= v4._1.last.length) {
          return $0;
        }
        return { ...$0, route: v4._1.init, distanceFromOldest: $0.distanceFromOldest - v4._1.last.length };
      }
      fail();
    })();
    if (0 <= $1.distanceToNext) {
      movefoward$c = false;
      movefoward$r = { newlayout: v, newtrainset: $1 };
      continue;
    }
    const $2 = 0 < $1.route.length ? $Maybe("Just", $1.route[0]) : Nothing;
    if ($2.tag === "Just") {
      const jointexit = $2._1.railinstance.rail.getNewState($2._1.jointid)($2._1.railinstance.state).newjoint;
      const $3 = find((c) => c.from === jointexit)($2._1.railinstance.connections);
      if ($3.tag === "Just") {
        const $4 = $3._1.nodeid >= 0 && $3._1.nodeid < v.rails.length ? $Maybe("Just", v.rails[$3._1.nodeid]) : Nothing;
        if ($4.tag === "Just") {
          const updatedroute = updateRailNode($4._1)($3._1.jointid);
          const newinstance = { ...updatedroute.instance, reserves: filterImpl((r$p) => r$p.jointid !== $3._1.jointid, updatedroute.instance.reserves) };
          const slength = sum(arrayMap(shapeLength)(updatedroute.shapes));
          movefoward$c = false;
          movefoward$r = {
            newlayout: $3._1.nodeid >= 0 && $3._1.nodeid < v.rails.length && v.rails[$3._1.nodeid].state === updatedroute.instance.state ? {
              ...v,
              rails: (() => {
                const $5 = _updateAt(Just, Nothing, $3._1.nodeid, newinstance, v.rails);
                if ($5.tag === "Nothing") {
                  return v.rails;
                }
                if ($5.tag === "Just") {
                  return $5._1;
                }
                fail();
              })()
            } : {
              ...v,
              updatecount: v.updatecount + 1 | 0,
              rails: (() => {
                const $5 = _updateAt(Just, Nothing, $3._1.nodeid, newinstance, v.rails);
                if ($5.tag === "Nothing") {
                  return v.rails;
                }
                if ($5.tag === "Just") {
                  return $5._1;
                }
                fail();
              })()
            },
            newtrainset: {
              ...$1,
              route: [{ nodeid: $3._1.nodeid, jointid: $3._1.jointid, railinstance: $4._1, shapes: updatedroute.shapes, length: slength }, ...$1.route],
              distanceToNext: $1.distanceToNext + slength,
              signalRestriction: max2(0.375)((() => {
                const $5 = find((v7) => v7.jointid === jointexit)($2._1.railinstance.signals);
                if ($5.tag === "Nothing") {
                  return $1.signalRestriction;
                }
                if ($5.tag === "Just") {
                  return getRestriction($1.tags)($5._1);
                }
                fail();
              })()),
              signalRulePhase: anyImpl((v7) => v7.jointid === jointexit, $2._1.railinstance.signals) ? 0 : $1.signalRulePhase
            }
          };
          continue;
        }
        if ($4.tag === "Nothing") {
          if ($1.distanceToNext === 0) {
            movefoward$c = false;
            movefoward$r = { newlayout: v, newtrainset: v1 };
            continue;
          }
          movefoward$a0 = v;
          movefoward$a1 = v1;
          movefoward$a2 = v1.distanceToNext / v1.speed * 0.9;
          continue;
        }
        fail();
      }
      if ($3.tag === "Nothing") {
        if ($1.distanceToNext === 0) {
          movefoward$c = false;
          movefoward$r = { newlayout: v, newtrainset: v1 };
          continue;
        }
        movefoward$a0 = v;
        movefoward$a1 = v1;
        movefoward$a2 = v1.distanceToNext / v1.speed * 0.9;
        continue;
      }
      fail();
    }
    if ($2.tag === "Nothing") {
      if ($1.distanceToNext === 0) {
        movefoward$c = false;
        movefoward$r = { newlayout: v, newtrainset: v1 };
        continue;
      }
      movefoward$a0 = v;
      movefoward$a1 = v1;
      movefoward$a2 = v1.distanceToNext / v1.speed * 0.9;
      continue;
    }
    fail();
  }
  return movefoward$r;
};
var trainsetDrawInfo = (v) => {
  const shapes = arrayBind(v.route)((v1) => reverse(v1.shapes));
  const getpos$p = (getpos$p$a0$copy) => (getpos$p$a1$copy) => (getpos$p$a2$copy) => {
    let getpos$p$a0 = getpos$p$a0$copy, getpos$p$a1 = getpos$p$a1$copy, getpos$p$a2 = getpos$p$a2$copy, getpos$p$c = true, getpos$p$r;
    while (getpos$p$c) {
      const w = getpos$p$a0, d$p = getpos$p$a1, i = getpos$p$a2;
      if (i >= 0 && i < shapes.length) {
        if (shapes[i].length < d$p) {
          getpos$p$a0 = w;
          getpos$p$a1 = d$p - shapes[i].length;
          getpos$p$a2 = i + 1 | 0;
          continue;
        }
        getpos$p$c = false;
        getpos$p$r = getDividingPoint_rel(shapes[i].start)(shapes[i].end)(w)(1 - d$p / shapes[i].length);
        continue;
      }
      getpos$p$c = false;
      getpos$p$r = poszero;
    }
    return getpos$p$r;
  };
  return {
    tags: v.tags,
    note: v.note,
    flipped: v.flipped,
    trainid: v.trainid,
    cars: mapWithIndexArray((i) => (ct) => {
      const d = toNumber(i) * 0.5140186915887851 + v.distanceToNext;
      const dh = d + 0.09345794392523366;
      const dt = d + 0.4672897196261683 - 0.09345794392523366;
      return {
        type: ct,
        head: { r: getpos$p(-0.07943925233644861)(dh)(0), l: getpos$p(0.07943925233644861)(dh)(0), m: getpos$p(0)(dh)(0) },
        tail: { r: getpos$p(-0.07943925233644861)(dt)(0), l: getpos$p(0.07943925233644861)(dt)(0), m: getpos$p(0)(dt)(0) }
      };
    })(v.types)
  };
};
var layoutDrawInfo = (v) => ({
  rails: arrayMap((r) => {
    const $0 = instanceDrawInfo(r);
    return { rails: $0.rails, additionals: $0.additionals, joints: arrayMap(getRailJointAbsPos(r))(r.rail.getJoints), instance: r };
  })(v.rails),
  signals: arrayMap((v1) => arrayMap((v2) => ({
    indication: v2.indication,
    pos: (() => {
      const $0 = getJointAbsPos(v)(v2.nodeid)(v2.jointid);
      if ($0.tag === "Nothing") {
        return poszero;
      }
      if ($0.tag === "Just") {
        return $0._1;
      }
      fail();
    })(),
    signal: v2
  }))(v1.signals))(v.rails),
  invalidRoutes: arrayMap((v1) => arrayMap((v2) => ({
    pos: (() => {
      const $0 = getJointAbsPos(v)(v2.nodeid)(v2.jointid);
      if ($0.tag === "Nothing") {
        return poszero;
      }
      if ($0.tag === "Just") {
        return $0._1;
      }
      fail();
    })(),
    signal: v2
  }))(v1.invalidRoutes))(v.rails),
  trains: arrayMap(trainsetDrawInfo)(v.trains),
  floor: v.floor
});
var trainsetLength = (v) => toNumber(v.types.length) * 0.5140186915887851 - 0.04672897196261683;
var brakePattern = (speed) => (finalspeed) => {
  const t = (speed - finalspeed) / 0.6;
  return 0.2 + max2(0)(finalspeed * t + 0.3 * t * t);
};
var brakePatternDist = (speed) => (signaldata) => (tags) => {
  const restriction = (() => {
    if (signaldata.signal.tag === "Nothing") {
      return 15;
    }
    if (signaldata.signal.tag === "Just") {
      return getRestriction(tags)(signaldata.signal._1);
    }
    fail();
  })();
  if (speed < restriction) {
    return -infinity;
  }
  return brakePattern(speed)(restriction);
};
var getMaxNotch_ = (nextsignal) => (v) => {
  if (v.respectSignals) {
    if (v.signalRestriction < v.speed || nextsignal.distance < brakePatternDist(v.speed)(nextsignal)(v.tags)) {
      return -8;
    }
    if (v.signalRestriction < v.speed + 0.125) {
      return 0;
    }
  }
  return 5;
};
var getMaxNotch = (v) => (v1) => getMaxNotch_(getNextSignal(v)(v1))(v1);
var getMarginFromBrakePattern = (v) => (v1) => {
  const nextsignal = getNextSignal(v)(v1);
  return nextsignal.distance - brakePatternDist(v1.speed)(nextsignal)(v1.tags);
};
var updateSignalIndication = (changeManualStop) => (v) => {
  const blockingData = arrayMap((v1) => ({
    rail: v1,
    signals: arrayMap((v2) => ({
      signal: v2,
      routes: arrayMap((v3) => {
        const routecond = allImpl(
          (v4) => v4.nodeid >= 0 && v4.nodeid < v.rails.length && v.rails[v4.nodeid].rail.getNewState(v4.jointenter)(v.rails[v4.nodeid].state).newjoint === v4.jointexit && v.rails[v4.nodeid].rail.isLegal(v4.jointenter)(v.rails[v4.nodeid].state),
          v3.rails
        );
        return {
          route: v3,
          routecond,
          manualStop: v2.manualStop,
          restraint: v2.restraint,
          cond: routecond && allImpl(
            (v4) => v4.nodeid >= 0 && v4.nodeid < v.isclear.length && v.isclear[v4.nodeid] || v4.nodeid >= 0 && v4.nodeid < v.traffic.length && v4.nodeid >= 0 && v4.nodeid < v.rails.length && (() => {
              const $0 = v.rails[v4.nodeid];
              const state = $0.state;
              const rail = $0.rail;
              return allWithIndex((i) => (t) => t.length === 0 || !rail.isBlocked(i)(state)(v4.jointenter))(v.traffic[v4.nodeid]);
            })(),
            v3.rails
          ) && (() => {
            const $0 = v3.rails.length - 1 | 0;
            const v4 = $0 >= 0 && $0 < v3.rails.length ? $Maybe("Just", v3.rails[$0]) : Nothing;
            if (v4.tag === "Just") {
              const $1 = v4._1.nodeid;
              const go = (nid) => (jid) => (cnt) => cnt > 120 || nid >= 0 && nid < v.rails.length && (() => {
                if (v.rails[nid].rail.isSimple) {
                  const jidexit = v.rails[nid].rail.getNewState(jid)(v.rails[nid].state).newjoint;
                  if (nid >= 0 && nid < v.isclear.length && v.isclear[nid]) {
                    const v6 = find((c) => c.from === jidexit)(v.rails[nid].connections);
                    if (v6.tag === "Nothing") {
                      return true;
                    }
                    if (v6.tag === "Just") {
                      return go($1)(v6._1.jointid)(cnt + 1 | 0);
                    }
                    fail();
                  }
                  return nid >= 0 && nid < v.traffic.length && (() => {
                    const $2 = v.traffic[nid];
                    return jidexit >= 0 && jidexit < $2.length && $2[jidexit].length === 0 && (() => {
                      const v7 = find((c) => c.from === jidexit)(v.rails[nid].connections);
                      if (v7.tag === "Nothing") {
                        return true;
                      }
                      if (v7.tag === "Just") {
                        return go($1)(v7._1.jointid)(cnt + 1 | 0);
                      }
                      fail();
                    })();
                  })();
                }
                return true;
              })();
              return go($1)(v4._1.jointenter)(0);
            }
            if (v4.tag === "Nothing") {
              return false;
            }
            fail();
          })()
        };
      })(v2.routes)
    }))(v1.signals)
  }))(v.rails);
  const filtered = arrayMap((rbd) => arrayMap((bd) => ({ ...bd, routes: filterImpl((d) => d.cond, bd.routes) }))(rbd.signals))(blockingData);
  return {
    ...v,
    rails: arrayMap((rbd) => ({
      ...rbd.rail,
      signals: arrayMap((bd) => ({
        ...bd.signal,
        routecond: arrayMap((v3) => v3.routecond)(bd.routes),
        manualStop: bd.signal.manualStop || changeManualStop && !(bd.routes.length < 2 && allImpl((bdr) => bdr.route.isSimple, bd.routes) && allImpl((x) => x.tag !== "RuleComplex", bd.signal.rules)) && (anyImpl(identity5, zipWithImpl((route) => (routecond) => routecond !== route.routecond, bd.routes, bd.signal.routecond)) || anyImpl(
          identity5,
          zipWithImpl((route) => (indication) => indication > 0 && !route.cond, bd.routes, bd.signal.indication)
        )),
        indication: arrayMap((d) => {
          if (d.cond) {
            const go = (go$a0$copy) => (go$a1$copy) => {
              let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
              while (go$c) {
                const len = go$a0, v3 = go$a1;
                if (len >= brakePattern(2.5)(0)) {
                  go$c = false;
                  go$r = $Maybe("Just", 4);
                  continue;
                }
                const $02 = v3.nodeid >= 0 && v3.nodeid < filtered.length ? $Maybe("Just", filtered[v3.nodeid]) : Nothing;
                const $1 = find((bd$p) => bd$p.signal.jointid === v3.jointid);
                const v4 = (() => {
                  if ($02.tag === "Just") {
                    return $1($02._1);
                  }
                  if ($02.tag === "Nothing") {
                    return Nothing;
                  }
                  fail();
                })();
                if (v4.tag === "Just") {
                  if (0 < v4._1.routes.length && v4._1.routes[0].cond && (!v4._1.routes[0].manualStop && !v4._1.routes[0].restraint || len === 0)) {
                    go$a0 = len + v4._1.routes[0].route.length;
                    go$a1 = v4._1.routes[0].route.nextsignal;
                    continue;
                  }
                  go$c = false;
                  go$r = maximum(filterImpl(
                    (color) => len >= brakePattern((() => {
                      if (color === 0) {
                        return 0;
                      }
                      if (color === 1) {
                        return 0.625;
                      }
                      if (color === 2) {
                        return 1.125;
                      }
                      if (color === 3) {
                        return 1.625;
                      }
                      return 2.5;
                    })())(0),
                    [0, 1, 2, 3]
                  ));
                  continue;
                }
                if (v4.tag === "Nothing") {
                  go$c = false;
                  go$r = maximum(filterImpl(
                    (color) => len >= brakePattern((() => {
                      if (color === 0) {
                        return 0;
                      }
                      if (color === 1) {
                        return 0.625;
                      }
                      if (color === 2) {
                        return 1.125;
                      }
                      if (color === 3) {
                        return 1.625;
                      }
                      return 2.5;
                    })())(0),
                    [0, 1, 2, 3]
                  ));
                  continue;
                }
                fail();
              }
              return go$r;
            };
            const $0 = go(0)({ nodeid: bd.signal.nodeid, jointid: bd.signal.jointid });
            if ($0.tag === "Nothing") {
              return 0;
            }
            if ($0.tag === "Just") {
              return $0._1;
            }
            fail();
          }
          return 0;
        })(bd.routes)
      }))(rbd.signals)
    }))(blockingData)
  };
};
var layoutUpdate = (x) => updateSignalIndication(true)(updateReserves(updateTraffic(x)));
var tryOpenRouteFor = (v) => (nodeid) => (jointid) => (routeid) => (reserver) => {
  const $0 = nodeid >= 0 && nodeid < v.rails.length ? $Maybe("Just", v.rails[nodeid]) : Nothing;
  if ($0.tag === "Just") {
    const $1 = find((v2) => v2.jointid === jointid)($0._1.signals);
    if ($1.tag === "Just") {
      const $2 = routeid >= 0 && routeid < $1._1.routes.length ? $Maybe("Just", $1._1.routes[routeid]) : Nothing;
      if ($2.tag === "Just") {
        const reserveid = v.updatecount + 1 | 0;
        const programmedroute = reserver !== -1;
        const go = (go$a0$copy) => (go$a1$copy) => {
          let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
          while (go$c) {
            const v4 = go$a0, rs = go$a1;
            if (nodeid >= 0 && nodeid < v.rails.length) {
              const v5 = find((v7) => v7.jointid === jointid)(v.rails[nodeid].signals);
              if (v5.tag === "Nothing") {
                go$c = false;
                go$r = rs;
                continue;
              }
              if (v5.tag === "Just") {
                const v6 = unconsImpl((v$1) => Nothing, (x) => (xs) => $Maybe("Just", { head: x, tail: xs }), v5._1.routes);
                if (v6.tag === "Nothing") {
                  go$c = false;
                  go$r = rs;
                  continue;
                }
                if (v6.tag === "Just") {
                  if (v6._1.tail.length > 0 || !v6._1.head.isSimple) {
                    go$c = false;
                    go$r = rs;
                    continue;
                  }
                  go$a0 = v6._1.head.nextsignal;
                  go$a1 = [...rs, ...v6._1.head.rails];
                  continue;
                }
              }
              fail();
            }
            go$c = false;
            go$r = rs;
          }
          return go$r;
        };
        const $3 = foldM((v4) => {
          const $32 = v4.newrails;
          const $4 = v4.traffic;
          return (v5) => {
            const $5 = nodeid >= 0 && nodeid < v.rails.length ? $Maybe("Just", v.rails[nodeid]) : Nothing;
            if ($5.tag === "Just") {
              const traffic$p = $4 || hasTraffic(v)($5._1);
              const $6 = $5._1.rail.getRoute($5._1.state)(v5.jointenter)(v5.jointexit);
              if ($6.tag === "Just") {
                const $7 = _updateAt(
                  Just,
                  Nothing,
                  nodeid,
                  { ...$5._1, state: $6._1, reserves: [...$5._1.reserves, { jointid: v5.jointenter, reserveid }] },
                  $32
                );
                if ($7.tag === "Just") {
                  if ($6._1 !== $5._1.state && traffic$p || programmedroute && ($1._1.restraint || anyImpl(
                    (v7) => v5.jointenter !== jointid && ($5._1.rail.isBlocked(v5.jointenter)($5._1.state)(jointid) || $5._1.rail.isBlocked(v5.jointenter)($6._1)(jointid)) && anyImpl(
                      (a) => a.reserveid === reserveid,
                      v.activeReserves
                    ),
                    $5._1.reserves
                  ))) {
                    return Nothing;
                  }
                  return $Maybe("Just", { traffic: traffic$p, newrails: $7._1 });
                }
                if ($7.tag === "Nothing") {
                  return Nothing;
                }
                fail();
              }
              if ($6.tag === "Nothing") {
                return Nothing;
              }
              fail();
            }
            if ($5.tag === "Nothing") {
              return Nothing;
            }
            fail();
          };
        })({
          traffic: false,
          newrails: programmedroute ? v.rails : arrayMap((v4) => {
            if (v4.nodeid === nodeid) {
              return {
                ...v4,
                signals: arrayMap((v6) => {
                  if (v6.jointid === jointid) {
                    return { ...v6, manualStop: true };
                  }
                  return v6;
                })(v4.signals)
              };
            }
            return v4;
          })(v.rails)
        })(go($2._1.nextsignal)($2._1.rails));
        if ($3.tag === "Just") {
          return $Maybe(
            "Just",
            {
              layout: (() => {
                const $4 = updateSignalIndication(true)(updateReserves(updateTraffic({ ...v, rails: $3._1.newrails, updatecount: v.updatecount + 1 | 0 })));
                return { ...$4, activeReserves: [{ reserveid, reserver }, ...$4.activeReserves] };
              })(),
              reserveid
            }
          );
        }
        if ($3.tag === "Nothing") {
          return Nothing;
        }
        fail();
      }
      if ($2.tag === "Nothing") {
        return Nothing;
      }
      fail();
    }
    if ($1.tag === "Nothing") {
      return Nothing;
    }
    fail();
  }
  if ($0.tag === "Nothing") {
    return Nothing;
  }
  fail();
};
var tryOpenRouteFor_ffi = (v) => (nodeid) => (jointid) => (routeid) => {
  const $0 = tryOpenRouteFor(v)(nodeid)(jointid)(routeid)(-1);
  if ($0.tag === "Nothing") {
    return { layout: v, result: false };
  }
  if ($0.tag === "Just") {
    return { layout: $0._1.layout, result: true };
  }
  fail();
};
var layoutUpdate_NoManualStop = (x) => updateSignalIndication(false)(updateReserves(updateTraffic(x)));
var calcAcceralation = (notch) => (speed) => -speed * speed * 1e-3 + (() => {
  if (notch === 0) {
    return 0;
  }
  if (notch > 0) {
    if (speed / 0.025 / 21 < toNumber(notch) - 0.5) {
      if (speed / 0.025 < 40) {
        return 0.4;
      }
      return 0.4 / (speed / 0.025 / 40);
    }
    return 0.4 / (speed / 0.025 / 40) * max2(0)((toNumber(notch) - 0.5 - speed / 0.025 / 21) * 2 + 1);
  }
  return 0.6 * toNumber(notch) / 8;
})();
var addTrainset = (v) => (nodeid) => (jointid) => (types) => {
  const go = (go$a0$copy) => (go$a1$copy) => (go$a2$copy) => (go$a3$copy) => {
    let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$a2 = go$a2$copy, go$a3 = go$a3$copy, go$c = true, go$r;
    while (go$c) {
      const rs = go$a0, nid = go$a1, jid = go$a2, len = go$a3;
      if (nid >= 0 && nid < v.rails.length) {
        const $0 = v.rails[nid];
        const info = getRouteInfo($0)(jid);
        const lenhere = sum(arrayMap(shapeLength)(info.shapes));
        if (lenhere < len) {
          const $1 = find((c) => c.from === info.newjoint)($0.connections);
          if ($1.tag === "Just") {
            go$a0 = [{ nodeid: nid, jointid: jid, railinstance: $0, shapes: info.shapes, length: lenhere }, ...rs];
            go$a1 = $1._1.nodeid;
            go$a2 = $1._1.jointid;
            go$a3 = len - lenhere;
            continue;
          }
          if ($1.tag === "Nothing") {
            go$c = false;
            go$r = Nothing;
            continue;
          }
          fail();
        }
        go$c = false;
        go$r = $Maybe(
          "Just",
          {
            types,
            route: [{ nodeid: nid, jointid: jid, railinstance: $0, shapes: info.shapes, length: lenhere }, ...rs],
            distanceToNext: lenhere - len,
            distanceFromOldest: 0,
            speed: 0,
            trainid: v.traincount,
            flipped: false,
            respectSignals: false,
            realAcceralation: false,
            notch: 0,
            signalRestriction: 0,
            note: "",
            tags: [],
            signalRulePhase: 0
          }
        );
        continue;
      }
      go$c = false;
      go$r = Nothing;
    }
    return go$r;
  };
  if (nodeid >= 0 && nodeid < v.rails.length) {
    const $0 = find((c) => c.from === jointid)(v.rails[nodeid].connections);
    if ($0.tag === "Just") {
      const $1 = go([])($0._1.nodeid)($0._1.jointid)(toNumber(types.length) * 0.5140186915887851 - 0.04672897196261683);
      if ($1.tag === "Just") {
        return { ...v, traincount: v.traincount + 1 | 0, trains: [...v.trains, $1._1] };
      }
      if ($1.tag === "Nothing") {
        return v;
      }
      fail();
    }
    if ($0.tag === "Nothing") {
      return v;
    }
    fail();
  }
  return v;
};
var addSignal = (v) => (nodeid) => (jointid) => {
  const signal = {
    signalname: showIntImpl(nodeid) + "_" + showIntImpl(jointid),
    nodeid,
    jointid,
    routes: [],
    colors: [0, 1, 2, 3],
    routecond: [],
    indication: [],
    rules: [],
    manualStop: false,
    restraint: false
  };
  if (nodeid >= 0 && nodeid < v.rails.length) {
    const $0 = v.rails[nodeid];
    if (anyImpl((v2) => v2.jointid === jointid, $0.signals) || anyImpl((v2) => v2.jointid === jointid, $0.invalidRoutes)) {
      return v;
    }
    const $1 = modifyAt(nodeid)((v2) => ({ ...v2, signals: [...v2.signals, signal] }))(v.rails);
    if ($1.tag === "Just") {
      return updateSignalRoutes({ ...v, updatecount: v.updatecount + 1 | 0, rails: $1._1 });
    }
    if ($1.tag === "Nothing") {
      return v;
    }
    fail();
  }
  return v;
};
var addRouteQueue = (l) => (n) => (j) => (r) => (t) => ({ ...l, routequeue: [...l.routequeue, { jointid: j, nodeid: n, routeid: r, time: l.time, retryafter: l.time, trainid: t }] });
var addJoint = (v) => (pos) => (nodeid) => (jointid) => ({
  ...v,
  jointData: saModifyAt(unsafeClamp(round(pos.coord.z)))(saEmpty)((() => {
    const $0 = saModifyAt(unsafeClamp(round(pos.coord.x)))(saEmpty)((() => {
      const $02 = saModifyAt(unsafeClamp(round(pos.coord.y)))([])((ma) => [
        ...(() => {
          if (ma.tag === "Nothing") {
            return [];
          }
          if (ma.tag === "Just") {
            return ma._1;
          }
          fail();
        })(),
        { pos, nodeid, jointid }
      ]);
      return (x) => $02((() => {
        if (x.tag === "Nothing") {
          return saEmpty;
        }
        if (x.tag === "Just") {
          return x._1;
        }
        fail();
      })());
    })());
    return (x) => $0((() => {
      if (x.tag === "Nothing") {
        return saEmpty;
      }
      if (x.tag === "Just") {
        return x._1;
      }
      fail();
    })());
  })())(v.jointData)
});
var addRailWithPos = (v) => (v1) => (pos) => {
  const joints = arrayMap((j) => ({ jointid: j, pos: toAbsPos(pos)(v1.rail.getJointPos(j)) }))(v1.rail.getJoints);
  const cfroms = arrayMap((v2) => v2.from)(v1.connections);
  const newconnections = mapMaybe((x) => x)(arrayMap((v2) => {
    if (elem(eqIntJoint)(v2.jointid)(cfroms)) {
      return Nothing;
    }
    const $0 = filterImpl((v3) => canJoin(v2.pos)(v3.pos), getJoints(v)(v2.pos));
    if (0 < $0.length) {
      return $Maybe("Just", { jointData: $0[0], jointid: v2.jointid });
    }
    return Nothing;
  })(joints));
  const connections = [
    ...arrayMap((v2) => ({ jointData: { pos: poszero, nodeid: v2.nodeid, jointid: v2.jointid }, jointid: v2.from }))(v1.connections),
    ...newconnections
  ];
  if (foldlArray(boolConj)(true)(arrayMap((v2) => {
    if (v2.jointData.nodeid >= 0 && v2.jointData.nodeid < v.rails.length) {
      return allImpl((c) => c.from !== v2.jointData.jointid, v.rails[v2.jointData.nodeid].connections);
    }
    return true;
  })(connections))) {
    return $Maybe(
      "Just",
      updateSignalRoutes(foldlArray((l$p) => (v2) => addJoint(l$p)(v2.pos)(v1.nodeid)(v2.jointid))({
        ...v,
        updatecount: v.updatecount + 1 | 0,
        rails: [
          ...foldlArray((rs) => (v2) => {
            const $0 = v2.jointid;
            const $1 = v2.jointData.jointid;
            const $2 = modifyAt(v2.jointData.nodeid)((v3) => ({ ...v3, connections: [...v3.connections, { from: $1, nodeid: v1.nodeid, jointid: $0 }] }))(rs);
            if ($2.tag === "Nothing") {
              return rs;
            }
            if ($2.tag === "Just") {
              return $2._1;
            }
            fail();
          })(v.rails)(connections),
          (() => {
            const $0 = {
              ...v1,
              connections: [...v1.connections, ...arrayMap((v3) => ({ from: v3.jointid, nodeid: v3.jointData.nodeid, jointid: v3.jointData.jointid }))(newconnections)],
              instanceid: v.instancecount,
              pos
            };
            return { ...$0, drawinfos: instanceDrawInfos($0) };
          })()
        ],
        instancecount: v.instancecount + 1 | 0
      })(joints))
    );
  }
  return Nothing;
};
var addRail = (l) => (n) => {
  const $0 = getNewRailPos(l)(n);
  if ($0.tag === "Just") {
    return addRailWithPos(l)(n)($0._1);
  }
  if ($0.tag === "Nothing") {
    return Nothing;
  }
  fail();
};
var autoAdd = (v) => (selectednode) => (selectedjoint) => (rail) => (from) => {
  const $0 = getJointAbsPos(v)(selectednode)(selectedjoint);
  const $1 = (() => {
    if ($0.tag === "Just") {
      const rail$p = $0._1.isPlus === rail.getJointPos(from).isPlus ? memorizeRail(opposeRail_(rail)) : rail;
      return addRail(v)({
        nodeid: v.rails.length,
        instanceid: 0,
        state: rail$p.defaultState,
        rail: rail$p,
        connections: [{ from, nodeid: selectednode, jointid: selectedjoint }],
        signals: [],
        invalidRoutes: [],
        reserves: [],
        pos: poszero,
        drawinfos: [],
        note: "",
        color: []
      });
    }
    if ($0.tag === "Nothing") {
      return Nothing;
    }
    fail();
  })();
  if ($1.tag === "Nothing") {
    return v;
  }
  if ($1.tag === "Just") {
    return $1._1;
  }
  fail();
};
var fixBrokenConnections = (v) => foldlArray((l) => (v1) => {
  const $0 = addRailWithPos(l)({ ...v1, connections: [] })(v1.pos);
  if ($0.tag === "Nothing") {
    return l;
  }
  if ($0.tag === "Just") {
    return $0._1;
  }
  fail();
})({ ...v, rails: [], jointData: saEmpty })(v.rails);
var addInvalidRoute = (v) => (nodeid) => (jointid) => {
  if (nodeid >= 0 && nodeid < v.rails.length) {
    const $0 = v.rails[nodeid];
    if (anyImpl((v2) => v2.jointid === jointid, $0.signals) || anyImpl((v2) => v2.jointid === jointid, $0.invalidRoutes)) {
      return v;
    }
    const $1 = modifyAt(nodeid)((v2) => ({ ...v2, invalidRoutes: [...v2.invalidRoutes, { nodeid, jointid }] }))(v.rails);
    if ($1.tag === "Just") {
      return updateSignalRoutes({ ...v, updatecount: v.updatecount + 1 | 0, rails: $1._1 });
    }
    if ($1.tag === "Nothing") {
      return v;
    }
    fail();
  }
  return v;
};
var acceralate = (v) => (notch) => (dt) => ({ ...v, speed: max2(0)(v.speed + dt * calcAcceralation(notch)(v.speed)) });
var trainTick = (v) => (v1) => (dt) => {
  const nextsignal = getNextSignal(v)(v1);
  if (nextsignal.signal.tag === "Nothing") {
    const $0 = {
      ...v1,
      signalRestriction: max2(v1.signalRestriction)((() => {
        if (nextsignal.signal.tag === "Nothing") {
          return 0.625;
        }
        if (nextsignal.signal.tag === "Just") {
          return signalToSpeed(nextsignal.signal._1);
        }
        fail();
      })())
    };
    const notch = min1($0.notch)(getMaxNotch_(nextsignal)($0));
    const $1 = $0.realAcceralation ? acceralate($0)(notch)(dt) : $0;
    return movefoward(v)({
      ...$1,
      route: mapMaybe((x) => x)(arrayMap((v7) => {
        if (v7.nodeid >= 0 && v7.nodeid < v.rails.length) {
          return $Maybe("Just", { ...v7, railinstance: v.rails[v7.nodeid] });
        }
        return Nothing;
      })($1.route))
    })(dt);
  }
  if (nextsignal.signal.tag === "Just") {
    if (v1.signalRulePhase === 0) {
      const $02 = foldlArray((v3) => {
        const $03 = v3.l;
        const $13 = v3.t;
        return (r) => {
          if (anyImpl(test(getTag(r)), arrayMap(unsafeCoerce)(v1.tags))) {
            if (r.tag === "RuleComment") {
              return { l: $03, t: $13 };
            }
            if (r.tag === "RuleComplex") {
              return { l: $03, t: $13 };
            }
            if (r.tag === "RuleSpeed") {
              return { l: $03, t: $13 };
            }
            if (r.tag === "RuleOpen") {
              return { l: addRouteQueue($03)(nextsignal.signal._1.nodeid)(nextsignal.signal._1.jointid)(r._2)(v1.trainid), t: $13 };
            }
            if (r.tag === "RuleUpdate") {
              const $22 = r._2;
              const $32 = r._3;
              return { l: $03, t: { ...$13, tags: arrayMap((told) => replace2($22)($32)(told))($13.tags) } };
            }
            if (r.tag === "RuleStop") {
              return { l: setManualStop($03)(nextsignal.signal._1.nodeid)(nextsignal.signal._1.jointid)(true), t: $13 };
            }
            if (r.tag === "RuleStopOpen") {
              return { l: setManualStop($03)(nextsignal.signal._1.nodeid)(nextsignal.signal._1.jointid)(true), t: $13 };
            }
            if (r.tag === "RuleStopUpdate") {
              return { l: setManualStop($03)(nextsignal.signal._1.nodeid)(nextsignal.signal._1.jointid)(true), t: $13 };
            }
            if (r.tag === "RuleReverse") {
              return { l: setManualStop($03)(nextsignal.signal._1.nodeid)(nextsignal.signal._1.jointid)(true), t: $13 };
            }
            if (r.tag === "RuleReverseUpdate") {
              return { l: setManualStop($03)(nextsignal.signal._1.nodeid)(nextsignal.signal._1.jointid)(true), t: $13 };
            }
            fail();
          }
          return { l: $03, t: $13 };
        };
      })({ l: v, t: v1 })(nextsignal.signal._1.rules);
      const $12 = $02.l;
      const $2 = {
        ...$02.t,
        signalRestriction: max2($02.t.signalRestriction)((() => {
          if (nextsignal.signal.tag === "Nothing") {
            return 0.625;
          }
          if (nextsignal.signal.tag === "Just") {
            return signalToSpeed(nextsignal.signal._1);
          }
          fail();
        })()),
        signalRulePhase: 1
      };
      const notch2 = min1($2.notch)(getMaxNotch_(nextsignal)($2));
      const $3 = $2.realAcceralation ? acceralate($2)(notch2)(dt) : $2;
      return movefoward($12)({
        ...$3,
        route: mapMaybe((x) => x)(arrayMap((v7) => {
          if (v7.nodeid >= 0 && v7.nodeid < $12.rails.length) {
            return $Maybe("Just", { ...v7, railinstance: $12.rails[v7.nodeid] });
          }
          return Nothing;
        })($3.route))
      })(dt);
    }
    if (v1.signalRulePhase === 1 && v1.speed === 0) {
      const $02 = foldlArray((v3) => {
        const $03 = v3.f;
        const $13 = v3.l;
        const $22 = v3.t;
        return (r) => {
          if (anyImpl(test(getTag(r)), arrayMap(unsafeCoerce)(v1.tags))) {
            if (r.tag === "RuleComment") {
              return { f: $03, l: $13, t: $22 };
            }
            if (r.tag === "RuleComplex") {
              return { f: $03, l: $13, t: $22 };
            }
            if (r.tag === "RuleSpeed") {
              return { f: $03, l: $13, t: $22 };
            }
            if (r.tag === "RuleOpen") {
              return { f: $03, l: $13, t: $22 };
            }
            if (r.tag === "RuleUpdate") {
              return { f: $03, l: $13, t: $22 };
            }
            if (r.tag === "RuleStop") {
              return { f: $03, l: $13, t: $22 };
            }
            if (r.tag === "RuleStopOpen") {
              return { f: $03, l: addRouteQueue($13)(nextsignal.signal._1.nodeid)(nextsignal.signal._1.jointid)(r._2)(v1.trainid), t: $22 };
            }
            if (r.tag === "RuleStopUpdate") {
              const $32 = r._2;
              const $4 = r._3;
              return { f: $03, l: $13, t: { ...$22, tags: arrayMap((told) => replace2($32)($4)(told))($22.tags) } };
            }
            if (r.tag === "RuleReverse") {
              return { f: true, l: $13, t: { ...$22, signalRulePhase: 0 } };
            }
            if (r.tag === "RuleReverseUpdate") {
              const $32 = r._2;
              const $4 = r._3;
              return { f: true, l: $13, t: { ...$22, tags: arrayMap((told) => replace2($32)($4)(told))($22.tags), signalRulePhase: 0 } };
            }
            fail();
          }
          return { f: $03, l: $13, t: $22 };
        };
      })({ f: false, l: v, t: v1 })(nextsignal.signal._1.rules);
      const $12 = $02.l;
      const $2 = {
        ...($02.f ? flipTrain : identity5)($02.t.signalRulePhase === 1 ? { ...$02.t, signalRulePhase: 3 } : $02.t),
        signalRestriction: max2(($02.f ? flipTrain : identity5)($02.t.signalRulePhase === 1 ? { ...$02.t, signalRulePhase: 3 } : $02.t).signalRestriction)((() => {
          if (nextsignal.signal.tag === "Nothing") {
            return 0.625;
          }
          if (nextsignal.signal.tag === "Just") {
            return signalToSpeed(nextsignal.signal._1);
          }
          fail();
        })())
      };
      const notch2 = min1($2.notch)(getMaxNotch_(nextsignal)($2));
      const $3 = $2.realAcceralation ? acceralate($2)(notch2)(dt) : $2;
      return movefoward($12)({
        ...$3,
        route: mapMaybe((x) => x)(arrayMap((v7) => {
          if (v7.nodeid >= 0 && v7.nodeid < $12.rails.length) {
            return $Maybe("Just", { ...v7, railinstance: $12.rails[v7.nodeid] });
          }
          return Nothing;
        })($3.route))
      })(dt);
    }
    const $0 = {
      ...v1,
      signalRestriction: max2(v1.signalRestriction)((() => {
        if (nextsignal.signal.tag === "Nothing") {
          return 0.625;
        }
        if (nextsignal.signal.tag === "Just") {
          return signalToSpeed(nextsignal.signal._1);
        }
        fail();
      })())
    };
    const notch = min1($0.notch)(getMaxNotch_(nextsignal)($0));
    const $1 = $0.realAcceralation ? acceralate($0)(notch)(dt) : $0;
    return movefoward(v)({
      ...$1,
      route: mapMaybe((x) => x)(arrayMap((v7) => {
        if (v7.nodeid >= 0 && v7.nodeid < v.rails.length) {
          return $Maybe("Just", { ...v7, railinstance: v.rails[v7.nodeid] });
        }
        return Nothing;
      })($1.route))
    })(dt);
  }
  fail();
};
var moveTrains = (dt) => (v) => foldlArray((l) => (t) => {
  const v1 = trainTick(l)(t)(dt);
  return { ...v1.newlayout, trains: [...v1.newlayout.trains, v1.newtrainset] };
})({ ...v, trains: [] })(v.trains);
var layoutTick = (v) => {
  const $0 = updateSignalIndication(true)(updateReserves(updateTraffic(moveTrains(v.speed / 60)(v))));
  const $1 = foldlArray((v2) => {
    const $12 = v2.layout;
    const $2 = v2.queuenew;
    return (v3) => {
      if ($0.time < v3.retryafter) {
        return { layout: $12, queuenew: [...$2, v3] };
      }
      const v4 = tryOpenRouteFor($12)(v3.nodeid)(v3.jointid)(v3.routeid)(v3.trainid);
      if (v4.tag === "Nothing") {
        return { layout: $12, queuenew: [...$2, { ...v3, retryafter: $0.time + 0.25 }] };
      }
      if (v4.tag === "Just") {
        return { layout: setManualStop(v4._1.layout)(v3.nodeid)(v3.jointid)(false), queuenew: $2 };
      }
      fail();
    };
  })({ layout: $0, queuenew: [] })($0.routequeue);
  return { ...$1.layout, routequeue: $1.queuenew, time: v.time + v.speed / 60 };
};

// output-es/Data.EuclideanRing/foreign.js
var intMod = function(x) {
  return function(y) {
    if (y === 0) return 0;
    var yy = Math.abs(y);
    return (x % yy + yy) % yy;
  };
};

// output-es/Internal.Types.Serial/index.js
var intSerializeBoolean = {
  fromSerial: (i) => {
    if (i === 0) {
      return $Maybe("Just", false);
    }
    if (i === 1) {
      return $Maybe("Just", true);
    }
    return Nothing;
  },
  toSerial: (b) => {
    if (b) {
      return 1;
    }
    return 0;
  },
  lengthSerial: (v) => 2
};
var serialAll = (dictIntSerialize) => mapMaybe((x) => x)(arrayMap(dictIntSerialize.fromSerial)(rangeImpl(
  0,
  dictIntSerialize.lengthSerial($$Proxy) - 1 | 0
)));
var intSerializeSum = (dictIntSerialize) => (dictIntSerialize1) => ({
  fromSerial: (i) => {
    const l2 = dictIntSerialize1.lengthSerial($$Proxy);
    const l1 = dictIntSerialize.lengthSerial($$Proxy);
    if (0 <= i && i < l1) {
      const $0 = dictIntSerialize.fromSerial(i);
      if ($0.tag === "Just") {
        return $Maybe("Just", $Sum("Inl", $0._1));
      }
      return Nothing;
    }
    if (i < (l1 + l2 | 0)) {
      const $0 = dictIntSerialize1.fromSerial(i - l1 | 0);
      if ($0.tag === "Just") {
        return $Maybe("Just", $Sum("Inr", $0._1));
      }
    }
    return Nothing;
  },
  toSerial: (x$p) => {
    if (x$p.tag === "Inl") {
      return dictIntSerialize.toSerial(x$p._1);
    }
    if (x$p.tag === "Inr") {
      return dictIntSerialize1.toSerial(x$p._1) + dictIntSerialize.lengthSerial($$Proxy) | 0;
    }
    fail();
  },
  lengthSerial: (() => {
    const $0 = dictIntSerialize.lengthSerial($$Proxy) + dictIntSerialize1.lengthSerial($$Proxy) | 0;
    return (v) => $0;
  })()
});
var rowListSerializeCons = () => (dictIsSymbol) => (dictIntSerialize) => (dictRowListSerialize) => () => () => () => ({
  rlfromSerial: (v) => (i) => {
    const l1 = dictIntSerialize.lengthSerial($$Proxy);
    if (0 <= i && i < (l1 * dictRowListSerialize.rllengthSerial($$Proxy) | 0)) {
      const $0 = dictIntSerialize.fromSerial(intMod(i)(l1));
      if ($0.tag === "Just") {
        const $1 = dictRowListSerialize.rlfromSerial($$Proxy)(intDiv(i, l1));
        if ($1.tag === "Just") {
          return $Maybe("Just", unsafeSet(dictIsSymbol.reflectSymbol($$Proxy))($0._1)($1._1));
        }
      }
    }
    return Nothing;
  },
  rltoSerial: (v) => (v1) => dictIntSerialize.toSerial(unsafeGet(dictIsSymbol.reflectSymbol($$Proxy))(v1)) + (dictRowListSerialize.rltoSerial($$Proxy)(unsafeDelete(dictIsSymbol.reflectSymbol($$Proxy))(v1)) * dictRowListSerialize.rllengthSerial($$Proxy) | 0) | 0,
  rllengthSerial: (() => {
    const $0 = dictIntSerialize.lengthSerial($$Proxy) * dictRowListSerialize.rllengthSerial($$Proxy) | 0;
    return (v) => $0;
  })()
});

// output-es/Internal.Rails/index.js
var $JointsDouble = (tag) => tag;
var $JointsDoublePoint = (tag) => tag;
var $JointsPoint = (tag) => tag;
var $JointsSimple = (tag) => tag;
var $StateDiamond = (tag) => tag;
var $StateScissors = (tag) => tag;
var $StatesSolid = () => ({ tag: "StateSolid" });
var intSerializeConstructor = {
  fromSerial: (i) => {
    if (0 <= i && i < 1 && 0 <= i && i < 1) {
      return $Maybe("Just", NoArguments);
    }
    return Nothing;
  },
  toSerial: (v) => 0,
  lengthSerial: (v) => 1
};
var intSerializeSum1 = /* @__PURE__ */ intSerializeSum(intSerializeConstructor)(intSerializeConstructor);
var intSerializeSum2 = /* @__PURE__ */ intSerializeSum(intSerializeConstructor)(intSerializeSum1);
var rowListSerializeNilRow = {
  rlfromSerial: (v) => (i) => {
    if (0 <= i && i < 1) {
      return $Maybe("Just", {});
    }
    return Nothing;
  },
  rltoSerial: (v) => (v1) => 0,
  rllengthSerial: (v) => 1
};
var rowListSerializeCons1 = /* @__PURE__ */ rowListSerializeCons()({ reflectSymbol: () => "turnout" })(intSerializeBoolean)(rowListSerializeNilRow)()()();
var intSerializeSum3 = /* @__PURE__ */ intSerializeSum(intSerializeConstructor)(intSerializeSum2);
var StateSolid = /* @__PURE__ */ $StatesSolid();
var StateSP_P = /* @__PURE__ */ $StateScissors("StateSP_P");
var StateSP_S = /* @__PURE__ */ $StateScissors("StateSP_S");
var StateSP_N = /* @__PURE__ */ $StateScissors("StateSP_N");
var StateDM_P = /* @__PURE__ */ $StateDiamond("StateDM_P");
var StateDM_N = /* @__PURE__ */ $StateDiamond("StateDM_N");
var JointBegin = /* @__PURE__ */ $JointsSimple("JointBegin");
var JointEnd = /* @__PURE__ */ $JointsSimple("JointEnd");
var JointEnter = /* @__PURE__ */ $JointsPoint("JointEnter");
var JointMain = /* @__PURE__ */ $JointsPoint("JointMain");
var JointSub = /* @__PURE__ */ $JointsPoint("JointSub");
var JointOuterEnter = /* @__PURE__ */ $JointsDoublePoint("JointOuterEnter");
var JointInnerEnter = /* @__PURE__ */ $JointsDoublePoint("JointInnerEnter");
var JointInnerMain = /* @__PURE__ */ $JointsDoublePoint("JointInnerMain");
var JointOuterMain = /* @__PURE__ */ $JointsDoublePoint("JointOuterMain");
var JointInnerSub = /* @__PURE__ */ $JointsDoublePoint("JointInnerSub");
var JointOuterSub = /* @__PURE__ */ $JointsDoublePoint("JointOuterSub");
var JointOuterBegin = /* @__PURE__ */ $JointsDouble("JointOuterBegin");
var JointInnerEnd = /* @__PURE__ */ $JointsDouble("JointInnerEnd");
var JointInnerBegin = /* @__PURE__ */ $JointsDouble("JointInnerBegin");
var JointOuterEnd = /* @__PURE__ */ $JointsDouble("JointOuterEnd");
var intSerialize = {
  fromSerial: (i) => {
    if (0 <= i && i < 1 && 0 <= i && i < 1) {
      return $Maybe("Just", StateSolid);
    }
    return Nothing;
  },
  toSerial: (x) => 0,
  lengthSerial: (v) => 1
};
var serialAll2 = /* @__PURE__ */ serialAll(intSerialize);
var intSerialize1 = /* @__PURE__ */ (() => {
  const $0 = rowListSerializeCons1.rlfromSerial($$Proxy);
  const $1 = rowListSerializeCons1.rltoSerial($$Proxy);
  const $2 = rowListSerializeCons1.rllengthSerial($$Proxy);
  return {
    fromSerial: (i) => {
      if (0 <= i && i < $2 && 0 <= i && i < $2) {
        const $3 = $0(i);
        if ($3.tag === "Just") {
          return $Maybe("Just", $3._1);
        }
      }
      return Nothing;
    },
    toSerial: (x) => $1(x),
    lengthSerial: (v) => $2
  };
})();
var serialAll1 = /* @__PURE__ */ serialAll(intSerialize1);
var intSerialize2 = /* @__PURE__ */ (() => {
  const $0 = rowListSerializeCons()({ reflectSymbol: () => "innerturnout" })(intSerializeBoolean)(rowListSerializeCons()({
    reflectSymbol: () => "outerturnout"
  })(intSerializeBoolean)(rowListSerializeNilRow)()()())()()();
  const $1 = $0.rlfromSerial($$Proxy);
  const $2 = $0.rltoSerial($$Proxy);
  const $3 = $0.rllengthSerial($$Proxy);
  return {
    fromSerial: (i) => {
      if (0 <= i && i < $3 && 0 <= i && i < $3) {
        const $4 = $1(i);
        if ($4.tag === "Just") {
          return $Maybe("Just", $4._1);
        }
      }
      return Nothing;
    },
    toSerial: (x) => $2(x),
    lengthSerial: (v) => $3
  };
})();
var serialAll22 = /* @__PURE__ */ serialAll(intSerialize2);
var intSerialize3 = /* @__PURE__ */ (() => {
  const $0 = rowListSerializeCons()({ reflectSymbol: () => "auto" })(intSerializeBoolean)(rowListSerializeCons1)()()();
  const $1 = $0.rlfromSerial($$Proxy);
  const $2 = $0.rltoSerial($$Proxy);
  const $3 = $0.rllengthSerial($$Proxy);
  return {
    fromSerial: (i) => {
      if (0 <= i && i < $3 && 0 <= i && i < $3) {
        const $4 = $1(i);
        if ($4.tag === "Just") {
          return $Maybe("Just", $4._1);
        }
      }
      return Nothing;
    },
    toSerial: (x) => $2(x),
    lengthSerial: (v) => $3
  };
})();
var intSerialize4 = {
  fromSerial: (i) => {
    const $0 = intSerializeSum2.fromSerial(i);
    if ($0.tag === "Just") {
      return $Maybe(
        "Just",
        (() => {
          if ($0._1.tag === "Inl") {
            return StateSP_P;
          }
          if ($0._1.tag === "Inr") {
            if ($0._1._1.tag === "Inl") {
              return StateSP_S;
            }
            if ($0._1._1.tag === "Inr") {
              return StateSP_N;
            }
          }
          fail();
        })()
      );
    }
    return Nothing;
  },
  toSerial: (x) => intSerializeSum2.toSerial((() => {
    if (x === "StateSP_P") {
      return $Sum("Inl", NoArguments);
    }
    if (x === "StateSP_S") {
      return $Sum("Inr", $Sum("Inl", NoArguments));
    }
    if (x === "StateSP_N") {
      return $Sum("Inr", $Sum("Inr", NoArguments));
    }
    fail();
  })()),
  lengthSerial: (v) => intSerializeSum2.lengthSerial($$Proxy)
};
var intSerialize5 = {
  fromSerial: (i) => {
    const $0 = intSerializeSum1.fromSerial(i);
    if ($0.tag === "Just") {
      return $Maybe(
        "Just",
        (() => {
          if ($0._1.tag === "Inl") {
            return StateDM_P;
          }
          if ($0._1.tag === "Inr") {
            return StateDM_N;
          }
          fail();
        })()
      );
    }
    return Nothing;
  },
  toSerial: (x) => intSerializeSum1.toSerial((() => {
    if (x === "StateDM_P") {
      return $Sum("Inl", NoArguments);
    }
    if (x === "StateDM_N") {
      return $Sum("Inr", NoArguments);
    }
    fail();
  })()),
  lengthSerial: (v) => intSerializeSum1.lengthSerial($$Proxy)
};
var intSerialize6 = {
  fromSerial: (i) => {
    const $0 = intSerializeSum1.fromSerial(i);
    if ($0.tag === "Just") {
      return $Maybe(
        "Just",
        (() => {
          if ($0._1.tag === "Inl") {
            return JointBegin;
          }
          if ($0._1.tag === "Inr") {
            return JointEnd;
          }
          fail();
        })()
      );
    }
    return Nothing;
  },
  toSerial: (x) => intSerializeSum1.toSerial((() => {
    if (x === "JointBegin") {
      return $Sum("Inl", NoArguments);
    }
    if (x === "JointEnd") {
      return $Sum("Inr", NoArguments);
    }
    fail();
  })()),
  lengthSerial: (v) => intSerializeSum1.lengthSerial($$Proxy)
};
var serialAll3 = /* @__PURE__ */ serialAll(intSerialize6);
var halfRail = /* @__PURE__ */ (() => {
  const pe = { coord: { x: 0.5, y: 0, z: 0 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: true };
  const pb = { coord: { x: 0, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: false };
  const r0 = [{ start: pb, end: pe, length: partLength(pb)(pe) }];
  return memorizeRail(toRail_(intSerialize6)(intSerialize)({
    name: "half",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => ({ rails: arrayMap(activeRail)(r0), additionals: [] }),
    defaultState: StateSolid,
    getJoints: serialAll3,
    getStates: serialAll2,
    origin: JointBegin,
    getJointPos: (j) => {
      if (j === "JointBegin") {
        return pb;
      }
      if (j === "JointEnd") {
        return pe;
      }
      fail();
    },
    getNewState: (j) => (s) => {
      if (j === "JointBegin") {
        return { newjoint: JointEnd, newstate: s, shape: r0 };
      }
      if (j === "JointEnd") {
        return { newjoint: JointBegin, newstate: s, shape: reverseShapes(r0) };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if (f === "JointBegin" ? t !== "JointBegin" : !(f === "JointEnd" && t === "JointEnd")) {
        return $Maybe("Just", s);
      }
      return Nothing;
    },
    isLegal: (v) => (v1) => true,
    lockedBy: (v) => (v1) => [],
    isBlocked: (v) => (v1) => (v2) => true,
    isSimple: true
  }));
})();
var halfSlopeRail = /* @__PURE__ */ (() => {
  const pe = { coord: { x: 1, y: 0, z: 0.5 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: true };
  const pb = { coord: { x: 0, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: false };
  const r0 = [{ start: pb, end: pe, length: partLength(pb)(pe) }];
  return memorizeRail(toRail_(intSerialize6)(intSerialize)({
    name: "halfslope",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => ({ rails: arrayMap(activeRail)(r0), additionals: [] }),
    defaultState: StateSolid,
    getJoints: serialAll3,
    getStates: serialAll2,
    origin: JointBegin,
    getJointPos: (j) => {
      if (j === "JointBegin") {
        return pb;
      }
      if (j === "JointEnd") {
        return pe;
      }
      fail();
    },
    getNewState: (j) => (s) => {
      if (j === "JointBegin") {
        return { newjoint: JointEnd, newstate: s, shape: r0 };
      }
      if (j === "JointEnd") {
        return { newjoint: JointBegin, newstate: s, shape: reverseShapes(r0) };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if (f === "JointBegin" ? t !== "JointBegin" : !(f === "JointEnd" && t === "JointEnd")) {
        return $Maybe("Just", s);
      }
      return Nothing;
    },
    isLegal: (v) => (v1) => true,
    lockedBy: (v) => (v1) => [],
    isBlocked: (v) => (v1) => (v2) => true,
    isSimple: true
  }));
})();
var longRail = /* @__PURE__ */ (() => {
  const pe = { coord: { x: 2, y: 0, z: 0 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: true };
  const pb = { coord: { x: 0, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: false };
  const r0 = [{ start: pb, end: pe, length: partLength(pb)(pe) }];
  return memorizeRail(toRail_(intSerialize6)(intSerialize)({
    name: "long",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => ({ rails: arrayMap(activeRail)(r0), additionals: [] }),
    defaultState: StateSolid,
    getJoints: serialAll3,
    getStates: serialAll2,
    origin: JointBegin,
    getJointPos: (j) => {
      if (j === "JointBegin") {
        return pb;
      }
      if (j === "JointEnd") {
        return pe;
      }
      fail();
    },
    getNewState: (j) => (s) => {
      if (j === "JointBegin") {
        return { newjoint: JointEnd, newstate: s, shape: r0 };
      }
      if (j === "JointEnd") {
        return { newjoint: JointBegin, newstate: s, shape: reverseShapes(r0) };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if (f === "JointBegin" ? t !== "JointBegin" : !(f === "JointEnd" && t === "JointEnd")) {
        return $Maybe("Just", s);
      }
      return Nothing;
    },
    isLegal: (v) => (v1) => true,
    lockedBy: (v) => (v1) => [],
    isBlocked: (v) => (v1) => (v2) => true,
    isSimple: true
  }));
})();
var quarterRail = /* @__PURE__ */ (() => {
  const pe = { coord: { x: 0.25, y: 0, z: 0 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: true };
  const pb = { coord: { x: 0, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: false };
  const r0 = [{ start: pb, end: pe, length: partLength(pb)(pe) }];
  return memorizeRail(toRail_(intSerialize6)(intSerialize)({
    name: "quarter",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => ({ rails: arrayMap(activeRail)(r0), additionals: [] }),
    defaultState: StateSolid,
    getJoints: serialAll3,
    getStates: serialAll2,
    origin: JointBegin,
    getJointPos: (j) => {
      if (j === "JointBegin") {
        return pb;
      }
      if (j === "JointEnd") {
        return pe;
      }
      fail();
    },
    getNewState: (j) => (s) => {
      if (j === "JointBegin") {
        return { newjoint: JointEnd, newstate: s, shape: r0 };
      }
      if (j === "JointEnd") {
        return { newjoint: JointBegin, newstate: s, shape: reverseShapes(r0) };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if (f === "JointBegin" ? t !== "JointBegin" : !(f === "JointEnd" && t === "JointEnd")) {
        return $Maybe("Just", s);
      }
      return Nothing;
    },
    isLegal: (v) => (v1) => true,
    lockedBy: (v) => (v1) => [],
    isBlocked: (v) => (v1) => (v2) => true,
    isSimple: true
  }));
})();
var quarterSlopeRail = /* @__PURE__ */ (() => {
  const pe = { coord: { x: 1, y: 0, z: 0.25 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: true };
  const pb = { coord: { x: 0, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: false };
  const r0 = [{ start: pb, end: pe, length: partLength(pb)(pe) }];
  return memorizeRail(toRail_(intSerialize6)(intSerialize)({
    name: "quaterslope",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => ({ rails: arrayMap(activeRail)(r0), additionals: [] }),
    defaultState: StateSolid,
    getJoints: serialAll3,
    getStates: serialAll2,
    origin: JointBegin,
    getJointPos: (j) => {
      if (j === "JointBegin") {
        return pb;
      }
      if (j === "JointEnd") {
        return pe;
      }
      fail();
    },
    getNewState: (j) => (s) => {
      if (j === "JointBegin") {
        return { newjoint: JointEnd, newstate: s, shape: r0 };
      }
      if (j === "JointEnd") {
        return { newjoint: JointBegin, newstate: s, shape: reverseShapes(r0) };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if (f === "JointBegin" ? t !== "JointBegin" : !(f === "JointEnd" && t === "JointEnd")) {
        return $Maybe("Just", s);
      }
      return Nothing;
    },
    isLegal: (v) => (v1) => true,
    lockedBy: (v) => (v1) => [],
    isBlocked: (v) => (v1) => (v2) => true,
    isSimple: true
  }));
})();
var slopeCurveLRail = /* @__PURE__ */ (() => {
  const pe = { coord: { x: sqrt(0.5), y: 1 - sqrt(0.5), z: 0.25 }, angle: toNumber(1) * 6.283185307179586 / toNumber(8), isPlus: true };
  const pb = { coord: { x: 0, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: false };
  const r0 = [{ start: pb, end: pe, length: partLength(pb)(pe) }];
  return memorizeRail(toRail_(intSerialize6)(intSerialize)({
    name: "slopecurve",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => ({ rails: arrayMap(activeRail)(r0), additionals: [] }),
    defaultState: StateSolid,
    getJoints: serialAll3,
    getStates: serialAll2,
    origin: JointBegin,
    getJointPos: (j) => {
      if (j === "JointBegin") {
        return pb;
      }
      if (j === "JointEnd") {
        return pe;
      }
      fail();
    },
    getNewState: (j) => (s) => {
      if (j === "JointBegin") {
        return { newjoint: JointEnd, newstate: s, shape: r0 };
      }
      if (j === "JointEnd") {
        return { newjoint: JointBegin, newstate: s, shape: reverseShapes(r0) };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if (f === "JointBegin" ? t !== "JointBegin" : !(f === "JointEnd" && t === "JointEnd")) {
        return $Maybe("Just", s);
      }
      return Nothing;
    },
    isLegal: (v) => (v1) => true,
    lockedBy: (v) => (v1) => [],
    isBlocked: (v) => (v1) => (v2) => true,
    isSimple: true
  }));
})();
var slopeCurveRRail = /* @__PURE__ */ memorizeRail(/* @__PURE__ */ flipRail_(slopeCurveLRail));
var slopeRail = /* @__PURE__ */ (() => {
  const pe = { coord: { x: 2, y: 0, z: 1 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: true };
  const pb = { coord: { x: 0, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: false };
  const r0 = [{ start: pb, end: pe, length: partLength(pb)(pe) }];
  return memorizeRail(toRail_(intSerialize6)(intSerialize)({
    name: "slope",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => ({ rails: arrayMap(activeRail)(r0), additionals: [] }),
    defaultState: StateSolid,
    getJoints: serialAll3,
    getStates: serialAll2,
    origin: JointBegin,
    getJointPos: (j) => {
      if (j === "JointBegin") {
        return pb;
      }
      if (j === "JointEnd") {
        return pe;
      }
      fail();
    },
    getNewState: (j) => (s) => {
      if (j === "JointBegin") {
        return { newjoint: JointEnd, newstate: s, shape: r0 };
      }
      if (j === "JointEnd") {
        return { newjoint: JointBegin, newstate: s, shape: reverseShapes(r0) };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if (f === "JointBegin" ? t !== "JointBegin" : !(f === "JointEnd" && t === "JointEnd")) {
        return $Maybe("Just", s);
      }
      return Nothing;
    },
    isLegal: (v) => (v1) => true,
    lockedBy: (v) => (v1) => [],
    isBlocked: (v) => (v1) => (v2) => true,
    isSimple: true
  }));
})();
var straightRail = /* @__PURE__ */ (() => {
  const pe = { coord: { x: 1, y: 0, z: 0 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: true };
  const pb = { coord: { x: 0, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: false };
  const r0 = [{ start: pb, end: pe, length: partLength(pb)(pe) }];
  return memorizeRail(toRail_(intSerialize6)(intSerialize)({
    name: "straight",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => ({ rails: arrayMap(activeRail)(r0), additionals: [] }),
    defaultState: StateSolid,
    getJoints: serialAll3,
    getStates: serialAll2,
    origin: JointBegin,
    getJointPos: (j) => {
      if (j === "JointBegin") {
        return pb;
      }
      if (j === "JointEnd") {
        return pe;
      }
      fail();
    },
    getNewState: (j) => (s) => {
      if (j === "JointBegin") {
        return { newjoint: JointEnd, newstate: s, shape: r0 };
      }
      if (j === "JointEnd") {
        return { newjoint: JointBegin, newstate: s, shape: reverseShapes(r0) };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if (f === "JointBegin" ? t !== "JointBegin" : !(f === "JointEnd" && t === "JointEnd")) {
        return $Maybe("Just", s);
      }
      return Nothing;
    },
    isLegal: (v) => (v1) => true,
    lockedBy: (v) => (v1) => [],
    isBlocked: (v) => (v1) => (v2) => true,
    isSimple: true
  }));
})();
var intSerialize7 = {
  fromSerial: (i) => {
    const $0 = intSerializeSum2.fromSerial(i);
    if ($0.tag === "Just") {
      return $Maybe(
        "Just",
        (() => {
          if ($0._1.tag === "Inl") {
            return JointEnter;
          }
          if ($0._1.tag === "Inr") {
            if ($0._1._1.tag === "Inl") {
              return JointMain;
            }
            if ($0._1._1.tag === "Inr") {
              return JointSub;
            }
          }
          fail();
        })()
      );
    }
    return Nothing;
  },
  toSerial: (x) => intSerializeSum2.toSerial((() => {
    if (x === "JointEnter") {
      return $Sum("Inl", NoArguments);
    }
    if (x === "JointMain") {
      return $Sum("Inr", $Sum("Inl", NoArguments));
    }
    if (x === "JointSub") {
      return $Sum("Inr", $Sum("Inr", NoArguments));
    }
    fail();
  })()),
  lengthSerial: (v) => intSerializeSum2.lengthSerial($$Proxy)
};
var serialAll4 = /* @__PURE__ */ serialAll(intSerialize7);
var turnOutLPlusRail = /* @__PURE__ */ (() => {
  const ps = { coord: { x: sqrt(0.5), y: 1 - sqrt(0.5), z: 0 }, angle: toNumber(1) * 6.283185307179586 / toNumber(8), isPlus: true };
  const pm = { coord: { x: 1, y: 0, z: 0 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: true };
  const pe = { coord: { x: 0, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: false };
  const r0 = [{ start: pe, end: pm, length: partLength(pe)(pm) }];
  const r1 = [{ start: pe, end: ps, length: partLength(pe)(ps) }];
  return memorizeRail(toRail_(intSerialize7)(intSerialize1)({
    name: "turnout",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => {
      if (v.turnout) {
        return {
          rails: arrayBind([arrayMap(passiveRail)(r0), arrayMap(activeRail)(r1)])(identity),
          additionals: []
        };
      }
      return {
        rails: arrayBind([arrayMap(passiveRail)(r1), arrayMap(activeRail)(r0)])(identity),
        additionals: []
      };
    },
    defaultState: { turnout: false },
    getJoints: serialAll4,
    getStates: serialAll1,
    origin: JointEnter,
    getJointPos: (j) => {
      if (j === "JointEnter") {
        return pe;
      }
      if (j === "JointMain") {
        return pm;
      }
      if (j === "JointSub") {
        return ps;
      }
      fail();
    },
    getNewState: (j) => (v) => {
      if (j === "JointMain") {
        return { newjoint: JointEnter, newstate: { turnout: false }, shape: reverseShapes(r0) };
      }
      if (j === "JointSub") {
        return { newjoint: JointEnter, newstate: { turnout: true }, shape: reverseShapes(r1) };
      }
      if (j === "JointEnter") {
        if (v.turnout) {
          return { newjoint: JointSub, newstate: v, shape: r1 };
        }
        return { newjoint: JointMain, newstate: v, shape: r0 };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if (f === "JointEnter") {
        if (t === "JointEnter") {
          return Nothing;
        }
        if (t === "JointMain") {
          return $Maybe("Just", { ...s, turnout: false });
        }
        if (t === "JointSub") {
          return $Maybe("Just", { ...s, turnout: true });
        }
        fail();
      }
      if (f === "JointMain") {
        if (t === "JointEnter") {
          return $Maybe("Just", { ...s, turnout: false });
        }
        if (t === "JointMain") {
          return Nothing;
        }
        if (t === "JointSub") {
          return Nothing;
        }
        fail();
      }
      if (f === "JointSub") {
        if (t === "JointEnter") {
          return $Maybe("Just", { ...s, turnout: true });
        }
        if (t === "JointMain") {
          return Nothing;
        }
        if (t === "JointSub") {
          return Nothing;
        }
      }
      fail();
    },
    isLegal: (j) => (s) => {
      if (j === "JointEnter") {
        return true;
      }
      if (j === "JointMain") {
        return !s.turnout;
      }
      if (j === "JointSub") {
        return s.turnout;
      }
      fail();
    },
    lockedBy: (s) => (s$p) => {
      if (s.turnout === s$p.turnout) {
        return [];
      }
      return serialAll4;
    },
    isBlocked: (v) => (v1) => (v2) => true,
    isSimple: false
  }));
})();
var turnOutRPlusRail = /* @__PURE__ */ memorizeRail(/* @__PURE__ */ flipRail_(turnOutLPlusRail));
var intSerialize8 = /* @__PURE__ */ (() => {
  const $0 = intSerializeSum(intSerializeConstructor)(intSerializeSum(intSerializeConstructor)(intSerializeSum3));
  return {
    fromSerial: (i) => {
      const $1 = $0.fromSerial(i);
      if ($1.tag === "Just") {
        return $Maybe(
          "Just",
          (() => {
            if ($1._1.tag === "Inl") {
              return JointOuterEnter;
            }
            if ($1._1.tag === "Inr") {
              if ($1._1._1.tag === "Inl") {
                return JointInnerEnter;
              }
              if ($1._1._1.tag === "Inr") {
                if ($1._1._1._1.tag === "Inl") {
                  return JointInnerMain;
                }
                if ($1._1._1._1.tag === "Inr") {
                  if ($1._1._1._1._1.tag === "Inl") {
                    return JointOuterMain;
                  }
                  if ($1._1._1._1._1.tag === "Inr") {
                    if ($1._1._1._1._1._1.tag === "Inl") {
                      return JointInnerSub;
                    }
                    if ($1._1._1._1._1._1.tag === "Inr") {
                      return JointOuterSub;
                    }
                  }
                }
              }
            }
            fail();
          })()
        );
      }
      return Nothing;
    },
    toSerial: (x) => $0.toSerial((() => {
      if (x === "JointOuterEnter") {
        return $Sum("Inl", NoArguments);
      }
      if (x === "JointInnerEnter") {
        return $Sum("Inr", $Sum("Inl", NoArguments));
      }
      if (x === "JointInnerMain") {
        return $Sum("Inr", $Sum("Inr", $Sum("Inl", NoArguments)));
      }
      if (x === "JointOuterMain") {
        return $Sum("Inr", $Sum("Inr", $Sum("Inr", $Sum("Inl", NoArguments))));
      }
      if (x === "JointInnerSub") {
        return $Sum(
          "Inr",
          $Sum("Inr", $Sum("Inr", $Sum("Inr", $Sum("Inl", NoArguments))))
        );
      }
      if (x === "JointOuterSub") {
        return $Sum(
          "Inr",
          $Sum("Inr", $Sum("Inr", $Sum("Inr", $Sum("Inr", NoArguments))))
        );
      }
      fail();
    })()),
    lengthSerial: (v) => $0.lengthSerial($$Proxy)
  };
})();
var serialAll5 = /* @__PURE__ */ serialAll(intSerialize8);
var intSerialize9 = {
  fromSerial: (i) => {
    const $0 = intSerializeSum3.fromSerial(i);
    if ($0.tag === "Just") {
      return $Maybe(
        "Just",
        (() => {
          if ($0._1.tag === "Inl") {
            return JointOuterBegin;
          }
          if ($0._1.tag === "Inr") {
            if ($0._1._1.tag === "Inl") {
              return JointInnerEnd;
            }
            if ($0._1._1.tag === "Inr") {
              if ($0._1._1._1.tag === "Inl") {
                return JointInnerBegin;
              }
              if ($0._1._1._1.tag === "Inr") {
                return JointOuterEnd;
              }
            }
          }
          fail();
        })()
      );
    }
    return Nothing;
  },
  toSerial: (x) => intSerializeSum3.toSerial((() => {
    if (x === "JointOuterBegin") {
      return $Sum("Inl", NoArguments);
    }
    if (x === "JointInnerEnd") {
      return $Sum("Inr", $Sum("Inl", NoArguments));
    }
    if (x === "JointInnerBegin") {
      return $Sum("Inr", $Sum("Inr", $Sum("Inl", NoArguments)));
    }
    if (x === "JointOuterEnd") {
      return $Sum("Inr", $Sum("Inr", $Sum("Inr", NoArguments)));
    }
    fail();
  })()),
  lengthSerial: (v) => intSerializeSum3.lengthSerial($$Proxy)
};
var serialAll6 = /* @__PURE__ */ serialAll(intSerialize9);
var doubleTurnoutLPlusRail = /* @__PURE__ */ (() => {
  const pos = { coord: { x: sqrt(0.5), y: 1 - sqrt(0.5), z: 0 }, angle: toNumber(1) * 6.283185307179586 / toNumber(8), isPlus: true };
  const pom = { coord: { x: 1, y: 0, z: 0 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: true };
  const poe = { coord: { x: 0, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: false };
  const rom = [{ start: poe, end: pom, length: partLength(poe)(pom) }];
  const ros = [{ start: poe, end: pos, length: partLength(poe)(pos) }];
  const pis = {
    coord: { x: sqrt(0.5) * 1.280373831775701, y: (1 - sqrt(0.5)) * 1.280373831775701 - 0.28037383177570097, z: 0 },
    angle: toNumber(1) * 6.283185307179586 / toNumber(8),
    isPlus: true
  };
  const pim = { coord: { x: 1, y: -0.28037383177570097, z: 0 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: true };
  const pie = { coord: { x: 0, y: -0.28037383177570097, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: false };
  const rim = [{ start: pie, end: pim, length: partLength(pie)(pim) }];
  const ris = [{ start: pie, end: pis, length: partLength(pie)(pis) }];
  return memorizeRail(toRail_(intSerialize8)(intSerialize2)({
    name: "doubleTurnout",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => {
      if (v.outerturnout) {
        if (v.innerturnout) {
          return {
            rails: [
              ...arrayMap(passiveRail)(rom),
              ...arrayMap(passiveRail)(rim),
              ...arrayMap(activeRail)(ros),
              ...arrayMap(activeRail)(ris)
            ],
            additionals: []
          };
        }
        return {
          rails: [
            ...arrayMap(passiveRail)(rom),
            ...arrayMap(passiveRail)(ris),
            ...arrayMap(activeRail)(ros),
            ...arrayMap(activeRail)(rim)
          ],
          additionals: []
        };
      }
      if (v.innerturnout) {
        return {
          rails: [
            ...arrayMap(passiveRail)(ros),
            ...arrayMap(passiveRail)(rim),
            ...arrayMap(activeRail)(rom),
            ...arrayMap(activeRail)(ris)
          ],
          additionals: []
        };
      }
      return {
        rails: [
          ...arrayMap(passiveRail)(ros),
          ...arrayMap(passiveRail)(ris),
          ...arrayMap(activeRail)(rom),
          ...arrayMap(activeRail)(rim)
        ],
        additionals: []
      };
    },
    defaultState: { innerturnout: false, outerturnout: false },
    getJoints: serialAll5,
    getStates: serialAll22,
    origin: JointOuterEnter,
    getJointPos: (j) => {
      if (j === "JointOuterEnter") {
        return poe;
      }
      if (j === "JointOuterMain") {
        return pom;
      }
      if (j === "JointOuterSub") {
        return pos;
      }
      if (j === "JointInnerEnter") {
        return pie;
      }
      if (j === "JointInnerMain") {
        return pim;
      }
      if (j === "JointInnerSub") {
        return pis;
      }
      fail();
    },
    getNewState: (j) => (v) => {
      if (j === "JointOuterEnter") {
        if (v.outerturnout) {
          return { newjoint: JointOuterSub, newstate: v, shape: ros };
        }
        return { newjoint: JointOuterMain, newstate: v, shape: rom };
      }
      if (j === "JointOuterMain") {
        return { newjoint: JointOuterEnter, newstate: { ...v, outerturnout: false }, shape: reverseShapes(rom) };
      }
      if (j === "JointOuterSub") {
        return { newjoint: JointOuterEnter, newstate: { ...v, outerturnout: true }, shape: reverseShapes(ros) };
      }
      if (j === "JointInnerEnter") {
        if (v.innerturnout) {
          return { newjoint: JointInnerSub, newstate: v, shape: ris };
        }
        return { newjoint: JointInnerMain, newstate: v, shape: rim };
      }
      if (j === "JointInnerMain") {
        return { newjoint: JointInnerEnter, newstate: { ...v, innerturnout: false }, shape: reverseShapes(rim) };
      }
      if (j === "JointInnerSub") {
        return { newjoint: JointInnerEnter, newstate: { ...v, innerturnout: true }, shape: reverseShapes(ris) };
      }
      fail();
    },
    isLegal: (j) => (s) => {
      if (j === "JointOuterEnter") {
        return s.outerturnout || !s.innerturnout;
      }
      if (j === "JointOuterMain") {
        return !s.outerturnout && !s.innerturnout;
      }
      if (j === "JointOuterSub") {
        return s.outerturnout;
      }
      if (j === "JointInnerEnter") {
        return s.outerturnout || !s.innerturnout;
      }
      if (j === "JointInnerMain") {
        return !s.innerturnout;
      }
      if (j === "JointInnerSub") {
        return s.outerturnout && s.innerturnout;
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if (f === "JointOuterEnter") {
        if (t === "JointOuterEnter") {
          return Nothing;
        }
        if (t === "JointOuterMain") {
          return $Maybe("Just", { ...s, outerturnout: false, innerturnout: false });
        }
        if (t === "JointOuterSub") {
          return $Maybe("Just", { ...s, outerturnout: true });
        }
        if (t === "JointInnerEnter") {
          return Nothing;
        }
        if (t === "JointInnerMain") {
          return Nothing;
        }
        if (t === "JointInnerSub") {
          return Nothing;
        }
        fail();
      }
      if (f === "JointOuterMain") {
        if (t === "JointOuterEnter") {
          return $Maybe("Just", { ...s, outerturnout: false, innerturnout: false });
        }
        if (t === "JointOuterMain") {
          return Nothing;
        }
        if (t === "JointOuterSub") {
          return Nothing;
        }
        if (t === "JointInnerEnter") {
          return Nothing;
        }
        if (t === "JointInnerMain") {
          return Nothing;
        }
        if (t === "JointInnerSub") {
          return Nothing;
        }
        fail();
      }
      if (f === "JointOuterSub") {
        if (t === "JointOuterEnter") {
          return $Maybe("Just", { ...s, outerturnout: true });
        }
        if (t === "JointOuterMain") {
          return Nothing;
        }
        if (t === "JointOuterSub") {
          return Nothing;
        }
        if (t === "JointInnerEnter") {
          return Nothing;
        }
        if (t === "JointInnerMain") {
          return Nothing;
        }
        if (t === "JointInnerSub") {
          return Nothing;
        }
        fail();
      }
      if (f === "JointInnerEnter") {
        if (t === "JointOuterEnter") {
          return Nothing;
        }
        if (t === "JointOuterMain") {
          return Nothing;
        }
        if (t === "JointOuterSub") {
          return Nothing;
        }
        if (t === "JointInnerEnter") {
          return Nothing;
        }
        if (t === "JointInnerMain") {
          return $Maybe("Just", { ...s, innerturnout: false });
        }
        if (t === "JointInnerSub") {
          return $Maybe("Just", { ...s, innerturnout: true, outerturnout: true });
        }
        fail();
      }
      if (f === "JointInnerMain") {
        if (t === "JointOuterEnter") {
          return Nothing;
        }
        if (t === "JointOuterMain") {
          return Nothing;
        }
        if (t === "JointOuterSub") {
          return Nothing;
        }
        if (t === "JointInnerEnter") {
          return $Maybe("Just", { ...s, innerturnout: false });
        }
        if (t === "JointInnerMain") {
          return Nothing;
        }
        if (t === "JointInnerSub") {
          return Nothing;
        }
        fail();
      }
      if (f === "JointInnerSub") {
        if (t === "JointOuterEnter") {
          return Nothing;
        }
        if (t === "JointOuterMain") {
          return Nothing;
        }
        if (t === "JointOuterSub") {
          return Nothing;
        }
        if (t === "JointInnerEnter") {
          return $Maybe("Just", { ...s, innerturnout: true, outerturnout: true });
        }
        if (t === "JointInnerMain") {
          return Nothing;
        }
        if (t === "JointInnerSub") {
          return Nothing;
        }
      }
      fail();
    },
    lockedBy: (s) => (s$p) => {
      if (s.innerturnout === s$p.innerturnout && s.outerturnout === s$p.outerturnout) {
        return [];
      }
      return serialAll5;
    },
    isBlocked: (j) => (s) => (j$p) => {
      if (j === "JointOuterEnter") {
        if (j$p === "JointOuterEnter") {
          return true;
        }
        if (j$p === "JointOuterMain") {
          return true;
        }
        if (j$p === "JointOuterSub") {
          return true;
        }
        if (j$p === "JointInnerEnter") {
          return !s.outerturnout && s.innerturnout;
        }
        if (j$p === "JointInnerMain") {
          return false;
        }
        if (j$p === "JointInnerSub") {
          return !s.outerturnout;
        }
        fail();
      }
      if (j === "JointOuterMain") {
        if (j$p === "JointOuterEnter") {
          return true;
        }
        if (j$p === "JointOuterMain") {
          return true;
        }
        if (j$p === "JointOuterSub") {
          return true;
        }
        if (j$p === "JointInnerEnter") {
          return s.innerturnout;
        }
        if (j$p === "JointInnerMain") {
          return false;
        }
        if (j$p === "JointInnerSub") {
          return true;
        }
        fail();
      }
      if (j === "JointOuterSub") {
        if (j$p === "JointOuterEnter") {
          return true;
        }
        if (j$p === "JointOuterMain") {
          return true;
        }
        if (j$p === "JointOuterSub") {
          return true;
        }
        if (j$p === "JointInnerEnter") {
          return false;
        }
        if (j$p === "JointInnerMain") {
          return false;
        }
        if (j$p === "JointInnerSub") {
          return false;
        }
        fail();
      }
      if (j === "JointInnerEnter") {
        if (j$p === "JointOuterEnter") {
          return !s.outerturnout && s.innerturnout;
        }
        if (j$p === "JointOuterMain") {
          return s.innerturnout;
        }
        if (j$p === "JointOuterSub") {
          return false;
        }
        if (j$p === "JointInnerEnter") {
          return true;
        }
        if (j$p === "JointInnerMain") {
          return true;
        }
        if (j$p === "JointInnerSub") {
          return true;
        }
        fail();
      }
      if (j === "JointInnerMain") {
        if (j$p === "JointOuterEnter") {
          return false;
        }
        if (j$p === "JointOuterMain") {
          return false;
        }
        if (j$p === "JointOuterSub") {
          return false;
        }
        if (j$p === "JointInnerEnter") {
          return true;
        }
        if (j$p === "JointInnerMain") {
          return true;
        }
        if (j$p === "JointInnerSub") {
          return true;
        }
        fail();
      }
      if (j === "JointInnerSub") {
        if (j$p === "JointOuterEnter") {
          return !s.outerturnout;
        }
        if (j$p === "JointOuterMain") {
          return true;
        }
        if (j$p === "JointOuterSub") {
          return false;
        }
        if (j$p === "JointInnerEnter") {
          return true;
        }
        if (j$p === "JointInnerMain") {
          return true;
        }
        if (j$p === "JointInnerSub") {
          return true;
        }
      }
      fail();
    },
    isSimple: false
  }));
})();
var doubleTurnoutRPlusRail = /* @__PURE__ */ memorizeRail(/* @__PURE__ */ flipRail_(doubleTurnoutLPlusRail));
var outerCurveLRail = /* @__PURE__ */ (() => {
  const pe = {
    coord: { x: sqrt(0.5) * 1.280373831775701, y: (1 - sqrt(0.5)) * 1.280373831775701, z: 0 },
    angle: toNumber(1) * 6.283185307179586 / toNumber(8),
    isPlus: true
  };
  const pb = { coord: { x: 0, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: false };
  const r0 = [{ start: pb, end: pe, length: partLength(pb)(pe) }];
  return memorizeRail(toRail_(intSerialize6)(intSerialize)({
    name: "outercurve",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => ({ rails: arrayMap(activeRail)(r0), additionals: [] }),
    defaultState: StateSolid,
    getJoints: serialAll3,
    getStates: serialAll2,
    origin: JointBegin,
    getJointPos: (j) => {
      if (j === "JointBegin") {
        return pb;
      }
      if (j === "JointEnd") {
        return pe;
      }
      fail();
    },
    getNewState: (j) => (s) => {
      if (j === "JointBegin") {
        return { newjoint: JointEnd, newstate: s, shape: r0 };
      }
      if (j === "JointEnd") {
        return { newjoint: JointBegin, newstate: s, shape: reverseShapes(r0) };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if (f === "JointBegin" ? t !== "JointBegin" : !(f === "JointEnd" && t === "JointEnd")) {
        return $Maybe("Just", s);
      }
      return Nothing;
    },
    isLegal: (v) => (v1) => true,
    lockedBy: (v) => (v1) => [],
    isBlocked: (v) => (v1) => (v2) => true,
    isSimple: true
  }));
})();
var outerCurveRRail = /* @__PURE__ */ memorizeRail(/* @__PURE__ */ flipRail_(outerCurveLRail));
var scissorsRail = /* @__PURE__ */ (() => {
  const poe = { coord: { x: 1, y: 0, z: 0 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: false };
  const pob = { coord: { x: 0, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: true };
  const ro = [{ start: pob, end: poe, length: partLength(pob)(poe) }];
  const pie = { coord: { x: 0, y: -0.28037383177570097, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: true };
  const rn = slipShapes()({ start: pie, end: poe });
  const pib = { coord: { x: 1, y: -0.28037383177570097, z: 0 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: false };
  const ri = [{ start: pib, end: pie, length: partLength(pib)(pie) }];
  const rp = slipShapes()({ start: pob, end: pib });
  return memorizeRail(toRail_(intSerialize9)(intSerialize4)({
    name: "scissors",
    flipped: false,
    opposed: false,
    getDrawInfo: (s) => {
      if (s === "StateSP_P") {
        return {
          rails: [
            ...arrayMap(passiveRail)(ri),
            ...arrayMap(passiveRail)(ro),
            ...arrayMap(passiveRail)(rn),
            ...arrayMap(activeRail)(rp)
          ],
          additionals: []
        };
      }
      if (s === "StateSP_S") {
        return {
          rails: [
            ...arrayMap(passiveRail)(rn),
            ...arrayMap(passiveRail)(rp),
            ...arrayMap(activeRail)(ri),
            ...arrayMap(activeRail)(ro)
          ],
          additionals: []
        };
      }
      if (s === "StateSP_N") {
        return {
          rails: [
            ...arrayMap(passiveRail)(ri),
            ...arrayMap(passiveRail)(ro),
            ...arrayMap(passiveRail)(rp),
            ...arrayMap(activeRail)(rn)
          ],
          additionals: []
        };
      }
      fail();
    },
    defaultState: StateSP_S,
    getJoints: serialAll6,
    getStates: serialAll(intSerialize4),
    origin: JointOuterBegin,
    getJointPos: (j) => {
      if (j === "JointOuterBegin") {
        return pob;
      }
      if (j === "JointOuterEnd") {
        return poe;
      }
      if (j === "JointInnerBegin") {
        return pib;
      }
      if (j === "JointInnerEnd") {
        return pie;
      }
      fail();
    },
    getNewState: (j) => (s) => {
      if (s === "StateSP_P") {
        if (j === "JointInnerBegin") {
          return { newjoint: JointOuterBegin, newstate: StateSP_P, shape: reverseShapes(rp) };
        }
        if (j === "JointInnerEnd") {
          return { newjoint: JointInnerBegin, newstate: StateSP_S, shape: reverseShapes(ri) };
        }
        if (j === "JointOuterBegin") {
          return { newjoint: JointInnerBegin, newstate: StateSP_P, shape: rp };
        }
        if (j === "JointOuterEnd") {
          return { newjoint: JointOuterBegin, newstate: StateSP_S, shape: reverseShapes(ro) };
        }
        fail();
      }
      if (s === "StateSP_S") {
        if (j === "JointInnerBegin") {
          return { newjoint: JointInnerEnd, newstate: StateSP_S, shape: ri };
        }
        if (j === "JointInnerEnd") {
          return { newjoint: JointInnerBegin, newstate: StateSP_S, shape: reverseShapes(ri) };
        }
        if (j === "JointOuterBegin") {
          return { newjoint: JointOuterEnd, newstate: StateSP_S, shape: ro };
        }
        if (j === "JointOuterEnd") {
          return { newjoint: JointOuterBegin, newstate: StateSP_S, shape: reverseShapes(ro) };
        }
        fail();
      }
      if (s === "StateSP_N") {
        if (j === "JointInnerBegin") {
          return { newjoint: JointInnerEnd, newstate: StateSP_S, shape: ri };
        }
        if (j === "JointInnerEnd") {
          return { newjoint: JointOuterEnd, newstate: StateSP_N, shape: rn };
        }
        if (j === "JointOuterBegin") {
          return { newjoint: JointOuterEnd, newstate: StateSP_S, shape: ro };
        }
        if (j === "JointOuterEnd") {
          return { newjoint: JointInnerEnd, newstate: StateSP_N, shape: reverseShapes(rn) };
        }
      }
      fail();
    },
    getRoute: (v) => (f) => (t) => {
      if (f === "JointInnerBegin") {
        if (t === "JointInnerBegin") {
          return Nothing;
        }
        if (t === "JointInnerEnd") {
          return $Maybe("Just", StateSP_S);
        }
        if (t === "JointOuterBegin") {
          return $Maybe("Just", StateSP_P);
        }
        if (t === "JointOuterEnd") {
          return Nothing;
        }
        fail();
      }
      if (f === "JointInnerEnd") {
        if (t === "JointInnerBegin") {
          return $Maybe("Just", StateSP_S);
        }
        if (t === "JointInnerEnd") {
          return Nothing;
        }
        if (t === "JointOuterBegin") {
          return Nothing;
        }
        if (t === "JointOuterEnd") {
          return $Maybe("Just", StateSP_N);
        }
        fail();
      }
      if (f === "JointOuterBegin") {
        if (t === "JointInnerBegin") {
          return $Maybe("Just", StateSP_P);
        }
        if (t === "JointInnerEnd") {
          return Nothing;
        }
        if (t === "JointOuterBegin") {
          return Nothing;
        }
        if (t === "JointOuterEnd") {
          return $Maybe("Just", StateSP_S);
        }
        fail();
      }
      if (f === "JointOuterEnd") {
        if (t === "JointInnerBegin") {
          return Nothing;
        }
        if (t === "JointInnerEnd") {
          return $Maybe("Just", StateSP_N);
        }
        if (t === "JointOuterBegin") {
          return $Maybe("Just", StateSP_S);
        }
        if (t === "JointOuterEnd") {
          return Nothing;
        }
      }
      fail();
    },
    isLegal: (j) => (s) => {
      if (j === "JointInnerBegin") {
        return s === "StateSP_P" || s === "StateSP_S" || s !== "StateSP_N";
      }
      if (j === "JointInnerEnd") {
        return s !== "StateSP_P";
      }
      if (j === "JointOuterBegin") {
        return s === "StateSP_P" || s === "StateSP_S" || s !== "StateSP_N";
      }
      if (j === "JointOuterEnd") {
        return s !== "StateSP_P";
      }
      fail();
    },
    lockedBy: (s) => (s$p) => {
      if ((() => {
        if (s === "StateSP_P") {
          return s$p === "StateSP_P";
        }
        if (s === "StateSP_S") {
          return s$p === "StateSP_S";
        }
        return s === "StateSP_N" && s$p === "StateSP_N";
      })()) {
        return [];
      }
      return serialAll6;
    },
    isBlocked: (j) => (s) => (j$p) => {
      if (s === "StateSP_P" || s !== "StateSP_S") {
        return true;
      }
      if (j$p === "JointInnerBegin") {
        return j === "JointInnerEnd";
      }
      if (j$p === "JointInnerEnd") {
        return j === "JointInnerBegin";
      }
      if (j$p === "JointOuterBegin") {
        return j === "JointOuterEnd";
      }
      if (j$p === "JointOuterEnd") {
        return j === "JointOuterBegin";
      }
      fail();
    },
    isSimple: false
  }));
})();
var diamondRail = /* @__PURE__ */ (() => {
  const poe = { coord: { x: 1, y: 0, z: 0 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: false };
  const pob = { coord: { x: 0, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: true };
  const pie = { coord: { x: 0, y: -0.28037383177570097, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: true };
  const rn = slipShapes()({ start: pie, end: poe });
  const pib = { coord: { x: 1, y: -0.28037383177570097, z: 0 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: false };
  const rp = slipShapes()({ start: pob, end: pib });
  return memorizeRail(toRail_(intSerialize9)(intSerialize5)({
    name: "diamond",
    flipped: false,
    opposed: false,
    getDrawInfo: (s) => {
      if (s === "StateDM_P") {
        return { rails: [...arrayMap(passiveRail)(rn), ...arrayMap(activeRail)(rp)], additionals: [] };
      }
      if (s === "StateDM_N") {
        return { rails: [...arrayMap(passiveRail)(rp), ...arrayMap(activeRail)(rn)], additionals: [] };
      }
      fail();
    },
    defaultState: StateDM_P,
    getJoints: serialAll6,
    getStates: serialAll(intSerialize5),
    origin: JointOuterBegin,
    getJointPos: (j) => {
      if (j === "JointOuterBegin") {
        return pob;
      }
      if (j === "JointOuterEnd") {
        return poe;
      }
      if (j === "JointInnerBegin") {
        return pib;
      }
      if (j === "JointInnerEnd") {
        return pie;
      }
      fail();
    },
    getNewState: (j) => (v) => {
      if (j === "JointInnerBegin") {
        return { newjoint: JointOuterBegin, newstate: StateDM_P, shape: reverseShapes(rp) };
      }
      if (j === "JointInnerEnd") {
        return { newjoint: JointOuterEnd, newstate: StateDM_N, shape: rn };
      }
      if (j === "JointOuterBegin") {
        return { newjoint: JointInnerBegin, newstate: StateDM_P, shape: rp };
      }
      if (j === "JointOuterEnd") {
        return { newjoint: JointInnerEnd, newstate: StateDM_N, shape: reverseShapes(rn) };
      }
      fail();
    },
    getRoute: (v) => (f) => (t) => {
      if (f === "JointInnerBegin") {
        if (t === "JointInnerBegin") {
          return Nothing;
        }
        if (t === "JointInnerEnd") {
          return Nothing;
        }
        if (t === "JointOuterBegin") {
          return $Maybe("Just", StateDM_P);
        }
        if (t === "JointOuterEnd") {
          return Nothing;
        }
        fail();
      }
      if (f === "JointInnerEnd") {
        if (t === "JointInnerBegin") {
          return Nothing;
        }
        if (t === "JointInnerEnd") {
          return Nothing;
        }
        if (t === "JointOuterBegin") {
          return Nothing;
        }
        if (t === "JointOuterEnd") {
          return $Maybe("Just", StateDM_N);
        }
        fail();
      }
      if (f === "JointOuterBegin") {
        if (t === "JointInnerBegin") {
          return $Maybe("Just", StateDM_P);
        }
        if (t === "JointInnerEnd") {
          return Nothing;
        }
        if (t === "JointOuterBegin") {
          return Nothing;
        }
        if (t === "JointOuterEnd") {
          return Nothing;
        }
        fail();
      }
      if (f === "JointOuterEnd") {
        if (t === "JointInnerBegin") {
          return Nothing;
        }
        if (t === "JointInnerEnd") {
          return $Maybe("Just", StateDM_N);
        }
        if (t === "JointOuterBegin") {
          return Nothing;
        }
        if (t === "JointOuterEnd") {
          return Nothing;
        }
      }
      fail();
    },
    isLegal: (j) => (s) => {
      if (j === "JointInnerBegin") {
        return s === "StateDM_P" || s !== "StateDM_N";
      }
      if (j === "JointInnerEnd") {
        return s !== "StateDM_P";
      }
      if (j === "JointOuterBegin") {
        return s === "StateDM_P" || s !== "StateDM_N";
      }
      if (j === "JointOuterEnd") {
        return s !== "StateDM_P";
      }
      fail();
    },
    lockedBy: (s) => (s$p) => {
      if (s === "StateDM_P" ? s$p === "StateDM_P" : s === "StateDM_N" && s$p === "StateDM_N") {
        return [];
      }
      return serialAll6;
    },
    isBlocked: (v) => (v1) => (v2) => true,
    isSimple: true
  }));
})();
var curveLRail = /* @__PURE__ */ (() => {
  const pe = { coord: { x: sqrt(0.5), y: 1 - sqrt(0.5), z: 0 }, angle: toNumber(1) * 6.283185307179586 / toNumber(8), isPlus: true };
  const pb = { coord: { x: 0, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: false };
  const r0 = [{ start: pb, end: pe, length: partLength(pb)(pe) }];
  return memorizeRail(toRail_(intSerialize6)(intSerialize)({
    name: "curve",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => ({ rails: arrayMap(activeRail)(r0), additionals: [] }),
    defaultState: StateSolid,
    getJoints: serialAll3,
    getStates: serialAll2,
    origin: JointBegin,
    getJointPos: (j) => {
      if (j === "JointBegin") {
        return pb;
      }
      if (j === "JointEnd") {
        return pe;
      }
      fail();
    },
    getNewState: (j) => (s) => {
      if (j === "JointBegin") {
        return { newjoint: JointEnd, newstate: s, shape: r0 };
      }
      if (j === "JointEnd") {
        return { newjoint: JointBegin, newstate: s, shape: reverseShapes(r0) };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if (f === "JointBegin" ? t !== "JointBegin" : !(f === "JointEnd" && t === "JointEnd")) {
        return $Maybe("Just", s);
      }
      return Nothing;
    },
    isLegal: (v) => (v1) => true,
    lockedBy: (v) => (v1) => [],
    isBlocked: (v) => (v1) => (v2) => true,
    isSimple: true
  }));
})();
var curveRRail = /* @__PURE__ */ memorizeRail(/* @__PURE__ */ flipRail_(curveLRail));
var crossoverLRail = /* @__PURE__ */ (() => {
  const poe = { coord: { x: 1, y: 0, z: 0 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: false };
  const pob = { coord: { x: 0, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: true };
  const ro = [{ start: pob, end: poe, length: partLength(pob)(poe) }];
  const pie = { coord: { x: 0, y: -0.28037383177570097, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: true };
  const rn = slipShapes()({ start: pie, end: poe });
  const pib = { coord: { x: 1, y: -0.28037383177570097, z: 0 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: false };
  const ri = [{ start: pib, end: pie, length: partLength(pib)(pie) }];
  return memorizeRail(toRail_(intSerialize9)(intSerialize2)({
    name: "crossover",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => {
      if (v.outerturnout) {
        if (v.innerturnout) {
          return {
            rails: [
              ...arrayMap(passiveRail)(ri),
              ...arrayMap(passiveRail)(ro),
              ...arrayMap(activeRail)(rn)
            ],
            additionals: []
          };
        }
        return {
          rails: [
            ...arrayMap(passiveRail)(ro),
            ...arrayMap(activeRail)(ri),
            ...arrayMap(activeRail)(rn)
          ],
          additionals: []
        };
      }
      if (v.innerturnout) {
        return {
          rails: [
            ...arrayMap(passiveRail)(ri),
            ...arrayMap(activeRail)(ro),
            ...arrayMap(activeRail)(rn)
          ],
          additionals: []
        };
      }
      return {
        rails: [
          ...arrayMap(passiveRail)(rn),
          ...arrayMap(activeRail)(ri),
          ...arrayMap(activeRail)(ro)
        ],
        additionals: []
      };
    },
    defaultState: { innerturnout: false, outerturnout: false },
    getJoints: serialAll6,
    getStates: serialAll22,
    origin: JointInnerEnd,
    getJointPos: (j) => {
      if (j === "JointOuterBegin") {
        return pob;
      }
      if (j === "JointOuterEnd") {
        return poe;
      }
      if (j === "JointInnerBegin") {
        return pib;
      }
      if (j === "JointInnerEnd") {
        return pie;
      }
      fail();
    },
    getNewState: (j) => (v) => {
      if (v.outerturnout) {
        if (v.innerturnout) {
          if (j === "JointInnerBegin") {
            return { newjoint: JointInnerEnd, newstate: { ...v, innerturnout: false }, shape: ri };
          }
          if (j === "JointInnerEnd") {
            return { newjoint: JointOuterEnd, newstate: v, shape: rn };
          }
          if (j === "JointOuterBegin") {
            return { newjoint: JointOuterEnd, newstate: { ...v, outerturnout: false }, shape: ro };
          }
          if (j === "JointOuterEnd") {
            return { newjoint: JointInnerEnd, newstate: v, shape: reverseShapes(rn) };
          }
          fail();
        }
        if (j === "JointInnerBegin") {
          return { newjoint: JointInnerEnd, newstate: v, shape: ri };
        }
        if (j === "JointInnerEnd") {
          return { newjoint: JointInnerBegin, newstate: v, shape: reverseShapes(ri) };
        }
        if (j === "JointOuterBegin") {
          return { newjoint: JointOuterEnd, newstate: { ...v, outerturnout: false }, shape: ro };
        }
        if (j === "JointOuterEnd") {
          return { newjoint: JointInnerEnd, newstate: { ...v, innerturnout: true }, shape: reverseShapes(rn) };
        }
        fail();
      }
      if (v.innerturnout) {
        if (j === "JointInnerBegin") {
          return { newjoint: JointInnerEnd, newstate: { ...v, innerturnout: false }, shape: ri };
        }
        if (j === "JointInnerEnd") {
          return { newjoint: JointOuterEnd, newstate: { ...v, outerturnout: true }, shape: rn };
        }
        if (j === "JointOuterBegin") {
          return { newjoint: JointOuterEnd, newstate: v, shape: ro };
        }
        if (j === "JointOuterEnd") {
          return { newjoint: JointOuterBegin, newstate: v, shape: reverseShapes(ro) };
        }
        fail();
      }
      if (j === "JointInnerBegin") {
        return { newjoint: JointInnerEnd, newstate: v, shape: ri };
      }
      if (j === "JointInnerEnd") {
        return { newjoint: JointInnerBegin, newstate: v, shape: reverseShapes(ri) };
      }
      if (j === "JointOuterBegin") {
        return { newjoint: JointOuterEnd, newstate: v, shape: ro };
      }
      if (j === "JointOuterEnd") {
        return { newjoint: JointOuterBegin, newstate: v, shape: reverseShapes(ro) };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if (f === "JointInnerBegin") {
        if (t === "JointInnerBegin") {
          return Nothing;
        }
        if (t === "JointInnerEnd") {
          return $Maybe("Just", { ...s, innerturnout: false, outerturnout: false });
        }
        if (t === "JointOuterBegin") {
          return Nothing;
        }
        if (t === "JointOuterEnd") {
          return Nothing;
        }
        fail();
      }
      if (f === "JointInnerEnd") {
        if (t === "JointInnerBegin") {
          return $Maybe("Just", { ...s, innerturnout: false, outerturnout: false });
        }
        if (t === "JointInnerEnd") {
          return Nothing;
        }
        if (t === "JointOuterBegin") {
          return Nothing;
        }
        if (t === "JointOuterEnd") {
          return $Maybe("Just", { ...s, innerturnout: true, outerturnout: true });
        }
        fail();
      }
      if (f === "JointOuterBegin") {
        if (t === "JointInnerBegin") {
          return Nothing;
        }
        if (t === "JointInnerEnd") {
          return Nothing;
        }
        if (t === "JointOuterBegin") {
          return Nothing;
        }
        if (t === "JointOuterEnd") {
          return $Maybe("Just", { ...s, innerturnout: false, outerturnout: false });
        }
        fail();
      }
      if (f === "JointOuterEnd") {
        if (t === "JointInnerBegin") {
          return Nothing;
        }
        if (t === "JointInnerEnd") {
          return $Maybe("Just", { ...s, innerturnout: true, outerturnout: true });
        }
        if (t === "JointOuterBegin") {
          return $Maybe("Just", { ...s, innerturnout: false, outerturnout: false });
        }
        if (t === "JointOuterEnd") {
          return Nothing;
        }
      }
      fail();
    },
    isLegal: (j) => (s) => {
      if (j === "JointInnerBegin") {
        return !s.innerturnout && !s.outerturnout;
      }
      if (j === "JointInnerEnd") {
        return s.innerturnout === s.outerturnout;
      }
      if (j === "JointOuterBegin") {
        return !s.innerturnout && !s.outerturnout;
      }
      if (j === "JointOuterEnd") {
        return s.innerturnout === s.outerturnout;
      }
      fail();
    },
    lockedBy: (s) => (s$p) => {
      if (s.innerturnout === s$p.innerturnout && s.outerturnout === s$p.outerturnout) {
        return [];
      }
      return serialAll6;
    },
    isBlocked: (j) => (s) => (j$p) => {
      if (s.innerturnout && s.outerturnout) {
        return true;
      }
      if (j$p === "JointInnerBegin") {
        return j === "JointInnerEnd";
      }
      if (j$p === "JointInnerEnd") {
        return j === "JointInnerBegin";
      }
      if (j$p === "JointOuterBegin") {
        return j === "JointOuterEnd";
      }
      if (j$p === "JointOuterEnd") {
        return j === "JointOuterBegin";
      }
      fail();
    },
    isSimple: false
  }));
})();
var crossoverRRail = /* @__PURE__ */ memorizeRail(/* @__PURE__ */ flipRail_(crossoverLRail));
var converterRail = /* @__PURE__ */ (() => {
  const pe = { coord: { x: 0.25, y: 0, z: 0 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: false };
  const pb = { coord: { x: 0, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: false };
  const r0 = [{ start: pb, end: pe, length: partLength(pb)(pe) }];
  return memorizeRail(toRail_(intSerialize6)(intSerialize)({
    name: "converter",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => ({ rails: arrayMap(activeRail)(r0), additionals: [] }),
    defaultState: StateSolid,
    getJoints: serialAll3,
    getStates: serialAll2,
    origin: JointBegin,
    getJointPos: (j) => {
      if (j === "JointBegin") {
        return pb;
      }
      if (j === "JointEnd") {
        return pe;
      }
      fail();
    },
    getNewState: (j) => (s) => {
      if (j === "JointBegin") {
        return { newjoint: JointEnd, newstate: s, shape: r0 };
      }
      if (j === "JointEnd") {
        return { newjoint: JointBegin, newstate: s, shape: reverseShapes(r0) };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if (f === "JointBegin" ? t !== "JointBegin" : !(f === "JointEnd" && t === "JointEnd")) {
        return $Maybe("Just", s);
      }
      return Nothing;
    },
    isLegal: (v) => (v1) => true,
    lockedBy: (v) => (v1) => [],
    isBlocked: (v) => (v1) => (v2) => true,
    isSimple: true
  }));
})();
var doubleToWideLRail = /* @__PURE__ */ (() => {
  const poe = { coord: { x: 1.25, y: 0.21962616822429903, z: 0 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: true };
  const pob = { coord: { x: 0, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: false };
  const ro = slipShapes()({ start: pob, end: poe });
  const pie = { coord: { x: 0, y: -0.28037383177570097, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: false };
  const rn = slipShapes()({ start: pie, end: poe });
  const pib = { coord: { x: 1.25, y: -0.28037383177570097, z: 0 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: false };
  const ri = [{ start: pib, end: pie, length: partLength(pib)(pie) }];
  return memorizeRail(toRail_(intSerialize9)(intSerialize2)({
    name: "doubletowide",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => {
      if (v.outerturnout) {
        if (v.innerturnout) {
          return {
            rails: [
              ...arrayMap(passiveRail)(ri),
              ...arrayMap(passiveRail)(ro),
              ...arrayMap(activeRail)(rn)
            ],
            additionals: []
          };
        }
        return {
          rails: [
            ...arrayMap(passiveRail)(ro),
            ...arrayMap(activeRail)(ri),
            ...arrayMap(activeRail)(rn)
          ],
          additionals: []
        };
      }
      if (v.innerturnout) {
        return {
          rails: [
            ...arrayMap(passiveRail)(ri),
            ...arrayMap(activeRail)(ro),
            ...arrayMap(activeRail)(rn)
          ],
          additionals: []
        };
      }
      return {
        rails: [
          ...arrayMap(passiveRail)(rn),
          ...arrayMap(activeRail)(ri),
          ...arrayMap(activeRail)(ro)
        ],
        additionals: []
      };
    },
    defaultState: { innerturnout: false, outerturnout: false },
    getJoints: serialAll6,
    getStates: serialAll22,
    origin: JointOuterBegin,
    getJointPos: (j) => {
      if (j === "JointOuterBegin") {
        return pob;
      }
      if (j === "JointOuterEnd") {
        return poe;
      }
      if (j === "JointInnerBegin") {
        return pib;
      }
      if (j === "JointInnerEnd") {
        return pie;
      }
      fail();
    },
    getNewState: (j) => (v) => {
      if (v.outerturnout) {
        if (v.innerturnout) {
          if (j === "JointInnerBegin") {
            return { newjoint: JointInnerEnd, newstate: { ...v, innerturnout: false }, shape: ri };
          }
          if (j === "JointInnerEnd") {
            return { newjoint: JointOuterEnd, newstate: v, shape: rn };
          }
          if (j === "JointOuterBegin") {
            return { newjoint: JointOuterEnd, newstate: { ...v, outerturnout: false }, shape: ro };
          }
          if (j === "JointOuterEnd") {
            return { newjoint: JointInnerEnd, newstate: v, shape: reverseShapes(rn) };
          }
          fail();
        }
        if (j === "JointInnerBegin") {
          return { newjoint: JointInnerEnd, newstate: v, shape: ri };
        }
        if (j === "JointInnerEnd") {
          return { newjoint: JointInnerBegin, newstate: v, shape: reverseShapes(ri) };
        }
        if (j === "JointOuterBegin") {
          return { newjoint: JointOuterEnd, newstate: { ...v, outerturnout: false }, shape: ro };
        }
        if (j === "JointOuterEnd") {
          return { newjoint: JointInnerEnd, newstate: { ...v, innerturnout: true }, shape: reverseShapes(rn) };
        }
        fail();
      }
      if (v.innerturnout) {
        if (j === "JointInnerBegin") {
          return { newjoint: JointInnerEnd, newstate: { ...v, innerturnout: false }, shape: ri };
        }
        if (j === "JointInnerEnd") {
          return { newjoint: JointOuterEnd, newstate: { ...v, outerturnout: true }, shape: rn };
        }
        if (j === "JointOuterBegin") {
          return { newjoint: JointOuterEnd, newstate: v, shape: ro };
        }
        if (j === "JointOuterEnd") {
          return { newjoint: JointOuterBegin, newstate: v, shape: reverseShapes(ro) };
        }
        fail();
      }
      if (j === "JointInnerBegin") {
        return { newjoint: JointInnerEnd, newstate: v, shape: ri };
      }
      if (j === "JointInnerEnd") {
        return { newjoint: JointInnerBegin, newstate: v, shape: reverseShapes(ri) };
      }
      if (j === "JointOuterBegin") {
        return { newjoint: JointOuterEnd, newstate: v, shape: ro };
      }
      if (j === "JointOuterEnd") {
        return { newjoint: JointOuterBegin, newstate: v, shape: reverseShapes(ro) };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if (f === "JointInnerBegin") {
        if (t === "JointInnerBegin") {
          return Nothing;
        }
        if (t === "JointInnerEnd") {
          return $Maybe("Just", { ...s, innerturnout: false, outerturnout: false });
        }
        if (t === "JointOuterBegin") {
          return Nothing;
        }
        if (t === "JointOuterEnd") {
          return Nothing;
        }
        fail();
      }
      if (f === "JointInnerEnd") {
        if (t === "JointInnerBegin") {
          return $Maybe("Just", { ...s, innerturnout: false, outerturnout: false });
        }
        if (t === "JointInnerEnd") {
          return Nothing;
        }
        if (t === "JointOuterBegin") {
          return Nothing;
        }
        if (t === "JointOuterEnd") {
          return $Maybe("Just", { ...s, innerturnout: true, outerturnout: true });
        }
        fail();
      }
      if (f === "JointOuterBegin") {
        if (t === "JointInnerBegin") {
          return Nothing;
        }
        if (t === "JointInnerEnd") {
          return Nothing;
        }
        if (t === "JointOuterBegin") {
          return Nothing;
        }
        if (t === "JointOuterEnd") {
          return $Maybe("Just", { ...s, innerturnout: false, outerturnout: false });
        }
        fail();
      }
      if (f === "JointOuterEnd") {
        if (t === "JointInnerBegin") {
          return Nothing;
        }
        if (t === "JointInnerEnd") {
          return $Maybe("Just", { ...s, innerturnout: true, outerturnout: true });
        }
        if (t === "JointOuterBegin") {
          return $Maybe("Just", { ...s, innerturnout: false, outerturnout: false });
        }
        if (t === "JointOuterEnd") {
          return Nothing;
        }
      }
      fail();
    },
    isLegal: (j) => (s) => {
      if (j === "JointInnerBegin") {
        return !s.innerturnout && !s.outerturnout;
      }
      if (j === "JointInnerEnd") {
        return s.innerturnout === s.outerturnout;
      }
      if (j === "JointOuterBegin") {
        return !s.innerturnout && !s.outerturnout;
      }
      if (j === "JointOuterEnd") {
        return s.innerturnout === s.outerturnout;
      }
      fail();
    },
    lockedBy: (s) => (s$p) => {
      if (s.innerturnout === s$p.innerturnout && s.outerturnout === s$p.outerturnout) {
        return [];
      }
      return serialAll6;
    },
    isBlocked: (j) => (s) => (j$p) => {
      if (s.innerturnout && s.outerturnout) {
        return true;
      }
      if (j$p === "JointInnerBegin") {
        return j === "JointInnerEnd";
      }
      if (j$p === "JointInnerEnd") {
        return j === "JointInnerBegin";
      }
      if (j$p === "JointOuterBegin") {
        return j === "JointOuterEnd";
      }
      if (j$p === "JointOuterEnd") {
        return j === "JointOuterBegin";
      }
      fail();
    },
    isSimple: false
  }));
})();
var doubleToWideRRail = /* @__PURE__ */ memorizeRail(/* @__PURE__ */ flipRail_(doubleToWideLRail));
var doubleWidthSLRail = /* @__PURE__ */ (() => {
  const ps = { coord: { x: 1, y: 0.28037383177570097, z: 0 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: true };
  const pe = { coord: { x: 0, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: false };
  const r1 = slipShapes()({ start: pe, end: ps });
  return memorizeRail(toRail_(intSerialize6)(intSerialize)({
    name: "doublewidths",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => ({ rails: arrayMap(activeRail)(r1), additionals: [] }),
    defaultState: StateSolid,
    getJoints: serialAll3,
    getStates: serialAll2,
    origin: JointBegin,
    getJointPos: (j) => {
      if (j === "JointBegin") {
        return pe;
      }
      if (j === "JointEnd") {
        return ps;
      }
      fail();
    },
    getNewState: (j) => (s) => {
      if (j === "JointEnd") {
        return { newjoint: JointBegin, newstate: s, shape: reverseShapes(r1) };
      }
      if (j === "JointBegin") {
        return { newjoint: JointEnd, newstate: s, shape: r1 };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if (f === "JointBegin") {
        if (t === "JointBegin") {
          return Nothing;
        }
        if (t === "JointEnd") {
          return $Maybe("Just", s);
        }
        fail();
      }
      if (f === "JointEnd") {
        if (t === "JointBegin") {
          return $Maybe("Just", s);
        }
        if (t === "JointEnd") {
          return Nothing;
        }
      }
      fail();
    },
    isLegal: (v) => (v1) => true,
    lockedBy: (v) => (v1) => [],
    isBlocked: (v) => (v1) => (v2) => true,
    isSimple: true
  }));
})();
var doubleWidthSRRail = /* @__PURE__ */ memorizeRail(/* @__PURE__ */ flipRail_(doubleWidthSLRail));
var toDoubleLPlusRail = /* @__PURE__ */ (() => {
  const ps = { coord: { x: 1, y: 0.28037383177570097, z: 0 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: true };
  const pm = { coord: { x: 1, y: 0, z: 0 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: true };
  const pe = { coord: { x: 0, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: false };
  const r0 = [{ start: pe, end: pm, length: partLength(pe)(pm) }];
  const r1 = slipShapes()({ start: pe, end: ps });
  return memorizeRail(toRail_(intSerialize7)(intSerialize1)({
    name: "todouble",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => {
      if (v.turnout) {
        return {
          rails: arrayBind([arrayMap(passiveRail)(r0), arrayMap(activeRail)(r1)])(identity),
          additionals: []
        };
      }
      return {
        rails: arrayBind([arrayMap(passiveRail)(r1), arrayMap(activeRail)(r0)])(identity),
        additionals: []
      };
    },
    defaultState: { turnout: false },
    getJoints: serialAll4,
    getStates: serialAll1,
    origin: JointEnter,
    getJointPos: (j) => {
      if (j === "JointEnter") {
        return pe;
      }
      if (j === "JointMain") {
        return pm;
      }
      if (j === "JointSub") {
        return ps;
      }
      fail();
    },
    getNewState: (j) => (v) => {
      if (j === "JointMain") {
        return { newjoint: JointEnter, newstate: { turnout: false }, shape: reverseShapes(r0) };
      }
      if (j === "JointSub") {
        return { newjoint: JointEnter, newstate: { turnout: true }, shape: reverseShapes(r1) };
      }
      if (j === "JointEnter") {
        if (v.turnout) {
          return { newjoint: JointSub, newstate: v, shape: r1 };
        }
        return { newjoint: JointMain, newstate: v, shape: r0 };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if (f === "JointEnter") {
        if (t === "JointEnter") {
          return Nothing;
        }
        if (t === "JointMain") {
          return $Maybe("Just", { ...s, turnout: false });
        }
        if (t === "JointSub") {
          return $Maybe("Just", { ...s, turnout: true });
        }
        fail();
      }
      if (f === "JointMain") {
        if (t === "JointEnter") {
          return $Maybe("Just", { ...s, turnout: false });
        }
        if (t === "JointMain") {
          return Nothing;
        }
        if (t === "JointSub") {
          return Nothing;
        }
        fail();
      }
      if (f === "JointSub") {
        if (t === "JointEnter") {
          return $Maybe("Just", { ...s, turnout: true });
        }
        if (t === "JointMain") {
          return Nothing;
        }
        if (t === "JointSub") {
          return Nothing;
        }
      }
      fail();
    },
    isLegal: (j) => (s) => {
      if (j === "JointEnter") {
        return true;
      }
      if (j === "JointMain") {
        return !s.turnout;
      }
      if (j === "JointSub") {
        return s.turnout;
      }
      fail();
    },
    lockedBy: (s) => (s$p) => {
      if (s.turnout === s$p.turnout) {
        return [];
      }
      return serialAll4;
    },
    isBlocked: (v) => (v1) => (v2) => true,
    isSimple: false
  }));
})();
var toDoubleRPlusRail = /* @__PURE__ */ memorizeRail(/* @__PURE__ */ flipRail_(toDoubleLPlusRail));
var autoTurnOutLPlusRail = /* @__PURE__ */ (() => {
  const ps = {
    coord: { x: 0.5 + sqrt(0.5), y: 1 - sqrt(0.5), z: 0 },
    angle: toNumber(1) * 6.283185307179586 / toNumber(8),
    isPlus: true
  };
  const pm = { coord: { x: 1.5, y: 0, z: 0 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: true };
  const pe = { coord: { x: 0, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: false };
  const r_ = [
    (() => {
      const $0 = { coord: { x: 0.5, y: 0, z: 0 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: true };
      return { start: pe, end: $0, length: partLength(pe)($0) };
    })()
  ];
  const pP = { coord: { x: 0.5, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: false };
  const r0 = [{ start: pP, end: pm, length: partLength(pP)(pm) }];
  const r1 = [{ start: pP, end: ps, length: partLength(pP)(ps) }];
  return memorizeRail(toRail_(intSerialize7)(intSerialize3)({
    name: "autoturnout",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => {
      if (v.auto) {
        if (v.turnout) {
          return {
            rails: arrayBind([
              arrayMap((sh) => ({ color: ColorAuto, shape: sh }))(r0),
              arrayMap(activeRail)(r_),
              arrayMap(activeRail)(r1)
            ])(identity),
            additionals: []
          };
        }
        return {
          rails: arrayBind([
            arrayMap((sh) => ({ color: ColorAuto, shape: sh }))(r1),
            arrayMap(activeRail)(r_),
            arrayMap(activeRail)(r0)
          ])(identity),
          additionals: []
        };
      }
      if (v.turnout) {
        return {
          rails: arrayBind([
            arrayMap((sh) => ({ color: ColorFixed, shape: sh }))(r0),
            arrayMap(activeRail)(r_),
            arrayMap(activeRail)(r1)
          ])(identity),
          additionals: []
        };
      }
      return {
        rails: arrayBind([
          arrayMap((sh) => ({ color: ColorFixed, shape: sh }))(r1),
          arrayMap(activeRail)(r_),
          arrayMap(activeRail)(r0)
        ])(identity),
        additionals: []
      };
    },
    defaultState: { turnout: false, auto: true },
    getJoints: serialAll4,
    getStates: serialAll(intSerialize3),
    origin: JointEnter,
    getJointPos: (j) => {
      if (j === "JointEnter") {
        return pe;
      }
      if (j === "JointMain") {
        return pm;
      }
      if (j === "JointSub") {
        return ps;
      }
      fail();
    },
    getNewState: (j) => (v) => {
      if (j === "JointMain") {
        return { newjoint: JointEnter, newstate: v, shape: reverseShapes([...r_, ...r0]) };
      }
      if (j === "JointSub") {
        return { newjoint: JointEnter, newstate: v, shape: reverseShapes([...r_, ...r1]) };
      }
      if (j === "JointEnter") {
        if (v.auto) {
          if (v.turnout) {
            return { newjoint: JointMain, newstate: { turnout: false, auto: true }, shape: [...r_, ...r0] };
          }
          return { newjoint: JointSub, newstate: { turnout: true, auto: true }, shape: [...r_, ...r1] };
        }
        if (v.turnout) {
          return { newjoint: JointSub, newstate: v, shape: [...r_, ...r1] };
        }
        return { newjoint: JointMain, newstate: v, shape: [...r_, ...r0] };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if (f === "JointEnter") {
        if (t === "JointEnter") {
          return Nothing;
        }
        if (t === "JointMain") {
          return $Maybe("Just", { ...s, turnout: false, auto: false });
        }
        if (t === "JointSub") {
          return $Maybe("Just", { ...s, turnout: true, auto: false });
        }
        fail();
      }
      if (f === "JointMain") {
        if (t === "JointEnter") {
          return $Maybe("Just", { ...s, turnout: false, auto: false });
        }
        if (t === "JointMain") {
          return Nothing;
        }
        if (t === "JointSub") {
          return Nothing;
        }
        fail();
      }
      if (f === "JointSub") {
        if (t === "JointEnter") {
          return $Maybe("Just", { ...s, turnout: true, auto: false });
        }
        if (t === "JointMain") {
          return Nothing;
        }
        if (t === "JointSub") {
          return Nothing;
        }
      }
      fail();
    },
    isLegal: (j) => (s) => {
      if (j === "JointEnter") {
        return true;
      }
      if (j === "JointMain") {
        return !s.turnout;
      }
      if (j === "JointSub") {
        return s.turnout;
      }
      fail();
    },
    lockedBy: (s) => (s$p) => {
      if (s.auto === s$p.auto && s.turnout === s$p.turnout) {
        return [];
      }
      return serialAll4;
    },
    isBlocked: (v) => (v1) => (v2) => true,
    isSimple: false
  }));
})();
var autoTurnOutRPlusRail = /* @__PURE__ */ memorizeRail(/* @__PURE__ */ flipRail_(autoTurnOutLPlusRail));

// output-es/Internal.JSON/index.js
var identity6 = (x) => x;
var max3 = (x) => (y) => {
  const v = ordInt.compare(x)(y);
  if (v === "LT") {
    return y;
  }
  if (v === "EQ") {
    return x;
  }
  if (v === "GT") {
    return x;
  }
  fail();
};
var splitSize = (shape) => {
  if (shape.start.coord.z === shape.end.coord.z && eqAngle.eq(shape.start.angle + 3.141592653589793)(shape.end.angle)) {
    return 1;
  }
  return 5;
};
var shapeToData = (v) => {
  const a1 = v.start.angle + 3.141592653589793;
  if (eqAngle.eq(v.start.angle + 3.141592653589793)(v.end.angle)) {
    return { type: "straight", angle: a1, start: v.start, end: v.end };
  }
  const _r = (cos(a1) * (v.end.coord.x - v.start.coord.x) + sin(a1) * (v.end.coord.y - v.start.coord.y)) / sin(v.end.angle - a1);
  const a1$p = a1 - 1.5707963267948966 * sign(_r);
  const r = abs(_r);
  return {
    type: "arc",
    center: { x: v.start.coord.x - r * cos(a1$p), y: v.start.coord.y - r * sin(a1$p), z: (v.start.coord.z + v.end.coord.z) / 2 },
    radius: r,
    startangle: a1$p,
    endangle: a1$p
  };
};
var roundPos = (v) => ({
  coord: { x: round(v.coord.x * 1e5) / 1e5, y: round(v.coord.y * 1e5) / 1e5, z: round(v.coord.z * 1e5) / 1e5 },
  angle: round(v.angle * 1e5) / 1e5,
  isPlus: v.isPlus
});
var rails = [
  autoTurnOutLPlusRail,
  curveLRail,
  slopeRail,
  slopeCurveLRail,
  straightRail,
  halfRail,
  quarterRail,
  converterRail,
  turnOutLPlusRail,
  outerCurveLRail,
  toDoubleLPlusRail,
  scissorsRail,
  doubleToWideLRail,
  doubleTurnoutLPlusRail,
  longRail,
  doubleWidthSLRail,
  crossoverLRail,
  diamondRail,
  halfSlopeRail,
  quarterSlopeRail
];
var isArc = (shape) => !eqAngle.eq(shape.start.angle + 3.141592653589793)(shape.end.angle);
var encodeTrainRoute = (v) => ({ nodeid: v.nodeid, jointid: v.jointid, railinstance: v.railinstance.instanceid, shapes: v.shapes, length: v.length });
var encodeTrainset = (v) => ({
  types: v.types,
  route: arrayMap(encodeTrainRoute)(v.route),
  distanceToNext: round(v.distanceToNext * 1e5) / 1e5,
  distanceFromOldest: round(v.distanceFromOldest * 1e5) / 1e5,
  speed: round(v.speed * 1e5) / 1e5,
  trainid: v.trainid,
  flipped: v.flipped,
  respectSignals: v.respectSignals,
  realAcceralation: v.realAcceralation,
  notch: v.notch,
  signalRestriction: v.signalRestriction,
  note: v.note,
  tags: v.tags,
  signalRulePhase: v.signalRulePhase
});
var encodeSignalRule = (rule) => {
  if (rule.tag === "RuleComment") {
    return rule._1;
  }
  if (rule.tag === "RuleComplex") {
    return "c " + rule._1;
  }
  if (rule.tag === "RuleSpeed") {
    return "m " + source(rule._1) + " " + showIntImpl(rule._2) + (rule._3 === "" ? "" : " " + rule._3);
  }
  if (rule.tag === "RuleOpen") {
    return "o " + source(rule._1) + " " + showIntImpl(rule._2) + (rule._3 === "" ? "" : " " + rule._3);
  }
  if (rule.tag === "RuleUpdate") {
    return "u " + source(rule._1) + " " + source(rule._2) + " " + (rule._4 === "" ? rule._3 + "" : rule._3 + " " + rule._4);
  }
  if (rule.tag === "RuleStop") {
    return "s " + source(rule._1) + (rule._2 === "" ? "" : " " + rule._2);
  }
  if (rule.tag === "RuleStopOpen") {
    return "O " + source(rule._1) + " " + showIntImpl(rule._2) + (rule._3 === "" ? "" : " " + rule._3);
  }
  if (rule.tag === "RuleStopUpdate") {
    return "U " + source(rule._1) + " " + source(rule._2) + " " + (rule._4 === "" ? rule._3 + "" : rule._3 + " " + rule._4);
  }
  if (rule.tag === "RuleReverse") {
    return "r " + source(rule._1) + (rule._2 === "" ? "" : " " + rule._2);
  }
  if (rule.tag === "RuleReverseUpdate") {
    return "R " + source(rule._1) + " " + source(rule._2) + " " + (rule._4 === "" ? rule._3 + "" : rule._3 + " " + rule._4);
  }
  fail();
};
var encodeSignalRules = /* @__PURE__ */ arrayMap(encodeSignalRule);
var encodeSignal = (v) => ({ signalname: v.signalname, nodeid: v.nodeid, jointid: v.jointid, manualStop: v.manualStop, restraint: v.restraint, rules: arrayMap(encodeSignalRule)(v.rules) });
var encodeRailNode = (v) => ({
  nodeid: v.nodeid,
  instanceid: v.instanceid,
  rail: { name: v.rail.name, flipped: v.rail.flipped, opposed: v.rail.opposed },
  state: v.state,
  connections: v.connections,
  signals: arrayMap(encodeSignal)(v.signals),
  invalidRoutes: v.invalidRoutes,
  reserves: v.reserves,
  pos: roundPos(v.pos),
  note: v.note,
  color: v.color
});
var encodeLayout = (v) => ({
  rails: arrayMap(encodeRailNode)(v.rails),
  trains: arrayMap(encodeTrainset)(v.trains),
  floor: v.floor,
  time: v.time,
  speed: v.speed,
  version: v.version,
  routequeue: v.routequeue,
  activeReserves: v.activeReserves
});
var defaultnode = {
  nodeid: 0,
  instanceid: 0,
  state: 0,
  rail: straightRail,
  connections: [],
  signals: [],
  invalidRoutes: [],
  reserves: [],
  drawinfos: [],
  pos: { ...poszero, angle: 3.141592653589793 },
  note: "",
  color: []
};
var defaultLayout = /* @__PURE__ */ (() => foldlArray((l$p) => (j) => addJoint(l$p)(straightRail.getJointPos(j))(0)(j))({
  instancecount: 1,
  traincount: 0,
  updatecount: 0,
  floor: { height: 500, width: 500 },
  time: 0,
  speed: 1,
  rails: [defaultnode],
  trains: [],
  traffic: [],
  isclear: [],
  signalcolors: [],
  routequeue: [],
  jointData: saEmpty,
  version: 2,
  activeReserves: []
})(straightRail.getJoints))();
var defaultFloorData = { height: 500, width: 500 };
var decodeTrainRoute = (rs) => (v) => ({ nodeid: v.nodeid, jointid: v.jointid, railinstance: v.railinstance >= 0 && v.railinstance < rs.length ? rs[v.railinstance] : defaultnode, shapes: v.shapes, length: v.length });
var decodeTrainset = (rs) => (v) => ({
  types: v.types,
  route: arrayMap(decodeTrainRoute(rs))(v.route),
  distanceToNext: v.distanceToNext,
  distanceFromOldest: v.distanceFromOldest,
  speed: v.speed,
  trainid: v.trainid,
  flipped: v.flipped,
  respectSignals: v.respectSignals,
  realAcceralation: v.realAcceralation,
  notch: v.notch,
  signalRestriction: v.signalRestriction,
  note: isUndefined(v.note) || isNull(v.note) ? "" : v.note,
  tags: isUndefined(v.tags) || isNull(v.tags) ? [] : v.tags,
  signalRulePhase: isUndefined(v.signalRulePhase) || isNull(v.signalRulePhase) ? 0 : v.signalRulePhase
});
var decodeSignalRule = (rule) => {
  const spl = split(" ")(replace2(unsafeRegex("\\s+")(global))(" ")(rule.trimStart()));
  const v = 0 < spl.length ? $Maybe("Just", spl[0]) : Nothing;
  if (v.tag === "Just") {
    if (v._1 === "c") {
      return $SignalRule(
        "RuleComplex",
        replace2(unsafeRegex("^\\s*.")(noFlags))("")(rule)
      );
    }
    if (v._1 === "m") {
      if (1 < spl.length) {
        const $0 = regex(spl[1])(noFlags);
        if ($0.tag === "Left") {
          return $SignalRule("RuleComment", rule);
        }
        if ($0.tag === "Right") {
          const $1 = 2 < spl.length ? fromString(spl[2]) : Nothing;
          if ($1.tag === "Just") {
            return $SignalRule(
              "RuleSpeed",
              $0._1,
              $1._1,
              replace2(unsafeRegex("^\\s*.\\s+\\S*\\s+\\S*")(noFlags))("")(rule)
            );
          }
          return $SignalRule("RuleComment", rule);
        }
        fail();
      }
      return $SignalRule("RuleComment", rule);
    }
    if (v._1 === "o") {
      if (1 < spl.length) {
        const $0 = regex(spl[1])(noFlags);
        if ($0.tag === "Left") {
          return $SignalRule("RuleComment", rule);
        }
        if ($0.tag === "Right") {
          const $1 = 2 < spl.length ? fromString(spl[2]) : Nothing;
          if ($1.tag === "Just") {
            return $SignalRule(
              "RuleOpen",
              $0._1,
              $1._1,
              replace2(unsafeRegex("^\\s*.\\s+\\S*\\s+\\S*")(noFlags))("")(rule)
            );
          }
          return $SignalRule("RuleComment", rule);
        }
        fail();
      }
      return $SignalRule("RuleComment", rule);
    }
    if (v._1 === "u") {
      if (1 < spl.length) {
        const $0 = regex(spl[1])(noFlags);
        if ($0.tag === "Left") {
          return $SignalRule("RuleComment", rule);
        }
        if ($0.tag === "Right") {
          if (2 < spl.length) {
            const $1 = regex(spl[2])(noFlags);
            if ($1.tag === "Left") {
              return $SignalRule("RuleComment", rule);
            }
            if ($1.tag === "Right") {
              if (3 < spl.length) {
                return $SignalRule(
                  "RuleUpdate",
                  $0._1,
                  $1._1,
                  spl[3],
                  replace2(unsafeRegex("^\\s*.\\s+\\S*\\s+\\S*\\s+\\S*")(noFlags))("")(rule)
                );
              }
              return $SignalRule("RuleComment", rule);
            }
            fail();
          }
          return $SignalRule("RuleComment", rule);
        }
        fail();
      }
      return $SignalRule("RuleComment", rule);
    }
    if (v._1 === "s") {
      if (1 < spl.length) {
        const $0 = regex(spl[1])(noFlags);
        if ($0.tag === "Left") {
          return $SignalRule("RuleComment", rule);
        }
        if ($0.tag === "Right") {
          return $SignalRule(
            "RuleStop",
            $0._1,
            replace2(unsafeRegex("^\\s*.\\s+\\S*")(noFlags))("")(rule)
          );
        }
        fail();
      }
      return $SignalRule("RuleComment", rule);
    }
    if (v._1 === "O") {
      if (1 < spl.length) {
        const $0 = regex(spl[1])(noFlags);
        if ($0.tag === "Left") {
          return $SignalRule("RuleComment", rule);
        }
        if ($0.tag === "Right") {
          const $1 = 2 < spl.length ? fromString(spl[2]) : Nothing;
          if ($1.tag === "Just") {
            return $SignalRule(
              "RuleStopOpen",
              $0._1,
              $1._1,
              replace2(unsafeRegex("^\\s*.\\s+\\S*\\s+\\S*")(noFlags))("")(rule)
            );
          }
          return $SignalRule("RuleComment", rule);
        }
        fail();
      }
      return $SignalRule("RuleComment", rule);
    }
    if (v._1 === "U") {
      if (1 < spl.length) {
        const $0 = regex(spl[1])(noFlags);
        if ($0.tag === "Left") {
          return $SignalRule("RuleComment", rule);
        }
        if ($0.tag === "Right") {
          if (2 < spl.length) {
            const $1 = regex(spl[2])(noFlags);
            if ($1.tag === "Left") {
              return $SignalRule("RuleComment", rule);
            }
            if ($1.tag === "Right") {
              if (3 < spl.length) {
                return $SignalRule(
                  "RuleStopUpdate",
                  $0._1,
                  $1._1,
                  spl[3],
                  replace2(unsafeRegex("^\\s*.\\s+\\S*\\s+\\S*\\s+\\S*")(noFlags))("")(rule)
                );
              }
              return $SignalRule("RuleComment", rule);
            }
            fail();
          }
          return $SignalRule("RuleComment", rule);
        }
        fail();
      }
      return $SignalRule("RuleComment", rule);
    }
    if (v._1 === "r") {
      if (1 < spl.length) {
        const $0 = regex(spl[1])(noFlags);
        if ($0.tag === "Left") {
          return $SignalRule("RuleComment", rule);
        }
        if ($0.tag === "Right") {
          return $SignalRule(
            "RuleReverse",
            $0._1,
            replace2(unsafeRegex("^\\s*.\\s+\\S*")(noFlags))("")(rule)
          );
        }
        fail();
      }
      return $SignalRule("RuleComment", rule);
    }
    if (v._1 === "R" && 1 < spl.length) {
      const $0 = regex(spl[1])(noFlags);
      if ($0.tag === "Left") {
        return $SignalRule("RuleComment", rule);
      }
      if ($0.tag === "Right") {
        if (2 < spl.length) {
          const $1 = regex(spl[2])(noFlags);
          if ($1.tag === "Left") {
            return $SignalRule("RuleComment", rule);
          }
          if ($1.tag === "Right") {
            if (3 < spl.length) {
              return $SignalRule(
                "RuleReverseUpdate",
                $0._1,
                $1._1,
                spl[3],
                replace2(unsafeRegex("^\\s*.\\s+\\S*\\s+\\S*\\s+\\S*")(noFlags))("")(rule)
              );
            }
            return $SignalRule("RuleComment", rule);
          }
          fail();
        }
        return $SignalRule("RuleComment", rule);
      }
      fail();
    }
  }
  return $SignalRule("RuleComment", rule);
};
var decodeSignalRules = (rules) => arrayMap((r) => decodeSignalRule(isUndefined(r) || isNull(r) ? "" : r))(rules);
var decodeSignal = (v) => ({
  signalname: v.signalname,
  nodeid: v.nodeid,
  jointid: v.jointid,
  routes: [],
  indication: [],
  routecond: [],
  colors: [],
  manualStop: isUndefined(v.manualStop) || isNull(v.manualStop) ? false : v.manualStop,
  restraint: isUndefined(v.restraint) || isNull(v.restraint) ? false : v.restraint,
  rules: decodeSignalRules(isUndefined(v.rules) || isNull(v.rules) ? [] : v.rules)
});
var decodeRail = (v) => {
  const $0 = v.name;
  const $1 = v.flipped ? flipRail : identity6;
  const $2 = v.opposed ? opposeRail : identity6;
  const $3 = find((v1) => v1.name === $0)(rails);
  if ($3.tag === "Just") {
    return $Maybe("Just", $2($1($3._1)));
  }
  return Nothing;
};
var decodeRailNode = (v) => {
  const $0 = decodeRail(v.rail);
  if ($0.tag === "Just") {
    return $Maybe(
      "Just",
      (() => {
        const $1 = {
          nodeid: v.nodeid,
          instanceid: v.instanceid,
          rail: $0._1,
          state: v.state,
          connections: v.connections,
          signals: arrayMap(decodeSignal)(isUndefined(v.signals) || isNull(v.signals) ? [] : v.signals),
          invalidRoutes: isUndefined(v.invalidRoutes) || isNull(v.invalidRoutes) ? [] : v.invalidRoutes,
          reserves: isUndefined(v.reserves) || isNull(v.reserves) ? [] : v.reserves,
          pos: v.pos,
          note: isUndefined(v.note) || isNull(v.note) ? "" : v.note,
          drawinfos: [],
          color: isUndefined(v.color) || isNull(v.color) ? [] : v.color
        };
        return { ...$1, drawinfos: instanceDrawInfos($1) };
      })()
    );
  }
  return Nothing;
};
var decodeRailNode_v1 = (v) => {
  const $0 = decodeRail(v.rail);
  if ($0.tag === "Just") {
    return $Maybe(
      "Just",
      (() => {
        const $1 = {
          nodeid: v.nodeid,
          instanceid: v.instanceid,
          rail: $0._1,
          state: v.state,
          connections: v.connections,
          signals: isUndefined(v.signals) || isNull(v.signals) ? [] : v.signals,
          invalidRoutes: isUndefined(v.invalidRoutes) || isNull(v.invalidRoutes) ? [] : v.invalidRoutes,
          reserves: isUndefined(v.reserves) || isNull(v.reserves) ? [] : v.reserves,
          pos: poszero,
          drawinfos: [],
          note: isUndefined(v.note) || isNull(v.note) ? "" : v.note,
          color: isUndefined(v.color) || isNull(v.color) ? [] : v.color
        };
        return { ...$1, drawinfos: instanceDrawInfos($1) };
      })()
    );
  }
  return Nothing;
};
var decodeRailInstance = (v) => {
  const $0 = decodeRailNode_v1(v.node);
  if ($0.tag === "Just") {
    return $Maybe("Just", { ...$0._1, pos: v.pos, instanceid: v.instanceid });
  }
  return Nothing;
};
var decodeLayout$p = (v) => {
  const rawrails = v.version <= 1 ? arrayMap((x) => decodeRailInstance(x))(v.rails) : arrayMap(decodeRailNode)(v.rails);
  const rs = mapMaybe((x) => x)(rawrails);
  const ts = arrayMap(decodeTrainset(rs))(v.trains);
  const $0 = foldlArray(removeRail)({
    floor: isUndefined(v.floor) || isNull(v.floor) ? defaultFloorData : v.floor,
    jointData: saEmpty,
    rails: rs,
    trains: ts,
    updatecount: 0,
    instancecount: 1 + foldlArray((x) => (v1) => max3(x)(v1.instanceid))(-1)(rs) | 0,
    traincount: 1 + foldlArray((x) => (v1) => max3(x)(v1.trainid))(-1)(ts) | 0,
    version: 2,
    time: isUndefined(v.time) || isNull(v.time) ? 0 : v.time,
    speed: isUndefined(v.speed) || isNull(v.speed) ? 1 : v.speed,
    traffic: [],
    routequeue: isUndefined(v.routequeue) || isNull(v.routequeue) ? [] : v.routequeue,
    isclear: [],
    signalcolors: [],
    activeReserves: isUndefined(v.activeReserves) || isNull(v.activeReserves) ? [] : v.activeReserves
  })(reverse(sortBy(ordIntNode.compare)(arrayMap((r) => r.index)(filterImpl(
    (r) => r.isdeleted,
    mapWithIndexArray((i) => (r) => ({
      index: i,
      isdeleted: (() => {
        if (r.tag === "Nothing") {
          return true;
        }
        if (r.tag === "Just") {
          return false;
        }
        fail();
      })()
    }))(rawrails)
  )))));
  const $1 = updateSignalRoutes(foldlArray((l) => (j) => addJoint(l)(j.pos)(j.nodeid)(j.jointid))($0)(arrayBind($0.rails)((v2) => {
    const nodeid = v2.nodeid;
    return arrayBind(v2.rail.getJoints)((jointid) => arrayBind((() => {
      const $12 = getJointAbsPos($0)(nodeid)(jointid);
      if ($12.tag === "Nothing") {
        return [];
      }
      if ($12.tag === "Just") {
        return [$12._1];
      }
      fail();
    })())((pos) => [{ nodeid, jointid, pos }]));
  })));
  if ($1.rails.length === 0) {
    return defaultLayout;
  }
  return $1;
};
var decodeLayout = (v) => decodeLayout$p({
  floor: v.floor,
  rails: arrayMap(unsafeCoerce)(isArray(v.rails) ? v.rails : []),
  trains: isArray(v.trains) ? v.trains : [],
  time: (() => {
    const $0 = unsafeReadTagged(monadIdentity)("Number")(v.time);
    if ($0.tag === "Right") {
      return $0._1;
    }
    return 0;
  })(),
  speed: (() => {
    const $0 = unsafeReadTagged(monadIdentity)("Number")(v.speed);
    if ($0.tag === "Right") {
      return $0._1;
    }
    return 1;
  })(),
  version: v.version,
  routequeue: isArray(v.routequeue) ? v.routequeue : [],
  activeReserves: isArray(v.activeReserves) ? v.activeReserves : []
});

// output-es/Main/index.js
var turnOutRPlusRail2 = turnOutRPlusRail;
var turnOutLPlusRail2 = turnOutLPlusRail;
var tryOpenRouteFor_ffi2 = tryOpenRouteFor_ffi;
var trainsetLength2 = trainsetLength;
var trainsetDrawInfo2 = trainsetDrawInfo;
var toDoubleRPlusRail2 = toDoubleRPlusRail;
var toDoubleLPlusRail2 = toDoubleLPlusRail;
var straightRail2 = straightRail;
var splitSize2 = splitSize;
var speedScale = 0.025;
var slopeRail2 = slopeRail;
var slopeCurveRRail2 = slopeCurveRRail;
var slopeCurveLRail2 = slopeCurveLRail;
var slipShapes2 = slipShapes;
var shapeToData2 = shapeToData;
var shapeLength2 = shapeLength;
var setRailColor2 = setRailColor;
var scissorsRail2 = scissorsRail;
var removeSignal2 = removeSignal;
var removeRail2 = removeRail;
var quarterSlopeRail2 = quarterSlopeRail;
var quarterRail2 = quarterRail;
var poszero2 = poszero;
var outerCurveRRail2 = outerCurveRRail;
var outerCurveLRail2 = outerCurveLRail;
var longRail2 = longRail;
var layoutUpdate_NoManualStop2 = layoutUpdate_NoManualStop;
var layoutUpdate2 = layoutUpdate;
var layoutTick2 = layoutTick;
var layoutDrawInfo2 = layoutDrawInfo;
var isArc2 = isArc;
var halfSlopeRail2 = halfSlopeRail;
var halfRail2 = halfRail;
var getNextSignal2 = getNextSignal;
var getNewRailPos2 = getNewRailPos;
var getMaxNotch2 = getMaxNotch;
var getMarginFromBrakePattern2 = getMarginFromBrakePattern;
var getJoints2 = getJoints;
var getJointAbsPos2 = getJointAbsPos;
var getDividingPoint_rel2 = getDividingPoint_rel;
var fromJust2 = fromJust;
var forceUpdate2 = forceUpdate;
var flipTrain2 = flipTrain;
var flipRail2 = flipRail;
var fixBrokenConnections2 = fixBrokenConnections;
var encodeSignalRules2 = encodeSignalRules;
var encodeLayout2 = encodeLayout;
var doubleWidthSRRail2 = doubleWidthSRRail;
var doubleWidthSLRail2 = doubleWidthSLRail;
var doubleTurnoutRPlusRail2 = doubleTurnoutRPlusRail;
var doubleTurnoutLPlusRail2 = doubleTurnoutLPlusRail;
var doubleToWideRRail2 = doubleToWideRRail;
var doubleToWideLRail2 = doubleToWideLRail;
var diamondRail2 = diamondRail;
var defaultLayout2 = defaultLayout;
var decodeSignalRules2 = decodeSignalRules;
var decodeLayout2 = decodeLayout;
var curveRRail2 = curveRRail;
var curveLRail2 = curveLRail;
var crossoverRRail2 = crossoverRRail;
var crossoverLRail2 = crossoverLRail;
var converterRail2 = converterRail;
var canJoin2 = canJoin;
var brakePattern2 = brakePattern;
var autoTurnOutRPlusRail2 = autoTurnOutRPlusRail;
var autoTurnOutLPlusRail2 = autoTurnOutLPlusRail;
var autoAdd2 = autoAdd;
var addTrainset2 = addTrainset;
var addSignal2 = addSignal;
var addRail2 = addRail;
var addJoint2 = addJoint;
var addInvalidRoute2 = addInvalidRoute;
export {
  addInvalidRoute2 as addInvalidRoute,
  addJoint2 as addJoint,
  addRail2 as addRail,
  addSignal2 as addSignal,
  addTrainset2 as addTrainset,
  autoAdd2 as autoAdd,
  autoTurnOutLPlusRail2 as autoTurnOutLPlusRail,
  autoTurnOutRPlusRail2 as autoTurnOutRPlusRail,
  brakePattern2 as brakePattern,
  canJoin2 as canJoin,
  converterRail2 as converterRail,
  crossoverLRail2 as crossoverLRail,
  crossoverRRail2 as crossoverRRail,
  curveLRail2 as curveLRail,
  curveRRail2 as curveRRail,
  decodeLayout2 as decodeLayout,
  decodeSignalRules2 as decodeSignalRules,
  defaultLayout2 as defaultLayout,
  diamondRail2 as diamondRail,
  doubleToWideLRail2 as doubleToWideLRail,
  doubleToWideRRail2 as doubleToWideRRail,
  doubleTurnoutLPlusRail2 as doubleTurnoutLPlusRail,
  doubleTurnoutRPlusRail2 as doubleTurnoutRPlusRail,
  doubleWidthSLRail2 as doubleWidthSLRail,
  doubleWidthSRRail2 as doubleWidthSRRail,
  encodeLayout2 as encodeLayout,
  encodeSignalRules2 as encodeSignalRules,
  fixBrokenConnections2 as fixBrokenConnections,
  flipRail2 as flipRail,
  flipTrain2 as flipTrain,
  forceUpdate2 as forceUpdate,
  fromJust2 as fromJust,
  getDividingPoint_rel2 as getDividingPoint_rel,
  getJointAbsPos2 as getJointAbsPos,
  getJoints2 as getJoints,
  getMarginFromBrakePattern2 as getMarginFromBrakePattern,
  getMaxNotch2 as getMaxNotch,
  getNewRailPos2 as getNewRailPos,
  getNextSignal2 as getNextSignal,
  halfRail2 as halfRail,
  halfSlopeRail2 as halfSlopeRail,
  isArc2 as isArc,
  layoutDrawInfo2 as layoutDrawInfo,
  layoutTick2 as layoutTick,
  layoutUpdate2 as layoutUpdate,
  layoutUpdate_NoManualStop2 as layoutUpdate_NoManualStop,
  longRail2 as longRail,
  outerCurveLRail2 as outerCurveLRail,
  outerCurveRRail2 as outerCurveRRail,
  poszero2 as poszero,
  quarterRail2 as quarterRail,
  quarterSlopeRail2 as quarterSlopeRail,
  removeRail2 as removeRail,
  removeSignal2 as removeSignal,
  scissorsRail2 as scissorsRail,
  setRailColor2 as setRailColor,
  shapeLength2 as shapeLength,
  shapeToData2 as shapeToData,
  slipShapes2 as slipShapes,
  slopeCurveLRail2 as slopeCurveLRail,
  slopeCurveRRail2 as slopeCurveRRail,
  slopeRail2 as slopeRail,
  speedScale,
  splitSize2 as splitSize,
  straightRail2 as straightRail,
  toDoubleLPlusRail2 as toDoubleLPlusRail,
  toDoubleRPlusRail2 as toDoubleRPlusRail,
  trainsetDrawInfo2 as trainsetDrawInfo,
  trainsetLength2 as trainsetLength,
  tryOpenRouteFor_ffi2 as tryOpenRouteFor_ffi,
  turnOutLPlusRail2 as turnOutLPlusRail,
  turnOutRPlusRail2 as turnOutRPlusRail
};
