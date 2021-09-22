---
title: 5장 웹서버
date: '2019-06-29T08:56:56.243Z'
description: HTTP 완벽 가이드 5장 정리
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1632186958/tlog/http-perfect-guide_am6yzc.png'
tags:
  - HTTP
  - CS
---

이 장에서 다룰 내용들

- 여러 종류의 소프트웨어 및 하드웨어 웹 서버에 대해 조사
- HTTP 통신을 진단해주는 간단한 웹 서버를 Perl로 작성해본다.
- 어떻게 웹 서버가 HTTP 트랜잭션을 처리하는지 단계별로 설명한다.

### 5.1 다채로운 웹 서버

웹 서버는 몇 줄짜리 간단한 로직을 수행하는 웹 서버 부터 복잡한 상용 엔진도 있다.

**5.1.1 웹 서버 구현**

웹서버는 HTTP 프로토콜을 구현하고, 웹 리소스를 관리하고, 웹 서버 관리 기능을 제공한다. 

**5.1.2 다목적 소프트웨어 웹 서버**

nginx, apache, 마소꺼, 구글꺼가 있다. 최근에는 nginx를 가장 많이 사용한다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952575/tlog/_2019-06-24__2-094f59c9-2b42-465c-b986-a8ad93071d66.37.46_vfrpce.png)

**5.1.3 임베디드 웹 서버**

쌀알 만한 컴퓨터가 있다고 한다.

### 5.2 간단한 펄 웹서버

코드는 생략,, 간단하게 요새는 노드로 짜면 될 텐데!

### 5.3 진짜 웹 서버가 하는 일

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952599/tlog/Untitled-e6f2ebb6-3d9f-4855-b9a7-2750f74d96dc_fyjlkz.png)

1. 커넥션을 맺는다. — 클라이언트의 접속을 받아들이거나, 원치 않는 클라이언트라면 닫는다.
2. 요청을 받는다. — 요청 메시지를 해석하고 행동을 취한다.
3. 요청을 처리한다. — 요청 메시지를 해석하고 행동을 취한다.
4. 리소스에 접근한다. — 메시지에서 지정한 리소스에 접근한다.
5. 응답을 만든다. — 올바른 헤더를 포함한 HTTP 응답 메시지를 생성한다.
6. 응답을 보낸다. — 응답을 클라이언트에게 돌려준다.
7. 트랜잭션을 로그로 남긴다. — 로그파일에 트랜잭션 완료에 대한 기록을 남긴다.

### 단계 1: 클라이언트 커넥션 수락

클라이언트가 이미 서버에 대해 열려있는 지속적 커넥션이 있다면, 있는 것을 사용하고 없다면 새 커넥션을 생성해야 한다.

**5.4.1 새 커넥션 다루기**

서버는 연결된 클라이언트의 IP 정보를 기반으로 커넥션을 생성한다. IP 주소를 검증하여 필요에 따라 커넥션을 닫을 수 있다.

**5.4.2 클라이언트 호스트 명 식별**

역방향 DNS를 통해 IP로 부터 호스트명을 얻고 호스트명을 분석한다.

**5.4.3 ident를 통해 클라이언트 사용자 알아내기**

서버에서 ident를 확인하는 것인데 113번 포트를 사용한다고 한다. 그런데 많은 소프트웨어가 지원하지 않아서 잘 안 사용하는 듯? 암튼 별도의 ident 값을 확인하는 절차가 있다고 한다.

### 5.5 단계 2: 요청 메시지 수신

서버에서는 요청 메시지를 파싱한다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952596/tlog/Untitled-1003319b-6b36-4a9a-bc41-ec357799a459_ioq04g.png)

- 요청 메시지의 시작줄을 파싱하여 요청 메서드, 리소스, 버전 정보를 찾는다. 각 값은 스페이스 한 개로 분리되어 있으며, 끝에는 CRLF 문자열로 끝난다.
- 메시지의 헤더를 읽는다. 각 헤더 메시지는 CRLF로 끝난다.
- 헤더의 끝을 알리는 빈줄 (CRLF)을 찾는다.
- 요청 본문이 있다면, 읽고 없다면 파싱을 끝낸다.

**5.5.1 메시지의 내부 표현**

메시지를 내부의 자료구조로 파싱해서 가지고 있는다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952593/tlog/Untitled-7b7220d4-d7d9-4e8c-b71e-3d202ab260e1_utfafx.png)

**5.5.2 커넥션 입력/출력 처리 아키텍쳐**

간단히 그림만 봐도 이해 되지 않습니까?

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952588/tlog/Untitled-1ca30496-1c21-4ddc-943c-4659b6c7b0c9_fk6sgb.png)

### 5.6 단계 3: 요청 처리

요청 처리는 뒤에서 자세히 다룬다.

### 5.7 단계 4: 리소스의 매핑과 접근

웹 서버는 리소스 서버다. URI에 접근하면 컨텐츠를 제공해준다.

**5.7.1 Docroot**

웹 서버 파일 시스템의 특별한 폴더를 웹 콘텐츠를 위해 설정한다.

아파치 웹 서버를 기준으로 설명하면

    DocumentRoot /usr/local/httpd/files

[http://tamm.com/../](http://tamm.com/../) 처럼 허용하는 디렉토리의 부모에 접근하는 것도 물론 막아야 한다.

docroot를 사용하면 가상 호스팅 방식으로 하나의 웹서버에서 여러 루트를 사용할 수 있게 한다.

    <VirtualHost www.joes-hardware.com> 
    	 ServerName www.joes-hardware.com 
    	 DocumentRoot /docs/joe 
    	 TransferLog /logs/joe.access_log 
    	 ErrorLog /logs/joe.error_log 
     </VirtualHost> 
     
     <VirtualHost www.marys-antiques.com> 
    	 ServerName www.marys-antiques.com 
    	 DocumentRoot /docs/mary 
    	 TransferLog /logs/mary.access_log 
    	 ErrorLog /logs/mary.error_log 
     </VirtualHost> 
     ...

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952594/tlog/Untitled-68be840e-cfa3-4ccf-8d7d-a123e2ee7885_jsmxr2.png)

**5.7.2 디렉터리 목록**

index.html 의 역할을 설명하는 것 같다. index.html은 웹페이지의 시작점으로서...

**5.7.3 동적 콘텐츠 리소스 매핑**

**5.7.4 서버사이드 인클루드**

요새는 동적으로 웹을 만드는데 더 멋진 방법을 쓴다고 생각한다.

**5.7.5 접근 제어**

HTTP 인증과 관련 있고, 뒤에서 자세히

### 5.8 단계 5: 응답 만들기

서버는 요청에 대해 적절한 응답을 만들어서 보내야 한다.

**5.8.1 응답 엔터티**

응답 본문이 포함된다면 다음 내용을 포함 해야 한다.

- MIME를 서술하는 Content-Type
- 응답 본문 길이인 Content-Length
- 실제 응답 본문 내용

**5.8.3 리다이렉션**

필요에 따라 어떤 요청 후 클라이언트에게 이동할 위치를 줄 수 있다. Location 응답 헤더가 그것이다.

### 5.9 단계 6: 응답 보내기

커넥션에 응답을 보내게 된다. 마찬가지로 커넥션의 수는 제한적이기 때문에 커넥션을 잘 관리하는 것이 중요하다. 그리고 지속적인 커넥션이면 Content-Length를 올바른 값으로 주어야 한다.

## 5.10 단계 7: 로깅

웹 서버에서 수행한 내용을 로깅한다. 이는 21장에서 더 자세히 다룬다.