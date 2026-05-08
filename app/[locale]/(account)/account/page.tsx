import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [session, { locale }] = await Promise.all([auth(), params]);
  if (!session) redirect(`/${locale}/login`);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">
        Welcome, {session.user?.name ?? "User"}
      </h1>
      <p className="text-muted mt-2">{session.user?.email}</p>
    </div>
  );
}
