'use client';

import { useState, useEffect, Suspense } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { getAuth } from "firebase/auth";

function LoginForm() {
  const [isOpen, setIsOpen] = useState(true); // Headless UI Dialog state
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth();
  const params = useSearchParams();
  const router = useRouter();
  const returnUrl = params.get("returnUrl");

  const closeModal = () => {
    setIsOpen(false);
    router.push("/"); // Redirect on close
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const email = e.target["email"].value;
    const password = e.target["password"].value;

    setPersistence(auth, browserSessionPersistence)
      .then(() => signInWithEmailAndPassword(auth, email, password))
      .then(() => {
        setIsLoading(false);
        if (!auth.currentUser.emailVerified) {
          router.push("/user/verify");
        } else {
          router.push(returnUrl && returnUrl.trim() ? returnUrl : "/");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setErrorMessage(error.message);
        console.error("Error during login:", error.message);
      });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto box-shadow-main">
          <div className="flex text-center   logowanie-box">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h2"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Logowanie
                </Dialog.Title>
                {errorMessage && (
                  <div
                    role="alert"
                    className="mt-4 p-3 "
                  >
                    {errorMessage}
                  </div>
                )}
                <form onSubmit={onSubmit} className="mt-4">
                  {/* Email */}
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Wprowadź email"
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Hasło
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Wprowadź hasło"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full btn-primary ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? "Loguję..." : "Zaloguj"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default function SuspenseLogin() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
