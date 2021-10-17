---
title: Apple Login for Web (하) - Node + React 구현
date: '2021-10-17T08:56:56.263Z'
description: 리액트 + Node 서버에서 애플 로그인 
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633702737/tlog/cover/apple-og_mrjifu.jpg'
tags:
  - OAuth
  - React
---

> 리액트 서비스에서 애플로그인을 구현하면서 겪었던 경험을 기록한 내용입니다. 소셜 로그인에 대해서 대해서는 설명하지 않으며, 만약 개념이 필요하면 [OAuth 에 대한 포스팅](https://tlog.tammolo.com/posts/oauth2.0)을 먼저 학습해보는 것을 권장합니다.
소셜 로그인은 일반적인 플로우대로 구현하면 되지만, 애플 로그인에서 조금 달랐던 2개의 지점을 얘기해보겠습니다.

이 가이드는 [애플 로그인을 위한 키 발급](https://tlog.tammolo.com/posts/apple-login-01)이 선행되었다는 전제로 작성한 글 입니다.

애플 로그인에 대해서 많은 글을 참조 했지만, 그 중 [sign with apple js](https://github.com/hmmhmmhm/how-to-using-sign-with-apple-js) 포스팅을 가장 큰 도움이 되었다.

애플 로그인은 클라이언트 사이드에서 검증 하는 것과 서버가 검증하는 것 두 가지가 있는데, 서버 사이드에서 검증하는 것으로 구현했다. 먼저 플로우를 살펴보자.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1634458571/tlog/v3gdux1i9p0pvffs04nf.png)

[https://support.apple.com/](https://support.apple.com/)

나의 경우 `인증 요청`과 `인증 검증` 부분을 분리했는데, 다른 소셜 로그인에서 동일한 플로우로 구현하기 위함이다.

## 인증 요청

### **클라이언트 사이드**

클라이언트는 상대적으로 간단하게 작성을 하면 된다. 요청 부분과 인증 정보를 처리하는 부분이다.

```jsx
const config = {
  client_id: APPLE_LOGIN_CLIENT_ID, // This is the service ID we created.
  redirect_uri: APPLE_LOGIN_REDIRECT_URL, // As registered along with our service ID
  response_type: "code id_token",
  state: "origin:web", // Any string of your choice that you may use for some logic. It's optional and you may omit it.
  scope: "name email", // To tell apple we want the user name and emails fields in the response it sends us.
  response_mode: "form_post",
  m: 11,
  v: "1.5.4",
};
const queryString = Object.entries(config).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');

showLog();
location.href = `https://appleid.apple.com/auth/authorize?${queryString}`;
```

- `client_id`: 발급한 `Service ID`를 입력한다.
- `redirect_uri`: `Service ID`에 연결된 `redirect URL`을 입력하고, 이는 서버에서도 동일한 값으로 사용해야 한다. (이전 포스팅에서 언급했지만, 다시 한번 반복하면 `POST`로 요청 해야 하기 때문에 서버의 endpoint를 입력해야 한다.)
- `response_type`: 인증 정보에 포함할 내용, `code`는 5분 제한의 인증 코드이고, `id_token`은 사용자 정보(`JWT`)다.
- `scope`: 인증 정보에 `name`, `email`을 포함 시키도록 설정했다. 이 내용은 `id_token`에 포함하게 된다.
- `response_mode`: 만약 `scope`에 별도 설정한 필드를 포함시키려면 `form_post`를 써야 하고, 그렇지 않으면, `query`, `fragment`를 사용할 수 있다.

정상적으로 작성하면 다음 처럼 인증 정보를 입력하게끔 링크가 열린다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1634458570/tlog/d0qxueflqmw9g5dw8mc3.png)

로그인 정보를 입력하면 설정된 `Redirect URL`로 인증 정보(`code`, `id_token`) Post 요청을 보낸다. 

### 서버 사이드

**인증키 생성**

인증 검증을 하기 위해서는 민감한 정보인 `Scret Key`를 포함하여 요청해야 하기 때문에 서버사이드에서 구현했다. 나는 인증키를 만드는 부분에서 가장 많은 삽질을 했는데, [공식 문서](https://developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens)에서는 설명이 되어있지만 내가 시도했을 때는 잘 안되었고, 어떤 키값을 사용하는 것인지 확실하게 나와있지 않았다. 이 부분에서도 [sign-with-apple-js](https://github.com/hmmhmmhm/how-to-using-sign-with-apple-js) 포스팅이 많은 도움이 되었다. 인증키를 만드는 키 값은 [애플 로그인 키발급](https://tlog.tammolo.com/posts/apple-login-01) 포스팅의 하단을 참고하자.

- src/lib/appleSignIn
    
    ```tsx
    import * as jwt from 'jsonwebtoken';
    import * as qs from 'querystring';
    import axios from 'axios';
    
    const signWithApplePrivateKey = process.env.APPLE_SCRET_KEY ?? '';
    
    export const createSignWithAppleSecret = () => {
      const token = jwt.sign({}, signWithApplePrivateKey, {
        algorithm: 'ES256',
        expiresIn: '1h',
        audience: 'https://appleid.apple.com',
        issuer: process.env.APPLE_TEAM_ID, // TEAM_ID
        subject: process.env.APPLE_SERVICE_ID, // Service ID
        keyid: process.env.APPLE_KEY_ID, // KEY_ID
      });
      return token;
    };
    
    export const getAppleToken = async (code: string) =>
      axios.post(
        'https://appleid.apple.com/auth/token',
        qs.stringify({
          grant_type: 'authorization_code',
          code,
          client_secret: createSignWithAppleSecret(),
          client_id: process.env.APPLE_SERVICE_ID,
          redirect_uri: process.env.APPLE_REDIRECT_URI,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
    ```
    
    `createSignWithAppleSecret`  가 인증키를 만드는 함수다.  `APPLE_SCRET_KEY` 는 아래처럼 개행이 있는 형태다.
    
    애플의 token api를 호출하는 것을 보면 `ContentType`을 `application/x-www-form-urlencoded` 로 했고 body를 `URL Encoding`(`qs.stringify`)을 해서 보낸 점을 주의해야 한다.
    
    ```tsx
    -----BEGIN PRIVATE KEY-----
    MI**************************************************************
    ****************************************************************
    ****************************************************************
    r6h+t7zv
    -----END PRIVATE KEY-----
    ```
    
    `.env` 에 다음 처럼 넣어주면 된다.
    
    ```tsx
    APPLE_SCRET_KEY="-----BEGIN PRIVATE KEY-----\nMI***\n***\n***\nr6h+t7zv\n-----END PRIVATE KEY-----"
    ```
    

다음은 서버를 통해 사용자 정보를 가져오는 부분이다.

```tsx
import * as jwt from 'jsonwebtoken';
import { getAppleToken } from '../../../lib/appleSignIn';

public appleAuthorize = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { code, id_token } = req.body;
	
	try {
		const { data } = await getAppleToken(code);
		const { sub: id, email } = (jwt.decode(id_token) ?? {}) as {
      sub: string;
      email: string;
      name?: string;
    };
    if (id) {
      return res.json({
        ok: true,
        accessToken: data.access_token,
        regreshToken: data.refresh_token,
        user: {
          id,
          email,
          name,
        },
      });
    }
	}

	return res.json({ ok: false });
};
```

`code`를 통해서 `accessToken`과 `refreshToken`을 가져오고, `id_token`을 통해 `name`, `email`, `sub` 등의 정보를 가져올 수 있다. 특히 `id_token`에서 가져오는 sub는 사용자를 식별할 수 있는 값으로 id 처럼 사용될 수 있다.

이로써 애플 로그인 구현을 마무리 할 수 있다. 애플 API는 에러가 친절하지 않아서 이래 저래 삽질도 했었다. 게다가 몇몇 블로그에는 잘못된 정보까지 있어서 꽤 많은 삽질을 한 시간이었다.

추가적으로 테스트 하면서 애플 계정 연동을 해제한 뒤 다시 로그인 처리하는 게 필요했는데, 아래 링크에서 소셜 로그인 연동을 관리한다.

애플 로그인 연동 해제

[Apple ID](https://appleid.apple.com/account/manage)


### Reference

---

[GitHub - hmmhmmhm/how-to-using-sign-with-apple-js:  Apple Login Example](https://github.com/hmmhmmhm/how-to-using-sign-with-apple-js)

[스프링 프로젝트에 애플 로그인 API 연동하기](https://whitepaek.tistory.com/61)

[[php]애플 아이디로 로그인 refresh token 구하기?](https://darkstart.tistory.com/116)