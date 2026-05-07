'use client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Lock, LogOut, Package, Mail, BarChart3, Plus, Trash2, Edit3, Eye, Star, X,
  Download, Search, ChevronRight, Leaf, ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const CATEGORIES = [
  'Turmeric Powder', 'Turmeric Fingers', 'Banana Chips', 'Flavoured Banana Chips',
  'Papad', 'Masala', 'Spices', 'Ayurvedic Products', 'Ashwagandha Powder',
  'Dry Snacks', 'Herbal Powders', 'Private Label Products'
]

const Admin = () => {
  const [token, setToken] = useState(null)
  const [creds, setCreds] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('sr_admin_token') : null
    if (t) {
      fetch('/api/admin/verify', { headers: { Authorization: `Bearer ${t}` } })
        .then(r => r.json()).then(d => { if (d.valid) setToken(t); else localStorage.removeItem('sr_admin_token') })
    }
  }, [])

  const login = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(creds) })
      const d = await r.json()
      if (r.ok) {
        localStorage.setItem('sr_admin_token', d.token)
        setToken(d.token); toast.success('Welcome, Admin')
      } else toast.error(d.error || 'Login failed')
    } catch { toast.error('Network error') }
    setLoading(false)
  }
  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    localStorage.removeItem('sr_admin_token'); setToken(null)
  }

  if (!token) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-white/95 backdrop-blur shadow-2xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37] to-[#9c7a2a] flex items-center justify-center"><Leaf className="w-6 h-6 text-[#062019]" /></div>
              <div>
                <div className="font-display text-2xl gold-text font-semibold">SatvaRoot</div>
                <div className="text-xs uppercase tracking-widest text-[#9c7a2a]">Admin Portal</div>
              </div>
            </div>
            <h1 className="font-display text-2xl font-semibold mb-1">Welcome back</h1>
            <p className="text-sm text-[#0f3d2e]/60 mb-6">Sign in to manage products & enquiries</p>
            <form onSubmit={login} className="space-y-3">
              <Input placeholder="Username" value={creds.username} onChange={e => setCreds({ ...creds, username: e.target.value })} required />
              <Input type="password" placeholder="Password" value={creds.password} onChange={e => setCreds({ ...creds, password: e.target.value })} required />
              <Button disabled={loading} type="submit" className="w-full bg-[#0f3d2e] text-white h-11"><Lock className="w-4 h-4 mr-2" /> {loading ? 'Signing in...' : 'Sign In'}</Button>
            </form>
            <div className="mt-5 p-3 rounded-lg bg-[#faf2e0] text-xs text-[#0f3d2e]/70">
              <strong>Demo credentials:</strong> admin / satvaroot2025
            </div>
            <a href="/" className="mt-4 flex items-center justify-center gap-1 text-xs text-[#0f3d2e]/60 hover:text-[#0f3d2e]"><ArrowLeft className="w-3 h-3" /> Back to website</a>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <Dashboard token={token} onLogout={logout} />
}

const Dashboard = ({ token, onLogout }) => {
  const [stats, setStats] = useState(null)
  const [products, setProducts] = useState([])
  const [enquiries, setEnquiries] = useState([])
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)

  const auth = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const refresh = async () => {
    const [s, p, e] = await Promise.all([
      fetch('/api/admin/stats', { headers: auth }).then(r => r.json()),
      fetch('/api/products').then(r => r.json()),
      fetch('/api/enquiries', { headers: auth }).then(r => r.json())
    ])
    setStats(s); setProducts(p.products || []); setEnquiries(e.enquiries || [])
  }
  useEffect(() => { refresh() }, [])

  const deleteProduct = async (id) => {
    if (!confirm('Delete product?')) return
    await fetch(`/api/products/${id}`, { method: 'DELETE', headers: auth })
    toast.success('Deleted'); refresh()
  }
  const deleteEnquiry = async (id) => {
    if (!confirm('Delete enquiry?')) return
    await fetch(`/api/enquiries/${id}`, { method: 'DELETE', headers: auth })
    toast.success('Deleted'); refresh()
  }
  const updateEnquiry = async (id, status) => {
    await fetch(`/api/enquiries/${id}`, { method: 'PUT', headers: auth, body: JSON.stringify({ status }) })
    refresh()
  }
  const exportEnquiries = () => {
    const headers = ['Date', 'Name', 'Company', 'Country', 'Email', 'Phone', 'WhatsApp', 'Product', 'Quantity', 'Message', 'Status']
    const rows = enquiries.map(e => [
      new Date(e.createdAt).toLocaleString(), e.name, e.company, e.country, e.email, e.phone, e.whatsapp, e.product, e.quantity, (e.message || '').replace(/[\n\r,]/g, ' '), e.status
    ])
    const csv = [headers, ...rows].map(r => r.map(c => `"${(c || '').toString().replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a')
    a.href = url; a.download = `enquiries-${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url)
  }

  const saveProduct = async (data) => {
    const url = data.id ? `/api/products/${data.id}` : '/api/products'
    const method = data.id ? 'PUT' : 'POST'
    const r = await fetch(url, { method, headers: auth, body: JSON.stringify(data) })
    if (r.ok) { toast.success('Saved'); setEditing(null); setAdding(false); refresh() } else toast.error('Failed')
  }

  return (
    <div className="min-h-screen bg-[#faf6ee]">
      <header className="bg-[#0f3d2e] text-white border-b border-[#d4af37]/20">
        <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4af37] to-[#9c7a2a] flex items-center justify-center"><Leaf className="w-5 h-5 text-[#062019]" /></div>
            <div>
              <div className="font-display text-lg gold-text font-semibold leading-none">SatvaRoot Admin</div>
              <div className="text-[10px] uppercase tracking-widest text-[#d4af37]/60">Dashboard</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="text-white hover:bg-white/10" size="sm"><a href="/">View Site</a></Button>
            <Button onClick={onLogout} variant="ghost" className="text-white hover:bg-white/10" size="sm"><LogOut className="w-4 h-4 mr-1" /> Logout</Button>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {stats && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Products" value={stats.products} icon={Package} color="#0f3d2e" />
            <StatCard label="Enquiries" value={stats.enquiries} icon={Mail} color="#d4af37" />
            <StatCard label="Newsletter" value={stats.newsletter} icon={BarChart3} color="#1a5740" />
            <StatCard label="New Enquiries" value={stats.byStatus?.find(x => x._id === 'new')?.count || 0} icon={Star} color="#b08930" />
          </div>
        )}

        <Tabs defaultValue="enquiries">
          <TabsList className="bg-white border">
            <TabsTrigger value="enquiries">Enquiries ({enquiries.length})</TabsTrigger>
            <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="enquiries" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="font-display text-2xl">Buyer Enquiries</h2>
                  <Button onClick={exportEnquiries} variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#faf2e0] text-[#0f3d2e]/80 text-xs uppercase tracking-widest">
                      <tr>
                        <th className="text-left p-3">Date</th>
                        <th className="text-left p-3">Buyer</th>
                        <th className="text-left p-3">Country</th>
                        <th className="text-left p-3">Product</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enquiries.map(e => (
                        <tr key={e.id} className="border-b hover:bg-[#faf6ee]/50">
                          <td className="p-3 text-xs">{new Date(e.createdAt).toLocaleDateString()}</td>
                          <td className="p-3">
                            <div className="font-medium">{e.name}</div>
                            <div className="text-xs text-[#0f3d2e]/60">{e.email}</div>
                            {e.company && <div className="text-xs text-[#0f3d2e]/50">{e.company}</div>}
                          </td>
                          <td className="p-3">{e.country || '-'}</td>
                          <td className="p-3 max-w-xs">
                            <div className="font-medium text-xs">{e.product || '-'}</div>
                            {e.quantity && <div className="text-xs text-[#9c7a2a]">Qty: {e.quantity}</div>}
                          </td>
                          <td className="p-3">
                            <select value={e.status} onChange={(ev) => updateEnquiry(e.id, ev.target.value)} className="text-xs px-2 py-1 rounded border bg-white">
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="quoted">Quoted</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" onClick={() => alert(`Message:\n\n${e.message || '(none)'}\n\nPhone: ${e.phone}\nWhatsApp: ${e.whatsapp}`)}><Eye className="w-4 h-4" /></Button>
                              <Button size="icon" variant="ghost" onClick={() => deleteEnquiry(e.id)}><Trash2 className="w-4 h-4 text-red-600" /></Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {enquiries.length === 0 && <tr><td colSpan={6} className="p-10 text-center text-[#0f3d2e]/50">No enquiries yet</td></tr>}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="font-display text-2xl">Products</h2>
                  <Button onClick={() => setAdding(true)} className="bg-[#0f3d2e] text-white"><Plus className="w-4 h-4 mr-1" /> Add Product</Button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map(p => (
                    <div key={p.id} className="border rounded-xl bg-white overflow-hidden hover:shadow-md transition">
                      <div className="aspect-video bg-[#faf6ee] overflow-hidden">
                        <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <div className="text-[10px] uppercase tracking-widest text-[#9c7a2a]">{p.category}</div>
                        <div className="font-semibold mt-1 line-clamp-1">{p.name}</div>
                        <div className="text-xs text-[#0f3d2e]/60 mt-1">MOQ: {p.moq}</div>
                        <div className="flex gap-2 mt-3">
                          <Button onClick={() => setEditing(p)} size="sm" variant="outline" className="flex-1"><Edit3 className="w-3 h-3 mr-1" /> Edit</Button>
                          <Button onClick={() => deleteProduct(p.id)} size="sm" variant="outline" className="text-red-600"><Trash2 className="w-3 h-3" /></Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!editing || adding} onOpenChange={(o) => { if (!o) { setEditing(null); setAdding(false) } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader><DialogTitle className="font-display text-2xl">{editing ? 'Edit Product' : 'Add Product'}</DialogTitle></DialogHeader>
          <ProductForm initial={editing} onSave={saveProduct} onCancel={() => { setEditing(null); setAdding(false) }} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

const StatCard = ({ label, value, icon: Icon, color }) => (
  <Card className="bg-white border">
    <CardContent className="p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}><Icon className="w-6 h-6" style={{ color }} /></div>
      <div>
        <div className="text-3xl font-display font-semibold">{value}</div>
        <div className="text-xs uppercase tracking-widest text-[#0f3d2e]/60">{label}</div>
      </div>
    </CardContent>
  </Card>
)

const ProductForm = ({ initial, onSave, onCancel }) => {
  const [f, setF] = useState(initial || {
    name: '', category: 'Spices', description: '', images: [''], moq: '500 Kg', packaging: '25Kg PP bags',
    weight: ['25Kg'], shelfLife: '12 months', grade: 'Export Grade A', countries: ['UAE', 'USA', 'UK'],
    certifications: ['FSSAI', 'APEDA'], hsCode: '', nutrition: '', featured: false
  })
  const upd = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const updArr = (k) => (e) => setF({ ...f, [k]: e.target.value.split(',').map(x => x.trim()).filter(Boolean) })

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(f) }} className="space-y-3">
      <Input required placeholder="Product Name" value={f.name} onChange={upd('name')} />
      <select className="w-full border rounded-md h-10 px-3 bg-white" value={f.category} onChange={upd('category')}>
        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
      </select>
      <Textarea required placeholder="Description" rows={3} value={f.description} onChange={upd('description')} />
      <Input placeholder="Image URL" value={f.images?.[0] || ''} onChange={(e) => setF({ ...f, images: [e.target.value] })} />
      <div className="grid grid-cols-2 gap-3">
        <Input placeholder="MOQ" value={f.moq} onChange={upd('moq')} />
        <Input placeholder="Shelf Life" value={f.shelfLife} onChange={upd('shelfLife')} />
        <Input placeholder="Grade" value={f.grade} onChange={upd('grade')} />
        <Input placeholder="HS Code" value={f.hsCode} onChange={upd('hsCode')} />
      </div>
      <Input placeholder="Packaging" value={f.packaging} onChange={upd('packaging')} />
      <Input placeholder="Weight options (comma separated)" value={(f.weight || []).join(', ')} onChange={updArr('weight')} />
      <Input placeholder="Countries (comma separated)" value={(f.countries || []).join(', ')} onChange={updArr('countries')} />
      <Input placeholder="Certifications (comma separated)" value={(f.certifications || []).join(', ')} onChange={updArr('certifications')} />
      <Input placeholder="Nutrition info" value={f.nutrition} onChange={upd('nutrition')} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.featured} onChange={(e) => setF({ ...f, featured: e.target.checked })} /> Featured product</label>
      <div className="flex gap-2 pt-3">
        <Button type="submit" className="bg-[#0f3d2e] text-white flex-1">Save</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}

export default Admin
