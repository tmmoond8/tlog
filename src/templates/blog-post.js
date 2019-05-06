import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'
import styled from "styled-components";
import PostList from "../components/PostList";

const PostSection = styled.section`
  margin-left: ${props => props.theme.size.postListWidth};
  padding: 3rem;
  background-color: ${props => props.theme.color.white};
`;
const ContentContainer = styled.div`
  max-width: 48rem;
  margin: 0 auto;
`;
const Title = styled.h1``;
const Description = styled.p``;

export const BlogPostTemplate = ({
  content,
  contentComponent,
  description,
  tags,
  title,
  helmet,
  posts,
}) => {
  const PostContent = contentComponent || Content;


  return (
    <Fragment>
      <PostList posts={posts}/>
      <PostSection className="post-section">
        {helmet || ''}
        <ContentContainer>
          <Title>{title}</Title>
          <Description>{description}</Description>
          <PostContent content={content} />
        </ContentContainer>
      </PostSection>
    </Fragment>
    // {tags && tags.length ? (
    //   <div style={{ marginTop: `4rem` }}>
    //     <h4>Tags</h4>
    //     <ul className="taglist">
    //       {tags.map(tag => (
    //         <li key={tag + `tag`}>
    //           <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
    //         </li>
    //       ))}
    //     </ul>
    //   </div>
    // ) : null}
  )
}

BlogPostTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  title: PropTypes.string,
  helmet: PropTypes.object,
}

const BlogPost = ({ data }) => {
  const { 
    markdownRemark: post, 
    allMarkdownRemark: {
      edges: posts
    }
  } = data;

  return (
    <Layout>
      <BlogPostTemplate
        content={post.html}
        contentComponent={HTMLContent}
        description={post.frontmatter.description}
        helmet={
          <Helmet titleTemplate="%s | Blog">
            <title>{`${post.frontmatter.title}`}</title>
            <meta
              name="description"
              content={`${post.frontmatter.description}`}
            />
          </Helmet>
        }
        tags={post.frontmatter.tags}
        title={post.frontmatter.title}
        posts={posts}
      />
    </Layout>
  )
}

BlogPost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
    allMarkdownRemark: PropTypes.object,
  }),
}

export default BlogPost

export const pageQuery = graphql`
  query BlogPostByID($id: String!, $tags: [String]!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        description
        tags
      }
    }
    allMarkdownRemark(
      limit: 100
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: $tags } } }
    ) {
      totalCount
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            description
          }
        }
      }
    }
  }
`
