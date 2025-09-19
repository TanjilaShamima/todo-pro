"use client";
import { getToken } from "@/@lib/tokens";
import { LoginInput, loginSchema } from "@/@schemas/zodSchema";
import { loginSuccess } from "@/@store/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

export default function LoginFeature() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const t = getToken();
    if (t) router.replace("/app/todos");
  }, [router]);

  async function onSubmit(values: LoginInput) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(loginSuccess(data));
      router.push("/app/todos");
    } else {
      alert("Login failed");
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            className="input"
            type="email"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            className="input"
            type="password"
            {...register("password")}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password.message}</p>
          )}
        </div>
        <button
          className=" bg-amber-50 px-10 py-2 text-black"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in…" : "Login"}
        </button>
      </form>
    </main>
  );
}
