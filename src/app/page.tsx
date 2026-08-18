import Link from 'next/link';
import { getHeroData } from '@/lib/contentful';
import Hero from '@/components/Hero';

export const revalidate = 60; // Revalidate every minute

const BRAND_THEMES: Record<string, { name: string; accent: string; accentText: string; headerAccent: string }> = {
  ferrari: {
    name: 'Ferrari',
    accent: 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400',
    accentText: 'bg-red-600 hover:bg-red-700 shadow-red-600/20',
    headerAccent: 'from-red-600 to-red-400',
  },
  'mercedes-benz': {
    name: 'Mercedes-Benz',
    accent: 'bg-zinc-800/10 text-zinc-800 dark:bg-zinc-800/20 dark:text-zinc-200',
    accentText: 'bg-zinc-950 hover:bg-black dark:bg-zinc-800 dark:hover:bg-zinc-700 shadow-zinc-950/20',
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

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col justify-center min-h-[calc(100vh-10rem)]">
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
              Please create a "Hero" entry in Contentful with the `brand` reference set to <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-xs">{theme.name}</code>.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <p>© {new Date().getFullYear()} {theme.name} Multi-Brand Portal. Built with Next.js, Tailwind CSS, & Contentful.</p>
      </footer>
    </div>
  );
}
