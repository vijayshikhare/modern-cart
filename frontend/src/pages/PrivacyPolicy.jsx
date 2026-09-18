// src/pages/PrivacyPolicy.jsx - Privacy Policy Page
import { Link } from 'react-router-dom'
import { Shield, Lock, User, Globe } from 'lucide-react'
import PageHero from '../components/layout/PageHero'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen">
      <PageHero
        title="Privacy Policy"
        subtitle="How we collect, process, and protect your personal data across ProShop."
        tone="violet"
        badge="Last updated: January 20, 2026"
        backgroundImage="https://picsum.photos/seed/privacy-hero/1400/500"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Privacy Policy' }
        ]}
      />

      <div className="section-wrap py-8">

        <div className="surface-card p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Lock className="h-6 w-6 mr-2 text-primary-600" />
              Information We Collect
            </h2>
            <p className="text-gray-700 mb-4">
              We collect personal information like name, email, and shipping address when you create an account or place an order. This helps us process your purchases and provide personalized recommendations.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Account details (name, email)</li>
              <li>Order history and payment info</li>
              <li>Usage data (browsing behavior)</li>
              <li>Cookies for site functionality</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <User className="h-6 w-6 mr-2 text-primary-600" />
              How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-4">
              Your data is used to fulfill orders, improve our services, and send promotional emails (with opt-out). We never sell your information to third parties.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Security</h3>
                <p className="text-sm text-gray-700">All data is encrypted and stored securely.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Your Rights</h3>
                <p className="text-sm text-gray-700">Access, delete, or export your data anytime.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Globe className="h-6 w-6 mr-2 text-primary-600" />
              Third-Party Sharing
            </h2>
            <p className="text-gray-700">
              We share data only with shipping partners (e.g., FedEx) for delivery and payment processors (e.g., Stripe) for transactions. No data is shared for marketing.
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            <Link to="/terms" className="text-primary-600 hover:underline">Terms of Service</Link> | 
            <Link to="/contact" className="text-primary-600 hover:underline ml-2">Contact Us</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy