import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import Head from 'next/head';
import { getPostBySlug, getAllPosts } from '../../libs/api';
import markdownToHtml from '../../libs/markdownToHtml';

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
                <p>{post.title}</p>
                <p>{post.coverImage}</p>
                <p>{post.date}</p>
                <p>{JSON.stringify(post.author)}</p>
              </div>
              <div
                className="post-section"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
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
