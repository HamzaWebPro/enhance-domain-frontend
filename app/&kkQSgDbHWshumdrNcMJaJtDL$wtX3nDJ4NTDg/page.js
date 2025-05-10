"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CORRECT_PIN = "Enhance12345";
const STORAGE_KEY = "my_secure_key";

export default function Login() {
  const [pin, setPin] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "logged_in") {
        router.push("/Wf4U7lu5d");
      }
    }
  }, []);

  const handleLogin = () => {
    if (pin === CORRECT_PIN) {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, "logged_in");
        router.push("/Wf4U7lu5d");
      }
    } else {
      toast.error("❌ Incorrect PIN", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#9DE3DA] via-[#DF2C89] to-[#F7DC52]">
      <ToastContainer />
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          🔒 Enter PIN to Login
        </h1>
        <input
          type="password"
          placeholder="Enter your PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-[#FF60B3] text-white py-3 rounded-lg font-medium hover:bg-pink-500 transition"
        >
          Login
        </button>
      </div>
    </main>
  );
}
