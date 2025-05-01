import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheck, Download, FileText, Info, Utensils } from "lucide-react";
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FoodAnalysisResult, FoodItem, Macros } from '@/types';
import { generateDietaryRecommendations } from '@/services/openai';
import { generatePDF, generateCSV, downloadCSV } from '@/util/pdfGenerator';
import { useToast } from '@/hooks/use-toast';

interface AnalysisResultProps {
  result: FoodAnalysisResult;
  onReset: () => void;
}

export const AnalysisResult = ({ result, onReset }: AnalysisResultProps) => {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const analysisRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const getConfidenceBadgeColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const confidenceBadgeColor = getConfidenceBadgeColor(result.confidenceLevel);

  const generateRecommendations = async () => {
    setIsLoading(true);
    const response = await generateDietaryRecommendations(result);
    setRecommendations(response);
    setIsLoading(false);
  };

  const handleDownloadPDF = async () => {
    try {
      toast({
        title: "Creating PDF...",
        description: "Please wait while we generate your meal analysis PDF."
      });
      
      // Temporarily add a PDF-specific class to optimize for PDF generation
      const analysisContent = document.getElementById('analysis-content');
      if (analysisContent) {
        analysisContent.classList.add('pdf-optimized');
      }
      
      await generatePDF('analysis-content', `meal-analysis-${new Date().toISOString().split('T')[0]}.pdf`);
      
      // Remove the temporary class
      if (analysisContent) {
        analysisContent.classList.remove('pdf-optimized');
      }
      
      toast({
        title: "PDF created!",
        description: "Your meal analysis has been downloaded successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "PDF generation failed",
        description: "There was an error creating your PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadCSV = () => {
    try {
      toast({
        title: "Creating CSV...",
        description: "Preparing your meal analysis data for download."
      });
      
      const csvContent = generateCSV(result);
      downloadCSV(csvContent, `meal-analysis-${new Date().toISOString().split('T')[0]}.csv`);
      
      toast({
        title: "CSV created!",
        description: "Your meal analysis data has been downloaded successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error generating CSV:', error);
      toast({
        title: "CSV generation failed",
        description: "There was an error creating your CSV file. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full animate-fade-in">
      <div id="analysis-content" className="w-full pb-8 pdf-container">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-macrolens-primary-light rounded-full p-3">
            <CircleCheck className="h-8 w-8 text-macrolens-primary" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">Meal Analysis</h2>
        <div className="flex justify-center mb-6">
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${confidenceBadgeColor}`}>
            {result.confidenceLevel} Confidence
          </span>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Total Macronutrients</CardTitle>
          </CardHeader>
          <CardContent>
            <MacroSummary macros={result.totalMacros} />
          </CardContent>
        </Card>

        <h3 className="font-semibold text-xl mb-4">Food Items</h3>
        <div className="space-y-4 mb-6">
          {result.foodItems.map((item, index) => (
            <FoodItemCard key={index} item={item} />
          ))}
        </div>

        {recommendations.length > 0 && (
          <div className="mb-8">
            <h3 className="font-semibold text-xl mb-4">Dietary Recommendations</h3>
            <Alert className="bg-amber-50 border-amber-200 mb-4">
              <Info className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-700">Disclaimer</AlertTitle>
              <AlertDescription className="text-amber-600">
                These recommendations are for general guidance only and are not professional medical or nutritional advice. 
                Please consult with a registered dietitian or healthcare provider for personalized advice.
              </AlertDescription>
            </Alert>
            <ul className="space-y-2">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="h-6 w-6 flex items-center justify-center rounded-full bg-macrolens-primary-light text-macrolens-primary flex-shrink-0">
                    {index + 1}
                  </span>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="flex-1 bg-macrolens-primary-light hover:bg-macrolens-primary-light/80 text-macrolens-primary border-none"
              onClick={generateRecommendations}
            >
              <Utensils className="mr-2 h-4 w-4" />
              Get Dietary Recommendations
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5" /> Dietary Recommendations
              </DialogTitle>
              <DialogDescription>
                Based on your meal analysis, here are some general recommendations.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Alert className="bg-amber-50 border-amber-200">
                <Info className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-700">Disclaimer</AlertTitle>
                <AlertDescription className="text-amber-600">
                  These recommendations are for general guidance only and are not professional medical or nutritional advice. 
                  Please consult with a registered dietitian or healthcare provider for personalized advice.
                </AlertDescription>
              </Alert>
              
              {isLoading ? (
                <div className="py-8 flex justify-center">
                  <div className="animate-pulse flex space-x-2">
                    <div className="h-2 w-2 bg-macrolens-primary rounded-full"></div>
                    <div className="h-2 w-2 bg-macrolens-primary rounded-full"></div>
                    <div className="h-2 w-2 bg-macrolens-primary rounded-full"></div>
                  </div>
                </div>
              ) : (
                <ul className="space-y-2">
                  {recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <span className="h-6 w-6 flex items-center justify-center rounded-full bg-macrolens-primary-light text-macrolens-primary flex-shrink-0">
                        {index + 1}
                      </span>
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Button 
          onClick={handleDownloadPDF}
          variant="outline" 
          className="flex-1 bg-macrolens-secondary hover:bg-macrolens-secondary/80 text-macrolens-primary border-none group"
        >
          <Download className="mr-2 h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          Download as PDF
        </Button>

        <Button 
          onClick={handleDownloadCSV}
          variant="outline" 
          className="flex-1 bg-macrolens-secondary hover:bg-macrolens-secondary/80 text-macrolens-primary border-none group"
        >
          <FileText className="mr-2 h-4 w-4" />
          Download as CSV
        </Button>
      </div>

      <div className="flex justify-center mt-8">
        <Button 
          onClick={onReset}
          className="bg-macrolens-primary hover:bg-macrolens-secondary"
        >
          Analyze Another Meal
        </Button>
      </div>
    </div>
  );
};

const MacroSummary = ({ macros }: { macros: Macros }) => {
  const totalGrams = macros.protein + macros.fat + macros.carbs;
  const proteinPercent = Math.round((macros.protein / totalGrams) * 100) || 0;
  const fatPercent = Math.round((macros.fat / totalGrams) * 100) || 0;
  const carbsPercent = Math.round((macros.carbs / totalGrams) * 100) || 0;
  const sugarPercent = Math.round((macros.sugar / totalGrams) * 100) || 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-1">
        <div>
          <span className="text-3xl font-bold">{Math.round(macros.calories)}</span>
          <span className="text-sm text-gray-500 ml-1">kcal</span>
        </div>
        <div className="flex gap-4">
          <MacroCircle value={proteinPercent} label="Protein" color="bg-blue-500" />
          <MacroCircle value={fatPercent} label="Fat" color="bg-yellow-500" />
          <MacroCircle value={carbsPercent} label="Carbs" color="bg-green-500" />
          <MacroCircle value={sugarPercent} label="Sugar" color="bg-red-500" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        <MacroDetail value={macros.protein} unit="g" label="Protein" />
        <MacroDetail value={macros.fat} unit="g" label="Fat" />
        <MacroDetail value={macros.carbs} unit="g" label="Carbs" />
        <MacroDetail value={macros.sugar} unit="g" label="Sugar" />
      </div>
    </div>
  );
};

const MacroCircle = ({ value, label, color }: { value: number, label: string, color: string }) => (
  <div className="flex flex-col items-center">
    <div className="relative h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
      <div className="absolute inset-0">
        <svg viewBox="0 0 36 36" className="h-12 w-12 -rotate-90">
          <path
            d={`M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831`}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-gray-200"
          />
          <path
            d={`M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831`}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${value}, 100`}
            className={color}
          />
        </svg>
      </div>
      <span className="text-xs font-semibold">{value}%</span>
    </div>
    <span className="text-xs mt-1">{label}</span>
  </div>
);

const MacroDetail = ({ value, unit, label }: { value: number, unit: string, label: string }) => (
  <div>
    <div className="font-semibold">{Math.round(value * 10) / 10}{unit}</div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
);

const FoodItemCard = ({ item }: { item: FoodItem }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium">{item.name}</h4>
          <span className="text-sm font-semibold">{Math.round(item.macros.calories)} kcal</span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center text-sm">
          <div>
            <span className="font-medium">{Math.round(item.macros.protein * 10) / 10}g</span>
            <span className="block text-xs text-gray-500">Protein</span>
          </div>
          <div>
            <span className="font-medium">{Math.round(item.macros.fat * 10) / 10}g</span>
            <span className="block text-xs text-gray-500">Fat</span>
          </div>
          <div>
            <span className="font-medium">{Math.round(item.macros.carbs * 10) / 10}g</span>
            <span className="block text-xs text-gray-500">Carbs</span>
          </div>
          <div>
            <span className="font-medium">{Math.round(item.macros.sugar * 10) / 10}g</span>
            <span className="block text-xs text-gray-500">Sugar</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
