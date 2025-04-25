
import { Camera } from "lucide-react";

export const Header = () => {
  return (
    <header className="w-full py-4 border-b bg-macrolens-surface shadow-sm">
      <div className="container-narrow flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-6 h-6 text-macrolens-primary" />
          <h1 className="text-xl font-bold text-gray-800">MacroLens</h1>
        </div>
      </div>
    </header>
  );
};
