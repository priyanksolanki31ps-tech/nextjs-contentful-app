import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/contentful';
import RichText from '@/components/RichText';

export const revalidate = 60; // Revalidate every minute

export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts();
    return posts.map((post: any) => ({
      slug: post.fields.slug,
    }));
  } catch (error) {
    return [];
  }
}

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  
  let post: any = null;
  try {
    post = await getBlogPostBySlug(slug);
  } catch (error) {
    console.error('Error fetching blog post:', error);
  }

  if (!post) {
    notFound();
  }

  // Helpers
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getImageUrl = (asset: any) => {
    if (!asset || !asset.fields || !asset.fields.file || !asset.fields.file.url) {
      return null;
    }
    const url = asset.fields.file.url;
    return url.startsWith('//') ? `https:${url}` : url;
  };

  const image = getImageUrl(post.fields.featuredImage);
  const author = post.fields.author?.fields?.name || 'Anonymous';
  const authorAvatar = getImageUrl(post.fields.author?.fields?.avatar);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-white/75 backdrop-blur-lg dark:border-zinc-800/50 dark:bg-zinc-950/75 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2">
            <span className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20 transform group-hover:scale-105 transition-all duration-300">
              P
            </span>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-400 bg-clip-text text-transparent">
              Priyank's Hub
            </span>
          </Link>
          <Link href="/" className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
            Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <article>
          {/* Post Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 font-semibold mb-4">
              <span>{formatDate(post.fields.publishedDate)}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-8 leading-tight max-w-3xl mx-auto">
              {post.fields.title}
            </h1>

            {/* Author */}
            <div className="inline-flex items-center gap-3 bg-white dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 px-5 py-2.5 rounded-full shadow-sm">
              {authorAvatar ? (
                <div className="relative h-9 w-9 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800">
                  <Image src={authorAvatar} alt={author} fill className="object-cover" />
                </div>
              ) : (
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {author[0]}
                </div>
              )}
              <div className="text-left">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Written by</p>
                <p className="text-sm font-bold text-zinc-700 dark:text-zinc-200">{author}</p>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {image && (
            <div className="relative h-[250px] sm:h-[400px] md:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl mb-16 border border-zinc-200/50 dark:border-zinc-800/50">
              <Image src={image} alt={post.fields.title} fill priority className="object-cover animate-fade-in" />
            </div>
          )}

          {/* Content */}
          <div className="max-w-3xl mx-auto">
            <RichText document={post.fields.content} />
          </div>
        </article>
      </main>
    </div>
  );
}
