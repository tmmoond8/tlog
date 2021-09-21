import Link from 'next/link';
import { getAllPosts } from '../libs/api';

const Index = ({ allPosts }) => {
  return (
    <div>
      <p>Tlog V2</p>
      <ul>
        {allPosts.map(({ slug, title }) => (
          <Link key={slug} href={`/posts/${slug}`}>
            {title}
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Index;

export async function getStaticProps() {
  const allPosts = getAllPosts();

  return {
    props: { allPosts },
  };
}
