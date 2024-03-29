---
title: 15 우버 클론 코딩 (nomad coders)
date: '2019-05-03T08:56:56.243Z'
description: 우버 코딩 강의 로그 1.81 ~ 1.87
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632302785/tlog/cover/nuber_clone_nllng2.jpg'
tags:
  - 'Uber Clone Coding'
  - 'Nomad Coder'
  - GraphQL
---

이 포스트는 nomad coders의 우버 클론 코딩 시리즈를 듣고 정리한 글 입니다.

[https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course](https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course)

## #1.81 Creating a ChatRoom

승객이 Ride를 요청하고, 운전자가 Ride를 수락하면 채팅이 가능하게 해야 한다. 여기서 내가 잘못 생각한게 있었다. 채팅방이 생성되면 거기서 여러 승객이 합석했을 때 다 같이 채팅하는 줄 알았는데, 여기서는 운전자와 Ride를 요청한 승객이 1:1 대화만 한다. 그리고 차에 타면 채팅방은 사라지는 것 같다.

니콜라스도 처음에 여럿이 채팅하는 걸로 entity구조를 짠거 같은데 보니까, 이번에 조금 수정해서 1:1 대화 형태로 만들었다. 그렇기 때문에 아래처럼 entity를 수정해줘야 한다.

- src/entities/Chat.ts 기존에 있던 `participants` 를 `passenger`와 `driver`로 구분했고, 별도의 각 id 필드 `passengerId`, `driverId`를 생성했다.
  ```ts
  import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm'
  import Message from './Message';
  import User from './User';
  
  @Entity()
  class Chat extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
  
    @OneToMany(type => Message, message => message.chat)
    messages: Message[]
  
    @ManyToOne(type => User, user => user.chatsAsPassenger)
    passenger: User;
  
    @Column({nullable: true})
    passengerId: number;
  
    @ManyToOne(type => User, user => user.chatsAsDriver)
    driver: User;
  
    @Column({nullable: true})
    driverId: number;
  
    @CreateDateColumn() createAt: string;
    @UpdateDateColumn() updateAt: string;
  }
  
  export default Chat;
  ```

- src/entities/User.ts `chat` 필드를 `chatsAsPassenger`와 `chatsAsDriver`로 구분했다.
  ```ts
  import bcrypt from 'bcrypt';
  import { IsEmail } from 'class-validator';
  import { 
    BaseEntity, 
    BeforeInsert,
    BeforeUpdate,
    Column, 
    CreateDateColumn,
    Entity,
    OneToMany, 
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import Chat from './Chat';
  import Message from './Message';
  import Place from './Place';
  import Ride from './Ride';
  
  const BCRYPT_ROUNDS = 10;
  
  ...	
    @Column({ type: "text"})
    profilePhoto: string;
  
    @OneToMany(type => Chat, chat => chat.passenger)
    chatsAsPassenger: Chat[];
  
    @OneToMany(type => Chat, chat => chat.driver)
    chatsAsDriver: Chat[];
  
    @OneToMany(type => Message, message => message.user)
    messages: Message[];
  ...
  ```

변경된 필드에 따라 graphql 타입도 변경하자.

- src/api/Chat/shared/Chat.graphql
  ```ts
  type Chat {
    id: Int!
    messages: [Message]!
    passenger: User!
    passengerId: Int!
    driver: User!
    driverId: Int!
    createAt: String!
    updateAt: String
  }
  ```

- src/api/User/shared/User.graphql `chat` 필드가 `chatsAsPassenger`, `chatsAsDriver`로 나뉘었다.
  ```ts
  ...	
  fullName: String
  chatsAsPassenger: [Chat]
  chatsAsDriver: [Chat]
  messages: [Message]
  ...
  ```

> 여기서 궁금한게 왜 Chat의 리스트형태를 갖는지다.  이렇게 하려면 동시에 여러 요청을 수락해야 하는건데,, 동시에 여러 차를 탈것도 아니고,,

- src/api/Ride/UpdateRideStatus/UpdateRideStatus.resolvers.ts 에서 채팅을 생성시키자.
  ```ts
  import { UpdateRideStatusMutationArgs, UpdateRideStatusResponse } from "src/types/graph";
  import { Resolvers } from "src/types/resolvers";
  import Chat from "../../../entities/Chat";
  import Ride from "../../../entities/Ride";
  import User from "../../../entities/User";
  import privateResolver from "../../../utils/privateResolver";
  
  const resolvers: Resolvers = {
    Mutation: {
      UpdateRideStatus: privateResolver(
        async (
          _, 
          args: UpdateRideStatusMutationArgs, 
          { req, pubSub }
        ) : Promise<UpdateRideStatusResponse> => {
            const user: User = req.user;
            if(user.isDriving) {
              try {
                let ride: Ride | undefined;
                if(args.status === "ACCEPTED") {
                  ride = await Ride.findOne(
                    {
                      id: args.rideId,
                      status: "REQUESTING"
                    }, 
                    { relations: ["passenger", "driver"]}
                  );
                  if(ride) {
                    ride.driver = user;
                    user.isTaken = true;
                    user.save();
                    await Chat.create({
                      driver: ride.driver,
                      passenger: ride.passenger
                    }).save();
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
  ```

    운전자가 승인을 하면 채팅방이 생성되는데 이때, 운전자가 `driver`로, `ride.passenger`가 `chat.passenger` 가 되어야 하기 때문에 relations 옵션으로 `passenger` 정보를 `ride`에 포함시키게 했다.

## #1.82 GetChat Resolver

GetChat Query를 작성하자. 그냥 하던데로 작성하면 된다.

- src/api/Chat/GetChat/GetChat.graphql
  ```ts
  type GetChatResponse {
    ok: Boolean!
    error: String
    chat: Chat
  }
  
  type Query {
    GetChat(chatId: Int!): GetChatResponse! 
  }
  ```

- src/api/Chat/GetChat/GetChat.resolvers.ts
  ```ts
  import { GetChatQueryArgs, GetChatResponse } from "src/types/graph";
  import { Resolvers } from "src/types/resolvers";
  import Chat from "../../../entities/Chat";
  import User from "../../../entities/User";
  import privateResolver from "../../../utils/privateResolver";
  
  const resolvers: Resolvers = {
    Query : {
      GetChat: privateResolver(async(
        _,
        args: GetChatQueryArgs,
        { req }
      ) :Promise<GetChatResponse> => {
        const user: User = req.user;
        try {
          const chat = await Chat.findOne({
            id: args.chatId
          });
          if(chat) {
            if(chat.driverId === user.id || chat.passengerId === user.id) {
              return {
                ok: true,
                error: null,
                chat
              }
            } else {
              return {
                ok: false,
                error: "Not Authorized",
                chat: null
              }
            }
          } else {
            return {
              ok: false,
              error: "Chat Not found",
              chat: null
            }
          }
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            chat: null
          }
        }
      })
    }
  }
  
  export default resolvers;
  ```

    위에 했던 것처럼 chatId로 chat 객체를 가져오고, 운전자 또는 승객일 때만 정상적으로 리턴해준다.

## #1.83 BugFixing

니콜라스가 진행하면서 빠뜨린게 있어서 기능 수정을 했다. Ride가 생성되면 운전자와 승객이 1:1로 채팅을 할 수 있도록 채팅 객체를 생성해야 한다. 그래서 Ride 와  Chat가 1:1 관계를 가지도록 수정해야 한다.

(내가 위에서 의구심을 제기한.. driver chat과 passenger chat..은 ..?)

타입을 위처럼 조금 수정하자.

- src/api/Chat/shared/Chat.graphql `ride`와 `rideId`를 추가하자.
  ```ts
  ...
  driverId: Int!
  ride: Ride!
  rideId: Int
  createAt: String!
  ...
  ```

- src/api/Ride/shared/Ride.graphql `chat`와 `chatId`를 추가하자.
  ```ts
  ..
  passengerId: Int
  chat: Chat
  chatId: Int
  distance: String!
  ...
  ```

- src/entities/Chat.ts `ride`와 `rideId`를 추가하자.
  ```ts
  import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm'
  import Message from './Message';
  import Ride from './Ride';
  import User from './User';
  
  ...
  
    @Column({nullable: true})
    driverId: number;
  
    @OneToOne(type => Ride, ride => ride.chat)
    ride: Ride;
  
    @Column({nullable: true})
    rideId: number;
  
    @CreateDateColumn() createAt: string;
    @UpdateDateColumn() updateAt: string;
  }
  
  export default Chat;
  ```

- src/entities/Ride.ts `chat`와 `chatId`를 추가하자.
  ```ts
  import { rideStatus } from 'src/types/types';
  import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
  } from 'typeorm'
  import Chat from './Chat';
  import User from './User';
  
  ...
  
    @Column({nullable: true})
    driverId: number;
  
    @OneToOne(type => Chat, chat => chat.ride)
    @JoinColumn()
    chat: Chat;
  
    @Column({nullable: true})
    chatId: number;
  
    @CreateDateColumn() createAt: string;
    @UpdateDateColumn() updateAt: string;
  }
  
  export default Ride;
  ```

    `@JoinColumn` 이라는 어노테이션을 설명해보겠다. 위에 Ride 엔터티에 chat 필드랑 1:1 관계이고 `@JoinColumn` 어노테이션을 사용했다. 1:1  관계일 때 관계가 있는 두 대상은 동등한 관계가 아니다. Chat는 Ride에 소유되어 소속없이 존재 하지 않는다. Ride 가 Chat라는 것을 소유하는 형태인데 이때 `@JoinColumn` 어노테이션을 사용한다.

- src/api/Ride/RequestRide/RequestRide.resolvers.ts 아래 두 줄을 조금 수정하자.
  ```ts
  ...
  if(!user.isRiding && !user.isDriving) {
  ...
  error: "You can't request two rides or request a ride with driving",
  ...
  ```

- src/api/Ride/UpdateRideStatus/UpdateRideStatus.resolvers.ts 운전자가 Ride 승인하면 chat를 생성해서 ride 에 넣어줘야 한다. (`chatId` 를 같이 셋팅한 것은 Subscription할 때 chatId를 바로 못가져오기 때문이다)githu
  ```ts
  ...
    const chat = await Chat.create({
      driver: user,
      passenger: ride.passenger
    }).save();
    ride.chat = chat;
    ride.chatId = chat.id;
    ride.save();
  }
  ...
  ```

## #1.84 Testing GetChat Resolver

채팅 객체가 잘 생성되는지 테스트를 해보자.

- src/api/Chat/GetChat/GetChat.resolvers.ts chat 데이터를 가져올 때 관계된 데이터를 가져오게 변경하자.
  ```ts
  ...
  const chat = await Chat.findOne(
    { id: args.chatId },
    { relations: ["messages", "passenger", "driver"]}
  );
  ...
  ```

테스트에 앞서 데이터를 조금 수정해야 한다. pgAdmin 4 프로그램으로 승객 유저의 `isRiding`필드를 false로 두고, 모든 Ride 레코드를 지우자.

다시 승객은 RequestRide 를 요청하고, 운전자는 UpdateRideStatus로 ACCEPTED로 만들자. 그러면 Chat가 생성되었을 것이다. 
```ts
query {
  GetRide(rideId: 10) { #rideId는 얻은 값으로 넣자.
    ok
    error
    ride {
      pickUpLat
      pickUpLng
      status
      chatId
    }
  }
}
```

chatId를 얻었다면,, 아래를 요청하면 데이터가 잘 나올 것이다.
```ts
query {
  GetChat(chatId: 1) {
    ok
    error
    chat {
      messages {
        text
      }
      passenger {
        fullName
      }
      driver {
        fullName
      }
    }
  }Sen
}
```

테스트를 했다면 아래처럼 다시 바꿔주자. chat에는 messages만 필요하기 때문이다.

- src/api/Chat/GetChat/GetChat.resolvers.ts chat 데이터를 가져올 때 관계된 데이터를 가져오게 변경하자.
  ```ts
  ...
  const chat = await Chat.findOne(
    { id: args.chatId },
    { relations: ["messages"]}
  );
  ...
  ```

## #1.85 SendChatMessage Resolver

채팅방은 만들었고 이제 채팅 메시지를 만들어서 채팅을 해야 한다. 위에서 했던 내용과 크게 다르지 않다.

- src/api/Chat/SendChatMessage/SendChatMessage.graphql
  ```ts
  type SendChatMessageResponse {
    ok: Boolean!
    error: String
    message: Message
  }
  
  type Mutation {
    SendChatMessage(chatId: Int!, text: String!): SendChatMessageResponse!
  }
  ```

- src/api/Chat/SendChatMessage/SendChatMessage.resolvers.ts
  ```ts
  import { SendChatMessageMutationArgs, SendChatMessageResponse } from "src/types/graph";
  import { Resolvers } from "src/types/resolvers";
  import Chat from "../../../entities/Chat";
  import Message from "../../../entities/Message";
  import User from "../../../entities/User";
  import privateResolver from "../../../utils/privateResolver";
  
  const resolvers: Resolvers = {
    Mutation : {
      SendChatMessage: privateResolver(async (
        _, 
        args: SendChatMessageMutationArgs, 
        { req }
      ) : Promise<SendChatMessageResponse> => {
        const user: User = req.user;
        try {
          const chat = await Chat.findOne({ id: args.chatId });
          if (chat) {
            if(chat.driverId === user.id || chat.passengerId === user.id) {
              const message = await Message.create({
                text: args.text,
                user,
                chat
              }).save();
              return {
                ok: true,
                error: null,
                message
              };
            } else {
              return {
                ok: false,
                error: "Not Authorized",
                message: null
              };
            }
          } else {
            return {
              ok: false,
              error: "Chat not found",
              message: null
            };
          }
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            message: null
          };
        }
      })
    }
  };
  
  export default resolvers;
  ```

여기까지 작성했다면 테스트도 바로 해보자. 먼저 텍스트를 보내고, GetChat 할때도 메시지가 잘 가져와야 된다.
```ts
mutation {
  SendChatMessage(chatId: 1, text: "i love it") {
    ok
    error
    message {
      text
    }
  }
}

query {
  GetChat(chatId: 1) {
    ok
    error
    chat {
      messages {
        text
      }
    }
  }
}
```

## #1.86 MessageSubscription

메시지를 보내면 실시간으로 구독하여 메시지를 확인할 수 있게 하자. 메시지 type에 chatId 필드를 추가하자.

- src/api/Chat/shared/Message.graphql
  ```ts
  type Message {
    id: Int!
    text: String!
    chat: Chat!
    chatId: Int
    user: User!
    userId: Int
    createAt: String!
    updateAt: String
  }
  ```

- src/entities/Message.ts
  ```ts
  ...
  @ManyToOne(type => Chat, chat => chat.messages)
  chat: Chat;

  @Column({nullable: true})
  chatId: number;

  @ManyToOne(type => User, user => user.messages)
  user: User;
  ...
  ```

- src/api/Chat/MessageSubscription/MessageSubscription.graphql
  ```ts
  type Subscription {
    MessageSubscription: Message
  }
  ```

- src/api/Chat/MessageSubscription/MessageSubscription.resolvers.ts
  ```ts
  import { withFilter } from "graphql-yoga";
  import Chat from "../../../entities/Chat";
  import User from "../../../entities/User";
  
  const resolvers = {
    Subscription: {
      MessageSubscription: {
        subscribe: withFilter(
          (_, __, { pubSub }) => pubSub.asyncIterator("newChatMessage"),
          async (payload, _, context ) => {
            const user: User = context.currentUser;
            const {
              MessageSubscription: { chatId }
            } = payload;
  
            try {
              const chat = await Chat.findOne({id: chatId});
              if(chat) {
                return chat.driverId === user.id || chat.passengerId === user.id;
              } else {
                return false;
              }
            } catch (error) {
              return false;
            }
          }
        )
      }
    }
  }
  
  export default resolvers;
  ```

- src/api/Chat/SendChatMessage/SendChatMessage.resolves.ts 받는것은 했지만 pubSub으로 메시지를 보내는 것까지 해야 한다. context에서  pubSub을 꺼내와서 newChatMessage 채널로 publish 하자.
  ```ts
  ...
    { req, pubSub }
  ) : Promise<SendChatMessageResponse> => {
    const user: User = req.user;
    try {
      const chat = await Chat.findOne({ id: args.chatId });
      if (chat) {
        if(chat.driverId === user.id || chat.passengerId === user.id) {
          const message = await Message.create({
            text: args.text,
            user,
            chat
          }).save();
          pubSub.publish("newChatMessage", { MessageSubscription: message })
          return {
            ok: true,
            error: null,
            message
          };
  ...
  ```

아래 처럼 구독한 후 메시지를 보내게 되면 실시간으로 메시지를 확인할 수 있다. 
```ts
subscription {
  MessageSubscription {
    user {
      fullName
    }
    text
    createAt
  }
}
```

subscription은 항상 endpoint를 /subscription으로 해야 한다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952570/tlog/_2019-05-03__10-bf8c4596-2c30-4e76-a309-54c11be5cd8d.52.48_dxol3s.png)

## #1.87 Backend Conclusions

typescript, graphql-yoga, postgresql, typedorm을 써서 백엔드 부분을 완성했다. 큰 서비스지만, 코드를 깔끔하고 간결하게 작성하게 된 것 같다.