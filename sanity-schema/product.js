// sanity-schema/product.js
// Add this schema to your Sanity Studio project under /schemas/product.js

export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Women', value: 'women' },
          { title: 'Men', value: 'men' },
          { title: 'Accessories', value: 'accessories' },
        ],
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'subcategory',
      title: 'Subcategory',
      type: 'string',
      description: 'e.g. Dresses, Tops, Bags, Belts',
    },
    {
      name: 'price',
      title: 'Price (€)',
      type: 'number',
      validation: Rule => Rule.required().positive(),
    },
    {
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'badge',
      title: 'Badge',
      type: 'string',
      description: 'Optional label e.g. New, Popular, Bestseller',
    },
    {
      name: 'accentColor',
      title: 'Background Accent Color',
      type: 'string',
      description: 'Hex color for the card background e.g. #e8d5c8',
    },
    {
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
    },
  ],
}
