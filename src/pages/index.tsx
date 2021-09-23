import { getAllPosts } from '../libs/api';
import Gallery from '../components/Gallery';

const Index = ({ allPosts }) => {
  return <Gallery allPosts={allPosts} />;
};

export default Index;

export async function getStaticProps() {
  const allPosts = getAllPosts();

  return {
    props: { allPosts },
  };
}
