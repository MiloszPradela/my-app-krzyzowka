"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/AuthContext";
import WordSearch from "../nowa-gra/WordSearch";

export default function NowaGraPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [difficulty, setDifficulty] = useState("easy");

  const easyWords = ["DOG", "CAT", "BIRD", "COW", "FISH"];
  const mediumWords = ["PYTHON", "JAVASCRIPT", "FIREBASE", "REACT"];
  const hardWords = ["HELLO", "WORLD", "DIAGONAL", "BACKWARD", "TWISTED"];

  const words =
    difficulty === "easy"
      ? easyWords
      : difficulty === "medium"
      ? mediumWords
      : hardWords;

  useEffect(() => {
    if (!user) {
      router.push("/user/signin");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Nowa Gra</h1>
      <div className="mb-4">
        <label className="font-bold">Wybierz poziom trudności:</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="ml-2 p-2 border rounded"
        >
          <option value="easy">Łatwy</option>
          <option value="medium">Średni</option>
          <option value="hard">Trudny</option>
        </select>
      </div>
      <WordSearch words={words} size={10} userId={user.uid} difficulty={difficulty} />
    </div>
  );
}
