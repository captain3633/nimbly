import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-sage/10 flex items-center justify-center">
                <span className="text-2xl">🐇</span>
              </div>
              <span className="text-xl font-semibold text-text-primary">
                Nimbly
              </span>
            </div>
            <p className="text-text-secondary text-sm max-w-md">
              Move lighter. Spend smarter.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-text-secondary hover:text-sage transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/savvy"
                  className="text-sm text-text-secondary hover:text-sage transition-colors"
                >
                  Meet Savvy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-text-secondary hover:text-sage transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-text-secondary hover:text-sage transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-text-secondary hover:text-sage transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-text-muted text-center">
            © {new Date().getFullYear()} Nimbly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
