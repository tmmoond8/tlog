import React from "react";
import styled from "styled-components";

const Tags = styled.ol`
  ${props => props.theme.media.phone`
    background: ${props => props.theme.color.red};
  `}
`;

const Tag = styled.li`
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


export default ({ data }) => (
  <Tags>
    {data.map((tag, index) => <Tag totalCount={tag.totalCount} key={index}>{tag.fieldValue}</Tag>)}
  </Tags>
);