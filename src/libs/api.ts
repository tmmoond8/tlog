import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { Post } from '../types';

const postsDirectory = join(process.cwd(), './src/MDs');

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug) {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const fields = [
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
    'date',
    'content',
  ];

  const items: Post = {
    title: '',
    date: '',
    slug: '',
    content: '',
    ogImage: '',
    coverImage: '',
  };

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug;
    }
    if (field === 'content') {
      items[field] = content;
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field];
    }
  });

  return items;
}

export function getAllPosts() {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    // sort posts by date in descending order
    .sort((post1: { date: string }, post2: { date: string }) =>
      post1.date > post2.date ? -1 : 1
    );
  return posts;
}
