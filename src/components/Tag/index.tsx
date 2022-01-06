import { Aside } from 'notion-ui';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { mobile } from '../../styles';
import type { Post } from '../../types';
import * as tagcons from './tagcons';
import Squircle from '../Squircle';
import { toSafeUrlStr } from '../../libs/string';

interface AsideTagsProps {
  allPosts: Post[];
  handleCloseAside: () => void;
}

export function AsideTags({ allPosts = [], handleCloseAside }: AsideTagsProps) {
  const router = useRouter();
  const tags = allPosts.reduce((accum: Record<string, any>, post) => {
    if (post.tags) {
      post.tags.forEach((tag: string) => {
        if (!Array.isArray(accum[tag])) {
          // eslint-disable-next-line no-param-reassign
          accum[tag] = [];
        }
        accum[tag].push(post);
      });
    }
    return accum;
  }, {} as Record<string, any>);
  const tagKeys = Object.keys(tags).sort((a, b) =>
    tags[a].length > tags[b].length ? -1 : 1
  );

  return (
    <StyledAsideTags>
      <Aside.Group title="TAGS">
        {tagKeys.map((tag) => (
          <Aside.Menu
            title={tag}
            handleClick={() => {
              router.push(`/tags/${toSafeUrlStr(tag)}`);
              handleCloseAside();
            }}
            icon={<TagCon src={getIcon(tag)} size="20px" />}
          />
        ))}
      </Aside.Group>
    </StyledAsideTags>
  );
}

const StyledAsideTags = styled.div`
  flex: 1;
  overflow: hidden;
  .AsideGroup {
    display: flex;
    flex-direction: column;
    height: 100%;
    margin: 0;
  }

  ul {
    height: calc(100% - 24px);
    overflow: auto;

    li img {
      border-radius: 50%;
    }
  }
`;

const TagCon = styled(Squircle)`
  && {
    ${mobile(css`
      height: 26px;
      svg {
        width: 26px;
      }
    `)}
  }
`;

export function getIcon(tag: string) {
  return (
    tagcons[tag.replace(/\s/g, '_')] ??
    'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1558852693/apollo_qczq3j.png'
  );
}
