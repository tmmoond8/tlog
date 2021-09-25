---
title: gatsby 블로그 만들기
date: '2019-05-01T08:56:56.243Z'
description: gatsby + Netlify 사용해서 블로그 만들기
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952585/tlog/cover/gatsby_zucriz.jpg'
tags:
  - Gatsby
  - React
---

gatsby 블로그를 만들기 위해 먼저  gatsby에서 컨셉을 이해했다. 

<https://www.gatsbyjs.org/tutorial/> 에서 튜토리얼을 가능하면 읽어보길 추천한다.

튜토리얼 스탭은 0 \~ 8까지 있고, 0 \~ 3은 기본적인 내용 + react에 대한 설명이다. 리액트를 모르는 분이라면 꼭 읽어봐야 할것이다.

4 ~ 8은 Advance tutorial인데, 블로그 페이지를 직접 만들면서 얼마나 효과적이고 쿨하게 정적페이지를 만드는지에 대한 내용이 나온다. 정말 쿨한 방법을 사용하기 때문에 개인적으로 감동적인 내용이었다.

이렇게 진행을 하고 yunheur 님의 gatsby starter를 추천해주셨다.

<https://github.com/netlify-templates/gatsby-starter-netlify-cms>

gatsby + netlify CMS를 사용해서 포스트 쓰고 배포도 쉽게 할 수 있게 된다.

<https://app.netlify.com/start/deploy?repository=https://github.com/netlify-templates/gatsby-starter-netlify-cms&stack=cms> 에서 먼저 github 계정을 연동한다. 계정이 연동되면 새 프로젝트를 위한 레포지토리를 생성한다. 

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952570/tlog/_2019-05-01__5-aaa67035-0c6a-40bf-bffa-9c011d5db4c3.26.26_wgsfx2.png)

이렇게 저장하면 내 github에 myapp 레포지토리가 생성된다. 내 github로 가서 확인하자. 생성된 레포지토리를 로컬에 클론하자.

```bash
$ git clone https://github.com/[GITHUB_USERNAME]/[REPO_NAME].git
$ cd [REPO_NAME]
$ yarn
$ npm run start
```

CMS 테스트를 위해 빌드도 하자.

```bash
$ npm run build
$ npm run serve
```

[http://localhost:9000/](http://localhost:9000/admin/#/) 에 가면 기본 블로그가 떠있다.

[http://localhost:9000/admin/](http://localhost:9000/admin/#/) 에는 CMS를 설정할 수 있다. 여기서 로그인을 하라고 되어있고 Your Netlify site URL를 입력하라고 한다. 

Domain settings 버튼을 누르고, mystifying-cu\*\*.netlify.com(청록색) 링크를 누르면 Your Netlify site URL 로 이동한다. 이동한 주소를 복사해서 입력해주자.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952570/tlog/_2019-05-01__5-95757168-0b53-4e33-93ff-b91337b669c9.31.05_bblgcc.png)

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952570/tlog/_2019-05-01__5-295ce5a2-dd72-4a62-9cf8-43fa3d85491f.32.37_orsmoc.png)

[https://mystifying-curie-7c034e.netlify.com](https://mystifying-curie-7c034e.netlify.com/)

나 같은 경우에는 admin에 내 gmail 계정이 비번이 틀렸다고 해서 암호 찾기 후 다시 연결했더니 잘 되었다.
