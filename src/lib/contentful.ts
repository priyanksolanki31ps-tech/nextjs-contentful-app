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

export async function getHeroData(siteId: string = 'ferrari') {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'hero',
      'fields.brand.sys.contentType.sys.id': 'brand', // Required by Contentful when querying fields on references
      'fields.brand.fields.slug': siteId,
      limit: 1,
    });

    if (!entries.items.length) return null;

    const item = entries.items[0];
    const fields = item.fields as any;
    const imageFile = fields.image?.fields?.file;
    const imageUrl = imageFile?.url ? `https:${imageFile.url}` : null;

    return {
      heading: fields.heading || '',
      description: fields.description || '',
      imageUrl,
    };
  } catch (error) {
    console.error(`Error loading hero data for site ${siteId}:`, error);
    return null;
  }
}
