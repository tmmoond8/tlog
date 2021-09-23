---
title: 구글 스프레드 시트를 DB로 사용하기
date: '2019-12-04T08:56:56.263Z'
description: 별도 DB없이 구글 스프레드 시트를 DB처럼 사용하기
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952584/tlog/cover/google-spread-sheet_f8007w.png'
tags:
  - DB
---

이번에 신조어 프로젝트를 구상하면서 귀찮았던 것은 admin 페이지로 데이터를 관리하게 해야 한다는 것이었다. 뭔가 신조어를 추가 하려면 별도로 관리 페이지에 데이터를 추가 해줘야 하는데, 일단 관리 페이지를 새로 만드는 것도 귀찮았다. 그러던 참에 구글 스프레드 시트를 이용하면 DB대용으로 사용하면서도 데이터 관리가 굉장히 편리해지는 장점이 있었다.

간단히 구글 스프레트 시트를 DB로 사용하는 아이디어를 간단히 설명해보겠다. 구글 드라이브에서 새로운 스프레드 시트를 생성하자.

아래는 내가 작성한 스프테드 시트다. 첫 행은 id Timestamp, quiz, answer, level 이 적혀있다. 이 값들은 RDB 테이블의 필드 이름으로 생각할 수 있다. 2행 부터는 데이터의 레코드라고 생각할 수 있다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952576/tlog/_2019-08-05__9.53.28_svmu6n.png)

위의 방식으로 새로운 시트에는 다른 필드 구조를 갖는 시트를 생성하는 방식으로 하면 다양한 테이블에 대해서도 정의할 수 있다. 또 스프레드 시트의 기본 기능이 다른 시트의 데이터를 참조하여 함수연산을 하는 것이다. 이 기능을 이용하면 join 등의 동작을 충분히 만들어 낼 수 있다.

### 스프레드 시트 파일 생성

[https://docs.google.com/spreadsheets](https://docs.google.com/spreadsheets) 로 접속하여 새 스프레드시트 파일을 생성하자.

### 스크립트 작성

도구에서 스크립트 편집기 메뉴를 클릭하자.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952576/tlog/_2019-08-05__9.59.10_deeh03.png)

그러면 또 새로운 에디터가 보인다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952576/tlog/_2019-08-05__10.00.56_t4yfp7.png)

 새로운 데이터를 넣는 방법도 있지만, 이번에는 데이터를 가져오는 예제만 한다.

    var SCRIPT_PROP = PropertiesService.getScriptProperties(); // new property service
    
    // If you don't want to expose either GET or POST methods you can comment out the appropriate function
    function doGet(e) {
      var lock = LockService.getPublicLock();
      lock.waitLock(30000);
      
      var rawData;
      try {
        var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
        var sheetName = e.parameter["sheetName"];;
        var sheetInitial = doc.getSheetByName(sheetName);
        var headers = sheetInitial.getRange(1, 1, 1, sheetInitial.getLastColumn()).getValues()[0];
        var rawData = sheetInitial.getRange(2, 1, sheetInitial.getLastRow(), sheetInitial.getLastColumn()).getValues()
        
      } catch (error) {
        return ContentService
          .createTextOutput(JSON.stringify({"ok": false, "error": error}))
          .setMimeType(ContentService.MimeType.JSON);
      }
      var data = [];
      var headerLength = headers.length;
      var rowLength = rawData.length;
        
      if (rawData) {
        for (var r=0; r < rowLength; r++) {
          if (rawData[r][0] === "") {
            continue;
          }
          var row = {};
          for (var i=0; i< headerLength; i++) {
            row[headers[i]] = rawData[r][i];
          }
          data.push(row)
        }
      }
      
      return ContentService
        .createTextOutput(JSON.stringify({"ok": true, "data": data}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    function doPost(e){
      //    do nothing
    }
    
    
    function setup() {
      var doc = SpreadsheetApp.getActiveSpreadsheet();
      SCRIPT_PROP.setProperty("key", doc.getId());
    }

doGet 함수는 get 요청에 대한 응답을 하게 된다. doGet은 URL 쿼리에서 sheetName을 꺼내서 해당 시트를 찾고 시트의 데이터를 json 형태 응답하는 함수다

응답 예시

    {
      "ok": true,
      "data": [
        {
          "index": 0,
          "Timestamp": "2019-08-04T05:43:49.224Z",
          "quiz": "ㅇㅈ",
          "answer": "인정",
          "level": 1
        },
        {
          "index": 1,
          "Timestamp": "2019-08-04T05:43:49.224Z",
          "quiz": "ㄱㅇㄷ",
          "answer": "개이득",
          "level": 1
        },
        ...
    	]
    }

### 스크립트 셋업

저장을 누르고 이름을 적당히 정해준다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952576/tlog/_2019-08-05__10.12.22_gxkm73.png)

메뉴 - 실행 - 함수실행 - setup 을 클릭하자

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952576/tlog/_2019-08-05__10.13.29_xnnl5v.png)

최초에는 사용자의 인증이 필요하다. 구글 아이디로 권한 인증을 하고 넘기자. 그리고 다시 setup 메뉴를 선택하자.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952576/tlog/_2019-08-05__10.14.28_ibdf1a.png)

### 스크립트 배포

메뉴 - 게시 - 웹 앱으로 배포 ... 를 클릭한다. 

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952576/tlog/_2019-08-05__10.16.39_z8hvwm.png)

웹 앱으로 배포를 누르면 URL이 있다. 엑세스 할 수 있는 사용자만 누구나로 변경하자.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952576/tlog/_2019-08-05__10.17.30_gdajam.png)

확인 버튼을 누르면 시트에 접근하는 URL을 준다. URL을 복수 해놓자.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952576/tlog/_2019-08-05__10.20.10_uuzxmb.png)

### 데이터 가져오기

이제 마지막으로 시트의 데이터를 가져오도록 하자. 위 에서 복사한 URL에 sheetName만 쿼리에 넘겨주면 끝이다.

URL: [https://script.google.com/macros/s/AKfycbvGni/exec](https://script.google.com/macros/s/AKfycbySdLQ6O6kUNOedVcrFmSW1wwtPL_caPPEexikyrxfH2h_WvGni/exec)

sheet 이름 : initial

요청 URL : [https://script.google.com/macros/s/AKfycbvGni/exec?sheetName=initial](https://script.google.com/macros/s/AKfycbvGni/exec?sheetName=initial)

위 방식으로 요청 URL을 만들어서 주소에 입력 해보자. 정상적으로 데이터가 JSON으로 나타나면 성공!

참고한 미르님의 블로그

[구글 스프레드 시트를 데이터베이스로 사용하기 - 스크립트편](https://itmir.tistory.com/598)

[Spreadsheet Service | Apps Script | Google Developers](https://developers.google.com/apps-script/reference/spreadsheet/)

[Samples | Sheets API | Google Developers](https://developers.google.com/sheets/api/samples/)