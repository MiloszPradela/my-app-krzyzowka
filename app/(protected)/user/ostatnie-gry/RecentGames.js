"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import { collection, getDocs, query, where, orderBy, limit, doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/app/lib/AuthContext";

function RecentGames() {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  const [recentPoints, setRecentPoints] = useState(0);

  useEffect(() => {
    const fetchRecentGames = async () => {
      if (!user) return;

      try {
        const gamesRef = collection(db, "recent_games");
        const q = query(
          gamesRef,
          where("userId", "==", user.uid),
          orderBy("playedAt", "desc"),
          limit(10)
        );

        const querySnapshot = await getDocs(q);
        const fetchedGames = querySnapshot.docs.map((doc) => {
          const data = doc.data();

          const totalPoints = Number(data.totalPoints) || 0;
          const timeBonus = totalPoints > 0 ? Number(data.timeBonusPoints || 0) : 0; // Ustaw na 0 jeśli przegrana
          const levelBonus =
            totalPoints > 0
              ? totalPoints - (Number(data.wordCount) || 0) - timeBonus
              : 0; // Ustaw na 0 jeśli przegrana

          console.log("Game data:", { totalPoints, timeBonus, levelBonus });

          return {
            ...data,
            totalPoints,
            levelBonus,
            timeBonus,
          };
        });

        const recentPointsSum = fetchedGames.reduce((sum, game) => sum + game.totalPoints, 0);

        setGames(fetchedGames);
        setRecentPoints(recentPointsSum);
      } catch (error) {
        console.error("Error fetching recent games:", error.message);
      }
    };

    const fetchUserPoints = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setTotalPoints(userData.totalPoints || 0);
        }
      } catch (error) {
        console.error("Error fetching user points:", error.message);
      }
    };

    fetchRecentGames();
    fetchUserPoints();
    setLoading(false);
  }, [user]);

  if (loading) {
    return <p>Ładowanie...</p>;
  }

  if (!games.length) {
    return <p>Nie masz jeszcze żadnych zagranych gier.</p>;
  }
// change recentPoints for totalPoints to see full history //
  return (
    <div className="space-y-4">
      <div className="text-lg">
        <p>
          <strong>Łączna liczba punktów:</strong> {totalPoints}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">Data</th>
              <th className="border border-gray-300 px-4 py-2">Liczba słów</th>
              <th className="border border-gray-300 px-4 py-2">Poziom</th>
              <th className="border border-gray-300 px-4 py-2">Punkty</th>
              <th className="border border-gray-300 px-4 py-2">Bonus</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {game.playedAt?.toDate().toLocaleString() || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">{game.wordCount || 0}</td>
                <td className="border border-gray-300 px-4 py-2">{game.level || "Brak"}</td>
                <td className="border border-gray-300 px-4 py-2">{game.totalPoints || 0}</td>
                <td className="border border-gray-300 px-4 py-2">
                  +{game.levelBonus || 0} za ukończenie gry,
                  +{game.timeBonus || 0} za czas
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentGames;
