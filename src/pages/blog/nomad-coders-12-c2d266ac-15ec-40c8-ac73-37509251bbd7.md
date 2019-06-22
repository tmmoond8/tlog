---
templateKey: blog-post
title: 12 우버 클론 코딩 (nomad coders)
date: 2019-04-29T08:56:56.243Z
description: 우버 코딩 강의 로그 1.64 ~ 1.71
featuredpost: true
featuredimage: /img/nuber_clone.jpg
tags:
  - uber-clone-coding
  - nomad-coders
  - graphql-yoga
---
# 

## #1.64 GetNearbyDrivers Resolver part One

## #1.64 GetNearbyDrivers Resolver part Two

이번에는 사용자가 근처에서 운행 중인 운전자를 찾을 때의 Query를 구현할 것이다.

- src/api/User/GetNearbyDrivers/GetNearbyDrivers.graphql

        type GetNearbyDriversResponse {
          ok: Boolean!
          error: String
          drivers: [User]
        }
        
        type Query {
          GetNearbyDrivers: GetNearbyDriversResponse!
        }

- src/api/User/GetNearbyDrivers/GetNearbyDrivers.resolvers.ts

        import { Resolvers } from "src/types/resolvers";
        import { Between, getRepository } from "typeorm";
        import User from "../../../entities/User";
        import privateResolver from "../../../utils/privateResolver";
        
        const resolvers: Resolvers = {
          Query: {
            GetNearbyDrivers: privateResolver(async (_, __, { req }) => {
              const user: User = req.user;
              const { lastLat, lastLng } = user;
              try {
                const drivers: User[] = await getRepository(User).find({
                  isDriving: true,
                  lastLat: Between(lastLat - 0.05, lastLat + 0.05),
                  lastLng: Between(lastLng - 0.05, lastLng + 0.05)
                });
                return {
                  ok: true,
                  error: null,
                  drivers
                }
              } catch(error) {
                return {
                  ok: false,
                  error: error.message,
                  drivers: null
                }
              }
            })
          }
        }
        
        export default resolvers;

니콜라스는 `await getRepository(User).find`를 사용했는데, 나는 `await User.find` 도 잘 동작한다.

> typeorm에서는 두 가지 데이터 매핑 패턴을 제공한다고 한다. 하나가 Data Mapping이고 또 다른게 우리가 쓰는 Active Record 방식이다. Data Mapping는 코드가 길어지지만, 좀 더 복잡한 관계의 데이터를 가져오는데 사용한다고 한다.

## #1.66 DriversSubscription part One

이번에는 기존에 하던 것이 아닌 새로운 것을 할 거다. Graphql에서는 데이터는 가져오고 변화시키거나 추가 시킨다. 특정 데이터가 업데이트 되었을 때, 갱신 해주기 위해서는 polling 처럼 일정 주기로 확인하는 방법도 있지만 더욱 더 효율적인 방법이 pubSub이다. grpahql-yoga에서는 pubSub을 지원해준다. 지금 부터 pubSub을 해보자.!

> 이 부분은 나도 이해를 잘 못했지만, 일단 작성하면서 정리하고 나중에 추가 하도록 하자.

- src/app.ts  pubSub 객체를 graphql의 context로 넘기자.

        ...
        import { GraphQLServer, PubSub } from 'graphql-yoga';
        ...
        
        class App {
          public app: GraphQLServer;
          public pubSub: any;
        
          constructor() {
            this.pubSub = new PubSub();
            this.pubSub.ee.setMaxListeners(99);
            this.app = new GraphQLServer({
              schema,
              context: req => {
                return {
                  req: req.request,
                  pubSub: this.pubSub
                }
              }
            });
        ...

- src/api/User/DriversSubscription/DriversSubscription.graphql

        type Subscription {
          DriversSubscription: User
        }

    지금까지는 Query 또는 Mutation을 다뤘고 이번에 처음으로 Subscription 타입을 정의했다. Subscription 타입은  pusSub할 때 보내는 데이터 타입이다.

- src/api/User/DriverSubscription/DriversSubscription.resolvers.ts

        const resolvers = {
          Subscription: {
            DriversSubscription: {
              subscribe: (_, __, { pubSub }) => {
                return pubSub.asyncIterator('driverUpdate');
              }
            }
          }
        };
        
        export default resolvers;

    일단은 `driverUpdate` 가 채널 명이라고 생각하자.

## #1.66 DriversSubscription part Two

위에서 `driverUpdate` 채널을 구독하도록 했다. 그럼 이번엔 데이터를 변경하고 데이터가 변경됐음을 알리는 코드를 작성하자.

- src/api/User/ReportMovement/ReportMovement.resolvers.ts

        ...
              async (
                _,
                args: ReportMovementMutationArgs,
                { req, pubSub }
              ): Promise<ReportMovementResponse> => {
                const user: User = req.user;
                const notNull = cleanNullArgs(args);
                try {
                  await User.update({ id: user.id }, { ...notNull });
                  const updatedUser = {...user, ...notNull };
                  pubSub.publish('driverUpdate', { DriversSubscription: updatedUser });
        ... 

새로운 유저의 위치정보를 db에 저장하고, 이 정보를 `pubSub.publish()` 로 driverUpdate 채널명으로 보낸다. 그러면 위에서 driverUpdate 채널명을 구독한 모든 유저에서는 갱신된 정보를 받아 올 수 있다.

[http://localhost:4000/playground](http://localhost:4000/playGround에서) 에서 확인해보자.

    subscription {
      DriversSubscription {
        fullName
        lastLat
        lastLng
      }
    }

위 subscription을 실행하면 데이터를 받기 위해 대기한다. 새 탭을 열어 아래의 명령어를 실행하자.

    mutation {
      ReportMovement(lastLat: 1.4, lastLng: 9.44) {
        ok
        error
      }
    }

이렇게 하면 구독한 정보가 뜨는 것을 확인할 수 있다. 여러번 시도하면 계속해서 갱신된 정보를 가져온다.

> graphql-yoga에서 제공하는 pubsub은 메모리 누수 이슈도 있다고 한다. 그렇기 때문에 실제 서비스 될 때는 graphql-yoga의 pubsub이 아닌 다른 pubsub을 사용하자.

## #1.68 Authenticating WebSocket Subscriptions part One

우리가 token을 통해 인증하는 방식은 http통신에 헤더를 통해서 이뤄졌다. subscription은 http통신 방식이 아닌 websocket이기 때문에 헤더가 없기 때문에 현재 인증이 되지 않는데

graphql-yoga를 실행할 때, subscription에 대한 옵션을 넣어줄 수 있다. 

- src/index.ts

        ...
        const GRAPHQL_ENDPOINT : string = "/graphql";
        const SUBSCRIPTION_ENDPOINT: string = "/subscription";
        
        ...
        
          endpoint: GRAPHQL_ENDPOINT,
          subscriptions: {
            path: SUBSCRIPTION_ENDPOINT,
            onConnect: async connectionParams => {
              console.log(connectionParams);
            }
          }
        }
        ...

    이 동작은 내 생각이지만, websocket 연결을 만들 때, http 통신을 사용할 것이고 이때 header 값을 websocket 에서 사용하는 것 아닌가 싶다.

아래 쿼리를 보내면 console창에 헤더가 찍히는 것을 확인할 수 있다. path로 준 endpoint로 접근해야 한다.

![](_2019-04-30__9-4a616d9b-6b7b-4eb6-a3fe-1d0f885e92ac.41.42.png)

    subscription {
      DriversSubscription {
        fullName
        lastLat
        lastLng
      }
    }

## #1.69 Authenticating WebSocket Subscriptions part Two

- src/index.ts  onConnect 할 때 토큰 값을 통해 user 정보를 꺼내도록 하자.

        ...
        import ConnectionOptions from './ormConfig';
        import decodeJWT from './utils/decodeJWT';
        
        ...
            onConnect: async connectionParams => {
              const token = connectionParams['X-JWT'];
              if(token) {
                const user = await decodeJWT(token);
                if(user) {
                  return {
                    currentUser: user
                  }
                }
                throw new Error("User not found");
              }
              throw new Error("Token not found");
            }
          }
        }
        ...

    onConnect의 함수는 currentUser에 user가 들어간 객체를 리턴 하는 것을 확인하자.

- src/app.ts onConnect 에서 리턴하는 객체를 graphql의 context 객체에 넣어주자.

        ...
            this.app = new GraphQLServer({
              schema,
              context: req => {
                const { connection: { context = null } = {} } = req;
                return {
                  req: req.request,
                  pubSub: this.pubSub,
                  ...context
                }
              }
            });
            this.middlewares();
          }
        ...

    onConnect 에서 리턴한 객체는 `req.connection.context`에 들어간다. 이 값을 context 객체에 포함 시키면 우리는 subscription에서도 사용자의 정보를 가져올 수 있다.

- src/api/User/DriversSubscription/DriversSubscription.resolvers.ts

        const resolvers = {
          Subscription: {
            DriversSubscription: {
              subscribe: (_, __, { pubSub, currentUser }) => {
                console.log(currentUser);
                return pubSub.asyncIterator('driverUpdate');
              }
            }
          }
        };
        
        export default resolvers;

다시 subscription 요청을 하면 user 객체를 정상적으로 출력 한다.

    subscription {
      DriversSubscription {
        fullName
        lastLat
        lastLng
      }
    }

(나같은 경우는 콘솔창을 조금 올려보니 있었다.)

## #1.70 Filtering Subscription Messages

## #1.71 Filtering Subscription Messages part Two

위에서 pubSub을 했다. 그러나 모든 드라이버에 대한 정보를 받으면 문제가 생긴다. 나는 서울에 사는데 부산의 정보가 전혀 필요가 없기 때문이다. 우리는 근처에서 운행중인 정보만 가져오길 원한다. graohql-yoga 에는 withFilter 라는 함수가 있는데 이 함수를 통해 채널로 들어온 데이터를 사용할지 말지에 대한 필터링을 할 수 있다.

- src/api/User/DriversSubscription/DriversSubscription.resovlers.ts

        import { withFilter } from 'graphql-yoga';
        
        const resolvers = {
          Subscription: {
            DriversSubscription: {
              subscribe: withFilter(
                (_, __, { pubSub, currentUser }) => pubSub.asyncIterator('driverUpdate'), 
                (payload, _, { currentUser }) => {
                  console.log('payload', payload);
                  console.log('currentUser', currentUser);
                  return true;
                }
              )
            }
          }
        };
        
        export default resolvers;

withFilter 함수는 첫 번째 인자로 기존의 구독함수를 받고, 두 번째 인자로 필터 함수를 받는다. 필터 함수는 필수적으로 boolean 을 리턴해야 하는데, true가 값을 받고 false가 값을 무시한다.

위처럼 작성하고 구독 시작 후 reportMovement를 하면 payload는 운전자가 갱신한 자신의 정보가, currentUser에는 구독한 유저에 대한 정보가 들어 있다.

> 같은 아이디로 테스트하면 헷갈리니까 임의의 계정 하나를 더 만들어서 테스트 하면 좋을 것 이다.

- src/api/User/DriversSubscription/DriversSubscription.resovlers.ts

        import { withFilter } from 'graphql-yoga';
        import User from '../../../entities/User';
        
        const resolvers = {
          Subscription: {
            DriversSubscription: {
              subscribe: withFilter(
                (_, __, { pubSub, currentUser }) => pubSub.asyncIterator('driverUpdate'), 
                (payload, _, { currentUser }) => {
                  const user: User = currentUser;
                  const {
                    DriversSubscription: {
                      lastLat: driverLastLat,
                      lastLng: driverLastLng
                    }
                  } = payload;
                  const { lastLat: userLastLat, lastLng: userLastLng } = user;
                  return (
                    driverLastLat >= userLastLat - 0.05 &&
                    driverLastLat <= userLastLat + 0.05 &&
                    driverLastLng >= userLastLng - 0.05 &&
                    driverLastLng <= userLastLng + 0.05
                  );
                }
              )
            }
          }
        };
        
        export default resolvers;

테스트 방법은 계정 두개를 만들고, 계정 하나는 드라이버로, 나머지 계정은 사용자 역할을 한다.

드라이버는 ToggleDriveMode를 호출하여 isDriving을 true로 만들고 lastLat, lastLng 모두 10으로 바꾸자. 사용자는 lastLat, lastLng 모두 10으로 바꾸자. 이제 같은 위치이기 때문에 subscription을 받을 것인데

lastLat을 10.3, 10.7 로 증가시켜보자. 10.7은 값을 받지 않을 것이다.

이렇게 subscription을 필터링하는 것을 했다.