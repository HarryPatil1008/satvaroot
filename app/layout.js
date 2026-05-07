import './globals.css'
import { Toaster } from 'sonner'

export const metadata = {
  title: 'SatvaRoot Exports — Pure Roots of India to the World | Premium Indian Exporter',
  description: 'SatvaRoot Exports is a premium international exporter of Turmeric, Spices, Banana Chips, Ashwagandha, Ayurvedic & Herbal products from India. Trusted in 25+ countries. FSSAI, APEDA, IEC, ISO certified.',
  keywords: 'India exporter, turmeric exporter, ashwagandha exporter, banana chips export, indian spices, ayurvedic products export, masala export, papad export, herbal powder, private label manufacturer, APEDA, FSSAI',
  openGraph: {
    title: 'SatvaRoot Exports — Pure Roots of India to the World',
    description: 'Premium international exporter of Indian agricultural, herbal & ayurvedic products. 25+ countries. FSSAI, APEDA, IEC, ISO certified.',
    type: 'website'
  },
  robots: 'index, follow'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  )
}
