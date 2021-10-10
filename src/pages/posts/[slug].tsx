import React from 'react';
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Content, colors } from 'notion-ui';
import AuthorCard from '../../components/AuthorCard';
import Image from '../../components/Image';
import Icon from '../../components/Icon';
import { getPostBySlug, getAllPosts } from '../../libs/api';
import markdownToHtml from '../../libs/markdownToHtml';
import { getDateGoodLook } from '../../libs/string';
import localStorage from '../../libs/localStorage';
import { useRecentViewed } from '../../libs/state';
import { desktop, mobile } from '../../styles';
import type { Post } from '../../types';
import { getIcon } from '../../components/AsideTags';

interface PostProps {
  post: Post;
}

export default function Posts({ post }: PostProps) {
  const router = useRouter();
  const [_, setViews] = useRecentViewed();

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  React.useEffect(() => {
    const addRecentPost = () => {
      const currentPost = { ...post, date: new Date().toISOString() };
      const recentViewed = localStorage.addViewHistory(currentPost);
      setViews(recentViewed);
    };
    const timer = setTimeout(addRecentPost, 100);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div>
      <div>
        <header />
        {router.isFallback ? (
          <p>Loading…</p>
        ) : (
          <>
            <section className="mb-32">
              <Main>
                <Title as="H1">
                  <TagIcon src={getIcon(post.tags[0])} /> {post.title}
                </Title>
                <ContentHead>
                  {post.tags && (
                    <Tags>
                      {post.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </Tags>
                  )}
                  <CreatedDate fontSize={18} color={colors.grey60}>
                    {getDateGoodLook(post.date)}
                  </CreatedDate>
                </ContentHead>
                <Cover>
                  <Image src={post.image} width={1024} height={500} />
                </Cover>
                <div
                  className="post-section"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                <AuthorCard />
              </Main>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export async function getStaticProps({ params }) {
  const allPosts = getAllPosts();
  const post = getPostBySlug(params.slug);
  const content = await markdownToHtml(post.content);

  return {
    props: {
      allPosts,
      post: {
        ...post,
        content,
      },
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts();

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}

const Cover = styled.div`
  margin: 32px 0;
  width: 100%;
  ${mobile(css`
    width: 100vw;
    margin-left: -24px;
  `)}
  ${desktop(css`
    margin: 42px 0;
  `)}

  img {
    height: auto !important;
    min-height: unset !important;
    max-height: unset !important;
  }
`;

const Main = styled.main`
  max-width: 900px;
  padding: 0 24px;
  margin: 0 auto 96px auto;
  ${mobile(css`
    padding: 0 16px;
  `)}
`;

const ContentHead = styled.div`
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
    margin: 4px 8px 4px 0;
  }
`;

const CreatedDate = styled(Content.Text)`
  min-width: 132px;
`;

const TagIcon = styled.img`
  height: 54px;
  width: 54px;
  border-radius: 50%;
  margin-right: 16px;
`;

const Title = styled(Content.Text)`
  margin-top: 18px;
  align-items: flex-start;
`;
