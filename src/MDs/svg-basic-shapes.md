---
title: SVG Basic Shapes
date: '2019-11-09T08:56:56.243Z'
description: SVG의 기본 도형들
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952585/tlog/cover/svg_cg9i2d.png'
tags:
  - SVG
---
# 

[기본 도형](https://developer.mozilla.org/ko/docs/Web/SVG/Tutorial/%EA%B8%B0%EB%B3%B8_%EB%8F%84%ED%98%95)

SVG에서는 대표적인 도형을 그리기 위한 특별한 태그들이 존재한다.

    <html>
    
    <head></head>
    
    <body>
      <a href="https://developer.mozilla.org/ko/docs/Web/SVG/Tutorial/Introduction">
        <h2>MDN Tutorial Introduction</h2>
      </a>
      <svg version="1.1" baseProfile="full" width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="red" />
        <circle cx="150" cy="100" r="80" fill="green" />
        <text x="150" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text>
      </svg>
      <svg width="200" height="250" version="1.1" xmlns="http://www.w3.org/2000/svg">
    
        <rect x="10" y="10" width="30" height="30" stroke="black" fill="transparent" stroke-width="5" />
        <rect x="60" y="10" rx="50" ry="10" width="30" height="30" stroke="black" fill="transparent" stroke-width=1 />
    
        <circle cx="25" cy="75" r="20" stroke="red" fill="transparent" stroke-width="5" />
        <ellipse cx="75" cy="75" rx="20" ry="5" stroke="red" fill="transparent" stroke-width="5" />
    
        <line x1="10" x2="50" y1="110" y2="150" stroke="orange" stroke-width="5" />
        <polyline points="60 110 65 120 70 115 75 130 80 125 85 140
                          90 135 95 150 100 145" stroke="orange" fill="transparent" stroke-width="5" />
        <polygon points="25 160 30 180 45 180 35 190 40 205 25 195
                            10 205 15 190 5 180 20 180" stroke="green" fill="blue" stroke-width="5" />
        <polygon points="75 170 90 195.98 60 195.98" stroke="green" fill="blue" stroke-width="5" />
        <polygon points="75 205.98 90 180 60 180" stroke="green" fill="blue" stroke-width="5" />
        <path d="M20,230 Q40,205 50,230 T90,230" fill="none" stroke="blue" stroke-width="5" />
      </svg>
    </body>
    
    </html>

### Rectangles

- **x:** 사각형의 좌측 상단의 x 값을 의미한다.
- **y:** 사각형의 좌측 상단의 y 값을 의미한다.
- **width:** 사각형의 폭을 나타낸다.
- **height:** 사각형의 높이를 나타낸다.
- **rx:** 사각형의 둥근 꼭짓점의 x 방향으로의 반지름이다. (생략 가능)
- **ry:** 사각형의 둥근 꼭짓점의 y 방향으로의 반지름이다. (생략 가능)

### Circle

- **r:** 원의 반지름을 의미한다.
- **cx:** 원의 중심 중 x 값을 의미한다.
- **cy:** 원의 중심 중 y 값을 의미한다.

### Ellipse

- **rx:** 타원의 x 방향으로의 반지름의 길이를 의미한다.
- **ry:** 타원의 y 방향으로의 반지름의 길이를 의미한다.
- **cx:** 타원의 중심 중 x 값을 의미한다.
- **cy:** 타원의 중심 중 y 값을 의미한다.

### Line

- **x1:** 점 1의 x 값이다.
- **y1:** 점 1의 y 값이다.
- **x2:** 점 2의 x 값이다.
- **y2:** 점 2의 y 값이다.

### Polyline

- **points:** 포인트들의 목록, 각 숫자는 공백, 쉼표, EOL 또는 줄 바꿈 문자로 구분된다. 각 포인트는 반드시 x 좌표와 y 좌표를 가지고 있어야 한다. 따라서 포인트 목록 (0,0), (1,1) 및 (2,2)는 "0 0, 1 1, 2 2"라고 쓸 수 있다.

### Polygon

- **points:** 포인트들의 목록, 각 숫자는 공백, 쉼표, EOL 또는 줄 바꿈 문자로 구분된다. 각 포인트는 반드시 x 좌표와 y 좌표를 가지고 있어야 한다. 따라서 포인트 목록 (0,0), (1,1) 및 (2,2)는 "0 0, 1 1, 2 2"라고 쓸 수 있다. 그러면 (2,2)에서 (0,0)으로 최종 직선이 그려져서 다각형이 완성된다.

### Path

- **d: 포인트들의 목록과 어떻게 그릴지에 대한 정보. [Paths](https://developer.mozilla.org/ko/docs/Web/SVG/Tutorial/Paths)에 대해 더 자세한 정보는 따로 다룬다.**