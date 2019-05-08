import React from "react";
import styled from "styled-components";
import { Link } from "gatsby";
import getNiceDate from "../../lib/getNiceDate";

const Posts = styled.ol`
  position: fixed;
  height: 100vh;
  width: ${props => props.theme.size.postListWidth};
  background-color: ${props => props.theme.color.white};
  font-weight: 300;
  border-right: 1px solid ${props => props.theme.color.lightGrey}; 
`;

const Post = styled.li`
  position: relative;
  padding: .8rem;
  color: ${props => props.theme.color.grey};
  border-bottom: 1px solid ${props => props.theme.color.lightGrey};
`;

const Date = styled.p`
  position: absolute;
  right: 0;
  top: 0;
  padding: .5rem;
  font-size: .8rem;
`;

const StyledLink = styled(Link)`
  display: inline-block;
  width: 100%;
  height: 100%;
`;

const Title = styled.h3`
  padding: .5rem 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const Description = styled.p`
  font-size: .8rem;
  line-height: 1.3;
`;

const renderPost = posts => {
  if(!posts) return false;
  return posts.map((post) => (
    <Post key={post.node.id}>
      <Date>{getNiceDate(post.node.frontmatter.date)}</Date>
      <StyledLink to={post.node.fields.slug}>
        <Title>{post.node.frontmatter.title}</Title>
          <Description>{post.node.frontmatter.description}</Description>
      </StyledLink>
    </Post>
  ))
}

export default ({posts}) => (
  <Posts>
    {renderPost(posts)}
  </Posts>
);