// "use client";

// import { useEffect, useState } from "react";
// import { collection, getDocs, query, orderBy } from "firebase/firestore";
// import { db } from "@/app/lib/firebase";

// function Ranking() {
//   const [ranking, setRanking] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchRanking = async () => {
//       try {
//         const recentGamesRef = collection(db, "recent_games");
//         const q = query(recentGamesRef, orderBy("playedAt", "desc")); // Pobieranie gier
//         const querySnapshot = await getDocs(q);

//         const userPointsMap = {};

//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
//           const userId = data.userId;

//           // Debugowanie każdego dokumentu z recent_games
//           console.log("Recent game data:", data);

//           if (userPointsMap[userId]) {
//             userPointsMap[userId].recentPoints += data.totalPoints;
//           } else {
//             userPointsMap[userId] = {
//               displayName: data.displayName || "Anonim",
//               photoURL: data.photoURL || "https://baconmockup.com/250/250/",
//               recentPoints: data.totalPoints || 0,
//             };
//           }
//         });

//         const fetchedRanking = Object.entries(userPointsMap)
//           .map(([userId, userData]) => ({ userId, ...userData }))
//           .sort((a, b) => b.recentPoints - a.recentPoints);

//         console.log("Fetched Ranking Data:", fetchedRanking); // Debugowanie danych po przetworzeniu
//         setRanking(fetchedRanking);
//       } catch (error) {
//         console.error("Error fetching ranking:", error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRanking();
//   }, []);

//   if (loading) {
//     return <p>Ładowanie...</p>;
//   }

//   return (
//     <div className="mt-8">
//       <h1 className="text-2xl font-bold mb-4">Ranking</h1>
//       {ranking.length > 0 ? (
//         <div className="overflow-x-auto">
//           <table className="table-auto w-full bg-base-300 rounded-lg shadow-lg">
//             <thead>
//               <tr className="bg-base-200">
//                 <th className="p-2 text-left">Pozycja</th>
//                 <th className="p-2 text-left">Zdjęcie</th>
//                 <th className="p-2 text-left">Nick</th>
//                 <th className="p-2 text-left">Suma punktów</th>
//               </tr>
//             </thead>
//             <tbody>
//               {ranking.map((user, index) => (
//                 <tr key={user.userId} className="border-b border-gray-200">
//                   <td className="p-2">{index + 1}</td>
//                   <td className="p-2">
//                     {user.photoURL ? (
//                       <img
//                         src={user.photoURL}
//                         alt={user.displayName || "Anonim"}
//                         className="w-12 h-12 rounded-full"
//                       />
//                     ) : (
//                       <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-white">
//                         N/A
//                       </div>
//                     )}
//                   </td>
//                   <td className="p-2">{user.displayName || "Anonim"}</td>
//                   <td className="p-2">{user.recentPoints || 0}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <p>Ranking jest pusty.</p>
//       )}
//     </div>
//   );
// }

// export default Ranking;
