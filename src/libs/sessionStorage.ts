const SCROLL_HEIGHT = 'TLOG_SCROLL_HEIGHT';

const sessionStorage = globalThis?.sessionStorage;

export default {
  setScroll: (path: string, scrollHeight: number) => {
    if (!sessionStorage) return;
    const scrollMap = JSON.parse(sessionStorage.getItem(SCROLL_HEIGHT) ?? '{}');
    scrollMap[path] = scrollHeight;
    sessionStorage.setItem(SCROLL_HEIGHT, JSON.stringify(scrollMap));
  },
  getScroll: (path: string) => {
    if (!sessionStorage) return 0;
    const scrollMap = JSON.parse(sessionStorage.getItem(SCROLL_HEIGHT) ?? '{}');
    return scrollMap[path] ?? 0;
  },
};
