import { doc, updateDoc, setDoc, increment } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export async function updateTotalPoints(points, userId, displayName, photoURL) {
  try {
    const userRef = doc(db, "users", userId); // Referencja do użytkownika
    const rankingRef = doc(db, "ranking", userId); // Referencja do rankingu

    // 1. Aktualizacja punktów w kolekcji `users`
    await updateDoc(userRef, {
      totalPoints: increment(points),
    });

    // 2. Aktualizacja punktów w `ranking`
    await setDoc(
      rankingRef,
      {
        userId,
        displayName: displayName || "Anonim",
        photoURL: photoURL || null,
        totalPoints: increment(points), // Dodaj punkty
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Błąd podczas aktualizacji punktów:", error.message);
  }
}
