---
title: JS 17. this
date: '2020-03-02T08:56:56.263Z'
description: JavaScript에서 this
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632298243/tlog/cover/_____JS_1_jbq8ea.png'
tags:
  - JavaScript
---


JavaScript의 this는 Java나 C++ 같은 언어와 달리 호출 방식에 의해 결정되고 4 가지로 볼 수 있음.

```jsx
var foo = function() {
  console.dir(this);
};

// 1. 메소드 호출
var obj = { foo: foo };
obj.foo(); // obj

// 2. 생성자 함수 호출
var instance = new foo(); // instance

// 3. apply/call/bind 호출
var bar = { name: "bar" };
foo.call(bar); // bar
foo.apply(bar); // bar
foo.bind(bar)(); // bar

// 4. 함수 호출
foo(); // window
// window.foo();

// 화살표 함수는 정의된 곳의 렉시컬 스코프를 따름
```

## 일반적인 함수 호출

---

내부함수는 일반 함수, 메소드, 콜백함수 어디에서 선언되었든 관게없이 this는 전역객체를 바인딩한다.

obj.foo() 는 obj의 메소드로 호출 했기 때문에 this가 obj

obj 내부 함수인 bar에서 obj를 접근하려면 this로 접근할 수 없기에 that이라는 변수를 만들어 넣음.

that도 선언하기 싫다면 bind 함수를 사용할 수 있음.

```jsx
var value = 1;

var obj = {
  value: 100,
  foo: function() {
    var that = this; // Workaround : this === obj

    console.log("foo's this: ", this); // obj
    console.log("foo's this.value: ", this.value); // 100
    function bar() {
      console.log("bar's this: ", this); // window
      console.log("bar's this.value: ", this.value); // 1

      console.log("bar's that: ", that); // obj
      console.log("bar's that.value: ", that.value); // 100
    }
    bar();
  },
};

obj.foo();
```

# 2. 메소드 호출

---

메소드 내부의 this는 해당 메소드를 소유한 객체, 즉 해당 메소드를 호출한 객체에 바인딩된다.

## 3. 생성자 함수

---

JavaScript는 new 키워드로 호출되는 함수가 생성자 함수로 동작한다. 생성자 함수로 호출될 때는 this가 조금 다른데 다음의 순서를 따른다.

1.  **빈 객체 생성 및 this 바인딩** 생성자 함수의 코드가 실행되기 전 빈 객체가 생성된다. 이 빈 객체가 생성자 함수가 새로 생성하는 객체이다. 이후 **생성자 함수 내에서 사용되는 this는 이 빈 객체를 가리킨다.** 그리고 생성된 빈 객체는 생성자 함수의 prototype 프로퍼티가 가리키는 객체를 자신의 프로토타입 객체로 설정한다.
2.  **this를 통한 프로퍼티 생성** 생성된 빈 객체에 this를 사용하여 동적으로 프로퍼티나 메소드를 생성할 수 있다. this는 새로 생성된 객체를 가리키므로 this를 통해 생성한 프로퍼티와 메소드는 새로 생성된 객체에 추가된다.
3.  **생성된 객체 반환** 반환문이 없는 경우, this에 바인딩된 새로 생성한 객체가 반환된다. 명시적으로 this를 반환하여도 결과는 같다.반환문이 this가 아닌 다른 객체를 명시적으로 반환하는 경우, this가 아닌 해당 객체가 반환된다. 이때 this를 반환하지 않은 함수는 생성자 함수로서의 역할을 수행하지 못한다. 따라서 생성자 함수는 반환문을 명시적으로 사용하지 않는다.

생성자 함수를 강제하는 패턴

```jsx
// Scope-Safe Constructor Pattern
function A(arg) {
  // 생성자 함수가 new 연산자와 함께 호출되면 함수의 선두에서 빈객체를 생성하고 this에 바인딩한다.

  /*
  this가 호출된 함수(arguments.callee, 본 예제의 경우 A)의 인스턴스가 아니면 new 연산자를 사용하지 않은 것이므로 이 경우 new와 함께 생성자 함수를 호출하여 인스턴스를 반환한다.
  arguments.callee는 호출된 함수의 이름을 나타낸다. 이 예제의 경우 A로 표기하여도 문제없이 동작하지만 특정함수의 이름과 의존성을 없애기 위해서 arguments.callee를 사용하는 것이 좋다.
  */
  if (!(this instanceof arguments.callee)) {
    return new arguments.callee(arg);
  }

  // 프로퍼티 생성과 값의 할당
  this.value = arg ? arg : 0;
}

var a = new A(100);
var b = A(10);

console.log(a.value);
console.log(b.value);
```

## 4. apply/call/bind 호출

---

JavaScript는 this를 내가 지정하고 싶은 객체로 지정하는 것이 가능하다. apply, call, bind가 그것 인데 다음의 예를 보자.

```jsx
var foo = [0];
var bar = {
	'0': 0,
	length: 1,
}
Array.prototype.push.apply(foo, [1, 2, 3]);

**A**rray.prototype.push.call(bar, 1, 2, 3);
```

apply , array, arguments
