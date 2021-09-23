---
title: Next.js with TypeScript
date: '2019-07-14T08:56:56.243Z'
description: Next.js starter (.feat TypeScript)
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952587/tlog/nextjs8_k2cxq7.png'
tags:
  - NextJS
  - TypeScript
---
#

이번에는 Next.js에 타입스크립트를 얹는 방법에 대해 정리했다.

Next.js 를 사용해서 ts를 적용하는 것은 잘 가이드 되어 있기 때문에 참고 해서 작성했다.

[https://github.com/zeit/next-plugins/tree/master/packages/next-typescript](https://github.com/zeit/next-plugins/tree/master/packages/next-typescript)

먼저 next.js 로 프로젝트 구성을 먼저 하자.

## [Getting Started](https://nextjs.org/learn/basics/getting-started)

next.js 간단히 시작해보자.

    mkdir hello-next
    cd hello-next
    yarn
    yarn add react react-dom next
    mkdir pages

- package.json 에 스크립트를 조금 수정해보자.

        {
        	"dependencies": {
        		...
        	},
            "scripts": {
            "dev": "next",
            "build": "next build",
            "start": "next start"
          }
        }

컴포넌트 하나를 추가하자. 특이 점이라면 React를 임포트 시키지 않은거??

- pages/index.js

        const Index = () => (
          <div>
            <p>Hello Next.js</p>
          </div>
        )
        
        export default Index

yarn 으로 실행 시키면 기본 앱이 실행된다.

    yarn dev

typescript 를 설치

- next.config.js

        const withTypescript = require('@zeit/next-typescript')
        module.exports = withTypescript({
          webpack(config, options) {
            return config
          }
        })

- .babelrc

        {
          "presets": [
            "next/babel",
            "@zeit/next-typescript/babel"
          ]
        }

- tsconfig.json

        {
          "compilerOptions": {
            "allowJs": true,
            "allowSyntheticDefaultImports": true,
            "jsx": "preserve",
            "lib": ["dom", "es2017"],
            "module": "esnext",
            "moduleResolution": "node",
            "noEmit": true,
            "noUnusedLocals": true,
            "noUnusedParameters": true,
            "preserveConstEnums": true,
            "removeComments": false,
            "skipLibCheck": true,
            "sourceMap": true,
            "strict": true,
            "target": "esnext"
          }
        }

- .prettierrc.js

        module.exports = {
          printWidth: 80, // 줄 바꿈 길이
          parser: 'typescript',
          singleQuote: true, // "대신 '를 사용
          useTabs: false, // 탭 대신 스페이스 사용
          tabWidth: 2, // 들여 쓰기 레벨마다 공백 수를 지정
          trailingComma: 'es5' // 후행 쉼표를 항상 추가하면 새로운 배열 요소, 파라메터, 프로퍼티를 자바스크립트 코드에 추가할 때 유용
        };

- .vscode/settings.json

        {
          "editor.formatOnSave": false,
          "[typescript]": { "editor.formatOnSave": true },
          "[typescriptreact]": { "editor.formatOnSave": true },
        }

ts 관련 모듈을 설치하자.

    yarn add --dev typescript @types/react @types/node
    yarn add --dev tslint tslint-react prettier tslint-config-prettier tslint-config-airbnb

이렇게 하고 pages/index.js → pages/index.tsx 로 파일 확장자를 변경하고 `yarn dev` 를 실행하자.

이제 마지막으로 해야 할 것은 express를 사용해서 Next.js를 띄우는 것이다. dev 서버가 아닌 express로 서버를 띄우는 이유는 Next.js 가 SSR에 대한 솔루션이기도 하고 enpoint를 별칭으로 사용한다던가, 아니면 프록시를 사용한다던가 할 때를 위해서다.

    yarn add express

- server.js

        const express = require('express')
        const next = require('next')
        
        const dev = process.env.NODE_ENV !== 'production'
        const app = next({ dev })
        const handle = app.getRequestHandler()
        
        app
          .prepare()
          .then(() => {
            const server = express()
        
            server.get('*', (req, res) => {
              return handle(req, res)
            })
        
            server.listen(3000, err => {
              if (err) throw err
              console.log('> Ready on http://localhost:3000')
            })
          })
          .catch(ex => {
            console.error(ex.stack)
            process.exit(1)
          })

- package.json

        {
        	...
        	"scripts": {
            "dev": "node server.js",
            "build": "next build",
            "start": "NODE_ENV=production node server.js"
          }
        }

이제 yarn dev를 실행하면 서버가 잘 뜨고, yarn build && yarn start 명령어를 통해 빌드 후 띄우는 것도 됐다.