import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import FAQ from "@/components/help/FAQ";
import ContactForm from "@/components/help/ContactForm";
import Chatbot from "@/components/help/Chatbot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, MessageSquare, Phone } from "lucide-react";

export default function HelpCenterPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <Header />
      <main className="flex-grow">
        {/* Hero section */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-6">Help Center</h1>
              <p className="text-xl mb-6">
                Find answers to all your questions about Vayu Vihar's helipad booking service
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary"
                  onClick={() => window.location.href = '#faq'}
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  View FAQs
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary"
                  onClick={() => window.location.href = '#contact'}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="py-16 bg-neutral-50 dark:bg-neutral-900">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="faq" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="faq" id="faq">Frequently Asked Questions</TabsTrigger>
                <TabsTrigger value="contact" id="contact">Contact Support</TabsTrigger>
              </TabsList>
              
              <TabsContent value="faq">
                <FAQ />
              </TabsContent>
              
              <TabsContent value="contact">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                        <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                          Have a question that's not answered in our FAQs? Our support team is here to help. Fill out the form below and we'll get back to you as soon as possible.
                        </p>
                        
                        <ContactForm />
                      </div>
                      
                      <div className="lg:pl-8 lg:border-l border-neutral-200 dark:border-neutral-700">
                        <h2 className="text-2xl font-bold mb-4">Other Ways to Reach Us</h2>
                        
                        <div className="space-y-6">
                          <div className="flex items-start">
                            <div className="bg-primary/10 p-3 rounded-full mr-4">
                              <Phone className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold mb-1">Call Us</h3>
                              <p className="text-neutral-600 dark:text-neutral-300 mb-1">For immediate assistance</p>
                              <p className="text-primary font-medium">+91 80 4567 8900</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-primary/10 p-3 rounded-full mr-4">
                              <MessageSquare className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold mb-1">Email Us</h3>
                              <p className="text-neutral-600 dark:text-neutral-300 mb-1">For detailed inquiries</p>
                              <p className="text-primary font-medium">support@vayuvihar.com</p>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-semibold mb-2">Our Office</h3>
                            <p className="text-neutral-600 dark:text-neutral-300">
                              100 Airport Road,<br />
                              Bangalore 560017,<br />
                              Karnataka, India
                            </p>
                          </div>
                          
                          <div>
                            <h3 className="font-semibold mb-2">Business Hours</h3>
                            <p className="text-neutral-600 dark:text-neutral-300">
                              Monday - Saturday: 8:00 AM - 8:00 PM<br />
                              Sunday: 10:00 AM - 6:00 PM
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      {/* Chat button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button 
          size="lg" 
          className="rounded-full h-14 w-14 shadow-lg"
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          <MessageSquare className="h-6 w-6" />
          <span className="sr-only">Open Chat</span>
        </Button>
      </div>
      
      {/* Chatbot */}
      {isChatOpen && (
        <Chatbot onClose={() => setIsChatOpen(false)} />
      )}
      
      <Footer />
    </div>
  );
}
