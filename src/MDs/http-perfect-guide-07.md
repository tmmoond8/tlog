---
title: 7장 캐시
date: '2019-07-01T08:56:56.243Z'
description: HTTP 완벽 가이드 7장 정리
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632186958/tlog/http-perfect-guide_am6yzc.png'
tags:
  - HTTP
  - CS
---

이 장에서 다룰 내용들

- 캐시는 불필요한 데이터 전송을 줄여서, 네트워크 요금으로 인한 비용을 줄여준다.
- 캐시는 네트워크 병목을 줄여준다. 대역폭을 늘리지 않고도 페이지를 빨리 불러올 수 있게 된다.
- 캐시는 원 서버에 대한 요청을 줄여준다. 서버는 부하를 줄일 수 있으며 더 빨리 응답할 수 있게 된다.
- 페이지를 먼 곳에서 불러올수록 시간이 많이 걸리는데, 캐시는 거리로 인한 지연을 줄여준다.

### 7.1 불필요한 데이터 전송

네트워크 비용은 크기 때문에 가능한 효율적으로 사용하는 것이 중요하다. 같은 데이터를 또 받을 필요는 없다.

### 7.2 대역폭 병목

네트워크 속도는 가장 느린 속도에 맞춰지기 때문에 병목 현상이 있어나는데, 캐시는 네트워크 병목을 줄여준다. 국내에서는 지역 간 거리가 그렇게 멀지 않지만, 천조국의 경우는 다르다. 근처에 캐시 서버가 있다면 응답을 빨리 할 수 있다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952595/tlog/Untitled-95449e8f-0771-44d5-8cdc-553243c8d8b3_pnptxi.png)

### 7.3 갑작스런 요청 쇄도

네트워크에 접속은 고르게 있을 때도 많지만, 특정 상황에서는 트래픽이 급증하여 심각한 장애를 야기시킨다.

### 7.4 거리로 인한 지연

당연히 멀면 멀수록 지연이 발생한다.

### 7.5 적중과 비적중

운영체제에서 배운 캐시 hit랑 같은 개념이다. 클라이언트에 요청한 데이터가 캐시에 있다면 원서버에 가지 않고 내려주고, 요청한 데이터가 없다면 원서버에 가져와서 캐시 서버 자체로 저장도 하고 클라이언트에게 넘긴다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952593/tlog/Untitled-7d68a7aa-ce72-47bf-94d0-cf3cbe42b83e_zh9eza.png)

**7.5.1 재검사**

클라이언트가 어떤 요청을 했을 때, 캐시 서버는 hit 했더라도 내가 가진 데이터가 정말 최신이 맞는지를 검증해야 한다. 캐시 서버는 자신이 원할 때 언제든 재검사 할 수 있다. 여기서 데이터가 변하지 않으면 304 Not Modified 값을 받는데, 이 304 status code가 캐시를 위한 값이구나 하고 생각했다.

캐시 서버는 If-Modigied-Since라는 헤더를 통해 값이 변경되었는지 검사한다. 만약 변경된 내용이 있다면 200 OK 코드로 값이 넘어 오고 변경되지  않았다면  304 Not Modified를 준다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952589/tlog/Untitled-1d835916-4b6d-47dc-8a24-dc7a6b6bb29c_hcwspz.png)

**7.5.2 적중률**

간단히 캐시 서버에서 바로 줄 수 있는 상태가 hit 인데, 40%만 되면 괜찮은 편이다고 할 수 있다.

**7.5.3 바이트 적중률**

문서의 크기가 다 다르니 바이트 단위로 적중률을 따지자 인 것 같다.

**7.5.4 적중과 비적중의 구별**

클라이언트 입장에서 받은 응답이 캐시가 바로 내려 준 것인지 원서버에서 준 것 값인지는 알 수 없다. 그러나 헤더에 Date값을 볼 수 있는데, 캐시된 데이터의 경우 내가 요청한 날짜보다 더 과거일 것이다. 여기서 전제는 캐시가 Date값을 건들지 않는다는 전제가 있다. (중개 서버가 Date 값을 수정하면 안된다.) 그리고 사용 프락시 캐시는 Via 헤더에 캐시 서버가 자신에 대한 데이터를 추가 한다.

### 7.6 캐시 토폴로지

**7.6.1 개인 전용 캐시**

보통 웹브라우져는 컴퓨터내 공간에 전용 캐시공간을 만들어 사용한다.

**7.6.2 공용 프락시 캐시**

프락시 서버 종류 중 하나로 캐시 역할을 하는 서버가 공용 캐시라 할 수 있다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952594/tlog/Untitled-73fb35bd-2be0-4093-bf6e-19d6ef90b98e_kxl7zs.png)

**7.6.3 프락시 캐시 레벨들**

더 효율적인 캐시를 사용하기 위해서 여러 레벨의 캐시를 사용하는 것이다. 이건 CPU에서 사용하는 캐시 전략과 유사 하다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952598/tlog/Untitled-bbe3169c-1df8-43cd-9589-024252e3dc58_l5poqp.png)

**7.6.4 캐시망, 콘텐츠 라우팅, 피어링**

콘텐츠 라우팅을 위해 캐시망 안에 있는 캐시들이 하는 행동이다.

- URL에 근거하여, 부모 캐시와 원 서버 중 하나를 동적으로 선택한다.
- URL에 근거하여 특정 부모 캐시를 동적으로 선택한다.
- 부모 캐시에게 가기 전에, 캐시된 사본을 로컬에서 찾아본다.
- 다른 캐시들이 그들의 캐시된  콘텐츠에 부분적으로 접근할 수 있도록 허용하되, 그들의 캐시를 통한 인터넷 트랜짓은 허용하지 않는다.

HTTP는 캐시를 위해  ICP(Internet Cache Protocol)이나 HTCP(Hypertext Cache Protocol)을 확장했다고 한다. 이 내용은 20장에서 다룬다고 한다.

형제캐시를 하는 것을 피어링이라고 하나보다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952588/tlog/Untitled-0eae0bcc-0606-4ffc-8a59-ea794a191d65_cyl14q.png)

### 7.7 캐시 처리 단계

오늘날 상용 캐시 프락시는 꽤 복잡하게 동작한다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952594/tlog/Untitled-049c93e5-6a33-489a-9bf3-54668b73a38d_ltze45.png)

**7.7.1 단계 1: 요청 받기**

캐시는 네트워크 커넥션에서의 활동을 감지하고 데이터를 읽어 들인다. 고성능 캐시는 여러 커넥션에서 동시에 읽어 들인다.

**7.7.2 단계 2: 파싱**

요청 메시지를 파싱하여 URL과 헤더등을 꺼내 조작하기 쉬운 자료구조로 만든다.

**7.7.3 단계 3: 검색**

캐시에 복사본이 있는지 검사하고 없다면 원서버에서 꺼내온다. 

**7.7.4 단계 4: 신선도 검사**

캐시에 복사본이 있다더라도, 원서버와 같은 데이터인지를 검사 해야한다.

**7.7.5 단계 5: 응답 생성**

캐시 서버는 원 서버에서 온 것과 다름 없게 응답을 만든다. 다만 캐시 신선도 정보를 추가 하거나 Via 헤더를 포함시킬 수 있다. 주의할 것은 Date 헤더는 변경하면 안된다.

**7.7.6 단계 6: 전송**

응답을 전송한다.

**7.7.7 단계 7: 로깅**

캐시 서버에서 어떤 트랜잭션을 처리했는지 로깅한다. 로깅하는 포맷은 스키드 로그 포맷, 넷스케이프 확장 공용 로그 포맷 등이 있다고 한다. 그리고 커스텀 로그 파일도 허용한다.

**7.7.8 캐시 처리 플로 차트**

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952599/tlog/Untitled-c4174069-b46c-410f-8e73-6cea9492eaba_qhwsac.png)

### 7.8 사본을 신선하게 유지하기

HTTP에는 문서가 만들어진 시간 또는 만료 기간을 헤더에 넣는다.

**7.8.1 문서 만료**

만료 시간을 나타내는 것은 두 종류가 있다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952595/tlog/Untitled-3442f6f8-2f0e-4942-a9d3-da2ac6d7ca4b_gt1xvi.png)

**7.8.2 유효기간과 나이**

Expires: 언제 만료 할지에 대해 써있다.

Cache-Control: Date를 비교하여 484200초가 지나면 만료 시킨다.

**7.8.3 서버 재검사**

캐시된 문서가 만료되었다는 것은 그 문서가 더 이상 원서버의 데이터와 달라졌다를 의미하는 것이 아니다. 다만, 이제 검사할 시간이 되었다는 것을 의미한다.

**7.8.4 조건부 메서드와의 재검사**

재검사 로직을 효율적으로 하기 위해 캐시 서버는 If-Modified-Since와 If-None-Match를 사용한다.

**7.8.5 If-Modified-Since: 날짜 재검사**

만약 문서가 주어진 날짜 이후로 수정되었다면 요청을 처리하고 그렇지 않으면 캐시에 있는 것을 가져온다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952600/tlog/Untitled-eedae055-044a-4a38-8ac2-83799ec1cc57_u979bd.png)

**7.8.6 If-None-Match: 엔티티 태그 재검사**

문서에서 발행번호 같이 동작하는 ETag를 비교해서 다를 때만 요청을 처리한다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952593/tlog/Untitled-6c6f5537-7f69-43e0-9936-f79064b6614e_fjx4yp.png)

**7.8.7 약한 검사기와 강한 검사기**

모든 데이터를 실시간으로 보여주는 것도 좋겠지만, 예를들어 5초마다 한 번 갱신 하는 것만으로도 사용성을 해치지 않으면서 네트워크의 효율을 크게 높일 수 있다. 약간 검사기는 아주 조금 바뀐 버전에 대해서는 그냥 그 버전 쓰게 하는 것이다. 버전 앞에 `W/` 를 prefix로 사용한다.
```text
ETag: W/"v2.6"
If-Non-Match: W/"v2.6"
```

그외의 일반적으로는 강한 검사기로 사용된다.

**7.8.8 언제 If-None-Match를 사용하고 언제 If-Modified-Since를 사용할까?**

만약 `ETag` 가 있다면 이 값을 사용해야 한다. 또 `Expires` 값이 있다면 사용하고 둘다 있다면 둘다 사용할 수 있다.

### 7.9 캐시 제어

Cache-Control에 사용할 수 있는 값

`no-store`, `no-cache`, `must-revalidate`, `max-age` , Expires 값, 아무런 값을 주지 않음

**7.9.1 no-cache와 no-store 응답 헤더**

캐시를 하지 않음. HTTP/1.0+와 호환성을 위해 Pragma: no-cache를 줄 수 있음

**7.9.2 Max-Age 응답헤더**

`Cache-Control: s-maxage=3660` s-maxage의 경우는 공용된 캐시에만 적용된다 한다.

**7.9.3 Expires 응답 헤더 (deprecated)**

서버에 설정된 시간에 영향을 받음. 

**7.9.4 Must-Revalidate 응답 헤더**

신선도 검사를 하는 헤더를 포함해서 요청해라.

**7.9.5 휴리스틱 만료**

무슨 휴리스틱 만료 알고리즘을 사용한다는데, 나에겐 TMI

**7.9.6 클라이언트 신선도 제약**

요새 브라우저는 캐시를 강제로 지울 수 있다. 캐시 신선도 전략을 위한 다양한 요청 지시어가 있다.

[https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)

**7.9.7 주의 할 점**

문서 만료는 완벽한 시스템이 아니다. 문서가 변할 수 있는 시간을 예측하는 것은 불가능하다.

### 7.10 캐시 제어 설정

**7.10.1 아파치로 HTTP 헤더 제어하기**

**7.10.2 HTTP-EQUIV를 통한 HTML 캐시 제어**

HTML meata 태그에 HTTP-EQUIV에 값에 넣으면 캐시 프락시에서 꺼내서 헤더에 넣는다 이런 내용인데, 이걸 지원하는 서버가 별로 없단다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952597/tlog/Untitled-a499dccd-ab17-4ed7-9c6a-6b8a1fce0eee_ol5hwl.png)

### 7.11 자세한 알고리즘 - 생략

### 7.12 캐시와 광고

**7.12.1 광고 회사의 딜레마**

캐시를 하면 원 서버에 요청이 줄기 때문에 광고가 노출되지 않는다.

**7.12.2 퍼블리셔의 응답**

광고 회사는 캐시를 무력화 하는 방법을 사용한다. 프락시 캐시 입장에선 자신의 역할을 못하기 때문에 이런 무력화를 막기도 한다. 그런데 또 캐시를 하면 방문자 통계를 알 수 없게 한다. 이를 해결하는 대표적인 방법으로는 요청은 원서버에 가지만 본문은 전송하지 않는 식이다.

**7.12.3 로그 마이그레이션**

캐시의 로그를 통해 원서버로의 요청을 뽑아 내려고 하지만, 인증이나 여러 이슈 때문에 표준화 되지 않았다고 한다.

**7.12.4 적중 측정과 사용량 제한**

특정 URL에 대한 캐시 적중 횟수를 Meter라는 새 헤더 하나를 추가해서 넣는데, 이 방법을 Simple Hit-Metering and Usage-Limiting for HTTP라 한다. 이 값을 보고 캐시가 몇번이나 문서를 제공할 수 있는지 제한할 수 있다.