import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts, getHeroData } from '@/lib/contentful';
import Hero from '@/components/Hero';

export const revalidate = 60; // Revalidate every minute

const BRAND_THEMES: Record<string, { name: string; accent: string; accentText: string; headerAccent: string }> = {
  ferrari: {
    name: 'Ferrari',
    accent: 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400',
    accentText: 'bg-red-600 hover:bg-red-700 shadow-red-600/20',
    headerAccent: 'from-red-600 to-red-400',
  },
  benz: {
    name: 'Mercedes-Benz',
    accent: 'bg-zinc-800/10 text-zinc-800 dark:bg-zinc-800/20 dark:text-zinc-200',
    accentText: 'bg-zinc-900 hover:bg-black dark:bg-zinc-800 dark:hover:bg-zinc-700 shadow-zinc-950/20',
    headerAccent: 'from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-400',
  },
  jetour: {
    name: 'Jetour',
    accent: 'bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400',
    accentText: 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-600/20',
    headerAccent: 'from-cyan-600 to-cyan-400',
  },
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const activeBrand = (resolvedParams.brand as string) || 'ferrari';
  
  // Safely fallback if activeBrand is not one of our three brands
  const currentBrand = BRAND_THEMES[activeBrand] ? activeBrand : 'ferrari';
  const theme = BRAND_THEMES[currentBrand];

  // Fetch brand-specific hero data
  const heroData = await getHeroData(currentBrand);

  // Fetch posts (which we can still show as fallback or news section)
  let posts: any[] = [];
  try {
    posts = await getBlogPosts();
  } catch (error) {
    console.error('Error loading blog posts:', error);
  }

  // Helper to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Helper to get image URL
  const getImageUrl = (asset: any) => {
    if (!asset || !asset.fields || !asset.fields.file || !asset.fields.file.url) {
      return null;
    }
    const url = asset.fields.file.url;
    return url.startsWith('//') ? `https:${url}` : url;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-white/75 backdrop-blur-lg dark:border-zinc-800/50 dark:bg-zinc-950/75 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href={`/?brand=${currentBrand}`} className="group flex items-center gap-2">
            <span className={`h-10 w-10 rounded-xl bg-gradient-to-tr ${theme.headerAccent} flex items-center justify-center text-white font-black text-xl shadow-lg transition-all duration-300`}>
              {theme.name[0]}
            </span>
            <span className="font-extrabold text-xl tracking-tight">
              {theme.name}
            </span>
          </Link>

          {/* Brand Switcher in Header */}
          <nav className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-full border border-zinc-200/50 dark:border-zinc-800/50">
            {Object.keys(BRAND_THEMES).map((brandKey) => {
              const isActive = brandKey === currentBrand;
              const bTheme = BRAND_THEMES[brandKey];
              return (
                <Link
                  key={brandKey}
                  href={`/?brand=${brandKey}`}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? `${bTheme.accentText} text-white shadow-md scale-105`
                      : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                  }`}
                >
                  {bTheme.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-20">
        {/* Dynamic Brand Hero Section */}
        {heroData ? (
          <Hero
            heading={heroData.heading}
            description={heroData.description}
            imageUrl={heroData.imageUrl}
            theme={theme}
          />
        ) : (
          <div className="p-16 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900/30">
            <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-2">No hero banner found for {theme.name}.</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              Please create a "Hero" entry in Contentful with the `site` field set to <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-xs">{currentBrand}</code>.
            </p>
          </div>
        )}

        {/* Brand News / Blog Posts section */}
        {posts.length > 0 && (
          <section className="pt-8">
            <h3 className="text-2xl font-extrabold tracking-tight mb-8">Latest {theme.name} News</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.slice(0, 3).map((post: any) => {
                const image = getImageUrl(post.fields.featuredImage);
                const author = post.fields.author?.fields?.name || 'Anonymous';
                const authorAvatar = getImageUrl(post.fields.author?.fields?.avatar);

                return (
                  <article key={post.sys.id} className="group relative flex flex-col rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/30 overflow-hidden hover:shadow-xl transition-all duration-300">
                    {image && (
                      <div className="relative h-56 w-full overflow-hidden">
                        <Image
                          src={image}
                          alt={post.fields.title}
                          fill
                          className="object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      </div>
                    )}
                    <div className="flex flex-col flex-1 p-6">
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold mb-3">
                        {formatDate(post.fields.publishedDate)}
                      </span>
                      <h4 className="text-xl font-bold mb-3 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                        <Link href={`/posts/${post.fields.slug}?brand=${currentBrand}`}>{post.fields.title}</Link>
                      </h4>
                      <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6 flex-1">
                        {post.fields.shortDescription}
                      </p>
                      
                      <div className="pt-5 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between gap-4 mt-auto">
                        <div className="flex items-center gap-2">
                          {authorAvatar ? (
                            <div className="relative h-8 w-8 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
                              <Image src={authorAvatar} alt={author} fill className="object-cover" />
                            </div>
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                              {author[0]}
                            </div>
                          )}
                          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">{author}</span>
                        </div>
                        <Link
                          href={`/posts/${post.fields.slug}?brand=${currentBrand}`}
                          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform duration-300"
                        >
                          Read <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <p>© {new Date().getFullYear()} {theme.name} Multi-Brand Portal. Built with Next.js, Tailwind CSS, & Contentful.</p>
      </footer>
    </div>
  );
}
