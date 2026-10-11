import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../../../lib/context/auth";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { AlertCircle, Lock, ArrowRight, UserCheck } from "lucide-react";

export const Route = createFileRoute("/$countryCode/account/login")({
  component: LoginPage,
});

function LoginPage() {
  const { countryCode } = Route.useParams();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <UserCheck className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900">You are already signed in</h2>
        <p className="text-sm text-neutral-500">
          Manage your orders and profile in your account portal.
        </p>
        <Link to="/$countryCode/account" params={{ countryCode }}>
          <Button className="mt-2">Go to My Account</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await login({ email, password });
      void navigate({
        to: "/$countryCode/account",
        params: { countryCode },
      });
    } catch (err: unknown) {
      console.error("Login failed:", err);
      const msg = err instanceof Error ? err.message : "Invalid email or password";
      setErrorMessage(
        msg.includes("401") || msg.includes("Unauthorized")
          ? "Invalid email or password. Please try again."
          : msg,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-800">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Welcome back</h1>
          <p className="text-xs text-neutral-500">
            Sign in to your customer account to track orders and save details.
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-3 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            isRequired
            value={email}
            onChange={(val) => setEmail(val)}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            isRequired
            value={password}
            onChange={(val) => setPassword(val)}
          />

          <Button
            type="submit"
            size="lg"
            isLoading={isSubmitting}
            className="w-full mt-2 font-medium"
          >
            Sign In
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </form>

        <div className="border-t border-neutral-100 pt-6 text-center text-xs text-neutral-600">
          <span>Don't have an account yet? </span>
          <Link
            to="/$countryCode/account/register"
            params={{ countryCode }}
            className="font-semibold text-neutral-900 hover:underline"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
