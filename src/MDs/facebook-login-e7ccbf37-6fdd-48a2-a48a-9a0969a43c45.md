---
title: Facebook Login in React
date: '2019-07-14T08:56:56.263Z'
description: React에서 페이스북 로그인 사용하기
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1632299616/tlog/cover/facebook_login_dfkops.jpg'
tags:
  - OAuth
  - React
---
#

일단 페북 로그인을 하기 위해서는 facebook app id가 필요하다.

[https://developers.facebook.com](https://developers.facebook.com/) 에서 앱 ID를 발급 받았다. 

react에서는 facebook을 간단히 사용하게 해주는 모듈이 있다.

    $ yarn add react-facebook-login

- login.js

        import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
        
        const Login = (props) => {
        	const { onLogin } = props;
        	return (
        		<div>
        	    <FacebookLogin
        	      appId="39...014"
        	      autoLoad={false}
        	      fields="name,first_name,last_name,email"
        	      callback={onLogin}
        	      render={renderProps => (
        	        <div onClick={renderProps.onClick}>facebook</div>
        	      )}
        	    />
        	  </div>
        	)
        );
        
        export default Login;

다음과 같은 결과값을 받는다.

    {  
       "name":"TaeMin Walter Moon",
       "first_name":"TaeMin Walter",
       "last_name":"Moon",
       "email":"tmmoond8@gmail.com",
       "id":"2...4",
       "accessToken":"EA...LgZDZD",
       "userID":"20...24",
       "expiresIn":6655,
       "signedRequest":"bCx...zQ1fQ",
       "reauthorize_required_in":7776000,
       "data_access_expiration_time":1570867745
    }