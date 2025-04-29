
import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { ImageUploader } from "@/components/ImageUploader";
import { AnalysisResult } from "@/components/AnalysisResult";
import { LoadingAnalysis } from "@/components/LoadingAnalysis";
import { IntroSection } from "@/components/IntroSection";
import { Footer } from "@/components/Footer";
import { analyzeFoodImage } from "@/services/openai";
import { FoodAnalysisResult } from "@/types"; // Fixed import from types
import { useToast } from "@/hooks/use-toast";

type AppState = "intro" | "upload" | "analyzing" | "results";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("intro");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisResult | null>(null);
  const uploadSectionRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleImageSelected = async (file: File) => {
    setSelectedImage(file);
    setAppState("analyzing");
    
    try {
      const result = await analyzeFoodImage(file);
      setAnalysisResult(result);
      setAppState("results");
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: "We couldn't analyze your meal. Please try again with a different image."
      });
      setAppState("upload");
    }
  };

  const handleStartClick = () => {
    setAppState("upload");
    setTimeout(() => {
      uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setAppState("upload");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (appState) {
      case "intro":
        return (
          <>
            <IntroSection onStartClick={handleStartClick} />
            <div ref={uploadSectionRef} className="my-8">
              <ImageUploader onImageSelected={handleImageSelected} />
            </div>
          </>
        );
      case "upload":
        return (
          <div ref={uploadSectionRef} className="py-8">
            <ImageUploader onImageSelected={handleImageSelected} />
          </div>
        );
      case "analyzing":
        return <LoadingAnalysis />;
      case "results":
        return analysisResult && <AnalysisResult result={analysisResult} onReset={handleReset} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <div className="container-narrow py-6">
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
