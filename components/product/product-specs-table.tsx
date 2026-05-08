import type { Product } from "@/lib/data/types";
import { getTranslations } from "next-intl/server";

interface ProductSpecsTableProps {
  product: Product;
  locale: string;
}

export async function ProductSpecsTable({
  product,
  locale,
}: ProductSpecsTableProps) {
  const t = await getTranslations({ locale, namespace: "product_detail" });
  const attrs = product.attributes;

  const rows = [
    {
      label: t("capacity_mah"),
      value: `${attrs.capacityMah.toLocaleString()} mAh`,
    },
    { label: t("output_watts"), value: `${attrs.outputWatts}W` },
    { label: t("input_ports"), value: attrs.inputPorts.join(", ") },
    { label: t("output_ports_label"), value: attrs.outputPorts.join(", ") },
    {
      label: t("fast_charging_label"),
      value: attrs.fastCharging ? t("yes") : t("no"),
    },
    {
      label: t("wireless_label"),
      value: attrs.wirelessCharging ? t("yes") : t("no"),
    },
    {
      label: t("passthrough_label"),
      value: attrs.passthrough ? t("yes") : t("no"),
    },
    { label: t("weight"), value: `${attrs.weightGrams}g` },
    {
      label: t("dimensions"),
      value: `${attrs.dimensionsMm.l} × ${attrs.dimensionsMm.w} × ${attrs.dimensionsMm.h} mm`,
    },
    { label: t("color"), value: attrs.color },
    {
      label: t("certifications"),
      value: attrs.certifications.join(", ") || "—",
    },
  ];

  return (
    <table className="w-full text-sm border-collapse">
      <tbody>
        {rows.map(({ label, value }) => (
          <tr key={label} className="border-b border-border">
            <td className="py-2.5 pr-4 text-muted-foreground font-medium w-40 align-top">
              {label}
            </td>
            <td className="py-2.5 text-foreground">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
