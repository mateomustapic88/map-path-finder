import React, { useState } from "react";
import { followPath } from "../utils/pathFinder";
import styles from "./PathFinder.module.scss";

const PathFinder: React.FC = () => {
  const [mapInput, setMapInput] = useState("");
  const [collectedLetters, setCollectedLetters] = useState("");
  const [pathAsCharacters, setPathAsCharacters] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleProcessMap = () => {
    try {
      const map = mapInput.split("\n").map((line) => line.split(""));
      const result = followPath(map);
      setCollectedLetters(result.collectedLetters);
      setPathAsCharacters(result.pathAsCharacters);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1>Map Path Finder</h1>
      <textarea
        value={mapInput}
        onChange={(e) => setMapInput(e.target.value)}
        rows={10}
        cols={40}
        placeholder='Enter the map here...'
        className={styles.mapInput} // Apply styles
      />
      <br />
      <button onClick={handleProcessMap} className={styles.processButton}>
        Process Map
      </button>
      {error ? (
        <div className={styles.errorMessage}>Error: {error}</div>
      ) : (
        <div className={styles.result}>
          <div>Collected Letters: {collectedLetters}</div>
          <div>Path: {pathAsCharacters}</div>
        </div>
      )}
    </div>
  );
};

export default PathFinder;
