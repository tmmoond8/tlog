---
title: 4 우버 클론 코딩 (nomad coders)
date: '2019-04-11T08:56:56.243Z'
description: 우버 코딩 강의 로그 1.17 ~ 1.21
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1632302785/tlog/cover/nuber_clone_nllng2.jpg'
tags:
  - 'Uber Clone Coding'
  - 'Nomad Coder'
  - TypeORM
---
# 

이 포스트는 nomad coders의 우버 클론 코딩 시리즈를 듣고 정리한 글 입니다.

[https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course](https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course)

## #1.17 Verification Entity part One

이번에는 Verification 에 대한 graphql type과 entity를 만들거다. 이전에 User에 대해 graphql type과 entity를 만든 것과 거의 동일하다.

Verification 타입은 유저 정보를 통해 추가적으로 생성되는 검증 관련 정보를 db에 만들기 위해서 사용한다. 유저는 토큰(또는 키)를 검증 용도로 사용하게 될 것이다.

- src/api/Verification/shared/Verification.graphql graphql type를 정의하자.

        type Verification {
          id: Int!
          target: String!
          payload: String!
          key: String!
          used: Boolean!
          createAt: String!
          updateAt: String     #updateAt은 없을 수 있기 때문에 필수가 아니다.
        }
        
        # v = Verification
        # v.target = phone
        # v.payload = +24214242142
        # v.key = 3421
        
        # hello vrify with the number 3421
        
        # 3421
        
        # v(payload: +24214242142, key: 3421)

    주석으로 되어 있는 부분은 나중에 사용될 때 동작을 대략적으로 나타낸 것이다. 지금은 그냥 그렇구나 하고 넘어가자.

- src/entities/Verification.ts 에 entity도 정의하자.

        import {
          BaseEntity,
          Column,
          CreateDateColumn,
          Entity,
          PrimaryGeneratedColumn,
          UpdateDateColumn
         } from 'typeorm'
        
         @Entity()
         class Verification extends BaseEntity {
          @PrimaryGeneratedColumn() id: number;
        
          @Column({ type: "text"})
          target: string;
          
          @Column({ type: "text"})
          payload: string;
          
          @Column({ type: "text"})
          key: string;
        
          @Column({ type: "boolean"})
          used: boolean;
        
          @CreateDateColumn() createAt: string;
          @UpdateDateColumn() updateAt: string;
         }
        
         export default Verification;

## #1.17 Verification Entity part One

위에서 작성한 내용 중 target은 인증 도구로 Phone 또는 Email을 사용한 것을 나타낸다. 이 값은 임의의 값이 아니기 때문에 타입으로 만들어 두면 더 견고한 앱이 된다. 코드를 작성하다보면 어떤 때는 소문자로 phone을 어떤때는 대문자 PHONE을 사용해서 서로 같은 값을 다른 형태로 사용하는 실수를 할 수 있다.. 타입을 사용하면 이런 혼란을 방지할 수 있다.

- src/types/types.d.ts 을 생성하고 verificationTarget 이라는 타입을 정의한다.

        export type verificationTarget = "EMAIL" | "PHONE";

- src/api/entities/Verification.ts 에 target의 데이터형을 위에서 정의한 verificationTarget 타입으로 변경하자.

        import { verificationTarget } from 'src/types/types';
        import {
          ...
         } from 'typeorm'
        
        @Entity()
        class Verification extends BaseEntity {
          @PrimaryGeneratedColumn() id: number;
        
          @Column({ type: "text", enum: ["EMAIL", "PHONE"]})
          target: verificationTarget;
         
         ...

이제 완전 방탄 코드를 짰다. yarn dev로 실행하면 정상적으로 뜰 것이다.

이번에 하나 더 작업을 해야 될게 types가 추가가 되어서 이렇게 추가될 때마다 yarn types를 해야 하는데 좀 편하게 셋팅해보자.

- package.json 에 새로운predev 스크립트를 추가하자.

          "scripts": {
            "predev": "yarn run types",
            "dev": "cd src && nodemon --exec ts-node index.ts -e ts,graphql",
            ...
          }

이렇게 하고 yarn dev를 하면 우리는 매번 귀찮게 yarn types를 안해도 된다.

src/types/graph.d.ts 에 Verification 인터페이스가 정의된 것을 확인할 수 있다.

## #1.19 Creating the Verification Key

어떤 데이터를 생성할 때, 데이터를 구분하거나 참조할 때 key를 사용한다. 이 key는 데이터가 생성될 때마다 반복적으로 생성을 해줘야 하는데, typeorm의 @BeforeInsert를 사용하면 꽤 쉽고 명료하게 작업할 수 있다.

- src/entities/Verification.ts 에 createKey 메소드를 추가하자.

        import {
          BaseEntity,
          BeforeInsert,
          Column,
         } from 'typeorm'
        ...
        
        const PHONE = "PHONE";
        const EMAIL = "EMAIL";
        
        @Entity()
        class Verification extends BaseEntity {
          @PrimaryGeneratedColumn() id: number;
        
          @Column({ type: "text", enum: [EMAIL, PHONE]})
          target: verificationTarget;
        
          ...
        
          @BeforeInsert()
          createKey(): void {
            if(this.target === PHONE) {
              this.key = Math.floor(Math.random() * 10000).toString();
            } else if(this.target === EMAIL) {
              this.key = Math.random().toString(36).substr(2);
            }
          }
        }
        
         export default Verification;

PHONE과 EMAIL을 따로 변수로 빼주었다. 오타의 발생 여지도 주지 않기 위해서다.

Math.random 또는 Math.floor는 별도 설명을 드리지 않겠다. 궁금하시면 브라우저 콘솔에서 확인하시면 될 것 같다.

이렇게 키를 랜덤하게 생성하는 작업을 마무리 했다.

## #1.20 Place Entity

이번에는 Place에 대한 graphql type과 entity를 만들 거다. Verification 보다 간단하니 그냥 따라오면 된다.

- src/api/Place/shared/Place.graphql 파일을 생성하여 다음의 내용을 채우자.

        type Place {
          id: Int!
          name: String!
          lat: Float!
          lng: Float!
          address: String!
          isFav: Boolean!
          createAt: String!
          updateAt: String
        }

- src/entities/Place.ts 파일을 생성하여 다음의 내용을 채우자.

        import {
          BaseEntity,
          Column,
          CreateDateColumn,
        	Entity,
          PrimaryGeneratedColumn,
          UpdateDateColumn,
         } from 'typeorm'
        
        @Entity()
        class Place extends BaseEntity {
          @PrimaryGeneratedColumn() id: number;
        
          @Column({ type: "text"})
          name: string;
        
          @Column({ type: "double precision", default: 0})
          lat: number;
        
          @Column({ type: "double precision", default: 0})
          lng: number;
        
          @Column({ type: "text"})
          address: string;
        
          @Column({ type: "boolean"})
          isFav: boolean;
        
          @CreateDateColumn() createAt: string;
          @UpdateDateColumn() updateAt: string;
        }
        
         export default Place;

## #1.21 Ride Entity

이번에는 Ride에 대한 graphql type과 entity를 만들 거다. Verification 보다 간단하니 그냥 따라오면 된다.

- src/api/Ride/shared/Ride.graphql 파일을 생성해서 다음의 내용을 채우자.

        type Ride {
          id: Int!
          status: String!
          pickUpAddress: String!
          pickUpLat: Float!
          pickUpLng: Float!
          dropOffAddress: String!
          dropOffLat: Float!
          dropOffLng: Float!
          price: Float!
          distance: String!
          duration: String!
          createAt: String!
          updateAt: String
        }

- src/types/types.d.ts 에 rideStatus 타입을 정의한다. rideStatus도 의미있는 상태만 값으로 가진다.

        export type rideStatus = "ACCEPTED" | "FINISHED" | "CANCELED" | "REQUESTING" | "ONROUTE";

- src/entities/Ride.ts entity를 정의하자

        import { rideStatus } from 'src/types/types';
        import {
          BaseEntity,
          Column,
          CreateDateColumn,
        	Entity,
          PrimaryGeneratedColumn,
          UpdateDateColumn,
         } from 'typeorm'
        
        @Entity()
        class Ride extends BaseEntity {
          @PrimaryGeneratedColumn() id: number;
          
          @Column({type: "text", enum: ["ACCEPTED", "FINISHED", "CANCELED", "REQUESTING", "ONROUTE"]})
          status: rideStatus;
        
          @Column({type: "text"})
          pickUpAddress: string;
          
          @Column({type: "double precision", default: 0})
          pickUpLat: number;
          
          @Column({type: "double precision", default: 0})
          pickUpLng: number;
          
          @Column({type: "text"})
          dropOffAddress: string;
          
          @Column({type: "double precision", default: 0})
          dropOffLat: number;
          
          @Column({type: "double precision", default: 0})
          dropOffLng: number;
          
        	@Column({ type: "double precision" })
          price: number;
          
          @Column({type: "text"})
          distance: string;
          
          @Column({type: "text"})
          duration: string;
        
          @CreateDateColumn() createAt: string;
          @UpdateDateColumn() updateAt: string;
        }
        
         export default Ride;

Ride 스키마를 설계했다.