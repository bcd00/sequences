import { generateSequence, Sequence } from "../index.js";
import { assert, describe, test } from "vitest";

describe("all", () => {
  test("allPass", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.all((x) => x < 3);
    assert.isTrue(val);
  });

  test("allPassWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.all((x, i) => x + i < 5);
    assert.isTrue(val);
  });

  test("allFail", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.all((x) => x > 0);
    assert.isFalse(val);
  });

  test("allFailWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.all((x, i) => x + i < 3);
    assert.isFalse(val);
  });
});

describe("any", () => {
  test("anyPass", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.any((x) => x > 1);
    assert.isTrue(val);
  });

  test("anyPassWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.any((x, i) => x + i < 5);
    assert.isTrue(val);
  });

  test("anyFail", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.any((x) => x > 2);
    assert.isFalse(val);
  });

  test("anyFailWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.any((x, i) => x + i < 0);
    assert.isFalse(val);
  });
});

describe("contains", () => {
  test("present", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.contains(2);
    assert.isTrue(val);
  });

  test("missing", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.contains(3);
    assert.isFalse(val);
  });
});

describe("none", () => {
  test("passing", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.none((x) => x > 3);
    assert.isTrue(val);
  });

  test("noneWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.none((x, i) => x * x - i > 3);
    assert.isTrue(val);
  });

  test("failing", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.none((x) => x < 3);
    assert.isFalse(val);
  });

  test("empty", () => {
    const seq = Sequence([]);
    const val = seq.none();
    assert.isTrue(val);
  });

  test("failingWithoutFn", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.none();
    assert.isFalse(val);
  });
});
