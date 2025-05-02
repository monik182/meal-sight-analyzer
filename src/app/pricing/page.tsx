'use client'
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PricingCard } from "@/components/PricingCard";
import { PricingFAQ } from "@/components/PricingFAQ";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

// Define pricing packages
const pricingPackages = [
  {
    name: "Basic",
    credits: 5,
    price: "$2.99",
    pricePerCredit: "$0.599",
    features: ["5 meal analyses", "Detailed nutrition breakdown", "Email delivery"],
    popular: false,
  },
  {
    name: "Starter",
    credits: 10,
    price: "$4.99",
    pricePerCredit: "$0.499",
    features: ["10 meal analyses", "Detailed nutrition breakdown", "Email delivery"],
    popular: false,
  },
  {
    name: "Popular",
    credits: 25,
    price: "$9.99",
    pricePerCredit: "$0.399",
    features: ["25 meal analyses", "Detailed nutrition breakdown", "Email delivery", "Priority processing", "Advanced recommendations"],
    popular: true,
  },
  {
    name: "Premium",
    credits: 50,
    price: "$17.99",
    pricePerCredit: "$0.359",
    features: ["50 meal analyses", "Detailed nutrition breakdown", "Email delivery", "Priority processing", "Advanced recommendations"],
    popular: false,
  },
];

// Create form schema for email input
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const Pricing = () => {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSelectPackage = (index: number) => {
    setSelectedPackage(index);
    setDialogOpen(true);
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // In a real implementation, this would integrate with Stripe
    // and handle the token generation and email sending
    console.log("Processing order:", {
      package: selectedPackage !== null ? pricingPackages[selectedPackage] : null,
      email: data.email,
    });

    toast({
      title: "Thanks for your interest!",
      description: "This is a demo - payment processing would happen here.",
    });
    
    setDialogOpen(false);
    form.reset();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 bg-gradient-to-b from-white to-muted">
          <div className="container-narrow text-center">
            <h1 className="text-4xl font-serif mb-4">Choose Your Analysis Package</h1>
            <p className="text-lg text-muted-foreground mb-12">
              Select the perfect plan that fits your nutritional analysis needs
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pricingPackages.map((pkg, index) => (
                <PricingCard 
                  key={index}
                  name={pkg.name}
                  price={pkg.price}
                  credits={pkg.credits}
                  pricePerCredit={pkg.pricePerCredit}
                  features={pkg.features}
                  popular={pkg.popular}
                  onSelect={() => handleSelectPackage(index)}
                />
              ))}
            </div>
          </div>
        </section>

        <PricingFAQ />
      </main>
      <Footer />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>
              Enter your email address to receive your analysis credits
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="youremail@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Proceed to Payment
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pricing;
