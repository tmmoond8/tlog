---
title: Next.js SSR Styled-component (.feat TS)
date: '2019-08-26T13:33:01.092Z'
description: Styled-Components로 컴포넌트를 작성해보자.
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952586/tlog/nextjs9_y7wygj.png'
tags:
  - NextJS
  - React
  - SSR
  - 'Styled Components'
---

[Next.js + Styled Components The Really Simple Guide ▲ + 💅](https://dev.to/aprietof/nextjs--styled-components-the-really-simple-guide----101c)

Styled Component를 사용하는 다양한 패턴이 있다. 그 중에 개인 적으로 가장 선호하는 방식은 nomad coders에서 니콜라스가 제시하는 styled component를 테마를 포함하여 재정의 해서 사용하는 방식을 선호한다.

## TMI

1. richg0ld 의 biolderplate 

     richg0ld는 필요할 때 theme을 임포트 해서 styled랑 같이 쓰는 방식

2. velopert

    velog를 기준으로 검토하였는데, scss를 사용하다가 styled-component를 적용하여서 매우 강력하게 적용되어 있지는 않다.

3. 니콜라스(nomad coders)

    styled-component를 확장 하여 사용할 수 있게 한다.

## 프로젝트에 적용

위에서 설명한 것 처럼 니콜라스의 styled-components  사용 방식으로 진행

    $ npm i -D add styled-components styled-reset react-sizes
    $ npm i --save-dev @types/styled-components @types/react-sizes

**스타일 구조**

    ├── styles
    │   ├── global-styles.ts           # reset 또는 공통적으로 사용하는 css
    │   ├── theme.ts                   # 공통적으로 사용할 테마(media query, color 등)
    │   └── themed-components.ts       # 테마를 포함하여 재정의한 styled-components

### Style 관련 파일 정의

- styles/global-styles.ts
  ```typescript
  import reset from "styled-reset";
  import { createGlobalStyle } from "styled-components";
  
  const GlobalStyle = createGlobalStyle`
    ${reset}
    * {
      box-sizing: border-box;
    }
    body{
      font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
    }
    a {
      color: inherit;
      text-decoration: none;
    }
    input, button {
      background-color: transparent;
      border: none;
      outline: none;
    }
    h1, h2, h3, h4, h5, h6{
      font-family:'Maven Pro', sans-serif;
    }
  
    @media only screen and (max-width: 768px) {
      body {
        font-size: 12px;
      }
    }
  
    @media only screen and (max-width: 576px) {
      body {
        font-size: 10px;
      }
    }
  `;
  
  export default GlobalStyle;
  ```

- styles/theme.ts
  ```typescript
  import baseStyled, { css, ThemedStyledInterface } from 'styled-components';
  
  const sizes = {
    desktop: 1167,
    tablet: 778,
    phone: 576,
  };
  
  // Iterate through the sizes and create a media template
  const media = {
    desktop: (...args) => undefined,
    tablet: (...args) => undefined,
    phone: (...args) => undefined,
  };
  
  Object.keys(sizes).reduce((acc, label: string) => {
    acc[label] = (...args) => css`
      @media (max-width: ${sizes[label]}px) {
        ${css(args.shift(), ...args)}
      }
    `;
    return acc;
  },                        media);
  
  const color = {
    blue: '#2054ae',
    pink: '#c43683',
    black: '#24272a',
  };
  
  const theme = {
    color,
    media,
  };
  
  export type Theme = typeof theme;
  export const styled = baseStyled as ThemedStyledInterface<Theme>;
  export default theme
  ```

- styles/withSizes.ts      media query 외에도 경우에 따라서는 현재 화면의 너비를 가져와서 처리해야 할 때가 있다.(react는 display: none 보다는 특정 값으로 그릴지 말지를 판단하는 쪽을 선호한다.)  
  ```typescript
  import reactSizes from 'react-sizes';
  import { DeviceSize } from '../styles/themed-components';
  
  const withSizes = (component: { width: number }): { device: DeviceSize } => {
    const { width } = component;
    let device: DeviceSize = 'desktop';
    if (!width) {
      device = 'ssr';
    } else if (width <= 576) {
      device = 'phone';
    } else if (width <= 768) {
      device = 'tablet';
    }
    return {
      device,
    };
  };
  
  export default reactSizes(withSizes) as any;
  ```

- styles/themed-components.ts  
  ```typescript
  import React from 'react';
  import * as styledComponents from 'styled-components';
  import { Theme } from './themes';
  import withSizes from './withSizes';
  export type DeviceSize = 'phone' | 'tablet' | 'desktop' | 'ssr';
  
  type StyledFunction<T> = styledComponents.ThemedStyledFunction<any, Theme>;
  
  function withProps<T, U extends HTMLElement = HTMLElement>(
    styledFunction: StyledFunction<React.HTMLProps<U>>,
  ): StyledFunction<T & React.HTMLProps<U>> {
    return styledFunction;
  }
  
  const {
    default: styled,
    css,
    createGlobalStyle,
    keyframes,
    ThemeProvider,
    ServerStyleSheet,
    ThemeConsumer,
  } = styledComponents as styledComponents.ThemedStyledComponentsModule<Theme>;
  
  export {
    css,
    createGlobalStyle,
    keyframes,
    ThemeProvider,
    withProps,
    ServerStyleSheet,
    withSizes,
    ThemeConsumer,
  };
  
  export default styled;
  ```

### Styled-component를 사용하기 위한 설정

styled-component를 사용다보면 문자열 안에 스타일이 들어가기 때문에 처리를 위해 별도로 babel이 필요하나 보다. 

    npm i --save-dev babel-plugin-styled-components

- .babelrc
  ```json
  {
    "presets": [
      "next/babel"
    ],
    "plugins": [
      [
        "styled-components",
        {
          "ssr": true,
          "displayName": true,
          "preprocess": false
        }
      ]
    ]
  }
  ```

- pages/_app.tsx   전역적으로 설정
  ```typescript
  import App, { Container } from 'next/app';
  import React from 'react';
  import GlobalStyles from '../styles/global-styles';
  import { ThemeProvider } from '../styles/themed-components';
  import theme from '../styles/theme';
  
  class ReactApp extends App<any> {
    public render() {
      const { Component, pageProps } = this.props;
      return (
        <Container>
          <GlobalStyles/>
          <ThemeProvider theme={theme}>
            <Component {...pageProps}/>
          </ThemeProvider>
        </Container>
      );
    }
  }
  
  export default ReactApp;
  ```

- pages/_document.tsx     - SSR에서도 styled-components를 사용하도록 css값 주입
  ```typescript
  import Document, { Head, Main, NextScript } from 'next/document';
  import React from 'react';
  import { ServerStyleSheet } from '../styles/themed-components';
  
  interface IProps {
    styleTags: Array<React.ReactElement<{}>>;
  }
  
  export default class MyDocument extends Document<IProps> {
    static getInitialProps({ renderPage }) {
      const sheet = new ServerStyleSheet();
      const page = renderPage((App) => (props) =>
        sheet.collectStyles(<App {...props} />),
      );
  
      const styleTags = sheet.getStyleElement();
      return { ...page, styleTags };
    }
  
    render() {
      return (
        <html>
          <Head>
            <title>peoplefund</title>
            {this.props.styleTags}
          </Head>
          <body>
            <Main/>
            <NextScript />
          </body>
        </html>
      );
    }
  }
  ```
### Styled-Components 를 이용한 컴포넌트 작성

- components/Sample.tsx
  ```typescript
  import styled, { withProps } from '../styles/themed-components';
  const StyledP = styled.p`
    ${props => props.theme.media.tablet`
      color: black;
      font-size: 5rem;
    `}
    color: ${props => props.theme.color.blue};
    font-size: 10rem;
    div {
      p {
      }
    }
  `;
  
  interface ISample {
    visible: string;
  }
  
  const SampleWithProps = withProps<ISample, HTMLSpanElement>(styled.span)`
    visibility: ${props => props.visible ? 'visible' : 'hidden'};
  `
  
  interface IProps {
    text?: string;
  }
  
  const Test = (props: IProps) => (
    <StyledP>
      <SampleWithProps visible={true}>🐶{props.text}🦄🐔</SampleWithProps>
      <SampleWithProps visible={false}>🐶{props.text}🦄🐔</SampleWithProps>
    </StyledP>
  )
  
  export default Test;
  ```

- pages/index.tsx
  ```typescript
  import Sample from '../components/Sample';
  
  const Index = () => (
    <div>
      <Sample text="Hello Next.js"/>
    </div>
  )
  
  export default Index
  ```

이렇게 styled-component를 사용하는 설정을 마쳤다. 환경에 따라 발생할 수 있고 아닐 수도 있는데, 나는 두 가지 이상한 점이 있었다

반응형 처리 안쪽에서 props를 사용하지 못한다. 이전에는 아래와 같은 코드가 되었지만, 이번에 설정한 곳에서는 잘 되지 않았다.
```typescript
${props => props.theme.media.tablet`
  font-size: ${props => props.isEmpty ? '1.2rem' : '.8rem'};
`}

// 아래처럼 쓰면 되긴 할 것 같다.
${props => props.theme.media.tablet`
  font-size: ${props.isEmpty ? '1.2rem' : '.8rem'};
`}
```

또 두번째는 props에 대한 자동 완성이 안되었던 점이다. (블로그 포스팅을 작성하는 시점에는 잘 되었다.)

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952577/tlog/_2019-08-20__4-1eefe2da-249a-45e7-aa93-609ed3cd7ea3.15.28_rb4mlp.png)

이전에 설정한 프로젝트에서는 자동 완성 기능이 있었는데, 현재 환경에서는 작동하지 않는다.

그리고 또 이상했던 점은 tsconfig.json을 설정하지 않으면 styled-components 도 정상적으로 동작하지 않았다. 정확히 어떤 설정 때문인지는 파악하지 않았지만, 참고할만한 tsconfig.json  파일을 첨부하겠다. (아마 타입스크립트에서 허용하지 않는 규칙을  styled-components에서 사용해서 그런 듯,,)

- tsconfig.json
  ```json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "outDir": "build/dist",
      "module": "esnext",
      "target": "es5",
      "lib": [
        "es6",
        "dom",
        "esnext.asynciterable"
      ],
      "sourceMap": true,
      "allowJs": true,
      "jsx": "preserve",
      "moduleResolution": "node",
      "rootDir": ".",
      "forceConsistentCasingInFileNames": true,
      "noImplicitReturns": true,
      "noImplicitThis": true,
      "noImplicitAny": false,
      "importHelpers": true,
      "strictNullChecks": true,
      "suppressImplicitAnyIndexErrors": true,
      "noUnusedLocals": true,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "allowSyntheticDefaultImports": true,
      "strict": true,
      "resolveJsonModule": true,
      "isolatedModules": true,
      "noEmit": true,
      "experimentalDecorators": true
    },
    "exclude": [
      "node_modules",
      "build",
      "scripts",
      "acceptance-tests",
      "webpack",
      "jest",
    ],
  }
  ```