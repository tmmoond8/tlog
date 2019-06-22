---
templateKey: blog-post
title: 22 우버 클론 코딩 (nomad coders)
date: 2019-06-01T08:56:56.243Z
description: 우버 코딩 강의 로그 2.31 ~ 2.35
featuredpost: true
featuredimage: /img/nuber_clone.jpg
tags:
  - uber-clone-coding
  - nomad-coders
  - apollo
  - graphql
---
#

## #2.31 Home Sidebar Component

이제 실제 기능에 대해서 뷰를 만들어 가는 과정을 진행할 거다. Home 페이지부터 차차 만들자. 나는 기존에 slidebar를 구현해서 사용했었는데, react-sidebar 모듈을 설치해서 사용하며 될 것 같다.

    $ yarn add react-sidebar
    $ yarn add @types/react-sidebar --dev

- src/routes/Home/HomePresenter.tsx

        import React from "react";
        import Helmet from "react-helmet";
        import Sidebar from "react-sidebar";
        import styled from "../../typed-components";
        
        const Container = styled.div``;
        
        const HomePresenter = () => (
          <Container>
            <Helmet>
              <title>Home | Nuber</title>
            </Helmet>
            <Sidebar
              sidebar={<b>Sidebar contents</b>}
              open={true}
              styles={{
                sidebar: {
                  background: "white",
                  width: "80%",
                  zIndex: "10"
                }
              }}
            >
              <button >Open sidebar</button>
            </Sidebar>
            hello
          </Container>
        )
        
        export default HomePresenter;

- src/routes/Home/HomeContainer.tsx

        import React from "react";
        import HomePresenter from "./HomePresenter";
        
        
        class HomeContainer extends React.Component {
          public render() {
            return (<HomePresenter/>)
          }
        }
        
        export default HomeContainer;

- src/routes/Home/index.ts

        export { default } from "./HomeContainer";

아직 버튼 핸들링을 하지 않았지만 기본적으로 Sidebar가 뜨도록 했다.

`sidebar`는 사이드바 안에 그려질 컴포넌트, `open` 은 열릴지 여부, 여기서는 true를 주었다. `styles` 는 스타일을 정의하면 된다. 

![](_2019-05-16__11-b5c4a7b0-e967-4906-8107-f8b6bd02662b.00.04.png)

버튼을 누를때만 메뉴가 열리고 또 여백 누를때 닫도로 기능을 구현하자.

- src/routes/Home/HomeContainer.tsx   sidebar의 오픈 여부의 상태를 갖도록 state를 정의했고, 오픈여부 값을 토글하는 토글 함수도 만들었다.

        import React from "react";
        import { RouteComponentProps } from "react-router";
        import HomePresenter from "./HomePresenter";
        
        interface IProps extends RouteComponentProps<any> {}
        interface IState {
          isMenuOpen: boolean;
        }
        
        class HomeContainer extends React.Component<IProps, IState> {
          public state = {
            isMenuOpen: false
          }
          public render() {
            const { isMenuOpen } = this.state;
            return (
              <HomePresenter isMenuOpen={isMenuOpen} toggleMenu={this.toggleMenu}/>
            )
          }
          public toggleMenu = () => {
            this.setState(state => {
              return {
                isMenuOpen: !state.isMenuOpen
              }
            })
          }
        }
        
        export default HomeContainer;

- src/routes/Home/HomePresenter.tsx   Container에서 sidebar의 오픈 여부와 toggle 함수를 받는다. 이 toggle함수는 sidebar를 열기 위해, 버튼에 `onClick`을, 닫기위해 `Sidebar` 컴포넌트안에 `onSetOpen`에 넣어주었다.

        import React from "react";
        import Helmet from "react-helmet";
        import Sidebar from "react-sidebar";
        import styled from "../../typed-components";
        
        const Container = styled.div``;
        
        interface IProps {
          isMenuOpen: boolean;
          toggleMenu: () => void;
        }
        
        const HomePresenter: React.SFC<IProps> = ({ isMenuOpen, toggleMenu }) => (
          <Container>
            <Helmet>
              <title>Home | Nuber</title>
            </Helmet>
            <Sidebar
              sidebar={<b>Sidebar contents</b>}
              open={isMenuOpen}
              onSetOpen={toggleMenu}
              styles={{
                sidebar: {
                  background: "white",
                  width: "80%",
                  zIndex: "10"
                }
              }}
            >
              <button onClick={toggleMenu}>Open sidebar</button>
            </Sidebar>
          </Container>
        )
        
        export default HomePresenter;

간단하게 사이드바를 구현했다.

## #2.32 Home Sidebar Query

Sidebar에 텍스트만 덩그러니 들어있다. Menu 컴포넌트 컴포넌트를 만들어서 Sidebar 안에 넣어보자.

Menu 컴포넌트는 그냥 니콜라스가 만들었다. 우리가 생각해볼 것들은 ToggleDriving 컴포넌트가 prop으로 isDriving를 받아서 styled에서 처리하는 것을 간단히 살펴보자.

- src/theme.ts

        ...
        const theme = {
          blueColor: "#3498db",
          greenColor: "#1abc9c",
          greyColor: "#7f8c8d",
          yellowColor: "#f1c40f"
        };
        ...

- src/components/Menu/MenuPresenter.tsx

        import React from "react";
        import { Link } from "react-router-dom";
        import styled from "../../typed-components";
        
        const Container = styled.div`
          height: 100%;
        `;
        
        const Header = styled.div`
          background-color: black;
          height: 20%;
          margin-bottom: 30px;
          padding: 0 15px;
          color: white;
        `;
        
        const SLink = styled(Link)`
          font-size: 22px;
          display: block;
          margin-left: 15px;
          margin-bottom: 25px;
          font-weight: 400;
        `;
        
        const Image = styled.img`
          height: 80px;
          width: 80px;
          background-color: grey;
          border-radius: 40px;
          overflow: hidden;
        `;
        
        const Name = styled.h2`
          font-size: 22px;
          color: white;
          margin-bottom: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        `;
        
        const Rating = styled.h5`
          font-size: 18px;
          color: white;
        `;
        
        const Text = styled.span`
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        `;
        
        const Grid = styled.div`
          display: grid;
          grid-template-columns: 1fr 2fr;
          grid-gap: 10px;
          height: 100%;
          align-items: center;
        `;
        
        interface IToggleProps {
          isDriving: boolean;
        }
        
        const ToggleDriving = styled<IToggleProps | any>("button")`
          -webkit-appearance: none;
          background-color: ${props =>
            props.isDriving ? props.theme.yellowColor : props.theme.greenColor};
          width: 100%;
          color: white;
          font-size: 18px;
          border: 0;
          padding: 15px 0px;
          cursor: pointer;
        `;
        
        const MenuPresenter: React.SFC = () => (
          <Container>
            <Header>
              <Grid>
                <Link to={"/edit-account"}>
                  <Image
                    src={
                      "https://yt3.ggpht.com/-CTwXMuZRaWw/AAAAAAAAAAI/AAAAAAAAAAA/HTJy-KJ4F2c/s88-c-k-no-mo-rj-c0xffffff/photo.jpg"
                    }
                  />
                </Link>
                <Text>
                  <Name>Nicolas Serrano Arevalo</Name>
                  <Rating>4.5</Rating>
                </Text>
              </Grid>
            </Header>
            <SLink to="/trips">Your Trips</SLink>
            <SLink to="/settings">Settings</SLink>
            <ToggleDriving isDriving={true}>
              {true ? "Stop driving" : "Start driving"}
            </ToggleDriving>
          </Container>
        );
        
        export default MenuPresenter;

- src/components/Menu/MenuContainer.tsx

        import React from "react";
        import MenuPresenter from "./MenuPresenter";
        
        class MenuContainer extends React.Component {
          public render() {
            return <MenuPresenter />;
          }
        }
        
        export default MenuContainer;

- src/components/Menu/index.ts

        export { default } from "./MenuContainer";

- src/routes/Home/HomePresenter.tsx

        import Menu from "components/Menu";
        import React from "react";
        
        ...
        
            <Sidebar
              sidebar={<Menu/>}
              open={isMenuOpen}
        ...

메뉴에 내 정보 상태를 나타내줘야 한다. apollo에는 apollo 캐시라는 것을 사용해서 같은 쿼리를 서버에 더 조용하지 않는다고 하는데 잘은 모르겠다.

- src/sharedQueries.queries.ts

        import { gql } from "apollo-boost";
        
        export const USER_PROFILE = gql`
          query userProfile {
            GetMyProfile {
              ok
              error
              user {
                profilePhoto
                fullName
                isDriving
              }
            }
          }
        `;

## #2.33 Home Sidebar Query part Two

이번에는 위에서 정의한 쿼리를 호출하여 Menu에 유저 정보를 나타내보자.

- src/routes/Home/HomeContainertsx

        import React from "react";
        import { Query } from "react-apollo";
        import { RouteComponentProps } from "react-router";
        import { USER_PROFILE } from "sharedQueries.queries";
        import { userProfile } from "../../types/api";
        import HomePresenter from "./HomePresenter";
        
        interface IProps extends RouteComponentProps<any> {}
        interface IState {
          isMenuOpen: boolean;
        }
        
        class ProfileQuery extends Query<userProfile> {}
        
        class HomeContainer extends React.Component<IProps, IState> {
          public state = {
            isMenuOpen: false
          }
          public render() {
            const { isMenuOpen } = this.state;
            return (
              <ProfileQuery query={USER_PROFILE}>
                {({ loading }) => (
                  <HomePresenter 
                    loading={loading}
                    isMenuOpen={isMenuOpen} 
                    toggleMenu={this.toggleMenu}
                  />
                )}
              </ProfileQuery>
            )
          }
          public toggleMenu = () => {
            this.setState(state => {
              return {
                isMenuOpen: !state.isMenuOpen
              }
            })
          }
        }
        
        export default HomeContainer;

- src/routes/Home/HomePresenter.tsx

        import Menu from "components/Menu";
        import React from "react";
        import Helmet from "react-helmet";
        import Sidebar from "react-sidebar";
        import styled from "../../typed-components";
        
        const Container = styled.div``;
        
        interface IProps {
          loading: boolean;
          isMenuOpen: boolean;
          toggleMenu: () => void;
        }
        
        const HomePresenter: React.SFC<IProps> = ({ 
          loading, 
          isMenuOpen, 
          toggleMenu 
        }) => (
          <Container>
            <Helmet>
              <title>Home | Nuber</title>
            </Helmet>
            <Sidebar
              sidebar={<Menu/>}
              open={isMenuOpen}
              onSetOpen={toggleMenu}
              styles={{
                sidebar: {
                  background: "white",
                  width: "80%",
                  zIndex: "10"
                }
              }}
            >
              {!loading && <button onClick={toggleMenu}>Open sidebar</button>}
            </Sidebar>
          </Container>
        )
        
        export default HomePresenter;

페이지를 처음 열때 query를 날려서 데이터를 가져온다. 근데 왠일인지 가져온 프로필 값을 사용하지 않는다. redux에 경우는 값을 가지면 state에 넣어서 하위 컴포넌트로 쭉쭉 넘겼는데, apollo에서는 직접 데이터를 사용하는 컴포넌트가 독립적으로 데이터를 가져오게 한다. 이렇게 하면 중복이 아니냐 하겠지만, apollo 캐시를 사용하기 때문에 괜찮다고 한다.

- src/components/Menu/MenuContainer.tsx

        import React from "react";
        import { Query } from "react-apollo";
        import { USER_PROFILE } from "../../sharedQueries.queries";
        import { userProfile } from "../../types/api";
        import MenuPresenter from "./MenuPresenter";
        
        class ProfileQuery extends Query<userProfile> {}
        
        class MenuContainer extends React.Component {
          public render() {
            return (
              <ProfileQuery query={USER_PROFILE}>
                {({ data, loading}) => <MenuPresenter data={data} loading={loading}/>}
              </ProfileQuery>
            )
          }
        }
        
        export default MenuContainer;

- src/components/Menu/MenuPresenterr.tsx

        import React from "react";
        import { Link } from "react-router-dom";
        import styled from "../../typed-components";
        import { userProfile } from "../../types/api";
        
        ...
        
        interface IProps {
          data?: userProfile;
          loading: boolean;
        }
        
        
        const MenuPresenter: React.SFC<IProps> = ({
          data: { GetMyProfile: { user = null } = {} } = { GetMyProfile: {}},
          loading
        }) => (
          <Container>
            {!loading &&
              user &&
              user.fullName && (
                <React.Fragment>
                  <Header>
                    <Grid>
                      <Link to={"/edit-account"}>
                        <Image
                          src={
                            user.profilePhoto ||
                            "https://lh3.googleusercontent.com/-CTwXMuZRaWw/AAAAAAAAAAI/AAAAAAAAAUg/8T5nFuIdnHE/photo.jpg"
                          }
                        />
                      </Link>
                      <Text>
                        <Name>{user.fullName}</Name>
                        <Rating>4.5</Rating>
                      </Text>
                    </Grid>
                  </Header>
                  <SLink to="/trips">Your Trips</SLink>
                  <SLink to="/settings">Settings</SLink>
                  <ToggleDriving isDriving={user.isDriving}>
                    {user.isDriving ? "Stop driving" : "Start driving"}
                  </ToggleDriving>
                </React.Fragment>
              )}
          </Container>
        );
        
        export default MenuPresenter;

![](_2019-05-16__2-b0144749-1153-4845-976e-531742b2578c.17.53.png)

데이터를 잘 가져왔다.

하다가 조금 문제가 있던 것이 크롬 도구 apollo에서 캐시된 쿼리 목록에 아무것도 안나오는 것이었다.

![](_2019-05-16__2-a711afac-8763-41c1-881d-683e3f5fb0fb.31.07.png)

강의에서는 cache에 쿼리가 들어있던데,,난 왜 안돼는지 모르겠다. 일단 network 탭에 보면 중복 쿼리는 보내지 않는 거같은데, 여간 찜찜하다.

## #2.34 Updating Driver Mode part One

메뉴 버튼에서 운전 상태를 확인할 수 있는데, 이번에는 운전 상태를 변경하도록 해보자.

- src/components/Menu/Menu.queries.ts

        import { gql } from "apollo-boost";
        
        export const TOGGLE_DRIVING = gql`
          mutation toggleDriving {
            ToggleDrivingMode {
              ok
              error
            }
          }
        `;

yarn codegen 한번 하고 위에서 작성한 쿼리를 추가해주자. 이렇게 여러 쿼리와 뮤테이션을 겹쳐서 사용하면 헷갈리는데 .. 잘 해보자.

- src/components/Menu/MenuContainer.ts

        import React from "react";
        import { Mutation, Query } from "react-apollo";
        import { USER_PROFILE } from "../../sharedQueries.queries";
        import { toggleDriving, userProfile } from "../../types/api";
        import { TOGGLE_DRIVING } from "./Menu.queries";
        import MenuPresenter from "./MenuPresenter";
        
        class ProfileQuery extends Query<userProfile> {}
        class ToggleDrivingMutation extends Mutation<toggleDriving> {}
        
        class MenuContainer extends React.Component {
          public render() {
            return (
              <ToggleDrivingMutation
                mutation={TOGGLE_DRIVING}
              >
                {toggleDrivingMutation => (
                  <ProfileQuery query={USER_PROFILE}>
                    {({ data, loading}) => (
                      <MenuPresenter 
                        data={data} 
                        loading={loading}
                        ToggleDrivingMutation={toggleDrivingMutation}
                      />
                    )}
                  </ProfileQuery>
                )}
              </ToggleDrivingMutation>
              
            )
          }
        }
        
        export default MenuContainer;

- src/components/Menu/MenuPresenter.ts

        import React from "react";
        import { MutationFn } from "react-apollo";
        import { Link } from "react-router-dom";
        import styled from "../../typed-components";
        import { toggleDriving, userProfile } from "../../types/api";
        
        
        
        interface IProps {
          data?: userProfile;
          loading: boolean;
          ToggleDrivingMutation: MutationFn<toggleDriving>;
        }
        
        ...
        
        const MenuPresenter: React.SFC<IProps> = ({
          data: { GetMyProfile: { user = null } = {} } = { GetMyProfile: {}},
          loading,
          ToggleDrivingMutation
        }) => (
          <Container>
            {!loading &&
              user &&
              user.fullName && (
                <React.Fragment>
                  <Header>
                    <Grid>
                      <Link to={"/edit-account"}>
                        <Image
                          src={
                            user.profilePhoto ||
                            "https://lh3.googleusercontent.com/-CTwXMuZRaWw/AAAAAAAAAAI/AAAAAAAAAUg/8T5nFuIdnHE/photo.jpg"
                          }
                        />
                      </Link>
                      <Text>
                        <Name>{user.fullName}</Name>
                        <Rating>4.5</Rating>
                      </Text>
                    </Grid>
                  </Header>
                  <SLink to="/trips">Your Trips</SLink>
                  <SLink to="/settings">Settings</SLink>
                  <ToggleDriving onClick={() => ToggleDrivingMutation()} isDriving={user.isDriving}>
                    {user.isDriving ? "Stop driving" : "Start driving"}
                  </ToggleDriving>
                </React.Fragment>
              )}
          </Container>
        );
        
        export default MenuPresenter;

이렇게 해놓고 앱을 켠 후 Start Driving 토글 버튼을 누른후 새로고침하면 토글이 정상적으로 된다.

새로고침 없이 바로 반영하는 멋진것을 소개 한다.

- src/components/Menu/MenuContainer.tsx  Mutation에 refetchQueries를 줄 수 있다. 여기에는 배열이기 때문에 여러 쿼리도 넣을 수 있다.

        ...
        
        			<ToggleDrivingMutation
                mutation={TOGGLE_DRIVING}
                refetchQueries={[{query: USER_PROFILE}]}
              >
        
        ...

## #2.35 Updating Driver Mode part Two

이번에는 위에서 작성한 같은 토글 기능을 구현하지만 apollo cache 값만 수정하여 서버와의 api 및 db 연산을 줄일수 있도록 해보자. (토글을 하고 서버에 가야 다른 유저들도 운전중이구나 아니구나 판단할텐데...?)

- src/components/Menu/MenuContainer.tsx

        ...
        
        			<ToggleDrivingMutation
                mutation={TOGGLE_DRIVING}
                update={(cache, { data }) => {
                  console.log(data)
                  console.log(cache.readQuery({ query: USER_PROFILE}))
                }}
              >
        
        ...

refetchQuries는 지우고 update 에 저렇게 작성해서 실행해 해보면, data에는 ToggleDrivingMutation에서 호출한 Muation 에 대한 정보가 들어 있다.

또, cache는 apollo cache에 접근할 수 있는 모듈이 제공한다. 마치 orm 처럼 데이터를 가져올 수 있는 형태다.

![](_2019-05-16__3-aa421541-2faa-4555-bb80-23496e615d85.36.12.png)

- src/components/Menu/MenuContainer.tsx  코드가 길어졌지만, 어쩃든 캐시를 조작할 수 있다.

        import React from "react";
        import { Mutation, Query } from "react-apollo";
        import { toast } from "react-toastify";
        import { USER_PROFILE } from "../../sharedQueries.queries";
        import { toggleDriving, userProfile } from "../../types/api";
        import { TOGGLE_DRIVING } from "./Menu.queries";
        import MenuPresenter from "./MenuPresenter";
        
        class ProfileQuery extends Query<userProfile> {}
        class ToggleDrivingMutation extends Mutation<toggleDriving> {}
        
        class MenuContainer extends React.Component {
          public render() {
            return (
              <ToggleDrivingMutation
                mutation={TOGGLE_DRIVING}
                update={(cache, { data }) => {
                  if(!data) {
                    return;
                  }
                  const { ToggleDrivingMode } = data;
                  if (!ToggleDrivingMode.ok) {
                    toast.error(ToggleDrivingMode.error);
                    return;
                  }
                  const query: userProfile | null = cache.readQuery({
                    query: USER_PROFILE
                  });
                  if(!query) {
                    return;
                  }
                  const {
                    GetMyProfile: { user }
                  } = query;
        
                  if(user) {
                    user.isDriving = !user.isDriving;
                    cache.writeQuery({ query: USER_PROFILE, data: query });
                  }
                }}
              >
        ...