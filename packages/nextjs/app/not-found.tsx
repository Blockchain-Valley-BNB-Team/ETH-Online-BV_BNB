import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/navigation";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="flex items-center flex-1 justify-center min-h-[calc(100vh-16rem)] pt-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold m-0 mb-1">404</h1>
          <h2 className="text-2xl font-semibold m-0">Page Not Found</h2>
          <p className="text-muted-foreground m-0 mb-4">The page you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/" className="btn btn-primary">
            Go Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
