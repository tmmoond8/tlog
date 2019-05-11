import React from "react";
import Helmet from "react-helmet";
import logo48 from "../../img/48-logo.png";
import logo64 from "../../img/64-logo.png";

export default ({
  title,
  description,
  image
}) => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title || 'Tlog'}</title>
      <link rel="canonical" href="tlog.tammolo.com" />
      <meta name="description" content={description || "Tamm's dev log"} />
        <link rel="apple-touch-icon" href={logo48} />
        <link rel="apple-touch-icon" sizes="64x64" href={logo64} /> 
        <link rel="canonical" href="http://blog.tammolo.com" />
      <link rel="shortcut icon" href="none"/>
    </Helmet>
  )
}