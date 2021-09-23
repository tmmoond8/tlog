---
title: 17장 내용 협상과 트랜스코딩
date: '2019-11-11T08:56:56.243Z'
description: HTTP 완벽 가이드 17장 정리
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632186958/tlog/http-perfect-guide_am6yzc.png'
tags:
  - HTTP
  - CS
---

어떻게 여러 언어로 콘텐츠를 제공할 수 있을까?

배리언트(variant): 콘텐츠를 각기 다른 언어로 표현한 것

내용 협상 : 하나의 URL에서 어떤 배리언트를 사용자에게 제공할까?

### 17.1 내용 협상 기법

3가지가 존재, 클라이언트 주도, 서버 주도, 투명

### 17.2 클라이언트 주도 협상

클라이언트가 언어를 선택할 페이지를 제공

장점: 구현이 쉽다. 명확하게 선택할 수 있다.

단점: 의도한 콘텐츠를 접근하는 데 최소 두 번의 요청이 필요하다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952591/tlog/_2019-09-07__9.49.02_xs4s3o.png)

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952582/tlog/_2019-09-07__9.49.40_dou6d1.png)

### 17.3 서버 주도 협상

클라이언트가 서버에게 선호하는 언어의 정보를 헤더를 통해 전달

- 내용 협상 헤더 (Accept 관련 헤더)
- User-Agent

**17.3.1 내용 협상 헤더**

**17.3.2 내용 협상 헤더의 폼질값**

    Accept: [ text/html, application/json, image/* ... ]
    Accept-Language: fr-CH, fr;q=0.9, en;q=0.8 de;q=0.7, *;q=0.5
    Accept-Charset: utf-8, iso-8859-1;q=0.5, *;q=0.1
    Accept-Encoding: br;q=1.0, gzip;q=0.8, *;q=0.1

**17.3.3 그 외의 헤더들에 의해 결정**

User-Agent를 보고 오래된 시스템이면 별도의 처리가 필요할 수 있다.

**17.3.4 아파치의 내용 협상**

아래의 type-map 파일을 통해 적절한 문서를 내려준다.

    URI: test.html
    
    URI: test.en.html
    Content-Type: text/html
    Content-Language: en
    
    URI: test.ko.html
    Content-Type: text/html; charset=utf-8
    Content-Language: ko, en

**17.3.5 서버 측 확장**

### 17.4 투명한 협상

서버 주도 협상을 좀 더 확장해보면, 서버측에서 내용 협상 헤더를 통해 특정 배리언트를 응답으로 내려주었을 것이다. 그런데 캐시 서버 입장에서는 특정 URL에 응답만 가억할 것이다. 이 때 다른 내용 협상 헤더를 가지고 같은 URL로 요청을 하면 캐시 서버는 엉뚱한 언어의 응답을 내려줄 수 있다.

 HTTP/1.1 명세에 투명 협상에 대한 메카니즘을 정의하지 않았지만, 캐시에 관한 Vary 헤더를 정의했다. 서버에서 User-Agent와 Accept-Language를 참조하여 응답을 내려줬다면, 응답에 다음처럼 Vary 헤더에 추가하는 것이다.

    Vary: User-Agent, Accept-Language

그러면 다음에 같은 URL로 요청이 왔을 때 User-Agent와 Aceept-Laguage가 일치할 때만 캐시된 응답을 내려주게 된다.

### 17.5 트랜스코딩

HTML → WML

고해상도 이미지 → 저해상도 이미지

64K색 이미지 → 흑백 이미지

프레임이 복잡한 페이지 → 단순히 텍스트만 가진 페이지

광고가 있는 페이지 → 광고가 없는 페이지