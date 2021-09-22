---
title: 29 우버 클론 코딩 (nomad coders)
date: '2019-06-21T08:56:56.243Z'
description: 우버 코딩 강의 로그 2.54 ~ 2.56
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1632302785/tlog/cover/nuber_clone_nllng2.jpg'
tags:
  - 'Clone Coding'
  - 'Nomad Coder'
  - GraphQL
---
# 

이 포스트는 nomad coders의 우버 클론 코딩 시리즈를 듣고 정리한 글 입니다.

[https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course](https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course)

## #2.54 HomeScreen User Marker

우버 서비스는 동작은 대부분이 지도에서 이뤄진다. 

HomeScreen도 google maps를 띄우자. 띄우는 방법은 find-address와 동일하다.

- src/routes/Home/index.ts   Container가를 google maps를 사용할 수 있도록 래핑한다.

        import dotenv from 'dotenv';
        import { GoogleApiWrapper } from 'google-maps-react';
        import HomeContainer from './HomeContainer';
        
        dotenv.config();
        
        export default GoogleApiWrapper({
          apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
        })(HomeContainer);

- src/routes/Home/HomePresenter.tsx

        import Menu from "components/Menu";
        import React from "react";
        import Helmet from "react-helmet";
        import Sidebar from "react-sidebar";
        import styled from "../../typed-components";
        
        const Container = styled.div``;
        
        const Button = styled.button`
          appearance: none;
          padding: 10px;
          position: absolute;
          top: 10px;
          left: 10px;
          border: 0;
          cursor: pointer;
          z-index: 2;
        `;
        
        const Map = styled.div`
          position: absolute;
          height: 100%;
          width: 100%;
        `;
        
        interface IProps {
          loading: boolean;
          isMenuOpen: boolean;
          toggleMenu: () => void;
          mapRef: any;
        }
        
        const HomePresenter: React.SFC<IProps> = ({ 
          loading, 
          isMenuOpen, 
          toggleMenu ,
          mapRef
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
              {!loading && (<Button onClick={toggleMenu}>
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M24 18v1h-24v-1h24zm0-6v1h-24v-1h24zm0-6v1h-24v-1h24z" fill="#1040e2"/><path d="M24 19h-24v-1h24v1zm0-6h-24v-1h24v1zm0-6h-24v-1h24v1z"/></svg>
              </Button>)}
              <Map ref={mapRef}/>
            </Sidebar>
          </Container>
        )
        
        export default HomePresenter;

- src/routes/Home/HomeContainer.tsx

        import React from "react";
        import { Query } from "react-apollo";
        import ReactDOM from 'react-dom';
        import { RouteComponentProps } from "react-router";
        import { USER_PROFILE } from "sharedQueries.queries";
        import { userProfile } from "../../types/api";
        import HomePresenter from "./HomePresenter";
        
        interface IProps extends RouteComponentProps<any> {
          google: any;
        }
        interface IState {
          isMenuOpen: boolean;
          lat: number;
          lng: number;
        }
        
        class ProfileQuery extends Query<userProfile> {}
        
        class HomeContainer extends React.Component<IProps, IState> {
          public mapRef: any;
          public map: google.maps.Map | null = null;
          public userMarker: google.maps.Marker | null = null;
        
          public state = {
            isMenuOpen: false,
            lat: 0,
            lng: 0
          }
        
          constructor(props) {
            super(props);
            this.mapRef = React.createRef();
          }
        
          public componentDidMount() {
            navigator.geolocation.watchPosition(
              this.handleGeoSuccess,
              this.handleGeoError
            )
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
                    mapRef={this.mapRef}
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
            });
          };
        
          public handleGeoSuccess: PositionCallback = (position: Position) => {
            const {
              coords: { latitude, longitude } 
            } = position;
            this.setState({
              lat: latitude,
              lng: longitude
            });
            this.loadMap(latitude, longitude);
          };
        
          public handleGeoError: PositionErrorCallback = () => {
            console.error("No location");
          }
        
          public loadMap = (lat, lng) => {
            const { google } = this.props;
            const maps = google.maps;
            const mapNode = ReactDOM.findDOMNode(this.mapRef.current);
            const mapConfig: google.maps.MapOptions = {
              center: {
                lat,
                lng
              },
              disableDefaultUI: true,
              zoom: 11
            };
            this.map = new maps.Map(mapNode, mapConfig);
          }
        }
        
        export default HomeContainer;

*이제 Home에서도 google maps가 뜬다.* 

브라우저의 navigator API는 현재 위치를 찾아주기도 하지만, watch API도 있다. 이 API는 반복해서 위치를 얻어서 뿌려준다. `navigator.geolocation.watchPosition` 를 사용하는 것이다. 성공 콜백과 실패 콜백, 그리고 옵션을 인자로 받는다.

- src/routes/Home/HomeContainer.tsx

        ...
        
        public loadMap = (lat, lng) => {
        
        ...
        
            this.map = new maps.Map(mapNode, mapConfig);
            const watchOptions: PositionOptions = {
              enableHighAccuracy: true
            };
            navigator.geolocation.watchPosition(
              this.handleGeoWatchSuccess,
              this.handleGeoError,
              watchOptions
            );
          };
        
          public handleGeoWatchSuccess: PositionCallback = (position: Position) => {
            console.log(position);
            return;
          }
          
          public handleGeoWatchError: PositionErrorCallback = () => {
            console.error("No location");
          }
        };
        
        export default HomeContainer;

[http://localhost:3000/](http://localhost:3000/) 페이지를 열고 크롬 브라우저에서 censors를 사용하여 위치를 변경해보자. 메뉴의 위치를 모르면 스샷을 참고하자.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952572/tlog/_2019-05-24__9-5537d549-b4bf-47f3-8987-e3312ed1580a.24.56_twdy3b.png)

 

나는 위치를 도쿄로 바꾸어 보았다. 콘솔에서도 도코의 위치를 찍는 것을 확인할 수 있다. watch 가 제대로 동작한다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952572/tlog/_2019-05-24__9-fec6bd13-b2e2-48f4-8920-6e5055f6080f.25.22_omb34n.png)

이번에 할 것은 google maps의 marker를 사용하는 것이다. 원하는 위치에 marker를 생성하면 지도를 확대하거나 이동하더라도 위치를 잡아준다. 이 기능을 활용하면 주변 장소에 대한 정보를 더 정확히 나타내줄 수 있다.

- src/routes/Home/HomeContainer.tsx   loadMap할 때, 초기 위치에 동그란 마커를 추가 했다.

        public loadMap = (lat, lng) => {
        ...
        	const userMarkerOption: google.maps.MarkerOptions = {
              icon: {
                path: maps.SymbolPath.CIRCLE,
                scale: 7
              },
              position: {
                lat,
                lng
              }
            };
            this.userMarker = new maps.Marker(userMarkerOption);
            this.userMarker!.setMap(this.map);
        }

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952592/tlog/_2019-05-24__9-ac72ccdc-6e9a-47fe-a4bd-a729783e3875.37.32_qphjky.png)

## #2.55 HomeScreen Moving *with* the User

이번에는 내 위치를 watch를 하여 지도에서 계속 따라가서 갱신하는 것을 해보자. 마치, 내비게이션 앱 처럼 말이다.

- src/routes/Home/HomeContainer.tsx    일단 `handleGeoWatchSuccess`에서 위치를 갱신하도록 수정했다. 그런데 이렇게하면 하면 위치가 변경될 때 새로고침이 되었다. `componentDidMount` 에서 `watchPosition`  대신 `getCurrentPosition`을 사용하도록 했다.

        ...
        
          public componentDidMount() {
            navigator.geolocation.getCurrentPosition(
              this.handleGeoSuccess,
              this.handleGeoError
            )
          }
        
          ..
        
          public handleGeoWatchSuccess: PositionCallback = (position: Position) => {
            const {
              coords: { latitude: lat, longitude: lng }
            } = position;
            this.userMarker!.setPosition({ lat, lng });
            this.map!.panTo({ lat, lng });
          }
          
        ...

서버를 띄운 후 조금 확대를 하자.(주변에 위치한 장소 내용이 보일 정도). 위치 센서를 조절할 때 0.0001 단위씩 이동해야 실제 사람이 이동하는 위치 단위로 이동하는 것처럼 보일 것이다.

## #2.56 HomeScreen Creating Route Markers

이어서 나의 위치를 표시했고, 나의 목적지를 찾아서 지도에 표시를 해보자. 목적지를 표시할 toMarker를 만들고 목적지의 위도, 경도인 toLat, toLng를 state로 가질 것이다.

- src/routes/Home/HomeContainer.tsx

        
        ...
        import { USER_PROFILE } from "sharedQueries.queries";
        import { getCode } from "../../lib/mapHelpers";
        import { userProfile } from "../../types/api";
        
        ...
        
        interface IState {
          isMenuOpen: boolean;
          toAddress: string;
          toLat: number;
          toLng: number;
          lat: number;
          lng: number;
        }
        
        ...
        
          public userMarker: google.maps.Marker | null = null;
          public toMarker: google.maps.Marker | null = null;
        
          public state = {
            isMenuOpen: false,
            lat: 0,
            lng: 0,
            toAddress: "",
            toLat: 0,
            toLng: 0,
          }
        
         ...
        
          public render() {
            const { isMenuOpen, toAddress } = this.state;
            return (
              <ProfileQuery query={USER_PROFILE}>
                {({ loading }) => (
                  <HomePresenter 
                    loading={loading}
                    isMenuOpen={isMenuOpen} 
                    toggleMenu={this.toggleMenu}
                    mapRef={this.mapRef}
                    toAddress={toAddress}
                    onInputChange={this.onInputChange}
                    onAddressSubmit={this.onAddressSubmit}
                  />
                )}
              </ProfileQuery>
            )
          }
          
        
          public loadMap = (lat, lng) => {
            ...
              zoom: 13
            };
            this.map = new maps.Map(mapNode, mapConfig);
        
        ...
        
          public onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
            const {
              target: { name, value }
            } = event;
            this.setState({
              [name]: value
            } as any);
          }
        
          public onAddressSubmit = async () => {
            const { toAddress } = this.state;
            const { google } = this.props;
            const maps = google.maps;
            const result = await getCode(toAddress);
            if (result !== false ) {
              const { lat, lng, formatted_address: formattedAddress } = result;
              this.setState({
                toAddress: formattedAddress,
                toLat: lat,
                toLng: lng
              });
              if (this.toMarker) {
                this.toMarker.setMap(null);
              }
              const toMarkerOptions: google.maps.MarkerOptions = {
                position: {
                  lat,
                  lng
                }
              };
              this.toMarker = new maps.Marker(toMarkerOptions);
              this.toMarker!.setMap(this.map);
            }
          }
        };
        
        export default HomeContainer;

- src/routes/Home/HomePresenter.tsx

        import AddressBar from "components/AddressBar";
        import Button from "components/Button";
        import Menu from "components/Menu";
        import React from "react";
        import Helmet from "react-helmet";
        import Sidebar from "react-sidebar";
        import styled from "../../typed-components";
        
        const Container = styled.div``;
        
        const MenuButton = styled.button`
          appearance: none;
          padding: 10px;
          position: absolute;
          top: 10px;
          left: 10px;
          border: 0;
          cursor: pointer;
          z-index: 2;
        `;
        
        const ExtendedButton = styled(Button)`
          position: absolute;
          height: auto;
          width: 80%;
          left: 0;
          right: 0;
          margin: auto;
          bottom: 50px;
          z-index: 10;
        `;
        
        const Map = styled.div`
          position: absolute;
          height: 100%;
          width: 100%;
        `;
        
        interface IProps {
          loading: boolean;
          isMenuOpen: boolean;
          toggleMenu: () => void;
          mapRef: any;
          toAddress: string;
          onAddressSubmit: any;
          onInputChange: React.ChangeEventHandler<HTMLInputElement>;
        }
        
        const HomePresenter: React.SFC<IProps> = ({
          loading, 
          isMenuOpen, 
          toggleMenu,
          mapRef,
          toAddress,
          onInputChange,
          onAddressSubmit,
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
              {!loading && (<MenuButton onClick={toggleMenu}>
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M24 18v1h-24v-1h24zm0-6v1h-24v-1h24zm0-6v1h-24v-1h24z" fill="#1040e2"/><path d="M24 19h-24v-1h24v1zm0-6h-24v-1h24v1zm0-6h-24v-1h24v1z"/></svg>
              </MenuButton>)}
              <AddressBar
                name="toAddress"
                onChange={onInputChange}
                value={toAddress}
                onBlur={() => ""}
              />
              <ExtendedButton
                onClick={onAddressSubmit}
                disabled={toAddress === ""}
                value="Pick Address"
              />
              <Map ref={mapRef}/>
            </Sidebar>
          </Container>
        )
        
        export default HomePresenter;

이제 주변 위치를 검색하고 PICK Address 버튼 누르면 목적지가 지도에 표시 된다. 아직은  현재 위치와 목적지의 경로를 보여주는 것은 안된다.

나는 테스트할 떄 위치를 도쿄로 잡았고, tokyo tower를 주로 검색했다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952591/tlog/_2019-06-10__8-42636f45-1562-4d55-b3b0-3094b3191cd4.15.32_vorj9q.png)