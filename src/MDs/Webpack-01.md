---
title: Webpack(1) - 기본편
date: '2020-02-25T08:56:56.243Z'
description: Webpack 대한 기본 이해
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952585/tlog/cover/webpack_zceueo.png'
tags:
  - Webpack
  - JavaScript
---

[Webpack | PoiemaWeb](https://poiemaweb.com/es6-babel-webpack-2)

Webpack은 자바스크립트 파일을 번들링하는 모듈 번들러이다. 여기서 모듈은 각종의 리소스 파일을(js, png, css 등) 말하고, 번들은 웹팩 실행후 나오는 결과 파일이다. 하나의 번들 파일은 여러 모듈로 만들어진다.

## Webpack 설치

---

```bash
$ yarn add --dev webpack webpack-cli
```

번들링을 할 때 필요에 따라 코드를 babel로 트랜스 파일링 할 필요가 있다.

```bash
$ yarn add --dev babel-loader @babel/core @babel/preset-env
```

우리가 웹팩으로 빌드할 소스 파일을 생성하자.

- src/index.js

  ```jsx
  import { pi, power, Foo } from "./js/lib";

  console.log(pi);
  console.log(power(pi, pi));

  const f = new Foo();
  console.log(f.foo());
  console.log(f.bar());
  ```

- src/js/lib.js

  ```jsx
  export const pi = Math.PI;

  export function power(x, y) {
    // ES7: 지수 연산자
    return x ** y;
  }

  // ES6 클래스
  export class Foo {
    // stage 3: 클래스 필드 정의 제안
    constructor() {
      this.private = 10;
    }

    foo() {
      // stage 4: 객체 Rest/Spread 프로퍼티
      const { a, b, ...x } = { ...{ a: 1, b: 2 }, c: 3, d: 4 };
      return { a, b, x };
    }

    bar() {
      return this.private;
    }
  }
  ```

아래 명령어를 통해서 webpack을 실행하자. 아무런 옵션을 주지 않고 실행하면 기본적으로 src/index.js 파일을 index 파일로 읽고 dist/main.js 파일을 실행한다.

```bash
$ yarn webpack
```

dist/main.js 파일을 보면 앞부분은 webpack에서 기본적으로 생성하는 내용이고 끝 부분에 우리가 작성한 index.js 파일과 lib.js 파일이 하나의 파일안에 포함되어 있는 것을 확인할 수 있다.

## Webpack 설정

---

프로젝트 루트에 다음과 같이 webpack 설정 파일을 생성하자.

- webpack.config.js

  ```jsx
  const path = require("path");

  module.exports = {
    // enntry file
    entry: "./src/index.js",
    // 컴파일 + 번들링된 js 파일이 저장될 경로와 이름 지정
    output: {
      path: path.resolve(__dirname, "dist/js"),
      filename: "bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [path.resolve(__dirname, "src/js")],
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
      ],
    },
    devtool: "source-map",
    // https://webpack.js.org/concepts/mode/#mode-development
    mode: "development",
  };
  ```

webpack 명령어를 스크립트에 추가하자.

- package.json

  ```json
  {
  	...
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "webpack": "webpack -w"
    },
  	...
  }
  ```

한 번 더 아래 처럼 명령어를 실행하면, 이번에는 우리가 설정한 webpack.config.js 내용대로 번들링 된다. 결과물로 dist/js/bundle.js 파일이 생성되며, 바벨도 함께 실행된 것을 확인할 수 있다.

```bash
$ yarn webpack
```
