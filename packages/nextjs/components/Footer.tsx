import Link from "next/link";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Brand */}
          <div className="space-y-2">
            <Link href="/" className="text-lg font-bold text-accent">
              Biomni
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Building an open, verifiable future for scientific research on the blockchain.
            </p>
            <div className="flex items-center gap-2">
              <Link
                href="https://github.com/Blockchain-Valley-BNB-Team/ETH-Online-BV_BNB"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-muted/50 hover:bg-accent/20 flex items-center justify-center transition-colors"
              >
                <Github className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Platform</h3>
              <ul className="space-y-1 text-sm">
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

            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Resources</h3>
              <ul className="space-y-1 text-sm">
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
                  <Link href="/forum" className="text-muted-foreground hover:text-accent transition-colors">
                    Telegram Group
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-3 pt-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">© 2025 Biomni. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-accent transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-accent transition-colors">
              Terms
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
