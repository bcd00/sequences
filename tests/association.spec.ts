import { generateSequence, Sequence } from "../index.js";
import { assert, describe, test } from "vitest";

describe("associate", () => {
  test("associate", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.associate((x) => [x, x + 1]);
    assert.deepEqual(
      [...val],
      [
        [0, 1],
        [1, 2],
        [2, 3]
      ]
    );
  });

  test("associateWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.associate((x, i) => [x, x + i]);
    assert.deepEqual(
      [...val],
      [
        [0, 0],
        [1, 2],
        [2, 4]
      ]
    );
  });
});

describe("associateBy", () => {
  test("associateByWithoutTransform", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.associateBy((x) => x + 1);
    assert.deepEqual(
      [...val],
      [
        [1, 0],
        [2, 1],
        [3, 2]
      ]
    );
  });

  test("associateByWithoutTransformWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.associateBy((x, i) => x + i);
    assert.deepEqual(
      [...val],
      [
        [0, 0],
        [2, 1],
        [4, 2]
      ]
    );
  });

  test("associateByWithTransform", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.associateBy(
      (x) => x + 1,
      (x) => x + 2
    );
    assert.deepEqual(
      [...val],
      [
        [1, 2],
        [2, 3],
        [3, 4]
      ]
    );
  });

  test("associateByWithTransformWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.associateBy(
      (x, i) => x + i,
      (x, i) => x + i + 1
    );
    assert.deepEqual(
      [...val],
      [
        [0, 1],
        [2, 3],
        [4, 5]
      ]
    );
  });
});

describe("associateByTo", () => {
  test("associateByToWithoutTransform", () => {
    const seq = Sequence([0, 1, 2]);
    const map = new Map([[0, 1]]);
    const val = seq.associateByTo(map, (x) => x + 1);
    assert.deepEqual(
      [...val],
      [
        [0, 1],
        [1, 0],
        [2, 1],
        [3, 2]
      ]
    );
  });

  test("associateByWithoutTransformWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const map = new Map([[0, 1]]);
    const val = seq.associateByTo(map, (x, i) => x + i + 1);
    assert.deepEqual(
      [...val],
      [
        [0, 1],
        [1, 0],
        [3, 1],
        [5, 2]
      ]
    );
  });

  test("associateByToWithTransform", () => {
    const seq = Sequence([0, 1, 2]);
    const map = new Map([[0, 1]]);
    const val = seq.associateByTo(
      map,
      (x) => x + 1,
      (x) => x + 2
    );
    assert.deepEqual(
      [...val],
      [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4]
      ]
    );
  });

  test("associateByToWithTransformWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const map = new Map([[0, 1]]);
    const val = seq.associateByTo(
      map,
      (x, i) => x + i + 1,
      (x, i) => x + i + 2
    );
    assert.deepEqual(
      [...val],
      [
        [0, 1],
        [1, 2],
        [3, 4],
        [5, 6]
      ]
    );
  });
});

describe("associateTo", () => {
  test("associateTo", () => {
    const seq = Sequence([0, 1, 2]);
    const map = new Map([[55, 1]]);
    const val = seq.associateTo(map, (x) => [x, x + 1]);
    assert.deepEqual(
      [...val],
      [
        [55, 1],
        [0, 1],
        [1, 2],
        [2, 3]
      ]
    );
  });

  test("associateToWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const map = new Map([[55, 1]]);
    const val = seq.associateTo(map, (x, i) => [x + i, x + i + 1]);
    assert.deepEqual(
      [...val],
      [
        [55, 1],
        [0, 1],
        [2, 3],
        [4, 5]
      ]
    );
  });
});

describe("associateWith", () => {
  test("associateWith", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.associateWith((x) => x + 1);
    assert.deepEqual(
      [...val],
      [
        [0, 1],
        [1, 2],
        [2, 3]
      ]
    );
  });

  test("associateWithWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.associateWith((x, i) => x + i + 1);
    assert.deepEqual(
      [...val],
      [
        [0, 1],
        [1, 3],
        [2, 5]
      ]
    );
  });
});

describe("associateWithTo", () => {
  test("associateWithTo", () => {
    const seq = Sequence([0, 1, 2]);
    const map = new Map([[55, 1]]);
    const val = seq.associateWithTo(map, (x) => x + 1);
    assert.deepEqual(
      [...val],
      [
        [55, 1],
        [0, 1],
        [1, 2],
        [2, 3]
      ]
    );
  });

  test("associateWithToWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const map = new Map([[55, 1]]);
    const val = seq.associateWithTo(map, (x, i) => x + i + 1);
    assert.deepEqual(
      [...val],
      [
        [55, 1],
        [0, 1],
        [1, 3],
        [2, 5]
      ]
    );
  });
});

describe("groupBy", () => {
  test("groupByEqual", () => {
    const seq = Sequence([-1, 0, 1, 2]);
    const val = seq.groupBy((x) => x > 0);
    assert.deepEqual(
      [...val],
      [
        [false, [-1, 0]],
        [true, [1, 2]]
      ]
    );
  });

  test("groupByUnequal", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.groupBy((x) => x > 0);
    assert.deepEqual(
      [...val],
      [
        [false, [0]],
        [true, [1, 2]]
      ]
    );
  });

  test("groupByAll", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.groupBy((x) => x > -1);
    assert.deepEqual([...val], [[true, [0, 1, 2]]]);
  });

  test("groupByWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.groupBy((x, i) => x + i > 0);
    assert.deepEqual(
      [...val],
      [
        [false, [0]],
        [true, [1, 2]]
      ]
    );
  });

  test("groupByWithTransform", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.groupBy(
      (x) => x > 0,
      (x) => x + 1
    );
    assert.deepEqual(
      [...val],
      [
        [false, [1]],
        [true, [2, 3]]
      ]
    );
  });

  test("groupByWithTransformWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.groupBy(
      (x, i) => x + i > 0,
      (x, i) => x + i + 1
    );
    assert.deepEqual(
      [...val],
      [
        [false, [1]],
        [true, [3, 5]]
      ]
    );
  });
});

describe("groupByTo", () => {
  test("groupByToAllKeys", () => {
    const seq = Sequence([0, 1, 2]);
    const xs = new Map([
      [false, [-1]],
      [true, [3]]
    ]);
    const val = seq.groupByTo(xs, (x) => x > 0);
    assert.deepEqual(
      [...val],
      [
        [false, [-1, 0]],
        [true, [3, 1, 2]]
      ]
    );
  });

  test("groupByToWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const xs = new Map([
      [false, [-1]],
      [true, [3]]
    ]);
    const val = seq.groupByTo(
      xs,
      (x, i) => x + i > 0,
      (x, i) => x + i + 1
    );
    assert.deepEqual(
      [...val],
      [
        [false, [-1, 1]],
        [true, [3, 3, 5]]
      ]
    );
  });

  test("groupByToMissingKeys", () => {
    const seq = Sequence([0, 1, 2]);
    const xs = new Map([[false, [-1]]]);
    const val = seq.groupByTo(xs, (x) => x > 0);
    assert.deepEqual(
      [...val],
      [
        [false, [-1, 0]],
        [true, [1, 2]]
      ]
    );
  });
});
