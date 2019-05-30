import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'
import styled from "styled-components";
import PostList from "../components/PostList";
import THelmet from "../components/THelmet";
import FeaturedImage from "../components/PreviewCompatibleImage";
import AuthorCard from '../components/AuthorCard';
import MetaData from '../components/PostMetaData';

// const PostSection = styled.section`
//   margin-left: ${props => props.theme.size.postListWidth};
//   padding: 3rem;
//   background-color: ${props => props.theme.color.white};
//   ${props => props.theme.media.tablet`
//     display: none;
//   `}
// `;
// const ContentContainer = styled.div`
//   max-width: 48rem;
//   margin: 0 auto;
// `;
// const Title = styled.h1``;
// const Description = styled.p``;


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

const StyledFeaturedImage = styled(FeaturedImage)`
  width: 100%;
  margin: 2rem 0;
`;

const ContentContainer = styled.div`
  max-width: 48rem;
  margin: 0 auto;
`;

const ContentBody = styled.section`
  max-width: 48rem;
  margin: 0 auto;
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


export const TagPostTemplate = ({
  content,
  contentComponent,
  description,
  date,
  tags,
  title,
  helmet,
  posts,
  featuredimage
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

TagPostTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  title: PropTypes.string,
  helmet: PropTypes.object,
}

const TagPost = ({ data, pageContext: { tag }}) => {
  const { 
    allMarkdownRemark: {
      edges: posts
    }
  } = data;
  const { node: post } = posts[0];
  
  const date = new Date(post.frontmatter.date);
  const localeDate = date.toLocaleDateString();

  return (
    <Layout>
      <TagPostTemplate
        content={post.html}
        contentComponent={HTMLContent}
        description={post.frontmatter.description}
        date={localeDate.substring(0, localeDate.length - 1)}
        helmet={
          <THelmet 
            title={post.frontmatter.title}
            description={post.frontmatter.description}
            tag={tag}
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
      }
    }
  }
`
