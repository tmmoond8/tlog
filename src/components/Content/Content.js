import React from 'react'
import PropTypes from 'prop-types'
import htmlMiddleware from '../../lib/htmlMiddleware';

export const HTMLContent = ({ content, className }) => {
  const html = htmlMiddleware(content);
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
  )
};

const Content = ({ content, className }) => {
  return <div className={className}>{content}</div>;
}
  
Content.propTypes = {
  content: PropTypes.node,
  className: PropTypes.string,
}

HTMLContent.propTypes = Content.propTypes

export default Content
