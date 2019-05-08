---
templateKey: blog-post
title: 🚕 9 우버 클론 코딩 (nomad coders)
date: 2019-04-26T08:56:56.243Z
description: 우버 코딩 강의 로그 1.49 ~ 1.55
featuredpost: true
featuredimage: /img/nuber_clone.jpg
tags:
  - nomad coders
  - 우버 클론 코딩
---
# 

## #1.49 Sending Confirmation Email part One

이번에는 이메일을 통한 사용자 인증을 구현할 차례인데, 저번에 했던 SMS인증이랑 유사하다고 생각하면 된다. 다만 PHONE이 아닌 EMAIL을 통해 특정 인증 번호를 주고 확인하는 것이다. 

메시지를 보낼때는 twilio를 썼고, 이번에는 mailgun이라는 서비스를 이용한다.

[https://app.mailgun.com](https://app.mailgun.com/) 가서 회원가입을 한 후 대시보드로 이동하자.

[https://app.mailgun.com/app/account/security/api_keys](https://app.mailgun.com/app/account/security/api_keys) 로 이동하면 나의 private api key가 있다. 이 키를 .env에 저장하자.

![](_2019-04-21__1-1ed7188e-0843-4ab4-8827-efed333b22df.32.58.png)

이메일을 통해 인증하는 코드를 마져 작성하자. 설치해줘야 할 모듈이 있다.

    $ yarn add mailgun-js && yarn add @types/mailgun-js --dev

- src/.env

        ...
        MAILGUN_API_KEY=너의 키

- src/utils/sendEmail.ts 파일을 생성해서 다음을 입력하자.

        import Mailgun from 'mailgun-js';
        
        const mailGunClient = new Mailgun({
          apiKey: process.env.MAILGUN_API_KEY || '',
          domain: 'sandboxac6172d794714a8e826947e6bb8c4c79.mailgun.org'
        });

    domain은 대시보드 하단에 위치한다. 저기로 보내는 것은 돈이 안든다나.. 뭐 그런가 보다. 아마 테스트용 메일 주소인 것으로 보인다.

## #1.49 Sending Confirmation Email part Two

- src/utils/sendEmail.ts 메일을 보내는 함수를 리턴하자. 아래 주석의 이메일을 변경하자.

        import Mailgun from 'mailgun-js';
        
        const mailGunClient = new Mailgun({
          apiKey: process.env.MAILGUN_API_KEY || '',
          domain: 'sandboxac6172d794714a8e826947e6bb8c4c79.mailgun.org'
        });
        
        const sendEmail = (subject: string, html: string) => {
          const emailData = {
            from: "test@gmail.com", //본인의 이메일로 변경
            to: "test@gmail.com", // 본인의 이메일로 변경
            subject,
            html
          };
          return mailGunClient.messages().send(emailData);;
        };
        
        
        export const sendVerificationEmail = (fullName: string, key: string) => {
          const emailSubject = `Hello~ ${fullName}, please verify your email`;
          const emailBody = `Verify your email by clicking <a href="http://number.com/verification/${key}/">here</a>`;
          return sendEmail(emailSubject, emailBody);
        };

- src/api/User/EmailSignUp/EmailSignUp.resolvers.ts

        ...
        import Verification from "../../../entities/Verification";
        
        ...
                  const newUser = await User.create({ ...args }).save();
                  if(newUser.email) {
                    const emailVerification = await Verification.create({
                      payload: newUser.email
                    });
                  }
                  const token = createJWT(newUser.id);
                  return {
                    ok: true,
                    error: null,
                    tokenno
                  }
                }
        ...

## #1.51 Sending Confirmation Email part Three

- src/api/User/EmailSignUp/EmailSignUp.resolvers.ts 에 수정하자

        import { Resolvers } from "src/types/resolvers";
        import { EmailSignUpMutationArgs, EmailSignUpResponse } from "src/types/graph";
        import createJWT from "../../../utils/createJWT";
        import { sendVerificationEmail } from "../../../utils/sendEmail";
        import User from "../../../entities/User";
        import Verification from "../../../entities/Verification";
        
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
                  const phoneVerification = await Verification.findOne({
                    payload: args.phoneNumber,
                    verified: true
                  });
                  if(phoneVerification) {
                    const newUser = await User.create({ ...args }).save();
                    if(newUser.email) {
                      const emailVerification = await Verification.create({
                        payload: newUser.email,
                        target: "EMAIL"
                      }).save();
                      await sendVerificationEmail(
                        newUser.fullName,
                        emailVerification.key
                      );
                    }
                    const token = createJWT(newUser.id);
                    return {
                      ok: true,
                      error: null,
                      token: token
                    };
                  } else {
                    return {
                      ok: false,
                      error: "You haven't verified your phone number",
                      token: null
                    };
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

강의를 보면서는 조금 헷갈렸던 부분이 있다. 위 코드를 보면 verification.find를 하고 얻은 verification으로 다시 verification.create를 하는 부분이다. '왜 찾고나서 있으면 생성하는 거지?' 라고 생각했었다. 이 부분의 문맥을 몰랏던 것인데..

사용자는 회원가입 절차 중에 폰인증을 위해 폰으로 인증 키를 보내고, 받은 인증키로 인증을 하는 과정이 있다. 이 과정은 `StartPhoneVerification`과 `CompletePhoneVerification`으로 각각 작성했었다. 그리고 여기서는 phone으로 얻은 인증을 db에 저장하게 되고 그리고 난 후 위의 과정을 통해 email 인증을 하게 된다.

그렇기 때문에 Phone으로 인증한 verification을 찾은 후 있으면 Email로 verification을 생성하는 것이다.

## #1.52 Testing Email Sending

postgresql은 쿼리 날리는 것이 익숙하지가 않다. 조금 특이한거 같기도 하고, 가이드도 조금 부족 하다. 그래서 클라이언트 앱을 다운받아서 쓰고 있다. 나는 pgAdmin4라는 앱을 사용한다. 

- postgresql 을 먼저 실행 시켜야 하는데, 현재 실행되고 있지 않으면 각자의 환경대로 실행 시키자.

        # mac 환경에선,
        $ postgres -D /usr/local/var/postgres

    $ psql nuber

- psql 명령어행에서 모든 테이블을 삭제 시키자.

        DO $$ DECLARE
            r RECORD;
        BEGIN
            -- if the schema you operate on is not "current", you will want to
            -- replace current_schema() in query with 'schematodeletetablesfrom'
            -- *and* update the generate 'DROP...' accordingly.
            FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
                EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
            END LOOP;
        END $$;

테이블을 모두 삭제 했다면, yarn dev를 명령어를 다시 입력해야 프로젝트가 db 셋팅을 다시 한다.

그리고 차례대로 다음의 테스트를 진행하자

    mutation {
      StartPhoneVerification(phoneNumber: "+82-폰넘버") {
        ok
        error
      }
    }

로 인증 번호를 받아서

    mutation {
      CompletePhoneVerification(phoneNumber: "+82-폰넘버", key: "받은 인증 번호") {
        ok
        error
      }
    }

지금 이메일에 상관없이 sendSMS에 넣은 사용자 이메일로 보내도록 되어있다.

    mutation {
      EmailSignUp(firstName: "test", lastName: "tamm", email: "이메일", password: "12345", profilePhoto: "", age: 30, phoneNumber: "+82-폰넘버") {
        ok
        error
        token
      }
    }

이메일을 확인하면 인증 정보를 볼 수 있다.

## #1.53 RequestEmailVerification Resolver

이메일 인증 요청하는 type과 mutation을 정의한다.

- src/api/User/RequestEmailVerification/RequestEmailVerification.graphql

        type RequestEmailVerificationResponse {
          ok: Boolean!
          error: String
        }
        
        type Mutation {
          RequestEmailVerification: RequestEmailVerificationResponse!
        }

- src/api/User/RequestEmailVerification/RequestEmailVerification.resolvers.ts

        import { Resolvers } from "src/types/resolvers";
        import privateResolver from "../../../utils/privateResolver";
        import User from "../../../entities/User";
        import Verification from "../../../entities/Verification";
        import { sendVerificationEmail } from "../../../utils/sendEmail";
        
        const resolvers: Resolvers = {
          Mutation: {
            RequestEmailVerification: privateResolver(async (_, __, { req }) => {
              const user: User = req.user;
              if (user.email) {
                try {
                  const oldVerification = await Verification.findOne({
                    payload: user.email
                  });
                  if(oldVerification) {
                    oldVerification.remove();
                  }
                  const newVerification: Verification = await Verification.create({
                    payload: user.email,
                    target: "EMAIL"
                  }).save();
                  if(newVerification) {
                    await sendVerificationEmail(user.fullName, newVerification.key);
                  }
                  return {
                    ok: true,
                    error: null
                  };
                } catch(error) {
                  return {
                    ok: false,
                    error: error.message
                  }
                }
              } else {
                return {
                  ok: false,
                  error: "not found the email to verify"
                };
              }
            })
          }
        };
        
        export default resolvers;

위의 구조를 보면 이메일 인증 요청을 하게 되면 resolver에서는 기존의 verification을 삭제하고 다시 생성한다. 예전 인증 정보를 삭제하는 이유는 간단하다. 만약 만약 인증 요청 버튼을 여러번 눌렀다고 하면, 누른 만큼 이메일이 갈 것이다. 근데 모든 이메일의 인증을 다 허용하면 이것도 문제가 된다.

## #1.54 CompleteEmailVerification Resolver

인증 확인하는 type과 mutation을 정의하자

- src/api/User/CompleteEmailVerification/CompleteEmailVerification.graphql

        type CompleteEmailVerificationResponse {
          ok: Boolean!
          error: String
        }
        
        type Mutation {
          CompleteEmailVerification(key: String!): CompleteEmailVerificationResponse!
        }

- src/api/User/CompleteEmailVerification/CompleteEmailVerification.resolvers.ts

        import { 
          CompleteEmailVerificationMutationArgs, 
          CompleteEmailVerificationResponse 
        } from "src/types/graph";
        import { Resolvers } from "src/types/resolvers";
        import privateResolver from "../../../utils/privateResolver";
        import User from "../../../entities/User";
        import Verification from "../../../entities/Verification";
        
        const resolvers: Resolvers = {
          Mutation: {
            CompleteEmailVerification: privateResolver(async (
              _, 
              args: CompleteEmailVerificationMutationArgs, 
              { req }
            ): Promise<CompleteEmailVerificationResponse> => {
              const user: User = req.user;
              const { key } = args;
              if (user.email && !user.verifiedEmail) {
                try {
                  const verificaion = await Verification.findOne({
                    key,
                    payload: user.email
                  });
                  if(verificaion) {
                    user.verifiedEmail = true;
                    user.save();
                    return {
                      ok: true,
                      error: null
                    }
                  } else {
                    return {
                      ok: false,
                      error: 'Cant verify the email'
                    }
                  }
                } catch(error) {
                  return {
                    ok: false,
                    error: error.message
                  }
                }
              } else {
                return {
                  ok: false,
                  error: 'no email to verify'
                }
              }
            })
          }
        }
        
        export default resolvers;

## #1.55 Testing Email Verification Resolvers

이어서 이메일 인증이 제대로 되는지 확인해보자. 이메일 인증은 비밀번호를 다시 되찾을 때, 폰 번호는 변경될 수 있으므로 이메일 인증도 구현되어야 한다. (만약 로그인을 할 수 없는데 사용자 인증을 하고 싶다면,, 이메일은 argument로 받도록 해야 겠다.)

 헤더에 사용자 토큰을 포함하여 아래의 요청을 보내자.

    mutation {
      RequestEmailVerification {
        ok
        error
      }
    }

메일을 확인하면 정상적으로 연결되는 것을 볼 수 있고..

메일의 here를 클릭하면 

[http://www.number.com/verification/0audpk3ldoyf/](http://www.number.com/verification/0audpk3ldoyf/)  처럼 링크가 이동이 되는데 verification 다음 값은 사용자 키가 된다. 아마 리액트 앱에서는 저 주소를 통해 인증 처리가 될 것으로 보인다. 아마 내부적으로 아래의 mutation을 호출할 것이다. 직접 아래의 mutation을 실행시켜보자. 그리고 키를 달리하여 결과를 살펴보자.

    mutation {
      CompleteEmailVerification(key: "받은 키") {
        ok
        error
      }
    }

이로써 이메일을 통해 인증하는 기능을 추가 하였다.