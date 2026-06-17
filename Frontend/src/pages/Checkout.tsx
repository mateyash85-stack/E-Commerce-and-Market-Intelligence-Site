import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { getCart, checkout } from '../api/client'
import { useAuth } from '../store/authContext'
import { toast } from 'sonner'
import { formatINR, toINR } from '../utils/currency'
import {
  MapPin, CreditCard, CheckCircle, ChevronRight,
  ShoppingBag, Smartphone, Landmark, Truck, ArrowLeft, Lock
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────────────────
interface Address {
  full_name: string; phone: string; address_line1: string
  address_line2: string; city: string; state: string; pincode: string
}
const emptyAddress: Address = {
  full_name: '', phone: '', address_line1: '', address_line2: '',
  city: '', state: '', pincode: '',
}

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
]

const STEPS = ['Cart', 'Address', 'Payment', 'Confirm']

// ── Step indicator ───────────────────────────────────────────────────────────
function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
              i < current ? 'bg-indigo-600 border-indigo-600 text-white'
              : i === current ? 'bg-white border-indigo-600 text-indigo-600'
              : 'bg-white border-gray-200 text-gray-300'
            }`}>
              {i < current ? <CheckCircle size={18} /> : i + 1}
            </div>
            <span className={`text-xs mt-1 font-medium ${i <= current ? 'text-indigo-600' : 'text-gray-400'}`}>{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-16 sm:w-24 h-0.5 mb-5 mx-1 transition-all ${i < current ? 'bg-indigo-600' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Address Step ─────────────────────────────────────────────────────────────
function AddressStep({ addr, onChange, onNext }: {
  addr: Address; onChange: (a: Address) => void; onNext: () => void
}) {
  const set = (k: keyof Address, v: string) => onChange({ ...addr, [k]: v })
  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!addr.pincode.match(/^\d{6}$/)) { toast.error('Enter a valid 6-digit pincode'); return }
    if (!addr.phone.match(/^\d{10}$/)) { toast.error('Enter a valid 10-digit phone number'); return }
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <MapPin size={18} className="text-indigo-600" />
        <h2 className="text-lg font-bold text-gray-800">Delivery Address</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wide">Full Name *</label>
          <input required value={addr.full_name} onChange={e => set('full_name', e.target.value)}
            placeholder="John Doe" className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wide">Phone Number *</label>
          <input required value={addr.phone} onChange={e => set('phone', e.target.value)}
            placeholder="10-digit mobile number" maxLength={10} className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wide">Address Line 1 *</label>
          <input required value={addr.address_line1} onChange={e => set('address_line1', e.target.value)}
            placeholder="House No., Building, Street, Area" className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wide">Address Line 2</label>
          <input value={addr.address_line2} onChange={e => set('address_line2', e.target.value)}
            placeholder="Landmark, Colony (optional)" className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wide">City *</label>
          <input required value={addr.city} onChange={e => set('city', e.target.value)}
            placeholder="Mumbai" className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wide">Pincode *</label>
          <input required value={addr.pincode} onChange={e => set('pincode', e.target.value)}
            placeholder="400001" maxLength={6} className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wide">State *</label>
          <select required value={addr.state} onChange={e => set('state', e.target.value)} className={inputCls}>
            <option value="">Select state</option>
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <button type="submit"
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3.5 rounded-xl hover:bg-indigo-700 font-semibold transition mt-2">
        Continue to Payment <ChevronRight size={16} />
      </button>
    </form>
  )
}

// ── Payment Step ─────────────────────────────────────────────────────────────
const PAYMENT_METHODS = [
  { id: 'upi',        label: 'UPI',          desc: 'Google Pay, PhonePe, Paytm, BHIM', icon: Smartphone, color: 'text-green-600' },
  { id: 'card',       label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: CreditCard, color: 'text-blue-600' },
  { id: 'netbanking', label: 'Net Banking',   desc: 'All major banks supported',       icon: Landmark,   color: 'text-purple-600' },
  { id: 'cod',        label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: Truck,       color: 'text-amber-600' },
]

function PaymentStep({ method, setMethod, total, onNext, onBack }: {
  method: string; setMethod: (m: string) => void
  total: number; onNext: () => void; onBack: () => void
}) {
  const [upiId, setUpiId] = useState('')
  const [cardNum, setCardNum] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [bank, setBank] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!method) { toast.error('Please select a payment method'); return }
    if (method === 'upi' && !upiId.includes('@')) { toast.error('Enter a valid UPI ID (e.g. name@upi)'); return }
    if (method === 'card') {
      if (cardNum.replace(/\s/g, '').length < 16) { toast.error('Enter valid 16-digit card number'); return }
      if (!expiry.match(/^\d{2}\/\d{2}$/)) { toast.error('Enter expiry as MM/YY'); return }
      if (cvv.length < 3) { toast.error('Enter valid CVV'); return }
    }
    if (method === 'netbanking' && !bank) { toast.error('Please select your bank'); return }
    onNext()
  }

  const formatCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <CreditCard size={18} className="text-indigo-600" />
        <h2 className="text-lg font-bold text-gray-800">Payment Method</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PAYMENT_METHODS.map(pm => (
          <button key={pm.id} type="button" onClick={() => setMethod(pm.id)}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition ${
              method === pm.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 bg-white'
            }`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
              method === pm.id ? 'bg-indigo-600' : 'bg-gray-100'
            }`}>
              <pm.icon size={18} className={method === pm.id ? 'text-white' : pm.color} />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-800">{pm.label}</p>
              <p className="text-xs text-gray-400">{pm.desc}</p>
            </div>
            {method === pm.id && <CheckCircle size={16} className="text-indigo-600 ml-auto flex-shrink-0" />}
          </button>
        ))}
      </div>

      {/* Dynamic fields */}
      {method === 'upi' && (
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wide">UPI ID *</label>
          <input value={upiId} onChange={e => setUpiId(e.target.value)}
            placeholder="yourname@upi"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition" />
          <p className="text-xs text-gray-400 mt-1">e.g. 9999999999@paytm or name@oksbi</p>
        </div>
      )}

      {method === 'card' && (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wide">Card Number *</label>
            <input value={cardNum} onChange={e => setCardNum(formatCard(e.target.value))}
              placeholder="1234 5678 9012 3456" maxLength={19}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition font-mono tracking-wider" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wide">Name on Card *</label>
            <input value={cardName} onChange={e => setCardName(e.target.value)}
              placeholder="JOHN DOE"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wide">Expiry (MM/YY) *</label>
              <input value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY" maxLength={5}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition font-mono" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wide">CVV *</label>
              <input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="•••" type="password" maxLength={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition font-mono" />
            </div>
          </div>
        </div>
      )}

      {method === 'netbanking' && (
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wide">Select Bank *</label>
          <select value={bank} onChange={e => setBank(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition">
            <option value="">Choose your bank</option>
            {['SBI','HDFC Bank','ICICI Bank','Axis Bank','Kotak Mahindra Bank','Bank of Baroda','Punjab National Bank','Canara Bank','IndusInd Bank','Yes Bank'].map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      )}

      {method === 'cod' && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700">
          <p className="font-semibold mb-1">Cash on Delivery selected</p>
          <p>You'll pay <span className="font-bold">{formatINR(total)}</span> when the order is delivered to your door.</p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition">
          <ArrowLeft size={15} /> Back
        </button>
        <button type="submit"
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 font-semibold transition">
          <Lock size={15} /> Review Order <ChevronRight size={15} />
        </button>
      </div>
    </form>
  )
}

// ── Review Step ───────────────────────────────────────────────────────────────
function ReviewStep({ addr, method, items, total, onConfirm, onBack, loading }: {
  addr: Address; method: string; items: any[]; total: number
  onConfirm: () => void; onBack: () => void; loading: boolean
}) {
  const pm = PAYMENT_METHODS.find(p => p.id === method)
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle size={18} className="text-indigo-600" />
        <h2 className="text-lg font-bold text-gray-800">Review Your Order</h2>
      </div>

      {/* Address summary */}
      <div className="bg-gray-50 rounded-xl p-4 border">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
            <MapPin size={12} /> Delivery Address
          </p>
        </div>
        <p className="font-semibold text-gray-800">{addr.full_name} · {addr.phone}</p>
        <p className="text-sm text-gray-600 mt-0.5">{addr.address_line1}{addr.address_line2 ? ', ' + addr.address_line2 : ''}</p>
        <p className="text-sm text-gray-600">{addr.city}, {addr.state} – {addr.pincode}</p>
      </div>

      {/* Payment summary */}
      <div className="bg-gray-50 rounded-xl p-4 border">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1 mb-2">
          <CreditCard size={12} /> Payment
        </p>
        <div className="flex items-center gap-2">
          {pm && <pm.icon size={16} className={pm.color} />}
          <span className="font-semibold text-gray-800">{pm?.label}</span>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Order Items ({items.length})</p>
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-3 bg-white border rounded-xl p-3">
            <img src={item.product.image_url} alt={item.product.name}
              className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{item.product.name}</p>
              <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
            </div>
            <p className="font-bold text-gray-800 text-sm">{formatINR(item.product.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
        <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
          <span>Subtotal</span><span>{formatINR(total)}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
          <span>Shipping</span><span className="text-green-600 font-medium">Free</span>
        </div>
        <div className="flex justify-between items-center font-bold text-lg border-t border-indigo-100 pt-2">
          <span>Total Payable</span>
          <span className="text-indigo-600">{formatINR(total)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition">
          <ArrowLeft size={15} /> Back
        </button>
        <button onClick={onConfirm} disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3.5 rounded-xl hover:bg-green-700 disabled:opacity-50 font-bold text-base transition shadow-sm shadow-green-200">
          {loading ? (
            <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
          ) : (
            <><Lock size={16} /> Place Order</>
          )}
        </button>
      </div>
      <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
        <Lock size={11} /> 100% secure checkout
      </p>
    </div>
  )
}

// ── Success Step ──────────────────────────────────────────────────────────────
function SuccessStep({ order }: { order: any }) {
  const pm = PAYMENT_METHODS.find(p => p.id === order.payment_method)
  return (
    <div className="text-center py-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 animate-bounce">
        <CheckCircle size={40} className="text-green-600" />
      </div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">Order Placed! 🎉</h2>
      <p className="text-gray-500 mb-1">Your order <span className="font-bold text-indigo-600">#{order.id}</span> has been confirmed.</p>
      <p className="text-gray-400 text-sm mb-6">
        {order.payment_method === 'cod'
          ? 'Pay cash when your order arrives.'
          : 'Payment successful. Your order is being processed.'}
      </p>

      {/* Order summary card */}
      <div className="bg-gray-50 rounded-2xl p-5 text-left border mb-6 max-w-sm mx-auto">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Order ID</span>
            <span className="font-bold text-gray-800">#{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="font-bold text-green-600 capitalize">{order.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment</span>
            <div className="flex items-center gap-1 font-semibold text-gray-800">
              {pm && <pm.icon size={13} className={pm.color} />} {pm?.label}
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment Status</span>
            <span className={`font-bold capitalize ${order.payment_status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
              {order.payment_status}
            </span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-base">
            <span>Total</span>
            <span className="text-indigo-600">{formatINR(order.total)}</span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t text-xs text-gray-500">
          <p className="font-semibold text-gray-700 mb-0.5">Delivering to:</p>
          <p>{order.full_name} · {order.phone}</p>
          <p>{order.address_line1}{order.address_line2 ? ', ' + order.address_line2 : ''}</p>
          <p>{order.city}, {order.state} – {order.pincode}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/orders"
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 font-semibold transition">
          <ShoppingBag size={16} /> View My Orders
        </Link>
        <Link to="/products"
          className="flex items-center justify-center gap-2 border border-gray-200 text-gray-600 px-6 py-3 rounded-xl hover:bg-gray-50 font-semibold transition">
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

// ── Main Checkout Page ────────────────────────────────────────────────────────
export default function Checkout({ onCartChange }: { onCartChange: () => void }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)   // 1=address 2=payment 3=review 4=success
  const [addr, setAddr] = useState<Address>(emptyAddress)
  const [payMethod, setPayMethod] = useState('')
  const [cartItems, setCartItems] = useState<any[]>([])
  const [placedOrder, setPlacedOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) { navigate('/auth'); return }
    getCart().then(r => {
      if (r.data.length === 0) { toast.error('Your cart is empty'); navigate('/cart') }
      else setCartItems(r.data)
    })
  }, [user])

  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0)

  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      const res = await checkout({ ...addr, payment_method: payMethod })
      setPlacedOrder(res.data)
      setStep(4)
      onCartChange()
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-6">
          <Link to="/cart" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-indigo-600 transition mb-3">
            <ArrowLeft size={14} /> Back to Cart
          </Link>
          <h1 className="text-2xl font-black text-gray-900">Checkout</h1>
        </div>

        <StepBar current={step === 4 ? 3 : step} />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {step === 1 && <AddressStep addr={addr} onChange={setAddr} onNext={() => setStep(2)} />}
          {step === 2 && (
            <PaymentStep method={payMethod} setMethod={setPayMethod}
              total={subtotal} onNext={() => setStep(3)} onBack={() => setStep(1)} />
          )}
          {step === 3 && (
            <ReviewStep addr={addr} method={payMethod} items={cartItems}
              total={subtotal} onConfirm={handlePlaceOrder}
              onBack={() => setStep(2)} loading={loading} />
          )}
          {step === 4 && placedOrder && <SuccessStep order={placedOrder} />}
        </div>
      </div>
    </div>
  )
}
