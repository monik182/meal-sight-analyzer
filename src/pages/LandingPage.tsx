
import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { IntroSection } from "@/components/IntroSection";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Image, LeafyGreen, LineChart, Sparkles, Zap } from "lucide-react";

export default function LandingPage() {
  const featuresSectionRef = useRef<HTMLDivElement>(null);
  
  const scrollToFeatures = () => {
    featuresSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-macrolens-primary-light to-white">
          <div className="container-narrow text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-macrolens-primary-light p-3 rounded-full animate-pulse-light">
                <LeafyGreen className="w-10 h-10 text-macrolens-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif mb-6 animate-fade-in">
              Smart Food Analysis<br />With <span className="text-macrolens-primary">MacroLens</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: "100ms" }}>
              Instantly analyze your meals with AI. Get accurate nutrition information from just a photo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <Link to="/analyze">
                <Button 
                  size="lg"
                  className="bg-macrolens-primary hover:bg-macrolens-primary/90 hover-scale px-8 py-6 text-lg rounded-full shadow-md"
                >
                  Analyze a Meal
                  <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg"
                onClick={scrollToFeatures}
                className="border-macrolens-primary text-macrolens-primary hover:bg-macrolens-primary-light px-8 py-6 text-lg rounded-full"
              >
                See How It Works
              </Button>
            </div>
            <div className="mt-12 relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl animate-slide-up" style={{ animationDelay: "300ms" }}>
              <div className="aspect-video bg-gradient-to-tr from-macrolens-primary-light via-white to-macrolens-accent/20 rounded-2xl p-2">
                <div className="w-full h-full border-2 border-dashed border-macrolens-primary/20 rounded-xl flex items-center justify-center">
                  <div className="text-center p-8 max-w-md">
                    <Image className="w-16 h-16 mx-auto mb-4 text-macrolens-primary opacity-40" />
                    <p className="text-lg text-macrolens-primary/60 font-medium">
                      Scan your meals for instant nutritional analysis
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section ref={featuresSectionRef} className="py-16 md:py-24">
          <div className="container-narrow">
            <div className="text-center mb-16">
              <span className="text-sm font-medium text-macrolens-accent bg-macrolens-accent/10 px-4 py-1.5 rounded-full">
                HOW IT WORKS
              </span>
              <h2 className="text-3xl font-serif mt-4 mb-6">
                Analyze Your Food in 3 Easy Steps
              </h2>
              <p className="text-gray-600 max-w-lg mx-auto">
                MacroLens uses advanced AI to identify and analyze food in your photos, 
                providing detailed nutritional information instantly.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Take a Photo",
                  description: "Snap a picture of your meal using our app or upload an existing photo.",
                  icon: <Image className="w-8 h-8 text-macrolens-primary" />
                },
                {
                  title: "AI Analysis",
                  description: "Our AI instantly identifies food items and calculates nutritional values.",
                  icon: <Sparkles className="w-8 h-8 text-macrolens-primary" />
                },
                {
                  title: "Get Results",
                  description: "View comprehensive nutrition information including calories, macros, and more.",
                  icon: <LineChart className="w-8 h-8 text-macrolens-primary" />
                }
              ].map((step, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover-lift border border-gray-100">
                  <div className="bg-macrolens-primary-light p-3 rounded-full w-fit mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 md:py-24 bg-gradient-to-t from-macrolens-primary-light to-white">
          <div className="container-narrow">
            <div className="text-center mb-16">
              <span className="text-sm font-medium text-macrolens-accent bg-macrolens-accent/10 px-4 py-1.5 rounded-full">
                FEATURES
              </span>
              <h2 className="text-3xl font-serif mt-4 mb-6">
                Why Choose MacroLens?
              </h2>
              <p className="text-gray-600 max-w-lg mx-auto">
                Our app combines cutting-edge AI with a user-friendly interface to make 
                nutritional analysis accessible to everyone.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Accuracy",
                  description: "Advanced AI trained on millions of food images for precise identification."
                },
                {
                  title: "Simplicity",
                  description: "Just take a photo - no need to search through databases or guess portions."
                },
                {
                  title: "Detailed Breakdown",
                  description: "Get comprehensive macronutrients, calories, and nutritional information."
                },
                {
                  title: "No Account Needed",
                  description: "Start analyzing meals instantly without creating an account."
                }
              ].map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="bg-macrolens-accent/10 p-2.5 rounded-full h-fit">
                    <Check className="w-5 h-5 text-macrolens-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-narrow text-center">
            <h2 className="text-3xl md:text-4xl font-serif mb-6">
              Ready to Track Your Nutrition?
            </h2>
            <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
              Start analyzing your meals today with MacroLens - no account required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/analyze">
                <Button 
                  size="lg"
                  className="bg-macrolens-primary hover:bg-macrolens-primary/90 hover-scale px-8 py-6 text-lg rounded-full shadow-md"
                >
                  Analyze a Meal
                  <Zap className="ml-2" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-macrolens-primary text-macrolens-primary hover:bg-macrolens-primary-light px-8 py-6 text-lg rounded-full"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
