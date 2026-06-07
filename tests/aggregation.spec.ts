import { generateSequence, Sequence } from "../index.js";
import { assert, describe, test } from "vitest";

describe("average", () => {
  test("averageNumber", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.average();
    assert.equal(val, 1);
  });

  test("averageString", () => {
    const seq = Sequence(["hello", "world"]);
    assert.throw(seq.average, "Non-numeric sequence");
  });

  test("averageEmpty", () => {
    const seq = Sequence<number>([]);
    assert.throw(seq.average, "Empty sequence");
  });
});

describe("count", () => {
  test("count", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.count();
    assert.equal(val, 3);
  });

  test("countZero", () => {
    const seq = Sequence<number>([]);
    const val = seq.count();
    assert.equal(val, 0);
  });

  test("countWithPredicate", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.count((x) => x > 0);
    assert.equal(val, 2);
  });

  test("countWithPredicateWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.count((x, i) => x * x - i > 0);
    assert.equal(val, 1);
  });

  test("countZeroWithPredicate", () => {
    const seq = Sequence<number>([]);
    const val = seq.count((x) => x > 0);
    assert.equal(val, 0);
  });

  test("countZeroWithPredicateWithIndex", () => {
    const seq = Sequence<number>([]);
    const val = seq.count((x, i) => x - i > 0);
    assert.equal(val, 0);
  });
});

describe("fold", () => {
  test("fold", () => {
    const seq = Sequence([0, 1, 2]);
    const initial = 50;
    const val = seq.fold(initial, (acc, x) => acc + x);
    assert.equal(val, 53);
  });

  test("foldWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const initial = 50;
    const val = seq.fold(initial, (acc, x, i) => acc + x + i);
    assert.equal(val, 56);
  });
});

describe("forEach", () => {
  test("forEach", () => {
    let i = 0;
    const seq = Sequence([0, 1, 2]);
    seq.forEach((x) => (i += x));
    assert.equal(i, 3);
  });

  test("forEachWithIndex", () => {
    let i = 0;
    const seq = Sequence([0, 1, 2]);
    seq.forEach((x, j) => (i += x + j));
    assert.equal(i, 6);
  });
});

describe("reduce", () => {
  test("reduce", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.reduce((acc, x) => acc + x);
    assert.equal(val, 3);
  });

  test("reduceWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.reduce((acc, x, i) => acc + x + i);
    assert.equal(val, 6);
  });

  test("reduceEmpty", () => {
    const seq = Sequence<number>([]);
    assert.throw(
      seq.reduce.bind(null, (acc, x, i) => acc + x + i),
      "Empty sequence"
    );
  });
});

describe("reduceOrNull", () => {
  test("reduceOrNull", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.reduceOrNull((acc, x) => acc + x);
    assert.equal(val, 3);
  });

  test("reduceOrNullWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.reduceOrNull((acc, x, i) => acc + x + i);
    assert.equal(val, 6);
  });

  test("reduceOrNullEmpty", () => {
    const seq = Sequence<number>([]);
    const val = seq.reduceOrNull((acc, x) => acc + x);
    assert.equal(val, null);
  });
});

describe("runningFold", () => {
  test("runningFold", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.runningFold(3, (initial, x) => initial + x).toArray();
    assert.deepEqual(val, [3, 3, 4, 6]);
  });

  test("runningFoldWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq
      .runningFold(3, (initial, x, i) => initial + x + i)
      .toArray();
    assert.deepEqual(val, [3, 3, 5, 9]);
  });

  test("runningFoldEmpty", () => {
    const seq = Sequence([]);
    const val = seq.runningFold(3, (initial, x) => initial + x).toArray();
    assert.deepEqual(val, [3]);
  });
});

describe("runningReduce", () => {
  test("runningReduce", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.runningReduce((acc, x) => acc + x).toArray();
    assert.deepEqual(val, [0, 1, 3]);
  });

  test("runningReduceWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.runningReduce((acc, x, i) => acc + x + i).toArray();
    assert.deepEqual(val, [0, 2, 6]);
  });

  test("runningReduceEmpty", () => {
    const seq = Sequence<number>([]);
    const val = seq.runningReduce((acc, x) => acc + x).toArray();
    assert.deepEqual(val, []);
  });
});

describe("scan", () => {
  test("scan", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.scan(3, (initial, x) => initial + x).toArray();
    assert.deepEqual(val, [3, 3, 4, 6]);
  });

  test("scanWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.scan(3, (initial, x, i) => initial + x + i).toArray();
    assert.deepEqual(val, [3, 3, 5, 9]);
  });

  test("scanEmpty", () => {
    const seq = Sequence<number>([]);
    const val = seq.scan(3, (initial, x) => initial + x).toArray();
    assert.deepEqual(val, [3]);
  });
});

describe("sum", () => {
  test("sum", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.sum();
    assert.equal(val, 3);
  });

  test("sumEmpty", () => {
    const seq = Sequence<number>([]);
    const val = seq.sum();
    assert.equal(val, 0);
  });
});

describe("sumOf", () => {
  test("sumOf", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.sumOf((x) => x * 2);
    assert.equal(val, 6);
  });

  test("sumOfWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.sumOf((x, i) => x * i);
    assert.equal(val, 5);
  });

  test("sumOfEmpty", () => {
    const seq = Sequence<number>([]);
    const val = seq.sumOf((x) => x * 2);
    assert.equal(val, 0);
  });
});
