---
templateKey: blog-post
title: React 에서 SSR 고급
date: 2020-05-02T08:56:56.243Z
description: 효율적인 SSR 처리방법
featuredpost: true
featuredimage: /img/cover/react.png
tags:
  - react
  - ssr
---

#

정적인 페이지를 서버에서 정적 페이지로 내려주면 빠르게 보여줄 수 있어서 좋다. 그런데 매번 서버에서 렌더링할 필요가 있을까? 매번 하는 것은 자원의 낭비이므로 빌드 타임에 한 번 렌더링하도록 설정해보자.

대부분의 페이지는 정적인 페이지로만 이루어져 있지 않고 서버로 부터 데이터를 가져와서 일부분을 재 렌더링 하도록 되어 있다. 그렇다면 서버로 부터 데이터를 받는 부분을 제외한 곳을 미리 렌더링 할 것이다.

페이지에서 일부분을 클라이언트에서 재렌더링 하도록 페이지를 수정하자.

- src/App.js

  ```bash
  ...
  import Icon from './kangaroo-c.png';

  function fetchUsername() {
    const usernames = ['mike', 'june', 'jamie'];
    return new Promise((resolve) => {
      const username = usernames[Math.floor(Math.random() * 3)];
      setTimeout(() => resolve(username), 100);
    })
  }

  const Container = styled.div`
    background-color: #aaa;
    border: 1px solid blue;
  `;

  ...

  class App extends React.Component {
    state = {
      page: this.props.page,
    }

    componentDidMount() {
      window.onpopstate = event => {
        this.setState({ page: event.state });
      };
      fetchUsername().then(username => this.setState({ username }));
    }

    onChangePage = e => {
  		...
    };

    render() {
      const { page, username } = this.state;
      const PageComponent = page === 'home' ? Home : About;
      return (
        <Container className="container">
          ...
          <img src={Icon}/>
          <PageComponent username={username}/>
        </Container>
      )
    }
  }

  export default App;
  ```

- src/pages/Home.js

  ```bash
  import React from 'react';

  export default function Home({ username}) {
    return (
      <div>
        <h3>This is home page</h3>
        {username && <p>{`${username} 님 안녕하세요`}</p>}
      </div>
    )
  }
  ```

이렇게 하면 사용자 이름은 서버에서 렌더링 하지 않고 클라이언트에서 렌더링 할 것이다.

이제 미리 렌더링할 페이지를 그리는 설정을 할 것이다. 페이지를 그리는 스크립트를 생성하고 webpack에서 스크립트를 실행해서 정적 페이지를 미리 생성하도록 할 것이다.

## 페이지 미리 렌더링

---

- src/common.js

  ```jsx
  import fs from "fs";
  import path from "path";
  import { renderToString } from "react-dom/server";
  import React from "react";
  import App from "./App";
  import { ServerStyleSheet } from "styled-components";

  const html = fs.readFileSync(
    path.resolve(__dirname, "../dist/index.html"),
    "utf8"
  );

  export const prerenderPages = ["home"];

  export function renderPage(page) {
    const sheet = new ServerStyleSheet();
    const renderString = renderToString(
      sheet.collectStyles(<App page={page} />)
    );
    const styles = sheet.getStyleTags();
    const result = html
      .replace('<div id="root"></div>', `<div id="root">${renderString}</div>`)
      .replace("__STYLE_FROM_SERVER__", styles);
    return result;
  }
  ```

  html로 부터 렌더링할 페이지를 가져와 style을 주입하는 것을 역할을 별도의 페이지로 분리했다.

- src/prerender.js

  ```bash
  import fs from 'fs';
  import path from 'path';
  import { renderPage, prerenderPages } from './common';

  for (const page of prerenderPages) {
    const result = renderPage(page);
    fs.writeFileSync(path.resolve(__dirname, `../dist/${page}.html`), result);
  }
  ```

  미리 렌더링할 페이지를 html 파일로 저장하는 스크립트

- src/server.js

  ```jsx
  import express from "express";
  import fs from "fs";
  import path from "path";
  import url from "url";
  import { renderPage, prerenderPages } from "./common";

  const app = express();

  const prerenderHtml = {};
  for (const page of prerenderPages) {
    const pageHtml = fs.readFileSync(
      path.resolve(__dirname, `../dist/${page}.html`),
      "utf8"
    );
    prerenderHtml[page] = pageHtml;
  }

  app.use("/dist", express.static("dist"));
  app.get("/favicon.ico", (req, res) => res.sendStatus(204));
  app.get("*", (req, res) => {
    const parseURL = url.parse(req.url, true);
    const page = parseURL.pathname ? parseURL.pathname.substr(1) : "home";
    const initialData = { page };

    const pageHtml = prerenderPages.includes(page)
      ? prerenderHtml[page]
      : renderPage(page);

    const result = pageHtml.replace(
      "__DATA_FROM_SERVER__",
      JSON.stringify(initialData)
    );
    res.send(result);
  });

  app.listen(3000);
  ```

  페이지를 렌더링하는 부분을 common.js로 분리했고, 요청 받은 페이지가 미리 렌더링 되어있으면, 미리 렌더링한 페이지를 사용하도록 했다.
  여기서는 서버에서 클라이언트에게 내려줄 값만 처리하도록 했다.

- webpack.config.js

  ```jsx
  ...

  function getConfig(isServer, entry) {
    return {
      entry: {
        [entry]: path.resolve(__dirname, `src/${entry}.js`),
      },
  		...
    }
  }

  module.exports = [ getConfig(false, 'index'), getConfig(true, 'server'), getConfig(true, 'prerender')];
  ```

  이제 미리 렌더링할 페이지도 webpack을 통해 빌드 하도록 설정을 추가 했다.

- package.json

  ```json
  ...
  "scripts": {
    "build": "webpack && node dist-server/prerender.bundle.js",
    "start": "node dist-server/server.bundle.js"
  },
  ...
  ```

  `yarn build` 를 하면 dist-server에 prerender.bundle.js 가 생성되고 스크립트가 실행되어 dist/home.html 이 생성된다. 파일을 보면 `__DATA_FROM_SERVER__` 값이 없고, 사용자 이름은 렌더링되지 않았다. 사용자 이름은 클라이언트에서 렌더링 된다.

## 서버사이드 렌더링 캐싱하기

---

페이지를 미리 렌더링할 수도 있고, 만약 내용이 자주 바뀌는 페이지라면 미리 렌더링하는 것은 어렵지만 페이지를 캐싱할수는 있다. 1분만 캐싱해도 매우 많은 자원을 절약할 수 있다.

```bash
$ yarn add lru-cache
```

- src/server.js

  ```jsx
  ...
  import { renderPage, prerenderPages } from './common';
  import LruCache from 'lru-cache';

  const ssrCache = new LruCache({
    max: 100,
    maxAge: 1000 * 60,
  });
  const app = express();

  ...

  app.get('*', (req, res) => {
    const parseURL = url.parse(req.url, true);
    const cacheKey = parseURL.path;
    if (ssrCache.has(cacheKey)) {
      console.log('캐시 사용');
      res.send(ssrCache.get(cacheKey));
      return;
    }
    const page = parseURL.pathname ? parseURL.pathname.substr(1) : 'home';
    const initialData = { page };

    const pageHtml = prerenderPages.includes(page)
      ? prerenderHtml[page]
      : renderPage(page);

    const result = pageHtml
      .replace('__DATA_FROM_SERVER__', JSON.stringify(initialData))
    ssrCache.set(cacheKey, result);
    res.send(result);
  });

  app.listen(3000);
  ```

이렇게 하고 다시 빌드한 뒤 페이지를 열어보자. 처음에는 캐시된 페이지가 그려지지 않지마 새로 고침하면 서버쪽에 '캐시 사용'이라고 로그가 뜰 것이다.

## 서버사이드 렌더링 - renderToNodeStream

---

캐시 까지 적용하였다면, 일반적으로 속도의 문제는 거의 없을 것이다. 여기서 renderToString 대신 rederToNodeStream을 사용하면 바로 응답을 내려주기 때문에 속도를 더 향상 시킬 수 있다.

Stream을 사용하면 큰 파일을 읽을 때도 메모리를 효율적으로 사용할 수 있게 된다.

- src/server.js

  ```jsx
  ...
  import { ServerStyleSheet } from 'styled-components';
  import React from 'react';
  import App from './App';
  import { renderToNodeStream } from 'react-dom/server';

  ...

  const html = fs
    .readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf8')
    .replace('__STYLE_FROM_SERVER__', '');

  app.use('/dist', express.static('dist'));
  app.get('/favicon.ico', (req, res) => res.sendStatus(204));
  app.get('*', (req, res) => {
  	...

    const page = parseURL.pathname ? parseURL.pathname.substr(1) : 'home';
    const initialData = { page };

    const isPrerender = prerenderPages.includes(page);
    const result = (isPrerender ? prerenderHtml[page] : html).replace('__DATA_FROM_SERVER__', JSON.stringify(initialData),);

    if (isPrerender) {
      ssrCache.set(cacheKey, result);
      res.send(result);
    } else {
      const ROOT_TEXT = '<div id="root">';
      const prefix = result.substr(0, result.indexOf(ROOT_TEXT) + ROOT_TEXT.length,);
      const postfix = result.substr(prefix.length);
      res.write(prefix);
      const sheet = new ServerStyleSheet();
      const reactElement = sheet.collectStyles(<App page={page} />);
      const renderStream = sheet.interleaveWithNodeStream(renderToNodeStream(reactElement),);
      renderStream.pipe(res, { end: false });
      renderStream.on('end', () => {
        res.end(postfix);
      });
    }
  });

  app.listen(3000);
  ```

  `rederToString` 에서는 `<div id="root"></div>` 사이에 렌더링된 문자열을 삽입하는 형태로 구현했다. `renderToStream`도 마찬가지로 `<div id="root">` 전을 스트림으로 보내고, `rederToNodeStream`의 결과를 스트림에 보내고 `<div id="root">` 이후를 스트림으로 보내는 형태로 구현된다.

## 서버사이드 렌더링 - Stream Cache

---

스트림으로 전송된 데이터는 캐싱하지 않고 있다. 스트림을 캐싱하기 위해서는 읽기 스트림과 쓰기 스트림 사이에 캐싱을 위한 스트림을 끼워 넣어야 한다.

`renderStream → cacheStream → res`

- src/server.js

  ```jsx
  ...
  import { Transform } from 'stream';

  function createCacheStream(cacheKey, prefix, postfix) {
    const chunks = [];
    return new Transform({
      transform(data, _, callback) {
        chunks.push(data);
        callback(null, data);
      },
      flush(callback) {
        const data = [prefix, Buffer.concat(chunks).toString(), postfix];
        ssrCache.set(cacheKey, data.join(''));
        callback();
      },
    })
  }

  app.get('*', (req, res) => {
  		...
      const cacheStream = createCacheStream(cacheKey, prefix, postfix);
      cacheStream.pipe(res);
      renderStream.pipe(cacheStream, { end: false });
      renderStream.on('end', () => {
        res.end(postfix);
      });
    }
  });

  app.listen(3000);
  ```

  캐싱을 위한 스트림 객체를 생성했다. `transform` 은 `chunk`단위로 데이터 조각이 들어올 때마다 호출된다. 이때 `chunk`를 `chunks[]` 배열에 넣는다. `flush`는 모든 `chunk`가 읽혀졌을 때 호출된다. 그 동안 모은 `chunks[]` 배열의 값들을 `prefix`와 `postfix`를 합쳐서 문자열로 만들어 캐시 객체에 넣는다.
