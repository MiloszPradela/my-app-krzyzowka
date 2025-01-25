"use client";

import Link from "next/link";
import { useAuth } from "./lib/AuthContext";
import { useRouter } from "next/navigation";
import UserControls from "./components/UserControls";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect to verification page if the email is not verified
  if (user && !user.emailVerified) {
    router.push("/user/verify");
    return null; // Prevent rendering while redirecting
  }

  if (!user) {
    return (
      <div className="bg-base-200 w-fit box-shadow-main p-10 r-10 rounded-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Witaj w Wykreślance!</h1>
          <p className="text-lg mb-6">
            Zaloguj się lub zarejestruj, aby rozpocząć grę.
          </p>
          <UserControls />
        </div>
      </div>
    );
  }

  return (
    <div className="text-primary-content p-10 box-shadow-main w-fit rounded-lg">
      <h1 className="text-4xl font-bold mb-4">Wykreślanka</h1>
      <p className="text-lg">
        Witaj w naszej grze Wykreślanka! Twoim zadaniem jest znaleźć ukryte
        słowa w siatce liter.
      </p>
      <p className="text-lg">Graj na różnych poziomach trudności i zdobywaj punkty.</p>
      <p className="mb-6 text-lg">
        Czy jesteś gotowy, aby podjąć wyzwanie i stać się mistrzem wykreślanek?
      </p>
      <Link href="/user/nowa-gra">
        <button className="btn btn-primary mb-6">Rozpocznij Grę</button>
      </Link>
    </div>
  );
}
