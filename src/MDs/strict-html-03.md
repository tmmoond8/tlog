---
title: HTML의 개요 이해하기
date: '2021-12-04T08:56:56.243Z'
description: 섹셔닝 콘텐츠와 헤딩의 적절한 작성 방법을 이해하여 HTML의 개요를 정확히 작성하는 방법을 알아보자.
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1636033473/tlog/cover/%E1%84%92%E1%85%AA%E1%86%AF%E1%84%89%E1%85%A5%E1%86%BC%E1%84%92%E1%85%AA%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5_r9ymiw.png'
tags:
  - HTML
---

> 섹셔닝 콘텐츠와 헤딩의 적절한 작성 방법을 이해하여 HTML의 개요를 정확히 작성하는 방법을 알아보자.

## HTML의 개요란 ?

---

HTML의 개요를 `Table Of Contents` 라고 하여 `TOC`로 흔히 부르는 것 같다.

아웃라인이라고도 불리는 `TOC`는 HTML 문서가 어떤 내용을 다루는 지를 간단하게 요약한 내용이다. 우리가 책을 구매할 때 목차를 보고 책에서 어떤 내용을 다루는지, 우리가 궁금한 내용이 있는지를 한 번에 알 수 있다.

HTML의 개요도 이런 역할을 하는데, 우리가 검색 엔진에 입력한 내용이 HTML에서 다루고 있는지 알아보기 위한 중요한 기준이 된다.

HTML의 개요는 섹셔닝 콘텐츠와 헤딩을 얼마나 잘 작성하냐에 있다.

다음은 나의 블로그에 있는 특정 포스트인데 왼쪽은  헤딩이 잘 챙겨진 모습이다. 그런데 오른쪽은 h2 헤딩이 빠져있다. (몇몇 포스트를 나도 이렇게 작성하고 있었다. 이번 기회에 수정을 해봐야겠다.)

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1638668700/tlog/eowvrvhtoszp5docbwem.png)

<aside>
🍯 위 이미지 처럼 페이지의 HTML 개요을 한 눈에 볼 수 있는 Extension이 있다. [HeadingMap Extension](https://chrome.google.com/webstore/detail/headingsmap/flbjommegcjonpdmenkdiocclhjacmbi/related) 에서 설치하면 TOC를 바로 확인할 수 있다.

</aside>

## 어떻게 작성해야 할까?

---

### TOC를 구성하는 요소

Heading: 문서 개요를 형성하는 기본(필수) 요소 `h1`, `h2`, `h3`, `h4`, `h5`, `h6` 태그 들로 `h1`이 가장 상위, `h6`이 가장 하위의 컨텐츠다.

Sectioning Content: 컨텐츠의 구성에 따라 분류한 컨텐츠 영역이며, 헤딩으로 나눈 영역을 문맥적으로 설명하는데 도움을 준다.

- `<article>` 독립적으로 배포가능
- `<aside>` 페이지의 주요 내용이 아닌 연관 콘텐츠
- `<nav>` 사이트의 주된 탐색 메뉴
- `<section>` 주제별 나누거나 묶는 단위

### Heading과 Sectioning Contgent를 모두 사용하여 HTML을 작성하자.

아래의 예시처럼 헤딩 다음에 해당 영역을 Sectioning Content로 나타내자.

```html
<body>
  <h1>프론트엔드 개발자가 되는 법</h1>
  <article>
    <h2>html, css, js를 학습 한다.</h2>
    <section>
      <h3>html 학습하기</h3>
			<div>어쩌구 저쩌구</div>
    </section>
  </article>
</body>
```

### 암시적 섹셔닝

헤딩만 있고 섹셔닝 콘텐츠를 사용하지 않으면 암시적 섹셔닝이라고 한다. 가급적이면 섹셔닝 컨텐츠를 항상 사용하자. 그리고 섹셔닝 컨텐츠를 사용하는데 헤딩이 없으면 에러로 인식한다. HTML이 문서를 그리는데는 문제가 안되지만 이 부분은 꼭 챙기자.

### Sectioning Root (실무에서는 고려하지 않음)

현 브라우저에는 구현이 안되어 있다. 명세에는 있어서 소개해보면, `Sectioning Root`로 지정되어 있는 몇 개의  태그는 내부에 헤딩을 작성해도 전체 문서의 개요에는 포함이 되면 안된다는 내용이다. `blockquote` 는 `Sectioning Root`기 때문에 `h1` 태그를 하위에 작성해도 원래는 무시되어야 맞지만, 이미지를 보면  `h1` 태그로 인식하는 것을 보여 준다.

```html
<h1>프론트엔드 개발자가 되는 법</h1>
<h2>html, css, js를 학습 한다.</h2>
<blockquote>
  <h1>처음 부터 프레임워크 같은 것을 다루기만 집중하지 않는다.</h1>
</blockquote>
```

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1638668699/tlog/jsmiyzmsvg9nszv0sbfy.png)

이번 강의에서는 나조차도 크게 고려하지 않았던 섹셔닝에 대해서 공부했다. 다음에 작성할 때는 섹셔닝을 정확히 기입하도록 노력해보겠다.