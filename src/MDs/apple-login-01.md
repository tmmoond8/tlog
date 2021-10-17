---
title: Apple Login for Web (상) - 키 발급
date: '2021-10-08T08:56:56.263Z'
description: 애플 로그인을 구현하기 위한 키 발급 가이드
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633702737/tlog/cover/apple-og_mrjifu.jpg'
tags:
  - OAuth
  - React
---


> 보통 소셜 로그인을 구현하면 Google, Facebook을 최우선으로 하고 국내 한정 Naver, Kakao 로그인을 보통 구현한다. 그런데 애플 로그인은 앱스토어에 등록하는 서비스에게 요구되기 때문에, ios앱을 서비스하면 필수적으로 구현을 해줘야 한다. (예외: 소셜 로그인이 없다면 구현 안해도 된다.)
 이번에 앱스토어 등록을 준비하면서, 애플로그인 구현한 경험을 작성해보았다. 이 포스팅은 상,하 편으로 나누었고, (상) 편은 키 발급을 다루고, (하) 편은 실제 구현한 코드를 보려고 한다.

애플 로그인에 대한 문서는 간결하게 잘 작성되어 있지만, 충분히 친절하지는 않다. 단순하게 애플로그인을 구현하기 위한 핵심적인 내용 위주로 보자

[Apple Developer Documentation](https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_js)


만약 `애플 개발자 계정`이 없다면 만들어줘야 한다.

[Sign in with your Apple ID](https://developer.apple.com/account/)

이 가이드는 [Configure Sign in with Apple for the web](https://help.apple.com/developer-account/#/dev1c0e25352)을 기본으로 한다.

### 1. APP ID 생성

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633702945/tlog/p8gvhvv9ljchys0qf7ga.png)

`Identifiers +` 버튼을 클릭

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633702946/tlog/boreit4ik1l2yopq0ibu.png)

`App IDs` 선택

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633702946/tlog/bjah4g6dbs8s5matvugu.png)

`App` 선택

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633702947/tlog/uf0gdt80ex9owmcpzamn.png)

- `Description`은 아래 이미지 처럼 계정을 연동을할 때 나오는 서비스명이다.
- `Bundle ID` 는 서비스 식별명이다. 보통은 com.{회사이름}.{서비스이름} (ex. com.tmmoond8.picar)

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633702945/tlog/szjf2ohez9imiadhant6.png)

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633702946/tlog/qavuolvetg7qdbcx1kbx.png)

`Sign in with Apple` 에 체크를 한다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633702946/tlog/rm4u08qugn826xsjh3pk.png)

`Sign in with Apple` 의 `Edit` 를 클릭 하면 설정창이 뜨는데, 특별히 건드릴 것은 없다.

저장 버튼을 눌러서 App ID 생성을 마무리 하자.

### 2. Service ID 생성

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633702945/tlog/p8gvhvv9ljchys0qf7ga.png)

`Identifiers +` 버튼을 클릭

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633702946/tlog/ug88jq0qqokddsujrroq.png)

Services IDs 버튼을 클릭

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633702947/tlog/zig2uv7lghfgsa6cfuww.png)

- `Description`은 아래 이미지 처럼 계정을 연동을할 때 나오는 서비스명이다.
- `Identifier` 는 서비스 식별명이다. 보통은 com.{회사이름}.{서비스이름} 이고  `App ID`에 사용된 `Bundle Id`랑 달라야 한다. (ex. com.tmmoond8.picar-web)

이렇게만 작성하면 `Service ID` 가 발급 된다. 이 `Service ID`는 애플 로그인을 사용할 때 식별자로 사용할 것이기 때문에 따로 복사 해놓자.

 아직 끝나지 않았고 Service ID가 생성은 되는데 Sign In 쪽에 추가적으로 설정을 해줘야 한다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633702948/tlog/pwnwso0yae1jsxvev1ps.png)

도메인과 리다이렉트 주소를 등록해야 한다. 설정한 `Redirect URL`은 따로 저장하자.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633702948/tlog/pdb7zxnm8iqnl2bevmly.png)

중요
애플 로그인에서 매우 중요한 내용 중 하나가 `Redirect URL`부분이다. 일반적인 소셜 로그인은 인증 후 설정한 `Redirect URL` 로 페이지 이동(GET 요청)을 하는것이 보통인데, 애플 로그인은 지정한 Redirect URL로 인증 정보를 전달(Post  요청)한다. 그렇기 때문에 위 예제에서도 api 요청을 하게끔 설정했다. `https://api.picar.kr/api/auth/apple (POST)` 

### 3. Sign In key 발급

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633702948/tlog/yuco05vc041fmbx1d69u.png)

`Keys +` 버튼을 클릭하자.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633702948/tlog/z1udzcq7lo2cvajwhsuc.png)

`Sign in with Apple` 을 체킹하고 설정을 추가해주자.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633702948/tlog/puynxmu7p3blkogmo4hd.png)

`App ID`를 선택해주면 키가 생성되고, 생성된 키는 한 번만 다운 받을 수 있기 때문에 꼭 다운 받자.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633702949/tlog/qyb5togactfyuqfaytdp.png)

생성된 키를 보면 `Key ID`를 확인할 수 있는데 별도로 저장하자.

### 4. 애플로그인에 사용할 키 다시 한번 정리

위에서 언급한 키들은 다음과 같다.

- `Service ID` 의 `Identifier`
- `Redirect URL`
- Sign In 의 `Key ID`, `Private Key`

그리고 추가적으로 Team ID도 있다. 계정 로그인 하면 오른쪽 상단에 있는 값이다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633702949/tlog/xdim6irtsimf4wxuba7e.png)

애플 로그인을 구현하기 전에 필요한 키를 발급 받았다. (하) 편에서 Node + React로 실제 구현한 예시를 따라가 보자.

### Reference

---

[[Apple] 애플 로그인 설정하기 (Sign In with Apple)](https://spiralmoon.tistory.com/entry/Apple-%EC%95%A0%ED%94%8C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0-Sign-In-with-Apple)