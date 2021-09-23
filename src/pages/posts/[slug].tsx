import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import Head from 'next/head';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Content, colors } from 'notion-ui';
import AuthorCard from '../../components/AuthorCard';
import Image from '../../components/Image';
import { getPostBySlug, getAllPosts } from '../../libs/api';
import markdownToHtml from '../../libs/markdownToHtml';
import { getDateGoodLook } from '../../libs/string';
import { desktop } from '../../styles';

export default function Post({ post, morePosts, preview }) {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <div>
      <div>
        <header />
        {router.isFallback ? (
          <p>Loading…</p>
        ) : (
          <>
            <section className="mb-32">
              <Head>
                <title>{post.title} | tlog</title>
                <meta property="og:image" content={post.image} />
              </Head>
              <Main>
                <Content.Text as="H1" marginTop={18}>
                  {post.title}
                </Content.Text>
                <ContentHead>
                  {post.tags && (
                    <Tags>
                      {post.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </Tags>
                  )}
                  <Content.Text fontSize={18}>
                    {getDateGoodLook(post.date)}
                  </Content.Text>
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
  const post = getPostBySlug(params.slug);
  const content = await markdownToHtml(post.content);

  return {
    props: {
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
  width: 100vw;
  margin-left: -24px;
  ${desktop(css`
    width: 100%;
    margin: 42px 0;
  `)}
`;

const Main = styled.main`
  max-width: 900px;
  padding: 0 24px;
  margin: 0 auto 96px auto;
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
    margin-right: 8px;
  }
`;
