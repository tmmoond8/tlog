---
title: 8장 통합점 게이트웨이, 터널, 릴레이
date: '2019-07-03T08:56:56.243Z'
description: HTTP 완벽 가이드 8장 정리
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632186958/tlog/http-perfect-guide_am6yzc.png'
tags:
  - HTTP
  - CS
---

이장에서 다룰 내용

- 게이트웨이: 서로 다른 프로토콜과 애플리케이션 간의 HTTP 인터페이스
- 애플리케이션 인터페이스: 서로 다른 형식의 웹 애플리케이션이 통신하는 데 사용
- 터널: HTTP 커넥션을 통해서 HTTP가 아닌 트래픽을 전송하는 데 사용
- 릴레이: 일종의 단순한  HTTP 프락시로, 한 번에 한 개의 홉에 데이터를 전달하는 데 사용

### 8.1 게이트 웨이

HTTP는 당시 많이 사용하는 통신 방법이었다. 웹에서도 HTTP외에 다른 포토토콜을 사용하는 애플리케이션을 연결하고 싶어졌다. 이 때 게이트웨이가 타 프로토콜을 HTTP에 연결하는 역할을 한다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952594/tlog/Untitled-173d942d-cf69-4c7f-bc45-d81d9123779d_of08uw.png)

(a) 게이트웨이는 FTP URL을 가리키는 HTTP 요청을 받는다. 게이트 웨이는 FTP 커넥션을 맺고 FTP 서버에 적절한 요청을 전송한다. 게이트 웨이는 FTP로 받은 응답을 적절한 HTTP 헤더와 함께 클라이언트로 보낸다.

(b) 게이트웨이는 암호화된 웹 요청을 SSL을 통해 받고, 요청을 해석하여 HTTP 요청을 원서버에 전달한다.

(c) 게이트웨이는 애플리케이션 서버 게이트웨이 API를 통해 서버측의 프로그램에 연결된다.

**8.1.1 클라이언트 측 게이트웨이와 서버 측 게이트웨이**

<클라이언트 측 프로토콜>/<서버 측 프로토콜> 처럼 빗금(/) 으로 구분한다.

HTTP/NNTP 는 HTTP로 접근한 클라이언트가 NNTP를 사용하는 서버에게 게이트웨이로 연결한 것이다.

### 8.2 프로토콜 게이트웨이

아래 그림 처럼 클라이언트에서 FTP를 처리할 게이트웨이 설정을 한다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952588/tlog/Untitled-0e4c4c68-c509-4ccb-af87-765d9bc69332_hnvhsx.png)

일반적인 HTTP 요청은 원서버로 가지만, FTP 요청이 들어있는 HTTP 요청은 HTTP/FTP 게이트웨이에서 처리된 후 바로 클라이언트에게 응답한다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952599/tlog/Untitled-e1fcae48-a6d0-4a1c-ae56-e5d794e4b199_hwj38t.png)

**8.3.2 HTTP/*: 서버 측 웹 게이트웨이**

다음은  HTTP/FTP 기준으로 설명한 예시다. 게이트웨이에서 FTP 프로토콜에 대한 요청을 적절히 처리 해주는 것 같다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952599/tlog/Untitled-c15c324b-9224-4a14-a59d-bcb44c60f6a4_cqw08h.png)

- USER와 PASS 명령을 보내서 서버에 로그인한다.
- 서버에서 적절한 디렉터리로 변경하기 위해 CWD 명령을 보낸다.
- 다운로드 형식을 ASCII로 설정한다.
- MDTM으로 문서의 최근 수정 시간을 가져온다.
- PASV로 서버에게 수동형 데이터 검색을 하겠다고 말한다.
- TETR로 객체를 검색한다.
- 제어 채널에서 반환된 포트로 FTP 서버에 데이터 커넥션을 맺는다. 데이터 채널이 열리는 대로, 객체가 게이트웨이로 전송된다.

**8.2.2 HTTP/HTTPS: 서버 측 보안 게이트웨이**

보안을 제공하는 방식으로 HTTPS 프로토콜만 사용하는 서버가 있다고 생각하자. 클라이언트 측에서 HTTP로 요청을 보내면 HTTP/HTTPS 게이트웨이에서 사용자의 모든 세션을 암호화 하여 통신을 하도록 한다.

**8.2.3 HTTPS/HTTP: 클라이언트 측 보안 가속 게이트웨이**

어떤 내부망이 있다고 생각하자. 내부 망은 보안 처리가 되어 있어서 외부에서는 접근이 되지 않지만, 내부망에서는 HTTP 포로토콜을 사용한다고 하자. 그런데 보안이 HTTPS만 허용한다면, 보안처리 후 HTTP 프로토콜로 변경해줘야 한다. 이때 사용하는 게이트웨이다.

> 보안 처리가 되었다는 것이 HTTPS로 통신한다는 것을 의미하지 않는다. HTTP로 통신하더라도 사용자의 정보(세션, 쿠키, IP) 등으로 보안을 처리할 수 있기 때문이다.

### 8.3 리소스 게이트웨이

게이트웨이의 일반적인 사용방법이라고 한다. 아래의 예시는 두 클라이언트와 하나의 게이트웨이 애플리케이션 서버가 연결되어 있는데, 이 때 게이트웨이 애플리케이션 서버는 두 클라이언트가 HTTP를 통해 서로 요청하고 응답하는 중개인의 역할을 한다. 요청이 들어오면 게이트웨이의 API를 통해 서버의 내부 프로그램을 돌리고 다시 HTTP로 응답하는 식이다. 

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952588/tlog/Untitled-0e31bddc-5a30-4549-a667-0549d3d613c3_qpmmne.png)

애플리케이션 게이트웨이에서 유명했던 최초의 API는 CGI(Common Gateway Interface)였다.

**8.3.1 CGI**

웹에서 동적인 HTML, 신용카드 처리, 데이터베이스 질의등에 사용된다. 초기에는 매 CGI요청마다 프로세스를 생성하기 때문에 부하가 컸지만 어느 정도 기술이 발전하면서 이런 성능 저하는 해결되었다.

**8.3.2 서버 확장 API**

HTTP와 모듈을 직접 연결하는 인터페이스로, FPSE(FrontPage Server Extension)가 유명하고 클라이언트로 부터 RPC(Remote Procedure Call) 명령을 인식할 수 있다.

### 8.4 애플리케이션 인터페이스와 웹 서비스

데이터를 교환할 때 두 어플리케이션의 프로토콜 인터페이스를 맞추는 것은 까다로운 이슈였다. HTTP 메시지 포맷으로는 제약이 있었기 때문이다. 여기서 HTTP 헤더에 XML을 사용하여 정보 교환을 하는 방식을 표준으로 삼았고 이를 SOAP(Simple Object Access Protocol)이라 한다.

### 8.5 터널

HTTP 커넥션을 통해서 HTTP가 아닌 트래픽을 전송하는 방법. 

**8.5.1 CONNECT로 HTTP 터널 커넥션을 맺음**

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952599/tlog/Untitled-cf8fa921-c508-4cfa-8f2c-00fabba1ae5f_y9h3db.png)

CONNECT 요청을 한 뒤, 연결되면 그 때부터 양방향으로 데이터를 주고 받는다. CONNCECT 요청과 응답은 조금 특징이 있다.
```text
CONNECT tlog.tammolo.com:443 HTTP/1.1
User-agent: Mozilla/6.0

HTTP/1.1 200 Connection Established
Proxy-agent: Netspace-Proxy/1.1
```

요청에는 CONNECT란 메서드를, 응답에는 Content-Type 헤더를 포함할 필요가 없다.

**8.5.2 데이터 터널링, 시간, 커넥션 관리**

메시지를 더 빨리 보내기 위해 CONNCET 요청을 하고 응답을 받지 않은 상태로 데이터를 전송한다고 한다. 서버는 이런 동작을 이해하고 적절히 처리를 해줘야 하고, 만약 데이터를 교환중에 커넥션이 닫히면 데이터는 증발한다.

**8.5.3 SSL 터널링**

이건 잘 이해가 안된다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952594/tlog/Untitled-72a289c2-e832-4b52-be9e-5277ae776bab_ttr1gm.png)

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952588/tlog/Untitled-0ed00826-c68a-4385-bfc1-0213620c2ddc_t2nzss.png)

**8.5.4 SSL 터널링 vs HTTP/HTTPS 게이트웨이**

**8.5.5 터널 인증**

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952600/tlog/Untitled-f91d3558-d0ed-40c5-acc5-40b8eff20466_wvp9dw.png)

**8.5.6 터널 보안에 대한 고려사항들**

### 8.6 릴레이

HTTP 릴레이는 HTTP 명세를 완전히 준수하지 않는 간단한 HTTP프락시다. 커넥션을 맺기 위한 HTTP 통신을 한 다음에는 HTTP 메시지가 아닌 바이트를 맹목적으로 전달한다. 이 때 릴레이 중에는 멍청한 프락시 문제를 겪는 릴레이가 있다. keep-alive 커넥션 헤더를 이해하지 못해서 행에 걸리는 것이다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952594/tlog/Untitled-95c412ae-4803-4f59-8ce2-4740e5dbbf6e_b7bq2b.png)