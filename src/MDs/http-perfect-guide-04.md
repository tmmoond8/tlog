---
title: 4장 HTTP 커넥션 관리
date: '2019-06-28T08:56:56.243Z'
description: HTTP 완벽 가이드 4장 정리
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632186958/tlog/http-perfect-guide_am6yzc.png'
tags:
  - HTTP
  - CS
---

이 장에서 다루는 내용들

- HTTP는 어떻게 TCP 커넥션을 사용하는가
- TCP 커넥션의 지연, 병목, 막힘
- 병렬 커넥션, keep-alive 커넥션, 커넥션 파이프라인을 활용한 HTTP의 최적화
- 커넥션 관리를 위해 따라야 할 규칙들

### 4.1 TCP 커넥션

HTTP 통신은 네트워크 장비에서 사용하는 전송 프로토콜인 TCP/IP를 통해 이루어진다. TCP/IP 위에서 전송되기 때문에 메시지의 무결성, 순서 등을 보장할 수 있는데, 이러한 특징을 신뢰성 있는 연결이라 한다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952597/tlog/Untitled-ad9c50c8-e6d6-4e3a-ad75-9d027204684c_yfjc6w.png)

**4.1.1 신뢰할 수 있는 데이터 전송 통로인 TCP**

HTTP 커넥션은 몇가지 사용 규칙이 추가된 TCP 커넥션이다. HTTP 커넥션을 이해하는 것은 TCP 커넥션을 이해하는 것을 베이스로 한다. TCP 커넥션은 간단히 말해 한쪽에 있는 바이트(데이터)를 반대쪽으로 순서에 맞게 정확히 전달하는 것이다.

**4.1.2 TCP 스트림은 세그먼트로 나뉘어 IP 패킷을 통해 전송된다.**

TCP는 IP 패킷(또는 IP 데이터그램)이라고 불리는 데이터 조각으로 전송된다. TCP와 관계된 프로토콜 스택을 보면 아래와 같다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952600/tlog/Untitled-e70b9b38-476b-494c-bdb4-8b03e70e78b1_xokqzy.png)

TCP는 세그먼트라는 단위로 데이터 스트림을 잘게 나누고, 세그먼트를 IP 패킷으로 감싸서 전달한다. 이 과정은 웹프로그머가 잘 알지 못해도 알아서 잘 해주기 떄문에 신경 쓸 필요가 없다.

 

아래 사진을 보면 우리가 3장에서 배운 HTTP 메시지가 TCP 데이터 스트림 청크로 들어가 있다. 그 청크를 TCP 세그먼트가 감싸고, TCP 세그먼트를 IP 패킷으로 감싸서 전달이 되는 것이다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952599/tlog/Untitled-d0c8fd6f-3a68-404e-b7ac-d50fd9790ec6_h1esxo.png)

**4.1.3 TCP 커넥션 유지하기**

컴퓨터는 TCP 커넥션을 여러개 가지고 있다. 커넥션은 네 가지 값으로 식별할 수 있다.

<발신지 IP주소, 발신지 포트, 수신지 IP주소, 수신지 포트> 

위 값이 모두 같은 커넥션은 없다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952593/tlog/Untitled-5e956fd1-f8be-42d8-9094-bf02f3b77b27_h1uwg3.png)

위 내가 구글로 탭을 하나 띄워 놓고 또 다른 탭으로 구글에 접속하면 나의 IP주소는 같겠지만 다른 포트 번호로 요청 한다. 심지어, 성능 향상을 위해서 구글에 접속 했을 때 다중 커넥션을 만들어서 여러 데이터를 동시에 받게 되는데, 이때 여러 포트로 커넥션을 만들게 된다.

**4.1.4 TCP 소켓 프로그래밍**

운영체제 차원에서 TCP 커넥션 관련 기능을 제공한다.

[TCP 커넥션 프로그래밍을 위한 공통 소켓 인터페이스 함수들](https://www.notion.so/0805abaf0c07428e973b1abfb29ef83e)

소켓 API를 사용하면, TCP 종단 데이터 구조를 생성하고, 원격 서버의 TCP 종단에 그 종단 데이터 구조를 연결하여 데이터 스트림을 읽고 쓸 수 있다.

TCP API는, 기본적인 네트워크 프로토콜의 핸드셰이킹, 그리고 TCP 데이터 스트림과 IP 패킷 간의 분할 및 재조립에 대한 모든 세부사항을 외부로부터 숨긴다.

HTTP 서버와 클라이언트간 통신 과정은 몇번 했으니 아래 그림만 참조

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952600/tlog/Untitled-e8a43434-de05-42ae-a7e6-d0e0f1c70767_a3ubjf.png)

### 4.2 TCP의 성능에 대한 고려

HTTP 통신은 TCP 성능에 절대적으로 의존한다. 그렇기 때문에 TCP의 특성을 이해하면, HTTP 통신의 최적화를 더 잘할 수 있게 될 것이다.

**4.2.1 HTTP 트랜잭션 지연**

통신에서 TCP 커넥션을 설정하고, 요쳥을 전송하고, 처리 하여 응답을 주고 클라이언트가 응답을 받는 과정 중에 처리는 매우 비중이 낮다. 대부분을 차지하는 것이 네트워크 지연이다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952600/tlog/Untitled-ec8523c4-036c-4eb6-ad7c-40911b0dd5b5_h62ast.png)

1. 클라이언트는 도메인 네임을 통해 IP를 알아내야 한다. 접근한 기록이 없다면 DNS를 거쳐야 한다.
2. 서버에 TCP 커넥션 요청을 보낸다.
3. 커넥션이 맺어지면 HTTP 요청을 생성된 TCP 파이프를 통해 전송한다.
4. 웹 서버가 응답을 보내는 시간이 걸린다.

**4.2.2 성능 관련 중요 요소**

- TCP 커넥션의 핸드셰이크 설정
- 인터넷의 혼잡을 제어하기 위한 TCP의 slow-start
- 데이터를 한데 모아 한 번에 전송하기 위한 nagle 알고리즘
- TCP의 piggyback, acknowledgment을 위한 확인응답 지연 알고리즘
- TIME_WAIT 지연과 포트 고갈

위 리스트를 통해 성능 최적화를 할 수 있다.

4.2.3 TCP 커넥션 핸드셰이크 지연

HTTP 프로그래머는 커넥션의 핸드셰이크를 보지 못한다. 커넥션을 생성하는 것은 사실 굉장한 비용이라고 할 수 있다. 왜냐면 총 세 번의 네트워크 비용이 발생하기 때문이다. 이렇게 어렵게 매번 커넥션을 만들지 않고 재활용 하자.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952597/tlog/Untitled-aa9ae9c8-fa94-4403-be3b-b2f984418214_dbk28v.png)

**4.2.4 확인응답 지연**

인터넷 자체가 패킷의 전송을 완벽히 보장하지 않는다. 예를 들면 인터넷 라우터가 과부하에 걸렸을 때, 라우터는 마음대로 패킷을 파기할 수 있기 때문이다.

각 TCP 세그먼트는 순번과 데이터 무결성 체크섬을 가진다. 각 세그먼트의 수신자는 세그먼트를 온전히 받았다는 의미로 확인응답(ACK) 패킷을 송신자에게 반환한다. 이 값은 하나의 비트기 때문에 이 비트 하나를 위한 패킷을 만들기에는 아깝다. 그렇기 때문에 방향이 같은 다른 패킷에 동승(piggyback)한다. 확인응답 지연은 효율적으로 확인응답을 보내기 위해 동승할 패킷을 위해 기다리는 행위이다. 기다리다 늦어지면 물론 별도의 패킷을 만들어야 한다.

**4.2.5 TCP slow-start**

패킷의 전송속도는 네트워크 대역폭에 따라 결정되는데, 네트워크의 대역폭은 미리 알수가 없다. 너무 많은 데이터를 보내서 대역폭이 감당을 하지 못하면 문제가 발생하기 때문에 안전을 위해 낮은 속도로 먼저 보내다가, 조금씩 늘리게 된다. 이를 slow-start라 한다.

**4.2.6 Nage 알고리즘과 TCP_NODELAY**

예전에 2g폰 시절에 응 하나만 보내면 조금 아까웠다. 할말을 모아서 48자 꾹꾹 채워서 보낸 경험이 있는데 네이글 알고리즘이 바로 그거다. 보낼 데이터를 바로 보내지 않고 모았다가 같이 보내게 되는데 데이터가 모일때까지 기다려야 하기 때문에 딜레이가 생긴다.

**4.2.7 TIME_WAIT의 누적과 포트 고갈**

귀찬,,

### 4.3 HTTP 커넥션 관리

커넥션 관리는 HTTP 성능 최적화에 큰 관련이 있다.

**4.3.1 흔히 잘못 이해하는 Connection 헤더**

아래 Conntection 과 Meter 는 커넥셔 커넥션 헤더 값이다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952594/tlog/Untitled-100cfe76-f1c6-4c83-8afe-ca44ca1d252b_rupb12.png)

일단 모든 커넥션 헤더 값은 현재 커넥션에만 해당하고 다음 커넥션에는 전달하면 안된다. 그런데 이 커넥션에 대해 잘못 처리하는 서버가 있을 수 있고, 또 서버와 클라이언트 사이에 놓인 프락시 서버, 캐시 서버 같은 중개 서버에서 적절히 처리를 하지 못하기도 한다.

**4.3.2 순차적인 트랜잭션 처리에 의한 지연**

웹에서 주고 받는 데이터가 크기 때문에 빠르게 HTTP 요청을 주고 받기 위해서 다음 네 가지 전략을 생각해 냈다.

병렬 커넥션 - 여러 개의 TCP 커넥션을 통한 동시 HTTP 요청

지속 커넥션 - 커넥션을 맺고 끊는 데서 발생하는 지연을 제거하기 위한 TCP 커넥션의 재활용

파이프라인 커넥션 - 공유 TCP 커넥션을 통한 병렬 HTTP 요청

다중 커넥션 - 요청과 응답들에 대한 중재

### 4.4 병렬 커넥션

동시에 여러 커넥션을 사용하여 병렬 처리

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952601/tlog/Untitled-fae0a47b-29b2-42f7-a643-687b4ae8003f_rrr7xy.png)

**4.4.1 병렬 커넥션은 페이지를 더 빠르게 내려 받는다.** - 메모리를 많이 소모 한다.

**4.4.2 병렬 커넥션은 항상 더 빠르지는 않는다.** - 매우 느린 네트워크 대역폭에서는 어쩔수 없다.

**4.4.3 병렬 커넥션은 더 빠르게 '느껴질 수' 있다.** - 사진 일부가 조금씩 보여진다면,, 뭐 그럴수 있지

### 4.5 지속 커넥션

커넬션을 한 번 사용하고 폐기 하지 않고 재활용하는 것으로 HTTP/1.0+ 이상부터 사용 한다.

**4.5.1 지속 커넥션 vs 병렬 커넥션**

병렬 커넥션 단점

- 커넥션 생성 비용
- slow-start
- 병렬 커넥션 수의 제한

지속 커넥션은 위의 제한을 커버할 수 있기 때문에 병렬 커넥션과 지속 커넥션을 함께 사용.

HTTP/1.0+ 에서는 'keep-alive'를, HTTP/1.1 부터는 지속 커넥션을 사용.

**4.5.2 HTTP/1.0+의 Keep-Alive 커넥션**

Keep-Alive 는 deprecated 됐다. HTTP/1.1 명세에는 빠졌다.

**4.5.3 Keep-Alive 동작**

클라이언트에서 Connect: Keep-Alive를 보내고 서버가 똑같이 보내면 커넥션의 재활용하게 된다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952598/tlog/Untitled-b0208315-3fcb-42f2-b5e1-f063e8d13a77_vhfqge.png)

**4.5.4 Keep-Alive 옵션**

클라이언트가 요청했지만, 이를 할지 말지는 서버의 마음이다. 

그리고 커넥션을 유지하는 방식에 따른 옵션값도 넘길 수 있다.

Connection: Keep-Alive

Keep-Alive: max=5, timeout=120

**4.5.5 Keep-Alive 커넥션 제한과 규칙**

- keep-alive는 HTTP/1.0에서 기본 값은 아니다.
- 클라이언트가 Keep-Alive를 보냈는데 서버가 Keep-Alive를 보내지 않으면 지속 커넥션이 안되고 커넥션이 끊어질 것이라고 생각한다.
- Keep-Alive를 사용할 때는 서버에서 정확한 Content-Length를 보내야 한다. 그렇지 않으면 커넥션의 어느 부분을 사용하는지 모를 것이다.
- 클라이언트와 서버 사이에는 중개 서버(프락시, 캐시)가 있을 수 있는데 Keep-Alive를 모르면 행이 걸릴 수 있다.

**4.5.6 Keep-Alive와 멍청한 프락시**

멍청한 프락시는 Keep-Alive값을 헤더에 잘 전달할 것이다. 그런데 문제는 멍청한 프락시는 서버가 커넥션을 끊기를 기다린다는 것이다. 

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952598/tlog/Untitled-c1ddebff-946e-4d53-a41f-286df0d279de_rgl5mg.png)

**4.5.7 Proxy-Connection 살펴보기**

멍청한 프락시 때문에 등장한 녀석으로 동작을 간단히 살펴보면 아래 이미지와 같다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952598/tlog/Untitled-bcc986d1-9088-436d-8da0-45bef187d815_xn2lcx.png)

멍청한 프락시는 Proxy-Connection 값을 그대로 전달해서 지속 커넥션을 사용하지 않지만, 똑똑한 프락시는 Proxy-Connection을 Connection으로 변경하여 지속 커넥션을 사용하도록 변경한다.

근데 문제는 서버와 클라이언트 사이에 하나라도 멍청한 프락시가 있을때 발생한다. 하나라도 멍청한 프락시가 있다면 지속 커넥션을 제대로 쓰지 못한다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952589/tlog/Untitled-2cb9ede6-0478-4152-91f5-837759841dde_vsnuy8.png)

**4.5.8 HTTP/1.1의 지속 커넥션**

HTTP/1.1 부터는 기본적으로 알아서 지속 커넥션을 사용한다고 한다.

**4.5.9 지속 커넥션의 제한과 규칙**

그냥 보내면 지속 커넥션을 사용하고 Connection: close를 보내면 커넥션이 끊긴다. 마찬가지로 정확한 Content-Length를 사용해야 한다.

### 4.6 파이프라인 커넥션

설명하는데 잘 이해는 되지 않았다.

- HTTP 클라이언트는 커넥션이 지속 커넥션인지 확인하기 전까지는 파이프라인을 이어서는 안된다.
- HTTP 응답은 요청 순서와 동일하게 와야 한다. 순서를 알 방법이 없다.
- HTTP 클라이언트는 커넥션이 끊어지더라도 다시 보낼 수 있도록 대책을 가지고 있어야 한다.
- POST와 같은 반복될 때 문제가 발생할 요청은 파이프라인을 통해 보내서는 안된다.

### 4.7 커넥션 끊기에 대한 미스터리

커넥션을 언제 끊어야 하는가 에 대해 명확한 기준이 없다.

**4.7.1 '마음대로' 커넥션 끊기**

눈치껏 서버가 끊는다.

**4.7.2 Content-Length와 Truncation**

 Content-Length 값을 잘 챙기자.

**4.7.3 커넥션 끊기의 허용, 재시도, 멱등성**

커넥션이 끊길 것을 대비해야 한다. POST외에는 멱등하다고 하는데, 잘 이해는 안된다. DELETE 같은 애도 멱등하지 않다고 생각한다.

**4.7.4 우아한 커넥션 끊기**

전체 끊기와 절반 끊기를 사용하라는데 소켓 API인가??