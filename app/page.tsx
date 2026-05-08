import { redirect } from "next/navigation";

// Redirect root "/" to the default locale "/vi"
// This acts as a fallback alongside the middleware locale redirect.
export default function RootPage() {
  redirect("/vi");
}
