'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Leaf, ArrowRight, Calendar, Clock, ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blogs').then(r => r.json()).then(d => { setBlogs(d.blogs || []); setLoading(false) })
  }, [])

  return (
    <div className="min-h-screen bg-[#faf6ee]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#062019]/90 border-b border-[#d4af37]/20">
        <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-[#d4af37] to-[#9c7a2a] shadow-lg shadow-[#d4af37]/30">
              <Leaf className="w-6 h-6 text-[#0f3d2e]" />
            </div>
            <div>
              <div className="font-display text-2xl font-semibold leading-none gold-text">SatvaRoot</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37]/80">Exports</div>
            </div>
          </Link>
          <Button asChild variant="ghost" className="text-white hover:bg-white/10"><Link href="/"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Home</Link></Button>
        </div>
      </nav>

      {/* Header */}
      <section className="py-20 lg:py-28 hero-gradient text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 world-dots opacity-40" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="text-xs uppercase tracking-[0.3em] text-[#d4af37] mb-3">Insights & Trends</div>
          <h1 className="font-display text-5xl lg:text-6xl mb-4">The <span className="gold-text">Export Journal</span></h1>
          <p className="max-w-2xl mx-auto text-white/75 text-lg">Industry trends, buyer insights & export know-how from our desk to yours.</p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-2xl aspect-[4/5] animate-pulse" />)}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map(b => (
                <Link key={b.id} href={`/blog/${b.slug}`}>
                  <Card className="product-card overflow-hidden border-[#0f3d2e]/10 bg-white h-full cursor-pointer">
                    <div className="aspect-[16/10] overflow-hidden bg-[#faf6ee]">
                      <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover" />
                    </div>
                    <CardContent className="p-5">
                      <div className="flex flex-wrap gap-1.5 mb-3">{(b.tags || []).slice(0, 3).map(t => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}</div>
                      <h3 className="font-display text-xl font-semibold leading-tight mb-2 line-clamp-2">{b.title}</h3>
                      <p className="text-sm text-[#0f3d2e]/70 line-clamp-3 mb-4">{b.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-[#0f3d2e]/50">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(b.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span className="flex items-center gap-1 text-[#9c7a2a] font-medium">Read <ArrowRight className="w-3 h-3" /></span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
          {!loading && blogs.length === 0 && <div className="text-center py-20 text-[#0f3d2e]/60">No blog posts yet. Check back soon.</div>}
        </div>
      </section>

      <footer className="bg-[#031411] text-white/70 py-10 text-center text-sm">
        <div>© {new Date().getFullYear()} SatvaRoot Exports. All rights reserved.</div>
      </footer>
    </div>
  )
}
export default BlogsPage
