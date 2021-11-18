import { Aside } from 'notion-ui';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import type { Post } from '../../types';
import * as tagcons from './tagcons';
import Squircle from '../Squircle';
import { toSafeUrlStr } from '../../libs/string';

export default function Tag({ tag }: { tag?: string }) {
  return <>{tag && <StyledTag src={getIcon(tag)} />}</>;
}

interface AsideTagsProps {
  allPosts: Post[];
}

export function AsideTags({ allPosts = [] }: AsideTagsProps) {
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
            handleClick={() => router.push(`/tags/${toSafeUrlStr(tag)}`)}
            icon={<Squircle src={getIcon(tag)} size={26} />}
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

const StyledTag = styled.img`
  height: 1.2em;
  width: 1.2em;
  border-radius: 50%;
  margin-right: 0.3em;
`;

export function getIcon(tag: string) {
  return (
    tagcons[tag.replace(/\s/g, '_')] ??
    'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1558852693/apollo_qczq3j.png'
  );
}
