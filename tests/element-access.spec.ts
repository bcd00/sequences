import { generateSequence, Sequence } from "../index.js";
import { assert, describe, test } from "vitest";

describe("elementAt", () => {
  test("elementAt", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.elementAt(0);
    assert.equal(val, 0);
  });

  test("elementAtOutOfBounds", () => {
    const seq = Sequence([0, 1, 2]);
    assert.throw(seq.elementAt.bind(null, 3), "Element not found");
  });

  test("elementAtNegative", () => {
    const seq = Sequence([0, 1, 2]);
    assert.throw(seq.elementAt.bind(null, -1), "Element not found");
  });
});

describe("elementAtOrElse", () => {
  test("elementAtOrElse", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.elementAtOrElse(0, 50);
    assert.equal(val, 0);
  });

  test("elementAtOrElseOutOfBounds", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.elementAtOrElse(4, 50);
    assert.equal(val, 50);
  });

  test("elementAtOrElseNegative", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.elementAtOrElse(-1, 50);
    assert.equal(val, 50);
  });
});

describe("elementAtOrNull", () => {
  test("elementAtOrNull", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.elementAtOrNull(0);
    assert.equal(val, 0);
  });

  test("elementAtOrNullOutOfBounds", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.elementAtOrNull(4);
    assert.equal(val, null);
  });

  test("elementAtOrNullNegative", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.elementAtOrNull(-1);
    assert.equal(val, null);
  });
});

describe("first", () => {
  test("firstPresent", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.first();
    assert.equal(val, 0);
  });

  test("firstEmpty", () => {
    const seq = Sequence([]);
    assert.throw(seq.first, "Empty sequence");
  });

  test("firstWithTransform", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.first((x) => x > 0);
    assert.equal(val, 1);
  });

  test("firstWithTransformEmpty", () => {
    const seq = Sequence<number>([]);
    assert.throw(
      seq.first.bind(null, (x) => x > 0),
      "Empty sequence"
    );
  });

  test("firstWithTransformNoMatch", () => {
    const seq = Sequence([0, 1, 2]);
    assert.throw(
      seq.first.bind(null, (x) => x > 2),
      "Empty sequence"
    );
  });

  test("firstWithTransformWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.first((x, i) => x + i > 0);
    assert.equal(val, 1);
  });
});

describe("firstOrNull", () => {
  test("firstOrNullPresent", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.firstOrNull();
    assert.equal(val, 0);
  });

  test("firstOrNullEmpty", () => {
    const seq = Sequence([]);
    const val = seq.firstOrNull();
    assert.equal(val, null);
  });

  test("firstOrNullWithTransform", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.firstOrNull((x) => x > 1);
    assert.equal(val, 2);
  });

  test("firstOrNullWithTransformEmpty", () => {
    const seq = Sequence([]);
    const val = seq.firstOrNull((x) => x > 1);
    assert.equal(val, null);
  });

  test("firstOrNullWithTransformNoMatch", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.firstOrNull((x) => x > 2);
    assert.equal(val, null);
  });

  test("firstOrNullWithTransformWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.firstOrNull((x, i) => x + i > 3);
    assert.equal(val, 2);
  });
});

describe("last", () => {
  test("last", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.last();
    assert.equal(val, 2);
  });

  test("lastEmpty", () => {
    const seq = Sequence([]);
    assert.throw(seq.last, "Element not found");
  });

  test("lastWithPredicate", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.last((x) => x < 2);
    assert.equal(val, 1);
  });

  test("lastWithPredicateMissing", () => {
    const seq = Sequence([0, 1, 2]);
    assert.throw(
      seq.last.bind(null, (x) => x > 2),
      "Element not found"
    );
  });

  test("lastWithPredicateWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.last((x, i) => x + i < 3);
    assert.equal(val, 1);
  });
});

describe("lastOrNull", () => {
  test("lastOrNull", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.lastOrNull();
    assert.equal(val, 2);
  });

  test("lastOrNullEmpty", () => {
    const seq = Sequence([]);
    const val = seq.lastOrNull();
    assert.equal(val, null);
  });

  test("lastOrNullWithPredicate", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.lastOrNull((x) => x < 2);
    assert.equal(val, 1);
  });

  test("lastOrNullWithPredicateMissing", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.lastOrNull((x) => x > 2);
    assert.equal(val, null);
  });

  test("lastOrNullWithPredicateWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.lastOrNull((x, i) => x + i < 3);
    assert.equal(val, 1);
  });
});

describe("single", () => {
  test("single", () => {
    const seq = Sequence([0]);
    const val = seq.single();
    assert.equal(val, 0);
  });

  test("singleEmpty", () => {
    const seq = Sequence<number>([]);
    assert.throw(seq.single, "Empty sequence");
  });

  test("singleMulti", () => {
    const seq = Sequence([0, 1]);
    assert.throw(seq.single, "Not a single sequence");
  });

  test("singleWithPredicate", () => {
    const seq = Sequence([0, 1]);
    const val = seq.single((x) => x < 1);
    assert.equal(val, 0);
  });

  test("singleWithPredicateMulti", () => {
    const seq = Sequence([0, 1, 2]);
    assert.throw(
      seq.single.bind(null, (x) => x < 2),
      "Not a single sequence"
    );
  });

  test("singleWithPredicateEmpty", () => {
    const seq = Sequence<number>([]);
    assert.throw(
      seq.single.bind(null, (x) => x < 1),
      "Empty sequence"
    );
  });

  test("singleWithPredicateNone", () => {
    const seq = Sequence([0, 1]);
    assert.throw(
      seq.single.bind(null, (x) => x < 0),
      "Empty sequence"
    );
  });

  test("singleWithPredicateWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.single((x, i) => x * x - i !== 0);
    assert.equal(val, 2);
  });
});

describe("singleOrNull", () => {
  test("singleOrNull", () => {
    const seq = Sequence([0]);
    const val = seq.singleOrNull();
    assert.equal(val, 0);
  });

  test("singleOrNullEmpty", () => {
    const seq = Sequence<number>([]);
    const val = seq.singleOrNull();
    assert.equal(val, null);
  });

  test("singleOrNullMulti", () => {
    const seq = Sequence([0, 1]);
    const val = seq.singleOrNull();
    assert.equal(val, null);
  });

  test("singleOrNullWithPredicate", () => {
    const seq = Sequence([0, 1]);
    const val = seq.singleOrNull((x) => x < 1);
    assert.equal(val, 0);
  });

  test("singleOrNullWithPredicateMulti", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.singleOrNull((x) => x < 2);
    assert.equal(val, null);
  });

  test("singleOrNullWithPredicateEmpty", () => {
    const seq = Sequence<number>([]);
    const val = seq.singleOrNull((x) => x < 1);
    assert.equal(val, null);
  });

  test("singleOrNullWithPredicateNone", () => {
    const seq = Sequence([0, 1]);
    const val = seq.singleOrNull((x) => x < 0);
    assert.equal(val, null);
  });

  test("singleOrNullWithPredicateWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.singleOrNull((x, i) => x * x - i === 0);
    assert.isNull(val);
  });
});
