---
title: SVG Pattern
date: '2020-05-23T08:56:56.243Z'
description: SVG의 Pattern
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952585/tlog/cover/svg_cg9i2d.png'
tags:
  - SVG
---

[패턴](https://developer.mozilla.org/ko/docs/Web/SVG/Tutorial/Patterns)

svg에서 정의한 여러 도형을 묶어서 패턴으로 정의하여 사용할 수 있다.

다음의 이미지를 보자.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952579/tlog/_2019-10-14__8.01.47_qqkstt.png)

패턴 예

단 번에 패턴을 파악할 수 있을 것이다. 패턴을 분리하면 하나의 하늘색 네모에 가운데를 중심으로 원이 있고, 왼쪽 상단에 투명한 네모가 있는 형태다. 원과 네모 모두 그라데이션을 사용한 것을 알 수 있다. 코드를 확인해보자.

```html
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="Gradient1">
      <stop offset="5%" stop-color="white" />
      <stop offset="95%" stop-color="blue" />
    </linearGradient>
    <linearGradient id="Gradient2" x1="0" x2="0" y1="0" y2="1">
      <stop offset="5%" stop-color="red" />
      <stop offset="95%" stop-color="orange" />
    </linearGradient>

    <pattern id="Pattern" x="0" y="0" width=".25" height=".25">
      <rect x="0" y="0" width="50" height="50" fill="skyblue" />
      <rect x="0" y="0" width="25" height="25" fill="url(#Gradient2)" />
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="url(#Gradient1)"
        fill-opacity="0.5"
      />
    </pattern>
  </defs>

  <rect fill="url(#Pattern)" stroke="black" width="200" height="200" />
</svg>
```

사용 형태는 gradient랑 크게 다르지 않다. <defs> 안에 패턴에 사용할 도형을 정의하고 아래에서는 <pattern>을 정의했다. <pattern> 의 속성으로 width와 height가 사용된 것을 볼 수 있다. ."25"는 전체의 25%로 이해하면 될 것같다.

MDN 에서는 <pattern>에 사용하는 속성을 소개하는데, patternUnits, patternContentUnits이 있다. 그런데 이 두 속성은 아래의 처럼 속성을 늘려서 채우냐 패턴을 더 넣어서 채우냐 인데, 크롬에서 제대로 동작하지 않는 것으로 보인다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952587/tlog/svg-pattern_ape9nv.png)
