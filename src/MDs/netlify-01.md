---
title: Netlify 1편 - React 프로젝트 배포하기
date: '2021-07-28T08:56:56.263Z'
description: React 프로젝트를 Netlify에 정적 배포하기
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633768694/tlog/cover/Netlify_th2gkd.png'
tags:
  - Infra
  - React
---

> [Netlify](https://www.netlify.com/)는 클릭 몇 번만으로 프론트엔드 서비스를 배포하고 CI/CD 할 수 있는 멋진 서비스다. Github 레포에 있는 프로젝트를 연동하여 프로젝트에 푸시 하면 자동으로 자동 빌드 자동 배포 되도록 설정해보자.
> 

[Netlify 1편 - React 프로젝트 배포하기]() 

[Netlify 2편 - 필수 부가 기능 소개](https://www.notion.so/Netlify-2-39dad4d545184b8a88e2ca4cda9b8612) 

[Netlify 3편 - functions](https://www.notion.so/Netlify-3-functions-898ee8c4fe9c4ac884119cc99448849e) 

[Netlify 4편 functions로 SSR 구현](https://www.notion.so/Netlify-4-functions-SSR-97f812126cd643df969bb2d8f8508eea) 

이미 있는 프로젝트를 이용할 수 있지만, 없다면 간단히 아래처럼 기본 리액트 앱을 배포해보자.

CRA를 이용하여 타입스크립트를 사용하는 리액트 앱을 생성한다.

```bash
$ yarn create react-app my-app --template typescript
$ yarn start # 개발 환경으로 실행
$ yarn build # build 디렉토리에 빌드하du 정적 페이지 생성
```

## 새로운 사이트 생성

[Netlify](https://www.netlify.com/) 에 접속을 한다. 만약 회원 가입이 안되어 있다면 회원 가입한다.

[Netlify App](https://app.netlify.com/)

## 리액트 프로젝트 배포하기

이제 5개의 STEP 을 거쳐 프로젝트를 배포할 것이다. (정말 쉽다)

### STEP 1 `New site from Git` 클릭

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633768849/tlog/su93aze4m7z89zjdmdgj.png)

### STEP 2 사용할 `Github` 저장소를 선택

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633768850/tlog/jyn28dwnmcmvee5b7clx.png)

### STEP 3 연동 할 Github `Repository` 를 선택

이미 연동한 레포지토리가 있다면 리스트가 보이겠지만, 없다면 아래에 `Configure the Netlify app on GitHub` 버튼을 눌러서 추가해주면 된다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633768850/tlog/zwvqkojkbqcq0rifq5fc.png)

### STEP 4 Github에 `netlify`가 접근하도록 `권한 추가`

그러면 Github 계정에 연결되고, 아래와같은 페이지가 뜨고, 아래로 조금 내리면 `Repository access`를 설정할 수 있다. 

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633768850/tlog/ej4fmpwepsy4km20ljiy.png)

 All repositories를 연결할 수 있지만, 연동을 하고 싶은 프로젝트만 선택할 수 있다. 프로젝트를 추가 해주고 `Save`

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633768850/tlog/ik300oyrfgqbgcpawm6a.png)

### STEP 5 `배포` 설정

Github에 netlify 권한을 추가해주면 netlify에서도 Repository가 보이게 된다. 

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633768850/tlog/ylrs730sejqxatf6hszt.png)

배포할 레포지토리를 클릭하면, 아래처럼 배포 설정을 간단히 하는데, 아래의 설정은 이후에도 수정할 수 있으니 부담없이 설정해보자.

- `Branch to deploy`: 배포할 브랜치
- `Base directory`: 건들 필요 없음
- `Build command`: npm run build 또는 yarn build (next를 사용한다면, yarn export)
- `Publish directory`: build (별도 빌드 디렉토리를 설정했다면 output경로를 입력)

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633768851/tlog/dxpfbfletj19ecz0cgvy.png)

Deploy site 버튼을 누르자 마자 배포는 실행되고, 배포 중인 항목을 클릭하면 배포 스크립트의 실시간 로그를 볼 수 있다. 만약 배포가 실패 한다면, 로그를 확인하면 된다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633768852/tlog/o9s4ekauisxr9dtx6663.png)

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633768853/tlog/wkciy2qey88rwig4md48.png)

배포가 완료되고 다시 대시 보드에 가면, [https://condescending-carson-cd6699.netlify.app](https://condescending-carson-cd6699.netlify.app/) 처럼 배포된 주소가 활성화된다. 클릭하면 우리가 배포한 리액트 프로젝트가 실행된다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633768853/tlog/alciyihfi2jjmgcoewte.png)

5개의 STEP을 거쳐서 리액트 프로젝트를 Netlify에 배포 했다. 이제 netlify에 설정한 브랜치에 푸시를 하면 자동으로 빌드하고 배포까지 이뤄진다. 
Netlify에는 domain 연결, https 인증서, 환경 변수 설정, lambda functions 외 수 많은 플러그인들을 통해 정말 다양한 기능과 서비스를 제공한다. 이어서는 차례차례 domain 연결 부터 lambda functions을 이용한 ssr를 소개해볼까 한다.