---
templateKey: blog-post
title: 🚕 10 우버 클론 코딩 (nomad coders)
date: 2019-04-27T08:56:56.243Z
description: 우버 코딩 강의 로그 1.56 ~ 1.59
featuredpost: true
featuredimage: /img/nuber_clone.jpg
tags:
  - nomad coders
  - 우버 클론 코딩
  - typeorm
---
# 

## #1.56 UpdateMyProfile Resolver part One

## #1.56 UpdateMyProfile Resolver part Two

유저의 정보를 업데이트 하는 type과 mutation을 작성하자

- src/api/User/UpdateMyProfile/UpdateMyProfile.graphql

        type UpdateMyProfileResponse {
          ok: Boolean!
          error: String
        }
        
        type Mutation {
          UpdateMyProfile(
            firstName: String, 
            lastName: String, 
            email: String, 
            password: String, 
            profilePhoto: String, 
            age: Int,
            phoneNumber: String
          ): UpdateMyProfileResponse!
        }

- src/api/User/UpdateMyProfile/UpdateMyProfile.resolvers.ts

        import { Resolvers } from "src/types/resolvers";
        import privateResolver from "../../../utils/privateResolver";
        import User from "../../../entities/User";
        
        const resolvers: Resolvers = {
          Mutation: {
            UpdateMyProfile: privateResolver(async (_, args, { req }) => {
                const user: User = req.user;
                const notNull = {};
                Object.keys(args).forEach(key => {
                  if(args[key] !== null) {
                    notNull[key] = args[key];
                  }
                });
                try {
                  await User.update({ id: user.id }, { ...notNull });
                  return {
                    ok: true,
                    error: null
                  }
                } catch (error) {
                  return {
                    ok: false,
                    error: error.message
                  }
                }
              }
            )
          }
        };
        
        export default resolvers;

동작을 바로 확인 해보자.

[http://localhost:4000/playground](http://localhost:4000/playground) **에서 다음의 쿼리를 날리자. 헤더에 유저 토큰을 포함하는 것을 잊지말자.**

    query {
      GetMyProfile {
        user {
          id
          fullName
        }
      }
    }

잘 출력 되었다면

    mutation {
      UpdateMyProfile(firstName: "dev") {
        ok
        error
      }
    }

이름에 dev가 잘 찍인다. 유저 정보가 잘 업데이트 됐다.

## #1.57.1 UpdateMyProfile Resolver Bug Fixing

니콜라스가 버그 픽스로 찍은 강의다. 이 강의는 매우 중요한 내용을 다룬다. 일단 코드를 보면 password에 대해 예외 처리하는 부분이 추가가 되었다.

- src/api/User/UpdateMyProfile/UpdateMyProfile.resolvers.ts

        ...
                Object.keys(args).forEach(key => {
                  if(args[key] !== null) {
                    notNull[key] = args[key];
                  }
                });
                
                if(notNull.hasOwnProperty('password')) {
                  user.password = notNull['password'];
                  user.save();
                  delete notNull['password'];
                }
        
                try {
                  await User.update({ id: user.id }, { ...notNull });
                  return {
                    ok: true,
                    error: null
                  }
        ...

이전에 User entity를 작성할 때 유저가 생성되거나 업데이트가 될 때 `@BeforeInsert`, `@BeforeUpdate`트기거를 달아준 것을 기억할 것이다.

![](_2019-04-23__9-0adaefe3-b685-498d-aaaa-03052cbb8112.47.01.png)

아래 코드는 저 트리거를 타지 않는다.

`await User.update({ id: user.id }, { ...notNull });`

업데이트 할 때 트리거를 타는 경우는 아래처럼 인스턴스로 업데이트 할 때다.

`user.save()`

그래서 추가된 코드를 보면 변경할 내용중 password가 있으면 password만 따로 저장하고 나머지 로직을 태우도록 했다. 이런 내용은 모르고 있으면 삽질하기 좋다.

> 여기서 드는 의문점.. 그냥 모든 데이터를 업데이트할 때 user.save()에서 해주면 되지 않을까???

## #1.58 ToggleDrivingMode Resolver

사용자는 우버 앱을 켜서 근처에서 운행하는 차를 확인할 수 있다. 사용자는 드라이빙 모드로 전환해서 운행 정보를 주변에 알린다. 또 드라이빙 모드를 중단하면 이런 정보도 주변에 알려야 한다.

- src/api/User/ToggleDrivingMode/ToggleDrivingMode.graphql

        type ToggleDrivingModeResponse {
          ok: Boolean!
          error: String
        }
        
        type Mutation {
          ToggleDrivingMode: ToggleDrivingModeResponse!
        }

- src/api/User/ToggleDrivingMode/ToggleDrivingMode.resolvers.ts

        import { Resolvers } from "src/types/resolvers";
        import privateResolver from "../../../utils/privateResolver";
        import User from "../../../entities/User";
        
        const resolvers: Resolvers = {
          Mutation: {
            ToggleDrivingMode: privateResolver(async (_, __, { req }) => {
              const user: User = req.user;
              user.isDriving = !user.isDriving;
              user.save();
              return {
                ok: true,
                error: null
              }
            })
          }
        }
        
        export default resolvers;

## #1.59 ReportMovement Resolver

이번엔 자신의 이동을 사용자에게 알리는 ReportMovement 의 type과 Mutation을 정의할텐데.

그전에 UpdateMyProfile에서 null값으로 들어온 args 를 제거 하여 다시 객체로 만든 코드를 util 함수로 만들자. 이 코드는 다른 곳에서도 사용되기 때문이다.

- src/utils/cleanNullArgs.ts 파일을 생성해서

        const cleanNullArgs = (args: object) : object => {
          const notNull = {};
          Object.keys(args).forEach(key => {
            if(args[key] !== null) {
              notNull[key] = args[key];
            }
          });
          return notNull;
        }
        
        export default cleanNullArgs;

- src/api/User/UpdateMyProfile/UpdateMyProfile.resolvers.ts

        import { Resolvers } from "src/types/resolvers";
        import cleanNullArgs from "../../../utils/cleanNullArgs";
        import privateResolver from "../../../utils/privateResolver";
        import User from "../../../entities/User";
        
        ...
        Mutation: {
            UpdateMyProfile: privateResolver(async (_, args, { req }) => {
                const user: User = req.user;
                const notNull: any = cleanNullArgs(args);
                if(notNull.password) {
                  user.password = notNull.password;
                  user.save();
                  delete notNull.password;
                }
        ...

이제 ReportMovement의 type과 Mutation을 정의하자.

- src/api/User/ReportMovement/ReportMovement.grpahql

        type ReportMovementResponse {
          ok: Boolean!
          error: String
        }
        
        type Mutation {
          ReportMovement(
            orientation: Float
            lastLat: Float
            lastLng: Float
          ): ReportMovementResponse!
        }

- src/api/User/ReportMovement/ReportMovement.resolvers.ts

        import { AddPlaceMutationArgs, AddPlaceResponse } from "src/types/graph";
        import { Resolvers } from "src/types/resolvers";
        import Place from "../../../entities/Place";
        import User from "../../../entities/User";
        import privateResolver from "../../../utils/privateResolver";
        
        const resolvers: Resolvers = {
          Mutation: {
            AddPlace: privateResolver(async (
              _, 
              args: AddPlaceMutationArgs, 
              { req }
            ) : Promise<AddPlaceResponse> => {
              const user: User = req.user;
              try {
                await Place.create({ ...args, user }).save();
                return {
                  ok: true,
                  error: null
                }
              } catch(error) {
                return {
                  ok: false,
                  error: error.message
                }
              } 
            })
          }
        };
        
        export default resolvers;