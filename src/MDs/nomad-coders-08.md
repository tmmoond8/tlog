---
title: 8 우버 클론 코딩 (nomad coders)
date: '2019-04-22T08:56:56.243Z'
description: 우버 코딩 강의 로그 1.40 ~ 1.48
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1632302785/tlog/cover/nuber_clone_nllng2.jpg'
tags:
  - 'Uber Clone Coding'
  - 'Nomad Coder'
  - JWT
---
# 

이 포스트는 nomad coders의 우버 클론 코딩 시리즈를 듣고 정리한 글 입니다.

[https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course](https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course)

## #1.40 EmailSignUp Resolver

이메일 회원 가입을 하도록 하자. 로직은 로그인 처럼 간단하다.

- src/api/User/EmailSignUp/EmailSignUp.graphql 생성해서 Mutaion을 작성하자

        type EmailSignUpResponse {
          ok: Boolean!
          error: String
          token: String
        }
        
        
        type Mutation {
          EmailSignUp(
            firstName: String!, 
            lastName: String!, 
            email: String!, 
            password: String!, 
            profilePhoto: String!, 
            age: Int!,
            phoneNumber: String!
          ): EmailSignUpResponse!
        }

- src/api/User/EmailSignUp/EmailSignUp.resolvers.ts 생성해서 resolvers를 작성하자.

        import { EmailSignUpMutationArgs, EmailSignUpResponse } from "src/types/graph";
        import { Resolvers } from "src/types/resolvers";
        import User from "../../../entities/User";
        
        const resolvers: Resolvers = {
          Mutation: {
            EmailSignUp: async (
              _, 
              args: EmailSignUpMutationArgs
            ): Promise<EmailSignUpResponse> => {
              try {
                const { email } = args;
                const existingUser = await User.findOne({ email });
                if(existingUser) {
                  return {
                    ok: false,
                    error: 'existing email. You should log in instead',
                    token: null
                  }
                } else {
        					newUser = await User.create({ ...args });
                  return {
                    ok: true,
                    error: null,
                    token: 'comming soon'
                  }
                }
              } catch(error) {
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

하다 보니 graphql 에서 type, query, mutation 작성은 어느정도 익숙해졌다. 다음 번엔 토큰 발급을 직접 해볼 차례다.

## #1.41 Creating Custom JWT

- JWT(json web token)을 설치하자. 사용자가 입력한 값을 토큰으로 만들어주는 라이브러리다.

        $ yarn add jsonwebtoken
        $ yarn add @types/jsonwebtoken --dev

토큰을 생성할 때 누구나 아는 값 외에 나만 아는 값을 추가적으로 넣어서 보완을 강화해야 한다.

- src/.env 에 JWT_TOKEN를 추가하자.

        ...
        JWT_TOKEN=2bCxgznKS?mvgR&GKU%mcz-cA4EMS&s3%U4eurGjB^YxU&WvMu#

- src/utils/createJWT.ts 파일에 jwt를 생성하는 `createJWT`를 정의하자.

        import jwt from 'jsonwebtoken';
        
        const createJWT = (id: number): string => {
          const token = jwt.sign(
            {
              id
            },
        		process.env.JWT_TOKEN || ""
          );
          return token;
        };
        
        export default createJWT;

위에서 내가 생성한 임의의 값을 추가 했지만, 실제로 서비스를 할 때는 랜덤한 값을 임의로 생성해줘야 한다.

[https://passwordsgenerator.net/](https://passwordsgenerator.net/) 에 들어가서 아래 처럼 체크 한 후 생성 버튼을 누르면 임의의 값을 생성해준다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952569/tlog/_2019-04-19__2-039a4319-ffce-40c8-bc3b-ecb38d37d384.57.39_mp1an0.png)

## #1.42 Authenticating Users with Custom JWT

이제 유틸에 정의된 `createJWT` 를 사용하여 생성한 토큰을 사용자에게 전달하도록 할 것이다.

- src/api/User/CompletePhoneVerification/CompletePhoneVerification.resolvers.ts  Comming soon으로 되어 있는 값을  실제 토큰을 만들어서 전달하자.

        ...
        import Verification from "../../../entities/Verification";
        import createJWT from "../../../utils/createJWT";
        
        ...
              try {
                const user = await User.findOne({ phoneNumber });
                if(user) {
                  user.verifiedPhoneNumber = true;
                  user.save();
                  const token = createJWT(user.id);
                  return {
                    ok: true,
                    error: null,
                    token
                  }
        ...

- src/api/User/EmailSignIn/EmailSignIn.resolvers.ts

        ...
        import User from "../../../entities/User";
        import createJWT from "../../../utils/createJWT";
        
        ...
                const token = createJWT(user.id);
                if(checkPassword) {
                  return {
                    ok: true,
                    error: null,
                    token
                  }
        ...

- src/api/User/EmailSignUp/EmailSignUp.resolvers.ts

        ...
        import User from "../../../entities/User";
        import createJWT from "../../../utils/createJWT";
        
        ...
                  const newUser = await User.create({ ...args }).save();
                  const token = createJWT(newUser.id);
                  return {
                    ok: true,
                    error: null,
                    token
                  }
                }
        ...

- src/api/User/FacebookConnect/FacebookConnect.resolvers.ts

        ...
        import createJWT from "../../../utils/createJWT";
        import User from '../../../entities/User';
        
        ...
                const exitingUser = await User.findOne({ fbId });
                if(exitingUser) {
                  const token = createJWT(exitingUser.id);
                  return {
                    ok: true,
                    error: null,
                    token
                  }
                }
        ...
        			try {
                const user = await User.create({
                  ...args,
                  profilePhoto: `http://graph.facebook.com/${fbId}/picture?type=square'`
                }).save();
                const token = createJWT(user.id);
                return {
                  ok: true,
                  error: null,
                  token
                }
        ...

이제 다시 아래의 쿼리를 요청해보자. 이번에는 정상적으로 token을 주는 것을 확인하 수 있다.
http://localhost:4000/playground

    mutation {
      FacebookConnect(firstName: "TaeMin", lastName:"Moon", fbId: "2131321321", email: "test@gmail.com") {
        ok
        error
        token
      }
    }

## #1.43 Testing Authentication Resolvers

이번에는 지금까지 작성한 Query와 Mutation이 잘 동작하는지 확인해볼 차례다.

아래는 현재 존재하지 않는 아이디로 로그인 했을 때다.

    mutation {
      EmailSignIn(email: "test5@gmail.com", password: "12345") {
        ok
        error
        token
      }
    }

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952569/tlog/_2019-04-19__3-d7f7bdaf-211e-4289-874d-2df494304085.36.18_qtbvdi.png)

이번엔 회원 가입을 하자. 회원 가입을 성공하면 토큰을 함께 준다.

    mutation {
      EmailSignUp(firstName: "test", lastName: "tamm", email: "test5@gmail.com", password: "12345", profilePhoto: "", age: 30, phoneNumber: "+82-10XXXXYYYY") {
        ok
        error
        token
      }
    }

다시 signIn을 요청하면 이제는 정상적으로 토큰을 준다.

## #1.44 Custom Auth Middleware on Express part One

## #1.44 Custom Auth Middleware on Express part Two

토큰을 발급하면 토큰을 통해 인증해야 한다. 사용자가 자신이 받은 토큰을 통해 인증 정보를 서버에게 주는데, 서버는 매번 이 인증 정보를 확인해야 한다. (http는 stateless하니까)

어떤 구간에서 매번 하는 동작을 미들웨어에서 처리하게 하면 된다. 그래서 미들웨어를 만들 거다.

- src/utils/decodeJWT.ts 파일을 생성하여 토큰을 디코딩하는 함수를 만든다. 어떤 값을 가지는지 확인하기 위해 console을 찍도록 했다.

        import jwt from 'jsonwebtoken';
        import User from '../entities/User';
        
        const decodeJWT = async (token: string) : Promise<User | undefined> => {
          try {
            const decoded : any = jwt.verify(token, process.env.JWT_TOKEN || "");
            const { id } = decoded;
            const user = await User.findOne({ id });
            return user;
          } catch(error) {
            return undefined;
          }
        }
        
        export default decodeJWT;

- src/app.ts 에 미들웨어를 만들어서 위에서 정의한 디코딩 함수를 동작시키자. 일단 다음 처럼

        ...
        import schema from './schema';
        import decodeJWT from './utils/decodeJWT';
        ...
        
          private middlewares = (): void => {
            this.app.express.use(cors());
            this.app.express.use(logger('dev'));
            this.app.express.use(helmet());
            this.app.express.use(this.jwt);
          };
        	
        	private jwt = async (req, res, next) : Promise<void> => {
            const token = req.get("X-JWT");
            if(token) {
              const user = await decodeJWT(token);
              console.log(user);
            }
            next();
          }
        }
        
        export default new App().app;

정상적으로 미들웨어를 타는지 확인하기 위해 헤더에 토큰을 포함하여 요청해보자.

    query {
      user {
        id
      }
    }
    

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952570/tlog/_2019-04-20__12-8c2db49d-9c13-41e2-9e18-e01437fb275b.40.21_qrfchy.png)

토큰 값은 받은 SignIn이나 이런 요청해서 받은 값으로 하자.

    {"X-JWT":"토큰값"}

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952569/tlog/_2019-04-20__12-4fba01dc-444b-4d0b-8d97-0eb60b09ba86.42.21_zu8yw8.png)

## #1.46 Using Resolver Context for Authentication

위에서 미들웨어에서는 유저가 헤더에 포함 시킨 값을 통해 유저 정보를 가져왔다. 이렇게 가져온 유저 정보를 각 요청의 resolvers에 전달할 수 있어야 한다. 결론 부터 말하자면 우리는 express의 req 객체에 user 객체를 포함시킬 것이다.

- src/app.ts

        import { NextFunction, Response } from 'express';
        import { GraphQLServer } from 'graphql-yoga';
        ...
        
        class App {
          public app: GraphQLServer;
        
          constructor() {
            this.app = new GraphQLServer({
              schema,
              context: req => {
                return {
                  req: req.request
                }
              }
            });
            this.middlewares();
          }
          
        	...
        
          private jwt = async (req, res: Response, next: NextFunction) : Promise<void> => {
            const token = req.get("X-JWT");
            if(token) {
              const user = await decodeJWT(token);
              req.user = user;
            }
            next();
          }
        }
        
        export default new App().app;

    위 코드를 보면 두 가지가 추가가 되었다. `decodeJWT`로 얻은 user 객체를 req 객체에 넣어준 것과 `GraphQLServer` 객체를 생성할 때 context 를 추가한 것이다. 미들웨어에서 req.user 에 넣은 user객체를 context의 리턴값으로 정의된  `req.request` 에서 user를 포함하게 된다. 그리고 context는 각 resolvers에서 사용할 수 있게 된다.

     임시 코드를 작성해서 미들웨어에서부터 값을 잘 전달하는지 확인해보자.

    - src/api/User/FacebookConnect/FacebookConnect.resolvers.ts 에 임의의 쿼리를 출력하도록 해보자.

            ...
            
            const resolvers: Resolvers = {
              Query: {
                user: (parent, args, context) => {
                  console.log(context.req.user);
                  return "";
                }
              },
              Mutation: {
                FacebookConnect: async (
            ...

    위에서 처럼 토큰 값을 헤더에 추가하여 쿼리를 다시 날려보면 쿼리 결과는 에러를 내지만, vscode의 콘솔창을 살펴보자. resolvers에서 user 정보를 잘 출력하였다.

        query {
          user {
            id
          }
        }

    콘솔에 정상적으로 user 객체가 출력되는지 확인하자. 확인하였으면 facebookConnect 파일은 원복시키자.

    > GraphQLServer 객체를 생성할 때, context를 함수로 정의하였는데 일반 객체로 정의할 수 있다. 일반 객체로 정의한다면 항상 같은 context를 가지게 된다. 이 경우 각 사용자마다 인증 정보가 바뀌기 때문에 해당 요청건 마다 다른 context를 가져야 한다. 그렇기 때문에 미들웨어에서는 request 객체에 user 정보를 넣고, 각 resolvers에서는 context에서 꺼내오도록 한 것이다.

## #1.47 GetMyProfile Resolver

## #1.48 Protecting Resolvers with Middlewares

이번에는 resolver의 미들웨어를 정의할 것이다. 예를들면 유저가 자신의 저장소의 데이터를 요청했을 때, 전제는 유저에 대한 인증이 되었을 때만 데이터를 줘야 한다. 그렇다면 resolver마다 매번 로그인 처리를 정의한다면 굉장히 귀찮은 일이 될것이다. 여기서는 header에서 JWT 토큰을 가지고 있는지 확인하여 유저 정보가 없으면 resolver의 일을 하지 않고, 유저 정보가 있을 때만 요청한 일을 수행하도록 하겠다.

- src/utils/privateResolver.ts 을 생성하여 미들웨어를 정의한다.

        const privateResolver = resolverFunction => async (
          parent,
          args,
          context,
          info
        ) => {
          if (!context.req.user) {
            throw new Error('No JWT. I refuse to proceed');
          }
          const resolved = await resolverFunction(parent, args, context, info);
          return resolved;
        };
        
        export default privateResolver;

- src/api/User/GetMyProfile/GetMyProfile.graphql

        type GetMyProfileResponse {
          ok: Boolean!
          error: String
          user: User
        }
        
        type Query {
          GetMyProfile: GetMyProfileResponse!
        }

- src/api/User/GetMyProfile/GetMyProfile.resolvers.ts

        import { Resolvers } from "src/types/resolvers";
        import privateResolver from "../../../utils/privateResolver";
        
        const resolvers: Resolvers = {
          Query : {
            GetMyProfile: privateResolver(async (_, __, context) => {
              const { req: { user } } = context;
              return {
                ok: true,
                error: null,
                user
              }
            })
          }
        }
        
        export default resolvers;

이제  [http://localhost:4000/playground](http://localhost:4000/playground) 에들어가서 쿼리를 날려보자. 헤더에 토큰을 넣었을 때와 안 넣었을 때 응답이 정상적으로 주는 지 확인하자.

    query {
      GetMyProfile {
        user {
          id
        }
      }
    }

지금까지 실제 토큰을 통해 인증하는 작업을 진행하였다.