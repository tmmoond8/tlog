---
title: SVG Gradients
date: '2020-01-02T08:56:56.243Z'
description: SVG의 Gradients
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952585/tlog/cover/svg_cg9i2d.png'
tags:
  - SVG
---
# 

[Gradients in SVG](https://developer.mozilla.org/ko/docs/Web/SVG/Tutorial/Gradients)

렌더링 시스템에서 채우기와 그라디언트는 굉장히 기본적인 채우기다. stroke, fill 모두에 그라디언트를 넣을 수 있다.

 그라이디언트는 선형, 원형 두 가지가 있다. 그리고 특이한 점은 그라디언트를 만들 때 id를 포함해야 사용할 때 참조할 수 있다.

## Linear Gradient

---

```jsx
<svg width="120" height="240" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradients">
      <stop offset="0%" stop-color="red" />
      <stop offset="50%" stop-color="black" stop-opacity="0" />
      <stop offset="100%" stop-color="blue" />
    </linearGradient>
  </defs>

  <rect x="10" y="120" rx="15" ry="15" width="100" height="100" fill="url(#gradients)" />
</svg>
```

위 코드를 보면, `<svg>` 안쪽에 `<defs>` 와 `<rect>` 가 있다. 먼저 <defs>의 안쪽을 보자. <linearGradient> 가 정의되어 있다. id가 Gradient1로 있고 안쪽에는 stop을 3개 갖는다. 그라디언트의 특징으로 컬러가 들어가는 포인트를 나타낸다. `stop-opacity` 을 활용하면 투명도 또한 표현할 수 있다.

그라디언트를 잘 모르겠다면, 온라인 편집기를 통해 이해를 하자. [https://www.colorzilla.com/gradient-editor/](https://www.colorzilla.com/gradient-editor/)

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952578/tlog/_2019-10-13__9.25.26_nquiqr.png)

위의 렌더링 결과

point를 늘려서 에쁜 무지개를 한 번 만들어보자.

```jsx
<svg width="240" height="240" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradients_rainbow">
      <stop offset="0%" stop-color="red" />
      <stop offset="15%" stop-color="orange" />
      <stop offset="30%" stop-color="yellow" />
      <stop offset="45%" stop-color="green" />
	    <stop offset="60%" stop-color="blue" />
      <stop offset="75%" stop-color="navy" />
      <stop offset="90%" stop-color="violet" />
    </linearGradient>
  </defs>

  <rect x="10" y="10" rx="15" ry="15" width="100" height="100" fill="url(#gradients_rainbow)" />
	<rect x="120" y="10" rx="15" ry="15" width="100" height="100" fill="white" stroke="url(#gradients_rainbow)"
      stroke-width="5" />
</svg>
```

7개의 stop 포인트로 무지개를 표현했다. 아래 무지개 그라디언트를 fill과 stroke에 넣었다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952578/tlog/_2019-10-13__9.25.36_nwh71s.png)

Linear gradients는 방향성을 가진다. 빨주노초파남보는 왼쪽에서 오른쪽순으로 색상이 들어간 것을 알 수 있다. 위에서는 방향성을 별도로 나타내지 않았지만 (x1, x2) → (y1, y2)로 방향성을 나타낸다. 아무런 값을 넣지 않으면 `<linearGradient x1="0" y1="0" x2="1" y2="0">`  로 default로 값을 가진다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952580/tlog/_2019-10-13__9.41.13_wjuint.png)

```jsx
<svg width="240" height="480" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gradients_0010" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="red" />
        <stop offset="50%" stop-color="black" stop-opacity="0" />
        <stop offset="100%" stop-color="blue" />
      </linearGradient>
      <linearGradient id="gradients_1000" x1="1" y1="0" x2="0" y2="0">
        <stop offset="0%" stop-color="red" />
        <stop offset="50%" stop-color="black" stop-opacity="0" />
        <stop offset="100%" stop-color="blue" />
      </linearGradient>
      <linearGradient id="gradients_0001" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="red" />
        <stop offset="50%" stop-color="black" stop-opacity="0" />
        <stop offset="100%" stop-color="blue" />
      </linearGradient>
      <linearGradient id="gradients_0100" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stop-color="red" />
        <stop offset="50%" stop-color="black" stop-opacity="0" />
        <stop offset="100%" stop-color="blue" />
      </linearGradient>
      <linearGradient id="gradients_1100" x1="1" y1="1" x2="0" y2="0">
        <stop offset="0%" stop-color="red" />
        <stop offset="50%" stop-color="black" stop-opacity="0" />
        <stop offset="100%" stop-color="blue" />
      </linearGradient>
      <linearGradient id="gradients_0110" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stop-color="red" />
        <stop offset="50%" stop-color="black" stop-opacity="0" />
        <stop offset="100%" stop-color="blue" />
      </linearGradient>
      <linearGradient id="gradients_1001" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="red" />
        <stop offset="50%" stop-color="black" stop-opacity="0" />
        <stop offset="100%" stop-color="blue" />
      </linearGradient>
      <linearGradient id="gradients_0011" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="red" />
        <stop offset="50%" stop-color="black" stop-opacity="0" />
        <stop offset="100%" stop-color="blue" />
      </linearGradient>
    </defs>

    <rect x="10" y="10" rx="15" ry="15" width="100" height="100" fill="url(#gradients_0010)" />
    <rect x="120" y="10" rx="15" ry="15" width="100" height="100" fill="url(#gradients_1000)" />
    <rect x="10" y="120" rx="15" ry="15" width="100" height="100" fill="url(#gradients_0001)" />
    <rect x="120" y="120" rx="15" ry="15" width="100" height="100" fill="url(#gradients_0100)" />
    <rect x="10" y="240" rx="15" ry="15" width="100" height="100" fill="url(#gradients_1100)" />
    <rect x="120" y="240" rx="15" ry="15" width="100" height="100" fill="url(#gradients_0110)" />
    <rect x="10" y="360" rx="15" ry="15" width="100" height="100" fill="url(#gradients_1001)" />
    <rect x="120" y="360" rx="15" ry="15" width="100" height="100" fill="url(#gradients_0011)" />
  </svg>
```

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952578/tlog/_2019-10-13__9.18.44_oghsmq.png)

## Radial Gradient

---

원형 그라디언트는 선형과 유사하다.

```jsx
<svg width="120" height="120" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="radial_gradients">
      <stop offset="0%" stop-color="red" />
      <stop offset="100%" stop-color="blue" />
    </radialGradient>
  </defs>

  <rect x="10" y="10" rx="15" ry="15" width="100" height="100" fill="url(#radial_gradients)" />

</svg>
```

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952578/tlog/_2019-10-13__9.48.36_tnfmfn.png)

<defs> 에 <radialGradient> 로 정의를 하고 마찬가지로 id를 가진다. 동일하게 여러개의 <stop> 을 가지고, 안쪽에서 바깥쪽순으로 색상이 적용된다.

원형 그라디언트의 크기를 다양하게 적용할 수 있다. 

```jsx
<radialGradient id="radial_gradients_smal" cx="0.25" cy="0.25" r="0.25">
```

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952578/tlog/_2019-10-13__11.02.45_pn1vjn.png)

원형 그라디언트도 선형 그디언트처럼 방향성을 가진다. focal point를 설정할 수 있다. (fx, fy)

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952578/tlog/_2019-10-13__11.08.45_dylzll.png)

```jsx
<svg width="240" height="240" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="radial_gradients_1" cx="0.5" cy="0.5" r="0.5" fx="0.25" fy="0.25">
        <stop offset="0%" stop-color="red" />
        <stop offset="100%" stop-color="blue" />
      </radialGradient>
      <radialGradient id="radial_gradients_2" cx="0.5" cy="0.5" r="0.5" fx="0.75" fy="0.25">
        <stop offset="0%" stop-color="red" />
        <stop offset="100%" stop-color="blue" />
      </radialGradient>
      <radialGradient id="radial_gradients_3" cx="0.5" cy="0.5" r="0.5" fx="0.25" fy="0.75">
        <stop offset="0%" stop-color="red" />
        <stop offset="100%" stop-color="blue" />
      </radialGradient>
      <radialGradient id="radial_gradients_4" cx="0.5" cy="0.5" r="0.5" fx="0.75" fy="0.75">
        <stop offset="0%" stop-color="red" />
        <stop offset="100%" stop-color="blue" />
      </radialGradient>
    </defs>

    <rect x="10" y="10" rx="15" ry="15" width="100" height="100" fill="url(#radial_gradients_1)" />
    <rect x="120" y="10" rx="15" ry="15" width="100" height="100" fill="url(#radial_gradients_2)" />
    <rect x="10" y="120" rx="15" ry="15" width="100" height="100" fill="url(#radial_gradients_3)" />
    <rect x="120" y="120" rx="15" ry="15" width="100" height="100" fill="url(#radial_gradients_4)" />

  </svg>
```

2019년 10월 현재에도 아이패드에서는 focal point 속성을 주면 제대로 그리지 못한다. 또 밑에서 다룰 speadMethod 또한 렌더링을 하지 못한다.

원형 그라디언트는 선형보다 더 다양한 속성을 가진다고 한다. spreadMethod란 속성을 가지는데, 이 또한 크롬이나 파이어폭스 외의 브라우저에서는 잘 표현하지 못하는 것 같다. 일단 이런게 있다 정도로 하고 넘어가는 것이 좋겠다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952578/tlog/_2019-10-13__11.22.12_is2tf5.png)

```jsx
<svg width="220" height="220" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="gradient_pad" cx="0.5" cy="0.5" r="0.4" fx="0.75" fy="0.75" spreadMethod="pad">
        <stop offset="0%" stop-color="red" />
        <stop offset="100%" stop-color="blue" />
      </radialGradient>
      <radialGradient id="gradient_repeat" cx="0.5" cy="0.5" r="0.4" fx="0.75" fy="0.75" spreadMethod="repeat">
        <stop offset="0%" stop-color="red" />
        <stop offset="100%" stop-color="blue" />
      </radialGradient>
      <radialGradient id="gradient_reflect" cx="0.5" cy="0.5" r="0.4" fx="0.75" fy="0.75" spreadMethod="reflect">
        <stop offset="0%" stop-color="red" />
        <stop offset="100%" stop-color="blue" />
      </radialGradient>
    </defs>

    <rect x="10" y="10" rx="15" ry="15" width="100" height="100" fill="url(#gradient_pad)" />
    <rect x="10" y="120" rx="15" ry="15" width="100" height="100" fill="url(#gradient_repeat)" />
    <rect x="120" y="120" rx="15" ry="15" width="100" height="100" fill="url(#gradient_reflect)" />

    <text x="15" y="30" fill="white" font-family="sans-serif" font-size="12pt">Pad</text>
    <text x="15" y="140" fill="white" font-family="sans-serif" font-size="12pt">Repeat</text>
    <text x="125" y="140" fill="white" font-family="sans-serif" font-size="12pt">Reflect</text>

  </svg>
```