
import { Button } from "@/components/ui/button";
import { ArrowDown, LeafyGreen } from "lucide-react";

interface IntroSectionProps {
  onStartClick: () => void;
}

export const IntroSection = ({ onStartClick }: IntroSectionProps) => {
  return (
    <section className="py-16 text-center animate-fade-in">
      <div className="flex justify-center mb-8">
        <div className="bg-macrolens-primary-light p-4 rounded-full animate-pulse-light shadow-glow-sm">
          <LeafyGreen className="w-10 h-10 text-macrolens-primary" />
        </div>
      </div>
      
      <h2 className="text-4xl mb-6 animate-slide-up font-serif text-gray-800">
        Analyze Your Meals Effortlessly
      </h2>
      
      <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto animate-slide-up leading-relaxed" 
         style={{ animationDelay: "100ms" }}>
        Take or upload a photo of your meal and instantly receive a 
        breakdown of estimated macronutrients — calories, protein, fat, and carbs.
      </p>

      <div className="flex flex-col items-center gap-10">
        <Button 
          onClick={onStartClick}
          size="lg"
          className="bg-macrolens-primary hover:bg-macrolens-primary/90 hover-scale px-10 py-7 text-lg rounded-full shadow-glow hover:shadow-glow-lg animate-scale-in font-display"
          style={{ animationDelay: "200ms" }}
        >
          Analyze My Meal
        </Button>

        <div className="flex flex-col items-center animate-slide-up" style={{ animationDelay: "300ms" }}>
          <p className="text-sm text-gray-500 mb-3">Fast and private — no login required</p>
          <ArrowDown className="h-5 w-5 text-macrolens-accent animate-bounce-subtle" />
        </div>
      </div>
    </section>
  );
};
