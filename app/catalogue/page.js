'use client'
import { useEffect, useState } from 'react'
import { Leaf, Printer, Download, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Catalogue = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(d => { setProducts(d.products || []); setLoading(false) })
  }, [])

  useEffect(() => { if (typeof document !== 'undefined') document.title = 'SatvaRoot Exports — Product Catalogue 2025' }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#0f3d2e]/60">Loading catalogue...</div>

  return (
    <div className="bg-white min-h-screen text-[#0f3d2e]">
      {/* Toolbar (hidden on print) */}
      <div className="print:hidden sticky top-0 z-50 bg-[#0f3d2e] text-white py-3">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm hover:text-[#d4af37]"><ArrowLeft className="w-4 h-4" /> Back to Site</Link>
          <div className="flex gap-2">
            <Button onClick={() => window.print()} className="bg-[#d4af37] hover:bg-[#b08930] text-[#0f3d2e] font-semibold">
              <Download className="w-4 h-4 mr-2" /> Save as PDF / Print
            </Button>
          </div>
        </div>
      </div>

      {/* Cover */}
      <section className="relative min-h-[100vh] flex items-center justify-center hero-gradient text-white overflow-hidden print:min-h-[98vh]" style={{ pageBreakAfter: 'always' }}>
        <div className="absolute inset-0 world-dots opacity-40" />
        <div className="relative text-center px-8">
          <div className="w-20 h-20 rounded-full mx-auto bg-gradient-to-br from-[#d4af37] to-[#9c7a2a] flex items-center justify-center mb-8 shadow-2xl">
            <Leaf className="w-10 h-10 text-[#0f3d2e]" />
          </div>
          <div className="font-display text-4xl gold-text mb-3">SatvaRoot Exports</div>
          <div className="text-xs uppercase tracking-[0.4em] text-[#d4af37] mb-12">Pure Roots of India to the World</div>
          <h1 className="font-display text-6xl lg:text-7xl mb-6">Product <span className="gold-text">Catalogue</span></h1>
          <div className="text-xl text-white/75 mb-16">2025 International Edition</div>
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <Stat n="25+" l="Countries" />
            <Stat n={`${products.length}+`} l="Products" />
            <Stat n="12+" l="Certifications" />
          </div>
          <div className="mt-16 text-sm text-white/60">
            <div>exports@satvaroot.com · +91 98765 43210</div>
            <div className="mt-1">www.satvaroot.com</div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="container mx-auto px-8 py-16 max-w-5xl print:py-10" style={{ pageBreakAfter: 'always' }}>
        <div className="text-xs uppercase tracking-[0.3em] text-[#9c7a2a] mb-3">About Us</div>
        <h2 className="font-display text-5xl mb-8">From <span className="text-[#d4af37]">Indian Soil</span> to the World’s Table</h2>
        <p className="text-lg leading-relaxed text-[#0f3d2e]/80 mb-10">
          SatvaRoot Exports is a premier exporter of farm-fresh Indian agricultural, herbal &amp; ayurvedic products. 
          We partner directly with certified organic farmers across Erode, Sangli, Kerala, Rajasthan and Karnataka 
          to deliver authentic, lab-tested quality to global buyers across 25+ countries.
        </p>
        <div className="grid grid-cols-2 gap-8 mb-10">
          {[
            ['Farm-Direct Sourcing', 'No middlemen. Full traceability from farm to port.'],
            ['Lab-Tested Quality', 'NABL-accredited testing for purity & active compounds.'],
            ['Premium Packaging', 'Export-grade food-safe packaging, customizable.'],
            ['Global Shipping', 'FOB / CIF / DDP. Sea & air freight worldwide.']
          ].map(([t, d]) => (
            <div key={t} className="border-l-4 border-[#d4af37] pl-5">
              <div className="font-display text-2xl font-semibold mb-1">{t}</div>
              <div className="text-sm text-[#0f3d2e]/70">{d}</div>
            </div>
          ))}
        </div>
        <div className="bg-[#faf2e0] rounded-2xl p-8">
          <div className="text-xs uppercase tracking-[0.3em] text-[#9c7a2a] mb-2">Certifications</div>
          <div className="flex flex-wrap gap-2 text-sm">
            {['IEC', 'FSSAI', 'APEDA', 'GST', 'MSME', 'ISO 22000', 'USDA Organic', 'HACCP', 'India Organic', 'AYUSH GMP'].map(c => (
              <span key={c} className="px-3 py-1.5 bg-white rounded-full border font-medium">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="container mx-auto px-8 py-16 max-w-5xl print:py-10">
        <div className="text-xs uppercase tracking-[0.3em] text-[#9c7a2a] mb-3 text-center">Our Catalogue</div>
        <h2 className="font-display text-5xl text-center mb-14">Premium <span className="text-[#d4af37]">Export Products</span></h2>
        <div className="space-y-12">
          {products.map((p, idx) => (
            <div key={p.id} className={`grid grid-cols-5 gap-8 ${idx > 0 && idx % 2 === 0 ? 'print:break-before-page' : ''}`}>
              <div className="col-span-2">
                <img src={p.images?.[0]} alt={p.name} className="w-full aspect-square object-cover rounded-xl" />
              </div>
              <div className="col-span-3">
                <div className="text-[10px] uppercase tracking-widest text-[#9c7a2a] mb-1">{p.category}</div>
                <h3 className="font-display text-2xl font-semibold mb-3 leading-tight">{p.name}</h3>
                <p className="text-sm text-[#0f3d2e]/75 mb-4 leading-relaxed">{p.description}</p>
                <table className="w-full text-xs">
                  <tbody className="[&_tr]:border-b [&_tr:last-child]:border-b-0 [&_td]:py-2">
                    <Row label="MOQ" v={p.moq} />
                    <Row label="Packaging" v={p.packaging} />
                    <Row label="Weight Options" v={(p.weight || []).join(', ')} />
                    <Row label="Shelf Life" v={p.shelfLife} />
                    <Row label="Grade" v={p.grade} />
                    <Row label="HS Code" v={p.hsCode} />
                    <Row label="Certifications" v={(p.certifications || []).join(', ')} />
                    <Row label="Countries" v={(p.countries || []).join(', ')} />
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Back Cover */}
      <section className="hero-gradient text-white py-24 text-center print:break-before-page">
        <div className="container mx-auto px-8 max-w-3xl">
          <h2 className="font-display text-5xl mb-6">Let’s Start Your <span className="gold-text">Export Journey</span></h2>
          <p className="text-lg text-white/80 mb-10">Our export desk responds within 24 hours.</p>
          <div className="grid grid-cols-3 gap-6 text-left">
            <Contact label="Email" v="exports@satvaroot.com" />
            <Contact label="Phone / WhatsApp" v="+91 98765 43210" />
            <Contact label="Website" v="www.satvaroot.com" />
          </div>
          <div className="mt-16 text-xs text-white/50 uppercase tracking-[0.3em]">© {new Date().getFullYear()} SatvaRoot Exports · All rights reserved</div>
        </div>
      </section>

      <style jsx global>{`
        @media print {
          @page { size: A4; margin: 12mm; }
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>
    </div>
  )
}

const Stat = ({ n, l }) => (
  <div><div className="font-display text-4xl gold-text">{n}</div><div className="text-xs uppercase tracking-widest text-white/60 mt-1">{l}</div></div>
)
const Row = ({ label, v }) => v ? (
  <tr><td className="text-[#9c7a2a] uppercase tracking-widest text-[10px] w-32">{label}</td><td className="text-[#0f3d2e]/85">{v}</td></tr>
) : null
const Contact = ({ label, v }) => (
  <div className="glass rounded-xl p-5"><div className="text-[10px] uppercase tracking-widest text-[#d4af37] mb-1">{label}</div><div className="font-semibold">{v}</div></div>
)

export default Catalogue
