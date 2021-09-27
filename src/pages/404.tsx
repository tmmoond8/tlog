import { useRouter } from 'next/router';

export default function NotFoundPage() {
  const router = useRouter();
  router.replace('/');
  return <div>not found page</div>;
}
