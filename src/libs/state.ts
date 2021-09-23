import { atom, useAtom } from 'jotai';
import type { Post } from '../types';

const recentViewed = atom<Post[]>([]);

export const useRecentViewed = () => useAtom(recentViewed);
