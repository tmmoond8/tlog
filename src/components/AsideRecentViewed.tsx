import React from 'react';
import { Aside } from 'notion-ui';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { useRecentViewed } from '../libs/state';
import localStorage from '../libs/localStorage';
import { getIcon } from './Tag';

export default function AsideRecentViewed() {
  const [recentViewed, setRecentViewed] = useRecentViewed();
  const router = useRouter();
  React.useEffect(() => {
    if (recentViewed.length === 0) {
      const stored = localStorage.getViewHistory();
      setRecentViewed([...recentViewed, ...stored]);
    }
  }, []);

  recentViewed.sort((a, b) => (a.date < b.date ? 1 : -1));
  const height = Math.min(24 + recentViewed.length * 28, 108);

  return (
    <>
      {recentViewed.length > 0 && (
        <RecentViewed height={height}>
          <Aside.Group title="RECENT VIEWD">
            {recentViewed.map((post) => (
              <Aside.Menu
                key={post.slug}
                title={post.title}
                handleClick={() => router.push(`/posts/${post.slug}`)}
                iconUrl={getIcon(post.tags[0])}
              />
            ))}
          </Aside.Group>
        </RecentViewed>
      )}
    </>
  );
}

const RecentViewed = styled.div<{ height: number }>`
  min-height: ${(p) => `${p.height}px`};
  max-height: ${(p) => `${p.height}px`};
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
