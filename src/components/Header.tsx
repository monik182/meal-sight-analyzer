
import { LeafyGreen } from "lucide-react";

export const Header = () => {
  return (
    <header className="w-full py-4 bg-macrolens-surface border-b border-border/10 shadow-sm">
      <div className="container-narrow flex items-center justify-between">
        <div className="flex items-center gap-2 animate-fade-in">
          <div className="bg-macrolens-primary-light p-1.5 rounded-full">
            <LeafyGreen className="w-5 h-5 text-macrolens-primary" />
          </div>
          <h1 className="text-xl font-medium text-gray-800">MacroLens</h1>
        </div>
      </div>
    </header>
  );
};
