import React from 'react';
import { Aside } from 'notion-ui';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { useRecentViewed } from '../libs/state';
import localStorage from '../libs/localStorage';
import * as tagcons from './AsideTags/tagcons';

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

  return (
    <RecentViewed>
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
  );
}

const RecentViewed = styled.div`
  max-height: 108px;
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
    tagcons[tag.replace(/\s/g, '_')] ??
    'https://res.cloudinary.com/dgggcrkxq/image/upload/v1558852693/apollo_qczq3j.png'
  );
}
