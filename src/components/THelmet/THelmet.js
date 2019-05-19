import React from "react";
import Helmet from "react-helmet";
import logo64 from "../../img/64-logo.png";
import { getImage } from "../../lib/tagcon";

export default ({
  title,
  description,
  tag
}) => {
  const favicon = tag ? getImage(tag.replace(/ /gi, '-')) : logo64;
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title || 'Tlog'}</title>
      <link rel="canonical" href="tlog.tammolo.com" />
      <meta name="description" content={description || "Tamm's dev log"} />
        <link rel="apple-touch-icon" href={favicon} />
        <link rel="apple-touch-icon" sizes="64x64" href={favicon} /> 
        <link rel="canonical" href="http://tlog.tammolo.com" />
      <link rel="shortcut icon" href={favicon}/>
    </Helmet>
  )
}