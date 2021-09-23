---
title: 25 우버 클론 코딩 (nomad coders)
date: '2019-06-10T08:56:56.243Z'
description: 우버 코딩 강의 로그 2.41 ~ 2.43
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

## #2.41 Settings Screen part One

설정창에는 로그아웃 버튼이라든가 내가 저장한 장소 같은 내용들이 있다.

Settings 페이지 디자인은 니콜라스가 해뒀다. Place 컴포넌트를 만들자.

- src/components/Place/Place.tsx

        import React from "react";
        import styled from "../../typed-components";
        
        const Place = styled.div`
          margin: 15px 0;
          display: flex;
          align-items: center;
          & i {
            font-size: 12px;
          }
        `;
        
        const Container = styled.div`
          margin-left: 10px;
        `;
        
        const Name = styled.span`
          display: block;
        `;
        
        const Icon = styled.span`
          cursor: pointer;
        `;
        
        const Address = styled.span`
          color: ${props => props.theme.greyColor};
          font-size: 14px;
        `;
        
        interface IProps {
          fav: boolean;
          name: string;
          address: string;
        	id: number;
        }
        
        const PlacePresenter: React.SFC<IProps> = ({ fav, name, address }) => (
          <Place>
            <Icon>{fav ? "★" : "✩" }</Icon>
            <Container>
              <Name>{name}</Name>
              <Address>{address}</Address>
            </Container>
          </Place>
        );
        
        export default PlacePresenter;

- src/components/Place/index.ts

        export { default } from "./Place";

setting 페이지에서는 로그아웃 기능이 있다. logout에 대한 쿼리를 공통 query 추가하자.

- src/innerQueries.ts

        ...
        
        export const LOG_USER_OUT = gql`
          mutation logUserOut {
            logUserOut @client
          }
        `;

- src/routes/Settings/SettingsPresenter.tsx

        import Header from "components/Header";
        import Place from "components/Place";
        import React from "react";
        import { MutationFn } from "react-apollo";
        import Helmet from "react-helmet";
        import { Link } from "react-router-dom";
        import styled from "../../typed-components";
        import { userProfile } from "../../types/api";
        
        const Container = styled.div`
          padding: 0px 40px;
        `;
        
        const Image = styled.img`
          height: 60px;
          width: 60px;
          border-radius: 50%;
        `;
        
        const GridLink = styled(Link)`
          display: grid;
          grid-template-columns: 1fr 4fr;
          grid-gap: 10px;
          margin-bottom: 10px;
        `;
        
        const Keys = styled.div``;
        
        const Key = styled.span`
          display: block;
          cursor: pointer;
        `;
        
        const FakeLink = styled.span`
          text-decoration: underline;
          cursor: pointer;
        `;
        
        const StyledLink = styled(Link)`
          display: block;
          text-decoration: underline;
          margin: 20px 0;
        `;
        
        interface IProps {
          logUserOut: MutationFn;
          userData?: userProfile;
          userDataLoading: boolean;
        }
        
        const SettingsPresenter: React.SFC<IProps> = ({
          logUserOut,
          userData: { GetMyProfile: { user = null } = {} }= { GetMyProfile: {} },
          userDataLoading
        }) => (
          <React.Fragment>
            <Helmet> 
              <title>Settings | Nuber</title>
            </Helmet>
            <Header title="Account Settings" backTo="/"/>
            <Container>
              <GridLink to="/edit-account">
                {!userDataLoading &&
                  user &&
                  user.profilePhoto &&
                  user.email &&
                  user.fullName && (
                    <React.Fragment>
                      <Image src={user.profilePhoto}/>
                      <Keys> 
                        <Key>{user.fullName}</Key>
                        <Key>{user.email}</Key>
                      </Keys>
                    </React.Fragment>
                  )
                }
              </GridLink>
              <Place fav={false} name="Home" address="123321313" id={123}/>
              <Place fav={false} name="Home" address="123321313" id={122}/>
              <Place fav={false} name="Home" address="123321313" id={1}/>
              <Place fav={false} name="Home" address="123321313" id={13}/>
              <StyledLink to ="/places">Go to Places</StyledLink>
              <FakeLink onClick={() => logUserOut}>Log Out</FakeLink>
            </Container>
          </React.Fragment>
        );
        
        export default SettingsPresenter;

- src/routes/Settings/SettingsContainer.tsx

        import React from "react";
        import { Mutation, Query } from "react-apollo";
        import { LOG_USER_OUT } from "../../innerQueries";
        import { USER_PROFILE } from "../../sharedQueries.queries";
        import { userProfile } from "../../types/api";
        import SettingsPresenter from './SettingsPresenter';
        
        class MiniProfileQuery extends Query<userProfile> {}
        
        class SettingsContainer extends React.Component {
          public render() {
            return (
              <Mutation mutation={LOG_USER_OUT}>
                {logUserOut => (
                  <MiniProfileQuery query={USER_PROFILE}>
                    {({ data, loading: userDataLoading }) => {
                      return (
                        <SettingsPresenter
                          userDataLoading={userDataLoading}
                          userData={data}
                          logUserOut={logUserOut}
                        />
                      )
                    }}
                  </MiniProfileQuery>
                )}
              </Mutation>
            )
          }
        }
        
        export default SettingsContainer;

조금씩 반복이 된다. 데이터를 가져오는 queries, 뭔가 변경하는 mutation, 이것들을 중첩 시켜서 컴포넌트로 만드는 구조..

## #2.42 Settings Screen part Two

지금 settings 페이지에 장소를 하드 코딩 해두었는데, 쿼리로 데이터를 가져와서 그리도록 하자. 

이미 하나의 쿼리와 하나의 뮤테이션이 이미 존재하지만, 여기서 쿼리가 하나 더 추가가 된다. 이런 중복 구조를 계속 반복 한다.

- src/sharedQueries.queries.ts  GET_PLACES 쿼리를 추가하자.

        ...
        
        export const GET_PLACES = gql`
          query getPlaces {
            GetMyPlaces {
              ok
              error
              places {
                id
                name
                address
                isFav
              }
            }
          }
        `;

yarn codegen 으로 쿼리를 생성하고

- src/routes/Settings/SettingsContainer.tsx   GetMyPlaces 쿼리를 호출 하여 presenter로 데이터를 넘기자. Presenter는 가장 안쪽에 위치할 것이다. 생각해보니, user_profile이랑 places랑 합쳐서 가져오며 안되나..

        import React from "react";
        import { Mutation, Query } from "react-apollo";
        import { LOG_USER_OUT } from "../../innerQueries";
        import { GET_PLACES, USER_PROFILE } from "../../sharedQueries.queries";
        import { getPlaces, userProfile } from "../../types/api";
        import SettingsPresenter from './SettingsPresenter';
        
        class MiniProfileQuery extends Query<userProfile> {}
        class PlacesQuery extends Query<getPlaces> {}
        
        class SettingsContainer extends React.Component {
          public render() {
            return (
              <Mutation mutation={LOG_USER_OUT}>
                {logUserOut => (
                  <MiniProfileQuery query={USER_PROFILE}>
                    {
                      ({ data, loading: userDataLoading }) => (
                        <PlacesQuery query={GET_PLACES}>
                          {({ data: placesData, loading: placesLoading }) => (
                            <SettingsPresenter
                              userDataLoading={userDataLoading}
                              userData={data}
                              placesLoading={placesLoading}
                              placesData={placesData}
                              logUserOut={logUserOut}
                            />
                          )}
                        </PlacesQuery>
                      )
                    }
                  </MiniProfileQuery>
                )}
              </Mutation>
            )
          }
        }
        
        export default SettingsContainer;

- src/routes/Settings/SettingsPresenter.tsx

        ...
        import styled from ../../typed-components";
        import { getPlaces, userProfile } from "../../types/api";
        
        ...
        
        interface IProps {
          logUserOut: MutationFn;
          userData?: userProfile;
          userDataLoading: boolean;
          placesData?: getPlaces;
          placesLoading: boolean;
        }
        
        const SettingsPresenter: React.SFC<IProps> = ({
          logUserOut,
          userData: { GetMyProfile: { user = null } = {} }= { GetMyProfile: {} },
          placesData: { GetMyPlaces: { places = null } = {} } = { GetMyPlaces: {} },
          userDataLoading,
          placesLoading
        }) => (
        
        ...
              </GridLink>
              {!placesLoading &&
                places &&
                places.map(place => (
                  <Place 
                    key={place!.id}
                    name={place!.name} 
                    address={place!.address}
                    fav={place!.isFav} 
        						id={place!.id}
                  />
                ))
              }
              <StyledLink to ="/places">Go to Places</StyledLink>
        ...

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952574/tlog/_2019-06-10__6-8fae4330-940c-4659-99e5-4d44d07457a9.04.37_nq4m5y.png)

이제 하드 코딩이 아닌 입력한 장소가 보일 것이다.

## #2.43 Places + AddPlace Components

이번에는 단순히 두 개으 뷰 페이지를 생성한다. 니콜라스도 별 다른 강의 없이 뷰만 생성했다.

- src/routes/AddPlace/AddPlace.queries.ts

        import { gql } from "apollo-boost";
        
        export const ADD_PLACE = gql``;

- src/routes/AddPlace/AddPlacePresenter.tsx

        import Button from "components/Button";
        import Form from "components/Form";
        import Header from "components/Header";
        import Input from "components/Input";
        import React from "react";
        import Helmet from "react-helmet";
        import { Link } from "react-router-dom";
        import styled from "../../typed-components";
        
        const Container = styled.div`
          padding: 0 40px;
        `;
        
        const ExtendedInput = styled(Input)`
          margin-bottom: 40px;
        `;
        
        const ExtendedLink = styled(Link)`
          display: block;
          text-decoration: underline;
          margin-bottom: 20px;
        `;
        
        interface IProps {
          address: string;
          name: string;
          onInputChange: React.ChangeEventHandler<HTMLInputElement>;
          loading: boolean;
        }
        
        const AddPlacePresenter: React.SFC<IProps> = ({
          onInputChange,
          address,
          name,
          loading
        }) => (
          <React.Fragment>
            <Helmet>
              <title>Add Place | Nuber</title>
            </Helmet>
            <Header title="Add Place" backTo="/"/>
            <Container>
              <Form submitFn={() => {}}>
                <ExtendedInput
                  placeholder="Name"
                  type="text"
                  onChange={onInputChange}
                  value={name}
                  name="name"
                />
                <ExtendedInput
                  placeholder="Address"
                  type="text"
                  onChange={onInputChange}
                  value={address}
                  name="address"
                />
                <ExtendedLink to="/find-address">Pick place from map</ExtendedLink>
                <Button onClick={() => {}} value={loading ? "Adding place" : "Add Place"}/>
              </Form>
            </Container>
          </React.Fragment>
        );
        
        export default AddPlacePresenter;

- src/routes/AddPlace/AddPlaceContainer.tsx

        import React from "react";
        import { RouteComponentProps } from "react-router-dom";
        import AddPlacePresenter from "./AddPlacePresenter";
        
        interface IState {
          address: string;
          name: string;
        }
        
        interface IProps extends RouteComponentProps<any> {}
        
        class AddPlaceContainer extends React.Component<IProps, IState> {
          public state = {
            address: "",
            name: ""
          }
        
          public render() {
            const { address, name } = this.state;
            return (
              <AddPlacePresenter
                onInputChange={this.onInputChange}
                address={address}
                name={name}
                loading={false}
              />
            )
          }
        
          public onInputChange: React.ChangeEventHandler<
            HTMLInputElement
          > = async event => {
            const {
              target: { name, value }
            } = event;
            this.setState({
              [name]: value
            } as any);
          }
        }
        
        export default AddPlaceContainer;

- src/routes/AddPlace/index.ts

        export { default } from "./AddPlaceContainer";

yarn codegen을 한 후 서버를 띄우고 

[http://localhost:3000/add-place](http://localhost:3000/add-place) 페이지가 잘 뜨는지 확인 하자. 입력은 되지만 Add place 버튼을 누르면 작동을 하지 않는다.

이어서 places 페이지를 만들자.

- src/routes/Places/PlacesPresenter.tsx

        import Header from "components/Header";
        import Place from "components/Place";
        import React from "react";
        import Helmet from "react-helmet";
        import { Link } from "react-router-dom";
        import styled from "../../typed-components";
        import { getPlaces } from "../../types/api";
        
        const Container = styled.div`
          padding: 0 40px;
        `;
        
        const SLink = styled(Link)`
          text-decoration: underline;
        `;
        
        interface IProps {
          data?: getPlaces;
          loading: boolean;
        }
        
        const PlacesPresenter: React.SFC<IProps> = ({
          data: { GetMyPlaces: { places = null } = {} } = { GetMyPlaces: {} },
          loading
        }) => (
          <React.Fragment>
            <Helmet>
              <title>Places | Nuber</title>
            </Helmet>
            <Header title="Places" backTo="/"/>
            <Container>
              {!loading &&
                places &&
                places.length === 0 
                ? "You have no Places"
                : places && places!.map(place => <Place
                  key={place!.id}
                  fav={place!.isFav}
                  name={place!.name}
                  address={place!.address}
        					id={place!.id}
                />)
              }
              <SLink to="/add-place">Place add some places!</SLink>
            </Container>
          </React.Fragment>
        )
        
        export default PlacesPresenter;

- src/routes/Places/PlacesContainer.tsx

        import React from "react";
        import { Query } from "react-apollo";
        import { GET_PLACES } from "../../sharedQueries.queries";
        import { getPlaces } from "../../types/api";
        import PlacesPresenter from "./PlacesPresenter";
        
        class PlacesQuery extends Query<getPlaces> {}
        
        class PlacesContainer extends React.Component {
          public render() {
            return (
              <PlacesQuery query={GET_PLACES}>
                {({ data, loading }) => (
                  <PlacesPresenter data={data} loading={loading} />
                )}
              </PlacesQuery>
            )
          }
        }
        
        export default PlacesContainer;

- src/routes/Places/index.ts

        export { default } from "./PlacesContainer";

[http://localhost:3000/places](http://localhost:3000/add-place) 페이지가 잘 뜨는지 확인 하자. 

아직은 단순히 보여주기만 하지만 즐겨찾기(✩) 를 처리해야 한다.