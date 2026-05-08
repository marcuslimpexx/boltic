import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <p className="text-6xl font-bold text-border mb-4">404</p>
      <h1 className="text-2xl font-bold mb-2">Page not found</h1>
      <p className="text-muted-foreground text-sm mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-3 justify-center">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products">Shop products</Link>
        </Button>
      </div>
    </div>
  );
}
