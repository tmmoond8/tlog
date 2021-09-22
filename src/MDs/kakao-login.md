---
title: Kakao Login in React
date: '2019-07-14T08:56:56.263Z'
description: React에서 카카오 로그인 사용하기
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1632299645/tlog/cover/kakao_login_eecddz.png'
tags:
  - OAuth
  - React
---
#

[https://developers.kakao.com/](https://developers.kakao.com/)

가서 카카오 계정으로 로그인을 하자.

새로운 앱을 만들면 키를 발급 받는다. 여기서는 JavaScript 키를사용한다.

    $ yarn add react-kakao-login

- login.jsx

        import KakaoLogin from 'react-kakao-login';
        
        const Login = (props: IProps) => {
          const { onLoginKakao } = props;
          return (
            <div className={cx('login')}>
              <KakaoLogin
                jsKey='kakao-js-key'
                onSuccess={result => onLoginKakao(result)}
                onFailure={result => console.log(result)}
                render={(props: any) => (
                  <div onClick={props.onClick} />
                )}
                getProfile={true}
              />
            </div>
          );
        };
        
        export default Login;

성공 콜백에 들어오는 결과 예시 (가져올 정보에 옵션을 어떤값을 주었냐에 따라 데이터가 더 들어가 있을 수 있다.)

    {  
       "response":{  
          "access_token":"x1...AAFr73UPeA",
          "token_type":"bearer",
          "refresh_token":"k5za...Fr73UPdg",
          "expires_in":7199,
          "scope":"profile",
          "refresh_token_expires_in":5183999
       },
       "profile":{  
          "id":11...64,
          "properties":{  
             "nickname":"문태민",
             "profile_image":"http:.../profile_640x640s.jpg",
             "thumbnail_image":"http:/...profile_110x110c.jpg"
          },
          "kakao_account":{  
             "has_email":true,
             "email_needs_agreement":true
          }
       }
    }