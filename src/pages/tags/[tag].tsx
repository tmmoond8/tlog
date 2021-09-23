import { getAllPosts } from '../../libs/api';
import Gallery from '../../components/Gallery';
import { toSafeUrlStr } from '../../libs/string';

const Tags = ({ tagContents }) => {
  return <Gallery allPosts={tagContents} />;
};

export default Tags;

export async function getStaticProps({ params }) {
  const allPosts = getAllPosts();
  const tags = allPosts.reduce((accum: Record<string, any>, post) => {
    if (post.tags) {
      post.tags.forEach((_tag: string) => {
        const tag = toSafeUrlStr(_tag);
        if (!Array.isArray(accum[tag])) {
          // eslint-disable-next-line no-param-reassign
          accum[tag] = [];
        }
        accum[tag].push(post);
      });
    }
    return accum;
  }, {} as Record<string, any>);
  const tagContents = tags[params.tag];

  return {
    props: { allPosts, tagContents },
  };
}

export async function getStaticPaths() {
  const allPosts = getAllPosts();
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

  const tagNames = Object.keys(tags).map((tag) => toSafeUrlStr(tag));

  return {
    paths: tagNames.map((tag) => {
      return {
        params: {
          tag,
        },
      };
    }),
    fallback: false,
  };
}
