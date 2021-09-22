---
title: 34 우버 클론 코딩 (nomad coders)
date: '2019-07-02T08:56:56.243Z'
description: 우버 코딩 강의 로그 2.70 ~ 2.74
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1632302785/tlog/cover/nuber_clone_nllng2.jpg'
tags:
  - 'Clone Coding'
  - 'Nomad Coder'
  - GraphQL
---
# 

이 포스트는 nomad coders의 우버 클론 코딩 시리즈를 듣고 정리한 글 입니다.

[https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course](https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course)

## #2.70 Apollo Subscriptions part One

이전에는 요청한 ride를 쿼리로 날려서 가져오도록 했고, 이번에는 ride를 subscribe 해서 실시간으로 요청된 ride를 운전자가 받아 볼 수 있도록 하자.

먼저 subscribtion을 정의하자.

- src/routes/Home/Home.quries.ts     `SUBSCRIBE_NEARBY_RIDE` subscription을 작성했고, yarn codgen으로 타입을 생성하자.

        ...
        export const SUBSCRIBE_NEARBY_RIDE = gql`
          subscription nearbyRides {
            NearbyRideSubscription {
              id
              pickUpAddress
              dropOffAddress
              price
              distance
              passenger {
                fullName
                profilePhoto
              }
            }
          }
        `;

<Query>(HOC) 가 리턴하는 값을 살펴보면 subscription에 관련된 함수가 있다. 우리는 아래처럼 간단히 data만 꺼내서 사용하도록 했지만 Query의 리턴되는 결과에는 각종 동작을 제어하는 함수들이 있는 것을 확인할 수 있다. 우리는 이중 `subscribeToMore` 를 사용하여 subscription을 구현할 것이다.

- src/routes/Home/HomeContainer.tsx     잠깐 아래처럼 코드를 변경하고 query에서 반환하는 객체 전체를 살펴보자.

        										{(getRides) => (console.log(getRides),
                              <AcceptRide mutation={ACCEPT_RIDE}>
                                {acceptRideMutation => (
                                  <HomePresenter 
                                    loading={profileLoading}
                                    isMenuOpen={isMenuOpen} 
                                    toggleMenu={this.toggleMenu}
                                    mapRef={this.mapRef}
                                    toAddress={toAddress}
                                    onInputChange={this.onInputChange}
                                    onAddressSubmit={this.onAddressSubmit}
                                    price={price}
                                    data={data}
                                    nearbyRide={nearbyRide}
                                    requestRideMutation={requestRideMutation}
                                    acceptRideMutation={acceptRideMutation}
                                  />
                                )}
                              </AcceptRide>
                            )}

    ![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952573/tlog/_2019-06-03__5-4896b007-2218-4010-8ba7-6de66efdb880.24.37_pnwkpb.png)

운전자에 콘솔을 보면 `subscribeToMore` 객체가 있는 것을 확인할 수 있다. 이제 다시 위 코드를 원복하자.

- src/routes/Home/HomeContainer.tsx    위에서 정의한 subscription을 넣어 주자. 이번엔 subscription 해서 콘솔로 간단히 출력을 하도록 하자.

        import { SubscribeToMoreOptions } from 'apollo-client';
        import { getCode, reverseGeoCode } from "lib/mapHelpers";
        ...
        import { 
          ...
          SUBSCRIBE_NEARBY_RIDE,
        } from './Home.queries';
        
        ...
                    
                        {requestRideMutation => (
                          <GetNearbyRides query={GET_NEARBY_RIDE} skip={!isDriving}>
                            {({ subscribeToMore, data: nearbyRide }) => {
                              const rideSubscriptionOptions: SubscribeToMoreOptions = {
                                document: SUBSCRIBE_NEARBY_RIDE,
                                updateQuery: (prev, result) => {
                                  console.log(prev);
                                  console.log(result);
                                }
                              };
                              subscribeToMore(rideSubscriptionOptions);
                              return (
                                <AcceptRide mutation={ACCEPT_RIDE}>
                                  {acceptRideMutation => (
                                    <HomePresenter 
                                      loading={profileLoading}
                                      isMenuOpen={isMenuOpen} 
                                      toggleMenu={this.toggleMenu}
                                      mapRef={this.mapRef}
                                      toAddress={toAddress}
                                      onInputChange={this.onInputChange}
                                      onAddressSubmit={this.onAddressSubmit}
                                      price={price}
                                      data={data}
                                      nearbyRide={nearbyRide}
                                      requestRideMutation={requestRideMutation}
                                      acceptRideMutation={acceptRideMutation}
                                    />
                                  )}
                                </AcceptRide>
                              )}
                            }
                          </GetNearbyRides>
          ...

자 이제, 기존 ride와 유저의 isRiding을 초기화 하고 새로운 ride를 요청해보자.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952573/tlog/_2019-06-03__5-750c8d48-5ef9-46bb-8cfb-52414fe401ff.40.22_bartji.png)

콘솔에 첫번째 인자(prev)와 두번째 인자(result)를 출력하게 했고 결과는 아래와 같다. `prev`는 이전에 받은 값이라면, `result` 는 새로 얻은 값이다.

> 지금 확인해보면 콘솔에 결과가 8개가 뜰 것이다. 이건 graphql-yoga의 버그라고 한다. 그래서 이전에 니콜라스가 실 서비스에는 다른것을 사용한다고 한 적 있다.

## #2.71 Apollo Subscriptions part Two

이전 강좌에서 `prev`, `result` 에 들어 있는 값을 살펴봤다. #2.70 마지막에 첨부된 사진을 보면 prev에는 

`rideSubscriptionOptions` 의 리턴 값은 prev의 형태를 유지해야 한다. (GetNearbyRide의 응답 형태인 GetNearbyRideResponse의 형태를 유지해줘야 하기 때문)

그래서 prev의 ride가 비어있기 때문에 `result` 에서 ride의 값만 빼서 prev에 합쳐주자. `result` 에 값이 없다면 prev를 그대로 리턴하자.

- src/routes/Home/HomeContainer.tsx

        
         ...
                        {requestRideMutation => (
                          <GetNearbyRides query={GET_NEARBY_RIDE} skip={!isDriving}>
                            {({ subscribeToMore, data: nearbyRide }) => {
                              const rideSubscriptionOptions: SubscribeToMoreOptions = {
                                document: SUBSCRIBE_NEARBY_RIDE,
                                updateQuery: (prev, { subscriptionData }) => {
                                  if(!subscriptionData.data) {
                                    return prev;
                                  }
                                  const updateData = Object.assign({}, prev, {
                                    GetNearbyRide: {
                                      ...prev.GetNearbyRide,
                                      ride: subscriptionData.data.NearbyRideSubscription
                                    }
                                  })
                                  return updateData;
                                }
                              };
           ...

이렇게 작성 한 후 요청한 ride를 db에서 제거 하고 다시 운전자를 드라이브 모드로 두자.

사용자가 ride를 요청하면 실시간으로 운전자 창에 ride가 뜨는 것을 확인 할 수있다.

## #2.72 Ride Screen part One

탑승자가 Ride 리퀘스트를 보내고, 운전자가 Ride를 ACCEPT 하면 Ride 페이지로 이동 되서 채팅이나 운전자 또는 탑승자 정보를 볼 수 있어야 한다. 그래서 간단히 이번에는 Ride페이지를 생성하고 사용자가 Ride 요청을 생성하거나 운전자가 Ride를 승인할 때 Ride 페이지로 리다이렉트 하도록 처리를 했다.

일단 페이지부터 만들자.

- src/routes/Ride/RideContainer.tsx

        import React from 'react';
        import RidePrsenter from './RidePresenter';
        
        class RideContainer extends React.Component {
          public render() {
            return <RidePrsenter/>;
          }
        }
        
        export default RideContainer;

- src/routes/Ride/RidePresenter.tsx

        import React from 'react';
        import styled from '../../typed-components';
        
        const Container = styled.div``;
        
        const RidePresenter: React.SFC = () => <Container>Chat</Container>
        
        export default RidePresenter;

- src/routes/Ride/index.ts

        export { default } from './RideContainer';

그리고 Ride 페이지에는 특정 Ride에 대한 페이지가 되어야 하기 때문에 라우팅을 조금 수정했다.

- src/components/App/AppPresenter.tsx

        ...
            <Route path={"/ride/:rideId"} exact={true} component={Ride}/>
        ...

- src/routes/Home/HomeContainer.tsx      사용자는 `handleRideRequest` 에서 Ride를 요청 하면 Ride페이지로 이동시키고, 운전자는 승인 Mutation을 실행하고 `onCompleted` 될 때 `handleRideAcceptance` 안쪽에서 성공되면 리다이렉트 되도록 처리 했다.

        ...
          <AcceptRide 
            mutation={ACCEPT_RIDE}
            onCompleted={this.handleRideAcceptance}
          >
        ...
          public handleRideRequest = (data: requestRide) => {
            const { history } = this.props;
            const { RequestRide } = data;
            if (RequestRide.ok) {
              toast.success("Drive requested, finding a driver");
              history.push(`/ride/${RequestRide.ride!.id}`);
            } else {
              toast.error(RequestRide.error);
            }
          };
        
        ...
        
          public handleRideAcceptance = (data: acceptRide) => {
            const { history } = this.props;
            const { UpdateRideStatus } = data;
            if (UpdateRideStatus.ok) {
              history.push(`/ride/${UpdateRideStatus.rideId}`);
            }
          }
        };
        ...

## #2.73 Get Ride Query part One

운전자와 사용자가 리다이렉트 되는 ride 페이지는 Chat란 글자만 있고 어떤 데이터도 없다. getRide를 통해 운전자와 탑승자의 정보 그리고 chatId를 가져와서 데이터를 뿌려줘야 한다. 우선 query 작성해서 페이지 넣는 것부터 하자.

- src/routes/Ride/Ride.queries.ts   GET_RIDE를 작성했고, 이번엔 passenger와 driver의 정보를 포함 시켰다.

        import { gql } from 'apollo-boost';
        
        export const GET_RIDE = gql`
          query getRide($rideId: Int!) {
            GetRide(rideId: $rideId) {
              ok
              error
              ride {
        				id
                status
                pickUpAddress
                dropOffAddress
                price
                distance
                duration
                driver {
        					id
                  fullName
                  profilePhoto
                }
                passenger {
        					id
                  fullName
                  profilePhoto
                }
                chatId
              }
            }
          }
        `;

- src/routes/Ride/RideContainer.ts

        import React from 'react';
        import { Query } from 'react-apollo';
        import { RouteComponentProps } from 'react-router-dom';
        import { getRide, getRideVariables } from '../../types/api';
        import { GET_RIDE } from './Ride.queries';
        import RidePresenter from './RidePresenter';
        
        class RideQuery extends Query<getRide, getRideVariables> {}
        
        interface IProps extends RouteComponentProps<any> {}
        
        class RideContainer extends React.Component<IProps> {
          constructor(props) {
            super(props);
            const {
              match: {
                params: { rideId }
              },
              history
            } = this.props;
            if(!rideId || !parseInt(rideId, 10)) {
              history.push('/')
            }
          }
          public render() {
            const {
              match: {
                params: { rideId }
              },
            } = this.props;
            
            return (
              <RideQuery query={GET_RIDE} variables={{ rideId: parseInt(rideId, 10) }}>
                {({ data: rideData }) => (
                  <RidePresenter rideData={rideData}/>
                )}
              </RideQuery>
            )
          }
        }
        
        export default RideContainer;

- src/routes/Ride/RidePresenter.ts

        import Button from 'components/Button';
        import React from 'react';
        import styled from '../../typed-components';
        import { getRide } from '../../types/api';
        
        const defaultProfile = "https://user-images.githubusercontent.com/11402468/58876263-7ee5fa80-8708-11e9-8eb7-b5ef5f2966d0.jpeg";
        
        const Container = styled.div`
          padding: 40px;
        `;
        
        const Title = styled.h4`
          font-weight: 800;
          margin-top: 30px;
          margin-bottom: 10px;
          &:first-child {
            margin-top: 0;
          }
        `;
        
        const Data = styled.span`
          color: ${props => props.theme.blueColor};
        `;
        
        const Img = styled.img`
          border-radius: 50%;
          margin-right: 20px;
          max-width: 50px;
          height: 50px;
        `;
        
        const Passenger = styled.div`
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        `;
        
        const Buttons = styled.div`
          margin: 30px 0px;
        `;
        
        const ExtendedButton = styled(Button)`
          margin-bottom: 30px;
        `;
        
        interface IProps {
          rideData?: getRide;
        }
        
        const RidePresenter: React.SFC<IProps> = ({
          rideData: { GetRide: { ride = null } = {} } = { GetRide: { ride: null}},
        }) => (
          <Container>
            {ride && (
                <React.Fragment>
                  <Title>Passenger</Title>
                  {ride.passenger && (
                    <Passenger>
                      <Img src={ride.passenger.profilePhoto || defaultProfile} />
                      <Data>{ride.passenger.fullName}</Data>
                    </Passenger>
                  )}
                  {ride.driver && (
                    <React.Fragment>
                      <Title>Driver</Title>
                      <Passenger>
                        <Img src={ride.driver.profilePhoto || defaultProfile} />
                        <Data>{ride.driver.fullName}</Data>
                      </Passenger>
                    </React.Fragment>
                  )}
                  <Title>From</Title>
                  <Data>{ride.pickUpAddress}</Data>
                  <Title>To</Title>
                  <Data>{ride.dropOffAddress}</Data>
                  <Title>Price</Title>
                  <Data>{ride.price}</Data>
                  <Title>Distance</Title>
                  <Data>{ride.distance}</Data>
                  <Title>Duration</Title>
                  <Data>{ride.duration}</Data>
                  <Title>Status</Title>
                  <Data>{ride.status}</Data>
                  <Buttons>
                    <ExtendedButton
                      value={"Picked Up"}
                      onClick={() =>""}
                    />
                  </Buttons>
                </React.Fragment>
              )}
          </Container>
        );
        
        export default RidePresenter;

RideContainer는 내가 임의로 코드를 좀 변경했는데  rideId가 string으로 날아가서 서버에서 문제가 발생했다. 그래서 나는 Int로 파싱해서 날리도록 했다.

결과는 다음처럼 승객과 운전자 정보 그리고 ride 정보를 나타내주면 끝이다. (승객쪽에는 ride 페이지로 이동 후 이상이 있을 수 있다. 운전자가 ACCEPT 하고 승객쪽에서 새로고침 하면 정상적으로 보인다.)

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952573/tlog/_2019-06-04__1-51b685f9-739c-4c03-86da-12d22c34defd.45.54_eu3ycf.png)

## #2.74 Get Ride Query part Two

이 다음 진행할 것은 내용은 많다. 우선 ride 페이지에서는 단계에 따라 ride의 status가 변하는데, 이 값을 업데이트 할 수 있어야 한다. 그리고 둘 째로, ride 변경되는 상태를 subscription 해야 한다. 

먼저 Ride의 status를 변경하는  mutation을 먼저 만들어보자.

- schema.json     다음은 자동으로 생성되는 코드의 일부분이다. 우리가 서버에 다음의 상태로 status를 정의했다. `FINISHED`, `CANCELED` , `ONROUTE` 는 우리가 아직 사용하지 않은 status값이다. 어쨋든 우리가 `StatusOptions` 라는 값을 사용해서 변경한다는 것을 기억하자.

        ...
        {
                "kind": "ENUM",
                "name": "StatusOptions",
                "description": "",
                "fields": null,
                "inputFields": null,
                "interfaces": null,
                "enumValues": [
                  {
                    "name": "ACCEPTED",
                    "description": "",
                    "isDeprecated": false,
                    "deprecationReason": null
                  },
                  {
                    "name": "FINISHED",
                    "description": "",
                    "isDeprecated": false,
                    "deprecationReason": null
                  },
                  {
                    "name": "CANCELED",
                    "description": "",
                    "isDeprecated": false,
                    "deprecationReason": null
                  },
                  {
                    "name": "REQUESTING",
                    "description": "",
                    "isDeprecated": false,
                    "deprecationReason": null
                  },
                  {
                    "name": "ONROUTE",
                    "description": "",
                    "isDeprecated": false,
                    "deprecationReason": null
                  }
                ],
                "possibleTypes": null
              }
        ...

- src/routes/Ride/Ride.queries.ts      `UPDATE_RIDE_STATUS` 를 작성했고 status는 `StatusOptions`를 사용한 것을 확인할 수 있다. yarn codegen 으로 타입을 생성하자.

        ...
        export const UPDATE_RIDE_STATUS = gql`
          mutation updateRide($rideId: Int!, $status: StatusOptions!) {
            UpdateRideStatus(rideId: $rideId, status: $status) {
              ok
              error
              rideId
            }
          }
        `;

Ride 페이지 또한 운전자만 사용할 수 있는 버튼이 있다. 운행에 대한 상태인 status 값을 변경할 수 있게 해야 한다. 그래서 페이지에 들어가면 [`ride.diriver.id](http://ride.diriver.id) === [user.id](http://user.id)` 비교하여 유저가 운전자인지 탑승자인지 판단해줘야 한다. 그러기 위해선 Container 에서 유저 정보를 넘겨줘야 한다.

- src/routes/Ride/RideContainer.tsx       `ProfileQuery` 와 `RideUpdate` 를 정의했다.

    처음으로 `refetchQueries`  에 인자를 넘긴 query를 사용했다. 

        import React from 'react';
        import { Mutation, Query } from 'react-apollo';
        import { RouteComponentProps } from 'react-router-dom';
        import { USER_PROFILE } from '../../sharedQueries.queries';
        import { 
          getRide, 
          getRideVariables, 
          updateRide,
          updateRideVariables,
          userProfile 
        } from '../../types/api';
        import { GET_RIDE, UPDATE_RIDE_STATUS } from './Ride.queries';
        import RidePresenter from './RidePresenter';
        
        class RideQuery extends Query<getRide, getRideVariables> {}
        class ProfileQuery extends Query<userProfile> {}
        class RideUpdate extends Mutation<updateRide, updateRideVariables> {}
        
        interface IProps extends RouteComponentProps<any> {}
        
        class RideContainer extends React.Component<IProps> {
          constructor(props) {
            super(props);
            const {
              match: {
                params: { rideId }
              },
              history
            } = this.props;
            if(!rideId || !parseInt(rideId, 10)) {
              history.push('/')
            }
          }
          public render() {
            const {
              match: {
                params: { rideId }
              },
            } = this.props;
            
            return (
              <ProfileQuery query={USER_PROFILE}>
                {({ data: userData }) => (
                  <RideQuery query={GET_RIDE} variables={{ rideId: parseInt(rideId, 10) }}>
                    {({ data: rideData }) => (
                      <RideUpdate 
                        mutation={UPDATE_RIDE_STATUS}
                        refetchQueries={[{ query: GET_RIDE , variables: { rideId: parseInt(rideId, 10) }}]}
                      >
                        {updateRideMutation => (
                          <RidePresenter 
                            rideData={rideData}
                            userData={userData}
                            updateRideMutation={updateRideMutation}
                          />
                        )}
                      </RideUpdate>
                      
                    )}
                  </RideQuery>
                )}
              </ProfileQuery>
            )
          }
        }
        
        export default RideContainer;

- src/routes/Ride/RidePresenter.tsx     버튼이 두가지 상태에 따라 렌더링되는게 다른데 render 함수 안에 있는게 너무 복잡해 보여서 별도의 함수(`renderStatusButton`)로 분리하였다.

        import Button from 'components/Button';
        import React from 'react';
        import { MutationFn } from "react-apollo";
        import styled from '../../typed-components';
        import { 
          getRide, 
          updateRide,
          updateRideVariables,
          userProfile 
        } from '../../types/api';
        
        ...
        
        interface IProps {
          rideData?: getRide;
          userData?: userProfile;
        	updateRideMutation: MutationFn<updateRide, updateRideVariables>;
        }
        
        const renderStatusButton = ({ ride, user, updateRideMutation }) => {
          console.log(ride);
        	if (ride.driver && user && ride.driver.id === user.id ) {
            if (ride.status === "ACCEPTED") {
              return (
                <ExtendedButton
                  value="Picked Up"
                  onClick={() => {
                    updateRideMutation({
                      variables: {
                        rideId: ride.id,
                        status: "ONROUTE"
                      }
                    })
                  }}
                />
              )
            } else if (ride.status === "ONROUTE") {
              return (
                <ExtendedButton
                  value="Finished"
                  onClick={() => {
                    updateRideMutation({
                      variables: {
                        rideId: ride.id,
                        status: "FINISHED"
                      }
                    })
                  }}
                />
              )
            }
          }
          return false;
        }
        
        const RidePresenter: React.SFC<IProps> = ({
          rideData: { GetRide: { ride = null } = {} } = { GetRide: { ride: null}},
          userData: { GetMyProfile: { user = null } = {} } = { GetMyProfile: { user: null}},
          updateRideMutation
        }) => (
          <Container>
        ...
                  <Buttons>
                    {renderStatusButton({ user, ride, updateRideMutation })}
                  </Buttons>
        ...

앱을 실행하면 왼쪽이 탑승자고 오른쪽이 운전자다. 운전자쪽에만 버튼이 렌더링되게 했다. 운전자에 있는 버튼을 누르면 콘솔에 Ride의 Status가 업데이트 되는 것을 확인할 수 있다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952573/tlog/_2019-06-04__7-de11e8eb-7999-4e07-84ed-71f78de04eeb.38.52_gunxim.png)

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952573/tlog/_2019-06-04__7-9682d715-9be8-4843-ab05-aac3eb26b051.39.04_d3io4y.png)