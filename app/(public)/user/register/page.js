"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // Create the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);
      setSuccess(true);

      // Redirect to the verification page
      router.push("/user/verify");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center bg-base-200 box-shadow-main">
      <div className="card w-96 bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Rejestracja</h2>
          {error && (
            <div className="alert alert-error mt-4">
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="alert alert-success mt-4">
              <span>Konto zostało utworzone. Sprawdź swoją skrzynkę e-mail, aby zweryfikować konto.</span>
            </div>
          )}
          <form onSubmit={handleRegister} className="space-y-4">
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
            <div className="form-control">
              <label className="label">
                <span className="label-text">Potwierdź hasło</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input input-bordered w-full"
                placeholder="Potwierdź hasło"
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Zarejestruj się
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
