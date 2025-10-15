import Link from "next/link";
import { Github, MessageSquare, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold text-accent">
              Biomni
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Building an open, verifiable future for scientific research on the blockchain.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-muted/50 hover:bg-accent/20 flex items-center justify-center transition-colors"
              >
                <Github className="w-4 h-4" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-muted/50 hover:bg-accent/20 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </Link>
              <Link
                href="/discord"
                className="w-9 h-9 rounded-lg bg-muted/50 hover:bg-accent/20 flex items-center justify-center transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-accent transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/research-pool" className="text-muted-foreground hover:text-accent transition-colors">
                  Research Pool
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-muted-foreground hover:text-accent transition-colors">
                  Tools
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-muted-foreground hover:text-accent transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs" className="text-muted-foreground hover:text-accent transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/gitbook" className="text-muted-foreground hover:text-accent transition-colors">
                  GitBook
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-muted-foreground hover:text-accent transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="text-muted-foreground hover:text-accent transition-colors">
                  Tutorials
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Community</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/discord" className="text-muted-foreground hover:text-accent transition-colors">
                  Discord
                </Link>
              </li>
              <li>
                <Link href="/forum" className="text-muted-foreground hover:text-accent transition-colors">
                  Forum
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-accent transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/grants" className="text-muted-foreground hover:text-accent transition-colors">
                  Grants Program
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2025 Biomni. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-accent transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-accent transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
