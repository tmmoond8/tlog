import { getAllPosts } from '../libs/api';

const Index = ({ allPosts }) => {
  return (
    <div>
      <p>Tlog V2</p>
      <ul>
        {allPosts.map(({ slug, title }) => (
          <li key={slug}>{title}</li>
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
