"use client";

import { useAuth } from "@/app/lib/AuthContext";

function UserHeader() {
  const { user } = useAuth();

  return (
    <div className="container-custom mx-auto text-center">
      <div className="bg-base-200 flex flex-col items-center container-user-logged-in">
        {/* Awatar użytkownika */}
        <div className="avatar">
          {user?.photoURL ? (
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 avatar-wrapper">
              <img src={user.photoURL} alt="Zdjęcie profilowe użytkownika" />
            </div>
          ) : (
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
              <span className="text-sm">Brak zdjęcia</span>
            </div>
          )}
        </div>

        {/* Nick użytkownika */}
        <p className="text-lg font-bold user-header-mobile">
          <strong></strong> {user?.displayName || "Nie ustawiony"}
        </p>
      </div>
    </div>
  );
}

export default UserHeader;
