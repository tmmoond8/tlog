---
title: 11장 클라이언트 식별과 쿠키
date: '2019-07-08T08:56:56.243Z'
description: HTTP 완벽 가이드 11장 정리
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632186958/tlog/http-perfect-guide_am6yzc.png'
tags:
  - HTTP
  - CS
---

서버에서 클라이언트를 식별하는데 사용하는 기술을 알아본다.

### 11.1 개별 접촉

HTTP는 익명으로 사용하며 상태가 없고 요청과 응답으로 통신하는 프로토콜이다. 

모든 사용자에게 같은 페이지를 보여주는 것이 아닌, 개인을 위한 페이지도 제공해줄 필요가 있다. (쇼핑몰의 주문내역 등)

초기 웹 사이트 설계자들이 사용자를 식별하기 위해 개발한 기술을 살펴보자.

- 사용자 식별 관련 정보를 전달하는 HTTP 헤더들
- 클라이언트 IP 주소 추적으로 알아낸 IP 주소로 사용자를 식별
- 사용자 로그인 인증을 통한 사용자 식별
- URL에 식별자를 포함하는 기술인 뚱뚱한 URL
- 식별 정보를 지속해서 유지하는 강력하면서도 효율적인 기술인 쿠키

### 11.2 HTTP 헤더

[사용자에 대한 정보를 전달하는 HTTP 요청 헤더](https://www.notion.so/d8e8ea496ada480ca09d02043ddc9dbb)

From 헤더는 사용자 자신의 이메일을 입력하는 것인데, 스팸에 악용할 수 있어서, 이제는 보내지 않는다. 대신 봇에서는 관리자의 Email을 보내는데 사용한다.

User-Agent는 사용자를 특정할 수 없지만 매우 중요한 헤더다. 사용자가 사용하는 브라우저의 정보를 나타내기 때문에 사용자 환경에 맞는 문서를 줄 수 있다.

크롬에서 `window.navigator.userAgent` 를 콘솔에 찍어 보면 값들이 나온다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952575/tlog/_2019-06-30__11-fe265070-4a3e-4fc3-a7d3-c1361c183fb5.13.06_qgbdda.png)

Referer 헤더는 사용자의 성향을 추측할 수 있다. 티스토리를 하면 유입경로라고 해서 어디에서 링크를 타고 왔는지 알 수 있다. referer에 롤 사이트에서 오면 방금까지 롤을 하다가 온 것일 수 있다.

### 11.3 클라이언트 IP 주소

초기에는 IP를 개인 식별에 사용하려고 했지만, IP 고갈 문제에 맞물려 하나의 IP를 여러 사용자가 사용할 수 있어서 식별하기에는 맞지 않다.

- IP 주소는 사용자보다는 컴퓨터를 가리킨다.
- ISP가 사용자의 IP를 동적으로 변경할 수 있다.
- NAT(Network Address Translation) 방화벽을 통해 사용하면 실제 IP주소를 알 수 없다.
- HTTP 프락시와 게이트웨이가 껴있을 경우 서버는 클라이언트의 IP 대신 프락시의 IP를 본다. (확장 헤더를 통해 해결은 가능하다)

### 11.4 사용자 로그인

HTTP는 WWW-Authenticate, Authorization 헤더를 사용해 사용자를 식별하는 체계를 가지고 있다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952595/tlog/Untitled-7203faa4-923b-4312-b73b-23dd0c3f978b_zaojbb.png)

어쨋든 사용자는 한 번 로그인하면 알아서 요청할 때마다 식별 토큰을 헤더에 담아 보낼수 있다.

> 이 책에서 다루지 않지만, 근래에는 OAuth를 사용 한다. 대중에 인지도가 있는 서비스(google, facebook, github, kakao, naver)등에서 자체 로그인 검증 시스템을 다른 도메인이나 서비스에서도 사용할 수 있게 하는 것이다. 예를들어 google에 로그인 계정으로 [yolobook.tammolo.com](http://yolobook.tammolo.com/) 과 같이 개인이 만든 서비스에서도 로그인을 할 수 있는 것이다.
OAuth가 없을 때는 내가 이 사이트에는 어떤 아이디로 가입을 했지? 하는 고민을 했었는데, 말끔히 사라졌다. 개인적으로 자체 로그인 시스템을 만들 필요는 더이상 없는 것 같다. (물론 OAuth를 사용하고 자체 회원 가입 정보를 저장한다 하더라도 아이디와 비밀번호를 입력받게 할 필요가 없다.)

### 11.5 뚱뚱한 URL

어떤 웹사이트는 URL에 개인 식별 값을 포함하는 경우가 있었는데, 더이상 이런 방법을 고려하지 않는다.

단점으로는 너무 긴 URL, 공유하지 못하는 URL, 캐시 사용 불가, 서버 부하 가중

### 11.6 쿠키

쿠키는 사용자를 식별하고 세션을 유지하는 방식 중 가장 널리 사용하는 방식이다. 근래에는 JWT(Json Web Token)이라고 쿠키를 확용한 인증 방법이 가장 많이 사용된다.

 쿠키는 넥스케이프가 최초로 개발했고 캐시와 충돌할 수 있어서 쿠키에 있는 내용물은 캐싱하지 않는다.

**11.6.1 쿠키의 타입**

쿠키는 크게 세션 쿠키와 지속 쿠키가 있다. 세션 쿠키의 경우 브라우저 창이 닫히면 사라지지만, 지속 쿠키는 컴퓨터를 재시작 하더라도 남는다.

**11.6.2 쿠키는 어떻게 동작하는가**

서버는 사용자를 식별하기 위해 접근하는 사용자에게 쿠키를 보낸다. 마치 명찰 같다.

    Cookie: name: "Tamm": "phone="1233-231323"

**11.6.3 쿠키 상자: 클라이언트측 상태**

쿠키의 기본적인 생각은 브라우저가 서버 관련 정보를 저장하고, 사용자가 해당 서버에 접근할 때마다 그 정보를 함께 전송하게 하는 것이다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952596/tlog/Untitled-952601c9-ba42-40e8-912f-83f46ad18c4a_swnire.png)

구글 크롬 쿠키

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952587/tlog/_2019-06-30__11-70e54c23-e00a-4ca1-ad6c-deaa1c8232c1.43.23_iyunbg.png)

구글의 경우 SQLite로 쿠키를 관리한다고 한다.

마이크로 소프트는 특정 디렉토리에 파일로 관리한다고 한다.

**11.6.4 사이트마다 각기 다른 쿠키들**

쿠키는 특정 사이트에 종속된 값이다. 다른 도메인에서 쿠키에 접근하는 것은 보안에 문제가 생길 수 있다. 또 쿠키에는 직접적인 개인정보를 포함하는 것은 좋지 않다.

**11.6.5 쿠키 구성요소**

현재 사용되는 쿠키는 Version 0 쿠키(넷스케이프 쿠키)다. 예전에 Version 1쿠키가 있었지만 지금은 폐기됬다.

**11.6.6 Version 0 쿠키 (넷스케이프 쿠키)**

{name}={value} 형태로 {name}, {value}에는 큰따옴표, 세미콜론, 쉼표, 등로, 공백을 포함하지 않는 문자열이 와야 한다.

expires 형태는 GMT로 구분자는 -(대시) 여야 한다.

domain 형태는 호스트 명으로만 사용할 수 있다. 상위 도메인에 설정하면 서브 도메인에서 사용할 수 있다.

path 는 말그대로 작성한 path에만 적용한다.

secure는 Optional한 속성으로 HTTP가 SSL 보안 연결을 사용할 때만 쿠키를 전송한다.

httpOnly는 책에는 없지만 매우 중요한 값으로 사용자가 쿠키 값을 변경할 수 없도록 한다.

    Set-Cookie: name=value [; expires=date] [; path=path] [; domain=domain] [; secure]
    Cookie: name1=value1 [; name2=value2] ...

아래 처럼 expires 나 max-age를 넣지않으면 세션 쿠키로 작동해서 브라우저 창이 닫히면 사라진다.

    Set-Cookie: sessionid=38afes7a8; HttpOnly; Path=/

    Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Secure; HttpOnly

**11.6.7 Version 1**

폐기되어 패스

**11.6.8 쿠키와 세션 추적**

쿠키를 사용하여 사용자 식별을 할 수 있으니 연속적인 트랜잭션이 가능하다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952597/tlog/Untitled-a2b62cb7-dbca-4d89-80c5-47e8be4e011b_s11fli.png)

**11.6.9 쿠키와 캐싱**

1. 캐시되지 말아야할 문서가 있다면 표시하라.
2. Set-Cookie 헤더를 캐시하는 것에 유의하라
3. Cookie 헤더를 가지고 있는 요청을 주의하라

1은 이해되는데, 2, 3은 영 이해가 되지 않는다.

**11.6.10 쿠키, 보안 그리고 개인정보**

쿠키와 referer를 사용하면 개인 정보를 너무 많이 알아낼 수 있다는 보안상의 문제가 있다.