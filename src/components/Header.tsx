
import { Camera } from "lucide-react";

export const Header = () => {
  return (
    <header className="w-full py-4 bg-macrolens-surface border-b border-border/10">
      <div className="container-narrow flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-macrolens-primary" />
          <h1 className="text-xl font-medium text-gray-900">MacroLens</h1>
        </div>
      </div>
    </header>
  );
};
