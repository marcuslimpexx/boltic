"use client";

import { Suspense, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { resetPasswordAction } from "@/lib/auth/actions";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BolticLogo } from "@/components/layout/boltic-logo";

const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type FormInput = z.infer<typeof schema>;

function ResetPasswordContent() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormInput) => {
    setServerError(null);
    const fd = new FormData();
    fd.append("token", token);
    fd.append("password", data.password);
    const result = await resetPasswordAction(fd);
    if (result?.error) {
      setServerError(result.error);
    } else {
      setDone(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <BolticLogo size="lg" />
          </div>
          <CardTitle>{t("reset_title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {done ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-success">
                Password updated successfully.
              </p>
              <Link
                href="/login"
                className="text-primary text-sm font-medium hover:underline"
              >
                {t("login_cta")} →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="password">{t("password")}</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  {...register("password")}
                  aria-invalid={!!errors.password}
                />
                {errors.password && (
                  <p className="text-xs text-error">{errors.password.message}</p>
                )}
              </div>
              {serverError && (
                <p className="text-sm text-error text-center" role="alert">
                  {serverError}
                </p>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !token}
              >
                {isSubmitting ? t("reset_cta") + "..." : t("reset_cta")}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
