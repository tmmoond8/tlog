---
title: 27 우버 클론 코딩 (nomad coders)
date: '2019-06-17T08:56:56.243Z'
description: 우버 코딩 강의 로그 2.46 ~ 2.50
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1632302785/tlog/cover/nuber_clone_nllng2.jpg'
tags:
  - 'Uber Clone Coding'
  - 'Nomad Coder'
  - Apollo
  - GraphQL
  - 'Google Map API'
---
#

이 포스트는 nomad coders의 우버 클론 코딩 시리즈를 듣고 정리한 글 입니다.

[https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course](https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course)

이번에는 장소 데이터를 구글 맵을 통해 연동하도록 한다. 언뜻 봤는데 조금 어려워 보인다.

## #2.46 Google Maps and React part One

google maps API를 사용해서 장소에 대한 데이터를 가져오는 것을 진행한다. google map 에서 제공하는 차를 운행하는 경로라던가 사용자의 장소 등에 대한 데이터를 나타낼 때 등 잘 활용해야 한다.

먼저 google maps API를 사용하기 위해서는 API를 사용하도록 설정해야 한다.

[https://console.cloud.google.com](https://console.cloud.google.com/) 에 가서 프로젝트를 하나 생성하자.

[https://console.cloud.google.com/google/maps-apis](https://console.cloud.google.com/google/maps-apis) 로 이동해서 검색에 java maps javascript api를 검색하면 하나가 뜨고 사용하도록 설정하자. 사용하도록 하면 API 사용하기 위한 키를 만들어야 한다

[https://console.cloud.google.com/google/maps-apis](https://console.cloud.google.com/google/maps-apis) 에 API 탭에 들어가서 사용 설정된 API 안에

Maps JavaScript API 의 세부정보를 누르자. 사용자 인증 정보 탭을 누르면 인증정보를 추가 할 수 있게 한다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952572/tlog/_2019-05-21__3-4a52f3b5-3c04-47eb-bb66-a259b7814c8b.28.38_xpanwj.png)

하는 김에 Geocoding API도 사용하도록 하자. 나중에 위도와 경도로 인근 장소에 대한 정보를 얻어올 수 있다.

인증 정보는 API KEY로 하자.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952572/tlog/_2019-05-21__3-0b13b4a7-bcf9-4f44-ad49-edf2e815bfb4.29.28_zx5g7n.png)

API KEY를 복사 해놓자. API는 신청은 완료 했다.

google maps 라이브러리를 리액트에서 편하게 사용할 수 있는 라이브러리가 있다.

    $ yarn add google-maps-react
    $ yarn add @types/googlemaps --dev

- src/routes/FindAddress/index.ts   `GoogleApiWrapper`로 래핑을 한 번 하면 FindAddressContainer 안에 props로 google maps 객체가 전달 된다.

        import { GoogleApiWrapper } from "google-maps-react";
        import FindAddressContainer from "./FindAddressContainer";
        
        export default GoogleApiWrapper({
          apiKey: "복사한 키"
        })(FindAddressContainer);

- src/routes/FindAddress/FIndAddressContainer.tsx    console로 이것 저것 찍어보도록 했다.

    지도에서는 직접 Dom에 접근해야 되기 때문에 이 프로젝트에서는 처음으로 Ref가 등장했다. 어쩃든 `mapNode`에는 실제 Dom Element가 들어있다.

        import React from "react";
        import ReactDOM from "react-dom";
        import FindAddressPresenter from "./FindAddressPresenter";
        
        class FIndAddressContainer extends React.Component<any> {
          public mapRef: any;
          public map: google.maps.Map | null;
        
          constructor(props) {
            super(props);
            this.mapRef = React.createRef();
            this.map = null;
          }
        
          public componentDidMount() {
            const { google } = this.props;
            const maps = google.maps;
            const mapNode = ReactDOM.findDOMNode(this.mapRef.current);
            console.log(google);
            console.log(this.mapRef.current)
            console.log(mapNode);
            console.log(mapNode === this.mapRef.current);
            const mapConfig: google.maps.MapOptions = {
              center: {
                lat: 37.5665,
                lng: 126.9780
              },
              disableDefaultUI: true,
              zoom: 11
            } 
            this.map = new maps.Map(mapNode, mapConfig);
          }
        
          public render() {
            return (
              <FindAddressPresenter mapRef={this.mapRef}/>
            );
          }
        }
        
        export default FIndAddressContainer;

- src/routes/FindAddress/FIndAddressPresenter.tsx  강의에서는 Map 컴포넌트에 `ref`대신 `innerRef`로 넣어줬던데,, 나는 innerRef로 했을 때 속성을 못찾는다는 오류가 있었다.

        import React from "react";
        import Helmet from "react-helmet";
        import styled from "../../typed-components";
        
        const Map = styled.div`
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
        `;
        
        interface IProps {
          mapRef: any;
        }
        
        class FindAddressPresenter extends React.Component<IProps> {
          public render() {
            const { mapRef } = this.props;
            return (
              <div>
                <Helmet>
                  <title>Find Address | Nuber</title>
                </Helmet>
                <Map ref={mapRef}/>
              </div>
            );
          }
        }
        
        export default FindAddressPresenter;

[http://localhost:3000/find-address](http://localhost:3000/find-address) 에 들어가서 지도가 잘 뜨는지 확인하자. 임의로 서울의 위도와 경도를 넣었다.

지금까지 여러 키 값을 하드 코딩 했는데, dotenv를 이용해서 관리를 하자.

    $ yarn add dotenv
    $ yarn add @types/dotenv --dev

- {root}/.env.sample    샘플 파일로 실제로 사용하지는 않음.

        REACT_APP_GOOGLE_MAPS_API_KEY=
        REACT_APP_FACEBOOK_API_KEY=
        REACT_APP_CLOUDINARY_API_KEY=
        REACT_APP_CLOUDINARY_STORAGE=

- {root}/.env.local      실제 사용되는 값

        REACT_APP_GOOGLE_MAPS_API_KEY={발급 받은 키}
        REACT_APP_FACEBOOK_API_KEY={발급 받은 키}
        REACT_APP_CLOUDINARY_API_KEY={발급 받은 키}
        REACT_APP_CLOUDINARY_STORAGE={저장소 주소}

- src/routes/FindAddress/index.ts   dotenv를 사용하여 키를 가져오도록 하자.

        import dotenv from "dotenv";
        import { GoogleApiWrapper } from "google-maps-react";
        import FindAddressContainer from "./FindAddressContainer";
        
        dotenv.config();
        
        export default GoogleApiWrapper({
          apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
        })(FindAddressContainer);

> 이번에 알게 된 사실인데, .env에서 사용하기 키에 prefix로 REACT_APP_를 무조건 넣어줘야 한다. 예전에는 이런 규칙이 없었는데, 추가되었나보다.

- src/routes/EditAccountContainer.tsx

        import axios from "axios";
        import dotenv from 'dotenv';
        import React from "react";
        ...
        
        dotenv.config();
        
        const { 
          REACT_APP_CLOUDINARY_API_KEY,
          REACT_APP_CLOUDINARY_STORAGE,
        } = process.env;
        
        ...
        
        public onInputChange: React.ChangeEventHandler<HTMLInputElement> = async event => {
        
        ...
        
              formData.append("api_key", REACT_APP_CLOUDINARY_API_KEY || "");
              formData.append("upload_preset", "xtaoaopp");
              formData.append("timestamp", String(Date.now() / 1000));
              const {
                data: { secure_url }
              } = await axios.post(
                REACT_APP_CLOUDINARY_STORAGE || "",
                formData
              );
              if (secure_url) {
                this.setState({
                  profilePhoto: secure_url,
                  uploading: false
                })
              }
            }
        ...

- src/routes/SocialLogin/SocialLoginPresenter.tsx

        import BackArrow from "components/BackArrow";
        import dotenv from 'dotenv';
        import React from "react";
        import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
        import Helmet from "react-helmet";
        import styled from "../../typed-components";
        
        dotenv.config();
        
        ...
        
        <FacebookLogin
              appId={process.env.REACT_APP_FACEBOOK_API_KEY || ""}
        ...

원래 강의에서는 validation에 대한게 있지만 그건 한번에 하기엔 이번 강의가 조금 길어서 나중에 필요할때 코드에 추가 하자.

## #2.47 Google Maps and Geolocation

이번에는 이어서 지도 중앙을 표시하는 핀을 생성하자. 그리고 임의로 서울 값을 초기값으로 했는데 브라우저의 api를 사용해서 나의 위치를 위도와 경도로 가져와서 지도에 표시하자.

- src/routes/FindAddressPresenter.tsx  CenterPoint은 지도 위에 있어야 하고 중앙에 정렬시켰다.

        ...
        
        const Map = styled.div`
          ...
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
        
        ...
        
                </Helmet>
                <CenterPoint>📍</CenterPoint>
                <Map ref={mapRef}/>
        ...

> absolute요소를 가운데 정렬 시키는 재밌는 방법을 봤다. 모든 left: 0, right: 0, top: 0, bottom: 0 넣고 margin을 auto로 넣으니.. 딱 가운데로 오는구나..

이번에는 초기 위치값을 현재 브라우저 API을 통해서 가져와서 설정하도록 하자.

[https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition) 에 가면 브라우저 API를 볼 수 있다.

- src/routes/FindAddress/FindAddressContainer.tsx   `navigator.geolocation.getCurrentPosition` 를 사용하면 했다. 이 함수는 성공 콜백과 실패 콜백 둘다 만들어줘야 한다.

        import React from "react";
        import ReactDOM from "react-dom";
        import FindAddressPresenter from "./FindAddressPresenter";
        
        class FIndAddressContainer extends React.Component<any> {
          public mapRef: any;
          public map: google.maps.Map | null;
        
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
            return (
              <FindAddressPresenter mapRef={this.mapRef}/>
            );
          }
        
          public handleGeoSuccess: PositionCallback = (position: Position) => {
            const {
              coords: { latitude, longitude }
            } = position;
            this.loadMap(latitude, longitude);
          }
        
          public handleGeoError: PositionErrorCallback = () => {
        	   console.error("No Position");
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
          }
        }
        
        export default FIndAddressContainer;

> API 내용중 위치 정보는 https 에서만 사용 가능하다고 되어 있다. 만약 HTTPS로 개발서버를 띄우길 원하면 `HTTPS=true yarn dev` 이렇게 명령어를 주면 된다. 나도 경험해보니 됐다 안됐다 오락 가락한다. 그리고 가입하면 할당량이 하루에 1회라,, 동작이 좀 안될 수 있다. 그래서 나의 경우는 뭐 결제를 더 한건지 어떤 포인트를 썼는지 이 API 호출 횟수를 늘렸다.

## #2.48 Google Map Events

google map은 조작을 할 수 있고 조작된 페이지에 대한 여러 정보나 event를 사용할 수 있다. 흔히 마우스 드래그를 통해서 지도의 위치를 조작한다. dragend 이벤트를 사용해보자.

[https://developers.google.com/maps/documentation/javascript/events](https://developers.google.com/maps/documentation/javascript/events) 에 가면 다양한 이벤트를 사용할 수 있다.

- src/routes/FindAddress/FindAddressContainer.tsx

        import React from "react";
        import ReactDOM from "react-dom";
        import FindAddressPresenter from "./FindAddressPresenter";
        
        interface IState {
          lat: number;
          lng: number;
        }
        
        class FIndAddressContainer extends React.Component<any, IState> {
        
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
            if (!this.map) { return; };
            const newCenter = this.map!.getCenter();
            const lat = newCenter.lat();
            const lng = newCenter.lng();
            console.log(lat, lng);
            this.setState({
              lat,
              lng
            })
          }
        }
        
        export default FIndAddressContainer;

[http://localhost:3000/find-address](http://localhost:3000/find-address) 에서 지도를 드래그로 이동 시키자. 그러면 이동한 곳의 위도, 경도가 콘솔에 찍힌다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952575/tlog/_2019-07-09__3-cac613ee-ea2c-41f9-8332-637f58df2a62.53.44_r7tn26.png)

## #2.49 Reverse Geocoding part One

지도에서 위치에 대한 검색이나 현재 지정된 좌표를 통해 지명같은 장소를 얻어와야 한다. 먼저 장소를 검색할 수 있는 검색 창을 만들자.

AddressBar 라는 컴포넌트를 만들자

- src/components/AddressBar/AddressBar.tsx

        import React from "react";
        import styled from "../../typed-components";
        
        const Container = styled.input`
          position: absolute;
          background-color: white;
          border-radius: 5px;
          -webkit-appearance: none;
          z-index: 2;
          width: 80%;
          border: 0;
          font-size: 16px;
          padding: 15px 10px;
          box-shadow: 0 18px 35px rgba(50, 50, 93, 0.1), 0 8px 15px rgba(0, 0, 0, 0.07);
          margin: auto;
          top: 10px;
          left: 0;
          right: 0;
          height: auto;
        `;
        
        interface IProps {
          value: string;
          onBlur: () => void;
          name: string;
          onChange: React.ChangeEventHandler<HTMLInputElement>;
        }
        
        const AddressBar: React.SFC<IProps> = ({ value, onBlur, onChange, name }) => (
          <Container
            value={value}
            onBlur={onBlur}
            onChange={onChange}
        		onSubmit={onBlur}
            placeholder="Type address"
            name={name}
          />
        )
        
        export default AddressBar;

- src/components/AddressBar/index.ts

        export { default } from "./AddressBar";

- src/routes/FindAddress/FindAddressContainer.tsx  위에서 정의한 AddressBar 컴포넌트를 그리도록 하자. 동작을 위한 이벤트 핸들러도 같이 설정하자.

        import React from "react";
        import ReactDOM from "react-dom";
        import FindAddressPresenter from "./FindAddressPresenter";
        
        interface IState {
          lat: number;
          lng: number;
          address: string;
        }
        
        class FIndAddressContainer extends React.Component<any, IState> {
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
            console.log(lat, lng);
            this.setState({
              lat,
              lng
            })
          }
        
          public onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
            const {
              target: { name, value }
            } = event;
            this.setState({
              [name]: value
            } as any);
          };
        
          public onInputBlur = () => {
            console.log("Address update!")
          }
        }
        
        export default FIndAddressContainer;

- src/routes/FindAddress/FindAddressPresenter.tsx

        import React from "react";
        import Helmet from "react-helmet";
        import styled from "../../typed-components";
        import AddressBar from "../AddressBar";
        
        ...
        
        interface IProps {
          mapRef: any;
          address: string;
          onInputBlur: () => void;
          onInputChange: React.ChangeEventHandler<HTMLInputElement>;
        }
        
        class FindAddressPresenter extends React.Component<IProps> {
          public render() {
            const { mapRef, address, onInputChange, onInputBlur } = this.props;
            return (
              <div>
                ...
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

## #2.50 Reverse Geocoding part Two

이번에는 Geocoding API를 사용하여 lat, lng 값으로 장소 정보를 가져오도록 해볼 것이다.

- src/lib/mapHelpers.ts  라이브러리 쪽에 파일을 하나 생성하자.  `reverseGeoCode`함수가 위도와 경도를 받아서 장소값을 리턴하는데, 여기서는 콘솔을 통해 출력 시키도록 했다.

        import axios from "axios";
        import dotenv from "dotenv";
        import { toast } from "react-toastify";
        
        dotenv.config();
        
        export const getCode = () => null;
        export const reverseGeoCode = async (lat: number, lng: number) => {
          const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
          const { data } = await axios(URL);
          if(data.error_message) {
            toast.error(data.error_message);
        		return false;
          } else {
            const { results } = data;
        		console.log(results)
            const firstPlace = results[0];
            if(firstPlace) {
              return firstPlace!.formatted_address;
            }
          }
        }

- src/routes/FIndAddress/FindAddressContainer.tsx

        import React from "react";
        import ReactDOM from "react-dom";
        import { reverseGeoCode } from "../../lib/mapHelpers";
        import FindAddressPresenter from "./FindAddressPresenter";
        
        ...
        
          public handleDragEnd = async () => {
            const newCenter = this.map!.getCenter();
            const lat = newCenter.lat();
            const lng = newCenter.lng();
            const address = await reverseGeoCode(lat, lng);
            this.setState({
              address,
              lat,
              lng
            })
          }
        
        ...

이렇게 하고 지도를 드래그 하면 지도 정보가 뜬다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952572/tlog/_2019-05-21__7-4319ff3b-aed5-40ce-aba2-9cad7e78a68d.49.47_emzvck.png)

나는 몇번 안썼는데 하루 치 API 다 썼다고..