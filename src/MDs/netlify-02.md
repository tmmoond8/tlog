---
title: Netlify 2편 - 필수 부가 기능 소개
date: '2021-08-06T08:56:56.263Z'
description: React 프로젝트를 Netlify로 배포 할 때 발생하는 404 에러, 환경 변수 설정, 도메인 연결을 설명한다.
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633768694/tlog/cover/Netlify_th2gkd.png'
tags:
  - Infra
  - React
---

> 1편에서는 Netlify에 리액트 프로젝트를 배포 해보았다. 그런데 실제 리액트 프로젝트를 배포하면 꼭 설정하게될 것들이 있다. 이번에는 아래의 문제를 해결해보자.

- 404 에러수정
- 환경 변수 사용하기
- 도메인 변경 및 개인 도메인 연결
> 

## 404 에러 발생

리액트 프로젝트를 배포했을 때, 아래의 이미지 처럼 404 Not Found 에러를 마주할 수 있다.  [관련된 이슈들이 구글링하면 꽤 보입니다.](https://stackoverflow.com/questions/50752350/page-not-found-when-trying-to-access-a-site-deployed-on-netlify)

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633917558/tlog/rmmagukfu4402nk4iaoz.png)

이 이슈는 `react-router`를 사용할 때 발생하는데, 예를 들어 router에 아래의 endpoint가 있다고 가정 해보자.

- https://react.app
- https://react.app/home
- https://react.app/about

[https://react.app](https://react.app) 에 접근해서 /home, /about을 이동할 때는 문제가 되지 않지만, [https://react.app/home](https://react.app/home) 또는 [https://react.app/about](https://react.app/aboutfh)로 바로 접근하게 되면 404 Page Not Found 에러 페이지가 뜨게 된다.

그 이유는 우리가 배포한 프로젝트의 `/build` 디렉토리를 살펴보면 index.html 파일이 있는데, [https://react.app](https://react.app) 로 접근하면 [https://react.app/index.html](https://react.app/index.html) 에 연결되기 때문에 정상적으로 페이지를 찾아서 렌더링 하게 된다. [https://react.app/home](https://react.app/home) 로 접근하면 [https://react.app/home/index.html를](https://react.app/home/index.html를) 찾기 때문에 찾지 못하여 404 에러가 발생한다. 이렇게 내부 라우팅을 사용하는 리액트는 항상 /build/index.html를 바라봐야 하는데, 이를 처리하는 방법 두 가지가 있다.

- _redirects 을 사용하는 방법
    
    /public/_redirects 파일을 생성해서 아래처럼 리다이렉트 규칙을 추가하면 된다.
    
    ```bash
    /*    /index.html    200
    ```
    
- netlify.toml 을 사용하는 방법
    
    프로젝트 루트에 netlify.toml 파일을 생성해서 아래 내용을 추가하자. ([netlify.toml](https://docs.netlify.com/configure-builds/file-based-configuration/) 은 redirect, plugin, functions 등 netlify에서 사용하는 다양한 설정을 할 수 있다.)
    
    ```bash
    [[redirects]]
      from = "/*"
      to = "/index.html"
      status = 200
    ```
    

## 환경 변수 사용하기

프로젝트에서는 거의 필수적으로 환경 변수를 사용하는데, 프로젝트에서 사용하는 dotenv 를 netlify에서도 손쉽게 설정할 수 있다.

대쉬보드에 Build & deploy 에 Environment에 `Edit variables` 버튼을 눌러서 사용하는 환경 변수를 수정하자. 수정한 환경 변수는 다음 배포 때 반영된다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633917559/tlog/jibf4pupymf6it69aobz.png)

## 도메인 변경 및 개인 도메인 연결

서비스를 연결하면 [https://condescending-carson-cd6699.netlify.app](https://condescending-carson-cd6699.netlify.app/) 처럼 기본으로 제공되는 주소에 연결하게 된다. netlify.app 의 서브 도메인으로 바꿀 수 있는 기능도 제공해주니 변경 해보자.

### 도메인 변경

 대시보드에 들어가서 `Domain settings` 를 누르면 도메인을 변경할 수 있다. 변경 하면 바로 적용된다!

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633917559/tlog/h2qqz7fgzzggkvwgltrl.png)

만약 소유하고 있는 도메인이 있다면, 개인 도메인도 얼마든지 연결할 수 있다.
서비스에 도메인을 연결하기 앞서 루트 도메인을 먼저 등록해줘야 한다. 
메인 대시보드에서 domain 탭으로 가면 내가 소유한 도메인을 등록할 수 있다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633917559/tlog/b1zyl0qab3cytrf8fpdf.png)

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633917559/tlog/nshznmak2nrwibn8tgao.png)

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633917559/tlog/bxyexkhntt8qejbll4q2.png)

### 개인 도메인 연결

나의 경우는 [tammolo.com](http://tammolo.com) 이라는 도메인을 등록했다. [netlify-deploy.tammolo.com](http://netlify-deploy.tammolo.com) 이라는 도메인에 [https://condescending-carson-cd6699.netlify.app](https://condescending-carson-cd6699.netlify.app/) 서비스를 연결해보자.

터미널에서 도메인의 IP 주소를 찾아보자.

```bash
$ nslookup condescending-carson-cd6699.netlify.app
```

연결된 도메인 2개가 뜨는데 이 중 아무거나 하나를 [netlify-deploy.tammolo.com](http://netlify-deploy.tammolo.com) 도메인에 연결하자. 여기선 178.128.104.229 을 연결해보겠다. (둘 중 아무거나 해도 되지만, 설정해서 잘 안된다면 나머지 다른것을 연결해보면 잘 될 것이다.)

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633917560/tlog/tbn443vqibmhmmuys8f5.png)

도메인 서비스는 어떤 곳을 사용해도 상관없는데, 예시는 내가 사용하고 있는 [hostingkr](https://www.hosting.kr/)을 예시로 가이드 했다. 

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633917562/tlog/ircm2ylolqbdp3djxkyz.png)

호스팅에 도메인을 추가하는 것은 서비스 마다 조금의 차이는 있지만 (보통은 3일 이내는 된다 최근에는 몇시간 내에도 되는 듯?), 시간이 필요하다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633917563/tlog/tmibfaab6qqtfzqw1iiy.png)

나의 경우 십여분이 지나자 호스팅이 연결 되었다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633917562/tlog/o4krpwoo5qmrfnfbszxr.png)

호스팅에는 추가해줬고, 이제 netlify에 해당 도메인을 연결해보자. 여기서 부터는 호스팅에 도메인이 연결된 것을 가정으로 진행한다.
다시 대시보드 도메인 설정 페이지로 이동하자. 

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633917563/tlog/hljnbjhftqfaavbqqldv.png)

`Add custom domain` 버튼을 누른다음에 도메인을 추가하자.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633917563/tlog/hul1iimvsrvm7jkhejzl.png)

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633917564/tlog/etj25piwn10g7anewzsx.png)

도메인이 연결되었는지 체킹을 하고 정상적으로 연결되면 아래처럼 파랗게 뜨고 페이지도 잘 뜰 것이다. 만약 한 번 시도했는데 바로 적용 안된다면, 조금의 시간을 보내고 다시 시도하면 잘 연결될 것이다. 연결 되었다면 같은 페이지에 아래쪽에 HTTPS에서 SSL까지 연결하자. netlify는 도메인만 연결해주면 클릭 한방으로 SSL까지 처리해주기 때문에 너무나도 편리하다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633917565/tlog/yfuicclw4e5akigd9r49.png)

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633917564/tlog/pcoiao6nwgiz2gnyjqlp.png)

지금까지는 netlify를 사용할 때 꼭 사용하게 될 부가 기능을 살펴 보았다. 다음에는 비교적 최신 스펙인 netlify functions를 사용하여 단순한 정적 페이지 서비스 이상의 것을 해보려고 한다.