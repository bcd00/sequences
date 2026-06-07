import { Sequence } from "../index.js";
import { assert, describe, test } from "vitest";

describe("chunked", () => {
  test("chunkedZero", () => {
    const seq = Sequence([0, 1, 2, 3]);
    assert.throw(
      () => seq.chunked(0).toArray(),
      "chunk size must be greater than zero"
    );
  });

  test("chunkedNegative", () => {
    const seq = Sequence([0, 1, 2, 3]);
    assert.throw(
      () => seq.chunked(-1).toArray(),
      "chunk size must be greater than zero"
    );
  });

  test("chunkedEqualSize", () => {
    const seq = Sequence([0, 1, 2, 3]);
    const val = seq.chunked(2).toArray();
    assert.deepEqual(val, [
      [0, 1],
      [2, 3]
    ]);
  });

  test("chunkedPartial", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.chunked(2).toArray();
    assert.deepEqual(val, [[0, 1], [2]]);
  });

  test("chunkedEqualSizeWithTransform", () => {
    const seq = Sequence([0, 1, 2, 3]);
    const val = seq.chunked(2, (x) => Math.max(...x)).toArray();
    assert.deepEqual(val, [1, 3]);
  });

  test("chunkedEqualSizeWithTransformWithIndex", () => {
    const seq = Sequence([0, 1, 2, 3]);
    const val = seq.chunked(2, (x, i) => Math.max(...x) + i).toArray();
    assert.deepEqual(val, [1, 4]);
  });

  test("chunkedPartialWithTransform", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.chunked(2, (x) => Math.max(...x)).toArray();
    assert.deepEqual(val, [1, 2]);
  });

  test("chunkedPartialWithTransformWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.chunked(2, (x, i) => Math.max(...x) + i).toArray();
    assert.deepEqual(val, [1, 3]);
  });
});

describe("flatMap", () => {
  test("flatMap", () => {
    const seq = Sequence([
      [0, 1],
      [2, 3]
    ]);
    const val = seq.flatMap((xs) => xs.slice(0, 1)).toArray();
    assert.deepEqual(val, [0, 2]);
  });

  test("flatMapWithoutNesting", () => {
    const seq = Sequence([0, 1, 2]);
    assert.throw(
      // @ts-expect-error TS2322
      () => seq.flatMap((xs) => xs).toArray(),
      "transform is not iterable"
    );
  });

  test("flatMapWithIndex", () => {
    const seq = Sequence([
      [0, 1],
      [2, 3]
    ]);
    const val = seq
      .flatMap((xs, i) => xs.slice(0, 1).map((x) => x + i))
      .toArray();
    assert.deepEqual(val, [0, 3]);
  });

  test("flatMapWithIterable", () => {
    const seq = Sequence([1, 2]);
    const val = seq.flatMap((x) => new Set([x, x + 1])).toArray();
    assert.deepEqual(val, [1, 2, 2, 3]);
  });
});

describe("flatMapTo", () => {
  test("flatMapTo", () => {
    const seq = Sequence([
      [0, 1],
      [2, 3]
    ]);
    const xs = [49];
    const val = seq.flatMapTo(xs, (ys) => ys.slice(0, 1));
    assert.deepEqual(val, [49, 0, 2]);
    assert.deepEqual(xs, [49, 0, 2]);
  });

  test("flatMapToWithoutNesting", () => {
    const seq = Sequence([0, 1, 2]);
    const xs = [49];
    assert.throw(
      // @ts-expect-error TS2322
      () => seq.flatMapTo(xs, (ys) => ys),
      "transform is not iterable",
      () => assert.deepEqual(xs, [49])
    );
  });

  test("flatMapToWithIndex", () => {
    const seq = Sequence([
      [0, 1],
      [2, 3]
    ]);
    const xs = [49];
    const val = seq.flatMapTo(xs, (ys, i) => ys.slice(0, 1).map((x) => x + i));
    assert.deepEqual(val, [49, 0, 3]);
    assert.deepEqual(xs, [49, 0, 3]);
  });

  test("flatMapToWithIterable", () => {
    const seq = Sequence([1, 2]);
    const xs: number[] = [];
    const val = seq.flatMapTo(xs, (x) => new Set([x, x + 1]));
    assert.deepEqual(val, [1, 2, 2, 3]);
    assert.deepEqual(xs, [1, 2, 2, 3]);
  });
});

describe("flatten", () => {
  test("flatten", () => {
    const seq = Sequence([
      [0, 1],
      [2, 3]
    ]);
    const val = seq.flatten().toArray();
    assert.deepEqual(val, [0, 1, 2, 3]);
  });

  test("flattenWithoutNesting", () => {
    const seq = Sequence([0, 1, 2]);
    assert.throw(() => seq.flatten().toArray(), "Item is not iterable");
  });
});

describe("map", () => {
  test("map", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.map((x) => x + 1).toArray();
    assert.deepEqual(val, [1, 2, 3]);
  });

  test("mapWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.map((x, i) => x + i).toArray();
    assert.deepEqual(val, [0, 2, 4]);
  });

  test("mapEmpty", () => {
    const seq = Sequence<number>([]);
    const val = seq.map((x) => x + 1).toArray();
    assert.deepEqual(val, []);
  });

  test("mapDoesNotTransformCompletionValue", () => {
    function* gen() {
      yield 1;
      return 999;
    }
    const mapped = Sequence(gen()).map((x) => x * 2);
    assert.deepEqual(mapped.next(), { value: 2, done: false });
    assert.deepEqual(mapped.next(), { value: undefined, done: true });
  });
});

describe("mapTo", () => {
  test("mapTo", () => {
    const seq = Sequence([0, 1, 2]);
    const xs = [49];
    const val = seq.mapTo(xs, (x) => x + 1);
    assert.deepEqual(val, [49, 1, 2, 3]);
    assert.deepEqual(xs, [49, 1, 2, 3]);
  });

  test("mapToWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const xs = [49];
    const val = seq.mapTo(xs, (x, i) => x + i);
    assert.deepEqual(val, [49, 0, 2, 4]);
    assert.deepEqual(xs, [49, 0, 2, 4]);
  });
});

describe("onEach", () => {
  test("onEach", () => {
    const seq = Sequence([0, 1, 2]);
    let i = 0;
    const val = seq.onEach((x) => (i += x)).toArray();
    assert.equal(i, 3);
    assert.deepEqual(val, [0, 1, 2]);
  });

  test("onEachWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    let i = 0;
    const val = seq.onEach((x, j) => (i += x + j)).toArray();
    assert.equal(i, 6);
    assert.deepEqual(val, [0, 1, 2]);
  });

  test("onEachEmpty", () => {
    const seq = Sequence<number>([]);
    let i = 0;
    const val = seq.onEach((x) => (i += x)).toArray();
    assert.equal(i, 0);
    assert.deepEqual(val, []);
  });
});

describe("plus", () => {
  test("plusArr", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.plus([3, 4]).toArray();
    assert.deepEqual(val, [0, 1, 2, 3, 4]);
  });

  test("plusSeq", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.plus(Sequence([3, 4])).toArray();
    assert.deepEqual(val, [0, 1, 2, 3, 4]);
  });

  test("plusEmptyArr", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.plus([]).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });

  test("plusEmptySeq", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.plus(Sequence([])).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });

  test("plusArrToEmpty", () => {
    const seq = Sequence<number>([]);
    const val = seq.plus([0, 1, 2]).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });

  test("plusSeqToEmpty", () => {
    const seq = Sequence<number>([]);
    const val = seq.plus(Sequence([0, 1, 2])).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });
});

describe("plusElement", () => {
  test("plusElement", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.plusElement(3).toArray();
    assert.deepEqual(val, [0, 1, 2, 3]);
  });

  test("plusElementToEmpty", () => {
    const seq = Sequence<number>([]);
    const val = seq.plusElement(3).toArray();
    assert.deepEqual(val, [3]);
  });
});

describe("windowed", () => {
  test("windowedStepZero", () => {
    const seq = Sequence([0, 1, 2, 3]);
    assert.throw(
      () => seq.windowed(2, 0).toArray(),
      "step must be greater than zero"
    );
  });

  test("windowedSizeZero", () => {
    const seq = Sequence([0, 1, 2, 3]);
    assert.throw(
      () => seq.windowed(0).toArray(),
      "window size must be greater than zero"
    );
  });

  test("windowed", () => {
    const seq = Sequence([0, 1, 2, 3, 4, 5]);
    const val = seq.windowed(3).toArray();
    assert.deepEqual(val, [
      [0, 1, 2],
      [1, 2, 3],
      [2, 3, 4],
      [3, 4, 5]
    ]);
  });

  test("windowedStep", () => {
    const seq = Sequence([0, 1, 2, 3, 4, 5]);
    const val = seq.windowed(3, 2).toArray();
    assert.deepEqual(val, [
      [0, 1, 2],
      [2, 3, 4]
    ]);
  });

  test("windowedPartial", () => {
    const seq = Sequence([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const val = seq.windowed(5, 3, true).toArray();
    assert.deepEqual(val, [
      [1, 2, 3, 4, 5],
      [4, 5, 6, 7, 8],
      [7, 8, 9, 10],
      [10]
    ]);
  });

  test("windowedPartialComplete", () => {
    const seq = Sequence([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const val = seq.windowed(5, 3, true).toArray();
    assert.deepEqual(val, [
      [1, 2, 3, 4, 5],
      [4, 5, 6, 7, 8],
      [7, 8, 9, 10, 11],
      [10, 11, 12]
    ]);
  });

  test("windowedTransform", () => {
    const seq = Sequence([0, 1, 2, 3, 4, 5]);
    const val = seq
      .windowed(
        3,
        2,
        undefined,
        (xs) => xs.reduce((acc, x) => acc + x, 0) / xs.length
      )
      .toArray();
    assert.deepEqual(val, [1, 3]);
  });

  test("windowedPartialEmpty", () => {
    const seq = Sequence<number>([]);
    const val = seq.windowed(3, 1, true).toArray();
    assert.deepEqual(val, []);
  });

  test("windowedTransformWithIndex", () => {
    const seq = Sequence([0, 1, 2, 3, 4, 5]);
    const val = seq
      .windowed(
        3,
        2,
        undefined,
        (xs, i) => xs.reduce((acc, x) => acc + x + i, 0) / xs.length
      )
      .toArray();
    assert.deepEqual(val, [1, 4]);
  });

  test("windowedPartialWithTransformWithIndex", () => {
    const seq = Sequence([1, 2, 3, 4, 5]);
    const val = seq.windowed(3, 2, true, (xs, i) => [xs, i] as const).toArray();
    assert.deepEqual(val, [
      [[1, 2, 3], 0],
      [[3, 4, 5], 1],
      [[5], 2]
    ]);
  });
});

describe("withIndex", () => {
  test("withIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.withIndex().toArray();
    assert.deepEqual(val, [
      { value: 0, index: 0 },
      { value: 1, index: 1 },
      { value: 2, index: 2 }
    ]);
  });

  test("withIndexEmpty", () => {
    const seq = Sequence<number>([]);
    const val = seq.withIndex().toArray();
    assert.deepEqual(val, []);
  });
});

describe("zip", () => {
  test("zipEqual", () => {
    const seq = Sequence([0, 1, 2]);
    const seq2 = Sequence([3, 4, 5]);
    const val = seq.zip(seq2).toArray();
    assert.deepEqual(val, [
      [0, 3],
      [1, 4],
      [2, 5]
    ]);
  });

  test("zipUnequal", () => {
    const seq = Sequence([0, 1, 2]);
    const seq2 = Sequence([3, 4]);
    const val = seq.zip(seq2).toArray();
    assert.deepEqual(val, [
      [0, 3],
      [1, 4]
    ]);
  });

  test("zipWithTransform", () => {
    const seq = Sequence([0, 1, 2]);
    const seq2 = Sequence([3, 4, 5]);
    const val = seq.zip(seq2, (a, b) => [a + b, a + b]).toArray();
    assert.deepEqual(val, [
      [3, 3],
      [5, 5],
      [7, 7]
    ]);
  });

  test("zipWithTransformWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const seq2 = Sequence([3, 4, 5]);
    const val = seq.zip(seq2, (a, b, i) => [a + i, b + i]).toArray();
    assert.deepEqual(val, [
      [0, 3],
      [2, 5],
      [4, 7]
    ]);
  });

  test("zipEmpty", () => {
    const seq = Sequence<number>([]);
    const seq2 = Sequence([3, 4, 5]);
    const val = seq.zip(seq2).toArray();
    assert.deepEqual(val, []);
  });

  test("zipDoesNotOverconsume", () => {
    function* gen() {
      yield 3;
      yield 4;
      yield 5;
    }
    const seq = Sequence([0, 1]);
    const seq2 = Sequence(gen());
    const val = seq.zip(seq2).toArray();
    assert.deepEqual(val, [
      [0, 3],
      [1, 4]
    ]);
    const remaining = seq2.toArray();
    assert.deepEqual(remaining, [5]);
  });
});

describe("zipWithNext", () => {
  test("zipWithNextEqual", () => {
    const seq = Sequence([0, 1, 2, 3]);
    const val = seq.zipWithNext().toArray();
    assert.deepEqual(val, [
      [0, 1],
      [2, 3]
    ]);
  });

  test("zipWithNextUnequal", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.zipWithNext().toArray();
    assert.deepEqual(val, [[0, 1]]);
  });

  test("zipWithNextWithTransform", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.zipWithNext((a, b) => a + b / 2).toArray();
    assert.deepEqual(val, [0.5]);
  });

  test("zipWithNextWithTransformWithIndex", () => {
    const seq = Sequence([0, 1, 2, 3]);
    const val = seq.zipWithNext((a, b, i) => a + b / 2 + i).toArray();
    assert.deepEqual(val, [0.5, 4.5]);
  });

  test("zipWithNextEmpty", () => {
    const seq = Sequence<number>([]);
    const val = seq.zipWithNext().toArray();
    assert.deepEqual(val, []);
  });
});

describe("unzip", () => {
  test("unzip", () => {
    const seq = Sequence([
      [0, 3],
      [1, 4],
      [2, 5]
    ]);
    const [one, two] = seq.unzip();
    assert.deepEqual(one, [0, 1, 2]);
    assert.deepEqual(two, [3, 4, 5]);
  });

  test("unzipUnequal", () => {
    const seq = Sequence([[0, 3], [1, 4], [2]]);
    const [one, two] = seq.unzip();
    assert.deepEqual(one, [0, 1, 2]);
    assert.deepEqual(two, [3, 4, undefined]);
  });

  test("unzipEmpty", () => {
    const seq = Sequence<number>([]);
    const [one, two] = seq.unzip();
    assert.deepEqual(one, []);
    assert.deepEqual(two, []);
  });
});
