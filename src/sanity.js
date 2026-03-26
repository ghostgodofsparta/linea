import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}

// Fetch all products sorted by manual order field
export async function getProducts() {
  return client.fetch(`
    *[_type == "product"] | order(order asc) {
      _id,
      title,
      category,
      sex,
      price,
      subcategory,
      badge,
      inStock,
      image,
      accentColor,
    }
  `)
}

export async function getProductById(productId) {
  return client.fetch(
    `
      *[_type == "product" && _id == $productId][0]{
        _id,
        title,
        category,
        sex,
        price,
        subcategory,
        badge,
        inStock,
        image,
        accentColor,
      }
    `,
    { productId }
  )
}

export async function getSimilarProducts({ productId, sex, category }) {
  const field = sex ? 'sex' : 'category'
  const value = sex || category
  if (!value) return []

  return client.fetch(
    `
      *[_type == "product" && _id != $productId && ${field} == $value] | order(order asc) [0...4] {
        _id,
        title,
        category,
        sex,
        price,
        subcategory,
        badge,
        inStock,
        image,
        accentColor,
      }
    `,
    { productId, value }
  )
}
