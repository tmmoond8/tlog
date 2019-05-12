import React from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "gatsby";
import { getImage, getEmoji } from "../../lib/tagcon";

const fadeIn = keyframes`
  from {
    background-color: rgba(100, 100, 100, 0);
      color: transparent;
  }
  to {
    background-color: rgba(100, 100, 100, .8);
      color: white;
  }
`;

const Tags = styled.ol`
  height: calc(100vh - 9rem);
  overflow: auto;
  -webkit-overflow-scrolling: touch;
`;

const Tag = styled.li``;
const StyledLink = styled(Link)`
  display: block;
  color: ${props => props.theme.color.white};
  padding: 1rem;
  padding-left: .5rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  &:hover {
    & > span::after {
      background-color: rgba(100, 100, 100, .8);
      color: white;
      animation: ${fadeIn} .2s ease-in;
    }
    color: ${props => props.theme.color.grey};
  }
`;

const Tagcon = styled.span`
  display: inline-block;
  position: relative;
  width: 2rem;
  height: 2rem;
  vertical-align: middle;
  background-image: url(${props => props.image});
  background-size: contain;
  background-repeat: no-repeat;
  font-size: 2rem;
  border-radius: 1rem;
  margin: 0 .7rem;
  
  &::after {
    display: inline-block;
    position: absolute;
    content: "${props => props.totalCount}";
    width: 2rem;
    height: 2rem;
    top: 0;
    left: 0;
    background-color: rgba(100, 100, 100, 0);
    color: transparent;
    border-radius: 1rem;
    font-size: 1rem;
    text-align: center;
    line-height: 2rem;
  }

`;

const sort = (data) => {
  if(!data) return data;
  data.sort((a, b) => {
    const countDiff = b.totalCount - a.totalCount;
    return countDiff !== 0 ? countDiff : a.fieldValue - b.fieldValue;
  })
  return data;
}

const rednerTag = (data) => {
  if(!data) return false;
  return sort(data).map((tag, index) => (
    <Tag key={index}>
      <StyledLink 
        to={`/tags/${tag.fieldValue.toLowerCase().replace(/([ \.])/gi, "-")}`}
        title={tag.fieldValue}
      >
        <Tagcon 
          image={getImage(tag.fieldValue.replace(/ /gi, "-"))}
          totalCount={tag.totalCount}
        >
          {getEmoji(tag.fieldValue.replace(/ /gi, "-"))}
        </Tagcon>
        {tag.fieldValue} 
      </StyledLink>
    </Tag>
    )
  )
}

export default ({ data }) => (
  <Tags>
    {rednerTag(data)}
  </Tags>
);