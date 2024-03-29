---
title: 9장 웹 로봇
date: '2019-07-05T08:56:56.243Z'
description: HTTP 완벽 가이드 9장 정리
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632186958/tlog/http-perfect-guide_am6yzc.png'
tags:
  - HTTP
  - CS
---

이 장에서 다룰 내용들

- 주식시장 서버에 매 분 HTTP GET 요청을 보내고, 여기서 얻은 데이터를 활용해 주가 추이 그래프를 생성하는 그래프 로봇
- 월드 와이드 웹의 규모와 진화에 대한 통계 정보를 수집하는 웹 통계 조사 로봇. 이것들은 웹을 떠돌면서 페이지의 개수를 세고, 각 페이지의 크기, 언어, 미디어 타입을 기록한다.
- 검색 데이터베이스를 만들기 위해 발견한 모든 문서를 수집하는 검색엔진 로봇.
- 상품에 대한 가격 데이터베이스를 만들기 위해 온라인 쇼핑몰의 가탈로그에서 웹페이지를 수집하는 가격 비교 로봇

### 9.1 크롤러와 크롤링

루트로 부터 시작해서 링크된 페이지를 모두 가져와서 재귀적으로 반복 순회하는 것을 크롤링이라고 하고, 크롤링하는 로봇을 크롤러라 한다.

**9.1.1 어디에서 시작하는가: '루트 집합'**

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952596/tlog/Untitled-06436312-7456-4303-8d7f-9bb0a186518e_ccghfp.png)

위 이미지에서 A, G, L, S만 있다면 모든 페이지를 다 찾아볼 수 있다. 일반적으로 [google.com](http://google.com) 같은 검색 엔진이 루트의 좋은 예다.

**9.1.2 링크 추출과 상대 링크 정상화**

HTML은 여러 링크로 연결되어 있을 수 있다. HTML에는 상대 URL을 사용하는데 크롤러는 절대 URL로 바꿀 필요가 있다.

**9.1.3 순환 피하기**

웹 크롤링을 할 때 순환에 빠질 위험이 있다. 자기 참조나 순환 참조가 얼마든지 가능하기 때문이다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952593/tlog/Untitled-7c085d20-f054-48da-aedd-89e4638c8e22_umtk21.png)

**9.1.4 루프와 중복**

크롤러가 루프에 빠지면 아무일도 못한다. 그리고 같은 페이지를 계속 가져오게 되면 부담이 된다.(효율을 위해 메모리에 데이터를 저장하고 있다.)

**9.1.5 빵 부스러기의 흔적**

크롤러가 크롤링할 웹 사이트의 개수는 매우 많고 endpoint까지 따지면 훨씬 더 많아진다. 내가 이전에 방문 했는지에 대한 여부를 아는 것도 매우 중요하고, 한 웹사이트의 엔드 포인트들을 구조적으로 관리하는 것도 의미가 있다. 그렇기 때문에 크롤러가 검색 트리나 해시 테이블, 느슨한 존재 비트맵 등을 사용한다.

또 로봇 프로그램이 갑작스럽게 중단된 경우를 대비해서 체크 포인트(RPG 게임의 save 포인트)를 사용하거나, 웹이 방대하기 때문에 여러 크롤러가 협업하여 부분적으로 맡아서 크롤링하는 파티셔닝도 사용한다.

**9.1.6 별칭(alias)과 로봇 순환**

[http://www.foo.com:80/bar.html](http://www.foo.com/bar.html) 과

[http://www.foo.com/bar.html](http://www.foo.com/bar.html) 는 같다. 기본포트 80을 사용한다.

[http://www.foo.com/~fred](http://www.foo.com/%7Ffred) 와

[http://www.foo.com/%7fred](http://www.foo.com/%7Ffred) 는 같다. URL 인코딩된 결과도 같은 값을 가리킨다.

[http://www.foo.com/x.html](http://www.foo.com/x.html#middle) 와

[http://www.foo.com/x.html#middle](http://www.foo.com/x.html#middle) 은 같다. 같은 문서를 가리키고 #fragment는 문서의 위치 context 일 뿐이다.

[http://www.foo.com/readme.html](http://www.foo.com/README.HTM) 와

[http://www.foo.com/README.HTM](http://www.foo.com/README.HTM) 는 같다. 대소문자를 구분하지 않는다.

[http://www.foo.com/](http://www.foo.com/index.html) 와

[http://www.foo.com/index.html](http://www.foo.com/index.html) 는 같다. .html을 지정하지 않으면 index.html을 가리키기 때문이다.

[http://www.foo.com/index.html](http://209.231.87.45/index.html) 와

[http://209.231.87.45/index.html](http://209.231.87.45/index.html) 는 같다. 도메인과 IP 주소는 1:1도 매칭된다.

**9.1.7 URL 정규화 하기**

문자열의 내용은 다르지만, 결과적으로 같은 endpoint를 가르키는 경우를 9.1.6절에서 확인하였다. 이런 문제를 피하고자 URL을 다음 규칙에 따라 정규화를 한다.

1. 포트 번호가 명시되어 있지 않는다면 ':80'을 추가한다.
2. 모든 %xx 이스케이핑된 문자들을 대응하는 원래 문자로 변환한다.
3. #태그들을 제거 한다.

**9.1.8 파일 시스템 링크 순환**

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952596/tlog/Untitled-11658264-21c1-405c-8331-5177fb56ab3b_ucqmuo.png)

파일 시스템의 심볼릭 링크가 끝 없는 디렉터리 계층을 만들 수 있는데, 이게 위험이 된다고 한다.(??? 이해가 잘 안된다.)

**9.1.9 동적 가상 웹 공간**

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952598/tlog/Untitled-bcc56e52-c285-4c63-bbaf-ea19b281ff66_ihgfri.png)

동적인 웹 공간에서 크롤러는 의미없는 동작을 할 수 있다. 예를들어 달력이라고 생각 했을 때, 페이지를 누르면 다음 페이지를 누르면 링크로 이동이 될텐데, 달력은 끝없는 페이지로 연결될 수 있다. 일반 사용자는 모든 페이지를 이동하지 않고 닫겠지만, 크롤러는 조금 멍청하게도 계속된 링크 페이지로 이동할 수 있다.

**9.1.10 루프와 중복 피하기**

크롤러가 효율적으로 크롤링 하기 위해 몇가지 전략을 쓴다. 이 전략을 사용하면서 일부의 손실이 있을 수 있지만 효율성을 위해 약간의 정확성은 희생한다.

*URL 정규화* - URL을 일정 형태로 만듦

*너비 우선 크롤링* - 깊이 우선이 아닌 너비 우선 탐색

*스로틀링* - 한 웹사이트에서 가져올 페이지 숫자를 제한

*URL 크기 제한* - URL 주소가 보통 1KB가 넘으면 크롤링을 거부 할 수 있다.

*URL/ 사이트 블랙리스트* - 여러 크롤러가 동시에 돌기 때문에 블랙리스트를 만들면 리소스 낭비를 줄인다.

*패턴 발견* - '/sub/sub/sub/sub/sub/...' 같은 URL 패턴을 감지

*콘텐츠 지문(fingerprint)* - 문서에 대한 체크섬(MD5)을 사용한다.

*사람의 모니터링* - 아직 까지는 사람이 모니터링을 해줘야 완성 된다.

### 9.2 로봇의 HTTP

로봇은 아직도 HTTP/1.0 버전을 사용한다. 그 이유는 HTTP/1.1 버전 이상 부터 헤더 구조도 크고 더 큰 메시지를 사용하는데 HTTP/1.0 은 간소한 형태라서 그렇다고 한다.

**9.2.1 요청 헤더 식별하기**

로봇은 간소한 메시지를 사용하지만, 명확한 내용을 해야 하기 때문에 다음의 헤더 값은 꼭 사용한다.

*User-Agent* - 서버에게 로봇인지 명확히 알린다.

*From* - 로봇의 사용자/관리자 이메일 주소를 제공한다.

*Referer* - 현재 요청 URL을 포함한 문서의 URL을 제공한다.

*Accept* - 로봇은 보통은 텍스트 또는 이미지만 받게 될 것이다. 

**9.2.2 가상 호스팅**

가상 호스팅을 사용하는 서버에게 정확히 요청을 보내려면 Host 헤더를 요청 메시지에 포함시켜야 한다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952598/tlog/Untitled-b16636df-63c6-4795-ad76-71b4fe530130_j6yb9s.png)

**9.2.3 조건부 요청**

7장 캐시에서 다뤘던 조건부 요청을 사용하여 데이터가 변경되지 않았다면 크롤러도 skip 하도록 해야 한다.

**9.2.4 응답 다루기**

로봇들도 HTTP 응답을 다룰 줄 알아야 한다. 상태 코드 뿐 아니라 본문에 있는 HTTP-EQUIV 값을 읽어 들여 특정한 동작도 이해할 수 있어야 한다.

**9.2.5 User-Agent 타겟팅**

웹 관리자들은 로봇들이 방문할 것을 알고 로봇들에게 맞는 응답을 줄 수 있도록 전략을 세워야 한다.

### 9.3 부적절하게 동작하는 로봇들

폭주하는 로봇, 사라진 URL, 길고 잘못된 URL, 호기심이 지나친 로봇, 동적 게이트웨이 접근

외부에 노출되지 않은 페이지에 접근하는 크롤러나 비용이 비싼 게이트웨이를 사용하는 크롤러를 막아야 한다.

### 9.4 로봇 차단하기

robots.txt 파일을 사용한다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952588/tlog/Untitled-0ba2c3a4-a161-4d57-b743-adb211fdc502_n8m7kp.png)

**9.4.1 로봇 차단 표준**

1996년에 만든 표준을 아직 사용한다고 한다. 

**9.4.2 웹 사이트와 robots.txt 파일들**

여기서 웹 마스터가 하나의 robots.txt 파일을 만들 책임이 있다고 한다. (이게 도메인당 만드는 것인지, 서브 도메인에도 각각만들수 있는지 궁금)

**9.4.3 robots.txt 파일 포맷**

    # this robots.txt file allows Slurp & Webcrawler to crawl
    # the public parts of our site, but no other robots...
    
    User-Agent: slurp
    User-Agent: webcrawler
    Disallow: /private
    
    User-Agent: *
    Disallow:

→ slurp, webcrawler 에게는 /private는 막힘, 모든 웹은 모든 공간을 허용

**9.4.4 그 외에 알아둘 점**

필요할 때 찾아보기로.

(내 gatsby 블로그에는 robots.txt 안만들어 놨는데, 괜찮나,,)

**9.4.5 robots.txt의 캐싱과 만료**

필요에 따라 캐싱한다. 매번 가져오는 것도 비효율이고 크롤러가 HTTP/1.1도 아니라 캐시 지시자도 이해 못 할 수도. 어쨋든 Cache-Control, Exprires 에 적당한 주기를 적자. (7일도 길다고 한다.)

**9.4.6 로봇 차단 펄 코드**

펄 코드는 안 봄. 

**9.4.7 HTML 로봇 제어 META 태그**

`<meta name="robots" content=drirective-list>` 이런 값을 HTML 헤드에서 본적이 있을 것이다. 이것이 HTML 문서 내에서 로봇들이 읽어서 처리하는 메타 값이라 한다.

NOINDEX - 이 페이지를 처리 하지마라

NOFOLLOW - 이 페이지의 링크 페이지를 크롤링 하지마라

INDEX, FOLLOW 가 위에 반대되는 개념이고

NOARCHIVE - 이 페이지를 캐시하지 마라

ALL - INDEX + FOLLOW

NONE - NOINDEX + NOFOLLOW

검색엔진 Meta 태그에 대한 내용은 생략. 매우 중요하지만 다른 곳에서도 많이 다루니까,,

description, keywords는 익숙하고,,

revisit-after - 며칠 뒤에 데이터가 변경될 것이니 몇 일 뒤 다시 방문 하라고 알려주는 것

**9.5 로봇 에티켓**

1993년 웹 로봇 커뮤니티 개척자 마틴 코스터의 가이드 라인

[https://www.robotstxt.org/](https://www.robotstxt.org/) 참고

### 9.6 검색엔진

**9.6.1 넓게 생각하라.**

웹 전체를 크롤링하는 것은 쉽지 않은 도전이다. 복잡한 크롤러를 여러개 사용해야 한다.

**9.6.2 현대적인 검색엔진의 아키텍쳐**

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952595/tlog/Untitled-8903fa8a-c3b7-477c-8c6d-cee067dd7f1c_ceum1l.png)

'full-text indexes'라고 하는 복잡한 로컬 데이터베이스에 크롤링하는 데이터를 쌓는다. 그러나 웹 사이트는 오늘도 내일도 변하기 때문에 기껏해야 특정 순간의 스냅샷에 불과하다.

**9.6.3 full-text indexes**

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952595/tlog/Untitled-310dd87d-49ff-4ed5-b180-8c05577e85b8_cqwv3b.png)

**9.6.4 질의 보내기**

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952597/tlog/Untitled-a0e7f4c0-e5cf-40d2-b3f7-cbbac75e21b4_bb3pq7.png)

검색 엔진에서 검색하면 검색 엔진 데이터베이스에서 찾아서 문서를 주겠지 아니면 직접 주소를 링크할 수도 있고.

**9.6.5 검색 결과를 정렬하고 보여주기**

검색 결과에는 적으면 몇개 많으면 수백개 수천개가 보일 수 있다. 사용자가 검색한 결과에 가장 적절한 결과를 보여줘야 하기 때문에 크롤러가 해당 페이지에 대한 설명(meta 태그에 description)을 정확히 이해하기 위해 자세히 적어야 한다.

**9.6.6 스푸핑**

가짜 페이지가 크롤러를 더 잘 속이고, 이에 따라 크롤러도 진화하는 끊없는 싸움을 스푸핑이라 하는 듯 하다.