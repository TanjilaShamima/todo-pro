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
import { RegisterInput, registerSchema } from "@/@schemas/zodSchema";
import { loginSuccess } from "@/@store/slices/authSlice";

export default function RegisterFeature() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });
  const router = useRouter();
  const dispatch = useDispatch();
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const t = getToken();
    if (t) router.replace("/app/todos");
  }, [router]);

  async function onSubmit(values: RegisterInput) {
    setSubmitError(null);
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
      setSubmitError("Email already exists.");
    } else {
      setSubmitError("Registration failed. Please try again.");
    }
  }

  return (
    <main className="min-h-screen grid place-items-center p-4">
      <section className="w-full max-w-sm rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/30 backdrop-blur shadow-md p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="text-sm opacity-80">
            Join Todo Pro and stay organized.
          </p>
        </header>
        {submitError && (
          <p role="alert" className="mb-3 text-sm text-red-600">
            {submitError}
          </p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
          <Input
            label="Name"
            placeholder="Your name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
          />
          {errors.name && (
            <p id="name-error" className="text-red-600 text-sm">
              {errors.name.message}
            </p>
          )}

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
            placeholder="Create a password"
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
            {isSubmitting ? "Creating…" : "Create account"}
          </Button>
        </form>
        <p className="mt-4 text-sm opacity-80">
          Already have an account?{" "}
          <Link className="underline" href="/login">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
