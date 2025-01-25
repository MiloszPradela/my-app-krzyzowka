"use client";

import { useAuth } from "@/app/lib/AuthContext";
import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import UserHeader from "@/app/components/UserHeader";
import Nav from "./Nav";

function Header() {
  const auth = useAuth();
  const user = auth?.user;
  const [userData, setUserData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu toggle

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;

      try {
        const snapshot = await getDoc(doc(db, "users", user.uid));
        if (snapshot.exists()) {
          setUserData(snapshot.data());
        }
      } catch (error) {
        console.error("Błąd podczas pobierania danych użytkownika:", error.message);
      }
    };

    fetchUserData();
  }, [user?.uid]);

  return (
    <div className="container-custom mx-auto text-center">
      <div className="opacity-100 transition-opacity duration-500">
        <div className="header-items flex items-center justify-between bg-base-800 shadow-md rounded-lg">
          {/* WSEI Logo */}
          <div className="image-logo-wrapper">
            <img src="../../../WSEI.png" alt="WSEI logo" className="w-40" />
          </div>

          {/* Hamburger Icon */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle menu
            className="p-2 md:hidden focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-8 h-8 text-gray-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>

          {/* User Header */}
          <div className="hidden md:block">
            <UserHeader />
          </div>
        </div>
      </div>

      {/* Mobile Side Menu */}
      <div
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-black shadow-lg transform transition-transform duration-300 menu-mobile-class ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsMenuOpen(false)} // Close menu
          className="p-4 text-gray-500 hover:text-gray-800"
          aria-label="Close menu"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>

        {/* User Header and Navigation */}
        <div className="p-4">
          <UserHeader /> {/* Avatar and Nickname */}
          <div className="mt-4">
            <Nav /> {/* Navigation Menu */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
