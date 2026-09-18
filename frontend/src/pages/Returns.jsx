// src/pages/Returns.jsx - Returns Policy Page
import { Link } from 'react-router-dom'
import { Package, Truck, Shield, Clock } from 'lucide-react'
import PageHero from '../components/layout/PageHero'

const Returns = () => {
  return (
    <div className="min-h-screen">
      <PageHero
        title="Returns Policy"
        subtitle="Transparent returns and fast refunds for stress-free shopping."
        tone="blue"
        badge="Last updated: January 20, 2026"
        backgroundImage="https://picsum.photos/seed/returns-hero/1400/500"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Returns' }
        ]}
      />

      <div className="section-wrap py-8">

        {/* Content */}
        <div className="surface-card p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Truck className="h-6 w-6 mr-2 text-primary-600" />
              Return Eligibility
            </h2>
            <p className="text-gray-700 mb-4">
              We want you to be completely satisfied with your ProShop purchase. You can return most new, unused items within 30 days of delivery for a full refund. Items must be in their original packaging with all tags attached.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Electronics: 14-day return window</li>
              <li>Fashion items: 30-day return window</li>
              <li>Non-returnable: Personalized items, hygiene products</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Clock className="h-6 w-6 mr-2 text-primary-600" />
              Return Process
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Log in to your account and go to <Link to="/orders" className="text-primary-600 hover:underline">Orders</Link></li>
              <li>Select the order and click "Return Items"</li>
              <li>Choose reason and print return label</li>
              <li>Ship back within 7 days using our free return shipping</li>
              <li>Refund processed in 5-7 business days</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-primary-600" />
              Refund Policy
            </h2>
            <p className="text-gray-700 mb-4">
              Refunds are issued to the original payment method. Shipping costs are non-refundable unless the return is due to our error. Exchanges are available for size/color issues.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 font-medium">Contact Support</p>
              <p className="text-sm text-gray-700">Email: support@proshop.com | Phone: 1-800-PROSHOP</p>
            </div>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Questions? <Link to="/contact" className="text-primary-600 hover:underline">Contact Us</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Returns