# `@bcd00/sequences`

A micro-library that brings **Kotlin-style lazy `Sequence`** operations to JavaScript and TypeScript. It wraps arrays or
generators in a chainable, lazily-evaluated API with ~60 collection-processing methods.

## What it does

JavaScript arrays are eagerly evaluated — every `map`, `filter`, or `slice` creates a full intermediate copy. Kotlin's
`Sequence` solves this by chaining operations on an iterator and only running them when a terminal operation (like
`toArray()` or `first()`) is called. This library provides exactly that model for JS:

- **Lazy chaining** — intermediate operations (`map`, `filter`, `take`, `drop`, etc.) return new `Sequence` wrappers
  without iterating.
- **Single-pass evaluation** — terminal operations drive the underlying generator once, fusing the entire chain.
- **Works with arrays *and* generators** — pass either to `Sequence()`.

## Inspiration from Kotlin

This library is heavily inspired by [Kotlin's `Sequence`](https://kotlinlang.org/docs/sequences.html) API. Many method
names, signatures, and behaviours are direct ports:

| Kotlin                                                          | This library                                                     |
|-----------------------------------------------------------------|------------------------------------------------------------------|
| `sequenceOf(1, 2, 3).map { it + 1 }.filter { it > 2 }.toList()` | `Sequence([1,2,3]).map(x => x + 1).filter(x => x > 2).toArray()` |
| `generateSequence(1) { it + 1 }.take(5).toList()`               | `generateSequence(1, x => x + 1).take(5).toArray()`              |
| `sequence.chunked(2)`                                           | `Sequence([...]).chunked(2)`                                     |
| `sequence.runningFold(0) { acc, x -> acc + x }`                 | `Sequence([...]).runningFold(0, (acc, x) => acc + x)`            |

## Installation

```bash
npm install @bcd00/sequences
```

```bash
yarn add @bcd00/sequences
```

```bash
pnpm add @bcd00/sequences
```

### Requirements

- **Node.js >= 22**
- **ESM only** — the package exports an ES module (`"type": "module"`).

## Usage

```typescript
import { Sequence, generateSequence } from "@bcd00/sequences";

// From an array
const evens = Sequence([1, 2, 3, 4, 5])
  .filter((x) => x % 2 === 0)
  .map((x) => x * 10)
  .toArray();
// => [20, 40]

// From a generator (infinite, lazy)
const firstFiveSquares = generateSequence(1, (x) => x + 1)
  .map((x) => x * x)
  .take(5)
  .toArray();
// => [1, 4, 9, 16, 25]

// for...of iteration
for (const value of Sequence(["a", "b", "c"]).map((s) => s.toUpperCase())) {
  console.log(value); // "A", "B", "C"
}
```

## Running / developing this repository

```bash
# install dependencies
pnpm install

# run the test suite (with coverage)
pnpm test

# lint
pnpm lint

# typecheck
pnpm typecheck

# build (TypeScript -> dist/)
pnpm build

# full CI pipeline
pnpm ci
```

---

## API Reference

All methods are divided into **intermediate** (lazy, return a new `Sequence`) and **terminal** (eager, consume the
sequence).

### Creating a sequence

| Function                                                                  | Description                                                        |
|---------------------------------------------------------------------------|--------------------------------------------------------------------|
| `Sequence<T>(items: T[] \| Generator<T>)`                                 | Wraps an array or generator in a `Sequence`.                       |
| `generateSequence<T>(seed: T \| (() => T), next: (x: T, i: number) => T)` | Builds an infinite sequence from a seed and a next-value function. |

### Intermediate operations (lazy)

| Method                                                                                                           | Description                                                   |
|------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------|
| `.map<U>(fn: (x: T, i: number) => U)`                                                                            | Transforms each element.                                      |
| `.filter(fn: (x: T, i: number) => boolean)`                                                                      | Keeps elements that satisfy the predicate.                    |
| `.filterNot(fn: (x: T, i: number) => boolean)`                                                                   | Keeps elements that **do not** satisfy the predicate.         |
| `.take(n: number)`                                                                                               | Returns the first `n` elements.                               |
| `.takeWhile(fn: (x: T, i: number) => boolean)`                                                                   | Returns elements while the predicate is satisfied.            |
| `.drop(n: number)`                                                                                               | Skips the first `n` elements.                                 |
| `.dropWhile(fn: (x: T, i: number) => boolean)`                                                                   | Skips elements while the predicate is satisfied.              |
| `.distinct()`                                                                                                    | Removes duplicate elements (strict equality via `Set`).       |
| `.distinctBy<U>(fn: (x: T, i: number) => U)`                                                                     | Removes duplicates based on a selector.                       |
| `.flatMap<U>(fn: (x: T, i: number) => U[])`                                                                      | Maps each element to an array and flattens the result.        |
| `.flatten()`                                                                                                     | Flattens a sequence of arrays or generators.                  |
| `.chunked<U>(n: number, transform?: (chunk: T[], i: number) => U)`                                               | Groups elements into chunks of size `n`.                      |
| `.windowed<U>(size: number, step?: number, partialWindows?: boolean, transform?: (window: T[], i: number) => U)` | Returns sliding windows of the given size.                    |
| `.zip<U, R>(other: Generator<U>, transform?: (a: T, b: U, i: number) => R)`                                      | Zips with another generator, optionally applying a transform. |
| `.zipWithNext<R>(transform?: (a: T, b: T, i: number) => R)`                                                      | Zips each element with its successor.                         |
| `.withIndex()`                                                                                                   | Returns `{ value: T, index: number }` objects.                |
| `.plus(elements: Generator<T> \| T[])`                                                                           | Appends elements to the sequence.                             |
| `.plusElement(elem: T)`                                                                                          | Appends a single element.                                     |
| `.minus(elements: T[])`                                                                                          | Removes all occurrences of the given elements.                |
| `.minusElement(elem: T)`                                                                                         | Removes the first occurrence of the given element.            |
| `.onEach(fn: (x: T, i: number) => void)`                                                                         | Performs a side-effect and returns the original sequence.     |
| `.runningFold<U>(initial: U, fn: (acc: U, x: T, i: number) => U)`                                                | Returns intermediate fold results, starting with `initial`.   |
| `.runningReduce(fn: (acc: T, x: T, i: number) => T)`                                                             | Returns intermediate reduce results.                          |
| `.scan<U>(initial: U, fn: (acc: U, x: T, i: number) => U)`                                                       | Alias for `runningFold`.                                      |

### Terminal operations (eager)

| Method                                                                           | Description                                                                |
|----------------------------------------------------------------------------------|----------------------------------------------------------------------------|
| `.toArray()`                                                                     | Collects all elements into an array.                                       |
| `.toSet()`                                                                       | Collects all elements into a `Set`.                                        |
| `.forEach(fn: (x: T, i: number) => void)`                                        | Iterates over each element.                                                |
| `.count(fn?: (x: T, i: number) => boolean)`                                      | Counts elements (total, or matching a predicate).                          |
| `.first(fn?: (x: T, i: number) => boolean)`                                      | Returns the first (matching) element. Throws if empty.                     |
| `.firstOrNull(fn?: (x: T, i: number) => boolean)`                                | Returns the first (matching) element, or `null`.                           |
| `.last(fn?: (x: T, i: number) => boolean)`                                       | Returns the last (matching) element. Throws if empty.                      |
| `.lastOrNull(fn?: (x: T, i: number) => boolean)`                                 | Returns the last (matching) element, or `null`.                            |
| `.single(fn?: (x: T, i: number) => boolean)`                                     | Returns the single matching element. Throws if zero or multiple matches.   |
| `.singleOrNull(fn?: (x: T, i: number) => boolean)`                               | Returns the single matching element, or `null` if zero or multiple.        |
| `.find(fn: (x: T, i: number) => boolean)`                                        | Returns the first matching element, or `null`.                             |
| `.findLast(fn: (x: T, i: number) => boolean)`                                    | Returns the last matching element, or `null`.                              |
| `.elementAt(i: number)`                                                          | Returns the element at index `i`. Throws if out of bounds.                 |
| `.elementAtOrElse(i: number, defaultValue: T)`                                   | Returns the element at index `i`, or `defaultValue`.                       |
| `.elementAtOrNull(i: number)`                                                    | Returns the element at index `i`, or `null`.                               |
| `.indexOf(elem: T)`                                                              | Returns the first index of the element, or `-1`.                           |
| `.lastIndexOf(elem: T)`                                                          | Returns the last index of the element, or `-1`.                            |
| `.indexOfFirst(fn: (x: T, i: number) => boolean)`                                | Returns the first index matching the predicate, or `-1`.                   |
| `.indexOfLast(fn: (x: T, i: number) => boolean)`                                 | Returns the last index matching the predicate, or `-1`.                    |
| `.contains(elem: T)`                                                             | Returns `true` if the sequence contains the element (strict equality).     |
| `.any(fn: (x: T, i: number) => boolean)`                                         | Returns `true` if any element satisfies the predicate.                     |
| `.all(fn: (x: T, i: number) => boolean)`                                         | Returns `true` if every element satisfies the predicate.                   |
| `.none(fn?: (x: T, i: number) => boolean)`                                       | Returns `true` if no elements satisfy the predicate.                       |
| `.fold<U>(initial: U, fn: (acc: U, x: T, i: number) => U)`                       | Accumulates a value from left to right.                                    |
| `.reduce(fn: (acc: T, x: T, i: number) => T)`                                    | Accumulates using the first element as the initial value. Throws if empty. |
| `.reduceOrNull(fn: (acc: T, x: T, i: number) => T)`                              | Like `reduce`, but returns `null` if empty.                                |
| `.average()`                                                                     | Returns the arithmetic mean. Throws on empty or non-numeric sequences.     |
| `.sum()`                                                                         | Returns the sum of all numeric elements.                                   |
| `.sumOf<U>(fn: (x: T, i: number) => U)`                                          | Returns the sum of values returned by the selector.                        |
| `.min()`                                                                         | Returns the smallest element (natural ordering). Throws if empty.          |
| `.minOrNull()`                                                                   | Like `min`, but returns `null` if empty.                                   |
| `.max()`                                                                         | Returns the largest element (natural ordering). Throws if empty.           |
| `.maxOrNull()`                                                                   | Like `max`, but returns `null` if empty.                                   |
| `.minBy<U>(fn: (x: T, i: number) => U)`                                          | Returns the element with the smallest selector value.                      |
| `.minByOrNull<U>(fn: (x: T, i: number) => U)`                                    | Like `minBy`, but returns `null` if empty.                                 |
| `.maxBy<U>(fn: (x: T, i: number) => U)`                                          | Returns the element with the largest selector value.                       |
| `.maxByOrNull<U>(fn: (x: T, i: number) => U)`                                    | Like `maxBy`, but returns `null` if empty.                                 |
| `.minOf<U>(fn: (x: T, i: number) => U)`                                          | Returns the smallest value produced by the selector.                       |
| `.minOfOrNull<U>(fn: (x: T, i: number) => U)`                                    | Like `minOf`, but returns `null` if empty.                                 |
| `.maxOf<U>(fn: (x: T, i: number) => U)`                                          | Returns the largest value produced by the selector.                        |
| `.maxOfOrNull<U>(fn: (x: T, i: number) => U)`                                    | Like `maxOf`, but returns `null` if empty.                                 |
| `.minWith(comp: (a: T, b: T) => 0 \| 1 \| -1)`                                   | Returns the smallest element using a custom comparator.                    |
| `.minWithOrNull(comp: (a: T, b: T) => 0 \| 1 \| -1)`                             | Like `minWith`, but returns `null` if empty.                               |
| `.maxWith(comp: (a: T, b: T) => 0 \| 1 \| -1)`                                   | Returns the largest element using a custom comparator.                     |
| `.maxWithOrNull(comp: (a: T, b: T) => 0 \| 1 \| -1)`                             | Like `maxWith`, but returns `null` if empty.                               |
| `.minOfWith<U>(comp: (a: U, b: U) => 0 \| 1 \| -1, fn: (x: T, i: number) => U)`  | Like `minOf` with a custom comparator.                                     |
| `.minOfWithOrNull<U>(...)`                                                       | Like `minOfWith`, but returns `null` if empty.                             |
| `.maxOfWith<U>(comp: (a: U, b: U) => 0 \| 1 \| -1, fn: (x: T, i: number) => U)`  | Like `maxOf` with a custom comparator.                                     |
| `.maxOfWithOrNull<U>(...)`                                                       | Like `maxOfWith`, but returns `null` if empty.                             |
| `.partition(fn: (x: T, i: number) => boolean)`                                   | Splits into `[matching, notMatching]`.                                     |
| `.groupBy<U, V>(fn: (x: T, i: number) => U, fn2?: (x: T, i: number) => V)`       | Groups elements by a key selector into a `Map`.                            |
| `.groupByTo<U, V>(map: Map<U, V[]>, ...)`                                        | Populates an existing `Map` by grouping.                                   |
| `.associate<U, V>(fn: (x: T, i: number) => [U, V])`                              | Builds a `Map` from `[key, value]` pairs.                                  |
| `.associateBy<U, V>(fn: (x: T, i: number) => U, fn2?: (x: T, i: number) => V)`   | Builds a `Map` using a key selector.                                       |
| `.associateByTo<U, V>(map, ...)`                                                 | Populates an existing `Map` using a key selector.                          |
| `.associateTo<U, V>(map, ...)`                                                   | Populates an existing `Map` from `[key, value]` pairs.                     |
| `.associateWith<V>(fn: (x: T, i: number) => V)`                                  | Builds a `Map<T, V>` where each element is the key.                        |
| `.associateWithTo<V>(map, ...)`                                                  | Populates an existing `Map<T, V>`.                                         |
| `.joinToString(separator?, prefix?, postfix?, limit?, truncated?, transform?)`   | Returns a formatted string of all elements.                                |
| `.joinTo(buffer, separator?, prefix?, postfix?, limit?, truncated?, transform?)` | Appends a formatted representation to a string buffer.                     |
| `.unzip()`                                                                       | Splits a sequence of pairs into a pair of arrays.                          |

### Mutation helpers

These append results into an existing array rather than creating a new one:

| Method                                                    | Description                            |
|-----------------------------------------------------------|----------------------------------------|
| `.mapTo<U>(xs: U[], fn: (x: T, i: number) => U)`          | Appends mapped elements to `xs`.       |
| `.filterTo(xs: T[], fn: (x: T, i: number) => boolean)`    | Appends matching elements to `xs`.     |
| `.filterNotTo(xs: T[], fn: (x: T, i: number) => boolean)` | Appends non-matching elements to `xs`. |
| `.flatMapTo<U>(xs: U[], fn: (x: T, i: number) => U[])`    | Appends flattened elements to `xs`.    |

### Generator access

| Property / Method     | Description                                   |
|-----------------------|-----------------------------------------------|
| `.generator`          | The underlying `Generator<T>`.                |
| `.next()`             | Returns the next `IteratorResult<T>`.         |
| `[Symbol.iterator]()` | Returns the generator for `for...of` loops.   |
| `.return(...)`        | Delegates to the generator's `return` method. |
| `.throw(...)`         | Delegates to the generator's `throw` method.  |

---

## Examples

### Lazy infinite sequences

```typescript
import { generateSequence } from "@bcd00/sequences";

const powersOfTwo = generateSequence(1, (x) => x * 2);
const firstTen = powersOfTwo.take(10).toArray();
// => [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024]
```

### Windowed operations

```typescript
import { Sequence } from "@bcd00/sequences";

const movingAverages = Sequence([1, 2, 3, 4, 5])
  .windowed(3, 1, false, (xs) => xs.reduce((a, b) => a + b, 0) / xs.length)
  .toArray();
// => [2, 3, 4]
```

### Grouping and association

```typescript
import { Sequence } from "@bcd00/sequences";

const people = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
  { name: "Charlie", age: 30 }
];

const byAge = Sequence(people).groupBy((p) => p.age);
// Map { 30 => [Alice, Charlie], 25 => [Bob] }

const nameToAge = Sequence(people).associateWith((p) => p.age);
// Map { {name:"Alice"...} => 30, ... }
```

### Partitioning

```typescript
const [evens, odds] = Sequence([1, 2, 3, 4, 5]).partition((x) => x % 2 === 0);
// evens => [2, 4]
// odds  => [1, 3, 5]
```

---

## License

MIT
