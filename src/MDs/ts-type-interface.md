---
title: 4. Type & Interface
date: '2020-08-08T08:56:56.243Z'
description: TypeScript 에서 타입을 정의하는데 사용하는 Type과 Interface
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952586/tlog/cover/typescript_edpims.jpg'
tags:
  - TypeScript
---

TypeScript에서 Interface는 기존 언어의 Interface 이상의 역할을 수행한다. JavaScript는 매우 많은 객체를 클래스 없이 생성하고 그에 따른 타입설정을 Interface로  대체한다. 이러한 부분 때문에 Type과 Interface는 매우 많은 부분을 서로 대체할 수 있다.

 이번에는 Type 과 Interface의 세가지 차이점에 대해 살펴보려 한다.

### 4-1 타입을 확장하는 방법이 다르다.

```tsx
type Age = number;       // 타입 별칭
type Birth = Age | string;   // 타입 연산자

interface Food {
  calories: number;
  tasty: boolean;
}

interface Sushi extends Food {
  salty: boolean;
}

interface Cake extends Food {
  sweet: boolean;
}
```

인터페이스가 반드시 인터페이스만 상속받아야 하는 것은 아니다. 사실 인터페이스는 객체 타입, 클래스, 다른 인터페이스 모두를 상속받을 수 있다.

### 4-2 Interface는 상속할 때 상위 Interface와 충돌 나면 안되지만, Type은 최대한 허용하는 형태로 동작한다.

```tsx
interface A {
  good(x: number): string;
  bad(x: number): string;
}

interface B extends A {
  good(x: number): string;
  bad(x: number): number;    // A의 bad의 리턴 타입과 달라서 에러
}

type A = {
  good(x: number): string;
  bad(x: number): string;
};

type B = A & {
  good(x: number): string;
  bad(x: number): number;
};

const b: B = {
  good(x: number): string {
    return x.toString();
  },
  bad(x: number): string | number {
    return x % 2 === 0 ? x : x.toString();
  },
};
```

`type B`는 `bad(x: number): string` 와  `bad(x: number): number` 를 둘 다 가질 수 있다. 그런데 변수 b에는 타입 에러가 난다.. 잘 모르겠다.

### 4-3 Interface의 선언 합침

```tsx
interface Mask {
  color: string;
}

interface Mask {
  size: number;
}

const mask: Mask = {
  color: "White",
  size: 12,
};
```

Interface는 같은 이름으로 여러번 정의가 가능하며, 각 정의는 하나로 합쳐진다.

### 4-4 함수에 프로퍼티 추가

```tsx
type Callback = {
  (message: string): void;
  (message: string, line: number): void;
  isfulfilled: boolean;
};

const callback: Callback = function callback(message: string, line?: number) {
  console.log(message + "call");
  callback.isfulfilled = true;
};
callback.isfulfilled = false;

callback("foo");
console.dir(callback);
```