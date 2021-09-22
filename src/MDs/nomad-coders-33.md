---
title: 33 우버 클론 코딩 (nomad coders)
date: '2019-06-28T08:56:56.243Z'
description: 우버 코딩 강의 로그 2.68 ~ 2.69
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1632302785/tlog/cover/nuber_clone_nllng2.jpg'
tags:
  - 'Clone Coding'
  - 'Nomad Coder'
  - GraphQL
---
# 

이 포스트는 nomad coders의 우버 클론 코딩 시리즈를 듣고 정리한 글 입니다.

[https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course](https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course)

이번 강의는 며칠이 걸린건지.. 상당히 오래 걸렸다. 니콜라스가 했던 코드 외에 조금 변경한 것들 때문에 조금 고생했다.

## #2.68 Getting Nearby Rides part One

근처의 Ride 요청을 받아오도록 하자. 먼저 Query를 작성하고 호출 하도록 하자. (아무래도 HomeContainer가 너무 비대해지고 있어서, 가능하면 탑승자일 때랑 운전자일때랑 구분해서 처리하는게 좋지 않을까하고 생각한다.)

- src/routes/Home/Home.queries.ts     `GET_NEARBY_RIDE` 를 작성 후 yarn codegen을 실행하자.

        ...
        
        export const GET_NEARBY_RIDE = gql`
          query getRides {
            GetNearbyRide {
              ok
              error
              ride {
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
          }
        `;

- src/routes/Home/HomeContainer.ts    getRides 쿼리를 실행할 수 있도록 추가했다.

        import { getCode, reverseGeoCode } from "lib/mapHelpers";
        import React from "react";
        import { graphql, Mutation, MutationFn, Query } from "react-apollo";
        import ReactDOM from 'react-dom';
        import { RouteComponentProps } from "react-router";
        import { toast } from 'react-toastify';
        import { USER_PROFILE } from "sharedQueries.queries";
        import { 
          getDrivers,
          getRides,
          reportMovement,
          reportMovementVariables,
          requestRide,
          requestRideVariables,
          userProfile } from "../../types/api";
        import { 
          GET_NEARBY_DRIVERS, 
          GET_NEARBY_RIDE,
          REPORT_LOCATION,
          REQUEST_RIDE
        } from './Home.queries';
        import HomePresenter from "./HomePresenter";
        
        interface IProps extends RouteComponentProps<any> {
          google: any;
          reportLocation: MutationFn;
        }
        
        interface IState {
          isMenuOpen: boolean;
          toAddress: string;
          toLat: number;
          toLng: number;
          lat: number;
          lng: number;
          distance: string;
          distanceValue: number;
          duration: string;
          price: number;
          fromAddress: string;
          isDriving: boolean;
        }
        
        class ProfileQuery extends Query<userProfile> {}
        class NearbyQuery extends Query<getDrivers> {}
        class RequestRideMutation extends Mutation<requestRide, requestRideVariables> {}
        class GetNearbyRides extends Query<getRides> {}
        
        class HomeContainer extends React.Component<IProps, IState> {
          public mapRef: any;
          public map: google.maps.Map | null = null;
          public userMarker: google.maps.Marker | null = null;
          public toMarker: google.maps.Marker | null = null;
          public directions: google.maps.DirectionsRenderer | null = null;
          public drivers: google.maps.Marker[];
        
          public state = {
            distance: "",
            distanceValue: 0,
            duration: "",
            fromAddress: "",
            isDriving: true,
            isMenuOpen: false,
            lat: 0,
            lng: 0,
            price: 0,
            toAddress: "",
            toLat: 0,
            toLng: 0,
          }
        
          constructor(props) {
            super(props);
            this.mapRef = React.createRef();
            this.drivers = [];
          }
        
          public componentDidMount() {
            navigator.geolocation.getCurrentPosition(
              this.handleGeoSuccess,
              this.handleGeoError
            )
          }
        
          public render() {
            const { 
              isMenuOpen, 
              toAddress, 
              price,
              distance,
              fromAddress,
              lat,
              lng,
              toLat,
              toLng,
              duration,
              isDriving,
            } = this.state;
        
            return (
              <ProfileQuery query={USER_PROFILE} onCompleted={this.handleProfileQuery}>
                {({ data, loading: profileLoading}) => (
                  <NearbyQuery 
                    query={GET_NEARBY_DRIVERS}
                    pollInterval={1000}
                    skip={isDriving}
                    onCompleted={this.handleNearbyDrivers}
                  >
                    {() => (
                      <RequestRideMutation
                        mutation={REQUEST_RIDE}
                        onCompleted={this.handleRideRequest}
                        variables={{
                          distance,
                          dropOffAddress: toAddress,
                          dropOffLat: toLat,
                          dropOffLng: toLng,
                          duration,
                          pickUpAddress: fromAddress,
                          pickUpLat: lat,
                          pickUpLng: lng,
                          price,
                        }}
                      >
                        {requestRideMutation => (
                          <GetNearbyRides query={GET_NEARBY_RIDE} skip={!isDriving}>
                            {({ data: nearbyRide }) => ( console.log(nearbyRide),
                              <HomePresenter 
                                loading={profileLoading}
                                isMenuOpen={isMenuOpen} 
                                toggleMenu={this.toggleMenu}
                                mapRef={this.mapRef}
                                toAddress={toAddress}
                                onInputChange={this.onInputChange}
                                onAddressSubmit={this.onAddressSubmit}
                                price={price}
                                requestRideMutation={requestRideMutation}
                              />
                            )}
                          </GetNearbyRides>
                        )}
                      </RequestRideMutation>
                    )}
                  </NearbyQuery>
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
            this.getFromAddress(latitude, longitude);
            this.loadMap(latitude, longitude);
          };
        
          public handleGeoError: PositionErrorCallback = () => {
            console.error("No location");
          }
        
          public getFromAddress = async (lat: number, lng: number) => {
            const address = await reverseGeoCode(lat, lng);
            if (address) {
              this.setState({
                fromAddress: address
              });
            }
          };
        
          public handleRideRequest = (data: requestRide) => {
            const { RequestRide } = data;
            if (RequestRide.ok) {
              toast.success("Drive requested, finding a driver");
            } else {
              toast.error(RequestRide.error);
            }
          };
        
          public handleProfileQuery = (data: userProfile) => {
            const { GetMyProfile } = data;
            if (GetMyProfile ) {
              const {
                user
              } = GetMyProfile || { user: {}};
              this.setState({
                isDriving: user!.isDriving
              });
            }
          };
        
          public loadMap = (lat, lng) => {
            const { google } = this.props;
            const maps = google.maps;
            const mapNode = ReactDOM.findDOMNode(this.mapRef.current);
            if (!mapNode) {
              this.loadMap(lat, lng);
              return;
            }
            const mapConfig: google.maps.MapOptions = {
              center: {
                lat,
                lng
              },
              disableDefaultUI: true,
              zoom: 13
            };
            this.map = new maps.Map(mapNode, mapConfig);
        
            const watchOptions: PositionOptions = {
              enableHighAccuracy: true
            };
            navigator.geolocation.watchPosition(
              this.handleGeoWatchSuccess,
              this.handleGeoError,
              watchOptions
            );
        
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
          };
        
          public handleGeoWatchSuccess: PositionCallback = (position: Position) => {
            const { reportLocation } = this.props;
            const {
              coords: { latitude: lat, longitude: lng }
            } = position;
            this.userMarker!.setPosition({ lat, lng });
            this.map!.panTo({ lat, lng });
            reportLocation({
              variables: {
                lat,
                lng
              }
            });
          }
          
          public handleGeoWatchError: PositionErrorCallback = () => {
            console.error("No location");
          }
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
              
              this.setState({
                toAddress: formattedAddress,
                toLat: lat,
                toLng: lng
              }, () => {
                this.setBounds();
                this.createPath();
              });
            }
          }
        
          public setBounds = () => {
            const { lat, lng, toLat, toLng } = this.state;
            const { google: { maps } } = this.props;
            const bounds = new maps.LatLngBounds();
            bounds.extend({ lat, lng });
            bounds.extend({ lat: toLat, lng: toLng });
            this.map!.fitBounds(bounds);
          }
          public createPath = () => {
            const { lat, lng, toLat, toLng } = this.state;
            const { google } = this.props;
            if (this.directions) {
              this.directions.setMap(null);
            }
            const renderOptions: google.maps.DirectionsRendererOptions = {
              polylineOptions: {
                strokeColor: "#000"
              },
              suppressMarkers: true
            }
        
            this.directions = new google.maps.DirectionsRenderer(renderOptions);
            const directionsService: google.maps.DirectionsService = new google.maps.DirectionsService();
            const from = new google.maps.LatLng(lat, lng);
            const to = new google.maps.LatLng(toLat, toLng);
            const directionsOptions:google.maps.DirectionsRequest = {
              destination: to,
              origin: from,
              travelMode: google.maps.TravelMode.DRIVING
            };
            
            directionsService.route(directionsOptions, this.handleRouteRequest);
          }
          public handleRouteRequest = (
            result: google.maps.DirectionsResult, 
            status: google.maps.DirectionsStatus 
          ) => {
            const { google } = this.props;
            if (status === google.maps.DirectionsStatus.OK) {
              const { routes } = result;
              const {
                distance: { value: distanceValue, text: distance },
                duration: { text: duration }
              } = routes[0].legs[0];
              this.setState({
                distance,
                distanceValue,
                duration,
                price: this.carculatePrice(distanceValue)
              });
              this.directions!.setDirections(result);
              this.directions!.setMap(this.map);
            } else {
              toast.error("There is no route there.");
            }
          };
        
          public carculatePrice = (distanceValue: number) => {
            return distanceValue ? Number.parseFloat((distanceValue * 0.003).toFixed(2)) : 0
          };
        
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
        
        export default graphql<any, reportMovement, reportMovementVariables> (
          REPORT_LOCATION,
          {
            name: "reportLocation"
          }
        )(HomeContainer);

수정한 내용은 얼마 없지만,, 코드가 너무 길어진다. 그렇다고 부분부분을 설명하기도 조금 애매하다.

아직 Presenter에게는 넘기지 않았서어기능은 작동하지 않는다.

운전자 쪽에서 새로고침 하면 콘솔에 ride 정보가 보일 것이다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952573/tlog/_2019-05-30__7-483b7d56-ce4d-4af4-8cfb-4e8416eb91d0.23.12_pkodau.png)

`<GetNearbyRides` 쪽에 쿼리의 결과를 콘솔에 찍도록 했다. 콘솔 코드는 이 코드는 곧 다음 강좌를 마치고 제거할 예정이다.

## #2.69 Getting Nearby Rides part Two

이어서는 운전자가 주변에 요청된 Ride를 가져왔다. 이 내용을 팝업으로 UI에 띄우고 운전자가 이 요청을 수락할 수 있는 버튼을 두자.

먼저, 팝업 UI를 만들자.

- src/components/RidePopUp/RidePopUp.tsx

        import React from 'react';
        import styled from '../../typed-components';
        import Button from '../Button';
        
        interface IProps {
          pickUpAddress: string;
          dropOffAddress: string;
          price: number;
          distance: string;
          passengerName: string;
          passengerPhoto: string;
          acceptRideMutation: any;
          id: number;
        }
        
        const Container = styled.div`
          background-color: white;
          position: absolute;
          margin: auto;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          max-width: 30rem;
          height: 40rem;
          z-index: 9;
          padding: 20px;
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
          margin-left: 20px;
          width: 10rem;
        `;
        
        const Passenger = styled.div`
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        `;
        
        const RidePopUp: React.SFC<IProps> = ({
          pickUpAddress,
          dropOffAddress,
          price,
          distance,
          passengerName,
          passengerPhoto,
          acceptRideMutation,
          id
        }) => (
          <Container>
            <Title>Pick Up Address</Title>
            <Data>{pickUpAddress}</Data>
            <Title>Drop Off Address</Title>
            <Data>{dropOffAddress}</Data>
            <Title>Price</Title>
            <Data>{`$ ${price}`}</Data>
            <Title>Distance</Title>
            <Data>{distance}</Data>
            <Title>Passenger</Title>
            <Passenger>
              <Data>{passengerName}</Data>
              <Img src={passengerPhoto} />
            </Passenger>
            <Button
              onClick={() => acceptRideMutation({ variables: { rideId: id }})}
              value="Accept Ride"
            />
          </Container>
        )
        
        export default RidePopUp;

- src/components/RidePopUp/index.ts

        export { default } from './RidePopUp';

아까 받은 nearbyRide 의 결과로 ride 객체가 들어 있는데, 이객체를 Container에서 Presenter로 넘겼다. 이제 Presenter에서는 받은 값 중에 정상적으로 ride가 있을 때 화면에 팝업을 띄우도록 하자.

- src/routes/Home/HomePresenter.tsx    `RidePopUp` 컴포넌트를 불러왔고, `getRides` 타입을 가져왔다.

        import React from "react";
        import { MutationFn } from "react-apollo";
        import Helmet from "react-helmet";
        import Sidebar from "react-sidebar";
        import AddressBar from "../../components/AddressBar";
        import Button from "../../components/Button";
        import Menu from "../../components/Menu";
        import RidePopUp from "../../components/RidePopUp";
        import styled from "../../typed-components";
        import { 
          getRides,
          requestRide, 
          requestRideVariables ,
          userProfile, 
        } from "../../types/api";
        
        interface IProps {
          ...
          nearbyRide?: getRides | undefined;
        }
        
        const HomePresenter: React.SFC<IProps> = ({
          ...
          nearbyRide: { GetNearbyRide } = { GetNearbyRide: null},
        }) => (
          <Container>
            ...
              {!price ? false : (
                <RequestButton
                  ...
                />
              )}
              {GetNearbyRide && GetNearbyRide.ride && (
                <RidePopUp
                  id={GetNearbyRide.ride.id}
                  pickUpAddress={GetNearbyRide.ride.pickUpAddress}
                  dropOffAddress={GetNearbyRide.ride.dropOffAddress}
                  price={GetNearbyRide.ride.price}
                  distance={GetNearbyRide.ride.distance}
                  passengerName={GetNearbyRide.ride.passenger!.fullName || ""}
                  passengerPhoto={GetNearbyRide.ride.passenger!.profilePhoto || ""}
                  acceptRideMutation={null}
                />
              )}
              <Map ref={mapRef}/>
            </Sidebar>
          </Container>
        )
        
        export default HomePresenter;

- src/routes/Home/HomeContainer.tsx    콘솔로 찍는 코드를 제거 하고 Presenter에 `nearbyRide`를 추가적으로 전달했다.

        ...
        <GetNearbyRides query={GET_NEARBY_RIDE} skip={!isDriving}>
          {({ data: nearbyRide }) => (
            <HomePresenter 
        			...
        			nearbyRide={nearbyRide}
            />
          )}
        </GetNearbyRides>
        ...

    이제 운전자 계정으로 보면 아까 요청한 탑승자의 정보를 볼 수 있다.

    ![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952590/tlog/_2019-06-01__6-e6e921c4-0e38-4ae5-bc8c-37574f6af74c.18.29_sdy2p6.png)

이어서 이제 운전자가 Accept 버튼을 누르면  ride의 `REQUESTING` 상태를 `ACCEPT`로 변경하게 해야 한다. 먼저 mutaiton을 작성하고 yarn codegen을 하자.

- src/routes/Home/Home.queries.ts        아래 mutaiton을 작성하고 yarn codegen

        ...
        export const ACCEPT_RIDE = gql`
        mutation acceptRide($rideId: Int!) {
          UpdateRideStatus(rideId: $rideId, status: ACCEPTED) {
            ok
            error
        		rideId
          }
        }
        `;

- src/routes/Home/HomeContainer.tsx    AcceptRide 뮤테이션을 추가 하여 Presenter에 넘긴다.

        ...
        import { 
          acceptRide,
          acceptRideVariables,
          ...
          userProfile } from "../../types/api";
        import { 
          ACCEPT_RIDE,
          ...
        } from './Home.queries';
        
        ...
        
        class GetNearbyRides extends Query<getRides> {}
        class AcceptRide extends Mutation<acceptRide, acceptRideVariables> {}
        
        ...
                      >
                        {requestRideMutation => (
                          <GetNearbyRides query={GET_NEARBY_RIDE} skip={!isDriving}>
                            {({ data: nearbyRide }) => (
                              
                            )}
                          </GetNearbyRides>
                        )}
        ...

- src/routes/Home/HomePresenter.tsx

        ...
        
        import { 
          acceptRide,
          acceptRideVariables, 
          getRides, 
          requestRide, 
          requestRideVariables,
          userProfile,
        } from "../../types/api";
        
        interface IProps {
          ...
          acceptRideMutation?: MutationFn<acceptRide, acceptRideVariables>;
        }
        
        const HomePresenter: React.SFC<IProps> = ({
          ...
          acceptRideMutation,
        }) => (
          <Container>
            ...
              {GetNearbyRide && GetNearbyRide.ride && (
                <RidePopUp
                  ...
                  acceptRideMutation={acceptRideMutation}
                />
              )}
              <Map ref={mapRef}/>
            </Sidebar>
          </Container>
        )
        
        export default HomePresenter;

ACCEPT RIDE 버튼을 누르고 반응 없지만, pgAdmin을 통해 디비를 보자. ride 테이블의 레코드를 보면 `REQUESTING`에서 `ACCEPT`가 되었다.

두 강의는 상당히 할 일이 많고 이것저것 헤맨것도 많았다. 특히 중복으로 Query를 작성하기 때문에 위에서 data: A, 아래에서  data 로 하고 자꾸 내용을 보려고 하니까,, 의도하지 않은 내용을 확인하게 되어서 헤맸다.