---
title: 12장 기본 인증
date: '2019-07-10T08:56:56.243Z'
description: HTTP 완벽 가이드 12장 정리
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632186958/tlog/http-perfect-guide_am6yzc.png'
tags:
  - HTTP
  - CS
---

웹에서 사용자 인증은 기본적인 절차라고 할 수 있다. HTTP는 자체적인 인증 관련 기능을 제공하는데, 그 중 HTTP의 기본 인증에 대해 알아보자.

### 12.1 인증

인증은 자신이 누구인지를 증명하는 것이다. 그러나 완벽한 인증은 없다. (어디까지나 넷상에서의 인증이니까 이렇게 설명한 것 같다.)

**12.1.1 HTTP의 인증요구/응답 프레임워크**

아래는 인증 절차를 나타낸 그림이다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952594/tlog/Untitled-85db37d4-c66a-4ada-9e5f-0fd221cb78ab_o08ls7.png)

**12.1.2 인증 프로토콜과 헤더**

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952597/tlog/Untitled-ace803f3-1968-40cf-9179-0538a96cbf15_yrh5sr.png)

(a) 인증 없이 요청을 보냄

(b) 인증이 필요하다는 401 status와 WWW-Autenticate 헤더를 보냄. 여기서 realm은 지시자

(c) 인증을 시도함. Authorization 헤더에 인증 정보를 포함하여 보냄

(d) 인증 성공

**12.1.3 보안 영역**

위에서 WWW-Autenticate헤더에 realm을 사용 하는 것을 봤다. 예를들어 웹 서버에서 보안 영역을 family, coporation 등으로 여러개를 둘 수 있기 때문에 보안 영역을 지시자에 함께 보낸다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952593/tlog/Untitled-6b33ef20-1469-4fd5-9b90-60121b24d65e_oa4nrk.png)

### 12.2 기본 인증

기본 인증은 널리 알려진 HTTP 인증규약이다. 다만 보안적으로는 취약한 형태다.

**12.2.1 기본 인증의 예**

(a) 사용자가 어떤 리소스를 요청

(b) 서버는 인증 정보가 없는 사용자에게 WWW-Authenticate 헤더와 함께 401 응답

(c) 사용자는 인증 정보를 base-64로 인코딩해서 Authorization 헤더에 담아 보낸다.

(d) 서버는 Authorization 헤더에 있는 값을 디코딩한 후 값을 검사 한다. 정상적으로 인증을 마치면 200을 보낸다.

**12.2.2 Base-64 사용자 이름/비밀번호 인코딩**

[https://www.base64encode.net/](https://www.base64encode.net/) 에서 직접 인코딩 디코딩을 할 수 있다. 기억할 것은 인코딩과 디코딩은 매우 쉽기 때문에 노출된다면 언제든 원래의 값을 가져올 수 있기 때문에 암호화 됐다고 할 수 없다.

**12.2.3 프락시 인증**

프락시 서버에서 인증을 처리할 수 있다.

### 12.3 기본 인증의 보안 결함

기본 인증은 보안에는 취약하다. 사실상 보안을 하지 않은 것과 다름 없다. 그렇게 때문에 SSL 같은 암호 기술이 동반되야 한다. 다음 보안 결함을 살펴보자.

1. 기본 인증은 쉽게 디코딩 된다.
2. 메시지가 도중에 탈취되여 재전송 공격을 당할 수 있다.
3. 사용자는 아이디와 비밀번호를 같은 것을 사용하는 경향이 있기 때문에, 손쉽게 뚫린 비밀번호도 다른 사이트에서 사용될 여지가 있다.
4. 프락시 같은 중개자가 개입될 때 기본인증이 정상적으로 동작하지 않을 수 있다.
5. 기본 인증은 가짜 서버에 취약하다.