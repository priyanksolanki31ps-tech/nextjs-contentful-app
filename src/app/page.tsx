import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts } from '@/lib/contentful';

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  let posts: any[] = [];
  try {
    posts = await getBlogPosts();
  } catch (error) {
    console.error('Error loading blog posts:', error);
  }

  // If there are no posts
  if (!posts || posts.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-indigo-500/20 mb-6">
          P
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-4">Welcome to Your Blog</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-md">
          We couldn't find any blog posts in your Contentful space. Make sure you have created and published posts under the Content Type ID <code className="bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono">pageBlogPost</code>.
        </p>
      </div>
    );
  }

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);

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

  const featuredImage = getImageUrl(featuredPost.fields.featuredImage);
  const featuredAuthor = featuredPost.fields.author?.fields?.name || 'Anonymous';
  const featuredAuthorAvatar = getImageUrl(featuredPost.fields.author?.fields?.avatar);

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
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
            <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link>
            <a href="https://github.com/priyanksolanki31ps-tech" target="_blank" rel="noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">GitHub</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        {/* Hero Section / Featured Post */}
        <section className="mb-20">
          <div className="relative group overflow-hidden rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/50 backdrop-blur-sm grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 md:p-8 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500">
            {/* Background Accent */}
            <div className="absolute -inset-px bg-gradient-to-tr from-indigo-500/10 to-purple-500/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            {featuredImage && (
              <div className="relative h-72 md:h-96 lg:h-[400px] rounded-2xl overflow-hidden shadow-md">
                <Image
                  src={featuredImage}
                  alt={featuredPost.fields.title}
                  fill
                  priority
                  className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            )}

            <div className="flex flex-col justify-center relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                  Featured
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  {formatDate(featuredPost.fields.publishedDate)}
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                <Link href={`/posts/${featuredPost.fields.slug}`}>
                  {featuredPost.fields.title}
                </Link>
              </h2>

              <p className="text-zinc-600 dark:text-zinc-300 text-lg leading-relaxed mb-8">
                {featuredPost.fields.shortDescription}
              </p>

              <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {featuredAuthorAvatar ? (
                    <div className="relative h-10 w-10 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
                      <Image src={featuredAuthorAvatar} alt={featuredAuthor} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {featuredAuthor[0]}
                    </div>
                  )}
                  <span className="font-semibold text-sm text-zinc-700 dark:text-zinc-200">{featuredAuthor}</span>
                </div>
                
                <Link
                  href={`/posts/${featuredPost.fields.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform duration-300"
                >
                  Read Post 
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Posts Section */}
        {recentPosts.length > 0 && (
          <section>
            <h3 className="text-2xl font-extrabold tracking-tight mb-8">Recent Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post: any) => {
                const image = getImageUrl(post.fields.featuredImage);
                const author = post.fields.author?.fields?.name || 'Anonymous';
                const authorAvatar = getImageUrl(post.fields.author?.fields?.avatar);

                return (
                  <article key={post.sys.id} className="group relative flex flex-col rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/30 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
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
                        <Link href={`/posts/${post.fields.slug}`}>{post.fields.title}</Link>
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
                          href={`/posts/${post.fields.slug}`}
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
        <p>© {new Date().getFullYear()} Priyank's Hub. Built with Next.js, Tailwind CSS, & Contentful.</p>
      </footer>
    </div>
  );
}
