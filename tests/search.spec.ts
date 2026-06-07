import { generateSequence, Sequence } from "../index.js";
import { assert, describe, test } from "vitest";

describe("find", () => {
  test("findPresent", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.find((x) => x === 0);
    assert.equal(val, 0);
  });

  test("findMissing", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.find((x) => x === -1);
    assert.equal(val, null);
  });

  test("findMulti", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.find((x) => x > 0);
    assert.equal(val, 1);
  });

  test("findWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.find((x, i) => x + i > 2);
    assert.equal(val, 2);
  });
});

describe("findLast", () => {
  test("findLastPresent", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.findLast((x) => x === 0);
    assert.equal(val, 0);
  });

  test("findLastMissing", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.findLast((x) => x === -1);
    assert.equal(val, null);
  });

  test("findLastMulti", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.findLast((x) => x > 0);
    assert.equal(val, 2);
  });

  test("findLastWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.findLast((x, i) => x * x - i > 0);
    assert.equal(val, 2);
  });
});

describe("indexOf", () => {
  test("indexOfPresent", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.indexOf(0);
    assert.equal(val, 0);
  });

  test("indexOfMissing", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.indexOf(3);
    assert.equal(val, -1);
  });
});

describe("indexOfFirst", () => {
  test("indexOfFirstMulti", () => {
    const seq = Sequence([0, 1, 2, 0]);
    const val = seq.indexOfFirst((x) => x === 0);
    assert.equal(val, 0);
  });

  test("indexOfFirstWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.indexOfFirst((x, i) => x * x - i > 0);
    assert.equal(val, 2);
  });

  test("indexOfFirstMissing", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.indexOfFirst((x) => x > 2);
    assert.equal(val, -1);
  });
});

describe("indexOfLast", () => {
  test("indexOfLastMulti", () => {
    const seq = Sequence([0, 1, 2, 0]);
    const val = seq.indexOfLast((x) => x === 0);
    assert.equal(val, 3);
  });

  test("indexOfLastWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.indexOfLast((x, i) => x - i === 0);
    assert.equal(val, 2);
  });

  test("indexOfLastMissing", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.indexOfLast((x) => x > 3);
    assert.equal(val, -1);
  });
});

describe("lastIndexOf", () => {
  test("lastIndexOfPresent", () => {
    const seq = Sequence([0, 1, 2, 0]);
    const val = seq.lastIndexOf(0);
    assert.equal(val, 3);
  });

  test("lastIndexOfMissing", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.lastIndexOf(3);
    assert.equal(val, -1);
  });
});
