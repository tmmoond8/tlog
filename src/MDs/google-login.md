---
title: Google Login in React
date: '2019-07-14T08:56:56.263Z'
description: React에서 구글 로그인 사용하기
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632299631/tlog/cover/google_login_hfavjd.jpg'
tags:
  - OAuth
  - React
---

구글의 로그인 API를 사용하여 로그인 하기

[https://console.cloud.google.com](https://console.cloud.google.com/) 에서 프로젝트를 하나 생성한다. 

대시 보드가 생성되는데

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952574/tlog/_2019-06-10__8-3dcea99e-8640-45f4-9fc6-354128cb77d8.41.05_dsa41u.png)

API 쪽 카드에 보면 API 개요로 이동 버튼을 클릭

사용자 인증 정보 - Ouath 동의 화면  에 간단히 설정. 나는 애플리케이션 이름만 수정했음.

사용자 인증 정보 만들기 - OAuth 클라이언트 ID 클릭

웹 어플리케이션 선택 

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952574/tlog/_2019-06-10__8-803351eb-ed85-42fa-9dd7-89ee57d36caf.44.44_hpxg2i.png)

인증 정보를 생성하면 클라이언트 ID가 보이는데 그 클라이언트 ID만 사용하면 된다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952574/tlog/_2019-06-10__8-c7bf6db9-5894-41ac-aa94-236e302ef90d.45.42_latb4g.png)

구글의 경우 react용 로그인 모듈이 있는데, facebook 같이 큰 로그인 서비스에는 다 존재한다. (Github, Facebook, Google 등등)
```bash
$ yarn add react-google-login
```

모듈을 사용하는 방법은 간단하다.

- login.tsx       

   GoogleLogin 모듈에 clientId와 성공 콜백, 실패 콜백을 넣어주고, render에는 로그인 버튼의 렌더함수를 넣어주면 된다.
   ```jsx
   import GoogleLogin from 'react-google-login';
   
   const Login = (props) => {
      const { onLoginGoogle } = props;
      return (
      <div className={cx('login')}>
         <GoogleLogin
            clientId='google-login-key'
            render={(props: any) => (
               <div onClick={props.onClick} />
            )}
            onSuccess={result => onLoginGoogle(result)}
            onFailure={result => console.log(result)}
            cookiePolicy={'single_host_origin'}
         />
      </div>
      );
   };
   
   export default Login;
   ```

성공 콜백 후 넘어오는 값은 다음과 같다.
```json
{  
   "El":"115542265492867015125",
   "Zi":{  
      "token_type":"Bearer",
      "access_token":"ya29.Gl1F...Xz4uE",
      "scope":"email prof...profile openid",
      "login_hint":"AJD...XKQQ",
      "expires_in":3600,
      "id_token":"eyJhbGc...JhY2Nv",
      "session_state":{  
         "extraQueryParams":{  
            "authuser":"0"
         }
      },
      "first_issued_at":1563090245757,
      "expires_at":1563093845757,
      "idpId":"google"
   },
   "w3":{  
      "Eea":"11...15125",
      "ig":"TaeMin Moon",
      "ofa":"TaeMin",
      "wea":"Moon",
      "Paa":"http...oto.jpg",
      "U3":"tmmoond8@gmail.com"
   },
   "googleId":"115...15125",
   "tokenObj":{  
      "token_type":"Bearer",
      "access_token":"ya2...CHXz4uE",
      "scope":"email ...e openid",
      "login_hint":"AJDL...KQQ",
      "expires_in":3600,
      "id_token":"eyJhb...FUaw",
      "session_state":{  
         "extraQueryParams":{  
            "authuser":"0"
         }
      },
      "first_issued_at":1563090245757,
      "expires_at":1563093845757,
      "idpId":"google"
   },
   "tokenId":"eyJhbGciOi...4AaCByCFUaw",
   "accessToken":"ya29....4uE",
   "profileObj":{  
      "googleId":"115...5",
      "imageUrl":"https...UBA/s96-c/photo.jpg",
      "email":"tmmoond8@gmail.com",
      "name":"TaeMin Moon",
      "givenName":"TaeMin",
      "familyName":"Moon"
   }
}
```