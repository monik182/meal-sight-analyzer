
import { LeafyGreen } from "lucide-react";

export const LoadingAnalysis = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-12 animate-fade-in">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-macrolens-primary-light flex items-center justify-center animate-pulse-light">
            <LeafyGreen className="h-10 w-10 text-macrolens-primary animate-bounce-subtle" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-800 animate-slide-up">Analyzing your meal...</h3>
          <p className="mt-1 text-sm text-gray-500 animate-slide-up" style={{ animationDelay: "100ms" }}>
            Our AI is identifying food items and calculating nutritional values
          </p>
        </div>
      </div>
    </div>
  );
};
