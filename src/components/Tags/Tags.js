import React from "react";
import styled from "styled-components";

const Tags = styled.ol`
  ${props => props.theme.media.phone`
    background: ${props => props.theme.color.red};
  `}
`;

const Tag = styled.li`
  color: ${props => props.theme.color.white};
  font-weight: 300;
  padding: 1rem 0;
  text-align: center;
  &:after {
    content: "(${props => props.totalCount})";
    padding-left: .5rem;
  }
`;


export default ({ data }) => (
  <Tags>
    {data.map((tag, index) => <Tag totalCount={tag.totalCount} key={index}>{tag.fieldValue}</Tag>)}
  </Tags>
);