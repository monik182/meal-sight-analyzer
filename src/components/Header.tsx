'use client';
import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b py-4">
      <div className="container-narrow flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-primary hover:opacity-90 transition-opacity">
          MacroLens
        </Link>
        <nav>
          <ul className="flex gap-4">
            <li>
              <Link href="/analyze" className="text-sm font-medium hover:text-primary transition-colors">
                Analyze
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
