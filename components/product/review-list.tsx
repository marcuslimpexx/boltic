import { reviewRepo } from "@/lib/data";
import { StarRating } from "./star-rating";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "next-intl/server";

interface ReviewListProps {
  productId: string;
  ratingAvg: number;
  ratingCount: number;
  locale: string;
}

export async function ReviewList({
  productId,
  ratingAvg,
  ratingCount,
  locale,
}: ReviewListProps) {
  const [reviews, t] = await Promise.all([
    reviewRepo.findByProductId(productId),
    getTranslations({ locale, namespace: "reviews" }),
  ]);

  if (ratingCount === 0 && reviews.length === 0) {
    return (
      <div className="text-center py-8 space-y-2">
        <p className="text-muted-foreground">{t("no_reviews")}</p>
        <p className="text-sm text-muted-foreground">{t("be_first")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      {ratingCount > 0 && (
        <div className="flex items-center gap-6 pb-4 border-b border-border">
          <div className="text-center">
            <p className="text-5xl font-bold">{ratingAvg.toFixed(1)}</p>
            <StarRating value={Math.round(ratingAvg)} readOnly size="sm" />
            <p className="text-xs text-muted-foreground mt-1">
              {ratingCount} {t("title").toLowerCase()}
            </p>
          </div>
        </div>
      )}

      {/* Individual reviews */}
      {reviews.length > 0 && (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold">
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{review.userName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString(
                        locale === "vi" ? "vi-VN" : "en-US"
                      )}
                    </p>
                  </div>
                </div>
                {review.verifiedPurchase && (
                  <Badge
                    variant="secondary"
                    className="text-xs text-green-700 bg-green-50"
                  >
                    {t("verified_purchase")}
                  </Badge>
                )}
              </div>
              <StarRating value={review.rating} readOnly size="sm" />
              {review.text && (
                <p className="text-sm text-foreground leading-relaxed">
                  {review.text}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
