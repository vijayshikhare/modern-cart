import { Link } from 'react-router-dom'
import { Truck, Shield, Clock, Headphones, RefreshCw } from 'lucide-react'
import PageHero from '../components/layout/PageHero'

const Services = () => {
  const services = [
    { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50. Worldwide delivery in 3-5 days.' },
    { icon: Shield, title: 'Secure Payments', desc: 'Encrypted transactions with 100% protection.' },
    { icon: Clock, title: '24/7 Support', desc: 'Live chat, email, or call - we are here for you.' },
    { icon: RefreshCw, title: 'Easy Returns', desc: '30-day hassle-free returns. No questions asked.' },
    { icon: Headphones, title: 'Premium Support', desc: 'Dedicated account managers for bulk orders.' },
  ]

  return (
    <div className="min-h-screen bg-transparent">
      <PageHero
        title="Our Services"
        subtitle="Shop with confidence from checkout to delivery with premium support."
        tone="slate"
        badge="Service excellence"
        backgroundImage="https://picsum.photos/seed/services-hero/1400/500"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Services' }
        ]}
      />

      <div className="section-wrap py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <div key={i} className="surface-card p-6 text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-100 p-3">
                <service.icon className="h-6 w-6 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold mb-4">{service.title}</h3>
              <p className="text-slate-600">{service.desc}</p>
            </div>
          ))}
        </div>

        <section className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-8">Contact us for personalized support.</p>
          <Link to="/contact" className="btn-primary px-8 py-3">Get in Touch</Link>
        </section>
      </div>
    </div>
  )
}

export default Services