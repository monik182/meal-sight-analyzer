
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

interface PricingCardProps {
  name: string;
  price: string;
  credits: number;
  pricePerCredit: string;
  features: string[];
  popular?: boolean;
  onSelect: () => void;
}

export function PricingCard({
  name,
  price,
  credits,
  pricePerCredit,
  features,
  popular = false,
  onSelect,
}: PricingCardProps) {
  return (
    <Card 
      className={cn(
        "flex flex-col h-full hover-lift transition-all", 
        popular ? "border-primary shadow-lg" : ""
      )}
    >
      <CardHeader className="pb-2 pt-6">
        {popular && (
          <div className="absolute top-0 right-0 left-0 transform -translate-y-1/2">
            <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full font-medium">
              MOST POPULAR
            </span>
          </div>
        )}
        <h3 className="text-xl font-bold">{name}</h3>
        <div className="mt-1">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-muted-foreground"> for {credits} credits</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {pricePerCredit} per analysis
        </p>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2 mt-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-baseline">
              <CheckIcon className="h-4 w-4 text-accent mr-2 shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-4">
        <Button 
          onClick={onSelect} 
          className="w-full"
          variant={popular ? "default" : "outline"}
        >
          Choose {name}
        </Button>
      </CardFooter>
    </Card>
  );
}
