---
title: TS - Class
date: '2020-07-24T08:56:56.243Z'
description: TypeScript에서 클래스를 강력하게 사용하기
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952586/tlog/cover/typescript_edpims.jpg'
tags:
  - TypeScript
---

TypeScript의 클래스는 자바나 C++과 같은 언어와 크게 다르지 않다. 그렇기 때문에 다른 언어와의 공통 속성이나 객체지향적 사고는 자세히 설명하지 않고, 간단히 열거 하는 형태로 작성하였다. 

### 3-1. 생성자에 private 접근 한정자

```tsx
class Position {
  constructor(private file: File, private rank: Rank) {}
}

// 위 코드는 아래와 같다.

class Position {
  file: File;
  rank: Rank;
  constructor(file: File, rank: Rank) {
    this.file = file;
    this.rank = rank;
  }
}
```

생성자에 사용된 접근 한정자는 자동으로 객체의 프로퍼티로 정의된다.

### 3-2. 추상 클래스의 사용

```tsx
abstract class Piece {
  protected position: Position;
  constructor(private readonly color: Color, file: File, rank: Rank) {
    this.position = new Position(file, rank);
  }

  moveTo(position: Position) {
    if (this.canMoveTo(position)) {
      this.position = position;
    }
  }

  abstract canMoveTo(position: Position): boolean;
}

class King extends Piece {
  canMoveTo(position: Position) {
    return (
      this.position.file === position.file &&
      Math.abs(this.position.rank - position.rank) < 3
    );
  }
}
```

### 3-3. 메서드로 `this`를 사용할 수 있다.

```tsx
class List {
  total: number = 0;
  add(value: number): this {
    this.total += value;
    return this;
  }
}
new List().add(1).add(2).total;
```

### 3-4. Static 메서드와 변수에 대한 타입 정의

```tsx
interface InstanceInteface {
  instanceMethod: () => void;
}

interface StaticInterface {
  new (): InstanceInteface;
  staticMethod: () => void;
  staticField: string;
}

// 🙅‍♂️ class Banana implements StaticInterface {}

const Banana: StaticInterface = class {
  static staticField: string = "static field";
  static staticMethod() {
    console.log("static method");
  }
  instanceMethod() {
    console.log("instance method");
  }
};

Banana.staticMethod();
console.log(Banana.staticField);
new Banana().instanceMethod();
```