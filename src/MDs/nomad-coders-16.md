---
title: 16 우버 클론 코딩 (nomad coders)
date: '2019-05-09T08:56:56.243Z'
description: 우버 코딩 강의 로그 2.0 ~ 2.6
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1632302785/tlog/cover/nuber_clone_nllng2.jpg'
tags:
  - 'Uber Clone Coding'
  - 'Nomad Coder'
  - React
  - Apollo
  - 'Project Setup'
---
# 

이 포스트는 nomad coders의 우버 클론 코딩 시리즈를 듣고 정리한 글 입니다.

[https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course](https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course)

nomad coders의 우버 클론 코딩 클라이언트 파트를 시작한다.

## #2.0 Create React App with Typescript

내가 글을 작성했을 떄가 cra 3.0.0이 최신이었고, 컴퓨터에 깔려 있는 버전이 2.1.8 버전이었다. 따로 업데이트 명령은 없고 설치 명령을 하면 버전업이 된다. 버전 확인을 하고 2.10 이상이 아니면 꼭 버전업을 하자. (이 프로젝트는 백엔드와 마찬가지로 typescript를 사용할 것이고, cra 2.10 버전부터인가 typescript를 정식 지원 한다고 알고 있다.)

    
    $ create-react-app -V
    $ npm install -g create-react-app
    $ create-react-app -V

    $ yarn create react-app nuber-client --typescript
    
    # 18년 10월부터인가 react도 typescript를 지원하기 때문에 react-scripts-ts 모듈을 안쓰고 위처럼 할 수 있다고 한다

> [https://github.com/wmonk/create-react-app-typescript](https://github.com/wmonk/create-react-app-typescript) 가이드에는 위 처럼 인스톨을 하라고 되어 있는데, 강의에서는 아래 방식처럼 했다.

    $ create-react-app —scripts-version=react-scripts-ts

> $ yarn create react-app nuber-client --typescript 으로 프로젝트를 생성했을 때 tsconfig.json에 baseUrl 을 "src"로 해줘야 한다고 경고가 떴다. react-scripts-ts 모듈을 사용할 때랑 차이가 좀 있는 것 같다.

프로젝트가 생성되면 이제 불필요한 것들을 제거 하고 프로젝트를 시작하면 된다.

제거 항목 : App.css, App.test.tsx, index.css, logo.svg, serviceWorker.ts

- src/App.tsx

        import React from 'react';
        
        class App extends React.Component {
          public render() {
            return (
              <div className="App">
                app
              </div>
            );
          }
        }
        
        export default App;

- src/index.tsx

        import React from 'react';
        import ReactDOM from 'react-dom';
        import App from './App';
        
        ReactDOM.render(<App />, document.getElementById('root'));

위처럼 파일을 수정하고 제거되거나 없다고 뜨는것들은 모두 실제 파일을 제거 하면된다.

- tsconfig.json 모듈 시스템을 commonjs로 변경하고 esModuleInterop: true, skipLibCheck: true 옵션을 추가했다.

        {
          "compilerOptions": {
            "baseUrl": "src",
            "outDir": "build/dist",
            "module": "commonjs",
            "target": "es5",
            "lib": ["es6", "dom", "esnext.asynciterable"],
            "sourceMap": true,
            "allowJs": true,
            "jsx": "react",
            "moduleResolution": "node",
            "rootDir": "src",
            "forceConsistentCasingInFileNames": true,
            "noImplicitReturns": true,
            "noImplicitThis": true,
            "noImplicitAny": false,
            "importHelpers": true,
            "strictNullChecks": true,
            "suppressImplicitAnyIndexErrors": true,
            "noUnusedLocals": true,
            "esModuleInterop": true,
            "skipLibCheck": true
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

    나는 baseUrl을 "src"로 변경했고, 원래 강의는 "." 이다.

- tslint.json

        {
          "extends": ["tslint:recommended", "tslint-react", "tslint-config-prettier"],
          "rules": {
            "max-classes-per-file": false
          },
          "linterOptions": {
            "exclude": [
              "config/**/*.js",
              "node_modules/**/*.ts",
              "coverage/lcov-report/*.js"
            ]
          }
        }

yarn start로 클라이언트앱을 실행시켜보자. 3000번 포트로 app이 뜬다.

tslint 관련된 모듈을 설치하자.

    $ yarn add tslint tslint-react tslint-config-prettier --dev

vscode 프로젝트를 닫고 새로 열면 tslint 가 적용된다. (바로 적용되게 갱신 하는 방법은 모르겠다.)

## #2.1 Apollo Setup part One

react 에서 apollo를 사용하여 graphql 쿼리를 할수 있도록 셋팅을 하자.

    $ yarn add apollo-boost react-apollo graphql

- src/apollo.ts 생성해서 apolloClient를 셋업하자.

        import ApolloClient from 'apollo-boost';
        
        const apolloClient = new ApolloClient({
          uri: "http://localhost:4000/graphql"
        });
        
        export default apolloClient;

- index.tsx 위에서 생성한 apollo client 객체를 리액트에 연결시키자. redux와 비슷하게 Provider에 객체를 넣어준다.

        import React from 'react';
        import { ApolloProvider } from "react-apollo"
        import ReactDOM from 'react-dom';
        import apolloClient from "./apollo";
        import App from './App';
        
        ReactDOM.render(
          <ApolloProvider client={apolloClient}>
            <App />
          </ApolloProvider>,
          document.getElementById('root') as HTMLElement
        );

## #2.2 Apollo Setup part Two

우리는 JWT를 사용해서 인증을 하는데, apollo에서는 굉장히 간단하게 관리할 수 있다. clientState는 앱의 global State를 설정하는 것으로 보인다. request는 요청을 보낼 때 사용하는 미들웨어 같은 것으로 이해하면 될 것같다. 클라이언트에서 보내는 모든 요청 헤더에 JWT 토큰을 추가해서 보낸다.

- src/apollo.ts ApolloClient 객체를 생성할 때, `clientState`와 `request`를 추가하자. clientState로 공용의 상태를 가지는 것 같다. request에는 매 요청마다 header에 값을 넣어주는 것 같다.

        import ApolloClient, { Operation } from 'apollo-boost';
        
        const apolloClient = new ApolloClient({
          clientState: {
            defaults: {
              auth: {
                __typename: "Auth",
                isLoggedIn: Boolean(localStorage.getItem("jwt"))
              }
            }
          },
          request: async (operation: Operation) => {
            operation.setContext({
              headers: {
                "X-JWT": localStorage.getItem("jwt")
              }
            });
          },
          uri: "http://localhost:4000/graphql"
        });
        
        export default apolloClient;

## #2.2 Apollo Setup part Three

## #2.4 Apollo Setup Recap

global state인 에는 clientState로 사용자의 로그인 정보를 가진다. 로그인/로그아웃을 하면 이 정보를 변경해야 하는데 이 처리를  Mutation 안에 작성 했다. 서버와는 별개로 clientState를 조작하는데 resolvers안에 Mutation을 작성했다.

- src/apollo.ts clientState 하위에 resolvers를 정의한다. resolvers안에서는 localStorage와 cache를 각각 사용하는데, localStoage가 하드디스크 같은 저장소면 cache는 앱이 사용하는 램 같은 거라는 생각이 들었다. 실제로 앱에서 사용하는 값은 cache 값이다.

        import ApolloClient, { Operation } from 'apollo-boost';
        
        const apolloClient = new ApolloClient({
          clientState: {
            defaults: {
              auth: {
                __typename: "Auth",
                isLoggedIn: Boolean(localStorage.getItem("jwt"))
              }
            },
            resolvers: {
              Mutation: {
        				// 인자는 순서대로, parent, args, contexg 다. 서버와 동일하다.
                logUserIn: (_, { token }, { cache }) => {
                  localStorage.setItem("jwt", token);
                  cache.writeData({
                    data: {
                      auth: {
                        __typename: "Auth",
                        isLoggedIn: true,
                      }
                    }
                  });
                  return null;
                },
        				// 인자는 순서대로, parent, args, contexg 다. 서버와 동일하다.
                logUserOut: (_, __, { cache }) => {
                  localStorage.removeItem("jwt");
                  cache.writeData({
                    data: {
                      auth: {
                        __typename: "Auth",
                        isLoggedIn: false,
                      }
                    }
                  });
                  return null;
                },
              }
            }
          },
          request: async (operation: Operation) => {
            operation.setContext({
              headers: {
                "X-JWT": localStorage.getItem("jwt")
              }
            });
          },
          uri: "http://localhost:4000/graphql"
        });
        
        export default apolloClient;

## #2.5 Connecting Local State to Components

아직까지는 처음 구조를 잡는거라 잘 이해가 되지 않지만,, 리덕스 대신 gql로 데이터를 가져와서 컨테이너를 통해 컴포넌트로 넘기는것을 해보자

- src/components/App/AppQueries.ts 데이터를 가져오는 쿼리 작성. @client는 이 데이터를 캐시로 보내게 한다고 한다. 나도 모르는 것 투성이다. apollo와 apollo-boost에 대해 공부를 좀 더 해봐야겠다.

        import { gql } from "apollo-boost";
        
        export const IS_LOGGED_IN = gql`
          {
            auth {
              isLoggedIn @client
            }
          }
        `;

- src/components/App/AppContainer.tsx 쿼리를 통해 데이터를 가져온 후 컴포넌트에 데이터를 넘겨서 렌더링 시킨다.

        import React from "react";
        import { graphql } from "react-apollo";
        import { IS_LOGGED_IN } from "./AppQueries";
        
        const AppContainer:any = (props) => (
          <div>
            { JSON.stringify(props.data) }
          </div>
        );
        
        export default graphql(IS_LOGGED_IN)(AppContainer);

- src/components/App/index.ts 자주 나오는 패턴인데,,,, 경로를 상위 디렉토리까지만 입력해도 되도록 index.ts를 만든다. (상위 디렉토리까지만 적으면 하위의 index.ts를 자동으로 찾는다.)

        export { default } from "./AppContainer";

- src/index.tsx 에서 App.tsx가 아닌 데이터를 가진 AppContainer를 index.tsx에서 사용하도록 변경하자.

        import React from 'react';
        import { ApolloProvider } from "react-apollo"
        import ReactDOM from 'react-dom';
        import apolloClient from "./apollo";
        import App from './components/App';
        
        ReactDOM.render(
          <ApolloProvider client={apolloClient}>
            <App />
          </ApolloProvider>,
          document.getElementById('root') as HTMLElement
        );

이제 src/App.tsx를 사용하지 않으므로 삭제하자.

이렇게 까지 하고 클라이언트를 실행시키자. client의 스크립트는 yarn start다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952570/tlog/_2019-05-02__5-445bf5d7-db4b-424d-a4f7-213315ccb4b7.55.54_regodr.png)

위 데이터를 살짝 살펴보면, 일단 variables, loading, networkStatus, auth 필드가 있다. 아직은 auth 객체 외에는 설명할 수 있는 것들이 없다. 나도 apollo-boost를 공부해야 한다. 

- src/apollo.ts auth 객체는 현재 clientState 객체인데, 아무 조작을 안했기 때문에 defaults로 설정한 값들이 들어 있을 것이다. auth외에도 공용으로 사용할 값들은 저렇게 관리하는 것 같다.

        ...
        clientState: {
        	defaults: {
        	  auth: {
        	    __typename: "Auth",
        	    isLoggedIn: Boolean(localStorage.getItem("jwt"))
        	  }
        	},
        ...

## #2.6 Typescript and React Components

저번에 graphql로 캐시에 값을 가져오는 것을 했다. 이번에는 가져온 값을 토대로 렌더링을 해보는 것을 짜보자.

AppContainer를 분리를 할텐데, AppContainer는 AppQueries의 graphql로 데이터를 가져오게 하고 가져온 값을 AppPresenter에게 보내서 렌더링 하게 할 것이다. 

- App/AppQueries.ts :  apollo(graphql)로 데이터를 가져온다.
- App/Presenter.tsx  : 어떻게 컴포넌트를 그릴지를 작성한다.
- App/AppContainer.tsx  : AppQueries.ts 에서 가져온 데이터로 Presenter.tsx에 넘겨 컴포넌트를 완성 시킨다.
- App/index.tsx  : 완성 시킨 컴포넌트를 다른 곳에서 가져오기 편하도록 한다.

- src/components/App/AppPresenter.tsx

        import React from "react";
        
        const AppPresenter = ({ isLoggedIn }) => (
          <span>
            {isLoggedIn ? "you are in" : "your are out"}
          </span>
        );
        
        export default AppPresenter;

- src/components/App/AppContainer.tsx

        import React from "react";
        import { graphql } from "react-apollo";
        import AppPresenter from './AppPresenter';
        import { IS_LOGGED_IN } from "./AppQueries";
        
        const AppContainer:any = (props) => (
          <AppPresenter isLoggedIn={props.data.auth.isLoggedIn}/>
        );
        
        export default graphql(IS_LOGGED_IN)(AppContainer);

이렇게 container에서 presenter를 호출 한다. 

여기서 타입을 설정하여 강력하게 타입스크립트를 사용해보자.

- src/components/App/AppPresenter.tsx 를 수정하자.

        import React from "react";
        
        interface IProps {
          isLoggedIn: boolean;
        }
        
        const AppPresenter: React.SFC<IProps> = ({ isLoggedIn }) => (
          <span>
            {isLoggedIn ? "you are in" : "your are out"}
          </span>
        );
        
        export default AppPresenter;

만약 AppContainer에서 isLoggedIn을 인자로 넘기지 않을 경우 우리에게 알려주게 된다.