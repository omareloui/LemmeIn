import { Tester } from "../../helpers/test.helper.ts";
import compareArrays from "../compareArrays.ts";

const tester = new Tester("utils/compareArrays:");

tester.test("should return true if the arrays are equal", () => {
  tester.shouldEquals(compareArrays([1, 2, 3], [1, 2, 3]), true);
  tester.shouldEquals(
    compareArrays(["one", "two", "three"], ["one", "two", "three"]),
    true
  );
});

tester.test("should return false if the arrays aren't equal", () => {
  tester.shouldEquals(compareArrays([1, 2, 3], [4, 5, 6]), false);
  tester.shouldEquals(
    compareArrays(["one", "two", "three"], ["four", "five", "six"]),
    false
  );
});
