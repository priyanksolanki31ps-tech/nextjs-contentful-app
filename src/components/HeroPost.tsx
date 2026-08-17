import Link from 'next/link';
import Image from 'next/image';
interface HeroPostProps {
  post: any; // The blog post object fetched from Contentful
}
export default function HeroPost({ post }: HeroPostProps) {
  // 1. Guard against empty/undefined data
  if (!post || !post.fields) return null;
  // 2. Destructure fields from Contentful data
  const { title, slug, publishedDate, shortDescription, featuredImage, author } = post.fields;
  // 3. Helper logic
  const imageUrl = featuredImage?.fields?.file?.url;
  const authorName = author?.fields?.name || 'Anonymous';
  // 4. Return JSX layout styled with Tailwind CSS
  return (
    <section className="mb-20">
      <div className="rounded-3xl border border-zinc-200 p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {imageUrl && (
          <div className="relative h-96 rounded-2xl overflow-hidden">
            <Image src={`https:${imageUrl}`} alt={title} fill className="object-cover" />
          </div>
        )}
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold mb-4">{title}</h2>
          <p className="text-zinc-600 mb-6">{shortDescription}</p>
          <Link href={`/posts/${slug}`} className="text-indigo-600 font-bold">
            Read Post
          </Link>
        </div>
      </div>
    </section>
  );
}
