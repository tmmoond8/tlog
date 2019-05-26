---
templateKey: blog-post
title: 17 우버 클론 코딩 (nomad coders)
date: 2019-05-20T08:56:56.243Z
description: 우버 코딩 강의 로그 2.7 ~ 2.12
featuredpost: true
featuredimage: /img/nuber_clone.jpg
tags:
  - 우버 클론 코딩
  - nomad coders
  - react
  - styled components
---
#

## #2.7 Typescript and Styled Components part One

## #2.6 Typescript and Styled Components part Two

이번에 짧게 styled-components 모듈의 설치하고 사용법을 간단히 살펴 보자. 

강의 기준은 styled-components V3 인데, 지금은 V4가 최신이다. 내가 처음 강의 볼때는 문제가 좀 발생해서 나 나름대로 조금 수정했다.

    $ yarn add styled-components
    $ yarn add @types/styled-components

- src/theme.ts 에 theme을 정의 한다. 위에서 `IThemeInterface` 인터페이스 대로 값을 만든다.

        import baseStyled, { ThemedStyledInterface } from 'styled-components';
        
        export const theme = {
          blueColor: "#3498db",
          greyColor: "#7f8c8d"
        };
        
        export type Theme = typeof theme;
        export const styled = baseStyled as ThemedStyledInterface<Theme>;

- src/typed-compoennts.ts

        import * as styledComponents from "styled-components";
        import { ThemedStyledComponentsModule } from "styled-components";
        import { Theme } from "./theme";
        
        const {
          default: styled,
          css,
          createGlobalStyle,
          keyframes,
          ThemeProvider
        } = styledComponents as ThemedStyledComponentsModule<Theme>;
        
        export { css, createGlobalStyle, keyframes, ThemeProvider };
        export default styled;

- src/components/App/AppContainer.tsx

        import React from "react";
        import { graphql } from "react-apollo";
        import theme from '../../theme';
        import { ThemeProvider } from '../../typed-components';
        import AppPresenter from './AppPresenter';
        import { IS_LOGGED_IN } from "./AppQueries";
        
        const AppContainer: any = (props) => (
          <ThemeProvider theme={theme}>
            <AppPresenter isLoggedIn={props.data.auth.isLoggedIn}/>
          </ThemeProvider>
        );
        
        export default graphql(IS_LOGGED_IN)(AppContainer);

    AppPresenter 컴포넌트를 ThemeProvider로 한번 더 감싼다. 이렇게 하면 하위에서 Theme 객체를 꺼내서 사용할 수 있지 않을까?

이번에는 css-reset을 적용하는 것이다. 간단히 모듈을 사용하자

    $ yarn add styled-reset

- src/components/App/AppContainer.tsx

        import React, { Fragment } from "react";
        import { graphql } from "react-apollo";
        import reset from "styled-reset";
        import theme from '../../theme';
        import { createGlobalStyle, ThemeProvider } from '../../typed-components';
        import AppPresenter from './AppPresenter';
        import { IS_LOGGED_IN } from "./AppQueries";
        
        const GlobalStyle = createGlobalStyle`${reset}`;
        
        const AppContainer: any = (props) => (
        	<Fragment>
        		<GlobalStyle/>
        		<ThemeProvider theme={theme}>
        	    <AppPresenter isLoggedIn={props.data.auth.isLoggedIn}/>
        	  </ThemeProvider>
        	</Fragment>
        );
        
        export default graphql(IS_LOGGED_IN)(AppContainer);

    `createGlobalStyle` 은 style을 head에 추가해주는 것 같다. 

    reset은 단순한 reset string이기 때문에 추가적으로 정의하고 싶은 것을 더 정의할 수 있을 것 같다.

> 니콜라스가 파일 이름을 typed-components.ts로 짓길래 styled-components.ts로 지어야 하는거 아닌가? 하면서 그렇게 했다가.. 진짜 모듈이랑 이름이 겹쳐서 오류 뿜고 삽질했다.

## #2.9 Global Styles Set Up

위에서 reset을 했지만, 좀 더 멋지게 바꿔보자.

- src/global-styles.ts 파일을 생성해서 global로 적용될 css를 설정하자. 여기선 styled-reset에서 가져온 값과 웹폰트, 추가적으로 초기화할 css를 추가했다.

        import reset from "styled-reset";
        import { createGlobalStyle } from "./typed-components";
        
        const GlobalStyle = createGlobalStyle`
          @import url('https://fonts.googleapis.com/css?family=Maven+Pro');
          ${reset}
          * {
            box-sizing: border-box;
          }
          body{
              font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
          }
          a {
            color: inherit;
            text-decoration: none;
          }
          input, button {
            &:focus, &:active {
              outline: none;
            }
          }
          h1, h2, h3, h4, h5, h6{
            font-family:'Maven Pro', sans-serif;
          }
        `;
        
        export default GlobalStyle;

    global로 적용할 css다. 저 위의 것들은 일반적으로 reset을 추가 해주는 경우가 많다.

- src/components/App/AppContainer.tsx

        import GlobalStyle from "global-styles";
        import React, { Fragment } from "react";
        import { graphql } from "react-apollo";
        import { theme } from 'theme';
        import { ThemeProvider } from 'typed-components';
        import AppPresenter from './AppPresenter';
        import { IS_LOGGED_IN } from "./AppQueries";
        
        const AppContainer : any = ({ data })  => (
          <Fragment>
            <GlobalStyle/>
            <ThemeProvider theme={theme}>
              <AppPresenter isLoggedIn={data.auth.isLoggedIn}/>
            </ThemeProvider>
          </Fragment>
        );
        
        export default graphql(IS_LOGGED_IN)(AppContainer);

> @import 구문은 어떻게 되나 봤더니,, 요새 브라우저는 저런거 되나 보네.. 너무 모른다. mdn css도 한 번 쭉 봐야겠다.

## #2.10 Planning the Routes

이번에는 [README.md](http://readme.md) 에 플랜을 작성하였다.

- README.md

        # Nuber Client
        
        Client for the (N)Uber Clone Course on Nomad Academy. RaactJS, Apollo, Typescript
        
        ## Screen:
        
        ### Logged Out:
        
          - [ ] Home
          - [ ] Phone Login
          - [ ] Verify Phone Number
          - [ ] Social Login
        
        ### Logged I
        
        	- [ ] Home
          - [ ] Ride
          - [ ] Edit Account
          - [ ] Settings
          - [ ] Places
          - [ ] Add Place
          - [ ] Find Address
          - [ ] Challenge: Ride History

그리고 각 라우트에서 임시로 보여줄 페이지를 생성하자.

- src/routes/AddPlace/index.tsx

        import React from "react";
        
        const R = ()  => <span>AddPlace</span>;
        
        export default R;

- src/routes/EditAccount/index.tsx

        import React from "react";
        
        const R = ()  => <span>EditAccount</span>;
        
        export default R;

- src/routes/FindAddress/index.tsx

        import React from "react";
        
        const R = ()  => <span>FindAddress</span>;
        
        export default R;

- src/routes/Home/index.tsx

        import React from "react";
        
        const R = ()  => <span>Home</span>;
        
        export default R;

- src/routes/PhoneLogin/index.tsx

        import React from "react";
        
        const R = ()  => <span>PhoneLogin</span>;
        
        export default R;

- src/routes/Places/index.tsx

        import React from "react";
        
        const R = ()  => <span>Places</span>;
        
        export default R;

- src/routes/Ride/index.t

        import React from "react";
        
        const R = ()  => <span>Ride</span>;
        
        export default R;

- src/routes/Settings/index.tsx

        import React from "react";
        
        const R = ()  => <span>Settings</span>;
        
        export default R;

- src/routes/SocialLogin/index.tsx

        import React from "react";
        
        const R = ()  => <span>SocialLogin</span>;
        
        export default R;

- src/routes/VerifyPhone/index.tsx

        import React from "react";
        
        const R = ()  => <span>VerifyPhone</span>;
        
        export default R;

뭔가 노가다성 작업이지만, 잘 복붙해서 만들자.

## #2.11 Router and Routes

이번에는 모든 페이지를 react router로 연결할 것이다. 먼저 react-router 모듈을 설치하자.

    $ yarn add react-router-dom
    $ yarn add @types/react-router-dom

- src/components/App/AppPresenter.tsx

        import React from "react";
        import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
        import AddPlaces from "routes/AddPlace";
        import EditAccount from "routes/EditAccount";
        import FindAddress from "routes/FindAddress";
        import Home from "routes/Home";
        import PhoneLogin from "routes/PhoneLogin";
        import Places from "routes/Places";
        import Ride from "routes/Ride";
        import Settings from "routes/Settings";
        import SocialLogin from "routes/SocialLogin";
        import VerifyPhone from "routes/VerifyPhone";
        
        interface IProps {
          isLoggedIn: boolean;
        }
        
        const LoggedOutRoutes: React.SFC = () => (
          <Switch>
            <Route path={"/"} exact={true} component={Home}/>
            <Route path={"/phone-login"} exact={true} component={PhoneLogin}/>
            <Route path={"/verify-phone/:number"} exact={true} component={VerifyPhone}/>
            <Route path={"/social-login"} exact={true} component={SocialLogin}/>
            <Redirect from={"*"} to={"/"} />
          </Switch>
        );
        
        
        const LoggedInRouter: React.SFC = () => (
          <Switch>
            <Route path={"/"} exact={true} component={Home}/>
            <Route path={"/ride"} exact={true} component={Ride}/>
            <Route path={"/edit-account"} exact={true} component={EditAccount}/>
            <Route path={"/settings"} exact={true} component={Settings}/>
            <Route path={"/places"} exact={true} component={Places}/>
            <Route path={"/add-place"} exact={true} component={AddPlaces}/>
            <Route path={"/find-address"} exact={true} component={FindAddress}/>
            <Redirect from={"*"} to={"/"} />
          </Switch>
        );
        
        const AppPresenter: React.SFC<IProps> = ({ isLoggedIn }) => (
          <BrowserRouter>
            { isLoggedIn ? <LoggedInRouter/> : <LoggedOutRoutes/> }
          </BrowserRouter>
        );
        
        export default AppPresenter;

    만약 react-router-dom 의 동작 방식을 궁금하다면 veloper님의 강좌를 보길 추천한다. [링크](https://velopert.com/3275)

    여기서는 로그인 했는지, 안했는지에 따라 router를 달리 두는 것을 알겠다. 깔끔한 방식인 것 같다.

## #2.12 OutHome Component

초기 페이지 구성을 니콜라스가 해뒀다. 

- src/routes/Login/LoiginPresenter.tsx 새로 컴포넌트를 만들자. grayColor가 오류가 날텐데 조금 뒤에 추가할 것이다. prop.theme 까지만 하면 우리가  IThemeInterface 인터페이스에 정의한 값 중 사용할 수 있도록 자동완성 기능이 작동한다. 매우 어썸하다.

        import React from "react";
        import { RouteComponentProps } from "react-router-dom";
        import bgImage from "../../images/bg.png";
        import styled from "../../typed-components";
        
        const Container = styled.div`
          height: 100vh;
        `;
        
        const Header = styled.header`
          height: 70%;
          background: linear-gradient(rgba(0, 153, 196, 0.5), rgba(0, 153, 196, 0.4)),
            url(${bgImage});
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        
        const Logo = styled.div`
          width: 110px;
          height: 110px;
          background-color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 -14px 28px rgba(0, 0, 0, 0.22);
          text-transform: uppercase;
          font-weight: 500;
          font-size: 25px;
        `;
        
        const Title = styled.h1``;
        
        const Footer = styled.div``;
        
        const Subtitle = styled.h2`
          font-size: 30px;
        `;
        
        const FakeInput = styled.div`
          margin: 50px 0px;
          font-size: 25px;
          font-weight: 300;
        `;
        
        const PhoneLogin = styled.div`
          padding: 20px;
        	cursor: pointer;
        `;
        
        const Grey = styled.span`
          color: ${props => props.theme.greyColor};
          margin-left: 10px;
        `;
        
        const SocialLogin = styled.div`
          border-top: 1px solid ${props => props.theme.greyColor};
          padding: 30px 20px;
        `;
        
        const SocialLink = styled.span`
          color: ${props => props.theme.blueColor};
          font-size: 20px;
        	cursor: pointer;
        `;
        
        interface IProps extends RouteComponentProps<any> {}
        
        const OutHomePresenter: React.SFC<IProps> = () => (
          <Container>
            <Header>
              <Logo>
                <Title>Nuber</Title>
              </Logo>
            </Header>
        		<Footer>
              <Link to={"/phone-login"}>
                <PhoneLogin>
                  <Subtitle>Get moving with Nuber</Subtitle>
                  <FakeInput>
                    🇰🇷 +82 <Grey>Enter your mobile number</Grey>
                  </FakeInput>
                </PhoneLogin>
              </Link>
              <Link to={"/social-login"}>
                <SocialLogin>
                  <SocialLink>Or connect with social</SocialLink>
                </SocialLogin>
              </Link>
            </Footer>
          </Container>
        );
        
        export default OutHomePresenter;

- src/routes/Login/index.ts

        export { default } from "./LoginPresenter";

전역으로 사용할 theme 객체에 greyColor가 등록되어 있지 않아서 발생한 문제다.

- src/theme.ts greyColor 값을 추가하자.

        const theme = {
          blueColor: "#3498db",
          greyColor: "#7f8c8d"
        };
        
        export default theme;

- src/types-compoennts theme 객체는 우리가 정의한 인터페이스에 맞게 작성이 되어야 한다. theme을 수정하면 interface에도 같이 해줘야 한다.

        ...
        interface IThemeInterface {
          blueColor: string;
          greyColor: string;
        }
        ...

이제 Login 을 연결하자.

- src/components/App/AppPresenter.tsx

    ...
    import Home from "routes/Home";
    import Login from "routes/Login";
    import PhoneLogin from "routes/PhoneLogin";
    
    ...
    
    const LoggedOutRoutes: React.SFC = () => (
      <Switch>
        <Route ath={"/"} exact={true} component={Login}/>
        <Route path={"/phone-login"} exact={true} component={PhoneLogin}/>
        <Route path={"/verify-phone/:number"} exact={true} component={VerifyPhone}/>
        <Route path={"/social-login"} exact={true} component={SocialLogin}/>
        <Redirect from={"*"} to={"/"} />
      </Switch>
    );
    
    ...

- src/images/bg.png  images 디렉토리를 넣고 이미지 하나를 다운 받아서 bg.png로 저장하자.

    ![](bg-964df903-7754-4ddc-a12b-40c0e3dbdc80.png)

자 이제 리액트를 다시 띄우고 접속하면, 페이지가 잘 보일 것이다.