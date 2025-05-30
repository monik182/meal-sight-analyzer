'use client';
import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { ImageUploader } from "@/components/ImageUploader";
import { AnalysisResult } from "@/components/AnalysisResult";
import { LoadingAnalysis } from "@/components/LoadingAnalysis";
import { IntroSection } from "@/components/IntroSection";
import { Footer } from "@/components/Footer";
import { analyzeFoodImage } from "@/app/services/openai";
import { FoodAnalysisResult } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

type AppState = "intro" | "upload" | "confirm" | "analyzing" | "results";

const Analyze = () => {
  const [appState, setAppState] = useState<AppState>("intro");
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisResult | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const uploadSectionRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleImageSelected = (base64Image: string) => {
    setAppState("confirm");
    setBase64Image(base64Image);
  };

  const handleConfirmClick = async () => {
    setAppState("analyzing");

    try {
      const result = await analyzeFoodImage(base64Image);
      setAnalysisResult(result);
      setAppState("results");
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: error.message || "We couldn't analyze your meal. Please try again with a different image."
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
            <div ref={uploadSectionRef} className="my-12">
              <ImageUploader onImageSelected={handleImageSelected} />
            </div>
          </>
        );
      case "upload":
      case "confirm":
        return (
          <div ref={uploadSectionRef} className="py-12">
            <ImageUploader onImageSelected={handleImageSelected} onConfirmClick={handleConfirmClick} />
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
    <div className="min-h-screen flex flex-col bg-macrolens-background">
      <Header />
      <main className="flex-1 py-4">
        <div className="container-narrow py-8">
          {renderContent()}
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Analyze;
