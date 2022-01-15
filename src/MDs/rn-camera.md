---
title: RN 카메라, 포토앨범 사용하기
date: '2022-01-05T08:56:56.263Z'
description: 앱에서 카메라에 접근하기 위한 권한 처리
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1641910411/tlog/cover/rn_cks99r.png'
tags:
  - React Native
---

책에서는 [react-native-image-picker](https://www.npmjs.com/package/react-native-image-picker) (유사한 라이브러리는 @react-native-community/cameraroll ) 이 있다고 함

```bash
$ yarn add react-native-image-picker
$ cd ios && pod install
```

사진은 디바이스에서 사진 관련 권한을 요구하는데, ios에서는 `Info.plist`에서 권한 설명 문구를 정의하는 것으로, 안드로이드는 `AndroidManifest.xml` 에서 명확히 권한을 설정해준다.

- ios/${프로젝트 이름}/Info.plist
    
    ```bash
    ...
    		<key>NSPhotoLibraryUsageDescrption</key>
    		<string>$(PRODUCT_NAME) would like access to your photo gallery</string>
    		<key>NSCameraUsageDescription</key>
    		<string>$(PRODUCT_NAME) would like to use your camera</string>
    		<key>NSPhotoLibraryAddUsageDescription</key>
    		<string>$(PRODUCT_NAME) would like to save photos to your photo gallery</string>
    	</dict>
    </plist>
    ```
    
- android/app/src/main/AndroidManifest.xml
    
    ```bash
    <manifest xmlns:android="http://schemas.android.com/apk/res/android"
      package="com.tmmoond8.{프로젝트 이름}">
    
        <uses-permission android:name="android.permission.INTERNET" />
        <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
        <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    ```