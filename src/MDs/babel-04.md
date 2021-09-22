---
title: (4)Babel - polyfill
date: '2020-02-15T08:56:56.243Z'
description: 더 많은 브라우저 지원하기
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952585/tlog/cover/babel_dqlw51.jpg'
tags:
  - Babel
  - JavaScript
---
# 

바벨을 사용하더라도 폴리필에 대한 설정은 별도로 해야 한다. 그 이유는 폴리필은 런타임에 기능이 존재하는지 검사하여 없는 경우 추가하기 때문이다.

 한 가지 예로 ES8에 추가된 String.padStart 메서드는 폴리필을 이용해서 추가할 수 있다. 반면에 async await 는 폴리필로 추가할 수 없으며, 바벨 컴파일 타임에 코드 변환을 해야 한다.

폴리필 코드의 예

```jsx
if (!String.prototype.padStart) {
	String.prototype.padStart = func;
}
```

### @babel/polyfill 모듈

---

@babel/polyfill 은 바벨에서 공식적으로 지원하는 폴리필 패키지다. 이 패키지를 사용하는 가장 간단한 방법은 자바스크립트 코드에서 불러오는 것이다.

```jsx
import '@babel/polyfill';

const p = Promise.resolve(10);
const obj = {
	a: 10,
	b: 20,
	c: 30,
};
const arr = Object.values(obj);
const exist = arr.includes(20);
```

웹팩에서도 @babel/polyfill 모듈을 사용할 수 있다.

```jsx
module.exports = {
	entry: ['@babel/polyfill', './src/index.js'],
	...
}
```

@babel/polyfill 모듈은 사용법은 간단하지만, 모든 폴리필이 추가가 되기 때문에 번들 파일의 크기가 커지는 단점이 있다.

### core-js 모듈에서 필요한 폴리필만 가져오기

---

@babel/polyfill 패키지는 내부적으로 core-js 패키지를 이용한다. 우리는 사용하는 폴리필만 core-js 에서 추가 하면 번들 크기를 최적화할 수 있다.

```jsx
import 'core-js/features/promise';
import 'core-js/features/object/values';
import 'core-js/features/array/includes';

const p = Promise.resolve(10);
const obj = {
	a: 10,
	b: 20,
	c: 30,
};
const arr = Object.values(obj);
const exist = arr.includes(20);
```

### @babel/preset-env 프리셋 이용하기

---

@babel/preset-env 프리셋을 사용하면, 실행 환경 정보를 설정하여 지원하고 싶은 환경에 대한 폴리필을 추가할 수 있다.

```bash
$ mkdir test-babel-env
$ cd test-babel-env
$ yarn init -y
$ yarn add @babel/core @babel/cli @babel/preset-env
```

- src/code.js

    ```jsx
    import '@babel/polyfill';

    const p = Promise.resolve(10);
    const objc = {
      a: 10,
      b: 20,
      c: 30,
    };

    const arr = Object.values(obj);
    const exist = arr.includes(20);
    ```

- babel.config.js

    ```jsx
    const presets = [
      [
        '@babel/preset-env',
        {
          targets: {
            chrome: '40',
          },
          useBuiltIns: 'entry',
        },
      ],
    ];

    module.exports = { presets };
    ```

targets 속성에는 browserslist라는 패키지의 문법을 사용했다. 위 설정은 크롬 브라우저 40 버전이상을 지원하도록 설정했고, `useBuiltIns: 'entry'`는 사용하는 폴리필만 추가가 된다.

결과는 아래와 같다. 

```jsx
"use strict";

require("core-js/modules/es6.array.copy-within");
require("core-js/modules/es6.array.fill");
...
require("regenerator-runtime/runtime");

var p = Promise.resolve(10);
var objc = {
  a: 10,
  b: 20,
  c: 30
};
var arr = Object.values(obj);
var exist = arr.includes(20);
```

번들 파일을 최적화 하고 싶다면 core-js 를 직접 추가하면 되지만, 현실적으로 세세하게 설정하는 것은 어렵기 때문에 @babel/presets-env 를 사용하는 것이 좋은 선택이라고 생각한다.