---
title: SVG Paths
date: '2019-11-17T08:56:56.243Z'
description: SVG의 곡선 (path)
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952585/tlog/cover/svg_cg9i2d.png'
tags:
  - SVG
---

[패스](https://developer.mozilla.org/ko/docs/Web/SVG/Tutorial/Paths)

`<path>` 엘리먼트는 SVG 기본 도형 중 가장 강력하면서도 다른 엘리먼트보다 복잡하다. 패스는 여러 개의 직선과 곡선을 합쳐서 복잡한 도형을 그릴 수 있게 해준다. 그러나 복잡한 패스를 XML  편집기에서 고치는 것은 권장할 만한 것은 아니다.

 패스는 d 속성 하나로 정의되는데, d 속성은 여러 개의 명령어와 그 파라미터들로 이루어진다. 예를들어 "M 10 10"은 Move To (10, 10)으로 해석된다. 또, 이동 관련해서는 "M 10 10"과 "m 10 10"은 다르게 동작하는데, 대문자는 M은 절대적 좌표를 참조하며, 소문자 m은 상대적 좌표를 참조한다. (모든 명령어가 두 가지가 존재한다.🖕)
```html
<path d="M10 10 H 90 V 90 H 10 L 10 10" fill="none" stroke="blue" stroke-width="5" />
<path d="M10 10 h 80 v 80 h -80 Z" fill="transparent" stroke="black"/>
```

## 선 명령어

---

### L x y (l dx dy)

일반적인 선 그리기 명령어

### H x (h dx)

가로 선 그리기

### V y (v dy)

세로 선 그리기

### Z (z)

'Z'라는 "Close Path(패스 닫기)" 명령어를 통해 쉽게 패스를 마무리할 수 있다. 이 명령어는 현 위치에서 시작점으로 직선을 그린다. 항상은 아니지만 패스의 끝에 자주 쓰인다. 대문자와 소문자 사이의 차이는 없다.

## 곡선 명령어

---

패스에서 부드러운 곡선을 그릴 수 있는 세 가지 명령어 중 두 가지는 '베지어 곡선'이며, 나머지 하나는 원의 부분인 '호'이다. 베지어 곡선의 수학적 [배경은 위키피디아 베지어 곡선](https://en.wikipedia.org/wiki/B%C3%A9zier_curve) 을 참조하자. 베지어 곡선의 종류는 무한하지만, 패스 엘리먼트는 C(Cubic), Q(Quadratic) 베지어 곡선만 포함한다.

### Q (Quadratic)

Q라고 불리는 2차 베지어 곡선이며, 하나의 제어점이 시작점과 끝점의 방향을 결정한다.

`Q x1 y1, x y (q dx1 dy1, dx dy)`
```html
<svg width="190" height="160" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 80 Q 95 10 180 80" stroke="black" fill="transparent"/>
</svg>
```

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952577/tlog/_2019-09-15__5.41.17_a4rv9d.png)

### C (Cubic)

C라고 불리는 3차 베지어 곡선이며, 제어점이 두 점이다. 

`C x1 y1, x2 y2, x y (c dx1 dy1, dx2 dy2, dx dy)`
```html
<svg width="190" height="160" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 10 C 20 20, 40 20, 50 10" stroke="black" fill="transparent"/>
  <path d="M70 10 C 70 20, 120 20, 120 10" stroke="black" fill="transparent"/>
  <path d="M130 10 C 120 20, 180 20, 170 10" stroke="black" fill="transparent"/>
  <path d="M10 60 C 20 80, 40 80, 50 60" stroke="black" fill="transparent"/>
  <path d="M70 60 C 70 80, 110 80, 110 60" stroke="black" fill="transparent"/>
  <path d="M130 60 C 120 80, 180 80, 170 60" stroke="black" fill="transparent"/>
  <path d="M10 110 C 20 140, 40 140, 50 110" stroke="black" fill="transparent"/>
  <path d="M70 110 C 70 140, 110 140, 110 110" stroke="black" fill="transparent"/>
  <path d="M130 110 C 120 140, 180 140, 170 110" stroke="black" fill="transparent"/>
</svg>
```

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952601/tlog/Untitled_bxjkrs.png)

### T

2차 베이지 곡선 Q를 연결하는 단축 명령어로 T라고 부른다. 이 축약 명령어는 이전에 사용한 제어점으로부터 새로운 제어점을 자동으로 만들어 낸다.

`T x y (t dx dy)`
```html
<svg width="190" height="160" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 80 Q 95 10 180 80 T 350 80" stroke="black" fill="transparent"/>
</svg>
```

아래 예제를 보면 파란색선은 이전에 Q에서 사용한 제어점과 반대 방향으로 자동으로 제어점을 생성하여 곡선을 그린 것이다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952587/tlog/Untitled_1_yosetu.png)

### S

3차 베지어 곡선 명령어로 대칭성있는 곡선을 만들 때 사용한다. S 명령어는 C나 다른 S 다음에 오게 되면 이전에 사용했던 마지막 제어점의 반대 방향으로 첫 제어점으로 사용한다. 

`S x2 y2, x y (s dx2 dy2, dx dy)`

아래 그림을 보면 파랑색 선의 제어점이 대칭하는 형태로 생성된 것이다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952587/tlog/Untitled_2_o3vwuf.png)
```html
<svg width="190" height="160" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80" stroke="black" fill="transparent"/>
</svg>
```

### A (Arc)

A 명령어는 많은 파라미터를 받기 때문에 처음에 이해하는데 조금 어려웠다.

`A rx ry x축-회전각 큰-호-플래그 쓸기-방향-플래그 x y`

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952587/tlog/Untitled_3_zg3erj.png)
```html
<svg width="320" height="320" xmlns="http://www.w3.org/2000/svg">
<path d="M10 315
          L 110 215
          A 30 50 0 0 1 162.55 162.45
          L 172.55 152.45
          A 30 50 -45 0 1 215.1 109.9
          L 315 10" stroke="black" fill="green" stroke-width="2" fill-opacity="0.5"/>
</svg>
```

차근차근 이해해보자. 아래 그림처럼 사선으로 선을 그리는 형태다. 

전체적으로 직선이기 때문에 위에서 사용한 point 중 다음의 points들은 하나의 직선 위에 놓이게 된다.

(10, 315), (110, 215), (162.55, 162.45), (172.55, 152.45), (215.1, 109.9), (315, 10) 그리고 이 점들은 순서대로 아래 그름의 왼쪽 아래 점부터 오른쪽 위를 향한다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952577/tlog/_2019-09-15__6.36.43_w6efxs.png)

이제 타원을 집중해보자. 위 그림에는 두 개의 타원이 존재한다. 그 중 왼쪽 아래의 타원을 보면 직전의 좌표가 (110, 215) 이고 끝 점이 (162.55, 162.45)이다. 이 두 점을 지나고 x축 반지름이 30, y축 반지름이 50인 타원을 그리자. x축-회전각과 큰-호-플래그는 무시하고 쓸기-방향-플래그에 집중해보자. 이 값은 현재 0이지만, 1로 바꾸면 반대 방향으로 라인을 그리게 된다.

 오른쪽 타원도 왼쪽 타원과 크기가 같지만, x-축 회전각을 -45를 주어서 회전한 형태인 것을 확인할 수 있다.

이번에는 큰-호-플래그와 쓸기-방향을 좀 더 살펴보자. 같은 모양의 호를 정의 하고 큰-호-플래그와 쓸기-방향-플래그에 따라 다르게 그려지는 것을 확인할 수 있다.
```html
<svg width="325" height="325" xmlns="http://www.w3.org/2000/svg">
  <path d="M80 80
            A 45 45, 0, 0, 0, 125 125
            L 125 80 Z" fill="green"/>
  <path d="M230 80
            A 45 45, 0, 1, 0, 275 125
            L 275 80 Z" fill="red"/>
  <path d="M80 230
            A 45 45, 0, 0, 1, 125 275
            L 125 230 Z" fill="purple"/>
  <path d="M230 230
            A 45 45, 0, 1, 1, 275 275
            L 275 230 Z" fill="blue"/>
</svg>
```

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952588/tlog/Untitled_4_d6ioqv.png)

[https://codepen.io/lingtalfi/pen/yaLWJG](https://codepen.io/lingtalfi/pen/yaLWJG)