// import remark from 'remark';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import html from 'rehype-stringify';
import highlight from 'rehype-highlight';

export default async function markdownToHtml(markdown) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(highlight)
    .use(html)
    .process(markdown);
  return result.toString();
}
