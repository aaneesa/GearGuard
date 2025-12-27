"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { registerRequest, loginRequest } from "../lib/api";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "USER",
    departmentName: "",
    avatarUrl: "",
  });

  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Register
      await registerRequest({
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        password: form.password.trim(),
        role: form.role,
        departmentName: form.departmentName || "General",
        avatarUrl: form.avatarUrl || null,
      });

      // 2️⃣ Auto-login after signup (extra UX)
      const { token } = await loginRequest(
        form.email,
        form.password.trim()
      );
      localStorage.setItem("token", token);

      toast.success("Account created & logged in!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-10 w-[90%] max-w-md">
        <form className="w-full flex flex-col items-center" onSubmit={submit}>
          <h2 className="text-4xl text-gray-900 font-medium">Sign Up</h2>
          <p className="text-sm text-gray-500 mt-3">
            Create your account to continue
          </p>

          {/* FIRST NAME */}
          <input
            className="input text-gray-900"
            placeholder="First Name"
            required
            onChange={(e) =>
              setForm({ ...form, firstName: e.target.value })
            }
          />

          {/* LAST NAME */}
          <input
            className="input mt-4 text-gray-900"
            placeholder="Last Name"
            required
            onChange={(e) =>
              setForm({ ...form, lastName: e.target.value })
            }
          />

          {/* EMAIL */}
          <input
            className="input mt-4 text-gray-900"
            type="email"
            placeholder="Email"
            required
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          {/* PASSWORD */}
          <input
            className="input mt-4 text-gray-900"
            type="password"
            placeholder="Password"
            required
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          {/* ROLE */}
          <select
            className="input mt-4 text-gray-900"
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
          >
            <option value="ADMIN">ADMIN</option>
            <option value="MANAGER">MANAGER</option>
            <option value="TECHNICIAN">TECHNICIAN</option>
            <option value="EMPLOYEE">EMPLOYEE</option>
          </select>

          {/* DEPARTMENT */}
          <input
            className="input mt-4 text-gray-900"
            placeholder="Department (e.g. Engineering)"
            onChange={(e) =>
              setForm({ ...form, departmentName: e.target.value })
            }
          />

          {/* AVATAR */}
          <input
            className="input mt-4 text-gray-900"
            placeholder="Avatar URL (optional)"
            onChange={(e) =>
              setForm({ ...form, avatarUrl: e.target.value })
            }
          />

          {/* BUTTON */}
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
            {loading ? "Creating..." : "Create Account"}
          </button>

          <p className="text-gray-500 text-sm mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-500 underline">
              Log In
            </Link>
          </p>
        </form>
      </div>

      {/* small utility style */}
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
