import type { Post } from '../types';
const VIEW_HISTORY = 'TLOG_VIEW_HISTORY';

const localStorage = globalThis?.localStorage;

export default {
  addViewHistory: (post: Post) => {
    if (!localStorage) return [];
    const viewHistory: Post[] = JSON.parse(
      localStorage.getItem(VIEW_HISTORY) ?? '[]'
    );
    if (!viewHistory.find(({ title }) => title === post.title)) {
      viewHistory.push(post);
    }
    localStorage.setItem(VIEW_HISTORY, JSON.stringify(viewHistory));
    return viewHistory;
  },
  getViewHistory: () => {
    if (!localStorage) return [];
    const viewHistory = JSON.parse(localStorage.getItem(VIEW_HISTORY) ?? '[]');
    return viewHistory ?? [];
  },
};
