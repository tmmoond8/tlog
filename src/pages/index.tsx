import Link from 'next/link';
import { getAllPosts } from '../libs/api';
import Gallery from '../components/Gallery';

const Index = ({ allPosts }) => {
  return (
    <div>
      <Gallery allPosts={allPosts} />
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
