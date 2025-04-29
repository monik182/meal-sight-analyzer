
import { Button } from "@/components/ui/button";
import { ArrowDown, LeafyGreen } from "lucide-react";

interface IntroSectionProps {
  onStartClick: () => void;
}

export const IntroSection = ({ onStartClick }: IntroSectionProps) => {
  return (
    <section className="py-12 text-center animate-fade-in">
      <div className="flex justify-center mb-6">
        <div className="bg-macrolens-primary-light p-3 rounded-full animate-pulse-light">
          <LeafyGreen className="w-8 h-8 text-macrolens-primary" />
        </div>
      </div>
      
      <h2 className="text-3xl mb-4 animate-slide-up">Analyze Your Meals Effortlessly</h2>
      <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto animate-slide-up" style={{ animationDelay: "100ms" }}>
        Take or upload a photo of your meal and instantly receive a breakdown of estimated macronutrients - calories, protein, fat, and carbs.
      </p>

      <div className="flex flex-col items-center gap-8">
        <Button 
          onClick={onStartClick}
          size="lg"
          className="bg-macrolens-primary hover:bg-macrolens-primary/90 hover-scale px-8 py-6 text-lg rounded-full shadow-md animate-scale-in"
          style={{ animationDelay: "200ms" }}
        >
          Analyze My Meal
        </Button>

        <div className="flex flex-col items-center animate-slide-up" style={{ animationDelay: "300ms" }}>
          <p className="text-sm text-gray-500 mb-2">Fast and private - no login required</p>
          <ArrowDown className="h-5 w-5 text-macrolens-accent animate-bounce-subtle" />
        </div>
      </div>
    </section>
  );
};
