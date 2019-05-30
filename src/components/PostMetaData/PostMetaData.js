import React from 'react'
import { Link } from "gatsby";
import styled from "styled-components";


const MetaData = styled.ul`
  display: flex;
  justify-content: center;
  padding: 0 !important;
  margin: 0 auto;
  color: gray;
  font-size: .8rem;
  & > li {
    padding: 0 1rem;
  }
  li + li {
    border-left: 1px solid #aaaaaa;
  }
`;

const CreateAt = styled.li`
  width: 8rem;
  list-style: none !important;
`;

const Tags = styled.ul`
  padding: 0 !important;
  margin: 0 !important;
  li + li {
    border-left: none;
    ::before {
      content: ", "
    }
  }
`;

const renderTags = (tags) => {
  if(!tags) return false;
  return (
    <li style={{listStyle: 'none', margin: '0 !important'}}>
      <Tags>
        {tags.map(tag => (
          <li key={tag} style={{display: 'inline', listStyle: 'none !important'}}>
            <Link to={`/tags/${tag.toLowerCase().replace(/([ .])/gi, "-")}`}>{tag}</Link>
          </li>
        ))}
      </Tags>
    </li>
  )
}

const PostMetaData = (props) => {
  const { createAt, tags } = props;
  return (
    <MetaData>
      <CreateAt><span>{createAt}</span></CreateAt>
      {renderTags(tags)}
    </MetaData>
  )
}

export default PostMetaData;