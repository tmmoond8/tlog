---
templateKey: blog-post
title: Next.js 9
date: 2019-08-21T08:56:56.243Z
description: 7월에 발표된 Next.js 9에서 어떤점이 변경되었는지를 중심으로
featuredpost: true
featuredimage: /img/nextjs9.png
tags:
  - nextjs
  - react
  - ssr
---
#

7월에 발표된 Next.js 9에서 어떤점이 변경되었는지를 중심으로

## Feature

- **[Built-in Zero-Config TypeScript Support](https://nextjs.org/blog/next-9#built-in-zero-config-typescript-support)**: Build your application with increased confidence, thanks to automatic TypeScript support and integrated type-checking.
- **[File system-Based Dynamic Routing](https://nextjs.org/blog/next-9#dynamic-route-segments)**: Express complex application routing requirements through the file system without the need for a custom server.
- **[Automatic Static Optimization](https://nextjs.org/blog/next-9#automatic-static-optimization)**: Create ultra-fast websites that leverage *Server-Side Rendering and Static Prerendering* by default without compromising on features.
- **[API Routes](https://nextjs.org/blog/next-9#api-routes)**: Quickly build back-end application endpoints, leveraging hot-reloading and a unified build-pipeline.
- **[More Production Optimizations](https://nextjs.org/blog/next-9#production-optimizations)**: Applications are more responsive than ever thanks to in-viewport prefetching and other optimizations.
- **[Improved DX](https://nextjs.org/blog/next-9#developer-experience-improvements)**: Unobtrusive, ease-of-use improvements to help you develop at your best.

## Next.js 9 Getting Start

### Step 1  Project Setup

    mkdir next9
    cd next9
    npm init -y
    npm i next@latest react@latest react-dom@latest
    mkdir pages

- pages/index.tsx

        const Index = () => (
          <div>
            <p>Hello Next.js</p>
          </div>
        )
        
        export default Index

- package.json

        {
        	...
        	"scripts": {
            "dev": "next",
            "build": "next build",
            "start": "next start"
          }
        }

`npm run dev` 로 프로젝트를 띄운다.

### Step 2  Dynamic Routing

기존에는 pages 하위에 바로 존재하는 컴포넌트만 페이지로 등록이 되었었는데, 파일 시스템 기반으로 라우팅을 지원한다.

다음의 파일 구조로 되어있다면

    └── pages
        ├── apple
        │   ├── ipad.tsx
        │   └── macbook.tsx
    		├── google
    		│   └── [name].tsx
        └── index.tsx

/

/apple/ipad

/apple/macbook

/google/*

총 3 + @개의 엔드포인트가 생기는 것이다.

- pages/apple/IPad.tsx

        const IPad = () => (
          <div>
            <p>IPad</p>
          </div>
        )
        
        export default IPad

- pages/apple/Macbook.ts

        const Macbook = () => (
          <div>
            <p>Macbook</p>
          </div>
        )
        
        export default Macbook

파일이름을 url 주소에 포함 시키기 때문에 url 인코딩 이슈가 발생할 수 있다. 이럴 경우는 명시적으로 인코딩을 해주는 방법을 사용하면 되는데, 공식 문서에 소개되어 있다.

여기서 와일드 카드를 사용하는 방식도 적용할 수 있다.

- pages/google/[name].tsx     -    대괄호는 와일드 카드로 사용되어 query에서 입력된 값이 name으로 들어간다.

        import { useRouter } from 'next/router'
        
        const Apple = () => {
          const router = useRouter()
          const { name } = router.query
        
          return (
            <div>
              <p>{name}</p>
            </div>
          )
        }
          
        export default Apple

> _app, _document 에서 아래처럼 처리 해주면 될 것 같은데, 어느 때 _app을 어느때 _document를 사용할지 찾아봐야 겠다.

    static async getInitialProps({ query }) {
      // pid = 'hello-nextjs'
      const { pid } = query
    
      const postContent = await fetch(
        `https://api.example.com/post/${encodeURIComponent(pid)}`
      ).then(r => r.text())
    
      return { postContent }
    }

> pages 안쪽에 텍스트는 모두 소문자로 작성해야 한다. 그 이유는 이 텍스트 들이 url이 될텐데 url은 대소 문자를 구분하지 않기 때문이다. 실제로 대문자로 했을 때 개발 서버로 띄우면 되지만 빌드한 후 띄우면 제대로 routing 되지 않았다.

### Step 3  API routes

next.js에서는 기본적으로 express 서버다. 그러므로 정적 파일을 위한 서버나 리액트를 띄우기 위한 서버로 뿐 아니라 온전히 웹 서버의 역할을 할 수 있다. 이미 pages 안쪽에 파일 시스템의 구조에 따라 엔드 포인트가 생기는데, 별도의 엔드포인트를 코드로 추가하면 내 생각에 충돌되거나 복잡한 일이 생길수 있을 것 같다. 그렇기에 pages/api 하위로 api역할을 할 수 있는 요청을 받도록 스펙을 추가 했다.

![](_2019-08-20__1-0d64d39c-1c3b-408b-b624-048315308bb0.22.58.png)

- pages/api/foo.tsx

        export default (req, res) => {
          res.send({
            name: 'foo',
            bloodType: 'A'
          });
        }

- pages/api/bar.tsx

        export default (req, res) => {
          res.send({
            name: 'bar',
            bloodType: 'B'
          });
        }

아래 처럼 json 형태의 응답을 내려준다. (.feat json viewer awsome)

![](_2019-08-20__1-15583106-779f-4497-93a4-848ca4d202cb.24.17.png)

TypeScript가 built-in 이라지만, 어떻게 쓸지에 대해서는 동일하게 설정하면 된다.

- tsconfig.json

        {
          "compilerOptions": {
            "baseUrl": ".",
            "outDir": "build/dist",
            "module": "esnext",
            "target": "es5",
            "lib": [
              "es6",
              "dom",
              "esnext.asynciterable"
            ],
            "sourceMap": true,
            "allowJs": true,
            "jsx": "preserve",
            "moduleResolution": "node",
            "rootDir": ".",
            "forceConsistentCasingInFileNames": true,
            "noImplicitReturns": true,
            "noImplicitThis": true,
            "noImplicitAny": false,
            "importHelpers": true,
            "strictNullChecks": true,
            "suppressImplicitAnyIndexErrors": true,
            "noUnusedLocals": true,
            "esModuleInterop": true,
            "skipLibCheck": true,
            "allowSyntheticDefaultImports": true,
            "strict": true,
            "resolveJsonModule": true,
            "isolatedModules": true,
            "noEmit": true,
            "experimentalDecorators": true
          },
          "exclude": [
            ".next",
            "node_modules",
            "build",
            "scripts",
            "webpack",
          ],
        }