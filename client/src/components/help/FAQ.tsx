import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

// FAQ items data
const faqItems = [
  {
    question: "How do I book a helicopter?",
    answer: "You can book a helicopter through our website by selecting either a predefined route or creating a custom route. Simply choose your date, time, and the number of passengers, then proceed to payment. Once your booking is confirmed, you'll receive all the details via email and WhatsApp."
  },
  {
    question: "What is the difference between predefined and custom routes?",
    answer: "Predefined routes are fixed routes between established helipads with set pricing. Custom routes allow you to specify your own pickup and drop-off locations within Bangalore, with pricing calculated based on distance, duration, and helicopter type."
  },
  {
    question: "How far in advance should I book?",
    answer: "We recommend booking at least 48 hours in advance to ensure availability, especially during weekends and holidays. However, we do accommodate last-minute bookings subject to availability."
  },
  {
    question: "What happens if there's bad weather on my booking date?",
    answer: "Safety is our priority. If weather conditions make flying unsafe, we'll contact you to reschedule your booking at no additional cost. Alternatively, you can request a full refund if rescheduling doesn't work for you."
  },
  {
    question: "What is the cancellation policy?",
    answer: "You can cancel your booking up to 24 hours before the scheduled time for a full refund. Cancellations within 24 hours are subject to a 50% cancellation fee. No refunds are provided for no-shows or cancellations after the scheduled time."
  },
  {
    question: "How many passengers can a helicopter accommodate?",
    answer: "Our helicopters can accommodate between 4-7 passengers depending on the model. The exact capacity will be shown during the booking process based on your selected helicopter type."
  },
  {
    question: "Is there a baggage limit?",
    answer: "Yes, there is a weight restriction for safety reasons. Each passenger is allowed up to 5kg of hand baggage. For specific requirements or additional baggage, please contact our support team in advance."
  },
  {
    question: "Are children allowed on helicopter flights?",
    answer: "Yes, children of all ages are allowed, but children under 2 years must sit on an adult's lap. Children aged 2 and above require their own seat. Please inform us about children during booking for proper arrangements."
  },
  {
    question: "How do I pay for my booking?",
    answer: "We accept payments through credit/debit cards, UPI, and net banking through our secure Razorpay payment gateway. All transactions are encrypted for your security."
  },
  {
    question: "Do I need to arrive early for my flight?",
    answer: "Yes, please arrive at least 15 minutes before your scheduled departure time for check-in and safety briefing. Arriving late may result in missing your flight with no refund."
  }
];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter FAQ items based on search term
  const filteredFAQs = faqItems.filter(
    item => 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            placeholder="Search FAQs..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {filteredFAQs.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {filteredFAQs.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-neutral-600 dark:text-neutral-300">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg font-medium mb-2">No matching FAQs found</p>
            <p className="text-neutral-600 dark:text-neutral-300">
              Try adjusting your search term or contact our support team for assistance.
            </p>
          </div>
        )}
        
        <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <p className="text-center text-neutral-600 dark:text-neutral-300">
            Can't find what you're looking for? 
            <a href="#contact" className="text-primary ml-1 hover:underline">
              Contact our support team
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
