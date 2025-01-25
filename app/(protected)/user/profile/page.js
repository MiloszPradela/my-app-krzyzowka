// components/UserProfile.js
"use client";
import { useAuth } from "@/app/lib/AuthContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getDoc, doc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

function UserProfile() {
  const { user } = useAuth();
  const [address, setAddress] = useState({});
  const [nickname, setNickname] = useState("Anonimowy");
  const [photoURL, setPhotoURL] = useState("https://example.com/default-avatar.jpg");
  const [totalPoints, setTotalPoints] = useState(0); 
  const [recentPoints, setRecentPoints] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;

      try {
        
        const snapshot = await getDoc(doc(db, "users", user.uid));
        const userData = snapshot.data();
        setAddress(userData?.address || {});
        setNickname(userData?.nickname || "Anonimowy użytkownik");
        setPhotoURL(userData?.photoURL || "https://example.com/default-avatar.jpg");
        setTotalPoints(userData?.totalPoints || 0);
      } catch (error) {
        console.error("Błąd podczas pobierania danych użytkownika:", error.message);
      }
    };

    const fetchRecentGamesPoints = async () => {
      if (!user?.uid) return;

      try {
        const recentGamesRef = collection(db, "recent_games");
        const q = query(recentGamesRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const points = querySnapshot.docs.reduce((sum, doc) => {
          const gameData = doc.data();
          return sum + (gameData.totalPoints || 0);
        }, 0);

        setRecentPoints(points);
      } catch (error) {
        console.error("Błąd podczas pobierania punktów z recent_games:", error.message);
      }
    };

    fetchUserData();
    fetchRecentGamesPoints();
  }, [user?.uid]);
// change recentPoints for totalPoints to see full history //
  return (
    <>
      {user && (
        <div className="p-10 bg-base-300 space-y-4 rounded-lg shadow-lg box-shadow-main w-fit">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Twój Profil</h1>
          <div className="space-y-2 text-left">
            <p className="text-lg">
              <strong>Nick:</strong> {nickname}
            </p>
            <p className="text-lg">
              <strong>Email:</strong> {user.email || "Brak dostępnego emaila"}
            </p>
            <p className="text-lg">
              <strong>Łączna liczba punktów:</strong> {recentPoints}  
            </p>
            

            <div className="mt-4">
              <strong className="block text-lg">Zdjęcie:</strong>
              {photoURL ? (
                <div className="avatar mt-4">
                  <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 zdjecie-uzytkownika">
                    <img src={photoURL} alt="Zdjęcie profilowe" />
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Nie ustawione</p>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-lg">
                <strong>Miasto:</strong> {address.city || "Nie ustawione"}
              </p>
              <p className="text-lg">
                <strong>Ulica:</strong> {address.street || "Nie ustawione"}
              </p>
              <p className="text-lg">
                <strong>Kod pocztowy:</strong> {address.zipCode || "Nie ustawiony"}
              </p>
            </div>
            <div className="mt-6 flex flex-col space-y-2">
              <Link className="btn btn-primary w-full" href="/user/profile/edit">
                Edytuj profil
              </Link>
              <Link className="btn btn-secondary w-full" href="/user/changepassword">
                Zmień Hasło
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserProfile;
