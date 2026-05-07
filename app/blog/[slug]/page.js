'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Leaf, Calendar, User, ArrowLeft, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const renderMarkdown = (md) => {
  if (!md) return ''
  return md
    .split(/\n\n+/)
    .map(block => {
      if (block.startsWith('## ')) return `<h2 class="font-display text-3xl font-semibold mt-10 mb-4 text-[#0f3d2e]">${block.slice(3)}</h2>`
      if (block.startsWith('# ')) return `<h1 class="font-display text-4xl font-semibold mt-10 mb-4 text-[#0f3d2e]">${block.slice(2)}</h1>`
      if (/^\d+\.\s/.test(block)) {
        const items = block.split('\n').map(l => l.replace(/^\d+\.\s/, '')).map(l => `<li class="mb-2">${inline(l)}</li>`).join('')
        return `<ol class="list-decimal ml-6 my-4 text-[#0f3d2e]/85">${items}</ol>`
      }
      if (/^-\s/.test(block)) {
        const items = block.split('\n').map(l => l.replace(/^-\s/, '')).map(l => `<li class="mb-2">${inline(l)}</li>`).join('')
        return `<ul class="list-disc ml-6 my-4 text-[#0f3d2e]/85">${items}</ul>`
      }
      return `<p class="mb-5 leading-relaxed text-[#0f3d2e]/85 text-lg">${inline(block)}</p>`
    }).join('\n')
}
const inline = (s) => s.replace(/\*\*(.+?)\*\*/g, '<strong class="text-[#0f3d2e]">$1</strong>')

const BlogDetail = () => {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [related, setRelated] = useState([])

  useEffect(() => {
    fetch(`/api/blogs/slug/${slug}`).then(r => { if (!r.ok) { setNotFound(true); return null } return r.json() })
      .then(d => { if (d?.blog) setBlog(d.blog) })
    fetch('/api/blogs').then(r => r.json()).then(d => setRelated((d.blogs || []).filter(b => b.slug !== slug).slice(0, 2)))
  }, [slug])

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-4xl mb-3">Post not found</h1>
        <Button asChild className="bg-[#0f3d2e] text-white"><Link href="/blog">Back to Journal</Link></Button>
      </div>
    </div>
  )
  if (!blog) return <div className="min-h-screen flex items-center justify-center text-[#0f3d2e]/60">Loading...</div>

  return (
    <div className="min-h-screen bg-[#faf6ee]">
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#062019]/90 border-b border-[#d4af37]/20">
        <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-[#d4af37] to-[#9c7a2a]"><Leaf className="w-6 h-6 text-[#0f3d2e]" /></div>
            <div><div className="font-display text-2xl font-semibold gold-text leading-none">SatvaRoot</div><div className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37]/80">Exports</div></div>
          </Link>
          <Button asChild variant="ghost" className="text-white hover:bg-white/10"><Link href="/blog"><ArrowLeft className="w-4 h-4 mr-1" /> All Posts</Link></Button>
        </div>
      </nav>

      <article className="container mx-auto px-4 lg:px-8 py-14 max-w-3xl">
        <div className="flex flex-wrap gap-1.5 mb-4">{(blog.tags || []).map(t => <Badge key={t} variant="outline" className="text-xs"><Tag className="w-3 h-3 mr-1" />{t}</Badge>)}</div>
        <h1 className="font-display text-4xl lg:text-6xl font-semibold leading-[1.1] mb-5">{blog.title}</h1>
        <div className="flex items-center gap-5 text-sm text-[#0f3d2e]/60 mb-8 pb-8 border-b">
          <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {blog.author}</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(blog.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        <img src={blog.coverImage} alt={blog.title} className="w-full rounded-2xl mb-10 aspect-[16/9] object-cover" />
        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(blog.content) }} />
        <div className="mt-12 pt-10 border-t">
          <div className="bg-gradient-to-br from-[#0f3d2e] to-[#1a5740] rounded-2xl p-8 text-white text-center">
            <h3 className="font-display text-3xl mb-3">Looking to Import from India?</h3>
            <p className="text-white/75 mb-6">Talk to our export desk for a free product catalogue and quote.</p>
            <Button asChild className="bg-[#d4af37] hover:bg-[#b08930] text-[#0f3d2e] font-semibold"><Link href="/#contact">Send Enquiry</Link></Button>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="py-16 bg-[#faf2e0]">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
            <h2 className="font-display text-3xl mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {related.map(r => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="bg-white rounded-2xl overflow-hidden border border-[#0f3d2e]/10 hover:shadow-xl transition block">
                  <img src={r.coverImage} className="aspect-[16/9] w-full object-cover" alt={r.title} />
                  <div className="p-5">
                    <div className="font-display text-xl font-semibold mb-1 line-clamp-2">{r.title}</div>
                    <div className="text-sm text-[#0f3d2e]/70 line-clamp-2">{r.excerpt}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="bg-[#031411] text-white/70 py-10 text-center text-sm">© {new Date().getFullYear()} SatvaRoot Exports. All rights reserved.</footer>
    </div>
  )
}
export default BlogDetail
