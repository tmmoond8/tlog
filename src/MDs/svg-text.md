---
title: SVG Text
date: '2019-11-17T08:56:56.243Z'
description: SVG에서 텍스트 표현
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952585/tlog/cover/svg_cg9i2d.png'
tags:
  - SVG
---


```html
<text x="10" y="10">Hello World!</text>
<style>
  <![CDATA[
  text {
    font: bold 10px Verdana, Helvetica, Arial, sans-serif;
  }
  ]]>
</style>
```

텍스트에 대해 위 처럼 정의할 수 있고, font 설정도 할 수 있다.

## Setting font properties

---

CSS 에서 사용하는 font 관련 속성과 거의 유사한 속성을 사용할 수 있다: 
[font-family](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-family), 
[font-style](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-style), 
[font-weight](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-weight), 
[font-variant](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-variant), 
[font-stretch](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-stretch), 
[font-size](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-size), 
[font-size-adjust](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-size-adjust), 
[kerning](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/kerning), 
[letter-spacing](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/letter-spacing), 
[word-spacing](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/word-spacing) and 
[text-decoration](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-decoration).

### Text flow

---

css의 텍스트 정렬 처럼 `dominant-baseline` 속성으로 글자가 baseline을 기준으로 그려질지, middle을 기준으로 정렬될지를 정할 수 있다. (default는 baseline이다.)

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952579/tlog/_2019-10-22__8.27.39_oy9nvv.png)

위 그림은 (0, 20) 에서 빨간색 수평선이 시작되고, 같은 좌표에서 baseline으로 그린 텍스트가  Baseline이다. middle, hanging도 각각 같다.

```html
<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
  <path d="M0,20 L80,20 M0,50 L80,50 M0,80 L80,80" stroke="red" />

  <text dominant-baseline="baseline" x="0" y="20">Baseline</text>
  <text dominant-baseline="middle" x="0" y="50">Middle</text>
  <text dominant-baseline="hanging" x="0" y="80">Hanging</text>
</svg>
```

수직 뿐 아니라 수평도 유사하게 이해할 수 있다. text-anchor 속성으로 수평 텍스트 흐름을 적용할 수 있다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952579/tlog/_2019-10-22__8.39.05_x7lsq9.png)

```html
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <!-- Materialisation of anchors -->
  <path d="M60,15 L60,110 M30,40 L90,40 M30,75 L90,75 M30,110 L90,110" stroke="grey" />

  <!-- Anchors in action -->
  <text text-anchor="start" x="60" y="40">Start</text>
  <text text-anchor="middle" x="60" y="75">Middle</text>
  <text text-anchor="end" x="60" y="110">End</text>

  <!-- Materialisation of anchors -->
  <circle cx="60" cy="40" r="1" fill="red" />
  <circle cx="60" cy="75" r="1" fill="red" />
  <circle cx="60" cy="110" r="1" fill="red" />
</svg>
```

### tspan

---

html <span>처럼 텍스트를 분리하여 개별적으로 속성을 적용할 수 있다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952579/tlog/_2019-10-22__8.47.39_qft8pm.png)

```html
<svg width="350" height="60" xmlns="http://www.w3.org/2000/svg">
  <text id="text1">
    This is <tspan dx="-12" x="130" font-weight="bold" fill="red">bold and red</tspan>
  </text>

  <style>
    <![CDATA[
    #text1 {
      dominant-baseline: hanging;
      font: 28px Verdana, Helvetica, Arial, sans-serif;
    }
    ]]>
  </style>
</svg>
```

`<tspan>` 태그는 x, dx, y, dy, rotate, textLength 의 속성을 가진다.

### textPath

---

svg에서만 가능한 유일한 표현이라고 생각되는데, path를 정의하고 path에 따라서 텍스트를 넣을 수 있다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952579/tlog/_2019-10-22__8.50.08_obv5fx.png)

```html
<svg width="350" height="60" xmlns="http://www.w3.org/2000/svg">
  <path id="my_path" d="M 20,20 C 80,60 100,40 120,20" fill="transparent" />
  <text>
    <textPath xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#my_path">
      A curved text.
    </textPath>
  </text>
  </style>
</svg>
```

이게 매우 신박하다.