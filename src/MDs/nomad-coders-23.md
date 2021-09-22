---
title: 23 우버 클론 코딩 (nomad coders)
date: '2019-06-04T08:56:56.243Z'
description: 우버 코딩 강의 로그 2.36 ~ 2.38
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1632302785/tlog/cover/nuber_clone_nllng2.jpg'
tags:
  - 'Clone Coding'
  - 'Nomad Coder'
  - Apollo
  - GraphQL
---
#

이 포스트는 nomad coders의 우버 클론 코딩 시리즈를 듣고 정리한 글 입니다.

[https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course](https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course)

## #2.36 EditProfile Screen part One

이번에는 계정 정보 변경인데 중요하진 않지만 필요한 기능이다. 아직 뷰가 없어서 니콜라스가 미리 만들어논 뷰로 채우자.

- src/routes/EditAccount/EditAccountPresenter.tsx

        import Button from "components/Button";
        import Form from "components/Form";
        import Header from "components/Header";
        import Input from "components/Input";
        import React from "react";
        import { MutationFn } from "react-apollo";
        import Helmet from "react-helmet";
        import styled from "../../typed-components";
        
        const Container = styled.div`
          text-align: center;
        `;
        
        const ExtendedForm = styled(Form)`
          padding: 0px 40px;
        `;
        
        const ExtendedInput = styled(Input)`
          margin-bottom: 30px;
        `;
        
        interface IProps {
          firstName: string;
          lastName: string;
          email: string;
          profilePhoto: string;
          onSubmit?: MutationFn;
          onInputChange: React.ChangeEventHandler<HTMLInputElement>;
          loading?: boolean;
        }
        
        const EditAccountPresenter: React.SFC<IProps> = ({
          firstName,
          lastName,
          email,
          profilePhoto,
          onSubmit,
          onInputChange,
          loading
        }) => (
          <Container>
            <Helmet>
              <title>Edit Account | Nuber</title>
            </Helmet>
            <Header title="Edit Account" backTo={"/"}/>
            <ExtendedForm submitFn={onSubmit}>
              <ExtendedInput
                onChange={onInputChange}
                type="text"
                value={firstName}
                placeholder="First Name"
                name="firstName"
              />
              <ExtendedInput
                onChange={onInputChange}
                type="text"
                value={lastName}
                placeholder="Last Name"
                name="lastName"
              />
              <ExtendedInput
                onChange={onInputChange}
                type="email"
                value={email}
                placeholder="Email"
                name="email"
              />
              <Button onClick={null} value={loading ? "Loading" : "Update"}/>
            </ExtendedForm>
          </Container>
        );
        
        export default EditAccountPresenter;

- src/routes/EditAccount/EditAccountContainer.tsx

        import React from "react";
        import { RouteComponentProps } from "react-router-dom";
        import EditAccountPresenter from './EditAccountPresenter';
        
        
        interface IState {
          firstName: string;
          lastName: string;
          email: string;
          profilePhoto: string;
        }
        
        interface IProps extends RouteComponentProps<any> {}
        
        class EditAccountContainer extends React.Component<IProps, IState> {
          public state = {
            email: "",
            firstName: "",
            lastName: "",
            profilePhoto: ""
          };
        
          public render() {
            const { email, firstName, lastName, profilePhoto } = this.state;
            return (
              <EditAccountPresenter
                email={email}
                lastName={lastName}
                firstName={firstName}
                profilePhoto={profilePhoto}
                onInputChange={this.onInputChange}
                loading={false}
              />
            );
          }
        
          public onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
            const {
              target: { name, value }
            } = event;
        
            this.setState({
              [name]: value
            } as any);
          };
        }
        
        export default EditAccountContainer;

- src/routes/EditAccount/index.ts

        export { default } from "./EditAccountContainer";

위에서 인풋에 값을 연결을 해두었다.

## #2.37 EditProfile Screen part Two

저번에 이어서 프로필을 바꿀 때 기존 프로필 값을 default 값으로 해야하는데, 이렇게 하기 위해서는 query로 데이터를 가져와서 뿌려줘야 한다.

- src/sharedQueries.queries.ts  USER_PROFILE query에서 `lastName`, `firstName`, `email`을 추가적으로 가져오도록 수정 했다.

        import { gql } from "apollo-boost";
        
        export const USER_PROFILE = gql`
          query userProfile {
            GetMyProfile {
              ok
              error
              user {
        				id
                profilePhoto
                fullName
                firstName
                lastName
                email
                isDriving
              }
            }
          }
        `;

변경사항이 있기 때문에 yarn codegen 으로 재생성하자.

- src/routes/EditAccount/EditAccountContainer.tsx

        import React from "react";
        import { Query } from "react-apollo";
        import { RouteComponentProps } from "react-router-dom";
        import { USER_PROFILE } from "../../sharedQueries.queries";
        import {
          userProfile
        } from "../../types/api";
        import EditAccountPresenter from "./EditAccountPresenter";
        
        
        interface IState {
          firstName: string;
          lastName: string;
          email: string;
          profilePhoto: string;
          loading: boolean;
        }
        
        interface IProps extends RouteComponentProps<any> {}
        
        class ProfileQuery extends Query<userProfile> {}
        
        class EditAccountContainer extends React.Component<IProps, IState> {
          public state = {
            email: "",
            firstName: "",
            lastName: "",
            loading: true,
            profilePhoto: "",
          };
        
          public render() {
            const { email, firstName, lastName, profilePhoto, loading } = this.state;
            return (
              <ProfileQuery query={USER_PROFILE} onCompleted={this.updateFields}>
                {() => (
                  <EditAccountPresenter
                    email={email}
                    firstName={firstName}
                    lastName={lastName}
                    profilePhoto={profilePhoto}
                    onInputChange={this.onInputChange}
                    loading={loading}
                  />
                )}
              </ProfileQuery>
            );
          }
        
          public onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
            const {
              target: { name, value }
            } = event;
        
            this.setState({
              [name]: value
            } as any);
          };
        
          public updateFields = (data: {} | userProfile) => {
            if("GetMyProfile" in data) {
              const {
                GetMyProfile: { user }
              } = data;
              if(user) {
                const { firstName, lastName, email, profilePhoto } = user;
                const loading = false;
                this.setState({
                  email,
                  firstName,
                  lastName,
                  loading,
                  profilePhoto,
                } as any);
              }
            }
          }
        }
        
        export default EditAccountContainer;

이제 초기 값은 현재 프로필 값으로 셋팅이 된다.

## #2.38 EditProfile Screen part Three

이제 업데이트하는 쿼리를 작성하고 업데이트 시켜주자.

- src/routes/EditAccount/EditAccount.queries.ts

        import { gql } from "apollo-boost";
        
        export const UPDATE_PROFILE = gql`
          mutation updateProfile(
            $firstName: String!
            $lastName: String!
            $email: String!
            $profilePhoto: String!
          ) {
            UpdateMyProfile(
              firstName: $firstName
              lastName: $lastName
              email: $email
              profilePhoto: $profilePhoto
            ) {
              ok
              error
            }
          }
        `;

쿼리를 생성하기 위해 yarn codegen 을 실행하자.

- src/routes/EditAccount/EditAccountContainer.ts  프로필을 업데이트 하는 `UpdateProfileMutation` 를 정의하고 추가해주었다. 업데이트 후에는 toast창을 띄우도록 하고, refetchQueries도 추가해서 업데이트 된 내용을 반영하도록 했다. `fetchPolicy`도 설정된 것을 볼 수 있다. cache가 설정되어 있기 때문에 항상 onCompleted이 발생하지 않는다. cache에서 값을 가져올 때도 onComplete가 호출되도록 수정했다.

        import React from "react";
        import { Mutation, Query } from "react-apollo";
        import { RouteComponentProps } from "react-router-dom";
        import { toast } from "react-toastify";
        import { USER_PROFILE } from "../../sharedQueries.queries";
        import {
          updateProfile,
          updateProfileVariables,
          userProfile
        } from "../../types/api";
        import { UPDATE_PROFILE } from "./EditAccount.queries";
        import EditAccountPresenter from "./EditAccountPresenter";
        
        
        interface IState {
          firstName: string;
          lastName: string;
          email: string;
          profilePhoto: string;
          loading: boolean;
        }
        
        interface IProps extends RouteComponentProps<any> {}
        
        class ProfileQuery extends Query<userProfile> {}
        
        class UpdateProfileMutation extends Mutation<
          updateProfile,
          updateProfileVariables
        > {}
        
        class EditAccountContainer extends React.Component<IProps, IState> {
          public state = {
            email: "",
            firstName: "",
            lastName: "",
            loading: true,
            profilePhoto: "",
          };
        
          public render() {
            const { email, firstName, lastName, profilePhoto, loading } = this.state;
            return (
              <ProfileQuery 
        				query={USER_PROFILE} 
        				onCompleted={this.updateFields}
        				fetchPolicy="no-cache"
        			>
                {() => (
                  <UpdateProfileMutation
                    mutation={UPDATE_PROFILE}
                    variables={{
                      email,
                      firstName,
                      lastName,
                      profilePhoto
                    }}
                    refetchQueries={[{query: USER_PROFILE}]}
                    onCompleted={data => {
                      const { UpdateMyProfile } = data;
                      if(UpdateMyProfile.ok) {
                        toast.success('Profile updated!')
                      } else if (UpdateMyProfile.error) {
                        toast.error(UpdateMyProfile.error);
                      }
                    }}
                  >
                    {(updateProfileMutation, { loading: updateLoading }) => (
                      <EditAccountPresenter
                        email={email}
                        firstName={firstName}
                        lastName={lastName}
                        profilePhoto={profilePhoto}
                        onInputChange={this.onInputChange}
                        loading={updateLoading || loading}
        								onSubmit={() => updateProfileMutation()}
                      />
                    )}
                  </UpdateProfileMutation>
                )}
              </ProfileQuery>
            );
          }
        
          public onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
            const {
              target: { name, value }
            } = event;
        
            this.setState({
              [name]: value
            } as any);
          };
        
          public updateFields = (data: {} | userProfile) => {
            if("GetMyProfile" in data) {
              const {
                GetMyProfile: { user }
              } = data;
              if(user) {
                const { firstName, lastName, email, profilePhoto } = user;
                const loading = false;
                this.setState({
                  email,
                  firstName,
                  lastName,
                  loading,
                  profilePhoto,
                } as any);
              }
            }
          }
        }
        
        export default EditAccountContainer;

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952572/tlog/_2019-05-26__3-dbd7f701-0caa-4f81-93c0-30eeafc8b19e.19.23_h45ry4.png)

> ProfileQuery에 fetchPolicy의 값은 여러 값을 사용할 수 있다. 니콜라스의 경우 cache-and-network 를 값으로 사용했는데, 업데이트 한 후 쿼리가 다시 호출되지 않아서 no-cache로 변경했다.