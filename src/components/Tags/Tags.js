import React from "react";
import styled from "styled-components";
import { Link } from "gatsby";

const Tags = styled.ol`
  ${props => props.theme.media.phone`
    background: ${props => props.theme.color.red};
  `}
`;

const Tag = styled.li``;
const StyledLink = styled(Link)`
  display: block;
  color: ${props => props.theme.color.white};
  padding: 1rem 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  &:before {
    content: "";
    display: inline-block;
    width: 2rem;
    height: 2rem;
    background-color: red;
    margin-left: 1.5rem;
    margin-right: 1rem;
    vertical-align: middle;
  }
  &:after {
    content: "(${props => props.totalCount})";
    padding-left: .5rem;
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

export default ({ data }) => (
  <Tags>
    {sort(data).map((tag, index) => (
      <Tag key={index}>
        <StyledLink to={`/tags/${tag.fieldValue.replace(/ /gi, "-")}`} totalCount={tag.totalCount}>
          {tag.fieldValue}
        </StyledLink>
      </Tag>)
    )}
  </Tags>
);