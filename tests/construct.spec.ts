import { generateSequence, Sequence } from "../index.js";
import { assert, describe, test } from "vitest";

describe("generateSequence", () => {
  test("generateSequence", () => {
    const seq = generateSequence(0, (x) => x + 1);
    const val = seq.take(5).toArray();
    assert.deepEqual(val, [1, 2, 3, 4, 5]);
  });

  test("generateSequenceFunctionSeed", () => {
    const seq = generateSequence(
      () => 0,
      (x) => x + 1
    );
    const val = seq.take(5).toArray();
    assert.deepEqual(val, [1, 2, 3, 4, 5]);
  });

  test("generateSequenceWithIndex", () => {
    const seq = generateSequence(0, (x, i) => x + i);
    const val = seq.take(5).toArray();
    assert.deepEqual(val, [0, 1, 3, 6, 10]);
  });
});

describe("purity", () => {
  test("lazy operations do not mutate source", () => {
    const seq = Sequence([0, 1, 2, 3]);
    seq.filter((x) => x > 0);
    seq.drop(1);
    seq.take(2);
    seq.distinct();
    seq.distinctBy((x) => x);
    seq.dropWhile((x) => x < 1);
    seq.filterNot((x) => x === 0);
    seq.minus([0]);
    seq.minusElement(0);
    seq.onEach(() => 0);
    seq.plus([4]);
    seq.plusElement(4);
    seq.runningReduce((a, b) => a + b);
    seq.takeWhile((x) => x < 2);

    assert.deepEqual(seq.toArray(), [0, 1, 2, 3]);
  });

  test("terminal operations do not permanently reassign generator", () => {
    const seq = Sequence([0, 1, 2, 3]);

    assert.equal(seq.first(), 0);
    assert.equal(seq.first((x) => x > 0), 1);
    assert.equal(seq.firstOrNull(), 2);
    assert.equal(seq.firstOrNull((x) => x > 0), 3);

    const fresh1 = Sequence([0, 1, 2, 3]);
    assert.deepEqual(fresh1.filterTo([49], (x) => x > 0), [49, 1, 2, 3]);
    const fresh2 = Sequence([0, 1, 2, 3]);
    assert.deepEqual(fresh2.filterNotTo([49], (x) => x === 0), [49, 1, 2, 3]);
  });
});
