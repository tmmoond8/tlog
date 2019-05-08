import React from "react";
import styled from "styled-components";
import PostCard from "../PostCard";

const Masonry = styled.ol`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 2rem;
`;


export default ({posts}) => {
  console.log(posts);
  return (

    <Masonry>
    {posts.map(post => <PostCard key={post.node.id} data={post.node}/>)}
  </Masonry>
  )
};

