---
title: 19 우버 클론 코딩 (nomad coders)
date: '2019-05-27T08:56:56.243Z'
description: 우버 코딩 강의 로그 2.18 ~ 2.21
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1632302785/tlog/cover/nuber_clone_nllng2.jpg'
tags:
  - 'Uber Clone Coding'
  - 'Nomad Coder'
  - Apollo
  - GraphQL
---
#

이 포스트는 nomad coders의 우버 클론 코딩 시리즈를 듣고 정리한 글 입니다.

[https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course](https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course)

## #2.18 PhoneLogin Mutation part One

이번에 클라이언트에서 첫 Mutation을 작성할 거다. Query가 get 이라면 Mutation은 Post, Delete, Put, Patch 처럼 조작하는 모든 것을 가르킨다고 생각하자.

chome extension 중에 apollo가 설치되어 있지 않다면, 설치하자.

[http://localhost:3000/](http://localhost:3000/) 에 들어가서 Apollo 탭에 들어가면 사용할 수 있는 Query나 Mutation이 보인다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952570/tlog/_2019-05-07__1-17e413b4-71ea-4f8b-8ff7-2b25738166ec.57.17_bc7cvz.png)

클라이언트단에서 연결된 graphql endpoint의 쿼리를 볼수 있다.

이번에는 StartPhoneVerification mutation을 실행할텐데, 인자로 phoneNumber를 받고, 응답은 ok, error 필드를 가진다.

- src/routes/PhoneLogin/PhoneLogin.queries.ts

        import { gql } from "apollo-boost";
        export const PHONE_SIGN_IN = gql`
          mutation startPhoneVerification($phoneNumber: String!) {
            StartPhoneVerification(phoneNumber: $phoneNumber) {
              ok
              error
            }
          }
        `;

위 mutation를 실행한 컴포넌트로 연결을 할 때, react-apollo에 있는 Mutation을 상속받은 클래스를 정의할 것이다. 그렇게되면 파일안에 class가 2개가 생겨서 tslin를 간단히 수정해줘야 한다.

- {root}/tslint.json

        {
          "extends": ["tslint:recommended", "tslint-react", "tslint-config-prettier"],
          "rules": {
            "max-classes-per-file": false
          },
          "linterOptions": {
            "exclude": [
              "config/**/*.js",
              "node_modules/**/*.ts",
              "coverage/lcov-report/*.js",
              "src/lib/countries.ts"
            ]
          }
        }

- src/routes/PhoneLogin/PhoneLoginContainer.tsx

        import React from "react";
        import { Mutation } from "react-apollo";
        import { RouteComponentProps  } from "react-router-dom";
        import { toast } from "react-toastify";
        import { PHONE_SIGN_IN } from "./PhoneLogin.queries";
        import PhoneLoginPresenter from "./PhoneLoginPresenter";
        
        interface IState {
          countryCode: string;
          phoneNumber: string;
        }
        
        interface IMutation {
          phoneNumber: string;
        }
        
        class PhoneSignInMutation extends Mutation<any, IMutation> {}
        
        class PhoneLoginContainer extends React.Component<
          RouteComponentProps<any>,
          IState
        > {
        
          public state = {
            countryCode: "+82",
            phoneNumber: ""
          };
        
          public render() {
            const { countryCode, phoneNumber } = this.state;
        		const internationalPhoneNumber = `${countryCode}-${phoneNumber}`;
            return (
              <PhoneSignInMutation
                mutation={PHONE_SIGN_IN}
                variables={{
                  phoneNumber: internationalPhoneNumber
                }}
              >
                { (mutation, { loading }) => {
                  const onSubmit: React.FormEventHandler<HTMLFormElement> = event => {
                    event.preventDefault();
        
                    const isValid = /^\+[1-9]+-[0-9]{7,11}$/.test(internationalPhoneNumber);
                    if(isValid) {
                      mutation();
                    } else {
                      toast.error("please write a valid phone number!!!");
                    }
                  };
                  return (
                    <PhoneLoginPresenter
                      countryCode={countryCode}
                      phoneNumber={phoneNumber}
                      onInputChange={this.onInputChange}
                      onSubmit={onSubmit}
                      loading={loading}
                    />
                  )
                }
              }
              </PhoneSignInMutation>
            );
          }
        
          public onInputChange: React.ChangeEventHandler<
            HTMLInputElement | HTMLSelectElement
          > = event => {
            const {
              target: { name, value }
            } = event;
            this.setState({
              [name]: value
            } as any);
          };
        }
        
        export default PhoneLoginContainer;

- src/routes/PhoneLogin/PhoneLoginPresenter.tsx

        import BackArrow from "components/BackArrow";
        import Input from "components/Input";
        import countries from "lib/countries";
        import React from "react";
        import Helmet from "react-helmet";
        import styled from "../../typed-components";
        
        const Container = styled.div`
          margin-top: 30px;
          padding: 50px 20px;
        `;
        
        const BackArrowExtended = styled(BackArrow)`
          position: absolute;
          top: 20px;
          left: 20px;
        `;
        
        const Title = styled.h2`
          font-size: 25px;
          margin-bottom: 40px;
        `;
        
        const CountrySelect = styled.select`
          font-size: 20px;
          color: "#2c3e50";
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-color: white;
          border: 0;
          font-family: "Maven Pro";
          margin-bottom: 20px;
          width: 90%;
        `;
        
        const CountryOption = styled.option``;
        
        const Form = styled.form``;
        
        const Button = styled.button`
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          right: 50px;
          bottom: 50px;
          padding: 20px;
          color: white;
          border-radius: 50%;
          background-color: black;
          box-shadow: 0 18px 35px rgba(50, 50, 93, 0.1), 0 8px 15px rgba(0, 0, 0, 0.07);
          cursor: pointer;
        `;
        
        interface IProps {
          countryCode: string;
          phoneNumber: string;
          onInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
          loading: boolean;
        }
        
        const PhoneLoginPresenter: React.SFC<IProps> = ({
          countryCode,
          phoneNumber,
          onInputChange,
          onSubmit,
          loading
        }) => (
          <Container>
            <Helmet>
              <title>Phone Login | Number</title>
            </Helmet>
            <BackArrowExtended backTo={"/"}/>
            <Title>Enter your mobile number</Title>
            <CountrySelect 
              value={countryCode} 
              onChange={onInputChange}
              name="countryCode"
            >
              {countries.map((country, index) => (
                <CountryOption key={index} value={country.dial_code}>
                  {country.flag} {country.name} ({country.dial_code})
                </CountryOption>
              ))}
            </CountrySelect>
            <Form onSubmit={onSubmit}>
              <Input 
                placeholder={"053 690 2129"} 
                value={phoneNumber} 
                onChange={onInputChange}
                name="phoneNumber"
              />
              <Button>
                {loading ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
        						fill={"white"}
                  >
                    <path d="M13.75 22c0 .966-.783 1.75-1.75 1.75s-1.75-.784-1.75-1.75.783-1.75 1.75-1.75 1.75.784 1.75 1.75zm-1.75-22c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm10 10.75c.689 0 1.249.561 1.249 1.25 0 .69-.56 1.25-1.249 1.25-.69 0-1.249-.559-1.249-1.25 0-.689.559-1.25 1.249-1.25zm-22 1.25c0 1.105.896 2 2 2s2-.895 2-2c0-1.104-.896-2-2-2s-2 .896-2 2zm19-8c.551 0 1 .449 1 1 0 .553-.449 1.002-1 1-.551 0-1-.447-1-.998 0-.553.449-1.002 1-1.002zm0 13.5c.828 0 1.5.672 1.5 1.5s-.672 1.501-1.502 1.5c-.826 0-1.498-.671-1.498-1.499 0-.829.672-1.501 1.5-1.501zm-14-14.5c1.104 0 2 .896 2 2s-.896 2-2.001 2c-1.103 0-1.999-.895-1.999-2s.896-2 2-2zm0 14c1.104 0 2 .896 2 2s-.896 2-2.001 2c-1.103 0-1.999-.895-1.999-2s.896-2 2-2z" />
                  </svg>
                ) : (
                  <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={"white"}
                >
                  <path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z" />
                </svg>
                )
              }
              </Button>
            </Form>
          </Container>
        );
        
        export default PhoneLoginPresenter;

Container 에서 PhoneSignInMutation 클래스를 Mutation 클래스를 상속받아서 구현했다. 사실상 상속을 받았지만 재정의한 것은 없다. 이건 좀 리액트 스러운 방법인데 (render prop 패턴이라고 한다), graphql 쿼리를 보내고 보내고 받은 데이터를 그리는 것을 통째로 하나의 컴포넌트로 래핑하는 방식이다. 이런 컴포넌트는Higher Order Components 라 부르는거 같다.

 PhoneSignInMutation 컴포넌트는 인자로 mutation, variables를 넣었다. mutation은 말그대로 컴포넌트가 요청할 mutation이고 variables은 mutation에 보낼 인자이다. PhoneSignInMutation의 children 으로는 어떻게 그려질지에 대한 렌더링 함수를 정의해야 한다. 

이 함수는 두 개의 인자가 있는데 첫 번째 인자가 요청할 mutation이고, 두 번째 인자가 응답이다. 응답에는 data, loading, error 등의 값이 있다.

[https://www.apollographql.com/docs/react/essentials/mutations](https://www.apollographql.com/docs/react/essentials/mutations) 문서 참조

## #2.19 Magic with Apollo Codegen

제목처럼 우리는 코드를 생성하는 멋진 Apollo의 기능을 경험할 것이다. apollo 모듈을 전역으로 설치하자.

    $ yarn global add apollo

- {root}/packages.json `precodegen`, `codegen` 스크립트 두개를 추가 했다. 그리고 `react-scripts-ts` 라는 명령어를 사용하도록 변경했다. (.. 뭔 차이인지..)

        ...
        "scripts": {
            "start": "react-scripts start",
            "build": "react-scripts build",
            "dev": "react-scripts start",
            "test": "react-scripts test --env=jsdom",
            "eject": "react-scripts eject",    
        		"precodegen": "apollo schema:download --endpoint=http://localhost:4000/graphql",
            "codegen": "apollo codegen:generate src/types/api.d.ts --queries=src/**/*.queries.ts --addTypename --localSchemaFile=schema.json --target typescript --outputFlat"
          },
        ...

먼저 yarn precodegen 을 실행하면  schema.json 파일이 생성되는 것을 확인할 수 있다. schema.json 파일에 백엔드에 정의된 모든 스키마를 다운 받는다.

 위에서 다운받은 스키마를 이용하여 실제로 클라이언트에서 사용하는 타입을 생성한다. 

- src/types  디렉토리를 생성하자. 이 디렉토리는 비어있고, 스크립트를 통해 생성한 파일이 위치한다.

yarn codegen 을 실행하면 빈 파일에 StartPhoneVerification Mutation에 대한 타입들이 정의된 것을 확인할 수 있다. schema.json에는 모든 스키마가 들어있지만, api.d.ts에는 클라이언트에서 실제로 사용하는 스키마만 타입으로 생성한다.

- src/types/api.d.ts

        /* tslint:disable */
        /* eslint-disable */
        // This file was automatically generated and should not be edited.
        
        // ====================================================
        // GraphQL mutation operation: startPhoneVerification
        // ====================================================
        
        export interface startPhoneVerification_StartPhoneVerification {
          __typename: "StartPhoneVerificationResponse";
          ok: boolean;
          error: string | null;
        }
        
        export interface startPhoneVerification {
          StartPhoneVerification: startPhoneVerification_StartPhoneVerification;
        }
        
        export interface startPhoneVerificationVariables {
          phoneNumber: string;
        }
        
        /* tslint:disable */
        /* eslint-disable */
        // This file was automatically generated and should not be edited.
        
        //==============================================================
        // START Enums and Input Objects
        //==============================================================
        
        //==============================================================
        // END Enums and Input Objects
        //==============================================================

## #2.20 PhoneLogin Mutation part Two

위에서 생성한 타입으로 mutation을 서버에 보내보자.

- src/routes/PhoneLogin/PhoneLoginContainer.tsx IMutation 인터페이스를 제거하고 PhoneSignInMutation에 타입을 넣어주자. afterSubmit를 정의해서 mutation을 요청하고 응답 받은 후 콜백을 호출하도록 update인자로 넣어주자.

        import React from "react";
        import { Mutation, MutationUpdaterFn } from "react-apollo";
        import { RouteComponentProps  } from "react-router-dom";
        import { toast } from "react-toastify";
        import {
          startPhoneVerification,
          startPhoneVerificationVariables
        } from "types/api";
        import { PHONE_SIGN_IN } from "./PhoneLogin.queries";
        import PhoneLoginPresenter from "./PhoneLoginPresenter";
        
        interface IState {
          countryCode: string;
          phoneNumber: string;
        }
        
        class PhoneSignInMutation extends Mutation<
          startPhoneVerification,
          startPhoneVerificationVariables
        > {}
        
        class PhoneLoginContainer extends React.Component<
          RouteComponentProps<any>,
          IState
        > {
        
          public state = {
            countryCode: "+82",
            phoneNumber: ""
          };
        
          public render() {
            const { countryCode, phoneNumber } = this.state;
        		const internationalPhoneNumber = `${countryCode}-${phoneNumber}`;
        
            return (
              <PhoneSignInMutation
                mutation={PHONE_SIGN_IN}
                variables={{
                  phoneNumber: internationalPhoneNumber
                }}
                update={this.afterSubmit}
              >
                { (mutation, { loading }) => {
                  const onSubmit: React.FormEventHandler<HTMLFormElement> = event => {
                    event.preventDefault();
        
                    const isValid = /^\+[1-9]+-[0-9]{7,11}$/.test(internationalPhoneNumber);
                    if(isValid) {
                      mutation();
                    } else {
                      toast.error("please write a valid phone number!!!");
                    }
                  };
                  return (
                    <PhoneLoginPresenter
                      countryCode={countryCode}
                      phoneNumber={phoneNumber}
                      onInputChange={this.onInputChange}
                      onSubmit={onSubmit}
                      loading={loading}
                    />
                  )
                }
              }
              </PhoneSignInMutation>
            );
          }
        
          public onInputChange: React.ChangeEventHandler<
            HTMLInputElement | HTMLSelectElement
          > = event => {
            const {
              target: { name, value }
            } = event;
            this.setState({
              [name]: value
            } as any);
          };
        
          public afterSubmit: MutationUpdaterFn = (cache, data) => {
            // tslint:disable-next-line
            console.log(data);
          };
        }
        
        export default PhoneLoginContainer;

    [http://localhost:3000/phone-login](http://localhost:3000/phone-login) 에서 아무런 숫자를 넣고 실행시키면 응답을 콘솔로 찍을 것이다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952570/tlog/_2019-05-10__6-87bfdfb5-adac-4699-8df1-b5b173faf182.50.11_oxbmtx.png)

잘 나온다.

## #2.21 PhoneLogin Mutation part Three

폰 인증 파트를 마무리 하자. 

- src/routes/PhoneLogin/PhoneLoginContainer.tsx 몇가지가 조금 수정이 되었다. MutationUpdaterFn을 임포트에서 제거했고, PhoneSignInMutation에서 update 대신 onCompleted로 변경하였다. afterSubmit를 제거하였고 afterSubmit의 로직을 onComplete에서 바로 람다 함수로 넣어버렸다.

        import React from "react";
        import { Mutation } from "react-apollo";
        import { RouteComponentProps  } from "react-router-dom";
        
        ...
        
              <PhoneSignInMutation
                mutation={PHONE_SIGN_IN}
                variables={{
                  phoneNumber: internationalPhoneNumber
                }}
                onCompleted={data => {
                  const { StartPhoneVerification } = data;
                  if (StartPhoneVerification.ok) {
                    return;
                  } else {
                    toast.error(StartPhoneVerification.error);
                  }
                }}
        
        ...
        
        	// afterSubmit 제거
        }
        
        
        
        export default PhoneLoginContainer;

tslint에 인자로 람다 함수 넘기지 말라는 룰 이있어서 린트에 걸릴것이다. 이 룰은 제거하자.

- tslint.json

        {
          "extends": ["tslint:recommended", "tslint-react", "tslint-config-prettier"],
          "rules": {
            "max-classes-per-file": false,
            "jsx-no-lambda": false
          },
          "linterOptions": {
            ...
          }
        }

이번 포스팅을 길고 나조차도 조금 어렵게 느꼈다.