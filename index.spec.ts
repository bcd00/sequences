import { generateSequence, Sequence } from "./index.js";
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
});

describe("chunked", () => {
  test("chunkedEqualSize", () => {
    const seq = Sequence([0, 1, 2, 3]);
    const val = seq.chunked(2).toArray();
    assert.deepEqual(val, [
      [0, 1],
      [2, 3]
    ]);
  });

  test("chunkedPartial", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.chunked(2).toArray();
    assert.deepEqual(val, [[0, 1], [2]]);
  });

  test("chunkedEqualSizeWithTransform", () => {
    const seq = Sequence([0, 1, 2, 3]);
    const val = seq.chunked(2, (x) => Math.max(...x)).toArray();
    assert.deepEqual(val, [1, 3]);
  });

  test("chunkedEqualSizeWithTransformWithIndex", () => {
    const seq = Sequence([0, 1, 2, 3]);
    const val = seq.chunked(2, (x, i) => Math.max(...x) + i).toArray();
    assert.deepEqual(val, [1, 4]);
  });

  test("chunkedPartialWithTransform", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.chunked(2, (x) => Math.max(...x)).toArray();
    assert.deepEqual(val, [1, 2]);
  });

  test("chunkedPartialWithTransformWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.chunked(2, (x, i) => Math.max(...x) + i).toArray();
    assert.deepEqual(val, [1, 3]);
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

describe("distinct", () => {
  test("distinct", () => {
    const seq = Sequence([0, 1, 2, 0, 1, 2]);
    const val = seq.distinct().toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });
});

describe("distinctBy", () => {
  test("distinctBy", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.distinctBy((x) => Math.max(x, 1)).toArray();
    assert.deepEqual(val, [0, 2]);
  });

  test("distinctByWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.distinctBy((x, i) => Math.max(x * x - i, 1)).toArray();
    assert.deepEqual(val, [0, 2]);
  });
});

describe("drop", () => {
  test("drop", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.drop(2).toArray();
    assert.deepEqual(val, [2]);
  });

  test("dropZero", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.drop(0).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });

  test("dropNegative", () => {
    const seq = Sequence([0, 1, 2]);
    assert.throw(() => seq.drop(-1).toArray(), "Negative drop size");
  });

  test("dropAll", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.drop(3).toArray();
    assert.deepEqual(val, []);
  });
});

describe("dropWhile", () => {
  test("dropWhile", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.dropWhile((x) => x < 2).toArray();
    assert.deepEqual(val, [2]);
  });

  test("dropWhileWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.dropWhile((x, i) => x + i < 2).toArray();
    assert.deepEqual(val, [1, 2]);
  });

  test("dropWhileAll", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.dropWhile((x) => x < 3).toArray();
    assert.deepEqual(val, []);
  });

  test("dropWhileAllWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.dropWhile((x, i) => x + i < 5).toArray();
    assert.deepEqual(val, []);
  });

  test("dropWhileNone", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.dropWhile((x) => x < 0).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });

  test("dropWhileNoneWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.dropWhile((x, i) => x + i < 0).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });
});

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

describe("filter", () => {
  test("filter", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.filter((x) => x > 1).toArray();
    assert.deepEqual(val, [2]);
  });

  test("filterWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.filter((_x, i) => i > 1).toArray();
    assert.deepEqual(val, [2]);
  });

  test("filterEmpty", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.filter((x) => x > 4).toArray();
    assert.deepEqual(val, []);
  });

  test("filterAll", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.filter((x) => x >= 0).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });
});

describe("filterNot", () => {
  test("filterNot", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.filterNot((x) => x > 1).toArray();
    assert.deepEqual(val, [0, 1]);
  });

  test("filterNotWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.filterNot((_x, i) => i === 0).toArray();
    assert.deepEqual(val, [1, 2]);
  });

  test("filterNotEmpty", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.filterNot((x) => x < 3).toArray();
    assert.deepEqual(val, []);
  });

  test("filterNotAll", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.filterNot((x) => x > 3).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });
});

describe("filterNotTo", () => {
  test("filterNotTo", () => {
    const xs = [49];
    const seq = Sequence([0, 1, 2]);
    const val = seq.filterNotTo(xs, (x) => x > 3);
    assert.deepEqual(val, [49, 0, 1, 2]);
    assert.deepEqual(xs, [49, 0, 1, 2]);
  });

  test("filterNotToWithIndex", () => {
    const xs = [49];
    const seq = Sequence([0, 1, 2]);
    const val = seq.filterNotTo(xs, (x, i) => x + i > 3);
    assert.deepEqual(val, [49, 0, 1]);
    assert.deepEqual(xs, [49, 0, 1]);
  });
});

describe("filterTo", () => {
  test("filterTo", () => {
    const xs = [49];
    const seq = Sequence([0, 1, 2]);
    const val = seq.filterTo(xs, (x) => x > 0);
    assert.deepEqual(val, [49, 1, 2]);
    assert.deepEqual(xs, [49, 1, 2]);
  });

  test("filterToWithIndex", () => {
    const xs = [49];
    const seq = Sequence([0, 1, 2]);
    const val = seq.filterTo(xs, (x, i) => x + i > 0);
    assert.deepEqual(val, [49, 1, 2]);
    assert.deepEqual(xs, [49, 1, 2]);
  });
});

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

describe("flatMap", () => {
  test("flatMap", () => {
    const seq = Sequence([
      [0, 1],
      [2, 3]
    ]);
    const val = seq.flatMap((xs) => xs.slice(0, 1)).toArray();
    assert.deepEqual(val, [0, 2]);
  });

  test("flatMapWithoutNesting", () => {
    const seq = Sequence([0, 1, 2]);
    assert.throw(
      // @ts-expect-error TS2322
      () => seq.flatMap((xs) => xs).toArray(),
      "transform is not iterable"
    );
  });

  test("flatMapWithIndex", () => {
    const seq = Sequence([
      [0, 1],
      [2, 3]
    ]);
    const val = seq
      .flatMap((xs, i) => xs.slice(0, 1).map((x) => x + i))
      .toArray();
    assert.deepEqual(val, [0, 3]);
  });
});

describe("flatMapTo", () => {
  test("flatMapTo", () => {
    const seq = Sequence([
      [0, 1],
      [2, 3]
    ]);
    const xs = [49];
    const val = seq.flatMapTo(xs, (ys) => ys.slice(0, 1));
    assert.deepEqual(val, [49, 0, 2]);
    assert.deepEqual(xs, [49, 0, 2]);
  });

  test("flatMapToWithoutNesting", () => {
    const seq = Sequence([0, 1, 2]);
    const xs = [49];
    assert.throw(
      // @ts-expect-error TS2322
      () => seq.flatMapTo(xs, (ys) => ys),
      "transform is not iterable",
      () => assert.deepEqual(xs, [49])
    );
  });

  test("flatMapToWithIndex", () => {
    const seq = Sequence([
      [0, 1],
      [2, 3]
    ]);
    const xs = [49];
    const val = seq.flatMapTo(xs, (ys, i) => ys.slice(0, 1).map((x) => x + i));
    assert.deepEqual(val, [49, 0, 3]);
    assert.deepEqual(xs, [49, 0, 3]);
  });
});

describe("flatten", () => {
  test("flatten", () => {
    const seq = Sequence([
      [0, 1],
      [2, 3]
    ]);
    const val = seq.flatten().toArray();
    assert.deepEqual(val, [0, 1, 2, 3]);
  });

  test("flattenWithoutNesting", () => {
    const seq = Sequence([0, 1, 2]);
    assert.throw(() => seq.flatten().toArray(), "Item is not iterable");
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

describe("map", () => {
  test("map", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.map((x) => x + 1).toArray();
    assert.deepEqual(val, [1, 2, 3]);
  });

  test("mapWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.map((x, i) => x + i).toArray();
    assert.deepEqual(val, [0, 2, 4]);
  });
});

describe("mapTo", () => {
  test("mapTo", () => {
    const seq = Sequence([0, 1, 2]);
    const xs = [49];
    const val = seq.mapTo(xs, (x) => x + 1);
    assert.deepEqual(val, [49, 1, 2, 3]);
    assert.deepEqual(xs, [49, 1, 2, 3]);
  });

  test("mapToWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const xs = [49];
    const val = seq.mapTo(xs, (x, i) => x + i);
    assert.deepEqual(val, [49, 0, 2, 4]);
    assert.deepEqual(xs, [49, 0, 2, 4]);
  });
});

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

describe("minus", () => {
  test("minusSome", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.minus([1, 2]).toArray();
    assert.deepEqual(val, [0]);
  });

  test("minusNotIncluded", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.minus([0, 3]).toArray();
    assert.deepEqual(val, [1, 2]);
  });

  test("minusAll", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.minus([0, 1, 2]).toArray();
    assert.deepEqual(val, []);
  });

  test("minusNone", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.minus([3, 4]).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });

  test("minusEmpty", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.minus([]).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });

  test("minusFromEmpty", () => {
    const seq = Sequence<number>([]);
    const val = seq.minus([0, 1]).toArray();
    assert.deepEqual(val, []);
  });
});

describe("minusElement", () => {
  test("minusPresent", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.minusElement(0).toArray();
    assert.deepEqual(val, [1, 2]);
  });

  test("minusMissing", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.minusElement(3).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });

  test("minusFromEmpty", () => {
    const seq = Sequence<number>([]);
    const val = seq.minusElement(3).toArray();
    assert.deepEqual(val, []);
  });

  test("minusSingle", () => {
    const seq = Sequence([1]);
    const val = seq.minusElement(1).toArray();
    assert.deepEqual(val, []);
  });
});

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

describe("onEach", () => {
  test("onEach", () => {
    const seq = Sequence([0, 1, 2]);
    let i = 0;
    const val = seq.onEach((x) => (i += x)).toArray();
    assert.equal(i, 3);
    assert.deepEqual(val, [0, 1, 2]);
  });

  test("onEachWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    let i = 0;
    const val = seq.onEach((x, j) => (i += x + j)).toArray();
    assert.equal(i, 6);
    assert.deepEqual(val, [0, 1, 2]);
  });

  test("onEachEmpty", () => {
    const seq = Sequence<number>([]);
    let i = 0;
    const val = seq.onEach((x) => (i += x)).toArray();
    assert.equal(i, 0);
    assert.deepEqual(val, []);
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

describe("plus", () => {
  test("plusArr", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.plus([3, 4]).toArray();
    assert.deepEqual(val, [0, 1, 2, 3, 4]);
  });

  test("plusSeq", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.plus(Sequence([3, 4])).toArray();
    assert.deepEqual(val, [0, 1, 2, 3, 4]);
  });

  test("plusEmptyArr", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.plus([]).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });

  test("plusEmptySeq", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.plus(Sequence([])).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });

  test("plusArrToEmpty", () => {
    const seq = Sequence<number>([]);
    const val = seq.plus([0, 1, 2]).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });

  test("plusSeqToEmpty", () => {
    const seq = Sequence<number>([]);
    const val = seq.plus(Sequence([0, 1, 2])).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });
});

describe("plusElement", () => {
  test("plusElement", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.plusElement(3).toArray();
    assert.deepEqual(val, [0, 1, 2, 3]);
  });

  test("plusElementToEmpty", () => {
    const seq = Sequence<number>([]);
    const val = seq.plusElement(3).toArray();
    assert.deepEqual(val, [3]);
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

describe("take", () => {
  test("take", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.take(2).toArray();
    assert.deepEqual(val, [0, 1]);
  });

  test("takeNTooLarge", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.take(50).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });

  test("takeZero", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.take(0).toArray();
    assert.deepEqual(val, []);
  });

  test("takeNegative", () => {
    const seq = Sequence([0, 1, 2]);
    assert.throw(() => seq.take(-1).toArray(), "n out of bounds");
  });
});

describe("takeWhile", () => {
  test("takeWhile", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.takeWhile((x) => x < 2).toArray();
    assert.deepEqual(val, [0, 1]);
  });

  test("takeWhileAll", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.takeWhile((x) => x < 3).toArray();
    assert.deepEqual(val, [0, 1, 2]);
  });

  test("takeWhileNone", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.takeWhile((x) => x < 0).toArray();
    assert.deepEqual(val, []);
  });

  test("takeWhileEmpty", () => {
    const seq = Sequence<number>([]);
    const val = seq.takeWhile((x) => x > 0).toArray();
    assert.deepEqual(val, []);
  });

  test("takeWhileShortCircuit", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.takeWhile((x) => x > 0).toArray();
    assert.deepEqual(val, []);
  });

  test("takeWhileWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.takeWhile((x, i) => x * x - i === 0).toArray();
    assert.deepEqual(val, [0, 1]);
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

describe("unzip", () => {
  test("unzip", () => {
    const seq = Sequence([
      [0, 3],
      [1, 4],
      [2, 5]
    ]);
    const [one, two] = seq.unzip();
    assert.deepEqual(one, [0, 1, 2]);
    assert.deepEqual(two, [3, 4, 5]);
  });

  test("unzipUnequal", () => {
    const seq = Sequence([[0, 3], [1, 4], [2]]);
    const [one, two] = seq.unzip();
    assert.deepEqual(one, [0, 1, 2]);
    assert.deepEqual(two, [3, 4, undefined]);
  });

  test("unzipEmpty", () => {
    const seq = Sequence<number>([]);
    const [one, two] = seq.unzip();
    assert.deepEqual(one, []);
    assert.deepEqual(two, []);
  });
});

describe("windowed", () => {
  test("windowed", () => {
    const seq = Sequence([0, 1, 2, 3, 4, 5]);
    const val = seq.windowed(3).toArray();
    assert.deepEqual(val, [
      [0, 1, 2],
      [1, 2, 3],
      [2, 3, 4],
      [3, 4, 5]
    ]);
  });

  test("windowedStep", () => {
    const seq = Sequence([0, 1, 2, 3, 4, 5]);
    const val = seq.windowed(3, 2).toArray();
    assert.deepEqual(val, [
      [0, 1, 2],
      [2, 3, 4]
    ]);
  });

  test("windowedPartial", () => {
    const seq = Sequence([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const val = seq.windowed(5, 3, true).toArray();
    assert.deepEqual(val, [
      [1, 2, 3, 4, 5],
      [4, 5, 6, 7, 8],
      [7, 8, 9, 10],
      [10]
    ]);
  });

  test("windowedPartialComplete", () => {
    const seq = Sequence([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const val = seq.windowed(5, 3, true).toArray();
    assert.deepEqual(val, [
      [1, 2, 3, 4, 5],
      [4, 5, 6, 7, 8],
      [7, 8, 9, 10, 11],
      [10, 11, 12]
    ]);
  });

  test("windowedTransform", () => {
    const seq = Sequence([0, 1, 2, 3, 4, 5]);
    const val = seq
      .windowed(
        3,
        2,
        undefined,
        (xs) => xs.reduce((acc, x) => acc + x, 0) / xs.length
      )
      .toArray();
    assert.deepEqual(val, [1, 3]);
  });

  test("windowedTransformWithIndex", () => {
    const seq = Sequence([0, 1, 2, 3, 4, 5]);
    const val = seq
      .windowed(
        3,
        2,
        undefined,
        (xs, i) => xs.reduce((acc, x) => acc + x + i, 0) / xs.length
      )
      .toArray();
    assert.deepEqual(val, [3, 7]);
  });
});

describe("withIndex", () => {
  test("withIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.withIndex().toArray();
    assert.deepEqual(val, [
      { value: 0, index: 0 },
      { value: 1, index: 1 },
      { value: 2, index: 2 }
    ]);
  });

  test("withIndexEmpty", () => {
    const seq = Sequence<number>([]);
    const val = seq.withIndex().toArray();
    assert.deepEqual(val, []);
  });
});

describe("zip", () => {
  test("zipEqual", () => {
    const seq = Sequence([0, 1, 2]);
    const seq2 = Sequence([3, 4, 5]);
    const val = seq.zip(seq2).toArray();
    assert.deepEqual(val, [
      [0, 3],
      [1, 4],
      [2, 5]
    ]);
  });

  test("zipUnequal", () => {
    const seq = Sequence([0, 1, 2]);
    const seq2 = Sequence([3, 4]);
    const val = seq.zip(seq2).toArray();
    assert.deepEqual(val, [
      [0, 3],
      [1, 4]
    ]);
  });

  test("zipWithTransform", () => {
    const seq = Sequence([0, 1, 2]);
    const seq2 = Sequence([3, 4, 5]);
    const val = seq.zip(seq2, (a, b) => [a + b, a + b]).toArray();
    assert.deepEqual(val, [
      [3, 3],
      [5, 5],
      [7, 7]
    ]);
  });

  test("zipWithTransformWithIndex", () => {
    const seq = Sequence([0, 1, 2]);
    const seq2 = Sequence([3, 4, 5]);
    const val = seq.zip(seq2, (a, b, i) => [a + i, b + i]).toArray();
    assert.deepEqual(val, [
      [0, 3],
      [2, 5],
      [4, 7]
    ]);
  });

  test("zipEmpty", () => {
    const seq = Sequence<number>([]);
    const seq2 = Sequence([3, 4, 5]);
    const val = seq.zip(seq2).toArray();
    assert.deepEqual(val, []);
  });
});

describe("zipWithNext", () => {
  test("zipWithNextEqual", () => {
    const seq = Sequence([0, 1, 2, 3]);
    const val = seq.zipWithNext().toArray();
    assert.deepEqual(val, [
      [0, 1],
      [2, 3]
    ]);
  });

  test("zipWithNextUnequal", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.zipWithNext().toArray();
    assert.deepEqual(val, [[0, 1]]);
  });

  test("zipWithNextWithTransform", () => {
    const seq = Sequence([0, 1, 2]);
    const val = seq.zipWithNext((a, b) => a + b / 2).toArray();
    assert.deepEqual(val, [0.5]);
  });

  test("zipWithNextWithTransformWithIndex", () => {
    const seq = Sequence([0, 1, 2, 3]);
    const val = seq.zipWithNext((a, b, i) => a + b / 2 + i).toArray();
    assert.deepEqual(val, [0.5, 4.5]);
  });

  test("zipWithNextEmpty", () => {
    const seq = Sequence<number>([]);
    const val = seq.zipWithNext().toArray();
    assert.deepEqual(val, []);
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
