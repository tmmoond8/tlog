---
title: RN에서 로컬데이터 사용하기 (AsyncStorage)
date: '2022-01-21T08:56:56.263Z'
description: 브라우저의 LocalStorage 처럼 RN 앱에서도 스토리지를 사용해보자.
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1641910411/tlog/cover/rn_cks99r.png'
tags:
  - React Native
---
# 

브라우저에서 클라이언트에 데이터를 저장할 때는 `LocalStorage`를 썼는데, 리액티브 네이티브에서도 비슷한 목적의 스토리지를 제공한다. 바로 `AsyncStorage`인데, 리액트 네이티브에서 제공하는 key-value 형식의 저장소로, iOS는 네이티브 코드로 구현되어 있고, 안드로이드는 네이티브 코드와 SQLite를 기반으로 구현되어 있다.

 이름에서 알다 시피, 데이터를 조작하면 비동기로 동작하기 때문에 Promise를 반환하게 된다는 점을 기억해야 한다.

```bash
$ yarn add @react-native-community/async-storage

$ cd ios && pod install
```

```jsx
import AsyncStorage from '@react-native-community/async-storage';

try {
  await AsyncStorage.setItem('key', 'value');
} catch(error) {
  // 에러 처리
}
```