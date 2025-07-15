"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpFormData } from "@/lib/validations/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import { RootLayout } from "@/components/layout/root-layout";
import { cn, detectTimezone } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useSignUp } from "@/hooks/useAuthApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, loading } = useAuth();
  const { mutate: signUp, isPending } = useSignUp();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  // Auto-detect timezone on component mount
  useEffect(() => {
    const timezone = detectTimezone();
    setValue("timezone", timezone);
  }, [setValue]);

  // Redirect if already authenticated (only after loading is complete)
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <RootLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--color-main)] mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </RootLayout>
    );
  }

  // Don't show sign-up form if already authenticated
  if (isAuthenticated) {
    return null; // Will redirect
  }

  const onSubmit = async (data: SignUpFormData) => {
    setError(null);

    // Ensure timezone is set (fallback to UTC if not detected)
    const finalData = {
      ...data,
      timezone: data.timezone || "UTC",
    };

    signUp(
      {
        email: finalData.email,
        password: finalData.password,
        displayName: finalData.displayName,
        timezone: finalData.timezone,
      },
      {
        onSuccess: () => {
          toast.success("Account created successfully!");
          router.push("/");
        },
        onError: (error) => {
          setError(error.message || "Sign up failed");
        },
      }
    );
  };

  return (
    <RootLayout>
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>
              Join the poop tracking revolution! 🚀
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Display Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="displayName"
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Enter your display name"
                  className={cn(
                    "border-2",
                    errors.displayName
                      ? "border-red-500 focus:border-red-500"
                      : "border-[color:var(--color-border)] focus:border-[color:var(--color-main)]"
                  )}
                  {...register("displayName")}
                />
                {errors.displayName && (
                  <p className="text-sm text-red-500">
                    {errors.displayName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className={cn(
                    "border-2",
                    errors.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-[color:var(--color-border)] focus:border-[color:var(--color-main)]"
                  )}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={cn(
                      "border-2 pr-10",
                      errors.password
                        ? "border-red-500 focus:border-red-500"
                        : "border-[color:var(--color-border)] focus:border-[color:var(--color-main)]"
                    )}
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Hidden timezone field */}
              <input type="hidden" {...register("timezone")} />

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-[color:var(--color-main)] text-[color:var(--color-main-foreground)] hover:bg-[color:var(--color-main-hover)] border-2 border-[color:var(--color-border)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                {isPending ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <a
                  href="/signin"
                  className="font-medium text-[color:var(--color-main)] hover:underline"
                >
                  Sign in
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </RootLayout>
  );
}
