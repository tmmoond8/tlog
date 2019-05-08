---
templateKey: blog-post
title: 🚕 3 우버 클론 코딩 (nomad coders)
date: 2019-04-10T08:56:56.243Z
description: 우버 코딩 강의 로그 1.12 ~ 1.16
featuredpost: true
featuredimage: /img/nuber_clone.jpg
tags:
  - nomad coders
  - 우버 클론 코딩
---
# 

## #1.12 User Entity GraphQL Type

이제 우리는 Entity를 만들고 그에 대한 모델을 정의해야 한다. 그러나 먼저 graphql 타입을 만들어야 한다. 현재 Graphql Type to Type ORM Entity를 만들어주는 라이브러리가 없다. 그래서 귀찮지만 지금은 손수 작성해야 한다.

- src/api/User/shared/User.graphql 상위 디렉토리를 만들고 파일을 생성하자.

        type User {
          id: Int!
          email: String
          verifiedEmail: Boolean!
          firstName: String!
          lastName: String!
          age: Int
          password: String
          phoneNumber: String
          verifiedPhoneNumber: Boolean!
          profilePhoto: String
          createAt: String!
          updateAt: String
          fullName: String
          isDriving: Boolean!
          isRiding: Boolean!
          isTaken: Boolean!
          lastLng: Float
          lastLat: Float
          lastOrientation: Float
        }

## #1.13 User Entity part One

이번에는 graphql 의 타입대로 Entity를 만들어 보겠다. typeorm은 데코레이터 패턴으로 어노테이션을 사용한다. 그리고 데이터 베이스에서는 우리가 허용하는 범위의 값을 사용해야 안전한데, 이런 도움을 주는 모듈을 설치할 것이다. class-validator 모듈은 마찬가지로 데코레이터 패턴으로 어노테이션을 사용하기 때문에 잘 어울린다.

    $ yarn add class-validator

- src/entities/User.ts 파일을 생성해서 다음을 작성한다.

        import { IsEmail } from 'class-validator';
        import { 
          BaseEntity, 
          Column, 
          CreateDateColumn,
        	Entity,
          PrimaryGeneratedColumn,
          UpdateDateColumn 
        } from 'typeorm';
        
        @Entity()
        class User extends BaseEntity {
          @PrimaryGeneratedColumn() id: number;
        
          @Column({ type: "text", nullable: true})
          @IsEmail()
          email: string | null;
        
          @Column({ type: "boolean", default: false})
          verifiedEmail: boolean;
        
          @Column({ type: "text"})
          firstName: string;
        
          @Column({ type: "text"})
          lasttName: string;
        
          @Column({ type: "int"})
          age: number;
          
          @Column({ type: "text"})
          password: string;
        
          @Column({ type: "text"})
          phoneNumber: string;
        
          @Column({ type: "boolean", default: false})
          verifiedPhoneNumber: boolean;
        
          @Column({ type: "text"})
          profilePhoto: string;
        
          @CreateDateColumn() createAt: string;
          
          @UpdateDateColumn() updateAt: string;
        }
        
        export default User;

## #1.14 User Entity part Two

- src/entities/User.ts 파일을 마져 작성하자.

        import { IsEmail } from 'class-validator';
        import { 
          BaseEntity, 
          Column, 
          CreateDateColumn,
        	Entity,
          PrimaryGeneratedColumn,
          UpdateDateColumn 
        } from 'typeorm';
        
        @Entity()
        class User extends BaseEntity {
          @PrimaryGeneratedColumn() id: number;
        
          @Column({ type: "text", unique: true})
          @IsEmail()
          email: String;
        
          @Column({ type: "boolean", default: false})
          verifiedEmail: boolean;
        
          @Column({ type: "text"})
          firstName: string;
        
          @Column({ type: "text"})
          lasttName: string;
        
          @Column({ type: "int"})
          age: number;
          
          @Column({ type: "text"})
          password: string;
        
          @Column({ type: "text"})
          phoneNumber: string;
        
          @Column({ type: "boolean", default: false})
          verifiedPhoneNumber: boolean;
        
          @Column({ type: "text"})
          profilePhoto: string;
        
          @Column({ type: "boolean", default: false})
          isDriving: boolean;
        
          @Column({ type: "boolean", default: false})
          isRiding: boolean;
        
          @Column({ type: "boolean", default: false})
          isTaken: boolean;
        
          @Column({ type: "double precision", default:0})
          lastLng: number;
        
          @Column({ type: "double precision", default:0})
          lastLat: number;
          
          @Column({ type: "double precision", default:0})
          lastOrientation: number;
        
          get fullName() : string {
            return `${this.firstName} ${this.lasttName}`
          }
        
          @CreateDateColumn() createAt: string;
        
          @UpdateDateColumn() updateAt: string;
        }
        
        export default User;

이제 의미없는 src/api/hello 디렉토리를 없애자

- src/api/User/shared/User.graphql 에 Query 타입을 정의하자. (Query는 기본적으로 타입을 정해야 되는듯?)

        type User {
          ...
        }
        
        type Query {
          user: User
        }

그리고 이제 yarn dev를 하면 typeorm이 실제 postgresql에 데이터 베이스를 모델을 만드는 것을 볼 수 있다. 

![](_2019-04-09__12-0b80e59a-6dbd-48b1-a719-7008109ed908.31.21.png)

우리가 src/ormConfig.ts 에서 `synchronize: true` 로 해두었기 때문에 /src/entities/User.ts 에서 작성한 것 처럼 entity를 변경하면 자동으로 동기화 된다.

## #1.15 Hashing and Encrypting User Passwords

저번에 password도 string으로 그냥 넣었는데, 이는 보안에 문제가 된다.

    $ yarn add bcrypt
    $ yarn add @types/bcrypt --dev

이제 사용자가 입력한 비밀번호를 그대로 저장하는 것이 아니라 해싱한 값을 저장하도록 한다. 

- src/entities/User.ts 에 `@BeforeInsert`, `@BeforeUpdate` 를 사용한다.

        import bcrypt from 'bcrypt';
        import { IsEmail } from 'class-validator';
        import { 
          BaseEntity, 
          BeforeInsert,
          BeforeUpdate,
          Column,
        	...
        } from 'typeorm';
        
        const BCRYPT_ROUNDS = 10;
        
        @Entity()
        class User extends BaseEntity {
        
          ...
        
          private hashPassword(password: string): Promise<string> {
            return bcrypt.hash(password, BCRYPT_ROUNDS);
          }
        
          @BeforeInsert()
          @BeforeUpdate()
          async savePassword() : Promise<void> {
            if(this.password) {
                const hashedPassword = await this.hashPassword(this.password);
                this.password = hashedPassword;
            }
          }
        }
        
        export default User;

`@BeforeInset` 는 insert가 호출 될 때, 먼저 처리되어야 할 로직을 넣어주면 된다.

`@BeforeUpdate`는 update가 호출 될 때, 먼저 처리되어야 할 로직을 넣어주면 된다.

여기서는 bcrypt 모듈을 호출하는 것만 있지만, 인증 같은 문제도 처리될 수 있다.

## #1.16 Verifying User Password

유저가 입력한 비밀번호가 올바른지 비교하는 함수를 만들 거다. bcypt에 비교하는 메소드가 이미 존재하기 때문에 간단하다.

- src/entities/User.ts 에 public 메소드로 comparePassword 메소드를 만든다.

          ...
          @Column({ type: "double precision", default:0})
          lastOrientation: number;
        
          public comparePassword(password: string): Promise<boolean> {
            return bcrypt.compare(password, this.password);
          }
        
          get fullName() : string {
            return `${this.firstName} ${this.lasttName}`
          }
          ...

## #1.25 Resolver Types

이번에는 Resolver에 타입을 정의한다. Resolver는 쿼리에 대한 응답이라고 생각하자. (나도 아직까지는 개념이 없다.)

- src/types/resolvers.dts 을 생성해서 다음처럼 정의하자

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

지금 생성한 Resolver를 사용하여 응답을 만드는 것을 다음에 진행할 것 같다.