---
title: 1장 HTTP 개관
date: '2019-06-20T08:56:56.243Z'
description: HTTP 완벽 가이드 1장 정리
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632186958/tlog/http-perfect-guide_am6yzc.png'
tags:
  - HTTP
  - CS
---

이번 장에서 다룰 내용들

- 얼마나 많은 클라이언트와 서버가 통신하는지
- 리소스(웹 콘텐츠)가 어디서 오는지
- 웹 트랜잭션이 어떻게 동작하는지
- HTTP 통신을 위해 사용하는 메시지의 형식
- HTTP 기저의 TCP 네트워크 전송
- 여러 종류의 HTTP 프로토콜
- 인터넷 곳곳에 설치된 다양한 HTTP 구성 요소

### 1.1 HTTP: 인터넷의 멀티미디어 배달부

웹에서 통신할 때 데이터가 누락된 것이 없는지에 대한 걱정을 하지 않는다. 이것은 네트워크 차원에서 신뢰성을 보장하기 때문이다. 또 주고 받는 데이터의 포맷은 다양하다. (text, image, video 등)

### 1.2 웹 클라이언트와 서버

HTTP 프로토콜로 의사소통 하는 두 개의 주체를 HTTP 클라이언트, HTTP 서버라고 한다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631954730/tlog/Untitled-f56f3b42-6e86-40b6-95da-a6f8df5ec620_am7jpn.png)

### 1.3 리소스

웹 리소스란 웹에서 제공되는 모든 콘텐츠를 말한다. 심지어 인터넷 검색엔진도 리소스라 할수 있다.

**1.3.1 미디어 타입(Multipurpose Internet Mail Extensions)**

원래 이메일간 데이터 타입을 지정하기 위해 사용하였지만, 사용성이 좋아 HTTP에서도 채택

text/html    →  {proimary object type }/{specific subtype}

**1.3.2 URI(uniform resource identifier)**

    URI  ㅡㅡ URL
          ㄴㅡ URN

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952575/tlog/_2019-06-20__12-5a9b6c14-60f9-4352-8f1e-2363c6f795f9.23.11_kgplkd.png)

URL 구조

URL(uniform resource locator): scheme, host, resource 로 크게 구분.

URN(uniform resource name): 이름을 통해 접근.

### 1.4 트랜잭션

클라이언트의 요청과 서버의 응답의 쌍을 하나의 트랜잭션이라고 한다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952593/tlog/Untitled-7d1bcce2-14ed-40ef-94da-f302a30393e3_m8aikg.png)  

**1.4.1 메서드**

get, post, put, delete, head

**1.4.2 상태 코드**

200, 302, 404

1.4.3 웹페이지는 여러 객체로 이루어질 수 있다.

하나의 웹페이지는 여러 http 트랜잰션을 수행하고 얻은 각각의 리소스를 모아 만든다.

### 1.5 메시지

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952596/tlog/Untitled-695830ca-6bbf-4294-820b-5ffc4f3a9bd7_tkirlx.png)

시작줄: 첫 줄로, 요청이라면 무엇을 해야 하는지 응답이라면 무슨 작업을 했는지 나타낸다.

헤더: 여러줄일수도 있고 없을 수도 있다. 단순히 여러 헤더를 넣고 싶다면 여러줄로 넣자.

본문: 헤더 다음에 개행이 하나 들어가면 헤더가 끝나고 본문 시작. 본문에는 이진 데이터를 포함할 수 있어서 다양한 포맷을 넣을 수 있다.

**1.5.1 간단한 메시지의 예**

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952598/tlog/Untitled-c7cc5988-5db7-4ce1-9ba1-6b95c01f1a58_apjo7h.png)

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952597/tlog/Untitled-a28ffde8-daa5-4465-8191-80bbf5310a22_js0s68.png)

### 1.6 TCP 커넥션

TCP(Transmission Control Protocol)

**1.6.1 TCP/IP**

신뢰성 있는  전송 프로토콜인  TCP/IP 에게 맡긴다.

TCP/IP 에서 보장해주는 서비스

- 오류 없는 데이터 전송
- 순서에 맞는 전달
- 조각나지 않는 데이터 스트림

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952595/tlog/Untitled-03005ca8-1c6f-48cf-8a03-ba14f6543076_zfljxp.png)

**1.6.2 접속, IP 주소 그리고 포트번호**

HTTP 클라이언트가 서버에 메시지를 전송하기 전에 커넥션을 맺어야 한다. 이때 IP주소와 포트번호를 사용한다.

1. 웹브라우저는 서버의 URL에서 호스트 명을 추출한다.
2. 웹브라우저는 서버의 호스트 명을 IP로 변환한다.
3. 웹브라우저는 URL에서 포트번호를 추출한다.
4. 웹브라우저는 웹 서버와 TCP 커넥션을 맺는다.
5. 웹브라우저는 서버에  HTTP 요청을 보낸다.
6. 서버는 웹브라우저에 HTTP 응답을 돌려준다.
7. 커넥션이 닫히면, 웹브라우저는 문서를 보여준다.

**1.6.3 텔넷(Telnet)을 이용한 실제 예제**

skip

### 1.7 프로토콜 버전

HTTP/0.9

디자인 결함이 있었고, GET만 가능, MIME 헤더등 미지원

HTTP/1.0

HTTP 헤더, 메서드, 멀티미디어 객체 처리. 잘 정의된 명세는 아니다.

HTTP/1.0+

"keep-alive" 커넥션, 가상 호스팅, 프락시 연결 지원등..

HTTP/1.1

설계의 결함 교정, 성능 최적화 등 널리 사용..

HTTP/2.0

구글의 SPDY 프로토콜을 기반으로 설계가 진행중..?

### 1.8 웹의 구성요소

프락시

클라이언트와 서버 사이에 위치한 HTTP 중개자. 웹 보안, 애플리케이션 통합, 성능 최적화를 위한 구성요소. 사용자를 대신해서 서버에 접근. 프락시는 주로 보안을 위해 사용하는데 요청과 응답을 필터링하여 위험을 제거 한다.

캐시

많이 찾는 웹페이지를 캐시 서버에 보관. 서버의 부하를 덜어 준다.

게이트 웨이

다른 애플리케이션과 연결된 특별한 웹 서버. 주로 HTTP 트래픽을 다른 프로토콜로 변환하기 위해 사용된다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952588/tlog/Untitled-1d673421-55e8-40f5-9bfe-a7dbacd49181_tpc6hr.png)

터널

단순히 HTTP 통신을 전달하기만 하는 특별한 프락시. 예를 들면 외부에서 요청된 HTTPS를 터널을 통해 사내망으로 들어가고 사내망 안에서는 HTTP로 변환해서 전달 하는 역할을 할 수 있다. (보완 필요)

에이전트

자동화된 HTTP 요청을 만드는 준지능적 웹클라이언트

### 1.9 시작의 끝

### 1.10 추가 정보