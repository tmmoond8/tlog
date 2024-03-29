---
title: 웹 사이트 favicon 만들기
date: '2019-07-14T08:56:56.243Z'
description: 웹 사이트에 적용할 favicon 만들어보기, favicon.io
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632299731/tlog/cover/html_m3iecp.jpg'
tags:
  - HTML
---

웹페이지는 favicon을 대표 이미지로 갖도록 한다. 이번에 favicon을 만들려고 zeroCho님의 블로그를 확인하였다. 하나의 파일이지만, 맥에서 확인해보면 여러 이미지로 구성되어 있는 것을 확인할 수 있다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952591/tlog/_2019-07-07__4-3b72ebcd-68b7-4eb2-a127-9cd5c5d6495c.40.20_nksewy.png)

원래 .ico 포맷은 윈도우 시스템에서 아이콘을 표현하기 위해 고안된 포맷이다. 이미지를 시스템의 해상도에 따라 표현하기 위해서 고안되었다. 생각해보면, 64bit 컬러 256 컬러 이런 식으로 굉장히 비약적인 발전을 하고 있었으므로 시스템에서 깨지지 않기 위해 해상도에 따라 세세하게 관리하기 위함이라 이해할 수 있다.

https://en.wikipedia.org/wiki/ICO_(file_format)


어떻게 이렇게 만드나 이런 저런 사이트를 알아보니 만들어 주는 사이트를 찾아냈다.

[https://favicon.io/favicon-converter/](https://favicon.io/favicon-converter/)

들어가서 이미지를 올리고 변환해서 다운받으면 아래 처럼 만들어 준다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952592/tlog/_2019-07-07__4-c94d6fe2-bd11-4bfe-9a7b-bf967d60a2e9.49.06_khb6hg.png)

html head 부분에 shortcut icon으로 값을 넣어주면 된다.
```html
<link rel="shortcut icon" href="/favicon.ico">
```