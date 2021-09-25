---
title: NPM에 React 모듈 배포하기
date: '2019-11-01T08:56:56.263Z'
description: NPM에 리액트에서 사용할 수 있는 모듈 배포하기
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632315208/tlog/cover/npm-feature_oxz3dh.png'
tags:
  - NPM
  - React
---

최근에 [리액트용 네이버 로그인](https://www.npmjs.com/package/react-naver-login) 컴포넌트 모듈을 NPM에 배포했는데, 이 과정에 겪은 경험을 기록해보았다. 튜토리얼 처럼 작성 하였고, 이 포스팅에 과정을 따라오면 누구나 NPM에 모듈을 배포할 수 있게 될 것이다.

 예제가 commonjs과 es6 Module을 사용하기 때문에 모듈 시스템에 대한 이해가 선행된다. 

## TOC

- Step 1 - 기본적인 JavaScript Module을 배포
- Step 2 - TypeScript, Test, Rollup 적용
- Step 3 - React Module 배포

## Step 1 - 기본적인 JavaScript Module 배포

---

React 모듈을 배포하기 전에, JavaScript만 포함한 간단한 예제 프로젝트를 만들어서 배포 해보자.
```bash
# 디렉토리 이름은 본인만의 이름으로 설정해주면 좋다.
$ mkdir tmmoond8-test-module
$ cd tmmoond8-test-module
$ npm init -y

# npm init 명령어를 실행하면 package.json 이 생성된다.
```

- package.json
  ```json
  {
    "name": "tmmoond8-test-module",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [],
    "author": "",
    "license": "ISC"
  }
  ```

package.json 파일은 우리가 등록할 모듈의 정보를 나타낸다. name, version, description 처럼 메타 정보를 나타낸다. 이 중 main은 index.js를 default로 설정 된다. index.js란 이름으로 파일을 만들고 모듈을 정의하자.

- index.js
  ```javascript
  module.exports = {
    add: function(a, b) {
      return a + b;
    }
  };
  ```

우리가 만든 패키지의 구조는 간단히 아래와 같다.
```
tmmoond8-test-module
    ├── index.js
    └── package.json
```

이제 `main.js`를 패키지로 만들어서 배포할 차례다. 먼저 npm의 계정이 있어야 한다. [https://www.npmjs.com/](https://www.npmjs.com/) 로 가서 계정을 생성하자. 
```bash
$ npm login

# Username: tammlolo
# Password: 
# Email: (this IS public) tmmoond8@gmail.com

# 로그인을 완료하면 배포가 되었다.
$ npm publish
```  

NPM에 우리가 만든 모듈이 등록되었다. 테스트를 위해 별도의 프로젝트를 만들어서 우리가 만들 모듈을 사용해보자.

tmmoond8-test-module 디렉토리 내부가 아닌 새로운 디렉토리를 만들어서 독립적으로 테스팅 하는 것이 좋다.

**패키지 테스트**
```bash
$ mkdir module-tester
$ cd module-tester
$ npm init -y

# 우리가 등록한 모듈을 설치하자.
$ npm i tmmoond8-test-module
```

- index.js    우리가 등록한 모듈을 사용하는 파일을 정의하자.
  ```javascript
  const { add } = require('tmmoond8-test-module');
  console.log(add(1, 5));
  
  # 우리가 정의한 add가 잘 동작한다.

  $ node index.js
  ```

`node_modules` 디렉토리 안에는 우리가 정의한 `tmmoond8-test-module` 패키지가 있다. 디렉토리를 열어보면 우리가 작성한 모듈이 그대로 들어가 있다.

## Step 2 - TypeScript, Test, Rollup 적용

---

우리는 더욱더 크고 안정적인 모듈을 만들기 위해서 TypeScript, Test, Rollup을 프로젝트 추가해보자.

디렉토리가 복잡해져서 전체 디렉토리를 먼저 훑어 보자.
  ```
  tmmoond8-test-module
      ├── LICENSE.md
      ├── README.md
      ├── demo
      │   ├── package.json
      │   ├── public
      │   │   ...
      │   ├── src
      │   │   ├── App.css
      │   │   ├── App.js
      │   │   ├── App.test.js
      │   │   ├── index.css
      │   │   ├── index.js
      │   │   └── serviceWorker.js
      ├── build                      # 타입스크립트로 빌드하면 build 디렉토리에 js 파일로 생성된다.
      │   ├── __tests__          
      │   │   └── add.spec.d.ts
      │   ├── index.d.ts
      │   ├── index.es.js
      │   ├── index.es.js.map
      │   ├── index.js
      │   └── index.js.map
      ├── node_modules               # 의존성 모듈
      ├── package.json
      ├── rollup.config.js           # Rollup module 설정
      ├── src                        # 소스 디렉토리
      │   ├── __tests__              # 테스트 디렉토리
      │   │   └── add.spec.ts
      │   └── index.tsx
      └── tsconfig.json              # 타입 스크립트 설정
  ```

### Typescript 적용

JavaScript보다 더 안전한 코드를 작성할 수 있게 해주는 TypeScript를 추가하자.
```
$ npm i -D typescript
```
- tsconfig.json
  ```json
  {
    "compilerOptions": {
      "outDir": "build",
      "module": "esnext",
      "target": "es5",
      "lib": ["es6", "dom", "es2016", "es2017"],
      "sourceMap": true,
      "allowJs": false,
      "jsx": "react",
      "declaration": true,
      "moduleResolution": "node",
      "forceConsistentCasingInFileNames": true,
      "noImplicitReturns": true,
      "noImplicitThis": true,
      "noImplicitAny": true,
      "strictNullChecks": true,
      "suppressImplicitAnyIndexErrors": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true
    },
    "include": ["src"],
    "exclude": ["node_modules", "build"]
  }
  ```

- src/index.ts

     파일도 index.js → src/index.ts 변경하고, 소스에도 타입을 추가하자.
      ```typescript
      export const add = (a: number, b: number) => a + b;
      ```

위에서 작성한 같은 소스를 ts로 작성했고 이제 빌드해서 js 파일로 만들어 내자. `tsc` 명령어를 실행하면 `tsconfig.json`에서 설정한 대로 `build` 디렉토리에 빌드가 된다.

    $ tsc

> 만약 `tsc` 모듈이 설치되어 있지 않으면 모듈을 설치하자. `npm install —-global tsc`

### Test (jest) 적용

테스트 환경을 추가 하자. 최근에는 jest가 테스트 환경으로 가장 선호된다.
```bash
$ npm i -D ts-jest jest @types/jest
```

- package.json

  jest테스트를 위한 설정을 package.json에 추가한다.
  ```json
  {
    ...
    "script": {
      "test": "jest"
    }'
    "jest": {
      "preset": "ts-jest",
      "testEnvironment": "node",
      "testPathIgnorePatterns": ["/demo/", "/build/"]
    }
  }
  ```

- src/__tests__/add.spec.ts
  ```typescript
  import { add } from "..";
  
  test("create a new hello", () => {
    expect(add(4, 5)).toBe(9);
  });

  $ npm test

  # 테스트를 실행하면 잘 실행 된다.
  ```

### Rollup

Rollup 모듈은 CommonJS, AMD, ES6 모듈 등 다양한 모듈 시스템에서 사용할 수 있는 형태로 모듈을 export 해주는 도구다.
```bash
$ npm i -D rollup rollup-plugin-typescript2 rollup-plugin-commonjs  rollup-plugin-peer-deps-external rollup-plugin-node-resolve
```
- package.json      

  이미 `"main": "index.js"` 로 정의되어 있지만, 새로 아래처럼 정의한다.
  ```json
  {
    ...
    "scripts": {
      "build": "rollup -c",
      "test": "jest"
    },
    "main": "build/index.js",
    "module": "build/index.es.js",
    "jsnext:main": "build/index.es.js",
  }
  ```

- rollup.config.js
  ```javascript
  import typescript from "rollup-plugin-typescript2";
  import commonjs from "rollup-plugin-commonjs";
  import external from "rollup-plugin-peer-deps-external";
  import resolve from "rollup-plugin-node-resolve";
  
  import pkg from "./package.json";
  
  export default {
    input: "src/index.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        exports: "named",
        sourcemap: true
      },
      {
        file: pkg.module,
        format: "es",
        exports: "named",
        sourcemap: true
      }
    ],
    plugins: [
      external(),
      resolve(),
      typescript({
        rollupCommonJSResolveHack: true,
        exclude: "**/__tests__/**",
        clean: true
      }),
      commonjs({
        include: ["node_modules/**"],
        namedExports: {
          "node_modules/react/react.js": [
            "Children",
            "Component",
            "PropTypes",
            "createElement"
          ],
          "node_modules/react-dom/index.js": ["render"]
        }
      })
    ]
  };
  ```

- .gitignore
  ```
  node_modules/
  ```
- .npmignore
  ```bash
  # npm
  node_modules/
  
  # dev
  src
  .gitignore
  rollup.config.js
  tsconfig.json
  
  # GIT
  .git
  ```

build를 하기 앞에 먼저 생성되었던 `build` 디렉토리를 제거 하자.

`npm run build` 를 하면 `build` 디렉토리에  `index.js`, `index.es.js`, `index.es.js` 가 생성된다.

## Step 3 - React 모듈 배포

---

드디어 이 글의 본래 목적인 React 모듈을 만들어서 배포할 차례다.
```bash
$ npm i -D react-scripts-ts react-dom react react-test-renderer
$ npm i -D @types/react @types/react-dom @types/react-test-renderer
```

- package.json
  ```json
  {
    ...
    "peerDependencies": {
      "react": "^16.0.0",
      "react-dom": "^16.0.0"
    },
  }
  ```

    peerDependencies 에서 react와 react-dom을 추가한 것은 우리가 만든 패키지가 react, react-dom에 호환성을 가지고 있음을 알리는 것이다. 일종의 플러그인이라고 말할 수 있다.

- src/index.tsx

  React를 사용하므로 파일 확장자를 .ts → .tsx 로 변경했다.
  ```typescript
  import * as React from 'react';
  
  interface IProps {
    text: string;
  }
  
  const SampleComponent = (props: IProps) => {
    const { text } = props;
    return <div style={{ backgroundColor: 'black', color: "white" }}>Hello {text}</div>
  }
  
  export default SampleComponent;
  ```

- src/__tests__/component.spec.tsx

  기존에 있던 `add.spec.ts`는 제거 하고 컴포넌트 테스트 코드를 다시 만들자.
  ```typescript
  import * as React from "react";
  import * as renderer from "react-test-renderer";
  import SampleComponent from "..";
  
  test("component testing'", () => {
    const component = renderer.create(<SampleComponent text="World" />);
    const testInstance = component.root;
  
    expect(testInstance.findByType(SampleComponent).props.text).toBe("World");
  
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  $ npm test
  
  # 테스트가 잘 성공한다.
  ```

- rollup.config.js

    input 파일은 리액트 컴포넌트인 src/index.tsx로 변경해주자.
    ```javascript
    ...
    export default {
      input: "src/index.tsx",
      output: [
      ...
    ```

build를 하기 앞에 먼저 생성되었던 `build` 디렉토리를 제거 하고 build를 다시 하자.
```bash
$ npm run build
```

이것으로 패키지를 만든 것이다. 패키지를 배포하기 전에 내부적으로 우리가 만든 모듈을 사용하는 데모 프로젝트를 만들어주면 더욱 좋다.
```bash
$ npx create-react-app demo
$ cd demo

# 상위 디렉토리의 모듈을 의존성에 추가할 수 있다.
$ npm i -S react-module-boilerplate@file:..
```

- demo/src/App.js
  ```javascript
  import React from 'react';
  import MyComponent from 'tmmoond8-test-module';
  
  function App() {
    return (
      <div className="App">
        <MyComponent text="test text"/>
      </div>
    );
  }
  
  export default App;
  ```
```
$ cd demo && npm run start
```

만약 npm start 시 다음의 오류가 발생하면, .env 파일을 생성해서 `SKIP_PREFLIGHT_CHECK=true` 를 추가해주자.

- `npm run start` Error 오류 해결
  ```text
  There might be a problem with the project dependency tree.
  It is likely not a bug in Create React App, but something you need to fix locally.
  
  The react-scripts package provided by Create React App requires a dependency:
  
    "babel-loader": "8.0.6"
  
  Don't try to install it manually: your package manager does it automatically.
  However, a different version of babel-loader was detected higher up in the tree:
  
    /Users/moonti/Documents/1Study/npm-module-tutorial/react-module-boilerplate/node_modules/babel-loader (version: 7.1.2) 
  
  Manually installing incompatible versions is known to cause hard-to-debug issues.
  
  If you would prefer to ignore this check, add SKIP_PREFLIGHT_CHECK=true to an .env file in your project.
  That will permanently disable this message but you might encounter other issues.
  
  To fix the dependency tree, try following the steps below in the exact order:
  
    1. Delete package-lock.json (not package.json!) and/or yarn.lock in your project folder.
    2. Delete node_modules in your project folder.
    3. Remove "babel-loader" from dependencies and/or devDependencies in the package.json file in your project folder.
    4. Run npm install or yarn, depending on the package manager you use.
  
  In most cases, this should be enough to fix the problem.
  If this has not helped, there are a few other things you can try:
  
    5. If you used npm, install yarn (http://yarnpkg.com/) and repeat the above steps with it instead.
        This may help because npm has known issues with package hoisting which may get resolved in future versions.
  
    6. Check if /Users/moonti/Documents/1Study/npm-module-tutorial/react-module-boilerplate/node_modules/babel-loader is outside your project directory.
        For example, you might have accidentally installed something in your home folder.
  
    7. Try running npm ls babel-loader in your project folder.
        This will tell you which other package (apart from the expected react-scripts) installed babel-loader.
  
  If nothing else helps, add SKIP_PREFLIGHT_CHECK=true to an .env file in your project.
  That would permanently disable this preflight check in case you want to proceed anyway.
  
  P.S. We know this message is long but please read the steps above :-) We hope you find them helpful!
  ```

- demo/.env
  ```
  SKIP_PREFLIGHT_CHECK=true
  ```

지금까지 리액트 컴포넌트 모듈을 NPM에 배포해보았다.  만약 빠르게 리액트 모듈 개발을 원하면 [react-module-boilerplate](https://github.com/tmmoond8/react-module-boilerplate)를 만들어 둔 것이 있으니 사용 하는 것도 추천한다.

## References

---

[내 NPM 패키지(모듈) 배포하기](https://heropy.blog/2019/01/31/node-js-npm-module-publish/)

[How to Create a Typescript and React Module](https://www.pluralsight.com/guides/react-typescript-module-create)