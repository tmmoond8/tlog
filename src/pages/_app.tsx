import App from 'next/app';
import GlobalStyles from '../styles/globalStyles';

class TlogApp extends App {
  public render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <GlobalStyles />
        {
          // eslint-disable-next-line react/jsx-props-no-spreading
          <Component {...pageProps} />
        }
      </>
    );
  }
}

export default TlogApp;
