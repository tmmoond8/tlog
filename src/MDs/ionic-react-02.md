---
title: Ionic + React 시리즈 2 - React 웹 서비스를 앱으로 빌드하기
date: '2021-11-14T08:56:56.243Z'
description: Ionic을 사용하여 React 웹앱을 앱으로 만드는 과정.
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1635259843/tlog/cover/Screen_Shot_2021-10-24_at_6.31.23_PM_deno9r.png'
tags:
  - Ionic
  - React
---

> React Native는 가장 대중적인 방식이지만, 이미 웹 기준으로 만들어진 프로젝트를 거의 대부분의 코드를 갈아 엎어야 했다. 모든 컴포넌트를 View로, 텍스트를 TextView로 말이다. 이렇게 해주면 네이티브 컴포넌트로 변환 되기 때문에 성능의 이점은 있지만, 네이티브와 웹코드의 브릿지로 인한 성능 문제를 고려해야 한다. 나는 성능이 웹으로도 충분히 커버할 수 있는 서비스를 개발하고 최적화도 웹 수준으로 할 생각으로 Ionic으로 개발하게 되었다.
> 

현재 React로 작성된 앱이 있다면 손쉽게 `Ionic`을 통해 가장 빠르게 앱으로 만들어 줄 수 있다. `React`에서 build된 파일을 `Ionic`에서는 껍데기 앱을 만들고 build 를 웹서빙 해주는 형태기 때문이다. 여기서 네이티브 기능을 추가해야 한다면  `Capacitor`가 네이티브의 API를 사용하 게끔 코드를 생성해낸다. 그러나 상황에 따라서는 꽤 귀찮게 될 수 있다. 예를들면 소셜 로그인 같은 부분은 기존에 작성했던것과 조금 다르게 추가적으로 작성을 할 필요가 있다. 또 `Capacitor` 모듈들이 SSR 렌더링 시 문제가 되기 때문에 동적 임포트로 처리를 한다든가 말이다.  

만약, Ionic으로 새로운 리액트 앱을 만들고 싶다면, 아래 링크를 참고하면 된다.

[Intro Ionic React Quickstart - Ionic Documentation](https://ionicframework.com/docs/react/quickstart)

**이 포스트에서는 간단한 React 샘플 웹앱을 안드로이드와 iOS 앱으로 빌드하는 내용을 다룬다.**

## 1. 현재의 React 웹앱의 구조

```
├── README.md
├── node_modules
├── package.json
├── src
│   ├── apis/
│   ├── components/
│   ├── hooks/
│   ├── modules/
│   ├── stores/
│   ├── styles/
│   ├── types/
│   ├── App.tsx
│   └── index.tsx
├── tsconfig.json
├── tslint.json
├── yarn-error.log
└── yarn.lock

```

## 2 `Ionic` 을 사용하기 위한 준비

### 2-1. 빌드 툴 다운 받기

[https://developer.apple.com/xcode/](https://developer.apple.com/xcode/) Xcode [https://developer.android.com/studio/](https://developer.android.com/studio/) Android Studio

빌드 툴을 설치하는 것은 꽤 오랜 시간이 걸리기 때문에 먼저 필요한 파일을 다운 받기를 추천한다. 만약 M1을 사용한다면 Android Studio 15 이상 버전을 다운받아야 한다.

### 2-2. cli 설치

`Ionic`에서는 cli통해 개발 서버를 띄우거나 플랫폼 환경을 추가하는데도 사용하기 때문에 꼭 설치해야 한다.

```bash
$ yarn global add @ionic/cli
```

### 2-3 React 앱 빌드

현재 작성된 React 앱을 빌드 하자.

```bash
$ yarn build
```

### 2-4 의존성 모듈 설치

```bash
$ yarn add @capacitor/core @ionic/react @ionic/react-router
$ yarn add -D @capacitor/cli
```

### 2-5 설정 파일 추가

다음 두개의 설정 파일을 프로젝트 루트에 포함

- capacitor.config.json
    
    ```json
    {
      "appId": "com.tmmoond8.owwners",
      "appName": "owwners",
      "bundledWebRuntime": false,
      "npmClient": "npm",
      "webDir": "build",
      "plugins": {
        "SplashScreen": {
          "launchShowDuration": 0
        }
      },
      "cordova": {}
    }
    
    ```
    
    - `appId` 는 앱 식별자로서 유니크한 값으로 넣으며, . 를 기준으로 단체.소유자.프로젝트이름 의 형태를 보통 사용한다.
    - `appName` 프로젝트 이름
    - `webDir` 은 기존 리액트 앱의 빌드 디렉토리를 지정해주면 된다.
- ionic.config.json
    
    ```json
    {
      "name": "owwners",
      "integrations": {
        "capacitor": {}
      },
      "type": "react"
    }
    
    ```
    

## 3. iOS 앱으로 만들기

---

[iOS Development - Ionic Documentation](https://ionicframework.com/docs/developing/ios)

사실 공식 가이드대로 하면 어렵지 않지만, 개인적으로 네이티브 환경에서 빌드하는 것은 익숙하지 않아서 조금 헤맸다.

### 3-1. Xcode 설치

xocde 를 우선 설치해야 하며, 이 파일 자체는 매우 크다. 그래서 위에서 사전 준비 쪽에도 미리 다운 받으라고 했던 것이다. [https://developer.apple.com/xcode/](https://developer.apple.com/xcode/) 하단쪽에 다운로드 링크를 클릭하고, 애플 계정으로 로그인 해야 Xcode를 설치할 수 있다. 특히 다운로드 시간도 매우 오래 걸리기 때문에 오래 걸릴 것을 염두해야 한다. 만약 Android앱도 만들 생각이면 동시에 [android studio](https://developer.android.com/studio?gclid=Cj0KCQjwiNSLBhCPARIsAKNS4_ffMU2Edg8890la1EmhL9bfBKKrObHo0MvOEIcg27XrCRb8pUjARB8aAvCVEALw_wcB&gclsrc=aw.ds)를 다운 받는 것을 추천.

### 3-2. xcode-select 설치

설치 후 cli 툴을 사용하기 위해 추가 모듈을 설치해야 한다. 이것도 약 5분 정도 소요된다.

```bash
$ xcode-select --install
```

### 3-3. Xcode 사용자 설정

우리가 만들 앱도 iOS에서 구동 시키기 위해서는 서명이 필요하다. 원래 이 서명은 iOS 앱 개발자로 등록을 해야 하며, 연회비도 내야 하지만 Xcode에서는 개발용 서명을 대신 만들어 사용할 수 있다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1636816990/tlog/z6y68kdwpjsddukhrqbj.png)

### 3-4. iOS 앱 추가 하기

간단한 명령어를 통해 iOS 앱을 생성해 낼 수 있다.**`ionic capacitor add iOS` 를 입력하면 필요한 모듈을 설치하여 환경 구성을 한다. 그런데** **`ionic capacitor add ios`**는 내부적으로 npm 으로 모듈을 추가하기 때문에, yarn 사용자에게는 의존성 문제를 일으킬 수 있다. 그래서 yarn 을 통해 모듈을 미리 추가해주자.

```bash
$ yarn add @capacitor/ios  # 만약 yarn 을 사용하면 yarn으로 모듈을 추가하자.
$ ionic capacitor add ios
```

만약, 아래의 오류가 발생하면 `cocoapod`을 따로 설치해줘야 한다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1636816990/tlog/f0hjkzkjr67hrtvwazqh.png)


```bash
$ sudo gem install cocoapods
```

`gem` 은 루비 기반 패키지 시스템인것 같은데 맥북에는 기본적으로 포함한다.

`cocoapod`이 설치가 되었다면 ios 앱을 추가하는명령어를 다시 실행해주자.

m1 맥북에서 cocoapods를 설치하는데 문제가 있었다. 이 부분은 terminal을 rosetta로 실행해서 해결할 수 있었다.

### 3-4. Xcode로 빌드 및 런

아래 명령어를 입력하면, 생성된 ios 디렉토리를 루트로 하는 Xcode 프로젝트가 오픈된다.

```bash
$ ionic capacitor open ios
```

실행을 마치면 루트 디렉토리에 ios 디렉토리가 생성된 것을 확인할 수 있다.

여기서 한가지 설정을 해주어야 하는데 왼쪽에 App이라는 프로젝트 이름이 보일 것이다. 클릭하고 `Signing & Capbilities` 에서 Team을 아까 생성한 유저로 셋업하자.

됐다. 모든 준비가 끝났다. 상단에 재생 버튼 처럼 생긴 `run` 버튼을 누른다. 그러면 가상 머신이 하나 뜨면서 내가 만든 리액트 프로젝트가 뜨는 것을 확인할 수 있다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1636816990/tlog/gn8mly56b2t11tdna8kb.png)

### 3-5. 변경된 리액트 코드 앱으로 반영하기

iOS의 앱은 내부 코드로 빌드된 리액트 코드를 사용하기 때문에, 코드 수정 → 리액트 앱 빌드 → ios 디렉토리 하위에 빌드된 코드 덮어쓰기 → 가상 머신 재 빌드 & 실행 순서로 진행된다.

```bash
$ yarn build
$ ionic capacitor copy ios
```

이 방식을 쓰면 가상 머신에서 앱을 매번 재실행 시켜야 한다.

다행히 변경된 코드를 바로 반영하는 `live-reload`를 제공한다.

먼저 현재 돌고 있는 머신을 종료한 후 아래 명령어를 실행하자.

```bash
$ ionic capacitor run ios -l --external
```

그리고 앱을 다시 실행 하면 코드가 변경되면 가상 머신에 바로 반영하게 된다.

## 4. 안드로이드에서 앱으로 만들기

[Android Development - Ionic Documentation](https://ionicframework.com/docs/developing/android)

### 4-1. Android Studio 설치

안드로이드도 마찬가지로 안드로이드 studio를 먼저 설치하는 것으로 시작하자.

[https://developer.android.com/studio/](https://developer.android.com/studio/)

처음 안드로이드 스튜디오를 오픈했을 때 필요한 `SDK` 설치를 해야 한다. 기본적인 셋업은 Android 11버전 `SDK`만 설치하지만, 우리의 앱은 더 낮은 `SDK`를 사용하기 때문에 8버전 이상인 `SDK`를 모두 선택해서 추가하자. (정확히 어떤 버전을 사용하지는지는 몰라도 정식 가이드에는 8.1 체킹하기를 권고한다.

### 4-2. Java 설치

안드로이드 앱은 껍데기를 `Java`로 만들어 내기 때문에 `JDK`를 다운 받아야 한다. JDK는 오라클에서 공식적으로 배포를 하지만, 나 처럼 로그인을 하고 싶지 않는 사용자를 위해 별도 방법을 소개한다.[https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html](https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html)

먼저 오라클 홈피에서 사용자 환경에 맞는 버전의 파일명을 찾은 후 아래 링크로 간 후

[https://gist.github.com/wavezhang/ba8425f24a968ec9b2a8619d7c2d86a6](https://gist.github.com/wavezhang/ba8425f24a968ec9b2a8619d7c2d86a6)

`starchivore` 이 사람의 코멘트로 간다. 그리고 해당 버전의 파일명을 찾는다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1636816990/tlog/lrlxht3qbxuormzrbetr.png)

M1 맥북을 사용한다면 arm64로 빌드 된 [JDK 8](https://www.azul.com/downloads/?os=macos&architecture=arm-64-bit&package=jdk) 을 설치하자.

### 4-3. CLI Tool 설정

안드로이드 스튜디오를 위한 환경 변수를 등록하자. `~/.bashrc`, `~/.bash_profile` 또는 `~/.zshrc` 본인이 사용하는 파일을 열어서 작성하자.

```bash
# android sdk
$ export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk

# avdmanager, sdkmanager
$ export PATH=$PATH:$ANDROID_SDK_ROOT/tools/bin

# adb, logcat
$ export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools

# emulator
export PATH=$PATH:$ANDROID_SDK_ROOT/emulator
```

사실 이렇게 해서 단순히 모든 디바이스에서 잘 보여질 것이라는 보장은 없다. OAuth에서 새로운 탭 하나 띄워서 로그인 하는 처리가 있는데, 웹앱에서 새로운 탭을 띄우는 것이 막혀서 이슈가 있다. 또, 상단 status bar나 ios에서 하단에 가상 홈 구간도 고려해야 하는 등의 이슈가 있다.

### 4-4. 안드로이드 앱 추가하기

```bash
$ yarn add @capacitor/android  # 만약 yarn 을 사용하면 yarn으로 모듈을 추가하자.
$ ionic capacitor add android
```

안드로이도용 래핑 앱이 생성 되었다. 안드로이드 스튜디오로 오픈하자. 나는 이때 시간이 다소 걸렸다.

### 4-5. 안드로이드 앱 실행하기

안드로이드 앱을 실행시켜보자.

```bash
$ ionic capacitor open android
```

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1636816990/tlog/af9g1luprsuo1ragdtf9.png)


기본적으로 가상 머신중 Pixel_3a 가 포함 되니 자동 타겟팅 될 것이고 실행하면 안드로이드에서도 앱이 잘 실행된다. 만약 위 스샷처럼 빌드 아이콘 옆에 app이 뜨지 않고 타겟 디바이스도 잡히지 않는다면, 필요한 SDK가 설치되지 않은 것이니 SDK Manger를 실행하여 오레오 8 버전 이상인 SDK 를 꼭 설치하자.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1636816990/tlog/ivlfmllc1b4qfapkmuty.png)

나의 경우 M1 환경이고 안드로이드 시뮬레이터를 돌릴 때 문제가 네트워크가 안되는 이슈가 있었다. 로그를 보니 다음의 에러 메시지가 떠있었다. 최신 m1 안스 버전에 연결된 30.7.4 버전의 에뮬레이터 버그 였다. Canary Channel로 바꿔서 30.8.x 버전으로 하니까 문제없이 잘 되었다. [관련 깃헙 이슈](https://github.com/741g/android-emulator-m1-preview/issues/23)

```
# (당시의 에러 메시지 스샷을 안떠서 아래의 메시지는 인터넷에서 가져왔다.
# 아래 메시지는 30.4.5 로 되어 있는데 나의 경우는 30.7.4 버전에서 발생했다.

emulator: Android emulator version 30.4.5.0 (build_id 7140946) (CL:N/A)
handleCpuAcceleration: feature check for hvf
cannot add library /Users/rajaparikshit/Library/Android/sdk/emulator/qemu/darwin-x86_64/lib64/vulkan/libvulkan.dylib: failed
HVF error: HV_ERROR
qemu-system-x86_64: failed to initialize HVF: Invalid argument
Failed to open the hax module
No accelerator found.
qemu-system-x86_64: failed to initialize HAX: Operation not supported by device
added library /Users/rajaparikshit/Library/Android/sdk/emulator/lib64/vulkan/libvulkan.dylib
cannot add library /Users/rajaparikshit/Library/Android/sdk/emulator/qemu/darwin-x86_64/lib64/vulkan/libMoltenVK.dylib: failed
added library /Users/rajaparikshit/Library/Android/sdk/emulator/lib64/vulkan/libMoltenVK.dylib

```

## 마무리

---

웹 개발 환경에서만 개발 하는 것에 익숙하지 않아서 환경 구축하고 IDE와 디바이스 연결하는데에 약간 어려움을 겪었다. 그러나 단계만을 봤을 때는 적은 노력으로 앱을 만들어낼 수 있었다.

### 참고 할 만한 유용한 자료

---

Ionic React Hub 에는 이미 만들어진 참고할만한 템플릿들이 꽤 있다.

[Ionic React Hub - A collection of mobile app UI examples built with Ionic Framework and React](https://ionicreacthub.com)