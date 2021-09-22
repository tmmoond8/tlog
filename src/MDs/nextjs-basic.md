---
title: Next - 기본편
date: '2020-06-13T08:56:56.243Z'
description: Next.js 기본 다루기
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952586/tlog/nextjs9_y7wygj.png'
tags:
  - NextJS
  - React
  - SSR
---

#

웹팩과 리액트를 충분히 이해하고 있다면 리액트에서 서버사이드 렌더링을 직접 셋업해도 될것이다. 그러나 구성원이 다같이 설정에 대한 이해를 하지 못한다면, Next를 통해 ssr을 하는 것도 좋은 방법이라 생각한다.

```bash
$ mkdir next-study && cd next-study
$ yarn init -y
$ yarn add react react-dom next
```

리액트에서는 라우팅을 별도로 설정을 하지만, Next는 디렉토리 파일 기준으로 라우팅을 처리하도록 되어 있다. 그렇기에 pages 라는 디렉토리를 생성해서 샘플 페이지를 하나 만들자.

- pages/page1.js

  ```jsx
  export default function Page1() {
    return (
      <div>
        <p>This is home page</p>
      </div>
    );
  }
  ```

페이지 하나를 뚝딱 만들었다. 별도로 react를 임포트 하지 않아도 된다. next를 띄워보자.

```bash
$ yarn next
```

Next는 기본적으로 프로젝트 루트에 static 디렉토리를 정적 파일로 serving 한다. static 디렉토리를 생성하고 이미지 파일을 하나 넣고 띠워보자.

- pages/page1.js

  ```jsx
  export default function Page1() {
    return (
      <div>
        <p>This is home page</p>
        <img src="/static/kangaroo-c.png" />
      </div>
    );
  }
  ```

yarn next 명령어를 실행하면, next는 루트 디렉토리에 .next라는 디렉토리를 생성하여 빌드 파일을 생성한다.

server 디렉토리는 서버 사이드 렌더링을 위한 파일이 있고, static은 클라이언트 사이드 렌더링을 위한 파일이 있다.

```jsx
(root)
├── build-manifest.json
├── cache
├── react-loadable-manifest.json
├── server
│   ├── init-server.js             // 서버를 실행시키기 위한 node 서버 코드
│   ├── init-server.js.map
│   ├── on-error-server.js
│   ├── on-error-server.js.map
│   ├── pages-manifest.json
│   ├── ssr-module-cache.js
│   └── static
│       └── development
│           └── pages              // ssr로 페이지를 그리기 위한 파일들
└── static
    ├── chunks                     // 공통으로 사용하는 내부 모듈과 외부 모듈
    │   ├── 0.js
    │   └── 0.js.map
    ├── development
    │   ├── _buildManifest.js
    │   ├── _ssgManifest.js
    │   ├── dll
    │   └── pages                  // 클라이언트 사이드에서 페이지를 렌더링하기 위한 파일
    └── runtime                    // 웹팩 런타임 코드 및
        ├── amp.js
        ├── amp.js.map
        ├── main.js
        ├── main.js.map
        ├── polyfills.js
        ├── polyfills.js.map
        ├── react-refresh.js
        ├── react-refresh.js.map
        ├── webpack.js
        └── webpack.js.map
```

ssr을 지원하는 큰 이유 중 하나는 SEO 때문이다. 간단하게 head 태그에 페이지 정보를 넣도록 해보자.

- pages/page1.js

  ```jsx
  import Head from "next/head";

  export default function Page1() {
    return (
      <div>
        <p>This is home page</p>
        <img src="/static/kangaroo-c.png" />
        <Head>
          <title>page1</title>
        </Head>
        <Head>
          <meta name="description" content="hello world" />
        </Head>
        <style jsx>
          {`
            p {
              color: blue;
              font-size: 18pt;
            }
          `}
        </style>
      </div>
    );
  }
  ```

`yarn next build && yarn next start` 명령으로 프로덕트 빌드해서 실행해보자. head에 meta 데이터가 정상적으로 추가된 것을 확인할 수 있고, style 이 styled-jsx 패키지를 통해 들어간 것을 확인할 수 있다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952591/tlog/_2020-05-03__12.14.09_dp90nh.png)

그리고 Next 도 서버와 클라이언트 사이 데이터 교환을 하는 객체가 존재하는데, 바로 `__NEXT_DATA__` 다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952584/tlog/_2020-05-03__12.17.06_c4wrye.png)

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952582/tlog/_2020-05-03__12.18.45_jgo1fa.png)

Next 에서는 webpack의 설정을 직접 수정할 수 있도록 방법을 제공해준다. next.config.js는 next에서 사용하는 다양한 설정을 추가할 수 있는 예약된 파일이다. 만약 존재하지 않으면 기본 설정을 사용하고, 존재하면 설정값을 덮어쓰는 형식이다.

프로젝트 root에 설정 파일을 추가하고 webpack에 file-loader를 추가할 것인데, 기존의 static 파일을 바라보게 하면, 파일이 바뀌었더라도 브라우저 캐시 때문에 파일 반영이 바로 안되는 문제가 발생한다.

- next.config.js

  ```jsx
  module.exports = {
    webpack: (config) => {
      config.module.rules.push({
        test: /.(png|jpg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]?[hash]",
              emitFile: false,
              publicPath: "/",
            },
          },
        ],
      });
      return config;
    },
  };
  ```

  Next는 static 디렉토리 파일을 그대로 사용하기 때문에 별도 파일 복사를 하지 않아서 `emitFile: false` 이다.

webpack이라는 프로터피에는 Next가 default로 설정한 설정 객체가 넘어온다. 이 객체에 우리가 원하는 설정을 추가해주면 된다.

- pages/page1.js

  ```jsx
  import Head from 'next/head';
  import kangaroo from '../static/kangaroo-c.png';

  export default function Page1() {
    return (
      <div>
        <p>This is home page</p>
        <img src={kangaroo}/>
        <Head>
  	...
  ```

`yarn next` 다시 개발 모드로 띄우면 파일 path에 쿼리가 붙은 것을 확인할 수 있다.

SSR에서는 서버와 클라이언트 사이에 context를 유지하기 위해 데이터를 클라이언트에게 넘겨줄 필요가 있다. 위에서 `__NEXT_DATA__` 의 존재를 확인 했고, Next에서는 이 객체에 원하는 데이터를 넘길 수 있는 메소드를 제공한다. 바로 getInitialProps 다.

- pages/page2.js

  ```jsx
  import { callApi } from "../src/api.js";

  export default class Page2 extends React.Component {
    static async getInitialProps({ query, req }) {
      const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
      const text = query.text || "none";
      const data = await callApi();
      const result = {
        text,
        data,
        userAgent,
      };
      console.log(result);
      return result;
    }

    render() {
      const { text, data, userAgent } = this.props;
      return (
        <div>
          <p>this is home page2</p>
          <p>{`text: ${text}`}</p>
          <p>{`data is ${data}`}</p>
          <p>{`userAgent is ${userAgent}`}</p>
        </div>
      );
    }
  }
  ```

- src/api.js

  ```jsx
  export const callApi = () => {
    return Promise.resolve(123);
  };
  ```

[http://localhost:3000/page2](http://localhost:3000/page1) 에 접근하면 서버에 console이 찍히고 `__NEXT_DATA__` 객체에 우리가 넣어준 데이터가 들어간 것을 확인할 수 있다.

getInitialProps 메서드는 페이지 컴포넌트에 정의할 수 있다. 페이지가 로딩 될 때 해당 페이지에서 정의한 getInitialProps를 호출하고, 그 다음 공통 컴포넌트인 \_app.js의 getInitialProps를 호출한다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952582/tlog/_2020-05-03__9.59.15_ukvtj0.png)

props에는 `getInitialProps`에서 넘겨준 값들이 들어있는데, 특히 각 페이지에서 정의한 값은 pageProps 안에 들어가 있다. getInitialProps는 서버 사이드에서 생성한 store를 클라이언트에게 넘겨줄 때 자주 사용된다.

리액트에서 라우팅 또는 페이지 이동 처리는 리액트와 다르게 별도 패키지를 사용한다.

- pages/page1.js

  ```jsx
  ...
  import Link from 'next/Link';

  export default function Page1() {
    return (
      <div>
        <p>This is home page</p>
        <Link href="/page2" passHref >
          <a>page2로 이동</a>
        </Link>
        <img src={kangaroo}/>
  	    ...
      </div>
    )
  }
  ```

- pages/page2.js

  ```jsx
  ...
  import Router from 'next/Router';

  export default class Page2 extends React.Component {
  	...

    onClick = () => {
      Router.push('/page1');
    }

    render() {
      const { text, data, userAgent } = this.props;
      return (
        <div>
  				...
          <button onClick={this.onClick}>page 1</button>
        </div>
      )
    }
  }
  ```

리액트에서도 컴포넌트 형태의 페이지 이동과 Router 객체를 이용한 방법 모두 지원한다. 둘다 내부적으로 Router객체를 사용하는 것은 마찬 가지다.
