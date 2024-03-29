---
title: (3)Babel - 설정편
date: '2020-01-19T08:56:56.243Z'
description: 설정하는 다양한 방법
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952585/tlog/cover/babel_dqlw51.jpg'
tags:
  - Babel
  - JavaScript
---

하나의 프로젝트에도 여러 바벨 설정이 존재할 수 있다. 예를 들면 하나의 프로젝트에 react 프론트와 node 서버를 두는 경우를 둘 수 있다. 또는, 빌드 환경에 따라서도 다른 설정을 둘 수 있다. 

 이번에는 바벨 설정에서 extends, env,  overrides 속성을 활용하여 확장성과 유연성을 적용하는 방법에 대해서 알아본다.

## extends로 설정 확장하기

---

새로 프로젝트를 생성하고 하나씩 적용 해보자.

```bash
$ mkdir test-babel-config
$ cd test-babel-config
$ yarn add @babel/cli @babel/core @babel/plugin-transform-arrow-functions @babel/plugin-transform-template-literals @babel/preset-react babel-preset-minifyls
```

먼저 기본이 되는 babel 설정을 만들고 이 설정 파일을 extends 속성으로 확장하자.

- common/.babelrc

  ```json
  {
    "presets": [ "@babel/preset-react"],
    "plugins": [
      [
        "@babel/plugin-transform-template-literals",
        {
          "loose": true
        }
      ]
    ]
  }
  ```

위에서 설정한 내용을 확장한다. `@babel/plugin-transform-template-literals` 설정이 확장 되어서 `"loose": true` 가 무시 된다. 

 `"loose": true` 설정은 문자열을 `+` 연산자로 합치고, 그렇지 않으면 `concat` 함수로 합친다.

- src/example-extends/.babelrc

  ```json
  {
    "extends": "../../common/.babelrc",
    "plugins": [
      "@babel/plugin-transform-arrow-functions",
      "@babel/plugin-transform-template-literals"
    ]
  }
  ```

- src/example-extends/code.js

  ```jsx
  const element = <div>babel test</div>;
  const text = `element type is ${element.type}`;
  const add = (a, b) => a + b;
  ```

`common/.babelrc` 에서 설정된 `@babel/preset-react preset`이 있어야  jsx를 정상적으로 읽을 수 있다.

 아래 명령어로 정상적으로 실행되는 것을 확인할 수 있다.

```bash
$ yarn babel src/example-extends/code.js
```

## env 속성으로 환경별로 설정하기

---

development 환경과 production 환경 별로 다르게 설정이 되야할 때가 있다. 예를 들면 production 환경에서는 minify를 한다든지 말이다. 

 example-env 디렉토리를 생성하여 .babelrc 파일을 생성해서 다음을 입력하자.

- src/example-env/.babelrc

  ```json
  {
    "presets": ["@babel/preset-react"],
    "plugins": [
      "@babel/plugin-transform-template-literals",
      "@babel/plugin-transform-arrow-functions"
    ],
    "env": {
      "production": {
        "presets": ["minify"]
      }
    }
  }
  ```

- src/example-env/code.js

  ```jsx
  const element = <div>babel test</div>;
  const text = `element type is ${element.type}`;
  const add = (a, b) => a + b;
  ```

`.babelrc` 파일에 env 옵션을 설정한 것을 볼 수 있다.

```bash
$ yarn babel src/example-env/code.js
$ NODE_ENV=production yarn babel src/example-env/code.js
```

기본적으로 NODE_ENV=development 이기 때문에 첫 번째 명령어는 minify가 되지 않지만, 두 번째 명령어는 minify가 된 코드를 확인할 수 있다.

## Override 속성으로 파일별로 다른 설정을 적용하기

---

src 디렉토리 밑에 example-overrides 디렉토리를 생성하고 위에서 사용한 code.js 파일을 여러벌 복사해서 각각 파일에 따라 설정 옵션을 넣어보자.

- src/example-overrides/code.js

  ```jsx
  const element = <div>babel test</div>;
  const text = `element type is ${element.type}`;
  const add = (a, b) => a + b;
  ```

- src/example-overrides/services/code1.js

  ```jsx
  const element = <div>babel test</div>;
  const text = `element type is ${element.type}`;
  const add = (a, b) => a + b;
  ```

- src/example-overrides/services/code2.js

  ```jsx
  const element = <div>babel test</div>;
  const text = `element type is ${element.type}`;
  const add = (a, b) => a + b;
  ```

.babelrc 파일에 코드를 작성하자. 아래 처럼 작성하면 `src/example-overrides/services/code1.js`만 화살표 함수가 변환된다.

```json
{
  "presets": ["@babel/preset-react"],
  "plugins": ["@babel/plugin-transform-template-literals"],
  "overrides": [
    {
      "include": "./services",
      "exclude": "./services/code2.js",
      "plugins": ["@babel/plugin-transform-arrow-functions"]
    }
  ]
}
```

```bash
$ yarn babel src/example-overrides -d src/example-overrides/dist
```

위 명령어를 실행하면 dist 디렉토리에 각각의 바벨 설정에 따라 변환된 것을 확인할 수 있다.

## 전체 설정과 지역 설정

---

바벨 설정 파일은 크게 두 가지 종류로 나눌 수 있다. 첫 번째는 모든 자바스크립트 파일에 적용되는 전체 설정 파일과 지역 설정 파일이다. 전체 설정 파일은 babel 7 버전에서 추가된 babel.config.js 파일이다. 지역 설정 파일은 여러 종류가 있는데 `.babelrc`, `.babelrc.js`, `package.json` 이 있다.

 이번에는 전체 설정 파일과 지역 설정파일이 어떻게 파일에 설정으로 적용되는지를 알아보자.

```bash
$ mkdir test-babel-config-file
$ cd test-babel-config-file
$ yarn init -y
$ yarn add @babel/core @babel/cli @babel/plugin-transform-arrow-functions @babel/plugin-transform-template-literals @babel/preset-react
```

전체 설정 파일을 생성하여 전체적으로 설정될 기본 설정을 추가하자.

- babel.config.js

  ```jsx
  const presets = ['@babel/preset-react'];
  const plugins = [
    [
      '@babel/plugin-transform-template-literals',
      {
        loose: true,
      },
    ],
  ];

  module.exports = { presets, plugins };
  ```

- src/code.js

  ```jsx
  const element = <div>babel test</div>;
  const text = `element type is ${element.type}`;
  const add = (a, b) => a + b;
  ```

- src/service1/code.js

  ```jsx
  const element = <div>babel test</div>;
  const text = `element type is ${element.type}`;
  const add = (a, b) => a + b;
  ```

- src/service1/.babelrc

  ```json
  {
    "plugins": [
      "@babel/plugin-transform-arrow-functions",
      "@babel/plugin-transform-template-literals"
    ]
  }
  ```

- src/service2/code.js

  ```jsx
  const element = <div>babel test</div>;
  const text = `element type is ${element.type}`;
  const add = (a, b) => a + b;
  ```

- src/service2/package.json

  책에서는 package.json의 설정도 같이 합쳐진다고 되어 있지만, 실제 해보니 안되었었다.... 뭐가 문제일까

  ```json
  {
    "babel": {
      "presets": [
        "minify"
      ],
      "plugins": [
        "@babel/plugin-transform-arrow-functions",
        "@babel/plugin-transform-template-literals"
      ]
    },
    "name": "service2",
    "version": "1.0.0",
    "main": "index.js",
    "license": "MIT"
  }
  ```

위처럼 작성을 한 후 바벨을 실행해보자.

```bash
$ yarn babel src -d dist
```

결과 파일을 하나씩 보자.

- dist/code.js

  `babel.config.js` 파일의 설정만 적용되었다.

  ```js
  const element = React.createElement("div", null, "babel test");
  const text = "element type is " + element.type;

  const add = (a, b) => a + b;
  ```

- dist/service1/code.js

  `babel.config.js`와 `service1/.babelrc` 파일의 설정이 적용되었다.

  ```js
  const element = React.createElement("div", null, "babel test");
  const text = "element type is ".concat(element.type);

  const add = function (a, b) {
    return a + b;
  };
  ```

- dist/service2/code.js

  `babel.config.js`의 설정만 적용되었다.

  ```js
  const element = React.createElement("div", null, "babel test");
  const text = "element type is " + element.type;

  const add = (a, b) => a + b;
  ```