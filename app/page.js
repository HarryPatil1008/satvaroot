'use client'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  Leaf, Globe2, Award, ShieldCheck, Truck, Sparkles, Search, ArrowRight, X,
  MessageCircle, Phone, Mail, MapPin, Send, Download, ChevronDown, Star,
  Package, Factory, Plane, BadgeCheck, ChevronRight, Menu
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'
import WorldMap from '@/components/WorldMap'

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'
const waLink = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`

const CATEGORIES = [
  'All', 'Turmeric Powder', 'Turmeric Fingers', 'Banana Chips', 'Flavoured Banana Chips',
  'Papad', 'Masala', 'Spices', 'Ayurvedic Products', 'Ashwagandha Powder',
  'Dry Snacks', 'Herbal Powders', 'Private Label Products'
]

const COUNTRIES = [
  { name: 'United Arab Emirates', flag: '🇦🇪', volume: '120+ shipments/yr' },
  { name: 'United States', flag: '🇺🇸', volume: '95+ shipments/yr' },
  { name: 'United Kingdom', flag: '🇬🇧', volume: '70+ shipments/yr' },
  { name: 'Canada', flag: '🇨🇦', volume: '55+ shipments/yr' },
  { name: 'Australia', flag: '🇦🇺', volume: '48+ shipments/yr' },
  { name: 'Germany', flag: '🇩🇪', volume: '40+ shipments/yr' },
  { name: 'Singapore', flag: '🇸🇬', volume: '38+ shipments/yr' },
  { name: 'Saudi Arabia', flag: '🇸🇦', volume: '60+ shipments/yr' }
]

const CERTS = [
  { name: 'IEC', desc: 'Import Export Code', icon: Globe2 },
  { name: 'FSSAI', desc: 'Food Safety & Standards', icon: ShieldCheck },
  { name: 'APEDA', desc: 'Agricultural Products Export', icon: Leaf },
  { name: 'GST', desc: 'Goods & Services Tax', icon: BadgeCheck },
  { name: 'MSME', desc: 'Registered Enterprise', icon: Award },
  { name: 'ISO 22000', desc: 'Food Safety Management', icon: ShieldCheck },
  { name: 'USDA Organic', desc: 'Organic Certification', icon: Leaf },
  { name: 'HACCP', desc: 'Hazard Analysis Control', icon: ShieldCheck }
]

const TESTIMONIALS = [
  { name: 'Ahmed Al Rashid', role: 'Importer, Dubai UAE', text: 'SatvaRoot has been our most trusted Indian supplier for 3 years. Consistent quality, on-time shipments and beautiful packaging.', rating: 5 },
  { name: 'Sarah Mitchell', role: 'Buyer, London UK', text: 'Their organic turmeric and ashwagandha quality is unmatched. Documentation is always perfect for European import standards.', rating: 5 },
  { name: 'Michael Chen', role: 'Distributor, Singapore', text: 'Premium banana chips and masalas. Their private label service helped us launch our own brand in 6 weeks.', rating: 5 }
]


const LANG_CONTENT = {
  nav: ['home','about','products','countries','certifications','contact'],
  blog: 'Blog',
  catalogue: 'Catalogue',
  sendEnquiry: 'Send Enquiry',
  premiumExporter: 'Premium Indian Exporter · 25+ Countries',
  heroTitle1: 'Pure',
  heroTitle2: 'Roots',
  heroTitle3: 'of India',
  heroTitle4: 'to the',
  heroTitle5: 'World',
  heroDesc: 'Trusted exporter of Turmeric, Ashwagandha, Spices, Banana Chips & Ayurvedic products. Farm-fresh sourcing. Lab-tested quality. International shipping.',
  exploreProducts: 'Explore Products',
  whatsappUs: 'WhatsApp Us'
}

const FAQS = [
  { q: 'What is the minimum order quantity (MOQ)?', a: 'MOQs vary by product — typically 100Kg for premium herbal powders, 200-500Kg for spices and snacks, and 1000Kg+ for bulk turmeric fingers. Private label MOQs start at 1000 units.' },
  { q: 'Which countries do you export to?', a: 'We currently export to 25+ countries including UAE, USA, UK, Canada, Australia, Germany, Singapore, Saudi Arabia, Netherlands, France, Japan, and more.' },
  { q: 'What certifications do your products carry?', a: 'All products are FSSAI, APEDA, ISO 22000 and IEC certified. Many products also carry HACCP, USDA Organic, India Organic, AYUSH and GMP certifications.' },
  { q: 'Do you offer private label and contract manufacturing?', a: 'Yes. We offer end-to-end private label services including formulation, custom packaging design, branding, and bulk manufacturing. MOQ from 1000 units.' },
  { q: 'What are your typical lead times?', a: 'Standard products: 7-15 days. Custom packaging / private label: 25-40 days. Sea freight delivery typically 18-35 days depending on destination.' },
  { q: 'Do you provide samples before bulk orders?', a: 'Yes — samples are available for serious buyers. Sample cost & courier are charged at actuals and adjusted in the first bulk PO.' }
]

const App = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQ, setSearchQ] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [enqOpen, setEnqOpen] = useState(false)
  const [catalogueOpen, setCatalogueOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const t = LANG_CONTENT

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(d => { setProducts(d.products || []); setLoading(false) }).catch(() => setLoading(false))

    if (!document.getElementById('google-translate-script')) {
      window.googleTranslateElementInit = () => {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: '',
            autoDisplay: false
          }, 'google_translate_element')
        }
      }
      const script = document.createElement('script')
      script.id = 'google-translate-script'
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  const filtered = useMemo(() => {
    return products.filter(p => {
      const catOk = activeCategory === 'All' || p.category === activeCategory
      const qOk = !searchQ || p.name.toLowerCase().includes(searchQ.toLowerCase()) || p.category.toLowerCase().includes(searchQ.toLowerCase())
      return catOk && qOk
    })
  }, [products, activeCategory, searchQ])

  const featured = products.filter(p => p.featured).slice(0, 6)

  return (
    <div className="min-h-screen bg-[#faf6ee] text-[#0f3d2e]">
      {/* ---------- NAV ---------- */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#062019]/85 border-b border-[#d4af37]/20">
        <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-[#d4af37] to-[#9c7a2a] shadow-lg shadow-[#d4af37]/30">
              <Leaf className="w-6 h-6 text-[#0f3d2e]" />
            </div>
            <div>
              <div className="font-display text-2xl font-semibold leading-none tracking-wide gold-text">SatvaRoot</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37]/80">Exports</div>
            </div>
          </a>
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-white/85">
            {['home','about','products','countries','certifications','contact'].map((s, i) => (
              <a key={s} href={`#${s}`} className="hover:text-[#d4af37] transition capitalize">{t.nav[i]}</a>
            ))}
            <Link href="/blog" className="hover:text-[#d4af37] transition">{t.blog}</Link>
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <Button asChild variant="outline" className="border-[#d4af37]/40 bg-transparent text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0f3d2e]">
              <Link href="/catalogue"><Download className="w-4 h-4 mr-2" /> {t.catalogue}</Link>
            </Button>
            <Button onClick={() => setEnqOpen(true)} className="bg-gradient-to-r from-[#d4af37] to-[#b08930] text-[#0f3d2e] hover:opacity-90 font-semibold">
              {t.sendEnquiry} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <button onClick={() => setMobileNavOpen(v => !v)} className="lg:hidden text-white p-2"><Menu /></button>
        </div>
        {mobileNavOpen && (
          <div className="lg:hidden bg-[#062019] border-t border-[#d4af37]/20 px-6 py-4 space-y-3 text-white">
            {['home','about','products','countries','certifications','contact'].map((s, i) => (
              <a key={s} onClick={() => setMobileNavOpen(false)} href={`#${s}`} className="block capitalize py-1">{t.nav[i]}</a>
            ))}
            <Link onClick={() => setMobileNavOpen(false)} href="/blog" className="block py-1">{t.blog}</Link>
            <Link onClick={() => setMobileNavOpen(false)} href="/catalogue" className="block py-1">{t.catalogue}</Link>
            <Button onClick={() => { setEnqOpen(true); setMobileNavOpen(false) }} className="w-full bg-[#d4af37] text-[#0f3d2e] font-semibold">{t.sendEnquiry}</Button>
          </div>
        )}
      </nav>

      {/* ---------- HERO ---------- */}
      <section id="home" className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 hero-gradient overflow-hidden">
        <div className="absolute inset-0 world-dots opacity-50" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl float-anim" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl float-anim" style={{ animationDelay: '1.5s' }} />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <span className="text-xs uppercase tracking-[0.2em] text-[#d4af37]">{t.premiumExporter}</span>
              </div>
              <h1 className="font-display text-5xl lg:text-7xl leading-[1.05] text-white mb-6">
                {t.heroTitle1} <span className="gold-text">{t.heroTitle2}</span> {t.heroTitle3}<br />
                {t.heroTitle4} <span className="gold-text">{t.heroTitle5}</span>
              </h1>
              <p className="text-white/75 text-lg lg:text-xl mb-8 max-w-xl leading-relaxed">
                {t.heroDesc}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-[#d4af37] to-[#b08930] text-[#0f3d2e] hover:opacity-90 font-semibold h-12 px-7 shine">
                  <a href="#products">{t.exploreProducts} <ArrowRight className="w-5 h-5 ml-2" /></a>
                </Button>
                <Button onClick={() => setEnqOpen(true)} size="lg" variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white hover:text-[#0f3d2e] h-12 px-7">
                  <Send className="w-4 h-4 mr-2" /> {t.sendEnquiry}
                </Button>
                <Button asChild size="lg" className="bg-[#25d366] hover:bg-[#1fb955] text-white h-12 px-7 font-semibold">
                  <a href={waLink('Hello SatvaRoot, I would like to know more about your export products.')} target="_blank" rel="noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" /> {t.whatsappUs}
                  </a>
                </Button>
              </div>
              <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
                {[['25+', 'Countries'], ['500+', 'Products'], ['12+', 'Certifications']].map(([n, l]) => (
                  <div key={l}>
                    <div className="font-display text-3xl lg:text-4xl gold-text font-semibold">{n}</div>
                    <div className="text-xs uppercase tracking-widest text-white/60 mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative fade-in hidden lg:block">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden glass p-2">
                <img src="https://images.unsplash.com/photo-1523112784166-c04db3a3bb7c?crop=entropy&cs=srgb&fm=jpg&w=900&q=85" alt="Premium Indian turmeric exports" className="w-full h-full object-cover rounded-xl" />
                <div className="absolute -bottom-6 -left-6 glass-light rounded-xl p-5 shadow-2xl max-w-[240px]">
                  <div className="flex items-center gap-3 mb-2">
                    <BadgeCheck className="w-6 h-6 text-[#0f3d2e]" />
                    <div className="text-sm font-semibold">Lab-Tested Quality</div>
                  </div>
                  <div className="text-xs text-[#0f3d2e]/70">FSSAI · APEDA · ISO 22000 · USDA Organic</div>
                </div>
                <div className="absolute -top-6 -right-6 glass-light rounded-xl p-4 shadow-2xl">
                  <div className="flex items-center gap-2"><Plane className="w-5 h-5 text-[#0f3d2e]" /><span className="text-sm font-semibold">Global Shipping</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- TRUST BAR ---------- */}
      <section className="py-8 bg-[#0f3d2e] border-y border-[#d4af37]/15">
        <div className="container mx-auto px-4 lg:px-8 flex flex-wrap items-center justify-around gap-6 text-white/80">
          {[['IEC', 'Import-Export Code'], ['FSSAI', 'Food Safety'], ['APEDA', 'Agri Export Authority'], ['ISO 22000', 'Food Mgmt'], ['USDA', 'Organic'], ['HACCP', 'Compliance']].map(([t, s]) => (
            <div key={t} className="flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-[#d4af37]" />
              <div><div className="text-sm font-semibold text-white">{t}</div><div className="text-[10px] uppercase tracking-wider text-white/50">{s}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- ABOUT ---------- */}
      <section id="about" className="py-24 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?crop=entropy&cs=srgb&fm=jpg&w=600&q=85" className="rounded-2xl aspect-square object-cover" alt="Organic farms" />
              <img src="https://images.unsplash.com/photo-1678182451047-196f22a4143e?crop=entropy&cs=srgb&fm=jpg&w=600&q=85" className="rounded-2xl aspect-square object-cover mt-8" alt="Global shipping" />
              <img src="https://images.unsplash.com/photo-1602169417305-a9de0b6434e2?crop=entropy&cs=srgb&fm=jpg&w=600&q=85" className="rounded-2xl aspect-square object-cover" alt="Premium spices" />
              <img src="https://images.pexels.com/photos/35531300/pexels-photo-35531300.jpeg?auto=compress&cs=tinysrgb&w=600" className="rounded-2xl aspect-square object-cover mt-8" alt="Export packaging" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-[#9c7a2a] mb-3">About SatvaRoot</div>
              <h2 className="font-display text-4xl lg:text-5xl leading-tight mb-6">From <span className="text-[#d4af37]">Indian Soil</span><br />to the World&apos;s Table</h2>
              <p className="text-[#0f3d2e]/75 text-lg leading-relaxed mb-8">
                SatvaRoot Exports is a premier exporter of farm-fresh Indian agricultural,
                herbal & ayurvedic products. We partner directly with certified organic
                farmers across Erode, Sangli, Kerala, Rajasthan and Karnataka to deliver
                authentic, lab-tested quality to global buyers.
              </p>
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  { icon: Leaf, title: 'Direct Farm Sourcing', desc: 'No middlemen. Fair pricing. Pure traceability from farm to port.' },
                  { icon: ShieldCheck, title: 'Quality Assurance', desc: 'Every batch tested at NABL labs for purity & active compounds.' },
                  { icon: Package, title: 'Premium Packaging', desc: 'Export-grade, food-safe, customized for international buyers.' },
                  { icon: Plane, title: 'Global Shipping', desc: 'FOB / CIF / DDP. Sea & air freight. End-to-end documentation.' }
                ].map(({ icon: Ic, title, desc }) => (
                  <div key={title} className="flex gap-3">
                    <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 flex items-center justify-center flex-shrink-0">
                      <Ic className="w-5 h-5 text-[#9c7a2a]" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">{title}</div>
                      <div className="text-sm text-[#0f3d2e]/70">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- WHY CHOOSE US ---------- */}
      <section className="py-20 bg-gradient-to-br from-[#0f3d2e] to-[#1a5740] text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <div className="text-xs uppercase tracking-[0.3em] text-[#d4af37] mb-3">Why Choose Us</div>
            <h2 className="font-display text-4xl lg:text-5xl">Built for <span className="gold-text">Global Buyers</span></h2>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-5">
            {[
              { icon: Leaf, t: 'Farm-Fresh' },
              { icon: ShieldCheck, t: 'Lab-Tested' },
              { icon: Award, t: 'Certified' },
              { icon: Truck, t: 'On-Time Delivery' },
              { icon: Globe2, t: 'Worldwide Shipping' },
              { icon: Factory, t: 'Private Label' }
            ].map(({ icon: Ic, t }) => (
              <div key={t} className="glass rounded-xl p-5 text-center hover:bg-white/10 transition">
                <Ic className="w-7 h-7 text-[#d4af37] mx-auto mb-3" />
                <div className="text-sm font-semibold">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- PRODUCTS ---------- */}
      <section id="products" className="py-24 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-[0.3em] text-[#9c7a2a] mb-3">Our Catalogue</div>
            <h2 className="font-display text-4xl lg:text-5xl mb-4">Premium <span className="text-[#d4af37]">Export Products</span></h2>
            <p className="text-[#0f3d2e]/70 max-w-2xl mx-auto">Handpicked, lab-tested, and globally trusted. Browse by category or search.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0f3d2e]/40" />
              <Input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search products..." className="pl-10 h-11 bg-white border-[#0f3d2e]/15" />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setActiveCategory(c)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition border ${
                    activeCategory === c
                      ? 'bg-[#0f3d2e] text-white border-[#0f3d2e]'
                      : 'bg-white text-[#0f3d2e] border-[#0f3d2e]/15 hover:border-[#d4af37]'
                  }`}>{c}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <div key={i} className="bg-white rounded-2xl aspect-[3/4] animate-pulse" />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(p => (
                <Card key={p.id} className="product-card overflow-hidden border-[#0f3d2e]/10 cursor-pointer bg-white" onClick={() => setSelectedProduct(p)}>
                  <div className="relative aspect-square overflow-hidden bg-[#faf6ee]">
                    <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    {p.featured && <Badge className="absolute top-3 left-3 bg-[#d4af37] text-[#0f3d2e] hover:bg-[#d4af37]"><Star className="w-3 h-3 mr-1 fill-current" /> Featured</Badge>}
                    <div className="absolute top-3 right-3"><Badge variant="outline" className="bg-white/90 backdrop-blur border-0 text-xs">{p.grade}</Badge></div>
                  </div>
                  <CardContent className="p-5">
                    <div className="text-[10px] uppercase tracking-widest text-[#9c7a2a] mb-1">{p.category}</div>
                    <h3 className="font-display text-xl font-semibold leading-tight mb-2 line-clamp-2 min-h-[3.5rem]">{p.name}</h3>
                    <div className="flex items-center justify-between text-xs text-[#0f3d2e]/60 mb-4">
                      <span><Package className="inline w-3 h-3 mr-1" /> MOQ: {p.moq}</span>
                      <span><Globe2 className="inline w-3 h-3 mr-1" /> {p.countries?.length || 0}+</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-[#0f3d2e] text-white hover:bg-[#0f3d2e]/90">View Details</Button>
                      <Button size="sm" asChild className="bg-[#25d366] hover:bg-[#1fb955] text-white px-3" onClick={e => e.stopPropagation()}>
                        <a href={waLink(`Hi SatvaRoot, I am interested in ${p.name}. Please share details.`)} target="_blank" rel="noreferrer">
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-20 text-[#0f3d2e]/60">No products found. Try a different category or search.</div>
          )}
        </div>
      </section>

      {/* ---------- COUNTRIES ---------- */}
      <section id="countries" className="py-24 bg-gradient-to-br from-[#0f3d2e] via-[#0a2e22] to-[#062019] text-white relative overflow-hidden">
        <div className="absolute inset-0 world-dots opacity-30" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="text-center mb-14">
            <div className="text-xs uppercase tracking-[0.3em] text-[#d4af37] mb-3">Global Reach</div>
            <h2 className="font-display text-4xl lg:text-5xl mb-4">Exporting to <span className="gold-text">25+ Countries</span></h2>
            <p className="text-white/70 max-w-2xl mx-auto">From the spice fields of India to kitchens, wellness stores, and distributors across the globe.</p>
          </div>
          <div className="mb-12"><WorldMap /></div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {COUNTRIES.map(c => (
              <div key={c.name} className="glass rounded-xl p-5 hover:scale-105 transition">
                <div className="text-4xl mb-2">{c.flag}</div>
                <div className="font-semibold mb-1">{c.name}</div>
                <div className="text-xs text-[#d4af37]">{c.volume}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CERTIFICATIONS ---------- */}
      <section id="certifications" className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <div className="text-xs uppercase tracking-[0.3em] text-[#9c7a2a] mb-3">Trusted & Verified</div>
            <h2 className="font-display text-4xl lg:text-5xl">Our <span className="text-[#d4af37]">Certifications</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {CERTS.map(c => (
              <div key={c.name} className="bg-white border border-[#0f3d2e]/10 rounded-2xl p-6 text-center hover:shadow-xl hover:border-[#d4af37]/40 transition">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#d4af37] to-[#9c7a2a] mx-auto flex items-center justify-center mb-4">
                  <c.icon className="w-7 h-7 text-white" />
                </div>
                <div className="font-display text-xl font-semibold">{c.name}</div>
                <div className="text-xs text-[#0f3d2e]/60 mt-1">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- TESTIMONIALS ---------- */}
      <section id="testimonials" className="py-24 bg-[#faf2e0]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <div className="text-xs uppercase tracking-[0.3em] text-[#9c7a2a] mb-3">What Buyers Say</div>
            <h2 className="font-display text-4xl lg:text-5xl">Trusted by <span className="text-[#d4af37]">Global Buyers</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <Card key={t.name} className="border-[#0f3d2e]/10 bg-white">
                <CardContent className="p-7">
                  <div className="flex gap-1 mb-4">{Array(t.rating).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />)}</div>
                  <p className="text-[#0f3d2e]/80 mb-6 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#d4af37] to-[#9c7a2a] flex items-center justify-center text-white font-semibold">{t.name[0]}</div>
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-[#0f3d2e]/60">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- PRIVATE LABEL CTA ---------- */}
      <section className="py-24 bg-[#0f3d2e] text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-[#d4af37] mb-3">Private Label & OEM</div>
              <h2 className="font-display text-4xl lg:text-5xl mb-6">Launch Your Own <span className="gold-text">Premium Brand</span></h2>
              <p className="text-white/75 text-lg leading-relaxed mb-8">From formulation to packaging design, we provide end-to-end private label manufacturing — perfect for retailers, e-commerce brands and distributors.</p>
              <ul className="space-y-3 mb-8">
                {['Low MOQ — start from 1000 units', 'Custom packaging & branding', 'Recipe formulation support', 'Ship-ready in 25-40 days'].map(x => (
                  <li key={x} className="flex items-center gap-3"><BadgeCheck className="w-5 h-5 text-[#d4af37]" /><span>{x}</span></li>
                ))}
              </ul>
              <Button onClick={() => setEnqOpen(true)} size="lg" className="bg-[#d4af37] hover:bg-[#b08930] text-[#0f3d2e] font-semibold">Request a Quote <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </div>
            <div>
              <img src="https://images.pexels.com/photos/35531300/pexels-photo-35531300.jpeg?auto=compress&cs=tinysrgb&w=900" className="rounded-2xl shadow-2xl" alt="Private Label" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-[0.3em] text-[#9c7a2a] mb-3">FAQ</div>
            <h2 className="font-display text-4xl lg:text-5xl">Frequently Asked</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-white border border-[#0f3d2e]/10 rounded-xl px-5">
                <AccordionTrigger className="hover:no-underline text-left font-semibold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-[#0f3d2e]/75 leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ---------- CONTACT ---------- */}
      <section id="contact" className="py-24 bg-[#062019] text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-[#d4af37] mb-3">Get in Touch</div>
              <h2 className="font-display text-4xl lg:text-5xl mb-6">Let&apos;s Start Your <span className="gold-text">Export Journey</span></h2>
              <p className="text-white/75 mb-10 text-lg">Have a buying enquiry, a private label idea, or want a custom catalogue? Talk to our export desk.</p>
              <div className="space-y-5">
                {[
                  { icon: MapPin, label: 'Head Office', value: 'Plot 14, Industrial Estate, Surat, Gujarat 395001, India' },
                  { icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
                  { icon: Mail, label: 'Email', value: 'exports@satvaroot.com', href: 'mailto:exports@satvaroot.com' },
                  { icon: MessageCircle, label: 'WhatsApp', value: '+91 98765 43210', href: waLink('Hi SatvaRoot, I would like to discuss an export enquiry.') }
                ].map(({ icon: Ic, label, value, href }) => (
                  <a key={label} href={href || '#'} target={href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="flex gap-4 group">
                    <div className="w-12 h-12 rounded-lg bg-[#d4af37]/15 flex items-center justify-center group-hover:bg-[#d4af37]/30 transition flex-shrink-0">
                      <Ic className="w-5 h-5 text-[#d4af37]" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-widest text-[#d4af37]/80 mb-1">{label}</div>
                      <div className="text-white">{value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <EnquiryForm onSuccess={() => toast.success('Enquiry sent! Our export team will contact you within 24 hours.')} />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="bg-[#031411] text-white/70 py-14 border-t border-[#d4af37]/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#9c7a2a] flex items-center justify-center"><Leaf className="w-5 h-5 text-[#062019]" /></div>
                <div className="font-display text-2xl gold-text">SatvaRoot</div>
              </div>
              <p className="text-sm leading-relaxed">Pure roots of India to the world. Premium exports of turmeric, spices, herbal & ayurvedic products.</p>
              <form className="mt-5 flex gap-2" onSubmit={async (e) => {
                e.preventDefault()
                const email = e.target.email.value
                const r = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
                if (r.ok) { toast.success('Subscribed!'); e.target.reset() }
              }}>
                <Input name="email" type="email" required placeholder="Newsletter email" className="bg-white/5 border-white/10 text-white placeholder:text-white/40" />
                <Button type="submit" size="icon" className="bg-[#d4af37] text-[#0f3d2e] hover:bg-[#b08930]"><Send className="w-4 h-4" /></Button>
              </form>
            </div>
            <FooterCol title="Quick Links" items={[['Home', '/'], ['About', '#about'], ['Products', '#products'], ['Blog', '/blog'], ['Catalogue', '/catalogue'], ['Contact', '#contact'], ['Admin', '/admin']]} />
            <FooterCol title="Categories" items={CATEGORIES.slice(1, 7).map(c => [c, '#products'])} />
            <FooterCol title="Export Countries" items={COUNTRIES.slice(0, 6).map(c => [`${c.flag} ${c.name}`, '#countries'])} />
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>© {new Date().getFullYear()} SatvaRoot Exports. All rights reserved.</div>
            <div className="flex gap-4"><a href="#" className="hover:text-[#d4af37]">Privacy</a><a href="#" className="hover:text-[#d4af37]">Terms</a><a href="/admin" className="hover:text-[#d4af37]">Admin</a></div>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-6 left-6 z-40 hidden md:block bg-white/95 rounded-lg shadow-lg border border-[#0f3d2e]/15 px-3 py-2">
        <div className="text-[10px] uppercase tracking-wider text-[#0f3d2e]/60 mb-1">Translate</div>
        <div id="google_translate_element" className="text-xs" />
      </div>

      {/* ---------- FLOATING WHATSAPP ---------- */}
      <a href={waLink('Hi SatvaRoot, I am interested in your export products.')} target="_blank" rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25d366] flex items-center justify-center shadow-2xl pulse-ring hover:scale-110 transition">
        <MessageCircle className="w-7 h-7 text-white fill-white" />
      </a>

      {/* ---------- PRODUCT MODAL ---------- */}
      <Dialog open={!!selectedProduct} onOpenChange={(o) => !o && setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white">
          {selectedProduct && (
            <div className="grid md:grid-cols-2 gap-0">
              <div className="bg-[#faf6ee] aspect-square md:aspect-auto">
                <img src={selectedProduct.images?.[0]} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-7">
                <div className="text-xs uppercase tracking-widest text-[#9c7a2a] mb-2">{selectedProduct.category}</div>
                <h3 className="font-display text-3xl font-semibold mb-3 leading-tight">{selectedProduct.name}</h3>
                <p className="text-[#0f3d2e]/75 text-sm leading-relaxed mb-5">{selectedProduct.description}</p>
                <div className="space-y-3 mb-6 text-sm">
                  <Row label="MOQ" value={selectedProduct.moq} />
                  <Row label="Packaging" value={selectedProduct.packaging} />
                  <Row label="Weight Options" value={(selectedProduct.weight || []).join(', ')} />
                  <Row label="Shelf Life" value={selectedProduct.shelfLife} />
                  <Row label="Grade" value={selectedProduct.grade} />
                  <Row label="HS Code" value={selectedProduct.hsCode} />
                  <Row label="Nutrition" value={selectedProduct.nutrition} />
                </div>
                <div className="mb-5">
                  <div className="text-xs uppercase tracking-widest text-[#9c7a2a] mb-2">Available In</div>
                  <div className="flex flex-wrap gap-1.5">{(selectedProduct.countries || []).map(c => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}</div>
                </div>
                <div className="mb-6">
                  <div className="text-xs uppercase tracking-widest text-[#9c7a2a] mb-2">Certifications</div>
                  <div className="flex flex-wrap gap-1.5">{(selectedProduct.certifications || []).map(c => <Badge key={c} className="bg-[#0f3d2e] text-[10px]">{c}</Badge>)}</div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={() => { setEnqOpen(true) }} className="bg-[#0f3d2e] text-white flex-1"><Send className="w-4 h-4 mr-2" /> Send Enquiry</Button>
                  <Button asChild className="bg-[#25d366] hover:bg-[#1fb955] text-white flex-1">
                    <a href={waLink(`Hi SatvaRoot, I am interested in ${selectedProduct.name} (MOQ: ${selectedProduct.moq}). Please share quote and details.`)} target="_blank" rel="noreferrer">
                      <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ---------- ENQUIRY MODAL ---------- */}
      <Dialog open={enqOpen} onOpenChange={setEnqOpen}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl">Send Buyer Enquiry</DialogTitle>
            <p className="text-sm text-[#0f3d2e]/60">Our export desk responds within 24 hours.</p>
          </DialogHeader>
          <EnquiryForm dark={false} onSuccess={() => { toast.success('Enquiry sent successfully!'); setEnqOpen(false) }} preProduct={selectedProduct?.name} />
        </DialogContent>
      </Dialog>

      {/* ---------- CATALOGUE MODAL ---------- */}
      <Dialog open={catalogueOpen} onOpenChange={setCatalogueOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader><DialogTitle className="font-display text-2xl">Request Full Catalogue</DialogTitle></DialogHeader>
          <CatalogueForm onClose={() => setCatalogueOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

const Row = ({ label, value }) => value ? (
  <div className="flex gap-3"><div className="text-[10px] uppercase tracking-widest text-[#9c7a2a] w-24 flex-shrink-0 pt-0.5">{label}</div><div className="text-[#0f3d2e]/80 flex-1">{value}</div></div>
) : null

const FooterCol = ({ title, items }) => (
  <div>
    <div className="text-sm font-semibold text-white mb-4 uppercase tracking-widest">{title}</div>
    <ul className="space-y-2 text-sm">{items.map(([t, h]) => <li key={t}><a href={h} className="hover:text-[#d4af37] transition">{t}</a></li>)}</ul>
  </div>
)

const EnquiryForm = ({ onSuccess, preProduct, dark = true }) => {
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', company: '', country: '', email: '', phone: '', whatsapp: '', product: preProduct || '', quantity: '', message: '' })
  useEffect(() => { if (preProduct) setForm(f => ({ ...f, product: preProduct })) }, [preProduct])
  const upd = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))
  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email) { toast.error('Name and email are required'); return }
    setSubmitting(true)
    try {
      const r = await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (r.ok) { onSuccess?.(); setForm({ name: '', company: '', country: '', email: '', phone: '', whatsapp: '', product: '', quantity: '', message: '' }) }
      else toast.error('Failed to send enquiry')
    } catch { toast.error('Network error') }
    setSubmitting(false)
  }
  const cls = dark
    ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40'
    : 'bg-white border-[#0f3d2e]/15 text-[#0f3d2e]'
  return (
    <form onSubmit={submit} className={dark ? 'glass rounded-2xl p-6 lg:p-8' : ''}>
      <div className="grid sm:grid-cols-2 gap-3">
        <Input className={cls} required placeholder="Your Name *" value={form.name} onChange={upd('name')} />
        <Input className={cls} placeholder="Company Name" value={form.company} onChange={upd('company')} />
        <Input className={cls} placeholder="Country" value={form.country} onChange={upd('country')} />
        <Input className={cls} required type="email" placeholder="Email *" value={form.email} onChange={upd('email')} />
        <Input className={cls} placeholder="Phone" value={form.phone} onChange={upd('phone')} />
        <Input className={cls} placeholder="WhatsApp" value={form.whatsapp} onChange={upd('whatsapp')} />
        <Input className={cls} placeholder="Product Interested" value={form.product} onChange={upd('product')} />
        <Input className={cls} placeholder="Quantity Required" value={form.quantity} onChange={upd('quantity')} />
      </div>
      <Textarea className={`${cls} mt-3`} rows={4} placeholder="Your message..." value={form.message} onChange={upd('message')} />
      <Button type="submit" disabled={submitting} className="w-full mt-4 bg-gradient-to-r from-[#d4af37] to-[#b08930] text-[#0f3d2e] hover:opacity-90 font-semibold h-12">
        {submitting ? 'Sending...' : (<><Send className="w-4 h-4 mr-2" /> Send Enquiry</>)}
      </Button>
    </form>
  )
}

const CatalogueForm = ({ onClose }) => {
  const [submitting, setSubmitting] = useState(false)
  return (
    <form onSubmit={async (e) => {
      e.preventDefault()
      setSubmitting(true)
      const data = Object.fromEntries(new FormData(e.target))
      data.product = 'Catalogue Request'
      data.message = 'Please send me the full product catalogue.'
      const r = await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      setSubmitting(false)
      if (r.ok) { toast.success('Catalogue request sent! Check your email.'); onClose?.() }
    }} className="space-y-3">
      <Input name="name" required placeholder="Your Name *" />
      <Input name="email" required type="email" placeholder="Business Email *" />
      <Input name="company" placeholder="Company" />
      <Input name="country" placeholder="Country" />
      <Button disabled={submitting} type="submit" className="w-full bg-[#0f3d2e] text-white">
        <Download className="w-4 h-4 mr-2" /> {submitting ? 'Requesting...' : 'Request Catalogue'}
      </Button>
    </form>
  )
}

export default App
