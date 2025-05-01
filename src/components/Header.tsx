
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="border-b py-4">
      <div className="container-narrow flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-primary hover:opacity-90 transition-opacity">
          MacroLens
        </Link>
        <nav>
          <ul className="flex gap-4">
            <li>
              <Link to="/analyze" className="text-sm font-medium hover:text-primary transition-colors">
                Analyze
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
