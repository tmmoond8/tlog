import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../../components/Layout'
import Marsonry from "../../components/Masonry";


export const TagsIndexTemplate = ({posts}) => (
  <Marsonry posts={posts}/>
)

TagsIndexTemplate.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string,
  heading: PropTypes.string,
  subheading: PropTypes.string,
  mainpitch: PropTypes.object,
  description: PropTypes.string,
  intro: PropTypes.shape({
    blurbs: PropTypes.array,
  }),
}

const TagsIndex = ({ data }) => {
  const { edges: posts } = data.allMarkdownRemark;
  return (
    <Layout>
      <TagsIndexTemplate
        posts={posts}
      />
    </Layout>
  )
}

TagsIndex.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
}

export default TagsIndex

export const tagsIndexQuery = graphql`
  query TagsIndexTemplate {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
    ) {
      edges {
        node {
          excerpt(pruneLength: 400)
          id
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            date(formatString: "YYYY년 MM월 DD일")
            tags
            featuredpost
            featuredimage {
              childImageSharp {
                fluid(maxWidth: 120, quality: 100) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`
