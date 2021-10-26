// import remark from 'remark';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import html from 'rehype-stringify';
import rehypeExternalLinks from 'rehype-external-links';
import highlight from 'rehype-highlight';

export default async function markdownToHtml(markdown) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(highlight)
    .use(rehypeExternalLinks, { target: '_blank' })
    .use(html)
    .process(markdown);
  return result.toString();
}
