---
title: ES6 - Promise
date: '2020-04-23T08:56:56.263Z'
description: 콜백 지옥을 벗어나자
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632298243/tlog/cover/_____JS_1_jbq8ea.png'
tags:
  - JavaScript
---

#

## 등장 배경

---

Promise가 등장하기 전 비동기 처리는 비동기 콜백의 형식으로 구현이 되었다. 콜백의 형태는 매우 자연스럽지만 몇가지 문제가 있었다. 대표적으로 중첩된 콜백을 사용하게 되어 가독성이 크게 낮아진다는 점이다.

### 콜백 지옥

```tsx
var after1s = (num, callback) =>
  setTimeout(() => {
    console.log(num);
    callback();
  }, 1000);
after1s(1, function() {
  after1s(2, function() {
    after1s(3, function() {
      after1s(4, function() {
        console.log("end");
      });
    });
  });
});
```

더욱이 Java, C++, Python 등의 언어에 익숙한 사람들은 논블라킹 I/O에 익숙하지 않은 문제도 있으며, this는 이 와중에 혼란을 야기 한다.

### 에러 핸들링

setTimeout 내부의 콜백에서 발생한 Error는 catch 되지 않는데, 그 이유는 비동기 콜백은 이벤트 루프가 나중에 태스크큐에 넣겠지만 이미 setTimeout 함수가 호출되고 try 블럭은 끝나버린다.

```tsx
try {
  setTimeout(() => {
    throw new Error("Error!");
  }, 1000);
} catch (e) {
  console.log("에러를 캐치하지 못한다..");
  console.log(e);
}
```

## 프로미스 생성

---

```tsx
var promise = new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest(),
    method = "GET",
    url =
      "https://gist.githubusercontent.com/tmmoond8/3ebfcced9a7c749fe1dd9bcbb16c6f98/raw/0b1fa7913c52b2c8c49087638da7c5367f981296/peoplefund.json";

  xhr.open(method, url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        reject("failure reason");
      }
    }
  };
  xhr.send();
});
```

Promise는 상태를 갖는 객체다. Promise 객체를 생성하면 기본적으로 `pending` 상태가 된다. 그리고 Promise 내부에서 `resolve`를 호출하면 `fulfilled` 상태가 되고, `reject`를 호출하면 `rejected` 상태가 된다. `settled`는 `resolve` 나 `reject`를 호출하면 `fulfilled`, `rejected` 두 상태가 된 것을 가르킨다. `[[PromiseStatus]]` 에는 `settled`는 없느 것 같다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952579/tlog/_2020-01-26__8.28.28_dszuiq.png)

- _pending_: initial state, neither fulfilled nor rejected.
- _fulfilled_: meaning that the operation completed successfully.
- _rejected_: meaning that the operation failed.

- settled: meaning that the operation fulfilled or rejected.

### 후속 처리 메서드

---

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952585/tlog/es6-promise_bsikab.png)

Promise로 구현된 비동기 함수는 Promise 객체를 리턴 한다. Promise 안의 비동기 처리 결과를 후속 처리 메서드(`then`, `catch`)를 사용하여 처리한다.

**then**

```tsx
p.then(onFulfilled[, onRejected]);

p.then(value => {
  // fulfillment
}, reason => {
  // rejection
});
```

`then`은 첫 번째 인자로 `fulfilled` 됐을 때 callback을 받고, 두 번째 인자는 옵션으로 `rejected` 됐을 때 callback을 받는다.

**catch**

```tsx
var promise = new Promise((resolve, reject) => {
  //throw new Error('e')
  //resolve('true')
  reject("false");
});
var afterPromise = promise
  .then(
    (result) => {
      console.log("success", result);
    },
    (reason) => {
      console.log("rejected", reason);
    }
  )
  .catch((e) => {
    console.error("catch", e);
  })
  .then(() => {
    console.log("end");
  });

console.log(promise);
console.log(afterPromise);
```

### Chaining

---

`then`, `catch`는 각각 새로운 Promise를 리턴하게 되며, chaining을 할 수 있다.

```jsx
function who(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 500);
  });
}

function what(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data + "lurks");
    }, 1000);
  });
}

function where(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data + "in the shadows");
    }, 1500);
  });
}

//who('🤡').then(data => what(data)).then(data => where(data)).then(data => console.log(data))
who("🤡")
  .then(what)
  .then(where)
  .then(console.log);
```

### Error Propagation

---

```jsx
function who(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // throw new Error('who')
      // try {
      //
      //} catch (e) {
      //	reject(e)
      //}

      resolve(data);
    }, 500);
  });
}

function what(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data + "lurks");
    }, 1000);
  });
}

function where(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data + "in the shadows");
    }, 1500);
  });
}

who("🤡")
  .then(what)
  .then(where)
  .then(console.log)
  .catch(console.error);
who("🤡")
  .then(what)
  .catch(console.error)
  .then(where)
  .then(console.log)
  .catch(console.error);
```

## Promise.all

---

Prmose.all 은 동시에 실행하여 각각의 결과를 비동기적으로 호출하여 얻어내는

```tsx
function who() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("🤡");
    }, 2000);
  });
}

function what() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("lurks");
    }, 3000);
  });
}

function where() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("in the shadows");
    }, 5000);
  });
}

Promise.all([what(), who(), where()])
  .then(console.log) // [ 1, 2, 3 ]
  .catch(console.log);

// 약 5초 소요. (병렬처리)

// async / await 에서는...
async function msg() {
  var pWho = who();
  var pWhat = what();
  var pWhere = where();
  const b = await pWhere;
  const c = await pWho;
  const a = await pWhat;

  // const c = await who();
  // const a = await what();
  // const b = await where();

  console.log(`${a} ${b} ${c}`);
}
```

## Promise.race

---

이 녀석은 가장 먼저 resolve하는 값으로 처리한다.

```tsx
Promise.race([
  new Promise((resolve) => setTimeout(() => resolve(1), 3000)), // 1
  new Promise((resolve) => setTimeout(() => resolve(2), 2000)), // 2
  new Promise((resolve) => setTimeout(() => resolve(3), 1000)), // 3
])
  .then(console.log) // 3
  .catch(console.log);
```

## Guarantees

Unlike "old-style", *passed-in* callbacks, a promise comes with some guarantees:

- **Callbacks will never be called before the [completion of the current run](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#Run-to-completion) of the JavaScript event loop.**
- Callbacks added with `[then()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)` even *after* the success or failure of the asynchronous operation, will be called, as above.
- Multiple callbacks may be added by calling `[then()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)` several times. Each callback is executed one after another, in the order in which they were inserted.

One of the great things about using promises is **chaining**.

### Promise rejection events

---

Promise가 rejected 되면, 그 이벤트는 global scope의 `window`나 web worker인 `Worker`에게로 전달 되는데, 그 이벤트는 아래의 두 개다.

- rejectionhandled

  `reject` 함수가 실행될 때 발생하는 이벤트

- unhandledrejection

  rejected 됐지만, Promise에서 아무런 처리를 안 했을 때 발생.

```jsx
window.addEventListener(
  "rejectionhandled",
  (event) => {
    console.log("Promise rejected; reason: " + event.reason);
  },
  false
);

window.addEventListener(
  "unhandledrejection",
  (event) => {
    console.log("unhandledrejection", event);

    event.preventDefault();
  },
  false
);
```

```jsx
var promise = new Promise((resolve, reject) => {
  //throw new Error('e')
  //resolve('true')
  reject("false");
});
var afterPromise = promise
  .then(
    (result) => {
      console.log("success", result);
    },
    (reason) => {
      console.log("rejected", reason);
    }
  )
  .catch((e) => {
    console.error("catch", e);
  });
```

### Promise 대충 구현해보기

---

Promise의 기본 기능을 구현해보았다.

- index.html

  ```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Document</title>
    </head>
    <body>
      <div id="data"></div>
      <script src="./tiramise.js"></script>
      <script>
        var tiramise = new Tiramise(function(resolve, reject) {
          const xhr = new XMLHttpRequest(),
            method = "GET",
            url =
              "https://gist.githubusercontent.com/tmmoond8/c1d77f4c9ad3cfde0815a4ad24272c6c/raw/c0596fd68fb719c25fa3742e81081b5a5add70ba/mysql_01.sql";

          xhr.open(method, url, true);
          xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
              if (xhr.status === 200) {
                resolve(xhr.responseText);
              } else {
                reject("failure reason");
              }
            }
          };
          xhr.send();
        });
        var afterTiramise = tiramise.then(
          function(value) {
            console.log("resolved", value);
          },
          function(reasodkn) {
            console.log("rejected", reason);
          }
        );
        console.log(tiramise);
        console.log(afterTiramise);
      </script>
    </body>
  </html>
  ```

- tiramise.js

  ```jsx
  function Tiramise(handler) {
    this.status = "pending";
    this.value = null;
    var that = this;
    function resolve(data) {
      that.value = data;
      setStatus("resolved");
    }
    function reject(reason) {
      that.value = reason;
      setStatus("rejected");
    }

    function setStatus(status) {
      that.status = status;
      if (status === "resolved" && that.onFulfilled) {
        that.onFulfilled(that.value);
      }
      if (status === "rejected" && that.onRejected) {
        that.onRejected(that.value);
      }
    }

    handler(resolve, reject);
  }

  Tiramise.resolve = function(data) {
    var tiramise = new Tiramise(function(resolve, reject) {
      resolve(data);
    });
    return tiramise;
  };

  Tiramise.reject = function(reason) {
    var tiramise = new Tiramise(function(resolve, reject) {
      reject(reason);
    });
    return tiramise;
  };

  Tiramise.prototype.then = function(onFulfilled, onRejected) {
    var tiramise = Tiramise.resolve();
    this.onFulfilled = onFulfilled;
    this.onRejected = onFulfilled;
    return tiramise;
  };
  ```

## References

---

[Promise | PoiemaWeb](https://poiemaweb.com/es6-promise)

[Exploring Async/Await Functions in JavaScript](https://alligator.io/js/async-functions/)

[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

[Using Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
