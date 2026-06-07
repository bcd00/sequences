import { generateSequence, Sequence } from "../index.js";
import { assert, describe, test } from "vitest";

describe("max", () => {
  test("max", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.max();
    assert.equal(val, 2);
  });

  test("maxEmpty", () => {
    const seq = Sequence([]);
    assert.throw(seq.max, "Empty sequence");
  });

  test("maxNonInteger", () => {
    const seq = Sequence([{ test: "hello" }, { test2: "world" }]);
    const val = seq.max();
    assert.deepEqual(val, { test: "hello" });
  });

  test("maxMultiple", () => {
    const seq = Sequence([0, 1, 2, 2]);
    const val = seq.max();
    assert.equal(val, 2);
  });
});

describe("maxBy", () => {
  test("maxBy", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.maxBy((x) => 0 - x);
    assert.equal(val, 0);
  });

  test("maxByWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.maxBy((x, i) => x - 2 * i);
    assert.equal(val, 0);
  });

  test("maxByEmpty", () => {
    const seq = Sequence([]);
    assert.throw(
      seq.maxBy.bind(null, (x) => 0 - x),
      "Empty sequence"
    );
  });

  test("maxByNonInteger", () => {
    const seq = Sequence([{ test: "hello" }, { test: "world!" }]);
    const val = seq.maxBy((x) => x.test.length);
    assert.deepEqual(val, { test: "world!" });
  });

  test("maxByMultiple", () => {
    const seq = Sequence([{ test: "hello" }, { test: "world" }]);
    const val = seq.maxBy((x) => x.test.length);
    assert.deepEqual(val, { test: "hello" });
  });
});

describe("maxByOrNull", () => {
  test("maxByOrNull", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.maxByOrNull((x) => 0 - x);
    assert.equal(val, 0);
  });

  test("maxByOrNullWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.maxByOrNull((x, i) => x - 2 * i);
    assert.equal(val, 0);
  });

  test("maxByOrNullEmpty", () => {
    const seq = Sequence([]);
    const val = seq.maxByOrNull((x) => 0 - x);
    assert.equal(val, null);
  });

  test("maxByOrNullNonInteger", () => {
    const seq = Sequence([{ test: "hello" }, { test: "world!" }]);
    const val = seq.maxByOrNull((x) => x.test.length);
    assert.deepEqual(val, { test: "world!" });
  });

  test("maxByOrNullMultiple", () => {
    const seq = Sequence([{ test: "hello" }, { test: "world" }]);
    const val = seq.maxByOrNull((x) => x.test.length);
    assert.deepEqual(val, { test: "hello" });
  });
});

describe("maxOf", () => {
  test("maxOf", () => {
    const seq = Sequence(["one", "four", "seven"]);
    const val = seq.maxOf((x) => x.length);
    assert.equal(val, 5);
  });

  test("maxOfWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.maxOf((x, i) => x - 2 * i);
    assert.equal(val, 0);
  });

  test("maxOfEmpty", () => {
    const seq = Sequence<number[]>([]);
    assert.throw(
      seq.maxOf.bind(null, (x) => x.length),
      "Empty sequence"
    );
  });

  test("maxOfMultiple", () => {
    const seq = Sequence(["hello", "world"]);
    const val = seq.maxOf((x) => x.length);
    assert.equal(val, 5);
  });
});

describe("maxOfOrNull", () => {
  test("maxOfOrNull", () => {
    const seq = Sequence(["one", "four", "seven"]);
    const val = seq.maxOfOrNull((x) => x.length);
    assert.equal(val, 5);
  });

  test("maxOfOrNull", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.maxOfOrNull((x, i) => x - 2 * i);
    assert.equal(val, 0);
  });

  test("maxOfOrNullEmpty", () => {
    const seq = Sequence<number[]>([]);
    const val = seq.maxOfOrNull((x) => x.length);
    assert.equal(val, null);
  });

  test("maxOfOrNullMultiple", () => {
    const seq = Sequence(["hello", "world"]);
    const val = seq.maxOfOrNull((x) => x.length);
    assert.equal(val, 5);
  });
});

describe("maxOfWith", () => {
  const comp = (a: any, b: any) => {
    if (a > b) return 1;
    if (a === b) return 0;
    return -1;
  };

  test("maxOfWith", () => {
    const seq = Sequence(["one", "four", "seven"]);
    const val = seq.maxOfWith(comp, (x) => x.length);
    assert.equal(val, 3);
  });

  test("maxOfWithWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.maxOfWith(comp, (x, i) => x - 2 * i);
    assert.equal(val, -2);
  });

  test("maxOfWithEmpty", () => {
    const seq = Sequence<number[]>([]);
    assert.throw(
      seq.maxOfWith.bind(null, comp, (x) => x.length),
      "Empty sequence"
    );
  });

  test("maxOfWithMultiple", () => {
    const seq = Sequence(["hello", "world"]);
    const val = seq.maxOfWith(comp, (x) => x.length);
    assert.equal(val, 5);
  });
});

describe("maxOfWithOrNull", () => {
  const comp = (a: any, b: any) => {
    if (a > b) return 1;
    if (a === b) return 0;
    return -1;
  };

  test("maxOfWithOrNull", () => {
    const seq = Sequence(["one", "four", "seven"]);
    const val = seq.maxOfWithOrNull(comp, (x) => x.length);
    assert.equal(val, 3);
  });

  test("maxOfWithOrNull", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.maxOfWithOrNull(comp, (x, i) => x - 2 * i);
    assert.equal(val, -2);
  });

  test("maxOfWithOrNullEmpty", () => {
    const seq = Sequence<number[]>([]);
    const val = seq.maxOfWithOrNull(comp, (x) => x.length);
    assert.equal(val, null);
  });

  test("maxOfWithOrNullMultiple", () => {
    const seq = Sequence(["hello", "world"]);
    const val = seq.maxOfWithOrNull(comp, (x) => x.length);
    assert.equal(val, 5);
  });
});

describe("maxOrNull", () => {
  test("maxOrNull", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.maxOrNull();
    assert.equal(val, 2);
  });

  test("maxOrNullEmpty", () => {
    const seq = Sequence([]);
    const val = seq.maxOrNull();
    assert.equal(val, null);
  });

  test("maxOrNullMultiple", () => {
    const seq = Sequence([0, 1, 2, 0]);
    const val = seq.maxOrNull();
    assert.equal(val, 2);
  });
});

describe("maxWith", () => {
  const comp = (a: any, b: any) => {
    if (a > b) return 1;
    if (a === b) return 0;
    return -1;
  };

  test("maxWith", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.maxWith(comp);
    assert.equal(val, 0);
  });

  test("maxWithEmpty", () => {
    const seq = Sequence<number[]>([]);
    assert.throw(seq.maxWith.bind(null, comp), "Empty sequence");
  });

  test("maxWithMultiple", () => {
    const seq = Sequence([0, 1, 2, 0]);
    const val = seq.maxWith(comp);
    assert.equal(val, 0);
  });

  test("maxWithSwap", () => {
    const seq = Sequence([0, 1, 2, -1]);
    const val = seq.maxWith(comp);
    assert.equal(val, -1);
  });
});

describe("maxWithOrNull", () => {
  const comp = (a: any, b: any) => {
    if (a > b) return 1;
    if (a === b) return 0;
    return -1;
  };

  test("maxWithOrNull", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.maxWithOrNull(comp);
    assert.equal(val, 0);
  });

  test("maxWithOrNullEmpty", () => {
    const seq = Sequence([]);
    const val = seq.maxWithOrNull(comp);
    assert.equal(val, null);
  });

  test("maxWithOrNullMultiple", () => {
    const seq = Sequence([0, 1, 2, 0]);
    const val = seq.maxWithOrNull(comp);
    assert.equal(val, 0);
  });

  test("maxWithOrNullSwap", () => {
    const seq = Sequence([0, 1, 2, -1]);
    const val = seq.maxWithOrNull(comp);
    assert.equal(val, -1);
  });
});

describe("min", () => {
  test("min", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.min();
    assert.equal(val, 0);
  });

  test("minEmpty", () => {
    const seq = Sequence([]);
    assert.throw(seq.min, "Empty sequence");
  });

  test("minNonInteger", () => {
    const seq = Sequence([{ test: "hello" }, { test2: "world" }]);
    const val = seq.min();
    assert.deepEqual(val, { test: "hello" });
  });

  test("minMultiple", () => {
    const seq = Sequence([0, 1, 2, 2]);
    const val = seq.min();
    assert.equal(val, 0);
  });

  test("minSwap", () => {
    const seq = Sequence([0, 1, 2, -1]);
    const val = seq.min();
    assert.equal(val, -1);
  });
});

describe("minBy", () => {
  test("minBy", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.minBy((x) => 0 - x);
    assert.equal(val, 2);
  });

  test("minByWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.minBy((x, i) => x - 2 * i);
    assert.equal(val, 2);
  });

  test("minByEmpty", () => {
    const seq = Sequence([]);
    assert.throw(
      seq.minBy.bind(null, (x) => 0 - x),
      "Empty sequence"
    );
  });

  test("minByNonInteger", () => {
    const seq = Sequence([{ test: "hello" }, { test: "world!" }]);
    const val = seq.minBy((x) => x.test.length);
    assert.deepEqual(val, { test: "hello" });
  });

  test("minByMultiple", () => {
    const seq = Sequence([{ test: "hello" }, { test: "world" }]);
    const val = seq.minBy((x) => x.test.length);
    assert.deepEqual(val, { test: "hello" });
  });
});

describe("minByOrNull", () => {
  test("minByOrNull", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.minByOrNull((x) => 0 - x);
    assert.equal(val, 2);
  });

  test("minByOrNull", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.minByOrNull((x, i) => x - 2 * i);
    assert.equal(val, 2);
  });

  test("minByOrNullEmpty", () => {
    const seq = Sequence([]);
    const val = seq.minByOrNull((x) => 0 - x);
    assert.equal(val, null);
  });

  test("minByOrNullNonInteger", () => {
    const seq = Sequence([{ test: "hello" }, { test: "world!" }]);
    const val = seq.minByOrNull((x) => x.test.length);
    assert.deepEqual(val, { test: "hello" });
  });

  test("minByOrNullMultiple", () => {
    const seq = Sequence([{ test: "hello" }, { test: "world" }]);
    const val = seq.minByOrNull((x) => x.test.length);
    assert.deepEqual(val, { test: "hello" });
  });
});

describe("minOf", () => {
  test("minOf", () => {
    const seq = Sequence(["one", "four", "seven"]);
    const val = seq.minOf((x) => x.length);
    assert.equal(val, 3);
  });

  test("minOfWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.minOf((x, i) => x - 2 * i);
    assert.equal(val, -2);
  });

  test("minOfEmpty", () => {
    const seq = Sequence<number[]>([]);
    assert.throw(
      seq.minOf.bind(null, (x) => x.length),
      "Empty sequence"
    );
  });

  test("minOfMultiple", () => {
    const seq = Sequence(["hello", "world"]);
    const val = seq.minOf((x) => x.length);
    assert.equal(val, 5);
  });
});

describe("minOfOrNull", () => {
  test("minOfOrNull", () => {
    const seq = Sequence(["one", "four", "seven"]);
    const val = seq.minOfOrNull((x) => x.length);
    assert.equal(val, 3);
  });

  test("minOfOrNullWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.minOfOrNull((x, i) => x - 2 * i);
    assert.equal(val, -2);
  });

  test("minOfOrNullEmpty", () => {
    const seq = Sequence<number[]>([]);
    const val = seq.minOfOrNull((x) => x.length);
    assert.equal(val, null);
  });

  test("minOfOrNullMultiple", () => {
    const seq = Sequence(["hello", "world"]);
    const val = seq.minOfOrNull((x) => x.length);
    assert.equal(val, 5);
  });
});

describe("minOfWith", () => {
  const comp = (a: any, b: any) => {
    if (a > b) return 1;
    if (a === b) return 0;
    return -1;
  };

  test("minOfWith", () => {
    const seq = Sequence(["one", "four", "seven"]);
    const val = seq.minOfWith(comp, (x) => x.length);
    assert.equal(val, 5);
  });

  test("minOfWithWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.minOfWith(comp, (x, i) => x - 2 * i);
    assert.equal(val, 0);
  });

  test("minOfWithEmpty", () => {
    const seq = Sequence<number[]>([]);
    assert.throw(
      seq.minOfWith.bind(null, comp, (x) => x.length),
      "Empty sequence"
    );
  });

  test("minOfWithMultiple", () => {
    const seq = Sequence(["hello", "world"]);
    const val = seq.minOfWith(comp, (x) => x.length);
    assert.equal(val, 5);
  });
});

describe("minOfWithOrNull", () => {
  const comp = (a: any, b: any) => {
    if (a > b) return 1;
    if (a === b) return 0;
    return -1;
  };

  test("minOfWithOrNull", () => {
    const seq = Sequence(["one", "four", "seven"]);
    const val = seq.minOfWithOrNull(comp, (x) => x.length);
    assert.equal(val, 5);
  });

  test("minOfWithOrNullWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.minOfWithOrNull(comp, (x, i) => x - 2 * i);
    assert.equal(val, 0);
  });

  test("minOfWithOrNullEmpty", () => {
    const seq = Sequence<number[]>([]);
    const val = seq.minOfWithOrNull(comp, (x) => x.length);
    assert.equal(val, null);
  });

  test("minOfWithOrNullMultiple", () => {
    const seq = Sequence(["hello", "world"]);
    const val = seq.minOfWithOrNull(comp, (x) => x.length);
    assert.equal(val, 5);
  });
});

describe("minOrNull", () => {
  test("minOrNull", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.minOrNull();
    assert.equal(val, 0);
  });

  test("minOrNullEmpty", () => {
    const seq = Sequence([]);
    const val = seq.minOrNull();
    assert.equal(val, null);
  });

  test("minOrNullMultiple", () => {
    const seq = Sequence([0, 1, 2, 0]);
    const val = seq.minOrNull();
    assert.equal(val, 0);
  });

  test("minOrNullSwap", () => {
    const seq = Sequence([0, 1, 2, -1]);
    const val = seq.minOrNull();
    assert.equal(val, -1);
  });
});

describe("minWith", () => {
  const comp = (a: any, b: any) => {
    if (a > b) return 1;
    if (a === b) return 0;
    return -1;
  };

  test("minWith", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.minWith(comp);
    assert.equal(val, 2);
  });

  test("minWithEmpty", () => {
    const seq = Sequence([]);
    assert.throw(seq.minWith.bind(null, comp), "Empty sequence");
  });

  test("minWithMultiple", () => {
    const seq = Sequence([0, 1, 2, 0]);
    const val = seq.minWith(comp);
    assert.equal(val, 2);
  });
});

describe("minWithOrNull", () => {
  const comp = (a: any, b: any) => {
    if (a > b) return 1;
    if (a === b) return 0;
    return -1;
  };

  test("minWithOrNull", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.minWithOrNull(comp);
    assert.equal(val, 2);
  });

  test("minWithOrNullEmpty", () => {
    const seq = Sequence<number[]>([]);
    const val = seq.minWithOrNull(comp);
    assert.equal(val, null);
  });

  test("minWithOrNullMultiple", () => {
    const seq = Sequence([0, 1, 2, 0]);
    const val = seq.minWithOrNull(comp);
    assert.equal(val, 2);
  });
});
