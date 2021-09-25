---
title: CSS 2. box model
date: '2020-01-16T08:56:56.243Z'
description: CSS Box 모델에 대해 알아봅시다.
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952589/tlog/cover/css-cover_eiiwob.jpg'
tags:
  - CSS
---

HTML의 모든 요소는 박스 모델을 사용한다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952584/tlog/box-model_cwmuxn.png)

## Box Model의 요소

### Content

요소의 텍스트나 이미지 등의 실제 내용이 위치하는 영역이다. width, height 프로퍼티를 갖는다.

### Padding

테두리(Border) 안쪽에 위치하는 요소의 내부 여백 영역이다. padding 프로퍼티 값은 패딩 영역의 두께를 의미하며 기본색은 투명(transparent)이다. 요소에 적용된 배경의 컬러, 이미지는 패딩 영역까지 적용된다.

### Border

테두리 영역으로 border 프로퍼티 값은 테두리의 두께를 의미한다.

### Margin

테두리(Border) 바깥에 위치하는 요소의 외부 여백 영역이다. margin 프로퍼티 값은 마진 영역의 두께를 의미한다. 기본적으로 투명(transparent)하며 배경색을 지정할 수 없다.

## width / height

width, height 프로퍼티는 요소의 너비와 높이를 지정하기 위해 사용한다. 기존적으로 콘텐츠 영역을 대상으로 하며, box-sizing의 값을 border-box로 주면 width / height가 content, padding, border 를 포함한 영역으로 크기를 주도록 한다.

 그리고 컨텐츠 영역 안에 inline 요소들이 컨텐츠의 영역보다 너 크면 삐져 나올 수 있다. 아래 그림을 보면 상단 박스는 내용물이 컨텐츠 영역 밖으로 삐져나온 것을 확인할 수 있다. 
 overflow: hidden; 을 주면 컨텐츠 영역 외로 넘어간 영역에 대해서 보이지 않게 할 수 있다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952581/tlog/_2020-02-16__4.32.03_bdm2xl.png)

## Border 타원으로 정의하기

---

그 동안 border 속성은 이미지를 원으로 자를 때 보통 사용 했었는데, 오늘 다시 보니까 타원으로 속성을 정의할 수 있나보다.

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    div {
      background: #eaeaed;
      color: #666;
      width: 300px;
      height: 150px;
      line-height: 150px;
      text-align: center;
    }
    .border-rounded {
      border-top-left-radius: 50px 25px;
    }
  </style>
</head>
<body>
  <div class="border-rounded">border-top-left-radius: 50px 25px</div>
</body>
</html>
```

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952581/tlog/_2020-02-16__4.39.16_llissz.png)

## collapse margin

---

특정 환경에서 margin이 충돌될 수 있다.

- 형제 요소들 간의 충돌

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
      div {
        width: 100px;
        height: 100px;
        margin: 100px;
      }

      div:nth-child(1) {
        margin: 50px;
        background-color: violet;
      }
      div:nth-child(2) {
        background-color: purple;
      }
    </style>
  </head>
  <body>
    <div>A</div>
    <div>B</div>
  </body>
  </html>
  ```

    ![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952597/tlog/margin-collapse1_fwhh4u.gif)

- 부모 자식간 마진 충돌

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
      div {
        /* display: inline-block; */
        width: 100px;
        height: 100px;
        margin: 100px;
        background-color: violet;
        margin: 100px;
      }
      
      div > div {
        margin: 25px;
        width: 50px;
        height: 50px;
        background-color: purple;
      }
    </style>
  </head>
  <body>
    <div>
      <div>B</div>
    </div>
    
  </body>
  </html>
  ```

    ![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952596/tlog/margin-collabse2_oeyqkh.gif)

    ![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952591/tlog/margin-collapse3_nf7dzh.gif)

## stitched

---

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>CodeSpitz css #1</title>
</head>
<style>
  .box {
    width: 100px;
    height: 100px;
    padding: 10px;
    border: 10px solid #000;
    display: inline-block;
  }

  .stitched {
    width: 100px;
    height: 100px;
    background: darkorange;
    border-radius: 15px;
    border: 1px dashed #fff;
    color: #fff;
    box-shadow: 0 0 0 10px darkorange;
    outline: 10px solid darkorange;
  }
</style>

<body style="width:500px">
  <div class="stitched">stitched</div>
</body>

</html>
```

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952581/tlog/_2020-02-16__5.06.23_ovnh0x.png)

## References

---

[CSS3 Box Model | PoiemaWeb](https://poiemaweb.com/css3-box-model)

[[CSS] Box Model](https://leesoo7595.github.io/css/2020/02/02/CSS_box_model/)