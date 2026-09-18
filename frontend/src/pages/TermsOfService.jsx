// src/pages/TermsOfService.jsx - Terms of Service Page
import { Link } from 'react-router-dom'
import { FileText, Scale, Shield, Clock } from 'lucide-react'
import PageHero from '../components/layout/PageHero'

const TermsOfService = () => {
  return (
    <div className="min-h-screen">
      <PageHero
        title="Terms of Service"
        subtitle="The terms governing your use of ProShop services and purchases."
        tone="slate"
        badge="Last updated: January 20, 2026"
        backgroundImage="https://picsum.photos/seed/terms-hero/1400/500"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Terms of Service' }
        ]}
      />

      <div className="section-wrap py-8">

        <div className="surface-card p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Scale className="h-6 w-6 mr-2 text-primary-600" />
              Acceptance of Terms
            </h2>
            <p className="text-gray-700 mb-4">
              By using ProShop, you agree to these Terms of Service. If you don't agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-primary-600" />
              User Responsibilities
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Provide accurate information during registration and checkout</li>
              <li>Do not use the site for illegal activities</li>
              <li>Respect intellectual property rights</li>
              <li>Comply with all applicable laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Clock className="h-6 w-6 mr-2 text-primary-600" />
              Limitation of Liability
            </h2>
            <p className="text-gray-700 mb-4">
              ProShop is not liable for indirect damages. Our total liability is limited to the purchase price.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Governing Law: Laws of Maharashtra, India</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-700">
              We may update these terms. Continued use constitutes acceptance of changes.
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link> | 
            <Link to="/contact" className="text-primary-600 hover:underline ml-2">Contact Us</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService