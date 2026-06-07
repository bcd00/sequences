import { generateSequence, Sequence } from "../index.js";
import { assert, describe, test } from "vitest";

describe("distinct", () => {
  test("distinct", () => {
    const seq = Sequence([0, 1, 2, 0, 1, 2]);
    const val = seq.distinct().toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });

  test("distinctDoesNotReturnCompletionValue", () => {
    function* gen() {
      yield 1;
      return 999;
    }
    const distinct = Sequence(gen()).distinct();
    assert.deepEqual(distinct.generator.next(), { value: 1, done: false });
    assert.deepEqual(distinct.generator.next(), { value: undefined, done: true });
  });
});

describe("distinctBy", () => {
  test("distinctBy", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.distinctBy((x) => Math.max(x, 1)).toArray();
    assert.deepEqual(val, [0, 2]);
  });

  test("distinctByWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.distinctBy((x, i) => Math.max(x * x - i, 1)).toArray();
    assert.deepEqual(val, [0, 2]);
  });
});

describe("drop", () => {
  test("drop", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.drop(2).toArray();
    assert.deepEqual(val, [2]);
  });

  test("dropZero", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.drop(0).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });

  test("dropNegative", () => {
    const seq = Sequence([0, 1, 2]);
    assert.throw(() => seq.drop(-1).toArray(), "Negative drop size");
  });

  test("dropAll", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.drop(3).toArray();
    assert.deepEqual(val, []);
  });

  test("dropDoesNotReturnCompletionValue", () => {
    function* gen() {
      yield 1;
      return 999;
    }
    const dropped = Sequence(gen()).drop(0);
    assert.deepEqual(dropped.generator.next(), { value: 1, done: false });
    assert.deepEqual(dropped.generator.next(), { value: undefined, done: true });
  });
});

describe("dropWhile", () => {
  test("dropWhile", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.dropWhile((x) => x < 2).toArray();
    assert.deepEqual(val, [2]);
  });

  test("dropWhileWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.dropWhile((x, i) => x + i < 2).toArray();
    assert.deepEqual(val, [1, 2]);
  });

  test("dropWhileAll", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.dropWhile((x) => x < 3).toArray();
    assert.deepEqual(val, []);
  });

  test("dropWhileAllWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.dropWhile((x, i) => x + i < 5).toArray();
    assert.deepEqual(val, []);
  });

  test("dropWhileNone", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.dropWhile((x) => x < 0).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });

  test("dropWhileNoneWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.dropWhile((x, i) => x + i < 0).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });
});

describe("filter", () => {
  test("filter", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.filter((x) => x > 1).toArray();
    assert.deepEqual(val, [2]);
  });

  test("filterWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.filter((_x, i) => i > 1).toArray();
    assert.deepEqual(val, [2]);
  });

  test("filterEmpty", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.filter((x) => x > 4).toArray();
    assert.deepEqual(val, []);
  });

  test("filterAll", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.filter((x) => x >= 0).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });
});

describe("filterNot", () => {
  test("filterNot", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.filterNot((x) => x > 1).toArray();
    assert.deepEqual(val, [0, 1]);
  });

  test("filterNotWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.filterNot((_x, i) => i === 0).toArray();
    assert.deepEqual(val, [1, 2]);
  });

  test("filterNotEmpty", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.filterNot((x) => x < 3).toArray();
    assert.deepEqual(val, []);
  });

  test("filterNotAll", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.filterNot((x) => x > 3).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });
});

describe("filterNotTo", () => {
  test("filterNotTo", () => {
    const xs = [49];
    const seq = Sequence([0, 1, 2]);
    const val = seq.filterNotTo(xs, (x) => x > 3);
    assert.deepEqual(val, [49, 0, 1, 2]);
    assert.deepEqual(xs, [49, 0, 1, 2]);
  });

  test("filterNotToWithIndex", () => {
    const xs = [49];
    const seq = Sequence([0, 1, 2]);
    const val = seq.filterNotTo(xs, (x, i) => x + i > 3);
    assert.deepEqual(val, [49, 0, 1]);
    assert.deepEqual(xs, [49, 0, 1]);
  });
});

describe("filterTo", () => {
  test("filterTo", () => {
    const xs = [49];
    const seq = Sequence([0, 1, 2]);
    const val = seq.filterTo(xs, (x) => x > 0);
    assert.deepEqual(val, [49, 1, 2]);
    assert.deepEqual(xs, [49, 1, 2]);
  });

  test("filterToWithIndex", () => {
    const xs = [49];
    const seq = Sequence([0, 1, 2]);
    const val = seq.filterTo(xs, (x, i) => x + i > 0);
    assert.deepEqual(val, [49, 1, 2]);
    assert.deepEqual(xs, [49, 1, 2]);
  });
});

describe("minus", () => {
  test("minusSome", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.minus([1, 2]).toArray();
    assert.deepEqual(val, [0]);
  });

  test("minusNotIncluded", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.minus([0, 3]).toArray();
    assert.deepEqual(val, [1, 2]);
  });

  test("minusAll", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.minus([0, 1, 2]).toArray();
    assert.deepEqual(val, []);
  });

  test("minusNone", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.minus([3, 4]).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });

  test("minusEmpty", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.minus([]).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });

  test("minusFromEmpty", () => {
    const seq = Sequence<number>([]);
    const val = seq.minus([0, 1]).toArray();
    assert.deepEqual(val, []);
  });
});

describe("minusElement", () => {
  test("minusPresent", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.minusElement(0).toArray();
    assert.deepEqual(val, [1, 2]);
  });

  test("minusMissing", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.minusElement(3).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });

  test("minusFromEmpty", () => {
    const seq = Sequence<number>([]);
    const val = seq.minusElement(3).toArray();
    assert.deepEqual(val, []);
  });

  test("minusSingle", () => {
    const seq = Sequence([1]);
    const val = seq.minusElement(1).toArray();
    assert.deepEqual(val, []);
  });
});

describe("take", () => {
  test("take", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.take(2).toArray();
    assert.deepEqual(val, [0, 1]);
  });

  test("takeNTooLarge", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.take(50).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });

  test("takeZero", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.take(0).toArray();
    assert.deepEqual(val, []);
  });

  test("takeNegative", () => {
    const seq = Sequence([0, 1, 2]);
    assert.throw(() => seq.take(-1).toArray(), "n out of bounds");
  });

  test("takeDoesNotReturnCompletionValue", () => {
    function* gen() {
      yield 1;
      return 999;
    }
    const taken = Sequence(gen()).take(5);
    assert.deepEqual(taken.generator.next(), { value: 1, done: false });
    assert.deepEqual(taken.generator.next(), { value: undefined, done: true });
  });
});

describe("takeWhile", () => {
  test("takeWhile", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.takeWhile((x) => x < 2).toArray();
    assert.deepEqual(val, [0, 1]);
  });

  test("takeWhileAll", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.takeWhile((x) => x < 3).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });

  test("takeWhileNone", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.takeWhile((x) => x < 0).toArray();
    assert.deepEqual(val, []);
  });

  test("takeWhileEmpty", () => {
    const seq = Sequence<number>([]);
    const val = seq.takeWhile((x) => x > 0).toArray();
    assert.deepEqual(val, []);
  });

  test("takeWhileShortCircuit", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.takeWhile((x) => x > 0).toArray();
    assert.deepEqual(val, []);
  });

  test("takeWhileWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.takeWhile((x, i) => x * x - i === 0).toArray();
    assert.deepEqual(val, [0, 1]);
  });
});
