---
title: JS 32. 이벤트
date: '2020-04-06T08:56:56.263Z'
description: 이벤트 루프
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632298243/tlog/cover/_____JS_1_jbq8ea.png'
tags:
  - JavaScript
---


[Event | PoiemaWeb](https://poiemaweb.com/js-event)

[event](https://tmmoond8.github.io/web-basic-study/event/)

자바스크립트는 DOM 객체에 다양한 이벤트를 포함시킬 수 있다. 이벤트가 발생하면 핸들러가 이벤트에 대한 처리를 맡게 된다. 이벤트 핸들러는 일반적인 함수와 동일하지만 등록된 이벤트가 발생했을 때 실행된다.
이벤트를 등록하고 이벤트가 발생하면 이벤트 핸들러가 동작 하는 것은 브라우저가 알아서 해준다.

```jsx
<!DOCTYPE html>
<html>
<body>
  <button class="myButton">Click me!</button>
  <script>
    document.querySelector('.myButton').addEventListener('click', function () {
      alert('Clicked!');
    });
  </script>
</body>
</html>
```

### 2. 이벤트 루프(Event Loop)

---

이벤트 루프란 자바스크립트가 동시성을 제공하는 방식이다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952589/tlog/event-loop_fd1wpz.png)

[https://poiemaweb.com/js-event](https://poiemaweb.com/js-event)

Heap: 자바스크립트에서 사용하는 객체 인스턴스가 할당되는 영역 → 원시값?

Call Stack: 자바스크립트 엔진이 코드를 실행하는 Stack 공간

Event Queue: 비동기 함수의 콜백 함수, 이벤트 핸들러, Timer 함수의 콜백 함수 등이 실행할 수 있는 조건이 되었을 때 보관되는 영역.

Event Loop: Call Stack이 비어있다면, Event Queue에서 하나씩 꺼내 Call Stack으로 옮겨서 자바스크립트 엔진이 실행할 수 있게 한다. 이벤트 루프는 이 과정을 무한이 반복한다.

자바스크립트가 단일 스레드이며 하나의 Call Stack을 사용한다. ajax get을 호출 한다고 했을 때를 생각해보자. ajax로 get 메서드를 호출하고 비동기적으로 응답을 받아 처리해야 한다. 이 때, 응답을 줄 때까지 기다리지 않고 call stack에 있는 일을 처리 한다. 그리곤 아까 get으로 호출한 것에 대한 응답이 올 때, 이벤트 루프는 Event Queue에서 Call Stack으로 옮겨서 응답을 처리하도록 한다.

```jsx
function func1() {
  console.log("func1");
  func2();
}

function func2() {
  setTimeout(function() {
    console.log("func2");
  }, 0);

  func3();
}

function func3() {
  console.log("func3");
}

func1();
```

이벤트의 종류는 겁나 많다.. [Event reference](https://developer.mozilla.org/en-US/docs/Web/Events)

### 3.1 UI Event

---

아래는 window 객체에 넣으면 이벤트를 발생시킬 수 있다.

load : 웹 페이지 로드가 완료되었을 때.

unload: 웹페이지를 새로 고침 할 때, 그 외의 호출 되는 경우가 있을까?

error: 어떤 스크립트 오류가 발생했을 때

resize: 리사이즈 이벤트

scroll: 사용자가 스크롤 할 때

select: 텍스트를 선택했을 때인데, 이 이벤트는 몇가지 태그에 대해서만 동작 한다.

<input type="file">, <input type="password">, <input type="text">, and <textarea>

`window.onloadstart`, `window.onloadend` 는 없다. 얘네들은 리소스 요청 또는 XMLHttpRequest 요청을 할 때 사용하는 것으로 보인다.

[event window](https://tmmoond8.github.io/web-basic-study/event/event.window.html)

### 3.2 Keyboard Event

---

keydown: 키를 누르는 동안 발생

keyup: 키를 누르고 떼는 순간 발생

keypress: 키를 누르고 뗄 때 발생, deprecated. Meta, Alt, Arrow Key 등에서는 발생하지 않는다.

Deprecated
This feature is no longer recommended. Though some browsers might still support it, it may have already been removed from the relevant web standards, may be in the process of being dropped, or may only be kept for compatibility purposes. Avoid using it, and update existing code if possible; see the compatibility table at the bottom of this page to guide your decision. Be aware that this feature may cease to work at any time.

> The keypress event is fired when a key that produces a character value is pressed down. Examples of keys that produce a character value are alphabetic, numeric, and punctuation keys. Examples of keys that don't produce a character value are modifier keys such as Alt, Shift, Ctrl, or Meta.

[keyboard event](https://tmmoond8.github.io/web-basic-study/event/event.keyboard.html)

### 3.3 Mouse Event

---

onclick: 마우스를 눌럿다가 뗏을 때 발생

ondblclick: 마우스를 더블 클릭시 발생

onmousedown: 마우스를 누를 때 발생

onmouseup: 마우스를 눌렀다가 뗏을때 발생

onmousemove: 마우스를 이동할 때 발생

onmouseover: 마우스 포인트가 특정 엘리먼트의 영역으로 들어갈 때 발생

onmouseout: 마우스 포인트가 특정 엘리먼트의 영역을 벗어날 때 발생

[click event](https://tmmoond8.github.io/web-basic-study/event/event.mouse.html)

### 3.4 Focus Event

---

focust: input 엘리먼트가 선택되었을 때 발생

blur: input 엘리먼트가 선택되었다가 다른 요소가 선택될 때 발생

> focus 이벤트는 기본적으로 input Element에서만 동작하지만, tabindex를 속성으로 넣어주면 focus 이벤트를 받을 수 있게 된다.

[event focus](https://tmmoond8.github.io/web-basic-study/event/event.focus.html)

### 3.5 Form Event

---

input, change: oninput, onchange 이벤트는 input 태그나 select, textarea 등의 인풋 엘리먼트들의 입력이 되었을 때 발생한다. 또한 contenteditable 엘리먼트에 대해서도 두 개의 이벤트는 동작한다.

> - **w3schools -**
>   The difference is that the oninput event occurs immediately after the value of an element has changed, while onchange occurs when the element loses focus, after the content has been changed. The other difference is that the onchange event also works on <select> elements.

select, checkbox의 경우 oninput, onchange 사이의 동작의 차이가 없었지만, input에서 텍스트를 입력 받을 때는 조금 달랐다. oninput의 경우는 키를 입력하는 즉시 이벤트가 터졌고, onchange 이벤트는 blur될 때 그리고 값이 이전과 다른 값일 때 터졌다. 그리고 인풋 창에서 입력 하는 것이 아닌 script로 값을 변경하는 것으로는 이벤트가 발생하지 않았다.

form에 inline으로 onsubmit 속성으로 함수를 넣었을 때는 왜 안될까?

[event form](https://tmmoond8.github.io/web-basic-study/event/event.form.html)

### 3.6 Clipboard Event

---

Clipboard Event는 `execCommand API` 또는 `ClipboardAPI` 로 구현할 수 있지만, `ClipboardAPI` 는 대부분의 브라우저에서 지원하지 않는 스펙이기에 `execCommand API` 를 사용하여 구현을 해야 한다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952590/tlog/_2019-12-22__3.43.02_yfue7w.png)

```jsx
document.querySelector("#copy-btn").addEventListener("click", function() {
  document.querySelector("#input1").select();
  document.execCommand("copy");
});
```

clipboard event를 사용할 때도 조금 유의해야 할 것이 있다. safari에서 조금 다르게 처리를 해줘야 하기 때문이다.

```jsx
const handleCopy = (event) => {
  if (isIOS()) {
    const range = document.createRange();
    range.selectNodeContents(refCopyText.current);
    const selection = window.getSelection();
    selection!.removeAllRanges();
    selection!.addRange(range);
    refCopyText.current.setSelectionRange(0, 999999);
  } else {
    refCopyText.current.select();
  }
  document.execCommand('copy');
  toast.success(`${title} copied`)
  setCopyText('COPIED');
}
```

paste 이벤트는 어떻게 쓰지??

[event clipboard](https://tmmoond8.github.io/web-basic-study/event/event.clipboard.html)

## 이벤트를 등록하는 방식

---

1. inline으로 등록하는 방식

   ```jsx
   ...
     <button onclick="myHandler1();">Click me</button>
     <script>
       function myHandler1() {
         alert('myHandler1');
       }
       function myHandler2() {
         alert('myHandler2');
       }
     </script>
   ...
   ```

   추천하지 않는 방식이라고 한다.

   `this === window`

2. 속성으로 등록하는 방식

   ```jsx
   document.querySelector("#rec2").onclick = function() {
     console.log("onclick");
   };
   ```

   `this === document.querySelector('#rec2')`

3. addEventListener로 등록하는 방식

   ```jsx
   document.querySelector("#rec2").addEventListener("click", function() {
     console.log("add event 1");
   });

   document.querySelector("#rec2").addEventListener("click", function(e) {
     console.log("add event 2");
   });
   ```

   여러 이벤트를 등록할 수 있다.

   `this === document.querySelector('#rec2')`

PoiemaWeb에서는 addEventListener로 등록해야지 버블링, 캡쳐링 되는 것처럼 얘기 했지만, 위 모든 방식에서 버블링과 캡쳐링이 되는 것으로 보인다. 물론 캡쳐링은 addEventListener에서만 할 수 있을 것같다.

## 이벤트 버블링, 캡쳐링

---

이벤트 버블링 - 하위 엘리먼트에서 상위 엘리먼트로 이벤트가 전파되는 특성

![](https://joshua1988.github.io/images/posts/web/javascript/event/event-bubble.png)

```html
<body>
  <div class="one">
    <div class="two">
      <div class="three"></div>
    </div>
  </div>
</body>
<script>
  var divs = document.querySelectorAll("div");
  divs.forEach(function(div) {
    div.addEventListener("click", logEvent);
  });

  function logEvent(event) {
    console.log(event.currentTarget.className);
  }
</script>
```

이벤트 캡쳐링 - 버블링의 반대방향으로 진행

![](https://joshua1988.github.io/images/posts/web/javascript/event/event-capture.png)

```html
<body>
  <div class="one">
    <div class="two">
      <div class="three"></div>
    </div>
  </div>
</body>

<script>
  var divs = document.querySelectorAll("div");
  divs.forEach(function(div) {
    div.addEventListener("click", logEvent, {
      // 캡쳐링으로 설정. default는 false이므로 버블링으로 동작한다.
      capture: true,
    });
  });

  function logEvent(event) {
    console.log(event.currentTarget.className);
  }
</script>
```

## Event 객체

---

**target 과 currentTarget**

target: 실제로 이벤트 때 클릭된 객체

currentTarget: 실제로 이벤트가 발생된 객체일 수 있지만, 전파를 통해 이벤트가 호출된 객체

아래 예제를 보면 실제로 이벤트를 등록한 객체는 div 지만, p를 클릭 하였을 때 클릭 이벤트가 발생되며 `target`, `currentTarget` 은 각각 p, div 가 된다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>event object</title>
  </head>
  <body>
    <div
      id="rec1"
      style="position: absolute; width: 100px; height: 100px; background-color: red;"
    >
      <p>abcde</p>
    </div>
    <script>
      document.querySelector("#rec1").addEventListener("click", function(e) {
        console.log(e.target); // p
        console.log(e.currentTarget); // div
      });
    </script>
  </body>
</html>
```

[event object](https://tmmoond8.github.io/web-basic-study/event/event.object.html)

type: 이벤트 id, (keydown, keyup, click 등)

cancelable: 이벤트를 중지할 수 있는지의 대한 값 true/false

**이벤트 발생 변경**

```jsx
e.preventDefault(); // 기본 이벤트 중단
e.stopPropagation(); // 이벤트 전파 중단

return false; // 이벤트 둘 다 중단
```

### 이벤트 위임

---

파일 리스트를 나열하는 table tag가 있다고 생각하자. 만약 리스트가 10만개 이상일 경우, 리스트 아이템에 일일이 이벤트를 걸면 10만개의 이벤트가 등록되는 것이다. 이런 이벤트를 더욱 효율적으로 처리할 수 있는 것이 이벤트 위임인데, 리스트 아이템을 감싸고 있는 상위에 이벤트를 걸어서 처리 하는 방식이다.

### 참고

---

[이벤트 참조](https://developer.mozilla.org/ko/docs/Web/Events)

[oninput Event](https://www.w3schools.com/jsref/event_oninput.asp)

[JavaScript 클립보드 복사 구현하기](https://velog.io/@godori/js-clipboard-copy)

[이벤트 버블링, 이벤트 캡처 그리고 이벤트 위임까지](https://joshua1988.github.io/web-development/javascript/event-propagation-delegation/)
