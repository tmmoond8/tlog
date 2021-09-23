---
title: 16장 국제화 
date: '2019-09-01T08:56:56.243Z'
description: HTTP 완벽 가이드 16장 정리
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632186958/tlog/http-perfect-guide_am6yzc.png'
tags:
  - HTTP
  - CS
---

웹을 이용하는 사용자는 다양한 언어로 문서를 작성한다. HTTP는 여러 언어와 문자로 된 국제 문서들의 처리 및 전송을 지원해야 한다.

 이 장에서 다룰 내용은 다음과 같다.

- HTTP가 어떻게 여러 언어 문자들의 체계 및 표준과 상호작용하는지 설명한다.
- HTTP 프로그래머가 올바르게 업무를 수행하는데 도움이 될 수 있도록 전문용어, 기술, 표준의 간략한 개요를 제공한다.
- 언어를 위한 표준 명명 체계와, 어떻게 표준화된 언어 태그가 선택한 콘텐츠를 서술하는지에 대해 설명한다.
- 국제화된 URI의 규칙과 주의사항을 개괄적으로 서술한다.
- 날짜와 그 외 다른 국제화 이슈에 대해 간단히 논의한다.

### 16.1 국제적인 콘텐츠를 다루기

HTTP에서 엔터티 분몬이란 그저 비트들로 가득 찬 상자에 불과 하다. 국제 콘텐츠를 지원하기 위해 서버는 클라이언트에게 각 문서의 문자와 언어를  Content-Type charset과 Content-Language 헤더를 통해 알려준다. 서버는 국제화를 위해 다양한 언어의 문서를 준비할 수 있다. 클라이언트는 요청을 보낼 때 어떤 언어의 문서를 원하는지 다음의 방식으로 알릴 수 있다.

    Accept-Language: fr, en;q=0.8
    Accept-Charset: iso-8859-1, utf-8

### 16.2 문자 집합과 HTTP

**16.2.1 차셋(Charset)은 글자를 비트로 변환하는 인코딩이다.**

charset의 예로는 us-ascii, ios-8859-1, euc-kr, utf-8 등이 있다. HTTP 메시지에서는 아래의 예처럼 헤더에 문서의 차셋을 표현한다.

    Content-Type: text/html; charset=iso-8859-6

**16.2.2 문자 집합과 인코딩은 어떻게 동작하는가**

인코딩은 두 단계에 걸쳐 일어난다. bits → character code → unique charater

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952594/tlog/Untitled-34dddff9-39a9-45b6-af81-5d956a90ed88_mh3fx2.png)

**16.2.3 잘못된 차셋은 잘못된 글자들을 낳는다.**

위 이미지에서 iso-8859-6 문자 체계에서 character code 가 225인 문자가 아래의 문자로 인코딩 되어 표현되는 것을 확인 했다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952595/tlog/Untitled-387cb6ad-d96a-4a33-8ba9-f692ef28d849_x1kr5m.png)

같은 225 character code가 또 따른 문자 체계에서는 다르게 보일 수 있다.

iso-8859-1

iso-8859-7

iso-8859-8

á

α

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952596/tlog/Untitled-797817fe-09cc-402b-9a6d-d73fc6ac5ae4_ggicqo.png)

**16.2.4 표준화된 MIME 차셋 값**

[Language Code Table](http://www.lingoes.net/en/translator/langcode.htm)

**16.2.6 Content-Type charset 헤더와 META 태그**

HTTP 메시지에 아래 처럼 MIME 차셋 태그를 헤더에 담아 보낸다.

    Content-Type: text/html; charset=iso-8859-6

만약 문자 집합이 명시적으로 나열되지 않았다면, 수신자는 문서의 콘텐츠를 통해 문자 집합을 추측하려 시도한다. HTML 문서에는 문자 집합을 나타내는 `<META HTTP_EQUIV="Content-TYpe">` 태그가 있다.

    ...
    <HEAD>
    	<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=iso-2022-jp">
    </HEAD>
    <BODY>
    ...

**16.2.6 Accept-Charset 헤더**

클라이언트는 자신이 처리할 수 있는 선호하는 방법을 요청한다. 다만, 서버가 모든 인코딩 방식을 지원하지 않기 때문에 요청한 방식을 고려해서 응답을 내려준다.

    Accept-Language: fr, en;q=0.8
    Accept-Charset: iso-8859-1, utf-8

### 16.3 다중언어 문자 인코딩에 대한 지침

**16.3.1 문자집합 용어**

글리프, 코딩된 문자, 코드 공간, 코드 너비, 사용 가능 문자집합, 코딩된 문자집합, 문자 인코딩 구조 등 용어 정리를 하지만 나는 관심 없어서..

**16.3.2 'Charset은 형편없는 이름이다.**

차셋(Chatset)은 문자 인코딩 구조와 코딩된 문자집합의 개념을 합친 것으로 RFC 2277에서 이용어가 언급 된다. RFC 2616에는 character set 이라는 용어를 사용하기도 한다.

???

**16.3.3 문자**

하나의 문자가 용도(수학기호, 구두점 등에 따라 다르게 표현된다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952594/tlog/Untitled-9fc4da8e-351a-4385-ac42-2a4e0f430d5f_zym1t0.png)

같은 글자가 위치에 따라 다르게 표기되기도 한다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952600/tlog/Untitled-e37b32ee-75c3-41ef-bf85-a64972f811cb_ftqq3p.png)

**16.3.4 글리프(glyphs), 연자(ligatures) 그리고 표현 형태**

f와 i 이 만날 때 i의 ' 이 사라지도록 표현하는데 fi 연자가 존재하면 사라지도록 표현하고 아니면 그냥 표현한다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952600/tlog/Untitled-eb3d9a3b-96da-4608-a1fe-a5f3cbef6687_l9yyzh.png)

**16.3.5 코딩된 문자집합(Coded Character Set)**

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952592/tlog/Untitled-5e7ea2dc-7345-4562-9d3b-a326bf40882e_kcjqtt.png)

ascii라 불리는 us-ascii, iso-8859 시리즈(iso-8859-1, iso-8859-2...)

**6.3.6 문자 인코딩 구조**

고정폭, 가변폭이 있는데 가변폭은 모달형과 비 모달형이 있다. iso-8859 시리즈는 8비트 고정폭을 사용한다. 가변폭(모달)의 

가변폭 (비모달) 예 UTF-8

**UTF(Universal character set Transformation Foramt)**

UTF-8은 전세계의 문자를 표현하는 가장 대표적인 문자 집합으로 비모달 가변길이 인코딩 방식이다. 최대 6바이트

57 → 00111001

245 → 11110101 → 11000011 10110101

536 → 1001111010001 → 11100001 10001111 10010001

**Unicode와 UTF-8**

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952577/tlog/_2019-08-31__5-f0c49959-19fd-4c5f-8bf8-9ec679cce872.46.57_hbbayc.png)

U+AC00 → 10101100 00000000  utf-8→ 11101010 10110000 10000000

**EUC-KR(Extended Unix Code-KR)**

KS X 1003: 0-127의 ascii 에 \만 원화로 바꾼 것
KS X 1001: 가 → b0a1, 갓 → b0ab

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952577/tlog/_2019-08-31__5-a5552e88-0c24-4f61-a586-2b73011245b5.32.25_swdioe.png)

갷은 ?? 어떻게 표현하지 ??

한글 채움 문자(fill code: 0xA4 OxD4)를 사용

(0xA4 OxD4) ㅈ ㅣ ㅂ → 집

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952577/tlog/_2019-08-31__6-330bf741-f105-4e1f-8a16-4a515e8e35d3.00.27_cqgq93.png)

[http://i18nl10n.com/korean/euckr.html](http://i18nl10n.com/korean/euckr.html)

### 16.4 언어 태그와 HTTP

한국은 ko-KR, 미국은 en-US

**16.4.1 Content-Language 헤더**

**16.4.2 Accept-Language 헤더**

**16.4.3 언어 태그의 종류**

[http://www.lingoes.net/en/translator/langcode.htm](http://www.lingoes.net/en/translator/langcode.htm)

**16.4.4 서브 태그**

**16.4.5 대소문자의 구분 및 표현** 

언어는 소문자, 국가는 대문자

**16.4.6 IANA 언어 태그 등록**

[http://xml.coverpages.org/TexinUsingLangID.html](http://xml.coverpages.org/TexinUsingLangID.html)

**16.4.7 첫 번째 서브태그: 이름 공간**

언어를 나태는 첫 번째 서브태그는 ISO 639 표준을 따르는 것이 일반적이다. 

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952577/tlog/_2019-08-31__6-61e6e60c-4bd2-4527-9c1c-e70ac0b88344.20.30_oqebaz.png)

16.4.8 두 번째 서브태그: 이름공간

두 번째 서브태그는 ISO 3166에 있는 국가 코드와 지역 표준 집합을 따른다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952577/tlog/_2019-08-31__6-405bac10-6923-461d-ac74-ab68b432bf27.23.03_ydb1xw.png)

16.4.9 나머지 서브태그: 이름공간

영어나 숫자인 것 외 별도의 규칙이 없다.

16.4.10 선호 언어 설정하기

브라우저에서 설정하자.

16.4.11 언어 태그 참조표

### 16.5 국제화된 URI

URI는 국제화를 그닥 지원하지 않음.