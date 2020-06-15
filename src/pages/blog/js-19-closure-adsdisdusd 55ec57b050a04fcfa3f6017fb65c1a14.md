---
templateKey: blog-post
title: 19. 클로져
date: 2020-03-11T08:56:56.263Z
description: JavaScript에서 클로저란?
featuredpost: true
featuredimage: /img/javascript.png
tags:
  - javascript
---

#

[Closure | PoiemaWeb](https://poiemaweb.com/js-closure)

> 클로저는 함수와 그 함수가 선언됐을 때의 렉시컬 환경(Lexical environment)과의 조합이다.

클로져는 자바스크립트 관련 질문 중 단골로 등장하는 주제다. 클로져라는 개념은 자바스크립트에만 있는 개념은 아니고, 함수를 일급 객체로 취급하는 프로그래밍 언어에서 사용된다.

클로져를 정확히 이해하기 위해서는 필수적으로 실행 컨텍스트에 대한 이해가 필요하다. 간단히 리마인드 해보면,

```jsx
var kokoa = "마싯서";
function outerFunc() {
  var x = 10;
  var innerFunc = function() {
    console.log(x);
  };
  innerFunc();
}

outerFunc(); // 10
```

위 코드에서 innerFunc는 변수 x를 출력한다. innerFunc이 선언되는 시점에 실행 컨텍스트가 생성되고, 선언에 따라 결정되는 환경을 렉시컬 환경이라고 한다.
이 렉시컬 환경은 스코프 체인이란 것을 포함하는데, 이는 리스트의 형태이다.

- outerFunc의 스코프 체인

![Untitled%2055ec57b050a04fcfa3f6017fb65c1a14/_2019-12-28__8.37.43.png](Untitled%2055ec57b050a04fcfa3f6017fb65c1a14/_2019-12-28__8.37.43.png)

outerFunc의 입장에서는 당연하게도 x에 대한 접근이 가능하다. 그리고 스코프 체인에 의해 Global 스코프인 kokoa에 대해서도 접근이 가능하게 된다.

- innerFunc의 스코프 체인

![Untitled%2055ec57b050a04fcfa3f6017fb65c1a14/_2019-12-28__8.39.15.png](Untitled%2055ec57b050a04fcfa3f6017fb65c1a14/_2019-12-28__8.39.15.png)

innerFunc의 입장에서 살펴 보자. 기본적으로 스코프 체인에는 outerFunc의 스코프체인에 자신의 활성객체를 추가한 리스트를 갖게 되어 outerFunc이 접근할 수 있는 범위를 커버할 수 있다.

위 코드랑 비슷하지만 아래 코드는 약간의 매직이 발생한다.

```jsx
function outerFunc() {
  var x = 10;
  var innerFunc = function() {
    console.log(x);
  };
  return innerFunc;
}

var inner = outerFunc();
inner(); // 10
```

일반적인 언어에서는 함수 내부에 있는 변수는 함수가 실행되는 동안에만 사용할 수 있다.

outerFunc이 호출 되면 innerFunc을 inner 변수가 참조하게 된다. 이 때 outerFunc은 실행이 끝나서 실행 컨텍스트가 종료 되었지만, x 변수가 메모리에서 반환되지 않았다. 그 이유는 innerFunc가 실행될 렉시컬 환경을 유지하기 위함인데, innerFunc이 선언되는 시점에 렉시컬 환경(스코프 체인 등)이 생성되고 innerFunc의 참조를 외부에서 inner변수가 갖고 있기 때문에 변수 inner가 존재하는 한 innerFunc의 렉시컬 환경은 유지가 되어야 한다.

> 클로저는 자신이 생성될 때의 환경(Lexical environment)을 기억하는 함수다

외부에서는 접근할 수 없는 스코프에서 변수를 사용할 수 있고, 이를 자유 변수라 한다. 자바스크립트는 이 자유변수를 응용하여 private 멤버 변수 처럼 사용한다.

```jsx
var Counter = function() {
  var number = 0;
  return (function() {
    return {
      increment: function() {
        return ++number;
      },
      decrement: function() {
        return --number;
      },
    };
  })();
};

var counter = Counter();
counter.increment(); // 1
counter.increment(); // 2
counter.decrement(); // 1
```

클로저는 남용하면 메모리를 많이 사용하고 반환이 안될 수 있지만, 변수가 외부로 노출이 되는 것은 더욱 나쁘다.

위 코드가 자유변수가 존재하는 공간에서 자유 변수를 활용하는 함수라면, 다음 패턴은 자유 변수를 확장성있게 사용할 수 있는 패턴이다.

```jsx
// 함수를 인자로 전달받고 함수를 반환하는 고차 함수
// 이 함수가 반환하는 함수는 클로저로서 카운트 상태를 유지하기 위한 자유 변수 counter을 기억한다.
function makeCounter(predicate) {
  // 카운트 상태를 유지하기 위한 자유 변수
  var counter = 0;
  // 클로저를 반환
  return function() {
    counter = predicate(counter);
    return counter;
  };
}

// 보조 함수
function increase(n) {
  return ++n;
}

// 보조 함수
function decrease(n) {
  return --n;
}

// 함수로 함수를 생성한다.
// makeCounter 함수는 보조 함수를 인자로 전달받아 함수를 반환한다
const increaser = makeCounter(increase);
console.log(increaser()); // 1
console.log(increaser()); // 2

// increaser 함수와는 별개의 독립된 렉시컬 환경을 갖기 때문에 카운터 상태가 연동하지 않는다.
const decreaser = makeCounter(decrease);
console.log(decreaser()); // -1
console.log(decreaser()); // -2
```
