export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold font-heading mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using Vayu Vihar's services, you accept and agree to be bound by 
                the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Service Description</h2>
              <p className="mb-4">
                Vayu Vihar provides helicopter transportation booking services in Bangalore. 
                We connect customers with certified helicopter operators and helipad facilities.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Booking and Payment</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>All bookings are subject to availability</li>
                <li>Payment must be completed to confirm booking</li>
                <li>Cancellation policies apply as specified during booking</li>
                <li>Weather conditions may affect flight schedules</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Safety and Compliance</h2>
              <p className="mb-4">
                All flights operate under strict safety regulations and are conducted by 
                licensed pilots with certified aircraft.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Liability</h2>
              <p className="mb-4">
                Vayu Vihar acts as an intermediary between customers and service providers. 
                Our liability is limited to the extent permitted by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>Provide accurate information during booking</li>
                <li>Arrive on time for scheduled flights</li>
                <li>Follow all safety instructions</li>
                <li>Comply with weight and baggage restrictions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <p className="mb-4">
                For questions about these Terms of Service, contact us at:
              </p>
              <p>Email: legal@vayuvihar.com</p>
              <p>Phone: +91 80 4567 8900</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}