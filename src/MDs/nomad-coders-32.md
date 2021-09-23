---
title: 32 우버 클론 코딩 (nomad coders)
date: '2019-06-26T08:56:56.243Z'
description: 우버 코딩 강의 로그 2.66 ~ 2.67
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1632302785/tlog/cover/nuber_clone_nllng2.jpg'
tags:
  - 'Uber Clone Coding'
  - 'Nomad Coder'
  - GraphQL
---
# 

이 포스트는 nomad coders의 우버 클론 코딩 시리즈를 듣고 정리한 글 입니다.

[https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course](https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course)

## #2.66 Ejecting from Apollo Boost

Apollo-Boost라는 만능 라이브러리를 사용했는데, 이번에는 세부 라이브러리로 쪼개어 적용한다. Apollo-boost는 아래에 열거된 라이브러리를 모은 모듈이라고 생각하면 될 것 같다.

    $ yarn add apollo-cache-inmemory apollo-client apollo-link apollo-link-error apollo-link-http apollo-link-state apollo-link-ws apollo-utilities subscriptions-transport-ws

- src/apollo.ts

        import { InMemoryCache } from "apollo-cache-inmemory";
        import { ApolloClient } from "apollo-client";
        import { ApolloLink, concat, Operation, split } from "apollo-link";
        import { onError } from "apollo-link-error";
        import { HttpLink } from "apollo-link-http";
        import { withClientState } from 'apollo-link-state';
        import { WebSocketLink } from 'apollo-link-ws';
        import { getMainDefinition } from 'apollo-utilities';
        import { toast } from 'react-toastify';
        
        const getToken = () => {
          const token = localStorage.getItem('jwt');
          return token || "";
        };
        
        const cache = new InMemoryCache();
        
        const authMiddleware = new ApolloLink((operation: Operation, forward: any) => {
          operation.setContext({
            headers: {
              "X-JWT": getToken()
            }
          });
          return forward(operation);
        });
        
        const httpLink = new HttpLink({
          uri: "http://localhost:4000/graphql"
        });
        
        const wsLink = new WebSocketLink({
          options: {
            connectionParams: {
              "X-JWT": getToken()
            },
            reconnect: true
          },
          uri: "ws://localhost:4000/subscription"
        });
        
        const combinedLinks = split(
          ({ query }) => {
            const { kind, operation }: any = getMainDefinition(query);
            return kind === "OperationDefinition" && operation === "subscription";
          },
          wsLink,
          httpLink
        );
        
        const errorLink = onError(({ graphQLErrors, networkError }) => {
          if (graphQLErrors) {
            graphQLErrors.map(({ message }) => {
              toast.error(`Unexpected error: ${message}`);
            });
          }
          if (networkError) {
            toast.error(`Network error: ${networkError}`);
          }
        });
        
        const localStateLink = withClientState({
          cache,
          defaults: {
            auth: {
              __typename: "Auth",
              isLoggedIn: Boolean(localStorage.getItem("jwt"))
            }
          },
          resolvers: {
            Mutation: {
              logUserIn: (_, { token }, { cache: appCache }) => {
                localStorage.setItem("jwt", token);
                cache.writeData({
                  data: {
                    auth: {
                      __typename: "Auth",
                      isLoggedIn: true,
                    }
                  }
                });
                return null;
              },
              logUserOut: (_, __, { cache: appCache }) => {
                localStorage.removeItem("jwt");
                cache.writeData({
                  data: {
                    auth: {
                      __typename: "Auth",
                      isLoggedIn: false,
                    }
                  }
                });
                return null;
              },
            }
          }
        });
        
        const apolloClient = new ApolloClient({
          cache,
          link: ApolloLink.from([
            errorLink,
            localStateLink,
            concat(authMiddleware, combinedLinks)
          ])
        });
        
        export default apolloClient;

이전 코드랑 비교해 볼때, 역할 별로 좀더 분리해서 조립하는 형태로 변경했다. 옛날 코드를 보면서 어떤 부분이 어떤 부분으로 분리가 되었는지 확인해보면 좋을 것 같다. 

- src/apollo.ts   예전 버전 코드

        import ApolloClient, { Operation } from 'apollo-boost';
        
        const apolloClient = new ApolloClient({
          clientState: {
            defaults: {
              auth: {
                __typename: "Auth",
                isLoggedIn: Boolean(localStorage.getItem("jwt"))
              }
            },
            resolvers: {
              Mutation: {
                logUserIn: (_, { token }, { cache }) => {
                  localStorage.setItem("jwt", token);
                  cache.writeData({
                    data: {
                      auth: {
                        __typename: "Auth",
                        isLoggedIn: true,
                      }
                    }
                  });
                  return null;
                },
                logUserOut: (_, __, { cache }) => {
                  localStorage.removeItem("jwt");
                  cache.writeData({
                    data: {
                      auth: {
                        __typename: "Auth",
                        isLoggedIn: false,
                      }
                    }
                  });
                  return null;
                },
              }
            }
          },
          request: async (operation: Operation) => {
            operation.setContext({
              headers: {
                "X-JWT": localStorage.getItem("jwt")
              }
            });
          },
          uri: "http://localhost:4000/graphql"
        });
        
        export default apolloClient;

> 아래 문제는 이전에 애초에 fetchPolicy="no-chche" 로 설정하여서 발생하지 않을 수 있다.

- src/routes/EditAccount/EditAccountContainer.tsx   이렇게 모듈별로 분리하니까 `fetchPolicy` 가 "cache-and-network"가 안된다고 린트 오류가 떴다.. 문서를 찾아보니 `fetchPolicy`의 값에서 제외되었고, watchFetchPolicy에서 사용할 수 있는데, HOC Query에서는 사용할 수 없다. 그냥 no-cache로 항상 가져오도록 하자.

        ...
        			<ProfileQuery 
                query={USER_PROFILE} 
                onCompleted={this.updateFields}
                fetchPolicy="no-cache"
              >
        ...

아마 apollo-boost에서 의존하는 어떤 모듈이 버전이 낮은가 보다. 캐시 관련이니까 캐시 모듈인가..

## #2.67 RequestRide Mutation

이전에 Request Ride 버튼만 생성만 해뒀는데, 서버로 Request Ride를 생성하는 Mutation을 만들자.

- src/routes/Home/Home.queries.ts  새로운 Mutation을 작성하고 yarn codegen을 실행하자.

        ...
        
        export const REQUEST_RIDE = gql`
          mutation requestRide(
            $pickUpAddress: String!
            $pickUpLat: Float!
            $pickUpLng: Float!
            $dropOffAddress: String!
            $dropOffLat: Float!
            $dropOffLng: Float!
            $price: Float!
            $distance: String!
            $duration: String!
          ) {
            RequestRide(
              pickUpAddress: $pickUpAddress
              pickUpLat: $pickUpLat
              pickUpLng: $pickUpLng
              dropOffAddress: $dropOffAddress
              dropOffLat: $dropOffLat
              dropOffLng: $dropOffLng
              price: $price
              distance: $distance
              duration: $duration
            ) {
              ok
              error
              ride {
                id
              }
            }
          }
        `;

- src/routes/Home/HomeContainer.tsx   이젠 정말 정말 덩치가 커진 HomeContainer...

        import { getCode, reverseGeoCode } from "lib/mapHelpers";
        import React from "react";
        import { graphql, Mutation, MutationFn, Query } from "react-apollo";
        import ReactDOM from 'react-dom';
        import { RouteComponentProps } from "react-router";
        import { toast } from 'react-toastify';
        import { USER_PROFILE } from "sharedQueries.queries";
        import { 
          getDrivers,
          reportMovement,
          reportMovementVariables,
          requestRide,
          requestRideVariables,
          userProfile } from "../../types/api";
        import { 
          GET_NEARBY_DRIVERS, 
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
          fromAddress: string
        }
        
        
        class ProfileQuery extends Query<userProfile> {}
        class NearbyQuery extends Query<getDrivers> {}
        class RequestRideMutation extends Mutation<requestRide, requestRideVariables> {}
        
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
            } = this.state;
        
            return (
              <ProfileQuery query={USER_PROFILE}>
                {({ data, loading: profileLoading}) => (
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
                    {() => (
                      <RequestRideMutation
                        mutation={REQUEST_RIDE}
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
                            requestRideMutation={requestRideMutation}
                          />
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

- src/routes/Home/HomePresenter.tsx    RequestButton버튼을 클릭했을 때 `requestRideMutation` 이 호출 되도록 하자.

        import Button from "components/Button";
        import Menu from "components/Menu";
        import React from "react";
        import { MutationFn } from "react-apollo";
        import Helmet from "react-helmet";
        import Sidebar from "react-sidebar";
        import AddressBar from "../../components/AddressBar";
        import styled from "../../typed-components";
        import { 
          requestRide, 
          requestRideVariables ,
          userProfile, 
        } from "../../types/api";
        ...
        
        interface IProps {
          ...
          requestRideMutation?: MutationFn;
        }
        
        const HomePresenter: React.SFC<IProps> = ({
          ...
        	requestRideMutation?: MutationFn<requestRide, requestRideVariables>;
        }) => (
        
        ...
              {!price ? false : (
                <RequestButton
                  onClick={requestRideMutation}
                  disabled={toAddress === ""}
                  value={`Request Ride ($${price})`}
                />
        ...

이제 새로운 요청을 만들어서 보자. 지도에서 근처 위치를 찍고 Request Ride 버튼을 누르고, DB에서 확인해보자. 정상적으로 요청이 된다. 혹시 요청해도 아무 내용이 안뜨면 같은 아이디로 여러 요청을 한 것은 아닌지 확인해보자. 또는 현재 신청한 아이디가 isRiding 값이 true인건은 아닌지 확인해봐야 한다.