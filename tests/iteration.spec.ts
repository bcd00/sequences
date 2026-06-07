import { Sequence } from "../index.js";
import { assert, describe, test } from "vitest";

describe("next", () => {
  test("next", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.next();
    assert.deepEqual(val, { value: 0, done: false });
  });

  test("nextDone", () => {
    const seq = Sequence([0]);
    const val = seq.next();
    const val2 = seq.next();
    assert.deepEqual(val, { value: 0, done: false });
    assert.deepEqual(val2, { value: undefined, done: true });
  });

  test("nextEmpty", () => {
    const seq = Sequence([]);
    const val = seq.next();
    assert.deepEqual(val, { value: undefined, done: true });
  });
});

describe("return", () => {
  function* gen() {
    while (true) {
      yield 42;
    }
  }

  test("return", () => {
    const generator = gen();
    const seq = Sequence(generator);
    const { value, done } = seq.next();
    assert.equal(value, 42);
    assert.isFalse(done);
    const res = seq.return(41);
    assert.equal(res.value, 41);
    assert.isTrue(res.done);
  });
});

describe("throw", () => {
  let errored = false;

  function* gen() {
    while (true) {
      try {
        yield 42;
      } catch (_e) {
        errored = true;
        yield 41;
      }
    }
  }

  test("throw", () => {
    const generator = gen();
    const seq = Sequence(generator);
    const { value, done } = seq.next();
    assert.equal(value, 42);
    assert.isFalse(done);
    const res = seq.throw(new Error());
    assert.isFalse(res.done);
    assert.equal(res.value, 41);
    assert.isTrue(errored);
  });
});

describe("return", () => {
  test("return array", () => {
    const seq = Sequence([0, 1, 2]);
    const res = seq.return(41);
    assert.equal(res.value, 41);
    assert.isTrue(res.done);
  });
});

describe("throw", () => {
  test("throw array", () => {
    const seq = Sequence([0, 1, 2]);
    assert.throws(() => seq.throw(new Error("test")));
  });
});

describe("Symbol.iterator", () => {
  test("Symbol.iterator", () => {
    const seq = Sequence([0, 1, 2]);
    let i = 0;
    for (const x of seq) {
      assert.equal(x, i);
      i++;
    }
  });

  test("Symbol.dispose", () => {
    const seq = Sequence([0, 1, 2]);
    assert.equal(typeof seq[Symbol.dispose], "function");
    seq[Symbol.dispose]!();
  });

  test("Symbol.dispose on plain generator", () => {
    function* gen() {
      yield 42;
    }
    const seq = Sequence(gen());
    assert.equal(typeof seq[Symbol.dispose], "function");
    seq[Symbol.dispose]!();
  });

  test("generatorBackedSequenceThrowsOnReIteration", () => {
    function* gen() {
      yield 1;
      yield 2;
    }
    const seq = Sequence(gen());
    assert.deepEqual(seq.toArray(), [1, 2]);
    assert.throws(
      () => seq.toArray(),
      "Generator-based sequences can only be iterated once"
    );
  });

  test("generatorBackedSequenceThrowsAfterExhaustion", () => {
    function* gen() {
      yield 1;
      yield 2;
      yield 3;
    }
    const seq = Sequence(gen());
    seq.toArray();
    assert.throws(
      () => seq.toArray(),
      "Generator-based sequences can only be iterated once"
    );
  });

  test("generatorBackedSequenceAllowsPartialConsumption", () => {
    function* gen() {
      yield 1;
      yield 2;
      yield 3;
    }
    const seq = Sequence(gen());
    assert.deepEqual(seq.next(), { value: 1, done: false });
    assert.deepEqual(seq.toArray(), [2, 3]);
  });
});
