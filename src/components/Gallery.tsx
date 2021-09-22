import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Content, colors } from 'notion-ui';
import Link from 'next/link';
import Image from '../components/Image';
import { getDateGoodLook } from '../libs/string';
import { desktop } from '../styles';

export default function Gallery({ allPosts }) {
  return (
    <Grid>
      {allPosts.map(({ image, slug, title, description, tags, date }) => (
        <Link key={slug} href={`/posts/${slug}`}>
          <PostCard>
            <CoverImage src={image} width={500} height={260} />
            <PostBody>
              <Content.Text as="H3" fontSize={20}>
                {title}
              </Content.Text>
              <Description marginTop={8} as="P">
                {description}
              </Description>
              <PostInfo>
                <Tags>
                  {tags && tags.map((tag) => <li key={tag}>{tag}</li>)}
                </Tags>
                <Content.Text fontSize={14}>
                  {getDateGoodLook(date)}
                </Content.Text>
              </PostInfo>
            </PostBody>
          </PostCard>
        </Link>
      ))}
    </Grid>
  );
}

const Grid = styled.ol`
  display: grid;
  grid-template-rows: 1fr;
  position: relative;
  grid-template-columns: 1fr;
  grid-gap: 2rem;
  padding: 36px 16px;

  ${desktop(css`
    max-width: 900px;
    margin: 0 auto;
    grid-template-columns: repeat(2, 1fr);
  `)}
`;

const PostCard = styled.li`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  border: 1px solid ${colors.grey32};
  overflow: hidden;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  :hover {
    background-color: ${colors.grey08};
    border: 1px solid ${colors.transparent};
  }
`;

const PostBody = styled.article`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 8px 16px 16px;
`;

const PostInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
`;

const Tags = styled.ol`
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  li {
    background-color: ${colors.grey08};
    padding: 8px 6px 6px 6px;
    color: ${colors.red};
    border-radius: 3px;
    margin-right: 8px;
    font-size: 14px;
  }
`;

const Description = styled(Content.Text)`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  align-items: flex-start;
  height: 58px;
  line-height: 26px;
  max-height: 58px;
`;

const CoverImage = styled(Image)`
  max-height: unset !important;
  min-height: unset !important;
  height: auto !important;
  margin: 0 0 auto 0 !important;
`;
