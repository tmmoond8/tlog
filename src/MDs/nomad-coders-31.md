---
title: 31 우버 클론 코딩 (nomad coders)
date: '2019-06-24T08:56:56.243Z'
description: 우버 코딩 강의 로그 2.61 ~ 2.65
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1632302785/tlog/cover/nuber_clone_nllng2.jpg'
tags:
  - 'Clone Coding'
  - 'Nomad Coder'
  - GraphQL
---
# 

이 포스트는 nomad coders의 우버 클론 코딩 시리즈를 듣고 정리한 글 입니다.

[https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course](https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course)

## #2.61 NearbyDrivers Query

사용자는 주변에 운행 중인 드라이버 정보를 가져올 수 있다. Home으로 접근을 했을 때, 운전자가 아니면 운전자 쿼리를 날려서 운전자의 정보를 가져오도록 하자. 강의를 진행하다보니 역시 HomeContainer가 좀 방대해지는 기분이었다.

- src/routes/Home/Home.queries.ts    `GET_NEARBY_DRIVERS`를 정의했다. yarn codegen을 해주고

        ...
        
        export const GET_NEARBY_DRIVERS = gql`
          query getDrivers {
            GetNearbyDrivers {
              ok
              drivers {
                id
                lastLat
                lastLng
              }
            }
          }
        `;

- src/routes/Home/HomeContainer.tsx

        ...
        import { 
          getDrivers,
          reportMovement,
          reportMovementVariables,
          userProfile } from "../../types/api";
        import { GET_NEARBY_DRIVERS, REPORT_LOCATION } from './Home.queries';
        import HomePresenter from "./HomePresenter";
        
        ...
        
        class ProfileQuery extends Query<userProfile> {}
        class NearbyQuery extends Query<getDrivers> {}
        
        class HomeContainer extends React.Component<IProps, IState> {
         
        ...
        
          public render() {
            const { isMenuOpen, toAddress, price } = this.state;
            return (
              <ProfileQuery query={USER_PROFILE}>
                {({ data, loading: profileLoading}) => (
                  <NearbyQuery query={GET_NEARBY_DRIVERS}>
                    {() => (
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
                      />
                    )}
                  </NearbyQuery>
                )}
              </ProfileQuery>
            )
          }
        
        ...

- src/routes/Home/HomePresenter.tsx        `<AddressBar/>`, `<ExtendedButton/>` 의 위치를 조금 수정했다.

        ...
        import styled from "../../typed-components";
        import { userProfile } from "../../types/api";
        
        ...
        
        interface IProps {
          ...
          data?: userProfile;
        }
        
        const HomePresenter: React.SFC<IProps> = ({
          ...
          data: { GetMyProfile: { user = null } = {} } = { GetMyProfile: {}},
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
              {user && !user.isDriving && (
                <React.Fragment>
                  <AddressBar
                    name="toAddress"
                    onChange={onInputChange}
                    value={toAddress}
                    onBlur={() => ""}
                  />
                  <ExtendedButton
                    onClick={onAddressSubmit}
                    disabled={toAddress === ""}
                    value={price ? "Change address" : "Pick Address"}
                  />
                </React.Fragment>
              )}
              {!price ? false : (
                <RequestButton
                  onClick={onAddressSubmit}
                  disabled={toAddress === ""}
                  value={`Request Ride ($${price})`}
                />
              )}
              <Map ref={mapRef}/>
            </Sidebar>
          </Container>
        )
        
        export default HomePresenter;

이번 강의는 딱 어떤 기능이 떨어지지는 않다. 그리고 실행시키면 깨진다.

## #2.62 NearbyDrivers Query part Two

니콜라스의 커밋 로그를 봤는데 2.62, 2.63, 커밋 로그가 없다.. 그래서 코드가 조금 헷갈린다. 그리고 강의가 끝나서도 뭔가 동작이 애매했다. 강의 뒤로 갈수록 프론트엔드 코드 이해하고 고치는게 좀 어려웠다.

- src/routes/Home/HomeContainer.tsx    skip속성을 사용해서 드라이버가 아닐 때만 주변 운전자를 요청하도록 했다. 그리고 완료 될 때 `handleNearbyDrivers`을 호출하였다. 지금은 주변 운전자 정보를 콘솔에 찍히도록 했다.

        ...
        
          public render() {
            const { isMenuOpen, toAddress, price } = this.state;
            return (
              <ProfileQuery query={USER_PROFILE}>
                {({ data, loading: profileLoading}) => (
                  <NearbyQuery 
                    query={GET_NEARBY_DRIVERS}
                    skip={
                      !!( data &&
                        data.GetMyProfile &&
                        data.GetMyProfile.user &&
                        data.GetMyProfile.user.isDriving
                      )
                    }
                    onCompleted={this.handleNearbyDrivers}
                  >
                    {() => (
                      <HomePresenter
                        ...
                      />
                    )}
                  </NearbyQuery>
                )}
              </ProfileQuery>
            )
          }
        
        ...
        
          public handleNearbyDrivers = (data: {} | getDrivers) => {
            if ("GetNearbyDrivers" in data) {
              const {
                GetNearbyDrivers: { drivers, ok }
              } = data;
              if (ok && drivers) {
                console.log(drivers);
              }
            }
          }
        };
        
        export default graphql<any, reportMovement, reportMovementVariables> (
          REPORT_LOCATION,
          {
            name: "reportLocation"
          }
        )(HomeContainer);

여기서 테스트는 운전자와 사용자 두개의 클라이언트가 필요하다. 크롬 시크릿창 하나를 띄워서 다른 아이디로 로긴한 후 운전자로 바꾼 다음에 사용자에서 새로고침 해보자.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952573/tlog/_2019-05-28__1-c44d43a1-7a4d-4948-8511-3f0f62af0c4b.47.15_yerh7m.png)

하나를 운전자로 바꾸고 사용자에서 새고로침 해보자. 빈 배열이 들어오면 정상적으로 처리가 된 것이다.

## #2.63 Drawing Nearby Drivers part One

주변에 드라이버를 찾았다. 그리고 지도에 드라이버를 마커로 나타내고 싶다. 

- src/routes/Home/HomeContainer.tsx    `drivers` 라는 마커를 담을 멤버를 배열로 추가했다. `loadMap` 에서 실패할 경우 재요청하도록 수정을 했다. `handleNearbyDrivers` 에서는 마커를 생성해서 지도에 나타내도록 수정했다.

        ...
          public directions: google.maps.DirectionsRenderer | null = null;
          public drivers: google.maps.Marker[];
        
          ...
        
          constructor(props) {
            super(props);
            this.mapRef = React.createRef();
            this.drivers = [];
          }
        
        ...
        
          public loadMap = (lat, lng) => {
            const { google } = this.props;
            const maps = google.maps;
            const mapNode = ReactDOM.findDOMNode(this.mapRef.current);
            if (!mapNode) {
              this.loadMap(lat, lng);
              return;
            }
            ...
          };
        
        
          ...
        
          public handleNearbyDrivers = (data: {} | getDrivers) => {
            if ("GetNearbyDrivers" in data) {
              const {
                GetNearbyDrivers: { drivers, ok }
              } = data;
              if (ok && drivers) {
        				const { google } = this.props;
                for (const driver of drivers) {
                  if(driver && driver.lastLat && driver.lastLng) {
                    const markerOptions: google.maps.MarkerOptions = {
                      icon: {
                        path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                        scale: 5
                      },
                      position: {
                        lat: driver.lastLat,
                        lng: driver.lastLng
                      }
                    };
                    const newMarker: google.maps.Marker = new google.maps.Marker(markerOptions);
                    this.drivers.push(newMarker);
                    newMarker.set("ID", driver.id);
                    newMarker.setMap(this.map);
                  }
                }
              }
            }
          }
        };
        ...

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952592/tlog/_2019-05-28__2-0f97e231-d27e-42f3-8f47-4facc8813cc1.28.33_jgqzm2.png)

화살표 같은 것으로 드라이버를 표시했다.

## #2.64 Drawing Nearby Drivers part Two

드라이버는 계속해서 이동을 하고 우리는 그 위치를 실시간으로 받아야 한다. 니콜라스는 polling 방식을 사용하는 방법이랑 refetching  하는 방법 두 가지가 있다고 했고, 두 개의 차이는 refetching은 무조거 가져오는 것이고, poling은 데이터가 있을 때만 가져온다고 한다.

- src/routes/Home/HomeContainer.tsx

        ...
        		<NearbyQuery 
              query={GET_NEARBY_DRIVERS}
              pollInterval={1000}
              skip={
                !!( data &&
                  data.GetMyProfile &&
                  data.GetMyProfile.user &&
                  data.GetMyProfile.user.isDriving
                )
              }
              onCompleted={this.handleNearbyDrivers}
            >
        ...

이렇게 하고 운전자의 위치를 조금씩 변경해보자. 

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952574/tlog/_2019-06-12__4-dbd78edc-825f-4652-a0a1-2f1b5a236eea.52.49_qdarkj.png)

사실 우리가 원하는 것 운전자의 이동에 따라 마커가 이동하는 것인데 지금은 새로 생성하고 있다. 다음 강의에서 마커를 이동하는 것을 진행할 예정이다. 아까 Marker를 만들 때 ID를 지정해준것이 있는데, 이렇게 컨트롤 하기 위함이다.

## #2.65 Drawing Nearby Drivers part Three

이번에는 운전자의 위치가 변하는 것에 따라 지도에서 업데이트 하도록 하자. 마커 중 id를 통해서 특정 마커를 찾아서 업데이트 해주면 된다. 니콜라스는 분기 처리했지만, 나는 create, update 함수를 생성하여 만들었다.

- src/routes/Home/HomeContainer.tsx

        ....
        
          public handleNearbyDrivers = (data: {} | getDrivers) => {
            if ("GetNearbyDrivers" in data) {
              const {
                GetNearbyDrivers: { drivers, ok }
              } = data;
              if (ok && drivers) {
                for (const driver of drivers) {
                  const existingDriverMarker: google.maps.Marker | undefined = this.drivers.find((driverMarker: google.maps.Marker) => {
                    const markerID = driverMarker.get("ID");
                    return markerID === driver!.id;
                  });
                  if(existingDriverMarker) {
                    this.updateDriverMarker(existingDriverMarker, driver);
                  } else {
                    this.createDriverMarker(driver);
                  }
                }
              }
            }
          }
        
          public createDriverMarker = (driver) => {
            if(driver && driver.lastLat && driver.lastLng) {
              const { google } = this.props;
              const markerOptions: google.maps.MarkerOptions = {
                icon: {
                  path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                  scale: 5
                },
                position: {
                  lat: driver.lastLat,
                  lng: driver.lastLng
                }
              };
              const newMarker: google.maps.Marker = new google.maps.Marker(markerOptions);
              if(newMarker) {
                this.drivers.push(newMarker);
                newMarker.set("ID", driver!.id);
                newMarker.setMap(this.map);
              }
            }
            return;
          }
        
          public updateDriverMarker = (marker: google.maps.Marker, driver) => {
            if(driver && driver.lastLat && driver.lastLng) {
              marker.setPosition({
                lat: driver.lastLat,
                lng: driver.lastLng
              });
              marker.setMap(this.map);
            }
            return;
          }
        };
        
        
        ....

    자연스럽지는 않지만 이미 존재하는 드라이버의 위치가 업데이트 되도록 처리를 했다.