
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqItems = [
  {
    question: "How do credits work?",
    answer: "Each credit allows you to analyze one meal photo. Simply upload your photo, and we'll provide you with a detailed nutritional breakdown of your meal."
  },
  {
    question: "How do I access my credits after purchase?",
    answer: "After purchase, you'll receive an email with a unique link. This link will take you directly to your account where you can start analyzing meals right away."
  },
  {
    question: "What happens if I lose my link?",
    answer: "Don't worry! You can recover your link by entering the email address you used during purchase in our recovery form. We'll send you a fresh link to access your credits."
  },
  {
    question: "Do credits expire?",
    answer: "No, your purchased credits don't expire. Use them whenever you need nutritional analysis for your meals."
  },
  {
    question: "Can I share my credits with someone else?",
    answer: "Your credits are linked to your unique token. While you can use them on any device, we recommend not sharing your link as it provides direct access to your credits."
  },
  {
    question: "What if I need more credits?",
    answer: "You can purchase additional credits at any time from your analysis page or from the pricing page. New credits will be added to your existing balance."
  }
];

export function PricingFAQ() {
  return (
    <section className="py-12 bg-card">
      <div className="container-narrow">
        <h2 className="text-3xl font-serif mb-8 text-center">Frequently Asked Questions</h2>
        
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
