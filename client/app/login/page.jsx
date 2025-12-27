"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "../context/authContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await login(form.email, form.password);
      toast.success("Logged in successfully!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-10 w-[90%] max-w-md">
        <form className="w-full flex flex-col items-center" onSubmit={handleSubmit}>
          <h2 className="text-4xl text-gray-900 font-medium">Log In</h2>
          <p className="text-sm text-gray-500 mt-3">
            Sign in to your account to continue
          </p>

          <input
            className="input text-gray-900"
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="input mt-4 text-gray-900"
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="submit"
            disabled={loading}
            className={`mt-8 w-full h-11 rounded-full text-white 
              ${
                loading
                  ? "bg-gray-800 cursor-not-allowed"
                  : "bg-black hover:opacity-90"
              }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          <p className="text-gray-500 text-sm mt-4">
            Don't have an account?{" "}
            <Link href="/signup" className="text-indigo-500 underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          height: 48px;
          border-radius: 9999px;
          border: 1px solid #9ca3af;
          padding: 0 16px;
          font-size: 14px;
          outline: none;
        }
      `}</style>
    </div>
  );
}

