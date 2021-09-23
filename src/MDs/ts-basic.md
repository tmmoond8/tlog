---
title: TS - Basic
date: '2020-06-16T08:56:56.243Z'
description: TypeScript 기본 알아가기
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952586/tlog/cover/typescript_edpims.jpg'
tags:
  - TypeScript
---

### 1. 타입스크립트는 명시적 타입 시스템과 추론적 타입 시스템을 모두 사용한다.

```tsx
let a: number = 1; // number
let b = 2; // number
```

충분히 타입을 나타낼 수 있는 문맥이라면 추론하도록 하자. 타입스크립트는 제법 타입을 잘 추론한다.

### 2. 타입(type) 이란

타입은 값이고, 이 값으로 할 수 있는 집합을 포함한다. Number 타입을 생각해보면, Number 타입과 관련된 변환 또는 숫자 표기법 변환 등을 수행할 수 있는 능력을 포함한다. (단순한 값 이상이다.)

### 3. 타입의 계층

![TS%20Basic%20ce220b00c71c4307ac6f68112c9a18a6/ts-basic.png](TS%20Basic%20ce220b00c71c4307ac6f68112c9a18a6/ts-basic.png)

### 4. Any 보단 unkown을 사용하자.

![TS%20Basic%20ce220b00c71c4307ac6f68112c9a18a6/_2020-06-20__4.36.04.png](TS%20Basic%20ce220b00c71c4307ac6f68112c9a18a6/_2020-06-20__4.36.04.png)

any 였다면 올바른 타입 에러를 올바로 보여주지 못 한다.

### 5. 특정 값이 타입이 될 수 있다.

타입은 boolean, number, string 뿐 아니라, 4, 'abc' 같은 특정 값도 타입이 될 수 있다.

```tsx
const a = true;
const b: 123 = 123;
```

![TS%20Basic%20ce220b00c71c4307ac6f68112c9a18a6/_2020-06-20__4.42.09.png](TS%20Basic%20ce220b00c71c4307ac6f68112c9a18a6/_2020-06-20__4.42.09.png)

### 6. 구조 기반 타입화 (덕 타이핑)

자바스크립트 언어가 구조 기반 타입을 갖도록 설계되었기 때문에, 타입스크립트도 이름 기반 타입 스타일보다 주고 기반 타입 스타일을 선호한다. 구조 기반 타입화에서는 객체의 이름에 상관 없이 객체가 어떤 프로퍼티를 갖고 있는지를 따진다.

![TS%20Basic%20ce220b00c71c4307ac6f68112c9a18a6/_2020-06-20__5.29.47.png](TS%20Basic%20ce220b00c71c4307ac6f68112c9a18a6/_2020-06-20__5.29.47.png)

### 7. 인덱스 시그니처를 사용할 수 있다.

```tsx
interface Phone {
  model: string;
  serial: number;
  [key: number]: boolean;
}
```

number형인 여러 프로퍼티를 가질 수 있다. (number 또는 string 타입에 할 당할 수 있는 타입어야 한다.)

### 8. {} 와 object, Object는 모두 다르다.

{}, object, Object 모두 함수, 배열을 허용한다. 그러나 1, 'a' 같은 원시 값에서 object는 허용하지 않지만, {}, Object는 허용한다.

위 타입은 실제 서비스에서 모두 사용하지 않기 때문에 세세하게 다루지 않지만, 그저 객체라는 타입이 필요하다면, object를 사용하자.

### 9. 유니온과 인터섹션

```tsx
interface Phone {
  browser: string;
  call: string;
}

interface Computer {
  vscode: string;
  browser: string;
}

type Intersection = Computer & Phone;
type Union = Phone | Computer;

// intersection은 두 타입의 속성을 모두 가져야 한다.
const intersection: Intersection = {
  browser: "chrome",
  vscode: "version 1",
  call: "void call",
};

// union은 Phone, Computer, 또는 Phone & Computer 일 수 있다.
const phone: Union = {
  browser: "chrome",
  call: "voice call",
};

const computer: Union = {
  browser: "chrome",
  vscode: "voice call",
};

const both: Union = {
  browser: "chrome",
  call: "video call",
  vscode: "version 22",
};
```

### 10. 배열을 표현하는 두 가지 표현법

`T[]`, `Array<T>` 두 표현 모두 사용할 수 있다.

### 11. 튜플

타입스크립트에는 튜플 타입이 있다.

```tsx
let a: [number, string, number] = [12, 'tailor', 122'];
```

### 12. 읽기 전용 배열을 만들어서 정해진 데이터만 가지게 할 수 있다.

```tsx
type A = readonly string[];
type B = ReadonlyArray<String>;
type C = Readonly<string[]>;
// readonly string[]

type D = readonly [number, string];
type E = Readonly<number, string>;
```

### 13. null, undefined, void, never

TypeScript와 JavaScript의 함수 리턴값의 차이점은 JavaScript는 리턴을 선언하지 않으면 undefined를 리턴하는 반면(생성자 함수일 때 제외), TypeScript에서는 리턴문을 사용하지 않으면 void로 리턴 타입을 선언해야 한다.

그리고 만약 익셉션을 처리한다면, 리턴 값을 never로 사용할 수 있다. 또는 무한 리턴을 안하는 무한 루프에도 never를 사용할 수 있다.

`throw TypeError('Error')`, `while(true) {}`

### 14. enum

enum에 값을 정의하지 않으면 자동으로 number 0 1 2... 로 값을 채운다.

```tsx
enum Fruit {
  Apple, // 0
  Lemon, // 1
}
```

**개인적으로 문자열을 사용하는 것을 선호한다.**

일반 enum에는 문제점이 하나 더 있는데, Fruit[255] 처럼 정의하지 않은 값에 접근해도 타입 에러를 발생하지 않는다. 그래서 const enum으로 정의하는 것을 추천한다.
preserveConstEnums

열거형을 대체할 방법이 있으니 열거형을 피하자.
