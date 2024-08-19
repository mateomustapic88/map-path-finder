import { followPath } from "../utils/pathFinder";

describe("followPath", () => {
  test("Simple straight path", () => {
    const map = [["@", "-", "A", "-", "x"]];

    const result = followPath(map);
    expect(result.collectedLetters).toBe("A");
    expect(result.pathAsCharacters).toBe("@-A-x");
  });
});
