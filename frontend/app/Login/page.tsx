"use client";

import { useState } from "react";
import api from "@/api/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      alert("Login berhasil!");


      window.location.href = "/";
    } catch (err: any) {
      setError(
        "Login gagal, periksa email/password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-2xl shadow-md w-80 text-pink-400"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}
