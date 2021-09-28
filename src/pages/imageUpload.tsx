import React from 'react';
import styled from '@emotion/styled';
import copy from 'copy-to-clipboard';
import { getAllPosts } from '../libs/api';
import cloudinary from '../libs/cloudinary';

const ImageUploadPage = () => {
  const [images, setImages] = React.useState([]);
  const handleChange = async (e) => {
    const uploaded = await Promise.all(
      Array.from(e.target.files).map((file) =>
        cloudinary.uploadTemp(file as File)
      )
    );
    setImages(uploaded.map(({ imgUrl }) => imgUrl));
  };
  return (
    <Page>
      <input type="file" onChange={handleChange} multiple />
      {images.map((image) => (
        <Image src={image} key={image} onClick={() => copy(image)} />
      ))}
    </Page>
  );
};

export default ImageUploadPage;

export async function getStaticProps() {
  const allPosts = getAllPosts();

  return {
    props: { allPosts },
  };
}

const Page = styled.main`
  height: 100%;
  max-width: 900px;
  margin: 20px auto;
`;

const Image = styled.img`
  display: block;
  height: 300px;
  width: auto;
  margin-top: 60px;
  cursor: pointer;
`;
