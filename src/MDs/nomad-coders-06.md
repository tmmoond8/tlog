---
title: 6 우버 클론 코딩 (nomad coders)
date: '2019-04-15T08:56:56.243Z'
description: 우버 코딩 강의 로그 1.26 ~ 1.32
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1632302785/tlog/cover/nuber_clone_nllng2.jpg'
tags:
  - 'Clone Coding'
  - 'Nomad Coder'
  - GraphQL
---
# 

이 포스트는 nomad coders의 우버 클론 코딩 시리즈를 듣고 정리한 글 입니다.

[https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course](https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course)

## #1.26 Planning the Resolvers part One
## #1.27 Planning the Resolvers part Two

앞으로 할 일에 대해, 기능에 대해 정리

- README.md

        # nuber-sever
        
        Server for the (N)UBER Clone Course on Nomad Academy. GraphQL, Typescript, NodeJS
        
        ### Public Resolvers:
        
        - [ ] Sigin In / Sign Up with Facebook
        - [ ] Sign In with Email
        - [ ] Start Phone Number Verification
        - [ ] Complete Phone Number Verification
        - [ ] Sign Up with Email
        --- 
        
        ### Private Resolvers:
        
        - [ ] Verify Email
        - [ ] Get my Profile
        - [ ] Update my Profile
        - [ ] Toggle Driving Mode
        - [ ] Report Location / Orientation
        - [ ] Add Place
        - [ ] Edit Place
        - [ ] Delete Place
        - [ ] See Nearby Drivers
        - [ ] Subscribe to Nearby Drivers
        - [ ] Request a Ride
        - [ ] Get Nearby Rides
        - [ ] Subscribe to Nearby Ride Requests
        - [ ] Subscribe to Ride Status
        - [ ] Get Chat Room Messages
        - [ ] Subscribe to Chat Room Messages
        - [ ] Send a Chat Message
        
        ## Code Chaalange
        
        - [ ] Get Ride History
        - [ ] See Ride Detail

## #1.28 FacebookConnect Resolver part One

페이스북으로 사용자 인증을 하기 위한 작업을 한다. 이번에는 Mutation을 만들 것인데, Query get 처럼 가져오는 요청이면, Mutation은 post처럼 업데이트 또는 인서트 처럼 조작하는 것이라 생각하면 된다.

- src/api/User/shared/User.graphql 에 fbId 필드를 추가하자.

        	...
          lastOrientation: Float
          fbId: String
        }

- src/entities/User.ts 에도 fbId에 대한 필드를 추가하자. 이 값은 필수가 아니므로 `nullable: true`

        	...
        	@Column({ type: "double precision", default:0})
          lastOrientation: number;
        
          @Column({ type: "text", nullable: true})
          fbId: string;
        
          public comparePassword(password: string): Promise<boolean> {
            return bcrypt.compare(password, this.password);
          }
        	...

- src/api/User/FacebookConnect/FacebookConnect.graphql 을 생성해서 다음을 추가 하자.

        type FacebookConnectResponse{
          ok: Boolean!
          error: String
          token: String
        }
        
        type Mutation {
          FacebookConnect(
            firstName: String!, 
            lastName: String!, 
            email: String, 
            fbId: String!
          ) : FacebookConnectResponse!
        }

정의 후  yarn dev를 실행하면 src/types/graph.d.ts 에 정의한 타입이 생성되었을 것이다. 중간 중간에 graphql 파일을 정의하면 어떤 내용이 graph.d.ts 파일에 추가되는지 확인하면 좋을 것이다.

## #1.28 FacebookConnect Resolver part Two

위에서 정의한 타입들에 대한 resolver를 정의할 차례다. graphql에서 요청 타입을 만들고 해당 응답을 하기 위한 resolver를 정의해야 응답이 된다. 

- src/entiries/User.ts 하기전에 우선 간단하게 필드 age 필드에 nullable을 넣어주자.

        
        ...
        	@Column({ type: "text", nullable: true})
          @IsEmail()
          email: string | null;
        ...
        	@Column({ type: "int", nullable: true})
          age: number;
        
        	@Column({ type: "text", nullable: true})
          password: string;
        
          @Column({ type: "text", nullable: true})
          phoneNumber: string;
        ...

어떤 유저가 fbId를 통해 로그인 시도를 하게되고, 이미 해당 fbId가 디비에 있으면 이미 회원가입을 했다고 생각하고 로그인 토큰을 준다. 그러나 존재하지 않는 fbId면 회원 가입 처리가 진행된다. 

아래에서 첫 번째 try 문은 이미 회원가입을 했는지에 대한 처리고, 두 번째는 신규 회원 가입 처리가 되는 try문이다.

- src/api/User/FacebookConnect/FacebookConnect.resolvers.ts 파일을 생성하고 resolver를 정의한다.

        import { FacebookConnectMutationArgs, FacebookConnectResponse } from "src/types/graph";
        import { Resolvers } from "src/types/resolvers";
        import User from "../../../entities/User"; // 이건 꼭 상대경로로 해야 찾을 수 있다.
        
        const resolvers: Resolvers = {
          Mutation: {
            FacebookConnect: async (
              _, 
              args: FacebookConnectMutationArgs
            ) : Promise<FacebookConnectResponse> => {
              const { fbId } = args;
              try {
                const exitingUser = User.findOne({ fbId })
                if(exitingUser) {
                  return {
                    ok: true,
                    error: null,
                    token: 'Comming Soon, existing'
                  }
                }
              } catch (error) {
                return {
                  ok: false,
                  error: error.message,
                  token: null
                }
              }
              try {
                // 임시 리턴 값
                return {
                  ok: true,
                  error: null,
                  token: null
                }
              } catch (error) {
                return {
                  ok: false,
                  error: error.message,
                  token: null
                }
              }
            }
          }
        }
        
        export default resolvers;

## #1.30 FacebookConnect Resolver part Three

저번 강의에 이어 

- src/api/User/FacebookConnect/FacebookConnect.d.ts 파일에서 현재 비어있는 두 번째 try 문 안을 채워주자.

        ...
        			try {
                await User.create({
                  ...args,
                  profilePhoto: `http://graph.facebook.com/${fbId}/picture?type=square'`
                }).save();
                return {
                  ok: true,
                  error: null,
                  token: "Comming soon, create"
                }
              } catch (error) {
                return {
                  ok: false,
                  error: error.message,
                  token: null
                }
              }
        ...

args에 넘어온 사용자 정보와 추가적으로 사용자의 페이스북 Image를 가져오도록 했다. 이 때, `User.create(){}.save()`을 하면 저번에 정의한 `@beforeinsert` 로직을 타서 password를 알아서 해싱하여 해싱한 값을 저장하게 한다.!

## #1.31 Testing the FacebookConnect Resolver

이전 강의에서 설정한 Mutation으로 요청을 보내보자.

- [http://localhost:4000/playground](http://localhost:4000/playground) 에 들어가서 쿼리를 날려보자.

        mutation {
          FacebookConnect(firstName: "TaeMin", lastName:"Moon", fbId: "2131321321", email: "test@gmail.com") {
            ok
            error
            token
          }
        }

이렇게 하고 접속하면 정상적으로 Mutaion을 날리고 응답을 받을 것이다.

## #1.32 EmailSignIn Resolver part One

이번에는 이메일로 로그인하는 것을 해볼 것이다.

- src/api/User/EmailSignIn/EmailSignIn.graphql 파일을 생성하여 타입을 정의하자.

        type EmailSignInResponse {
          ok: Boolean!
          error: String
          token: String
        }
        
        
        type Mutation {
          EmailSignIn(email: String!, password: String!): EmailSignInResponse!
        }

- src/api/User/EmailSignIn/EmailSignIn.resolvers.ts 파일을 생성하여 resolver를 정의하자.

    이메일과 비밀번호를 통해 로그인을 시도 하게 되어 있고, 해당 유저가 디비에 없다면 로그인은 실패한다. 유저가 있다면 비밀번호가 일치하는지 확인하게 된다.

        import { EmailSignInMutationArgs, EmailSignInResponse } from 'src/types/graph';
        import { Resolvers } from 'src/types/resolvers';
        import User from '../../../entities/User';
        
        const resolvers: Resolvers = {
          Mutation: {
            EmailSignIn: async(_, args: EmailSignInMutationArgs) :Promise<EmailSignInResponse> => {
              try {
                const { email } = args;
                const user =  User.findOne({ email });
                if(!user) {
                  return {
                    ok: false,
                    error: "No User found with that email",
                    token: null
                  }
                } else {// 임시 리턴 값
                  return {
                    ok: true,
                    error: 'temp',
                    token: ''
                  }
                }
              } catch (error) {
                return {
                  ok: false,
                  error: error.message,
                  token: null
                }
              }
            }
          }
        }
        
        export default resolvers;

## #1.32 EmailSignIn Resolver part Two

이메일로 로그인을 마무리 하자.

- src/api/User/EmailSignIn/EmailSignIn.resolvers.ts

        import { EmailSignInMutationArgs, EmailSignInResponse } from 'src/types/graph';
        import { Resolvers } from 'src/types/resolvers';
        import User from '../../../entities/User';
        
        const resolvers: Resolvers = {
          Mutation: {
            EmailSignIn: async(_, args: EmailSignInMutationArgs) :Promise<EmailSignInResponse> => {
              try {
                const { email, password } = args;
                const user =  await User.findOne({ email });
                if(!user) {
                  return {
                    ok: false,
                    error: "No User found with that email",
                    token: null
                  }
                }
                const checkPassword = await user.comparePassword(password);
                if(checkPassword) {
                  return {
                    ok: true,
                    error: null,
                    token: 'Comming soon'
                  }
                } else {
                  return {
                    ok: false,
                    error: "Wrong password",
                    token: null
                  }
                }
              } catch (error) {
                return {
                  ok: false,
                  error: error.message,
                  token: null
                }
              }
            }
          }
        }
        
        export default resolvers;

실제 기능은 아직 테스트 할 수 없다.

- [README.md](http://readme.md) 이제 우린 우리가 할 일 중 2가지를 체킹할 수 있다.

        ...
        - [X] Sigin In / Sign Up with Facebook
        - [X] Sign In with Email
        ...