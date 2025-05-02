import { useState, useRef, useEffect } from "react";
import { X, Send, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Responses for demonstration purposes
const botResponses: Record<string, string> = {
  "hello": "Hello! How can I help you today with Vayu Vihar's helicopter booking services?",
  "hi": "Hi there! How can I assist you with your helicopter booking needs?",
  "book": "To book a helicopter, go to our booking page and choose between a predefined route or a custom journey. You can access the booking page from the navigation menu or through the 'Book Now' button on the homepage.",
  "cancel": "You can cancel a booking up to 24 hours before the scheduled time for a full refund. To cancel, go to 'My Bookings', select the booking you wish to cancel, and click the 'Cancel Booking' button.",
  "refund": "Refunds are processed automatically to your original payment method. For cancellations made at least 24 hours in advance, you'll receive a full refund. Cancellations within 24 hours are subject to a 50% cancellation fee.",
  "payment": "We accept all major credit/debit cards, UPI, and net banking through our secure Razorpay payment gateway. All transactions are encrypted for your security.",
  "contact": "You can reach our customer support team at +91 80 4567 8900 or email us at support@vayuvihar.com. Our office hours are Monday to Saturday, 8:00 AM to 8:00 PM, and Sunday, 10:00 AM to 6:00 PM.",
  "luggage": "Each passenger is allowed up to 5kg of hand baggage. For specific requirements or additional baggage, please contact our support team in advance.",
  "children": "Children of all ages are welcome. Children under 2 years can sit on an adult's lap, while those 2 and above require their own seat. Please inform us about children during booking.",
  "weather": "If weather conditions make flying unsafe, we'll contact you to reschedule your booking at no additional cost. Alternatively, you can request a full refund if rescheduling doesn't work for you.",
  "time": "Please arrive at least 15 minutes before your scheduled departure time for check-in and safety briefing. Arriving late may result in missing your flight with no refund.",
};

// Helper function to find the best response
function findBestResponse(query: string): string {
  query = query.toLowerCase().trim();
  
  // Direct match
  if (botResponses[query]) {
    return botResponses[query];
  }
  
  // Keyword match
  for (const [key, response] of Object.entries(botResponses)) {
    if (query.includes(key)) {
      return response;
    }
  }
  
  // Default response
  return "I'm not sure how to answer that. For specific assistance, please contact our support team at +91 80 4567 8900 or email us at support@vayuvihar.com.";
}

interface ChatbotProps {
  onClose: () => void;
}

export default function Chatbot({ onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Vayu Vihar's virtual assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate bot thinking
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: findBestResponse(input),
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="fixed bottom-6 right-6 w-full max-w-md h-[600px] max-h-[80vh] bg-white dark:bg-neutral-800 rounded-lg shadow-xl flex flex-col z-50">
      {/* Header */}
      <div className="p-4 bg-primary text-white rounded-t-lg flex justify-between items-center">
        <div className="flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          <h3 className="font-bold">Vayu Vihar Assistant</h3>
        </div>
        <Badge variant="secondary" className="bg-white/20 text-white">Online</Badge>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="text-white hover:bg-primary-dark"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex mb-4 ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${message.isUser ? 'bg-primary text-white' : 'bg-neutral-100 dark:bg-neutral-700'} rounded-lg p-3`}>
              <div className="text-sm">{message.text}</div>
              <div className={`text-xs mt-1 ${message.isUser ? 'text-white/70' : 'text-neutral-500 dark:text-neutral-400'} text-right`}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <Separator />
      
      {/* Suggested questions */}
      <div className="p-2 overflow-x-auto whitespace-nowrap">
        <div className="flex space-x-2">
          {["How do I book?", "Cancellation policy?", "Luggage allowance?", "Contact support?"].map((question, index) => (
            <Button 
              key={index}
              variant="outline"
              size="sm"
              className="flex-shrink-0"
              onClick={() => {
                setInput(question);
                setTimeout(() => handleSendMessage(), 100);
              }}
            >
              {question}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Input */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 flex space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button onClick={handleSendMessage} type="submit">
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  );
}
