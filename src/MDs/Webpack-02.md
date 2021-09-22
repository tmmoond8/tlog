---
title: Webpack(2) - Loader
date: '2020-03-20T08:56:56.243Z'
description: Loader로 다양한 파일 다루기
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952585/tlog/cover/webpack_zceueo.png'
tags:
  - Webpack
  - Javascript
---

#

## Tutorial 을 위한 기본 셋업

webpack 설정과 babel 설정을 하여 react 프로젝트를 생성해보자.

```bash
$ mkdir webpack-react && cd webpack-react
$ yarn init -y
$ yarn add -D webpack webpack-cli @babel/core @babel/preset-react babel-loader
$ yarn add react react-dom
```

- src/index.js

  ```jsx
  import React from "react";
  import ReactDom from "react-dom";

  function App() {
    return (
      <div className="container">
        <h3 className="title">webpack sample</h3>
      </div>
    );
  }

  ReactDom.render(<App />, document.getElementById("root"));
  ```

- babel.config.js

  ```jsx
  const presets = ["@babel/preset-react"];
  module.exports = {
    presets,
  };
  ```

- webpack.config.js

  ```jsx
  const path = require("path");

  module.exports = {
    entry: "./src/index.js",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: "/node_modules",
          use: "babel-loader",
        },
      ],
    },
    mode: "production",
  };
  ```

위 처럼 작성하면 webpack이 react 프로젝트를 빌드 하면 dist/bundle.js 파일이 생성된다.

```bash
$ yarn webpack
```

이제 리액트 프로젝트를 실행시켜 보자.

- dist/index.html

  ```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
    </head>
    <body>
      <div id="root"></div>
      <script src="./bundle.js"></script>
    </body>
  </html>
  ```

html 파일에서 리액트 파일을 실행하여 화면을 렌더링 하게 했다.

## css-loader, style-loader

---

webpack은 기본적으로 js 파일만 다룬다. 그러나 웹에서는 다양한 형태의 리소스를 사용한다. 그리고 css는 웹의 기본 요소이다. 그렇기 때문에 웹팩에서 필수적으로 제공해준다.

webpack에서는 다양한 포맷을 처리하는 방법을 loader에게 맡긴다. loader는 플러그인 형태로 원하는 파일 포맷을 원하는 형태로 처리하는 것이 가능하다.

여기서 css-loader를 추가하여 css 파일을 처리하도록 해보자. 그리고 js에서는 css 임포트 했다.

- src/index.css

  ```css
  .container {
    border: 1px solid #eee;
  }

  .title {
    color: greenyellow;
  }
  ```

- src/index.js

  ```jsx
  ...
  import ReactDom from 'react-dom';
  import style from './index.css';

  function App() {
  ...
  ```

```bash
$ yarn webpack
```

이 상태에서 웹팩을 실행하면, 문법에러가 발생한다. 그 이유는 css 파일은 js와 문법이 다르기 때문이다. (webpack은 기본적으로 js파일로 읽어들임)

![Webpack%202%20Loader%20cc6c7eb7b08b4be1968bdfa7ea847953/_2020-03-27__5.55.12.png](Webpack%202%20Loader%20cc6c7eb7b08b4be1968bdfa7ea847953/_2020-03-27__5.55.12.png)

- webpack.config.js

  ```jsx
  ...
  module: {
      rules: [
        {
          test: /\.js$/,
          exclude: '/node_modules/',
          use: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: 'css-loader',
        }
      ],
    },
  ...
  ```

css 파일에 대해서 css-loader가 처리하도록 변경하자.

다시 웹팩을 실행해서 브라우저에서 확인하면 아래처럼 styles 객체가 생성된 것을 볼 수 있다.

![Webpack%202%20Loader%20cc6c7eb7b08b4be1968bdfa7ea847953/_2020-03-27__6.00.09.png](Webpack%202%20Loader%20cc6c7eb7b08b4be1968bdfa7ea847953/_2020-03-27__6.00.09.png)

그러나 스타일을 적용하려면 style-loader를 추가 해줘야 한다.

```bash
$ yarn add -D style-loader
```

- webpack.config.js

  ```bash
  ...
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: '/node_modules/',
          use: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        }
      ],
    },
    mode: 'production',
  };
  ```

css 처리하는 부분에 style-loader를 추가한 것을 확인할 수 있다.

여기서 loader는 오른쪽에서부터 왼쪽으로 실행되기 때문에 css-loader가 먼저 실행되어 css 파일을 style 객체로 만들고 style-loader가 style 객체를 html head에 style 태그를 만들어서 추가해준다.

다시 웹팩을 실행하면 브라우저에는 스타일이 적용되고 head 태그 안쪽에 style이 적용된 것을 확인할 수 있다.

![Webpack%202%20Loader%20cc6c7eb7b08b4be1968bdfa7ea847953/_2020-03-27__6.06.42.png](Webpack%202%20Loader%20cc6c7eb7b08b4be1968bdfa7ea847953/_2020-03-27__6.06.42.png)

위의 형태는 style 내용들이 head 안쪽에 스타일로 전역적으로 들어갔지만, css-module을 사용하면 지역화 할 수 있다. 이밖에도 css-loader는 import(), url() 등을 처리하는 역할도 수행한다.

## file-loader, raw-loader

---

웹페이지에는 html, css, js 외의 이미지나 비디오 파일등 다양한 포맷을 추가할 수 있다. 이런 파일들의 특징은 별도 조작 없이 파일을 복사하여 output 경로에 옮겨주고 해당 경로를 리턴해주는 역할만 한다.

.txt, .json, .png 파일을 웹팩에서 처리해보자. (json 파일을 사실 웹팩이 기본적으로 처리할 수 있는 포맷이다.)

- src/assets/sample.txt

  ```
  this is sample
  ```

- src/assets/sample.json

  ```json
  {
    "vienna coffee house": 1683
  }
  ```

- src/assets/sample.png

  ![Webpack%202%20Loader%20cc6c7eb7b08b4be1968bdfa7ea847953/noticon.png](Webpack%202%20Loader%20cc6c7eb7b08b4be1968bdfa7ea847953/noticon.png)

이제 js 파일에서 임포트 해보자. 물론 loader를 추가하기 전이기 때문에 에러를 뱉을 것이다.

- src/index.js

  ```jsx
  import React from "react";
  import ReactDom from "react-dom";
  import style from "./index.css";
  import Txt from "./assets/sample.txt";
  import Json from "./assets/sample.json";
  import Png from "./assets/sample.png";

  function App() {
    return (
      <div className="container">
        <h3 className="title">webpack sample</h3>
        <pre>{Txt}</pre>
        <p>
          <b>vienna coffee house</b>
          {Json["vienna coffee house"]}
        </p>
        <img src={Png} />
      </div>
    );
  }

  ReactDom.render(<App />, document.getElementById("root"));
  ```

- webpack.config.js

  ```jsx
  const path = require("path");

  module.exports = {
    entry: "./src/index.js",
    output: {
      filename: "main.js",
      path: path.resolve(__dirname, "dist"),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: "/node_modules/",
          use: "babel-loader",
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|jpg|jpeg|svg|gif)/,
          use: "file-loader",
        },
        {
          test: /\.(txt)/,
          use: "raw-loader",
        },
      ],
    },
    mode: "production",
  };
  ```

정상적으로 loader가 추가가 되면 화면에 txt 파일 내용과 이미지가 렌더링 될 것이다.

## url-loader를 사용하여 이미지 효과적으로 처리하기

---

웹 프로젝트의 대부분의 사이즈는 이미지가 차지할 것이다. 또, webpack에서는 여러 파일을 하나 또는 몇개의 파일로 번들링 하는 과정을 거치기 때문에 브라우저가 리소스를 요청할 때 효과적으로 할 수 있는 장점이 있었는데, 이미지 같은 리소스 또한 효과적으로 처리하는 방법이 있다.

그 중 하나가 url-loader를 사용하는 것이다. 파일을 각각 다운로드 받기 보다는 이미지를 string(base64 encoding)으로 처리해서

![Webpack%202%20Loader%20cc6c7eb7b08b4be1968bdfa7ea847953/_2020-03-27__8.23.08.png](Webpack%202%20Loader%20cc6c7eb7b08b4be1968bdfa7ea847953/_2020-03-27__8.23.08.png)

dist/bundle.js 파일안에 보면 base64로 인코딩된 이미지의 스트링이 들어가 있다.

![Webpack%202%20Loader%20cc6c7eb7b08b4be1968bdfa7ea847953/_2020-03-27__8.32.40.png](Webpack%202%20Loader%20cc6c7eb7b08b4be1968bdfa7ea847953/_2020-03-27__8.32.40.png)

url-loader에서 제한한 크기 이상의 이미지에 대해서 fallback을 지정할 수 있다. 만약 별도로 지정하지 않는다면, file-loader가 처리 한다.
