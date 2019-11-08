import React from 'react'
import PropTypes from 'prop-types'
import GatsbyImage from 'gatsby-image'
import styled from "styled-components";

const StyledPreviewCompatibleImage = styled.div`
  transition: transform 0.5s;
    :hover { 
      transform: scale(1.2);
    }
`;

const PreviewCompatibleImage = ({ imageInfo, className, imgStyle, wrapperStyle }) => {
  const { alt = '', childImageSharp, image } = imageInfo

  if (!!image && !!image.childImageSharp) {
    return (
      <StyledPreviewCompatibleImage>
        <GatsbyImage className={className} style={wrapperStyle} fluid={image.childImageSharp.fluid} alt={alt} imgStyle={imgStyle}/>
      </StyledPreviewCompatibleImage>
    )
  }

  if (!!childImageSharp) {
    return (
      <StyledPreviewCompatibleImage>
        <GatsbyImage  className={className} style={wrapperStyle} fluid={childImageSharp.fluid} alt={alt} imgStyle={imgStyle}/>
      </StyledPreviewCompatibleImage>
    )
  }

  if (!!image && typeof image === 'string')
    return <img  className={className} style={wrapperStyle} src={image} alt={alt} />

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
