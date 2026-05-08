"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/auth/schemas";
import { registerAction } from "@/lib/auth/actions";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BolticLogo } from "@/components/layout/boltic-logo";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("email", data.email);
    fd.append("password", data.password);
    const result = await registerAction(fd);
    if (result?.error) {
      const msg =
        result.error === "email_taken" ? t("email_taken") : result.error;
      setServerError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <BolticLogo size="lg" />
          </div>
          <CardTitle>{t("register_title")}</CardTitle>
          <CardDescription className="text-muted">
            {t("have_account")}{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              {t("login_cta")}
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">{t("name")}</Label>
              <Input
                id="name"
                type="text"
                autoComplete="name"
                {...register("name")}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-xs text-error">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-xs text-error">{errors.email.message}</p>
              )}
            </div>
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t("register_cta") + "..." : t("register_cta")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
