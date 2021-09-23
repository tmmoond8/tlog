---
title: 26 우버 클론 코딩 (nomad coders)
date: '2019-06-13T08:56:56.243Z'
description: 우버 코딩 강의 로그 2.44 ~ 2.45
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

## #2.44 AddPlace Mutation

이전에는 view 작업을 했고 이제 장소를 추가하는 mutation을 작성하자.

- src/routes/AddPlace/AddPlace.queries.ts

        import { gql } from "apollo-boost";
        
        export const ADD_PLACE = gql`
          mutation addPlace (
            $name: String!
            $lat: Float!
            $lng: Float!
            $address: String!
            $isFav: Boolean!
          ) {
            AddPlace(
              name: $name
              lat: $lat
              lng: $lng
              address: $address
              isFav: $isFav
            ) {
              ok
              error
            }
          }
        `;

yarn codegen으로 queries를 생성하고.

- src/routes/AddPlace/AddPlaceContainer.tsx

        import React from "react";
        import { Mutation } from "react-apollo";
        import { RouteComponentProps } from "react-router-dom";
        import { toast } from "react-toastify";
        import { GET_PLACES } from "../../sharedQueries.queries";
        import { addPlace, addPlaceVariables } from "../../types/api";
        import { ADD_PLACE } from "./AddPlace.queries";
        import AddPlacePresenter from "./AddPlacePresenter";
        
        interface IState {
          address: string;
          name: string;
          lat: number;
          lng: number;
        }
        
        interface IProps extends RouteComponentProps<any> {}
        
        class AddPlaceMutation extends Mutation<addPlace, addPlaceVariables> {}
        
        class AddPlaceContainer extends React.Component<IProps, IState> {
          public state = {
            address: "",
            lat: 1.34,
            lng: 1.44,
            name: ""
          }
        
          public render() {
            const { address, name, lat, lng } = this.state;
            const { history } = this.props;
            return (
              <AddPlaceMutation 
                mutation={ADD_PLACE}
                variables={{
                  address,
                  isFav: false,
                  lat,
                  lng,
                  name
                }}
                onCompleted={ data => {
                  const { AddPlace } = data;
                  if (AddPlace.ok) {
                    toast.success("Place added");
                    setTimeout(() => {
                      history.push("/places");
                    }, 2000);
                  } else {
                    toast.error(AddPlace.error);
                  }
                }}
                refetchQueries={[{query: GET_PLACES}]}
              >
                {(addPlaceMutaion, { loading }) => (
                  <AddPlacePresenter
                    onInputChange={this.onInputChange}
                    address={address}
                    name={name}
                    loading={loading}
                    onSubmit={addPlaceMutaion}
                  />
                )}
              </AddPlaceMutation>
              
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

- src/routes/AddPlace/AddPlacePresenter.tsx   Container에서 넘겨준 Muation을 onSumit에 여결했다.

        import Button from "components/Button";
        import Form from "components/Form";
        import Header from "components/Header";
        import Input from "components/Input";
        import React from "react";
        import { MutationFn } from "react-apollo";
        import Helmet from "react-helmet";
        import { Link } from "react-router-dom";
        import styled from "../../typed-components";
        import { addPlace, addPlaceVariables } from "../../types/api";
        
        ...
        
        interface IProps {
          address: string;
          name: string;
          onInputChange: React.ChangeEventHandler<HTMLInputElement>;
          loading: boolean;
        	onSubmit: MutationFn<addPlace, addPlaceVariables>;
        }
        
        const AddPlacePresenter: React.SFC<IProps> = ({
          onInputChange,
          address,
          name,
          loading,
          onSubmit
        }) => (
          <React.Fragment>
            <Helmet>
              <title>Add Place | Nuber</title>
            </Helmet>
            <Header title="Add Place" backTo="/"/>
            <Container>
              <Form submitFn={onSubmit}>
        ...

[http://localhost:3000/add-place](http://localhost:3000/add-place) 에서 장소를 추가하고 [http://localhost:3000/settings](http://localhost:3000/add-place) 에서도 잘 보이는지 확인하자.

## #2.45 Edit Place Mutation

이번에는 장소에 대해서 `isFav` 을 토글하도록 하자. EditPlace Mutation을 통해 `isFav`값을 수정한다.

이 토글은 Place 컴포넌트에서 담당하기 때문에 컴포넌트에 Mutation을 넣어서 Container 만들어야 한다.

- src/components/Place/Place.queries.ts

        import { gql } from "apollo-boost";
        
        export const EDIT_PLACE = gql`
          mutation editPlace($PlaceId: Int!, $isFav: Boolean) {
            EditPlace(placeId: $PlaceId, isFav: $isFav) {
              ok
              error
            }
          }
        `;

- src/components/Place/PlacePresenter.tsx  현재 Place.tsx일 텐데 presenter로 바꾸자.

    presenter는 뷰 담당만하고 컴포넌트에 Container로 부터 받은 Mutation만 연결하자. 

        import React from "react";
        import { MutationFn } from "react-apollo";
        import styled from "../../typed-components";
        import { editPlace, editPlaceVariables } from 'types/api';
        
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
          onToggleStar: MutationFn<editPlace, editPlaceVariables>;
        }
        
        const PlacePresenter: React.SFC<IProps> = ({ onToggleStar, fav, name, address }) => (
          <Place>
            <Icon onClick={() => onToggleStar()}>{fav ? "★" : "✩" }</Icon>
            <Container>
              <Name>{name}</Name>
              <Address>{address}</Address>
            </Container>
          </Place>
        );
        
        export default PlacePresenter;

뭐리를 정의하고 yarn codegen을 해서 쿼리 타입을 생성하자.

- src/components/Place/PlaceContainer.tsx

        import React from "react";
        import { Mutation } from "react-apollo";
        import { GET_PLACES } from "../../sharedQueries.queries";
        import { editPlace, editPlaceVariables } from "../../types/api";
        import { EDIT_PLACE } from "./Place.queries";
        import PlacePresenter from "./PlacePresenter";
        
        interface IProps {
          fav: boolean;
          name: string;
          address: string;
          id: number;
        }
        
        class FavMutation extends Mutation<editPlace, editPlaceVariables> {}
        
        class PlaceContainer extends React.Component<IProps> {
          public render() {
            const { id, fav, name, address } = this.props;
            return (
              <FavMutation
                mutation={EDIT_PLACE}
                variables={{
                  PlaceId: id,
                  isFav: !fav
                }}
                refetchQueries={[{ query: GET_PLACES }]}
              >
                {editPlaceMutation => (
                  <PlacePresenter
                    onToggleStar={editPlaceMutation}
                    fav={fav}
                    name={name}
                    address={address}
                  />
                )}
              </FavMutation>
            )
          }
        }
        
        export default PlaceContainer;

- src/components/Place/index.ts

        export { default } from "./PlaceContainer";

[http://localhost:3000/settings](http://localhost:3000/settings) 에서 별을 눌러서 토글을 시켜보자. 

(뭐지 토글 하니까 정렬이 되어 버리네.)