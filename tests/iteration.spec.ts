import { generateSequence, Sequence } from "../index.js";
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
      } catch (e) {
        errored = true;
        yield 41;
      }
    }
  }

  test("throw", () => {
    const generator = gen();
    const seq = Sequence(generator);
    let { value, done } = seq.next();
    assert.equal(value, 42);
    assert.isFalse(done);
    const res = seq.throw(new Error());
    assert.isFalse(res.done);
    assert.equal(res.value, 41);
    assert.isTrue(errored);
  });
});

describe("generator", () => {
  test("generator", () => {
    const seq = Sequence([0, 1, 2]);
    let i = 0;
    for (const x of seq.generator) {
      assert.equal(x, i);
      i++;
    }
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
});
