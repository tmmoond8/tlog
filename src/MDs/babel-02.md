---
title: (2)Babel - 실행편
date: '2020-01-09T08:56:56.243Z'
description: 실습을 통한 더 깊은 이해
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952585/tlog/cover/babel_dqlw51.jpg'
tags:
  - Babel
  - JavaScript
---

> 바벨이란?
바벨은 입력과 출력이 모두 자바스크립트 코드인 컴파일러다. 초기의 바벨은 ES6 코드를 ES5 코드로 변환해 주는 일만 했지만, 현재는 리액트의 JSX 문법, 타입스크립트, 코드 압축, Proposal 까지 처리해준다.

바벨을 실행하는 여러가지 방법이 있다.

1. @babel/cli로 실행하기
2. 웹팩의 babel-loader로 실행하기
3. @babel/core를 직접 실행하기
4. @babel/register로 실행하기

여기서 4번은 다루지 않을 것인데, 4번은 node의 환경에서 require로 모듈을 임포트 하는 시점에 실행되는데 리액트 환경이랑은 관련이 없기 때문이다.

## @babel/cli 로 실행하기

---

전역으로 설치하는 것 보다는 프로젝트에만 사용할 수 있도록 로컬에 설치하는 것이 좋다.

```bash
$ yarn init -y
$ yarn add --dev @babel/cli @babel/core @babel/plugin-transform-arrow-functions @babel/plugin-transform-template-literals @babel/preset-react
```

그리고 src 디렉토리를 생성하고 code.js 파일을 안에 하나 작성하자.

- src/code.js

  ```jsx
  const element = <div>babel test</div>;
  const text = `element type is ${element.type}`;
  const add = (a, b) => a + b;
  ```

자 이제 @babel/cli를 실행해보자.

```bash
$ yarn babel src/code.js \
 --presets=@babel/preset-react \
 --plugins=@babel/plugin-transform-template-literals,@babel/plugin-transform-arrow-functions
```

실행하면 아래처럼 트랜스파일 된 결과가 출력될 것이다.

```jsx
const element = React.createElement("div", null, "babel test");
const text = "element type is ".concat(element.type);

const add = function (a, b) {
  return a + b;
};
```

 

@babel/cli를 사용하면 너무 장황한 명령어를 실행해야 한다는 단점이 있다.

### Babel 설정하기

바벨 6까지는 .babelrc 파일로 설정값을 관리했지만, 바벨 7부터는 babel.config.js 파일로 관리하는 것을 추천한다.  그 이유는 뒤에..

아래 설정은 우리가 길고 긴 명령에서 추가했던 설정들을 파일로 작성한 것이다.

- babel.config.js

  ```jsx
  const presets = ['@babel/preset-react']; 
  const plugins = [
    '@babel/plugin-transform-template-literals', 
    '@babel/plugin-transform-arrow-functions',
  ]

  module.exports = { presets, plugins };
  ```

우리는 이제 간결한 명령어로 똑같은 일을 할 수 있다.

```bash
$ yarn babel src/code.js --out-file dist.js
$ yarn babel src --out-file dist
```

위는 파일 단위로, 아래는 디렉토리 단위로 처리한다.

## 웹팩의 babel-loader로 실행하기

---

웬만한 프로젝트는 웹팩같은 번들러를 사용하여 빌드를 한다. 웹팩에서는 여러가지 기능을 제공하는 로더를 사용할 수 있는데, babel-loader를 추가하여 빌드되었을 때 바벨로 트랜드파일링 되도록 해보자.

```bash
$ yarn add --dev webpack webpack-cli babel-loader
```

- webpack.config.js

  ```jsx
  const path = require('path');

  module.exports = {
    entry: './src/code.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'code.bundle.js',
    },
    module: {
      rules: [{ test: /\.js$/, use: 'babel-loader' }],
    },
    optimization: { minimizer: [] },
  };
  ```

위처럼 작성하고 webpack을 실행 시키자.

```bash
$ yarn webpack
```

실행하면 code.bundle.js 파일이 생성될 텐데 웹팩의 런타임 코드가 추가가 되기 때문에 코드 아래쪽에서 번들링된 내용을 확인할 수 있다.

## @babel/core로 직접 실행하기

---

@babel/core로 실행하는 것은 자바스크립트 파일을 가져와서 직접 자바스크립트 모듈을 돌리고 결과를 파일에 쓰는 방식이다. 매우 직관적이고 자유도가 높다는 장점이 있다.

- src/runBabel.js

  ```jsx
  const babel = require('@babel/core');
  const fs = require('fs');

  const filename = './src/code.js';
  const source = fs.readFileSync(filename, 'utf8');
  const presets = ['@babel/preset-react'];
  const plugins = [
    '@babel/plugin-transform-template-literals',
    '@babel/plugin-transform-arrow-functions',
  ];

  const { code } = babel.transformSync(source, {
    filename,
    presets,
    plugins,
    configFile: false,
  });
  console.log(code);
  ```

```bash
$ node src/runBabel.js
```