---
title: 네이버 맵 api 간단 사용기
date: '2021-09-29T08:56:56.263Z'
description: React에서 네이버 맵 api 사용하기
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632917798/tlog/cover/_Naver_Map_API_vionmm.png'
tags:
  - React
---

# 네이버 맵 api 간단 사용기

> 이번에 지도에서 path를 표현하는 것을 사이드 프로젝트에서 하면서 정리한 내용입니다.
> 

## 구현한 스펙

- 국내 지도가 표시
- 출발지, 도착지를 검색하여 선택
- 선택된 위치는 지도상에 표시
- 출발지와 도착지를 입력하면 두 위치를 이동하는 경로를 표현

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632918021/tlog/pyainin1kwimhyjcadtd.png)

네이버 지도 api 는 [네이버 클라우드 플랫폼](https://www.ncloud.com/product/applicationService/maps) 서비스를 이용하면 된다. 지도 api는 네이버 외에도 카카오맵, 구글 맵 API를 쓸 수 있지만, 한국의 장소에 대해서는 네이버가 가장 데이터가 많다고 판단했다.

아래 사용 요금을 보면 네이버 지도를 그리는 것은 모든 비용이 무료다. 네이버 지도는 길찾기 서비스(Directions)만 유료로 비용을 받는데, 이 마져도 월에 상당량을 무료로 사용할 수 있다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632918022/tlog/tazq6bod2xyzcelgkzye.png)

지도를 적용하는 것은 꽤나 간단한데, 리액트의 경우 비공식이지만 모듈을 제공하고 있어서 더욱 손쉽게 사용 가능 하며 나는 이 모듈을 사용하는 것 을 추천한다.

다음은 [react-naver-maps](https://www.npmjs.com/package/react-naver-maps) 라는 모듈의 예시다. 이 모듈의 업데이트는 꽤 오래 전에 되었지만, 따로 작성한 [문서](https://zeakd.github.io/react-naver-maps/)도 운영하며 네이버 지도 API가 이후에 많은 업데이트가 있지 않아서 사용의 문제는 없어보인다.

사용법도 꽤 직관적이다.
 `RenderAfterNavermapsLoaded` : naver.maps 를 이용해서 지도 모듈을 초기화 
 `NaverMap` : 네이버 지도를 그림, 지도 위에 그릴 요소는 자식으로 정의할 수 있음
 `Polyline` : 포인트(x,y) 배열을 받아 패스를 그림
 `Marker` 지도에 특정 위치를 표시

```jsx
<RenderAfterNavermapsLoaded
  ncpClientId={process.env.REACT_APP_NAVER_CLOUD_CLIENT_ID} 
  error={<p>Maps Load Error</p>}
  loading={<p>Maps Loading...</p>}
  submodules={["geocoder"]}
>
<NaverMap 
  mapDivId={'maps-getting-started-uncontrolled'} // default: react-naver-map
  style={{
    width: '100%',
    height: '100%',
  }}
  zoom={zoom}
  center={center}
  onCenterChanged={center => setCenter(center)}
  onZoomChanged={zoom => console.log(zoom)}
>
  {routes && routes.trafast && (
    <Polyline 
      path={routes.trafast.path.map(([lng, lat]) => new window.naver.maps.LatLng(lat, lng))}
      // clickable // 사용자 인터랙션을 받기 위해 clickable을 true로 설정합니다.
      strokeColor={'#ff3344'}
      strokeStyle={'solid'}
      strokeOpacity={0.8}
      strokeWeight={4}        
    />
  )}
  {departureRef.current && (
    <Marker 
      position={departureRef.current}
    />
  )}
  {arrivalRef.current && (
    <Marker 
      position={arrivalRef.current}
    />
  )}
</NaverMap>
</RenderAfterNavermapsLoaded>
```

여기서 제가 겪었던 이슈는 2가지 였다. 첫 번째는 특정 키워드를 넣어서 위치를 검색하는 api는 네이버 클라우드 플랫폼에 없다는 점 입니다. 물론 이 api는 네이버가 제공해주긴 한다. 바로 [네이버 앱 검색 api](https://developers.naver.com/) 인데, 별도의 api key를 발급 받아야 사용할 수 있고 총 2개의 API키를 발급 받아서 사용해야 하는 것이다. (검색 api는 일당 25,000건을 사용할 수 있어서 사용량은 넉넉한 편)

그런데 진짜 중요한 문제는 여기서 발생했다.

네이버 검색 api 사용해서 장소를 검색했을 때 좌표(x,y) 값이 이상했던 것. 

다음은 그 예시이다.

```jsx
{
  title: "<b>수원</b>시청",
	address: "경기도 수원시 팔달구 인계동 1111"
	category: "공공,사회기관>시청"
	description: ""
	link: "http://www.suwon.go.kr/"
	mapx: "314041"
	mapy: "518403"
	roadAddress: "경기도 수원시 팔달구 효원로 241 수원시청"
	telephone: ""
}
```

네이버 검색 api가 내려주는 좌표는 카텍좌표계(TM128) 인 반면 지도 api에 넣어야 할 값은 우리에게 익숙한 위도,경도 좌표계 였다. 네이버 검색 결과에서 주는 좌표 값을 네이버 지도 api에 바로 사용할 수 없었다.

결론적으로 그 해결 방법은 이 [링크](https://developers.naver.com/forum/posts/30323)에 있는데, 카텍좌표계를 위,경도 좌표로 변환하는 것은 naver.maps 모듈을 이용하면 된다. [TransCoord](https://navermaps.github.io/maps.js/docs/naver.maps.TransCoord.html) 은 naver.maps의 기본 모듈이 아니라서 추가옵션을 사용하면 이용할 수 있다. 예시에서 사용된 `react-naver-maps` 모듈을 사용하면 `RenderAfterNavermapsLoaded` 에서 `submodules={["geocoder"]}` 이렇게 추가로 넣어주면 된다.

- LatLng: 위/경도로 나타내는 좌표계
- UTMK: UTMK 좌표계
- NAVER: NAVER의 자체 좌표계
- TM128: TM128 좌표계
- EPSG3857: EPSG3857 평면 좌표계

네이버 좌표계는 위 다섯가지 좌표계를 다루는데, 나는 NAVER 자체 좌표계인줄 하고 많은 삽질을 했다. TransCoord는 다섯 좌표계 간의 변환해주는 함수를 제공하였다.

```jsx
export const fromTM128ToLatLng = ({ mapx, mapy }) => {
  const point = new window.naver.maps.Point(mapx, mapy);
  const latLng = window.naver.maps.TransCoord.fromTM128ToLatLng(point);
  return latLng;
};
```