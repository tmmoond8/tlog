---
title: SVG Fills and Strokes
date: '2019-12-11T08:56:56.243Z'
description: SVG의 선과 채움
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952585/tlog/cover/svg_cg9i2d.png'
tags:
  - SVG
---
#

svg에서 도형을 색칠하는 것은 css와 유사하다.

    <svg>
    	<rect x="10" y="10" width="100" height="100" stroke="blue" fill="purple" fill-opacity="0.5" stroke-opacity="0.8" />
    </svg>

`fill-opacity` 처럼 투명도를 설정하는 별도의 속성도 있지만, 최신 브라우저에서는 색상에 rgba로 설정 할 수 도 있다.

## Strokes

---

### stroke-linecap

stroke에 대해서는 끝처리에 대해 세가지 옵션이 있다. default는 `butt` 다.

![](https://developer.mozilla.org/@api/deki/files/355/=SVG_Stroke_Linecap_Example.png)

    <svg width="160" height="170" xmlns="http://www.w3.org/2000/svg" version="1.1">
      <line x1="40" x2="120" y1="150" y2="150" stroke="black" stroke-width="20" />
      <line x1="40" x2="120" y1="20" y2="20" stroke="black" stroke-width="20" stroke-linecap="butt" />
      <line x1="40" x2="120" y1="60" y2="60" stroke="black" stroke-width="20" stroke-linecap="square" />
      <line x1="40" x2="120" y1="100" y2="100" stroke="black" stroke-width="20" stroke-linecap="round" />
    </svg>

### stroke-line

라인이 만나는 지점에서 어떻게 처리할 지에 대한 옵션이다. default 값은 `miter` 이다.

![](https://developer.mozilla.org/@api/deki/files/356/=SVG_Stroke_Linejoin_Example.png)

    <svg width="160" height="400" xmlns="http://www.w3.org/2000/svg" version="1.1">
      <polyline points="40 60 80 20 120 60" stroke="black" stroke-width="20" stroke-linecap="butt" fill="none"
          stroke-linejoin="miter" />
    
      <polyline points="40 140 80 100 120 140" stroke="black" stroke-width="20" stroke-linecap="round" fill="none"
          stroke-linejoin="round" />
    
      <polyline points="40 220 80 180 120 220" stroke="black" stroke-width="20" stroke-linecap="square" fill="none"
          stroke-linejoin="bevel" />
    
      <polyline points="40 340 80 300 120 340" stroke="black" stroke-width="20" stroke-linecap="square" fill="none" />
    </svg>

### stoke-dasharray

라인에 대한 대시 속성이다. 이걸 사용한다면 다양한 형태의 대시를 만들 수 있다. 속성 이름에서 알 수 있듯이 배열처럼 여러 값을 가지고 반복해서 그리게 된다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952577/tlog/_2019-09-23__9.55.34_pbt16m.png)

    <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg" version="1.1">
      <path d="M 10 75 Q 50 10 100 75 T 190 75" stroke="black"
        stroke-linecap="round" stroke-dasharray="5,10,5" fill="none"/>
      <path d="M 10 75 L 190 75" stroke="red"
        stroke-linecap="round" stroke-width="1" stroke-dasharray="5,5" fill="none"/>
    </svg>

### Using CSS

svg도 일반 태그 처럼 속성을 정의하고 사용할 수 있다. 보통의 css랑 동일 하지는 않지만, 유사한 형태를 제공한다. `<defs>`  에 속성을 정의하고 셀렉터를 통해 속성을 넣을 수 있다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952591/tlog/pathsvghover_vrhjt0.gif)

    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <style type="text/css">
            #MyRect:hover {
              stroke: black;
              fill: blue;
            }
          </style>
        </defs>
        <rect x="10" height="180" y="10" width="180" id="MyRect" />
      </svg>