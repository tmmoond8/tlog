---
templateKey: blog-post
title: 35 우버 클론 코딩 (nomad coders)
date: 2019-07-06T08:56:56.243Z
description: 우버 코딩 강의 로그 2.75 ~ 2.77
featuredpost: true
featuredimage: /img/nuber_clone.jpg
tags:
  - uber-clone-coding
  - nomad-coders
  - graphql-yoga
---
# 

이 포스트는 nomad coders의 우버 클론 코딩 시리즈를 듣고 정리한 글 입니다.

[https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course](https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course)

## #2.75 Ride Status Subscription

이전에 운전자가 버튼을 눌러서 상태를 업데이트 하도록 했다. 이 상태 업데이트를 운전자, 승객 모두 subscription하도록 해보자.

- src/routes/Ride/Ride.queries.ts      `RIDE_SUBSCRIPTION` 을 정의하고 yarn codegen을 하자.

        ...
        export const RIDE_SUBSCRIPTION = gql`
          subscription rideUpdate {
            RideStatusSubscription {
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
        `;

- src/routes/Ride/RideContainer.tsx     RideQuery

        import { SubscribeToMoreOptions } from 'apollo-client';
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
        import { GET_RIDE, RIDE_SUBSCRIPTION, UPDATE_RIDE_STATUS } from './Ride.queries';
        import RidePresenter from './RidePresenter';
        
        ...
            return (
              <ProfileQuery query={USER_PROFILE}>
                {({ data: userData }) => (
                  <RideQuery query={GET_RIDE} variables={{ rideId: parseInt(rideId, 10) }}>
                    {({ data: rideData, loading, subscribeToMore }) => {
                      const subscribeOptions: SubscribeToMoreOptions = {
                        document: RIDE_SUBSCRIPTION
                      }
                      subscribeToMore(subscribeOptions);
                      return (
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
                      )
                    }}
                  </RideQuery>
                )}
              </ProfileQuery>
            )
          }
        }
        
        export default RideContainer;

이번에는 Ride를 db에서 삭제 후 user.isRiding, user.isTaken false로 바꾼 후 Ride 요청부터 운전자의ACCEPTED 이후의 단계까지 계속 진행해보자. 깔끔하게 동작한다.

> subscribeOptions 을  subscribeToMore 할 때 HomeContainer에서는 updateQuery를 정의해서 prev에 값을 엎어쓰도록 했는데 여기서는 별도의 updateQuery를 작성하지 않았다. 그 이유는 Ride.queries.ts 에 정의된 GET_RIDE의 결과와 RIDE_SUBSCRIPTION의 결과가 동일하기 때문이라고 한다. (이건 니콜라스의 생각, 확인이 필요)

> 또 RideQuery에서 subscription 해서 ride를 업데이트 하는데, 운전자가 RideUpdate해서 refetchQueries에 정의된것처럼 업데이트를 한다. 이렇게 하면 두번 중복되는것 아닐까? 하고 생각했다.

## #2.76 Ride Status Subscription part Two

운전자가 FINISH 를 누르면 Ride가 끝나기 때문에 운전자와 승객 모두 Home 페이지로 이동 해야 한다.

이 강의를 진행하는데,  니콜라스랑 조금 다른게 있었다. 왠지 모르겠지만, Subscription의 updateQuery가 운전자 일때는 호출되지 않았다. 그래서 RideUpdate쪽에 onCompleted에 넣었다. 

- src/routes/Ride/RideContainer.tsx

        ...
                  <RideQuery query={GET_RIDE} variables={{ rideId: parseInt(rideId, 10) }}>
                    {({ data: rideData, loading, subscribeToMore }) => {
                      const subscribeOptions: SubscribeToMoreOptions = {
                        document: RIDE_SUBSCRIPTION,
                        updateQuery: (prev, { subscriptionData }) => {
                          if (!subscriptionData.data) {
                            return prev;
                          }
                          const {
                            data: {
                              RideStatusSubscription: { status }
                            }
                          } = subscriptionData;
                          if (status === "FINISHED") {
                            window.location.href = "/";
                          }
                        }
                      }
                      subscribeToMore(subscribeOptions);
                      return (
                        <RideUpdate 
                          mutation={UPDATE_RIDE_STATUS}
                          refetchQueries={[{ query: GET_RIDE , variables: { rideId: parseInt(rideId, 10) }}]}
                          onCompleted={() => this.hanleRideUpdate(rideData)}
                        >
        ...
        
          public hanleRideUpdate(rideData) {
            const { 
              GetRide
            } = rideData;
            if (GetRide && GetRide.ride.status === "ONROUTE") {
              window.location.href = "/";
            }
          }
        }
        
        export default RideContainer;

    이렇게 하면 자동적으로 운전자와 승객쪽 모두 FINISH가 되면 Home으로 이동한다.

## #2.77 Chat Screen Query

마지막 기능이 채팅하는 기능을 구현할 차례다. 먼저 Chat 페이지를 간단히 만들고, Ride 페이지에서 Chat 페이지로 이동할 수 있는 버튼을 추가 하자. routes에 Chat 디렉토리를 생성하자.

- src/routes/Chat/ChatContainer.tsx       별 다른건 없지만 chatId가 없을 때 Home으로 이동하는 코드가 있다.

        import React from 'react';
        import { RouteComponentProps } from 'react-router-dom';
        import ChatPresenter from './ChatPresenter';
        
        interface IProps extends RouteComponentProps<any> {}
        
        class ChatContainer extends React.Component<IProps> {
          constructor(props: IProps) {
            super(props);
            if (!props.match.params.chatId) {
              props.history.push("/");
            }
          }
          public render() {
            return <ChatPresenter />;
          }
        }
        
        export default ChatContainer;

- src/routes/Chat/ChatPresenter.tsx

        import Header from 'components/Header';
        import React from 'react';
        import styled from '../../typed-components';
        
        const Container = styled.div``;
        
        const ChatPresenter: React.SFC = () => (
          <Container>
            <Header title="Chat"/>
          </Container>
        );
        
        export default ChatPresenter;

- src/routes/Chat/index.ts

        export { default } from './ChatContainer';

- src/routes/Ride/RidePresenter.tsx      Button 안에 버튼을 추가 했다.

        ...
        import { MutationFn } from "react-apollo";
        import { Link } from 'react-router-dom';
        import styled from '../../typed-components';
        
        ...
                  <Buttons>
                    {renderStatusButton({ user, ride, updateRideMutation })}
                    {ride.status !== "REQUESTING" && (
                      <Link to={`/chat/${ride.chatId}`}>
                        <ExtendedButton value="Chat" onClick={null} />
                      </Link>
                    )}
                  </Buttons>
        ...

그리고 페이징 라우팅에 Chat 페이지를 추가하자.

- src/components/App/AppPresenter.tsx

        ...
        import AddPlaces from "routes/AddPlace";
        import Chat from 'routes/Chat';
        import EditAccount from "routes/EditAccount";
        
        ...
        
            <Route path={"/ride/:rideId"} exact={true} component={Ride}/>
            <Route path={"/chat/:chatId"} exact={true} component={Chat}/>
            <Route path={"/edit-accoun"} exact={true} component={EditAccount}/>
          
        ...

    채팅 페이지로 이동하는 링크가 추가 되었다.

    ![](_2019-06-05__7-2d429ea8-7b31-45f9-85bb-b20249a05135.00.20.png)

    지금은 빈 페이지가 Chat에 보일 텐데 Chat 페이지에 ride에 대한 정보를 보여줘야 한다.

    먼저 쿼리를 만들고 쿼리를 호출하여 정보를 얻도록 하자.

    - src/routes/Chat/Chat.queries.ts     쿼리를 작성한 후 yarn codegen을 잊지 말자

            import { gql } from 'apollo-boost';
            
            export const GET_CHAT = gql`
              query getChat($chatId: Int!) {
                GetChat(chatId: $chatId) {
                  ok
                  error
                  chat {
                    passengerId
                    driverId
                    messages {
                      id
                      text
                      userId
                    }
                  }
                }
              }
            `;

    - src/routes/Chat/ChatContainer.tsx

            import React from 'react';
            import { Query } from 'react-apollo';
            import { RouteComponentProps } from 'react-router-dom';
            import { USER_PROFILE } from '../../sharedQueries.queries';
            import { getChat, getChatVariables, userProfile } from '../../types/api';
            import { GET_CHAT } from './Chat.queries';
            import ChatPresenter from './ChatPresenter';
            
            interface IProps extends RouteComponentProps<any> {}
            
            class ProfileQuery extends Query<userProfile> {}
            class ChatQuery extends Query<getChat, getChatVariables> {}
            
            class ChatContainer extends React.Component<IProps> {
              constructor(props: IProps) {
                super(props);
                if (!props.match.params.chatId) {
                  props.history.push("/");
                }
              }
              public render() {
                const {
                  match: {
                    params: { chatId } 
                  }
                } = this.props;
                return (
                  <ProfileQuery query={USER_PROFILE}>
                    {({ data: userData }) => (
                      <ChatQuery query={GET_CHAT} variables={{ chatId: parseInt(chatId, 10) }}>
                        {({ data: chatData, loading }) => ( console.log(chatData),
                          <ChatPresenter />
                        )}
                      </ChatQuery>
                    )}
                  </ProfileQuery>
                )
              }
            }
            
            export default ChatContainer;

    Chat 페이지로 이동하면 간단하게 Chat 데이터를 쿼리로 날려서 콘솔로 찍히도록만 했다.

    graphql에서 chatId에 메시지를 몇개 넣자. 운전자랑 승객의 토큰으로 각각 메시지 날리자.

    ![](_2019-06-06__6-c9467783-4361-44ab-97ec-f19d090be4cc.11.07.png)

    `