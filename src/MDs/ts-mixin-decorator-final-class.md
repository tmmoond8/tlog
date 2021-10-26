---
title: Mixin & Decorator & final Class
date: '2020-09-01T08:56:56.243Z'
description: 타입스크립트에서 확장된 클래스 정의
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952586/tlog/cover/typescript_edpims.jpg'
tags:
  - TypeScript
---


### Mixin

---

`JavaScript` 와 `TypeScript`는 `trait`나 `mixin` 키워드를 제공하지 않지만, 어렵지 않게 구현할 수 있다. 두 키워드는 모두 둘 이상의 클래스를 상속받는 다중 상속과 관련된 기능을 제공하며, 역할 지향 프로그래밍을 제공한다. `is-a` 관계 대신 `can`, `has-a` 관계를 사용한다.

Mixin은 동작과 프로퍼티를 클래스로 혼합할 수 있게 해주는 패턴으로, 다음 규칙을 따른다.

- 상태를 가질 수 있다. (인스턴스 프로퍼티)
- 메서드만 제공할 수 있다. (추상 메서드는 안댐)
- 생성자를 가질 수 있다. (클래스가 혼합된 순서와 같은 순서로 호출됨)

```tsx
// 모든 생성자를 표현하는 생성자 타입
  type ClassConstructor<T> = new (...args: any[]) => T;

  function withDebug<
    C extends ClassConstructor<{
      getDebugValue(): string;
    }>
  >(Class: C) {
    return class extends Class {
      debug() {
        const name = this.constructor.name;
        const value = this.getDebugValue();
        return `${name}: ${value}`;
      }
    };
  }

  class Cat {
    constructor(
      private id: number,
      private firstName: string,
      private lastName: string
    ) {}

    getDebugValue() {
      return `${this.id}, ${this.firstName}, ${this.lastName}`;
    }
  }

  const ScottishFold = withDebug(Cat);
  const scott = new ScottishFold(3, "leo", "lol");
  console.log(scott.debug());

const btn = ducument.getEelementById('btn');
let count = 0;
```

### Decorator

---

데코레이터는 JS에서 몇년 째 draft로 머물러 있다. 현재는 stage2이며 TS에서는 옵셔널하게 지원한다.

tsconfig.json 에서 `"experimentalDecorators": true` 를 설정하면 바로 사용할 수 있다.

```tsx
type ClassConstructor<T> = new (...args: any[]) => T;
  interface Serializable {
    serialize(): string;
  }
  function serializable<
    T extends ClassConstructor<{
      getValue(): string;
    }>
  >(Constructor: T) {
    return class extends Constructor implements Serializable {
      serialize() {
        return this.getValue();
      }
    };
  }

  @serializable
  class User {
    constructor(private name: string, private age: number) {}
    getValue() {
      return `${this.name}, ${this.age}`;
    }
  }
  const guest = new User("guest", 10);
  console.log((guest as any).serialize());
```

### final Class

---

class에 final 키워드를 지원하지 않지만, 생성자를 private으로 선언하여 간단히 확장할 수 없는 클래스를 정의할 수 있다.

```tsx
class MessageQueue {
	private constructor(private messages: string[]) {}
	static create(messages: string[]) {
		return new MessageQueue(messages);
	}
}
```

객체를 생성할 때는 `create` 정적함수를 이용하면 된다.

```tsx
class LogQueue extends MessageQueue {} // 에러 발생
```