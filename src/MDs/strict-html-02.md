---
title: 검색 엔진 밥상 차려주기
date: '2021-11-24T08:56:56.243Z'
description: HTML에 대한 메타정보를 어떻게 정의하며, 어떻게 하면 검색 엔진에 더 잘 노출되도록 하는 방법에 대해 알아보자.
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1636033473/tlog/cover/%E1%84%92%E1%85%AA%E1%86%AF%E1%84%89%E1%85%A5%E1%86%BC%E1%84%92%E1%85%AA%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5_r9ymiw.png'
tags:
  - HTML
---

> HTML에 대한 메타정보를 어떻게 정의하며, 어떻게 하면 검색 엔진에 더 잘 노출되도록 하는 방법에 대해 알아보자


# SEO에 영향을 주는 요인들

- Meta Description
- 검색 결과 페이지(SERP) 노출 대비 클릭율
- backlink: 다른 웹 페이지로부터 인용(링크)되는 횟수
- 도메인 권력(Domain authority): 검색 결과 페이지 순위 예측 점수
- 로딩 속도
- SSL 사용여부
- 콘텐츠 질, 양
- 사용자 경험

SEO는 크롬의 탑재된 `Lighthouse`를 사용하면 쉽게 점수를 낼 수 있음.

`크롬 개발자 도구` - `Lighthouse`

필자가 운영하는 블로그도 OG Tag와 `title`, `description` 만 잘 작성하여 어렵지 않게 100점을 받음

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1637712237/tlog/xmmgow9dpzu2jghqo9sl.png)

# Meta Description

---

문서에 렌더링되는 콘텐츠가 아니지만, 문서를 종류, 타입, 요약, 설명, 추가 동작 등의 정보를 나타내며, 보통 `<head>` 태그에 작성된다.

## 페이지 타이틀

페이지의 제목으로 SEO 엔진이 가장 중요하게 참조하는 데이터다. title 태그의 명세는 아래와 같다. Metadata Content에 속하며 페이지에 그려지지 않기 때문에 Flow Content에 속하지 않는다. 

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1637712237/tlog/w7bvut6ogw3olypib22a.png)

브라우저의 탭에 노출이 되어 사용자에게 현재 어떤 페이지가 열려 있는지 알 수 있게 한다. 단순하게 사이트의 제목만 노출하기 보다 아래 처럼 현재 페이지에 대한 카테고리를 같이 노출하게 하면 더욱 좋다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1637712237/tlog/dk9rx77brgqxrdzemmtj.png)

`JavaScript`로 동적으로 작성한 타이틀도 검색 엔진이 잘 긁어 간다고 한다. 하지만, OG Tag를 고려했을 때 서버 사이드 렌더링을 해주는 것이 가장 안전할 것 같다.

### 좋은 타이틀 작성하기

- 본문을 가장 잘 설명하는 키워드 중심
- 구체적이고 고유한 키워드
- 반복 되는 키워드는 최소화
- 구체적인 키워드를 앞에 배치
- 가능한 짧게

## Meta Description 정의

아래는 Meta Description을 정의한 일부이다.

```html
<html lang="ko">
<head>
	<meta charset="utf-8">
	<meta name="description" content="A description of the page">
	<meta name="viewport" content="width=device-width, inital-scale=1">
	<title>Page title - Site name</title>
</head>
</html>
```

- `lang="ko"` : 한글 컨텐츠로 되어 있는 사이트라면 ko로 두어야 한다. 만약 en으로 설정하면 브라우저에 따라 번역을 시도하는 경우가 발생할 수 있다. (특히 사파리)
- `charset="utf-8"`: 웹페이지가 작성된 인코딩 방식으로 utf-8이 사실상 표준
- `description` : 검색 엔진 혹은 공유 했을 때 설명으로 노출 됨
- `viewport` : 특히 모바일일 때 뷰포트를 디바이스의 width로 설정하여 디바이스 크기로 화면을 그리게끔
- `title` : 페이지 제목

### Google 검색 엔진

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1637712237/tlog/zd3xw1yawpyjh6mujmwb.png)

주황색 박스는 `metadata`로 지정한 `title`, `description`이 각각 노출 되는 것을 볼 수 있다. 그에 반해 노란색 박스는 html 안에서는 지정할 수 없는 검색 엔진의 알고리즘에 의해 생성된 영역이다.

### Naver 검색 엔진

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1637712237/tlog/lwvmaazitdweyiccxt9p.png)

네이버의 검색 엔진에서도 metadata를 기본으로 하는 주황 박스 정보가 있고, 아래 파란색 박스 영역은 네이버 웹마스터라는 사이트에서 연관 채널를 등록할 수 있다. JSON-LD 형식과 Microdata형색이 있다.

- JSON-LD 형식
    
    ```html
    <script type="application/ld+json">
    {
    	"@context": "http://schema.org",
    	"@type": "Person",
      "name": "My Site Name",
      "url": "http://www.mysite.com",
      "sameAs": [
        "https://www.facebook.com/myfacebook",
        "http://blog.naver.com/myblog",
        "http://storefarm.naver.com/mystore"
      ]
    }
    </script >
    ```
    

- Microdata 형식
    
    ```html
    <span itemscope="" itemtype="http://schema.org/Organization">
    <link itemprop="url" href="http://www.mysite.com">
    <a itemprop="sameAs" href="https://www.facebook.com/myfacebook"></a>
    <a itemprop="sameAs" href="http://blog.naver.com/myblog"></a>
    <a itemprop="sameAs" href="http://storefarm.naver.com/mystore"></a>
    </span>
    ```
    

## OpenGraph Tag

OG Tag는 공식적인 Meta Description이 아니지만, 마치 공식적인 방식으로 사용되며, 카카오톡 같은 메신져 또는 SNS 서비스에서 웹사이트에 대한 정보를 나타내는 카드로 노출하는데 사용된다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1637712238/tlog/sqg5w7enlklkisok2oin.png)

- facebook
    
    ```html
    <meta property="og:url" content="https://**.html">
    <meta property="og:title" content="...">
    <meta property="og:description" content="...">
    <meta property="og:image" content="https://**.jpg">
    ```
    
- Twitter
    
    ```html
    <meta name="twitter:card" content="sumary">
    <meta name="twitter:title" content="...">
    <meta name="twitter:description" content="...">
    <meta name="twitter:image" content="https://**.jpg">
    ```