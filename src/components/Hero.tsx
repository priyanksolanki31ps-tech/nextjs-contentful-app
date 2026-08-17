import Image from 'next/image';
interface HeroProps {
  heading: string;
  description: string;
  imageUrl: string | null;
}
export default function Hero({ heading, description, imageUrl }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-zinc-950 py-16 md:py-24 rounded-3xl border border-zinc-100 dark:border-zinc-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Content Side */}
        <div className="flex flex-col justify-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
            {heading}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-300 text-lg md:text-xl leading-relaxed">
            {description}
          </p>
        </div>
        {/* Image Side */}
        {imageUrl && (
          <div className="relative h-80 md:h-[450px] w-full rounded-2xl overflow-hidden shadow-xl border border-zinc-100 dark:border-zinc-800">
            <Image
              src={imageUrl}
              alt={heading}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}