import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { CreditCard, MapPin, ShieldCheck, Truck, Loader2 } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import PageHero from '../components/layout/PageHero'

const Checkout = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cart, getTotal, clearCart } = useCart()
  const [placingOrder, setPlacingOrder] = useState(false)
  const [error, setError] = useState('')
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('COD')

  const subtotal = useMemo(() => Number(getTotal() || 0), [getTotal])
  const shippingPrice = subtotal > 50 ? 0 : 4.99
  const taxPrice = Number((subtotal * 0.1).toFixed(2))
  const totalPrice = Number((subtotal + shippingPrice + taxPrice).toFixed(2))

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!cart.length) {
    return <Navigate to="/cart" replace />
  }

  const handleAddressChange = (field, value) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }))
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()

    const hasMissing = Object.values(shippingAddress).some((v) => !String(v).trim())
    if (hasMissing) {
      setError('Please complete all shipping address fields.')
      return
    }

    setError('')
    setPlacingOrder(true)

    try {
      const token = localStorage.getItem('token')
      const orderItems = cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        product: item.productId
      }))

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          orderItems,
          shippingAddress,
          paymentMethod,
          taxPrice,
          shippingPrice,
          totalPrice
        })
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.msg || 'Failed to place order')
      }

      await clearCart()
      navigate('/orders', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setPlacingOrder(false)
    }
  }

  return (
    <div className="min-h-screen">
      <PageHero
        title="Checkout"
        subtitle="Review your order, add shipping details, and place it securely."
        tone="blue"
        badge="Secure checkout"
        backgroundImage="https://picsum.photos/seed/checkout-hero/1400/500"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Cart', to: '/cart' },
          { label: 'Checkout' }
        ]}
      />

      <div className="section-wrap py-8">
        <form className="grid grid-cols-1 gap-8 lg:grid-cols-3" onSubmit={handlePlaceOrder}>
          <section className="lg:col-span-2 surface-card p-6">
            <h2 className="mb-5 flex items-center text-2xl font-bold">
              <MapPin className="mr-2 h-5 w-5 text-primary-600" /> Shipping Address
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input placeholder="Street Address" value={shippingAddress.address} onChange={(e) => handleAddressChange('address', e.target.value)} />
              <Input placeholder="City" value={shippingAddress.city} onChange={(e) => handleAddressChange('city', e.target.value)} />
              <Input placeholder="Postal Code" value={shippingAddress.postalCode} onChange={(e) => handleAddressChange('postalCode', e.target.value)} />
              <Input placeholder="Country" value={shippingAddress.country} onChange={(e) => handleAddressChange('country', e.target.value)} />
            </div>

            <h3 className="mt-8 mb-4 flex items-center text-xl font-bold">
              <CreditCard className="mr-2 h-5 w-5 text-primary-600" /> Payment Method
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {['COD', 'Card', 'UPI'].map((method) => (
                <label key={method} className={`cursor-pointer rounded-xl border p-4 text-sm font-semibold ${paymentMethod === method ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 bg-white text-slate-700'}`}>
                  <input
                    type="radio"
                    className="mr-2"
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />
                  {method}
                </label>
              ))}
            </div>

            {error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
          </section>

          <aside className="surface-card h-fit p-6 lg:sticky lg:top-24">
            <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Items ({cart.length})</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>${shippingPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>${taxPrice.toFixed(2)}</span></div>
              <div className="mt-3 border-t pt-3 text-base font-bold flex justify-between"><span>Total</span><span>${totalPrice.toFixed(2)}</span></div>
            </div>

            <div className="mt-5 space-y-2 text-xs text-slate-600">
              <p className="flex items-center"><ShieldCheck className="mr-2 h-4 w-4 text-green-600" /> Secure checkout & encrypted payment</p>
              <p className="flex items-center"><Truck className="mr-2 h-4 w-4 text-primary-600" /> Fast shipping with order tracking</p>
            </div>

            <Button type="submit" className="mt-6 w-full" disabled={placingOrder}>
              {placingOrder ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Placing Order...</> : 'Place Order'}
            </Button>

            <Link to="/cart" className="mt-3 block text-center text-sm text-primary-600 hover:underline">Back to cart</Link>
          </aside>
        </form>
      </div>
    </div>
  )
}

export default Checkout
