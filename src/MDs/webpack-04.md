---
title: Webpack(4) - 고급편
date: '2020-06-28T08:56:56.243Z'
description: 최적화 하기
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952585/tlog/cover/webpack_zceueo.png'
tags:
  - Webpack
  - JavaScript
---

Webpack 최적화 방법 소개

## Tree Shaking

---

라이브러리를 사용하면 해당 라이브러리 안에서 사용하는 함수의 비율은 10%도 채 되지 않는 경우가 많다. 이 경우에도 모든 라이브러리의 내용이 번들에 포함된다면, 효율이 낮게 될 것이다.

Tree Shaking은 말라 죽은 잎을 떨어뜨려 실제로 살아있는 잎만 남게 한다. webpack에서는 마찬가지로 실제로 사용하는 코드만 남기도록 처리하는 것이 Tree Shaking이다.

새로 프로젝트를 생성하자.

```bash
$ mkdir study_tree_shaking && cd study_tree_shaking
$ yarn init -y
$ yarn add -D webpack webpack-cli
```

- src/utils_esm.js

  ```jsx
  export function func1() {
    console.log("func1");
  }
  export function func2() {
    console.log("func2");
  }
  ```

- src/index.js

  ```jsx
  import { func1 } from "./utils_esm";
  func1();
  ```

tree shaking은 webpack 4에서 기본 동작이기 때문에 사용하지 않은 func2는 번들 파일에 포함이 되지 않는다. 웹팩을 실행하면 func2는 누락되어 있고 func1만 있는 것을 확인할 수 있다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952582/tlog/_2020-03-27__10.57.51_xzclb7.png)

### Tree shaking이 안되는 경우

---

그런데 webpack에서 tree shaking이 안되는 경우가 있다.

- 사용되는 모듈이 ESM(ECMAScript Modules)가 아닌 경우
- 사용되는 곳에서 ESM를 사용하지 않은 경우
- 동적 임포트(Dynamic Import)를 사용할 경우

혹시나 tree shaking 이 필요한 내용를 제거할 수 있지 않을까?

만약 다음과 같은 모듈이 있다고 하자.

```jsx
const arr = []
export func1() {
  console.log('func1', arr.length);
}
export func2() {
  arr.push(10);
  console.log('func2');
}
func2();
```

func2 는 임포트 여부와 상관 없이 모듈 내부적으로 호출 되어 영향을 미치게 된다.

만약 임포트하는 곳이 없다고 무작정 제거 한다면 func2()를 실행할 수 없기 때문에 문제가 될 수 있다. 다행히도 최초로 모듈이 실행될 때 모듈 전체를 평가하는데, 이때 func2를 실행하게 되고 이후에 tree shaking이 되기 때문에 이러한 문제가 발생하지 않는다고 한다.

그리고 주의해야 할 것이 있는데, babel로 컴파일 한 후에도 ESM을 사용해야 정상적으로 tree shaking이 동작한다. 그렇기 때문에 babel 설정에서 모듈 시스템을 ESM으로 유지하도록 해야 한다.

- babel.config.js

  ```jsx
  const presets = [
    "@babel/presets-env",
    {
      modules: false,
    },
  ];
  ```

### Tree Shaking이 안되는 lodash

---

다양한 함수형 유틸이 모여있는 lodash는 ESM으로 작성되어 있지 않기 때문에 tree shaking이 동작하지 않는다. 그렇기 때문에 lodash는 각각의 함수 단위로 제공한다.

```jsx
import fill from "lodash/fill";
```

또, lodash는 esm 을 사용한 별도의 패키지를 작성했다. `lodash-es`를 사용하면 tree shaking이 가능하다.

```jsx
import { fill } from "lodash-es";
```

## Code Split

---

리액트가 SPA라고 해도 한 번에 전체 페이지를 가져오는 것은 비효율일 것이다. Code Split을 통해 코드를 원하는 단위로 분리하여 가져오도록 해보자.

```bash
$ mkdir webpack_code_split && cd webpack_code_split
$ yarn init -y
$ yarn add -D webpack webpack-cli clean-webpack-plugin
$ yarn add react react-dom
```

- src/index1.js

  ```js
  import { Component } from 'react';
  import { fill } from 'lodash';
  import { add } from './util';

  const result = fill([1, 2, 3], add(10, 20));
  console.log('this is index1', { result, Component });
  ```

- src/index2.js

  ```js
  import { Component } from 'react';
  import { fill } from 'lodash';
  import { add } from './util';

  const result = fill([1, 2, 3], add(10, 20));
  console.log('this is index2', { result, Component });
  ```

- webpack.config.js

  ```jsx
  const path = require("path");
  const { CleanWebpackPlugin } = require("clean-webpack-plugin");

  module.exports = {
    entry: {
      page1: "./src/index1.js",
      page2: "./src/index2.js",
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "dist"),
    },
    plugins: [new CleanWebpackPlugin()],
    mode: "production",
  };
  ```

index1과 index2로 각각 엔트리를 뽑았고, 웹팩 실행하면 page1.js, page2.js가 생성 된다. index1.js와 index2.js는 거의 같은 내용에 사용하는 라이브러리도 같다. 그렇기 때문에 dist/page1.js와 dist/page2.js 는 모두 lodash를 포함하여 파일 크기가 매우 크다.

lodash 같은 라이브러는 페이지별로 공통으로 사용하는 부분이므로 공통 부분을 분리하여 사용하면 효율적으로 사용할 수 있다. 또, 라이브러리는 서비스 코드만큼 자주 변하지 않으므로 묶으면 캐싱 효과도 누릴 수 있다.

- webpack.config.js

  ```jsx
  const path = require("path");
  const { CleanWebpackPlugin } = require("clean-webpack-plugin");

  module.exports = {
    entry: {
      page1: "./src/index1.js",
      page2: "./src/index2.js",
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "dist"),
    },
    plugins: [new CleanWebpackPlugin()],
    mode: "production",
    optimization: {
      splitChunks: {
        chunks: "all",
        minSize: 10,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: 2,
            name: "vendors",
          },
          default: {
            minChunks: 1,
            priority: 1,
            name: "default",
          },
        },
      },
    },
  };
  ```

이번에는 react와 관련된 라이브러리를 split 해보자. 단순하게 정규표현식으로 모듈의 위치를 지정해주면 된다. priority는 값이 높을 수록 우선적으로 판정된다.

```jsx
optimization: {
  splitChunks: {
    chunks: 'all',
    minSize: 10,
    cacheGroups: {
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: 2,
        name: 'vendors',
      },
      default: {
        minChunks: 1,
        priority: 1,
        name: 'default',
      },
      reactBundle: {
        test: /[\\/]node_modules[\\/](react|react-dom)/,
        priority: 5,
        name: 'reactBundle',
      }
    }
  }
}
```

### Dynamic Import

webpack에서 code split은 원래 동적 임포트 하는 경우에만 기본적으로 처리가 된다. 다음은 webpack에서 code split에 대한 기본 값이다. 우리는 chunks의 값을 async에서 all 로 변경하여 동적 임포트를 안하는 모듈에 대해서도 code split을 적용했다.

```jsx
optimizatiton: {
  splitChunks: {
    chunks: 'async',
    minSize: 30000,
    minChunks: 1,
    ...
    cacheGroups: {
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true,
      },
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
        ...
      }
    }
  }
}
```

처음으로 동적 임포트로 모듈을 가져오는 코드를 작성해보자.

- src/index3.js

  ```jsx
  function myFunc() {
    import("./util").then(({ add }) =>
      import("lodash").then(({ default: _ }) =>
        console.log("value", _.fill([1, 2, 3], add(10, 20)))
      )
    );
  }
  myFunc();
  ```

그리고 index3.js 만 코드 스플리팅하도록 처리해보자.

- webpack.config.js

  ```jsx
  const path = require("path");
  const { CleanWebpackPlugin } = require("clean-webpack-plugin");

  module.exports = {
    entry: {
      page3: "./src/index3.js",
    },
    output: {
      filename: "[name].js",
      chunkFilename: "[name].chunk.js",
      path: path.resolve(__dirname, "dist"),
    },
    plugins: [new CleanWebpackPlugin()],
    mode: "production",
  };
  ```

src/index3.js 에서 두 개의 동적 임포트를 했고, 두 개의 모듈은 동적으로 받을 수 있는 chunk가 각각 생긴다. 이 chunk 파일의 이름은 output 설정안쪽에 chunkFilename으로 설정했다.

이렇게 작성한 후 웹팩을 실행하면 dist 에 page3.js, chunk1, chunk2 가 생성된다.

이제 실제로 동적 임포트를 하는지 확인하자.

- dist/index.html

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <script src="./page3.js"></script>
  </body>
  </html>
  ```

브라우저에서 확인하면, chunk1과 chunk2는 포함 시키지 않았지만 네트워크로 호출하여 정상적으로 동작을 수행하는 것을 확인할 수 있다.

page3.js는 프로미스와 async/await를 사용하면 코드를 더 개선할 수 있다.

- src/index3.js

  ```jsx
  async function myFunc() {
    const [{ add }, { default: _ }] = await Promise.all([
      import("./util"),
      import("lodash"),
    ]);
    console.log("value", _.fill([1, 2, 3], add(30, 20)));
  }
  myFunc();
  ```
