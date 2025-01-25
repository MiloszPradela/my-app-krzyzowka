"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";

function UserControls() {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      if (isLoginForm) {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/"); 
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        router.push("/"); 
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="items-left text-left gap-6 mt-6 p-6 bg-base-300 rounded-lg w-100">
      <h2 className="text-2xl font-bold">
        {isLoginForm ? "Logowanie" : "Rejestracja"}
      </h2>
      {error && (
        <div className="alert alert-error">
          <p>{error}</p>
        </div>
      )}
      <form onSubmit={handleFormSubmit} className="space-y-4 w-full">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input input-bordered w-full"
            placeholder="Wprowadź email"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Hasło</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input input-bordered w-full"
            placeholder="Wprowadź hasło"
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">
          {isLoginForm ? "Zaloguj się" : "Zarejestruj się"}
        </button>
      </form>
      <div className="text-sm text-left mt-4">
        {isLoginForm ? (
          <>
            Nie masz konta?{" "}
            <button
              onClick={() => setIsLoginForm(false)}
              className="btn-secondary"
            >
              Zarejestruj się
            </button>
          </>
        ) : (
          <>
            Masz już konto?{" "}
            <button
              onClick={() => setIsLoginForm(true)}
              className="btn-primary"
            >
              Zaloguj się
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default UserControls;
