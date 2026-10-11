import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../../../lib/context/auth";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { AlertCircle, UserPlus, ArrowRight, UserCheck } from "lucide-react";

export const Route = createFileRoute("/$countryCode/account/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const { countryCode } = Route.useParams();
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <UserCheck className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900">
          You are already registered & signed in
        </h2>
        <p className="text-sm text-neutral-500">
          Go to your account dashboard to view order history.
        </p>
        <Link to="/$countryCode/account" params={{ countryCode }}>
          <Button className="mt-2">Go to My Account</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    if (formData.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        phone: formData.phone || undefined,
      });

      void navigate({
        to: "/$countryCode/account",
        params: { countryCode },
      });
    } catch (err: unknown) {
      console.error("Registration failed:", err);
      const msg = err instanceof Error ? err.message : "Failed to create account";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-800">
            <UserPlus className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Create an account</h1>
          <p className="text-xs text-neutral-500">
            Sign up to manage orders, checkout faster, and track shipping.
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-3 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First name"
              placeholder="John"
              isRequired
              value={formData.firstName}
              onChange={(val) => setFormData((p) => ({ ...p, firstName: val }))}
            />
            <Input
              label="Last name"
              placeholder="Doe"
              isRequired
              value={formData.lastName}
              onChange={(val) => setFormData((p) => ({ ...p, lastName: val }))}
            />
          </div>

          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            isRequired
            value={formData.email}
            onChange={(val) => setFormData((p) => ({ ...p, email: val }))}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Min 8 characters"
            isRequired
            value={formData.password}
            onChange={(val) => setFormData((p) => ({ ...p, password: val }))}
          />

          <Input
            label="Phone (optional)"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={(val) => setFormData((p) => ({ ...p, phone: val }))}
          />

          <Button
            type="submit"
            size="lg"
            isLoading={isSubmitting}
            className="w-full mt-2 font-medium"
          >
            Create Account
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </form>

        <div className="border-t border-neutral-100 pt-6 text-center text-xs text-neutral-600">
          <span>Already have an account? </span>
          <Link
            to="/$countryCode/account/login"
            params={{ countryCode }}
            className="font-semibold text-neutral-900 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
