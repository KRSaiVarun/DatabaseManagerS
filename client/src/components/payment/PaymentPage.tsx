import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Smartphone, 
  Building, 
  QrCode, 
  CheckCircle, 
  ArrowLeft,
  Clock,
  MapPin,
  Users
} from "lucide-react";

interface PaymentPageProps {
  bookingData: any;
  totalAmount: number;
  onSuccess: (paymentData: any) => void;
  onBack: () => void;
}

const paymentSchema = z.object({
  paymentMethod: z.enum(["card", "upi", "netbanking"], {
    required_error: "Please select a payment method",
  }),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  cardName: z.string().optional(),
  upiId: z.string().optional(),
  bankName: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export default function PaymentPage({ bookingData, totalAmount, onSuccess, onBack }: PaymentPageProps) {
  const [paymentStep, setPaymentStep] = useState<'method' | 'details' | 'upi-qr' | 'success'>('method');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const { toast } = useToast();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "card",
    },
  });

  const processPaymentMutation = useMutation({
    mutationFn: async (data: PaymentFormValues) => {
      const paymentData = {
        ...bookingData,
        paymentMethod: data.paymentMethod,
        totalAmount,
      };
      
      const endpoint = bookingData.bookingType === 'predefined' 
        ? '/api/bookings/predefined' 
        : '/api/bookings/custom';
      
      const res = await apiRequest('POST', endpoint, paymentData);
      return res.json();
    },
    onSuccess: (data) => {
      setPaymentStep('success');
      onSuccess(data);
    },
    onError: (error) => {
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Failed to process payment",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PaymentFormValues) => {
    if (data.paymentMethod === 'upi') {
      // Generate UPI QR code data
      const upiString = `upi://pay?pa=vayuvihar@paytm&pn=Vayu%20Vihar&am=${totalAmount/100}&cu=INR&tn=Helicopter%20Booking%20Payment`;
      setQrCodeData(upiString);
      setPaymentStep('upi-qr');
    } else {
      processPaymentMutation.mutate(data);
    }
  };

  const handleUpiPaymentComplete = () => {
    // Simulate UPI payment completion
    setTimeout(() => {
      processPaymentMutation.mutate({ paymentMethod: 'upi' });
    }, 1000);
  };

  const renderUpiQrCode = () => (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center">
          <QrCode className="h-5 w-5 mr-2" />
          UPI Payment
        </CardTitle>
        <CardDescription>
          Scan the QR code with any UPI app to complete payment
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        {/* QR Code placeholder - In production, use a QR code library */}
        <div className="flex justify-center">
          <div className="w-64 h-64 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg flex items-center justify-center bg-white">
            <div className="text-center">
              <QrCode className="h-16 w-16 mx-auto mb-4 text-neutral-400" />
              <p className="text-sm text-neutral-500">QR Code</p>
              <p className="text-xs text-neutral-400 mt-2">Amount: {formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-medium">Payment Details:</p>
          <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
            <p className="text-sm"><strong>Merchant:</strong> Vayu Vihar</p>
            <p className="text-sm"><strong>Amount:</strong> {formatCurrency(totalAmount)}</p>
            <p className="text-sm"><strong>UPI ID:</strong> vayuvihar@paytm</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            After scanning and completing payment, click the button below
          </p>
          <Button onClick={handleUpiPaymentComplete} className="w-full">
            <CheckCircle className="h-4 w-4 mr-2" />
            I Have Completed Payment
          </Button>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setPaymentStep('method')} className="flex-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Payment Methods
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {paymentStep === 'upi-qr' && renderUpiQrCode()}
      </div>
    </div>
  );
}