type InnerNest<T> = T extends Iterable<infer U> ? U : never;

function* map<T, U>(gn: Generator<T>, fn: (x: T, i: number) => U) {
  let i = 0;
  while (true) {
    const { value, done } = gn.next();
    if (!done) {
      yield fn(value, i);
    } else {
      return;
    }
    i++;
  }
}

function* filter<T>(gn: Generator<T>, fn: (x: T, i: number) => boolean) {
  let i = 0;
  while (true) {
    const { value, done } = gn.next();
    if (done) return;
    if (fn(value, i)) {
      yield value;
    }
    i++;
  }
}

function* take<T>(gn: Generator<T>, n: number) {
  let i = 0;
  while (i < n) {
    const { value, done } = gn.next();

    if (!done) {
      yield value;
    } else {
      return;
    }
    i++;
  }
}

function* takeWhile<T>(gn: Generator<T>, fn: (x: T, i: number) => boolean) {
  let i = 0;
  while (true) {
    const { value, done } = gn.next();
    if (done) return;
    if (!fn(value, i)) {
      return;
    }
    yield value;
    i++;
  }
}

function* chunked<T, U>(
  gn: Generator<T>,
  n: number,
  fn: (x: T[], i: number) => U
) {
  if (n <= 0) {
    throw new Error("chunk size must be greater than zero");
  }
  let j = 0;
  while (true) {
    const ls = [];
    for (let i = 0; i < n; i++) {
      const { value, done } = gn.next();
      if (done) {
        if (ls.length > 0) {
          yield fn(ls, j);
        }
        return;
      } else {
        ls.push(value);
      }
    }
    yield fn(ls, j);
    j++;
  }
}

function* distinct<T>(gn: Generator<T>) {
  const seen = new Set<T>();
  while (true) {
    const { value, done } = gn.next();

    if (!seen.has(value)) {
      seen.add(value);
      if (done) {
        return;
      } else {
        yield value;
      }
    } else {
      if (done) return;
    }
  }
}

function* distinctBy<T, U>(gn: Generator<T>, fn: (x: T, i: number) => U) {
  const seen = new Set<U>();
  let i = 0;
  while (true) {
    const { value, done } = gn.next();
    if (done) return;
    const transform = fn(value, i);

    if (!seen.has(transform)) {
      seen.add(transform);
      yield value;
    }
    i++;
  }
}

function* drop<T>(gn: Generator<T>, n: number) {
  let i = 0;
  while (true) {
    const { value, done } = gn.next();
    if (done) return;
    if (i >= n) {
      yield value;
    }
    i++;
  }
}

function* dropWhile<T>(gn: Generator<T>, fn: (x: T, i: number) => boolean) {
  let broken = false;
  let i = 0;
  while (true) {
    const { value, done } = gn.next();
    if (done) return;
    if (!fn(value, i)) {
      broken = true;
    }

    if (broken) {
      yield value;
    }
    i++;
  }
}

function* flatMap<T, U>(
  gn: Generator<T>,
  fn: (x: T, i: number) => Iterable<U>
) {
  let i = 0;
  while (true) {
    const { value, done } = gn.next();
    if (done) return;
    const transform = fn(value, i);
    if (
      typeof (transform as unknown as Record<typeof Symbol.iterator, unknown>)[
        Symbol.iterator
      ] !== "function"
    )
      throw new Error("transform is not iterable");

    for (const elem of transform) {
      yield elem;
    }
    i++;
  }
}

function* flatten<T>(gn: Generator<T[] | Generator<T>>) {
  while (true) {
    const { value, done } = gn.next();
    if (done) return;
    if (
      typeof (value as unknown as Record<typeof Symbol.iterator, unknown>)[
        Symbol.iterator
      ] !== "function"
    )
      throw new Error("Item is not iterable");
    for (const elem of value) {
      yield elem;
    }
  }
}

function* onEach<T>(gn: Generator<T>, fn: (x: T, i: number) => void) {
  let i = 0;
  while (true) {
    const { value, done } = gn.next();
    if (done) return;
    fn(value, i);
    yield value;
    i++;
  }
}

function* plus<T>(gn: Generator<T>, elements: Generator<T> | T[]) {
  yield* gn;
  for (const elem of elements) {
    yield elem;
  }
}

function* fold<T, U>(
  gn: Generator<T>,
  initial: U,
  fn: (initial: U, x: T, i: number) => U
) {
  let i = 0;
  yield initial;
  while (true) {
    const { value, done } = gn.next();
    if (done) return;
    initial = fn(initial, value, i);
    yield initial;
    i++;
  }
}

function* reduce<T>(gn: Generator<T>, fn: (acc: T, x: T, i: number) => T) {
  let i = 0;
  let acc = undefined;
  while (true) {
    const { value, done } = gn.next();
    if (done) return;
    if (i === 0) {
      acc = value;
    } else {
      acc = fn(acc!, value, i);
    }
    yield acc;
    i++;
  }
}

function* windowed<T, U>(
  gn: Generator<T>,
  size: number,
  step = 1,
  partialWindows = false,
  transform: (x: T[], i: number) => U = (x) => x as unknown as U
) {
  if (size <= 0) {
    throw new Error("window size must be greater than zero");
  }
  if (step <= 0) {
    throw new Error("step must be greater than zero");
  }
  let ls: T[] = [];
  let windowIndex = 0;
  while (true) {
    const { value, done } = gn.next();
    if (done) {
      if (partialWindows) {
        while (ls.length > step) {
          yield transform(ls, windowIndex);
          ls = ls.slice(step);
          windowIndex++;
        }

        if (ls.length > 0) {
          yield transform(ls, windowIndex);
        }
      }
      return;
    }

    ls.push(value);

    if (ls.length === size) {
      yield transform(ls, windowIndex);
      ls = ls.slice(step);
      windowIndex++;
    }
  }
}

function* withIndex<T>(gn: Generator<T>) {
  let index = 0;
  while (true) {
    const { value, done } = gn.next();
    if (done) return;
    yield { value, index };
    index++;
  }
}

function* zip<T, U, R>(
  gn: Generator<T>,
  other: Generator<U>,
  fn: (a: T, b: U, i: number) => R = (a, b) => [a, b] as unknown as R
) {
  let i = 0;
  while (true) {
    const one = gn.next();
    if (one.done) return;
    const two = other.next();
    if (two.done) return;
    yield fn(one.value, two.value, i);
    i++;
  }
}

function* zipWithNext<R, T>(
  gn: Generator<T>,
  fn: (a: T, b: T, i: number) => R = (a, b) => [a, b] as const as unknown as R
) {
  let i = 0;
  while (true) {
    const one = gn.next();
    const two = gn.next();
    if (one.done || two.done) return;
    yield fn(one.value, two.value, i);
    i++;
  }
}

function* _generateSequence<T>(
  seed: T | (() => T),
  fn: (x: T, i: number) => T
) {
  let cur;
  if (typeof seed === "function") {
    cur = (seed as () => T)();
  } else {
    cur = seed;
  }
  yield cur;
  let i = 0;
  while (true) {
    cur = fn(cur, i);
    yield cur;
    i++;
  }
}

type Functions<T> = {
  /** Returns `true` if every element satisfies the predicate. */
  all: (fn: (x: T, i: number) => boolean) => boolean;
  /** Returns `true` if at least one element satisfies the predicate. */
  any: (fn: (x: T, i: number) => boolean) => boolean;
  /** Builds a {@link Map} from each element's transformed `[key, value]` pair. */
  associate: <U, V>(fn: (x: T, i: number) => [U, V]) => Map<U, V>;
  /** Builds a {@link Map} using a key selector; the element itself is the value unless a second selector is provided. */
  associateBy: <U, V>(
    fn: (x: T, i: number) => U,
    fn2?: (x: T, i: number) => V
  ) => Map<U, V>;
  /** Populates an existing {@link Map} using a key selector. */
  associateByTo: <U, V>(
    map: Map<U, V>,
    fn: (x: T, i: number) => U,
    fn2?: (x: T, i: number) => V
  ) => Map<U, V>;
  /** Populates an existing {@link Map} from each element's transformed `[key, value]` pair. */
  associateTo: <U, V>(
    map: Map<U, V>,
    fn: (x: T, i: number) => [U, V]
  ) => Map<U, V>;
  /** Builds a {@link Map} where each element is the key and the selector produces the value. */
  associateWith: <V>(fn: (x: T, i: number) => V) => Map<T, V>;
  /** Populates an existing {@link Map} where each element is the key. */
  associateWithTo: <V>(map: Map<T, V>, fn: (x: T, i: number) => V) => Map<T, V>;
  /** Returns the arithmetic mean. Throws if the sequence is empty or contains non-numeric values. */
  average: () => number;
  /** Groups elements into chunks of size `n`, optionally transforming each chunk. */
  chunked: <V>(n: number, fn?: (x: T[], i: number) => V) => Functions<V>;
  /** Returns `true` if the sequence contains the given element (strict equality). */
  contains: (x: T) => boolean;
  /** Returns the number of elements matching the predicate, or the total count if no predicate is given. */
  count: (fn?: (y: T, i: number) => boolean) => number;
  /** Returns a sequence with duplicate elements removed. */
  distinct: () => Functions<T>;
  /** Returns a sequence with duplicates removed based on a selector function. */
  distinctBy: <V>(fn: (x: T, i: number) => V) => Functions<T>;
  /** Returns a sequence skipping the first `n` elements. Throws if `n` is negative. */
  drop: (n: number) => Functions<T>;
  /** Returns a sequence skipping elements while the predicate is satisfied. */
  dropWhile: (fn: (x: T, i: number) => boolean) => Functions<T>;
  /** Returns the element at the given index. Throws if out of bounds. */
  elementAt: (i: number) => T;
  /** Returns the element at the given index, or `defaultValue` if out of bounds. */
  elementAtOrElse: (i: number, defaultValue: T) => T;
  /** Returns the element at the given index, or `null` if out of bounds. */
  elementAtOrNull: (i: number) => T | null;
  /** Returns a sequence of elements satisfying the predicate. */
  filter: (fn: (x: T, i: number) => boolean) => Functions<T>;
  /** Returns a sequence of elements that do **not** satisfy the predicate. */
  filterNot: (fn: (x: T, i: number) => boolean) => Functions<T>;
  /** Appends elements that do **not** satisfy the predicate into the given array. */
  filterNotTo: (xs: T[], fn: (x: T, i: number) => boolean) => T[];
  /** Appends elements satisfying the predicate into the given array. */
  filterTo: (xs: T[], fn: (x: T, i: number) => boolean) => T[];
  /** Returns the first element matching the predicate, or `null` if none match. */
  find: (fn: (x: T, i: number) => boolean) => T | null;
  /** Returns the last element matching the predicate, or `null` if none match. */
  findLast: (fn: (x: T, i: number) => boolean) => T | null;
  /** Returns the first element matching the predicate. Throws if the sequence is empty or no match is found. */
  first: (fn?: (x: T, i: number) => boolean) => T;
  /** Returns the first element matching the predicate, or `null` if none match. */
  firstOrNull: (fn?: (x: T, i: number) => boolean) => T | null;
  /** Maps each element to an iterable and flattens the result into a single sequence. */
  flatMap: <U>(fn: (x: T, i: number) => Iterable<U>) => Functions<U>;
  /** Maps each element to an iterable and appends all elements to the given array. */
  flatMapTo: <U>(xs: U[], fn: (x: T, i: number) => Iterable<U>) => U[];
  /** Flattens a sequence of arrays or generators into a single-level sequence. */
  flatten: () => Functions<InnerNest<T>>;
  /** Accumulates a value starting from `initial`, applying the function left-to-right. */
  fold: <U>(initial: U, fn: (initial: U, x: T, i: number) => U) => U;
  /** Performs the given action on each element. Consumes the sequence. */
  forEach: (fn: (x: T, i: number) => void) => void;
  /** Groups elements by a key selector. An optional value transform can map the stored values. */
  groupBy: <U, V>(
    fn: (x: T, i: number) => U,
    fn2?: (x: T, i: number) => V
  ) => Map<U, V[]>;
  /** Populates an existing {@link Map} by grouping elements with a key selector. */
  groupByTo: <U, V>(
    xs: Map<U, V[]>,
    fn: (x: T, i: number) => U,
    fn2?: (x: T, i: number) => V
  ) => Map<U, V[]>;
  /** Returns the index of the first occurrence of the element, or `-1` if not found. */
  indexOf: (elem: T) => number;
  /** Returns the index of the first element satisfying the predicate, or `-1` if none match. */
  indexOfFirst: (fn: (x: T, i: number) => boolean) => number;
  /** Returns the index of the last element satisfying the predicate, or `-1` if none match. */
  indexOfLast: (fn: (x: T, i: number) => boolean) => number;
  /** Appends elements to a string buffer, separated by `separator`. Supports prefix, postfix, limit, and truncation. */
  joinTo: <V>(
    buffer: string,
    separator?: string,
    prefix?: string,
    postfix?: string,
    limit?: number,
    truncated?: string,
    transform?: (x: T, i: number) => V
  ) => string;
  /** Returns a string of all elements, separated by `separator`. Supports prefix, postfix, limit, and truncation. */
  joinToString: <V>(
    separator?: string,
    prefix?: string,
    postfix?: string,
    limit?: number,
    truncated?: string,
    transform?: (x: T, i: number) => V
  ) => string;
  /** Returns the last element matching the predicate. Throws if the sequence is empty or no match is found. */
  last: (fn?: (x: T, i: number) => boolean) => T;
  /** Returns the index of the last occurrence of the element, or `-1` if not found. */
  lastIndexOf: (elem: T) => number;
  /** Returns the last element matching the predicate, or `null` if none match. */
  lastOrNull: (fn?: (x: T, i: number) => boolean) => T | null;
  /** Returns a sequence with each element transformed by the given function. */
  map: <V>(fn: (x: T, i: number) => V) => Functions<V>;
  /** Appends transformed elements to the given array. */
  mapTo: <V>(xs: V[], fn: (x: T, i: number) => V) => V[];
  /** Returns the largest element according to natural ordering. Throws if empty. */
  max: () => T;
  /** Returns the element with the largest value of the selector function. Throws if empty. */
  maxBy: <V>(fn: (x: T, i: number) => V) => T;
  /** Returns the element with the largest selector value, or `null` if empty. */
  maxByOrNull: <V>(fn: (x: T, i: number) => V) => T | null;
  /** Returns the largest value produced by the selector. Throws if empty. */
  maxOf: <U>(fn: (x: T, i: number) => U) => U;
  /** Returns the largest value produced by the selector, or `null` if empty. */
  maxOfOrNull: <U>(fn: (x: T, i: number) => U) => U | null;
  /** Returns the largest value produced by the selector using a custom comparator. Throws if empty. */
  maxOfWith: <U>(
    comp: (a: U, b: U) => 0 | 1 | -1,
    fn: (x: T, i: number) => U
  ) => U;
  /** Returns the largest value produced by the selector using a custom comparator, or `null` if empty. */
  maxOfWithOrNull: <U>(
    comp: (a: U, b: U) => 0 | 1 | -1,
    fn: (x: T, i: number) => U
  ) => U | null;
  /** Returns the largest element according to natural ordering, or `null` if empty. */
  maxOrNull: () => T | null;
  /** Returns the largest element according to a custom comparator. Throws if empty. */
  maxWith: (comp: (a: T, b: T) => 0 | 1 | -1) => T;
  /** Returns the largest element according to a custom comparator, or `null` if empty. */
  maxWithOrNull: (comp: (a: T, b: T) => 0 | 1 | -1) => T | null;
  /** Returns the smallest element according to natural ordering. Throws if empty. */
  min: () => T;
  /** Returns the element with the smallest value of the selector function. Throws if empty. */
  minBy: <V>(fn: (x: T, i: number) => V) => T;
  /** Returns the element with the smallest selector value, or `null` if empty. */
  minByOrNull: <V>(fn: (x: T, i: number) => V) => T | null;
  /** Returns the smallest value produced by the selector. Throws if empty. */
  minOf: <U>(fn: (x: T, i: number) => U) => U;
  /** Returns the smallest value produced by the selector, or `null` if empty. */
  minOfOrNull: <U>(fn: (x: T, i: number) => U) => U | null;
  /** Returns the smallest value produced by the selector using a custom comparator. Throws if empty. */
  minOfWith: <U>(
    comp: (a: U, b: U) => 0 | 1 | -1,
    fn: (x: T, i: number) => U
  ) => U;
  /** Returns the smallest value produced by the selector using a custom comparator, or `null` if empty. */
  minOfWithOrNull: <U>(
    comp: (a: U, b: U) => 0 | 1 | -1,
    fn: (x: T, i: number) => U
  ) => U | null;
  /** Returns the smallest element according to natural ordering, or `null` if empty. */
  minOrNull: () => T | null;
  /** Returns a sequence with all occurrences of the given elements removed. */
  minus: (elements: T[]) => Functions<T>;
  /** Returns a sequence with the first occurrence of the given element removed. */
  minusElement: (elem: T) => Functions<T>;
  /** Returns the smallest element according to a custom comparator. Throws if empty. */
  minWith: (comp: (a: T, b: T) => 0 | 1 | -1) => T;
  /** Returns the smallest element according to a custom comparator, or `null` if empty. */
  minWithOrNull: (comp: (a: T, b: T) => 0 | 1 | -1) => T | null;
  /** Returns the next iterator result from the underlying generator. */
  next: () => IteratorResult<T>;
  /** Returns `true` if no elements satisfy the predicate (or if the sequence is empty when no predicate is given). */
  none: (fn?: (x: T, i: number) => boolean) => boolean;
  /** Performs the given action on each element and returns the original sequence. */
  onEach: (fn: (x: T, i: number) => void) => Functions<T>;
  /** Splits elements into a pair of arrays: those that satisfy the predicate and those that do not. */
  partition: (fn: (x: T, i: number) => boolean) => readonly [T[], T[]];
  /** Returns a sequence with the given elements appended. */
  plus: (elements: Generator<T> | T[]) => Functions<T>;
  /** Returns a sequence with the given element appended. */
  plusElement: (elem: T) => Functions<T>;
  /** Accumulates a value using the first element as the initial accumulator. Throws if empty. */
  reduce: (fn: (acc: T, x: T, i: number) => T) => T;
  /** Accumulates a value using the first element as the initial accumulator, or `null` if empty. */
  reduceOrNull: (fn: (acc: T, x: T, i: number) => T) => T | null;
  /** Delegates to the underlying generator's `return` method. */
  return: Generator<T>["return"];
  /** Returns a sequence of intermediate fold results, starting with `initial`. */
  runningFold: <U>(
    initial: U,
    fn: (initial: U, x: T, i: number) => U
  ) => Functions<U>;
  /** Returns a sequence of intermediate reduce results. */
  runningReduce: (fn: (acc: T, x: T, i: number) => T) => Functions<T>;
  /** Alias for {@link runningFold}. */
  scan: <U>(initial: U, fn: (initial: U, x: T, i: number) => U) => Functions<U>;
  /** Returns the single element matching the predicate. Throws if zero or multiple matches. */
  single: (fn?: (x: T, i: number) => boolean) => T;
  /** Returns the single element matching the predicate, or `null` if zero or multiple matches. */
  singleOrNull: (fn?: (x: T, i: number) => boolean) => T | null;
  /** Returns the sum of all numeric elements. */
  sum: () => number;
  /** Returns the sum of values returned by the selector function. */
  sumOf: <U>(fn: (x: T, i: number) => U) => number;
  /** Returns a sequence of the first `n` elements. Throws if `n` is negative. */
  take: (n: number) => Functions<T>;
  /** Returns a sequence of elements while the predicate is satisfied. */
  takeWhile: (fn: (x: T, i: number) => boolean) => Functions<T>;
  /** Delegates to the underlying generator's `throw` method. */
  throw: Generator<T>["throw"];
  /** Collects all elements into an array. */
  toArray: () => T[];
  /** Collects all elements into a {@link Set}. */
  toSet: () => Set<T>;
  /** Splits a sequence of pairs into a pair of arrays. */
  unzip: T extends readonly [infer A, infer B]
    ? () => [A[], B[]]
    : T extends readonly (infer A)[]
      ? () => [A[], A[]]
      : () => [unknown[], unknown[]];
  /** Returns a sequence of sliding windows of the given size. Supports custom step and partial windows. */
  windowed: <U>(
    size: number,
    step?: number,
    partialWindows?: boolean,
    transform?: (x: T[], i: number) => U
  ) => Functions<U>;
  /** Returns a sequence of `{ value, index }` objects. */
  withIndex: () => Functions<{ value: T; index: number }>;
  /** Returns a sequence of pairs with another generator, optionally applying a transform. */
  zip: <R, U>(
    other: Generator<U>,
    fn?: (a: T, b: U, i: number) => R
  ) => Functions<R>;
  /** Returns a sequence of adjacent pairs, optionally applying a transform. */
  zipWithNext: <R>(fn?: (a: T, b: T, i: number) => R) => Functions<R>;
  /** Returns the underlying generator for use in `for...of` loops. */
  [Symbol.iterator]: () => Generator<T>;
  [Symbol.dispose]: () => void;
};

function wrapGenerator<T>(gn: Generator<T>): Generator<T> {
  let exhausted = false;
  return {
    next: () => {
      const result = gn.next();
      if (result.done) {
        exhausted = true;
      }
      return result;
    },
    return: (value?: T) => gn.return(value as Parameters<typeof gn.return>[0]),
    throw: (e?: unknown) => gn.throw(e),
    [Symbol.iterator]() {
      if (exhausted) {
        throw new Error("Generator-based sequences can only be iterated once");
      }
      return this;
    },
    [Symbol.dispose]: () => {
      gn[Symbol.dispose]?.();
    }
  } as Generator<T>;
}

export const generateSequence = <T>(
  seed: T | (() => T),
  fn: (x: T, i: number) => T
) => Sequence(_generateSequence(seed, fn));

export function Sequence<T>(this: void, it: Generator<T> | T[]) {
  const isArray = Array.isArray(it);
  const generator: Generator<T> = isArray
    ? arrToSequence(it)
    : wrapGenerator(it);

  const fns: Functions<T> = {
    all: (fn) => {
      let i = 0;
      for (const x of generator) {
        if (!fn(x, i)) {
          return false;
        }
        i++;
      }
      return true;
    },
    any: (fn) => {
      let i = 0;
      for (const x of generator) {
        if (fn(x, i)) {
          return true;
        }
        i++;
      }
      return false;
    },
    associate: (fn) => {
      const map = new Map();
      let i = 0;
      for (const x of generator) {
        const [k, v] = fn(x, i);
        map.set(k, v);
        i++;
      }
      return map;
    },
    associateBy: <U, V>(
      fn: (x: T, i: number) => U,
      fn2: (x: T, i: number) => V = (x) => x as unknown as V
    ) => {
      const map = new Map();
      let i = 0;
      for (const x of generator) {
        map.set(fn(x, i), fn2(x, i));
        i++;
      }
      return map;
    },
    associateByTo: <U, V>(
      map: Map<U, V>,
      fn: (x: T, i: number) => U,
      fn2: (x: T, i: number) => V = (x) => x as unknown as V
    ) => {
      let i = 0;
      for (const x of generator) {
        map.set(fn(x, i), fn2(x, i));
        i++;
      }

      return map;
    },
    associateTo: (map, fn) => {
      let i = 0;
      for (const x of generator) {
        const [k, v] = fn(x, i);
        map.set(k, v);
        i++;
      }

      return map;
    },
    associateWith: (fn) => {
      const map = new Map();
      let i = 0;
      for (const x of generator) {
        map.set(x, fn(x, i));
        i++;
      }

      return map;
    },
    associateWithTo: (map, fn) => {
      let i = 0;
      for (const x of generator) {
        map.set(x, fn(x, i));
        i++;
      }

      return map;
    },
    average: () => {
      let avg = 0;
      let count = 0;
      for (const x of generator) {
        if (typeof x !== "number") throw new Error("Non-numeric sequence");
        avg += x;
        count++;
      }

      if (count === 0) throw new Error("Empty sequence");

      return avg / count;
    },
    chunked: <V>(n: number, fn = (x: T[], _i: number) => x as unknown as V) => {
      const gn = chunked(generator, n, fn);
      return Sequence<V>(gn);
    },
    contains: (x) => {
      for (const y of generator) {
        if (x === y) return true;
      }
      return false;
    },
    count: (fn = () => true) => {
      let count = 0;
      let i = 0;
      for (const x of generator) {
        if (fn(x, i)) {
          count++;
        }
        i++;
      }
      return count;
    },
    distinct: () => Sequence(distinct(generator)),
    distinctBy: (fn) => Sequence(distinctBy(generator, fn)),
    drop: (n) => {
      if (n < 0) throw new Error("Negative drop size");
      return Sequence(drop(generator, n));
    },
    dropWhile: (fn) => Sequence(dropWhile(generator, fn)),
    elementAt: (i) => {
      let j = 0;
      for (const x of generator) {
        if (j === i) return x;
        j++;
      }
      throw new Error("Element not found");
    },
    elementAtOrElse: (i, defaultValue) => {
      let j = 0;
      for (const x of generator) {
        if (j === i) return x;
        j++;
      }
      return defaultValue;
    },
    elementAtOrNull: (i) => {
      let j = 0;
      for (const x of generator) {
        if (j === i) return x;
        j++;
      }
      return null;
    },
    filter: (fn) => Sequence(filter(generator, fn)),
    filterNot: (fn) => Sequence(filter(generator, (x, i) => !fn(x, i))),
    filterNotTo: (xs, fn) => {
      let i = 0;
      for (const x of generator) {
        if (!fn(x, i)) {
          xs.push(x);
        }
        i++;
      }

      return xs;
    },
    filterTo: (xs, fn) => {
      let i = 0;
      for (const x of generator) {
        if (fn(x, i)) {
          xs.push(x);
        }
        i++;
      }

      return xs;
    },
    find: (fn) => {
      let i = 0;
      for (const x of generator) {
        if (fn(x, i)) return x;
        i++;
      }

      return null;
    },
    findLast: (fn) => {
      let found = null;
      let i = 0;
      for (const x of generator) {
        if (fn(x, i)) {
          found = x;
        }
        i++;
      }
      return found;
    },
    first: (fn = () => true) => {
      let i = 0;
      while (true) {
        const { value, done } = generator.next();
        if (done) throw new Error("Empty sequence");
        if (fn(value, i)) return value;
        i++;
      }
    },
    firstOrNull: (fn = () => true) => {
      let i = 0;
      while (true) {
        const { value, done } = generator.next();
        if (done) return null;
        if (fn(value, i)) return value;
        i++;
      }
    },
    flatMap: (fn) => {
      const gn = flatMap(generator, fn);
      return Sequence(gn);
    },
    flatMapTo: (xs, fn) => {
      let i = 0;
      for (const x of generator) {
        const transform = fn(x, i);
        if (
          typeof (
            transform as unknown as Record<typeof Symbol.iterator, unknown>
          )[Symbol.iterator] !== "function"
        )
          throw new Error("transform is not iterable");
        for (const elem of transform) {
          xs.push(elem);
        }
        i++;
      }

      return xs;
    },
    flatten: () => Sequence(flatten(generator as Generator<InnerNest<T>[]>)),
    fold: (initial, fn) => {
      let i = 0;
      for (const x of generator) {
        initial = fn(initial, x, i);
        i++;
      }

      return initial;
    },
    forEach: (fn) => {
      let i = 0;
      for (const x of generator) {
        fn(x, i);
        i++;
      }
    },
    groupBy: <U, V>(
      fn: (x: T, i: number) => U,
      fn2: (x: T, i: number) => V = (x) => x as unknown as V
    ) => fns.groupByTo(new Map(), fn, fn2),
    groupByTo: <U, V>(
      xs: Map<U, V[]>,
      fn: (x: T, i: number) => U,
      fn2: (x: T, i: number) => V = (x) => x as unknown as V
    ) => {
      let i = 0;
      for (const x of generator) {
        const key = fn(x, i);
        if (xs.has(key)) {
          xs.get(key)!.push(fn2(x, i));
        } else {
          xs.set(key, [fn2(x, i)]);
        }
        i++;
      }
      return xs;
    },
    indexOf: (elem) => {
      let i = 0;
      for (const x of generator) {
        if (elem === x) return i;
        i++;
      }
      return -1;
    },
    indexOfFirst: (fn) => {
      let i = 0;
      for (const x of generator) {
        if (fn(x, i)) return i;
        i++;
      }
      return -1;
    },
    indexOfLast: (fn) => {
      let i = 0;
      let found = -1;
      for (const x of generator) {
        if (fn(x, i)) {
          found = i;
        }
        i++;
      }
      return found;
    },
    joinTo: <V>(
      buffer: string,
      separator = ", ",
      prefix = "",
      postfix = "",
      limit = -1,
      truncated = "...",
      transform: (x: T, i: number) => V = (x) => x as unknown as V
    ) => {
      let i = 0;
      buffer += prefix;

      for (const x of generator) {
        if (i === limit) {
          buffer += truncated;
          break;
        }
        buffer += transform(x, i);
        buffer += separator;
        i++;
      }

      if (buffer.endsWith(separator)) {
        buffer = buffer.slice(0, buffer.length - separator.length);
      }

      return buffer + postfix;
    },
    joinToString: (separator, prefix, postfix, limit, truncated, transform) =>
      fns.joinTo("", separator, prefix, postfix, limit, truncated, transform),
    last: (fn = () => true) => {
      let elem;
      let found = false;
      let i = 0;
      for (const x of generator) {
        if (fn(x, i)) {
          found = true;
          elem = x;
        }
        i++;
      }
      if (!found) throw new Error("Element not found");
      return elem!;
    },
    lastIndexOf: (elem) => {
      let found = -1;
      let i = 0;
      for (const x of generator) {
        if (x === elem) {
          found = i;
        }
        i++;
      }
      return found;
    },
    lastOrNull: (fn = () => true) => {
      let elem = null;
      let i = 0;
      for (const x of generator) {
        if (fn(x, i)) {
          elem = x;
        }
        i++;
      }
      return elem;
    },
    map: (fn) => {
      const gn = map(generator, fn);
      return Sequence(gn);
    },
    mapTo: (xs, fn) => {
      let i = 0;
      for (const x of generator) {
        xs.push(fn(x, i));
        i++;
      }
      return xs;
    },
    max: () => {
      let max: T | undefined = undefined;
      let i = 0;

      for (const x of generator) {
        if (i === 0) {
          max = x;
        } else {
          if (x > max!) {
            max = x;
          }
        }
        i++;
      }

      if (i === 0) throw new Error("Empty sequence");

      return max!;
    },
    maxBy: <V>(fn: (x: T, i: number) => V) => {
      let max: [T, V] | undefined = undefined;
      let i = 0;

      for (const x of generator) {
        if (i === 0) {
          max = [x, fn(x, i)];
        } else {
          const transform = fn(x, i);
          if (transform > max![1]) {
            max = [x, transform];
          }
        }
        i++;
      }

      if (i === 0) throw new Error("Empty sequence");

      return max![0];
    },
    maxByOrNull: <V>(fn: (x: T, i: number) => V) => {
      let max: [T, V] | [null, undefined] = [null, undefined];
      let i = 0;

      for (const x of generator) {
        if (i === 0) {
          max = [x, fn(x, i)];
        } else {
          const transform = fn(x, i);
          if (transform > max[1]!) {
            max = [x, transform];
          }
        }
        i++;
      }

      return max[0];
    },
    maxOf: <U>(fn: (x: T, i: number) => U) => {
      let max: U | undefined = undefined;
      let i = 0;

      for (const x of generator) {
        if (i === 0) {
          max = fn(x, i);
        } else {
          const transform = fn(x, i);
          if (transform > max!) {
            max = transform;
          }
        }
        i++;
      }

      if (i === 0) throw new Error("Empty sequence");

      return max!;
    },
    maxOfOrNull: <U>(fn: (x: T, i: number) => U) => {
      let max: U | undefined = undefined;
      let i = 0;

      for (const x of generator) {
        if (i === 0) {
          max = fn(x, i);
        } else {
          const transform = fn(x, i);
          if (transform > max!) {
            max = transform;
          }
        }
        i++;
      }

      return i === 0 ? null : max!;
    },
    maxOfWith: <U>(
      comp: (a: U, b: U) => 0 | 1 | -1,
      fn: (x: T, i: number) => U
    ) => {
      const res = fns.maxOfWithOrNull(comp, fn);
      if (res === null) throw new Error("Empty sequence");
      return res;
    },
    maxOfWithOrNull: <U>(
      comp: (a: U, b: U) => 0 | 1 | -1,
      fn: (x: T, i: number) => U
    ) => {
      let max = null;
      let i = 0;

      for (const x of generator) {
        if (i === 0) {
          max = fn(x, i);
        } else {
          const transform = fn(x, i);
          if (comp(max!, transform) === -1) {
            max = transform;
          }
        }
        i++;
      }

      return max;
    },
    maxOrNull: () => {
      let max: T | null = null;
      let i = 0;

      for (const x of generator) {
        if (i === 0) {
          max = x;
        } else {
          if (x > max!) {
            max = x;
          }
        }
        i++;
      }

      return max;
    },
    maxWith: (comp) => {
      let max: T | undefined = undefined;
      let i = 0;

      for (const x of generator) {
        if (i === 0) {
          max = x;
        } else {
          if (comp(max!, x) === -1) {
            max = x;
          }
        }
        i++;
      }

      if (i === 0) throw new Error("Empty sequence");

      return max!;
    },
    maxWithOrNull: (comp) => {
      let max: T | null = null;
      let i = 0;

      for (const x of generator) {
        if (i === 0) {
          max = x;
        } else {
          if (comp(max!, x) === -1) {
            max = x;
          }
        }
        i++;
      }

      return max;
    },
    min: () => {
      let min: T | undefined = undefined;
      let i = 0;

      for (const x of generator) {
        if (i === 0) {
          min = x;
        } else {
          if (x < min!) {
            min = x;
          }
        }
        i++;
      }

      if (i === 0) throw new Error("Empty sequence");

      return min!;
    },
    minBy: <U>(fn: (x: T, i: number) => U) => {
      let min: [T, U] | undefined = undefined;
      let i = 0;

      for (const x of generator) {
        if (i === 0) {
          min = [x, fn(x, i)];
        } else {
          const transform = fn(x, i);
          if (transform < min![1]) {
            min = [x, transform];
          }
        }
        i++;
      }

      if (i === 0) throw new Error("Empty sequence");

      return min![0];
    },
    minByOrNull: <U>(fn: (x: T, i: number) => U) => {
      let min: [null, undefined] | [T, U] = [null, undefined];
      let i = 0;

      for (const x of generator) {
        if (i === 0) {
          min = [x, fn(x, i)];
        } else {
          const transform = fn(x, i);
          if (transform < min[1]!) {
            min = [x, transform];
          }
        }
        i++;
      }

      return min[0];
    },
    minOf: <U>(fn: (x: T, i: number) => U) => {
      let min: U | undefined = undefined;
      let i = 0;

      for (const x of generator) {
        if (i === 0) {
          min = fn(x, i);
        } else {
          const transform = fn(x, i);
          if (transform < min!) {
            min = transform;
          }
        }
        i++;
      }

      if (i === 0) throw new Error("Empty sequence");

      return min!;
    },
    minOfOrNull: <U>(fn: (x: T, i: number) => U) => {
      let min: U | undefined = undefined;
      let i = 0;

      for (const x of generator) {
        if (i === 0) {
          min = fn(x, i);
        } else {
          const transform = fn(x, i);
          if (transform < min!) {
            min = transform;
          }
        }
        i++;
      }

      return i === 0 ? null : min!;
    },
    minOfWith: (comp, fn) => {
      const res = fns.minOfWithOrNull(comp, fn);
      if (res === null) throw new Error("Empty sequence");
      return res;
    },
    minOfWithOrNull: <U>(
      comp: (a: U, b: U) => 0 | 1 | -1,
      fn: (x: T, i: number) => U
    ) => {
      let min: U | null = null;
      let i = 0;

      for (const x of generator) {
        if (i === 0) {
          min = fn(x, i);
        } else {
          const transform = fn(x, i);
          if (comp(min!, transform) === 1) {
            min = transform;
          }
        }
        i++;
      }

      return min;
    },
    minOrNull: () => {
      let min: T | null = null;
      let i = 0;

      for (const x of generator) {
        if (i === 0) {
          min = x;
        } else {
          if (x < min!) {
            min = x;
          }
        }
        i++;
      }

      return min;
    },
    minus: (elements) => {
      const set = new Set(elements);
      return Sequence(filter(generator, (x) => !set.has(x)));
    },
    minusElement: (elem) => {
      return Sequence(
        (function* () {
          let found = false;
          while (true) {
            const { value, done } = generator.next();
            if (done) return;
            if (value === elem && !found) {
              found = true;
            } else {
              yield value;
            }
          }
        })()
      );
    },
    minWith: (comp) => {
      let min = undefined;
      let i = 0;

      for (const x of generator) {
        if (i === 0) {
          min = x;
        } else {
          if (comp(min!, x) === 1) {
            min = x;
          }
        }
        i++;
      }

      if (i === 0) throw new Error("Empty sequence");

      return min!;
    },
    minWithOrNull: (comp) => {
      let min = null;
      let i = 0;

      for (const x of generator) {
        if (i === 0) {
          min = x;
        } else {
          if (comp(min!, x) === 1) {
            min = x;
          }
        }
        i++;
      }

      return min;
    },
    next: () => generator.next(),
    none: (fn = () => true) => {
      let i = 0;
      for (const x of generator) {
        if (fn(x, i)) return false;
        i++;
      }
      return true;
    },
    onEach: (fn) => Sequence(onEach(generator, fn)),
    partition: (fn) => {
      const ts = [];
      const fs = [];
      let i = 0;

      for (const x of generator) {
        if (fn(x, i)) {
          ts.push(x);
        } else {
          fs.push(x);
        }
        i++;
      }

      return [ts, fs] as const;
    },
    plus: (elements) => Sequence(plus(generator, elements)),
    plusElement: (elem) => Sequence(plus(generator, [elem])),
    reduce: (fn) => {
      let acc: T | undefined = undefined;
      let i = 0;
      for (const x of generator) {
        if (i === 0) {
          acc = x;
        } else {
          acc = fn(acc!, x, i);
        }
        i++;
      }

      if (i === 0) throw new Error("Empty sequence");

      return acc!;
    },
    reduceOrNull: (fn) => {
      let acc: T | undefined = undefined;
      let i = 0;
      for (const x of generator) {
        if (i === 0) {
          acc = x;
        } else {
          acc = fn(acc!, x, i);
        }
        i++;
      }

      return i === 0 ? null : acc!;
    },
    return: generator.return.bind(generator),
    runningFold: (initial, fn) => {
      const gn = fold(generator, initial, fn);
      return Sequence(gn);
    },
    runningReduce: (fn) => Sequence(reduce(generator, fn)),
    scan: (initial, fn) => fns.runningFold(initial, fn),
    single: (fn = () => true) => {
      let elem;
      let i = 0;
      let set = false;
      for (const x of generator) {
        if (fn(x, i)) {
          if (set) {
            throw new Error("Not a single sequence");
          } else {
            elem = x;
            set = true;
          }
        }
        i++;
      }

      if (!set) throw new Error("Empty sequence");

      return elem!;
    },
    singleOrNull: (fn = () => true) => {
      let elem: T | null = null;
      let set = false;
      let i = 0;
      for (const x of generator) {
        if (fn(x, i)) {
          if (set) {
            return null;
          } else {
            elem = x;
            set = true;
          }
        }
        i++;
      }

      return elem;
    },
    sum: () => {
      let sum = 0;
      for (const x of generator) {
        if (typeof x !== "number") throw new Error("Non-numeric sequence");
        sum += x;
      }
      return sum;
    },
    sumOf: (fn) => {
      let sum = 0;
      let i = 0;
      for (const x of generator) {
        const val = fn(x, i);
        if (typeof val !== "number") throw new Error("Non-numeric sequence");
        sum += val;
        i++;
      }
      return sum;
    },
    take: (n) => {
      if (n < 0) throw new Error("n out of bounds");
      return Sequence(take(generator, n));
    },
    takeWhile: (fn) => Sequence(takeWhile(generator, fn)),
    throw: generator.throw.bind(generator),
    toArray: () => [...generator],
    toSet: () => {
      const set = new Set<T>();
      for (const x of generator) {
        set.add(x);
      }
      return set;
    },
    unzip: (() => {
      const one: unknown[] = [];
      const two: unknown[] = [];

      for (const x of generator) {
        const arr = x as unknown as readonly [unknown, unknown];
        one.push(arr[0]);
        two.push(arr[1]);
      }

      return [one, two] as const;
    }) as Functions<T>["unzip"],
    windowed: <U>(
      size: number,
      step?: number,
      partialWindows?: boolean,
      transform?: (x: T[], i: number) => U
    ) => {
      const gn = windowed(generator, size, step, partialWindows, transform);
      return Sequence(gn);
    },
    withIndex: () => {
      const gn = withIndex(generator);
      return Sequence(gn);
    },
    zip: (other, fn) => {
      const gn = zip(generator, other, fn);
      return Sequence(gn);
    },
    zipWithNext: (fn) => {
      const gn = zipWithNext(generator, fn);
      return Sequence(gn);
    },
    [Symbol.iterator]() {
      return generator;
    },
    [Symbol.dispose]() {
      generator[Symbol.dispose]?.();
    }
  };

  return fns;
}

function arrToSequence<T>(arr: T[]): Generator<T> {
  const iterator = arr[Symbol.iterator]();
  return {
    next: () => iterator.next(),
    return: (value?: T) => {
      return { done: true, value } as IteratorResult<T>;
    },
    throw: (e?: unknown) => {
      throw e;
    },
    [Symbol.iterator]: () => arr[Symbol.iterator](),
    [Symbol.dispose]: () => {}
  } as Generator<T>;
}
