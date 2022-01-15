---
title: RN 에서 uuid 사용하기
date: '2021-12-28T08:56:56.263Z'
description: uuid 라이브러리는 node.js의 내장 모듈인 crypto를 사용하도록 되어 있어서 RN 환경에서는 별도 모듈 설치가 필요하다.
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1641910411/tlog/cover/rn_cks99r.png'
tags:
  - React Native
---

웹에서는 uuid 모듈을 이용하여 랜덤 문자열을 손쉽게 만들 수있다 . 그런데 RN 환경에서는 조금 문제가 될 수 있는데, uuid 라이브러리는 node.js의 내장 모듈인 crypto를 사용하도록 되어있는데 RN에는 없기 때문에 `react-native-get-random-values` 모듈을 추가해 줘야 한다.

```jsx
$ yarn add react-native-get-random-values
$ cd ios && pod install
```

- index.js 에 설치한 모듈을 임포트 하자.

```jsx
...
import 'react-native-get-random-values';
...
```