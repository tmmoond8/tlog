import { Aside } from 'notion-ui';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import type { Post } from '../../types';
import * as tagcons from './tagcons';
import { toSafeUrlStr } from '../../libs/string';

interface AsideTagProps {
  allPosts: Post[];
}

export default function AsideTag({ allPosts = [] }: AsideTagProps) {
  const router = useRouter();
  const tags = allPosts.reduce((accum: Record<string, any>, post) => {
    if (post.tags) {
      post.tags.forEach((tag: string) => {
        if (!Array.isArray(accum[tag])) {
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
    <Tags>
      <Aside.Group title="TAGS">
        {tagKeys.map((tag) => (
          <Aside.Menu
            title={tag}
            handleClick={() => router.push(`/tags/${toSafeUrlStr(tag)}`)}
            iconUrl={getIcon(tag)}
          />
        ))}
      </Aside.Group>
    </Tags>
  );
}

const Tags = styled.div`
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
  }
`;

function getIcon(tag: string) {
  return (
    tagcons[tag.replaceAll(' ', '_')] ??
    'https://res.cloudinary.com/dgggcrkxq/image/upload/v1558852693/apollo_qczq3j.png'
  );
}
