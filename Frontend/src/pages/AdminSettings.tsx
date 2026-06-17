import { useState } from 'react'
import { toast } from 'sonner'
import { Save, Store, Globe, DollarSign, Shield, Bell } from 'lucide-react'

interface StoreSettings {
  storeName: string
  storeEmail: string
  storePhone: string
  currency: string
  taxRate: string
  freeShippingThreshold: string
  maintenanceMode: boolean
  allowRegistrations: boolean
  orderNotifications: boolean
  lowStockThreshold: string
}

const DEFAULTS: StoreSettings = {
  storeName: 'ShopIQ',
  storeEmail: 'admin@shopiq.com',
  storePhone: '',
  currency: 'INR',
  taxRate: '18',
  freeShippingThreshold: '499',
  maintenanceMode: false,
  allowRegistrations: true,
  orderNotifications: true,
  lowStockThreshold: '10',
}

function loadSettings(): StoreSettings {
  try {
    const saved = localStorage.getItem('adminSettings')
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="bg-white border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5 pb-4 border-b">
        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
          <Icon size={16} className="text-indigo-600" />
        </div>
        <h2 className="font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-start">
      <div>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
      </div>
      <div className="sm:col-span-2">{children}</div>
    </div>
  )
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<StoreSettings>(loadSettings)
  const [saved, setSaved] = useState(false)

  const set = <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) =>
    setSettings(s => ({ ...s, [key]: value }))

  const handleSave = () => {
    localStorage.setItem('adminSettings', JSON.stringify(settings))
    setSaved(true)
    toast.success('Settings saved')
    setTimeout(() => setSaved(false), 2000)
  }

  const inputCls =
    'w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Configure your store preferences</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 font-medium text-sm transition"
        >
          <Save size={15} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Store Info */}
        <Section title="Store Information" icon={Store}>
          <Field label="Store Name" hint="Displayed in the browser tab and emails">
            <input
              value={settings.storeName}
              onChange={e => set('storeName', e.target.value)}
              className={inputCls}
              placeholder="ShopIQ"
            />
          </Field>
          <Field label="Contact Email" hint="Used for order confirmation emails">
            <input
              type="email"
              value={settings.storeEmail}
              onChange={e => set('storeEmail', e.target.value)}
              className={inputCls}
              placeholder="admin@shopiq.com"
            />
          </Field>
          <Field label="Phone Number" hint="Support phone number">
            <input
              value={settings.storePhone}
              onChange={e => set('storePhone', e.target.value)}
              className={inputCls}
              placeholder="+91 98765 43210"
            />
          </Field>
        </Section>

        {/* Commerce */}
        <Section title="Commerce & Pricing" icon={DollarSign}>
          <Field label="Currency">
            <select
              value={settings.currency}
              onChange={e => set('currency', e.target.value)}
              className={inputCls}
            >
              <option value="INR">INR (₹) — Indian Rupee</option>
              <option value="USD">USD ($) — US Dollar</option>
              <option value="EUR">EUR (€) — Euro</option>
              <option value="GBP">GBP (£) — British Pound</option>
            </select>
          </Field>
          <Field label="Tax Rate (%)" hint="Applied at checkout">
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={settings.taxRate}
              onChange={e => set('taxRate', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Free Shipping Threshold (₹)" hint="Minimum order value for free shipping">
            <input
              type="number"
              min="0"
              value={settings.freeShippingThreshold}
              onChange={e => set('freeShippingThreshold', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Low Stock Threshold" hint="Alert when stock falls below this number">
            <input
              type="number"
              min="0"
              value={settings.lowStockThreshold}
              onChange={e => set('lowStockThreshold', e.target.value)}
              className={inputCls}
            />
          </Field>
        </Section>

        {/* Access */}
        <Section title="Access & Security" icon={Shield}>
          <Field label="Maintenance Mode" hint="Temporarily disable the storefront for customers">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => set('maintenanceMode', !settings.maintenanceMode)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.maintenanceMode ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.maintenanceMode ? 'translate-x-5' : ''
                  }`}
                />
              </div>
              <span className="text-sm text-gray-600">
                {settings.maintenanceMode ? 'On — storefront is hidden' : 'Off — store is live'}
              </span>
            </label>
          </Field>
          <Field label="Allow Registrations" hint="Let new users sign up">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => set('allowRegistrations', !settings.allowRegistrations)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.allowRegistrations ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.allowRegistrations ? 'translate-x-5' : ''
                  }`}
                />
              </div>
              <span className="text-sm text-gray-600">
                {settings.allowRegistrations ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </Field>
        </Section>

        {/* Notifications */}
        <Section title="Notifications" icon={Bell}>
          <Field label="Order Notifications" hint="Receive email on new orders">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => set('orderNotifications', !settings.orderNotifications)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.orderNotifications ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.orderNotifications ? 'translate-x-5' : ''
                  }`}
                />
              </div>
              <span className="text-sm text-gray-600">
                {settings.orderNotifications ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </Field>
        </Section>

        {/* API Info */}
        <Section title="API & Environment" icon={Globe}>
          <Field label="API Base URL" hint="Backend API endpoint (from .env)">
            <input
              readOnly
              value={import.meta.env.VITE_API_URL || 'http://localhost:8000'}
              className={`${inputCls} bg-gray-50 text-gray-500 cursor-not-allowed`}
            />
          </Field>
          <Field label="Environment">
            <input
              readOnly
              value={import.meta.env.MODE || 'development'}
              className={`${inputCls} bg-gray-50 text-gray-500 cursor-not-allowed`}
            />
          </Field>
        </Section>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 font-medium text-sm transition"
          >
            <Save size={15} />
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
