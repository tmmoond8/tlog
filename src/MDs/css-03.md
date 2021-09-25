---
title: CSS 3. display, visibility, opacity
date: '2020-04-01T08:56:56.243Z'
description: 보여지는 속성 정리
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952589/tlog/cover/css-cover_eiiwob.jpg'
tags:
  - CSS
---


[CSS3 Display | PoiemaWeb](https://poiemaweb.com/css3-display)

## display 프로퍼티

---

css 에서 display 프로퍼티는 가장 중요한 속성이라고 할 수 있다. 이렇게 말 할 수 있는 근거는 css에서 렌더링을 결정할 때 display 속성에 의해 크게 좌우되기 때문이다.

display가 가질 수 있는 속성은 block, inline, inline-block table, flex , grid, none 등을 가질 수 있지만, 이번 시간에는 대표적이고 고전적인 block, inline을 먼저 살펴보려 한다.

display 속성은 상속하지 않는다고 한다. 상속하는 속성에는 어떤게 있고, 상속하지 않는 속성들은 어떤게 있을까??

### block

- block 엘리먼트가 등장하면 항상 새로운 라인이 시작한다.
- 부모의 width 전체를 차지한다. (width를 부모의 width보다 적게 주어도 나머지 공간은 비운다. 다만, 공간적으로는 부모의 width를 전부 차지 한다.)
- block 레벨 요소 예

  div, h1 ~ h6, p, ol, ul, li, hr, table

block 에 대한 이해를 하기 위해서는

### Inline

- content의 너비만큼 가로폭을 차지 한다.
- width, height, margin-top, margin-bottom, padding-top, padding-bottom 프로퍼티를 사용할 수 없다.
- inline 레벨 사이 정의하지 않은 4px 여백이 기본적으로 생긴다.
- inline 요소가 하나라도 생성되면 가상의 라인 박스 공간이 생긴다.
- inline 요소 안에 block 요소가 있다면, 그 즉시 새로운 block 공간이 부모의 영역을 벗어나 생겨버린다.
- `<span><div></div></span>`
- `<span>a</span>`
- inline 레벨 요소 예

  span, a, strong, img, br, input, select, textarea, button

## Positioning Schemes

---

CSS 2.1 버전에서는 3가지 positioning schemes에 따라 박스의 레이아웃이 결정된다.

1. Normal flow: block 요소들은 block formatting context에 의해, inline 요소들은 inline formatting context에 의해 레이아웃이 결정된다. 이후에 block, inline 모두 relative positioning에 추가적인 렌더링이 존재.
2. Floats: float이 적용된 요소는 normal flow로 부터 빠져나와 텍스트 및 인라인 요소들이 자신보다 좌 또는 우로 배치되도록 한다.
3. Absolute positioning: absolute positioning 모델은 특정 기준에 따라 블록의 위치를 새롭게 할당해준다.

## LIne box

---

inline 요소들을 연속적으로 나열하면 아래와 같이 위에서 부터 쌓이게 된다. 만약 세로 정렬을 중앙으로 하고 싶으면 어떻게 해야 할까?

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952581/tlog/_2020-02-23__6.59.41_qwcuqo.png)

vertical-align 속성을 사용하여 중앙으로 정렬할 수 있다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952581/tlog/_2020-02-23__7.04.36_pcloyo.png)

모두 중앙으로 정렬을 할 때, 중앙이라고 판단해야 할 기준이 있을 것이다. vertical-align에서 받을 수 있는 속성은 baseline, bottom, initial, middle, sub, super, text-bottom, text-top, top, unset 등이 있다. 이러한 값들이 적용되게 하려면 어떤 명확한 기준이 필요할 것이다.
이 기준이 line-box다. inline 요소가 존재하면 바로 line-box 모델이 inline 요소를 감싸게 된다. line-box는 가상의 엘리먼트로 DOM에는 표현이 되지 않지만, layout을 할 때 기준이 되기 때문에 명확히 존재한다.

이 존재를 [strut](https://www.notion.so/taem/f1d31f222ce546de9eb8738492b23cca?v=230be68083714813914e7590a048315b)이라고 하는데, w3c 의 명세에는 다음과 같이 묘사하고 있다.

> 컨텐츠가 inline-level 요소로 구성된 블록 컨테이너 요소에서 'line-height'는 line box의 최소 높이를 지정합니다. 최소 높이는 baseline 위의 최소 높이와 그 아래의 최소 깊이로 구성되며, 각 line box들의 시작이 font/line-height 속성을 가지고 width 0인 inline box인 것과 같습니다. 우리는 이 가상의 박스를 "strut"라고 부릅니다.

이 strut의 높이는 포함하는 inline 요소 중 가장 height 높은 값을 기본으로 하거나, 또는 line-height로 명시한 값이 된다.

vertical-align에 다양한 속성이 온다고 했지만, 그 내용을 여기서 다루기에는 너무나도 방대하기에 링크로 대체 한다. (나도 공부를 해야한다.)

[(번역) CSS에 대한 깊은 이해: 폰트 매트릭스, line-height와 vertical-align](https://wit.nts-corp.com/2017/09/25/4903)

## Visibility

---

visibility는 요소가 보일지 말지를 정의한다.

- visible : 해당 요소를 보이게 한다.
- hidden : 해당 요소를 보이지 않게 한다.
- collapse : table 요소에 사용하며 행이나 열을 보이지 않게 한다.
- none : table 요소의 row나 column을 보이지 않게 한다.

display : none 과 visibility : hidden 의 차이점.

visibility 는 공간이 존재하고 보이지만 않는 것이라면, display : none은 공간도 존재 하지 않는다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952586/tlog/_2020-02-23__11.39.34_ga13zr.png)

## Opacity

---

요소의 투명도를 정의하며, 0.0 ~ 1.0의 값의 범위를 갖는다. 0.0은 투명, 1.0은 불투명이다.

opacity 요소는 자식 요소들에게도 영향을 미치게 된다.

```jsx
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    div {
      opacity: 0.5;
      background-color: red;
    }
    p {
      opacity: 1;
      background-color: blue;
    }
    h5 {
      background-color: blue;
    }
  </style>
</head>
<body>
  <div>
    dddd
    <p>abc</p>
    <span>sssss</span>
    <span>gggggg</span>
  </div>
  <h5>fdsfdf</h5>
</body>
</html>
```

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952581/tlog/_2020-02-23__11.53.06_ixflsb.png)

만약 자손에게 영향을 주지 않고 투명도를 사용하고 싶다면 rgba(0,0,0, 0.5) 식으로 주면 된다.

## References

---

[(HTML/CSS) Vertical-Align(1) - Line Box](https://devblog.croquis.com/ko/2019-04-29-1-vertical-align-line-box/)

[(번역) CSS에 대한 깊은 이해: 폰트 매트릭스, line-height와 vertical-align](https://wit.nts-corp.com/2017/09/25/4903)
