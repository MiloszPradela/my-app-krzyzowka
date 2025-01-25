"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/app/lib/AuthContext";
import { updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { db } from "@/app/lib/firebase";
import { setDoc, getDoc, doc } from "firebase/firestore";

function EditProfile() {
  const [error, setError] = useState(null);
  const [address, setAddress] = useState({});
  const { user } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;

      try {
        const snapshot = await getDoc(doc(db, "users", user.uid));
        const userData = snapshot.data();

        if (userData) {
          setAddress(userData?.address || {});
          reset({
            city: userData?.address?.city || "",
            street: userData?.address?.street || "",
            zipCode: userData?.address?.zipCode || "",
            displayName: userData?.nickname || "",
            photoURL: userData?.photoURL || "",
          });
        }
      } catch (err) {
        console.error("Error fetching user data:", err.message);
      }
    };

    fetchUserData();
  }, [user?.uid, reset]);

  const onSubmit = async (data) => {
  try {
    // Aktualizuj dane w Firebase Authentication
    await updateProfile(user, {
      displayName: data.displayName,
      photoURL: data.photoURL,
    });

    await setDoc(doc(db, "users", user?.uid), {
      nickname: data.displayName, // Zapis nickname
      photoURL: data.photoURL,   // Zapis URL zdjęcia
      address: {
        city: data.city,
        street: data.street,
        zipCode: data.zipCode,
      },
    }, { merge: true });

    router.push("/user/profile");
  } catch (err) {
    setError(err.message);
  }
};


  return (
    <div className="box-shadow-main p-6 bg-base-200 rounded-lg space-y-4 w-fit">
      {error && (
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Edytuj Profil</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Nick</span>
          </label>
          <input
            type="text"
            {...register("displayName", {
              required: "Nick jest wymagany",
            })}
            placeholder="Wprowadź swój nick"
            className={`input input-bordered w-full ${
              errors.displayName ? "input-error" : ""
            }`}
          />
          {errors.displayName && (
            <span className="text-error text-sm">{errors.displayName.message}</span>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Adres URL Zdjęcia</span>
          </label>
          <input
            type="text"
            {...register("photoURL", { required: "Adres URL zdjęcia jest wymagany" })}
            placeholder="Wprowadź URL zdjęcia"
            className={`input input-bordered w-full ${
              errors.photoURL ? "input-error" : ""
            }`}
          />
          {errors.photoURL && (
            <span className="text-error text-sm">{errors.photoURL.message}</span>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Miasto</span>
          </label>
          <input
            type="text"
            {...register("city", { required: "Miasto jest wymagane" })}
            className={`input input-bordered w-full`}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Ulica</span>
          </label>
          <input
            type="text"
            {...register("street", { required: "Ulica jest wymagana" })}
            className={`input input-bordered w-full`}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Kod Pocztowy</span>
          </label>
          <input
            type="text"
            {...register("zipCode", { required: "Kod pocztowy jest wymagany" })}
            className={`input input-bordered w-full`}
          />
        </div>

        <div className="form-control">
          <button type="submit" className="btn btn-primary w-full">
            Zaktualizuj Profil
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
