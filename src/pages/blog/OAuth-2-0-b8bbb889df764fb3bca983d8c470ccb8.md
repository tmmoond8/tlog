---
templateKey: blog-post
title: OAuth 2.0
date: 2020-01-22T08:56:56.263Z
description: OAuth 2 개념
featuredpost: true
featuredimage: /img/oauth-2.0.png
tags:
  - oauth
  - react
---
# 

[](https://www.notion.so/asdsadsad-77005307bf1d401e8bfb817b9b0ef725)

몇 번 되내이며 읽고 있지만, OAuth 1.0 부터 설명하는데 지루하고 집중이 잘 되지 않는다.

[NAVER D2](https://d2.naver.com/helloworld/24942)

![OAuth%202%200%20b8bbb889df764fb3bca983d8c470ccb8/_2019-09-29__5.49.55.png](OAuth%202%200%20b8bbb889df764fb3bca983d8c470ccb8/_2019-09-29__5.49.55.png)

출처 : NAVER D2

## Authentication, Authorization


Authentication(인증)과 Authorization(허가)는 구분되는 개념이다. OAuth의 주요 목적은 Authorization(허가)다. 조금 헷갈릴 수 있지만, 소유자인지 확인하는 것이 아니라 쓰기 권한이 있는지 읽기 권한이 있는지 확인하는 것이다. 이 과정에서 Authentication(인증) 절차를 진행한다.

## OAuth 1.0 인증 과정


먼저 OAuth 1.0에서 등장 하는 용어를 먼저 정리하자. 이해를 높이기 위해 카카오 로그인을 통해 배그 게임을 하는 Kim를 생각하자.

- User : kim으로 카카오 계정이 있는 사용자
- Service Provider : 카카오로 OAuth를 제공하는 주체
- Consumer : 배그로 카카오에서 제공한 OAuth를 사용한다.
- Request Token : 배그가 카카오에게 접근 권한을 확인 받으려 할 때 사용하는 값으로 인증이 완료되면 Access Token으로 교환된다.
- Access Token : 인증 후 배그가 카카오로 Access Token을 보내면 카카오가 사용자 정보를 내려준다.

![OAuth%202%200%20b8bbb889df764fb3bca983d8c470ccb8/oauth-2.0-image-1.png](OAuth%202%200%20b8bbb889df764fb3bca983d8c470ccb8/oauth-2.0-image-1.png)

### Step 0 배그에서 먼저 카카오계정으로 로그인 하기 위해 등록해야 한다.

등록하면 카카오에서 oauth_consumer_key를 발급 한다.

### Step A, B, C 배그를 하기 위해 킴은 카카오계정으로 로그인을 눌렀다.

![OAuth%202%200%20b8bbb889df764fb3bca983d8c470ccb8/oauth-2.0-image-2.png](OAuth%202%200%20b8bbb889df764fb3bca983d8c470ccb8/oauth-2.0-image-2.png)

- 파라미터

    ```python
    oauth_callback=http://example.com/oauth
    oauth_consumer_key=skdJ78dHd
    oauth_nonce=soidUd8dhdus38fI
    oauth_signature=dki738Jdudn
    oauth_signature_method=HMAC-SHA1
    oauth_timestamp=1398384934
    oauth_version=1.0
    ```

- Request Token

    ```python
    oauth_token
    oauth_token_secret
    oauth_callback_confirmed
    ```

배그는 미리 발급 받은 oauth_consumer_key등을 포함하여 파라미터를 카카오로 보내게 되고 카카오는 전달 받은 값들을 검증하고 Request Token을 발급한다. 배그는 사용자에게 카카오로 로그인 하도록 페이지를 연결해준다.

- oauth_callback : 카카오로 로그인 후 리다이렉트 할  배그의 웹주소로 카카오에서 리다이렉트할 주소로 인증 결과를 파라미터에 포함한다.
- oauth_consumer_key : 배그에서 카카오로그인을 사용하려면 미리 앱을 등록 하여 키를 발급 받게 되는데 그게 oauth_consumer_key다.
- oauth_nonce : 배그에서 임시로 생성하는 문자열로 악의적인 목적으로 계속 요청을 보내는 것을 막기 위해서 사용하기 때문에 같은 timestamp에서 유일한 값 이어야 한다.
- oauth_signature : OAuth 인증 정보를 암호화하고 인코딩하여 서명한 값. oauth_signature를 제외한 나머지 파라미터를 포함한다. 암호화 방식은 oauth_signature_method에 정의된다.
- oauth_signature_method : HMAC-SHA1, HMAC-MD5 등의 사용할 암호화 방식
- oauth_timestamp : 요청을 생성한 시점의 타임 스탬프
- oauth_version : 버전 정보로 1.0a도 1.0이라고 명시 하면 된다.

### Step D, E, F, G 사용자는 카카오로 로그인한다.

![OAuth%202%200%20b8bbb889df764fb3bca983d8c470ccb8/oauth-2.0-image-3.png](OAuth%202%200%20b8bbb889df764fb3bca983d8c470ccb8/oauth-2.0-image-3.png)

![OAuth%202%200%20b8bbb889df764fb3bca983d8c470ccb8/_2019-09-29__7.30.34.png](OAuth%202%200%20b8bbb889df764fb3bca983d8c470ccb8/_2019-09-29__7.30.34.png)

사용자가 로그인을 하면 배그에 정보 제공을 할 지 여부를 체크 한다. (이미 동의 했다면 생략한다.)

카카오 인증을 마치면 카카오는 oauth_callback로 리다이렉트 한다. 이 때 카카오는 새로운 oauth_token과 oauth_verifier 를 함께 배그로 보내준다.

배그에서는 Access Token을 발급 요청을 보낸다. 요청에는  방금 받은 oauth_token과 oauth_verifier 그리고 Request Token을 만들었을 때 쓴 파라미터를 포함한다.

- 파라미터

    ```python
    oauth_consumer_key=skdJ78dHd
    oauth_nonce=soidUd8dhdus38fI
    oauth_signature=dki738Jdudn
    oauth_signature_method=HMACSHA1
    oauth_timestamp=1398384934
    oauth_version=1.0
    oauth_verifier=dsisdd8sjdi
    oauth_token=sdj38diJ7dbnJ
    ```

요의 파라미터와 함께 Access Token를 요청하고, oauth_token과 oauth_token_secret을 전달 받는다. 또 추가적으로 요청한 사용자의 정보도 함께 받환하기도 한다.

드디어 Access Token을 사용할 수 있게 되었다. 만약 카카오 로그인을 하면서 카카오 친구 목록을 가져와서 배그에서 친구로 추가 하려고 한다. 요청 메시지를 간략화 해보겠다.

```python
POST /user/friends.json HTTP/1.1  
Authorization: OAuth oauth_consumer_key="skdJ78dHd",oauth_token="sdj38diJ7dbnJ"  
,oauth_signature_method="HMACSHA1",oauth_timestamp="1398384934",oauth_nonce="soidUd8dhdus38fI",oauth_signature="dki738Jdudn"
Accept-Encoding: gzip, deflate  
Connection: Keep-Alive  
Host: http://openapi.kakao.com
```

요청을 할 때, Acess Token만 사용하는 것

Access Token을 이용해 요청할 때, Service Provider에 따라 realm이라는 매개변수를 사용해야 하는 경우도 있다. realm은 optional 매개변수인데, WWW-Authenticate HTTP 헤더 필드에서 사용하는 값이다.

## OAuth 2.0

> OAuth 1.0은 웹 애플리케이션이 아닌 애플리케이션에서는 사용하기 곤란하다는 단점이 있다. 또한 절차가 복잡하여 OAuth 구현 라이브러리를 제작하기 어렵고, 이런저런 복잡한 절차 때문에 Service Provider에게도 연산 부담이 발생한다.   - D2 -

OAuth 2.0의 특징은 다음과 같다.

- 웹 애플리케이션이 아닌 애플리케이션 지원 강화
- 암호화가 필요 없음 HTTPS를 사용하고 HMAC을 사용하지 않는다.
- Siganature 단순화 정렬과 URL 인코딩이 필요 없다.
- Access Token 갱신 OAuth 1.0에서 Access Token을 받으면 Access Token을 계속 사용할 수 있었다. 트위터의 경우에는 Access Token을 만료시키지 않는다. OAuth 2.0에서는 보안 강화를 위해 Access Token의 Life-time을 지정할 수 있도록 했다.

### OAuth 2.0에 참여하는 4개의 주체


현재 OAuth 2.0가 드래프트 단계에 있고, 구조나 절차는 유지가 되겠지만 주체의 명칭을 조금 차이가 있을 수 있다.

- Resource Owner : 사용자 (1.0 User해당)
- Resource Server : REST API 서버 (1.0 Protected Resource)
- Authorization Server : 인증서버 (API 서버와 같을 수도 있음)(1.0 Service Provider)
- Client : 써드파티 어플리케이션 (1.0 Consumer 해당)