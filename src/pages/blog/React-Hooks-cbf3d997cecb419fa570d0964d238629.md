---
templateKey: blog-post
title: React Hooks - 기본편
date: 2020-02-05T08:56:56.243Z
description: Hooks에 대한 기본적인 이해
featuredpost: true
featuredimage: /img/cover/react-hooks.png
tags:
  - react
---

#

[https://reactjs.org/docs/hooks-intro.html](https://reactjs.org/docs/hooks-intro.html)

> Hooks는 React 16.8 버전에서 추가된 새로운 스펙이다. 간단히 말하면 class를 사용하지 않고, 상태나 생명주기 등 다른 리액트의 특징을 사용할 수 있다.

몇몇 문제를 해결 하고자 나왔기 때문에 필요한 곳에 사용하면 된다. 그동안 리액트에서 재사용 가능한 모듈에서 render props 나 higher-order-components 같은 패턴을 많이 사용하였는데, 이는 컴포넌트의 깊이를 더 깊게 하기 때문에 불편했었다.

Hooks는 리액트의 근간인 props, state, context, refs and lifecycle을 유지하면서 컴포넌트을 결합하는 멋진 방법을 제공한다.

`componentDidMount`, `componentDidUpdate`, `componentWillUnmount` 등 에서 특히 `componentDidMount` 에서 데이터를 fetch 하는 동작을 많이 하는데 이는 테스트를 어렵게 하고 오동작을 일으키기가 쉽다.

리액트팀은 기존의 클래스형 컴포넌트에서 서로 관련이 없는 비즈니스 로직을 생명주기 함수에 따라 작성하게 되는데, 이 부분을 본질적인 문제라 생각했다.

hooks는 라이프 사이클을 기준으로 분리하는 것을 강제하기 보다는, 컴포넌트를 로직에 기반해 작은 함수로 나눈다. 그럼으로써 더욱더 재사용 가능한 로직을 쉽게 만들 수 있으며, 관련있는 비즈니스 로직이 같이 있기 때문에 수정에도 용이해지며 가독성도 좋다.

> Hooks는 Class안에서는 동작하지 않는다.

# useState

---

useState는 상태 값을 관리한다.

## class vs hooks

- class

  ```jsx
  interface IProps {}

  class Example extends React.Component<IProps, { count: number }> {
    constructor(props) {
      super(props);
      this.state = {
        count: 0,
      };
    }

    render() {
      return (
        <div>
          <p>You clicked {this.state.count} times</p>
          <button
            onClick={() => this.setState({ count: this.state.count + 1 })}
          >
            Click me
          </button>
        </div>
      );
    }
  }
  ```

- hooks

  ```jsx
  const FunctionalExample = () => {
    const [count, setCount] = React.useState(0);

    return (
      <div>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>Click me</button>
      </div>
    );
  };
  ```

여러개의 상태값을 사용할 수 있다.

```jsx

const [ state, setState ] = useState({name: '', age: 0});
...
setState({ ...state, name: 'tamm' });
setState({ ...state, age: 20 });

```

# useEffect

---

useEffect는 리액트 class에서 중요한 생명주기인 `componentDidMount`, `coumponentWillUnmount` 의 기능을 함수형 컴포넌트에서 구현할 수 있는 hooks이다. 간단히 아래의 예시로 구현을 비교해보자.

api 호출 및 이벤트 등록 해제등에 사용할 수 있다.

- class

  ```jsx
  class FriendStatus extends React.Component<IProps, any> {
    constructor(props) {
      super(props);
      this.state = { isOnline: null };
      this.handleStatusChange = this.handleStatusChange.bind(this);
    }

    componentDidMount() {
      ChatAPI.subscribeToFriendStatus(
        this.props.friend.id,
        this.handleStatusChange
      );
    }

    componentWillUnmount() {
      ChatAPI.unsubscribeFromFriendStatus(
        this.props.friend.id,
        this.handleStatusChange
      );
    }

    handleStatusChange(status) {
      this.setState({
        isOnline: status.isOnline,
      });
    }

    render() {
      if (this.state.isOnline === null) {
        return "Loading...";
      }
      return this.state.isOnline ? "Online" : "Offline";
    }
  }
  ```

- hooks

  ```jsx
  import React, { useState, useEffect } from "react";

  const ChatAPI = {
    subscribeToFriendStatus: (id, handleStatusChange) => {
      console.log(`subscribeToFriendStatus ${id}`);
      handleStatusChange({
        isOnline: true,
      });
    },
    unsubscribeFromFriendStatus: (id, handleStatusChange) => {
      console.log(`unsubscribeFromFriendStatus ${id}`);
      handleStatusChange({
        isOnline: false,
      });
    },
  };

  function FriendStatusWithHooks(props) {
    const [isOnline, setIsOnline] = useState(null);

    useEffect(() => {
      function handleStatusChange(status) {
        setIsOnline(status.isOnline);
      }

      ChatAPI.subscribeToFriendStatus(
        props?.friend?.id || 32,
        handleStatusChange
      );
      // Specify how to clean up after this effect:
      return function cleanup() {
        ChatAPI.unsubscribeFromFriendStatus(
          props?.friend?.id || 32,
          handleStatusChange
        );
      };
    });

    if (isOnline === null) {
      return <p>Lodding...</p>;
    }
    return <p>{isOnline ? "Online" : "Offline"}</p>;
  }
  ```

  useEffect는 컴포넌트가 돔에 렌더링 된 후 호출 된다. 첫 번째 인자로는 훅 콜백을, 두 번째 인자로는 의존하는 변수들의 배열이다.

  `useEffect(callback, [name, age]);`
  위의 경우에는 `callback`이 `name`, 또는 `age`가 변경될 때만 호출된다.

  그리고 useEffect는 리턴 함수를 가질 수 있는데, 이 함수는 callback 함수가 실행되기 직전, 또는 컴포넌트가 unmount될 때 호출 된다. 이는 프로그램이 비정상적으로 종료되지 않은 한 실행됨을 보장하기 때문에 이벤트 해지등에 사용할 수 있다.

## Custom Hooks

---

커스텀 훅을 정의해서 사용하면 비즈니스 로직을 분리하여 재사용성을 높일 수 있다. 다음은 window의 width가 변화됨을 감지하여 width를 리턴하는 hook과 컴포넌트가 마운트 됨을 알리는 hook을 작성해보겠다.

- useWindowWidth

  ```jsx
  function useWindowWidth() {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
      const onResize = () => setWidth(window.innerWidth);
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
      };
    }, []);
  }
  ```

- useHasMounted

  ```jsx
  function useHasMounted() {
    const [hasMounted, setHasMounted] = useUstate(false);
    useEffect(() => {
      sethasMounted(true);
    }, []);
    return hasMounted;
  }
  ```

## Hook 사용 시 지켜야할 규칙

---

### 규칙 1: 하나의 컴포넌트에서 훅을 호출하는 순서는 항상 같아야 한다.

### 규칙 2: 훅은 함수형 컴포넌트 또는 커스텀 훅 안에서만 호출되어야 한다.

조건 문안에서, 반목문 안에서, 함수에서 사용하면 안된다.

- 퀴즈

  아래 컴포넌트가 처음 생성될 때 props.friend.count = 0 이고, props.friend.count가 1이 되면서 리렌더링 되는 상황에서 로깅을 어떻게 찍을까?

  ```jsx
  function FriendStatusWithHooks(props) {
    const [isOnline, setIsOnline] = useState(null);

    useEffect(() => {
      function handleStatusChange(status) {
        setIsOnline(status.isOnline);
        console.log(props.friend.count);
      }

      ChatAPI.subscribeToFriendStatus(
        props?.friend?.id || 32,
        handleStatusChange
      );
      // Specify how to clean up after this effect:
      return function cleanup() {
        ChatAPI.unsubscribeFromFriendStatus(
          props?.friend?.id || 32,
          handleStatusChange
        );
      };
    });

    if (isOnline === null) {
      return <p>Lodding...</p>;
    }
    return <p>{isOnline ? "Online" : "Offline"}</p>;
  }
  ```

  ![React%20Hooks%20cbf3d997cecb419fa570d0964d238629/_2020-01-26__12.44.35.png](React%20Hooks%20cbf3d997cecb419fa570d0964d238629/_2020-01-26__12.44.35.png)
