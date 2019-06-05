import React from "react";
import Helmet from "react-helmet";
import logo64 from "../../img/64-logo.png";
import { getImage } from "../../lib/tagcon";
import defaultFeatureImage from '../../img/tlog-image.png'

export default ({
  title,
  description,
  tags,
  featuredImageUrl,
}) => {

  const metaTitle = title || 'Tlog';
  let metaDescription = description || "Tamm's dev log";
  const metaImage = featuredImageUrl || defaultFeatureImage;
  let metaFavicon = logo64;
  if( tags && tags.length > 0 ) {
    metaFavicon = getImage(tags[0].replace(/ /gi, '-'));
    metaDescription += ` (${tags.join(', ')})`
  }

  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{metaTitle}</title>
      <link rel="canonical" href="tlog.tammolo.com" />
      <meta name="description" content={metaDescription} />
      <meta name="og:title" content={metaTitle} />
      <meta name="og:description" content={metaDescription} />
      <meta name="og:type" content="website" />
      <meta name="og:image" content={metaImage} />
      <meta name="og:url" content="http://tlog.tammolo.com"/>
      <meta name="twitter:card" content="summary"/>
      <meta name="twitter:creator" content="Tamm"/>
      <meta name="twitter:title" content={metaTitle}/>
      <meta name="twitter:description" content={metaDescription}/>
      <meta name="google-site-verification" content="PIRsHmgoZCLzu2POg5y_DUts70ScOpV2oLVfpIpFmYg"/>
      <link rel="apple-touch-icon" href={metaFavicon} />
      <link rel="apple-touch-icon" sizes="64x64" href={metaFavicon} /> 
      <link rel="canonical" href="http://tlog.tammolo.com" />
      <link rel="shortcut icon" href={metaFavicon}/>
    </Helmet>
  )
}