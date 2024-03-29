---
title: Noticon 프로젝트 리뷰
date: '2020-08-17T08:56:56.243Z'
description: Noticon 서비스를 개발하면서 비용이 들지 않고 서비스하기 위한 노력에 대해
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1634918263/tlog/cover/_Noticon_%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8_%EB%A6%AC%EB%B7%B0_ay0aac.png'
tags:
  - Log
---

노션에서 사용할 아이콘을 저장하는 서비스

![](https://user-images.githubusercontent.com/11402468/92193883-59fcac00-eea4-11ea-86d6-f0c90956a827.gif)

[서비스링크](https://noticon.tammolo.com/)

[GitHub](https://github.com/tmmoond8/noticon)

### 기술 스택

- React
- Next.js
- Emotion
- TypeScript
- MobX
- Notion-UI
- react-easy-crop
- Google Sheets API (for simple database)
- Firebase realtime-database

### 만든 이유

나는 노션을 매우 좋아한다. 그리고 나는 페이지에 관련 주제 아이콘으로 정리하는 것을 좋아한다. 

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1634945838/tlog/vp4voqbbpajqmfcl1t8e.png)

그러나 많은 시간을 아이콘을 찾는데 시간을 쓰는 나를 발견했다. 적절한 아이콘도 별로 없고 또 너무 큰 이미지는 괜히 최적화가 안된 느낌이라 싫었다. 적절한 아이콘이 적당한 크기로 저장되어 있으면 좋을 텐데 하면서 직접 만들게 되었다.

## 서비스를 구성하면서 고민했던 부분

### 서버 대신 SpreadSheet API

---

아이콘 데이터를 저장할 서버는 필요했다. 삭제도 없고 수정도 없는 아주 단순한 API이기 때문에 직접 구현 하는 것은 어렵지 않다. 그러나 배포하는 것도 고려해야 하고 코드 관리도 해줘야 하기 때문에 일이 늘어난다. 관계형 데이터 베이스가 꼭 필요하지 않으면 대체 할 수 있는 다른 데이터 베이스를 사용하는 것을 좋아하는데, 여기에는 SpeadSheet API가 가장 적절해 보였다. 

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1634945839/tlog/le2h7iganxbi9t04tcax.png)

위 처럼 테이블 형태로 쉽게 볼 수 있으면서, 데이터 수정도 매우 쉽다. 심지어 폰에서도 데이터 수정을 손쉽게 할 수 있다. 다만, 데이터가 많든 적든 속도는 매우 느린 것은 단점이다. (이 부분은 캐시 서버를 두어서 개선할 수 있다.)

### 이미지 저장은 Cloudinay로

---

이미지 저장하는 서비스는 매우 많다. 너무 많기 때문에 나에게 최적화된 서비스를 고르는 것은 매우 어렵다. 나는 실제로 이미지 저장 서비스를 고르는데 가장 많은 시간을 사용했다. Cloudinary는 정말 좋은 서비스고 다양한 기능을 제공한다. 그 중에 내가 고려했던 부분에 대해서 얘기해 보겠다.

**무료 플랜을 제공 -** 나는 이미지 자체도 매우 작게 변환하여 사용하기 때문에 많은 대역폭을 사용하지 않는다. 또 이미지 업로드도 많이 발생하지는 않았다.

클라이언트에서 쉽게 업로드 하는 API 제공 - Cloudinary는 unsined 업로드를 사용하여 손쉽게 사용자가 새로운 아이콘을 업로드 할 수 있다. 나는 서버가 없기 때문에 이 부분은 필수였고, API 문서도 꽤 간단했다.

이미지 크기 변환 - Cloudinary는 정말 다양한 사진 편집 기능을 제공한다. preset으로 미리 작성 해놓으면, 설정한 preset으로 이미지가 저장되어 편했다. 또, cloudinary는 gif 도 crop하는 기능을 제공했는데 이 기능이 있었기 때문에 Noticon에 gif도 사용할 수 있었다.

그러나 전혀 문내가 없던 것은 아니었다. ****서비스를 운영하다 보니 전체 무료 플랜의 30% 가량을 사용 했는데, gif가 꽤 많은 부분을 차지 했다. 이대로는 장기적으로 유료 플랜으로 전환이 필요할 수 있었다. 그 즉시 매달 100$를 결제해야 하기 때문에 사용자가 늘어나는 것에 대한 대비가 필요했다. 이 과정에서 다른 서비스도 찾아보았지만, 적절한 대안을 찾을 수 없었다.

또 다른 문제로는 크롬의 확장 프로그램인 AdBlock 이  [cloudinary.com](http://cloudinary.com) 도메인 블락 하는 것이었다. 물론 얼마든지 옵션을 끌 수 있지만, 해당 페이지에 있는 아이콘이 사용자에 따라 안 보일 수 있는 문제점이 있었다. 이 문제는 서비스 운영 초창기 부터 있었지만, 일 년이 지난 시점에도 방치되어 있었다.

### Cloudfront로 이미지 캐시

---

이 부분이 해결 된 지는 글을 작성하는 시점에서 일주일도 안되었다. 나는 이전에 Cloudfront(CF)로 S3 버킷을 캐싱한 적은 있다. 나는 그동안 CF가 AWS 서비스만 캐시할 수 있다고 생각했었는데, 다른 도메인도 얼마든지 연결할 수 있었다. 

  [cloudinary.com](http://cloudinary.com) 에서 커스텀 도메인을 사용하려면 유료 플랜을 사용해야 한다고 가이드 되어 있어서 다른 도메인으로 접근하면 이미지가 안 보여질 것이라 생각했다.

 그러나 CF에 [cloudinary.com](http://cloudinary.com) 을 연결 했는데, 너무나 잘 작동했다. 이것으로 위에서 언급된 Cloudinary의 무료 플랜 안에서 서비스할 수 있게 되었고, Adblock을 통해 블락 당하는 문제도 동시에 해결되었다.

현재는 NHN Cloud의 CDN을 사용하고 있다. AWS의 쓴맛을 느끼고 유료 서비스를 사용하고 있다. 좋은 대체제로 Cloudflare가 있다.

### Notion-UI 개발 및 적용

---

Noticon 초기 버전에서는 Notion의 UI 를 지향 하면서도 , Notion 만큼의 유려한 디자인은 아니었다. 서비스가 운영된 지 1년이 지난 시점에서야 UI 시스템 부터 다시 개발 하였다. 

[스토리북](https://notion-ui.tammolo.com/?path=/story/aside--aside-default)

[GitHub](https://github.com/tmmoond8/notion-ui)

아직 외부에서 사용할 정도로 디자인 시스템으로서 완성도가 있는 것은 아니지만, Noticon 서비스에 적용한 것은 매우 만족스러웠다. 또 UI 시스템에서 Dark Theme 고려하여 개발 하였기 때문에 자연스럽게 Dark Theme도 적용되었다.

### 클라이언트에서 이미지 편집을 위한  react-easy-crop

---

초기 버전에서는 이미지를 선택하고 Cloudinary에 올리면 정사각형으로 만들기 위해 양쪽을 자르고 가운데만 남기도록 되어 있었다. 그렇기 때문에 사용자가 이미지를 잘못 등록하게 되는 일이 많이 발생했다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1634945838/tlog/eyw6q8njhwb9q3mtoox3.png)

react-easy-crop을 사용하여 원하는 부분을 원하는 크기로 자를 수 있도록 했다. 구현할 때는 계산하는 부분 때문에 고생했지만, 결과적으로는 아주 잘 동작하여 마음에 듭니다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1634945966/tlog/ezgif-7-6c9690344f44_oauq38.gif)

### 서브 데이터 베이스로서 Firebase realtime-database

---

 Cloudinary를 사용하면서 하나 아쉬운 점이 있었다. 사용자가 많이 사용한 아이콘을 노출하고 싶었는데, Cloudinary에서는 대쉬보드에서는 확인할 수 있었지만 API로 제공하지 않았다. 현재 서버가 없는 아키텍쳐이기 때문에 가능한 방법을 모색해야 했다. 이 부분에서는 Firebase의 realtime-database(RD)를 사용했다. RD는 키에 따른 값을 저장하기 때문에 자연스럽게 특정 icon의 key에 사용자가 클릭할 때마다 1씩 증가하여 업데이트 하는 형태로 구현했다. 이렇게 함으로써 레코드 수가 계속해서 증가하는 문제도 막을 수 있다.

### 고민도 필요 없는 부분

---

배포는 [Netlify](https://www.netlify.com/) 에서 한다. CI/CD 와 사용성 좋은 UI를 제공하기 때문에 정말 사랑한다. 근래에는 Next.js를 개발한 팀으로 유명한 Vercel에서 [Vercel](https://vercel.com/tmmoond8)이라는 배포 서비스를 사용하는 것도 선호한다. Netlify는 한국리전을 사용하지 않는 반면 Vercel은 한국 리전이 있어서 매우 빠른 서비스를 제공할 수 있다.

Noticon은 내가 만든 개인 프로젝트 중에 가장 많은 관심을 받은 서비스 이다. 그리고 나 스스로도 매우 의미있고 좋아하는 서비스 이다. 노션을 사용하시면서 아이콘을 찾으려고 시간을 허비하셨던 경험이 있으시다면, 사용해보기 추천한다.