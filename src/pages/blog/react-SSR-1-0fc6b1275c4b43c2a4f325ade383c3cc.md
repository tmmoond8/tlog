---
templateKey: blog-post
title: React 에서 SSR 설정하기
date: 2020-04-26T08:56:56.243Z
description: SSR 설정을 하면서 원리 이해해보기
featuredpost: true
featuredimage: /img/cover/react.png
tags:
  - react
  - ssr
---

#

## 기본 리액트 프로젝트

---

일단 리액트 프로젝트를 만들자.

```bash
$ mkdir ssr-sample && cd ssr-sample
$ yarn init -y
$ yarn add react react-dom
$ yarn add -D @babel/core @babel/plugin-proposal-class-properties \
							@babel/preset-env @babel/preset-react
$ yarn add -D webpack webpack-cli babel-loader \
							clean-webpack-plugin html-webpack-plugin
```

- src/pages/Home.js

  ```bash
  import React from 'react';

  export default function Home() {
    return (
      <div>
        <h3>This is home page</h3>
      </div>
    )
  }
  ```

- src/pages/About

  ```bash
  import React from 'react';

  export default function About() {
    return (
      <div>
        <h3>This is about page</h3>
      </div>
    )
  }
  ```

- App.js

  ```bash
  import React from 'react';
  import Home from './src/pages/Home';
  import About from './src/pages/About';

  class App extends React.Component {
    state = {
      page: this.props.page,
    };

    componentDidMount() {
      window.onpopstate = event => {
        this.setState({ page: event.state });
      };
    }

    onChangePage = e => {
      const page = e.target.dataset.page;
      window.history.pushState(page, '', `/${page}`);
      this.setState({ page });
    };

    render() {
      const { page } = this.state;
      const PageComponent = page === 'home' ? Home : About;
      return (
        <div className="container">
          <button data-page="home" onClick={this.onChangePage}>
            Home
          </button>
          <button data-page="about" onClick={this.onChangePage}>
            About
          </button>
          <PageComponent />
        </div>
      )
    }
  }

  export default App;
  ```

- index.js

  ```bash
  import React from 'react';
  import ReactDom from 'react-dom';
  import App from './App';

  ReactDom.render(<App page="home" />, document.querySelector('#root'));
  ```

- webpack.config.js

  ```bash
  const path = require('path');
  const { CleanWebpackPlugin } = require('clean-webpack-plugin');
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: '[name].[chunkhash].js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: 'babel-loader',
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './template/index.html',
      }),
    ],
    mode: 'production',
  };
  ```

- babel.config.js

  ```bash
  const presets = ['@babel/preset-react', '@babel/preset-env'];
  const plugins = ['@babel/plugin-proposal-class-properties'];
  module.exports = { presets, plugins };
  ```

- template/index.html

  ```bash
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <title>ssr test</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
  </html>
  ```

```bash
yarn webpack
```

dist 디렉토리에 index.html과 빌드된 리액트 프로젝트 main{hash}.js 파일이 생성된다.

## Node를 사용한 서버 사이드 렌더링

---

서버 사이드 렌더링은 서버에서 리액트 프로젝트를 빌드하여 html 안에 렌더링한 결과를 포함시켜서 내려준다.

먼저, 서버사이드 렌더링에 필요한 모듈을 설치하자.

```bash
$ yarn add -D @babel/cli @babel/plugin-transform-modules-common.js
```

- src/server.js

  ```bash
  import express from 'express';
  import fs from 'fs';
  import path from 'path';
  import { renderToString } from 'react-dom/server';
  import React from 'react';
  import App from './App';

  const app = express();
  const html = fs.readFileSync(
    path.resolve(__dirname, '../dist/index.html'),
    'utf8',
  );
  app.use('/dist', express.static('dist'));
  app.get('/favicon.ico', (req, res) => res.sendStatus(204));
  app.get('*', (req, res) => {
    const renderString = renderToString(<App page="home" />);
    const result = html.replace('<div id="root"/>', `<div id="root">${renderString}</div>`);
    res.send(result);
  });
  app.listen(3000);
  ```

이번에는 바벨 설정 파일을 분리할 것이다. 기존에는 클라언트 사이드에서 리액트 프로젝트를 트랜스 파일링 하기 위한 설정이었는데, 서버사이드 렌더링 할 때는 클라이언트에서 바벨 설정과 차이가 있다. 그러나 많은 부분이 같은 설정을 공유 하므로, 공통 설정 파일을 두고 확장하는 형태로 예제를 만들었다.

- .babelrc.common.js

  ```bash
  const presets = ['@babel/preset-react'];
  const plugins = ['@babel/plugin-proposal-class-properties'];
  module.exports = { presets, plugins };
  ```

- .babelrc.client.js

  ```bash
  const config = require('./.babelrc.common.js');
  config.presets.push('@babel/preset-env');
  module.exports = config;
  ```

- .babelrc.server.js

  ```bash
  const config = require('./.babelrc.common.js');
  config.plugins.push('@babel/plugin-transform-modules-commonjs');
  module.exports = config;
  ```

webpack 설정에 방금 생성한 파일을 바라보도록 수정하자.

- webpack.config.js

  ```bash
  const path = require('path');
  const { CleanWebpackPlugin } = require('clean-webpack-plugin');
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
      filename: '[name].[chunkhash].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/dist',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              configFile: path.resolve(__dirname, '.babelrc.client.js'),
            },
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './template/index.html',
      }),
    ],
    mode: 'production',
  };
  ```

파일을 보면 설정 파일 뿐 아니라 publicPath도 변경하였는데, publicPath는 빌드 된 후 js 파일을 dist/index.html 에 어떤 경로로 지정하여 추가할지 설정하는 옵션이다. 노드서버에서 `/dist` 로 파일을 접근할 수 있게 해줄 것이기 때문에 `/dist` 로 설정하였다.

yarn webpack 으로 클라이언트를 빌드하고, 서버 사이드는 바벨로만 트랜스 파일링하자.

- package.json

  ```json
  ...
  	"scripts": {
      "build-server": "babel src --out-dir dist-server --config-file ./.babelrc.server.js",
      "build": "yarn webpack && yarn build-server",
      "start": "node dist-server/server.js"
    },
  ...
  ```

yarn start 로 서버 사이드 렌더링 실행해보자.

[localhost:3000](http://localhost:3000) 에 요청을 날리면 html에 서버사이드 렌더링을 되어서 내려온다.

아래는 확실히 서버사이드 렌더링을 나타내기 위해 main{hash}.js 파일을 포함하지 않도록 변경했다.

/dist/index.html 에서 <script src="/dist/main{hash}.js"></script> 를 임시로 제거하고 노드 서버를 실행해도 렌더링이 잘 되는 것을 확인할 수 있다.

![SSR%200fc6b1275c4b43c2a4f325ade383c3cc/_2020-04-20__1.00.49.png](SSR%200fc6b1275c4b43c2a4f325ade383c3cc/_2020-04-20__1.00.49.png)

이때 버튼을 누르면 반응을 하지 않는다. 서버 사이드에서는 돔을 그리긴 하지만 이벤트를 붙이지 않기 때문이다. (책에는 ReactDom.render 가 아닌 ReactDom.hydrate 로 그리면 이벤트를 붙여준다고 되어 있지만, 잘 되지 않았다.)

아까 제거한 <script src="/dist/main{hash}.js"></script> 코드를 다시 되살리고 노드 서버를 재 실행하면 버튼이 잘 동작하는 것을 확인할 수 있다.

## 서버 데이터를 클라이언트로 전달

---

서버사이드 렌더링 하면서 생성된 특정 데이터를 클라이언트로 전달 하는 방법을 살펴보자.

[http://localhost:3000/about](http://localhost:3000/about) 으로 접근을 하면 지금은 home 으로 렌더링이 될 것이다. 서버 사이드에서 path를 가져와서 about으로 그리게 하고, 클라이언트로 page 정보를 넘겨서 about 페이지로 유지하도록 해보자.

- template/index.html

  ```html
  ...
  <body>
    <div id="root"></div>
    <script>
      window.__INITIAL_DATA__ = __DATA_FROM_SERVER__;
    </script>
  </body>
  ...
  ```

  글로벌 변수를 만들어 서버에서 데이터를 주입하도록 할 것이다.

- src/server.js

  ```jsx
  import express from "express";
  import fs from "fs";
  import path from "path";
  import { renderToString } from "react-dom/server";
  import React from "react";
  import App from "./App";
  import url from "url";

  const app = express();
  const html = fs.readFileSync(
    path.resolve(__dirname, "../dist/index.html"),
    "utf8"
  );
  app.use("/dist", express.static("dist"));
  app.get("/favicon.ico", (req, res) => res.sendStatus(204));
  app.get("*", (req, res) => {
    const parseURL = url.parse(req.url, true);
    const page = parseURL.pathname ? parseURL.pathname.substr(1) : "home";
    const renderString = renderToString(<App page={page} />);
    const initialData = { page };
    const result = html
      .replace('<div id="root"/>', `<div id="root">${renderString}</div>`)
      .replace("__DATA_FROM_SERVER__", JSON.stringify(initialData));
    res.send(result);
  });
  app.listen(3000);
  ```

  url 에서 path 정보를 가져온 후 서버사이드 렌더링에서도 page를 넘겨주었고, 클라이언트로 보낼 변수인

  `__DATA_FROM_SERVER__` 변수에 서버에서 넘길 데이터를 JSON 스트링으로 넘겨주었다.

- src/index.js

  ```jsx
  import React from "react";
  import ReactDom from "react-dom";
  import App from "./App";

  const initialData = window.__INITIAL_DATA__;
  ReactDom.hydrate(
    <App page={initialData.page} />,
    document.querySelector("#root")
  );
  ```

클라이언트에서는 전역 변수로 넘겨진 값을 리액트 렌더링할 때 변수로 넣어주었다.

## css-module, css-in-js 방식 스타일 적용하기

---

만약 css파일을 html에 추가하는 형태로 개발을 한다면, 문제가 없겠지만, css-module이나 css-in-js 방식으로 스타일을 작성한다면 추가로 작업이 필요하다. 두 가지 방법 모두 자바스크립트 코드가 실행되면서 스타일 코드가 DOM 에 삽입되기 때문이다.

서버에는 DOM이 없으므로 DOM에 포함 시킬 수 없다. 마찬가지로 style을 string으로 html에 포함 시키도록 처리 해줘야 한다.

책에서는 css-in-js 방식 중 가장 많이 사용되는 styled-components를 예로 설명했다.

```bash
$ yarn add styled-components
```

- src/App.js

  ```jsx
  import React from "react";
  import styled from "styled-components";
  import Home from "./pages/Home";
  import About from "./pages/About";

  const Container = styled.div`
    background-color: #aaa;
    border: 1px solid blue;
  `;

  class App extends React.Component {
    state = {
      page: this.props.page,
    };

    componentDidMount() {
      window.onpopstate = (event) => {
        this.setState({ page: event.state });
      };
    }

    onChangePage = (e) => {
      const page = e.target.dataset.page;
      window.history.pushState(page, "", `/${page}`);
      this.setState({ page });
    };

    render() {
      const { page } = this.state;
      const PageComponent = page === "home" ? Home : About;
      return (
        <Container className="container">
          <button data-page="home" onClick={this.onChangePage}>
            Home
          </button>
          <button data-page="about" onClick={this.onChangePage}>
            About
          </button>
          <PageComponent />
        </Container>
      );
    }
  }

  export default App;
  ```

간단하게 styled-components로 스타일을 적용한 컴포넌트로 대체했다.

스타일은 보통 <head> 에 작성을 하는데, 임시 변수 `__STYLE_FROM_SERVER__` 를 추가 한 후 서버 사이드 렌더링 할 때 스타일로 치환 하도록 할 것이다.

- template/index.html

  ```jsx
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <title>ssr test</title>
    __STYLE_FROM_SERVER__
  </head>
  ...
  ```

- src/server.js

  ```jsx
  ...
  import url from 'url';
  import { ServerStyleSheet } from 'styled-components';
  ...
  app.get('*', (req, res) => {
    const parseURL = url.parse(req.url, true);
    const page = parseURL.pathname ? parseURL.pathname.substr(1) : 'home';
    const sheet = new ServerStyleSheet();
    const renderString = renderToString(sheet.collectStyles(<App page={page} />));
    const initialData = { page };
    const styles = sheet.getStyleTags();
    const result = html
      .replace('<div id="root"/>', `<div id="root">${renderString}</div>`)
      .replace('__DATA_FROM_SERVER__', JSON.stringify(initialData))
      .replace('__STYLE_FROM_SERVER__', styles);
    res.send(result);
  });
  app.listen(3000);
  ```

  `ServerStyleSheet` 객체를 생성 하여 `<App page={page} />` 컴포넌트를 렌더링 하여 스타일만 `ServerStyleSheet` 객체에 담고 렌더링한 코드를 `renderToString` 으로 그대로 넘겨주었다. `ServerStyleSheet` 객체에 담긴 스트링 형태의 스타일을 `getStyleTags()` 함수로 꺼내어 html 파일에 주입하였다.

## 이미지 모듈 적용하기

---

리액트 프로젝트에서 이미지 리소스는 웹팩을 통해 관리한다. 그렇기 때문에 서버사이드 렌더링 할 때도 webpack을 사용하도록 변경해야 한다.

바벨 처럼 웹팩의 설정을 거의 유사 하지만, 미묘하게 다르다.

- webpack.config.js

  ```jsx
  const path = require("path");
  const { CleanWebpackPlugin } = require("clean-webpack-plugin");
  const HtmlWebpackPlugin = require("html-webpack-plugin");
  const nodeExternals = require("webpack-node-externals");

  function getConfig(isServer) {
    return {
      entry: isServer
        ? { server: path.resolve(__dirname, "src/server.js") }
        : { main: path.resolve(__dirname, "src/index.js") },
      output: {
        filename: isServer ? "[name].bundle.js" : "[name].[chunkhash].js",
        path: isServer
          ? path.resolve(__dirname, "dist-server")
          : path.resolve(__dirname, "dist"),
        publicPath: "/dist/",
      },
      target: isServer ? "node" : "web",
      externals: isServer ? [nodeExternals()] : [],
      node: {
        __dirname: false,
      },
      optimization: isServer
        ? {
            splitChunks: false,
            minimize: false,
          }
        : undefined,
      module: {
        rules: [
          {
            test: /\.js$/,
            use: {
              loader: "babel-loader",
              options: {
                configFile: path.resolve(
                  __dirname,
                  isServer ? ".babelrc.server.js" : ".babelrc.client.js"
                ),
              },
            },
          },
          {
            test: /\.(png|jpg|jpeg|gif)$/,
            use: {
              loader: "file-loader",
              options: {
                emitFile: isServer ? false : true,
              },
            },
          },
        ],
      },
      plugins: isServer
        ? []
        : [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
              template: "./template/index.html",
            }),
          ],
      mode: "production",
    };
  }

  module.exports = [getConfig(false), getConfig(true)];
  ```

  설정 파일을 가져오는 함수 getConfig를 정의하고 인자를 boolean 값으로 주어 서버 사이드, 클라이언트 사이드 렌더링일 때 각각의 설정값을 가져올 수 있게 했다. 그리고 배열의 형태로 모듈 export를 하면 배열의 갯수 만큼 웹팩이 실행된다.

아래의 샘플 파일을

- src/kangaroo-c.png

  ![SSR%200fc6b1275c4b43c2a4f325ade383c3cc/kangaroo-c.png](SSR%200fc6b1275c4b43c2a4f325ade383c3cc/kangaroo-c.png)

- src/App.js

  ```jsx
  ...
  import About from './pages/About';
  import Icon from './kangaroo-c.png';
  ...
      return (
        <Container className="container">
          <button data-page="home" onClick={this.onChangePage}>
            Home
          </button>
          <button data-page="about" onClick={this.onChangePage}>
            About
          </button>
          <img src={Icon}/>
          <PageComponent />
        </Container>
      )
    }
  }

  export default App;
  ```

컴포넌트에 이미지가 렌더링 되도록 추가 한다.

```bash
$ yarn add webpack-node-externals file-loader
```

- package.json

  ```json
  ...
  scripts": {
    "build": "yarn webpack",
    "start": "node dist-server/server.bundle.js"
  },
  ...
  ```

`yarn build && yarn start`

실행해보면 잘 뜬다.
