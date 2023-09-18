// output-es/runtime.js
function fail() {
  throw new Error("Failed pattern match");
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
var $Ordering = (tag) => ({ tag });
var LT = /* @__PURE__ */ $Ordering("LT");
var GT = /* @__PURE__ */ $Ordering("GT");
var EQ = /* @__PURE__ */ $Ordering("EQ");

// output-es/Data.Maybe/index.js
var $Maybe = (tag, _1) => ({ tag, _1 });
var Nothing = /* @__PURE__ */ $Maybe("Nothing");
var Just = (value0) => $Maybe("Just", value0);
var functorMaybe = {
  map: (v) => (v1) => {
    if (v1.tag === "Just") {
      return $Maybe("Just", v(v1._1));
    }
    return Nothing;
  }
};
var fromJust = () => (v) => {
  if (v.tag === "Just") {
    return v._1;
  }
  fail();
};
var applyMaybe = {
  apply: (v) => (v1) => {
    if (v.tag === "Just") {
      if (v1.tag === "Just") {
        return $Maybe("Just", v._1(v1._1));
      }
      return Nothing;
    }
    if (v.tag === "Nothing") {
      return Nothing;
    }
    fail();
  },
  Functor0: () => functorMaybe
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
var functorEither = {
  map: (f) => (m) => {
    if (m.tag === "Left") {
      return $Either("Left", m._1);
    }
    if (m.tag === "Right") {
      return $Either("Right", f(m._1));
    }
    fail();
  }
};

// output-es/Data.Identity/index.js
var Identity = (x) => x;
var functorIdentity = { map: (f) => (m) => f(m) };
var applyIdentity = { apply: (v) => (v1) => v(v1), Functor0: () => functorIdentity };
var bindIdentity = { bind: (v) => (f) => f(v), Apply0: () => applyIdentity };
var applicativeIdentity = { pure: Identity, Apply0: () => applyIdentity };
var monadIdentity = { Applicative0: () => applicativeIdentity, Bind1: () => bindIdentity };

// output-es/Data.Array.ST/foreign.js
var sortByImpl = function() {
  function mergeFromTo(compare, fromOrdering, xs1, xs2, from, to) {
    var mid;
    var i;
    var j;
    var k;
    var x;
    var y;
    var c;
    mid = from + (to - from >> 1);
    if (mid - from > 1)
      mergeFromTo(compare, fromOrdering, xs2, xs1, from, mid);
    if (to - mid > 1)
      mergeFromTo(compare, fromOrdering, xs2, xs1, mid, to);
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
  return function(compare) {
    return function(fromOrdering) {
      return function(xs) {
        return function() {
          if (xs.length < 2)
            return xs;
          mergeFromTo(compare, fromOrdering, xs, xs.slice(0), 0, xs.length);
          return xs;
        };
      };
    };
  };
}();

// output-es/Data.Foldable/foreign.js
var foldrArray = function(f) {
  return function(init2) {
    return function(xs) {
      var acc = init2;
      var len = xs.length;
      for (var i = len - 1; i >= 0; i--) {
        acc = f(xs[i])(acc);
      }
      return acc;
    };
  };
};
var foldlArray = function(f) {
  return function(init2) {
    return function(xs) {
      var acc = init2;
      var len = xs.length;
      for (var i = 0; i < len; i++) {
        acc = f(acc)(xs[i]);
      }
      return acc;
    };
  };
};

// output-es/Data.Foldable/index.js
var maximumBy = (dictFoldable) => (cmp) => dictFoldable.foldl((v) => (v1) => {
  if (v.tag === "Nothing") {
    return $Maybe("Just", v1);
  }
  if (v.tag === "Just") {
    return $Maybe("Just", cmp(v._1)(v1).tag === "GT" ? v._1 : v1);
  }
  fail();
})(Nothing);
var foldableArray = {
  foldr: foldrArray,
  foldl: foldlArray,
  foldMap: (dictMonoid) => {
    const append = dictMonoid.Semigroup0().append;
    const mempty = dictMonoid.mempty;
    return (f) => foldableArray.foldr((x) => (acc) => append(f(x))(acc))(mempty);
  }
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

// output-es/Data.Semigroup/foreign.js
var concatArray = function(xs) {
  return function(ys) {
    if (xs.length === 0)
      return ys;
    if (ys.length === 0)
      return xs;
    return xs.concat(ys);
  };
};

// output-es/Unsafe.Coerce/foreign.js
var unsafeCoerce = function(x) {
  return x;
};

// output-es/Data.Tuple/index.js
var $Tuple = (_1, _2) => ({ tag: "Tuple", _1, _2 });
var Tuple = (value0) => (value1) => $Tuple(value0, value1);
var snd = (v) => v._2;
var fst = (v) => v._1;

// output-es/Data.Traversable/foreign.js
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
  return function(apply) {
    return function(map) {
      return function(pure) {
        return function(f) {
          return function(array) {
            function go(bot, top) {
              switch (top - bot) {
                case 0:
                  return pure([]);
                case 1:
                  return map(array1)(f(array[bot]));
                case 2:
                  return apply(map(array2)(f(array[bot])))(f(array[bot + 1]));
                case 3:
                  return apply(apply(map(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                default:
                  var pivot = bot + Math.floor((top - bot) / 4) * 2;
                  return apply(map(concat2)(go(bot, pivot)))(go(pivot, top));
              }
            }
            return go(0, array.length);
          };
        };
      };
    };
  };
}();

// output-es/Data.Array/foreign.js
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
  function Cons(head, tail) {
    this.head = head;
    this.tail = tail;
  }
  var emptyList = {};
  function curryCons(head) {
    return function(tail) {
      return new Cons(head, tail);
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
  return function(foldr) {
    return function(xs) {
      return listToArray(foldr(curryCons)(emptyList)(xs));
    };
  };
}();
var unconsImpl = function(empty) {
  return function(next) {
    return function(xs) {
      return xs.length === 0 ? empty({}) : next(xs[0])(xs.slice(1));
    };
  };
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
var sortByImpl2 = function() {
  function mergeFromTo(compare, fromOrdering, xs1, xs2, from, to) {
    var mid;
    var i;
    var j;
    var k;
    var x;
    var y;
    var c;
    mid = from + (to - from >> 1);
    if (mid - from > 1)
      mergeFromTo(compare, fromOrdering, xs2, xs1, from, mid);
    if (to - mid > 1)
      mergeFromTo(compare, fromOrdering, xs2, xs1, mid, to);
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
  return function(compare) {
    return function(fromOrdering) {
      return function(xs) {
        var out;
        if (xs.length < 2)
          return xs;
        out = xs.slice(0);
        mergeFromTo(compare, fromOrdering, out, xs.slice(0), 0, xs.length);
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

// output-es/Data.Array/index.js
var updateAt = /* @__PURE__ */ _updateAt(Just)(Nothing);
var uncons = /* @__PURE__ */ unconsImpl((v) => Nothing)((x) => (xs) => $Maybe("Just", { head: x, tail: xs }));
var sortBy = (comp) => sortByImpl2(comp)((v) => {
  if (v.tag === "GT") {
    return 1;
  }
  if (v.tag === "EQ") {
    return 0;
  }
  if (v.tag === "LT") {
    return -1;
  }
  fail();
});
var sortWith = (dictOrd) => (f) => sortBy((x) => (y) => dictOrd.compare(f(x))(f(y)));
var insertAt = /* @__PURE__ */ _insertAt(Just)(Nothing);
var init = (xs) => {
  if (xs.length === 0) {
    return Nothing;
  }
  return $Maybe("Just", slice(0)(xs.length - 1 | 0)(xs));
};
var index = /* @__PURE__ */ indexImpl(Just)(Nothing);
var unsnoc = (xs) => applyMaybe.apply((() => {
  const $0 = init(xs);
  if ($0.tag === "Just") {
    return $Maybe(
      "Just",
      (() => {
        const $1 = $0._1;
        return (v1) => ({ init: $1, last: v1 });
      })()
    );
  }
  return Nothing;
})())(index(xs)(xs.length - 1 | 0));
var modifyAt = (i) => (f) => (xs) => {
  const $0 = index(xs)(i);
  if ($0.tag === "Nothing") {
    return Nothing;
  }
  if ($0.tag === "Just") {
    return updateAt(i)(f($0._1))(xs);
  }
  fail();
};
var nubBy = (comp) => (xs) => {
  const indexedAndSorted = sortBy((x) => (y) => comp(x._2)(y._2))(zipWith(Tuple)(range(0)(xs.length - 1 | 0))(xs));
  const v = index(indexedAndSorted)(0);
  if (v.tag === "Nothing") {
    return [];
  }
  if (v.tag === "Just") {
    return arrayMap(snd)(sortWith(ordInt)(fst)((() => {
      const result = [v._1];
      for (const v1 of indexedAndSorted) {
        const $0 = index(result)(result.length - 1 | 0);
        const $1 = comp((() => {
          if ($0.tag === "Just") {
            return $0._1._2;
          }
          fail();
        })())(v1._2);
        if ($1.tag === "LT" || $1.tag === "GT" || !($1.tag === "EQ")) {
          result.push(v1);
        }
      }
      return result;
    })()));
  }
  fail();
};
var findLastIndex = /* @__PURE__ */ findLastIndexImpl(Just)(Nothing);
var insertBy = (cmp) => (x) => (ys) => {
  const $0 = insertAt((() => {
    const $02 = findLastIndex((y) => cmp(x)(y).tag === "GT")(ys);
    if ($02.tag === "Nothing") {
      return 0;
    }
    if ($02.tag === "Just") {
      return $02._1 + 1 | 0;
    }
    fail();
  })())(x)(ys);
  if ($0.tag === "Just") {
    return $0._1;
  }
  fail();
};
var findIndex = /* @__PURE__ */ findIndexImpl(Just)(Nothing);
var find = (f) => (xs) => {
  const $0 = findIndex(f)(xs);
  if ($0.tag === "Just") {
    return $Maybe("Just", xs[$0._1]);
  }
  return Nothing;
};
var elem = (dictEq) => (a) => (arr) => {
  const $0 = findIndex((v) => dictEq.eq(v)(a))(arr);
  if ($0.tag === "Nothing") {
    return false;
  }
  if ($0.tag === "Just") {
    return true;
  }
  fail();
};
var deleteAt = /* @__PURE__ */ _deleteAt(Just)(Nothing);
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
var bindExceptT = (dictMonad) => {
  const bind = dictMonad.Bind1().bind;
  const pure = dictMonad.Applicative0().pure;
  return {
    bind: (v) => (k) => bind(v)((v2) => {
      if (v2.tag === "Left") {
        return pure($Either("Left", v2._1));
      }
      if (v2.tag === "Right") {
        return k(v2._1);
      }
      fail();
    }),
    Apply0: () => applyExceptT(dictMonad)
  };
};
var applyExceptT = (dictMonad) => {
  const $0 = dictMonad.Bind1().Apply0().Functor0();
  const functorExceptT1 = { map: (f) => $0.map(functorEither.map(f)) };
  return {
    apply: (() => {
      const bind = bindExceptT(dictMonad).bind;
      const pure = applicativeExceptT(dictMonad).pure;
      return (f) => (a) => bind(f)((f$p) => bind(a)((a$p) => pure(f$p(a$p))));
    })(),
    Functor0: () => functorExceptT1
  };
};
var applicativeExceptT = (dictMonad) => ({
  pure: (() => {
    const $0 = dictMonad.Applicative0().pure;
    return (x) => $0($Either("Right", x));
  })(),
  Apply0: () => applyExceptT(dictMonad)
});
var monadThrowExceptT = (dictMonad) => {
  const monadExceptT1 = { Applicative0: () => applicativeExceptT(dictMonad), Bind1: () => bindExceptT(dictMonad) };
  return {
    throwError: (() => {
      const $0 = dictMonad.Applicative0().pure;
      return (x) => $0($Either("Left", x));
    })(),
    Monad0: () => monadExceptT1
  };
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
var unsafeReadTagged = (dictMonad) => {
  const pure1 = applicativeExceptT(dictMonad).pure;
  const $0 = monadThrowExceptT(dictMonad).throwError;
  return (tag) => (value) => {
    if (tagOf(value) === tag) {
      return pure1(value);
    }
    return $0($NonEmpty($ForeignError("TypeMismatch", tag, tagOf(value)), Nil));
  };
};

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
    const append = dictMonoid.Semigroup0().append;
    const mempty = dictMonoid.mempty;
    return (f) => foldableWithIndexArray.foldrWithIndex((i) => (x) => (acc) => append(f(i)(x))(acc))(mempty);
  },
  Foldable0: () => foldableArray
};
var findWithIndex = (dictFoldableWithIndex) => (p) => dictFoldableWithIndex.foldlWithIndex((v) => (v1) => (v2) => {
  if (v1.tag === "Nothing") {
    if (p(v)(v2)) {
      return $Maybe("Just", { index: v, value: v2 });
    }
    return v1;
  }
  return v1;
})(Nothing);

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
  isPlus: v.isPlus
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
var eqIntJoint = { eq: (x) => (y) => x === y };
var shapeLength = (v) => partLength(v.start)(v.end);
var reverseShapes = /* @__PURE__ */ (() => {
  const $0 = arrayMap((v) => ({ start: v.end, end: v.start, length: v.length }));
  return (x) => $0(reverse(x));
})();
var opposeDrawRail = (v) => ({
  color: v.color,
  shape: {
    start: { coord: v.shape.start.coord, angle: v.shape.start.angle, isPlus: !v.shape.start.isPlus },
    end: { coord: v.shape.end.coord, angle: v.shape.end.angle, isPlus: !v.shape.end.isPlus },
    length: v.shape.length
  }
});
var opposeAdditional = (v) => ({ parttype: v.parttype, pos: { coord: v.pos.coord, angle: v.pos.angle, isPlus: !v.pos.isPlus } });
var opposeRail_ = (v) => ({
  name: v.name,
  flipped: v.flipped,
  opposed: !v.opposed,
  defaultState: v.defaultState,
  getJoints: v.getJoints,
  getStates: v.getStates,
  getOrigin: v.getOrigin,
  getJointPos: (x) => {
    const $0 = v.getJointPos(x);
    return { coord: $0.coord, angle: $0.angle, isPlus: !$0.isPlus };
  },
  getNewState: v.getNewState,
  getDrawInfo: (x) => {
    const $0 = v.getDrawInfo(x);
    return { rails: arrayMap(opposeDrawRail)($0.rails), additionals: arrayMap(opposeAdditional)($0.additionals) };
  },
  getRoute: v.getRoute,
  isLegal: v.isLegal,
  lockedBy: v.lockedBy,
  isBlocked: v.isBlocked,
  isSimple: v.isSimple
});
var newtate_fallback = { newjoint: 0, newstate: 0, shape: [] };
var grayRail = (s) => ({ color: "#668", shape: s });
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
  name: v.name,
  flipped: !v.flipped,
  opposed: v.opposed,
  defaultState: v.defaultState,
  getJoints: v.getJoints,
  getStates: v.getStates,
  getOrigin: v.getOrigin,
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
  },
  getRoute: v.getRoute,
  isLegal: v.isLegal,
  lockedBy: v.lockedBy,
  isBlocked: v.isBlocked,
  isSimple: v.isSimple
});
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
      const $0 = { coord: pp.coord, angle: pp.angle + 3.141592653589793, isPlus: pp.isPlus };
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
    getOrigin: v.getOrigin,
    getJointPos: (v1) => {
      if (v1 < getJointPos_memo.length) {
        return getJointPos_memo[v1];
      }
      return poszero;
    },
    getNewState: (v1) => (v2) => {
      if (v1 < getNewState_memo.length) {
        if (v2 < getNewState_memo[v1].length) {
          return getNewState_memo[v1][v2];
        }
        return newtate_fallback;
      }
      return newtate_fallback;
    },
    getDrawInfo: (v1) => {
      if (v1 < getDrawInfo_memo.length) {
        return getDrawInfo_memo[v1];
      }
      return brokenDrawInfo;
    },
    getRoute: (v1) => (v2) => (v3) => {
      if (v1 < getRoute_memo.length) {
        if (v2 < getRoute_memo[v1].length) {
          if (v3 < getRoute_memo[v1][v2].length) {
            return getRoute_memo[v1][v2][v3];
          }
          return Nothing;
        }
        return Nothing;
      }
      return Nothing;
    },
    isLegal: (v1) => (v2) => {
      if (v1 < isLegal_memo.length) {
        if (v2 < isLegal_memo[v1].length) {
          return isLegal_memo[v1][v2];
        }
        return false;
      }
      return false;
    },
    lockedBy: (v1) => (v2) => {
      if (v1 < lockedBy_memo.length) {
        if (v2 < lockedBy_memo[v1].length) {
          return lockedBy_memo[v1][v2];
        }
        return [];
      }
      return [];
    },
    isBlocked: (v1) => (v2) => (v3) => {
      if (v1 < isBlocked_memo.length) {
        if (v2 < isBlocked_memo[v1].length) {
          if (v3 < isBlocked_memo[v1][v2].length) {
            return isBlocked_memo[v1][v2][v3];
          }
          return false;
        }
        return false;
      }
      return false;
    },
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
  getOrigin: dictIntSerialize.toSerial(v.getOrigin),
  getJointPos: (v1) => {
    const $0 = dictIntSerialize.fromSerial(v1);
    if ($0.tag === "Just") {
      return v.getJointPos($0._1);
    }
    return poszero;
  },
  getNewState: (v1) => (v2) => {
    const $0 = applyMaybe.apply((() => {
      const $02 = dictIntSerialize.fromSerial(v1);
      if ($02.tag === "Just") {
        return $Maybe("Just", v.getNewState($02._1));
      }
      return Nothing;
    })())(dictIntSerialize1.fromSerial(v2));
    if ($0.tag === "Just") {
      return { newjoint: dictIntSerialize.toSerial($0._1.newjoint), newstate: dictIntSerialize1.toSerial($0._1.newstate), shape: $0._1.shape };
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
    const $0 = applyMaybe.apply(applyMaybe.apply((() => {
      const $02 = dictIntSerialize1.fromSerial(v1);
      if ($02.tag === "Just") {
        return $Maybe("Just", v.getRoute($02._1));
      }
      return Nothing;
    })())(dictIntSerialize.fromSerial(v2)))(dictIntSerialize.fromSerial(v3));
    if ($0.tag === "Just") {
      if ($0._1.tag === "Just") {
        return $Maybe("Just", dictIntSerialize1.toSerial($0._1._1));
      }
      return Nothing;
    }
    return Nothing;
  },
  isLegal: (v1) => (v2) => {
    const $0 = applyMaybe.apply((() => {
      const $02 = dictIntSerialize.fromSerial(v1);
      if ($02.tag === "Just") {
        return $Maybe("Just", v.isLegal($02._1));
      }
      return Nothing;
    })())(dictIntSerialize1.fromSerial(v2));
    if ($0.tag === "Nothing") {
      return false;
    }
    if ($0.tag === "Just") {
      return $0._1;
    }
    fail();
  },
  lockedBy: (v1) => (v2) => {
    const $0 = applyMaybe.apply((() => {
      const $02 = dictIntSerialize1.fromSerial(v1);
      if ($02.tag === "Just") {
        return $Maybe("Just", v.lockedBy($02._1));
      }
      return Nothing;
    })())(dictIntSerialize1.fromSerial(v2));
    const $1 = arrayMap((x) => dictIntSerialize.toSerial(x));
    if ($0.tag === "Just") {
      return $1($0._1);
    }
    return [];
  },
  isBlocked: (v1) => (v2) => (v3) => {
    const $0 = applyMaybe.apply(applyMaybe.apply((() => {
      const $02 = dictIntSerialize.fromSerial(v1);
      if ($02.tag === "Just") {
        return $Maybe("Just", v.isBlocked($02._1));
      }
      return Nothing;
    })())(dictIntSerialize1.fromSerial(v2)))(dictIntSerialize.fromSerial(v3));
    if ($0.tag === "Nothing") {
      return false;
    }
    if ($0.tag === "Just") {
      return $0._1;
    }
    fail();
  },
  isSimple: v.isSimple
});
var blueRail = (s) => ({ color: "#37d", shape: s });
var absShape = (p) => (v) => ({ start: toAbsPos(p)(v.start), end: toAbsPos(p)(v.end), length: v.length });
var absParts = (p) => (v) => ({ color: v.color, shape: absShape(p)(v.shape) });
var absAdditional = (p) => (v) => ({ parttype: v.parttype, pos: toAbsPos(p)(v.pos) });
var absDrawInfo = (p) => (v) => ({ rails: arrayMap(absParts(p))(v.rails), additionals: arrayMap(absAdditional(p))(v.additionals) });

// output-es/Internal.Layout/index.js
var $SignalRule = (tag, _1, _2, _3, _4) => ({ tag, _1, _2, _3, _4 });
var identity5 = (x) => x;
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
var maximum = /* @__PURE__ */ (() => maximumBy(foldableArray)(ordInt.compare))();
var min2 = (x) => (y) => {
  const v = ordNumber.compare(x)(y);
  if (v.tag === "LT") {
    return x;
  }
  if (v.tag === "EQ") {
    return x;
  }
  if (v.tag === "GT") {
    return y;
  }
  fail();
};
var max2 = (x) => (y) => {
  const v = ordNumber.compare(x)(y);
  if (v.tag === "LT") {
    return y;
  }
  if (v.tag === "EQ") {
    return x;
  }
  if (v.tag === "GT") {
    return x;
  }
  fail();
};
var allWithIndex = /* @__PURE__ */ (() => {
  const foldMapWithIndex2 = foldableWithIndexArray.foldMapWithIndex((() => {
    const semigroupConj1 = { append: (v) => (v1) => v && v1 };
    return { mempty: true, Semigroup0: () => semigroupConj1 };
  })());
  return (t) => foldMapWithIndex2((i) => t(i));
})();
var min1 = (x) => (y) => {
  const v = ordInt.compare(x)(y);
  if (v.tag === "LT") {
    return x;
  }
  if (v.tag === "EQ") {
    return x;
  }
  if (v.tag === "GT") {
    return y;
  }
  fail();
};
var RuleSpeed = (value0) => (value1) => (value2) => $SignalRule("RuleSpeed", value0, value1, value2);
var RuleOpen = (value0) => (value1) => (value2) => $SignalRule("RuleOpen", value0, value1, value2);
var RuleUpdate = (value0) => (value1) => (value2) => (value3) => $SignalRule("RuleUpdate", value0, value1, value2, value3);
var RuleStop = (value0) => (value1) => $SignalRule("RuleStop", value0, value1);
var RuleStopOpen = (value0) => (value1) => (value2) => $SignalRule("RuleStopOpen", value0, value1, value2);
var RuleStopUpdate = (value0) => (value1) => (value2) => (value3) => $SignalRule("RuleStopUpdate", value0, value1, value2, value3);
var RuleReverse = (value0) => (value1) => $SignalRule("RuleReverse", value0, value1);
var RuleReverseUpdate = (value0) => (value1) => (value2) => (value3) => $SignalRule("RuleReverseUpdate", value0, value1, value2, value3);
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
            const $42 = modifyAt(v5.jointid)((v6) => concatArray(v6)([v3.trainid]))(d);
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
          const $4 = modifyAt(v5.nodeid)((d) => false)($2);
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
  })({ traffic: arrayMap((v2) => replicate(v2.rail.getJoints.length)([]))(v.rails), isclear: replicate(v.rails.length)(true) })(v.trains);
  return {
    version: v.version,
    rails: v.rails,
    trains: v.trains,
    signalcolors: v.signalcolors,
    traffic: v1.traffic,
    isclear: v1.isclear,
    instancecount: v.instancecount,
    traincount: v.traincount,
    updatecount: v.updatecount,
    jointData: v.jointData,
    routequeue: v.routequeue,
    time: v.time,
    speed: v.speed,
    activeReserves: v.activeReserves
  };
};
var updateReserves = (v) => ({
  version: v.version,
  rails: v.rails,
  trains: v.trains,
  signalcolors: v.signalcolors,
  traffic: v.traffic,
  isclear: v.isclear,
  instancecount: v.instancecount,
  traincount: v.traincount,
  updatecount: v.updatecount,
  jointData: v.jointData,
  routequeue: v.routequeue,
  time: v.time,
  speed: v.speed,
  activeReserves: mapMaybe((x) => x)(arrayMap((reserver) => {
    const $0 = findIndex((reserve) => reserve.reserver === reserver)(v.activeReserves);
    if ($0.tag === "Just") {
      return $Maybe("Just", v.activeReserves[$0._1]);
    }
    return Nothing;
  })(arrayMap((x) => x.trainid)(v.trains)))
});
var updateRailNode = (v) => (j) => {
  const v1 = v.rail.getNewState(j)(v.state);
  return {
    instance: {
      nodeid: v.nodeid,
      instanceid: v.instanceid,
      rail: v.rail,
      state: v1.newstate,
      signals: v.signals,
      invalidRoutes: v.invalidRoutes,
      connections: v.connections,
      reserves: filter((x) => x.jointid !== j)(v.reserves),
      pos: v.pos,
      note: v.note,
      drawinfos: v.drawinfos
    },
    newjoint: v1.newjoint,
    shapes: arrayMap(absShape(v.pos))(v1.shape)
  };
};
var shiftRailIndex_Node = (deleted) => (v) => ({
  nodeid: v.nodeid < deleted ? v.nodeid : v.nodeid - 1 | 0,
  instanceid: v.instanceid,
  rail: v.rail,
  state: v.state,
  signals: arrayMap((v2) => ({
    signalname: v2.signalname,
    nodeid: v2.nodeid < deleted ? v2.nodeid : v2.nodeid - 1 | 0,
    jointid: v2.jointid,
    routes: v2.routes,
    routecond: v2.routecond,
    colors: v2.colors,
    indication: v2.indication,
    manualStop: v2.manualStop,
    restraint: v2.restraint,
    rules: v2.rules
  }))(v.signals),
  invalidRoutes: arrayMap((v2) => ({ nodeid: v2.nodeid < deleted ? v2.nodeid : v2.nodeid - 1 | 0, jointid: v2.jointid }))(v.invalidRoutes),
  connections: arrayMap((c) => ({ nodeid: c.nodeid < deleted ? c.nodeid : c.nodeid - 1 | 0, from: c.from, jointid: c.jointid }))(v.connections),
  reserves: v.reserves,
  pos: v.pos,
  note: v.note,
  drawinfos: v.drawinfos
});
var shiftRailIndex_Train = (deleted) => (v) => ({
  types: v.types,
  route: arrayMap((v2) => ({ nodeid: v2.nodeid < deleted ? v2.nodeid : v2.nodeid - 1 | 0, jointid: v2.jointid, railinstance: v2.railinstance, shapes: v2.shapes, length: v2.length }))(v.route),
  distanceToNext: v.distanceToNext,
  distanceFromOldest: v.distanceFromOldest,
  speed: v.speed,
  trainid: v.trainid,
  flipped: v.flipped,
  signalRestriction: v.signalRestriction,
  respectSignals: v.respectSignals,
  realAcceralation: v.realAcceralation,
  notch: v.notch,
  note: v.note,
  tags: v.tags,
  signalRulePhase: v.signalRulePhase
});
var saModifyAt = (i) => (d) => (f) => (v) => {
  if (i < v.head) {
    return {
      arraydata: concatArray([f(Nothing)])(concatArray(replicate((v.head - i | 0) - 1 | 0)(d))(v.arraydata)),
      head: i,
      end: v.end
    };
  }
  if (v.end <= i) {
    return {
      arraydata: concatArray(v.arraydata)(concatArray(replicate(i - v.end | 0)(d))([f(Nothing)])),
      head: v.head,
      end: i + 1 | 0
    };
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
var newreserve = (reserver) => (reserveid) => (v) => ({
  version: v.version,
  rails: v.rails,
  trains: v.trains,
  signalcolors: v.signalcolors,
  traffic: v.traffic,
  isclear: v.isclear,
  instancecount: v.instancecount,
  traincount: v.traincount,
  updatecount: v.updatecount,
  jointData: v.jointData,
  routequeue: v.routequeue,
  time: v.time,
  speed: v.speed,
  activeReserves: concatArray([{ reserveid, reserver }])(v.activeReserves)
});
var instanceDrawInfos = (v) => arrayMap((x) => absDrawInfo(v.pos)(v.rail.getDrawInfo(x)))(v.rail.getStates);
var recalcInstanceDrawInfo = (v) => ({
  nodeid: v.nodeid,
  instanceid: v.instanceid,
  rail: v.rail,
  state: v.state,
  signals: v.signals,
  invalidRoutes: v.invalidRoutes,
  connections: v.connections,
  reserves: v.reserves,
  pos: v.pos,
  note: v.note,
  drawinfos: instanceDrawInfos(v)
});
var instanceDrawInfo = (v) => {
  const $0 = index(v.drawinfos)(v.state);
  if ($0.tag === "Nothing") {
    return brokenDrawInfo;
  }
  if ($0.tag === "Just") {
    return $0._1;
  }
  fail();
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
  if ((() => {
    const $0 = any((t) => t.length > 0);
    const $1 = index(v.traffic)(v1.nodeid);
    if ($1.tag === "Nothing") {
      return false;
    }
    if ($1.tag === "Just") {
      return $0($1._1);
    }
    fail();
  })()) {
    return true;
  }
  const go = (go$a0$copy) => (go$a1$copy) => (go$a2$copy) => {
    let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$a2 = go$a2$copy, go$c = true, go$r;
    while (go$c) {
      const nid = go$a0, jid = go$a1, depth = go$a2;
      if (depth > 30) {
        go$c = false;
        go$r = false;
        continue;
      }
      const v2 = index(v.rails)(nid);
      if (v2.tag === "Nothing") {
        go$c = false;
        go$r = false;
        continue;
      }
      if (v2.tag === "Just") {
        if (any((x) => x.jointid === jid)(v2._1.signals) || any((x) => x.jointid === jid)(v2._1.invalidRoutes)) {
          go$c = false;
          go$r = false;
          continue;
        }
        const jointexit = getRouteInfo(v2._1)(jid).newjoint;
        const v3 = index(v.traffic)(nid);
        if (v3.tag === "Nothing") {
          go$c = false;
          go$r = false;
          continue;
        }
        if (v3.tag === "Just") {
          const v4 = index(v3._1)(jointexit);
          if (v4.tag === "Nothing") {
            go$c = false;
            go$r = false;
            continue;
          }
          if (v4.tag === "Just") {
            if (v4._1.length > 0) {
              go$c = false;
              go$r = true;
              continue;
            }
            const $0 = findIndex((c) => c.from === jointexit)(v2._1.connections);
            if ($0.tag === "Just") {
              go$a0 = v2._1.connections[$0._1].nodeid;
              go$a1 = v2._1.connections[$0._1].jointid;
              go$a2 = depth + 1 | 0;
              continue;
            }
            go$c = false;
            go$r = false;
            continue;
          }
          fail();
        }
        fail();
      }
      fail();
    }
    return go$r;
  };
  return any(identity5)(arrayMap((cdata) => go(cdata.nodeid)(cdata.jointid)(0))(v1.connections));
};
var setManualStop = (v) => (nodeid) => (jointid) => (stop) => {
  const $0 = index(v.rails)(nodeid);
  if ($0.tag === "Just") {
    const $1 = findWithIndex(foldableWithIndexArray)((v2) => (v3) => v3.jointid === jointid)($0._1.signals);
    if ($1.tag === "Just") {
      const $2 = updateAt($1._1.index)({
        signalname: $1._1.value.signalname,
        nodeid: $1._1.value.nodeid,
        jointid: $1._1.value.jointid,
        routes: $1._1.value.routes,
        routecond: $1._1.value.routecond,
        colors: $1._1.value.colors,
        indication: $1._1.value.indication,
        manualStop: stop,
        restraint: $1._1.value.restraint,
        rules: $1._1.value.rules
      })($0._1.signals);
      if ($2.tag === "Just") {
        const $3 = updateAt(nodeid)({
          nodeid: $0._1.nodeid,
          instanceid: $0._1.instanceid,
          rail: $0._1.rail,
          state: $0._1.state,
          signals: $2._1,
          invalidRoutes: $0._1.invalidRoutes,
          connections: $0._1.connections,
          reserves: $0._1.reserves,
          pos: $0._1.pos,
          note: $0._1.note,
          drawinfos: $0._1.drawinfos
        })(v.rails);
        if ($3.tag === "Just") {
          return {
            version: v.version,
            rails: $3._1,
            trains: v.trains,
            signalcolors: v.signalcolors,
            traffic: v.traffic,
            isclear: v.isclear,
            instancecount: v.instancecount,
            traincount: v.traincount,
            updatecount: v.updatecount,
            jointData: v.jointData,
            routequeue: v.routequeue,
            time: v.time,
            speed: v.speed,
            activeReserves: v.activeReserves
          };
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
  if ($0.tag === "Nothing") {
    return v;
  }
  fail();
};
var updateSignalRoutes = (v) => ({
  version: v.version,
  rails: arrayMap((v2) => ({
    nodeid: v2.nodeid,
    instanceid: v2.instanceid,
    rail: v2.rail,
    state: v2.state,
    signals: arrayMap((v4) => ({
      signalname: v4.signalname,
      nodeid: v4.nodeid,
      jointid: v4.jointid,
      routes: (() => {
        const go = (v62) => {
          if (v62.rails.length > 30) {
            return [];
          }
          const v7 = index(v.rails)(v62.nid);
          if (v7.tag === "Nothing") {
            return [];
          }
          if (v7.tag === "Just") {
            const $0 = v7._1;
            return arrayBind(($0.rail.flipped ? reverse : identity5)(nubBy((x) => (y) => ordInt.compare(x.newjoint)(y.newjoint))(arrayMap($0.rail.getNewState(v62.jid))($0.rail.getStates))))((v8) => {
              const $1 = v8.newjoint;
              if (findIndex((v10) => v10.jointid === $1)($0.invalidRoutes).tag === "Just") {
                return [];
              }
              const newrails = concatArray(v62.rails)([{ nodeid: v62.nid, jointenter: v62.jid, jointexit: $1 }]);
              const newlen = v62.len + sum(arrayMap((x) => x.length)(v8.shape));
              if (findIndex((v11) => v11.jointid === $1)($0.signals).tag === "Just") {
                return [{ nextsignal: { nodeid: v62.nid, jointid: $1 }, rails: newrails, isSimple: v62.isSimple, length: newlen }];
              }
              const $2 = findIndex((c) => c.from === $1)($0.connections);
              if ($2.tag === "Just") {
                if (elem(eqIntNode)($0.connections[$2._1].nodeid)(v62.rids)) {
                  return [];
                }
                return go({
                  nid: $0.connections[$2._1].nodeid,
                  jid: $0.connections[$2._1].jointid,
                  rails: newrails,
                  rids: insertBy(ordIntNode.compare)($0.connections[$2._1].nodeid)(v62.rids),
                  isSimple: v62.isSimple && $0.rail.isSimple,
                  len: newlen
                });
              }
              return [];
            });
          }
          fail();
        };
        const v6 = index(v.rails)(v4.nodeid);
        if (v6.tag === "Nothing") {
          return [];
        }
        if (v6.tag === "Just") {
          const $0 = findIndex((c) => c.from === v4.jointid)(v6._1.connections);
          if ($0.tag === "Just") {
            return go({ nid: v6._1.connections[$0._1].nodeid, jid: v6._1.connections[$0._1].jointid, rails: [], rids: [], isSimple: true, len: 0 });
          }
          return [];
        }
        fail();
      })(),
      routecond: v4.routecond,
      colors: v4.colors,
      indication: v4.indication,
      manualStop: v4.manualStop,
      restraint: v4.restraint,
      rules: v4.rules
    }))(v2.signals),
    invalidRoutes: v2.invalidRoutes,
    connections: v2.connections,
    reserves: v2.reserves,
    pos: v2.pos,
    note: v2.note,
    drawinfos: v2.drawinfos
  }))(v.rails),
  trains: v.trains,
  signalcolors: v.signalcolors,
  traffic: v.traffic,
  isclear: v.isclear,
  instancecount: v.instancecount,
  traincount: v.traincount,
  updatecount: v.updatecount,
  jointData: v.jointData,
  routequeue: v.routequeue,
  time: v.time,
  speed: v.speed,
  activeReserves: v.activeReserves
});
var removeSignal = (v) => (nodeid) => (jointid) => updateSignalRoutes({
  version: v.version,
  rails: (() => {
    const $0 = modifyAt(nodeid)((v2) => ({
      nodeid: v2.nodeid,
      instanceid: v2.instanceid,
      rail: v2.rail,
      state: v2.state,
      signals: filter((v4) => v4.jointid !== jointid)(v2.signals),
      invalidRoutes: filter((v4) => v4.jointid !== jointid)(v2.invalidRoutes),
      connections: v2.connections,
      reserves: v2.reserves,
      pos: v2.pos,
      note: v2.note,
      drawinfos: v2.drawinfos
    }))(v.rails);
    if ($0.tag === "Nothing") {
      return v.rails;
    }
    if ($0.tag === "Just") {
      return $0._1;
    }
    fail();
  })(),
  trains: v.trains,
  signalcolors: v.signalcolors,
  traffic: v.traffic,
  isclear: v.isclear,
  instancecount: v.instancecount,
  traincount: v.traincount,
  updatecount: v.updatecount + 1 | 0,
  jointData: v.jointData,
  routequeue: v.routequeue,
  time: v.time,
  speed: v.speed,
  activeReserves: v.activeReserves
});
var removeRail = (v) => (nodeid) => {
  const v1 = index(v.rails)(nodeid);
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
    version: layout$p.version,
    rails: arrayMap((v2) => shiftRailIndex_Node(nodeid)({
      nodeid: v2.nodeid,
      instanceid: v2.instanceid,
      rail: v2.rail,
      state: v2.state,
      signals: v2.signals,
      invalidRoutes: v2.invalidRoutes,
      connections: filter((v4) => v4.nodeid !== nodeid)(v2.connections),
      reserves: v2.reserves,
      pos: v2.pos,
      note: v2.note,
      drawinfos: v2.drawinfos
    }))((() => {
      const $0 = deleteAt(nodeid)(layout$p.rails);
      if ($0.tag === "Nothing") {
        return layout$p.rails;
      }
      if ($0.tag === "Just") {
        return $0._1;
      }
      fail();
    })()),
    trains: arrayMap(shiftRailIndex_Train(nodeid))(layout$p.trains),
    signalcolors: layout$p.signalcolors,
    traffic: layout$p.traffic,
    isclear: layout$p.isclear,
    instancecount: layout$p.instancecount,
    traincount: layout$p.traincount,
    updatecount: layout$p.updatecount + 1 | 0,
    jointData: {
      arraydata: arrayMap(functorSectionArray.map(functorSectionArray.map((() => {
        const $0 = filter((v2) => v2.nodeid !== nodeid);
        const $1 = arrayMap((v2) => ({ pos: v2.pos, nodeid: v2.nodeid < nodeid ? v2.nodeid : v2.nodeid - 1 | 0, jointid: v2.jointid }));
        return (x) => $1($0(x));
      })())))(layout$p.jointData.arraydata),
      head: layout$p.jointData.head,
      end: layout$p.jointData.end
    },
    routequeue: layout$p.routequeue,
    time: layout$p.time,
    speed: layout$p.speed,
    activeReserves: layout$p.activeReserves
  });
};
var getRailJointAbsPos = (v) => (jointid) => toAbsPos(v.pos)(v.rail.getJointPos(jointid));
var getNextSignal = (v) => (v1) => {
  const v2 = index(v1.route)(0);
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
        const v3 = index(v.rails)(nid);
        if (v3.tag === "Nothing") {
          go$c = false;
          go$r = { signal: Nothing, sections: sectionsold, distance: distanceold };
          continue;
        }
        if (v3.tag === "Just") {
          const sections = sectionsold + 1 | 0;
          const next = getRouteInfo(v3._1)(jid);
          const distance = isfirst ? distanceold : distanceold + sum(arrayMap(shapeLength)(next.shapes));
          if (findIndex((v5) => v5.jointid === next.newjoint)(v3._1.invalidRoutes).tag === "Just") {
            go$c = false;
            go$r = { signal: Nothing, sections, distance };
            continue;
          }
          const $0 = findIndex((v6) => v6.jointid === next.newjoint)(v3._1.signals);
          if ($0.tag === "Just") {
            go$c = false;
            go$r = { signal: $Maybe("Just", v3._1.signals[$0._1]), sections, distance };
            continue;
          }
          const $1 = findIndex((c) => c.from === next.newjoint)(v3._1.connections);
          if ($1.tag === "Just") {
            go$a0 = v3._1.connections[$1._1].nodeid;
            go$a1 = v3._1.connections[$1._1].jointid;
            go$a2 = sections;
            go$a3 = distance;
            go$a4 = false;
            continue;
          }
          go$c = false;
          go$r = { signal: Nothing, sections, distance };
          continue;
        }
        fail();
      }
      return go$r;
    };
    return go(v2._1.nodeid)(v2._1.jointid)(0)(v1.distanceToNext)(true);
  }
  fail();
};
var getJoints = (v) => (joint) => arrayBind(arrayApply(arrayApply(arrayMap((x) => (y) => (z) => {
  const $0 = index(v.jointData.arraydata)(z - v.jointData.head | 0);
  const $1 = (() => {
    if ($0.tag === "Just") {
      const $12 = index($0._1.arraydata)(x - $0._1.head | 0);
      if ($12.tag === "Just") {
        return index($12._1.arraydata)(y - $12._1.head | 0);
      }
      if ($12.tag === "Nothing") {
        return Nothing;
      }
      fail();
    }
    if ($0.tag === "Nothing") {
      return Nothing;
    }
    fail();
  })();
  if ($1.tag === "Nothing") {
    return [];
  }
  if ($1.tag === "Just") {
    return $1._1;
  }
  fail();
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
  const $0 = index(v.rails)(nodeid);
  if ($0.tag === "Just") {
    return $Maybe("Just", toAbsPos($0._1.pos)($0._1.rail.getJointPos(jointid)));
  }
  return Nothing;
};
var getNewRailPos = (v) => (v1) => {
  const origin = v1.rail.getJointPos(v1.rail.getOrigin);
  const $0 = foldM((mposofzero) => (v2) => {
    if (mposofzero.tag === "Nothing") {
      return $Maybe(
        "Just",
        applyMaybe.apply((() => {
          const $02 = getJointAbsPos(v)(v2.nodeid)(v2.jointid);
          if ($02.tag === "Just") {
            return $Maybe("Just", toAbsPos({ coord: $02._1.coord, angle: $02._1.angle + 3.141592653589793, isPlus: $02._1.isPlus }));
          }
          return Nothing;
        })())($Maybe("Just", convertRelPos(v1.rail.getJointPos(v2.from))(origin)))
      );
    }
    if (mposofzero.tag === "Just") {
      if ((() => {
        const $02 = canJoin(toAbsPos(mposofzero._1)(v1.rail.getJointPos(v2.from)));
        const $1 = getJointAbsPos(v)(v2.nodeid)(v2.jointid);
        if ($1.tag === "Just") {
          return $02($1._1);
        }
        return false;
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
var forceUpdate = (v) => ({
  version: v.version,
  rails: v.rails,
  trains: v.trains,
  signalcolors: v.signalcolors,
  traffic: v.traffic,
  isclear: v.isclear,
  instancecount: v.instancecount,
  traincount: v.traincount,
  updatecount: v.updatecount + 1 | 0,
  jointData: v.jointData,
  routequeue: v.routequeue,
  time: v.time,
  speed: v.speed,
  activeReserves: v.activeReserves
});
var flipTrain = (v) => ({
  types: v.types,
  route: reverse(arrayMap((v2) => ({
    nodeid: v2.nodeid,
    jointid: v2.railinstance.rail.getNewState(v2.jointid)(v2.railinstance.state).newjoint,
    railinstance: v2.railinstance,
    shapes: reverseShapes(v2.shapes),
    length: v2.length
  }))(v.route)),
  distanceToNext: v.distanceFromOldest,
  distanceFromOldest: v.distanceToNext,
  speed: v.speed,
  trainid: v.trainid,
  flipped: !v.flipped,
  signalRestriction: v.signalRestriction,
  respectSignals: v.respectSignals,
  realAcceralation: v.realAcceralation,
  notch: v.notch,
  note: v.note,
  tags: v.tags,
  signalRulePhase: v.signalRulePhase
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
  if ($0 === 4) {
    return 2.5;
  }
  return 2.5;
};
var getRestriction = (tags) => (signal) => foldlArray((s) => (r) => {
  if (r.tag === "RuleSpeed") {
    if (any(test(r._1))(arrayMap(unsafeCoerce)(tags))) {
      return min2(s)(toNumber(r._2) * 0.025);
    }
    return s;
  }
  return s;
})(signal.manualStop || signal.restraint ? 0 : signalToSpeed(signal))(signal.rules);
var movefoward = (movefoward$a0$copy) => (movefoward$a1$copy) => (movefoward$a2$copy) => {
  let movefoward$a0 = movefoward$a0$copy, movefoward$a1 = movefoward$a1$copy, movefoward$a2 = movefoward$a2$copy, movefoward$c = true, movefoward$r;
  while (movefoward$c) {
    const v = movefoward$a0, v1 = movefoward$a1, dt = movefoward$a2;
    const dx = dt * v1.speed;
    const $0 = {
      types: v1.types,
      route: v1.route,
      distanceToNext: v1.distanceToNext - dx,
      distanceFromOldest: v1.distanceFromOldest + dx,
      speed: v1.speed,
      trainid: v1.trainid,
      flipped: v1.flipped,
      signalRestriction: v1.signalRestriction,
      respectSignals: v1.respectSignals,
      realAcceralation: v1.realAcceralation,
      notch: v1.notch,
      note: v1.note,
      tags: v1.tags,
      signalRulePhase: v1.signalRulePhase
    };
    const v4 = unsnoc($0.route);
    const v3 = (() => {
      if (v4.tag === "Nothing") {
        return $0;
      }
      if (v4.tag === "Just") {
        if ($0.distanceFromOldest <= v4._1.last.length) {
          return $0;
        }
        return {
          types: $0.types,
          route: v4._1.init,
          distanceToNext: $0.distanceToNext,
          distanceFromOldest: $0.distanceFromOldest - v4._1.last.length,
          speed: $0.speed,
          trainid: $0.trainid,
          flipped: $0.flipped,
          signalRestriction: $0.signalRestriction,
          respectSignals: $0.respectSignals,
          realAcceralation: $0.realAcceralation,
          notch: $0.notch,
          note: $0.note,
          tags: $0.tags,
          signalRulePhase: $0.signalRulePhase
        };
      }
      fail();
    })();
    if (0 <= v3.distanceToNext) {
      movefoward$c = false;
      movefoward$r = { newlayout: v, newtrainset: v3 };
      continue;
    }
    const $1 = index(v3.route)(0);
    if ($1.tag === "Just") {
      const jointexit = $1._1.railinstance.rail.getNewState($1._1.jointid)($1._1.railinstance.state).newjoint;
      const $2 = findIndex((c) => c.from === jointexit)($1._1.railinstance.connections);
      const $3 = $2.tag === "Just" ? $Maybe("Just", $1._1.railinstance.connections[$2._1]) : Nothing;
      if ($3.tag === "Just") {
        const $4 = index(v.rails)($3._1.nodeid);
        if ($4.tag === "Just") {
          const updatedroute = updateRailNode($4._1)($3._1.jointid);
          const newinstance = {
            nodeid: updatedroute.instance.nodeid,
            instanceid: updatedroute.instance.instanceid,
            rail: updatedroute.instance.rail,
            state: updatedroute.instance.state,
            signals: updatedroute.instance.signals,
            invalidRoutes: updatedroute.instance.invalidRoutes,
            connections: updatedroute.instance.connections,
            reserves: filter((r1) => r1.jointid !== $3._1.jointid)(updatedroute.instance.reserves),
            pos: updatedroute.instance.pos,
            note: updatedroute.instance.note,
            drawinfos: updatedroute.instance.drawinfos
          };
          const slength = sum(arrayMap(shapeLength)(updatedroute.shapes));
          movefoward$c = false;
          movefoward$r = {
            newlayout: (() => {
              const $5 = index(v.rails)($3._1.nodeid);
              if ($5.tag === "Just") {
                return $5._1.state === updatedroute.instance.state;
              }
              return false;
            })() ? {
              version: v.version,
              rails: (() => {
                const $5 = updateAt($3._1.nodeid)(newinstance)(v.rails);
                if ($5.tag === "Nothing") {
                  return v.rails;
                }
                if ($5.tag === "Just") {
                  return $5._1;
                }
                fail();
              })(),
              trains: v.trains,
              signalcolors: v.signalcolors,
              traffic: v.traffic,
              isclear: v.isclear,
              instancecount: v.instancecount,
              traincount: v.traincount,
              updatecount: v.updatecount,
              jointData: v.jointData,
              routequeue: v.routequeue,
              time: v.time,
              speed: v.speed,
              activeReserves: v.activeReserves
            } : {
              version: v.version,
              rails: (() => {
                const $5 = updateAt($3._1.nodeid)(newinstance)(v.rails);
                if ($5.tag === "Nothing") {
                  return v.rails;
                }
                if ($5.tag === "Just") {
                  return $5._1;
                }
                fail();
              })(),
              trains: v.trains,
              signalcolors: v.signalcolors,
              traffic: v.traffic,
              isclear: v.isclear,
              instancecount: v.instancecount,
              traincount: v.traincount,
              updatecount: v.updatecount + 1 | 0,
              jointData: v.jointData,
              routequeue: v.routequeue,
              time: v.time,
              speed: v.speed,
              activeReserves: v.activeReserves
            },
            newtrainset: {
              types: v3.types,
              route: concatArray([{ nodeid: $3._1.nodeid, jointid: $3._1.jointid, railinstance: $4._1, shapes: updatedroute.shapes, length: slength }])(v3.route),
              distanceToNext: v3.distanceToNext + slength,
              distanceFromOldest: v3.distanceFromOldest,
              speed: v3.speed,
              trainid: v3.trainid,
              flipped: v3.flipped,
              signalRestriction: max2(0.375)((() => {
                const $5 = findIndex((v7) => v7.jointid === jointexit)($1._1.railinstance.signals);
                if ($5.tag === "Just") {
                  return getRestriction(v3.tags)($1._1.railinstance.signals[$5._1]);
                }
                return v3.signalRestriction;
              })()),
              respectSignals: v3.respectSignals,
              realAcceralation: v3.realAcceralation,
              notch: v3.notch,
              note: v3.note,
              tags: v3.tags,
              signalRulePhase: any((v7) => v7.jointid === jointexit)($1._1.railinstance.signals) ? 0 : v3.signalRulePhase
            }
          };
          continue;
        }
        if ($4.tag === "Nothing") {
          if (v3.distanceToNext === 0) {
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
        if (v3.distanceToNext === 0) {
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
    if ($1.tag === "Nothing") {
      if (v3.distanceToNext === 0) {
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
      const v1 = index(shapes)(i);
      if (v1.tag === "Just") {
        if (v1._1.length < d$p) {
          getpos$p$a0 = w;
          getpos$p$a1 = d$p - v1._1.length;
          getpos$p$a2 = i + 1 | 0;
          continue;
        }
        getpos$p$c = false;
        getpos$p$r = getDividingPoint_rel(v1._1.start)(v1._1.end)(w)(1 - d$p / v1._1.length);
        continue;
      }
      if (v1.tag === "Nothing") {
        getpos$p$c = false;
        getpos$p$r = poszero;
        continue;
      }
      fail();
    }
    return getpos$p$r;
  };
  return {
    tags: v.tags,
    note: v.note,
    flipped: v.flipped,
    trainid: v.trainid,
    cars: zipWith((i) => (ct) => {
      const d = toNumber(i) * 0.5140186915887851 + v.distanceToNext;
      const dh = d + 0.09345794392523366;
      const dt = d + 0.4672897196261683 - 0.09345794392523366;
      return {
        type: ct,
        head: { r: getpos$p(-0.07943925233644861)(dh)(0), l: getpos$p(0.07943925233644861)(dh)(0), m: getpos$p(0)(dh)(0) },
        tail: { r: getpos$p(-0.07943925233644861)(dt)(0), l: getpos$p(0.07943925233644861)(dt)(0), m: getpos$p(0)(dt)(0) }
      };
    })(range(0)(v.types.length - 1 | 0))(v.types)
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
  trains: arrayMap(trainsetDrawInfo)(v.trains)
});
var trainsetLength = (v) => toNumber(v.types.length) * 0.5140186915887851 - 0.04672897196261683;
var brakePattern = (speed) => (finalspeed) => {
  const t = (speed - finalspeed) / 0.6;
  return 0.3 + max2(0)(finalspeed * t + 0.3 * t * t);
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
    return 5;
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
        const routecond = all((v4) => {
          const v5 = index(v.rails)(v4.nodeid);
          if (v5.tag === "Just") {
            return v5._1.rail.getNewState(v4.jointenter)(v5._1.state).newjoint === v4.jointexit && v5._1.rail.isLegal(v4.jointenter)(v5._1.state);
          }
          if (v5.tag === "Nothing") {
            return false;
          }
          fail();
        })(v3.rails);
        return {
          route: v3,
          routecond,
          manualStop: v2.manualStop,
          restraint: v2.restraint,
          cond: (() => {
            if (routecond && all((v4) => {
              if ((() => {
                const $0 = index(v.isclear)(v4.nodeid);
                if ($0.tag === "Nothing") {
                  return false;
                }
                if ($0.tag === "Just") {
                  return $0._1;
                }
                return false;
              })()) {
                return true;
              }
              const v5 = index(v.traffic)(v4.nodeid);
              if (v5.tag === "Just") {
                const $0 = index(v.rails)(v4.nodeid);
                if ($0.tag === "Nothing") {
                  return false;
                }
                if ($0.tag === "Just") {
                  const state = $0._1.state;
                  const rail = $0._1.rail;
                  return allWithIndex((i) => (t) => t.length === 0 || !rail.isBlocked(i)(state)(v4.jointenter))(v5._1);
                }
                fail();
              }
              if (v5.tag === "Nothing") {
                return false;
              }
              fail();
            })(v3.rails)) {
              const v4 = index(v3.rails)(v3.rails.length - 1 | 0);
              if (v4.tag === "Just") {
                const go = (go$a0$copy) => (go$a1$copy) => (go$a2$copy) => {
                  let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$a2 = go$a2$copy, go$c = true, go$r;
                  while (go$c) {
                    const nid = go$a0, jid = go$a1, cnt = go$a2;
                    if (cnt > 120) {
                      go$c = false;
                      go$r = true;
                      continue;
                    }
                    const v5 = index(v.rails)(nid);
                    if (v5.tag === "Nothing") {
                      go$c = false;
                      go$r = false;
                      continue;
                    }
                    if (v5.tag === "Just") {
                      if (v5._1.rail.isSimple) {
                        const jidexit = v5._1.rail.getNewState(jid)(v5._1.state).newjoint;
                        if ((() => {
                          const $02 = index(v.isclear)(nid);
                          if ($02.tag === "Nothing") {
                            return false;
                          }
                          if ($02.tag === "Just") {
                            return $02._1;
                          }
                          return false;
                        })()) {
                          const $02 = findIndex((c) => c.from === jidexit)(v5._1.connections);
                          if ($02.tag === "Just") {
                            go$a0 = v5._1.connections[$02._1].nodeid;
                            go$a1 = v5._1.connections[$02._1].jointid;
                            go$a2 = cnt + 1 | 0;
                            continue;
                          }
                          go$c = false;
                          go$r = true;
                          continue;
                        }
                        const $0 = index(v.traffic)(nid);
                        const $1 = (() => {
                          if ($0.tag === "Just") {
                            return index($0._1)(jidexit);
                          }
                          if ($0.tag === "Nothing") {
                            return Nothing;
                          }
                          fail();
                        })();
                        if ($1.tag === "Just") {
                          if ($1._1.length === 0) {
                            const $2 = findIndex((c) => c.from === jidexit)(v5._1.connections);
                            if ($2.tag === "Just") {
                              go$a0 = v5._1.connections[$2._1].nodeid;
                              go$a1 = v5._1.connections[$2._1].jointid;
                              go$a2 = cnt + 1 | 0;
                              continue;
                            }
                            go$c = false;
                            go$r = true;
                            continue;
                          }
                          go$c = false;
                          go$r = false;
                          continue;
                        }
                        go$c = false;
                        go$r = false;
                        continue;
                      }
                      go$c = false;
                      go$r = true;
                      continue;
                    }
                    fail();
                  }
                  return go$r;
                };
                return go(v4._1.nodeid)(v4._1.jointenter)(0);
              }
              if (v4.tag === "Nothing") {
                return false;
              }
              fail();
            }
            return false;
          })()
        };
      })(v2.routes)
    }))(v1.signals)
  }))(v.rails);
  const filtered = arrayMap((rbd) => arrayMap((bd) => ({ routes: filter((d) => d.cond)(bd.routes), signal: bd.signal }))(rbd.signals))(blockingData);
  return {
    version: v.version,
    rails: arrayMap((rbd) => ({
      nodeid: rbd.rail.nodeid,
      instanceid: rbd.rail.instanceid,
      rail: rbd.rail.rail,
      state: rbd.rail.state,
      signals: arrayMap((bd) => ({
        signalname: bd.signal.signalname,
        nodeid: bd.signal.nodeid,
        jointid: bd.signal.jointid,
        routes: bd.signal.routes,
        routecond: arrayMap((v3) => v3.routecond)(bd.routes),
        colors: bd.signal.colors,
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
                const $02 = index(filtered)(v3.nodeid);
                const $1 = find((bd1) => bd1.signal.jointid === v3.jointid);
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
                  const v5 = index(v4._1.routes)(0);
                  if (v5.tag === "Just") {
                    if (v5._1.cond && (!v5._1.manualStop && !v5._1.restraint || len === 0)) {
                      go$a0 = len + v5._1.route.length;
                      go$a1 = v5._1.route.nextsignal;
                      continue;
                    }
                    go$c = false;
                    go$r = maximum(filter((color) => len >= brakePattern((() => {
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
                      if (color === 4) {
                        return 2.5;
                      }
                      return 2.5;
                    })())(0))([0, 1, 2, 3]));
                    continue;
                  }
                  if (v5.tag === "Nothing") {
                    go$c = false;
                    go$r = maximum(filter((color) => len >= brakePattern((() => {
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
                      if (color === 4) {
                        return 2.5;
                      }
                      return 2.5;
                    })())(0))([0, 1, 2, 3]));
                    continue;
                  }
                  fail();
                }
                if (v4.tag === "Nothing") {
                  go$c = false;
                  go$r = maximum(filter((color) => len >= brakePattern((() => {
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
                    if (color === 4) {
                      return 2.5;
                    }
                    return 2.5;
                  })())(0))([0, 1, 2, 3]));
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
        })(bd.routes),
        manualStop: bd.signal.manualStop || changeManualStop && !(bd.routes.length < 2 && all((bdr) => bdr.route.isSimple)(bd.routes) && all((x) => !(x.tag === "RuleComplex"))(bd.signal.rules)) && (any(identity5)(zipWith((route) => (routecond) => routecond !== route.routecond)(bd.routes)(bd.signal.routecond)) || any(identity5)(zipWith((route) => (indication) => indication > 0 && !route.cond)(bd.routes)(bd.signal.indication))),
        restraint: bd.signal.restraint,
        rules: bd.signal.rules
      }))(rbd.signals),
      invalidRoutes: rbd.rail.invalidRoutes,
      connections: rbd.rail.connections,
      reserves: rbd.rail.reserves,
      pos: rbd.rail.pos,
      note: rbd.rail.note,
      drawinfos: rbd.rail.drawinfos
    }))(blockingData),
    trains: v.trains,
    signalcolors: v.signalcolors,
    traffic: v.traffic,
    isclear: v.isclear,
    instancecount: v.instancecount,
    traincount: v.traincount,
    updatecount: v.updatecount,
    jointData: v.jointData,
    routequeue: v.routequeue,
    time: v.time,
    speed: v.speed,
    activeReserves: v.activeReserves
  };
};
var layoutUpdate = (x) => updateSignalIndication(true)(updateReserves(updateTraffic(x)));
var tryOpenRouteFor = (v) => (nodeid) => (jointid) => (routeid) => (reserver) => {
  const $0 = index(v.rails)(nodeid);
  if ($0.tag === "Just") {
    const $1 = findIndex((v2) => v2.jointid === jointid)($0._1.signals);
    const $2 = $1.tag === "Just" ? $Maybe("Just", $0._1.signals[$1._1]) : Nothing;
    if ($2.tag === "Just") {
      const $3 = index($2._1.routes)(routeid);
      if ($3.tag === "Just") {
        const reserveid = v.updatecount + 1 | 0;
        const programmedroute = reserver !== -1;
        const go = (go$a0$copy) => (go$a1$copy) => {
          let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
          while (go$c) {
            const v4 = go$a0, rs = go$a1;
            const $42 = index(v.rails)(v4.nodeid);
            if ($42.tag === "Just") {
              const $5 = findIndex((v7) => v7.jointid === v4.jointid)($42._1.signals);
              if ($5.tag === "Just") {
                const v6 = uncons($42._1.signals[$5._1].routes);
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
                  go$a1 = concatArray(rs)(v6._1.head.rails);
                  continue;
                }
                fail();
              }
              go$c = false;
              go$r = rs;
              continue;
            }
            if ($42.tag === "Nothing") {
              go$c = false;
              go$r = rs;
              continue;
            }
            fail();
          }
          return go$r;
        };
        const $4 = foldM((v4) => {
          const $42 = v4.newrails;
          const $5 = v4.traffic;
          return (v5) => {
            const $6 = index(v.rails)(v5.nodeid);
            if ($6.tag === "Just") {
              const traffic$p = $5 || hasTraffic(v)($6._1);
              const $7 = $6._1.rail.getRoute($6._1.state)(v5.jointenter)(v5.jointexit);
              if ($7.tag === "Just") {
                const $8 = updateAt(v5.nodeid)({
                  nodeid: $6._1.nodeid,
                  instanceid: $6._1.instanceid,
                  rail: $6._1.rail,
                  state: $7._1,
                  signals: $6._1.signals,
                  invalidRoutes: $6._1.invalidRoutes,
                  connections: $6._1.connections,
                  reserves: concatArray($6._1.reserves)([{ jointid: v5.jointenter, reserveid }]),
                  pos: $6._1.pos,
                  note: $6._1.note,
                  drawinfos: $6._1.drawinfos
                })($42);
                if ($8.tag === "Just") {
                  if ($7._1 !== $6._1.state && traffic$p || programmedroute && ($2._1.restraint || any((v7) => {
                    const $9 = v7.reserveid;
                    return v5.jointenter !== v7.jointid && ($6._1.rail.isBlocked(v5.jointenter)($6._1.state)(v7.jointid) || $6._1.rail.isBlocked(v5.jointenter)($7._1)(v7.jointid)) && any((a) => a.reserveid === $9)(v.activeReserves);
                  })($6._1.reserves))) {
                    return Nothing;
                  }
                  return $Maybe("Just", { traffic: traffic$p, newrails: $8._1 });
                }
                if ($8.tag === "Nothing") {
                  return Nothing;
                }
                fail();
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
          };
        })({
          traffic: false,
          newrails: programmedroute ? v.rails : arrayMap((v4) => {
            if (v4.nodeid === nodeid) {
              return {
                nodeid: v4.nodeid,
                instanceid: v4.instanceid,
                rail: v4.rail,
                state: v4.state,
                signals: arrayMap((v6) => {
                  if (v6.jointid === jointid) {
                    return {
                      signalname: v6.signalname,
                      nodeid: v6.nodeid,
                      jointid: v6.jointid,
                      routes: v6.routes,
                      routecond: v6.routecond,
                      colors: v6.colors,
                      indication: v6.indication,
                      manualStop: true,
                      restraint: v6.restraint,
                      rules: v6.rules
                    };
                  }
                  return v6;
                })(v4.signals),
                invalidRoutes: v4.invalidRoutes,
                connections: v4.connections,
                reserves: v4.reserves,
                pos: v4.pos,
                note: v4.note,
                drawinfos: v4.drawinfos
              };
            }
            return v4;
          })(v.rails)
        })(go($3._1.nextsignal)($3._1.rails));
        if ($4.tag === "Just") {
          return $Maybe(
            "Just",
            {
              layout: newreserve(reserver)(reserveid)(updateSignalIndication(true)(updateReserves(updateTraffic({
                version: v.version,
                rails: $4._1.newrails,
                trains: v.trains,
                signalcolors: v.signalcolors,
                traffic: v.traffic,
                isclear: v.isclear,
                instancecount: v.instancecount,
                traincount: v.traincount,
                updatecount: v.updatecount + 1 | 0,
                jointData: v.jointData,
                routequeue: v.routequeue,
                time: v.time,
                speed: v.speed,
                activeReserves: v.activeReserves
              })))),
              reserveid
            }
          );
        }
        if ($4.tag === "Nothing") {
          return Nothing;
        }
        fail();
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
      const $02 = index(v.rails)(nid);
      if ($02.tag === "Just") {
        const info = getRouteInfo($02._1)(jid);
        const lenhere = sum(arrayMap(shapeLength)(info.shapes));
        if (lenhere < len) {
          const $1 = findIndex((c) => c.from === info.newjoint)($02._1.connections);
          if ($1.tag === "Just") {
            go$a0 = concatArray([{ nodeid: nid, jointid: jid, railinstance: $02._1, shapes: info.shapes, length: lenhere }])(rs);
            go$a1 = $02._1.connections[$1._1].nodeid;
            go$a2 = $02._1.connections[$1._1].jointid;
            go$a3 = len - lenhere;
            continue;
          }
          go$c = false;
          go$r = Nothing;
          continue;
        }
        go$c = false;
        go$r = $Maybe(
          "Just",
          {
            types,
            route: concatArray([{ nodeid: nid, jointid: jid, railinstance: $02._1, shapes: info.shapes, length: lenhere }])(rs),
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
      if ($02.tag === "Nothing") {
        go$c = false;
        go$r = Nothing;
        continue;
      }
      fail();
    }
    return go$r;
  };
  const $0 = index(v.rails)(nodeid);
  if ($0.tag === "Just") {
    const $1 = findIndex((c) => c.from === jointid)($0._1.connections);
    if ($1.tag === "Just") {
      const $2 = go([])($0._1.connections[$1._1].nodeid)($0._1.connections[$1._1].jointid)(toNumber(types.length) * 0.5140186915887851 - 0.04672897196261683);
      if ($2.tag === "Just") {
        return {
          version: v.version,
          rails: v.rails,
          trains: concatArray(v.trains)([$2._1]),
          signalcolors: v.signalcolors,
          traffic: v.traffic,
          isclear: v.isclear,
          instancecount: v.instancecount,
          traincount: v.traincount + 1 | 0,
          updatecount: v.updatecount,
          jointData: v.jointData,
          routequeue: v.routequeue,
          time: v.time,
          speed: v.speed,
          activeReserves: v.activeReserves
        };
      }
      if ($2.tag === "Nothing") {
        return v;
      }
      fail();
    }
    return v;
  }
  if ($0.tag === "Nothing") {
    return v;
  }
  fail();
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
  const $0 = index(v.rails)(nodeid);
  if ($0.tag === "Just") {
    if (any((v2) => v2.jointid === jointid)($0._1.signals) || any((v2) => v2.jointid === jointid)($0._1.invalidRoutes)) {
      return v;
    }
    const $1 = modifyAt(nodeid)((v2) => ({
      nodeid: v2.nodeid,
      instanceid: v2.instanceid,
      rail: v2.rail,
      state: v2.state,
      signals: concatArray(v2.signals)([signal]),
      invalidRoutes: v2.invalidRoutes,
      connections: v2.connections,
      reserves: v2.reserves,
      pos: v2.pos,
      note: v2.note,
      drawinfos: v2.drawinfos
    }))(v.rails);
    if ($1.tag === "Just") {
      return updateSignalRoutes({
        version: v.version,
        rails: $1._1,
        trains: v.trains,
        signalcolors: v.signalcolors,
        traffic: v.traffic,
        isclear: v.isclear,
        instancecount: v.instancecount,
        traincount: v.traincount,
        updatecount: v.updatecount + 1 | 0,
        jointData: v.jointData,
        routequeue: v.routequeue,
        time: v.time,
        speed: v.speed,
        activeReserves: v.activeReserves
      });
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
};
var addRouteQueue = (l) => (n) => (j) => (r) => (t) => ({
  version: l.version,
  rails: l.rails,
  trains: l.trains,
  signalcolors: l.signalcolors,
  traffic: l.traffic,
  isclear: l.isclear,
  instancecount: l.instancecount,
  traincount: l.traincount,
  updatecount: l.updatecount,
  jointData: l.jointData,
  routequeue: concatArray(l.routequeue)([{ jointid: j, nodeid: n, routeid: r, time: l.time, retryafter: l.time, trainid: t }]),
  time: l.time,
  speed: l.speed,
  activeReserves: l.activeReserves
});
var addJoint = (v) => (pos) => (nodeid) => (jointid) => ({
  version: v.version,
  rails: v.rails,
  trains: v.trains,
  signalcolors: v.signalcolors,
  traffic: v.traffic,
  isclear: v.isclear,
  instancecount: v.instancecount,
  traincount: v.traincount,
  updatecount: v.updatecount,
  jointData: saModifyAt(unsafeClamp(round(pos.coord.z)))(saEmpty)((() => {
    const $0 = saModifyAt(unsafeClamp(round(pos.coord.x)))(saEmpty)((() => {
      const $02 = saModifyAt(unsafeClamp(round(pos.coord.y)))([])((ma) => concatArray((() => {
        if (ma.tag === "Nothing") {
          return [];
        }
        if (ma.tag === "Just") {
          return ma._1;
        }
        fail();
      })())([{ pos, nodeid, jointid }]));
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
  })())(v.jointData),
  routequeue: v.routequeue,
  time: v.time,
  speed: v.speed,
  activeReserves: v.activeReserves
});
var addRailWithPos = (v) => (v1) => (pos) => {
  const joints = arrayMap((j) => ({ jointid: j, pos: toAbsPos(pos)(v1.rail.getJointPos(j)) }))(v1.rail.getJoints);
  const cfroms = arrayMap((v2) => v2.from)(v1.connections);
  const newconnections = mapMaybe((x) => x)(arrayMap((v2) => {
    if (elem(eqIntJoint)(v2.jointid)(cfroms)) {
      return Nothing;
    }
    const $0 = index(filter((v3) => canJoin(v2.pos)(v3.pos))(getJoints(v)(v2.pos)))(0);
    if ($0.tag === "Just") {
      return $Maybe("Just", { jointData: $0._1, jointid: v2.jointid });
    }
    return Nothing;
  })(joints));
  const connections = concatArray(arrayMap((v2) => ({ jointData: { pos: poszero, nodeid: v2.nodeid, jointid: v2.jointid }, jointid: v2.from }))(v1.connections))(newconnections);
  if (foldlArray(boolConj)(true)(arrayMap((v2) => {
    const $0 = index(v.rails)(v2.jointData.nodeid);
    if ($0.tag === "Just") {
      return all((c) => c.from !== v2.jointData.jointid)($0._1.connections);
    }
    return true;
  })(connections))) {
    return $Maybe(
      "Just",
      updateSignalRoutes(foldlArray((l$p) => (v2) => addJoint(l$p)(v2.pos)(v1.nodeid)(v2.jointid))({
        version: v.version,
        rails: concatArray(foldlArray((rs) => (v2) => {
          const $0 = v2.jointid;
          const $1 = v2.jointData.jointid;
          const $2 = modifyAt(v2.jointData.nodeid)((v3) => ({
            nodeid: v3.nodeid,
            instanceid: v3.instanceid,
            rail: v3.rail,
            state: v3.state,
            signals: v3.signals,
            invalidRoutes: v3.invalidRoutes,
            connections: concatArray(v3.connections)([{ from: $1, nodeid: v1.nodeid, jointid: $0 }]),
            reserves: v3.reserves,
            pos: v3.pos,
            note: v3.note,
            drawinfos: v3.drawinfos
          }))(rs);
          if ($2.tag === "Nothing") {
            return rs;
          }
          if ($2.tag === "Just") {
            return $2._1;
          }
          fail();
        })(v.rails)(connections))([
          recalcInstanceDrawInfo({
            nodeid: v1.nodeid,
            instanceid: v.instancecount,
            rail: v1.rail,
            state: v1.state,
            signals: v1.signals,
            invalidRoutes: v1.invalidRoutes,
            connections: concatArray(v1.connections)(arrayMap((v3) => ({ from: v3.jointid, nodeid: v3.jointData.nodeid, jointid: v3.jointData.jointid }))(newconnections)),
            reserves: v1.reserves,
            pos,
            note: v1.note,
            drawinfos: v1.drawinfos
          })
        ]),
        trains: v.trains,
        signalcolors: v.signalcolors,
        traffic: v.traffic,
        isclear: v.isclear,
        instancecount: v.instancecount + 1 | 0,
        traincount: v.traincount,
        updatecount: v.updatecount + 1 | 0,
        jointData: v.jointData,
        routequeue: v.routequeue,
        time: v.time,
        speed: v.speed,
        activeReserves: v.activeReserves
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
        note: ""
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
  const $0 = addRailWithPos(l)({
    nodeid: v1.nodeid,
    instanceid: v1.instanceid,
    rail: v1.rail,
    state: v1.state,
    signals: v1.signals,
    invalidRoutes: v1.invalidRoutes,
    connections: [],
    reserves: v1.reserves,
    pos: v1.pos,
    note: v1.note,
    drawinfos: v1.drawinfos
  })(v1.pos);
  if ($0.tag === "Nothing") {
    return l;
  }
  if ($0.tag === "Just") {
    return $0._1;
  }
  fail();
})({
  version: v.version,
  rails: [],
  trains: v.trains,
  signalcolors: v.signalcolors,
  traffic: v.traffic,
  isclear: v.isclear,
  instancecount: v.instancecount,
  traincount: v.traincount,
  updatecount: v.updatecount,
  jointData: saEmpty,
  routequeue: v.routequeue,
  time: v.time,
  speed: v.speed,
  activeReserves: v.activeReserves
})(v.rails);
var addInvalidRoute = (v) => (nodeid) => (jointid) => {
  const $0 = index(v.rails)(nodeid);
  if ($0.tag === "Just") {
    if (any((v2) => v2.jointid === jointid)($0._1.signals) || any((v2) => v2.jointid === jointid)($0._1.invalidRoutes)) {
      return v;
    }
    const $1 = modifyAt(nodeid)((v2) => ({
      nodeid: v2.nodeid,
      instanceid: v2.instanceid,
      rail: v2.rail,
      state: v2.state,
      signals: v2.signals,
      invalidRoutes: concatArray(v2.invalidRoutes)([{ nodeid, jointid }]),
      connections: v2.connections,
      reserves: v2.reserves,
      pos: v2.pos,
      note: v2.note,
      drawinfos: v2.drawinfos
    }))(v.rails);
    if ($1.tag === "Just") {
      return updateSignalRoutes({
        version: v.version,
        rails: $1._1,
        trains: v.trains,
        signalcolors: v.signalcolors,
        traffic: v.traffic,
        isclear: v.isclear,
        instancecount: v.instancecount,
        traincount: v.traincount,
        updatecount: v.updatecount + 1 | 0,
        jointData: v.jointData,
        routequeue: v.routequeue,
        time: v.time,
        speed: v.speed,
        activeReserves: v.activeReserves
      });
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
};
var acceralate = (v) => (notch) => (dt) => ({
  types: v.types,
  route: v.route,
  distanceToNext: v.distanceToNext,
  distanceFromOldest: v.distanceFromOldest,
  speed: max2(0)(v.speed + dt * calcAcceralation(notch)(v.speed)),
  trainid: v.trainid,
  flipped: v.flipped,
  signalRestriction: v.signalRestriction,
  respectSignals: v.respectSignals,
  realAcceralation: v.realAcceralation,
  notch: v.notch,
  note: v.note,
  tags: v.tags,
  signalRulePhase: v.signalRulePhase
});
var trainTick = (v) => (v1) => (dt) => {
  const nextsignal = getNextSignal(v)(v1);
  const v2 = (() => {
    if (nextsignal.signal.tag === "Nothing") {
      return { firedlayout: v, firedtrain: v1 };
    }
    if (nextsignal.signal.tag === "Just") {
      if (v1.signalRulePhase === 0) {
        const $02 = foldlArray((v3) => {
          const $03 = v3.l;
          const $12 = v3.t;
          return (r) => {
            if (any(test(getTag(r)))(arrayMap(unsafeCoerce)(v1.tags))) {
              if (r.tag === "RuleComment") {
                return { l: $03, t: $12 };
              }
              if (r.tag === "RuleComplex") {
                return { l: $03, t: $12 };
              }
              if (r.tag === "RuleSpeed") {
                return { l: $03, t: $12 };
              }
              if (r.tag === "RuleOpen") {
                return { l: addRouteQueue($03)(nextsignal.signal._1.nodeid)(nextsignal.signal._1.jointid)(r._2)(v1.trainid), t: $12 };
              }
              if (r.tag === "RuleUpdate") {
                const $22 = r._2;
                const $3 = r._3;
                return {
                  l: $03,
                  t: {
                    types: $12.types,
                    route: $12.route,
                    distanceToNext: $12.distanceToNext,
                    distanceFromOldest: $12.distanceFromOldest,
                    speed: $12.speed,
                    trainid: $12.trainid,
                    flipped: $12.flipped,
                    signalRestriction: $12.signalRestriction,
                    respectSignals: $12.respectSignals,
                    realAcceralation: $12.realAcceralation,
                    notch: $12.notch,
                    note: $12.note,
                    tags: arrayMap((told) => replace2($22)($3)(told))($12.tags),
                    signalRulePhase: $12.signalRulePhase
                  }
                };
              }
              if (r.tag === "RuleStop") {
                return { l: setManualStop($03)(nextsignal.signal._1.nodeid)(nextsignal.signal._1.jointid)(true), t: $12 };
              }
              if (r.tag === "RuleStopOpen") {
                return { l: setManualStop($03)(nextsignal.signal._1.nodeid)(nextsignal.signal._1.jointid)(true), t: $12 };
              }
              if (r.tag === "RuleStopUpdate") {
                return { l: setManualStop($03)(nextsignal.signal._1.nodeid)(nextsignal.signal._1.jointid)(true), t: $12 };
              }
              if (r.tag === "RuleReverse") {
                return { l: setManualStop($03)(nextsignal.signal._1.nodeid)(nextsignal.signal._1.jointid)(true), t: $12 };
              }
              if (r.tag === "RuleReverseUpdate") {
                return { l: setManualStop($03)(nextsignal.signal._1.nodeid)(nextsignal.signal._1.jointid)(true), t: $12 };
              }
              fail();
            }
            return { l: $03, t: $12 };
          };
        })({ l: v, t: v1 })(nextsignal.signal._1.rules);
        return {
          firedlayout: $02.l,
          firedtrain: {
            types: $02.t.types,
            route: $02.t.route,
            distanceToNext: $02.t.distanceToNext,
            distanceFromOldest: $02.t.distanceFromOldest,
            speed: $02.t.speed,
            trainid: $02.t.trainid,
            flipped: $02.t.flipped,
            signalRestriction: $02.t.signalRestriction,
            respectSignals: $02.t.respectSignals,
            realAcceralation: $02.t.realAcceralation,
            notch: $02.t.notch,
            note: $02.t.note,
            tags: $02.t.tags,
            signalRulePhase: 1
          }
        };
      }
      if (v1.signalRulePhase === 1 && v1.speed === 0) {
        const $02 = foldlArray((v3) => {
          const $03 = v3.f;
          const $12 = v3.l;
          const $22 = v3.t;
          return (r) => {
            if (any(test(getTag(r)))(arrayMap(unsafeCoerce)(v1.tags))) {
              if (r.tag === "RuleComment") {
                return { f: $03, l: $12, t: $22 };
              }
              if (r.tag === "RuleComplex") {
                return { f: $03, l: $12, t: $22 };
              }
              if (r.tag === "RuleSpeed") {
                return { f: $03, l: $12, t: $22 };
              }
              if (r.tag === "RuleOpen") {
                return { f: $03, l: $12, t: $22 };
              }
              if (r.tag === "RuleUpdate") {
                return { f: $03, l: $12, t: $22 };
              }
              if (r.tag === "RuleStop") {
                return { f: $03, l: $12, t: $22 };
              }
              if (r.tag === "RuleStopOpen") {
                return { f: $03, l: addRouteQueue($12)(nextsignal.signal._1.nodeid)(nextsignal.signal._1.jointid)(r._2)(v1.trainid), t: $22 };
              }
              if (r.tag === "RuleStopUpdate") {
                const $3 = r._2;
                const $4 = r._3;
                return {
                  f: $03,
                  l: $12,
                  t: {
                    types: $22.types,
                    route: $22.route,
                    distanceToNext: $22.distanceToNext,
                    distanceFromOldest: $22.distanceFromOldest,
                    speed: $22.speed,
                    trainid: $22.trainid,
                    flipped: $22.flipped,
                    signalRestriction: $22.signalRestriction,
                    respectSignals: $22.respectSignals,
                    realAcceralation: $22.realAcceralation,
                    notch: $22.notch,
                    note: $22.note,
                    tags: arrayMap((told) => replace2($3)($4)(told))($22.tags),
                    signalRulePhase: $22.signalRulePhase
                  }
                };
              }
              if (r.tag === "RuleReverse") {
                return {
                  f: true,
                  l: $12,
                  t: {
                    types: $22.types,
                    route: $22.route,
                    distanceToNext: $22.distanceToNext,
                    distanceFromOldest: $22.distanceFromOldest,
                    speed: $22.speed,
                    trainid: $22.trainid,
                    flipped: $22.flipped,
                    signalRestriction: $22.signalRestriction,
                    respectSignals: $22.respectSignals,
                    realAcceralation: $22.realAcceralation,
                    notch: $22.notch,
                    note: $22.note,
                    tags: $22.tags,
                    signalRulePhase: 0
                  }
                };
              }
              if (r.tag === "RuleReverseUpdate") {
                const $3 = r._2;
                const $4 = r._3;
                return {
                  f: true,
                  l: $12,
                  t: {
                    types: $22.types,
                    route: $22.route,
                    distanceToNext: $22.distanceToNext,
                    distanceFromOldest: $22.distanceFromOldest,
                    speed: $22.speed,
                    trainid: $22.trainid,
                    flipped: $22.flipped,
                    signalRestriction: $22.signalRestriction,
                    respectSignals: $22.respectSignals,
                    realAcceralation: $22.realAcceralation,
                    notch: $22.notch,
                    note: $22.note,
                    tags: arrayMap((told) => replace2($3)($4)(told))($22.tags),
                    signalRulePhase: 0
                  }
                };
              }
              fail();
            }
            return { f: $03, l: $12, t: $22 };
          };
        })({ f: false, l: v, t: v1 })(nextsignal.signal._1.rules);
        return {
          firedlayout: $02.l,
          firedtrain: ($02.f ? flipTrain : identity5)($02.t.signalRulePhase === 1 ? {
            types: $02.t.types,
            route: $02.t.route,
            distanceToNext: $02.t.distanceToNext,
            distanceFromOldest: $02.t.distanceFromOldest,
            speed: $02.t.speed,
            trainid: $02.t.trainid,
            flipped: $02.t.flipped,
            signalRestriction: $02.t.signalRestriction,
            respectSignals: $02.t.respectSignals,
            realAcceralation: $02.t.realAcceralation,
            notch: $02.t.notch,
            note: $02.t.note,
            tags: $02.t.tags,
            signalRulePhase: 3
          } : $02.t)
        };
      }
      return { firedlayout: v, firedtrain: v1 };
    }
    fail();
  })();
  const $0 = v2.firedlayout;
  const $1 = {
    types: v2.firedtrain.types,
    route: v2.firedtrain.route,
    distanceToNext: v2.firedtrain.distanceToNext,
    distanceFromOldest: v2.firedtrain.distanceFromOldest,
    speed: v2.firedtrain.speed,
    trainid: v2.firedtrain.trainid,
    flipped: v2.firedtrain.flipped,
    signalRestriction: max2(v2.firedtrain.signalRestriction)((() => {
      if (nextsignal.signal.tag === "Nothing") {
        return 0.625;
      }
      if (nextsignal.signal.tag === "Just") {
        return signalToSpeed(nextsignal.signal._1);
      }
      fail();
    })()),
    respectSignals: v2.firedtrain.respectSignals,
    realAcceralation: v2.firedtrain.realAcceralation,
    notch: v2.firedtrain.notch,
    note: v2.firedtrain.note,
    tags: v2.firedtrain.tags,
    signalRulePhase: v2.firedtrain.signalRulePhase
  };
  const notch = min1($1.notch)(getMaxNotch_(nextsignal)($1));
  const $2 = $1.realAcceralation ? acceralate($1)(notch)(dt) : $1;
  return movefoward($0)({
    types: $2.types,
    route: mapMaybe((x) => x)(arrayMap((v7) => {
      const $3 = index($0.rails)(v7.nodeid);
      if ($3.tag === "Just") {
        return $Maybe("Just", { nodeid: v7.nodeid, jointid: v7.jointid, railinstance: $3._1, shapes: v7.shapes, length: v7.length });
      }
      return Nothing;
    })($2.route)),
    distanceToNext: $2.distanceToNext,
    distanceFromOldest: $2.distanceFromOldest,
    speed: $2.speed,
    trainid: $2.trainid,
    flipped: $2.flipped,
    signalRestriction: $2.signalRestriction,
    respectSignals: $2.respectSignals,
    realAcceralation: $2.realAcceralation,
    notch: $2.notch,
    note: $2.note,
    tags: $2.tags,
    signalRulePhase: $2.signalRulePhase
  })(dt);
};
var moveTrains = (dt) => (v) => foldlArray((l) => (t) => {
  const v1 = trainTick(l)(t)(dt);
  return {
    version: v1.newlayout.version,
    rails: v1.newlayout.rails,
    trains: concatArray(v1.newlayout.trains)([v1.newtrainset]),
    signalcolors: v1.newlayout.signalcolors,
    traffic: v1.newlayout.traffic,
    isclear: v1.newlayout.isclear,
    instancecount: v1.newlayout.instancecount,
    traincount: v1.newlayout.traincount,
    updatecount: v1.newlayout.updatecount,
    jointData: v1.newlayout.jointData,
    routequeue: v1.newlayout.routequeue,
    time: v1.newlayout.time,
    speed: v1.newlayout.speed,
    activeReserves: v1.newlayout.activeReserves
  };
})({
  version: v.version,
  rails: v.rails,
  trains: [],
  signalcolors: v.signalcolors,
  traffic: v.traffic,
  isclear: v.isclear,
  instancecount: v.instancecount,
  traincount: v.traincount,
  updatecount: v.updatecount,
  jointData: v.jointData,
  routequeue: v.routequeue,
  time: v.time,
  speed: v.speed,
  activeReserves: v.activeReserves
})(v.trains);
var layoutTick = (v) => {
  const $0 = updateSignalIndication(true)(updateReserves(updateTraffic(moveTrains(v.speed / 60)(v))));
  const $1 = foldlArray((v2) => {
    const $12 = v2.layout;
    const $2 = v2.queuenew;
    return (v3) => {
      if ($0.time < v3.retryafter) {
        return { layout: $12, queuenew: concatArray($2)([v3]) };
      }
      const v4 = tryOpenRouteFor($12)(v3.nodeid)(v3.jointid)(v3.routeid)(v3.trainid);
      if (v4.tag === "Nothing") {
        return {
          layout: $12,
          queuenew: concatArray($2)([{ time: v3.time, retryafter: $0.time + 0.25, nodeid: v3.nodeid, jointid: v3.jointid, routeid: v3.routeid, trainid: v3.trainid }])
        };
      }
      if (v4.tag === "Just") {
        return { layout: setManualStop(v4._1.layout)(v3.nodeid)(v3.jointid)(false), queuenew: $2 };
      }
      fail();
    };
  })({ layout: $0, queuenew: [] })($0.routequeue);
  return {
    version: $1.layout.version,
    rails: $1.layout.rails,
    trains: $1.layout.trains,
    signalcolors: $1.layout.signalcolors,
    traffic: $1.layout.traffic,
    isclear: $1.layout.isclear,
    instancecount: $1.layout.instancecount,
    traincount: $1.layout.traincount,
    updatecount: $1.layout.updatecount,
    jointData: $1.layout.jointData,
    routequeue: $1.queuenew,
    time: v.time + v.speed / 60,
    speed: $1.layout.speed,
    activeReserves: $1.layout.activeReserves
  };
};

// output-es/Data.EuclideanRing/foreign.js
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

// output-es/Record/index.js
var insert = (dictIsSymbol) => () => () => (l) => (a) => (r) => unsafeSet(dictIsSymbol.reflectSymbol(l))(a)(r);

// output-es/Internal.Types.Serial/index.js
var rowListSerializeNilRow = () => ({
  rlfromSerial: (v) => (i) => {
    if (0 <= i && i < 1) {
      return $Maybe("Just", {});
    }
    return Nothing;
  },
  rltoSerial: (v) => (v1) => 0,
  rllengthSerial: (v) => 1
});
var intSerializeNoArguments = {
  fromSerial: (i) => {
    if (0 <= i && i < 1) {
      return $Maybe("Just", NoArguments);
    }
    return Nothing;
  },
  toSerial: (v) => 0,
  lengthSerial: (v) => 1
};
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
var intSerializeRecord = () => (dictRowListSerialize) => ({
  fromSerial: dictRowListSerialize.rlfromSerial($$Proxy),
  toSerial: dictRowListSerialize.rltoSerial($$Proxy),
  lengthSerial: (() => {
    const $0 = dictRowListSerialize.rllengthSerial($$Proxy);
    return (v) => $0;
  })()
});
var serialAll = (dictIntSerialize) => mapMaybe((x) => x)(arrayMap(dictIntSerialize.fromSerial)(range(0)(dictIntSerialize.lengthSerial($$Proxy) - 1 | 0)));
var intSerialize = (dictGeneric) => (dictIntSerialize) => ({
  fromSerial: (i) => {
    const $0 = dictIntSerialize.fromSerial(i);
    if ($0.tag === "Just") {
      return $Maybe("Just", dictGeneric.to($0._1));
    }
    return Nothing;
  },
  toSerial: (x) => dictIntSerialize.toSerial(dictGeneric.from(x)),
  lengthSerial: (v) => dictIntSerialize.lengthSerial($$Proxy)
});
var intSerializeArgument = (dictIntSerialize) => ({
  fromSerial: (i) => {
    if (0 <= i && i < dictIntSerialize.lengthSerial($$Proxy)) {
      const $0 = dictIntSerialize.fromSerial(i);
      if ($0.tag === "Just") {
        return $Maybe("Just", $0._1);
      }
      return Nothing;
    }
    return Nothing;
  },
  toSerial: (v) => dictIntSerialize.toSerial(v),
  lengthSerial: (() => {
    const $0 = dictIntSerialize.lengthSerial($$Proxy);
    return (v) => $0;
  })()
});
var intSerializeConstructor = (dictIntSerialize) => ({
  fromSerial: (i) => {
    if (0 <= i && i < dictIntSerialize.lengthSerial($$Proxy)) {
      const $0 = dictIntSerialize.fromSerial(i);
      if ($0.tag === "Just") {
        return $Maybe("Just", $0._1);
      }
      return Nothing;
    }
    return Nothing;
  },
  toSerial: (v) => dictIntSerialize.toSerial(v),
  lengthSerial: (() => {
    const $0 = dictIntSerialize.lengthSerial($$Proxy);
    return (v) => $0;
  })()
});
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
      return Nothing;
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
      return applyMaybe.apply((() => {
        const $0 = dictIntSerialize.fromSerial(intMod(i)(l1));
        if ($0.tag === "Just") {
          return $Maybe("Just", insert(dictIsSymbol)()()($$Proxy)($0._1));
        }
        return Nothing;
      })())(dictRowListSerialize.rlfromSerial($$Proxy)(intDiv(i)(l1)));
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
var $JointsDouble = (tag) => ({ tag });
var $JointsDoublePoint = (tag) => ({ tag });
var $JointsPoint = (tag) => ({ tag });
var $JointsSimple = (tag) => ({ tag });
var $StateDiamond = (tag) => ({ tag });
var $StateScissors = (tag) => ({ tag });
var $StatesSolid = () => ({ tag: "StateSolid" });
var intSerializeConstructor2 = /* @__PURE__ */ intSerializeConstructor(intSerializeNoArguments);
var intSerializeSum1 = /* @__PURE__ */ intSerializeSum(intSerializeConstructor2)(intSerializeConstructor2);
var intSerializeSum2 = /* @__PURE__ */ intSerializeSum(intSerializeConstructor2)(intSerializeSum1);
var rowListSerializeNilRow2 = /* @__PURE__ */ rowListSerializeNilRow();
var rowListSerializeCons1 = /* @__PURE__ */ rowListSerializeCons()({ reflectSymbol: () => "turnout" })(intSerializeBoolean)(rowListSerializeNilRow2)()()();
var intSerializeSum3 = /* @__PURE__ */ intSerializeSum(intSerializeConstructor2)(intSerializeSum2);
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
var genericStatesSolid = { to: (x) => StateSolid, from: (x) => NoArguments };
var intSerialize2 = /* @__PURE__ */ intSerialize(genericStatesSolid)(intSerializeConstructor2);
var serialAll2 = /* @__PURE__ */ serialAll(intSerialize2);
var genericStatesPoint = { to: (x) => x, from: (x) => x };
var intSerialize1 = /* @__PURE__ */ intSerialize(genericStatesPoint)(/* @__PURE__ */ intSerializeConstructor(/* @__PURE__ */ intSerializeArgument(/* @__PURE__ */ intSerializeRecord()(rowListSerializeCons1))));
var serialAll1 = /* @__PURE__ */ serialAll(intSerialize1);
var genericStatesDoublePoint = { to: (x) => x, from: (x) => x };
var intSerialize22 = /* @__PURE__ */ intSerialize(genericStatesDoublePoint)(/* @__PURE__ */ intSerializeConstructor(/* @__PURE__ */ intSerializeArgument(/* @__PURE__ */ intSerializeRecord()(/* @__PURE__ */ rowListSerializeCons()({
  reflectSymbol: () => "innerturnout"
})(intSerializeBoolean)(/* @__PURE__ */ rowListSerializeCons()({ reflectSymbol: () => "outerturnout" })(intSerializeBoolean)(rowListSerializeNilRow2)()()())()()()))));
var serialAll22 = /* @__PURE__ */ serialAll(intSerialize22);
var genericStatesAutoPoint = { to: (x) => x, from: (x) => x };
var intSerialize3 = /* @__PURE__ */ intSerialize(genericStatesAutoPoint)(/* @__PURE__ */ intSerializeConstructor(/* @__PURE__ */ intSerializeArgument(/* @__PURE__ */ intSerializeRecord()(/* @__PURE__ */ rowListSerializeCons()({
  reflectSymbol: () => "auto"
})(intSerializeBoolean)(rowListSerializeCons1)()()()))));
var genericStateScissors = {
  to: (x) => {
    if (x.tag === "Inl") {
      return StateSP_P;
    }
    if (x.tag === "Inr") {
      if (x._1.tag === "Inl") {
        return StateSP_S;
      }
      if (x._1.tag === "Inr") {
        return StateSP_N;
      }
      fail();
    }
    fail();
  },
  from: (x) => {
    if (x.tag === "StateSP_P") {
      return $Sum("Inl", NoArguments);
    }
    if (x.tag === "StateSP_S") {
      return $Sum("Inr", $Sum("Inl", NoArguments));
    }
    if (x.tag === "StateSP_N") {
      return $Sum("Inr", $Sum("Inr", NoArguments));
    }
    fail();
  }
};
var intSerialize4 = /* @__PURE__ */ intSerialize(genericStateScissors)(intSerializeSum2);
var genericStateDiamond = {
  to: (x) => {
    if (x.tag === "Inl") {
      return StateDM_P;
    }
    if (x.tag === "Inr") {
      return StateDM_N;
    }
    fail();
  },
  from: (x) => {
    if (x.tag === "StateDM_P") {
      return $Sum("Inl", NoArguments);
    }
    if (x.tag === "StateDM_N") {
      return $Sum("Inr", NoArguments);
    }
    fail();
  }
};
var intSerialize5 = /* @__PURE__ */ intSerialize(genericStateDiamond)(intSerializeSum1);
var genericJointsSimple = {
  to: (x) => {
    if (x.tag === "Inl") {
      return JointBegin;
    }
    if (x.tag === "Inr") {
      return JointEnd;
    }
    fail();
  },
  from: (x) => {
    if (x.tag === "JointBegin") {
      return $Sum("Inl", NoArguments);
    }
    if (x.tag === "JointEnd") {
      return $Sum("Inr", NoArguments);
    }
    fail();
  }
};
var intSerialize6 = /* @__PURE__ */ intSerialize(genericJointsSimple)(intSerializeSum1);
var serialAll3 = /* @__PURE__ */ serialAll(intSerialize6);
var halfRail = /* @__PURE__ */ (() => {
  const pe = { coord: { x: 0.5, y: 0, z: 0 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: true };
  const pb = { coord: { x: 0, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: false };
  const r0 = [{ start: pb, end: pe, length: partLength(pb)(pe) }];
  return memorizeRail(toRail_(intSerialize6)(intSerialize2)({
    name: "half",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => ({ rails: arrayMap(blueRail)(r0), additionals: [] }),
    defaultState: StateSolid,
    getJoints: serialAll3,
    getStates: serialAll2,
    getOrigin: JointBegin,
    getJointPos: (j) => {
      if (j.tag === "JointBegin") {
        return pb;
      }
      if (j.tag === "JointEnd") {
        return pe;
      }
      fail();
    },
    getNewState: (j) => (s) => {
      if (j.tag === "JointBegin") {
        return { newjoint: JointEnd, newstate: s, shape: r0 };
      }
      if (j.tag === "JointEnd") {
        return { newjoint: JointBegin, newstate: s, shape: reverseShapes(r0) };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if ((() => {
        if (f.tag === "JointBegin") {
          return !(t.tag === "JointBegin");
        }
        if (f.tag === "JointEnd") {
          return !(t.tag === "JointEnd");
        }
        return true;
      })()) {
        return $Maybe("Just", s);
      }
      return Nothing;
    },
    isLegal: (j) => (s) => true,
    lockedBy: (s) => (s$p) => [],
    isBlocked: (j) => (s) => (j$p) => true,
    isSimple: true
  }));
})();
var longRail = /* @__PURE__ */ (() => {
  const pe = { coord: { x: 2, y: 0, z: 0 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: true };
  const pb = { coord: { x: 0, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: false };
  const r0 = [{ start: pb, end: pe, length: partLength(pb)(pe) }];
  return memorizeRail(toRail_(intSerialize6)(intSerialize2)({
    name: "long",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => ({ rails: arrayMap(blueRail)(r0), additionals: [] }),
    defaultState: StateSolid,
    getJoints: serialAll3,
    getStates: serialAll2,
    getOrigin: JointBegin,
    getJointPos: (j) => {
      if (j.tag === "JointBegin") {
        return pb;
      }
      if (j.tag === "JointEnd") {
        return pe;
      }
      fail();
    },
    getNewState: (j) => (s) => {
      if (j.tag === "JointBegin") {
        return { newjoint: JointEnd, newstate: s, shape: r0 };
      }
      if (j.tag === "JointEnd") {
        return { newjoint: JointBegin, newstate: s, shape: reverseShapes(r0) };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if ((() => {
        if (f.tag === "JointBegin") {
          return !(t.tag === "JointBegin");
        }
        if (f.tag === "JointEnd") {
          return !(t.tag === "JointEnd");
        }
        return true;
      })()) {
        return $Maybe("Just", s);
      }
      return Nothing;
    },
    isLegal: (j) => (s) => true,
    lockedBy: (s) => (s$p) => [],
    isBlocked: (j) => (s) => (j$p) => true,
    isSimple: true
  }));
})();
var quarterRail = /* @__PURE__ */ (() => {
  const pe = { coord: { x: 0.25, y: 0, z: 0 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: true };
  const pb = { coord: { x: 0, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: false };
  const r0 = [{ start: pb, end: pe, length: partLength(pb)(pe) }];
  return memorizeRail(toRail_(intSerialize6)(intSerialize2)({
    name: "quarter",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => ({ rails: arrayMap(blueRail)(r0), additionals: [] }),
    defaultState: StateSolid,
    getJoints: serialAll3,
    getStates: serialAll2,
    getOrigin: JointBegin,
    getJointPos: (j) => {
      if (j.tag === "JointBegin") {
        return pb;
      }
      if (j.tag === "JointEnd") {
        return pe;
      }
      fail();
    },
    getNewState: (j) => (s) => {
      if (j.tag === "JointBegin") {
        return { newjoint: JointEnd, newstate: s, shape: r0 };
      }
      if (j.tag === "JointEnd") {
        return { newjoint: JointBegin, newstate: s, shape: reverseShapes(r0) };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if ((() => {
        if (f.tag === "JointBegin") {
          return !(t.tag === "JointBegin");
        }
        if (f.tag === "JointEnd") {
          return !(t.tag === "JointEnd");
        }
        return true;
      })()) {
        return $Maybe("Just", s);
      }
      return Nothing;
    },
    isLegal: (j) => (s) => true,
    lockedBy: (s) => (s$p) => [],
    isBlocked: (j) => (s) => (j$p) => true,
    isSimple: true
  }));
})();
var slopeCurveLRail = /* @__PURE__ */ (() => {
  const pe = { coord: { x: sqrt(0.5), y: 1 - sqrt(0.5), z: 0.25 }, angle: toNumber(1) * 6.283185307179586 / toNumber(8), isPlus: true };
  const pb = { coord: { x: 0, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: false };
  const r0 = [{ start: pb, end: pe, length: partLength(pb)(pe) }];
  return memorizeRail(toRail_(intSerialize6)(intSerialize2)({
    name: "slopecurve",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => ({ rails: arrayMap(blueRail)(r0), additionals: [] }),
    defaultState: StateSolid,
    getJoints: serialAll3,
    getStates: serialAll2,
    getOrigin: JointBegin,
    getJointPos: (j) => {
      if (j.tag === "JointBegin") {
        return pb;
      }
      if (j.tag === "JointEnd") {
        return pe;
      }
      fail();
    },
    getNewState: (j) => (s) => {
      if (j.tag === "JointBegin") {
        return { newjoint: JointEnd, newstate: s, shape: r0 };
      }
      if (j.tag === "JointEnd") {
        return { newjoint: JointBegin, newstate: s, shape: reverseShapes(r0) };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if ((() => {
        if (f.tag === "JointBegin") {
          return !(t.tag === "JointBegin");
        }
        if (f.tag === "JointEnd") {
          return !(t.tag === "JointEnd");
        }
        return true;
      })()) {
        return $Maybe("Just", s);
      }
      return Nothing;
    },
    isLegal: (j) => (s) => true,
    lockedBy: (s) => (s$p) => [],
    isBlocked: (j) => (s) => (j$p) => true,
    isSimple: true
  }));
})();
var slopeCurveRRail = /* @__PURE__ */ memorizeRail(/* @__PURE__ */ flipRail_(slopeCurveLRail));
var slopeRail = /* @__PURE__ */ (() => {
  const pe = { coord: { x: 2, y: 0, z: 1 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: true };
  const pb = { coord: { x: 0, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: false };
  const r0 = [{ start: pb, end: pe, length: partLength(pb)(pe) }];
  return memorizeRail(toRail_(intSerialize6)(intSerialize2)({
    name: "slope",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => ({ rails: arrayMap(blueRail)(r0), additionals: [] }),
    defaultState: StateSolid,
    getJoints: serialAll3,
    getStates: serialAll2,
    getOrigin: JointBegin,
    getJointPos: (j) => {
      if (j.tag === "JointBegin") {
        return pb;
      }
      if (j.tag === "JointEnd") {
        return pe;
      }
      fail();
    },
    getNewState: (j) => (s) => {
      if (j.tag === "JointBegin") {
        return { newjoint: JointEnd, newstate: s, shape: r0 };
      }
      if (j.tag === "JointEnd") {
        return { newjoint: JointBegin, newstate: s, shape: reverseShapes(r0) };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if ((() => {
        if (f.tag === "JointBegin") {
          return !(t.tag === "JointBegin");
        }
        if (f.tag === "JointEnd") {
          return !(t.tag === "JointEnd");
        }
        return true;
      })()) {
        return $Maybe("Just", s);
      }
      return Nothing;
    },
    isLegal: (j) => (s) => true,
    lockedBy: (s) => (s$p) => [],
    isBlocked: (j) => (s) => (j$p) => true,
    isSimple: true
  }));
})();
var straightRail = /* @__PURE__ */ (() => {
  const pe = { coord: { x: 1, y: 0, z: 0 }, angle: toNumber(0) * 6.283185307179586 / toNumber(8), isPlus: true };
  const pb = { coord: { x: 0, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: false };
  const r0 = [{ start: pb, end: pe, length: partLength(pb)(pe) }];
  return memorizeRail(toRail_(intSerialize6)(intSerialize2)({
    name: "straight",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => ({ rails: arrayMap(blueRail)(r0), additionals: [] }),
    defaultState: StateSolid,
    getJoints: serialAll3,
    getStates: serialAll2,
    getOrigin: JointBegin,
    getJointPos: (j) => {
      if (j.tag === "JointBegin") {
        return pb;
      }
      if (j.tag === "JointEnd") {
        return pe;
      }
      fail();
    },
    getNewState: (j) => (s) => {
      if (j.tag === "JointBegin") {
        return { newjoint: JointEnd, newstate: s, shape: r0 };
      }
      if (j.tag === "JointEnd") {
        return { newjoint: JointBegin, newstate: s, shape: reverseShapes(r0) };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if ((() => {
        if (f.tag === "JointBegin") {
          return !(t.tag === "JointBegin");
        }
        if (f.tag === "JointEnd") {
          return !(t.tag === "JointEnd");
        }
        return true;
      })()) {
        return $Maybe("Just", s);
      }
      return Nothing;
    },
    isLegal: (j) => (s) => true,
    lockedBy: (s) => (s$p) => [],
    isBlocked: (j) => (s) => (j$p) => true,
    isSimple: true
  }));
})();
var genericJointsPoint = {
  to: (x) => {
    if (x.tag === "Inl") {
      return JointEnter;
    }
    if (x.tag === "Inr") {
      if (x._1.tag === "Inl") {
        return JointMain;
      }
      if (x._1.tag === "Inr") {
        return JointSub;
      }
      fail();
    }
    fail();
  },
  from: (x) => {
    if (x.tag === "JointEnter") {
      return $Sum("Inl", NoArguments);
    }
    if (x.tag === "JointMain") {
      return $Sum("Inr", $Sum("Inl", NoArguments));
    }
    if (x.tag === "JointSub") {
      return $Sum("Inr", $Sum("Inr", NoArguments));
    }
    fail();
  }
};
var intSerialize7 = /* @__PURE__ */ intSerialize(genericJointsPoint)(intSerializeSum2);
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
          rails: arrayBind([arrayMap(grayRail)(r0), arrayMap(blueRail)(r1)])(identity),
          additionals: []
        };
      }
      return {
        rails: arrayBind([arrayMap(grayRail)(r1), arrayMap(blueRail)(r0)])(identity),
        additionals: []
      };
    },
    defaultState: { turnout: false },
    getJoints: serialAll4,
    getStates: serialAll1,
    getOrigin: JointEnter,
    getJointPos: (j) => {
      if (j.tag === "JointEnter") {
        return pe;
      }
      if (j.tag === "JointMain") {
        return pm;
      }
      if (j.tag === "JointSub") {
        return ps;
      }
      fail();
    },
    getNewState: (j) => (v) => {
      if (j.tag === "JointMain") {
        return { newjoint: JointEnter, newstate: { turnout: false }, shape: reverseShapes(r0) };
      }
      if (j.tag === "JointSub") {
        return { newjoint: JointEnter, newstate: { turnout: true }, shape: reverseShapes(r1) };
      }
      if (j.tag === "JointEnter") {
        if (v.turnout) {
          return { newjoint: JointSub, newstate: v, shape: r1 };
        }
        return { newjoint: JointMain, newstate: v, shape: r0 };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if (f.tag === "JointEnter") {
        if (t.tag === "JointEnter") {
          return Nothing;
        }
        if (t.tag === "JointMain") {
          return $Maybe("Just", { turnout: false });
        }
        if (t.tag === "JointSub") {
          return $Maybe("Just", { turnout: true });
        }
        fail();
      }
      if (f.tag === "JointMain") {
        if (t.tag === "JointEnter") {
          return $Maybe("Just", { turnout: false });
        }
        if (t.tag === "JointMain") {
          return Nothing;
        }
        if (t.tag === "JointSub") {
          return Nothing;
        }
        fail();
      }
      if (f.tag === "JointSub") {
        if (t.tag === "JointEnter") {
          return $Maybe("Just", { turnout: true });
        }
        if (t.tag === "JointMain") {
          return Nothing;
        }
        if (t.tag === "JointSub") {
          return Nothing;
        }
        fail();
      }
      fail();
    },
    isLegal: (j) => (s) => {
      if (j.tag === "JointEnter") {
        return true;
      }
      if (j.tag === "JointMain") {
        return !s.turnout;
      }
      if (j.tag === "JointSub") {
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
    isBlocked: (j) => (s) => (j$p) => true,
    isSimple: false
  }));
})();
var turnOutRPlusRail = /* @__PURE__ */ memorizeRail(/* @__PURE__ */ flipRail_(turnOutLPlusRail));
var genericJointsDoublePoint = {
  to: (x) => {
    if (x.tag === "Inl") {
      return JointOuterEnter;
    }
    if (x.tag === "Inr") {
      if (x._1.tag === "Inl") {
        return JointInnerEnter;
      }
      if (x._1.tag === "Inr") {
        if (x._1._1.tag === "Inl") {
          return JointInnerMain;
        }
        if (x._1._1.tag === "Inr") {
          if (x._1._1._1.tag === "Inl") {
            return JointOuterMain;
          }
          if (x._1._1._1.tag === "Inr") {
            if (x._1._1._1._1.tag === "Inl") {
              return JointInnerSub;
            }
            if (x._1._1._1._1.tag === "Inr") {
              return JointOuterSub;
            }
            fail();
          }
          fail();
        }
        fail();
      }
      fail();
    }
    fail();
  },
  from: (x) => {
    if (x.tag === "JointOuterEnter") {
      return $Sum("Inl", NoArguments);
    }
    if (x.tag === "JointInnerEnter") {
      return $Sum("Inr", $Sum("Inl", NoArguments));
    }
    if (x.tag === "JointInnerMain") {
      return $Sum("Inr", $Sum("Inr", $Sum("Inl", NoArguments)));
    }
    if (x.tag === "JointOuterMain") {
      return $Sum("Inr", $Sum("Inr", $Sum("Inr", $Sum("Inl", NoArguments))));
    }
    if (x.tag === "JointInnerSub") {
      return $Sum(
        "Inr",
        $Sum("Inr", $Sum("Inr", $Sum("Inr", $Sum("Inl", NoArguments))))
      );
    }
    if (x.tag === "JointOuterSub") {
      return $Sum(
        "Inr",
        $Sum("Inr", $Sum("Inr", $Sum("Inr", $Sum("Inr", NoArguments))))
      );
    }
    fail();
  }
};
var intSerialize8 = /* @__PURE__ */ intSerialize(genericJointsDoublePoint)(/* @__PURE__ */ intSerializeSum(intSerializeConstructor2)(/* @__PURE__ */ intSerializeSum(intSerializeConstructor2)(intSerializeSum3)));
var serialAll5 = /* @__PURE__ */ serialAll(intSerialize8);
var genericJointsDouble = {
  to: (x) => {
    if (x.tag === "Inl") {
      return JointOuterBegin;
    }
    if (x.tag === "Inr") {
      if (x._1.tag === "Inl") {
        return JointInnerEnd;
      }
      if (x._1.tag === "Inr") {
        if (x._1._1.tag === "Inl") {
          return JointInnerBegin;
        }
        if (x._1._1.tag === "Inr") {
          return JointOuterEnd;
        }
        fail();
      }
      fail();
    }
    fail();
  },
  from: (x) => {
    if (x.tag === "JointOuterBegin") {
      return $Sum("Inl", NoArguments);
    }
    if (x.tag === "JointInnerEnd") {
      return $Sum("Inr", $Sum("Inl", NoArguments));
    }
    if (x.tag === "JointInnerBegin") {
      return $Sum("Inr", $Sum("Inr", $Sum("Inl", NoArguments)));
    }
    if (x.tag === "JointOuterEnd") {
      return $Sum("Inr", $Sum("Inr", $Sum("Inr", NoArguments)));
    }
    fail();
  }
};
var intSerialize9 = /* @__PURE__ */ intSerialize(genericJointsDouble)(intSerializeSum3);
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
  return memorizeRail(toRail_(intSerialize8)(intSerialize22)({
    name: "doubleTurnout",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => {
      if (v.outerturnout) {
        if (v.innerturnout) {
          return {
            rails: concatArray(arrayMap(grayRail)(rom))(concatArray(arrayMap(grayRail)(rim))(concatArray(arrayMap(blueRail)(ros))(arrayMap(blueRail)(ris)))),
            additionals: []
          };
        }
        return {
          rails: concatArray(arrayMap(grayRail)(rom))(concatArray(arrayMap(grayRail)(ris))(concatArray(arrayMap(blueRail)(ros))(arrayMap(blueRail)(rim)))),
          additionals: []
        };
      }
      if (v.innerturnout) {
        return {
          rails: concatArray(arrayMap(grayRail)(ros))(concatArray(arrayMap(grayRail)(rim))(concatArray(arrayMap(blueRail)(rom))(arrayMap(blueRail)(ris)))),
          additionals: []
        };
      }
      return {
        rails: concatArray(arrayMap(grayRail)(ros))(concatArray(arrayMap(grayRail)(ris))(concatArray(arrayMap(blueRail)(rom))(arrayMap(blueRail)(rim)))),
        additionals: []
      };
    },
    defaultState: { innerturnout: false, outerturnout: false },
    getJoints: serialAll5,
    getStates: serialAll22,
    getOrigin: JointOuterEnter,
    getJointPos: (j) => {
      if (j.tag === "JointOuterEnter") {
        return poe;
      }
      if (j.tag === "JointOuterMain") {
        return pom;
      }
      if (j.tag === "JointOuterSub") {
        return pos;
      }
      if (j.tag === "JointInnerEnter") {
        return pie;
      }
      if (j.tag === "JointInnerMain") {
        return pim;
      }
      if (j.tag === "JointInnerSub") {
        return pis;
      }
      fail();
    },
    getNewState: (j) => (v) => {
      if (j.tag === "JointOuterEnter") {
        if (v.outerturnout) {
          return { newjoint: JointOuterSub, newstate: v, shape: ros };
        }
        return { newjoint: JointOuterMain, newstate: v, shape: rom };
      }
      if (j.tag === "JointOuterMain") {
        if (v.outerturnout) {
          return { newjoint: JointOuterEnter, newstate: { innerturnout: v.innerturnout, outerturnout: false }, shape: reverseShapes(rom) };
        }
        return { newjoint: JointOuterEnter, newstate: { innerturnout: v.innerturnout, outerturnout: false }, shape: reverseShapes(rom) };
      }
      if (j.tag === "JointOuterSub") {
        if (v.outerturnout) {
          return { newjoint: JointOuterEnter, newstate: { innerturnout: v.innerturnout, outerturnout: true }, shape: reverseShapes(ros) };
        }
        return { newjoint: JointOuterEnter, newstate: { innerturnout: v.innerturnout, outerturnout: true }, shape: reverseShapes(ros) };
      }
      if (j.tag === "JointInnerEnter") {
        if (v.innerturnout) {
          return { newjoint: JointInnerSub, newstate: v, shape: ris };
        }
        return { newjoint: JointInnerMain, newstate: v, shape: rim };
      }
      if (j.tag === "JointInnerMain") {
        if (v.innerturnout) {
          return { newjoint: JointInnerEnter, newstate: { innerturnout: false, outerturnout: v.outerturnout }, shape: reverseShapes(rim) };
        }
        return { newjoint: JointInnerEnter, newstate: { innerturnout: false, outerturnout: v.outerturnout }, shape: reverseShapes(rim) };
      }
      if (j.tag === "JointInnerSub") {
        if (v.innerturnout) {
          return { newjoint: JointInnerEnter, newstate: { innerturnout: true, outerturnout: v.outerturnout }, shape: reverseShapes(ris) };
        }
        return { newjoint: JointInnerEnter, newstate: { innerturnout: true, outerturnout: v.outerturnout }, shape: reverseShapes(ris) };
      }
      fail();
    },
    isLegal: (j) => (s) => {
      if (j.tag === "JointOuterEnter") {
        return s.outerturnout || !s.innerturnout;
      }
      if (j.tag === "JointOuterMain") {
        return !s.outerturnout && !s.innerturnout;
      }
      if (j.tag === "JointOuterSub") {
        return s.outerturnout;
      }
      if (j.tag === "JointInnerEnter") {
        return s.outerturnout || !s.innerturnout;
      }
      if (j.tag === "JointInnerMain") {
        return !s.innerturnout;
      }
      if (j.tag === "JointInnerSub") {
        return s.outerturnout && s.innerturnout;
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if (f.tag === "JointOuterEnter") {
        if (t.tag === "JointOuterEnter") {
          return Nothing;
        }
        if (t.tag === "JointOuterMain") {
          return $Maybe("Just", { innerturnout: false, outerturnout: false });
        }
        if (t.tag === "JointOuterSub") {
          return $Maybe("Just", { innerturnout: s.innerturnout, outerturnout: true });
        }
        if (t.tag === "JointInnerEnter") {
          return Nothing;
        }
        if (t.tag === "JointInnerMain") {
          return Nothing;
        }
        if (t.tag === "JointInnerSub") {
          return Nothing;
        }
        fail();
      }
      if (f.tag === "JointOuterMain") {
        if (t.tag === "JointOuterEnter") {
          return $Maybe("Just", { innerturnout: false, outerturnout: false });
        }
        if (t.tag === "JointOuterMain") {
          return Nothing;
        }
        if (t.tag === "JointOuterSub") {
          return Nothing;
        }
        if (t.tag === "JointInnerEnter") {
          return Nothing;
        }
        if (t.tag === "JointInnerMain") {
          return Nothing;
        }
        if (t.tag === "JointInnerSub") {
          return Nothing;
        }
        fail();
      }
      if (f.tag === "JointOuterSub") {
        if (t.tag === "JointOuterEnter") {
          return $Maybe("Just", { innerturnout: s.innerturnout, outerturnout: true });
        }
        if (t.tag === "JointOuterMain") {
          return Nothing;
        }
        if (t.tag === "JointOuterSub") {
          return Nothing;
        }
        if (t.tag === "JointInnerEnter") {
          return Nothing;
        }
        if (t.tag === "JointInnerMain") {
          return Nothing;
        }
        if (t.tag === "JointInnerSub") {
          return Nothing;
        }
        fail();
      }
      if (f.tag === "JointInnerEnter") {
        if (t.tag === "JointOuterEnter") {
          return Nothing;
        }
        if (t.tag === "JointOuterMain") {
          return Nothing;
        }
        if (t.tag === "JointOuterSub") {
          return Nothing;
        }
        if (t.tag === "JointInnerEnter") {
          return Nothing;
        }
        if (t.tag === "JointInnerMain") {
          return $Maybe("Just", { innerturnout: false, outerturnout: s.outerturnout });
        }
        if (t.tag === "JointInnerSub") {
          return $Maybe("Just", { innerturnout: true, outerturnout: true });
        }
        fail();
      }
      if (f.tag === "JointInnerMain") {
        if (t.tag === "JointOuterEnter") {
          return Nothing;
        }
        if (t.tag === "JointOuterMain") {
          return Nothing;
        }
        if (t.tag === "JointOuterSub") {
          return Nothing;
        }
        if (t.tag === "JointInnerEnter") {
          return $Maybe("Just", { innerturnout: false, outerturnout: s.outerturnout });
        }
        if (t.tag === "JointInnerMain") {
          return Nothing;
        }
        if (t.tag === "JointInnerSub") {
          return Nothing;
        }
        fail();
      }
      if (f.tag === "JointInnerSub") {
        if (t.tag === "JointOuterEnter") {
          return Nothing;
        }
        if (t.tag === "JointOuterMain") {
          return Nothing;
        }
        if (t.tag === "JointOuterSub") {
          return Nothing;
        }
        if (t.tag === "JointInnerEnter") {
          return $Maybe("Just", { innerturnout: true, outerturnout: true });
        }
        if (t.tag === "JointInnerMain") {
          return Nothing;
        }
        if (t.tag === "JointInnerSub") {
          return Nothing;
        }
        fail();
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
      if (j.tag === "JointOuterEnter") {
        if (j$p.tag === "JointOuterEnter") {
          return true;
        }
        if (j$p.tag === "JointOuterMain") {
          return true;
        }
        if (j$p.tag === "JointOuterSub") {
          return true;
        }
        if (j$p.tag === "JointInnerEnter") {
          return !s.outerturnout && s.innerturnout;
        }
        if (j$p.tag === "JointInnerMain") {
          return false;
        }
        if (j$p.tag === "JointInnerSub") {
          return !s.outerturnout;
        }
        fail();
      }
      if (j.tag === "JointOuterMain") {
        if (j$p.tag === "JointOuterEnter") {
          return true;
        }
        if (j$p.tag === "JointOuterMain") {
          return true;
        }
        if (j$p.tag === "JointOuterSub") {
          return true;
        }
        if (j$p.tag === "JointInnerEnter") {
          return s.innerturnout;
        }
        if (j$p.tag === "JointInnerMain") {
          return false;
        }
        if (j$p.tag === "JointInnerSub") {
          return true;
        }
        fail();
      }
      if (j.tag === "JointOuterSub") {
        if (j$p.tag === "JointOuterEnter") {
          return true;
        }
        if (j$p.tag === "JointOuterMain") {
          return true;
        }
        if (j$p.tag === "JointOuterSub") {
          return true;
        }
        if (j$p.tag === "JointInnerEnter") {
          return false;
        }
        if (j$p.tag === "JointInnerMain") {
          return false;
        }
        if (j$p.tag === "JointInnerSub") {
          return false;
        }
        fail();
      }
      if (j.tag === "JointInnerEnter") {
        if (j$p.tag === "JointOuterEnter") {
          return !s.outerturnout && s.innerturnout;
        }
        if (j$p.tag === "JointOuterMain") {
          return s.innerturnout;
        }
        if (j$p.tag === "JointOuterSub") {
          return false;
        }
        if (j$p.tag === "JointInnerEnter") {
          return true;
        }
        if (j$p.tag === "JointInnerMain") {
          return true;
        }
        if (j$p.tag === "JointInnerSub") {
          return true;
        }
        fail();
      }
      if (j.tag === "JointInnerMain") {
        if (j$p.tag === "JointOuterEnter") {
          return false;
        }
        if (j$p.tag === "JointOuterMain") {
          return false;
        }
        if (j$p.tag === "JointOuterSub") {
          return false;
        }
        if (j$p.tag === "JointInnerEnter") {
          return true;
        }
        if (j$p.tag === "JointInnerMain") {
          return true;
        }
        if (j$p.tag === "JointInnerSub") {
          return true;
        }
        fail();
      }
      if (j.tag === "JointInnerSub") {
        if (j$p.tag === "JointOuterEnter") {
          return !s.outerturnout;
        }
        if (j$p.tag === "JointOuterMain") {
          return true;
        }
        if (j$p.tag === "JointOuterSub") {
          return false;
        }
        if (j$p.tag === "JointInnerEnter") {
          return true;
        }
        if (j$p.tag === "JointInnerMain") {
          return true;
        }
        if (j$p.tag === "JointInnerSub") {
          return true;
        }
        fail();
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
  return memorizeRail(toRail_(intSerialize6)(intSerialize2)({
    name: "outercurve",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => ({ rails: arrayMap(blueRail)(r0), additionals: [] }),
    defaultState: StateSolid,
    getJoints: serialAll3,
    getStates: serialAll2,
    getOrigin: JointBegin,
    getJointPos: (j) => {
      if (j.tag === "JointBegin") {
        return pb;
      }
      if (j.tag === "JointEnd") {
        return pe;
      }
      fail();
    },
    getNewState: (j) => (s) => {
      if (j.tag === "JointBegin") {
        return { newjoint: JointEnd, newstate: s, shape: r0 };
      }
      if (j.tag === "JointEnd") {
        return { newjoint: JointBegin, newstate: s, shape: reverseShapes(r0) };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if ((() => {
        if (f.tag === "JointBegin") {
          return !(t.tag === "JointBegin");
        }
        if (f.tag === "JointEnd") {
          return !(t.tag === "JointEnd");
        }
        return true;
      })()) {
        return $Maybe("Just", s);
      }
      return Nothing;
    },
    isLegal: (j) => (s) => true,
    lockedBy: (s) => (s$p) => [],
    isBlocked: (j) => (s) => (j$p) => true,
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
      if (s.tag === "StateSP_P") {
        return {
          rails: concatArray(arrayMap(grayRail)(ri))(concatArray(arrayMap(grayRail)(ro))(concatArray(arrayMap(grayRail)(rn))(arrayMap(blueRail)(rp)))),
          additionals: []
        };
      }
      if (s.tag === "StateSP_S") {
        return {
          rails: concatArray(arrayMap(grayRail)(rn))(concatArray(arrayMap(grayRail)(rp))(concatArray(arrayMap(blueRail)(ri))(arrayMap(blueRail)(ro)))),
          additionals: []
        };
      }
      if (s.tag === "StateSP_N") {
        return {
          rails: concatArray(arrayMap(grayRail)(ri))(concatArray(arrayMap(grayRail)(ro))(concatArray(arrayMap(grayRail)(rp))(arrayMap(blueRail)(rn)))),
          additionals: []
        };
      }
      fail();
    },
    defaultState: StateSP_S,
    getJoints: serialAll6,
    getStates: serialAll(intSerialize4),
    getOrigin: JointOuterBegin,
    getJointPos: (j) => {
      if (j.tag === "JointOuterBegin") {
        return pob;
      }
      if (j.tag === "JointOuterEnd") {
        return poe;
      }
      if (j.tag === "JointInnerBegin") {
        return pib;
      }
      if (j.tag === "JointInnerEnd") {
        return pie;
      }
      fail();
    },
    getNewState: (j) => (s) => {
      if (s.tag === "StateSP_P") {
        if (j.tag === "JointInnerBegin") {
          return { newjoint: JointOuterBegin, newstate: StateSP_P, shape: reverseShapes(rp) };
        }
        if (j.tag === "JointInnerEnd") {
          return { newjoint: JointInnerBegin, newstate: StateSP_S, shape: reverseShapes(ri) };
        }
        if (j.tag === "JointOuterBegin") {
          return { newjoint: JointInnerBegin, newstate: StateSP_P, shape: rp };
        }
        if (j.tag === "JointOuterEnd") {
          return { newjoint: JointOuterBegin, newstate: StateSP_S, shape: reverseShapes(ro) };
        }
        fail();
      }
      if (s.tag === "StateSP_S") {
        if (j.tag === "JointInnerBegin") {
          return { newjoint: JointInnerEnd, newstate: StateSP_S, shape: ri };
        }
        if (j.tag === "JointInnerEnd") {
          return { newjoint: JointInnerBegin, newstate: StateSP_S, shape: reverseShapes(ri) };
        }
        if (j.tag === "JointOuterBegin") {
          return { newjoint: JointOuterEnd, newstate: StateSP_S, shape: ro };
        }
        if (j.tag === "JointOuterEnd") {
          return { newjoint: JointOuterBegin, newstate: StateSP_S, shape: reverseShapes(ro) };
        }
        fail();
      }
      if (s.tag === "StateSP_N") {
        if (j.tag === "JointInnerBegin") {
          return { newjoint: JointInnerEnd, newstate: StateSP_S, shape: ri };
        }
        if (j.tag === "JointInnerEnd") {
          return { newjoint: JointOuterEnd, newstate: StateSP_N, shape: rn };
        }
        if (j.tag === "JointOuterBegin") {
          return { newjoint: JointOuterEnd, newstate: StateSP_S, shape: ro };
        }
        if (j.tag === "JointOuterEnd") {
          return { newjoint: JointInnerEnd, newstate: StateSP_N, shape: reverseShapes(rn) };
        }
        fail();
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if (f.tag === "JointInnerBegin") {
        if (t.tag === "JointInnerBegin") {
          return Nothing;
        }
        if (t.tag === "JointInnerEnd") {
          return $Maybe("Just", StateSP_S);
        }
        if (t.tag === "JointOuterBegin") {
          return $Maybe("Just", StateSP_P);
        }
        if (t.tag === "JointOuterEnd") {
          return Nothing;
        }
        fail();
      }
      if (f.tag === "JointInnerEnd") {
        if (t.tag === "JointInnerBegin") {
          return $Maybe("Just", StateSP_S);
        }
        if (t.tag === "JointInnerEnd") {
          return Nothing;
        }
        if (t.tag === "JointOuterBegin") {
          return Nothing;
        }
        if (t.tag === "JointOuterEnd") {
          return $Maybe("Just", StateSP_N);
        }
        fail();
      }
      if (f.tag === "JointOuterBegin") {
        if (t.tag === "JointInnerBegin") {
          return $Maybe("Just", StateSP_P);
        }
        if (t.tag === "JointInnerEnd") {
          return Nothing;
        }
        if (t.tag === "JointOuterBegin") {
          return Nothing;
        }
        if (t.tag === "JointOuterEnd") {
          return $Maybe("Just", StateSP_S);
        }
        fail();
      }
      if (f.tag === "JointOuterEnd") {
        if (t.tag === "JointInnerBegin") {
          return Nothing;
        }
        if (t.tag === "JointInnerEnd") {
          return $Maybe("Just", StateSP_N);
        }
        if (t.tag === "JointOuterBegin") {
          return $Maybe("Just", StateSP_S);
        }
        if (t.tag === "JointOuterEnd") {
          return Nothing;
        }
        fail();
      }
      fail();
    },
    isLegal: (j) => (s) => {
      if (j.tag === "JointInnerBegin") {
        return s.tag === "StateSP_P" || s.tag === "StateSP_S" || !(s.tag === "StateSP_N");
      }
      if (j.tag === "JointInnerEnd") {
        return !(s.tag === "StateSP_P");
      }
      if (j.tag === "JointOuterBegin") {
        return s.tag === "StateSP_P" || s.tag === "StateSP_S" || !(s.tag === "StateSP_N");
      }
      if (j.tag === "JointOuterEnd") {
        return !(s.tag === "StateSP_P");
      }
      fail();
    },
    lockedBy: (s) => (s$p) => {
      if ((() => {
        if (s.tag === "StateSP_P") {
          return s$p.tag === "StateSP_P";
        }
        if (s.tag === "StateSP_S") {
          return s$p.tag === "StateSP_S";
        }
        if (s.tag === "StateSP_N") {
          return s$p.tag === "StateSP_N";
        }
        return false;
      })()) {
        return [];
      }
      return serialAll6;
    },
    isBlocked: (j) => (s) => (j$p) => {
      if (s.tag === "StateSP_P" || !(s.tag === "StateSP_S")) {
        return true;
      }
      if (j$p.tag === "JointInnerBegin") {
        return j.tag === "JointInnerEnd";
      }
      if (j$p.tag === "JointInnerEnd") {
        return j.tag === "JointInnerBegin";
      }
      if (j$p.tag === "JointOuterBegin") {
        return j.tag === "JointOuterEnd";
      }
      if (j$p.tag === "JointOuterEnd") {
        return j.tag === "JointOuterBegin";
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
      if (s.tag === "StateDM_P") {
        return {
          rails: concatArray(arrayMap(grayRail)(rn))(arrayMap(blueRail)(rp)),
          additionals: []
        };
      }
      if (s.tag === "StateDM_N") {
        return {
          rails: concatArray(arrayMap(grayRail)(rp))(arrayMap(blueRail)(rn)),
          additionals: []
        };
      }
      fail();
    },
    defaultState: StateDM_P,
    getJoints: serialAll6,
    getStates: serialAll(intSerialize5),
    getOrigin: JointOuterBegin,
    getJointPos: (j) => {
      if (j.tag === "JointOuterBegin") {
        return pob;
      }
      if (j.tag === "JointOuterEnd") {
        return poe;
      }
      if (j.tag === "JointInnerBegin") {
        return pib;
      }
      if (j.tag === "JointInnerEnd") {
        return pie;
      }
      fail();
    },
    getNewState: (j) => (s) => {
      if (j.tag === "JointInnerBegin") {
        return { newjoint: JointOuterBegin, newstate: StateDM_P, shape: reverseShapes(rp) };
      }
      if (j.tag === "JointInnerEnd") {
        return { newjoint: JointOuterEnd, newstate: StateDM_N, shape: rn };
      }
      if (j.tag === "JointOuterBegin") {
        return { newjoint: JointInnerBegin, newstate: StateDM_P, shape: rp };
      }
      if (j.tag === "JointOuterEnd") {
        return { newjoint: JointInnerEnd, newstate: StateDM_N, shape: reverseShapes(rn) };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if (f.tag === "JointInnerBegin") {
        if (t.tag === "JointInnerBegin") {
          return Nothing;
        }
        if (t.tag === "JointInnerEnd") {
          return Nothing;
        }
        if (t.tag === "JointOuterBegin") {
          return $Maybe("Just", StateDM_P);
        }
        if (t.tag === "JointOuterEnd") {
          return Nothing;
        }
        fail();
      }
      if (f.tag === "JointInnerEnd") {
        if (t.tag === "JointInnerBegin") {
          return Nothing;
        }
        if (t.tag === "JointInnerEnd") {
          return Nothing;
        }
        if (t.tag === "JointOuterBegin") {
          return Nothing;
        }
        if (t.tag === "JointOuterEnd") {
          return $Maybe("Just", StateDM_N);
        }
        fail();
      }
      if (f.tag === "JointOuterBegin") {
        if (t.tag === "JointInnerBegin") {
          return $Maybe("Just", StateDM_P);
        }
        if (t.tag === "JointInnerEnd") {
          return Nothing;
        }
        if (t.tag === "JointOuterBegin") {
          return Nothing;
        }
        if (t.tag === "JointOuterEnd") {
          return Nothing;
        }
        fail();
      }
      if (f.tag === "JointOuterEnd") {
        if (t.tag === "JointInnerBegin") {
          return Nothing;
        }
        if (t.tag === "JointInnerEnd") {
          return $Maybe("Just", StateDM_N);
        }
        if (t.tag === "JointOuterBegin") {
          return Nothing;
        }
        if (t.tag === "JointOuterEnd") {
          return Nothing;
        }
        fail();
      }
      fail();
    },
    isLegal: (j) => (s) => {
      if (j.tag === "JointInnerBegin") {
        return s.tag === "StateDM_P" || !(s.tag === "StateDM_N");
      }
      if (j.tag === "JointInnerEnd") {
        return !(s.tag === "StateDM_P");
      }
      if (j.tag === "JointOuterBegin") {
        return s.tag === "StateDM_P" || !(s.tag === "StateDM_N");
      }
      if (j.tag === "JointOuterEnd") {
        return !(s.tag === "StateDM_P");
      }
      fail();
    },
    lockedBy: (s) => (s$p) => {
      if ((() => {
        if (s.tag === "StateDM_P") {
          return s$p.tag === "StateDM_P";
        }
        if (s.tag === "StateDM_N") {
          return s$p.tag === "StateDM_N";
        }
        return false;
      })()) {
        return [];
      }
      return serialAll6;
    },
    isBlocked: (j) => (s) => (j$p) => true,
    isSimple: true
  }));
})();
var curveLRail = /* @__PURE__ */ (() => {
  const pe = { coord: { x: sqrt(0.5), y: 1 - sqrt(0.5), z: 0 }, angle: toNumber(1) * 6.283185307179586 / toNumber(8), isPlus: true };
  const pb = { coord: { x: 0, y: 0, z: 0 }, angle: toNumber(4) * 6.283185307179586 / toNumber(8), isPlus: false };
  const r0 = [{ start: pb, end: pe, length: partLength(pb)(pe) }];
  return memorizeRail(toRail_(intSerialize6)(intSerialize2)({
    name: "curve",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => ({ rails: arrayMap(blueRail)(r0), additionals: [] }),
    defaultState: StateSolid,
    getJoints: serialAll3,
    getStates: serialAll2,
    getOrigin: JointBegin,
    getJointPos: (j) => {
      if (j.tag === "JointBegin") {
        return pb;
      }
      if (j.tag === "JointEnd") {
        return pe;
      }
      fail();
    },
    getNewState: (j) => (s) => {
      if (j.tag === "JointBegin") {
        return { newjoint: JointEnd, newstate: s, shape: r0 };
      }
      if (j.tag === "JointEnd") {
        return { newjoint: JointBegin, newstate: s, shape: reverseShapes(r0) };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if ((() => {
        if (f.tag === "JointBegin") {
          return !(t.tag === "JointBegin");
        }
        if (f.tag === "JointEnd") {
          return !(t.tag === "JointEnd");
        }
        return true;
      })()) {
        return $Maybe("Just", s);
      }
      return Nothing;
    },
    isLegal: (j) => (s) => true,
    lockedBy: (s) => (s$p) => [],
    isBlocked: (j) => (s) => (j$p) => true,
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
  return memorizeRail(toRail_(intSerialize9)(intSerialize22)({
    name: "crossover",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => {
      if (v.outerturnout) {
        if (v.innerturnout) {
          return {
            rails: concatArray(arrayMap(grayRail)(ri))(concatArray(arrayMap(grayRail)(ro))(arrayMap(blueRail)(rn))),
            additionals: []
          };
        }
        return {
          rails: concatArray(arrayMap(grayRail)(ro))(concatArray(arrayMap(blueRail)(ri))(arrayMap(blueRail)(rn))),
          additionals: []
        };
      }
      if (v.innerturnout) {
        return {
          rails: concatArray(arrayMap(grayRail)(ri))(concatArray(arrayMap(blueRail)(ro))(arrayMap(blueRail)(rn))),
          additionals: []
        };
      }
      return {
        rails: concatArray(arrayMap(grayRail)(rn))(concatArray(arrayMap(blueRail)(ri))(arrayMap(blueRail)(ro))),
        additionals: []
      };
    },
    defaultState: { innerturnout: false, outerturnout: false },
    getJoints: serialAll6,
    getStates: serialAll22,
    getOrigin: JointOuterBegin,
    getJointPos: (j) => {
      if (j.tag === "JointOuterBegin") {
        return pob;
      }
      if (j.tag === "JointOuterEnd") {
        return poe;
      }
      if (j.tag === "JointInnerBegin") {
        return pib;
      }
      if (j.tag === "JointInnerEnd") {
        return pie;
      }
      fail();
    },
    getNewState: (j) => (v) => {
      if (v.outerturnout) {
        if (v.innerturnout) {
          if (j.tag === "JointInnerBegin") {
            return { newjoint: JointInnerEnd, newstate: { innerturnout: false, outerturnout: v.outerturnout }, shape: ri };
          }
          if (j.tag === "JointInnerEnd") {
            return { newjoint: JointOuterEnd, newstate: v, shape: rn };
          }
          if (j.tag === "JointOuterBegin") {
            return { newjoint: JointOuterEnd, newstate: { innerturnout: v.innerturnout, outerturnout: false }, shape: ro };
          }
          if (j.tag === "JointOuterEnd") {
            return { newjoint: JointInnerEnd, newstate: v, shape: reverseShapes(rn) };
          }
          fail();
        }
        if (j.tag === "JointInnerBegin") {
          return { newjoint: JointInnerEnd, newstate: v, shape: ri };
        }
        if (j.tag === "JointInnerEnd") {
          return { newjoint: JointInnerBegin, newstate: v, shape: reverseShapes(ri) };
        }
        if (j.tag === "JointOuterBegin") {
          return { newjoint: JointOuterEnd, newstate: { innerturnout: v.innerturnout, outerturnout: false }, shape: ro };
        }
        if (j.tag === "JointOuterEnd") {
          return { newjoint: JointInnerEnd, newstate: { innerturnout: true, outerturnout: v.outerturnout }, shape: reverseShapes(rn) };
        }
        fail();
      }
      if (v.innerturnout) {
        if (j.tag === "JointInnerBegin") {
          return { newjoint: JointInnerEnd, newstate: { innerturnout: false, outerturnout: v.outerturnout }, shape: ri };
        }
        if (j.tag === "JointInnerEnd") {
          return { newjoint: JointOuterEnd, newstate: { innerturnout: v.innerturnout, outerturnout: true }, shape: rn };
        }
        if (j.tag === "JointOuterBegin") {
          return { newjoint: JointOuterEnd, newstate: v, shape: ro };
        }
        if (j.tag === "JointOuterEnd") {
          return { newjoint: JointOuterBegin, newstate: v, shape: reverseShapes(ro) };
        }
        fail();
      }
      if (j.tag === "JointInnerBegin") {
        return { newjoint: JointInnerEnd, newstate: v, shape: ri };
      }
      if (j.tag === "JointInnerEnd") {
        return { newjoint: JointInnerBegin, newstate: v, shape: reverseShapes(ri) };
      }
      if (j.tag === "JointOuterBegin") {
        return { newjoint: JointOuterEnd, newstate: v, shape: ro };
      }
      if (j.tag === "JointOuterEnd") {
        return { newjoint: JointOuterBegin, newstate: v, shape: reverseShapes(ro) };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if (f.tag === "JointInnerBegin") {
        if (t.tag === "JointInnerBegin") {
          return Nothing;
        }
        if (t.tag === "JointInnerEnd") {
          return $Maybe("Just", { innerturnout: false, outerturnout: false });
        }
        if (t.tag === "JointOuterBegin") {
          return Nothing;
        }
        if (t.tag === "JointOuterEnd") {
          return Nothing;
        }
        fail();
      }
      if (f.tag === "JointInnerEnd") {
        if (t.tag === "JointInnerBegin") {
          return $Maybe("Just", { innerturnout: false, outerturnout: false });
        }
        if (t.tag === "JointInnerEnd") {
          return Nothing;
        }
        if (t.tag === "JointOuterBegin") {
          return Nothing;
        }
        if (t.tag === "JointOuterEnd") {
          return $Maybe("Just", { innerturnout: true, outerturnout: true });
        }
        fail();
      }
      if (f.tag === "JointOuterBegin") {
        if (t.tag === "JointInnerBegin") {
          return Nothing;
        }
        if (t.tag === "JointInnerEnd") {
          return Nothing;
        }
        if (t.tag === "JointOuterBegin") {
          return Nothing;
        }
        if (t.tag === "JointOuterEnd") {
          return $Maybe("Just", { innerturnout: false, outerturnout: false });
        }
        fail();
      }
      if (f.tag === "JointOuterEnd") {
        if (t.tag === "JointInnerBegin") {
          return Nothing;
        }
        if (t.tag === "JointInnerEnd") {
          return $Maybe("Just", { innerturnout: true, outerturnout: true });
        }
        if (t.tag === "JointOuterBegin") {
          return $Maybe("Just", { innerturnout: false, outerturnout: false });
        }
        if (t.tag === "JointOuterEnd") {
          return Nothing;
        }
        fail();
      }
      fail();
    },
    isLegal: (j) => (s) => {
      if (j.tag === "JointInnerBegin") {
        return !s.innerturnout && !s.outerturnout;
      }
      if (j.tag === "JointInnerEnd") {
        return s.innerturnout === s.outerturnout;
      }
      if (j.tag === "JointOuterBegin") {
        return !s.innerturnout && !s.outerturnout;
      }
      if (j.tag === "JointOuterEnd") {
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
      if (j$p.tag === "JointInnerBegin") {
        return j.tag === "JointInnerEnd";
      }
      if (j$p.tag === "JointInnerEnd") {
        return j.tag === "JointInnerBegin";
      }
      if (j$p.tag === "JointOuterBegin") {
        return j.tag === "JointOuterEnd";
      }
      if (j$p.tag === "JointOuterEnd") {
        return j.tag === "JointOuterBegin";
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
  return memorizeRail(toRail_(intSerialize6)(intSerialize2)({
    name: "converter",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => ({ rails: arrayMap(blueRail)(r0), additionals: [] }),
    defaultState: StateSolid,
    getJoints: serialAll3,
    getStates: serialAll2,
    getOrigin: JointBegin,
    getJointPos: (j) => {
      if (j.tag === "JointBegin") {
        return pb;
      }
      if (j.tag === "JointEnd") {
        return pe;
      }
      fail();
    },
    getNewState: (j) => (s) => {
      if (j.tag === "JointBegin") {
        return { newjoint: JointEnd, newstate: s, shape: r0 };
      }
      if (j.tag === "JointEnd") {
        return { newjoint: JointBegin, newstate: s, shape: reverseShapes(r0) };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if ((() => {
        if (f.tag === "JointBegin") {
          return !(t.tag === "JointBegin");
        }
        if (f.tag === "JointEnd") {
          return !(t.tag === "JointEnd");
        }
        return true;
      })()) {
        return $Maybe("Just", s);
      }
      return Nothing;
    },
    isLegal: (j) => (s) => true,
    lockedBy: (s) => (s$p) => [],
    isBlocked: (j) => (s) => (j$p) => true,
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
  return memorizeRail(toRail_(intSerialize9)(intSerialize22)({
    name: "doubletowide",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => {
      if (v.outerturnout) {
        if (v.innerturnout) {
          return {
            rails: concatArray(arrayMap(grayRail)(ri))(concatArray(arrayMap(grayRail)(ro))(arrayMap(blueRail)(rn))),
            additionals: []
          };
        }
        return {
          rails: concatArray(arrayMap(grayRail)(ro))(concatArray(arrayMap(blueRail)(ri))(arrayMap(blueRail)(rn))),
          additionals: []
        };
      }
      if (v.innerturnout) {
        return {
          rails: concatArray(arrayMap(grayRail)(ri))(concatArray(arrayMap(blueRail)(ro))(arrayMap(blueRail)(rn))),
          additionals: []
        };
      }
      return {
        rails: concatArray(arrayMap(grayRail)(rn))(concatArray(arrayMap(blueRail)(ri))(arrayMap(blueRail)(ro))),
        additionals: []
      };
    },
    defaultState: { innerturnout: false, outerturnout: false },
    getJoints: serialAll6,
    getStates: serialAll22,
    getOrigin: JointOuterBegin,
    getJointPos: (j) => {
      if (j.tag === "JointOuterBegin") {
        return pob;
      }
      if (j.tag === "JointOuterEnd") {
        return poe;
      }
      if (j.tag === "JointInnerBegin") {
        return pib;
      }
      if (j.tag === "JointInnerEnd") {
        return pie;
      }
      fail();
    },
    getNewState: (j) => (v) => {
      if (v.outerturnout) {
        if (v.innerturnout) {
          if (j.tag === "JointInnerBegin") {
            return { newjoint: JointInnerEnd, newstate: { innerturnout: false, outerturnout: v.outerturnout }, shape: ri };
          }
          if (j.tag === "JointInnerEnd") {
            return { newjoint: JointOuterEnd, newstate: v, shape: rn };
          }
          if (j.tag === "JointOuterBegin") {
            return { newjoint: JointOuterEnd, newstate: { innerturnout: v.innerturnout, outerturnout: false }, shape: ro };
          }
          if (j.tag === "JointOuterEnd") {
            return { newjoint: JointInnerEnd, newstate: v, shape: reverseShapes(rn) };
          }
          fail();
        }
        if (j.tag === "JointInnerBegin") {
          return { newjoint: JointInnerEnd, newstate: v, shape: ri };
        }
        if (j.tag === "JointInnerEnd") {
          return { newjoint: JointInnerBegin, newstate: v, shape: reverseShapes(ri) };
        }
        if (j.tag === "JointOuterBegin") {
          return { newjoint: JointOuterEnd, newstate: { innerturnout: v.innerturnout, outerturnout: false }, shape: ro };
        }
        if (j.tag === "JointOuterEnd") {
          return { newjoint: JointInnerEnd, newstate: { innerturnout: true, outerturnout: v.outerturnout }, shape: reverseShapes(rn) };
        }
        fail();
      }
      if (v.innerturnout) {
        if (j.tag === "JointInnerBegin") {
          return { newjoint: JointInnerEnd, newstate: { innerturnout: false, outerturnout: v.outerturnout }, shape: ri };
        }
        if (j.tag === "JointInnerEnd") {
          return { newjoint: JointOuterEnd, newstate: { innerturnout: v.innerturnout, outerturnout: true }, shape: rn };
        }
        if (j.tag === "JointOuterBegin") {
          return { newjoint: JointOuterEnd, newstate: v, shape: ro };
        }
        if (j.tag === "JointOuterEnd") {
          return { newjoint: JointOuterBegin, newstate: v, shape: reverseShapes(ro) };
        }
        fail();
      }
      if (j.tag === "JointInnerBegin") {
        return { newjoint: JointInnerEnd, newstate: v, shape: ri };
      }
      if (j.tag === "JointInnerEnd") {
        return { newjoint: JointInnerBegin, newstate: v, shape: reverseShapes(ri) };
      }
      if (j.tag === "JointOuterBegin") {
        return { newjoint: JointOuterEnd, newstate: v, shape: ro };
      }
      if (j.tag === "JointOuterEnd") {
        return { newjoint: JointOuterBegin, newstate: v, shape: reverseShapes(ro) };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if (f.tag === "JointInnerBegin") {
        if (t.tag === "JointInnerBegin") {
          return Nothing;
        }
        if (t.tag === "JointInnerEnd") {
          return $Maybe("Just", { innerturnout: false, outerturnout: false });
        }
        if (t.tag === "JointOuterBegin") {
          return Nothing;
        }
        if (t.tag === "JointOuterEnd") {
          return Nothing;
        }
        fail();
      }
      if (f.tag === "JointInnerEnd") {
        if (t.tag === "JointInnerBegin") {
          return $Maybe("Just", { innerturnout: false, outerturnout: false });
        }
        if (t.tag === "JointInnerEnd") {
          return Nothing;
        }
        if (t.tag === "JointOuterBegin") {
          return Nothing;
        }
        if (t.tag === "JointOuterEnd") {
          return $Maybe("Just", { innerturnout: true, outerturnout: true });
        }
        fail();
      }
      if (f.tag === "JointOuterBegin") {
        if (t.tag === "JointInnerBegin") {
          return Nothing;
        }
        if (t.tag === "JointInnerEnd") {
          return Nothing;
        }
        if (t.tag === "JointOuterBegin") {
          return Nothing;
        }
        if (t.tag === "JointOuterEnd") {
          return $Maybe("Just", { innerturnout: false, outerturnout: false });
        }
        fail();
      }
      if (f.tag === "JointOuterEnd") {
        if (t.tag === "JointInnerBegin") {
          return Nothing;
        }
        if (t.tag === "JointInnerEnd") {
          return $Maybe("Just", { innerturnout: true, outerturnout: true });
        }
        if (t.tag === "JointOuterBegin") {
          return $Maybe("Just", { innerturnout: false, outerturnout: false });
        }
        if (t.tag === "JointOuterEnd") {
          return Nothing;
        }
        fail();
      }
      fail();
    },
    isLegal: (j) => (s) => {
      if (j.tag === "JointInnerBegin") {
        return !s.innerturnout && !s.outerturnout;
      }
      if (j.tag === "JointInnerEnd") {
        return s.innerturnout === s.outerturnout;
      }
      if (j.tag === "JointOuterBegin") {
        return !s.innerturnout && !s.outerturnout;
      }
      if (j.tag === "JointOuterEnd") {
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
      if (j$p.tag === "JointInnerBegin") {
        return j.tag === "JointInnerEnd";
      }
      if (j$p.tag === "JointInnerEnd") {
        return j.tag === "JointInnerBegin";
      }
      if (j$p.tag === "JointOuterBegin") {
        return j.tag === "JointOuterEnd";
      }
      if (j$p.tag === "JointOuterEnd") {
        return j.tag === "JointOuterBegin";
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
  return memorizeRail(toRail_(intSerialize6)(intSerialize2)({
    name: "doublewidths",
    flipped: false,
    opposed: false,
    getDrawInfo: (v) => ({ rails: arrayMap(blueRail)(r1), additionals: [] }),
    defaultState: StateSolid,
    getJoints: serialAll3,
    getStates: serialAll2,
    getOrigin: JointBegin,
    getJointPos: (j) => {
      if (j.tag === "JointBegin") {
        return pe;
      }
      if (j.tag === "JointEnd") {
        return ps;
      }
      fail();
    },
    getNewState: (j) => (s) => {
      if (j.tag === "JointEnd") {
        return { newjoint: JointBegin, newstate: s, shape: reverseShapes(r1) };
      }
      if (j.tag === "JointBegin") {
        return { newjoint: JointEnd, newstate: s, shape: r1 };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if (f.tag === "JointBegin") {
        if (t.tag === "JointBegin") {
          return Nothing;
        }
        if (t.tag === "JointEnd") {
          return $Maybe("Just", s);
        }
        fail();
      }
      if (f.tag === "JointEnd") {
        if (t.tag === "JointBegin") {
          return $Maybe("Just", s);
        }
        if (t.tag === "JointEnd") {
          return Nothing;
        }
        fail();
      }
      fail();
    },
    isLegal: (j) => (s) => true,
    lockedBy: (s) => (s$p) => [],
    isBlocked: (j) => (s) => (j$p) => true,
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
          rails: arrayBind([arrayMap(grayRail)(r0), arrayMap(blueRail)(r1)])(identity),
          additionals: []
        };
      }
      return {
        rails: arrayBind([arrayMap(grayRail)(r1), arrayMap(blueRail)(r0)])(identity),
        additionals: []
      };
    },
    defaultState: { turnout: false },
    getJoints: serialAll4,
    getStates: serialAll1,
    getOrigin: JointEnter,
    getJointPos: (j) => {
      if (j.tag === "JointEnter") {
        return pe;
      }
      if (j.tag === "JointMain") {
        return pm;
      }
      if (j.tag === "JointSub") {
        return ps;
      }
      fail();
    },
    getNewState: (j) => (v) => {
      if (j.tag === "JointMain") {
        return { newjoint: JointEnter, newstate: { turnout: false }, shape: reverseShapes(r0) };
      }
      if (j.tag === "JointSub") {
        return { newjoint: JointEnter, newstate: { turnout: true }, shape: reverseShapes(r1) };
      }
      if (j.tag === "JointEnter") {
        if (v.turnout) {
          return { newjoint: JointSub, newstate: v, shape: r1 };
        }
        return { newjoint: JointMain, newstate: v, shape: r0 };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if (f.tag === "JointEnter") {
        if (t.tag === "JointEnter") {
          return Nothing;
        }
        if (t.tag === "JointMain") {
          return $Maybe("Just", { turnout: false });
        }
        if (t.tag === "JointSub") {
          return $Maybe("Just", { turnout: true });
        }
        fail();
      }
      if (f.tag === "JointMain") {
        if (t.tag === "JointEnter") {
          return $Maybe("Just", { turnout: false });
        }
        if (t.tag === "JointMain") {
          return Nothing;
        }
        if (t.tag === "JointSub") {
          return Nothing;
        }
        fail();
      }
      if (f.tag === "JointSub") {
        if (t.tag === "JointEnter") {
          return $Maybe("Just", { turnout: true });
        }
        if (t.tag === "JointMain") {
          return Nothing;
        }
        if (t.tag === "JointSub") {
          return Nothing;
        }
        fail();
      }
      fail();
    },
    isLegal: (j) => (s) => {
      if (j.tag === "JointEnter") {
        return true;
      }
      if (j.tag === "JointMain") {
        return !s.turnout;
      }
      if (j.tag === "JointSub") {
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
    isBlocked: (j) => (s) => (j$p) => true,
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
              arrayMap((s1) => ({ color: "#33a", shape: s1 }))(r0),
              arrayMap(blueRail)(r_),
              arrayMap(blueRail)(r1)
            ])(identity),
            additionals: []
          };
        }
        return {
          rails: arrayBind([
            arrayMap((s1) => ({ color: "#33a", shape: s1 }))(r1),
            arrayMap(blueRail)(r_),
            arrayMap(blueRail)(r0)
          ])(identity),
          additionals: []
        };
      }
      if (v.turnout) {
        return {
          rails: arrayBind([
            arrayMap((s1) => ({ color: "#866", shape: s1 }))(r0),
            arrayMap(blueRail)(r_),
            arrayMap(blueRail)(r1)
          ])(identity),
          additionals: []
        };
      }
      return {
        rails: arrayBind([
          arrayMap((s1) => ({ color: "#866", shape: s1 }))(r1),
          arrayMap(blueRail)(r_),
          arrayMap(blueRail)(r0)
        ])(identity),
        additionals: []
      };
    },
    defaultState: { turnout: false, auto: true },
    getJoints: serialAll4,
    getStates: serialAll(intSerialize3),
    getOrigin: JointEnter,
    getJointPos: (j) => {
      if (j.tag === "JointEnter") {
        return pe;
      }
      if (j.tag === "JointMain") {
        return pm;
      }
      if (j.tag === "JointSub") {
        return ps;
      }
      fail();
    },
    getNewState: (j) => (v) => {
      if (j.tag === "JointMain") {
        return { newjoint: JointEnter, newstate: v, shape: reverseShapes(concatArray(r_)(r0)) };
      }
      if (j.tag === "JointSub") {
        return { newjoint: JointEnter, newstate: v, shape: reverseShapes(concatArray(r_)(r1)) };
      }
      if (j.tag === "JointEnter") {
        if (v.auto) {
          if (v.turnout) {
            return { newjoint: JointMain, newstate: { turnout: false, auto: true }, shape: concatArray(r_)(r0) };
          }
          return { newjoint: JointSub, newstate: { turnout: true, auto: true }, shape: concatArray(r_)(r1) };
        }
        if (v.turnout) {
          return { newjoint: JointSub, newstate: v, shape: concatArray(r_)(r1) };
        }
        return { newjoint: JointMain, newstate: v, shape: concatArray(r_)(r0) };
      }
      fail();
    },
    getRoute: (s) => (f) => (t) => {
      if (f.tag === "JointEnter") {
        if (t.tag === "JointEnter") {
          return Nothing;
        }
        if (t.tag === "JointMain") {
          return $Maybe("Just", { turnout: false, auto: false });
        }
        if (t.tag === "JointSub") {
          return $Maybe("Just", { turnout: true, auto: false });
        }
        fail();
      }
      if (f.tag === "JointMain") {
        if (t.tag === "JointEnter") {
          return $Maybe("Just", { turnout: false, auto: false });
        }
        if (t.tag === "JointMain") {
          return Nothing;
        }
        if (t.tag === "JointSub") {
          return Nothing;
        }
        fail();
      }
      if (f.tag === "JointSub") {
        if (t.tag === "JointEnter") {
          return $Maybe("Just", { turnout: true, auto: false });
        }
        if (t.tag === "JointMain") {
          return Nothing;
        }
        if (t.tag === "JointSub") {
          return Nothing;
        }
        fail();
      }
      fail();
    },
    isLegal: (j) => (s) => {
      if (j.tag === "JointEnter") {
        return true;
      }
      if (j.tag === "JointMain") {
        return !s.turnout;
      }
      if (j.tag === "JointSub") {
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
    isBlocked: (j) => (s) => (j$p) => true,
    isSimple: false
  }));
})();
var autoTurnOutRPlusRail = /* @__PURE__ */ memorizeRail(/* @__PURE__ */ flipRail_(autoTurnOutLPlusRail));

// output-es/Internal.JSON/index.js
var identity6 = (x) => x;
var max3 = (x) => (y) => {
  const v = ordInt.compare(x)(y);
  if (v.tag === "LT") {
    return y;
  }
  if (v.tag === "EQ") {
    return x;
  }
  if (v.tag === "GT") {
    return x;
  }
  fail();
};
var readNumber = /* @__PURE__ */ unsafeReadTagged(monadIdentity)("Number");
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
  diamondRail
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
    return "u " + source(rule._1) + " " + source(rule._2) + (rule._4 === "" ? " " + rule._3 : " " + rule._3 + " " + rule._4);
  }
  if (rule.tag === "RuleStop") {
    return "s " + source(rule._1) + (rule._2 === "" ? "" : " " + rule._2);
  }
  if (rule.tag === "RuleStopOpen") {
    return "O " + source(rule._1) + " " + showIntImpl(rule._2) + (rule._3 === "" ? "" : " " + rule._3);
  }
  if (rule.tag === "RuleStopUpdate") {
    return "U " + source(rule._1) + " " + source(rule._2) + (rule._4 === "" ? " " + rule._3 : " " + rule._3 + " " + rule._4);
  }
  if (rule.tag === "RuleReverse") {
    return "r " + source(rule._1) + (rule._2 === "" ? "" : " " + rule._2);
  }
  if (rule.tag === "RuleReverseUpdate") {
    return "R " + source(rule._1) + " " + source(rule._2) + (rule._4 === "" ? " " + rule._3 : " " + rule._3 + " " + rule._4);
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
  note: v.note
});
var encodeLayout = (v) => ({
  rails: arrayMap(encodeRailNode)(v.rails),
  trains: arrayMap(encodeTrainset)(v.trains),
  time: v.time,
  speed: v.speed,
  version: v.version,
  routequeue: v.routequeue,
  activeReserves: v.activeReserves
});
var defaultnode = /* @__PURE__ */ (() => ({
  nodeid: 0,
  instanceid: 0,
  state: 0,
  rail: straightRail,
  connections: [],
  signals: [],
  invalidRoutes: [],
  reserves: [],
  drawinfos: [],
  pos: { coord: poszero.coord, angle: 3.141592653589793, isPlus: false },
  note: ""
}))();
var defaultLayout = /* @__PURE__ */ (() => foldlArray((l$p) => (j) => addJoint(l$p)(straightRail.getJointPos(j))(0)(j))({
  instancecount: 1,
  traincount: 0,
  updatecount: 0,
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
var decodeTrainRoute = (rs) => (v) => ({
  nodeid: v.nodeid,
  jointid: v.jointid,
  railinstance: (() => {
    const $0 = index(rs)(v.railinstance);
    if ($0.tag === "Nothing") {
      return defaultnode;
    }
    if ($0.tag === "Just") {
      return $0._1;
    }
    fail();
  })(),
  shapes: v.shapes,
  length: v.length
});
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
  const v = index(spl)(0);
  const $0 = (() => {
    if (v.tag === "Just") {
      if (v._1 === "c") {
        return $Maybe(
          "Just",
          $SignalRule("RuleComplex", replace2(unsafeRegex("^\\s*.")(noFlags))("")(rule))
        );
      }
      if (v._1 === "m") {
        return applyMaybe.apply(applyMaybe.apply((() => {
          const $02 = index(spl)(1);
          if ($02.tag === "Just") {
            const $1 = regex($02._1)(noFlags);
            if ($1.tag === "Left") {
              return Nothing;
            }
            if ($1.tag === "Right") {
              return $Maybe("Just", RuleSpeed($1._1));
            }
            fail();
          }
          if ($02.tag === "Nothing") {
            return Nothing;
          }
          fail();
        })())((() => {
          const $02 = index(spl)(2);
          if ($02.tag === "Just") {
            return fromString($02._1);
          }
          if ($02.tag === "Nothing") {
            return Nothing;
          }
          fail();
        })()))($Maybe(
          "Just",
          replace2(unsafeRegex("^\\s*.\\s+\\S*\\s+\\S*")(noFlags))("")(rule)
        ));
      }
      if (v._1 === "o") {
        return applyMaybe.apply(applyMaybe.apply((() => {
          const $02 = index(spl)(1);
          if ($02.tag === "Just") {
            const $1 = regex($02._1)(noFlags);
            if ($1.tag === "Left") {
              return Nothing;
            }
            if ($1.tag === "Right") {
              return $Maybe("Just", RuleOpen($1._1));
            }
            fail();
          }
          if ($02.tag === "Nothing") {
            return Nothing;
          }
          fail();
        })())((() => {
          const $02 = index(spl)(2);
          if ($02.tag === "Just") {
            return fromString($02._1);
          }
          if ($02.tag === "Nothing") {
            return Nothing;
          }
          fail();
        })()))($Maybe(
          "Just",
          replace2(unsafeRegex("^\\s*.\\s+\\S*\\s+\\S*")(noFlags))("")(rule)
        ));
      }
      if (v._1 === "u") {
        return applyMaybe.apply(applyMaybe.apply(applyMaybe.apply((() => {
          const $02 = index(spl)(1);
          if ($02.tag === "Just") {
            const $1 = regex($02._1)(noFlags);
            if ($1.tag === "Left") {
              return Nothing;
            }
            if ($1.tag === "Right") {
              return $Maybe("Just", RuleUpdate($1._1));
            }
            fail();
          }
          if ($02.tag === "Nothing") {
            return Nothing;
          }
          fail();
        })())((() => {
          const $02 = index(spl)(2);
          if ($02.tag === "Just") {
            const $1 = regex($02._1)(noFlags);
            if ($1.tag === "Left") {
              return Nothing;
            }
            if ($1.tag === "Right") {
              return $Maybe("Just", $1._1);
            }
            fail();
          }
          if ($02.tag === "Nothing") {
            return Nothing;
          }
          fail();
        })()))(index(spl)(3)))($Maybe(
          "Just",
          replace2(unsafeRegex("^\\s*.\\s+\\S*\\s+\\S*\\s+\\S*")(noFlags))("")(rule)
        ));
      }
      if (v._1 === "s") {
        return applyMaybe.apply((() => {
          const $02 = index(spl)(1);
          if ($02.tag === "Just") {
            const $1 = regex($02._1)(noFlags);
            if ($1.tag === "Left") {
              return Nothing;
            }
            if ($1.tag === "Right") {
              return $Maybe("Just", RuleStop($1._1));
            }
            fail();
          }
          if ($02.tag === "Nothing") {
            return Nothing;
          }
          fail();
        })())($Maybe("Just", replace2(unsafeRegex("^\\s*.\\s+\\S*")(noFlags))("")(rule)));
      }
      if (v._1 === "O") {
        return applyMaybe.apply(applyMaybe.apply((() => {
          const $02 = index(spl)(1);
          if ($02.tag === "Just") {
            const $1 = regex($02._1)(noFlags);
            if ($1.tag === "Left") {
              return Nothing;
            }
            if ($1.tag === "Right") {
              return $Maybe("Just", RuleStopOpen($1._1));
            }
            fail();
          }
          if ($02.tag === "Nothing") {
            return Nothing;
          }
          fail();
        })())((() => {
          const $02 = index(spl)(2);
          if ($02.tag === "Just") {
            return fromString($02._1);
          }
          if ($02.tag === "Nothing") {
            return Nothing;
          }
          fail();
        })()))($Maybe(
          "Just",
          replace2(unsafeRegex("^\\s*.\\s+\\S*\\s+\\S*")(noFlags))("")(rule)
        ));
      }
      if (v._1 === "U") {
        return applyMaybe.apply(applyMaybe.apply(applyMaybe.apply((() => {
          const $02 = index(spl)(1);
          if ($02.tag === "Just") {
            const $1 = regex($02._1)(noFlags);
            if ($1.tag === "Left") {
              return Nothing;
            }
            if ($1.tag === "Right") {
              return $Maybe("Just", RuleStopUpdate($1._1));
            }
            fail();
          }
          if ($02.tag === "Nothing") {
            return Nothing;
          }
          fail();
        })())((() => {
          const $02 = index(spl)(2);
          if ($02.tag === "Just") {
            const $1 = regex($02._1)(noFlags);
            if ($1.tag === "Left") {
              return Nothing;
            }
            if ($1.tag === "Right") {
              return $Maybe("Just", $1._1);
            }
            fail();
          }
          if ($02.tag === "Nothing") {
            return Nothing;
          }
          fail();
        })()))(index(spl)(3)))($Maybe(
          "Just",
          replace2(unsafeRegex("^\\s*.\\s+\\S*\\s+\\S*\\s+\\S*")(noFlags))("")(rule)
        ));
      }
      if (v._1 === "r") {
        return applyMaybe.apply((() => {
          const $02 = index(spl)(1);
          if ($02.tag === "Just") {
            const $1 = regex($02._1)(noFlags);
            if ($1.tag === "Left") {
              return Nothing;
            }
            if ($1.tag === "Right") {
              return $Maybe("Just", RuleReverse($1._1));
            }
            fail();
          }
          if ($02.tag === "Nothing") {
            return Nothing;
          }
          fail();
        })())($Maybe("Just", replace2(unsafeRegex("^\\s*.\\s+\\S*")(noFlags))("")(rule)));
      }
      if (v._1 === "R") {
        return applyMaybe.apply(applyMaybe.apply(applyMaybe.apply((() => {
          const $02 = index(spl)(1);
          if ($02.tag === "Just") {
            const $1 = regex($02._1)(noFlags);
            if ($1.tag === "Left") {
              return Nothing;
            }
            if ($1.tag === "Right") {
              return $Maybe("Just", RuleReverseUpdate($1._1));
            }
            fail();
          }
          if ($02.tag === "Nothing") {
            return Nothing;
          }
          fail();
        })())((() => {
          const $02 = index(spl)(2);
          if ($02.tag === "Just") {
            const $1 = regex($02._1)(noFlags);
            if ($1.tag === "Left") {
              return Nothing;
            }
            if ($1.tag === "Right") {
              return $Maybe("Just", $1._1);
            }
            fail();
          }
          if ($02.tag === "Nothing") {
            return Nothing;
          }
          fail();
        })()))(index(spl)(3)))($Maybe(
          "Just",
          replace2(unsafeRegex("^\\s*.\\s+\\S*\\s+\\S*\\s+\\S*")(noFlags))("")(rule)
        ));
      }
      return Nothing;
    }
    return Nothing;
  })();
  if ($0.tag === "Nothing") {
    return $SignalRule("RuleComment", rule);
  }
  if ($0.tag === "Just") {
    return $0._1;
  }
  fail();
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
  const $3 = findIndex((v1) => v1.name === $0)(rails);
  if ($3.tag === "Just") {
    return $Maybe("Just", $2($1(rails[$3._1])));
  }
  return Nothing;
};
var decodeRailNode = (v) => {
  const $0 = decodeRail(v.rail);
  if ($0.tag === "Just") {
    return $Maybe(
      "Just",
      recalcInstanceDrawInfo({
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
        drawinfos: []
      })
    );
  }
  return Nothing;
};
var decodeRailNode_v1 = (v) => {
  const $0 = decodeRail(v.rail);
  if ($0.tag === "Just") {
    return $Maybe(
      "Just",
      recalcInstanceDrawInfo({
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
        note: isUndefined(v.note) || isNull(v.note) ? "" : v.note
      })
    );
  }
  return Nothing;
};
var decodeRailInstance = (v) => {
  const $0 = decodeRailNode_v1(v.node);
  if ($0.tag === "Just") {
    return $Maybe(
      "Just",
      {
        nodeid: $0._1.nodeid,
        instanceid: v.instanceid,
        rail: $0._1.rail,
        state: $0._1.state,
        signals: $0._1.signals,
        invalidRoutes: $0._1.invalidRoutes,
        connections: $0._1.connections,
        reserves: $0._1.reserves,
        pos: v.pos,
        note: $0._1.note,
        drawinfos: $0._1.drawinfos
      }
    );
  }
  return Nothing;
};
var decodeLayout$p = (v) => {
  const rawrails = v.version <= 1 ? arrayMap((x) => decodeRailInstance(x))(v.rails) : arrayMap(decodeRailNode)(v.rails);
  const rs = mapMaybe((x) => x)(rawrails);
  const ts = arrayMap(decodeTrainset(rs))(v.trains);
  const $0 = foldlArray(removeRail)({
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
  })(reverse(sortBy(ordIntNode.compare)(arrayMap((r) => r.index)(filter((r) => r.isdeleted)(zipWith((i) => (r) => ({
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
  }))(range(0)(rawrails.length - 1 | 0))(rawrails))))));
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
  rails: arrayMap(unsafeCoerce)(v.rails),
  trains: isArray(v.trains) ? v.trains : [],
  time: (() => {
    const $0 = readNumber(v.time);
    if ($0.tag === "Right") {
      return $0._1;
    }
    return 0;
  })(),
  speed: (() => {
    const $0 = readNumber(v.speed);
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
var scissorsRail2 = scissorsRail;
var removeSignal2 = removeSignal;
var removeRail2 = removeRail;
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
  removeRail2 as removeRail,
  removeSignal2 as removeSignal,
  scissorsRail2 as scissorsRail,
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
