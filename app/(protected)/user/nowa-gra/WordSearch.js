"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, setDoc, Timestamp, updateDoc, doc, increment } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

function WordSearch({ words, size = 10, userId, difficulty, displayName, photoURL }) {
  const [grid, setGrid] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [success, setSuccess] = useState(false);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [bonusTimeLeft, setBonusTimeLeft] = useState(0); // Bonus timer
  const [isGameOver, setIsGameOver] = useState(false); // To track if the game has ended

  useEffect(() => {
    const newGrid = generateGrid(size, words, difficulty);
    setGrid(newGrid);
    resetGameState();
  }, [words, size, difficulty]);

  useEffect(() => {
    if (isGameStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        setBonusTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }

    if (timeLeft === 0 && isGameStarted) {
      endGameDueToTimeout();
    }
  }, [isGameStarted, timeLeft]);

  function resetGameState() {
    setSelectedLetters([]);
    setFoundWords([]);
    setHighlightedCells([]);
    setSuccess(false);
    setTotalPoints(0);
    setPopupMessage("");
    setShowSummary(false);
    setGameStartTime(null);
    setIsGameStarted(false);
    setTimeLeft(300); // Reset to 5 minutes
    setBonusTimeLeft(calculateBonusTime(difficulty));
    setIsGameOver(false);
  }

  function generateGrid(size, words, difficulty) {
    const grid = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => "")
    );

    words.forEach((currentWord) => {
      const placed = placeWordInGrid(grid, currentWord, difficulty);
      if (!placed) console.warn(`Failed to place word: ${currentWord}`);
    });

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (grid[row][col] === "") {
          grid[row][col] = String.fromCharCode(65 + Math.random() * 26);
        }
      }
    }

    return grid;
  }

  function placeWordInGrid(grid, currentWord, difficulty) {
    const directions = [
      { x: 0, y: 1 },
      { x: 1, y: 0 },
    ];

    if (difficulty !== "easy") {
      directions.push({ x: 1, y: 1 });
    }

    if (difficulty === "hard") {
      directions.push({ x: 0, y: -1 });
      directions.push({ x: -1, y: 0 });
      directions.push({ x: -1, y: -1 });
    }

    for (let attempts = 0; attempts < 50; attempts++) {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const startX = Math.floor(Math.random() * size);
      const startY = Math.floor(Math.random() * size);

      if (canPlaceWord(grid, currentWord, startX, startY, direction)) {
        for (let i = 0; i < currentWord.length; i++) {
          const x = startX + i * direction.x;
          const y = startY + i * direction.y;
          grid[x][y] = currentWord[i];
        }
        return true;
      }
    }

    return false;
  }

  function canPlaceWord(grid, currentWord, startX, startY, direction) {
    for (let i = 0; i < currentWord.length; i++) {
      const x = startX + i * direction.x;
      const y = startY + i * direction.y;

      if (
        x < 0 ||
        y < 0 ||
        x >= grid.length ||
        y >= grid[0].length ||
        (grid[x][y] !== "" && grid[x][y] !== currentWord[i])
      ) {
        return false;
      }
    }
    return true;
  }

  function handleSelect(row, col) {
    if (!isGameStarted) return;

    const isAlreadySelected = selectedLetters.some(
      (cell) => cell.row === row && cell.col === col
    );

    const isAdjacent =
      selectedLetters.length === 0 ||
      selectedLetters.some((cell) => {
        const dx = Math.abs(cell.row - row);
        const dy = Math.abs(cell.col - col);
        return dx <= 1 && dy <= 1;
      });

    if (!isAdjacent) {
      setPopupMessage("Możesz zaznaczać tylko sąsiednie litery!");
      setTimeout(() => setPopupMessage(""), 2000);
      return;
    }

    if (isAlreadySelected) {
      setSelectedLetters((prev) => prev.filter((cell) => !(cell.row === row && cell.col === col)));
      return;
    }

    setSelectedLetters((prev) => [...prev, { row, col }]);
  }

  async function checkWord() {
    if (!isGameStarted) return;

    const selectedWord = selectedLetters.map(({ row, col }) => grid[row][col]).join("");
    if (words.includes(selectedWord) && !foundWords.includes(selectedWord)) {
      setFoundWords((prev) => [...prev, selectedWord]);
      setHighlightedCells((prev) => [...prev, ...selectedLetters]);
      setSelectedLetters([]);

      if (foundWords.length + 1 === words.length) {
        await endGame(true); // Success
      }
    } else {
      setSelectedLetters([]);
    }
  }

  async function endGame(isSuccessful) {
    const levelBonusPoints = calculateLevelBonus(difficulty);
    const timeBonusPoints = bonusTimeLeft > 0 ? calculateBonusTimePoints(difficulty) : 0;
    const finalPoints = isSuccessful
      ? words.length + levelBonusPoints + timeBonusPoints
      : 0;

    try {
      const recentGamesRef = collection(db, "recent_games");
      await addDoc(recentGamesRef, {
        userId,
        displayName: displayName || "Anonimowy użytkownik",
        photoURL: photoURL || "https://example.com/default-avatar.jpg",
        wordCount: words.length,
        totalPoints: finalPoints,
        level: difficulty,
        playedAt: gameStartTime,
        finishedAt: Timestamp.now(),
        timeBonusPoints: timeBonusPoints,
      });

      if (userId) {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
          totalPoints: increment(finalPoints),
        });

        const rankingRef = doc(db, "ranking", userId);
        await setDoc(
          rankingRef,
          {
            displayName: displayName || "Anonimowy użytkownik",
            photoURL: photoURL || "https://example.com/default-avatar.jpg",
            totalPoints: increment(finalPoints),
          },
          { merge: true }
        );
      }
    } catch (error) {
      console.error("Error saving game or updating user points:", error.message);
    }

    setSuccess(isSuccessful);
    setShowSummary(true);
    setIsGameOver(true);
    setIsGameStarted(false);
  }

  async function endGameDueToTimeout() {
    setPopupMessage("Czas minął! Gra zakończona.");
    setTimeout(() => setPopupMessage(""), 2000);
    await endGame(false); // Failure
  }

  function calculateLevelBonus(difficulty) {
    if (difficulty === "easy") return 3;
    if (difficulty === "medium") return 7;
    if (difficulty === "hard") return 15;
    return 0;
  }

  function calculateBonusTime(difficulty) {
    if (difficulty === "easy") return 180;
    if (difficulty === "medium") return 120;
    if (difficulty === "hard") return 60;
    return 0;
  }

  function calculateBonusTimePoints(difficulty) {
    if (difficulty === "easy") return 5;
    if (difficulty === "medium") return 10;
    if (difficulty === "hard") return 20;
    return 0;
  }

  return (
    <div>
      {!isGameStarted && (
        <button
          onClick={() => {
            setGameStartTime(Timestamp.now());
            setIsGameStarted(true);
            setBonusTimeLeft(calculateBonusTime(difficulty));
          }}
          className="p-4 bg-green-500 text-white rounded mb-4"
        >
          Rozpocznij grę
        </button>
      )}

      {isGameStarted && (
        <div className="mb-4 flex justify-between">
          <div className="timer text-lg font-bold">
            Pozostały czas: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
          </div>
          {bonusTimeLeft > 0 && (
            <div className="bonus-timer text-lg font-bold text-red-500">
              Bonus za czas: {Math.floor(bonusTimeLeft / 60)}:{String(bonusTimeLeft % 60).padStart(2, "0")}
            </div>
          )}
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-lg font-bold">Znajdź:</h2>
        <ul className="slowa-do-znalezienia">
          {words.map((word, index) => (
            <li key={index} className={foundWords.includes(word) ? "text-green-500" : ""}>
              {word}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
        {grid.map((row, rowIndex) =>
          row.map((letter, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`p-4 border text-center border-grid-style ${
                selectedLetters.some((cell) => cell.row === rowIndex && cell.col === colIndex)
                  ? "bg-blue-300"
                  : highlightedCells.some((cell) => cell.row === rowIndex && cell.col === colIndex)
                  ? "bg-green-500"
                  : "bg-white"
              }`}
              onClick={() => handleSelect(rowIndex, colIndex)}
            >
              {letter}
            </div>
          ))
        )}
      </div>

      {isGameStarted && (
        <button onClick={checkWord} className="mt-4 p-2 btn-primary">
          Sprawdź
        </button>
      )}

      {popupMessage && (
        <div className="popup bg-green-100 border border-green-400 text-green-700 p-3 rounded absolute top-10 left-1/2 transform -translate-x-1/2">
          {popupMessage}
        </div>
      )}

      {showSummary && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <button
              onClick={() => {
                resetGameState();
                setShowSummary(false);
              }}
              className="absolute top-2 right-2 text-red-500 text-xl font-bold"
            >
              X
            </button>
            <h3 className="font-bold text-lg mb-4">Podsumowanie:</h3>
            {success ? (
              <>
                <p>Liczba odgadniętych haseł: {words.length}</p>
                <p>Premia za poziom: {calculateLevelBonus(difficulty)}</p>
                <p>Premia za czas: {bonusTimeLeft > 0 ? calculateBonusTimePoints(difficulty) : 0}</p>
                <p className="font-bold">
                  Łączna liczba punktów:{" "}
                  {words.length + calculateLevelBonus(difficulty) + (bonusTimeLeft > 0 ? calculateBonusTimePoints(difficulty) : 0)}
                </p>
                <p className="text-green-500 font-bold mt-4">Gratulacje! Wygrałeś!</p>
              </>
            ) : (
              <p className="text-red-500 font-bold">
                Gra zakończona! Nie udało się znaleźć wszystkich słów. Zdobyłeś 0 punktów.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default WordSearch;
