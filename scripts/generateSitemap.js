const fs = require('fs');
const path = require('path');

const today = new Date().toISOString();

const template = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://tlog.tammolo.com</loc>
      <lastmod>${today}</lastmod>
    </url>{{sitemap}}
  </urlset>`;

try {
  const files = fs.readdirSync(path.resolve(__dirname, '../src/MDs'));
  // console.log(d);
  const sitemap = files
    .map(
      (fileName) => `
    <url>
      <loc>https://tlog.tammolo.com/posts/${fileName.replace('.md', '')}</loc>
      <lastmod>${today}</lastmod>
    </url>`
    )
    .join('');
  fs.writeFileSync(
    path.resolve(__dirname, '../public/sitemap.xml'),
    template.replace('{{sitemap}}', sitemap),
    {
      encoding: 'utf8',
      flag: 'w',
    }
  );
} catch (error) {
  console.error(error);
}
