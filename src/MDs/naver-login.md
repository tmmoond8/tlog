---
title: Naver Login in React
date: '2019-11-29T08:56:56.263Z'
description: React에서 네이버 로그인 사용하기
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952584/tlog/cover/naver-login_m0doid.png'
tags:
  - OAuth
  - React
---

#

네이버 로그인은 react용 모듈이 존재하지 않았다. 뭔가 개발하기가 까다로운 느낌이었다.

---

네이버 로그인에 앞서 .env를 next.js에서 사용하는게 조금 다른것 같다.

우리가 사용한 방식은 dotenv모듈을 사용하는 방법이었는데, next.js에서는 dotenv-webpack 을 사용하도록 가이드 한다. 웹팩에 dotenv를 꼽아서 사용하나 보다.

[https://github.com/zeit/next.js/tree/canary/examples/with-dotenv](https://github.com/zeit/next.js/tree/canary/examples/with-dotenv)

일단 우리 프로젝트에서는 .env를 사용할 변수로, .env.default를 환경 변수 가이드 파일로 사용하면 될 것 같다.

[https://developers.naver.com/apps](https://developers.naver.com/apps)

Application 탭에 가서 권한을 설정 하자. 여기서 주의해야 할 점은

[localhost](http://localhost) 대신 127.0.0.1 처럼 IP로 넣어야 하는 점이다.

우리 서비스에서는 허용하는 웹URL을 [http://127.0.0.1:3000](http://127.0.0.1:3000/), 성공 콜백을 [http://127.0.0.1:3000](http://127.0.0.1:3000/)/login?naver=true로 했다. 쿼리로 naver=true를 준 것을 기억하자.

적용 가이드가 있다. 인터넷에는 이전 버전 기준으로 설명하는 블로그가 많다. 헷갈리는 부분이다.

[https://developers.naver.com/docs/login/web/#2--javascript로-네이버-아이디로-로그인-적용하기](https://developers.naver.com/docs/login/web/#2--javascript%EB%A1%9C-%EB%84%A4%EC%9D%B4%EB%B2%84-%EC%95%84%EC%9D%B4%EB%94%94%EB%A1%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0)

간단하게 로직을 설명하면

html에 다음과 같이 naverIdLogin이라는 id의 엘리먼트를 만듭니다.

1.  [https://developers.naver.com/main/](https://developers.naver.com/main/) 에서 네아로 를 사용할 어플리케이션을 등록한다.
2.  `<div id="naverIdLogin"></div>` 처럼 html에 버튼이 들어갈 엘리먼트를 만든다.
3.  html에 스크립트를 삽입한다.

        <script type="text/javascript" src="[https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.0.js](https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.0.js)" charset="utf-8"></script>

4.  네아로에서 설정한 셋팅 값으로 초기화를 한다.

        var naverLogin = new naver.LoginWithNaverId(
        		{
        			clientId: "개발자센터에 등록한 ClientID",
        			callbackUrl: "개발자센터에 등록한 callback Url",
        			isPopup: false, /* 팝업을 통한 연동처리 여부 */
        			loginButton: {color: "green", type: 3, height: 60} /* 로그인 버튼의 타입을 지정 */
        		}
        	);

        	/* 설정정보를 초기화하고 연동을 준비 */
        	naverLogin.init();

5.  로그인 결과 처리를 위한 이벤트를 등록한다.

        window.addEventListener('load', function () {
        			naverLogin.getLoginStatus(function (status) {
        				if (status) {
        	        // 로그인 성공
        				} else {
        					console.log("callback 처리에 실패하였습니다.");
        				}
        			});
        		});

성공 콜백을 [http://127.0.0.1:3000](http://127.0.0.1:3000/)/login?naver=true로 준 이유.

OAuth로 로그인 API는 있지만 로그아웃은 없다. 그 이유는 로그아웃 시켜버리면 원래 서비스 (네이버면 네이버 포탈) 서비스에서도 로그아웃이 되기 때문에 원래 서비스에 영향을 미치기 때문이다. 그렇기 때문에 로그인 쿠키 정보는 [http://127.0.0.1:3000](http://127.0.0.1:3000) 에 남아 있지만 우리 어플리케이션 상에서만 로그인 정보를 없애서 로그인 처리를 한다. 이렇게 네이버 쿠키가 남고 우리 애플리케이션에서는 로그아웃 한 후 /login 에 접근을 하면 네아로 초기화를 한다. 그런데 이 때 기존의 쿠기 정보가 있기 때문에 바로 로그인을 해버린다. 쿠키 정보가 남았지만, 구글이나 카카오 처럼 다른 서비스로 로그인을 하려고 할 때 문제가 생긴다. ( 내 계정을 로그인한 피씨에서 다른 사람의 계정으로 로그인할 때 그럴때 문제가 생길 것이다.)

    	if (status && naver) {
        // 로그인 성공
    	}

이렇게 해놓으면 단순히 [http://127.0.0.1:3000](http://127.0.0.1:3000/)/login 로 접근했을 때는 로그인 성공 처리가 되지 않고,

버튼을 누른 후 [http://127.0.0.1:3000](http://127.0.0.1:3000/)/login?naver=true 로 들어올 때만 로그인 성공을 한다.

리액트에서 네이버 로그인을 어떻게 구현할까 고민했다. 일단 react에 맞는 naver로그인이 잘되는게 없었다.

이런 저런 방법으로 하다가 하나의 컴포넌트에서 기능이 되도록 고민을 했다.

    componentDidMount() {
    	if(process.browser) {
    		const script = document.createElement('script');
    		script.src = "https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.0.js";
    		script.async = true;
    		this.ref.appendChild(script);
    		const initLoop = setInterval(() => {
    			if(window.naver) {
    				initLoginButton(this.props)
    				clearInterval(initLoop);
    			}
    		}, 300);
    }}

    // initLoginButton는 위 초기화 하고 성공 이벤트 등록하는 부분

진행하면서 authStore의 존재여부 가 무의미 하다고 느낌.
