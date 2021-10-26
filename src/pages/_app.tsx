import Router from 'next/router';
import App from 'next/app';
import React from 'react';
import * as NotionUI from 'notion-ui';
import { throttle } from 'throttle-debounce';
import GlobalStyles from '../styles/globalStyles';
import Aside from '../components/Aside';
import TlogHead from '../components/TlogHead';
import DesktopHead from '../components/DesktopHead';
import sessionStorage from '../libs/sessionStorage';

declare global {
  interface Window {
    ga: (action: string, data: string) => void;
  }
}

const scroll = throttle(300, (e) => {
  const { scrollTop, scrollHeight } = e.target;
  const path = window.location.pathname;
  if (scrollHeight > 1200) {
    sessionStorage.setScroll(path, scrollTop);
  }
});

class TlogApp extends App<{ Component: React.FC }> {
  state = {
    isLoading: false,
  };

  public componentDidMount() {
    restoreScroll();
    const sendPageView = () => {
      if (typeof window !== 'undefined' && typeof window.ga === 'function') {
        window.ga('send', window.location.pathname);
      }
    };
    addScroll();
    sendPageView();
    Router.events.on('routeChangeStart', () => {
      this.setState({
        ...this.state,
        isLoading: true,
      });
    });
    Router.events.on('routeChangeComplete', () => {
      sendPageView();
      this.setState({
        ...this.state,
        isLoading: false,
      });
    });
  }

  public componentDidUpdate() {
    restoreScroll();
    addScroll();
  }

  public componentWillUnmount() {
    const desktopEl = document.querySelector('.DesktopLayout > header + div');
    const mobileEl = document.querySelector('.MobileLayout > header + div');
    const contentEl = desktopEl ?? mobileEl;
    if (contentEl) {
      contentEl.removeEventListener('scroll', scroll);
    }
  }

  public render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <GlobalStyles />
        {
          // eslint-disable-next-line react/jsx-props-no-spreading
          pageProps.post ? <TlogHead {...pageProps.post} /> : <TlogHead />
        }
        <NotionUI.Layout.App
          aside={<Aside allPosts={pageProps.allPosts} />}
          leftMenus={<DesktopHead.Left />}
          rightMenus={<DesktopHead.Right />}
          center={
            <NotionUI.Content.Text>
              {pageProps.post?.title ?? ''}
            </NotionUI.Content.Text>
          }
        >
          {this.state.isLoading ? (
            <NotionUI.Loader.ParentFull />
          ) : (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <Component {...pageProps} />
          )}
        </NotionUI.Layout.App>
      </>
    );
  }
}

export default TlogApp;

function restoreScroll() {
  const path = window.location.pathname;
  const scrollHeight = sessionStorage.getScroll(path);
  const desktopEl = document.querySelector('.DesktopLayout > header + div');
  const mobileEl = document.querySelector('.MobileLayout > header + div');
  const contentEl = desktopEl ?? mobileEl;
  if (contentEl) {
    contentEl.scrollTop = scrollHeight;
  }
}

function addScroll() {
  setTimeout(() => {
    const desktopEl = document.querySelector('.DesktopLayout > header + div');
    const mobileEl = document.querySelector('.MobileLayout > header + div');
    const contentEl = desktopEl ?? mobileEl;
    if (contentEl) {
      contentEl.addEventListener('scroll', scroll);
    }
  }, 100);
}
