---
title: Netlify 3편 - functions
date: '2021-08-21T08:56:56.263Z'
description: Netlify의 functions를 개발하는 환경과 배포를 해보자.
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633768694/tlog/cover/Netlify_th2gkd.png'
tags:
  - Infra
  - React
---


> [Netlify의 functions](https://www.netlify.com/products/functions/)은 AWS 의 Lambda같은 것인데, 서버 사이드에서 실행할 수 있는 코드를 netlify에 배포하여, 함수 단위의 이벤트를 처리할 수 있는 서비스다.  
 클라이언트에서 서버에게 데이터를 요청하는 것 외에 서버의 도움이 필요한 경우가 몇몇 있다. 예를 들면 OAuth 인증을 할 때와 같이 서드 파티 API에 키를 포함하여 요청을 보내면 키가 Request에 그대로 노출이 된다. 이 경우에는 서버가 대신 API를 호출하도록 하여 응답만 받도록 하여 보안을 높일 수 있거나, 또는 일반적으로 호출하면 CORS 이슈가 발생할 수 있는데, 서버를 통해 호출하면 상대적으로 자유롭다. 이런 종류의 서버의 역할이 필요할 때, 별도의 서버를 구성하지 않고, Netlify의 functions에서 위 기능을 수행할 수 있다.

### JavaScript 로 Netlify functions 작성

Netlify의 functions을 사용하려면 단 2개의 파일만 작성해주면 된다! 이미 netlify로 배포한 서비스가 있다면 당장 functions을 사용해보자.

우선 프로젝트 루트 디렉토리에 다음의 js과 netlify.toml 파일을 작성하자. netlify.toml 파일이 없다면 파일을 만들어서 내용을 작성하면 되고, 이미 존재 한다면 아래 내용만 추가해주면 된다.

- netlify-functions/hello.js
    
    ```jsx
    exports.handler = async function(event, context) {
      return {
        statusCode: 200,
        body: JSON.stringify({message: "Hello World"})
      };
    }
    ```
    
- netlify.toml
    
    ```bash
    [build]
      functions = "netlify-functions/"
    ```
    

이렇게 작성하고 코드를 푸시하면 원래 리액트 프로젝트가 [https://netlify-deploy.tammolo.com/](https://netlify-deploy.tammolo.com/) 에 떴다고 하면 내가 추가한 functions은

[https://netlify-deploy.tammolo.com/.netlify/functions/hello](https://netlify-deploy.tammolo.com/.netlify/functions/hello) 로 접근할 수 있다.

### TypeScript로 Netlify functions 작성

Netlify의 functions는 JavaScript 이외 TypeScript나 Go로도 작성할 수 있다. 

- netlify-functions/world.ts
    
    ```tsx
    import { Handler } from "@netlify/functions";
    
    const handler: Handler = async (event, context) => {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Hello World" }),
      };
    };
    
    export { handler };
    ```
    
타입스크립트에 대한 별도 설정 없이 JavaScript로 작성하는 것과 동일하게 작성하면 된다. `@netlify/functions` 만 설치해서 타입만 지정해주면 된다. 코드를 푸시하고 배포되면, [https://netlify-deploy.tammolo.com/.netlify/functions/world](https://netlify-deploy.tammolo.com/.netlify/functions/world) 들어가서 함수가 실행된 것을 확인할 수 있다.

## netlify-functions 개발 환경 갖추기

지금까지 netlify로 배포해서 functions을 확인했다. 이번에는 [netlify-lambda](https://www.npmjs.com/package/netlify-lambda) 모듈을 통해 로컬에서 띄워서 핫리로딩을 통해 개발할 수 있는 환경을 만들어보자. 모듈 먼저 설치하자.

```rb
$ yarn add -D netlify-lambda
```

우선 위에서 만든
 netlify-functions/hello.js → src/functions/hello.js로
 netlify-functions/world.ts → src/functions/world.ts로 옮기자.

package.json에는 functions을 로컬에서 실행하도록 명령을 추가하자.

- package.json
    
    ```bash
    scripts: {
      ...
      "lambda:start": "netlify-lambda serve src/functions",
    }
    ```
    
이제 `yarn lambda:start` 명령어를 통해 로컬에서 

그러면 9000포트로 서버가 뜨게 되는데, [http://localhost:9000/getData](http://localhost:9000/getData) 를 통해 로컬에서도 데이터가 잘 나올 것이다. 혹시라도 정상적으로 실행되지 않으면 TypeScript의 문제인데, babel 설정을 추가해줘야 한다.

- src/functions/.babelrc
    
    ```bash
    {
      "presets": [
        "@babel/preset-typescript",
        [
          "@babel/preset-env",
          {
            "targets": {
              "node": true
            }
          }
        ]
    }
    ```

위 처럼 babel 파일을 추가해주고 `yarn add -D @babel/preset-typescript` 로 타입스크립트 프리셋을 추가하자. 그리고 다시 `yarn lambda:start` 명령어를 실행하면 정상적으로 잘 뜰 것이다. 

### netlify functions는 프로젝트의 환경을 그대로 사용한다

netlify-functions에서 모듈이나 환경변수를 프로젝트의 환경의 것을 그대로 사용할 수 있다. React에서 Axios 모듈을 사용하고 있다면, functions에서도 사용할 수 있으며, functions에서 사용하는 모듈은 대부분 server side 모듈일텐데 이또한 리액트 프로젝트의 node_modules에 같이 포함하게 된다.

- .env
    
    ```jsx
    REACT_APP_SAMPLE_URL=https://jsonplaceholder.typicode.com/todos/1
    ```
    
- src/functions/hello.js
    
    ```jsx
    const axios = require('axios');
    
    exports.handler = async function(event, context) {
      const { data } = await axios.get(procss.env.REACT_APP_SAMPLE_API)
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    }
    ```
    
### 로컬에서 netlify-functions 프록시 처리하기

netlify에 functions가 배포되면 항상 endpoint가 `/.netlify/functions/{funtionName}` 이 된다. 개발환경에서는 `[https://localhost:9000/{functionName}](https://localhost:9000/{functionName})` 이라 포트도 다르고 프록시 처리를 해줄 필요가 있다.

CRA를 사용하지 않는다면, webpack에서 설정해주면 되고, CRA를 사용 한다면 src/setupProxy.js로 설정하면 된다.

```rb
$ yarn add http-proxy-middleware
```

- src/setupProxy.js
    
    ```jsx
    const { createProxyMiddleware } = require('http-proxy-middleware');
    
    module.exports = function(app) {
      app.use(
        '/.netlify/functions',
        createProxyMiddleware({
          target: 'http://localhost:9000',
          changeOrigin: true,
        })
      );
    };
    ```

이렇게 해두면 개발 환경에 상관 없이 아래처럼 호출하면 된다.

```jsx
const { data } = await axios.get('/.netlify/functions/hello')
```

netlify-lambda는 빌드 스크립트도 포함한다. package.json에 functions 빌드 명령어에 추가하자.

- package.json
    
    ```jsx
    scripts: {
      "build": "react-scripts build && yarn lambda:build"
      ...
      "lambda:build": "netlify-lambda build src/functions"
    }
    ```

`lambda:build` 로 src/functions 를 빌드하여 netlify.toml에 지정된 function 디렉토리로 넣는다. netlify에 배포할 때 빌드하면서 functions도 빌드하도록 `build` 명령어도 수정해주자.

나도 netlify-functions를 접한지 오래되지 않아서 기초적인 내용만 이해해서 사용하고 있다. 그러나 클라이언트 사이드에서 하기 어려운 일을 functions을 통해 할 수 있기 때문에 상황에 따라 굉장히 강력한 기능을 수행한다고 할 수 있다.

다음 4편에서는 netlify functions을 통해서 리액트의 SSR 을 구현해보도록 하자.