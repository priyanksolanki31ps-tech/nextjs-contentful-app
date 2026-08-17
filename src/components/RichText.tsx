import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';
import Image from 'next/image';

const options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
      <p className="mb-6 text-zinc-600 dark:text-zinc-300 leading-relaxed text-lg">{children}</p>
    ),
    [BLOCKS.HEADING_1]: (node: any, children: any) => (
      <h1 className="mt-12 mb-4 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node: any, children: any) => (
      <h2 className="mt-10 mb-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node: any, children: any) => (
      <h3 className="mt-8 mb-3 text-xl font-bold text-zinc-900 dark:text-zinc-50">{children}</h3>
    ),
    [BLOCKS.UL_LIST]: (node: any, children: any) => (
      <ul className="list-disc pl-6 mb-6 text-zinc-600 dark:text-zinc-300 space-y-2 text-lg">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: any, children: any) => (
      <ol className="list-decimal pl-6 mb-6 text-zinc-600 dark:text-zinc-300 space-y-2 text-lg">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node: any, children: any) => <li className="pl-1">{children}</li>,
    [BLOCKS.QUOTE]: (node: any, children: any) => (
      <blockquote className="border-l-4 border-indigo-500 pl-6 italic my-8 text-zinc-700 dark:text-zinc-300 text-xl font-medium">
        {children}
      </blockquote>
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const target = node.data.target;
      if (!target || !target.fields) return null;
      const { file, title } = target.fields;
      if (!file || !file.url) return null;
      const imageUrl = file.url.startsWith('//') ? `https:${file.url}` : file.url;
      return (
        <div className="my-10 overflow-hidden rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800/50">
          <Image
            src={imageUrl}
            alt={title || 'Embedded image'}
            width={1200}
            height={675}
            className="w-full h-auto object-cover"
          />
          {title && (
            <p className="mt-3 text-center text-sm text-zinc-400 dark:text-zinc-500 italic">
              {title}
            </p>
          )}
        </div>
      );
    },
  },
};

export default function RichText({ document }: { document: any }) {
  if (!document) return null;
  return <div className="max-w-none">{documentToReactComponents(document, options)}</div>;
}
