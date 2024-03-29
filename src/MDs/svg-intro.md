---
title: SVG Intro
date: '2019-09-02T08:56:56.243Z'
description: MDN SVG를 따라해보았다 - 1
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952585/tlog/cover/svg_cg9i2d.png'
tags:
  - SVG
---

```html
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"/>
</svg>
```

내 목표는 위의 svg 를 보고 어떤 형태인지 해석할 수 있고, 변형할 수 있는 능력을 갖는 것이다.

SVG의 등장 배경이나 개념을 알고 싶다면 MDN에 SVG 소개로

[소개](https://developer.mozilla.org/ko/docs/Web/SVG/Tutorial/Introduction)

아래 SVG 시작하기로 SVG를 다뤄보도록 하자.

[시작하기](https://developer.mozilla.org/ko/docs/Web/SVG/Tutorial/%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0)

[위치](https://developer.mozilla.org/ko/docs/Web/SVG/Tutorial/%EC%9C%84%EC%B9%98)

위 예제를 분석하기 앞서 기본적인 간단한 예제부터 보자.
```html
<svg version="1.1"
      baseProfile="full"
      width="300" height="200"
      xmlns="http://www.w3.org/2000/svg">

  <rect width="100%" height="100%" fill="red" />
  <circle cx="150" cy="100" r="80" fill="green" />
  <text x="150" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text>
</svg>
```

1. `<svg>` 루트 요소부터 시작
    - Doctype 선언은 사용하지 않음
    - 유효성 검사를 위해 version, baseProfile을 사용
    - [xmlns(xml namespace)](https://developer.mozilla.org/en-US/docs/Web/SVG/Namespaces_Crash_Course), html도, svg도 같은 xml을 사용하지만 두 태그를 구분하기 위해 사용
2. 부모의 전체 영역을 100%로 채우는 `<rect/>` 
3. 가운데 80의 반지름을 갖는 원 `<circle/>` 
4. 텍스트를 그리는 `<text/>` 

### 기본 규칙

- svg 파일은 위에서 부터 아래로 렌더링 된다. 각 요소가 layer라고 한다면 아래에 위치 할수록 상단에 위치한 레이어다.
- 숫자도 쌍따옴표로 감싼다.
- `<svg/>` 태그로 표현될 수 있지만, object, iframe, img  태그등에 포함될 수 있다.
  ```html
  <object data="image.svg" type="image/svg+xml" />
  <iframe src="image.svg"></iframe>
  ```

### 파일 형식

기본적으로 xml 형태의 텍스트가 들어간 .svg 확장자다. 그러나 큰 크기의 svg 파일을 위해 gzip으로 압축 된 형태도 허용한다. 다만 일부 웹브라우저(Firefox)는 gzip으로 압축된 svg를 로드하지 못한다.

헤더에는 svg 파일 타입을 명시 해야 한다. 일반 svg하면

    Content-Type: image/svg+xml
    Vary: Accept-Encoding

gzip으로 압축된 svg라면 

    Content-Type: image/svg+xml
    Content-Encoding: gzip
    Vary: Accept-Encoding

### 그리드

컴퓨터에서 사용하는 좌표계로 대표적으로 SVG와 캔버스에서 사용하는 방식

수학의 좌표계와는 조금 차이가 있다. (y축의 부호가 반대)

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952595/tlog/Untitled-368c21ba-a532-4c0a-8d8f-1fd1471e339b_g6po2h.png)

### 픽셀이란?

다시 아래의 태그를 보자. 숫자가 입력되어 있지만 단위가 없다. 기본적으로 별도의 설정이 없다면 1은 1px로 매핑된다. 아래 예제는 100 x 100px로 정의된다.
```html
<svg width="100" height="100">
  <circle cx="50" cy="50" r="25" fill="green" />
</svg>
```

위에서 정의한 도형을 단순히 2배 키우려면 어떻게 할까?? 정말 간단하다.
```html
<svg width="200" height="200" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="25" fill="green" />
</svg>
```

width와 height를 200, 200각 각 주고, 내부요소 값들은 원본과 동일하게 유지한채 viewBox만 0 0 100 100 그러니까 100 x 100 기준으로 그린 것이다.

svg는 이렇게 효과적으로 크기를 확대할 수 있다. 또 스케일링 외에도 회전, 기울이기, 뒤집기도 가능하다.