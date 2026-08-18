import Image from 'next/image';

interface HeroProps {
  heading: string;
  description: string;
  imageUrl: string | null;
  theme: {
    name: string;
    accent: string;
    accentText: string;
  };
}

export default function Hero({ heading, description, imageUrl, theme }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-zinc-900/50 py-16 md:py-24 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Content Side */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="flex items-center gap-2">
            <span className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full ${theme.accent}`}>
              {theme.name} Official
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
            {heading}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-300 text-lg md:text-xl leading-relaxed">
            {description}
          </p>
          <div>
            <button className={`px-8 py-3.5 rounded-full font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${theme.accentText}`}>
              Explore Models
            </button>
          </div>
        </div>

        {/* Image Side */}
        {imageUrl && (
          <div className="relative h-80 md:h-[450px] w-full rounded-2xl overflow-hidden shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 group">
            <Image
              src={imageUrl}
              alt={heading}
              fill
              priority
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        )}
      </div>
    </section>
  );
}
