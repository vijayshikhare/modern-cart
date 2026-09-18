import { Link } from 'react-router-dom'
import { Users, Award, Truck, Leaf, Sparkles } from 'lucide-react'
import PageHero from '../components/layout/PageHero'

const Sustainability = () => {
  const stats = [
    { icon: Users, label: 'Happy Customers', value: '1M+' },
    { icon: Award, label: 'Trees Planted', value: '50K+' },
    { icon: Truck, label: 'Carbon Neutral', value: '100%' },
  ]

  const initiatives = [
    { title: 'Eco-Friendly Packaging', desc: 'All orders ship in 100% recycled materials.' },
    { title: 'Fair Trade Partners', desc: 'Supporting ethical supply chains worldwide.' },
    { title: 'Carbon Offset Program', desc: 'Every purchase offsets emissions.' },
  ]

  return (
    <div className="min-h-screen">
      <PageHero
        title="Sustainable Shopping for a Better Tomorrow"
        subtitle="At ProShop, every purchase powers positive change. Join us in building a greener future."
        tone="green"
        badge="Our commitment"
        backgroundImage="https://picsum.photos/seed/sustainability-hero/1400/500"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Sustainability' }
        ]}
      />

      <div className="section-wrap py-8">
        <div className="mb-8 text-center">
          <Link to="/products" className="btn-primary inline-flex items-center px-8 py-4 text-lg">
            Shop Sustainably <Sparkles className="ml-2 h-5 w-5" />
          </Link>
        </div>
        {/* Stats */}
        <section className="text-center mb-16">
          <h2 className="section-title mb-8">Our Impact at a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="surface-card p-6">
                <stat.icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Story */}
        <section className="mb-16">
          <div className="surface-card p-8 text-center">
            <h2 className="section-title text-3xl mb-6">Our Sustainability Story</h2>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Since 2025, ProShop has been more than an e-commerce platform—it's a movement. We partner with ethical brands, use recycled packaging, and offset every delivery's carbon footprint. Every click plants a tree, every order supports fair trade. Join us in making shopping sustainable.
            </p>
          </div>
        </section>

        {/* Initiatives */}
        <section className="mb-16">
          <h2 className="section-title text-center mb-12">Key Initiatives</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {initiatives.map((init, i) => (
              <div key={i} className="surface-card p-6 text-center">
                <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">{init.title}</h3>
                <p className="text-gray-600">{init.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h2>
          <Link to="/products" className="btn-primary px-8 py-4 text-lg inline-flex items-center">
            Shop Eco-Friendly <Leaf className="ml-2 h-5 w-5" />
          </Link>
        </section>
      </div>
    </div>
  )
}

export default Sustainability