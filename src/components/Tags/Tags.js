import React from "react";
import styled from "styled-components";
import { Link } from "gatsby";
import { getImage, getEmoji } from "../../lib/tagcon";

const Tags = styled.ol`
  ${props => props.theme.media.phone`
    background: ${props => props.theme.color.red};
  `}
  height: calc(100vh - 9rem);
  overflow: auto;
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
`;

const Tagcon = styled.span`
  display: inline-block;
  width: 2rem;
  height: 2rem;
  vertical-align: middle;
  background-image: url(${props => props.image});
  background-size: contain;
  background-repeat: no-repeat;
  font-size: 2rem;
  border-radius: 1rem;
  margin-right: .5rem;
`;

const TotalCount = styled.span`
  display: inline-block;
  width: 2rem;
  color: ${props => props.theme.color.deepGrey};
  text-align: center;
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
        to={`/tags/${tag.fieldValue.replace(/ /gi, "-")}`}
        title={tag.fieldValue}
      >
        <TotalCount>{tag.totalCount}</TotalCount>
        <Tagcon image={getImage(tag.fieldValue.replace(/ /gi, "-"))}>{getEmoji(tag.fieldValue.replace(/ /gi, "-"))}</Tagcon>
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