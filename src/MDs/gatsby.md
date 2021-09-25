---
title: Gatsby
date: '2019-05-08T04:13:29.424Z'
description: Gatsby라는 프레임워크가 어떤 특징으로 가지고 왜 블로그를 만들때 많이 사용하는지에 대해 알아보자.
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952585/tlog/cover/gatsby_zucriz.jpg'
tags:
  - Gatsby
---

## Gatsby 란??

정적 웹사이트, 웹앱 생성기

웹사이트의 데이터는  graphql을 사용하고, 뷰 라이브러리로는  reafct.js를 사용

JAM stack

[https://www.gatsbyjs.org/](https://www.gatsbyjs.org/)  

<br>

## 개발 환경 셋팅

node, git를 기본적으로 설치하자.
```bash
$ npm intall -g gatsby-cli
$ gatsby help
```

개츠비에서 제공하는 기본적인 기능(생성, 핫로딩, 빌드 등)을 확인 할 수 있다. 튜토리얼에는 hello wordl start로 시작하라고 한다.

    $ gatsby new hello-world https://github.com/gatsbyjs/gatsby-starter-hello-world

나는 yarn도 설치되어 있어서 그런지 패키지 매니져로 yarn 을 쓸지 npm을 쓸지 물어봤다.

<br>

## Feature

### 1. src/pages 하단에 .js 파일을 만들면 해당 파일이름으로 라우팅 해준다.

gatsby에서는 특정 구조를 익혀야 한다. 예를들면 src/pages 하단에 있는 js파일의 이름으로 routing이 된다는 것이다.

```text
    {project}/src/pages/home.js
    {project}/src/pages/about.js
```

[localhost:8000/home](http://localhost:8000/home) ,[localhost:8000/about](http://localhost:8000/about) 으로 접근하면 해당 페이지로 열린 다는 것이다.

### 2. 다양한 API 제공

페이지를 만들때 들어갈 루틴이라든가, 포함될 파일이라든가 그런 것을을 셋팅하는 다양한 API를 제공한다.

- {project}/gatsby-browser.js 파일을 생성하고 css파일을 임포트하면 글로벌로 적용된다. 아마 어떤 글로벌로 사용할 파일을 이 파일에서 처리하는 것 같다.
  ```jsx
  import "./src/styles/global.css";  // 여기서 임포트하면 전역으로 적용된다.
  ```

### 3. 유용한 Plugin 이 많음

react 모듈중에서도 gatsby의 플러그인 형태로 된 모듈들이 많음. 예를들면 markdown을 html로 바꿔주는 모듈이라든가. fileSystem 플러그인으로 특정 파일들을 관리한다든가하는 일을 할 수 있다.

플러그인을 추가할 때는 

- {project}/gatsby-config.js 에서 설정한다.
  ```jsx
  module.exports = {
    plugins: [
      {
        resolve: `gatsby-plugin-typography`,
        options: {
          pathToConfigModule: `src/utils/typography`,
        },
      },
    ],
  }
  ```

### 4. 데이터를 graphql 을 사용하여 가져온다.

gatsby 모듈에는 graphql도 제공하고 쿼리를 날리는 것도 제공하는 것 같다.

```jsx
import { useStaticQuery, Link, graphql } from "gatsby"
```

useStaticQuery는 gatsby 2.0v부터 나왔다는데,, 사용법이 쿨하다.

```jsx
const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            about
          }
        }
      }
    `
  )

...

<h3>{data.site.siteMetadata.title}</h3>
...
```
    

쿼리는 쿼리인데 어디에 저런 데이터를 저장하지 하고 싶을 텐데, siteMetadata는 프로젝트의 페이지에 대한 메타정보라서 파일로 관리한다.

- gatsby-config.js 파일에 아래처럼 셋팅하면 쿼리로 저 값들을 불러올 수 있다.
  ```jsx
  module.exports = {
    siteMetadata: {
      title: `Pandas Eating Lots`,
      about: `뭘 봐 공부중인거 처음봐?`
    }
  }
  ```

gastby에서는 garphql을 통해 데이터를 가져오도록 되어 있다. 그러나 필수 사항은 아니지만, graphql로 filesytem이나 워드프레스 api 등 각종 데이터를 가져올 수 있도록 플러그인을 제공하기 때문에 필수 아닌 필수가 된것 같다.

### 5. [http://localhost:8000/___graphql](http://localhost:8000/___graphql) 에 graph/QL 인가 graphql 쿼리 툴을 제공한다.

- gatsby-config.js 파일에 아래처럼 셋팅하면 쿼리로 저 값들을 불러올 수 있다.
  ```jsx
  module.exports = {
    siteMetadata: {
      title: `Pandas Eating Lots`,
      about: `뭘 봐 공부중인거 처음봐?`
    }
  }
  ```

- [http://localhost:8000/___graphql](http://localhost:8000/___graphql) 에서
  ```jsx
  query {
    site {
      siteMetadata {
        title
        about
      }
    }
  }
  ```

<br>


## Gatsby가 블로그로 많이 사용되는 이유!

내가 블로그로 Gatsby를 사용한 이유는 페이지를 만드는 방식이 굉장히 똑똑한 방식이기 때문이다. 위에 열거한 feature를 토대로 얘기를 해보자.

보통 마크다운으로 포스팅을 작성한다. 마크다운으로 작성된 포스팅은 plugin으로 손쉽게 페이지로 변환한다. 파일 시스템 플러그인이 마크다운으로 작성된 파일을 찾아서 html형태로 변환하고 변환된 페이지를  src/pages에 넣으면 자동으로 페이지가 라우팅되어 엔드 포인트가 된다. 

index.js에서는 이러한 엔드포인트를 링크만 해주면 블로그가 된다.
```bash
$ npm install --save gatsby-source-filesystem
```
- gatsby-config.js
  ```jsx
  module.exports = {
    siteMetadata: {
      title: `Pandas Eating Lots`,
      about: `뭘 봐 공부중인거 처음봐?`
    },
    plugins: [
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          name: `src`,
          path: `${__dirname}/src/`,
        },
      }
    ],
  }
  ```

또 멋진거,, 쿼리로 가져온 데이터를 바로 사용하기

```jsx
import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

export default ({ data }) => {
  console.log(data)
  return (
    <Layout>
      <div>Hello world</div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allFile {
      edges {
        node {
          relativePath
          prettySize
          extension
          birthTime(fromNow: true)
        }
      }
    }
  }
`
```

이 파일 filesystem 플러그인을 사용하면 블로그를 쉽게 만들 수 있다. 예를들면,

src/pages/*.* 파일은 항상 새로운 페이지로 추가가 된다.

index.js에서는 filesystem 플러그인을 통해 얻은 페이지 정보로 페이지들을 링크 한다.

index.js에서는 페이지에 대한 리스트만 보여주면 간단히 블로그를 만들 수 있다.

여기서 각 페이지를 그릴 때 html으로 작성하는게 아닌 markdown으로 작성하고 markdown 파일만 html로 렌더링해서 보이도록 하면 된다. 

markdown 파일을 html로 렌더링해주는 플러그인도 제공한다.

```bash
$ npm install --save gatsby-transformer-remark
```

이제 markdown 파일을 src/pages/ 에 작성하면 블로그에 추가가 된다.

그리고 파일을 가져오는 순서를 graphql에서 쿼리로 할수 있다. 이건 원래 graphql의 feature다.
```sql
query {
  allMarkdownRemark(sort: { 
    fields: [frontmatter___date], order: DESC 
  })
}
```   

graphql 쿼리에 익숙하지 않네, 정 안되면 js에서 하면 되니까..

<br>


## 소소한 규칙들

### 1. css 파일을 .module.css로 해줘야 한다.?

그리고 css module에 css 파일을 읽게 하려면 특정 형태의 이름으로 해야 한다는 것이다.

/src/**/style-name.module.css

확장자가 .css가 아닌 .module.css로 해야지 css Module이 정상적으로 읽을 수 있었다.

또 react의 Link 컴포넌트 처럼 특별한 행동을 하는 컴포넌트는 'gatsby' 모듈 안에 있다. Link 말고도 더 있나보다.

### 2. 컴포넌트의 이름이 대문자로 시작하지 않으면 뭔가 문제가 있다??
