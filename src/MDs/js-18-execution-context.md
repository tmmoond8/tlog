---
title: JS 18. 실행컨텍스트
date: '2020-03-06T08:56:56.263Z'
description: JavaScript에서 실행컨텍스트
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632298243/tlog/cover/_____JS_1_jbq8ea.png'
tags:
  - JavaScript
---


> 실행가능한 코드를 형상화하고 구분하는 추상적인 개념
> 자바의 스택영역의 역할과 유사하다.

스코프 - 어떤 변수의 대한 유효범위
자바스크립트에서 스코프는 함수단위로 가졌는데, 보통의 언어들이 블락 스코프를 가지기 때문에 처음 자바스크립트를 배울 때 헷갈리는 요인이다.
자바스크립트에서 함수를 실행할 때 실행컨텍스트를 사용하는데, 이때 실행컨텍스트 별로 스코프를 가지기 때문이다.

**_6부터는 블락 스코프를 지원하는 변수들이 추가됐다. `let, const`_**

> '인사이드 자바스크립트' 책과 등 실행컨텍스트를 설명하는 많은 곳에서 기준이 되는 버전은 es3 버전이라고 합니다. es5, 그리고 그 이후에도 몇가지 개념이 추가되었다고 합니다. 큰 틀에서는 벗어나지 않기 때문에 이 정도로 학습하여도 무방하다고 생각합니다.

**실행 컨텍스트가 생성되어 코드가 실행되는 과정**

_1._ 함수가 실행되면, 실행 컨텍스트를 생성한다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952582/tlog/_2020-06-15__6.42.04_cg4pxb.png)

_2._ 컨텍스트가 생성된 후, 이 컨텍스트에서 실행에 필요한 정보들을 담을 객체인 활성 객체를 생성한다.
활성 객체가 형상화한 대상을 가지는 객체다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952583/tlog/_2020-06-15__6.42.10_mbadna.png)

_3._ 활성 객체 내에, 매개변수의 정보를 갖는 arguments 객체를 생성하고, 함수가 호출될 때 사용된 인자들을 넣는다. arguments 객체는 유사배열 객체이다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952583/tlog/_2020-06-15__6.42.14_dtagjk.png)

_4._ 활성 객체 내에, 이 실행 컨텍스트의 스코프 체인을 생성한다.
스코프 체인은 리스트의 형태이며, 현재 함수를 호출한 함수의 스코프체인에 현재 활성객체를 마지막에 추가한 리스트를 현재 활성객체에 추가한다.
[세바의 코딩교실 / 스코프 체인에 대한 설명](http://programmer-seva.tistory.com/36)

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952583/tlog/_2020-06-15__6.42.19_eazdmg.png)

_5._ 변수 객체가 생성되고, 함수가 가지고 있는 변수 및 객체 정보를 생성한다.
변수객체는 새로 생성되지만, 변수 객체와 활성 객체는 같다.
함수내에서 선언된 모든 변수를 생성한다. (코드가 실행되기 전에 변수에는 값이 할당되지 않기 때문에 생성한 변수, 함수들 모두 undefined가 된다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952585/tlog/_2020-06-15__6.42.24_whuqjq.png)

_6._ this에 대한 정보를 저장하며, 이 객체에 바인딩한다.
this에 바인딩할 대상이 없을 수도 있는데, 그때는 window로 바인딩한다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952586/tlog/_2020-06-15__6.42.28_awjzof.png)

_7._ 활성 객체(변수 객체)가 생성되면 코드를 실행할 준비를 마침. 코드를 실행시킨다.

코드를 실행하면 할당하지 실제로 foo, var, func에 값이 할당된다.

_8._ 실행컨텍스트 파기. 코드를 실행 후 실행컨텍스트를 파기한다.

> (추가 2019.01.27)
> wonmin님께서 댓글로 실행컨텍스트를 시각적으로 확인할 수 있는 링크를 알려주셨습니다. tylermcginnis / 실행컨텍스트를 시각적으로 확인
