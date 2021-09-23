---
title: 14 우버 클론 코딩 (nomad coders)
date: '2019-05-02T08:56:56.243Z'
description: 우버 코딩 강의 로그 1.76 ~ 1.80
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1632302785/tlog/cover/nuber_clone_nllng2.jpg'
tags:
  - 'Uber Clone Coding'
  - 'Nomad Coder'
  - GraphQL
---
# 

이 포스트는 nomad coders의 우버 클론 코딩 시리즈를 듣고 정리한 글 입니다.

[https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course](https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course)

## #1.76 UpdateRideStatus Resolver part One
## #1.77 UpdateRideStatus Resolver part Two

이전에 Ride를 요청하고 운전자가 주변으로 요청된 Ride를 확인하는 것 까지 했다. 이제 운전자는 요청된 Ride를 수락해야 한다.

- src/api/Ride/UpdateRideStatus/UpdateRideStatus.graphql

        type UpdateRideStatusResponse {
          ok: Boolean!
          error: String
        }
        
        enum StatusOptions {
          ACCEPTED
          FINISHED
          CANCELED
          REQUESTING
          ONROUTE
        }
        
        type Mutation {
          UpdateRideStatus(
            rideId: Int!, 
            status: StatusOptions!
          ): UpdateRideStatusResponse!
        }

- src/api/Ride/UpdateRideStatus/UpdateRideStatus.resolvers.ts

        import { UpdateRideStatusMutationArgs, UpdateRideStatusResponse } from "src/types/graph";
        import { Resolvers } from "src/types/resolvers";
        import Ride from "../../../entities/Ride";
        import User from "../../../entities/User";
        import privateResolver from "../../../utils/privateResolver";
        
        const resolvers: Resolvers = {
          Mutation: {
            UpdateRideStatus: privateResolver(
              async (
                _, 
                args: UpdateRideStatusMutationArgs, 
                { req }
              ) : Promise<UpdateRideStatusResponse> => {
                  const user: User = req.user;
                  if(user.isDriving) {
                    try {
                      let ride: Ride | undefined;
                      if(args.status === "ACCEPTED") {
                        ride = await Ride.findOne({
                          id: args.rideId,
                          status: "REQUESTING"
                        });
                        if(ride) {
                          ride.driver = user;
                          user.isTaken = true;
                          user.save();
                        }
                      } else {
                        ride = await Ride.findOne({
                          id: args.rideId,
                          driver: user
                        });
                      }
                      if(ride) {
                        ride.status = args.status
                        ride.save();
                        return {
                          ok: true,
                          error: null,
        									rideId: ride.id
                        }
                      } else {
                        return {
                          ok: false,
                          error: "Can't found Ride",
        									rideId: null
                        }
                      }
                    } catch(error) {
                      return {
                        ok: false,
                        error: error.message,
        								rideId: null
                      }
                    }
                  } else {
                    return {
                      ok: false,
                      error: "User is Not on driving",
        							rideId: null
                    }
                  }
              }
            )
          }
        }
        
        export default resolvers;

일단 대략적인 뼈대를 만들었지만, 여기서는 해야할 일이 많다. 수락하고 Ride 정보를 업데이트 해야 하기 때문이다.

운전자는 Ride의 상태를 업데이트 한다. (수락, 종료, 취소 등)

처음에 Ride는 Requesting 상태로 시작하고, 운전자가 승인하면 Accepted 상태로 된다. 승인되어야만 Ride는 driver로 승인한 운전자를 참조할 수 있다.

## #1.78 GetRide Resolver

이번에는 Ride값을 가져오는 간단한 쿼리를 만들어보자. 저번에 한번 설명했는데, 우리는 ride entity에서 passenger의 user.id와 driver의 user.id가 필요하다. 이러한 내용을 typeorm에서 찾을 때 relations 옵션 객체를 넘기면 되지만, 이렇게 되면 디비 성능을 조금 더 쓰게 된다. 그렇기 때문에 `passengerId`와 `driverId`를 별도의 필드로 추가하자.

- src/api/Ride/shared/Ride.graphql

        ...
          driver: User
          driverId: Int
          passenger: User
          passengerId: Int
        ...

- src/entities/Ride.ts

        ...
        	@ManyToOne(type => User, user => user.ridesAsPassenger)
          passenger: User;
        
          @Column({nullable: true})
          passengerId: number;
        
          @ManyToOne(type => User, user => user.ridesAsDriver, { nullable: true })
          driver: User;
        
          @Column({nullable: true})
          driverId: number;
        ...

- src/api/Ride/GetRide./GetRide.graphql

        type GetRideResponse {
          ok: Boolean!
          error: String
          ride: Ride
        }
        
        type Query {
          GetRide(rideId: Int!): GetRideResponse!
        }

- src/api/Ride/GetRide/GetRide.resolvers.ts

        import { GetRideQueryArgs, GetRideResponse } from "src/types/graph";
        import { Resolvers } from "src/types/resolvers";
        import Ride from "../../../entities/Ride";
        import User from "../../../entities/User";
        import privateResolver from "../../../utils/privateResolver";
        
        const resolvers: Resolvers = {
          Query : {
            GetRide: privateResolver(async (
              _,
              args: GetRideQueryArgs,
              { req }
            ) : Promise<GetRideResponse> => {
              const user: User = req.user;
              try {
                const ride = await Ride.findOne(
                  {
                    id: args.rideId
                  },
                  { relations: ["passenger", "driver"]}
                );
                if(ride) {
                  if(ride.passengerId === user.id || ride.driver.id === user.id) {
                    return {
                      ok: true,
                      error: null,
                      ride
                    };
                  } else {
                    return {
                      ok: false,
                      error: "Not Authorized",
                      ride: null
                    };
                  }
                } else {
                  return {
                    ok: false,
                    error: "Ride not found",
                    ride: null
                  }
                }
              } catch (error) {
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

rideId를 통해 Ride값을 가져오는데, 아무나 접근하면 안되니까 드라이버나 승객으로 포함되어 있는지 여부를 확인한다.

아래서 작성한 쿼리를 확인하자. rideId는 RequestRide 에서 얻은 id를 넣자. (13장 마지막에 기억하라고 했는데, 잘 모르겠다면  1부터 10정도까지 값을 넣어보면...) header에는 탑승자의 token을 넣자.

    query {
      GetRide(rideId: 5) {
        ok
        error
        ride {
          status
        }
      }
    }

아래 요청은 `RUQUESTING` 상태인 status를 `ACCEPTED`로 바꾼다. header에는 운전자의 token을 넣자. (만약 not driving 같은 문구가 나오면 ToggleDrivingMode을 호출하자.

    mutation {
      UpdateRideStatus(rideId:5, status: ACCEPTED) {
        ok
        error
      }
    }

GetRide를 다시 요청하면 바뀌었을 것이다.

## #1.79 RideStatusSubscription

유저가 Ride 요청을 보내면 여러 운전자가 Ride요청을 확인할 수 있다. 그리고 누군가가 승인하면, 다른 모든 운전자에게도 그 요청이 승인되어서 보이지 않거나 만료된 형태로 알수 있어야 한다. Ride의 상태를 구독하는 Subscription을 만들자.

- src/api/Ride/RideStatusSubscription/RideStatusSubscription.graphql

        interface Subscription {
          RideStatusSubscription: Ride
        }

- src/api/Ride/RideStatusSubscription/RideStatusSubscription.resolvers.ts

        import { withFilter } from "graphql-yoga";
        import User from "../../../entities/User";
        
        const resolvers = {
          Subscription: {
            RideStatusSubscription: {
              subscribe: withFilter(
                (_, __, { pubSub }) => pubSub.asyncIterator("rideUpdate"),
                (payload, _, context ) => {
                  const user: User = context.currentUser;
                  const {
                    RideStatusSubscription: { drvierId, passengerId }
                  } = payload;
                  return user.id === drvierId || user.id === passengerId;
                }
              )
            }
          }
        }
        
        export default resolvers;

    `rideUpdate` 채널로 데이터를 구독한다. 

`rideUpdate`채널에 데이터가 업데이트할 때 데이터를 넣어주자.

- src/api/Ride/UpdateRideStatus/UpdateRideStatus.resolvers.ts .   args.status 가 FINISHED일때 운전자와 승객의 속성을 초기화 해주었다. 이 부분은 내가 임의로 작성하였다.

        ...
                { req, pubSub }
              ) : Promise<UpdateRideStatusResponse> => {
                ...
                      
        							} else {
                        ride = await Ride.findOne({
                          id: args.rideId,
                          driver: user
                        });
                      }
                      if(ride) {
                        ride.status = args.status
                        ride.save();
                        pubSub.publish("rideUpdate", { RideStatusSubscription: ride });
        								if (args.status === "FINISHED") {
                          await User.update({ id: ride.driverId }, { isTaken: false });
                          await User.update({ id: ride.passengerId }, { isRiding: false });
                        }
                        return {
                          ok: true,
                          error: null,
        									rideId: ride.id
                        }
        ...

다 잘 마무리 되었다.

## #1.80 Testing the RideStatusSubscription

이번에는 구독을 잘하는지 테스트를 하자.

[http://localhost:4000/playground](http://localhost:4000/playground) 에 접속해서 구독을 하자. 헤더에는 탑승자의 token을 포함시키자.

    subscription {
      RideStatusSubscription {
        status
      }
    }

그리고 운전자의 token으로 UpdateRideStatus로 다른 값으로 바뀌면 구독한 곳에서 값을 읽어 들일 것이다.