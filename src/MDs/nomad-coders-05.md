---
title: 5 우버 클론 코딩 (nomad coders)
date: '2019-04-12T08:56:56.243Z'
description: 우버 코딩 강의 로그 1.22 ~ 1.25
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632302785/tlog/cover/nuber_clone_nllng2.jpg'
tags:
  - 'Uber Clone Coding'
  - 'Nomad Coder'
  - TypeORM
---

이 포스트는 nomad coders의 우버 클론 코딩 시리즈를 듣고 정리한 글 입니다.

[https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course](https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course)

## #1.22 Chat and Message Entities part One

저번에 이어서 계속해서 타입을 정의할텐데, 이번에는 메시지를 주고 받을 때에 대한 타입을 정의할 차례다. 지금까지는 데이터에 관계에 대해서는 신경을 쓰지 않았다. 모든 데이터는 관계를 가지기 때문에 특히, 관계형 데이터 베이스를 사용할 때는 이 관계를 잘 다루는 것이 중요하다.

 운전자와 탑승자 사이에는 메시지를 주고 받아야 한다. 예를들면 운전자 한명과 탑승자 다수가 메시지를 주고 받는 상황이라면 채팅 방은 하나에 여러 유저가 접속하고, 채팅방에는 다수의 메시지를 보낼 수 있다. 이때 채팅방 하나에 다수의 메시지 또는 사용자가 관계가 생

기는데, 이를 one-to-many 관계로 설명한다. 

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952583/tlog/-841e9ee6-c104-4479-a90f-5a1d40b816ed_sz2nqq.png)

위 그림은 우리가 나타낼 관계를 관계도로 도식화 한 것이다.

채팅방 A

사용자 a, b, c

메시지 1, 2, 3

위처럼 있을 때, 채팅방은 여러 사용자가 들어갈 수 있고, 또 여러 메시지를 가질 수 있다. 그리고 사용자는 메시지를 채팅방에 보낼 수 있다. 

사용자 a와 메시지 1 그리고 채팅방 A의 관계는 사용자 a가 메시지 1을 채팅방 A에 보낸 것이라 말할 수 있다.

이러한 관계를 어떻게 코드로 나타내는지 살펴보면서 진행해보자.

- src/api/Chat/shared/Chat.graphql 파일을 생성해서 내용을 채우자.
  ```ts
  type Chat {
    id: Int!
    messages: [Message]! #graphql에서 리스트 표현
    participants: [User]! #graphql에서 리스트 표현
    createAt: String!
    updateAt: String
  }
  ```

    Chat는 messages에 다수의 메시지를 가질 수 있고, participants에 다수의 유저를 가질 수 있다.

- src/api/Chat/shared/Message.graphql 파일을 생성해서 내용을  채우자.
  ```ts
  type Message {
    id: Int!
    text: String!
    chat: Chat!
    user: User!
    userId: Int!
    createAt: String!
    updateAt: String
  }
  ```

    메시지는 하나의 채팅방과 하나의 유저에 관계가 있다.

우리는 특별히 다른 방법이 아닌 데이터 구조를 통해서도 관계를 파악 할 수 있다.

이번에는 Chat와 Message의 entity를 만들 차례인데, `@ManyToOne`을 통해 관계를 명시한다.

일단 entity 틀을 먼저 생성해서 서로를 참조 할 수 있도록 하자.

- src/entities/Chat.ts
  ```ts
  import {
    BaseEntity,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm'
  
  @Entity()
  class Chat extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
  
  
    @CreateDateColumn() createAt: string;
    @UpdateDateColumn() updateAt: string;
  }
  
  export default Chat;
  ```

- src/entities/Message.ts
  ```ts
  import {
    BaseEntity,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm'
  
  @Entity()
  class Message extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    
    @CreateDateColumn() createAt: string;
    @UpdateDateColumn() updateAt: string;
  }
  
  export default Message;
  ```

이번에는 Chat 와 Message 사이에 관계를 나타내줄 것이다. (일시적으로 참조의 오류가 발생할 수 있다.)

- src/entities/Chat.ts
  ```ts
  import {
    BaseEntity,
    CreateDateColumn,
    Entity,
    OneToMany, //추가
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm'
  import Message from './Message'; //임포트
  
  @Entity()
  class Chat extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
  
    @OneToMany(type => Message, message => message.chat)
    messages: Message[]
  
    @CreateDateColumn() createAt: string;
    @UpdateDateColumn() updateAt: string;
  }
  
  export default Chat;
  ```

- src/entities/Message.ts
  ```ts
  import {
    BaseEntity,
    CreateDateColumn,
    Entity,
    ManyToOne, //추가
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm'
  import Chat from './Chat'; //임포트
  
  @Entity()
  class Message extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
  
    @ManyToOne(type => Chat, chat => chat.messages)
    chat: Chat;
    
    @CreateDateColumn() createAt: string;
    @UpdateDateColumn() updateAt: string;
  }
  
  export default Message;
  ```

ManyToOne과 OneToMany가 헷갈릴까봐, 표시를 해봤다.

Message 클래스 정의에서 "다수의 Message 가 하나의 Chat과 관계를 가진다." 로 이해하면 되고 "그 다수의 메시지는 chat.messages" 이다.로 이해하시면 될 것 같다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952568/tlog/_2019-04-11__10-bd368ede-2d6f-40d6-965d-8d0665553f26.33.58_gdbwtq.png)

Chat 클래스는  Message와 반대로 `@OneToMany`입니다.  위에 설명드린 방식으로 이해해보시면 될 것 같습니다.

## #1.23 Chat and Message Entities part Two

위에서 entity의 몇가지 속성에 대해서는 추가하지 않았습니다. 위에서 했던 내용으로 스스로 해보시면 좋을 것 같다.

- src/api/User/shared/User.graphql 파일에 Chat와 Message 관련 속성을 추가합니다. 관계를 나타내려면 서로의 속성을 가지고 있어야 한다.
  ```ts
  type User {
    ...
    chat: Chat
    messages: [Message]
    isDriving: Boolean!
    ...
  }
  ...
  ```

- src/entities/User.ts 에는 Chat와 Message를 관계를 나타내기 위해 추가해줘야 한다.
  ```ts
  ...
    Entity,
    ManyToOne,
    OneToMany, 
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import Chat from './Chat';
  import Message from './Message';
  
  ...
  @Column({ type: "text"})
  profilePhoto: string;
  
  @ManyToOne(type => Chat, chat => chat.participants)
  chat: Chat;
  
  @OneToMany(type => Message, message => message.user)
  messages: Message[];
  
  @Column({ type: "boolean", default: false})
  isDriving: Boolean!
  ...
  ```

- src/entities/Message.ts 에는 text, Chat, User 가 빠졌다.
  ```ts
  import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne, //추가
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm'
  import Chat from './Chat'; //임포트
  import User from './User';
  
  @Entity()
  class Message extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    
    @Column({type: "text"})
    text: string
  
    @ManyToOne(type => Chat, chat => chat.messages)
    chat: Chat;
  
    @ManyToOne(type => User, user => user.messages)
    user: User;
  
    @Column({nullable: true })
    userId: number;
    
    @CreateDateColumn() createAt: string;
    @UpdateDateColumn() updateAt: string;
  }
  
  export default Message;
  ```

- src/entities/Chat.ts 에는 User 속성이 빠졌다. 추가
  ```ts
  ...
  import Message from './Message'; 
  import User from './User';
  
  @Entity()
  class Chat extends BaseEntity {
    ...
  
    @OneToMany(type => User, user => user.chat)
    participants: User[]
  
    @CreateDateColumn() createAt: string;
    @UpdateDateColumn() updateAt: string;
  }
  
  export default Chat;
  ```

## #1.24 Model Relationships like a Boss

이번에는 Verification과 User의 관계, Ride와 User의 관계를 셋팅한다.

- src/api/Verification/shared/Verification.graphql 에 user를 간단히 추가하자.
  ```ts
  type Verification {
    ...
    used: Boolean!
    user: User!
    createAt: String!
    updateAt: String
  ```
        
- src/api/User/shared/User.graphql 에는 verifications과 ridesAsPassenger, ridesAsDriver 둘다 추가한다.
  ```ts
  type User {
    ..
    chat: Chat
    messages: [Message]
    verifications: [Verification]
    ridesAsPassenger: [Ride]
    ridesAsDriver: [Ride]
    isDriving: Boolean!
    ...
  }
  ...
  ```

- src/api/Ride/shared/Ride.graphql 에는 driver와 passenger를 추가 한다.
  ```ts
  type Ride {
    ...
    price: Float!
    driver: User
    passenger: User
    distance: String!
    ...
  }
  ```

1.23 절에서 한 것 처럼 graphql 타입을 통해 entity에 관계를 나타내는 연습을 해보는 것을 권한다.

- src/entities/Verification.ts 임포트 순서를 살짝 손봤다.
  ```ts
  import { verificationTarget } from 'src/types/types';
  import {
    BaseEntity,
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm'
  import User from './User';
  ...

  @ManyToOne(type => User, user => user.verifications)
  user: User;

  @CreateDateColumn() createAt: string;
  @UpdateDateColumn() updateAt: string;
  ...
  ```

- src/entities/User.ts Verification과 Ride 관계를 추가한다.
  ```ts
  ...
  import Message from './Message';
  import Ride from './Ride';
  import Verification from './Verification';
  ...

  @OneToMany(type => Message, message => message.user)
  messages: Message[];

  @OneToMany(type => Verification, verification => verification.user)
  verifications: Verification[];

  @OneToMany(type => Ride, ride => ride.passenger)
  ridesAsPassenger: Ride[];

  @OneToMany(type => Ride, ride => ride.driver)
  ridesAsDriver: Ride[];

  @Column({ type: "boolean", default: false})
  isDriving: boolean;
  ...
  ```

- src/entities/Ride.ts User와의 관계를 추가한다. User는 driver와 Passenger다
  ```ts
  import {
    ...
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    ...
  
  import User from './User';
  
    ...
  
    @Column({type: "text"})
    duration: string;
  
    @ManyToOne(type => User, user => user.ridesAsPassenger)
    passenger: User;
  
    @ManyToOne(type => User, user => user.ridesAsDriver)
    driver: User;
  
    @CreateDateColumn() createAt: string;
    ...
  ```

## #1.25 Resolver Types

이번에는 응답 graphql의 Resolver Types를 만들 것이다. 

- src/types/resolvers.d.ts 을 새로 만들어서 기본적인 resolver 타입을 정의하자.
  ```ts
  export type Resolver = (parent: any, args: any, context: any, info: any) => any;
  
  export interface Resolvers {
    [key: string]: {
      [key: string]: Resolver;
    }
  }
  
  // const resolvers: Resolvers = {
  //   Query: {
  //     sayHello: () => ""
  //   }
  // }
  ```