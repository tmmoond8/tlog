---
title: Ionic + React 시리즈 1 - 왜 Ionic ?
date: '2021-10-26T08:56:56.243Z'
description: Ionic, Capacitor 그리고 React를 각각 설명하며, 어떻게 앱을 만들어 가는지 알아본다.
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1635259843/tlog/cover/Screen_Shot_2021-10-24_at_6.31.23_PM_deno9r.png'
tags:
  - Ionic
  - React
---


> 이 시리즈는 사이드 프로젝트로 Ionic + React를 사용하여 웹앱, Android, iOS 앱을 개발한 경험을 기록한 포스팅입니다. 저도 충분한 경험을 가지지 않은 상태지만, 웹앱과 앱을 만들고 싶고 웹 베이스의 하나의 코드로 멀티 플랫폼을 대응하고 싶을 때 고려해볼 수 있지 않을까 해서 작성해보았습니다.
1 편에서는 간단히 Ionic 프레임워크를 설명하고, 2편에서는 웹앱을 `android` 와 `iOS` 앱으로 빌드 해보는 내용을 다룰 예정입니다.

## Ionic + React + Capacitor ? 👀

앱 서비스를 만드는 일반적인 방법은 네이티브로 개발하는 것이지만, 각각의 언어와 개발환경에서 개발하는 것은 비용이 많이 든다. 그래서 `Phonegap` 이나 `Ionic`, `Xamarin`, `React Native` 등 많은 크로스 개발 플랫폼이 등장했고, 최근에는 `Flutter`  가 주목 받고 있다. 

 앱 서비스를 만든다면 `Flutter`나 `React Native`가 좋은 선택지일 것이다. `Flutter`로 개발한다면 `Dart`라는 언어를 배워야 한다는 점과 레퍼런스가 충분하지 않는 찝찝 하지만 짧은 시간에 많은 인기를 얻었고 프로덕에 사용할 수 있을 정도로 검증이 되었다고 생각이 든다. `React Native`는 개발환경이 거의 리액트로 개발하는 것과 동일해서 리액트에 익숙한 개발자에게 좋은 선택이 될 수 있다. `Flutter`에 비해서도 레퍼런스가 많고 웹에서 사용한 코드도 재사용 할 수 있는 점에서 웹까지 고려한다면 좋은 선택지가 될 것이다.

 나는 앱을 크게 고려 하지 않은 채로 `React` 웹앱을 개발한 상황이었고, 웹 베이스로 앱을 만들어내길 원했다. `React Native`는 가장 먼저 고려한 방법이지만, `React Native`의 `TextView`, `View`로 감싸야 해서 웹 코드와 분기를 만들어야 했다. 그리고 최적화나 성능 문제가 발생하면 `React Native` 면에서 고려하기 보다 웹 측면에서 해결해보고 싶었다. 그래서 완전히 웹 베이스로 앱을 만들기 원했고 때마침 `React`로도 `Ionic`을 개발할 수 있었다. 가장 큰 문제는 대부분의 설명이 `Angular`  , `Cordova` 여서 레퍼런스가 거의 없다 시피한 점이다. 그래도 내가 잘 모르는 네이티브 플랫폼에서 방법을 찾기 보다 웹으로 해결방법을 찾으면 된다는 생각에 시도를 하게 되었다.

### Ionic

`Ionic`에 대해서는 한 번쯤은 들어봤겠지만, 직접 사용한 경험을 가진 개발자는 별로 없다. 그래서 한번 소개해보겠다. `Android`로 네이티브 앱을 만든다면 `Java/Kotlin` 을 사용해서 만들고, `iOS` 네이티브 앱을 만든다면 `Object-C/Swift` 를 사용해서 만들 것이다. 각각의 코드를 관리를 해야 하는 것은 매우 큰 비용이다. `Ionic`은 `HTML`, `CSS` 그리고 `JS`를 사용하여 하나의 코드로 `Android`와 `iOS` (그리고 `Windows`도!) 앱을  만들 수 있다.

`Ionic`은 단지 `HTML`, `CSS` 그리고 `JS`를 사용하는 웹뷰를 래핑한 것이고 `Ionic`은 `iOS`나 `Android`에서 앱으로서 실행 할 수 없다. `Capacitor/Cordova`는 `Ionic` 웹 앱을 컨테이너화하여 카메라 등과 같은 네이티브 API에 대한 액세스를 제공하여 설치 가능한 형태로 변환하여 빌드하는 환경이다.

### Capacitor

`Capacitor`는 처음 들어보는 개발자들이 많지만  `Phonegap` 또는 `Cordova` 은 들어봤을 것이다. `Cordova`는 오래전부터 `Ionic` 웹 앱을 네이티브 앱으로 빌드하는데 사용했다. 그런데 `Cordova`에는 몇가지 제약이 있었고 그런 점을 개선하여 나온것이 `Capacitor`이다. (`Capacitor`는 `Ionic`에서 새롭게 개발하였고, 그 덕에 `Angular` 외에도 `React`, `Vue`, `Svelte` ,`vanilla js`를 지원한다.)

`Capacitor`는 `iOS`, `Android`, `Electron` 그리고 웹 앱을 빌드하는 크로스 플랫폼 런타임이다. `Cordova` 와 유사하지만 분명히 다른 점이 있다.

`Capacitor`는 웹 앱 코드를 빌드하여 각 플랫폼 보드를 생성해 내는데, 이 때 각 플랫폼의 빌드 코드가 아닌 프로젝트 소스 코드를 생성한다. 위 이유로 `AndroidManifest.xml`, `Info.plist` 같은 각 플랫폼의 설정 파일을 건드릴 수 있는 장점이 있다. 또, 각 플랫폼 소스도 직접 수정할 수 있는 여지가 생겨서 유연성을 갖추게 된다.

`Capacitor`는 네이티브 기능을 충분히 제공하지 않기 때문에, `Cordova`를 추가적으로 사용하거나 직접 네이티브 코드를 수정해야할 수 있다.

### React

`React`는 현재 프론트엔드 진형에서 가장 인기가 있는 라이브러리(프레임워크에 가까운)다. `React Native`를 통해 알 수 있듯이 `React`의 개발환경에 선호하거나 익숙한 개발자가 많고 모듈이나 생태계가 거대하다. 여기에 `Capacitor`와 `Ionic`을 사용하여 앱을 만들어낼 수도 있다. 이렇게 하여 로그인을 포함한 거의 모든 기능을 웹베이스 코드로 작성할 수 있다. 

 위 에서 Capacitor를 통해서 React 프로젝트에서도 `Ionic`앱을 만들어 낼 수 있다고 했다. `Ionic`, Capacitor에 대한 관심도가 높지 않아서 커뮤니티는 작지만, [@capacitor-community](https://github.com/orgs/capacitor-community/repositories) [](https://github.com/capacitor-community/react-hooks#readme)에서는 [@capacitor-community/react-hooks](https://github.com/capacitor-community/react-hooks) 리액트스러운 개발 모듈들을 꾸준히 관리해 가고 있다. 

```tsx
// 카메라 모듈을 사용하는 hooks을 제공한다.
import { useCamera, availableFeatures } from '@capacitor-community/react-hooks/camera';

const { photo, getPhoto } = useCamera();
const triggerCamera = useCallback(async () => {
  getPhoto({
    quality: 100,
    allowEditing: false,
    resultType: CameraResultType.DataUrl
  })
}, [getPhoto]);
```

## 그래서 Ionic은 쓸만 할까?

나의 경우는 `전기차 커뮤니티 서비스 - 피카`를 `Ionic`을 통해 개발을 했다. 실질적인 사용자는 없어서 아쉽지만, 웹([https://www.picar.kr/](https://www.picar.kr/))과 안드로이드 앱([https://play.google.com/store/apps/details?id=com.tmmoond8.picar](https://play.google.com/store/apps/details?id=com.tmmoond8.picar))으로 서비스되고 있고 현재는 `iOS` 앱을 등록하려고 준비 중이다. 이 서비스는 네이티브 기능이 거의 사용하지 않아서 `Ionic` 개발을 폭 넓게 경험하지는 못했디 때문에 앱을 만드는 기능을 많이 지원 한다 던가 충분하다고는 할 수 없다.

(어느 서비스가 그렇 듯) 초기에는 간단한 핵심 기능을 제공하고 빠르게 서비스를 만들어 내는 것이 중요하다. Ionic으로 개발하면 크로스 플랫폼으로 개발할 수 있는 점에서 초기에 서비스를 개발하는데 빠른속도를 낼 수 있게 될 것이다. 서비스가 점점 커지고 팀이 커지면 최적화된 서비스 개발을 위해 네이티브로 다시 개발하게 될 수 도 있다. 이건 어느 크로스 플랫폼이든 갖는 특징이라 생각한다.

`React`로 개발하는 것을 선호하고 익숙하고 하나의 코드로 앱도 같이 개발하기 원한다면 `Ionic` + `React`도 고려해볼 옵션이다. 

[Ionic React - Ionic Documentation](https://ionicframework.com/docs/react)

React + Ionic Docs

## 피카 - 프론트엔드 코드

[GitHub - tmmoond8/picar-front](https://github.com/tmmoond8/picar-front)

피카는 `netlify`를 통해 배포 되고 있고, `netlify-functions` 를 통해 부분적으로 서버사이드 렌더링을 하고 있기 때문에 `build`, `netlify build`, `iOS/Android build` 등 다양한 환경의 빌드를 하기 때문에 조금은 복잡한 형태다. 혹시나 코드를 참고 하고 싶다면 방문 해보길 바란다.