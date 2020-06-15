---
templateKey: blog-post
title: JWT
date: 2019-11-24T08:56:56.263Z
description: JWT의 동작을 이해해보기
featuredpost: true
featuredimage: /img/cover/jwt-cover.jpg
tags:
  - jwt
---

#

참고

[JWT 정리](https://velog.io/@mycampground/Permissions-Token-Authentication-%EC%86%8C%EA%B0%9C)

HTTP에서 사용하는 여러 가지 표준적인 인증 방식이 있다. 전통적인 사용자 인증 방식은 보안에 취약하고 다이제스트 인증 방식은 환경에 제약이 있다.(http 버전 또는 https를 강제 등)

요새는 JWT(Json Web Token)방식으로 사용자 인증을 관리하는 게 가장 대중적인 방식이다. 나 또한 velopert님의 니콜라스 강의 등에서 JWT를 사용했지만, 구현체를 사용했기 때문에 제대로된 이해를 하지 못했었다. 요새 기존 인증이랑 동일하게 새 프로젝트에도 인증을 적용할 예정인데, 기존 인증 방식이 오래된 인증 방식과 Oauth2.0을 활용한 인증 방식이고 기존 인증 방식을 사용하되 더 개선할 수 있는 방안에 대한 이해를 위해 정리를 해보려한다.

JWT는 RFC-7519에 명세되어 있고, 지금 소개하는 JWT는 구현체에 대한 설명이다.

## Access Token, Refresh Token

---

JWT의 특징은 오랜 기간 세션을 유지하면서 보안을 강화한 점이다. 매번 요청할 때 토큰과 함께 서버로 요청이 날아 갈텐데 이 과정에서 토큰이 탈취가 발생할 수 있다. 짧은 시간이라면 탈취가 될 가능성이 적지만, 시간을 늘리면 늘릴수록 보안적으로 위험하다.

JWT에서는 두 가지 토큰을 사용하므로서 이 문제를 해결했는데, 우선 실질적으로 로그인을 사용하는 토큰은 `Access Token` 이다. 보통 20 ~ 30분 정도로 만료 시간을 설정한다. 이 시간 동안만 토큰을 유지하고 `Access Token` 이 만료되면 `Refresh Token` 으로 다시 `Access Token` 을 발급 받아서 로그인 한다. 이 과정에서는 사용자가 별도로 로그인 절차가 없게 된다. `Refresh Token` 은 보통 한달 정도로 만료 시간을 설정하고 디바이스에 저장되기 때문에 network 상으로 침투가 어렵게 된다.

클라이언트 쪽에서 `Refresh Token` 을 이용해서 `Access Token` 을 재발급 하는 로직을 구현해야 한다. 또, JWT는 `Access Token` 이 주기적으로 변경이 되기 때문에 사용 중에 만료가 발생할 수 있다. 예를 들어 0.05 초 만료시간이 남은 토큰을 사용할 때 네트워크가 0.05 초보다 지연되면 서버 쪽에서는 해당 토큰을 사용하지 못하기 때문이다. 이런 문제를 Sliding Session 으로 해결 했다.

## Sliding Session 전략

---

간단히 말하면, 사용 중인 `Access Token` 의 만료 시간을 늘려주는 것이다. 언제 토큰 만료 시간을 늘려줄 지는 각각 비즈니스 로직에 따라 구현해야 한다. 마찬가지로 `Refresh Token` 의 만료 시간도 늘려 줄 수 있다.

## Flow

---

1. 클라이언트가 서버로 로그인 한다. (ID, PW)
2. 서버에서 사용자를 확인하고 `Access Token` 과 `Refresh Token` 을 함께 전송한다. `Access Token` 과 `Refresh Token` 모두 DB에 저장 한다. (이 과정에서 `Access Token`을 쿠키에 httpOnly로 넣어줘야 하지 않을까?)
3. 클라이언트는 `Refresh Token` 는 (로컬 스토리지에) 저장하고 `Access Token` 을 사용하여 서버로 로그인 한다.
4. 서버는 토큰을 검증하여 요청에 응답한다.
5. 만약 `Access Token` 이 만료가 된 경우면 서버에는 Unauthorized 응답을 준다.
6. 서버로 부터 Unauthorized 응답을 받으면 `Refresh Token` 으로 `Access Token` 을 재발급 한다.
7. `Refresh Token` 이 만료 되었다면 클라이언트에게 다시 로그인 할 수 있도록 응답해야 한다. 기존 `Access Token` 과 `Refresh Token` 을 비우고 다시 로그인 하게 해야 한다.
8. 로그아웃을 누르면 `Refresh Token` 으로 `Access Token` 을 모두 제거한다.
