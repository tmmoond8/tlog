---
title: JS 비동기 처리
date: '2020-03-14T08:56:56.263Z'
description: JavaScript에서 비동기 처리
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632298243/tlog/cover/_____JS_1_jbq8ea.png'
tags:
  - JavaScript
---


[Ajax | PoiemaWeb](https://poiemaweb.com/js-ajax)

> Ajax(Asynchronous JavaScript and XML)는 자바스크립트를 이용해서 비동기적(Asynchronous)으로 서버와 브라우저가 데이터를 교환할 수 있는 통신 방식을 의미한다.

전체 웹 페이지를 다시 불러 오지 않은 채로 점진적으로 또 부분적으로 그 사용자 인터페이스(와 페이지 내용)를 갱신할 수 있다.

흥미로웠던것은 Ajax가 ActiveX가 원형이라는 것,,

```jsx
var httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function() {
  // 요청에 대한 콜백
  if (httpRequest.readyState === xhr.DONE) {
    // 요청이 완료되면
    if (httpRequest.status === 200 || httpRequest.status === 201) {
      console.log(httpRequest.responseText);
    } else {
      console.error(httpRequest.responseText);
    }
  }
};
httpRequest.open("GET", "http://www.example.org/some.file", true);
httpRequest.send();
```

send에는 우리가 보내고 싶은 body 내용 들.

```jsx
httpRequest.setRequestHeader(
  "Content-Type",
  "application/x-www-form-urlencoded"
);
xhr.setRequestHeader("Accept", "application/json");
httpRequest.send("age=15&from=korea");
```

Response

---

- `http_request.responseText` – 서버의 응답을 텍스트 문자열로 반환할 것이다.
- `http_request.responseXML` – 서버의 응답을 `XMLDocument` 객체로 반환하며 당신은 자바스크립트의 DOM 함수들을 통해 이 객체를 다룰 수 있을 것이다.

JSON 형태라면 `JSON.parse(httpRequest.responseText)` 로 손쉽게 객체로 만들어낼 수 있다.

사용할 일은 거의 없겠지만 XML이라면,,

```jsx
<?xml version="1.0" ?>
<root>
    I'm a test.
</root>

var xmldoc = httpRequest.responseXML;
var root_node = xmldoc.getElementsByTagName('root').item(0);
alert(root_node.firstChild.data);
```

### 크로스 도메인 이슈 (CORS)

웹 개발시 주요한 이슈중 하나로, 웹 개발을 하다보면 어떤 경로던 이 이슈를 마주하게 된다.
동일 출처 정책(same-origin-policy)은 하나의 웹 페이지에서 다른 도메인 서버에 요청하는 것을 제한하는 것이다. 제한하는 이유는 간단한데, 내가 네이버라고 가정해보자.
누군가 다른 포탈 서비스를 만들고, 네이버에서 검색한 결과만 가져온다면 문제가 되지 않을까? 때문에 보통의 브라우저에서는 외부 도메인으로의 Ajax로 요청을 보낼 때, cors를 체킹한다.
아래는 크롬에서 발생하는 cors 에러창이다.

그런데 어떤 경우에는 이러한 제한이 또다른 문제를 발생시킨다는 것이다. 이번엔 내가 카카오라 하자. 카카오톡 앱에서는 #검색으로 다음에서의 검색 결과를 가져오는 서비스가 있다. 이때, 다음과 카카오는 다른 도메인을 사용하기 때문에 cors문제가 발생하게 된다. 특정 사용자에게는 허용을 해줘야 하는 경우가 생기게 된다.
(심지어 https://abc.com:8080과

[https://abc.com:8888](https://abc.com:8888/)

사이에서도 CORS문제는 발생한다!!!)

이러한 문제를 해결할 수 있는 여러 방법들이 있지만, 제일 일반적인 방법인 헤더를 이용하는 방법과 jsonp에 대해서 소개한다.
먼저 헤더를 이용하는 방법이다.

- `response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");`
- POST, GET, OPTIONS, DELETE 요청에 대해 허용하겠다는 의미.
- `response.setHeader("Access-Control-Max-Age", "3600");`
- HTTP Request 요청에 앞서 Preflight Request 라는 요청이 발생되는데, 이는 해당 서버에 요청하는 메서드가 실행 가능한지(권한이 있는지) 확인을 위한 요청. Preflight Request는 OPTIONS 메서드를 통해 서버에 전달된다. (위의 Methods 설정에서 OPTIONS 를 허용해 주었다.)

여기서 Access-Control-Max-Age 는 Preflight request를 캐시할 시간. 단위는 초단위이며, 3,600초는 1시간. Preflight Request를 웹브라우저에 캐시한다면 최소 1시간동안에는 서버에 재 요청하지 않음.

- `response.setHeader("Access-Control-Allow-Headers", "x-requested-with");`
  이는 표준화된 규약은 아니지만, 보통 AJAX 호출이라는 것을 의미하기 위해 비공식적으로 사용되는 절차. JQuery 또한 AJAX 요청 시, 이 헤더(x-requested-with)를 포함하는 것을 확인하실 수 있음. 여기서는 이 요청이 Ajax 요청임을 알려주기 위해 Header 에 x-request-width를 설정. Form을 통한 요청과 Ajax 요청을 구분하기 위해 사용된 비표준 규약지만, 많은 라이브러리에서 이를 채택하여 사용. (참고로 HTML5 부터는 Form 과 Ajax 요청을 구분할 수 있는 Header가 추가됨.)
- `response.setHeader("Access-Control-Allow-Origin", "*");` \* 는 모든 도메인에 대해 허용하겠다는 의미. 즉 어떤 웹사이트라도 이 서버에 접근하여 AJAX 요청하여 결과를 가져갈 수 있도록 허용하겠다는 의미.
  만약 보안 이슈가 있어서 특정 도메인만 허용해야 한다면 \* 대신 특정 도메인만을 지정할 수 있음.

출처: [이러쿵저러쿵](http://ooz.co.kr/232)

### JSONP

CORS를 해결하는 유명한 방법 중 하나가 JSONP를 사용하는 것이다
jsonp의 원리는 다음과 같다.

> <script/> 태그는 same-origin-policy (SOP) 정책에 속하지 않는다는 사실을 근거로, 서로 다른 도메인간의 javascript 호출을 위하여 jsonp (JSON with Padding) 이 사용되었다.
> jsonp를 사용하기 위해서는 필수적으로 서버단에서 jsonp의 포맷을 따라야한다. 이것은 jsonp를 사용하기 위한 “규칙”이다.

```html
<script
  type="text/javascript"
  src="<http://kingbbode.com/result.json>"
></script>
```

html 문서에 script태그는 보안 정책에 적용되지 않는 점을 이용한 것

```html
<script
  type="text/javascript"
  src="<http://kingbbode.com/result.json?callback=parseResponse>"
></script>
```

여기서 script 태그는 javascript 내용을 `포함`시킨 것이 아니라 `실행`시킨 것이다.
아래 코드는 jsonp를 호출할 script태그를 동적으로 생성하는 코드다. 물론 생성과 동시에 실행시킨다.

```jsx
var script = document.createElement("script");
script.src = "//kingbbode.com/jsonp?callback=parseResponse";
document.getElementsByTagName("head")[0].appendChild(script);
function parseResponse(data) {
  //callback method
}
```

그러나 jsonp는 서버에서 지원하지 않으면 사용할 수 없다.
parseResponse함수가 실행되려면 script태그는 다음과 같아야 한다.

```html
<script type="text/javascript">
  parseResponse({ Name: "Foo", Id: 1234, Rank: 7 });
</script>
```

서버에서는 요청된 내용을 json형태의 응답을 만들어 callback 파라미터로 전달 받은 콜백이름을 래핑하여 위와 같은 응답을 내려준 것이다.

출처: [Seotory](https://blog.seotory.com/post/2016/04/understand-jsonp), [개발노트 - kingbbode](http://kingbbode.tistory.com/26)

참조:

---

여기까지가 인터뷰에서 질문에 대한 정리입니다. 웹 개발자 면접을 준비하시는 분들에게 도움이 되었으면 좋겠다.

참고

---

[javascript ajax 통신, jsonp 의 모든 것](https://blog.seotory.com/post/2016/04/understand-jsonp)

[HTTP 접근 제어 (CORS)](https://developer.mozilla.org/ko/docs/Web/HTTP/Access_control_CORS)

[JSONP 알고 쓰자](https://kingbbode.tistory.com/26)

같이 읽어볼만 한 것

---

[웹 애플리케이션의 새로운 패러다임, Ajax (상)](http://blog.naver.com/PostView.nhn?blogId=gachoori&logNo=140038444029&parentCategoryNo=&categoryNo=8&viewDate=&isShowPopularPosts=false&from=postView)
