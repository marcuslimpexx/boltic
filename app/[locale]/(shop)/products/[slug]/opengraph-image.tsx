import { ImageResponse } from "next/og";
import { productRepo } from "@/lib/data";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function OgImage({ params }: Props) {
  const { locale, slug } = await params;
  const product = await productRepo.findBySlug(slug);

  const name = product
    ? locale === "vi"
      ? product.name.vi
      : product.name.en
    : "Product";

  const brand = product?.brand ?? "Boltic";
  const price = product
    ? new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }).format(product.price)
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#FAFAFA",
          width: "100%",
          height: "100%",
          display: "flex",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            flex: 1,
            padding: "60px 56px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: 18,
              color: "#6366F1",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            {brand}
          </div>
          <div>
            <div
              style={{
                fontSize: 44,
                fontWeight: 800,
                color: "#0A0A0A",
                lineHeight: 1.2,
                marginBottom: 20,
              }}
            >
              {name}
            </div>
            {price && (
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: "#6366F1",
                }}
              >
                {price}
              </div>
            )}
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#0A0A0A",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            ⚡ boltic.vn
          </div>
        </div>
        <div
          style={{
            width: 8,
            background: "#6366F1",
            alignSelf: "stretch",
          }}
        />
      </div>
    ),
    size
  );
}
