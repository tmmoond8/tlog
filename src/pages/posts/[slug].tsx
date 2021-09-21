import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import Head from 'next/head';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Content } from 'notion-ui';
import AuthorCard from '../../components/AuthorCard';
import Image from '../../components/Image';
import { getPostBySlug, getAllPosts } from '../../libs/api';
import markdownToHtml from '../../libs/markdownToHtml';
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
            <article className="mb-32">
              <Head>
                <title>{post.title} | tlog</title>
                <meta property="og:image" content={post.ogImage.url} />
              </Head>
              <div>
                <p>{post.date}</p>
              </div>
              <Main>
                <Content.Text as="H1">{post.title}</Content.Text>
                <Cover>
                  <Image src={post.image} width={1054} height={500} />
                </Cover>
                <div
                  className="post-section"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                <AuthorCard />
              </Main>
            </article>
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
  margin: 16px 0;
  width: 100vw;
  margin-left: -24px;
  ${desktop(css`
    width: 100%;
    margin: 24px 0;
  `)}
`;

const Main = styled.main`
  max-width: 900px;
  padding: 0 24px;
  margin: 0 auto 96px auto;
`;
