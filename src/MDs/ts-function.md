---
title: TS - function
date: '2020-07-01T08:56:56.243Z'
description: TypeScript 에서 함수의 타입을 지정하는 방법들
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952586/tlog/cover/typescript_edpims.jpg'
tags:
  - TypeScript
---

### 2-1. 타입스크립트는 반환 값을 아주 잘 추론한다.

타입스크립트가 리턴되는 값을 알아서 추론한다. 굳이 선언하도록 할 필요가 없다.

### 2-2. 타입에는 함수의 인터페이스를 정의하는 호출 시그니처가 있다.

```tsx
type Callback = (message: string) => void;
```

### 2-3. 함수가 선언된 방법은 고려 하지 않고, 매개변수와 리턴 값을 따진다.

```tsx
const printf = (message: string) => {
  console.log(message);
};

function printFunc(message: string) {
  console.log(message);
}

type Print = (message: string) => void;

const printToday = (callback: Print) => {
  callback(new Date().toDateString());
};

printToday(printf);
printToday(printFunc);
```

함수 선언식과 함수 표현식 간의 동일한 인터페이스만 따진다.

함수 생성자(`new Function()`) 를 사용하면 TypeScript에서 도와줄 수 있는 부분이 없다.

### 2-4. 함수에서 this 사용을 막자.

JavaScript의 this는 선언된 문맥과 호출된 방법에 따라 변한다. 그래서 TypeScript에서 this를 사용하고 싶다면, 첫 번째 인자로 넣자. TypeScipt의 this는 예약어로 JavaScript의 this와는 다르다.

this로 첫 번째 인자로 선언하면, `fancyDate` 함수는 인자가 0개인 함수이며, `apply`, `call` 과 같은 this를 변경하여 호출하는 함수에서만 올바로 작동하게 된다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952590/tlog/_2020-08-23__10.54.51_gtmlqq.png)

> eslint 에서 no-invalid-this 옵션을 켜서 this의 위험성을 막자.
> tsconfig에서 noImplicitThis 옵션을 켜면 this 타입을 명시적으로 설정하도록 강제할 수 있다.

### 2-5. 이너테이터, 제너레이터를 위한 IterableIterator

```tsx
function* createNumbers(): IterableIterator<number> {
  let n = 0;
  while (true) {
    yield n++;
  }
}
```

tsconfig 에서 `downlevelIteration` 옵션을 켜면 ES2015 이전 버전에서 커스텀 반복자를 활성화할 수 있다. 이 옵션을 켜면 용량이 꽤 커진다고 한다.

### 2-6. 함수 타입의 오버로딩

대부분의 경우는 단축형 호출 시그니처로 충분할 것이다.

```tsx
// 단축형 호출 시그니처
type Callback = (message: string) => void;
```

그러나 좀 더 복잡한 타입 관계가 있는 함수를 표현하게 될 때 전체 호출 시그니처를 활용해야 한다. 아래에는 `message`만 인자로 받는 호출 시그니처와 `line`, `message` 둘다 받는 호출 시그니처를 둘 다 정의할 수 있다.

```tsx
// 전체 호출 시그니처
type Callback = {
	(message: string) => void;
	(message: string, line: number) => void;
}

type createElement = {
	(tag: 'a'): HTMLAnchorElement;
	(tag: 'canvas'): HTMLCanvasElement;
	(tag: 'table'): HTMLTableElement;
	(tag: string): HTMLElement;
}
```

전체 호출 시그니처를 사용하면 함수에 속성을 쉽게 설정할 수 있다.

```tsx
type Callback = {
	(message: string) => void;
	(message: string, line: number) => void;
	isfulfilled: boolean;
}
```

### 2-7. 제네릭 타입

`filter` 함수를 예로 구현을 해보자. 우선 제네릭을 사용하지 않는다면

```tsx
type Filter = {
  (array: number[], f: (item: number) => boolean): number[];
  (array: string[], f: (item: string) => boolean): string[];
  (array: object[], f: (item: object) => boolean): object[];
};
```

잘 정의된 것 같지만, 객체 타입일 때 정상적으로 호출 될까? 그렇지 않을 것이다. `object` 는 객체 내 속성에 대한 어떠한 정보도 없기 때문이다.

제네릭은 타입을 지정하지 않지만 사용한 타입을 타입스크립트가 추론하도록 맡긴다.

```tsx
// 전체 호출 시그니처, 전체에 제네릭을 설정
type Filter<T> = {
  (array: T[], f: (item: T) => boolean): T[];
};
```

해볼만한 활동
map 함수를 제네릭으로 타입 선언 한다면?
Map<K, V>

### 2-8. 제네릭 타입 - 선언하는 다양한 방법

```tsx
// 전체 호출 시그니처, 전체에 제네릭을 설정
type Filter<T> = {
  (array: T[], f: (item: T) => boolean): T[];
};
```

```tsx
// 전체 호출 시그니처, 전체에 제네릭을 설정
type Filter = {
  <T>(array: T[], f: (item: T) => boolean): T[];
};
```

```tsx
// 단축 호출 시그니처
type Filter<T> = (array: T[], f: (item: T) => boolean) => T[];
```

```tsx
// 단축 호출
type Filter = <T>(array: T[], f: (item: T) => boolean) => T[];
```

### 2-9. 제네릭 타입 - 타입 명시할 때 주의할 점

제네릭에서 타입을 명시할 때는 모든 제네릭을 명시하거나 아얘 명시하지 말아야 한다.

```tsx
function map<T, U>(array: T[], f: (item: T) => U[] {
}

// OK
map([1, 2, 3], n => n % 2 === 0)

// OK
map<string, boolean>([1, 2, 3], n => n % 2 === 0)

// NOPE
map<string>([1, 2, 3], n => n % 2 === 0)
```

### 2-10. 제네릭 타입 - 자주 사용하는 대표적 예시

```tsx
// Promise의 리턴 타입
const promise = new Promise<number>((resolve) => resolve(45));
```

```tsx
// setTimeout 리턴 타입
const timeoutId: ReturnType<typeof setTimeout> = setTimeout(() => {}, 100);
```

```tsx
// React의 이벤트 타입
const handleClick = (e: MouseEventHandler<HTMLButtonElement>): void => {
	...
}
<button onClick={handleClick}>버튼</div>
```

### 2-11. 제네릭 타입 - 타입의 확장과 다형성

2진 트리를 구현한다고 생각해보자. 2진 트리는 아래의 규칙을 따른다.

- 이진 트리는 값을 가지며 최대 두 개의 자식 Node 가리킬 수 있다.
- 자식이 없는 Node를 Leaf Node 라 하고, Inner Node는 적어도 한 개의 자식을 가지며, 모든 노드는 Leaf Node이거나 Inner Node 중 하나다.

```tsx
type TreeNode = {
  value: string;
};

type LeafNode = TreeNode & {
  isLeaf: true;
};

type InnerNode = TreeNode & {
  children: [TreeNode] | [TreeNode, TreeNode];
};

function add10<T extends TreeNode>(node: T): T {
  return {
    ...node,
    value: (Number(node.value) + 10).toString(),
  };
}
```
