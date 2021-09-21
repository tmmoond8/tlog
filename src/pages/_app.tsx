import App from 'next/app';
import * as NotionUI from 'notion-ui';
import GlobalStyles from '../styles/globalStyles';
import Aside from '../components/Aside';
import DesktopHead from '../components/DesktopHead';

class TlogApp extends App {
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
