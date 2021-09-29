---
title: 로컬호스트를 public으로 만들기
date: '2021-09-29T08:56:56.243Z'
description: ngrok, localtunnel로 localhost를 외부에서 접근할 수 있게 하기
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632922163/tlog/cover/_Tip_vj7vxg.png'
tags: 
  - Tip
---

# ngrok, localtunnel

> 개발을 보통 localhost에서 개발이 되고, 배포 시점에서 외부 서버를 통해 배포되어 public ip로 공개가 된다. 현재 개발 상황을 공유하거나 특정 환경에서 버그를 고치다 보면 내가 개발하는 환경을 바로 외부로 노출하면 편할때가 있다. 예를 들면 앱 내의 웹뷰를 접근할 때, 로컬 환경을 외부로 노출하여 접근하게 하면 굉장히 편리할 수 있다. 이를 해결해주는 대표적인 솔루션 ngrok이 있고, 오픈소스 서비스인 localtennel이 있어서 직접 사용해보았다.
> 

## ngrok

손쉽고 편하게 사용할 수 있는 상용 솔루션인 ngrok을 사용해보자. 상용 솔루션이긴 하지만, 무료 플랜도 제공하기 때문에 충분히 활용 가능했다. 회원가입만 하면 기한에 상관 없이 무료 플랜을 사용할 수 있었다.

**무료 플랜**

- HTTP/TCP tunnels on random URLs/ports
- 1 online ngrok process
- 4 tunnels / ngrok process
- 40 connections / minute

### ngrok 회원가입

ngrok을 회원 가입을 해야 사용할 수 있다. 우선 가입을 하자. [https://dashboard.ngrok.com/signup](https://dashboard.ngrok.com/signup)

### ngrok 설치

**방법 1. 공식 홈페이지에서 다운로드**

- 공홈에서 [다운로드](https://dashboard.ngrok.com/get-started/setup) 가능하며, 윈도, 리눅스, 맥북 버전 모두 제공하며 M1을 위해 ARM64 빌드도 있다.
    
    ![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632922753/tlog/aam0gqq7ksbf8hoclykn.png)
    
- ngrok을 다운받은 앱이라서 아래처럼 보안 체킹을 해줘야 한다.

- 방법 2. npm을 통한 설치 (이 방법 추천)
    
    ```rb
    $ npm i -g ngrok
    ```
    
- 방법 3 brew를 통한 설치
    
    ```rb
    $ brew cask install ngrok
    ```
    

### ngrok 사용 방법

ngrok 명령어를 통해서 사용할 수 있다.

만약 로컬에 [http://localhost:3000](http://localhost:3000/) 으로 서버가 떠있다면 아래처럼 명령어를 실행하면 된다.

```rb
$ ngrok http 3000
```

이러면 서버상태와 랜덤으로 생성된 주소가 보이는데, https도 생성된 것을 확인할 수 있다. 리소스 요청 상황까지 보여줌!

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632922396/tlog/xk4oq87wrqcbsoxwzjpv.png)

help 명령어를 통해 다양한 옵션을 사용할 수 있다. 물론 대부분의 옵션은 무료플랜에서는 제공되지는 않는다.

```rb
$ ngrok —help
```

```text
NAME:
   ngrok - tunnel local ports to public URLs and inspect traffic

DESCRIPTION:
    ngrok exposes local networked services behinds NATs and firewalls to the
    public internet over a secure tunnel. Share local websites, build/test
    webhook consumers and self-host personal services.
    Detailed help for each command is available with 'ngrok help <command>'.
    Open <http://localhost:4040> for ngrok's web interface to inspect traffic.

EXAMPLES:
    ngrok http 80                    # secure public URL for port 80 web server
    ngrok http -subdomain=baz 8080   # port 8080 available at baz.ngrok.io
    ngrok http foo.dev:80            # tunnel to host:port instead of localhost
    ngrok http <https://localhost>     # expose a local https server
    ngrok tcp 22                     # tunnel arbitrary TCP traffic to port 22
    ngrok tls -hostname=foo.com 443  # TLS traffic for foo.com to port 443
    ngrok start foo bar baz          # start tunnels from the configuration file

VERSION:
   2.3.40

AUTHOR:
  inconshreveable - <alan@ngrok.com>

COMMANDS:
   authtoken    save authtoken to configuration file
   credits      prints author and licensing information
   http         start an HTTP tunnel
   start        start tunnels by name from the configuration file
   tcp          start a TCP tunnel
   tls          start a TLS tunnel
   update       update ngrok to the latest version
   version      print the version string
   help         Shows a list of commands or help for one command
```

웹 대시보드를 제공하여 손쉬운 인터페이스를 제공하며 상용 서비스 이므로 충분한 지원을 받을 수 있는 장점이 있다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632922753/tlog/us29xabcgqkpoodv1ozr.png)

---

## Localtennel

[localtennel](http://localtunnel.github.io/www/)은 javascript 오픈소스 프로젝트 이며, 별도 가입 없이 모든 기능을 무료로 사용할 수 있다.

Localtennel 설치

```rb
$ npm install -g localtunnel
```

Localtennel 사용하기

```rb
$ lt --port 3000
```

실행하면 굉장히 심플하게 랜덤으로 생성된 주소만 내려준다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632922600/tlog/bxtk4grqstecwn8z0fel.png)

아래 페이지처럼 입장 페이지가 뜨는데, Click to Continue 버튼을 눌러서 이동하면 된다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632922396/tlog/qvlhdzdiqjgfweppjsnx.png)

localtennel의 장점이라면 서브도메인을 임의로 설정할 수 있다는 것이다.

```rb
$ lt --port 3000 --subdomain kyle
```

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632922600/tlog/qc6rqziecdy9bikeqbks.png)

별도의 대시보드를 제공하지 않고, 상용서버가 아니기 때문에 때때로 문제가 있을 수 있다. 그러나 큰 제약 없이 사용할 수 있다는 장점이 있다.

localtunnel에서 사용할 수 있는 옵션

```rb
$ lt --help
```

```text
Usage: lt --port [num] <options>

Options:
  -p, --port                Internal HTTP server port                 [required]
  -h, --host                Upstream server providing forwarding
                                             [default: "<https://localtunnel.me>"]
  -s, --subdomain           Request this subdomain
  -l, --local-host          Tunnel traffic to this host instead of localhost,
                            override Host header to this host
      --local-https         Tunnel traffic to a local HTTPS server     [boolean]
      --local-cert          Path to certificate PEM file for local HTTPS server
      --local-key           Path to certificate key file for local HTTPS server
      --local-ca            Path to certificate authority file for self-signed
                            certificates
      --allow-invalid-cert  Disable certificate checks for your local HTTPS
                            server (ignore cert/key/ca options)        [boolean]
  -o, --open                Opens the tunnel URL in your browser
      --print-requests      Print basic request info                   [boolean]
      --help                Show this help and exit                    [boolean]
      --version             Show version number                        [boolean]
```

subdomain 뿐아니라, 인증서 그리고 요청 메시지도 옵션으로 넣을 수 있다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632922600/tlog/opo4ha8xj4skzytiildp.png)