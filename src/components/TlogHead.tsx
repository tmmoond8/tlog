import React from 'react';
import Head from 'next/head';
import * as tagcons from './AsideTags/tagcons';

interface TlogHeadProps {
  title?: string;
  description?: string;
  tags?: string[];
  image?: string;
}

export default function TlogHead({
  title,
  description,
  tags,
  image,
}: TlogHeadProps) {
  const metaTitle = title || 'Tlog';
  let metaDescription = description || "Tamm's dev log";
  const metaImage =
    image ||
    'https://res.cloudinary.com/dgggcrkxq/image/upload/v1632315208/tlog/cover/npm-feature_oxz3dh.png';
  let metaFavicon = tagcons.Logo;
  if (tags && tags.length > 0) {
    metaFavicon = getIcon(tags[0].replace(/\s/gi, '_'));
    metaDescription += ` (${tags.join(', ')})`;
  }
  return (
    <Head>
      <meta charSet="utf-8" />
      <title>{metaTitle}</title>
      <link rel="canonical" href="tlog.tammolo.com" />
      <meta name="description" content={metaDescription} />
      <meta name="og:title" content={metaTitle} />
      <meta name="og:description" content={metaDescription} />
      <meta name="og:type" content="website" />
      <meta name="og:image" content={metaImage} />
      <meta name="og:url" content="http://tlog.tammolo.com" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content="Tamm" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta
        name="google-site-verification"
        content="PIRsHmgoZCLzu2POg5y_DUts70ScOpV2oLVfpIpFmYg"
      />
      <link rel="apple-touch-icon" href={metaFavicon} />
      <link rel="apple-touch-icon" sizes="64x64" href={metaFavicon} />
      <link rel="canonical" href="http://tlog.tammolo.com" />
      <link rel="shortcut icon" href={metaFavicon} />
    </Head>
  );
}

function getIcon(tag: string) {
  return (
    tagcons[tag.replace(/\s/g, '_')] ??
    'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1558852693/apollo_qczq3j.png'
  );
}
