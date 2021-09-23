---
title: 13 우버 클론 코딩 (nomad coders)
date: '2019-05-01T08:56:56.243Z'
description: 우버 코딩 강의 로그 1.72 ~ 1.75
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1632302785/tlog/cover/nuber_clone_nllng2.jpg'
tags:
  - 'Uber Clone Coding'
  - 'Nomad Coder'
  - GraphQL
---
# 

이 포스트는 nomad coders의 우버 클론 코딩 시리즈를 듣고 정리한 글 입니다.

[https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course](https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course)

## #1.72 RequestRide Resolver

이번에는 RequestRide 의 Query를 정의할 것이다. 내가 우버 택시에 대해서 오해한 점이 있다. 나는 이 서비스가 카풀인줄 알았다.그런데 그게 아니라 카카오 택시 같은 택시였다. 그렇기 때문에 탑승자는 자신이 가고자 하는 길을 요청하고, 이 요청은 가장 가까이 있는 운전자에게가는 것이다.

- src/entities/Ride.ts Ride entity를 조금 손볼 게 있다. status 필드의 default 값을 추가하고, driver에 `nullable: true`로 설정하자.

        ...
        
        @Column({ 
          type: "text", 
          enum: ["ACCEPTED", "FINISHED", "CANCELED", "REQUESTING", "ONROUTE"],
          default: "REQUESTING"
        })
        status: rideStatus;
        
        ...
        
        @ManyToOne(type => User, user => user.ridesAsDriver, { nullable: true })
          driver: User;
        
        ...

- src/api/Ride/RequestRide/RequestRide.graphql 생성해서

        type RequestRideResponse {
          ok: Boolean!
          error: String
          ride: Ride
        }
        
        type Mutation {
          RequestRide(
            pickUpAddress: String!
            pickUpLat: Float!
            pickUpLng: Float!
            dropOffAddress: String!
            dropOffLat: Float!
            dropOffLng: Float!
            price: Float!
            distance: String!
            duration: String!
          ): RequestRideResponse!
        }

- src/api/Ride/RequestRide/RequestRide.resolvers.ts

        import { RequestRideMutationArgs, RequestRideResponse } from "src/types/graph";
        import { Resolvers } from "src/types/resolvers";
        import Ride from "../../../entities/Ride";
        import User from "../../../entities/User";
        import privateResolver from "../../../utils/privateResolver";
        
        const resolvers: Resolvers = {
          Mutation: {
            RequestRide: privateResolver(async (
              _, 
              args: RequestRideMutationArgs, 
              { req }
            ): Promise<RequestRideResponse> => {
              const user: User = req.user;
              try {
                const ride = await Ride.create({ ...args, passenger: user }).save();
                return {
                  ok: true,
                  error: null,
                  ride
                }
              } catch(error) {
                return {
                  ok: false,
                  error: error.message,
                  ride: null
                }
              }
            })
          }
        }
        
        export default resolvers;

## #1.73 GetNearbyRides Resolver

운전자가 근처에서 요청한 Ride를 가져온다.

- src/api/Ride/GetNearbyRides/GetNearbyRides.graphql

        type GetNearbyRideResponse {
          ok: Boolean!
          error: String
          ride: Ride
        }
        
        type Query {
          GetNearbyRide: GetNearbyRideResponse!
        }

- src/api/Ride/GetNearbyRides/GetNearbyRides.resolvers.ts

        import { GetNearbyRideResponse } from "src/types/graph";
        import { Resolvers } from "src/types/resolvers";
        import { Between, getRepository } from "typeorm";
        import Ride from "../../../entities/Ride";
        import User from "../../../entities/User";
        import privateResolver from "../../../utils/privateResolver";
        
        const resolvers: Resolvers = {
          Query: {
            GetNearbyRide: privateResolver(
              async (_, __, { req }): Promise<GetNearbyRideResponse> => {
              const user: User = req.user;
              if(user.isDriving) {
                const { lastLat, lastLng } = user;
                try {
                  const ride = await getRepository(Ride).findOne({
                    status: "REQUESTING",
                    pickUpLat: Between(lastLat - 0.05, lastLat + 0.05),
                    pickUpLng: Between(lastLng - 0.05, lastLng + 0.05)
                  },
                  { relations: ["passenger"]}
        					);
                  return {
                    ok: true,
                    error: null,
                    ride: ride || null
                  }
                } catch (error) {
                  return {
                    ok: false,
                    error: error.message,
                    ride: null
                  }
                }
              } else {
                return {
                  ok: false,
                  error: 'You are not a driver',
                  ride: null
                }
              }
            })
          }
        }
        
        export default resolvers;

## #1.74 NearbyRideSubscription

운전자는 주변의 Ride 요청을 구독한다.

- src/api/Ride/NearbyRideSubscription/NearbyRideSubscription.graphql

        type Subscription {
          NearbyRideSubscription: Ride
        }

- src/api/Ride/NearbyRideSubscription/NearbyRideSubscription.resolvers.ts 운전자가 주변에 ride를 요청한 사람의 정보를 가져온다.

        import { withFilter } from "graphql-yoga";
        import User from "../../../entities/User";
        
        const resolvers = {
          Subscription: {
            NearbyRideSubscription: {
              subscribe: withFilter(
                (_, __, { pubSub }) => pubSub.asyncIterator('rideRequest'),
                (payload, _, { currentUser }) => {
                  const user: User = currentUser;
                  const {
                    NearbyRideSubscription: { pickUpLat, pickUpLng }
                  } = payload;
                  const { lastLat: uesrLastLat, lastLng: userLastLng } = user;
                  return (
                    Math.abs(pickUpLat - uesrLastLat) <= 0.05 &&
                    Math.abs(pickUpLng - userLastLng) <= 0.05
                  );
                }
              )
            }
          }
        };
        
        export default resolvers;

- src/api/Ride/RequestRide/RequestRide.resolvers.ts 사용자가 요청한 ride를 rideRequest 채널로 보낸다.

        ...
              { req, pubSub }
            ): Promise<RequestRideResponse> => {
              const user: User = req.user;
              try {
                const ride = await Ride.create({ ...args, passenger: user }).save();
                pubSub.publish('rideRequest', { NearbyRideSubscription: ride });
                return {
                  ok: true,
                  error: null,
                  ride
                }
        ...

## #1.75 Testing the NearbyRideSubscription

Ride 구독 기능을 테스트 할 텐데,  테스트 하기 앞서 간단한 수정 내용이 있다. 어떤 사용자가 ride 요청을 할 때 중복해서 요청할 수 있는데, 이를 방지 해야 한다. user의 isRiding 필드를 통해 요청중인지를 확인할 수 있다.

- src/api/Ride/RequestRide/RequestRide.resolvers.ts user.isRiding 을 확인 하는 로직과, Ride를 요청하면 `user.isRiding = true`와 이 내용을 업데이트 하도록 수정했다.

        import { RequestRideMutationArgs, RequestRideResponse } from "src/types/graph";
        import { Resolvers } from "src/types/resolvers";
        import Ride from "../../../entities/Ride";
        import User from "../../../entities/User";
        import privateResolver from "../../../utils/privateResolver";
        
        const resolvers: Resolvers = {
          Mutation: {
            RequestRide: privateResolver(async (
              _, 
              args: RequestRideMutationArgs, 
              { req, pubSub }
            ): Promise<RequestRideResponse> => {
              const user: User = req.user;
        	      if(true || !user.isRiding) {// 임시로 true
                try {
                  const ride = await Ride.create({ ...args, passenger: user }).save();
                  pubSub.publish('rideRequest', { NearbyRideSubscription: ride });
                  user.isRiding = true;
                  user.save();
                  return {
                    ok: true,
                    error: null,
                    ride
                  }
                } catch(error) {
                  return {
                    ok: false,
                    error: error.message,
                    ride: null
                  }
                }
              } else {
                return {
                  ok: false,
                  error: "You can't request two rides",
                  ride: null
                }
              }
            })
          }
        }
        
        export default resolvers;

이제 테스트를 해볼 차례인데, 테스트의 편의를 위해 나는 4 가지 탭을 만들었다. `GetMyProfile` 과 `RequestMovement` 인데 운전자와 사용자로 2쌍씩 해서 4개가 된다.

    query {
      GetMyProfile {
        ok
        error
        user {
          id
          fullName
          lastLat
          lastLng
          isDriving
          isRiding
        }
      }
    }

    mutation {
      ReportMovement(lastLat: 10, lastLng:10) {
        ok
        error
      }
    }

일단 위도와 경도를 모두 10으로 맞추자.

운전자 token으로 subscription을 실행하자.

    subscription {
      NearbyRideSubscription {
        passenger {
          fullName
        }
        pickUpLat
        pickUpLng
    	}
    }

이제 사용자 아이디로 요청을 만들어보자.

    mutation {
      RequestRide(pickUpAddress:"동네", pickUpLat: 10, pickUpLng: 10, dropOffAddress: "옆 동네", dropOffLat: 11, dropOffLng: 11, price: 1110.2, distance: "멀어", duration: "오래걸려") {
        ok
        error
        ride {
          id
          pickUpLat
          pickUpLng
        }
      }
    }

위도를 10 에서 10.03, 10.06 으로 변화해가면서 0.05 거리가 벗어나면 데이터가 안들어오는지 확인하자.

테스트가 끝났다면 임시 코드를 복구 하여, 중복 체킹이 되는지도 확인하자.

    if(!user.isRiding) {// 임시로 true

RequestRide 요청을 하고 결과로 id를 받는데 여기서 받은 id를 뒤에서 사용하니 값을 기억하자. 나의 경우는 5가 나왔다.