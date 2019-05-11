import React from "react";
import styled from "styled-components";
import PreviewCompatibleImage from '../PreviewCompatibleImage';
import { Link } from "gatsby";

const PostCard = styled.li`
  position: relative;
  width: 20rem;
  background: ${prop => prop.theme.color.white};
  margin-bottom: 1rem;
  border-radius: .5rem;
  -webkit-box-shadow: -3px 1px 10px 3px rgba(97,95,97,0.4);
  -moz-box-shadow: -3px 1px 10px 3px rgba(97,95,97,0.4);
  box-shadow: -3px 1px 10px 3px rgba(97,95,97,0.4);
`;

const Title = styled.h2`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.color.lightGrey};
`;

const Description = styled.div`
  flex: 1;
  padding: 1rem;
  font-size: .7rem;
  line-height: 1.3;
  font-weight: 300;
`;

// const Index = styled.div`
//   visibility: hidden;
//   position: absolute;
//   top: 0;
//   left: 0;
//   padding: 1rem;
// `;

const Meta = styled.ol`
  width: 50%;
  padding: 1rem;
  color: ${prop => prop.theme.color.red};
  font-size: .7rem;

  li + li {
    padding-top: .8rem;
  }
`;

const Date = styled.li`
  &:before {
    content: "📅";
    padding-right: .5rem;
  }
`;

const Tags = styled.li`
  &:before {
    content: "#";
    padding-right: .5rem;
    color: ${prop => prop.theme.color.black};
    font-size: 1rem;
  }
`;

const Wrapper = styled.div`
  display: flex;
`;

const tagString = (tags) => tags ? tags.join(", ") : "";

export default ({
  data: {
    frontmatter,
    fields,
    tableOfContents
  }
}) => (
  <PostCard>
    <Link to={fields.slug}>
      <PreviewCompatibleImage imageInfo={{
        image: frontmatter.featuredimage,
        alt: `featured image thumbnail for post ${frontmatter.title}`,
      }}/>
      <Title>{frontmatter.title}</Title>
      <Wrapper>
        <Meta>
          <Date>{frontmatter.date}</Date>
          <Tags>{tagString(frontmatter.tags)}</Tags>
        </Meta>
        <Description>
          {frontmatter.description}
        </Description>
        {/* <Index dangerouslySetInnerHTML={{ __html: tableOfContents }}>
        </Index> */}
      </Wrapper>
    </Link>
  </PostCard>
);