---
title: Webpack(3) - Plugin
date: '2020-04-18T08:56:56.243Z'
description: Plugin으로 더 강력한 Webpack
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952585/tlog/cover/webpack_zceueo.png'
tags:
  - Webpack
  - JavaScript
---

#

loader를 설명할 때 plugin과 같다고 했지만, 웹팩에서 plugin은 별도로 존재한다. loader 가 특정 파일에 대한 처리를 하는 플러그인이라고 하면, plugin은 진정 전체적인 처리에서 추가적인 동작을 할 수 있는 플러그인이다.

몇 개의 플러그인을 소개하면서 plugin이 loader와 어떻게 다른지 이해해보자. 직접 plugin을 추가하면서 이해하기 위해 webpack으로 새로운 프로젝를 셋업하자.

## Tutorial 프로젝트 구성

---

```bash
$ mkdir webpack-plugin && cd webpack-plugin
$ yarn init -y
$ yarn add -D webpack webpack-cli
$ yarn add -D @babel/core @babel/preset-react babel-loader
$ yarn add react react-dom
```

- src/index.js

  ```jsx
  import React from "react";
  import ReactDOM from "react-dom";

  function App() {
    return (
      <div>
        <h3>플러그인을 공부합시다.</h3>
        <p>다양한 플러그인을 사용하고, 유용성을 느껴봅시다.</p>
      </div>
    );
  }

  ReactDOM.render(<App />, document.getElementById("root"));
  ```

- webpack.config.js

  ```jsx
  const path = require("path");

  module.exports = {
    entry: "./src/index.js",
    output: {
      filename: "[name].[chunkhash].js",
      path: path.resolve(__dirname, "dist"),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-react"],
            },
          },
        },
      ],
    },
    mode: "production",
  };
  ```

webpack에서 filename의 값이 조금 변한 것을 확인할 수 있다. [name].[chunkhash].js 로 지정할 것을 볼 수 있다.
`main.b05cc8f133c59d0af081.js` 처럼 해싱 값을 포함하는 이름으로 떨어진다. 어떤 수정사항이 발생하면 hash값을 추가하여 만들기 때문에 캐싱에 무관하게 리로딩 할 수 있다.

그런데 여기서 문제가 하나 발생한다. 매번 다른 이름으로 생성되는 파일을 html 파일 안쪽으로 추가해줘야 하는 문제다. 이런 문제를 해결해주는 플러그인이 html-webpack-plugin이다.

## Html-webpack-plugin, Clean-webpack-plugin

---

html-webpack-plugin은 번들된 파일들을 html 안쪽에 script 태그로 포함시켜주는 플러그인이다. 그리고 clean-webpack-plugin은 이전에 빌드된 파일들을 모두 제거해주는 역할을 한다.

- webpack.config.js

  ```jsx
  const path = require("path");
  const { CleanWebpackPlugin } = require("clean-webpack-plugin");
  const HtmlWebpackPlugin = require("html-webpack-plugin");

  module.exports = {
    entry: "./src/index.js",
    output: {
      filename: "[name].[chunkhash].js",
      path: path.resolve(__dirname, "dist"),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-react"],
            },
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "./dist/index.html",
      }),
    ],
    mode: "production",
  };
  ```

- dist/index.html

  ```jsx
  <!doctype html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Document</title>
  </head>

  <body>
    <div id="root"></div>
  </body>

  </html>
  ```

index.html에는 번들된 파일이 추가가 되어 있지 않는데, 웹팩을 실행하면 번들링된 파일이 추가가 된 것을 확인할 수 있다.

```bash
$ yarn webpack
```

왜?? 실행할 때마다 충복으로 추가가 되는 것 일까??

![Webpack%203%20Plugin%2078f02ea414c3437aa821daface0ba885/_2020-03-27__9.30.36.png](Webpack%203%20Plugin%2078f02ea414c3437aa821daface0ba885/_2020-03-27__9.30.36.png)

## DefinePlugin

---

DefinePlugin은 Webpack에 내장된 플러그인으로 간단히 설명하면 전역 변수로 원시값을 저장할 수 있는 방법이다.

- webpack.config.js

  ```jsx
  ...
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './dist/index.html',
    }),
    new Webpack.DefinePlugin({
      APP_VERSION: "'0.0.1'",
      VIENNA: "1683",
    })
  ],
  ...
  ```

- src/index.js

  ```jsx
  import React from "react";
  import ReactDOM from "react-dom";

  function App() {
    return (
      <div>
        <h3>플러그인을 공부합시다.</h3>
        <p>다양한 플러그인을 사용하고, 유용성을 느껴봅시다.</p>
        <h4>{APP_VERSION}</h4>
        <h5>{VIENNA}</h5>
      </div>
    );
  }

  ReactDOM.render(<App />, document.getElementById("root"));
  ```

주의할 점은 문자열을 사용한다면 `APP_VERSION: "'0.0.1'"` 이런 형태로 작성해야 한다는 점이다.

## ProviderPlugin

---

리액트 프로젝트에는 다음과 같은 문구가 항상 사용될 것이다.

```jsx
import React from "react";
```

이러한 반복적인 문구를 작성하기 귀찮다면 ProviderPlugin을 사용하면 된다. ProviderPlugin도 Webpack 에 내장된 플러그인이다.

- webpack.config.js

  ```jsx
  ...
  plugins: [
  		...
      new Webpack.DefinePlugin({
        APP_VERSION: "'0.0.1'",
        VIENNA: "1683",
      }),
      new Webpack.ProvidePlugin({
        React: 'react',
      })
    ],
  ...
  ```

- src/index.js

  ```jsx
  import ReactDOM from "react-dom";

  function App() {
    return (
      <div>
        <h3>플러그인을 공부합시다.</h3>
        <p>다양한 플러그인을 사용하고, 유용성을 느껴봅시다.</p>
        <h4>{APP_VERSION}</h4>
        <h5>{VIENNA}</h5>
      </div>
    );
  }

  ReactDOM.render(<App />, document.getElementById("root"));
  ```

이렇게 react를 임포트 하지 않아도 문제가 발생하지 않는다.
