import { createClient } from 'contentful';

const space = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

if (!space || !accessToken) {
  console.warn('Contentful environment variables are missing!');
}

export const contentfulClient = createClient({
  space: space || '',
  accessToken: accessToken || '',
});

export async function getBlogPosts() {
  const entries = await contentfulClient.getEntries({
    content_type: 'pageBlogPost',
    order: ['-fields.publishedDate'] as any,
  });
  return entries.items;
}

export async function getBlogPostBySlug(slug: string) {
  const entries = await contentfulClient.getEntries({
    content_type: 'pageBlogPost',
    'fields.slug': slug,
    limit: 1,
  });
  return entries.items[0] || null;
}

export async function getHeroData() {
  const entries = await contentfulClient.getEntries({
    content_type: 'hero', // This is the Content Type ID you created in Step 1
    limit: 1,
  });
  if (!entries.items.length) return null;
  const item = entries.items[0];
  const fields = item.fields as any;
  // Extract and format the fields safely
  const imageFile = fields.image?.fields?.file;
  const imageUrl = imageFile?.url ? `https:${imageFile.url}` : null;
  return {
    heading: fields.heading || '',
    description: fields.description || '',
    imageUrl,
  };
}
