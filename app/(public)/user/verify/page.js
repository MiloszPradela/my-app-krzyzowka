"use client";

import { getAuth, sendEmailVerification, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useState } from "react";

export default function VerifyEmail() {
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSending, setIsSending] = useState(false);

  const resendVerificationEmail = async () => {
    setError("");
    setSuccess("");
    setIsSending(true);

    try {
      // Temporarily sign in the user to access the auth.currentUser
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send verification email
      await sendEmailVerification(user);
      setSuccess("E-mail weryfikacyjny został ponownie wysłany.");

      // Sign out the user after sending the email
      await signOut(auth);
    } catch (err) {
      setError("Wystąpił błąd: " + err.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-fit bg-base-200 box-shadow-main">
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-xl font-bold mb-4 text-red-600">Email Not Verified</h1>
        <p className="text-gray-700 mb-4">
          Zweryfikuj swój e-mail, klikając link wysłany na adres podany podczas rejestracji.
        </p>
        <p className="mt-4 text-gray-500">Jeśli nie otrzymałeś e-maila, możesz wysłać go ponownie.</p>

        {/* Email Input */}
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Wprowadź swój e-mail"
          />
        </div>

        {/* Password Input */}
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Hasło</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Wprowadź swoje hasło"
          />
        </div>

        {/* Success Message */}
        {success && <p className="text-green-600 mt-4">{success}</p>}

        {/* Error Message */}
        {error && <p className="text-red-600 mt-4">{error}</p>}

        {/* Resend Verification Button */}
        <button
          onClick={resendVerificationEmail}
          className={`btn btn-primary mt-6 ${isSending ? "btn-disabled" : ""}`}
          disabled={isSending}
        >
          {isSending ? "Wysyłanie..." : "Wyślij ponownie e-mail weryfikacyjny"}
        </button>
      </div>
    </div>
  );
}
