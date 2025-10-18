import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/navigation";
import { NetworkVisualization } from "@/components/network-visualization";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, LayoutDashboard } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <NetworkVisualization />

        <div className="relative z-10 container mx-auto px-4 py-32 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold text-balance leading-tight">
              Science. On-Chain. <span className="text-accent">Open to All.</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Building an open, verifiable future for scientific research
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
              <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Dashboard
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
              >
                <Link href="/gitbook">
                  <BookOpen className="mr-2 h-5 w-5" />
                  GitBook
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/20 hover:bg-white/10 bg-transparent">
                <Link href="/docs">
                  <FileText className="mr-2 h-5 w-5" />
                  Docs
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />
      </section>

      {/* Features Section */}
      <section className="relative py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-8 rounded-lg border border-white/10 bg-card/50 backdrop-blur-sm hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                <div className="w-6 h-6 rounded-full bg-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Decentralized Research</h3>
              <p className="text-muted-foreground leading-relaxed">
                Store and verify scientific data on-chain, ensuring transparency and immutability for all research
                outputs.
              </p>
            </div>

            <div className="p-8 rounded-lg border border-white/10 bg-card/50 backdrop-blur-sm hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                <div className="w-6 h-6 rounded-full bg-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Open Collaboration</h3>
              <p className="text-muted-foreground leading-relaxed">
                Join research DAOs and contribute to groundbreaking scientific discoveries with global teams.
              </p>
            </div>

            <div className="p-8 rounded-lg border border-white/10 bg-card/50 backdrop-blur-sm hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                <div className="w-6 h-6 rounded-full bg-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Verifiable Results</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every analysis, dataset, and finding is cryptographically verified and permanently accessible.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
