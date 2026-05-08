"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { StarRating } from "./star-rating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitReviewAction } from "@/lib/reviews/actions";
import { Separator } from "@/components/ui/separator";

interface ReviewFormProps {
  productId: string;
  productSlug: string;
  isLoggedIn: boolean;
}

export function ReviewForm({
  productId,
  productSlug,
  isLoggedIn,
}: ReviewFormProps) {
  const t = useTranslations("reviews");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [result, setResult] = useState<{
    success?: boolean;
    error?: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isLoggedIn) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        {t("login_required")}
      </p>
    );
  }

  if (result?.success) {
    return (
      <p className="text-sm text-green-600 font-medium py-4">
        {t("submitted")}
      </p>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setResult({ error: "rating_required" });
      return;
    }
    startTransition(async () => {
      const res = await submitReviewAction({
        productId,
        productSlug,
        rating,
        ...(text.trim() ? { text: text.trim() } : {}),
      });
      setResult(res);
    });
  };

  return (
    <>
      <Separator />
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <h3 className="font-semibold">{t("write")}</h3>

        <div className="space-y-1.5">
          <p className="text-sm text-muted-foreground">{t("your_rating")}</p>
          <StarRating value={rating} onChange={setRating} size="lg" />
        </div>

        <div className="space-y-1.5">
          <p className="text-sm text-muted-foreground">{t("your_review")}</p>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder={t("your_review")}
          />
        </div>

        {result?.error && (
          <p className="text-sm text-destructive">
            {t(result.error as Parameters<typeof t>[0])}
          </p>
        )}

        <Button type="submit" disabled={isPending || rating === 0}>
          {isPending ? t("submitting") : t("submit")}
        </Button>
      </form>
    </>
  );
}
