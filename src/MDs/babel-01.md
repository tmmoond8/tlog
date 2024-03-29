---
title: (1)Babel - 기본편
date: '2019-12-27T08:56:56.243Z'
description: babel에 대한 기본 이해
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952585/tlog/cover/babel_dqlw51.jpg'
tags:
  - Babel
  - JavaScript
---

[Babel | PoiemaWeb](https://poiemaweb.com/es6-babel-webpack-1)

> 바벨이란?
바벨은 입력과 출력이 모두 자바스크립트 코드인 컴파일러다. 초기의 바벨은 ES6 코드를 ES5 코드로 변환해 주는 일만 했지만, 현재는 리액트의 JSX 문법, 타입스크립트, 코드 압축, Proposal 까지 처리해준다.

바벨을 실행하는 여러가지 방법이 있다.

1. @babel/cli로 실행하기
2. 웹팩의 babel-loader로 실행하기
3. @babel/core를 직접 실행하기
4. @babel/register로 실행하기

여기서 4번은 다루지 않을 것인데, 4번은 node의 환경에서 require로 모듈을 임포트 하는 시점에 실행되기 때문이다.

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

## Babel 설정

---

바벨 6까지는 `.babelrc` 파일로 설정값을 관리했지만, 바벨 7부터는 `babel.config.js` 파일로 관리하는 것을 추천한다.

.babelrc 파일로 설정을 할 수 있다.

바벨을 설정하기 위해서 일일이 모든 값을 넣는 것 보다는 이미 사용자들이 만들어둔 preset-env를 사용하면 편하게 쓸 수 있다. 아래는 공식 Babel 프리셋이다.

- [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env)
- [@babel/preset-flow](https://babeljs.io/docs/en/babel-preset-flow)
- [@babel/preset-react](https://babeljs.io/docs/en/babel-preset-react)
- [@babel/preset-typescript](https://babeljs.io/docs/en/babel-preset-typescript)

**바벨 플러그인과 프리셋**
베벨은  자바스크립트 파일을 변환해주는 역할을 한다. 이 변환은 플러그인 단위로 하는데, 화살표 함수 플러그인은 화살표 함수를 일반 함수로 변경하는 역할만 한다.
 하나의 목적을 위해 여러 플러그인을 사용할 수 있는데, 예를들면 ES6 문법을 ES5로 변경하려면 여러개의 플러그인을 사용해야 한다. (화살표, 템플릿 문자, 클래스 등등) 이렇게 특정 목적을 위한 플러그인 집합을 프리셋이라고 부른다.

@babel/preset-env 는 공식 프리셋 중 하나이며, 지원 환경에 맞춰 환경을 설정할 수 있다. 지원할 환경 리스트를 설정하면 알아서 해당 브라우저들을 지원하도록 트랜스 파일링 된다. 이 설정은 package.json, 또는 .browserslistrc 파일에 설정할 수 있다. 설정 내용은 다음 링크 : [Browserlist](https://github.com/browserslist/browserslist)

- package.json

  ```json
  ...
  "browserslist": [
    "defaults",
    "not IE 11",
    "not IE_Mob 11",
    "maintained node versions",
  ]
  ...
  ```

- .browserslistrc

  ```text
  # Browsers that we support

  defaults
  not IE 11
  not IE_Mob 11
  maintained node versions
  ```

@babel/preset-env 로 바벨 기본 설정을 해보자.

```json
$ npm install --save-dev @babel/preset-env
```

## 트랜스 파일링

---

바벨로 코드를 트랜스 파일링 해보자.

명령어로 입력하는 것과 scripts를 정의하여 실행하는 것의 차이는 무엇 일까?
아마도, scripts 로 실행하는 것은 프로젝트 패키지 환경에서 도는 것이고, 명령어로 실행하면 전역으로 실행되는 것 아닐까?

- package.json

  ```json
  {
    ...
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "babel": "babel src/js -w -d dist/js"
    },
    ...
  }
  ```

**-w : watch 옵션**

**-d : —out-dir 옵션의 축약형**

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
    #private = 10;

    foo() {
      // stage 4: 객체 Rest/Spread 프로퍼티
      const { a, b, ...x } = { ...{ a: 1, b: 2 }, c: 3, d: 4 };
      return { a, b, x };
    }

    bar() {
      return this.#private;
    }
  }
  ```

- src/js/main.js

  ```jsx
  import { pi, power, Foo } from './lib';

  console.log(pi);
  console.log(power(pi, pi));

  const f = new Foo();
  console.log(f.foo());
  console.log(f.bar());
  ```

```bash
$ npm run babel
```

아마 아래와 같은 오류가 발생할 텐데.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952581/tlog/_2020-02-18__9.26.05_ugvtna.png)

위 #private 은 ES 2020에 표준이 되었기 때문에 기본 바벨 옵션에는 포함이 안되어 있다. 이렇게 기본적으로 지원하지 않는 옵션에 대해서는 별도의 플러그인을 포함시키면 된다.

```bash
$npm install --save-dev @babel/plugin-proposal-class-properties
```

- .babelrc

  ```json
  {
    "presets": ["@babel/preset-env"],
    "plugins": ["@babel/plugin-proposal-class-properties"]
  }
  ```