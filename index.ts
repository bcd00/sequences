function* map<T, U>(gn: Generator<T>, fn: (x: T, i: number) => U) {
  let i = 0;
  while (true) {
    const { value, done } = gn.next();
    if (!done) {
      yield fn(value, i);
    } else {
      return fn(value, i);
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
      return value;
    }
    i++;
  }
}

function* takeWhile<T>(gn: Generator<T>, fn: (x: T, i: number) => boolean) {
  let broken = false;
  let i = 0;
  while (true) {
    const { value, done } = gn.next();
    if (done) return;
    if (!fn(value, i)) {
      broken = true;
    }

    if (!broken) {
      yield value;
    }
    i++;
  }
}

function* chunked<T, U>(
  gn: Generator<T>,
  n: number,
  fn: (x: T[], i: number) => U
) {
  let j = 0;
  while (true) {
    const ls = [];
    for (let i = 0; i < n; i++) {
      const { value, done } = gn.next();
      if (done) {
        if (ls.length > 0) {
          yield fn(ls, i);
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
  const seen: T[] = [];
  while (true) {
    const { value, done } = gn.next();

    if (!seen.includes(value)) {
      seen.push(value);
      if (done) {
        return value;
      } else {
        yield value;
      }
    }
  }
}

function* distinctBy<T, U>(gn: Generator<T>, fn: (x: T, i: number) => U) {
  const seen: U[] = [];
  let i = 0;
  while (true) {
    const { value, done } = gn.next();
    if (done) return;
    const transform = fn(value, i);

    if (!seen.includes(transform)) {
      seen.push(transform);
      yield value;
    }
    i++;
  }
}

function* drop<T>(gn: Generator<T>, n: number) {
  let i = 0;
  while (true) {
    const { value, done } = gn.next();
    if (i >= n) {
      if (!done) {
        yield value;
      } else {
        return value;
      }
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

function* flatMap<T, U>(gn: Generator<T>, fn: (x: T, i: number) => U[]) {
  let i = 0;
  while (true) {
    const { value, done } = gn.next();
    if (done) return;
    const transform = fn(value, i);

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
    if (typeof (value as any)[Symbol.iterator] !== "function")
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
  let ls: T[] = [];
  let i = 0;
  while (true) {
    const { value, done } = gn.next();
    if (done) {
      if (partialWindows) {
        while (ls.length > step) {
          yield transform(ls, i);
          ls = ls.slice(step);
        }

        yield transform(ls, i);
      }
      return;
    }

    ls.push(value);

    if (ls.length === size) {
      yield transform(ls, i);
      ls = ls.slice(step);
    }
    i++;
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
    const two = other.next();
    if (one.done || two.done) return;
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
  let i = 0;
  while (true) {
    cur = fn(cur, i);
    yield cur;
    i++;
  }
}

type Functions<T> = {
  all: (fn: (x: T, i: number) => boolean) => boolean;
  any: (fn: (x: T, i: number) => boolean) => boolean;
  associate: <U, V>(fn: (x: T, i: number) => [U, V]) => Map<U, V>;
  associateBy: <U, V>(
    fn: (x: T, i: number) => U,
    fn2?: (x: T, i: number) => V
  ) => Map<U, V>;
  associateByTo: <U, V>(
    map: Map<U, V>,
    fn: (x: T, i: number) => U,
    fn2?: (x: T, i: number) => V
  ) => Map<U, V>;
  associateTo: <U, V>(
    map: Map<U, V>,
    fn: (x: T, i: number) => [U, V]
  ) => Map<U, V>;
  associateWith: <V>(fn: (x: T, i: number) => V) => Map<T, V>;
  associateWithTo: <V>(map: Map<T, V>, fn: (x: T, i: number) => V) => Map<T, V>;
  average: () => number;
  chunked: <V>(n: number, fn?: (x: T[], i: number) => V) => Functions<V>;
  contains: (x: T) => boolean;
  count: (fn?: (y: T, i: number) => boolean) => number;
  distinct: () => Functions<T>;
  distinctBy: <V>(fn: (x: T, i: number) => V) => Functions<T>;
  drop: (n: number) => Functions<T>;
  dropWhile: (fn: (x: T, i: number) => boolean) => Functions<T>;
  elementAt: (i: number) => T;
  elementAtOrElse: (i: number, defaultValue: T) => T;
  elementAtOrNull: (i: number) => T | null;
  filter: (fn: (x: T, i: number) => boolean) => Functions<T>;
  filterNot: (fn: (x: T, i: number) => boolean) => Functions<T>;
  filterNotTo: (xs: T[], fn: (x: T, i: number) => boolean) => T[];
  filterTo: (xs: T[], fn: (x: T, i: number) => boolean) => T[];
  find: (fn: (x: T, i: number) => boolean) => T | null;
  findLast: (fn: (x: T, i: number) => boolean) => T | null;
  first: (fn?: (x: T, i: number) => boolean) => T;
  firstOrNull: (fn?: (x: T, i: number) => boolean) => T | null;
  flatMap: <U>(fn: (x: T, i: number) => U[]) => Functions<U>;
  flatMapTo: <U>(xs: U[], fn: (x: T, i: number) => U[]) => U[];
  flatten: () => Functions<InnerNest<T>>;
  fold: <U>(initial: U, fn: (initial: U, x: T, i: number) => U) => U;
  forEach: (fn: (x: T, i: number) => void) => void;
  generator: Generator<T>;
  groupBy: <U, V>(
    fn: (x: T, i: number) => U,
    fn2?: (x: T, i: number) => V
  ) => Map<U, V[]>;
  groupByTo: <U, V>(
    xs: Map<U, V[]>,
    fn: (x: T, i: number) => U,
    fn2?: (x: T, i: number) => V
  ) => Map<U, V[]>;
  indexOf: (elem: T) => number;
  indexOfFirst: (fn: (x: T, i: number) => boolean) => number;
  indexOfLast: (fn: (x: T, i: number) => boolean) => number;
  joinTo: <V>(
    buffer: string,
    separator?: string,
    prefix?: string,
    postfix?: string,
    limit?: number,
    truncated?: string,
    transform?: (x: T, i: number) => V
  ) => string;
  joinToString: <V>(
    separator?: string,
    prefix?: string,
    postfix?: string,
    limit?: number,
    truncated?: string,
    transform?: (x: T, i: number) => V
  ) => string;
  last: (fn?: (x: T, i: number) => boolean) => T;
  lastIndexOf: (elem: T) => number;
  lastOrNull: (fn?: (x: T, i: number) => boolean) => T | null;
  map: <V>(fn: (x: T, i: number) => V) => Functions<V>;
  mapTo: <V>(xs: V[], fn: (x: T, i: number) => V) => V[];
  max: () => T;
  maxBy: <V>(fn: (x: T, i: number) => V) => T;
  maxByOrNull: <V>(fn: (x: T, i: number) => V) => T | null;
  maxOf: <U>(fn: (x: T, i: number) => U) => U;
  maxOfOrNull: <U>(fn: (x: T, i: number) => U) => U | null;
  maxOfWith: <U>(
    comp: (a: U, b: U) => 0 | 1 | -1,
    fn: (x: T, i: number) => U
  ) => U;
  maxOfWithOrNull: <U>(
    comp: (a: U, b: U) => 0 | 1 | -1,
    fn: (x: T, i: number) => U
  ) => U | null;
  maxOrNull: () => T | null;
  maxWith: (comp: (a: T, b: T) => 0 | 1 | -1) => T;
  maxWithOrNull: (comp: (a: T, b: T) => 0 | 1 | -1) => T | null;
  min: () => T;
  minBy: <V>(fn: (x: T, i: number) => V) => T;
  minByOrNull: <V>(fn: (x: T, i: number) => V) => T | null;
  minOf: <U>(fn: (x: T, i: number) => U) => U;
  minOfOrNull: <U>(fn: (x: T, i: number) => U) => U | null;
  minOfWith: <U>(
    comp: (a: U, b: U) => 0 | 1 | -1,
    fn: (x: T, i: number) => U
  ) => U;
  minOfWithOrNull: <U>(
    comp: (a: U, b: U) => 0 | 1 | -1,
    fn: (x: T, i: number) => U
  ) => U | null;
  minOrNull: () => T | null;
  minus: (elements: T[]) => Functions<T>;
  minusElement: (elem: T) => Functions<T>;
  minWith: (comp: (a: T, b: T) => 0 | 1 | -1) => T;
  minWithOrNull: (comp: (a: T, b: T) => 0 | 1 | -1) => T | null;
  next: () => IteratorResult<T>;
  none: (fn?: (x: T, i: number) => boolean) => boolean;
  onEach: (fn: (x: T, i: number) => T) => Functions<T>;
  partition: (fn: (x: T, i: number) => boolean) => readonly [T[], T[]];
  plus: (elements: Generator<T> | T[]) => Functions<T>;
  plusElement: (elem: T) => Functions<T>;
  reduce: (fn: (acc: T, x: T, i: number) => T) => T;
  reduceOrNull: (fn: (acc: T, x: T, i: number) => T) => T | null;
  return: Generator<T>["return"];
  runningFold: <U>(
    initial: U,
    fn: (initial: U, x: T, i: number) => U
  ) => Functions<U>;
  runningReduce: (fn: (acc: T, x: T, i: number) => T) => Functions<T>;
  scan: <U>(initial: U, fn: (initial: U, x: T, i: number) => U) => Functions<U>;
  single: (fn?: (x: T, i: number) => boolean) => T;
  singleOrNull: (fn?: (x: T, i: number) => boolean) => T | null;
  sum: () => number;
  sumOf: <U>(fn: (x: T, i: number) => U) => number;
  take: (n: number) => Functions<T>;
  takeWhile: (fn: (x: T, i: number) => boolean) => Functions<T>;
  throw: Generator<T>["throw"];
  toArray: () => T[];
  toSet: () => Set<T>;
  unzip: <U>() => readonly [U[], U[]];
  windowed: <U>(
    size: number,
    step?: number,
    partialWindows?: boolean,
    transform?: (x: T[], i: number) => U
  ) => Functions<U>;
  withIndex: () => Functions<{ value: T; index: number }>;
  zip: <R, U>(
    other: Generator<U>,
    fn?: (a: T, b: U, i: number) => R
  ) => Functions<R>;
  zipWithNext: <R>(fn?: (a: T, b: T, i: number) => R) => Functions<R>;
  [Symbol.iterator]: () => Generator<T>;
};

export const generateSequence = <T>(
  seed: T | (() => T),
  fn: (x: T, i: number) => T
) => Sequence(_generateSequence(seed, fn));

export function Sequence<T>(this: any, it: Generator<T> | T[]) {
  let generator: Generator<T>;

  if (Array.isArray(it)) {
    generator = arrToSequence(it);
  } else {
    generator = it;
  }

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
    distinct: () => {
      generator = distinct(generator);
      return fns;
    },
    distinctBy: (fn) => {
      generator = distinctBy(generator, fn);
      return fns;
    },
    drop: (n) => {
      if (n < 0) throw new Error("Negative drop size");
      generator = drop(generator, n);
      return fns;
    },
    dropWhile: (fn) => {
      generator = dropWhile(generator, fn);
      return fns;
    },
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
    filter: (fn) => {
      generator = filter(generator, fn);
      return fns;
    },
    filterNot: (fn) => {
      generator = filter(generator, (x, i) => !fn(x, i));
      return fns;
    },
    filterNotTo: (xs, fn) => {
      generator = filter(generator, (x, i) => !fn(x, i));
      for (const x of generator) {
        xs.push(x);
      }

      return xs;
    },
    filterTo: (xs, fn) => {
      generator = filter(generator, fn);
      for (const x of generator) {
        xs.push(x);
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
      generator = dropWhile(generator, (x, i) => !fn(x, i));
      const { value, done } = generator.next();

      if (done) throw new Error("Empty sequence");
      return value;
    },
    firstOrNull: (fn = () => true) => {
      generator = dropWhile(generator, (x, i) => !fn(x, i));
      const { value, done } = generator.next();

      if (done) return null;
      return value;
    },
    flatMap: (fn) => {
      const gn = flatMap(generator, fn);
      return Sequence(gn);
    },
    flatMapTo: (xs, fn) => {
      const gn = flatMap(generator, fn);
      for (const x of gn) {
        xs.push(x);
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
    generator: generator,
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
          const y = xs.get(key)!;
          xs.set(key, [...y, fn2(x, i)]);
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
      const gn = map(generator, fn);
      for (const x of gn) {
        xs.push(x);
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
      let max: U | null = null;
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

      return max;
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
          if (comp(max!, transform) === 1) {
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
          if (comp(max!, x) === 1) {
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
          if (comp(max!, x) === 1) {
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
      let min: U | null = null;
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

      return min;
    },
    minOfWith: <U>(
      comp: (a: U, b: U) => 0 | 1 | -1,
      fn: (x: T, i: number) => U
    ) => {
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
          if (comp(min!, transform) === -1) {
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
      generator = filter(generator, (x) => !elements.includes(x));
      return fns;
    },
    minusElement: (elem) => {
      let found = false;
      generator = filter(generator, (x) => {
        if (x === elem && !found) {
          found = true;
          return false;
        }
        return true;
      });
      return fns;
    },
    minWith: (comp) => {
      let min = undefined;
      let i = 0;

      for (const x of generator) {
        if (i === 0) {
          min = x;
        } else {
          if (comp(min!, x) === -1) {
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
          if (comp(min!, x) === -1) {
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
    onEach: (fn) => {
      generator = onEach(generator, fn);
      return fns;
    },
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
    plus: (elements) => {
      generator = plus(generator, elements);
      return fns;
    },
    plusElement: (elem) => {
      generator = plus(generator, [elem]);
      return fns;
    },
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
      let acc: T | null = null;
      let i = 0;
      for (const x of generator) {
        if (i === 0) {
          acc = x;
        } else {
          acc = fn(acc!, x, i);
        }
        i++;
      }

      return acc;
    },
    return: generator.return.bind(generator),
    runningFold: (initial, fn) => {
      const gn = fold(generator, initial, fn);
      return Sequence(gn);
    },
    runningReduce: (fn) => {
      generator = reduce(generator, fn);
      return fns;
    },
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
        sum += x as number;
      }
      return sum;
    },
    sumOf: (fn) => {
      let sum = 0;
      let i = 0;
      for (const x of generator) {
        sum += fn(x, i) as number;
        i++;
      }
      return sum;
    },
    take: (n) => {
      if (n < 0) throw new Error("n out of bounds");
      generator = take(generator, n);
      return fns;
    },
    takeWhile: (fn) => {
      generator = takeWhile(generator, fn);
      return fns;
    },
    throw: generator.throw.bind(generator),
    toArray: () => [...generator],
    toSet: () => {
      const set = new Set<T>();
      for (const x of generator) {
        set.add(x);
      }
      return set;
    },
    unzip: <U>() => {
      const one: U[] = [];
      const two: U[] = [];

      for (const x of generator) {
        one.push((x as U[])[0]!);
        two.push((x as U[])[1]!);
      }

      return [one, two] as const;
    },
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
    }
  };

  return fns;
}

function* arrToSequence<T>(arr: T[]) {
  for (const x of arr) {
    yield x;
  }
}

type InnerNest<T> =
  T extends Array<infer U> ? U : T extends Generator<infer V> ? V : never;
