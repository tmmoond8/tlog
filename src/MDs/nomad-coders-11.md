---
title: 11 우버 클론 코딩 (nomad coders)
date: '2019-04-28T08:56:56.243Z'
description: 우버 코딩 강의 로그 1.60 ~ 1.63
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632302785/tlog/cover/nuber_clone_nllng2.jpg'
tags:
  - 'Uber Clone Coding'
  - 'Nomad Coder'
  - TypeORM
  - GraphQL
---

이 포스트는 nomad coders의 우버 클론 코딩 시리즈를 듣고 정리한 글 입니다.

[https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course](https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course)

> 프로젝트를 시작할 때 tslint가 정상적으로 돌고 있지 않았는데, 원인이 tslint를 글로벌로 설치를 하고 typescript또한 글로벌로 설치를 해야 했었다. 이런 버그를 수정하고 나니 tslint가 import 순서를 지적 많이 해줘서 부득이하게 #1.62 부터 tslint에서 잡아준 import 순서대로 코드를 올리게 됐다.

이번에는 Place 정보를 추가하고 삭제하고 변경하는 과정을 진행할 예정이다.

## #1.60 AddPlace Resolver

이번에는 장소를 추가하는 type과 Mutation을 정의할 차례다. 한 사람은 여러 장소를 가질 수 있다. 주소가 같은 장소래도 사용자마다 독립적으로 가지는 형태인거 같다. 기존에는 장소와 유저와의 관계가 없었기 때문에 추가한다.

- src/api/User/shared/User.graphql 필드에 places를 추가 하자.
  ```ts
  ...
  ridesAsDriver: [Ride]
  places: [Place]
  isDriving: Boolean!
  ...
  ```

- src/api/Place/shared/Place.graphql  필드에 user를 추가하자.
  ```ts
  ...
  isFav: Boolean!
  user: User!
  createAt: String!
  ...
  ```

- src/entities/Place.ts
  ```ts
  ...
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm'
  import User from './User'
  ...
    @Column({ type: "boolean"})
    isFav: boolean;

    @ManyToOne(type => User, user => user.places)
    user: User

    @CreateDateColumn() createAt: string;
    @UpdateDateColumn() updateAt: string;
  ...

  export default Place;
  ```
- src/entities/User.ts
  ```ts
  ...
  import Ride from './Ride';
  import Place from './Place';
  
  ...
  
    @OneToMany(type => Ride, ride => ride.driver)
    ridesAsDriver: Ride[];
  
    @OneToMany(type => Place, place => place.user)
    places: Place[];
  
    @Column({ type: "boolean", default: false})
    isDriving: boolean;
  ...
  ```

entities에 관계를 추가했다.

- src/api/Place/AddPlace/AddPlace.graphql
  ```ts
  type AddPlaceResponse {
    ok: Boolean!
    error: String
  }
  
  type Mutation {
    AddPlace(
      name: String!
      lat: Float!
      lng: Float!
      address: String!
      isFav: Boolean!
    ): AddPlaceResponse!
  }
  ```

- src/api/Place/AddPlace/AddPlace.resolvers.ts
  ```ts
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
  ```

장소에 대한 정보를 추가하는 것은 간단하게 끝났다.

## #1.61 EditPlace Resolver

Place에 대한 정보를 변경할 필요가 있다.

- src/api/Place/EditPlace/EditPlace.graphql
  ```ts
  type EditPlaceResponse {
    ok: Boolean!
    error: String
  }
  
  type Mutation {
    EditPlace(
      placeId: Int!,
      name: String,
      isFav: Boolean
    ): EditPlaceResponse!
  }
  ```

- src/api/Place/EditPlace/EditPlace.resolvers.ts
  ```ts
  import { EditPlaceMutationArgs, EditPlaceResponse } from "src/types/graph";
  import { Resolvers } from "src/types/resolvers";
  import Place from "../../../entities/Place";
  import User from "../../../entities/User";
  import cleanNullArgs from "../../../utils/cleanNullArgs";
  import privateResolver from "../../../utils/privateResolver";
  
  const resolvers: Resolvers = {
    Mutation: {
      EditPlace: privateResolver(async (
        _, 
        args : EditPlaceMutationArgs, 
        { req }
      ) : Promise<EditPlaceResponse> => {
        const user: User = req.user;
        try {
          const place = await Place.findOne({id: args.placeId}, { relations: ["user"] });
          if(place) {
            if(place.user.id === user.id) {
              const notNull: any = cleanNullArgs(args);
              delete notNull.placeId;
              await Place.update({ id: args.placeId }, { ...notNull });
              return {
                ok: true,
                error: null
              }
            } else {
              return {
                ok: false,
                error: 'Not Authorized'
              }
            }
          } else {
            return {
              ok: false,
              error: 'Place not found'
            }
          }
        } catch (error) {
          return {
            ok: true,
            error: error.message
          }
        }
      })
    }
  }
  
  export default resolvers;
  ```

작성한 코드를 살펴보자. 처음 보는 표현이 있다. 
```ts
const place = await Place.findOne({id: args.placeId}, { relations: ["user"] });
```

place entity는 user에 관계되어 있다. place 를가져올 때, 관계가 있는 user 를 같이 가져올라고 하면 위처럼 relations 옵션을 줘야지 가져올 수 있다.

이런 방식은 일반적인 관계형 DB의 방식이지만 내가 필요한 데이터는 `[user.id](http://user.id)` 하나 뿐인데 너무 큰 비용이 발생한다고 생각할 수 있다. 근데 조회할 때 필요하지 않은데 모두 가져와 버리면 DB의 성능 문제가 발생할 것이다.그래서 우리는 place entity에 userId 필드를 추가해서 손쉽게 가져올 것이다.

> 니콜라스의 말에 따르면 관계가 변하지 않으면 객체 전체를 연관하지만 해당 객체의 id만 가지게 하는 것도 나쁘지 않다고 한다. 왜냐하면 id는 테이블 관점에서는 외래키이기 때문이다.

- src/api/Place/shared/Place.graphql 에 userId 필드를 추가하자.
  ```ts
  ...
    isFav: Boolean!
    userId: Int
    user: User!
  ...
  ```

- src/entities/Place.ts
  ```ts
  ...
    @Column({ type: "boolean"})
    isFav: boolean;
  
    @Column({nullable: true})
    userId: number;
  
    @ManyToOne(type => User, user => user.places)
    user: User
  ...
  ```

여기서 typeorm이 하는 멋진일이 있는데, Place를 저장할 때 따로 uesrId에 값을 채울 필요없이 user 에 값을 넣으면 `user.id`가 userId으로 자동으로 채워진다고 한다. 차이라면 type을 정의하지 않는 거??

이제 relations를 사용하지 않은 코드로 조금 변경하자

- src/api/Place/EditPlace/EditPlace.resolvers.ts
  ```ts
  ...
  try {
    const place = await Place.findOne({id: args.placeId});
    if(place) {
      if(place.userId === user.id) {
        const notNull = cleanNullArgs(args);
  ...
  ```

강의에서는 언급되지 않지만 내가 겪은 오류가 있었다. 

```ts
const notNull: any = cleanNullArgs(args);
delete notNull.placeId;
await Place.update({ id: args.placeId }, { ...notNull });
```

args에는 placeId라는 프로퍼티가 있다. 이 값에 일치하는 id를 가진 Place를 찾는데, 이때

notNull 객체가 placeId를 프로퍼티로 갖는게 문제다. id 를 업데이트 하는 것 자체도 논리적으로 문제지만, Place entity에는 id는 정의되어 있지만 placeId가 정의되어 있지 않다. 그렇기 때문에 오류가 발생해서 placeId는 일치하는 값을 찾는데에만 쓰기 때문에 제거하는 로직을 추가 하였다.

## #1.62 DeletePlace Resolver

place 삭제 관련 코드다. 특별히 설명할 것은 없다.

- src/api/Place/DeletePlace/DeletePlace.graphql
  ```ts
  type DeletePlaceResponse {
    ok: Boolean!
    error: String
  }
  
  type Mutation {
    DeletePlace(placeId: Int!) : DeletePlaceResponse!
  }
  ```

- src/api/Place/DeletePlace/DeletePlace.resolvers.ts
  ```ts
  import { DeletePlaceMutationArgs, DeletePlaceResponse } from "src/types/graph";
  import { Resolvers } from "src/types/resolvers";
  import Place from "../../../entities/Place";
  import User from "../../../entities/User";
  import privateResolver from "../../../utils/privateResolver";
  
  const resolvers: Resolvers = {
    Mutation: {
      DeletePlace: privateResolver(async (
        _, 
        args: DeletePlaceMutationArgs, 
        { req }
      ): Promise<DeletePlaceResponse> => {
        const user: User = req.user;
        try {
          const place = await Place.findOne({ id: args.placeId });
          if(place) {
            if(place.userId === user.id) {
              place.remove();
              return {
                ok: true,
                error: null
              }
            } else {
              return {
                ok: false,
                error: 'Not Authorized'
              }
            }
          } else {
            return {
              ok: false,
              error: 'Place not found'
            }
          }
        } catch(error) {
          return {
            ok: false,
            error: error.message
          }
        }
      })
    }
  }
  
  export default resolvers;
  ```

## #1.63 GetMyPlaces Resolver and Testing

- src/api/Place/GetMyPlace/GetMyPlaces.graphql
  ```ts
  type GetMyPlacesResponse {
    ok: Boolean!
    error: String
    places: [Place]
  }
  
  type Query {
    GetMyPlaces: GetMyPlacesResponse!
  }
  ```

- src/api/Place/GetMyPlace/GetMyPlaces.resolvers.ts
  ```ts
  import { GetMyPlacesResponse } from "src/types/graph";
  import { Resolvers } from "src/types/resolvers";
  import User from "../../../entities/User";
  import privateResolver from "../../../utils/privateResolver";
  
  const resolvers: Resolvers = {
    Query: {
      GetMyPlaces: privateResolver(async (_, __, { req }) : Promise<GetMyPlacesResponse> => {
        try {
          const user: any = await User.findOne(
            { id: req.user.id },
            { relations: ["places"]}
          );
          if(user) {
            return {
              ok: true,
              error: null,
              places: user.places
            }
          } else {
            return {
              ok: false,
              error: "User not found",
              places: null
            }
          }
        } catch(error) {
          return {
            ok: false,
            error: error.message,
            places: null
          }
        }
      })
    }
  }
  
  export default resolvers;
  ```

지금까지 작성한 mutation과 query를 테스트 해보자.

[http://localhost:4000/playground](http://localhost:4000/playground) 에 접근해서 다음의 쿼리를 날려보자. 물론 요청 헤더에 token을 포함하는 것을 잊지 말아야 한다.

```ts
query {
  GetMyPlaces {
    ok
    error
    places {
      id
      name
      isFav
    }
  }
}
```

정상적으로 가져오지만 places가 빈 배열일 것이다. 아래에 장소 하나를 추가해보자.

```ts
mutation {
  AddPlace(name: "home", lat: 133.1, lng: 32.3, address: "대한민국 서울", isFav: true) {
    ok
    error
  }
}
```

이 후 다시 `GetMyPlaces`쿼리를 보내면 장소값이 들어있는 것을 확인할 수 있다. 임의로 하나 더 추가 해보자.
```ts
mutation {
  AddPlace(name: "work", lat: 9.1, lng: 1.3, address: "대한민국 판교", isFav: false) {
    ok
    error
  }
}
```

이제 EditPlace를 호출하자. 제일 먼저 추가한 place가 변경될 것이다. GetMyPlaces로 변경된 것을 확인하자.
```ts
mutation {
  EditPlace(placeId: 1, name: "즐거운 나의집") {
    ok
    error
  }
}
```

DeletePlace로 호출하자.
```ts
mutation {
  DeletePlace(placeId: 2) {
    ok
    error
  }
}
```

정상적으로 작동 한다.!