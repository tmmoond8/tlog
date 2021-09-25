---
title: 36 우버 클론 코딩 (nomad coders)
date: '2019-7-08T08:56:56.243Z'
description: 우버 코딩 강의 로그 2.78 ~ 2.80
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632302785/tlog/cover/nuber_clone_nllng2.jpg'
tags:
  - 'Uber Clone Coding'
  - 'Nomad Coder'
  - GraphQL
---

이 포스트는 nomad coders의 우버 클론 코딩 시리즈를 듣고 정리한 글 입니다.

[https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course](https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course)

## #2.78 Chat Screen Mutation

저번에는 데이터를 콘솔에 찍히도록 했고, 이번에는 메시지를 보이도록 처리하고, 메시지 입력까지 해보자.

- src/components/Message/Message.tsx       메시지를 정의하자. `withProps`  라는 것을 새로 사용했다. styled-components에서 props를 확장하려면 이걸 사용하면 될 것같다. (니콜라스가 사용하지 않지만 찾아서 추가 함)
  ```tsx
  import React from 'react';
    import styled, { withProps } from '../../typed-components';
    
  interface IProps {
    text: string;
    mine: boolean;
  }
  
  const Container = withProps<IProps, HTMLDivElement>(styled.li)`
    background-color: ${props => (props.mine ? props.theme.blueColor : props.theme.greyColor)};
    color: white;
    padding: 1rem 1.2rem;
    border-radius: 1.2rem;
    align-self: ${props => (props.mine ? "flex-end" : "flex-start")};
    border-bottom-right-radius: ${props => (props.mine ? "0" : "1.2rem")};
    border-bottom-left-radius: ${props => (!props.mine ? "0" : "1.2rem")};
  `;
  
  const Message: React.SFC<IProps> = ({ text, mine }) => (
    <Container mine={mine}>{text}</Container>
  );
  
  export default Message;
  ```

- src/components/Message/index.ts
  ```tsx
  export { default } from './Message';
  ```

Message 컴포넌트를 작성했고, 이어서 Chat 페이지에 표현하도록 하자.

- src/routes/Chat/ChatContainer.tsx      콘솔 찍히도록 했던 코드는 제거 했고, Presenter로 데이터를 넘기도록 했다.
  ```tsx
  ...

  {({ data: chatData, loading }) => (
    <ChatPresenter 
      userData={userData}
      loading={loading}
      chatData={chatData}
    />
  )}

  ...
  ```

- src/routes/Chat/ChatPresenter.tsx
  ```tsx
  import React from 'react';
  import Header from '../../components/Header';
  import Message from '../../components/Message';
  import styled from '../../typed-components';
  import { getChat, userProfile } from '../../types/api';
  
  const Container = styled.div``;
  interface IProps {
    userData?: userProfile;
    chatData?: getChat;
    loading: boolean;
  }
  
  const MessageList = styled.ol`
    height: 80vh;
    overflow: scroll;
    padding: 0 .12rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  
    li + li {
      margin-top: .3rem;
    }
  `;
  
  const ChatPresenter: React.SFC<IProps> = ({
    loading,
    userData: { GetMyProfile: { user = null } = {} } = { GetMyProfile: { user: null }},
    chatData: { GetChat: { chat = null } = {} } = { GetChat: { chat: null }}
  }) => (
    <Container>
      <Header title="Chat"/>
      {!loading && (
        <MessageList>
          {user && chat && chat.messages && (
            chat.messages!.map(message => {
              if (message) {
                return (
                  <Message
                    key={message.id}
                    text={message.text}
                    mine={user.id === message.userId}
                  />
                )
              }
              return false;
            })
          )}
        </MessageList>
      )}
    </Container>
  );
  
  export default ChatPresenter;
  ```

자 이제 페이지를 새로고침하면 아래처럼 운전자, 승객에 따라 다르게 채팅 메시지가 표시된다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952573/tlog/_2019-06-06__6-c523f08f-0fa2-4e28-9552-3b5c2c24985f.44.14_bdvpcc.png)

이번에는 메시지를 보내는 기능을 구현하자. SendMessage Mutation을 구현하자.

- src/routes/Chat/Chat.queries.ts     `SEND_MESSAGE` 을 작성 후 yarn codegen을 하자.
  ```tsx
  ...
  export const SEND_MESSAGE = gql`
    mutation sendMessage($text: String!, $chatId: Int!) {
      SendChatMessage(text: $text, chatId: $chatId) {
        ok
        error
        message {
          id
          text
          userId
        }
      }
    }
  `;
  ```

- src/routes/Chat/ChatContainer.tsx
  ```tsx
  import React from 'react';
  import { Mutation, MutationFn, Query } from 'react-apollo';
  import { RouteComponentProps } from 'react-router-dom';
  import { USER_PROFILE } from '../../sharedQueries.queries';
  import { 
    getChat, 
    getChatVariables, 
    sendMessage,
    sendMessageVariables,
    userProfile 
  } from '../../types/api';
  import { GET_CHAT, SEND_MESSAGE } from './Chat.queries';
  import ChatPresenter from './ChatPresenter';
  
  interface IProps extends RouteComponentProps<any> {}
  interface IState {
    message: "";
  }
  
  class ProfileQuery extends Query<userProfile> {}
  class ChatQuery extends Query<getChat, getChatVariables> {}
  class SendMessageMutation extends Mutation<sendMessage, sendMessageVariables> {}
  
  class ChatContainer extends React.Component<IProps, IState> {
    public sendMessageMutation: MutationFn<sendMessage, sendMessageVariables> | undefined;
    constructor(props: IProps) {
      super(props);
      if (!props.match.params.chatId) {
        props.history.push("/");
      }
      this.state = {
        message: ""
      }
    }
    public render() {
      const {
        match: {
          params: { chatId } 
        }
      } = this.props;
      const { message } = this.state;
      return (
        <ProfileQuery query={USER_PROFILE}>
          {({ data: userData }) => (
            <ChatQuery query={GET_CHAT} variables={{ chatId: parseInt(chatId, 10) }}>
              {({ data: chatData, loading }) => (
                <SendMessageMutation mutation={SEND_MESSAGE}>
                  {sendMessageMutation => {
                    this.sendMessageMutation = sendMessageMutation;
                    return (
                      <ChatPresenter 
                        userData={userData}
                        loading={loading}
                        chatData={chatData}
                        messageText={message}
                        onInputChange={this.onInputChange}
                        onSubmit={this.onSubmit}
                      />
                    )
                  }}
                </SendMessageMutation>
              )}
            </ChatQuery>
          )}
        </ProfileQuery>
      )
    }
  
    public onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
      const {
        target: { name, value }
      } = event;
      this.setState({
        [name]: value
      } as any);
    }
  
    public onSubmit = () => {
      const { message } = this.state;
      const {
        match: {
          params: { chatId }
        }
      } = this.props;
      if (message !== "") {
        this.setState({
          message: ""
        });
        this.sendMessageMutation && this.sendMessageMutation({
          variables: {
            chatId: parseInt(chatId, 10),
            text: message
          }
        });
      }
      return;;
    }
  }
  
  export default ChatContainer;
  ```

- src/routes/Chat/ChatPresenter.tsx
  ```tsx
  import Form from 'components/Form';
  import Header from 'components/Header';
  import Input from 'components/Input';
  import Message from 'components/Message';
  import React from 'react';
  import styled from '../../typed-components';
  import { getChat, userProfile } from '../../types/api';
  
  const Container = styled.div``;
  interface IProps {
    userData?: userProfile;
    chatData?: getChat;
    loading: boolean;
    messageText: string;
    onInputChange: React.ChangeEventHandler<HTMLInputElement>;
    onSubmit: () => void;
  }
  
  const MessageList = styled.ol`
    height: 80vh;
    overflow: scroll;
    padding: 0 .12rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    
    li + li {
      margin-top: .3rem;
    }
  `;
  
  const InputBar = styled.div`
    padding: 0 20px;
  `;
  
  const ChatPresenter: React.SFC<IProps> = ({
    loading,
    userData: { GetMyProfile: { user = null } = {} } = { GetMyProfile: { user: null }},
    chatData: { GetChat: { chat = null } = {} } = { GetChat: { chat: null }},
    messageText,
    onInputChange,
    onSubmit
  }) => (
    <Container>
      <Header title="Chat"/>
      {!loading && (
        <>
          <MessageList>
            {user && chat && chat.messages && (
              chat.messages!.map(message => {
                if (message) {
                  return (
                    <Message
                      key={message.id}
                      text={message.text}
                      mine={user.id === message.userId}
                    />
                  )
                }
                return false;
              })
            )}
          </MessageList>
          <InputBar>
            <Form submitFn={onSubmit}>
              <Input
                value={messageText}
                placeholder="Type your message"
                onChange={onInputChange}
                name="message"
              />
            </Form>
          </InputBar>
        </>
      )}
    </Container>
  );
  
  export default ChatPresenter;
  ```

메시지를 이제 보낼 수 있다. 아직 문제가 있다. 메시지를 보내면 바로 뜨지 않고 새로 고침을 해야 볼 수 있다....

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952574/tlog/_2019-06-06__7-59384731-2519-4476-9ed2-497d212486c5.12.24_lxcsyu.png)

## #2.79 Chat Screen Subscription

## #2.80 Chat Screen Subscription part Two

채팅 메시지가 현재는 새로고침을 해야 메시지가 보인다. 이제 실시간으로 메시지가 보이도록 subscription을 만들자.

- src/routes/Chat.queries.ts    `SUBSCRIBE_TO_MESSAGES` 을 새로 작성했고, yarn codegen을 하자.
  ```tsx
  ...
  
  export const SUBSCRIBE_TO_MESSAGES = gql`
    subscription messageSubscription {
      MessageSubscription {
        id
        text
        userId
      }
    }
  `;
  ```

- src/routes/ChatContainer.tsx      `<ChatQuery>` 를 subscribe 하도록 코드를 수정했다. 단순히 `prev`, `subscriptionData` 를 콘솔에 출력하도록만 했다.
  ```tsx
  import { SubscribeToMoreOptions } from 'apollo-client';
  import React from 'react';
  import { Mutation, MutationFn, Query } from 'react-apollo';
  import { RouteComponentProps } from 'react-router-dom';
  import { USER_PROFILE } from '../../sharedQueries.queries';
  import { 
    getChat, 
    getChatVariables, 
    sendMessage,
    sendMessageVariables,
    userProfile 
  } from '../../types/api';
  import { GET_CHAT, SEND_MESSAGE, SUBSCRIBE_TO_MESSAGES } from './Chat.queries';
  import ChatPresenter from './ChatPresenter';
  
  ...
  
    return (
      <ProfileQuery query={USER_PROFILE}>
        {({ data: userData }) => (
          <ChatQuery query={GET_CHAT} variables={{ chatId: parseInt(chatId, 10) }}>
            {({ data: chatData, loading, subscribeToMore }) => {
              const subscribeToMoreOptions: SubscribeToMoreOptions = {
                document: SUBSCRIBE_TO_MESSAGES,
                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) {
                    return prev;
                  }
                  console.log(prev);
                  console.log(subscriptionData);
                }
              }
              subscribeToMore(subscribeToMoreOptions);
              return (
                <SendMessageMutation mutation={SEND_MESSAGE}>
                  {sendMessageMutation => {
                    this.sendMessageMutation = sendMessageMutation;
                    return (
                      <ChatPresenter 
                        userData={userData}
                        loading={loading}
                        chatData={chatData}
                        messageText={message}
                        onInputChange={this.onInputChange}
                        onSubmit={this.onSubmit}
                      />
                    )
                  }}
                </SendMessageMutation>
              );
            }}
          </ChatQuery>
        )}
      </ProfileQuery>
    )
  
  ...
  ```

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952574/tlog/_2019-06-07__10-4538f787-dbda-4714-be0e-aa036a331383.43.18_dpzusn.png)

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952574/tlog/_2019-06-07__10-a591310d-f2ec-48d7-933b-a024f99b52b8.43.57_xgdwsf.png)

지금은 apollo-yoga의 subscription 버그 때문에 중복되게 뜨지만 어쨋든 위 이미지에서 GetChat → prev를 data → subscriptionData를 나타낸다.  우리는 subscriptionData를 messages 배열에 추가 해줘야 한다.

- src/routes/Chat/ChatContainer.tsx    `prev` 의 구조를 유지한 채 prev.chat.messages만 업데이트를 해야 한다.. immutable 하게 처리하기 위해 이렇게 한다.
  ```tsx
  ...

    document: SUBSCRIBE_TO_MESSAGES,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) {
        return prev;
      }
      const updatedData = Object.assign({}, prev, {
        GetChat: {
          ...prev.GetChat,
          chat: {
            ...prev.GetChat.chat,
            messages: [
              ...prev.GetChat.chat.messages,
              subscriptionData.data.MessageSubscription
            ]
          }
        }
      })
      return updatedData;
    }
  }
  subscribeToMore(subscribeToMoreOptions);
  return (

  ...

![](_2019-06-07__11-894e9011-4a7e-492c-98b9-021292db4e54.04.14.png)

지금 같은 메시지가 여러번 노출 되고 있는데, 이거는 apollo-yoga의 subscription말고 다른 것을 사용하면 된다고 한다. 여기서는 클라이언트 단에서 간단히 처리하자고 한다. 이건 apollo-yoga의 버그라고 이전에 언급한적 있다.

- src/routes/Chat/ChatContainer.tsx       마지막 메시지의 Id와 새로운 메시지를 비교해서 같으면 무시하도록 처리헀다.
  ```tsx
  ...

    document: SUBSCRIBE_TO_MESSAGES,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) {
        return prev;
      }
      const {
        data: { MessageSubscription } 
      } = subscriptionData;
      const {
        GetChat: {
          chat: { messages }
        }
      } = prev;
      const newMessageId = MessageSubscription.id;
      const latestMessageId = messages.length > 0 ? messages[messages.length - 1].id : -1;
      if(latestMessageId === newMessageId) {
        return prev;
      }
      const updatedData = Object.assign({}, prev, {
        GetChat: {
          ...prev.GetChat,
          chat: {
            ...prev.GetChat.chat,
            messages: [
              ...prev.GetChat.chat.messages,
              MessageSubscription
            ]
          }
        }
      })
      return updatedData;
    }
  }
  subscribeToMore(subscribeToMoreOptions);
  return (

  ...
  ```

원래는 서버에서 처리를 하는 것이 맞지만, 사이드 프로젝트임을 감안하여 프론트에서 적당히 처리가 되었다.

이로서 프론트엔드 기능 개발이 끝났다.