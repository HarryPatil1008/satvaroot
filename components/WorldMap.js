'use client'
import { useEffect, useState } from 'react'

// Coordinates (approx) for India (origin) and export destinations on a 1000x500 equirectangular projection.
// Using simple lng/lat -> x/y mapping: x = (lng+180)*1000/360, y = (90-lat)*500/180
const proj = (lng, lat) => ({ x: (lng + 180) * 1000 / 360, y: (90 - lat) * 500 / 180 })
const INDIA = proj(78, 22)
const DESTS = [
  { name: 'UAE', ...proj(54, 24) },
  { name: 'USA', ...proj(-100, 40) },
  { name: 'UK', ...proj(-0.1, 51) },
  { name: 'Canada', ...proj(-100, 56) },
  { name: 'Australia', ...proj(134, -25) },
  { name: 'Germany', ...proj(10, 51) },
  { name: 'Singapore', ...proj(104, 1.3) },
  { name: 'Saudi Arabia', ...proj(45, 24) }
]

const arcPath = (from, to) => {
  const mx = (from.x + to.x) / 2
  const my = (from.y + to.y) / 2
  const dx = to.x - from.x
  const dy = to.y - from.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  const curveHeight = Math.min(dist * 0.35, 120)
  const cx = mx
  const cy = my - curveHeight
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`
}

const WorldMap = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  return (
    <div className="relative w-full aspect-[2/1] max-w-5xl mx-auto">
      <svg viewBox="0 0 1000 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="arc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#f5e6a8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0.1" />
          </linearGradient>
          <filter id="blur-glow"><feGaussianBlur stdDeviation="3" /></filter>
        </defs>

        {/* World dot-grid: oceans + continents approximated with dotted pattern */}
        <g opacity="0.22">
          {Array.from({ length: 50 }).map((_, i) =>
            Array.from({ length: 25 }).map((_, j) => (
              <circle key={`${i}-${j}`} cx={i * 20 + 10} cy={j * 20 + 10} r="1.1" fill="#d4af37" />
            ))
          )}
        </g>

        {/* Continent silhouettes (simplified rough polygons) */}
        <g fill="#0f3d2e" opacity="0.55">
          {/* North America */}
          <path d="M160,120 L250,95 L295,130 L310,200 L260,230 L220,215 L175,180 Z" />
          {/* South America */}
          <path d="M275,265 L310,260 L330,310 L315,380 L280,390 L265,340 Z" />
          {/* Europe */}
          <path d="M475,115 L540,105 L555,145 L530,170 L495,165 L470,140 Z" />
          {/* Africa */}
          <path d="M485,195 L555,190 L570,260 L545,330 L510,325 L485,270 Z" />
          {/* Asia */}
          <path d="M560,100 L760,95 L810,155 L790,215 L720,220 L640,200 L575,170 Z" />
          {/* Australia */}
          <path d="M790,315 L870,310 L885,345 L850,365 L800,355 Z" />
        </g>

        {mounted && (
          <>
            {/* Animated arcs from India to each destination */}
            {DESTS.map((d, i) => {
              const path = arcPath(INDIA, d)
              return (
                <g key={d.name}>
                  <path d={path} fill="none" stroke="url(#arc)" strokeWidth="1.5" opacity="0.7" />
                  <circle r="3.5" fill="#f5e6a8" filter="url(#blur-glow)">
                    <animateMotion dur="3.4s" repeatCount="indefinite" begin={`${i * 0.4}s`} path={path} />
                  </circle>
                  <circle r="2" fill="#fffbe9">
                    <animateMotion dur="3.4s" repeatCount="indefinite" begin={`${i * 0.4}s`} path={path} />
                  </circle>
                </g>
              )
            })}

            {/* Destination pulse dots */}
            {DESTS.map(d => (
              <g key={d.name + '-pin'}>
                <circle cx={d.x} cy={d.y} r="14" fill="url(#glow)">
                  <animate attributeName="r" values="8;18;8" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx={d.x} cy={d.y} r="3.5" fill="#d4af37" />
                <text x={d.x} y={d.y - 10} textAnchor="middle" fontSize="10" fontWeight="600" fill="#faf6ee" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {d.name}
                </text>
              </g>
            ))}

            {/* India origin — bigger star */}
            <g>
              <circle cx={INDIA.x} cy={INDIA.y} r="20" fill="url(#glow)">
                <animate attributeName="r" values="14;26;14" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle cx={INDIA.x} cy={INDIA.y} r="6" fill="#f5e6a8" stroke="#fffbe9" strokeWidth="1.5" />
              <text x={INDIA.x} y={INDIA.y + 24} textAnchor="middle" fontSize="12" fontWeight="700" fill="#d4af37" style={{ fontFamily: 'Inter, sans-serif' }}>
                INDIA
              </text>
            </g>
          </>
        )}
      </svg>
    </div>
  )
}
export default WorldMap
