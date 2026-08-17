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
