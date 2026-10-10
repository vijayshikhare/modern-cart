import { useState } from 'react'
import { Mail, Github, Globe2, Send, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import Input from '../components/ui/Input'
import PageHero from '../components/layout/PageHero'

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Mock submit
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-transparent">
      <PageHero
        title="Get in Touch"
        subtitle="We're here to help. Reach out with questions, feedback, or support."
        tone="violet"
        badge="Support team online"
        backgroundImage="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=2200&q=85"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Contact' }
        ]}
      />

      <div className="section-wrap py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="section-title mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-6 w-6 text-primary-600 mr-4" />
                <div>
                  <p className="font-semibold">Support requests</p>
                  <p className="text-gray-600">Use the message form below</p>
                </div>
              </div>
              <div className="flex items-center">
                <Github className="h-6 w-6 text-primary-600 mr-4" />
                <div>
                  <p className="font-semibold">Open source</p>
                  <a href="https://github.com/vijayshikhare" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-primary-600">github.com/vijayshikhare</a>
                </div>
              </div>
              <div className="flex items-center">
                <Globe2 className="h-6 w-6 text-primary-600 mr-4" />
                <div>
                  <p className="font-semibold">Creator website</p>
                  <a href="https://vijayshikhare.com/" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-primary-600">vijayshikhare.com</a>
                </div>
              </div>
            </div>
            <div className="surface-card p-6">
              <h3 className="font-semibold mb-2">Business Hours</h3>
              <p className="text-sm text-gray-600">Send a message anytime through the form.</p>
              <p className="text-sm text-gray-600">We aim to reply within one business day.</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="surface-card p-6">
            <h2 className="section-title mb-6 text-2xl">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input 
                placeholder="Your Name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
              <Input 
                type="email" 
                placeholder="Your Email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
              <textarea
                placeholder="Your Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <Button type="submit" className="w-full btn-primary flex items-center justify-center" disabled={submitted}>
                {submitted ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
            {submitted && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg text-green-700 text-center">
                Thanks! We'll get back to you soon.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact