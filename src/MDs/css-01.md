---
title: CSS 1. Selector
date: '2019-12-22T08:56:56.243Z'
description: CSS Selector를 공부해봅시다.
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952589/tlog/cover/css-cover_eiiwob.jpg'
tags:
  - CSS
---
# 


[CSS3 Selector | PoiemaWeb](https://poiemaweb.com/css3-selector)

[https://poiemaweb.com/css3-selector](https://poiemaweb.com/css3-selector)

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952589/tlog/css-selector_zn363z.png)

## 선택자 우선순위

---

이번에 선택자 우선순위를 살펴보면서 그동안 내가 심각하게 잘못 이해하고 있었다는 사실을 깨달았다.

선택자의 우선순위는 올림픽의 순위를 따지는 방법과 유사하다.

아래는 2016년도 브라질 리우 올림픽에서의 메달 순위이다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952580/tlog/_2020-02-16__2.41.27_vxrjmg.png)

우리나라는 금:9, 은:3, 동:9 로 합계 21개를 얻어 8등을 했다. 그리고 그 다음 이탈리아가 금:8, 은:12, 동:8 합계 28개로 9등을 했다.
 여기서 보면 합계가 이탈리아가 많고,  금은 하나 적지만 은메달의 경우 9개가 더 많다. 그럼에도 가장 우선적으로 따지는 것이 금이고, 동일한 수 일 때 은을 따진다. 만약 금도 은도 개수가 같다면 동메달을 따지게 된다.

금  → id 선택자

은 → class 선택자

동 → 태그 선택자

만약 금은동도 같다면 나중에 정의된 것이 우선순위.

a[title] 과 같이 속성 선택자는 class 하나 있는 것처럼 우선순위가 적용된다.

a:visited 와 같은 가상 클래스 선택자는 class 하나 있는 것처럼 우선순위가 적용된다.

!important 로 최우선 적용하는 것이 가능하다.

### 내가 잘못 알 고 있던 것

---

1. id 선택자를 먼저 쓴 것이 우선 순위가 높을 것이다.

    → 순서에 상관 없이 개수만 따진다.

        #parent .c-m {
          background-color: teal;
        }
        
        .z #m {
          background-color: tomato;
        }
        
         둘의 우선순위는 같다.

2. 자식 관계를 더 명확히 하면 우선순위가 높을 것이다.

→ 자식 자손 관계랑 상관 없기 개수만 따진다.

    #parent .c-m {}
    #parent > .c-m {}

## basic select

---

### select by tag

    ...
      <style>
        h1 { color: red; }
        p  { color: blue; }
      </style>
    ...
    <body>
      <h1>Hello World!</h1>
      <p>This paragraph is styled with CSS.</p>
    </body>
    ...

### select by id

    ...
      <style>
        #p1 { color: red; }
      </style>
    ...
    <body>
      <h1>Heading</h1>
      <div class="container">
        <p id="p1">paragraph 1</p>
        <p id="p2">paragraph 2</p>
      </div>
      <p>paragraph 3</p>
    </body>
    ..

### select by class name

    ...
      <style>
        .container { color: red; }
      </style>
    ...
    <body>
      <h1>Heading</h1>
      <div class="container">
        <p id="p1">paragraph 1</p>
        <p id="p2">paragraph 2</p>
      </div>
      <p>paragraph 3</p>
    </body>
    ...

### select by attribute

    ...
      <style>
        input[type="password"] {
    			color: red;
    		}
    		input[name] {
    			background: black;
    		}
      </style>
    ...
    <body>
      <input name="pw" type="password" />
      <input name="id" type="text" />
      <input name="age" type="number" />
    </body>
    ...

    ...
      <style>
        /* h1 요소 중에 title 어트리뷰트 값에 "first"를 단어로 포함하는 요소 */
        h1[title~="first"] { color: red; }
      </style>
    ...
    <body>
      <h1 title="heading first">Heading first</h1>
      <h1 title="hello first">Heading-first</h1>
      <h1 title="abc-first">Heading second</h1>
      <h1 title="heading second">Heading third</h1>
    </body>
    ...

    ...
      <style>
        /* p 요소 중에 lang 어트리뷰트 값이 "en"과 일치하거나 "en-"로 시작하는 요소 */
        p[lang|="en"] { color: red; }
      </style>
    ...
    <body>
      <p lang="en">Hello!</p>
      <p lang="en-us">Hi!</p>
      <p lang="en-gb">Ello!</p>
      <p lang="us">Hi!</p>
      <p lang="no">Hei!</p>
    </body>
    ...

    ...
      <style>
        /* a 요소 중에 href 어트리뷰트 값이 "https://"로 시작하는 요소 */
        a[href^="https://"] { color: red; }
      </style>
    ...
    <body>
      <a href="https://www.test.com">https://www.test.com</a><br>
      <a href="http://www.test.com">http://www.test.com</a>
    </body>
    ...

    ...
      <style>
        /* a 요소 중에 href 어트리뷰트 값이 ".png"로 끝나는 요소 */
        a[href$=".png"] { margin-top: 10px; }
      </style>
    ...
    <body>
      <img src="a.png"/>
      <img src="b.jpeg"/>
    </body>
    ...

    ...
      <style>
        /* div 요소 중에서 class 어트리뷰트 값에 "test"를 포함하는 요소 */
        div[class*="test"] { color: red; }
      </style>
    ...
    <body>
      <div class="first_test">The first div element.</div>
      <div class="second">The second div element.</div>
      <div class="test">The third div element.</div>
      <p class="test">This is some text in a paragraph.</p>
    </body>
    ...

자손 셀렉터

    ...
      <style>
        div p { color: red; }
      </style>
    </head>
    <body>
      <h1>Heading</h1>
    	<p>ppppp</p>
      <div>
        <p>paragraph 1</p>
        <p>paragraph 2</p>
        <span>span start <p>paragraph 3</p> span end</span>
      </div>
      <p>paragraph 4</p>
    </body>
    </html>

자식 셀렉터

    <!DOCTYPE html>
    <html>
    <head>
      <style>
        div > p { color: red; }
      </style>
    </head>
    <body>
      <h1>Heading</h1>
    	<p>ppppp</p>
      <div>
        <p>paragraph 1</p>
        <p>paragraph 2</p>
        <span>span start <p>paragraph 3</p> span end</span>
      </div>
      <p>paragraph 4</p>
    </body>
    </html>

인접 형제 셀렉터

    <!DOCTYPE html>
    <html>
    <head>
      <style>
        /* p 요소의 형제 요소 중에 p 요소 바로 뒤에 위치하는 ul 요소를 선택한다. */
        p + ul { color: red; }
      </style>
    </head>
    <body>
      <div>A div element.</div>
      <ul>
        <li>Coffee</li>
        <li>Tea</li>
        <li>Milk</li>
      </ul>
    
      <p>The first paragraph.</p>
      <ul>
        <li>Coffee</li>
        <li>Tea</li>
        <li>Milk</li>
      </ul>
    
      <h2>Another list</h2>
      <ul>
        <li>Coffee</li>
        <li>Tea</li>
        <li>Milk</li>
      </ul>
    </body>
    </html>

형제 셀렉터

    <!DOCTYPE html>
    <html>
    <head>
      <style>
        /* p 요소의 형제 요소 중에 p 요소 뒤에 위치하는 ul 요소를 모두 선택한다.*/
        p ~ ul { color: red; }
      </style>
    </head>
    <body>
      <div>A div element.</div>
      <ul>
        <li>Coffee</li>
        <li>Tea</li>
        <li>Milk</li>
      </ul>
    
      <p>The first paragraph.</p>
      <ul>
        <li>Coffee</li>
        <li>Tea</li>
        <li>Milk</li>
      </ul>
    
      <h2>Another list</h2>
      <ul>
        <li>Coffee</li>
        <li>Tea</li>
        <li>Milk</li>
      </ul>
    </body>
    </html>

가상 클래스 셀렉터

    <!DOCTYPE html>
    <html>
    <head>
      <style>
        /* a 요소가 hover 상태일 때 */
        a:hover { color: red; }
        /* input 요소가 focus 상태일 때 */
        input:focus { background-color: yellow; }
      </style>
    </head>
    <body>
      <a href="#">Hover me</a><br><br>
      <input type="text" placeholder="focus me">
    </body>
    </html>

가상 클래스 - 링크

    <!DOCTYPE html>
    <html>
    <head>
      <style>
        a:link {
          color: grey;
        }
        a:visited {
          color: greenyellow;
        }
      </style>
    </head>
    <body>
      <a href="https://abc.com">https://abc.com</a>
      <a href="https://bcd.com">https://bcd.com</a>
    </body>
    </html>

가상 클래스 - input

    <!DOCTYPE html>
    <html>
    <head>
      <style>
        input:disabled {
          border: 1px pink solid;
        }
        /* input 요소가 사용 가능한 상태일 때,
           input 요소 바로 뒤에 위치하는 인접 형제 span 요소를 선택 */
        input:enabled + span {
          color: blue;
        }
        /* input 요소가 사용 불가능한 상태일 때,
           input 요소 바로 뒤에 위치하는 인접 형제 span 요소를 선택 */
        input:disabled + span {
          color: gray;
          text-decoration: line-through;
        }
        /* input 요소가 체크 상태일 때,
           input 요소 바로 뒤에 위치하는 인접 형제 span 요소를 선택 */
        input:checked + span {
          color: red;
        }
      </style>
    </head>
    <body>
      <input type="text" >
      <input type="text" disabled>
      <input type="radio" checked="checked" value="male" name="gender"> <span>Male</span><br>
      <input type="radio" value="female" name="gender"> <span>Female</span><br>
      <input type="radio" value="neuter" name="gender" disabled> <span>Neuter</span><hr>
    
      <input type="checkbox" checked="checked" value="bicycle"> <span>I have a bicycle</span><br>
      <input type="checkbox" value="car"> <span>I have a car</span><br>
      <input type="checkbox" value="motorcycle" disabled> <span>I have a motorcycle</span>
    </body>
    </html>

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952580/tlog/_2020-02-16__1.13.16_zjwxwl.png)

구조 가상 클래스 셀렉터

    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <style>
        div:first-child {
          color: aqua;
        }
      </style>
    </head>
    <body>
      <div>
        AAAAA
        <div>aaaa</div>
        <div>bbbb</div>
        <div>cccc</div>
        <div>dddd</div>
      </div>
      <div>
        BBBBB
        <div>aaaa</div>
        <div>bbbb</div>
        <div>cccc</div>
        <div>dddd</div>
      </div>
    </body>
    </html>

    <!DOCTYPE html>
    <html>
    <head>
      <style>
        /* ol 요소의 자식 요소인 li 요소 중에서 짝수번째 요소만을 선택 */
        ol > li:nth-child(2n + 2)   { color: orange; }
        /* ol 요소의 자식 요소인 li 요소 중에서 홀수번째 요소만을 선택 */
        ol > li:nth-child(2n+1) { color: green; }
        /* 1, 3, 5, 7, 9, 11 ... */
    
        /* ol 요소의 자식 요소인 li 요소 중에서 4번째 요소 요소만을 선택 */
        ol > li:nth-child(4)    { background: brown; }
    
        /* ul 요소의 모든 자식 요소 중에서 뒤에서부터 시작하여 홀수번째 요소만을 선택 */
        ul > :nth-last-child(2n+1) { color: red; }
        /* ul 요소의 모든 자식 요소 중에서 뒤에서부터 시작하여 짝수번째 요소만을 선택 */
        ul > :nth-last-child(2n)   { color: blue; }
      </style>
    </head>
    <body>
      <ol>
        <li>Espresso</li>
        <li>Americano</li>
        <li>Caffe Latte</li>
        <li>Caffe Mocha</li>
        <li>Caramel Latte</li>
        <li>Cappuccino</li>
      </ol>
    
      <ul>
        <li>Espresso</li>
        <li>Americano</li>
        <li>Caffe Latte</li>
        <li>Caffe Mocha</li>
        <li>Caramel Latte</li>
        <li>Cappuccino</li>
      </ul>
    </body>
    </html>

    <!DOCTYPE html>
    <html>
    <head>
      <style>
        input[type="text"]:valid {
          background-color: greenyellow;
        }
    
        input[type="text"]:invalid {
          background-color: red;
        }
      </style>
    </head>
    <body>
      <label>입력값이 반드시 필요
        <input type="text" required>
      </label>
      <br>
      <label>특수문자를 포함하지 않는 4자리 문자 또는 숫자
        <input type="text" value="ab1!"
          pattern="[a-zA-Z0-9]{4}" required>
      </label>
      <br>
      <label>핸드폰 번호 형식
        <input type="text" value="010-1111-2222"
          pattern="^\d{3}-\d{3,4}-\d{4}$" required>
      </label>
    </body>
    </html>

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952580/tlog/_2020-02-16__1.27.12_ombxky.png)

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952579/tlog/_2020-02-15__3.57.43_cdxqxx.png)

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952579/tlog/_2020-02-15__4.01.12_jevnra.png)

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952579/tlog/_2020-02-15__4.02.30_e1x3yw.png)

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952580/tlog/_2020-02-15__4.20.54_sidbkt.png)

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952580/tlog/_2020-02-15__4.22.19_z5qu8k.png)

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952580/tlog/_2020-02-15__4.24.25_ysbfeg.png)

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952580/tlog/_2020-02-15__4.25.07_gw8jv3.png)

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952601/tlog/v-class_fp19g1.gif)

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952580/tlog/_2020-02-16__1.22.17_rtkpkh.png)

### References

---

[https://opentutorials.org/module/484/4149](https://opentutorials.org/module/484/4149)