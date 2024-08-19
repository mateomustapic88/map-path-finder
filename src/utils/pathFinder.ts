type Position = { row: number; col: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

interface PathResult {
  collectedLetters: string;
  pathAsCharacters: string;
}

const directions: Record<Direction, Position> = {
  UP: { row: -1, col: 0 },
  DOWN: { row: 1, col: 0 },
  LEFT: { row: 0, col: -1 },
  RIGHT: { row: 0, col: 1 },
};

export class InvalidMapError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidMapError";
  }
}

const isLetter = (char: string) => /[A-Z]/.test(char);

export const followPath = (map: string[][]): PathResult => {
  let position: Position;
  let direction: Direction | null = null;

  const rows = map.length;
  const cols = map.reduce((max, row) => Math.max(max, row.length), 0);

  const findStartPosition = (): Position => {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < map[row].length; col++) {
        if (map[row][col] === "@") return { row, col };
      }
    }
    throw new InvalidMapError("Missing start character '@'");
  };

  const nextPosition = (pos: Position, dir: Direction): Position => ({
    row: pos.row + directions[dir].row,
    col: pos.col + directions[dir].col,
  });

  const getCharAtPosition = (pos: Position): string => {
    if (pos.row < 0 || pos.row >= rows || pos.col < 0 || pos.col >= cols) {
      return " ";
    }
    return map[pos.row][pos.col] || " ";
  };

  const isValidDirection = (char: string) => {
    return (
      char === "|" ||
      char === "-" ||
      char === "+" ||
      isLetter(char) ||
      char === "@"
    );
  };

  const collectedLetters: string[] = [];
  const pathAsCharacters: string[] = [];

  position = findStartPosition();
  direction = "RIGHT";

  while (true) {
    const currentChar = getCharAtPosition(position);

    if (!isValidDirection(currentChar) && currentChar !== "x") {
      throw new InvalidMapError("Invalid character on the map");
    }

    if (currentChar === "x") {
      pathAsCharacters.push("x");
      break;
    }

    if (isLetter(currentChar) && !collectedLetters.includes(currentChar)) {
      collectedLetters.push(currentChar);
    }

    pathAsCharacters.push(currentChar);

    let nextPos = nextPosition(position, direction);
    let nextChar = getCharAtPosition(nextPos);

    if (nextChar === " ") {
      // Try changing direction if possible
      const possibleDirections: Direction[] = [
        "UP",
        "DOWN",
        "LEFT",
        "RIGHT",
      ] as Direction[];
      const validDirections = possibleDirections.filter(
        (dir) =>
          dir !== direction &&
          getCharAtPosition(nextPosition(position, dir)) !== " "
      );

      if (validDirections.length === 1) {
        direction = validDirections[0];
        nextPos = nextPosition(position, direction);
        nextChar = getCharAtPosition(nextPos);
      } else {
        throw new InvalidMapError("Broken path or multiple paths detected");
      }
    }

    if (nextChar === " ") {
      throw new InvalidMapError("Broken path detected");
    }

    position = nextPos;
  }

  return {
    collectedLetters: collectedLetters.join(""),
    pathAsCharacters: pathAsCharacters.join(""),
  };
};
