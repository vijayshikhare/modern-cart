// src/pages/CookiePolicy.jsx - Cookie Policy Page
import { Link } from 'react-router-dom'
import { Cookie, Shield, Clock } from 'lucide-react'
import PageHero from '../components/layout/PageHero'

const CookiePolicy = () => {
  return (
    <div className="min-h-screen">
      <PageHero
        title="Cookie Policy"
        subtitle="Understand how cookies power performance, security, and personalization."
        tone="orange"
        badge="Last updated: January 20, 2026"
        backgroundImage="https://picsum.photos/seed/cookies-hero/1400/500"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Cookie Policy' }
        ]}
      />

      <div className="section-wrap py-8">

        <div className="surface-card p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-primary-600" />
              What Are Cookies?
            </h2>
            <p className="text-gray-700 mb-4">
              Cookies are small text files stored on your device to remember preferences and track usage. We use them to enhance your shopping experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of Cookies We Use</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                <p className="text-sm text-gray-700">For site functionality (e.g., cart persistence)</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Analytics Cookies</h3>
                <p className="text-sm text-gray-700">Track site performance (e.g., Google Analytics)</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Marketing Cookies</h3>
                <p className="text-sm text-gray-700">Personalized ads (opt-out available)</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Session Cookies</h3>
                <p className="text-sm text-gray-700">Temporary, deleted on browser close</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Clock className="h-6 w-6 mr-2 text-primary-600" />
              Managing Cookies
            </h2>
            <p className="text-gray-700">
              You can manage cookies via browser settings. Note: Disabling essential cookies may affect site functionality. For more, visit our <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>.
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link> | 
            <Link to="/terms" className="text-primary-600 hover:underline ml-2">Terms of Service</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default CookiePolicy