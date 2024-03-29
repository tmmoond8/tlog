---
title: JS 의존성 관리 - 모듈 시스템과 NPM
date: '2019-10-30T08:56:56.263Z'
description: 전통적인 JS의 의존성 관리 방식과 한계, CommonJS, AMD 등장. JS의 패키지 관리자인 NPM
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632298243/tlog/cover/_____JS_1_jbq8ea.png'
tags:
  - JavaScript
  - React
  - NPM
---

더욱 복잡한 시스템을 개발 하기 위해서는 하나의 파일에 모든 로직을 포함하지 않고 모듈 단위로 파일을 분리 한다. 분리한 모듈을 필요한 곳에 임포트 하면 의존성이 생기게 되고 하나의 시스템으로 합치면 프로그램이 된다.

 기존의 브라우저에서는 다소 제한 적인 방법으로 JavaScript(JS) 의존성을 관리를 지원했다. JS가 브라우저를 벗어나 Node.js 라는 새로운 환경에서 실행이 되면서 별도의 모듈 시스템이 필요했다. Node.js는 인기의 얻어 더욱 많은 사람들이 사용했고, Node.js의 모듈 시스템인 CommonJS에 익숙해졌다.  

 CommonJS 외에도 다양한 방식을 사람들이 만들어서 사용하였고 표준 모듈 시스템의 필요성이 요구되었다.

 2015년, ES6에서는 새로운 모듈 시스템 표준인 ES6 Module을 발표하였고, JS는 그전보다 훨씬 더 범용성을 갖춘 언어로 발전하게 되었다.

 이 포스팅 에서는 전통적인 JS의 의존성 관리 방식과 한계를 알아보고, 이러한 한계를 극복하기 위해 JS 진영에서의 발표된 유명한 모듈 시스템(CommonJS, AMD 등)을 알아보겠다. 또, 이러한 모듈을 손쉽게 사용하고 배포 할 수 있는 패키지 관리자인 NPM에 대해 간략하게 살펴보겠다.

## JavaScript 의존성 관리

---

### 필요성 (전통적인 방식 문제점)

```html
<html>
  <head>
  <body>
  ...
    <script src="./foo.js"></script>
    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js"></script>
  ...
```

  전역 scope

위 코드는 window.$ 처럼 window 의 속성을 추가 하는 형태이며 전역 스코프를 오염시킨다. 
모듈 시스템에서는 독립된 스코프를 보장하여 전역 스코프의 오염을 막는다. 또 악의적인 스크립트가 다른 모듈을 이상 동작하게 만들 수 있다.

 선언한 순서의 의존성

script 태그로 추가한 순서대로 foo 모듈이 먼저 로드되고, 그 다음에 jquery 로드 된다. foo 모듈에서 jquery를 사용하려고 하면 아직 jquery가 로드가 되어 있지 않기 때문에 에러가 발생한다. 이렇게 선언 순서에도 의존성이 생기기 때문에 큰 시스템에서는 관리가 더욱 어렵게 된다. (js간의 의존성을 html에서 관리하는 것 자체도 문제다.)

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632299087/tlog/js-module-de_raqjum.png)

[https://ui.toast.com/fe-guide/ko_DEPENDENCY-MANAGE/](https://ui.toast.com/fe-guide/ko_DEPENDENCY-MANAGE/)

자바스크립트의 코드가 점점 더 복잡해지면 의존성을 관리하는 것은 더더욱 복잡해진다.

### 모듈 시스템

---

Node.js 에서 사용하는 모듈 시스템인 `CommonJS`, 

브라우저 환경에 적합한 모듈 시스템인 `AMD`, 

ES6에서 표준 모듈 시스템이 된  `ES6 Module`,  

다양한 모듈 방식을 지원하는 코드 패턴인 `UMD`,

**CommonJS**

```javascript
var $ = require('jquery');
var _ = require('lodash');

function privateFn() {};
function publicFn() {};

module.exports = {
  publicFn: publicFn
};
```

 CommonJS는 동기 방식으로 `module.exports` 객체로 모듈의 API를 정의하고 `require` 함수로 의존성 모듈을 가져온다.

 CommonJS는 Node 같은 환경에서는 바로 사용할 수 있지만, 브라우저 환경에서는 번들링 과정을 거쳐야 사용할 수 있다.

**AMD (Asynchronous Module Definition)**

```javascript
define(['jquery', 'lodash'], function($, _) {
  function privateFn() {};
  function publicFn() {};

  return {
    publicFn: publicFn
  };
});
```

AMD는 비동기 방식으로, `define` 함수를 사용하여 모듈의 API와 의존성 관계를 정의한다. 문법 자체가 CommonJS에 비해 직관적이지 않지만, 브라우저에서 바로 사용 가능하고 동적 로딩을 지원한다. AMD를 지원하는 대표적인 라이브러리로는 [RequireJS](https://requirejs.org/)가 있다.

**ES6 Module**

```javascript
// lib.js
export function sayHello() {
  console.log('Hello');
}

// index.js
import { sayHello } from './lib';

sayHello(); // Hello
```

ES6에서 정의한 표준 모듈 시스템으로 `export` , `import` 를 사용한다.

 ES6 모듈을 지원하지 않는 브라우저를 사용할 때는 트랜스파일러 및 번들러를 사용하여 브라우저에서 사용할 수 있는 형태로 코드를 변경해야 한다.

브라우저에서 모듈을 사용하려고 하면 다음 처럼 type 속성을 추가 하면 된다. 또, 모듈을 나타내기 위해 .js 대신 .mjs 확장자를 사용하도록 권고 한다.

```html
<script type="module" src="jquery.mjs"></script>
```

**UMD (Universal Module Definition)**

```javascript
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery', 'lodash'], factory);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = factory(require('jquery'), require('lodash'));
  } else {
    // Browser globals (root is window)
    root.myModule = factory(root.jQuery, root._);
  }
}(this, function ($, _) {
  function privateFn() {};
  function publicFn() {};

  return {
    publicFn: publicFn
  }
}));
```

조건문을 사용하여 AMD 또는 CommonJS를 지원하는지 여부를 확인하여 모듈 시스템을 선택적으로 사용할 수 있다. [Rollup](https://www.npmjs.com/package/rollup) 같은 모듈을 사용하면 되기 때문에, 손수 UMD를 작성하는 일은 거의 없다.

### NPM(Node Package Manager)

---

npm은 자바스크립트 패키지(모듈) 저장소다. 누구나 npm에 자신이 만든 패키지를 공개할 수 있고, 공개된 패키지를 설치하여 사용할 수 있다. 

패키지는 package.json이라는 설정 파일로 관리가 되는데, 패키지 이름, 라이센스 정보, 의존성 등 각종 메타 정보를 포함한다.

npm은 npm-cli를 제공하여 손쉽게 커맨드 라인 명령어로 패키지를 관리할 수 있다.

```text
npm init : package.json을 생성한다.
npm install : package.json에 명시된 의존성 패키지들을 모두 설치한다.
npm install [패키지명] : 해당 패키지를 설치 후 package.json의 dependencies에 추가한다.
npm install [패키지명] -g : 해당 패키지를 전역으로 설치한다.
npm install [패키지명] --save-dev : 해당 패키지를 설치 후 package.json의 devDependencies에 의존성을 추가한다.
npm update : package.json의 dependencies와 devDependencies 패키지들을 모두 업데이트 후 package.json에 버전 정보를 갱신한다.
npm update [패키지명] : 해당 패키지를 업데이트 후 package.json에 버전 정보를 갱신한다.
npm update [패키지명] --no-save : 해당 패키지를 업데이트만 하고 package.json에 버전 정보를 갱신하지 않는다.
npm prune : package.json에 명시되지 않은 패키지를 모두 제거한다.
```

> 모듈과 패키지의 차이??
모듈은 reuiqre('module') 처럼 가져올 수 있는 파일 또는 디렉토리다. 모듈은 node_modules 하위에 위치하며 packages.json 파일을 포함한 모듈을 패키지라 부른다.

### Package.json

- package.json
  ```json
  {
    "name": "react-naver-login",
    "version": "0.1.2-alpha3",
    "description": "A Naver Login Component for React",
    "main": "dist/index.js",
    "module": "dist/index.es.js",
    "jsnext:main": "dist/index.es.js",
    "keywords": [
      "react",
      "reactjs",
      "react-component",
      "naver-login",
      "naver-oAuth2",
      "naver-oAuth",
      "네이버"
    ],
    "files": [
      "dist"
    ],
    "author": "Teamin Moon, Peoplefund company <taemin@peoplefund.co.kr>",
    "license": "MIT",
    "bugs": {
      "url": "https://github.cqom/peoplefund-tech/react-naver-login/issues"
    },
    "repository": {
      "type": "git",
      "url": "git+https://github.com/peoplefund-tech/react-naver-login.git"
    },
    "homepage": "https://github.com/peoplefund-tech/react-naver-login",
    "scripts": {
      "build": "rollup -c"
    },
    "devDependencies": {
      "@types/react": "^16.9.9",
      "@types/react-dom": "^16.9.2",
      "react-scripts-ts": "^4.0.8",
      "react": "^16.10.2",
      "react-dom": "^16.10.2",
      "rollup": "^1.25.1",
      "rollup-plugin-commonjs": "^10.1.0",
      "rollup-plugin-node-resolve": "^5.2.0",
      "rollup-plugin-peer-deps-external": "^2.2.0",
      "rollup-plugin-typescript2": "^0.24.3",
      "typescript": "^3.6.4"
    },
    "peerDependencies": {
      "react": ">=15.0.0",
      "react-dom": ">=15.0.0"
    }
  }
  ```

> 혹시 package.json에서 사용하는 속성들에 대해 더 알고 싶다면 [감성 프로그래밍 블로그](https://programmingsummaries.tistory.com/385)를 참고하자.

### Package-lock.json (v5 ~)

같은 package.json 으로 설치하더라도 시점에 따라 설치되는 패키지가 다를 수 있다. package-lock.json은 언제나 동일한 버전의 패키지를 설치할 수 있도록 의존성 정보를 저장한 파일이다.

### node_modules

npm를 통해 설치된 파일은 모두 node_modules 디렉터리 내에 저장된다.

> v3 이전에는 하위 의존성이 `node_modules/a/node_modules/b/node_modules/c` 처럼 관리되었다면,
v3 부터는 최대한 루트 디렉토리에 저장한다고 한다.
`node_modules/a`, `node_modules/b`, `node_modules/c`

### 패키지 탐색 순서

`require('axios')` 시에 파일 탐색 순서

1. require를 한 소스의 폴더에 있는 `axios` 파일
2. require를 한 소스의 폴더에 있는 `axios.js` 파일
3. require를 한 소스의 폴더에 있는 `axios.json` 파일
4. require를 한 소스의 폴더에 있는 `axios.node` 파일
5. 해당 패키지 루트에 있는 `node_modules/axios` 디렉터리 확인
    1. `package.json`의 `main`에 정의된 파일
    2. `index.js`
    3. `index.json`
    4. `index.node`
6. 해당 패키지의 상위 패키지 에서 `node_modules/axios` 디렉터리 확인

### 의존성 버전 표기

npm은 [semver(Semantic Versioning)](https://semver.org/) 의 Versioning 규칙을 따른다.

- MAJOR 버전 : 하위 호환성을 보장하지 않는 API 변경이 발생하면 MAJOR 버전을 변경한다.
- MINOR 버전 : 하위 호환성을 보장하는 API 및 기능이 추가되면 MINOR 버전을 변경한다.
- PATCH 버전 : 하위 호환성을 보장하면서 버그가 수정된 것이면 PATCH 버전을 변경한다.

**Tilde (~) 범위**

- MINOR 버전이 명시된 경우 PATCH 변경만 허용하고, MINOR 버전이 명시되지 않으면 MINOR 변경까지도 허용한다.
    - ~1.2.3 : >= 1.2.3 < 1.3.0
    - ~1.2 : >= 1.2.0 < 1.3.0 : 1.2.x
    - ~1 : >= 1.0.0 < 2.0.0 : 1.x

**Caret (^) 범위**

- 하위 호환성이 보장되는 업데이트를 진행한다.
    - ^1.2.3 : >= 1.2.3 < 2.0.0
    - ^1.2 : >= 1.2.0 < 2.0.0
    - ^1 : >= 1.0.0 < 2.0.0
    - ^0.1.2 : >= 0.1.2 < 0.2.0 (예외: 버전이 1.0.0 미만인 경우 API 변경이 수시로 일어날 수 있으므로 Tilde처럼 동작한다.)

 

## References

---

[의존성 관리](https://ui.toast.com/fe-guide/ko_DEPENDENCY-MANAGE/)

[NAVER D2](https://d2.naver.com/helloworld/12864)

[[NodeJS] 모두 알지만 모두 모르는 package.json](https://programmingsummaries.tistory.com/385)

[(ECMAScript) ES2015(ES6) 모듈 시스템 - import, export, default](https://www.zerocho.com/category/ECMAScript/post/579dca4054bae71500727ab9)

### 전역 VS 지역 설치

전역 설치를 사용하는 예: pm2, nodemon

더 알아볼 것들 
npx, nvm