---
title: 1 우버 클론 코딩 (nomad coders)
date: '2019-04-07T08:56:56.243Z'
description: 우버 코딩 강의 로그 1.1 ~ 1.7
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632302785/tlog/cover/nuber_clone_nllng2.jpg'
tags:
  - 'Uber Clone Coding'
  - 'Nomad Coder'
  - GraphQL
  - 'Project Setup'
---

이 포스트는 nomad coders의 우버 클론 코딩 시리즈를 듣고 정리한 글 입니다.

[https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course](https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course)

## #1.1 Project Setup. Git & installation

디렉토리를 만들고 강의에서는 nuber-server로 만들었다.

프로젝트의 뼈대를 만들 건데, typescript, tslint, definitelyTyped를 설정한다.

[definitedlyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)를 가보면 다양한 라이브러리에 대해 타입이 정의되어 있는 것을 볼 수 있다.
```ruby
$ mkdir nuber-server && cd nuber-server
$ git init
$ echo "# NUBER SERVER" >> README.md
$ git remote add orign (your repository)

# yarn으로 프로젝트를 적당히 설정하자
$ yarn init
# 기본 모듈들을 설치하고
$ yarn add typescript ts-node tslint-config-prettier nodemon @types/node --dev

# 프로젝트에서 노드 모듈 디렉토리만 .gitignore에 추가하자
$ echo "/node_modules" >> .gitignore
$ git add && git commit && git push origin # 커밋과 첫 푸시를 해놓자
```

## 프로젝트 구조
```text
- src
  package.json
  README.md
  tsconfig.json
  tslint.json
  .gitignore
```
위는 우리가 만들 프로젝트 구조. src 디렉토리를 추가하고 아래의 파일을 새로 만들어서 내용을 채우자.

 니콜라스가 설정하는 tsconfig.json, tslint.json

- tsconfig.json
  ```json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "module": "commonjs",
      "target": "es5",
      "lib": ["es6", "dom", "esnext.asynciterable"],
      "sourceMap": true,
      "allowJs": true,
      "moduleResolution": "node",
      "rootDir": "src",
      "forceConsistentCasingInFileNames": true,
      "noImplicitReturns": true,
      "noImplicitThis": true,
      "noImplicitAny": false,
      "strictNullChecks": true,
      "suppressImplicitAnyIndexErrors": true,
      "noUnusedLocals": true,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "experimentalDecorators": true,
      "emitDecoratorMetadata": true
    },
    "exclude": [
      "node_modules",
      "build",
      "scripts",
      "acceptance-tests",
      "webpack",
      "jest",
      "src/setupTests.ts"
    ]
  }
  ```

- tslint.json
  ```json
  {
    "extends": ["tslint:recommended", "tslint-config-prettier"],
    "linterOptions": {
      "exclude": ["config/**/*.js", "node-modules/**/*."]
    },
    "rules": {
      "no-console": false,
      "member-access": false,
      "object-literal-sort-keys": false,
      "ordered-imports": true,
      "interface-name": false,
      "strict-null-checks": false,
      "member-ordering": false
    },
    "rulesDirectory": []
  }
  ```

나의 삽질인데

- @types/node 를 설치했더니 src 하위로 겁나 생성되었다,, 이래도 되나..

    ![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952035/tlog/_2019-04-07__10-137f722f-8edd-406d-9929-cc6d8137c35d.50.13_u0lzms.png)

      → 위 문제 해결 !!  @type/node 모듈을 —dev 옵션으로 설치 하지 않아서 발생한 문제

## #1.2 Project Setup, Typescrfipt and Node.js

이번에는 package.json에 타입스크립트 파일을 빌드하는 설정을 추가해보자.

- src/index.ts 파일을 추가하자
  ```js
  console.log('work!!');
  ```

- package.json 에 scripts 내용을 추가하자.
  ```json
  {
    "name": "nuber-server",
    ...
    "dependencies": {},
    "devDependencies": {
      "@types/node": "^11.13.0",
      ...
    },
    "scripts": {
      "dev": "cd src && nodemon --exec ts-node index.ts"
    }
  }
  ```

그리고 yarn dev 명령어를 하면 아래 처럼 명령어가 잘 동작한 것을 볼 수 있다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952568/tlog/_2019-04-07__11-060885d6-52ce-4485-ba88-f693bee162a7.19.35_srz2au.png)

src/index.ts에서 콘솔 내용을 변경하고 저장하면 터미널에 핫로딩되는 것을 확인할 수 있다. 우리가 사용한 스크립트에 nodemon을 통해 노드를 실행했기 때문이다.

nodemon은 ts파일에 대해 hot loading 해주는데, 임의의 확장자에도 핫로딩하도록 옵션을 줄 수 있다.

- src/something.graphql 만들어서 graphQL 내용을 적는다.
  ```ts
  type Query {
    something: Boolean
  }
  ```

- package.json에 scripts를 좀 변경하자. ts 뿐아니라 graphql 확장자에서도 hot loading하자.
  ```json
  "scripts": {
      "dev": "cd src && nodemon --exec ts-node index.ts -e ts,graphql"
  }
  ```

yarn dev 명령어를 다시 실행하고 src/something.graphql에서 쿼리를 변경하면(Boolean -> String) 터미널에 핫로딩되는 것을 확인할 수 있다.

## #1.3 A word on @types

이번 비디오에서는 따로 프로젝트를 진행하지 않았고 @typed 그러니까 노드에서 타입이 필요한 이유를 말해주고 있다. 우리가 src/index.ts 에 입력한 console.log에서 log 함수의 인자로 어떤타입이 몇개가 오는지 또 리턴이 무엇인지 확인 할 수 있다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952568/tlog/_2019-04-07__11-dd7c9f0f-647a-48a5-b37d-5d7cdff64d3d.35.00_hcol42.png)

## #1.4 GraphQL Yoga and Express part One

graphql-yoga로 graphql 구조를 잡아줄 껀데, ~~react-create-app 처럼 기본 설정을 바로 잡아주는 모듈인 것 같다.~~ graphql을 서버사이드에서 손쉽게 사용하 수 있게 해주는 프레임워크다. 내부적으로 express를 내포하고 쿼리툴을 제공한다.

[https://github.com/prisma/graphql-yoga](https://github.com/prisma/graphql-yoga)

graphql-yoga를 설치하자
```rb
$ yarn add graphql-yoga
```

그리고 미들웨어를 설치할 껀데 helmet은 보안을 위해, morgan은 로깅을 위해, cors는 단일출처 정책을 처리하기 위해 사용한다.

또 @types 모듈도 함께 받아야 한다. helmet, morgan 같은 모듈은 javascript 모듈인데 typescript에서 사용하려면 타입이 정의되어야 한다.
```rb
$ yarn add helmet morgan cors
$ yarn add @types/helmet @types/morgan @types/cors --dev
```

이제 graphql-yoga로 백엔드 app을 만든다. 이 부분은 express로 앱을 만드는 것과 거의 유사 했다.

- src/app.ts을 만들어서 app을 작성해보자. 간단하게 위에 설치한 미들웨어를 추가한 graphql express app객체를 만든다.
  ```ts
  import cors from 'cors';
  import { GraphQLServer } from 'graphql-yoga';
  import helmet from 'helmet';
  import logger from 'morgan';
  
  class App {
    public app: GraphQLServer;
  
    constructor() {
      this.app = new GraphQLServer({});
      this.middlewares();
    }
  
    private middlewares = (): void => {
      this.app.express.use(cors());
      this.app.express.use(logger('dev'));
      this.app.express.use(helmet());
    };
  }
  
  export default new App().app;
  ```

## #1.5 GraphQL Yoga and Express part Two

이번에는 graphql을 사용하는 express앱을 실행시키는 코드를 만들 거다.

우선, src/something.graphql 파일은 쓸모 없는 파일이니 삭제하자.

- src/index.ts 파일에 콘솔을 지우고 위에서 만든 app.ts파일의 앱을 실행시키자.
  ```ts
  import { Options } from 'graphql-yoga';
  import app from './app';
  
  const PORT : number | string = process.env.PORT || 4000;
  const PLAYGROUND_ENDPOINT : string = "/playground";
  const GRAPHQL_ENDPOINT : string = "/graphql";
  
  const appOptions : Options = {
    port: PORT,
    playground: PLAYGROUND_ENDPOINT,
    endpoint: GRAPHQL_ENDPOINT
  }
  
  const handleAppStat = () => console.log(`Listening on port ${PORT}`)
  app.start(appOptions, handleAppStat);
  ```

임포트는 npm 모듈 > 내 local 모듈 순으로 하자.

express.start는 두개의 인자를 전달 받는데 @types를 사용하기 때문에 아래 처럼 어떤 인자의 어떤 타입을 쓰는지 바로 확인할 수 있다. 여기서 물음표는 있어도 되고 없어도 되는 인자를 가르킨다.
```ts
start(options: Options, callback?: ((options: Options) => void)): Promise<HttpServer | HttpsServer>;
```

지금까지 수행한 내용은 실제로 앱을 실행시킬 수는 없었다. 스키마 오류가 뜨는데 이게 정상이다.

GraphQLServer는 props를 받는데 그 내용은 resolvers, queries, mutaion, subscfriptions 같은 것들이 들어가야 한다. 지금은 아무 것도 없기 때문에 정상적으로 동작하지 않았다.

## #1.6 API and Schema Structure part One

이번에는 API를 만드는 것을 진행한다. graphql에 resolver와 type definition을 입력하는 방법을 알게 된다.

graphql은 기존 express 서버에서 REST API를 사용하는 것처럼 url을 사용하지 않는다고 한다.

일단 니콜라스가 잡은 구조대로 만들어보자.

그전에 graphql 문법 강조를 위해 다음의 확장프로그램을 설치하는 것을 추천한다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952568/tlog/_2019-04-08__11-aeb57cec-2aae-4d2a-86c6-f8592777e695.08.53_cjkcs4.png)

- src/api/hello/sayHello/sayHello.graphql
  ```ts
  type Query {
    sayHello: String!
  }
  ```

- src/api/hello/sayHello/sayHello.resolvers.ts
  ```ts
  const resolvers = {
    Query: {
      sayHello: () => "Hey Hello how are ya"
    }
  }
  
  export default resolvers;
  ```

- src/api/hello/sayBye/sayBye.graphql
  ```ts
  type Query {
    sayBye: String!
  }
  ```

- src/api/hello/sayBye/sayBye.resolvers.ts
  ```ts
  const resolvers = {
    Query: {
      sayBye: () => "Hey Bye see ya"
    }
  }
        
  export default resolvers;
  ```

.graphql은 router의 endpoint, .resolvers는 실제 요청을 수행하는 컨트롤러 또는 서비스라고 생각하면 될 것 같다.

## #1.7 API and Schema Structure part Two

.graphql 파일에 만든 요청들을 서버가 알 수 있게 등록해야 한다. 이 과정을 편하게 해주는 것이 graphql-tools와 merge-graphql-schemas 모듈이다.

merge-grapql-schemas는 sayHello, sayBye등 요청에 대해 분리가 되어 있는데 하나로 합치고 합친 내용을 graphql-tools 모듈에서 스킴으로 만들어서 App.ts에 전달한다.
```rb
$ yarn add graphql-tools merge-graphql-schemas
```

파일 중에 .graphql 인 확장자를 graphql 파일로서 다 찾아서 등록하고, .resolvers. 가 포함된 파일들은 resolver로 모두 등록 한 뒤 하나로 합친다.

- src/schema.ts에 정의된 type definition과 resolvers로 스키마를 만들자.
  ```ts
  import { IResolvers } from 'graphql-middleware/dist/types';
  import { makeExecutableSchema } from 'graphql-tools';
  import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas';
  import path from 'path';
  
  // 현재 디렉토리 api 하위에 .graphql을 확장자로 갖는 모든 파일을 가져옴. fileLoader가 이런 작업을 처리한다.
  // 강의와 다르게 타입을 수정함 GraphQLSchema[] -> string[]
  const allTypes: string[] = fileLoader(
    path.join(__dirname, "./api/**/*.graphql")
  );
  
  // ts파일은 배포용으로 빌드하면 js로 떨어지므로
  // 강의와 다르게 타입을 수정함 string[] -> IResolvers[]
  const allResolvers: IResolvers[] = fileLoader(
    path.join(__dirname, "./api/**/*.resolvers.*")
  );
  
  const mergedTypes = mergeTypes(allTypes);
  const mergedResolvers = mergeResolvers(allResolvers);
  
  const schema = makeExecutableSchema({
    typeDefs: mergedTypes,
    resolvers: mergedResolvers
  });
  
  export default schema;
  ```

- src/app.ts 에 GraphQLServer 객체를 생성할 때 위에서 만든 스키마를 넣어주자.
  ```ts
  ...
  import schema from './schema';
  
  class App {
    public app: GraphQLServer;
  
    constructor() {
      this.app = new GraphQLServer({schema});
      ...
    }
  
    ...
  }
  
  export default new App().app;
  ```

니콜라스는 merge-graphql-schemas 모듈을 사용할 때 타입이 지정안되어 있는데, 예제를 따라해보니 타입 문제가 있어서 타입을 조금 수정했다. 

타입 스크립트이기 때문에 어떤 타입의 문제가 나는지 알 수 있어서 잘 몰라도 쉽게 고칠 수 있었다.

graphql 서버의 뼈대를 대략적으로 만들었다. [아까 /playground로 api를 연결해두었으니 제대로 작동하는지 보자.](http://localhost:4000/playground)

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952568/tlog/_2019-04-09__11-4a03c500-da6e-4960-8fa0-9d95f1952d18.01.18_ytjyj6.png)

이렇게 typesciprt로 graphql 이 적용된 express 서버의 기초를 만들었다.