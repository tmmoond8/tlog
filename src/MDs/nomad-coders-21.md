---
title: 21 우버 클론 코딩 (nomad coders)
date: '2019-05-30T08:56:56.243Z'
description: 우버 코딩 강의 로그 2.22 ~ 2.25
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1632302785/tlog/cover/nuber_clone_nllng2.jpg'
tags:
  - 'Uber Clone Coding'
  - 'Nomad Coder'
  - Apollo
  - GraphQL
  - OAuth
---
#

이 포스트는 nomad coders의 우버 클론 코딩 시리즈를 듣고 정리한 글 입니다.

[https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course](https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course)

## 2.26 Updating Local State

저번에 메일 인증을 하고 넘어온 토큰을 콘솔로 찍어봤다. 이번에는 이 토큰을 통해 로그인 상태를 변경하는 것을 해보자.

서비스 공통으로 사용하는 공용 쿼리를 위해 파일을 생성하자.

- src/innerQueries.ts

        import { gql } from "apollo-boost";
        
        export const LOG_USER_IN = gql`
          mutation logUserIn($token: String!) {
            logUserIn(token: $token) @client
          }
        `;

- src/api/VerifyPhone/VerifyPhoneContainer.tsx  `LOG_USER_IN` Mutation을 사용하기 위해 추가했다.

        import React from "react";
        import { Mutation } from "react-apollo";
        import { RouteComponentProps } from "react-router-dom";
        import { toast } from "react-toastify";
        import { LOG_USER_IN } from "../../innerQueries";
        import { verfiyPhone, verfiyPhoneVariables } from "../../types/api";
        import { VERIFY_PHONE } from "./VerifyPhone.queries";
        import VerifyPhonePresenter from "./VerifyPhonePresenter";
        
        interface IState {
          verificationCode: string;
          phoneNumber: string;
        }
        
        interface IProps extends RouteComponentProps<any> {}
        
        class VerifyMutation extends Mutation<verfiyPhone, verfiyPhoneVariables> {}
        
        class VerifyPhoneContainer extends React.Component<IProps, IState> {
          constructor(props: IProps) {
            super(props);
            try {
              Object.hasOwnProperty.call(props.location.state, "phone");
            } catch (e) {
              props.history.push("/");
            }
            this.state = {
              phoneNumber: props.location.state.phone,
              verificationCode: ""
            }
            this.onInputChange = this.onInputChange.bind(this);
          }
          public render() {
            const { verificationCode, phoneNumber } = this.state;
            return (
              <Mutation mutation={LOG_USER_IN}>
                {(logUserIn) => (
                  <VerifyMutation
                    mutation={VERIFY_PHONE}
                    variables={{
                      key: verificationCode,
                      phoneNumber
                    }}
                    onCompleted={data => {
                      const { CompletePhoneVerification } = data;
                      if (CompletePhoneVerification.ok) {
                        if(CompletePhoneVerification.token) {
                          logUserIn({
                            variables: {
                              token: CompletePhoneVerification.token
                            }
                          });
                          toast.success("You're verified, loggin in now");
                        } 
                      } else {
                        toast.error(CompletePhoneVerification.error);
                      }
                    }}
                >
                  { (mutation, { loading }) => (
                    <VerifyPhonePresenter 
                      onSubmit={mutation}
                      onChange={this.onInputChange} 
                      verificationCode={verificationCode}
                      loading={loading}
                    />
                  )}
                </VerifyMutation>
                )}
              </Mutation>
            );
          }
        
          public onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
            const {
              target: { name, value }
            } = event;
            this.setState({
              [name]: value
            } as any); 
          }
        }
        
        export default VerifyPhoneContainer;

처음에는 Mutation 컴포넌트가 어떻게 동작하는지 이해가 되지 않아 살펴보았는데, 동작 흐름은 이제좀 이해했다. 여기서 Mutation이 두 개인데, 밖에 선언된 Mutation이 로그인 Mutation이고, VerifyMutation이 인증 Mutation이다. 

 로그인 Mutation이 밖에 감싸 있다고 해서 바로 실행되는 것이 아니다. 로그인 mutation 로그인 성공하고 받은 토큰을 브라우저에 localStorage 형태로 저장하기 위한 값이다. 

 로그인 Mutation이 먼저 실행되는 것이 아니라 callback 처럼 VerifyMutation에 로그인 gql 쿼리를 넘긴다.

VerifyMutation은 먼저 VerifyPhonePresenter 통해 컴포넌트를 렌더링 하고 onSubmit에 인증 gql 을 실행하도록 한다. VerifyMutation에서 gql이 정상적으로 호출완료 되었다면 callback 처럼 넘어온 gql 쿼리를 실행시켜서 로그인이 완료된다.

 이 흐름이 처음에는 파악이 안되었는데, 좀 이제 감이 잡혔다.

로그인이 완료가 되면 로컬 스토리지에 jwt 로 값이 들어가 있다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952571/tlog/_2019-05-15__11-42d38a9d-9298-4328-82e8-a105ebb4e091.19.34_h1ldtc.png)

## #2.27 SocialLogin with Apollo part One

이번에는 페북 로그인 작업을 할텐데, 일단 페북 로그인을 하기 위해서는 facebook app id가 필요하다.

[https://developers.facebook.com](https://developers.facebook.com/) 에서 앱 ID를 발급 받았다. 

- src/routes/SocialLogin/SocialLogin.quries.ts

        import { gql } from "apollo-boost";
        
        export const FACEBOOK_CONNECT = gql`
          mutation facebookConnect(
            $firstName: String!
            $lastName: String!
            $email: String
            $fbId: String!
          ) {
            FacebookConnect(
              firstName: $firstName
              lastName: $lastName
              email: $email
              fbId: $fbId
            ) {
              ok
              error
              token
            }
          }
        `;

그리고 이제 facebook을 연결할 껀데, 원래 facebook에서 제공하는 로그인을 사용하려면 코드를 작성해야 할텐데, react에서 편하게 사용할 수 있는 모듈을 사용하면다.

    $ yarn add react-facebook-login

설치하는 동안 yarn codegen으로 api.d.ts 페북 로그인 타입을 만들자.

- src/routes/SocialLogin/SocialLoginPresenter.tsx

        import BackArrow from "components/BackArrow";
        import React from "react";
        import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
        import Helmet from "react-helmet";
        
        ...
        
        const socialLoginPresenter = () => (
          <Container>
            <Helmet>
              <title>Social Login | Nuber</title>
            </Helmet>
            <Title>Choose an account</Title>
            <BackArrowExtended backTo={"/"} />
            <FacebookLogin
              appId="397089871146014"
              autoLoad={false}
              fields="name,first_name,last_name,email"
              callback={null}
              render={renderProps => (
                <Link onClick={renderProps.onClick}>
                  <Icon>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="#344EA1"
                    >
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                    </svg>
                  </Icon>
                  FaceBook
                </Link>
              )}
            />
          </Container>
        );
        
        export default socialLoginPresenter;

FacebookLogin 컴포넌트에 appId, autoLoad, fields, callback, render를 주었다.callback과 render를 살펴보자. 일단 render는 어떻게 보일지를, callback은 페북 로그인을 할 콜백(기능)을 담당한다. 

render에 워래 있던 Link 컴포넌트를 넣어줬다.

앱에서 페이스북 버튼을 클릭하면 아래처럼 페북 로그인창이 뜬다. 기능은 정상적으로 동작하지 않는다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952571/tlog/_2019-05-15__1-e70a45c2-4c3f-4e21-b62f-a72d52346baf.07.06_wdsw4t.png)

- src/routes/SocialLogin/SocialLoginContainer.tsx

        import React from "react";
        import { Mutation } from "react-apollo";
        import { RouteComponentProps } from "react-router-dom";
        import { facebookConnect, facebookConnectVariables } from "../../types/api";
        import { FACEBOOK_CONNECT } from "./SocialLogin.queries";
        import SocialLoginPresenter from "./SocialLoginPresenter";
        
        class LoginMutation extends Mutation<facebookConnect, facebookConnectVariables> {}
        
        interface IState {
          firstName: string;
          lastName: string;
          email?: string;
          fbId: string;
        }
        
        interface IProps extends RouteComponentProps<any> {}
        
        class SocialLoginContainer extends React.Component<IProps, IState> {
          public render() {
            return (
              <LoginMutation mutation={FACEBOOK_CONNECT}>
                {(mutation) => {
                  return (
                    <SocialLoginPresenter />
                  )
                }}
              </LoginMutation>
            )
          }
        }
        
        export default SocialLoginContainer;

## #2.27 SocialLogin with Apollo part Two

## #2.28 SocialLogin with Apollo part Three

facebook에서 토큰을 확인해보자.

- src/routes/SocialLogin/SocialLoginPresenter.tsx  callback을 넘겨받아서 callback을 호출 할 수 있도록 넣어주었다. appId는 페이스북에서 발급 받으셔야 됩니다.

        ...
        
        const BackArrowExtended = styled(BackArrow)`
          position: absolute;
          top: 20px;
          left: 20px;
        `;
        
        interface IProps {
          loginCallback: (response) => void;
        }
        
        const socialLoginPresenter: React.SFC<IProps> = ({ loginCallback }) => (
        ...
        			appId="397089871146014"
              autoLoad={false}
              fields="name,first_name,last_name,email"
              callback={loginCallback}
              render={renderProps => (
        ...

- src/routes/SocialLogin/SocialLoginContainer.tsx

        import React from "react";
        import { Mutation, MutationFn } from "react-apollo";
        import { RouteComponentProps } from "react-router-dom";
        import { facebookConnect, facebookConnectVariables } from "../../types/api";
        import { FACEBOOK_CONNECT } from "./SocialLogin.queries";
        import SocialLoginPresenter from "./SocialLoginPresenter";
        
        class LoginMutation extends Mutation<facebookConnect, facebookConnectVariables> {}
        
        interface IState {
          firstName: string;
          lastName: string;
          email?: string;
          fbId: string;
        }
        
        interface IProps extends RouteComponentProps<any> {}
        
        class SocialLoginContainer extends React.Component<IProps, IState> {
          public facebookMutation: MutationFn<facebookConnect, facebookConnectVariables> | undefined = undefined;
          public render() {
            return (
              <LoginMutation mutation={FACEBOOK_CONNECT}>
                {(facebookMutation, { loading }) => {
                  this.facebookMutation = facebookMutation;
                  return (
                    <SocialLoginPresenter loginCallback={this.loginCallback}/>
                  )
                }}
              </LoginMutation>
            )
          }
          public loginCallback = response => {
            // tslint:disable-next-line
            console.log(response);
          }
        }
        
        export default SocialLoginContainer;

loginCallback은 facebook 로그인 응답을 콘솔에 찍도록 했다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952571/tlog/_2019-05-15__1-8659387e-ac1e-4d04-b491-61cb4b7d48aa.46.05_zvf6fy.png)

- src/routes/SocialLogin/SocialLoginContainer.tsx

        import React from "react";
        import { Mutation, MutationFn } from "react-apollo";
        import { RouteComponentProps } from "react-router-dom";
        import { toast } from "react-toastify";
        import { facebookConnect, facebookConnectVariables } from "../../types/api";
        import { FACEBOOK_CONNECT } from "./SocialLogin.queries";
        import SocialLoginPresenter from "./SocialLoginPresenter";
        
        class LoginMutation extends Mutation<facebookConnect, facebookConnectVariables> {}
        
        interface IState {
          firstName: string;
          lastName: string;
          email?: string;
          fbId: string;
        }
        
        interface IProps extends RouteComponentProps<any> {}
        
        class SocialLoginContainer extends React.Component<IProps, IState> {
          public state = {
            email: "",
            fbId: "",
            firstName: "",
            lastName: ""
          }
        	public facebookMutation: MutationFn<facebookConnect, facebookConnectVariables> | undefined = undefined;
          public render() {
            return (
              <LoginMutation mutation={FACEBOOK_CONNECT}>
                {(facebookMutation, { loading }) => {
                  this.facebookMutation = facebookMutation;
                  return <SocialLoginPresenter loginCallback={this.loginCallback}/>;
                }}
              </LoginMutation>
            )
          }
          public loginCallback = response => {
            const { name, first_name, last_name, id, accessToken, email } = response;
            if (accessToken) {
              toast.success(`Welcome ${name}`);
        			if (accessToken && this.facebookMutation) {
                this.facebookMutation({
                  variables: {
                    email,
                    fbId: id,
                    firstName: first_name,
                    lastName: last_name
                  }
                });
              }
            } else {
              toast.error("Cound not log you in 😔");
            }
          };
        }
        
        export default SocialLoginContainer;

    ## #2.29 SocialLogin with Apollo part Four

    part 3까지는 페이스북으로 로그인 정보를 요청하고 얻은 응답으로 우리 API 서버의 FacebookConnect 요청을 했다. graphql 서버에서 응답을 받아 처리하는 부분이 없는데, phoneLogin과 마찬가지로 로그인 처리까지 진행하도록 한다.

    - src/routes/SocialLogin/SocialLoginContainer.tsx

            ...
            import { toast } from "react-toastify";
            import { LOG_USER_IN } from '../../innerQueries';
            import { facebookConnect, facebookConnectVariables } from "../../types/api";
            
            ...
            
              public render() {
                return (
                  <Mutation mutation={LOG_USER_IN}>
                    {logUserIn => (
                      <LoginMutation 
                        mutation={FACEBOOK_CONNECT}
                        onCompleted={data => {
                          const { FacebookConnect } = data;
                          if (FacebookConnect.ok) {
                            logUserIn({
                              variables: {
                                token: FacebookConnect.token
                              }
                            })
                          } else {
                            toast.error(FacebookConnect.error);
                          }
                        }}
                      >
                        {(facebookMutation, { loading }) => {
                          this.facebookMutation = facebookMutation;
                          return <SocialLoginPresenter loginCallback={this.loginCallback}/>;
                        }}
                      </LoginMutation>
                    )}
                  </Mutation>
                )
              }
            ...

    - src/routes/PhoneLogin/PhoneLoginContainer.tsx 도 onSubmit함수를 분리하여 좀 보기 좋게 바꾸자.

            import React from "react";
            import { Mutation, MutationFn } from "react-apollo";
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
              public phoneMutation: MutationFn<startPhoneVerification, startPhoneVerificationVariables> | undefined = undefined;
              public state = {
                countryCode: "+82",
                phoneNumber: ""
              };
            
              public render() {
                const { history } = this.props;
                const { countryCode, phoneNumber } = this.state;
                const phone = `${countryCode}-${phoneNumber}`;
                return (
                  <PhoneSignInMutation
                    mutation={PHONE_SIGN_IN}
                    variables={{
                      phoneNumber: phone
                    }}
                    onCompleted={data => {
                      const { StartPhoneVerification } = data;
                      if (StartPhoneVerification.ok) {
                        toast.success("SMS Sent! Redirecting you...")
                        history.push({
                          pathname: "/verify-phone",
                          state: {
                            phone
                          }
                        });
                      } else {
                        toast.error(StartPhoneVerification.error);
                      }
                    }}
                  >
                    { (phoneMutation, { loading }) => {
                      this.phoneMutation = phoneMutation;
                      
                      return (
                        <PhoneLoginPresenter
                          countryCode={countryCode}
                          phoneNumber={phoneNumber}
                          onInputChange={this.onInputChange}
                          onSubmit={this.onSubmit}
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
            
              public onSubmit: React.FormEventHandler<HTMLFormElement> = event => {
                event.preventDefault();
                const { countryCode, phoneNumber } = this.state;
                const phone = `${countryCode}${phoneNumber}`;
                const isValid = /^\+[1-9]{1}[0-9]{7,11}$/.test(phone);
                if(isValid && this.phoneMutation) {
                  this.phoneMutation();
                } else {
                  toast.error("please write a valid phone number!!!");
                }
              };
            }
            
            export default PhoneLoginContainer;

이제 로그인 처리가 마무리 됐다.