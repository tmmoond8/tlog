import App from 'next/app';
import * as NotionUI from 'notion-ui';
import { throttle } from 'throttle-debounce';
import GlobalStyles from '../styles/globalStyles';
import Aside from '../components/Aside';
import DesktopHead from '../components/DesktopHead';
import sessionStorage from '../libs/sessionStorage';

const restoreScroll = () => {
  const path = window.location.pathname;
  const scrollHeight = sessionStorage.getScroll(path);
  sessionStorage.setScroll(path, 0);
  const desktopEl = document.querySelector('.DesktopLayout > header + div');
  const mobileEl = document.querySelector('.MobileLayout > header + div');
  const contentEl = desktopEl ?? mobileEl;
  if (contentEl) {
    contentEl.scrollTop = scrollHeight;
  }
};

const addScroll = () => {
  setTimeout(() => {
    const desktopEl = document.querySelector('.DesktopLayout > header + div');
    const mobileEl = document.querySelector('.MobileLayout > header + div');
    const contentEl = desktopEl ?? mobileEl;
    if (contentEl) {
      contentEl.addEventListener(
        'scroll',
        throttle(300, function (e) {
          const { scrollTop } = e.target;
          const path = window.location.pathname;
          sessionStorage.setScroll(path, scrollTop);
        })
      );
    }
  }, 100);
};

class TlogApp extends App {
  public componentDidMount() {
    restoreScroll();
    addScroll();
  }

  public componentDidUpdate() {
    restoreScroll();
    addScroll();
  }

  public render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <GlobalStyles />
        <NotionUI.Layout.App
          aside={<Aside />}
          leftMenus={<DesktopHead.Left />}
          rightMenus={<DesktopHead.Right />}
          center={
            <NotionUI.Content.Text>
              {pageProps.post?.title ?? ''}
            </NotionUI.Content.Text>
          }
        >
          {
            // eslint-disable-next-line react/jsx-props-no-spreading
            <Component {...pageProps} />
          }
        </NotionUI.Layout.App>
      </>
    );
  }
}

export default TlogApp;
