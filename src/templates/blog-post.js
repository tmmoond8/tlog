import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout/Layout'
import Content, { HTMLContent } from '../components/Content'
import styled from "styled-components";
import PostList from "../components/PostList";
import THelmet from "../components/THelmet";

const PostWrapper = styled.div`
  display: flex;

  ${props => props.theme.media.tablet`
    flex-direction: column-reverse;
  `}
`;

const PostSection = styled.section`
  flex: 1;
  margin-left: ${props => props.theme.size.postListWidth};
  padding: 3rem;
  background-color: ${props => props.theme.color.white};

  ${props => props.theme.media.tablet`
    margin-left: 0;
    padding: 1rem;
  `}
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
    <PostWrapper>
      <PostList posts={posts}/>
      <PostSection className="post-section">
        {helmet || ''}
        <ContentContainer>
          <Title>{title}</Title>
          <Description>{description}</Description>
          <PostContent content={content} />
        </ContentContainer>
      </PostSection>
    </PostWrapper>
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
          <THelmet 
            title={post.frontmatter.title}
            description={post.frontmatter.description}
            tag={post.frontmatter.tags[0]}
          />
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
            date
          }
        }
      }
    }
  }
`
