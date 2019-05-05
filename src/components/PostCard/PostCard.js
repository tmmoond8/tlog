import React from "react";
import styled from "styled-components";
import PreviewCompatibleImage from '../PreviewCompatibleImage';
import { Link } from "gatsby";

const PostCard = styled.li`
  width: 20rem;
  background: ${prop => prop.theme.color.white};
  margin-bottom: 1rem;
`;

const Image = styled(PreviewCompatibleImage)`
  height: 10rem;
  width: 100%;
`;

const Title = styled.h2`
  padding: 1.5rem; 2rem;
`;

const Index = styled.div`
  flex: 1;
  padding: 1rem;
`;

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

const Heart = styled.li`
  &:before {
    content: "❤️";
    padding-right: .5rem;
  }
`;

const Comments = styled.li`
  &:before {
    content: "💬";
    padding-right: .5rem;
  }
`;

const Tags = styled.li`
  &:before {
    content: "#️⃣";
    padding-right: .5rem;
  }
`;

const Wrapper = styled.div`
  display: flex;
`;

const tagString = (tags) => tags ? tags.join(", ") : "";

export default ({
  data: {
    frontmatter,
    fields
  }
}) => (
  <PostCard>
    <Link to={fields.slug}>
      <Image imageInfo={{
        image: frontmatter.featuredimage,
        alt: `featured image thumbnail for post ${frontmatter.title}`,
      }}/>
      <Title>{frontmatter.title}</Title>
      <Wrapper>
        <Meta>
          <Date>{frontmatter.date}</Date>
          <Heart>56</Heart>
          <Comments>8</Comments>
          <Tags>{tagString(frontmatter.tags)}</Tags>
        </Meta>
        <Index>
          <h3>ejdsjflkdsjf</h3>
          <p>dkflsjfjdskf</p>
          <p>dfmkldsjfsjfkd</p>
          <p>dfmkldsjfsjfkd</p>
          <p>dfmkldsjfsjfkd</p>
          <p>dfmkldsjfsjfkd</p>
          <p>dfmkldsjfsjfkd</p>
        </Index>
      </Wrapper>
    </Link>
  </PostCard>
);