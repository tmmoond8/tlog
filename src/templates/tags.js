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

export const TagPostTemplate = ({
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
  )
}

TagPostTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  title: PropTypes.string,
  helmet: PropTypes.object,
}

const TagPost = ({ data }) => {
  const { 
    allMarkdownRemark: {
      edges: posts
    }
  } = data;
  const { node: post } = posts[0];

  return (
    <Layout>
      <TagPostTemplate
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

TagPost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
    allMarkdownRemark: PropTypes.object,
  }),
}

export default TagPost

export const tagPostQuery = graphql`
  query TagPostByID($tag: String!) {
    allMarkdownRemark(
      limit: 100
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          id
          html
          fields {
            slug
          }
          frontmatter {
            title
            description
            date
          }
        }
      }
    }
  }
`
