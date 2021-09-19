import App from 'next/app';
import * as NotionUI from 'notion-ui';
import styled from '@emotion/styled';
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
        >
          <Main>
            {
              // eslint-disable-next-line react/jsx-props-no-spreading
              <Component {...pageProps} />
            }
          </Main>
        </NotionUI.Layout.App>
      </>
    );
  }
}

export default TlogApp;

const Main = styled.main`
  max-width: 900px;
  padding: 0 24px;
  margin: 0 auto 96px auto;
`;
