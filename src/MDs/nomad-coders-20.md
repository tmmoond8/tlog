---
title: 20 우버 클론 코딩 (nomad coders)
date: '2019-05-28T08:56:56.243Z'
description: 우버 코딩 강의 로그 2.22 ~ 2.25
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

## #2.22 VerifyPhone Screen

지금까지 phoneLogin 페이지에서 입력한 폰 번호가 유효한지 검사하고, 유효 하면 해당 폰 번호로 번호를 메시지로 보내게 된다. 사용자는 메시지로 온 번호를 입력해야 한다. 이번에 만들 것이 폰으로 넘어온 코드를 입력하는  인증 페이지다.

 먼저 페이지에 필요한 컴포넌트를 정의하자. Header, Button 두 컴포넌트를 정의한다.

- src/components/Header/Header.tsx

        import React from "react";
        import styled from "../../typed-components";
        import BackArrow from "../BackArrow";
        
        const Container = styled.header`
          background-color: black;
          color: white;
          display: flex;
          height: 50px;
          font-size: 20px;
          font-weight: 300;
          align-items: center;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
          & svg {
            fill: white;
          }
          margin-bottom: 50px;
          padding: 0 10px;
        `;
        
        const Title = styled.h2`
          margin-left: 10px;
        `;
        
        interface IProps {
          title: string;
          backTo?: string;
        }
        
        const Header: React.SFC<IProps> = ({ title, backTo }) => (
          <Container>
            {backTo && <BackArrow backTo={backTo} />}
            <Title>{title}</Title>
          </Container>
        );
        
        export default Header;

- src/components/Header/index.ts

        export { default } from "./Header";

- src/components/Button/Button.tsx

        import React from "react";
        import styled from "../../typed-components";
        
        const Container = styled.input`
          width: 100%;
          background-color: black;
          color: white;
          text-transform: uppercase;
          padding: 15px 0;
          font-size: 16px;
          border: 0;
          cursor: pointer;
          font-weight: 500;
          text-align: center;
          &:active,
          &:focus {
            outline: none;
          }
          &:disabled {
            opacity: 0.8;
        		cursor: not-allowed;
          }
        `;
        
        interface IProps {
          value: string;
          onClick: any;
          disabled?: boolean;
        }
        
        const Button: React.SFC<IProps> = ({ value, onClick, disabled = false }) => (
          <Container value={value} disabled={false} onClick={onClick} type="submit" />
        );
        
        export default Button;

- src/components/index.ts

        export { default } from "./Button";

이제 VerifyPhone 페이지를 정의하자.

- src/routes/VerifyPhone/VerifyPhonePresenter.tsx

        import Button from "components/Button";
        import Header from "components/Header";
        import Input from "components/Input";
        import React from "react";
        import Helmet from "react-helmet";
        import styled from "../../typed-components";
        
        const Container = styled.div``;
        
        const Form = styled.form`
          padding: 0px 40px;
        `;
        
        const ExtendedInput = styled(Input)`
          margin-bottom: 20px;
        `;
        
        const VerifyPhonePresenter = () => (
          <Container>
            <Helmet>
              <title>Verify Phone | Number</title>
            </Helmet>
            <Header backTo={"/phone-login"} title={"Verify Phone Number"} />
            <Form>
              <ExtendedInput
                value=""
                placeholder={"Enter Verification Code"}
                onChange={null}
              />
              <Button value={"Submit"} onClick={null} />
            </Form>
          </Container>
        );
        
        export default VerifyPhonePresenter;

- src/routes/VerifyPhone/VerifyPhoneContainer.tsx   react-route에 라우팅 컴포넌트로 등록된 컴포넌트에서 props 타입을 RouteComponentProps로 명시하면 좋다.

        import React from "react";
        import { RouteComponentProps } from "react-router-dom";
        import VerifyPhonePresenter from "./VerifyPhonePresenter";
        
        interface IProps extends RouteComponentProps<any> {}
        
        class VerifyPhoneContainer extends React.Component<IProps> {
          constructor(props: IProps) {
            super(props);
            // tslint:disable-next-line
            console.log(props);
          }
          public render() {
            return <VerifyPhonePresenter />;
          }
        }
        
        export default VerifyPhoneContainer;

- src/routes/VerifyPhone/index.ts  index.tsx의 내용은 지우고 파일이름도 indec.ts로 바꾸자.

        export { default } from "./VerifyPhoneContainer";

이렇게 하고 

[http://localhost:3000/verify-phone/01012345678](http://localhost:3000/verify-phone/123213) 접근을 해보면 이제 페이지가 보인다. 아직 어떤 동작도 하지 않지만 페이지 만들었다. 그런데 여기서 수정할게 있는데, 이 페이지에서 01012345678 이라는 폰 번호에 보낸 내용을 확인하는 페이지가 된다. 그런데 이렇게 하면 주소를 통해서 타인의 개인 인증 페이지에 접근할 수 있기 때문에 더 좋은 방법을 소개 한다. 바로 페이지를 이동할 때 특정 정보를 같이 보내는 방법이다.

- src/components/AppPresenter.tsx VerifyPhone 페이지에 연결할 때 path를 /verify-phone로 변경 했다.

        const LoggedOutRoutes: React.SFC = () => (
          <Switch>
            <Route path={"/"} exact={true} component={Login}/>
            <Route path={"/phone-login"} exact={true} component={PhoneLogin}/>
            <Route path={"/verify-phone"} exact={true} component={VerifyPhone}/>
            <Route path={"/social-login"} exact={true} component={SocialLogin}/>
            <Redirect from={"*"} to={"/"} />
          </Switch>
        );

- src/routes/PhoneLogin/PhoneLoginContainer.tsx     props에서 history를 꺼내온다. history 객체는 우리가 AppPresenter 에서 Route한 컴포넌트이기 때문에 들어있다. push 메소드를 통해 해당 path로 이동할 수있다. 이때 state 속성으로 특정 값을 넘겨주면 된다. 아래에서는 일반 텍스트를 보냈다.

        ...
        public render() {
            const { history } = this.props;
            const { countryCode, phoneNumber } = this.state;
            return (
              ...
                { (mutation, { loading }) => {
                  const onSubmit: React.FormEventHandler<HTMLFormElement> = event => {
                    event.preventDefault();
        			
        						const phone = `${countryCode}-${phoneNumber}`;
                    const isValid = /^\+[1-9]+-[0-9]{7,11}$/.test(phone);
                    if(isValid) {
                      // mutation();
                      history.push({
                        pathname: "/verify-phone",
                        state: {
                          phone
                        }
                      });
                    } else {
                      toast.error("please write a valid phone number!!!");
                    }
        ...

이제 [http://localhost:3000/phone-login](http://localhost:3000/phone-login) 에서 숫자를 입력하면 페이지가 이동한다. 콘솔창에 location 안에 state로 넣어준 값이 있는 것을 볼 수 있다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952570/tlog/_2019-05-14__3-eb76b12f-caea-4ba4-8cb8-a6a6c52ca09d.02.17_xa8zdq.png)

 만약 이 state에 phone이 없다면 페이지 접근을 시키면 안된다. 안전장치를 만들자.

- src/routes/VerifyPhone/VerifyPhoneContainer.tsx

        import React from "react";
        import { RouteComponentProps } from "react-router-dom";
        import VerifyPhonePresenter from "./VerifyPhonePresenter";
        
        interface IProps extends RouteComponentProps<any> {}
        
        class VerifyPhoneContainer extends React.Component<IProps> {
          constructor(props: IProps) {
            super(props);
            try {
              Object.hasOwnProperty.call(props.location.state, "phone");
            } catch (e) {
              props.history.push("/");
            }
          }
          public render() {
            return <VerifyPhonePresenter />;
          }
        }
        
        export default VerifyPhoneContainer;

떠있는 [http://localhost:3000/verify-phone](http://localhost:3000/verify-phone) 에서 새로 고침하면 state가 유지가 된다. 새로운 탭을 하나 띄워서 [http://localhost:3000/verify-phone](http://localhost:3000/verify-phone) 로 접근하면 홈으로 리다이렉트가 되는 것을 확인할 수 있다.

기억하자. 아무리 새로고침 해도 state는 유지된다!.

## #2.23 Testing the PhoneLogin Screen and Redirecting

위에서 문자 보내는 mutation() 주석을 했는데 테스트 하기 위해서 했던 코드고 실제 문자 보내는 mutation을 보내고 mutation을 완료 한 다음에 페이지 이동을 해야 한다.

- src/routes/PhoneLogin/PhoneLoginContainer.tsx     mutation 완료 후 페이지 이동 하도록 onCompleted 안쪽으로 페이지 이동하는 코드를 옮겼다.

        import React from "react";
        import { Mutation } from "react-apollo";
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
            const { history } = this.props;
            const { countryCode, phoneNumber } = this.state;
            return (
              <PhoneSignInMutation
                mutation={PHONE_SIGN_IN}
                variables={{
                  phoneNumber: `${countryCode}-${phoneNumber}`
                }}
                onCompleted={data => {
                  const { StartPhoneVerification } = data;
                  if (StartPhoneVerification.ok) {
                    return;
                  } else {
                    toast.error(StartPhoneVerification.error);
                  }
                }}
              >
                { (mutation, { loading }) => {
                  const onSubmit: React.FormEventHandler<HTMLFormElement> = event => {
                    event.preventDefault();
        			
                    const phone = `${countryCode}${phoneNumber}`;
                    const isValid = /^\+[1-9]{1}[0-9]{7,11}$/.test(phone);
                    if(isValid) {
                      mutation();
                      history.push({
                        pathname: "/verify-phone",
                        state: {
                          phone
                        }
                      });
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

[http://localhost:3000/phone-login](http://localhost:3000/phone-login) 에서 폰 번호를 입력하면 폰으로 메시지가 가고 화면도 이동한다.

폰번호의 형식은 10XXXXYYYY 다.

## #2.24 VerifyPhone Mutation part One

이제 인증 페이지에서 휴대폰으로 넘어온 번호를 입력하여 인증 완료를 시키도록 하자.

먼저, Input이 동작하지 않는데, 사용자가 입력 가능하게 수정을 먼저 하자.

- src/routes/VerifyPhone/VerifyPhonePresenter.tsx   IProps을 정의하고 의미없는 값을 넣고 있었는데, props로 전달된 key와 onChange를 ExtendedInput 에 넣어주도록 수정하자.

        ...
        
        const ExtendedInput = styled(Input)`
          margin-bottom: 20px;
        `;
        
        interface IProps {
          verificationCode: string;
          onChange: React.ChangeEventHandler<HTMLInputElement>
        }
        
        const VerifyPhonePresenter: React.SFC<IProps> = ({ verificationCode, onChange }) => (
          <Container>
            <Helmet>
              <title>Verify Phone | Number</title>
            </Helmet>
            <Header backTo={"/phone-login"} title={"Verify Phone Number"} />
            <Form>
              <ExtendedInput
                value={verificationCode}
                placeholder={"Enter Verification Code"}
                onChange={onChange}
                name="verificationCode"
              />
              <Button value={"Submit"} onClick={null} />
            </Form>
          </Container>
        );
        
        export default VerifyPhonePresenter;

    `onChange` 의 타입을 `React.ChangeEventHandler<HTMLInputElement>` 로 했는데,  니콜라스는 `(event: React.ChangeEvent<HTMLInputElement>) => void;` 로 했다. 나는 타입에러가 나서 저렇게 작성했다.

- src/routes/VerifyPhone/VerifyPhoneContainer.tsx

        import React from "react";
        import { RouteComponentProps } from "react-router-dom";
        import VerifyPhonePresenter from "./VerifyPhonePresenter";
        
        interface IState {
          verificationCode: string;
        }
        
        interface IProps extends RouteComponentProps<any> {}
        
        class VerifyPhoneContainer extends React.Component<IProps, IState> {
          constructor(props: IProps) {
            super(props);
            try {
              Object.hasOwnProperty.call(props.location.state, "phone");
            } catch (e) {
              props.history.push("/");
            }
             this.state = {
               verificationCode: ""
             }
             this.onInputChange = this.onInputChange.bind(this);
          }
          public render() {
            const { verificationCode } = this.state;
            return <VerifyPhonePresenter onChange={this.onInputChange} verificationCode={verificationCode}/>;
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
        
        export default VerifyPhoneContainer;Verify

이제 입력은 잘된다.

인증 완료를 할 때는 CompletePhoneVerification Mutation을 사용하는데, chrome의 apollo 확장 프로그램을 설치하면 손쉽게 graphql의 쿼리를 확인할 수 있다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952571/tlog/_2019-05-14__5-70f0e591-3940-43a5-9d62-550df6f17719.18.31_ky7wr1.png)

- src/routes/VerifyPhone/VerifyPhone.queries.ts

        import { gql } from "apollo-boost";
        
        export const VERIFY_PHONE = gql`
          mutation verfiyPhone($phoneNumber: String!, $key: String!) {
            CompletePhoneVerification(phoneNumber: $phoneNumber, key: $key) {
              ok
              error
              token
            }
          }
        `;

이렇게 하고 yarn codegen을 하면 src/types/api.d.ts 에 verifyPhone 관련 타입들이 추가될 것이다.

## #2.25 VerifyPhone Mutation part Two

- src/components/Form/Form.tsx

        import React from "react";
        
        interface IProps {
          submitFn: any;
          className?: string;
        }
        
        const Form: React.SFC<IProps> = ({ submitFn, className, children }) => (
          <form
            className={className}
            onSubmit={e => {
              e.preventDefault();
              submitFn();
            }}
          >
            {children}
          </form>
        );
        
        export default Form;

- src/components/Form/index.ts

        export { default } from "./Form";

- src/routes/VerifyPhone/VerifyPhonePresenter.tsx

        import Button from "components/Button";
        import Form from "components/Form";
        import Header from "components/Header";
        import Input from "components/Input";
        import React from "react";
        import { MutationFn } from "react-apollo";
        import Helmet from "react-helmet";
        import styled from "../../typed-components";
        import { verfiyPhone, verfiyPhoneVariables } from "../../types/api";
        
        const Container = styled.div``;
        
        const ExtendedForm = styled(Form)`
          padding: 0px 40px;
        `;
        
        const ExtendedInput = styled(Input)`
          margin-bottom: 20px;
        `;
        
        interface IProps {
          verificationCode: string;
          onChange: React.ChangeEventHandler<HTMLInputElement>
          onSubmit: MutationFn<verfiyPhone, verfiyPhoneVariables>;
          loading: boolean;
        }
        
        const VerifyPhonePresenter: React.SFC<IProps> = ({ 
          verificationCode, 
          onChange,
          onSubmit,
          loading
        }) => (
          <Container>
            <Helmet>
              <title>Verify Phone | Number</title>
            </Helmet>
            <Header backTo={"/phone-login"} title={"Verify Phone Number"} />
            <ExtendedForm submitFn={onSubmit}>
              <ExtendedInput
                value={verificationCode}
                placeholder={"Enter Verification Code"}
                onChange={onChange}
                name="verificationCode"
              />
              <Button
                disabled={loading}
                value={loading ? "Verifing": "Submit"}
                onClick={null}
              />
            </ExtendedForm>
          </Container>
        );
        
        export default VerifyPhonePresenter;

- src/routes/VerifyPhone/VerifyPhoneContainer.tsx

        import React from "react";
        import { Mutation } from "react-apollo";
        import { RouteComponentProps } from "react-router-dom";
        import { toast } from "react-toastify";
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
              <VerifyMutation
                mutation={VERIFY_PHONE}
                variables={{
                  key: verificationCode,
                  phoneNumber
                }}
                onCompleted={data => {
                  const { CompletePhoneVerification } = data;
                  if (CompletePhoneVerification.ok) {
                    toast.success("You're verified, loggin in now");
                    // tslint:disable-next-line
                    console.log(CompletePhoneVerification);
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

폰으로 온 번호를 입력하면 콘솔에 응답이 들어 있다. 

> 강의의 오류를 찾았다. verfiyPhone은 EmailSignUp 을 한 뒤 호출되야 한다. 리액트 프로젝트에는 EMailSignUp를 호출하는 부분이 없다.