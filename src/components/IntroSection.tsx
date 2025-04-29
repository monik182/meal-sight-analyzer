
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

interface IntroSectionProps {
  onStartClick: () => void;
}

export const IntroSection = ({ onStartClick }: IntroSectionProps) => {
  return (
    <section className="py-12 text-center animate-fade-in">
      <h2 className="text-3xl mb-4">Analyze Your Meals Effortlessly</h2>
      <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
        Take or upload a photo of your meal and instantly receive a breakdown of estimated macronutrients - calories, protein, fat, and carbs.
      </p>

      <div className="flex flex-col items-center gap-8">
        <Button 
          onClick={onStartClick}
          size="lg"
          className="bg-macrolens-primary hover:bg-macrolens-primary/90 px-8 py-6 text-lg rounded-full"
        >
          Analyze My Meal
        </Button>

        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-500 mb-2">Fast and private - no login required</p>
          <ArrowDown className="h-5 w-5 text-gray-400 animate-bounce" />
        </div>
      </div>
    </section>
  );
};
