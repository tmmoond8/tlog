import React from 'react'
import PropTypes from 'prop-types'
import { BlogPostTemplate } from '../../templates/blog-post'
import theme from "../../styles/theme";
import { ThemeProvider } from "styled-components";

const BlogPostPreview = ({ entry, widgetFor }) => (
  <ThemeProvider theme={theme}>
    <BlogPostTemplate
      content={widgetFor('body')}
      description={entry.getIn(['data', 'description'])}
      tags={entry.getIn(['data', 'tags'])}
      title={entry.getIn(['data', 'title'])}
    />
  </ThemeProvider>
)

BlogPostPreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default BlogPostPreview
