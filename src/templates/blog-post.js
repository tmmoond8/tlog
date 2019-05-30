import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout/Layout'
import Content, { HTMLContent } from '../components/Content'
import styled from "styled-components";
import PostList from "../components/PostList";
import THelmet from "../components/THelmet";
import FeaturedImage from "../components/PreviewCompatibleImage";
import AuthorCard from '../components/AuthorCard';
import MetaData from '../components/PostMetaData';

const PostWrapper = styled.div`
  display: flex;

  ${props => props.theme.media.tablet`
    flex-direction: column-reverse;
  `}
`;

const ContentWrapper = styled.div`
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

const ContentBody = styled.section`
  max-width: 48rem;
  margin: 0 auto;
`;

const StyledFeaturedImage = styled(FeaturedImage)`
  width: 100%;
  margin: 2rem 0;
`;

const Title = styled.h1`
  font-size: 2rem;
  padding: 1rem 0;
  text-align: center;
`;
const Description = styled.p`
  font-size: 1.2rem;
  padding-top: 3rem;
`;

const ContentHeader = styled.div``;

export const BlogPostTemplate = ({
  content,
  contentComponent,
  description,
  date,
  tags,
  title,
  helmet,
  posts,
  featuredimage,
}) => {
  const PostContent = contentComponent || Content;
  const {
    childImageSharp: {
      original: {
        src
      }
    }
  } = featuredimage;


  return (
    <PostWrapper>
      <PostList posts={posts}/>
      <ContentWrapper>
        <ContentContainer>
          <ContentHeader>
            <AuthorCard/>
            <Title>{title}</Title>
            <MetaData createAt={date} tags={tags}/>
            <Description>{description}</Description>
            <StyledFeaturedImage imageInfo={{
              image: src,
              alt: `featured image thumbnail for post ${title}`,
            }}/>
          </ContentHeader>
          <ContentBody className="post-section">
            {helmet || ''}
            <PostContent content={content} />
          </ContentBody>
        </ContentContainer>
      </ContentWrapper>
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

  const date = new Date(post.frontmatter.date);
  const localeDate = date.toLocaleDateString();

  return (
    <Layout>
      <BlogPostTemplate
        content={post.html}
        contentComponent={HTMLContent}
        description={post.frontmatter.description}
        date={localeDate.substring(0, localeDate.length - 1)}
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
        featuredimage={post.frontmatter.featuredimage}
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
        date
        title
        description
        tags
        featuredimage {
          childImageSharp {
            original {
              src
            }
          }
        }
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
