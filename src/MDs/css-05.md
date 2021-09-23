---
title: CSS 5. font & text
date: '2020-06-10T08:56:56.243Z'
description: font와 text
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952589/tlog/cover/css-cover_eiiwob.jpg'
tags:
  - CSS
---

#

[CSS3 Font & Text | PoiemaWeb](https://poiemaweb.com/css3-font-text)

## font-family

---

font-family는 device마다 font의 존재 유무가 다르고, 존재하지 않는 폰트로 지정했다고 해서 알아서 default 로 표현되지 않기도 한다. 또는 부모의 기본 포트를 가르키지도 않는다. 대신, font-family 속성에 여러 폰트를 동시에 작성하는 대신 1순위, 2순위, 3순위 식으로 선택되게 된다.

### mac 의 generic-font

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952589/tlog/css-5-font_t0w5yt.png)

- font-family.html

  ```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      <style>
        .parent-font {
          font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
        }
        .not-existed-font {
          font-family: "세상에 존재하지 않은 폰트";
        }
        .serif {
          font-family: "Times New Roman", Times, serif;
        }
        .sans-serif {
          font-family: Arial, Helvetica, sans-serif;
        }
        .monospace {
          font-family: "Courier New", Courier, monospace;
        }
      </style>
    </head>
    <body>
      <div class="parent-font">
        abcddsa
        <p class="not-existed-font">sdfdsfsf</p>
      </div>
      <div>
        <h1>font-family</h1>
        <p class="serif">Times New Roman font.</p>
        <p class="sans-serif">Arial font.</p>
        <p class="monospace">Courier New font.</p>
      </div>
    </body>
  </html>
  ```

  ![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952581/tlog/_2020-03-18__11.29.20_hs9ozg.png)

## font Shorthand

---

```css
font: font-style(optional) font-variant(optional) font-weight(optional) font-size(
    mandatory
  )
  line-height(optional) font-family(mandatory);
```

## line-height

---

line-height는 기준이 무엇일까? 아래에는 16px라고 되어 있는데 저 16px는 무엇이 기준일까?

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .small {
        line-height: 70%; /* 16px * 70% */
      }
      .big {
        line-height: 1.2; /* 16px * 1.2 */
      }
      .lh-3x {
        line-height: 3; /* 16px * 3 */
      }
    </style>
  </head>
  <body>
    <p>
      default line-height.<br />
      default line-height.<br />
      대부분 브라우저의 default line height는 약 110% ~ 120%.<br />
    </p>

    <p class="small">
      line-height: 70%<br />
      line-height: 70%<br />
    </p>

    <p class="big">
      line-height: 1.2<br />
      line-height: 1.2<br />
    </p>

    <p class="lh-3x">
      line-height: 3.0<br />
      line-height: 3.0<br />
    </p>
  </body>
</html>
```

## White-space

---

poiemaweb이 white-space 속성을 아주 잘 정리해놨다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952581/tlog/_2020-03-18__11.52.40_rhxkuh.png)

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952581/tlog/_2020-03-18__11.40.27_vr77zv.png)

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      div {
        width: 150px;
        height: 150px;
        padding: 10px;
        margin: 40px;
        border-radius: 6px;
        border-color: gray;
        border-style: dotted;
        /*overflow: hidden;*/
      }
      .normal {
        white-space: normal;
      }
      .nowrap {
        white-space: nowrap;
      }
      .pre {
        white-space: pre;
      }
      .pre-wrap {
        white-space: pre-wrap;
      }
      .pre-line {
        white-space: pre-line;
      }
      .overflow {
        overflow: hidden;
        text-overflow: ellipsis;
      }
    </style>
  </head>
  <body>
    <h1>white-space</h1>
    <div class="normal">
      <h3>normal</h3>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
    </div>
    <div class="nowrap overflow">
      <h3>nowrap</h3>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
    </div>
    <div class="pre overflow">
      <h3>pre</h3>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
    </div>
    <div class="pre-wrap">
      <h3>pre-wrap</h3>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
    </div>
    <div class="pre-line">
      <h3>pre-line</h3>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
    </div>
  </body>
</html>
```

## text-overflow

---

text-overflow 를 사용하기 위해선 다음의 조건을 따라야 한다.

- width 프로퍼티가 지정되어 있어야 한다. 이를 위해 필요할 경우 block 레벨 요소로 변경하여야 한다.
- 자동 줄바꿈을 방지하려면 white-space 프로퍼티를 nowrap, pre로 설정한다.
- overflow 프로퍼티에 반드시 “visible” 이외의 값이 지정되어 있어야 한다.

보통은 영역을 벗어난 텍스트에 대해 ...처리를 위함이지만, clip이 기본값으로 단순히 보이지 않게 자른다.

## word-wrap & word-break

---

word-wrap과 word-break 두 속성 모두 한 단어의 길이가 길어서 부모 영역을 벗어날 때 텍스트 처리 방식을 정의한다. 그래도 차이점은 존재하는데, word-wrap은 단어를 고려해서 개행하지만, word-break는 단어를 고려하지 않고 부모 영역에 맞추어 강제로 개행 할 수 있다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952581/tlog/_2020-03-19__12.01.35_afzs9j.png)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      div {
        display: inline-block;
        width: 150px;
        height: 150px;
        padding: 10px;
        margin: 40px;
        border-radius: 6px;
        border-color: gray;
        border-style: dotted;
        vertical-align: top;
      }
      .word-wrap {
        word-wrap: break-word;
      }
      .word-break {
        word-break: break-all;
      }
      span {
        display: inline-block;
        font-size: 24px;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div>
      Floccinaucinihilipilification https://poiemaweb.com/css3-font-text
    </div>

    <div class="word-wrap">
      Floccinaucinihilipilification https://poiemaweb.com/css3-font-text
      <span>word-wrap</span>
    </div>

    <div class="word-break">
      Floccinaucinihilipilification https://poiemaweb.com/css3-font-text
      <span>word-break</span>
    </div>
  </body>
</html>
```
