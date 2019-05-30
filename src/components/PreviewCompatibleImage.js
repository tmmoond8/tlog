import React from 'react'
import PropTypes from 'prop-types'
import Img from 'gatsby-image'

const PreviewCompatibleImage = ({ imageInfo, className }) => {
  const imageStyle = { borderRadius: '5px' }
  const { alt = '', childImageSharp, image } = imageInfo

  if (!!image && !!image.childImageSharp) {
    return (
      <Img className={className} style={imageStyle} fluid={image.childImageSharp.fluid} alt={alt} />
    )
  }

  if (!!childImageSharp) {
    return <Img  className={className} style={imageStyle} fluid={childImageSharp.fluid} alt={alt} />
  }

  if (!!image && typeof image === 'string')
    return <img  className={className} style={imageStyle} src={image} alt={alt} />

  return null
}

PreviewCompatibleImage.propTypes = {
  imageInfo: PropTypes.shape({
    alt: PropTypes.string,
    childImageSharp: PropTypes.object,
    image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    style: PropTypes.object,
  }),
}

export default PreviewCompatibleImage
