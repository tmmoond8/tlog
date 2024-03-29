---
title: 28 우버 클론 코딩 (nomad coders)
date: '2019-06-19T08:56:56.243Z'
description: 우버 코딩 강의 로그 2.51 ~ 2.53
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632302785/tlog/cover/nuber_clone_nllng2.jpg'
tags:
  - 'Uber Clone Coding'
  - 'Nomad Coder'
  - Apollo
  - GraphQL
---

이 포스트는 nomad coders의 우버 클론 코딩 시리즈를 듣고 정리한 글 입니다.

[https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course](https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course)

## #2.51 Geocoding part One

handleDragEnd에서 lat, lng, address 모두 갱신해주는데, address의 값을 별도로 분리를 했다.

- src/routes/FindAddress/FindAddressContainer.tsx   `reverseGeocodeAddress`를 정의하여 address를 별로도 업데이트하는 함수를 만들었고, 처음 페이지가 로딩될때, 그리고 드래그 될 때 동작하도록 수정했다.
  ```tsx
  ...
  
    public handleGeoSuccess: PositionCallback = (position: Position) => {
      const {
        coords: { latitude, longitude }
      } = position;
      this.setState({
        lat: latitude,
        lng: longitude
      })
      this.loadMap(latitude, longitude);
      this.reverseGeocodeAddress(latitude, longitude);
    }
  
  ...
  
    public handleDragEnd = () => {
      if (!this.map) { return };
      const newCenter = this.map!.getCenter();
      const lat = newCenter.lat();
      const lng = newCenter.lng();
      
      this.setState({
        lat,
        lng
      });
      this.reverseGeocodeAddress(lat, lng);
    }
  
  ...
  
    public reverseGeocodeAddress = async (lat: number, lng: number) => {
      const reversedAddress = await reverseGeoCode(lat, lng);
      if (reversedAddress !== false) {
        this.setState({
          address: reversedAddress
        })
      }
    }
  }
  
  export default FIndAddressContainer;
  ```

이번에는 google map에 장소 정보를 가져오는 api를 사용해보겠다.

- src/lib/mapHelpers.ts    getCode는 주소를 입력하면 해당 장소에 대한 정보를 나타내 준다.
  ```tsx
  ...
  
  export const getCode = async (address: string) => {
    const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
    const { data } = await axios(URL);
    console.log(data);
  };

  ...
  ```

- src/routes/FindAddress/FindAddressContainer.tsx   `getCode`를 임포트 하고 `onInputBlur` 할 때 호출되도록 하자.
  ```tsx
  import { getCode, reverseGeoCode } from "../../lib/mapHelpers";
  
  ...
  
    public onInputBlur = () => {
      console.log("Address update!")
      const { address } = this.state;
      getCode(address);
    }
  
  ...
  ```

[http://localhost:3000/find-address](http://localhost:3000/find-address) 에서 검색에 Lotte world tower 를 입력 후 지도 아무곳을 클릭하자(blur하기 위해) 그러면 위치 정보가 아래처럼 보인다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952572/tlog/_2019-05-23__1-40db6b95-b553-4810-bccc-2353f483cab9.08.40_pbygqr.png)

## #2.52 Geocoding part Two

이번에는 장소를 검색하면 해당 장소로 이동 하고 정확한 주소를 나타나도록 하자.

- src/lib/mapHelpers.ts   `getCode` 함수를 조금 수정하자. 그 안에 데이터를 꺼내서 리턴한다.
  ```tsx
  ...
  
  export const getCode = async (address: string) => {
    const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
    const { data } = await axios(URL);
    console.log(data);
  
    if(data.error_message) {
      toast.error(data.error_message);
      return false;
    } else {
      const { results } = data;
      const firstPlace = results[0];
      if(!firstPlace) {
        toast.error('No Place');
        return false;
      } else {
        const {
          formatted_address,
          geometry: {
            location: { lat, lng }
          }
        } = firstPlace;
        return { formatted_address, lat, lng };
      }
    }
  };
  
  ...
  ```

- src/routes/FindAddress/FindAddressContainer.tsx   지도 로딩할 때 검색이 완료되면 `this.map.panTo` 로 장소로 이동하도록 처리했다.
  ```tsx
  ...
  
  public onInputBlur = async () => {
    if (!this.map) { return };
    const { address } = this.state;
    const result = await getCode(address);
    if (result !== false ) {
      const { lat, lng, formatted_address } = result;
      this.setState({
        address: formatted_address,
        lat,
        lng
      });
      this.map.panTo({ lat, lng });
    }
  }
  
  ...
  ```

[http://localhost:3000/find-address](http://localhost:3000/find-address) 에서 검색에 Lotte world tower 를 입력 후 지도 아무곳을 클릭하자(blur하기 위해) 그러면 해당 위치로 이동이 된다.

## #2.53 Refactoring AddPlace

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952572/tlog/_2019-05-23__2-870e84dd-4a7d-46ad-b0d5-a505361e239e.35.23_vroqfm.png)

장소를 추가할 때, 지도를 통해서 장소를 선택하여 추가하도록 구현을 해야 한다. 그래야 장소 데이터를 사용할 수 있기 때문이다.

- src/components/Button/Button.tsx   속성에 `className`을 가지는 버튼으로 바꾸자.
  ```tsx
  ...
  
  interface IProps {
    value: string;
    onClick: any;
    disabled?: boolean;
    className?: string;
  }
  
  const Button: React.SFC<IProps> = ({
    value,
    onClick,
    disabled = false,
    className
  }) => (
    <Container
      value={value}
      onClick={onClick}
      disabled={disabled}
      className={className}
      type="submit"
    />
  )
  
  export default Button;
  ```

- src/routes/FindAddress/FindAddressPresenter.tsx  위에서 만든 버튼을 추가하고 `onPickPlace` 를 Container로 부터 받아서 버튼의 핸들러로 쓰자.
  ```tsx
  import React from "react";
  import Helmet from "react-helmet";
  import Button from "../../components/Button";
  import styled from "../../typed-components";
  import AddressBar from "../../components/AddressBar";
  
  const ExtendedButton = styled(Button)`
    position: absolute;
    bottom: 50px;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 10;
    height: auto;
    width: 80%;
  `;
  
  const Map = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 1;
  `;
  
  const CenterPoint = styled.div`
    position: absolute;
    width: 2rem;
    height: 2rem;
    z-index: 2;
    font-size: 2rem;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  `;
  
  interface IProps {
    mapRef: any;
    address: string;
    onInputBlur: () => void;
    onPickPlace: () => void;
    onInputChange: React.ChangeEventHandler<HTMLInputElement>;
  }
  
  class FindAddressPresenter extends React.Component<IProps> {
    public render() {
      const { 
        mapRef, 
        address, 
        onInputChange, 
        onInputBlur,
        onPickPlace,
      } = this.props;
      return (
        <div>
          <Helmet>
            <title>Find Address | Nuber</title>
          </Helmet>
          <ExtendedButton value="Pick this place" onClick={onPickPlace}/>
          <CenterPoint>📍</CenterPoint>
          <Map ref={mapRef}/>
          <AddressBar
            onBlur={onInputBlur}
            onChange={onInputChange}
            value={address}
            name="address"
          />
        </div>
      );
    }
  }
  
  export default FindAddressPresenter;
  ```

- src/routes/FIndAddress/FindAddressContainer.tsx    `onPickPlace`에서 장소를 정해지면 장소 정보를 state에 넣고 `/add-place`로 이동을 하도록 했다.
  ```tsx
  import React from "react";
  import ReactDOM from "react-dom";
  import { RouteComponentProps } from "react-router-dom";
  import { getCode, reverseGeoCode } from "../../lib/mapHelpers";
  import FindAddressPresenter from "./FindAddressPresenter";
  
  interface IProps extends RouteComponentProps<any> {
    google: any;
  }
  
  interface IState {
    lat: number;
    lng: number;
    address: string;
  }
  
  class FIndAddressContainer extends React.Component<IProps, IState> {
    public mapRef: any;
    public map: google.maps.Map | null;
    public state ={
      address: "",
      lat: 0,
      lng: 0,
    }
  
    constructor(props) {
      super(props);
      this.mapRef = React.createRef();
      this.map = null;
    }
  
    public componentDidMount() {
      navigator.geolocation.getCurrentPosition(
        this.handleGeoSuccess,
        this.handleGeoError
      )
    }
  
    public render() {
      const { address } = this.state;
      return (
        <FindAddressPresenter 
          mapRef={this.mapRef}
          address={address}
          onInputChange={this.onInputChange}
          onInputBlur={this.onInputBlur}
          onPickPlace={this.onPickPlace}
        />
      );
    }
  
    public handleGeoSuccess: PositionCallback = (position: Position) => {
      const {
        coords: { latitude, longitude }
      } = position;
      this.setState({
        lat: latitude,
        lng: longitude
      })
      this.loadMap(latitude, longitude);
      this.reverseGeocodeAddress(latitude, longitude);
    }
  
    public handleGeoError: PositionErrorCallback = () => {
      console.error('No postion');
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
      } 
      this.map = new maps.Map(mapNode, mapConfig);
      this.map!.addListener("dragend", this.handleDragEnd);
    }
  
    public handleDragEnd = () => {
      if (!this.map) { return };
      const newCenter = this.map!.getCenter();
      const lat = newCenter.lat();
      const lng = newCenter.lng();
      
      this.setState({
        lat,
        lng
      });
      this.reverseGeocodeAddress(lat, lng);
    }
  
    public onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
      const {
        target: { name, value }
      } = event;
      this.setState({
        [name]: value
      } as any);
    };
  
    public onInputBlur = async () => {
      if (!this.map) { return };
      const { address } = this.state;
      const result = await getCode(address);
      if (result !== false ) {
        const { lat, lng, formatted_address } = result;
        this.setState({
          address: formatted_address,
          lat,
          lng
        });
        this.map.panTo({ lat, lng });
      }
    }
  
    public onPickPlace = () => {
      const { address, lat, lng } = this.state;
      const { history } = this.props;
      history.push({
        pathname: "/add-place",
        state: {
          address,
          lat,
          lng
        }
      });
    }
  
    public reverseGeocodeAddress = async (lat: number, lng: number) => {
      const reversedAddress = await reverseGeoCode(lat, lng);
      if (reversedAddress !== false) {
        this.setState({
          address: reversedAddress
        })
      }
    }
  }
  
  export default FIndAddressContainer;
  ```

이동한 /add-place 페이지에서는 state에서 값을 꺼내어 셋팅을 해주면 된다.

- src/routes/AddPlace/AddPlaceContainer.tsx  `validatePlace` 를 정의해서 장소를 추가할 때 지도를 통해서 추가 했는지에 대한 검증하도록 변경했다.
  ```tsx
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
    constructor(props: IProps) {
      super(props);
      const { location: { state = {} } = {} } = props;
      this.state = {
        address: state.address || "",
        lat: state.lat || 0,
        lng: state.lng || 0,
        name: ""
      };
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
              onSubmit={() => this.validatePlace(addPlaceMutaion)}
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
  
    public validatePlace(mutation) {
      const { lat, lng } = this.state;
      if (lat === 0 && lng === 0) {
        toast.error("Invalid Position Info");
        return;
      }
      mutation();
    }
  }
  
  export default AddPlaceContainer;
  ```

- src/routes/AddPlace/AddPlacePresenter.tsx  `MutationFn`으로 타입 선언했던 것을 제외.
  ```tsx
  import Button from "components/Button";
  import Form from "components/Form";
  import Header from "components/Header";
  import Input from "components/Input";
  import React from "react";
  import Helmet from "react-helmet";
  import { Link } from "react-router-dom";
  import styled from "../../typed-components";
  
  ...
  
  interface IProps {
    ...
    onSubmit: () => void;
  }
  
  ...
  ```

이제 [http://localhost:3000/add-place](http://localhost:3000/add-place) 로 가자. 아까 넣었던 state가 지금 화면에 표시 되는 것을 확인할 수 있다. (state는 새로고침에도 유지가 된다.)

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952576/tlog/_2019-07-09__4-96ad4ba9-d7c5-458b-9966-6fd477c4e272.32.48_gjfmep.png)

임의로 add place에서 name, address를 입력 한다고 해도 입력이 완전히 되지 않고, pick place from map을 통해서만 장소가 추가되도록 작업 했다.