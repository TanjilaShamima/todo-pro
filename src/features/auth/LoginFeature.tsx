"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import Button from "@/@components/ui/Button";
import Input from "@/@components/ui/Input";
import { getToken } from "@/@lib/tokens";
import { LoginInput, loginSchema } from "@/@schemas/zodSchema";
import { loginSuccess } from "@/@store/slices/authSlice";

export default function LoginFeature() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });
  const router = useRouter();
  const dispatch = useDispatch();
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const t = getToken();
    if (t) router.replace("/app/todos");
  }, [router]);

  async function onSubmit(values: LoginInput) {
    setSubmitError(null);
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
      setSubmitError("Invalid email or password.");
    }
  }

  return (
    <main className="min-h-screen grid place-items-center p-4 ">
      {/* Card uses theme tokens for bg/border so dark mode works */}
      <section className="w-full max-w-sm rounded-xl border border-app bg-[var(--login-bg)] backdrop-blur shadow-md p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm opacity-80">Sign in to continue to Todo Pro.</p>
        </header>
        {submitError && (
          <p role="alert" className="mb-3 text-sm text-red-600">
            {submitError}
          </p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p id="email-error" className="text-red-600 text-sm">
              {errors.email.message}
            </p>
          )}

          <Input
            label="Password"
            type="password"
            placeholder="Your password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
          />
          {errors.password && (
            <p id="password-error" className="text-red-600 text-sm">
              {errors.password.message}
            </p>
          )}

          <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <p className="mt-4 text-sm opacity-80">
          New here?{" "}
          <Link className="underline" href="/register">
            Register
          </Link>
        </p>
      </section>
    </main>
  );
}
