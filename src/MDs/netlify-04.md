---
title: Netlify 4편 functions로 SSR 구현
date: '2021-09-02T08:56:56.263Z'
description: Netlify의 functions을 활용해여 React 프로젝트를 SSR 처리해보자.
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633768694/tlog/cover/Netlify_th2gkd.png'
tags:
  - Infra
  - React
  - SSR
---

> Netlify 포스팅 시리즈를 4편 "functions로 SSR 구현"을 소개하기 위해 작성했을 정도로 가장 핵심적이고 중요하고, 멋진 내용이다.

SSR을 구성하기 위해서는 webpack에서도 많은 설정을 거치 듯이 netlify functions으로 SSR을 제공하기 위해서는 많은 설정을 거친다. 이 때문에 3편에서 사용했던 netlify-functions 모듈로는 한계가 있어서 직접 babel을 컨트롤 하는 방식으로 진행했다. 또, webpack을 많이 커스터마이징 하기 보다 CRA을 base로 하고 `react-app-rewired` 모듈을 사용하여 설정을 override 하는 방식으로 진행했다.

### netlify.toml을 통한 redirect 처리

netlify에서 SSR 구현은 크게 보면 단순하다. 모든 리소스들은 정적으로 서빙이 되고 그외의 접근은 netlify-functions을 통하게 하면 된다. redirect 설정은 netlify.toml 에서 하면 된다.

- netlify.toml
    
    ```jsx
    [build]
      functions = "netlify-functions"
    
    [[redirects]]
      from = "/build/*"
      to = "/:splat"
      status = 200
    
    [[redirects]]
      from = "/*"
      to = "/.netlify/functions/serverless"
      status = 200
    ```
    

`/build` 디렉토리는 그대로 정적으로 서빙되고, 그 외의 요청은 모두 functions에 `serverless` 를 향하도록 했다.

정적으로 서빙되는 것중 index.html은 서비스 되면 안된다. index.html이 그대로 존재하면 functions을 거치지 않고 바로 내려주게 되어서 클라 사이드 렌더링이 발생한다. index.html은 서버 사이드 렌더링 시 템플릿으로써  사용되어야 하기 때문에 이름만 살짝 바꾸도록 설정한다. eject 없이 index.html의 이름을 변경하기 위해 webpack 설정을 override 하는 `react-app-rewired`를 추가하자.

```rb
$ yarn add -D customize-cra react-app-rewired
```

override 설정 파일을 추가 하여 `index.html` 이 아닌 `.server.html` 로 파일이 생성되도록 변경하자.

- config-override.js
    
    ```jsx
    const { 
      override,
    } = require("customize-cra");
    
    module.exports = {
      webpack: override(
          (config) => {
            config.plugins[0].options.filename = '.server.html'
            return config;
          }
      )
    };
    ```
    

### SSR 을 제공할 함수 작성

일반적인 SSR을 제공하는 것처럼 express를 통해 SSR을 제공할 것이다. 서버를 위한 모듈을 추가한다.

```rb
$ yarn add serverless-http express cors body-parser
$ yarn add -D @types/express @types/cors @types/body-parser
```

- src/serverless.tsx
    
    ```tsx
    // @ts-ignore
    import React from "react";
    import serverless from "serverless-http";
    import express from "express";
    import cors from "cors";
    import bodyParser from "body-parser";
    import { renderToString } from "react-dom/server";
    import { StaticRouter } from "react-router-dom";
    import App from "./App";
    // @ts-ignore
    import html from "../build/.server.html";
    
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    
    app.get('/favicon.ico', (req, res) => res.sendStatus(204));
    app.get('*', async (req, res) => {
      const serverData = {
        from: 'server',
      };
      const renderString = renderToString(
        <StaticRouter>
          <App />
        </StaticRouter>
      );
      const result = html
        .replace('<div id="root"></div>', `<div id="root">${renderString}</div>`)
        .replace('__DATA_FROM_SERVER__', JSON.stringify(serverData));
      res.send(result);
    });
    
    exports.handler = serverless(app);
    ```
    

서버사이드 렌더링을 할때는 `BrowserRouter`를 사용할 수 없기 때문에 `StaticRouter`로 처리를 했다. 혹시나 App 컴포넌트 안쪽에서 `BrowserRouter`를 사용하고 있다면 아래처럼 밖에서 감싸도록 변경이 필요하다.

- src/index.tsx
    
    ```jsx
    import React from 'react';
    import ReactDOM from 'react-dom';
    import { BrowserRouter } from "react-router-dom";
    import App from './App';
    
    ReactDOM.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>,
      document.getElementById('root')
    );
    ```
    

### babel 설정

리액트를 서버사이드 렌더링 하기 위해 다음의 모듈을 추가하자.

```rb
$ yarn add -D @babel/core @babel/cli babel-plugin-transform-html-import-to-string @babel/plugin-transform-runtime @babel/preset-react
```

 바벨 설정은 기본적으로 사용하는 모듈로 설정했다. 프로젝트에 따라 svgr모듈이나, css 모듈이 추가 될 수 있다.

- babel.serverless.json
    
    ```bash
    {
      "presets": [
        "@babel/typescript",
        "@babel/preset-react",
        "@babel/preset-env"
      ],
      "plugins": [
        "transform-html-import-to-string",
        ["@babel/plugin-transform-runtime", {
          "regenerator": true
        }]
      ]
    }
    ```
    

서버 렌더링 함수를 빌드하는 명령어를 추가하고, netlify 배포시 `yarn build:netlify` 를 하여 리액트 프로젝트와 서버 렌더링 함수를 빌드하도록 하자.

- package.json
    
    ```bash
    scripts: {
      ...
      "build:serverless": "yarn babel --config-file ./babel.serverless.json --out-dir netlify-functions ./src --extensions \".js,.jsx,mjs,.ts,.tsx\" && yarn tool:remove-env-d-js",
      "build:netlify": "yarn build && yarn build:serverless",
      "tool:remove-env-d-js": "rm lambda/react-app-env.d.js"
    }
    ```
    

netlify functions을 사용하여 리액트 SSR 구현을 하였다. 실제 프로젝트를 SSR 하기 위해서는 각각의 파일 포맷에 따라 적절히 babel로 셋팅을 해줘야 한다.