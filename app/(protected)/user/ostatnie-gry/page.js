"use client";

import { useAuth } from "@/app/lib/AuthContext";
import RecentGames from "@/app/(protected)/user/ostatnie-gry/RecentGames";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RecentGamesPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/user/signin");
    }
  }, [user, router]);

  if (!user) {
    return null; 
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Ostatnie Zagrane Gry</h1>
      <RecentGames />
    </div>
  );
}
