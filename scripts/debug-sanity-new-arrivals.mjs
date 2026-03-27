import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'jff0jp0b',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

const all = await client.fetch(`*[_type=="product"]|order(_createdAt desc)[0...20]{
  _id,
  title,
  badge,
  inStock,
  _createdAt
}`)

const newArrivals = await client.fetch(`*[
  _type=="product" &&
  lower(coalesce(badge,"")) match "new" &&
  coalesce(inStock,true)==true
]|order(_createdAt desc)[0...20]{
  _id,
  title,
  badge,
  inStock,
  _createdAt
}`)

console.log('--- latest products (max 20) ---')
console.log(JSON.stringify(all, null, 2))
console.log('--- new arrivals query result ---')
console.log(JSON.stringify(newArrivals, null, 2))

