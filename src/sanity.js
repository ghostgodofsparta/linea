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
      images,
      sizes,
      description,
      accentColor,
    }
  `)
}

export async function getNewArrivals() {
  return client.fetch(
    `
      *[
        _type == "product" &&
        lower(coalesce(badge, "")) == "new" &&
        inStock == true
      ] | order(order asc) [0...8] {
        _id,
        title,
        category,
        sex,
        price,
        subcategory,
        badge,
        inStock,
        image,
        images,
        accentColor
      }
    `
  )
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
        images,
        sizes,
        description,
        accentColor,
      }
    `,
    { productId }
  )
}

export async function getSimilarProducts({ productId, sex, subcategory, category }) {
  const strict = await client.fetch(
    `
      *[
        _type == "product" &&
        _id != $productId &&
        sex == $sex &&
        subcategory == $subcategory
      ] | order(order asc) [0...4] {
        _id,
        title,
        category,
        sex,
        price,
        subcategory,
        badge,
        inStock,
        image,
        images,
        accentColor,
      }
    `,
    { productId, sex, subcategory }
  )
  if (strict?.length) return strict

  const fallbackField = sex ? 'sex' : 'category'
  const fallbackValue = sex || category
  if (!fallbackValue) return []

  return client.fetch(
    `
      *[_type == "product" && _id != $productId && ${fallbackField} == $fallbackValue] | order(order asc) [0...4] {
        _id,
        title,
        category,
        sex,
        price,
        subcategory,
        badge,
        inStock,
        image,
        images,
        accentColor,
      }
    `,
    { productId, fallbackValue }
  )
}
