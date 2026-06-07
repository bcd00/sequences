import { Sequence } from "../index.js";
import { assert, describe, test } from "vitest";

describe("joinTo", () => {
  test("joinToDefaults", () => {
    const buffer = "result: ";
    const seq = Sequence([0, 1, 2]);
    const val = seq.joinTo(buffer);
    assert.equal(val, "result: 0, 1, 2");
  });

  test("joinToSeparator", () => {
    const buffer = "result: ";
    const seq = Sequence([0, 1, 2]);
    const val = seq.joinTo(buffer, ",");
    assert.equal(val, "result: 0,1,2");
  });

  test("joinToPrefixPostfix", () => {
    const buffer = "result: ";
    const seq = Sequence([0, 1, 2]);
    const val = seq.joinTo(buffer, undefined, "[", "]");
    assert.equal(val, "result: [0, 1, 2]");
  });

  test("joinToLimit", () => {
    const buffer = "result: ";
    const seq = Sequence([0, 1, 2]);
    const val = seq.joinTo(
      buffer,
      undefined,
      undefined,
      undefined,
      2,
      "......"
    );
    assert.equal(val, "result: 0, 1, ......");
  });

  test("joinToWithTransform", () => {
    const buffer = "result: ";
    const seq = Sequence([0, 1, 2]);
    const val = seq.joinTo(
      buffer,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      (x) => x + 1
    );
    assert.equal(val, "result: 1, 2, 3");
  });

  test("joinToWithTransformWithIndex", () => {
    const buffer = "result: ";
    const seq = Sequence([0, 1, 2]);
    const val = seq.joinTo(
      buffer,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      (x, i) => x + 1 + i
    );
    assert.equal(val, "result: 1, 3, 5");
  });

  test("joinToAll", () => {
    const buffer = "result: ";
    const seq = Sequence([0, 1, 2]);
    const val = seq.joinTo(buffer, ",", "[", "]", 2, "|", (x) => x + 1);
    assert.equal(val, "result: [1,2,|]");
  });
});

describe("joinToString", () => {
  test("joinToStringAll", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.joinToString(",", "[", "]", 2, "|", (x) => x + 1);
    assert.equal(val, "[1,2,|]");
  });
});

describe("partition", () => {
  test("partition", () => {
    const seq = Sequence([0, 1, 2]);
    const [pos, neg] = seq.partition((x) => x > 0);
    assert.deepEqual(pos, [1, 2]);
    assert.deepEqual(neg, [0]);
  });

  test("partitionWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const [pos, neg] = seq.partition((x, i) => x * x - i > 0);
    assert.deepEqual(pos, [2]);
    assert.deepEqual(neg, [0, 1]);
  });

  test("partitionAllPos", () => {
    const seq = Sequence([0, 1, 2]);
    const [pos, neg] = seq.partition((x) => x > -1);
    assert.deepEqual(pos, [0, 1, 2]);
    assert.deepEqual(neg, []);
  });

  test("partitionAllNeg", () => {
    const seq = Sequence([0, 1, 2]);
    const [pos, neg] = seq.partition((x) => x > 3);
    assert.deepEqual(pos, []);
    assert.deepEqual(neg, [0, 1, 2]);
  });

  test("partitionEmpty", () => {
    const seq = Sequence([]);
    const [pos, neg] = seq.partition((x) => x > 3);
    assert.deepEqual(pos, []);
    assert.deepEqual(neg, []);
  });
});

describe("toArray", () => {
  test("toArray", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });

  test("toArrayEmpty", () => {
    const seq = Sequence<number>([]);
    const val = seq.toArray();
    assert.deepEqual(val, []);
  });
});

describe("toSet", () => {
  test("toSet", () => {
    const seq = Sequence([0, 1, 2, 0, 2, 1, 0]);
    const val = seq.toSet();
    assert.deepEqual([...val.values()], [0, 1, 2]);
  });

  test("toSetEmpty", () => {
    const seq = Sequence<number>([]);
    const val = seq.toSet();
    assert.equal(val.size, 0);
  });
});
