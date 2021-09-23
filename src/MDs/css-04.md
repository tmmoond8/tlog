---
title: CSS 4. background
date: '2020-05-12T08:56:56.243Z'
description: background 관련 속성 정리
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952589/tlog/cover/css-cover_eiiwob.jpg'
tags:
  - CSS
---

#

[CSS3 Background | PoiemaWeb](https://poiemaweb.com/css3-background)

background는 요소의 배경을 채울 때 사용한다.

background 에 관련된 속성이 꽤 많은데,

- background-image: 이미지를 넣을 수 있다.
- background-repeat: 이미지가 반복되게 설정할 수 있고, 기본이 반복
- background-size: 백그라운드 이미지로 사용한 값을 조절할 수 있는데, width, height를 명시적으로 지정하면 해당 크기로 줄어들게 된다. 이 과정에서 이미지의 비율이 손상될 수 있다. 그래서 사용하는 속성이 contain, cover
- background-attachment : 스크롤 되는 요소에도 정해진 크기로 이미지를 고정하는데 사용할 수 있다. 한 번도 사용해보지 않은 속성이다. [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/background-attachment)
  애플의 사이트가 이렇게 background 이미지를 고정하고 이미지를 교체하는 식으로 구현했겠구나..
- background-color: 배경에 색상을 넣는 것 그라데이션도 가능하겠지
- backbround-position: 이미지를 이동 시킬 수 있다. 만약 공간이 크고 이미지가 작다면, 공간내에 배치를 할 수 있고, 만약 이미지가 크고 공간이 적다면, 공간안에 보여줄 수 있도록 이동이 가능할 것이다. 후자의 경우 spites 이미지가 그 예다.
- backbround-clip: background 이미지는 box model에서 content, padding, border 의 공간까지 채울 수 있다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952591/tlog/_2020-02-23__7.46.28_lafdoz.png)

### background-shothand

```jsx
background: color || image || repeat || attachment || position;
```

background로 이미지를 넣는 것과 img 태그로 넣는 것의 가장 큰 차이점은 img 태그로 넣었을 때는 크롤러가 이미지로 인식하여 google에 노출한다든지 웹접근성을 위해 이미지를 읽어준다던지의 동작을 할 수 있다.

## References

---

[background-clip](https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip)

[background-attachment](https://developer.mozilla.org/en-US/docs/Web/CSS/background-attachment)
