export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold font-heading mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              <p className="mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                make a booking, or contact us for support.
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Personal information (name, email, phone number)</li>
                <li>Booking details and preferences</li>
                <li>Payment information (processed securely)</li>
                <li>Communication records</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Process and manage your bookings</li>
                <li>Provide customer support</li>
                <li>Send important updates about your bookings</li>
                <li>Improve our services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
              <p className="mb-4">
                We do not sell, trade, or rent your personal information to third parties. 
                We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>With service providers who assist in our operations</li>
                <li>When required by law or legal process</li>
                <li>To protect our rights and safety</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p className="mb-4">
                We implement appropriate security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p>Email: privacy@vayuvihar.com</p>
              <p>Phone: +91 80 4567 8900</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}