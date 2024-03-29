---
title: NEXT.JS
date: '2019-05-12T13:33:01.092Z'
description: 공식 문서 튜토리얼을 따라 하며 기록
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952587/tlog/nextjs8_k2cxq7.png'
tags:
  - NextJS
  - React
  - SSR
---

Nextjs의 튜토리얼을 따라해보았습니다. 리액트를 사용하고SSR을 제공하고 추후에 라도 제공해야 한다면 nextjs프레임워크를 고려하면 좋을 것 같습니다. 동형 렌더링을 제공하려면 아마 많은 삽질을 하게 될 것인데 nextjs는 이런 삽질을 피할 수 있습니다.

 본문은 일기 형식으로 평소에 쓰기 때문에 짧게 썼습니다.

# NEXT JS

Production, SSR, SEO, Static Web, Enterprise Electron, lightweight, desktop, mobile 을 위한 **리액트 프레임워크**라고 소개한다.

## nextjs 의 특징

next.js의 공식 문서에서 거론하는 특징이다.

- Server-rendered by default
- Automatic code splitting for faster page loads
- Simple client-side routing (page based)
- Webpack-based dev environment which supports [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/)(HMR)
- Able to implement with Express or any other Node.js HTTP server
- Customizable with your own Babel and Webpack configurations

## [Getting Started](https://nextjs.org/learn/basics/getting-started)

next.js 간단히 시작해보자.

```bash
$ mkdir hello-next
$ cd hello-next
$ npm init -y
$ npm install --save react react-dom next
$ mkdir pages
```

- package.json 에 스크립트를 조금 수정해보자.
  ```json
  {
    "scripts": {
      "dev": "next",
      "build": "next build",
      "start": "next start"
    }
  }
  ```

npm 으로 실행 시키면 기본 앱이 실행된다.
```bash
$ npm run dev
```

아래는 컴포넌트 하나인데, 특이 점이라면 React를 임포트 시키지 않은거??

- pages/index.js
  ```jsx
  const Index = () => (
    <div>
      <p>Hello Next.js</p>
    </div>
  )
  
  export default Index
  ```

## **[Navigate Between Pages](https://nextjs.org/learn/basics/navigate-between-pages)**

nextjs가 편한게 라우팅을 알아서 해준다는 거다.

위에서 커맨드라인으로 pages 디렉토리를 만들었는데, pages는 특별한 역할을 수행한다. pages 등록된 파일 이름으로 자동으로 endpoint를 만들기 때문이다. (이건 gatsby랑 비슷한것 같다.)

- pages/about.js
  ```jsx
  export default function About() {
    return (
      <div>
        <p>This is the about page</p>
      </div>
    )
  }
  ```

    [http://localhost:3000/about](http://localhost:3000/about) 에 접속 해보면 페이지가 뜬다.

next.js 튜토리얼을 다운받아서 하나하나 특징을 이해보자.
```bash
$ git clone https://github.com/zeit/next-learn-demo.git
$ cd next-learn-demo
$ cd 1-navigate-between-pages
```

next-learn-demo 디렉토리에 들어가면 step 1 부터 step 8까지 진열되어 있다.
```bash
$ npm install
$ npm run dev
```

다른 페이지로 이동할 때는 next/link 모듈의 Link를 사용한다.

- pages/index.js
  ```jsx
  // This is the Link API
  import Link from 'next/link'
  
  const Index = () => (
    <div>
      <Link href="/about">
        <a>About Page</a>
      </Link>
      <p>Hello Next.js</p>
    </div>
  )
  
  export default Index
  ```

[http://localhost:3000/](http://localhost:3000/) 에 접근하면 링크할 수 있는 페이지가 생긴 것을 알 수 있다. `react`에서는 `location.history` 를 이용해서 하는 일을 `next/link`가 알아서 해준다.

여기서 Link에 title과같은 속성을 주면 어떻게 될까???

Link 컴포넌트는 Hider Order Component라고 해서 특별한 기능을 수행하는 컴포넌트다. 여기서 Link 컴포넌트는 `href` 속성을 받아서 `href`로 들어간 값 예를들면 "/about" 과같이 링크가 이동할 위치를 값을 받아서 해당 위치로 이동하도록 링크 핸들링만 생성하고 실제 DOM에는 나타나지 않는다.

 Link 자식 요소로 `<a/>` 가 왔지만 다른 태그 심지어 div가 와도 전혀 문제 될게 없다. 안쪽에서는 onClick으로 동작 하도록 처리가 되어 있기 떄문이다.

## [Using Shared Components](https://nextjs.org/learn/basics/using-shared-components)

웹앱을 만들거나 일반 웹페이지를 만들 때도, 여러 페이지를 만들 공통으로 가지는 레이아웃이 있다.(header, footer, aside 등)

이런 레이아웃을 공통으로 잘 처리하기 위해서 컴포넌트로 레이아웃을 구성하는 두 방법에 대해 소개한다.
```bash
$ cd ../2-using-shared-components
$ npm install
$ npm run dev
```

- components/Header.js
  ```jsx
  import Link from 'next/link'
  
  const linkStyle = {
    marginRight: 15
  }
  
  const Header = () => (
    <div>
      <Link href="/">
        <a style={linkStyle}>Home</a>
      </Link>
      <Link href="/about">
        <a style={linkStyle}>About</a>
      </Link>
    </div>
  )
  
  export default Header
  ```

components 라는 디렉토리를 만들고 Header 컴포넌트를 만들자. 그리고 index.js에서 이 컴포넌트를 그리도록 하자.

- pages/index.js
  ```jsx
  import Header from '../components/Header'
  
  export default function Index() {
    return (
      <div>
        <Header />
        <p>Hello Next.js</p>
      </div>
    )
  }
  ```

> components라는 디렉토리를 만들어서 컴포넌트를 정의했지만, components라는 디렉토리는 특별하지 않다. 다른 이름으로 바꾸어도 무방하다. 다만, pages 디렉토리만 routing을 위해서 존재하는 특별한 디렉토리다.

- components/MyLayout.js 헤더를 포함하는 전체 레이아웃 컴포넌트를 정의한다.
  ```jsx
  import Header from './Header'
  
  const layoutStyle = {
    margin: 20,
    padding: 20,
    border: '1px solid #DDD'
  }
  
  const Layout = props => (
    <div style={layoutStyle}>
      <Header />
      {props.children}
    </div>
  )
  
  export default Layout
  ```

- pages/index.js
  ```jsx
  import Layout from '../components/MyLayout.js'
  
  export default function Index() {
    return (
      <Layout>
        <p>Hello Next.js</p>
      </Layout>
    )
  }
  ```

- pages/about.js
  ```jsx
  import Layout from '../components/MyLayout.js'
  
  export default function About() {
    return (
      <Layout>
        <p>This is the about page</p>
      </Layout>
    )
  }
  ```

이런 방법은 next.js의 특징은 아니고 react.js의 특징이므로 자세히 다루지는 않는다. [https://nextjs.org/learn/basics/using-shared-components/rendering-children-components](https://nextjs.org/learn/basics/using-shared-components/rendering-children-components) 가면 유사한 형태 두 개 를 더 소개한다. 궁금하면 참고하면 될 것 같다.

## [Create Dynamic Pages](https://nextjs.org/learn/basics/create-dynamic-pages)

페이지에는 query 를 받아서 처리하는 경우가 있다. 이럴 경우는 어떻게 할까? 예를 들면 아래 같이 title을 입력 받아서 페이지 내용에 포함하고 싶을 경우 말이다.

[http://localhost](http://localhost:3000/about)?title=abc
```bash
$ cd ../3-create-dynamic-pages
$ npm install
$ npm run dev
```

?title=abc 같은 쿼리는 어떻게 처리 할까? 이런 url 처리를 위한 모듈이 있다. next/router 모듈의 withRouter를 사용해서 페이지 컴포넌트를 감싸면 props에 router 라는 프로퍼티가 추가가 된다.

- pages/post.js
  ```jsx
  import { withRouter } from 'next/router'
  import Layout from '../components/MyLayout.js'
  
  const Content = withRouter(props => (
    <div>
      <h1>{props.router.query.title}</h1>
      <p>This is the blog post content.</p>
    </div>
  ))
  
  const Page = props => (
    <Layout>
      <Content />
    </Layout>
  )
  
  export default Page
  ```

- pages/index.js
  ```jsx
  import Layout from '../components/MyLayout.js'
  import Link from 'next/link'
  
  const PostLink = props => (
    <li>
      <Link href={`/post?title=${props.title}`}>
        <a>{props.title}</a>
      </Link>
    </li>
  )
  export default function Blog() {
    return (
      <Layout>
        <h1>My Blog</h1>
        <ul>
          <PostLink title="Hello Next.js" />
          <PostLink title="Learn Next.js is awesome" />
          <PostLink title="Deploy apps with Zeit" />
        </ul>
      </Layout>
    )
  }
  ```

이렇게 하고 페이지링크가 잘 되는지 확인해보자.

## [Clean URLs with Route Masking](https://nextjs.org/learn/basics/clean-urls-with-route-masking)

위에서 포스팅 페이지를 보면 주소가 [http://localhost:3000/post?title=Learn Next.js%2is%2awesome](http://localhost:3000/post?title=Learn%20Next.js%20is%20awesome) 처럼 되어 있는 것을 확인할 수 있다.

next.js 개발자들은 이게 좀 지저분해 보였나 보다.
```bash
$ cd ../4-clean-urls
$ npm install
$ npm run dev
```

- pages/index.js
  ```jsx
  import Layout from '../components/MyLayout.js'
  import Link from 'next/link'
  
  const PostLink = props => (
    <li>
      <Link as={`/p/${props.id}`} href={`/post?title=${props.title}`}>
        <a>{props.title}</a>
      </Link>
    </li>
  )
  
  export default function Blog() {
    return (
      <Layout>
        <h1>My Blog</h1>
        <ul>
          <PostLink id="hello-nextjs" title="Hello Next.js" />
          <PostLink id="learn-nextjs" title="Learn Next.js is awesome" />
          <PostLink id="deploy-nextjs" title="Deploy apps with Zeit" />
        </ul>
      </Layout>
    )
  }
  ```

Link 컴포넌트에 as라는 프로퍼틀을 넣어주었다. 서버를 띄우고 [http://localhost:3000](http://localhost:3000) 에 접근해보자.

링크를 눌러서 들어가면

[http://localhost:3000/post?title=Learn%20Next.js%20is%20awesome](http://localhost:3000/post?title=Learn%20Next.js%20is%20awesome)

였던 주소가 아래처럼 변경된 것을 볼 수 있다. end point를 조금 보기 좋은 형태로 바꾸었다.

[http://localhost:3000/p/learn-nextjs](http://localhost:3000/p/learn-nextjs)

이게 깔끔하기 한데, 이렇게 하면 동작에 문제가 있는 부분이 있다.

브라우저에서 back 버튼과 foward 버튼은 눌러 보면 잘 동작한다. next/link가 location.history를 알아서 처리해준다고 했다.

[http://localhost:3000/p/learn-nextjs](http://localhost:3000/p/learn-nextjs) 에서 back, forward  버튼은 잘 동작한다. 그런데 새로고침을 하면 페이지가 망가진다. 404가 뜬다.

이유는 우리가 별명처럼 따로 정한 Clean URL를 서버에서는 바로 찾을 수 없기 때문이다.

## [Server Side Support for Clean URLs](https://nextjs.org/learn/basics/server-side-support-for-clean-urls)

클릭해서 이동할 때는 잘됐는데, 주소로 접근하거나 새로고침할 때는 왜 찾지 못했지?

 이 Cleanj Url은 클릭을 했을 때 Link 컴폰넌트에서 임의로 교체를 해준 것이기 때문이다. 서버에서 교체한 주소로 접근했을 때는 찾을 수 없는 것이 당연하다. 

 이번에는 node 서버에서도 Clean URL을 통해 접근을 가능하게 하도록 하겠다.
  ```bash
  $ cd ../5-clean-urls-ssr
  $ npm install
  $ npm run dev
  ```

일단 express를 설치하고,,
```
$ npm install --save express
```

- server.js
  ```jsx
  const express = require('express')
  const next = require('next')
  
  const dev = process.env.NODE_ENV !== 'production'
  const app = next({ dev })
  const handle = app.getRequestHandler()
  
  app
    .prepare()
    .then(() => {
      const server = express()
  
      server.get('/p/:id', (req, res) => {
        const actualPage = '/post'
        const queryParams = { title: req.params.id }
        app.render(req, res, actualPage, queryParams)
      })
  
      server.get('*', (req, res) => {
        return handle(req, res)
      })
  
      server.listen(3000, err => {
        if (err) throw err
        console.log('> Ready on http://localhost:3000')
      })
    })
    .catch(ex => {
      console.error(ex.stack)
      process.exit(1)
    })
    ```

- package.json
  ```json
  {
    "scripts": {
      "dev": "node server.js",
      "build": "next build",
      "start": "NODE_ENV=production node server.js"
    }
  }
  ```

npm run dev로 실행을 한다. 코드를 설명하자면, express에서 라우팅을 할 때 `/p/:id` 패턴으로 들어올 경우에 대해서 우리가 필요한 페이지로 매칭해서 그리도록 추가를 해주었고, 일반경로("*")에 대해서는 그냥 그리도록 했다. 이정도 만으로도 Clean URL로 접근이 가능하도록 했다.

## [Fetching Data for Pages](https://nextjs.org/learn/basics/fetching-data-for-pages)

많은 경우에 페이지를 그릴 때 API 서버나 다른 데이터 API를 호출하여 받은 데이터를 가지고 페이지를 그린다. next.js 에서는 server side or clients side에서 렌더링을 할 때 같은 방식으로 컴포넌트에 데이터를 prop을 통해 넘겨주도록 하는 방식을 제공한다.
```
$ cd ../6-fetching-data
$ npm install
$ npm run dev
```

이 데모 앱에서는TVMaze API라는 TV 쇼에 관련된 API를 사용하여 데이터를 가져온다.

동형 렌더링(isomorphic rendering)을 위해 모듈을 다운 받는다.
```bash
$ npm install --save isomorphic-unfetch
```

- pages/index.js
  ```jsx
  import Layout from '../components/MyLayout.js'
  import Link from 'next/link'
  import fetch from 'isomorphic-unfetch'
  
  const Index = (props) => (
    <Layout>
      <h1>Batman TV Shows</h1>
      <ul>
        {props.shows.map(show => (
          <li key={show.id}>
            <Link as={`/p/${show.id}`} href={`/post?id=${show.id}`}>
              <a>{show.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
  
  Index.getInitialProps = async function() {
    const res = await fetch('https://api.tvmaze.com/search/shows?q=batman')
    const data = await res.json()
  
    console.log(`Show data fetched. Count: ${data.length}`)
  
    return {
      shows: data.map(entry => entry.show)
    }
  }
  
  export default Index
  ```

Index 라는 컴포넌트가 props로 전달 된 프로퍼티 중 shows라는 데이터를 사용해서 렌더링하도록 되어 있다.

이 shows라는 데이터는 아래에 getInitialProps 라는 함수가 리턴한 객체에 들어 있는 프로퍼티다.

next.js 에서는 컴포넌트에 getInitialProps라는 data fetch 전용 함수를 제공한다. 굉장히 깔끔한 방법 같다.

위에서 getInitialProps 함수 내부에 함수가 호출될 때 console을 찍도록 되어있다. 페이지에 링크를 통해 들어갈 때, back, forward 버튼을 통해 들어갈 때 그리고 새로고침을 할때 각각 확인해보자.

해보면 알겠지만, 새로고침 할때만 서버쪽 console에 찍히는 것을 확인할 수 있다.

여기서 새로고침 할 때는 SSR을 사용한다는 것을 확인할 수 있다.

이렇게 별도의 큰 작업 없이 동형 렌더링이 가능했다.

아래 두 파트는 남았는데, 특징만 한간히 언급하고 넘긴다. next.js에서 제시하는 스타일링 방식을 선호하는 방식을 아니기도 하고 해서 그렇다. 또 deploy가 굉장히 간결하다는 것은 알겠다. 그냥 npm build 하면 빌드가 되고 npm run dev 하면 개발 환경으로 뜨고 이건 참 편하다. 그런데 deploy파트대로 진행했는데 뭔가 잘 안되었다..

[nextjs에 SCSS적용하기](https://velog.io/@sonaky47/%EC%95%84%EC%A3%BC-%EC%A7%A7%EC%9D%80-%EA%B8%80-Next.js%EC%97%90%EC%84%9C-ScSS%ED%8C%8C%EC%9D%BC-sourcemap-%EA%B8%B0%EB%8A%A5-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0) velog에sonaky47 님이 쓰신 글 참고

- [Styling Components](https://nextjs.org/learn/basics/styling-components)
- [Deploying a Next.js App](https://nextjs.org/learn/basics/deploying-a-nextjs-app)