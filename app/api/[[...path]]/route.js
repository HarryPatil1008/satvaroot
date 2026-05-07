import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'

const MONGO_URL = process.env.MONGO_URL
const DB_NAME = process.env.DB_NAME || 'satvaroot'

let _client = null
async function getDb() {
  if (!_client) {
    _client = new MongoClient(MONGO_URL)
    await _client.connect()
  }
  return _client.db(DB_NAME)
}

const json = (data, status = 200) => NextResponse.json(data, { status })
const err = (message, status = 400) => NextResponse.json({ error: message }, { status })

// ---------- Sample products to seed ----------
const SAMPLE_PRODUCTS = [
  {
    id: uuidv4(),
    name: 'Premium Turmeric Powder (Curcumin 5%+)',
    slug: 'premium-turmeric-powder',
    category: 'Turmeric Powder',
    images: ['https://images.unsplash.com/photo-1523112784166-c04db3a3bb7c?crop=entropy&cs=srgb&fm=jpg&w=900&q=85'],
    description: 'Lab-tested premium turmeric powder, hand-selected from Erode & Sangli farms. High curcumin content (5%+), naturally vibrant golden color. Stone-ground for maximum aroma and potency.',
    moq: '500 Kg',
    packaging: '25 Kg / 50 Kg PP woven bags with inner liner; private label retail packs available',
    weight: ['100g', '500g', '1Kg', '25Kg', '50Kg'],
    shelfLife: '24 months',
    grade: 'Export Grade A',
    countries: ['UAE', 'USA', 'UK', 'Germany', 'Australia', 'Singapore'],
    certifications: ['FSSAI', 'APEDA', 'ISO 22000', 'Organic'],
    hsCode: '09103030',
    nutrition: 'Energy 354 kcal, Protein 7.8g, Fat 9.9g, Carbs 64.9g, Curcumin 5%+',
    featured: true
  },
  {
    id: uuidv4(),
    name: 'Whole Turmeric Fingers (Sangli/Salem)',
    slug: 'whole-turmeric-fingers',
    category: 'Turmeric Fingers',
    images: ['https://images.unsplash.com/photo-1602169417305-a9de0b6434e2?crop=entropy&cs=srgb&fm=jpg&w=900&q=85'],
    description: 'Sun-dried, single & double polished turmeric fingers. Sourced directly from Sangli & Salem regions. Bright golden color and high curcumin content.',
    moq: '1000 Kg',
    packaging: '25 Kg / 50 Kg PP bags',
    weight: ['25Kg', '50Kg'],
    shelfLife: '24 months',
    grade: 'Single Polished / Double Polished',
    countries: ['UAE', 'USA', 'UK', 'Saudi Arabia', 'Singapore'],
    certifications: ['FSSAI', 'APEDA', 'ISO 22000'],
    hsCode: '09103020',
    nutrition: 'Curcumin: 3-5%, Moisture: <10%',
    featured: true
  },
  {
    id: uuidv4(),
    name: 'Kerala Banana Chips (Coconut Oil Fried)',
    slug: 'kerala-banana-chips',
    category: 'Banana Chips',
    images: ['https://images.unsplash.com/photo-1609819278040-c196cdb2a04c?crop=entropy&cs=srgb&fm=jpg&w=900&q=85'],
    description: 'Authentic Kerala-style banana chips fried in pure coconut oil. Crispy texture, lightly salted. Made from fresh Nendran bananas.',
    moq: '200 Kg',
    packaging: '50g / 100g / 200g retail pouches; 5Kg bulk',
    weight: ['50g', '100g', '200g', '500g', '5Kg'],
    shelfLife: '6 months',
    grade: 'Premium',
    countries: ['UAE', 'USA', 'UK', 'Canada', 'Australia'],
    certifications: ['FSSAI', 'ISO 22000', 'HACCP'],
    hsCode: '20081999',
    nutrition: 'Energy 519 kcal, Carbs 58g, Fat 33g, Protein 2g',
    featured: true
  },
  {
    id: uuidv4(),
    name: 'Masala Banana Chips (Spicy)',
    slug: 'masala-banana-chips',
    category: 'Flavoured Banana Chips',
    images: ['https://images.unsplash.com/photo-1683533678033-f5d60f0a3437?crop=entropy&cs=srgb&fm=jpg&w=900&q=85'],
    description: 'Crispy banana chips coated with our signature masala blend. Available in Spicy, Pepper, Peri-Peri, Cheese, and Tangy Tomato flavours.',
    moq: '200 Kg',
    packaging: '50g / 100g / 200g retail pouches',
    weight: ['50g', '100g', '200g'],
    shelfLife: '6 months',
    grade: 'Premium',
    countries: ['UAE', 'USA', 'UK', 'Canada'],
    certifications: ['FSSAI', 'HACCP'],
    hsCode: '20081999',
    nutrition: 'Energy 525 kcal, Carbs 57g, Fat 32g, Protein 2.5g',
    featured: false
  },
  {
    id: uuidv4(),
    name: 'Organic Ashwagandha Root Powder',
    slug: 'organic-ashwagandha-powder',
    category: 'Ashwagandha Powder',
    images: ['https://images.unsplash.com/photo-1704650311291-0e001b7e2b9f?crop=entropy&cs=srgb&fm=jpg&w=900&q=85'],
    description: 'Premium organic Ashwagandha (Withania somnifera) root powder. Withanolides 2.5%+. Lab-tested, USDA & India Organic certified.',
    moq: '100 Kg',
    packaging: '25 Kg drums; 100g/500g retail jars',
    weight: ['100g', '500g', '1Kg', '25Kg'],
    shelfLife: '24 months',
    grade: 'Premium / Organic',
    countries: ['USA', 'UK', 'Germany', 'Canada', 'Australia', 'UAE'],
    certifications: ['USDA Organic', 'India Organic', 'FSSAI', 'AYUSH', 'ISO 22000'],
    hsCode: '12119029',
    nutrition: 'Withanolides 2.5%+, Protein 3.9g/100g',
    featured: true
  },
  {
    id: uuidv4(),
    name: 'Rajasthani Moong Dal Papad',
    slug: 'moong-dal-papad',
    category: 'Papad',
    images: ['https://images.unsplash.com/photo-1589301773859-bb024d3ad558?crop=entropy&cs=srgb&fm=jpg&w=900&q=85'],
    description: 'Hand-rolled Rajasthani moong dal papad. Crispy, light and authentic. Sun-dried for traditional taste.',
    moq: '500 Kg',
    packaging: '200g / 400g retail packs; 5Kg bulk',
    weight: ['200g', '400g', '5Kg'],
    shelfLife: '12 months',
    grade: 'Premium',
    countries: ['UAE', 'USA', 'UK', 'Canada', 'Australia', 'Singapore'],
    certifications: ['FSSAI', 'HACCP'],
    hsCode: '19053219',
    nutrition: 'Energy 371 kcal, Protein 22g, Carbs 56g',
    featured: false
  },
  {
    id: uuidv4(),
    name: 'Garam Masala Premium Blend',
    slug: 'garam-masala',
    category: 'Masala',
    images: ['https://images.unsplash.com/photo-1602169417305-a9de0b6434e2?crop=entropy&cs=srgb&fm=jpg&w=900&q=85'],
    description: 'Authentic North Indian garam masala blend with cardamom, cinnamon, cloves, black pepper, bay leaf and more. Stone-ground for aroma.',
    moq: '300 Kg',
    packaging: '50g/100g/500g retail; 25Kg bulk',
    weight: ['50g', '100g', '500g', '25Kg'],
    shelfLife: '18 months',
    grade: 'Export Grade A',
    countries: ['UAE', 'USA', 'UK', 'Germany', 'Saudi Arabia'],
    certifications: ['FSSAI', 'APEDA', 'ISO 22000'],
    hsCode: '09109100',
    nutrition: 'Energy 379 kcal, Protein 14g',
    featured: true
  },
  {
    id: uuidv4(),
    name: 'Black Pepper Whole (Malabar)',
    slug: 'black-pepper-malabar',
    category: 'Spices',
    images: ['https://images.unsplash.com/photo-1602169417305-a9de0b6434e2?crop=entropy&cs=srgb&fm=jpg&w=900&q=85'],
    description: 'Premium Malabar black pepper, sun-dried whole peppercorns. Strong aroma, high piperine content (5%+).',
    moq: '500 Kg',
    packaging: '25 Kg / 50 Kg PP bags',
    weight: ['25Kg', '50Kg'],
    shelfLife: '24 months',
    grade: '500 GL / 550 GL',
    countries: ['UAE', 'USA', 'UK', 'Germany'],
    certifications: ['FSSAI', 'APEDA', 'ISO 22000'],
    hsCode: '09041110',
    nutrition: 'Piperine 5%+, Moisture <12%',
    featured: false
  },
  {
    id: uuidv4(),
    name: 'Triphala Churna (Ayurvedic)',
    slug: 'triphala-churna',
    category: 'Ayurvedic Products',
    images: ['https://images.unsplash.com/photo-1704650312022-ed1a76dbed1b?crop=entropy&cs=srgb&fm=jpg&w=900&q=85'],
    description: 'Traditional Ayurvedic Triphala blend (Amla, Bibhitaki, Haritaki). 100% natural, AYUSH certified.',
    moq: '100 Kg',
    packaging: '100g/500g jars; 25Kg drums',
    weight: ['100g', '500g', '1Kg', '25Kg'],
    shelfLife: '24 months',
    grade: 'Premium Ayurvedic',
    countries: ['USA', 'UK', 'Germany', 'Canada', 'Australia'],
    certifications: ['AYUSH', 'FSSAI', 'GMP', 'Organic'],
    hsCode: '30049011',
    nutrition: 'Vitamin C, Tannins, Polyphenols',
    featured: false
  },
  {
    id: uuidv4(),
    name: 'Roasted Cashew & Spice Mix',
    slug: 'roasted-cashew-mix',
    category: 'Dry Snacks',
    images: ['https://images.pexels.com/photos/13220344/pexels-photo-13220344.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'],
    description: 'Premium roasted cashews mixed with masala peanuts and crispy lentils. Healthy, savory, addictive.',
    moq: '200 Kg',
    packaging: '100g/250g pouches; 5Kg bulk',
    weight: ['100g', '250g', '5Kg'],
    shelfLife: '9 months',
    grade: 'Premium',
    countries: ['UAE', 'USA', 'UK', 'Canada'],
    certifications: ['FSSAI', 'HACCP'],
    hsCode: '20081910',
    nutrition: 'Energy 580 kcal, Protein 18g, Fat 42g',
    featured: false
  },
  {
    id: uuidv4(),
    name: 'Moringa Leaf Powder (Organic)',
    slug: 'moringa-leaf-powder',
    category: 'Herbal Powders',
    images: ['https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?crop=entropy&cs=srgb&fm=jpg&w=900&q=85'],
    description: 'Organic moringa oleifera leaf powder. Nutrient-dense superfood. Shade-dried to retain chlorophyll & nutrients.',
    moq: '100 Kg',
    packaging: '100g/500g jars; 25Kg drums',
    weight: ['100g', '500g', '25Kg'],
    shelfLife: '18 months',
    grade: 'Organic Premium',
    countries: ['USA', 'UK', 'Germany', 'Canada', 'Australia', 'UAE'],
    certifications: ['USDA Organic', 'India Organic', 'FSSAI', 'ISO 22000'],
    hsCode: '12119029',
    nutrition: 'Protein 27g, Iron 28mg, Vitamin A',
    featured: true
  },
  {
    id: uuidv4(),
    name: 'Private Label Manufacturing Service',
    slug: 'private-label',
    category: 'Private Label Products',
    images: ['https://images.pexels.com/photos/35531300/pexels-photo-35531300.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'],
    description: 'End-to-end private label manufacturing for spices, herbal powders, snacks & ayurvedic products. Custom packaging, branding & formulation. Low MOQ for startups.',
    moq: '1000 units',
    packaging: 'Custom designed (pouches, jars, bottles, boxes)',
    weight: ['Custom'],
    shelfLife: 'As per product',
    grade: 'Custom',
    countries: ['Worldwide'],
    certifications: ['FSSAI', 'APEDA', 'ISO 22000', 'HACCP'],
    hsCode: 'Various',
    nutrition: 'As per product',
    featured: true
  }
]

async function ensureSeeded() {
  const db = await getDb()
  const count = await db.collection('products').countDocuments()
  if (count === 0) {
    await db.collection('products').insertMany(
      SAMPLE_PRODUCTS.map(p => ({ ...p, createdAt: new Date(), updatedAt: new Date() }))
    )
  }
}

async function verifyAdmin(request) {
  const auth = request.headers.get('authorization') || ''
  const token = auth.replace('Bearer ', '').trim()
  if (!token) return false
  const db = await getDb()
  const session = await db.collection('admin_sessions').findOne({ token })
  return !!session
}

// ---------- Handlers ----------
async function handle(request, segments) {
  const db = await getDb()
  await ensureSeeded()
  const path = '/' + (segments || []).join('/')
  const method = request.method

  // ----- Health -----
  if (path === '/' || path === '') return json({ status: 'ok', service: 'SatvaRoot Exports API' })

  // ----- Admin auth -----
  if (path === '/admin/login' && method === 'POST') {
    const { username, password } = await request.json()
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      const token = uuidv4() + '-' + uuidv4()
      await db.collection('admin_sessions').insertOne({ token, username, createdAt: new Date() })
      return json({ token, username })
    }
    return err('Invalid credentials', 401)
  }
  if (path === '/admin/verify' && method === 'GET') {
    const ok = await verifyAdmin(request)
    return json({ valid: ok })
  }
  if (path === '/admin/logout' && method === 'POST') {
    const auth = request.headers.get('authorization') || ''
    const token = auth.replace('Bearer ', '').trim()
    if (token) await db.collection('admin_sessions').deleteOne({ token })
    return json({ ok: true })
  }

  // ----- Products -----
  if (path === '/products' && method === 'GET') {
    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    const featured = url.searchParams.get('featured')
    const q = url.searchParams.get('q')
    const filter = {}
    if (category && category !== 'All') filter.category = category
    if (featured === 'true') filter.featured = true
    if (q) filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } }
    ]
    const products = await db.collection('products').find(filter, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray()
    return json({ products })
  }
  if (path === '/products' && method === 'POST') {
    if (!await verifyAdmin(request)) return err('Unauthorized', 401)
    const body = await request.json()
    const product = {
      id: uuidv4(),
      name: body.name || 'New Product',
      slug: (body.slug || body.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: body.category || 'Spices',
      images: body.images && body.images.length ? body.images : ['https://images.unsplash.com/photo-1602169417305-a9de0b6434e2?crop=entropy&cs=srgb&fm=jpg&w=900&q=85'],
      description: body.description || '',
      moq: body.moq || '500 Kg',
      packaging: body.packaging || '25Kg PP bags',
      weight: body.weight || ['25Kg'],
      shelfLife: body.shelfLife || '12 months',
      grade: body.grade || 'Export Grade A',
      countries: body.countries || ['UAE', 'USA', 'UK'],
      certifications: body.certifications || ['FSSAI', 'APEDA'],
      hsCode: body.hsCode || '',
      nutrition: body.nutrition || '',
      featured: !!body.featured,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    await db.collection('products').insertOne(product)
    delete product._id
    return json({ product })
  }
  const productMatch = path.match(/^\/products\/([^/]+)$/)
  if (productMatch) {
    const id = productMatch[1]
    if (method === 'GET') {
      const product = await db.collection('products').findOne({ id }, { projection: { _id: 0 } })
      if (!product) return err('Not found', 404)
      return json({ product })
    }
    if (method === 'PUT') {
      if (!await verifyAdmin(request)) return err('Unauthorized', 401)
      const body = await request.json()
      delete body._id; delete body.id; delete body.createdAt
      body.updatedAt = new Date()
      await db.collection('products').updateOne({ id }, { $set: body })
      const product = await db.collection('products').findOne({ id }, { projection: { _id: 0 } })
      return json({ product })
    }
    if (method === 'DELETE') {
      if (!await verifyAdmin(request)) return err('Unauthorized', 401)
      await db.collection('products').deleteOne({ id })
      return json({ ok: true })
    }
  }

  // ----- Enquiries -----
  if (path === '/enquiries' && method === 'POST') {
    const body = await request.json()
    if (!body.name || !body.email) return err('Name and email required', 400)
    const enquiry = {
      id: uuidv4(),
      name: body.name,
      company: body.company || '',
      country: body.country || '',
      email: body.email,
      phone: body.phone || '',
      whatsapp: body.whatsapp || '',
      product: body.product || '',
      quantity: body.quantity || '',
      message: body.message || '',
      source: body.source || 'website',
      status: 'new',
      createdAt: new Date()
    }
    await db.collection('enquiries').insertOne(enquiry)
    delete enquiry._id
    return json({ ok: true, enquiry })
  }
  if (path === '/enquiries' && method === 'GET') {
    if (!await verifyAdmin(request)) return err('Unauthorized', 401)
    const enquiries = await db.collection('enquiries').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray()
    return json({ enquiries })
  }
  const enqMatch = path.match(/^\/enquiries\/([^/]+)$/)
  if (enqMatch) {
    const id = enqMatch[1]
    if (method === 'PUT') {
      if (!await verifyAdmin(request)) return err('Unauthorized', 401)
      const body = await request.json()
      await db.collection('enquiries').updateOne({ id }, { $set: { status: body.status || 'new' } })
      return json({ ok: true })
    }
    if (method === 'DELETE') {
      if (!await verifyAdmin(request)) return err('Unauthorized', 401)
      await db.collection('enquiries').deleteOne({ id })
      return json({ ok: true })
    }
  }

  // ----- Newsletter -----
  if (path === '/newsletter' && method === 'POST') {
    const { email } = await request.json()
    if (!email) return err('Email required', 400)
    await db.collection('newsletter').updateOne({ email }, { $set: { email, createdAt: new Date() } }, { upsert: true })
    return json({ ok: true })
  }

  // ----- Stats (admin) -----
  if (path === '/admin/stats' && method === 'GET') {
    if (!await verifyAdmin(request)) return err('Unauthorized', 401)
    const [products, enquiries, newSubs, byStatus] = await Promise.all([
      db.collection('products').countDocuments(),
      db.collection('enquiries').countDocuments(),
      db.collection('newsletter').countDocuments(),
      db.collection('enquiries').aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]).toArray()
    ])
    return json({ products, enquiries, newsletter: newSubs, byStatus })
  }

  return err('Not found', 404)
}

export async function GET(request, { params }) {
  try { return await handle(request, params?.path || []) } catch (e) { console.error(e); return err(e.message || 'Server error', 500) }
}
export async function POST(request, { params }) {
  try { return await handle(request, params?.path || []) } catch (e) { console.error(e); return err(e.message || 'Server error', 500) }
}
export async function PUT(request, { params }) {
  try { return await handle(request, params?.path || []) } catch (e) { console.error(e); return err(e.message || 'Server error', 500) }
}
export async function DELETE(request, { params }) {
  try { return await handle(request, params?.path || []) } catch (e) { console.error(e); return err(e.message || 'Server error', 500) }
}
