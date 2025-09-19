"use client";
import { getToken } from "@/@lib/tokens";
import { RegisterInput, registerSchema } from "@/@schemas/zodSchema";
import { loginSuccess } from "@/@store/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

export default function RegisterFeature() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const t = getToken();
    if (t) router.replace("/app/todos");
  }, [router]);

  async function onSubmit(values: RegisterInput) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(loginSuccess(data));
      router.push("/app/todos");
    } else if (res.status === 409) {
      alert("Email already exists");
    } else {
      alert("Registration failed");
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input className="input" {...register("name")} />
          {errors.name && (
            <p className="text-red-600 text-sm">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input className="input" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input className="input" type="password" {...register("password")} />
          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password.message}</p>
          )}
        </div>
        <button className="btn" disabled={isSubmitting}>
          {isSubmitting ? "Submitting…" : "Register"}
        </button>
      </form>
    </main>
  );
}
