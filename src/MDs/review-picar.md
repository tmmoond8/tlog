---
title: Picar 프로젝트 리뷰
date: '2022-07-27T08:56:56.243Z'
description: React + Ionic 를 사용하여 iOS, Android 앱과 SEO 을 지원하기 위해 했던 삽질을 공유
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1659928459/tlog/kllydfrhqempcfdjq4ob.png'
tags:
  - Log
  - Ionic
  - React
  - SSR
---

> 이 포스팅은 전기차 커뮤니티 서비스 피카를 개발한 후기를 작성한 것 입니다. `React` + `Ionic` 를 사용하여 `iOS, Android 앱` 과 `SEO`을 지원하기 위해 했던 삽질들을 공유해보려고 합니다.  
>   
> 👨🏻‍🎨 : 어, 형 웬일이야?  
> 🙍🏼‍♂️ : 심심한데, 뭐 만들어 볼까 해서
> 

# Picar

전기차 오너들을 위한 커뮤니티 서비스로 전기차에 대한 정보를 고류하고, 차종별로 게시판을 분류하여 더 질 좋은 정보를 공유하고자 만들었습니다.

![https://www.picar.kr](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1659927404/tlog/ogtwayrzs5yovbptxnfv.png)

## 개요

### **Tech Stack**

- **Front**: `Typescript`, `React`, `Ionic`, `Capacitor`, `MobX`, `Emotion`, `firebase realtime DB`, `Google Sheets API`
- **Backend**: `Typescript`, `Node.js`, `Express`, `MySQL`, `TypeORM`

## **Demo**

- 웹 - [https://www.picar.kr/](https://www.picar.kr)
- 안드로이드 - [https://play.google.com/store/apps/details?id=com.tmmoond8.picar](https://play.google.com/store/apps/details?id=com.tmmoond8.picar)
- iOS - [https://apps.apple.com/sg/app/피카-전기차-커뮤니티/id1590699820](https://apps.apple.com/sg/app/%ED%94%BC%EC%B9%B4-%EC%A0%84%EA%B8%B0%EC%B0%A8-%EC%BB%A4%EB%AE%A4%EB%8B%88%ED%8B%B0/id1590699820)

### **Github**

- Front: [https://github.com/tmmoond8/picar-front](https://github.com/tmmoond8/picar-front)
- Backend: [https://github.com/tmmoond8/picar-backend](https://github.com/tmmoond8/picar-backend)

## 왜 React로 ?

저는 리액트로 프론트를 개발하는 것을 가장 좋아합니다. `Angular`, `Vue`, `Svelte`를 Todo List 정도만 만들어 본 수준이라 이해도가 높지 않고, `React`가 순수한 `html`, `js`의 처리 방식에 가장 유사한 방식을 지원 한다고 생각합니다. 그리고 서드파티 라이브러리들이 매우 많고, `TypeScript`를 아주 잘 지원합니다. 개인적으로 익숙 하기 때문에 초기에 웹을 빠르게 개발 할 수 있었습니다.

 이 프로젝트에는 `MobX`를 적용하였는데, 저는 가벼운 상태관리를 선호 합니다. 꼭 필요한 경우 아니면 `Context API`를 활용하는 것을 더 좋아합니다. 최근에는 `react-query`, `SWR` 같은 쿼리 캐싱 라이브러리를 사용하여 별도의 데이터를 크게 조작하지 않고 바로 사용하는 것을 선호합니다. 이 부분은  백엔드에서 어느정도 정제된 결과를 내려줄 것이라는 것을 전제로 합니다.

## 왜 Ionic을 ?

일단 웹으로 어느정도 서비스를 만들었습니다. 그러자 기획자이자 디자이너인 지인이

> 👨🏻‍🎨 : 근데 이거 앱으로 만들어야 돼. 그래야 잔존율도 높고 검색도 되서 유입도 늘어!  
> 🙍🏼‍♂️ : !!!???


리액트로 만들어진 서비스를 앱으로 어떻게 만들지… 새로 만들긴 싫은데.. 이런 생각을 하다가 가능한 방법을 모색했습니다. 바로 떠오른 방법은 `React Native`였습니다. 저는 `React Native`에 대해서 많이 들어봤지만, 사용해 본적은 없었습니다. 지금 상황에서 `React Native`로 만들려면 `React Native`의 `TextView`, `View`로 감싸서 새롭게 개발을 해야 하며 관리 포인트가 꽤 늘어난다고 생각 하여 포기했습니다. 무엇보다 웹을 좋아하고 웹 베이스로 만들고 싶었고, 최적화 등도 웹 측면에서 해결해보고 싶었습니다.

때마침 `React`로도 `Ionic`을 개발할 수 있다는 것을 알게 되었고, 학부생 시절에 `Angular`로 `Ionic`으로 프로토타입을 만든 경험이 있어서 해보기로 했습니다. 정보를 찾아보니 `Ionic`은 꽤 많이 개선되었고 꽤 장기적으로 프로젝트를 유지해오며 확장해 왔습니다. `Ionic`은 `Angular` 외에도 2019년부터 `React`지원을 시작으로 현재는 `Vue`까지 공식지원하고 있으며 자체 개발한 `Capacitor` 라는 새로운 네이티브 브릿지 모듈을 사용하고 있었습니다. 

 공식 문서는 꽤 잘 작성되어 있었고, [@capacitor-comunity](https://github.com/capacitor-community) 에서 리액트에서 `Capacitor`를 사용하는 환경을 향상 시키려는 노력도 보였습니다. 예를들어 `useCamera` 처럼 네이티브 기능을 제공할  때 훅 형태로 제공 합니다.

<aside>
💡 `Capacitor`는 `Ionic` 팀에서 개발한 `Cordova`와 유사한 모듈로 웹에서 네이티브 기능을 사용할 수 있게 해줍니다.

</aside>

그러나 `Ionic`을 사용하는데 가장 큰 문제는 기존 예제나 레퍼런스들이 `Angular` , `Cordova`기반이거나 `React` + `Capacitor` 관련 정보가 거의 없다시피한 점이었습니다. 그래도 내가 잘 모르는 네이티브 플랫폼에서 방법을 찾기 보다 웹으로 해결방법을 찾으면 된다는 생각에 강행했습니다.

> `Ionic`,  `Capacitor` 에 대해 좀 더 알고 싶은 분은  [링크 클릭](https://tlog.tammolo.com/posts/ionic-react-01)
> 

 

## 리액트 + Ionic으로 앱을 개발하려면

 저는 학부생 때 안드로이드 네이티브 앱을 개발하여 마켓에 출시 한 경험은 있었고 iOS는 개발 환경조차 모르던 상태였습니다. 기본적으로 앱이라는 플랫폼의 특성을 이해해야 하는 것은 첫 번째 벽이었습니다. 권한 문제라던가 http 통신 문제 등이 여기에 속합니다. 이 부분은 그래도 많은 자료들이 있어서 도움 받을 수 있습니다.

 이제 본격적으로 제가 겪은 삽질에 대해 말씀드리겠습니다. 앱이라는 것을 경험하면서 여러가지 문제를 마주했고 그 중 가장 큰 문제 두가지를 소개하고 그에 대해서 어떻게 해결했는지 말씀드려보겠습니다. 

### SNS 로그인

SNS 로그인은 직접 로그인 구현하지 않아도 손쉽게 사용자 인증을 제공하기에 대부분의 앱 서비스를 개발할 때 포함하는 기능입니다. Google Login 또는 Apple Login의 경우는 커뮤니티에서 해당 라이브러리를 이미 구현해 두었습니다. 다만 네이버 로그인이나 카카오 로그인은 국내 서비스에서는 꼭 필요한데 서드파트 라이브러리가 없다는 것이 문제 입니다. 저는 네이버, 카카오, 애플 로그인을 네이티브 코드 없이 웹 환경에서 실행할 수 있는 형태로 삽질을 하며 구현했습니다.

 하이브리드 앱에서 로그인 구현은 일반 웹에서 구현하는 것외에 한 가지를 더 생각해야 합니다. 바로 도메인 주소를 `[localhost](http://localhost)`로 써야 해서 도메인을 특정할 수 없다는 점 입니다. 도메인은 SNS 로그인을 제공하는데 식별키로서 작동하기 때문에 특정할 수 없는 도메인 주소를 갖는 것은 치명적인 문제였습니다. `Ionic`을 통해 만들어진 웹앱을 살펴보면, `Ionic`은 웹앱을 감싸는 껍데기 앱을 만들어 냅니다. 껍데기 앱은 내부적으로 웹앱을 웹뷰를 띄우게 되고 웹뷰의 주소로 `localhost`를 사용하는 것입니다.  

 어떻게 SNS 로그인 Provider에게  `localhost` 말고 나의 도메인을 전달 할 수 있을까? 가 해결해야 할 문제였습니다.

![Ionic + Capacitor 간소화한 아키텍쳐](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1659927404/tlog/uesdyya8zsgtzeepb5b2.png)

Ionic + Capacitor 간소화한 아키텍쳐

저는 네이티브 앱을 잘 모르니 웹 환경에서 개발을 해야겠죠? 웹에서 로그인을 구현하면 보통 도메인의 쿠키에다가 토큰을 세팅해주는 식으로 구현하는데, 이 케이스에서는 그럴 수 없습니다.

설명에 앞서 먼저 일반적인 SNS 로그인 과정이 어떤지 먼저 살펴보겠습니다.

![스크린샷 2022-07-22 오후 10.57.10.png](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1659927404/tlog/fekciavmspe5p1d45vru.png)

네이버 로그인으로 예시를 들어 보겠습니다. 네이버 아이디로 로그인을 하면 네아로 로그인 페이지로 이동합니다. 네이버 계정으로 로그인에 성공하면 `code`값을 포함하여 `redirect` 페이지로 이동합니다. `redirect` 페이지에서 `code`로 백엔드 서버에 `token`을  요청하면 백엔드는 `provider`에 `client_id`, `secret`, `code` 로 `token`를 가져옵니다. 

![스크린샷 2022-07-22 오후 10.57.13.png](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1659927404/tlog/wsokqy8kbfluldnoiqsh.png)

사용자는 발급 받은 `Token`으로 사용자 정보를 백엔드 서버에 요청하고, 백엔드 서버는 `client_id`, `secret`, `token`으로 사용자 정보를 `provider`로 부터 받아올 수 있습니다.

일반 웹이라면 위 과정을 거쳐 sns 로그인을 할 수 있을 겁니다. 그런데 앞에서 말한 것 처럼 `ionic`을 사용하여 만든 웹앱은 `localhost` 를 사용하기에 직접 발급 받을 수 없었습니다. 저는 이 문제를 한 가지 단계를 더 넣음으로써 해결 할 수있었습니다.

`localhost`에서 바로 요청 하지 못하기 때문에 브릿지 페이지를 이용합니다. `Ionic` 웹앱은 내부적으로 이미 브라우저를 실행하고 있으므로 앱 외부의 웹 페이지를 하나 더 띄웁니다.

<aside>
☝ 하이브리드 앱에서 추가적으로 웹 페이지를 열려면 [@capacitor/browser](https://www.npmjs.com/package/@capacitor/browser) 를 사용하시면 됩니다.

</aside>

`uuid`를 생성하여 `sessionStorage` 같은 곳에 저장 합니다. 그리고 `uuid`를 쿼리스트링으로 브릿지 페이지에 전달하면 브릿지 페이지가 대신 토큰을 요청하는 겁니다. 브릿지 페이지가 `code`와 `uuid`를 백엔드 서버에 넘기면, 백엔드 서버는 발급한 토큰을 내려주지 않고 `redis` 같은 캐시로 저장 합니다.

<aside>
☝ 저는 노드 서버를 사용하기 때문에 [lru-cach](https://www.google.com/search?q=npm%20lru-cach&oq=npm%20lru-cach) 로 램캐시를 사용했고 캐싱 시간이면 1분 이면 충분합니다.

</aside>

![스크린샷 2022-07-22 오후 11.32.01.png](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1659927404/tlog/mmb5yjweh683rovuthaa.png)

브릿지 페이지가 정상적으로 토큰을 생성하면 브릿지 페이지를 닫도록 유도 합니다. 다시 `Ionic` 앱으로 돌아오게 되면 `sessionStorage`에 저장한 `uuid`로 서버에 토큰을 요청합니다.

<aside>
☝ 브릿지 페이지가 동작을 수행한 후 자동적으로 닫도록 처리하고 싶었지만, 사용자의 동작 없이 페이지를 닫도록 하는 것은 브라우저가 지원하지 않았습니다.

</aside>

![스크린샷 2022-07-22 오후 11.32.03.png](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1659927404/tlog/bdi3hpmso4bbhkbmojxp.png)

`Ionic` 앱으로 돌아오는 이벤트를 잡는 것은 `iOS`와 `android`가 달랐는데, `iOS`는 [@capacitor/browser](https://www.npmjs.com/package/@capacitor/browser) 를 안드로이드는 [@capacitor/app](https://www.npmjs.com/package/@capacitor/app) 을 사용합니다.

```jsx
if (isIos()) {
    Browser.addListener('browserFinished', () => {
      loginCallback();
    });
  } else {
    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        loginCallback();
      }
    });
  }
```

> 이렇게 SNS 로그인을  웹 베이스로 구현할 수 있었습니다. 회원 가입은 구현도 구현 이지만 테스트가 매우 빡셉니다. 3개의 provider(네이버, 카카오, 애플)와 웹 과 앱, iOS 와 안드로이드, 로그인/회원가입 이렇게 구분하면 24개의 시나리오를 테스트 해야 합니다. 🤮
> 

### SEO도 가능 ?

> 👨🏻‍🎨 : 근데 이거 구글에 검색 되야 돼
🙍🏼‍♂️ : !!!???
> 

많은 분들이 공감 하시겠지만, `SEO`를 지원하기 위해서는 꽤 많은 노력을 필요합니다. `SSR`을 하기 위한 서버가 필요하고, `webpack` 설정도 해줘야 하고, 상태 관리 라이브러리도 쓰려면 `MobX` `Store`도 넘겨줘야 하는 것은 기본입니다. 그리고 @Capacitor 관련 모듈들이 SSR 시에 정상적으로 동작하지 않는 모듈들이 있었습니다. 그리고 저는 `Next.js`를 사용하여 `SSR`을 주로 작성하고 직접 `SSR`을 구현하는 경우가 거의 없었습니다.

 그래서 `Next.js`로 교체해서 `Ionic` 앱을 만들려고 했습니다. 그런데… `Next.js`의와 당시 사용했던 `@ionic/react@5.5.2` 에서 의존성 문제가 있었습니다. 당시에 이런 저런 시도를 했지만, 정상적으로 빌드가 되지 않았고 가뜩이나 정보도 없는데 `Next.js`를 추가하여 또 다른 의존성을 문제를 만들면 안되겠다 싶어서 `Next.js`를 포기했습니다.

 두 번째 시도는 [react-snap](https://www.npmjs.com/package/react-snap) 이었습니다. `react-snap`은 `prerendering` 하여 미리 원하는 페이지를 html 파일로 만들어서 로딩 속도도 빠르게 하는 장점이 있었습니다.(Next.js의  export와 유사) 대신 커뮤니티 특성상 게시글은 계속 추가되고 주기적으로 `s3` 같은 곳에 올려줘야 하는 문제가 있었습니다. 그런데 이 방식의 가장 큰 문제는 같은 설정이래도 전체 라우팅을 순회하면서 10번에 3번이상 html 생성하다가 실패한다는 점이었습니다. 이득 보다는 너무나 실이 많은 방식이었습니다.

 그래서 저는 `netlify`의 `lambda`로 `SSR`을 하도록 처리했습니다. 저는 `Netlify`에 배포하는 것을 좋아하는데(근래에는 `Vercel`을 더 많이 써요) `Netlify`에 `lambda function`을 지원한다는 내용을 보았습니다. 저는 [레포](https://github.com/tmmoond8/netlify-react-serverlesss) 하나를 파서 빠르게 검증 했습니다. 저는 `TypeScript`를 사용하고 싶었고 당시에 `react-app-rewired` 를 사용하고 있었는데 프로젝트를 `eject` 하여 복잡하게 `webpack`을 관리하고 싶지 않았습니다. 정말 많은 삽질 끝에 `netlify의 lambda` 로 원하는 경로 접근했을 때 `SSR`을 하도록 설정하는 것을 성공하였습니다. 

 이렇게 구현 했지만 `netlify의 lambda` 가 `SSR`을 하면 `CSR` 보다 매우 느리다는 단점이 존재 했습니다. 그래서 `SEO`를 위한 최소한만 `meta` 정보를 추가하여 `SSR`을 하도록 `netlify.toml`에 설정 했고, 실제 컴포넌트는 `CSR` 하도록 했습니다. 이렇게 함으로써 `SEO` 를 구현할 수 있었습니다.

> 무언가 만들어 보는 것을 좋아하여, 꾸준히 사이드 프로젝트를 하게 됩니다. 혼자 사이드 프로젝트를 하게 되면 의식하지 않고서는 익숙한 것이나 했던 것을 비슷하게 하는 경우가 많습니다. 이번에는 개발을 모르는 지인과 함께 하면서 훨씬 더 챌린징한 방향으로 개발을 했던 것 같습니다. 레퍼런스 없이 머리를 싸매고 해결한 방법이 다른분들 눈에는 후져보일 수 있지만, 저 스스로 당시의 문제를 해결 했기 때문에 매우 만족했습니다.
>