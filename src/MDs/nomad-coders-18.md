---
title: 18 우버 클론 코딩 (nomad coders)
date: '2019-05-23T08:56:56.243Z'
description: 우버 코딩 강의 로그 2.13 ~ 2.17
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632302785/tlog/cover/nuber_clone_nllng2.jpg'
tags:
  - 'Uber Clone Coding'
  - 'Nomad Coder'
  - React
---
#

이 포스트는 nomad coders의 우버 클론 코딩 시리즈를 듣고 정리한 글 입니다.

[https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course](https://academy.nomadcoders.co/p/nuber-fullstack-javascript-graphql-course)

## #2.13 Login Component and React Helmet

리액트는 SPA고 실제로는 하나의 페이지인데 우리는 페이지별로 meta 태그 내용을 바꾸고 싶을 때가 있다. 예를들면 meta에는 현재 페이지에 대한 정보가 있는데, 리액트에서 사용하는 page 단위로 컨트롤을 해줄 필요가 있다. 이런 컨트롤을 해주는 것이 react-helmet 모듈이다.

    $ yarn add react-helmet

- public/index.html 에서 title만 바꾸자. 지금은 title이 React App 로 되어있다.

        ...
            <title>Nuber</title>
        ...

    이렇게 하고 서버 보면 title이 정상적으로 바뀐다. 

이제 페이지별로 변경해놓자.

- src/routes/Login/LoginPresenter.tsx <Helmet>을 추가 하자.

        import React from "react";
        import Helmet from "react-helmet";
        import { Link, RouteComponentProps } from "react-router-dom";
        import bgImage from "../../images/bg.png";
        
        ...
        
        const OutHomePresenter: React.SFC<IProps> = () => (
          <Container>
            <Helmet>
              <title>Login | Nuber</title>
            </Helmet>
            <Header>
              <Logo>
                <Title>Nuber</Title>
              </Logo>
            </Header>
        ...

    <Helmet>은 아무대나 추가 해줘도 알아서 heade쪽에 메타 데이터를 변경해준다.

    그리고 클릭할때 링크

## #2.14 Route Components Review

이번에는 작업한 내용이 조금 많다.

- src/lib/countries.ts 파일을 생성하자. 이 값은 각 국 마다 국제 번호를 가져오기 위한 값들이다.

        const countries = [
          { name: "Afghanistan", dial_code: "+93", code: "AF", flag: "🇦🇫" },
          { name: "Åland Islands", dial_code: "+358", code: "AX", flag: "🇦🇽" },
          { name: "Albania", dial_code: "+355", code: "AL", flag: "🇦🇱" },
          { name: "Algeria", dial_code: "+213", code: "DZ", flag: "🇩🇿" },
          {
            name: "American Samoa",
            flag: "🇺🇸",
            dial_code: "+1684",
            code: "AS"
          },
          { name: "Andorra", dial_code: "+376", code: "AD", flag: "🇦🇩" },
          { name: "Angola", dial_code: "+244", code: "AO", flag: "🇦🇴" },
          { name: "Anguilla", dial_code: "+1264", code: "AI", flag: "🇦🇮" },
          { name: "Antarctica", dial_code: "+672", code: "AQ", flag: "🇦🇶" },
          {
            name: "Antigua and Barbuda",
            dial_code: "+1268",
            code: "AG",
            flag: "🇦🇬"
          },
          { name: "Argentina", dial_code: "+54", code: "AR", flag: "🇦🇷" },
          { name: "Armenia", dial_code: "+374", code: "AM", flag: "🇦🇲" },
          { name: "Aruba", dial_code: "+297", code: "AW", flag: "🇦🇼" },
          { name: "Australia", dial_code: "+61", code: "AU", flag: "🇦🇺" },
          { name: "Austria", dial_code: "+43", code: "AT", flag: "🇦🇹" },
          { name: "Azerbaijan", dial_code: "+994", code: "AZ", flag: "🇦🇿" },
          { name: "Bahamas", dial_code: "+1242", code: "BS", flag: "🇧🇸" },
          { name: "Bahrain", dial_code: "+973", code: "BH", flag: "🇧🇸" },
          { name: "Bangladesh", dial_code: "+880", code: "BD", flag: "🇧🇩" },
          { name: "Barbados", dial_code: "+1246", code: "BB", flag: "🇧🇧" },
          { name: "Belarus", dial_code: "+375", code: "BY", flag: "🇧🇾" },
          { name: "Belgium", dial_code: "+32", code: "BE", flag: "🇧🇪" },
          { name: "Belize", dial_code: "+501", code: "BZ", flag: "🇧🇿" },
          { name: "Benin", dial_code: "+229", code: "BJ", flag: "🇧🇯" },
          { name: "Bermuda", dial_code: "+1441", code: "BM", flag: "🇧🇲" },
          { name: "Bhutan", dial_code: "+975", code: "BT", flag: "🇧🇹" },
          {
            name: "Bolivia, Plurinational State of bolivia",
            dial_code: "+591",
            code: "BO",
            flag: "🇧🇴"
          },
          {
            name: "Bosnia and Herzegovina",
            dial_code: "+387",
            code: "BA",
            flag: "🇧🇦"
          },
          { name: "Botswana", dial_code: "+267", code: "BW", flag: "🇧🇼" },
          { name: "Bouvet Island", dial_code: "+47", code: "BV", flag: "🏳" },
          { name: "Brazil", dial_code: "+55", code: "BR", flag: "🇧🇷" },
          {
            name: "British Indian Ocean Territory",
            dial_code: "+246",
            code: "IO",
            flag: "🇮🇴"
          },
          {
            name: "Brunei Darussalam",
            dial_code: "+673",
            code: "BN",
            flag: "🇧🇳"
          },
          { name: "Bulgaria", dial_code: "+359", code: "BG", flag: "🇧🇬" },
          { name: "Burkina Faso", dial_code: "+226", code: "BF", flag: "🇧🇫" },
          { name: "Burundi", dial_code: "+257", code: "BI", flag: "🇧🇮" },
          { name: "Cambodia", dial_code: "+855", code: "KH", flag: "🇰🇭" },
          { name: "Cameroon", dial_code: "+237", code: "CM", flag: "🇨🇲" },
          { name: "Canada", dial_code: "+1", code: "CA", flag: "🇨🇦" },
          { name: "Cape Verde", dial_code: "+238", code: "CV", flag: "🇨🇻" },
          {
            name: "Cayman Islands",
            dial_code: "+ 345",
            code: "KY",
            flag: "🇰🇾"
          },
          {
            name: "Central African Republic",
            dial_code: "+236",
            code: "CF",
            flag: "🇨🇫"
          },
          { name: "Chad", dial_code: "+235", code: "TD", flag: "🇹🇩" },
          { name: "Chile", dial_code: "+56", code: "CL", flag: "🇨🇱" },
          { name: "China", dial_code: "+86", code: "CN", flag: "🇨🇳" },
          {
            name: "Christmas Island",
            dial_code: "+61",
            code: "CX",
            flag: "🇨🇽"
          },
          {
            name: "Cocos (Keeling) Islands",
            dial_code: "+61",
            code: "CC",
            flag: "🇨🇨"
          },
          { name: "Colombia", dial_code: "+57", code: "CO", flag: "" },
          { name: "Comoros", dial_code: "+269", code: "KM", flag: "🇰🇲" },
          { name: "Congo", dial_code: "+242", code: "CG", flag: "🇨🇬" },
          {
            name: "Congo, The Democratic Republic of the Congo",
            dial_code: "+243",
            code: "CD",
            flag: "🇨🇩"
          },
          { name: "Cook Islands", dial_code: "+682", code: "CK", flag: "🇨🇰" },
          { name: "Costa Rica", dial_code: "+506", code: "CR", flag: "🇨🇷" },
          { name: "Cote d'Ivoire", dial_code: "+225", code: "CI", flag: "🇨🇮" },
          { name: "Croatia", dial_code: "+385", code: "HR", flag: "🇭🇷" },
          { name: "Cuba", dial_code: "+53", code: "CU", flag: "🇨🇺" },
          { name: "Cyprus", dial_code: "+357", code: "CY", flag: "🇨🇾" },
          { name: "Czech Republic", dial_code: "+420", code: "CZ", flag: "🇨🇿" },
          { name: "Denmark", dial_code: "+45", code: "DK", flag: "🇩🇰" },
          { name: "Djibouti", dial_code: "+253", code: "DJ", flag: "🇩🇯" },
          { name: "Dominica", dial_code: "+1767", code: "DM", flag: "🇩🇲" },
          {
            name: "Dominican Republic",
            dial_code: "+1849",
            code: "DO",
            flag: "🇨🇩"
          },
          { name: "Ecuador", dial_code: "+593", code: "EC", flag: "🇪🇨" },
          { name: "Egypt", dial_code: "+20", code: "EG", flag: "🇪🇬" },
          { name: "El Salvador", dial_code: "+503", code: "SV", flag: "🇸🇻" },
          {
            name: "Equatorial Guinea",
            dial_code: "+240",
            code: "GQ",
            flag: "🇬🇶"
          },
          { name: "Eritrea", dial_code: "+291", code: "ER", flag: "🇪🇷" },
          { name: "Estonia", dial_code: "+372", code: "EE", flag: "🇪🇪" },
          { name: "Ethiopia", dial_code: "+251", code: "ET", flag: "🇪🇹" },
          {
            name: "Falkland Islands (Malvinas)",
            dial_code: "+500",
            code: "FK",
            flag: "🇫🇰"
          },
          { name: "Faroe Islands", dial_code: "+298", code: "FO", flag: "" },
          { name: "Fiji", dial_code: "+679", code: "FJ", flag: "🇫🇯" },
          { name: "Finland", dial_code: "+358", code: "FI", flag: "🇫🇮" },
          { name: "France", dial_code: "+33", code: "FR", flag: "🇫🇷" },
          { name: "French Guiana", dial_code: "+594", code: "GF", flag: "🇬🇫" },
          {
            name: "French Polynesia",
            dial_code: "+689",
            code: "PF",
            flag: "🇵🇫"
          },
          {
            name: "French Southern Territories",
            dial_code: "+262",
            code: "TF",
            flag: "🇹🇫"
          },
          { name: "Gabon", dial_code: "+241", code: "GA", flag: "🇬🇦" },
          { name: "Gambia", dial_code: "+220", code: "GM", flag: "🇬🇲" },
          { name: "Georgia", dial_code: "+995", code: "GE", flag: "🇬🇪" },
          { name: "Germany", dial_code: "+49", code: "DE", flag: "🇩🇪" },
          { name: "Ghana", dial_code: "+233", code: "GH", flag: "🇬🇭" },
          { name: "Gibraltar", dial_code: "+350", code: "GI", flag: "🇬🇮" },
          { name: "Greece", dial_code: "+30", code: "GR", flag: "🇬🇷" },
          { name: "Greenland", dial_code: "+299", code: "GL", flag: "🇬🇱" },
          { name: "Grenada", dial_code: "+1473", code: "GD", flag: "🇬🇩" },
          { name: "Guadeloupe", dial_code: "+590", code: "GP", flag: "🇬🇵" },
          { name: "Guam", dial_code: "+1671", code: "GU", flag: "🇬🇺" },
          { name: "Guatemala", dial_code: "+502", code: "GT", flag: "🇬🇹" },
          { name: "Guernsey", dial_code: "+44", code: "GG", flag: "🇬🇬" },
          { name: "Guinea", dial_code: "+224", code: "GN", flag: "🇬🇳" },
          { name: "Guinea-Bissau", dial_code: "+245", code: "GW", flag: "🇬🇼" },
          { name: "Guyana", dial_code: "+592", code: "GY", flag: "🇬🇾" },
          { name: "Haiti", dial_code: "+509", code: "HT", flag: "🇭🇹" },
          {
            name: "Heard Island and Mcdonald Islands",
            dial_code: "+0",
            code: "HM",
            flag: "🏳"
          },
          {
            name: "Holy See (Vatican City State)",
            dial_code: "+379",
            code: "VA",
            flag: "🇻🇦"
          },
          { name: "Honduras", dial_code: "+504", code: "HN", flag: "🇭🇳" },
          { name: "Hong Kong", dial_code: "+852", code: "HK", flag: "🇭🇰" },
          { name: "Hungary", dial_code: "+36", code: "HU", flag: "🇭🇺" },
          { name: "Iceland", dial_code: "+354", code: "IS", flag: "🇮🇸" },
          { name: "India", dial_code: "+91", code: "IN", flag: "🇮🇳" },
          { name: "Indonesia", dial_code: "+62", code: "ID", flag: "🇮🇩" },
          {
            name: "Iran, Islamic Republic of Persian Gulf",
            dial_code: "+98",
            code: "IR",
            flag: "🇮🇷"
          },
          { name: "Iraq", dial_code: "+964", code: "IQ", flag: "🇮🇶" },
          { name: "Ireland", dial_code: "+353", code: "IE", flag: "🇮🇪" },
          { name: "Isle of Man", dial_code: "+44", code: "IM", flag: "🇮🇲" },
          { name: "Israel", dial_code: "+972", code: "IL", flag: "🇮🇱" },
          { name: "Italy", dial_code: "+39", code: "IT", flag: "🇮🇹" },
          { name: "Jamaica", dial_code: "+1876", code: "JM", flag: "🇯🇲" },
          { name: "Japan", dial_code: "+81", code: "JP", flag: "🇯🇵" },
          { name: "Jersey", dial_code: "+44", code: "JE", flag: "🇯🇪" },
          { name: "Jordan", dial_code: "+962", code: "JO", flag: "🇯🇴" },
          { name: "Kazakhstan", dial_code: "+7", code: "KZ", flag: "🇰🇿" },
          { name: "Kenya", dial_code: "+254", code: "KE", flag: "🇰🇪" },
          { name: "Kiribati", dial_code: "+686", code: "KI", flag: "🇰🇮" },
          {
            name: "Korea, Democratic People's Republic of Korea",
            dial_code: "+850",
            code: "KP",
            flag: "🇰🇵"
          },
          {
            name: "Korea, Republic of South Korea",
            dial_code: "+82",
            code: "KR",
            flag: "🇰🇷"
          },
          { name: "Kosovo", dial_code: "+383", code: "XK", flag: "🇽🇰" },
          { name: "Kuwait", dial_code: "+965", code: "KW", flag: "🇰🇼" },
          { name: "Kyrgyzstan", dial_code: "+996", code: "KG", flag: "🇰🇬" },
          { name: "Laos", dial_code: "+856", code: "LA", flag: "🇱🇦" },
          { name: "Latvia", dial_code: "+371", code: "LV", flag: "🇱🇻" },
          { name: "Lebanon", dial_code: "+961", code: "LB", flag: "🇱🇧" },
          { name: "Lesotho", dial_code: "+266", code: "LS", flag: "🇱🇸" },
          { name: "Liberia", dial_code: "+231", code: "LR", flag: "🇱🇷" },
          {
            name: "Libyan Arab Jamahiriya",
            dial_code: "+218",
            code: "LY",
            flag: "🇱🇾"
          },
          { name: "Liechtenstein", dial_code: "+423", code: "LI", flag: "🇱🇮" },
          { name: "Lithuania", dial_code: "+370", code: "LT", flag: "🇱🇹" },
          { name: "Luxembourg", dial_code: "+352", code: "LU", flag: "🇱🇺" },
          { name: "Macao", dial_code: "+853", code: "MO", flag: "🇲🇴" },
          { name: "Macedonia", dial_code: "+389", code: "MK", flag: "🇲🇰" },
          { name: "Madagascar", dial_code: "+261", code: "MG", flag: "🇲🇬" },
          { name: "Malawi", dial_code: "+265", code: "MW", flag: "🇲🇼" },
          { name: "Malaysia", dial_code: "+60", code: "MY", flag: "🇲🇾" },
          { name: "Maldives", dial_code: "+960", code: "MV", flag: "🇲🇻" },
          { name: "Mali", dial_code: "+223", code: "ML", flag: "🇲🇱" },
          { name: "Malta", dial_code: "+356", code: "MT", flag: "🇲🇹" },
          {
            name: "Marshall Islands",
            dial_code: "+692",
            code: "MH",
            flag: "🇲🇭"
          },
          { name: "Martinique", dial_code: "+596", code: "MQ", flag: "🇲🇶" },
          { name: "Mauritania", dial_code: "+222", code: "MR", flag: "🇲🇷" },
          { name: "Mauritius", dial_code: "+230", code: "MU", flag: "🇲🇺" },
          { name: "Mayotte", dial_code: "+262", code: "YT", flag: "🇾🇹" },
          { name: "Mexico", dial_code: "+52", code: "MX", flag: "🇲🇽" },
          {
            name: "Micronesia, Federated States of Micronesia",
            dial_code: "+691",
            code: "FM",
            flag: "🇫🇲"
          },
          { name: "Moldova", dial_code: "+373", code: "MD", flag: "🇲🇩" },
          { name: "Monaco", dial_code: "+377", code: "MC", flag: "🇲🇨" },
          { name: "Mongolia", dial_code: "+976", code: "MN", flag: "🇲🇳" },
          { name: "Montenegro", dial_code: "+382", code: "ME", flag: "🇲🇪" },
          { name: "Montserrat", dial_code: "+1664", code: "MS", flag: "🇲🇸" },
          { name: "Morocco", dial_code: "+212", code: "MA", flag: "🇲🇦" },
          { name: "Mozambique", dial_code: "+258", code: "MZ", flag: "🇲🇿" },
          { name: "Myanmar", dial_code: "+95", code: "MM", flag: "🇲🇲" },
          { name: "Namibia", dial_code: "+264", code: "NA", flag: "🇳🇦" },
          { name: "Nauru", dial_code: "+674", code: "NR", flag: "🇳🇷" },
          { name: "Nepal", dial_code: "+977", code: "NP", flag: "🇳🇵" },
          { name: "Netherlands", dial_code: "+31", code: "NL", flag: "🇳🇱" },
          {
            name: "Netherlands Antilles",
            dial_code: "+599",
            code: "AN",
            flag: "🇳🇱"
          },
          { name: "New Caledonia", dial_code: "+687", code: "NC", flag: "🇳🇨" },
          { name: "New Zealand", dial_code: "+64", code: "NZ", flag: "🇳🇿" },
          { name: "Nicaragua", dial_code: "+505", code: "NI", flag: "🇳🇮" },
          { name: "Niger", dial_code: "+227", code: "NE", flag: "🇳🇪" },
          { name: "Nigeria", dial_code: "+234", code: "NG", flag: "🇳🇬" },
          { name: "Niue", dial_code: "+683", code: "NU", flag: "🇳🇺" },
          { name: "Norfolk Island", dial_code: "+672", code: "NF", flag: "🇳🇫" },
          {
            name: "Northern Mariana Islands",
            dial_code: "+1670",
            code: "MP",
            flag: "🏳"
          },
          { name: "Norway", dial_code: "+47", code: "NO", flag: "🇳🇴" },
          { name: "Oman", dial_code: "+968", code: "OM", flag: "🇴🇲" },
          { name: "Pakistan", dial_code: "+92", code: "PK", flag: "🇵🇰" },
          { name: "Palau", dial_code: "+680", code: "PW", flag: "🇵🇼" },
          {
            name: "Palestinian Territory, Occupied",
            dial_code: "+970",
            code: "PS",
            flag: "🇵🇸"
          },
          { name: "Panama", dial_code: "+507", code: "PA", flag: "🇵🇦" },
          {
            name: "Papua New Guinea",
            dial_code: "+675",
            code: "PG",
            flag: "🇵🇬"
          },
          { name: "Paraguay", dial_code: "+595", code: "PY", flag: "🇵🇾" },
          { name: "Peru", dial_code: "+51", code: "PE", flag: "🇵🇪" },
          { name: "Philippines", dial_code: "+63", code: "PH", flag: "🇵🇭" },
          { name: "Pitcairn", dial_code: "+64", code: "PN", flag: "🇵🇳" },
          { name: "Poland", dial_code: "+48", code: "PL", flag: "🇵🇱" },
          { name: "Portugal", dial_code: "+351", code: "PT", flag: "🇵🇹" },
          { name: "Puerto Rico", dial_code: "+1939", code: "PR", flag: "🇵🇷" },
          { name: "Qatar", dial_code: "+974", code: "QA", flag: "🇶🇦" },
          { name: "Romania", dial_code: "+40", code: "RO", flag: "🇷🇴" },
          { name: "Russia", dial_code: "+7", code: "RU", flag: "🇷🇺" },
          { name: "Rwanda", dial_code: "+250", code: "RW", flag: "🇷🇼" },
          { name: "Reunion", dial_code: "+262", code: "RE", flag: "🇫🇷" },
          {
            name: "Saint Barthelemy",
            dial_code: "+590",
            code: "BL",
            flag: "🇧🇱"
          },
          {
            name: "Saint Helena, Ascension and Tristan Da Cunha",
            dial_code: "+290",
            code: "SH",
            flag: "🇸🇭"
          },
          {
            name: "Saint Kitts and Nevis",
            dial_code: "+1869",
            code: "KN",
            flag: "🇰🇳"
          },
          { name: "Saint Lucia", dial_code: "+1758", code: "LC", flag: "🇱🇨" },
          { name: "Saint Martin", dial_code: "+590", code: "MF", flag: "🏳" },
          {
            name: "Saint Pierre and Miquelon",
            dial_code: "+508",
            code: "PM",
            flag: "🇵🇲"
          },
          {
            name: "Saint Vincent and the Grenadines",
            dial_code: "+1784",
            code: "VC",
            flag: "🇻🇨"
          },
          { name: "Samoa", dial_code: "+685", code: "WS", flag: "🇼🇸" },
          { name: "San Marino", dial_code: "+378", code: "SM", flag: "🇸🇲" },
          {
            name: "Sao Tome and Principe",
            dial_code: "+239",
            code: "ST",
            flag: "🇸🇹"
          },
          { name: "Saudi Arabia", dial_code: "+966", code: "SA", flag: "🇸🇦" },
          { name: "Senegal", dial_code: "+221", code: "SN", flag: "🇸🇳" },
          { name: "Serbia", dial_code: "+381", code: "RS", flag: "🇷🇸" },
          { name: "Seychelles", dial_code: "+248", code: "SC", flag: "🇸🇨" },
          { name: "Sierra Leone", dial_code: "+232", code: "SL", flag: "🇸🇱" },
          { name: "Singapore", dial_code: "+65", code: "SG", flag: "🇸🇬" },
          { name: "Slovakia", dial_code: "+421", code: "SK", flag: "🇸🇰" },
          { name: "Slovenia", dial_code: "+386", code: "SI", flag: "🇸🇮" },
          {
            name: "Solomon Islands",
            dial_code: "+677",
            code: "SB",
            flag: "🇸🇧"
          },
          { name: "Somalia", dial_code: "+252", code: "SO", flag: "🇸🇴" },
          { name: "South Africa", dial_code: "+27", code: "ZA", flag: "🇿🇦" },
          { name: "South Sudan", dial_code: "+211", code: "SS", flag: "🇸🇸" },
          {
            name: "South Georgia and the South Sandwich Islands",
            dial_code: "+500",
            code: "GS",
            flag: "🇬🇸"
          },
          { name: "Spain", dial_code: "+34", code: "ES", flag: "🇪🇸" },
          { name: "Sri Lanka", dial_code: "+94", code: "LK", flag: "🇱🇰" },
          { name: "Sudan", dial_code: "+249", code: "SD", flag: "🇸🇩" },
          { name: "Suriname", dial_code: "+597", code: "SR", flag: "🇸🇷" },
          {
            name: "Svalbard and Jan Mayen",
            dial_code: "+47",
            code: "SJ",
            flag: "🇩🇰"
          },
          { name: "Swaziland", dial_code: "+268", code: "SZ", flag: "🇸🇿" },
          { name: "Sweden", dial_code: "+46", code: "SE", flag: "🇸🇪" },
          { name: "Switzerland", dial_code: "+41", code: "CH", flag: "🇨🇭" },
          {
            name: "Syrian Arab Republic",
            dial_code: "+963",
            code: "SY",
            flag: "🇸🇾"
          },
          { name: "Taiwan", dial_code: "+886", code: "TW", flag: "🇹🇼" },
          { name: "Tajikistan", dial_code: "+992", code: "TJ", flag: "🇹🇯" },
          {
            name: "Tanzania, United Republic of Tanzania",
            dial_code: "+255",
            code: "TZ",
            flag: "🇹🇿"
          },
          { name: "Thailand", dial_code: "+66", code: "TH", flag: "🇹🇭" },
          { name: "Timor-Leste", dial_code: "+670", code: "TL", flag: "🇹🇱" },
          { name: "Togo", dial_code: "+228", code: "TG", flag: "🇹🇬" },
          { name: "Tokelau", dial_code: "+690", code: "TK", flag: "🇹🇰" },
          { name: "Tonga", dial_code: "+676", code: "TO", flag: "🇹🇴" },
          {
            name: "Trinidad and Tobago",
            dial_code: "+1868",
            code: "TT",
            flag: "🇹🇹"
          },
          { name: "Tunisia", dial_code: "+216", code: "TN", flag: "🇹🇳" },
          { name: "Turkey", dial_code: "+90", code: "TR", flag: "🇹🇷" },
          { name: "Turkmenistan", dial_code: "+993", code: "TM", flag: "🇹🇲" },
          {
            name: "Turks and Caicos Islands",
            dial_code: "+1649",
            code: "TC",
            flag: "🇹🇨"
          },
          { name: "Tuvalu", dial_code: "+688", code: "TV", flag: "🇹🇻" },
          { name: "Uganda", dial_code: "+256", code: "UG", flag: "🇺🇬" },
          { name: "Ukraine", dial_code: "+380", code: "UA", flag: "🇺🇦" },
          {
            name: "United Arab Emirates",
            dial_code: "+971",
            code: "AE",
            flag: "🇦🇪"
          },
          { name: "United Kingdom", dial_code: "+44", code: "GB", flag: "🇬🇧" },
          { name: "United States", dial_code: "+1", code: "US", flag: "🇺🇸" },
          { name: "Uruguay", dial_code: "+598", code: "UY", flag: "🇺🇾" },
          { name: "Uzbekistan", dial_code: "+998", code: "UZ", flag: "🇺🇿" },
          { name: "Vanuatu", dial_code: "+678", code: "VU", flag: "🇻🇺" },
          {
            name: "Venezuela, Bolivarian Republic of Venezuela",
            dial_code: "+58",
            code: "VE",
            flag: "🇻🇪"
          },
          { name: "Vietnam", dial_code: "+84", code: "VN", flag: "🇻🇳" },
          {
            name: "Virgin Islands, British",
            dial_code: "+1284",
            code: "VG",
            flag: "🇻🇬"
          },
          {
            name: "Virgin Islands, U.S.",
            dial_code: "+1340",
            code: "VI",
            flag: "🇻🇮"
          },
          {
            name: "Wallis and Futuna",
            dial_code: "+681",
            code: "WF",
            flag: "🇼🇫"
          },
          { name: "Yemen", dial_code: "+967", code: "YE", flag: "🇾🇪" },
          { name: "Zambia", dial_code: "+260", code: "ZM", flag: "🇿🇲" },
          { name: "Zimbabwe", dial_code: "+263", code: "ZW", flag: "🇿🇼" }
        ];
        
        export default countries;

- tslint.json    countires가 변수의 이름 순이 아니기 때문에 린트오류가 날 수 있다.

        {
          "extends": ["tslint:recommended", "tslint-react", "tslint-config-prettier"],
          "linterOptions": {
            "exclude": [
              "config/**/*.js",
              "node_modules/**/*.ts",
              "coverage/lcov-report/*.js",
              "src/lib/countries.ts"
            ]
          }
        }

Input 컴포넌트를 생성하자.

- src/components/Input/Input.tsx

        import React from "react";
        import styled from "../../typed-components";
        
        const Container = styled.input`
          border: none;
          border-bottom: 2px solid ${props => props.theme.greyColor};
          font-size: 20px;
          width: 100%;
          padding-bottom: 10px;
          font-weight: 500;
          transition: border-bottom 0.1s linear;
          &:-webkit-autofill {
            box-shadow: 0 0 0px 1000px white insert !important;
          }
          &:focus {
            border-bottom-color: #2c3e50;
            outline: none;
          }
          &::placeholder {
            color: ${props => props.theme.greyColor};
            font-weight: 300;
          }
        `;
        
        const Input =({ placeholder }) => <Container placeholder={placeholder} />;
        export default Input;

- src/index.ts

        export { default } from "./Input";

BackArrow 컴포넌트를 생성하자. BlackArrow에는 className을 주어서 상단에서 css 설정해주자. 그 이유는 부모의 center를 잡아야 하기 때문이다. 

BackArrow에 사용한 svg는 [https://iconmonstr.com/](https://iconmonstr.com/) 에서 찾아서 썼다.

- src/components/BackArrow/BackArrow.tsx

        import React from "react";
        import { Link } from "react-router-dom";
        import styled from "../../typed-components";
        
        const Container = styled.div`
          transform: saclae(0.8);
        `
        
        interface IProps {
          backTo: string;
          className?: string;
        }
        
        const BackArrow: React.SFC<IProps> = ({ backTo, className }) => (
          <Container className={className}>
            <Link to={backTo}>
            <svg
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
                fillRule="evenodd"
                clipRule="evenodd"
              >
                <path d="M20 .755l-14.374 11.245 14.374 11.219-.619.781-15.381-12 15.391-12 .609.755z" />
              </svg>
            </Link>
          </Container>
        );
        
        export default BackArrow;

- src/components/BackArrow/index.ts

        export { default } from "./BackArrow";

     

- src/routes/PhoneLogin/PhoneLoginPresenter.tsx

        import BackArrow from "components/BackArrow";
        import Input from "components/Input";
        import countries from "lib/countries";
        import React from "react";
        import Helmet from "react-helmet";
        import styled from "../../typed-components";
        
        const Container = styled.div`
          margin-top: 30px;
          padding: 50px 20px;
        `;
        
        const BackArrowExtended = styled(BackArrow)`
          position: absolute;
          top: 20px;
          left: 20px;
        `;
        
        const Title = styled.h2`
          font-size: 25px;
          margin-bottom: 40px;
        `;
        
        const CountrySelect = styled.select`
          font-size: 20px;
          color: "#2c3e50";
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-color: white;
          border: 0;
          font-family: "Maven Pro";
          margin-bottom: 20px;
          width: 90%;
        `;
        
        const CountryOption = styled.option``;
        
        const Form = styled.form``;
        
        const Button = styled.button`
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          right: 50px;
          bottom: 50px;
          padding: 20px;
          color: white;
          border-radius: 50%;
          background-color: black;
          box-shadow: 0 18px 35px rgba(50, 50, 93, 0.1), 0 8px 15px rgba(0, 0, 0, 0.07);
          cursor: pointer;
        `;
        
        const PhoneLoginPresenter = () => (
          <Container>
            <Helmet>
              <title>Phone Login | Number</title>
            </Helmet>
            <BackArrowExtended backTo={"/"}/>
            <Title>Enter your mobile number</Title>
            <CountrySelect>
              {countries.map((country, index) => (
                <CountryOption key={index} value={country.dial_code}>
                  {country.flag} {country.name} ({country.dial_code})
                </CountryOption>
              ))}
            </CountrySelect>
            <Form>
              <Input placeholder={"053 690 2129"}/>
              <Button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={"white"}
                >
                  <path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z" />
                </svg>
              </Button>
            </Form>
          </Container>
        );
        
        export default PhoneLoginPresenter;

- src/routes/PhoneLogin/PhoneLoginContainer.tsx

        import React from "react";
        import PhoneLoginPresenter from "./PhoneLoginPresenter";
        
        
        class PhoneLoginContainer extends React.Component {
          public render() {
            return <PhoneLoginPresenter/>;
          }
        }
        
        export default PhoneLoginContainer;

- src/routes/PhoneLogin/index.ts 파일명을 index.tsx → index.ts로 바수정하자.

        export { default } from "./PhoneLoginContainer";

- src/routes/SocialLogin/SocialLoginPresenter.tsx

        import BackArrow from "components/BackArrow";
        import React from "react";
        import Helmet from "react-helmet";
        import styled from "../../typed-components";
        
        const Container = styled.div`
          margin-top: 30px;
          padding: 50px 20px;
        `;
        
        const Title = styled.h2`
          font-size: 25px;
          margin-bottom: 40px;
        `;
        
        const Link = styled.span`
          display: flex;
          align-items: center;
        `;
        
        const Icon = styled.span`
          margin-right: 10px;
        `;
        
        const BackArrowExtended = styled(BackArrow)`
          position: absolute;
          top: 20px;
          left: 20px;
        `;
        
        const socialLoginPresenter = () => (
          <Container>
            <Helmet>
              <title>Social Login | Nuber</title>
            </Helmet>
            <Title>Choose an account</Title>
            <BackArrowExtended backTo={"/"} />
            <Link>
              <Icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="#344EA1"
                >
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </Icon>
            </Link>
          </Container>
        );
        
        export default socialLoginPresenter;

- src/routes/SocialLogin/SocialLoginContainer.tsx

        import React from "react";
        import SocialLoginPresenter from "./SocialLoginPresenter";
        
        class SocialLoginContainer extends React.Component {
          public render() {
            return <SocialLoginPresenter />;
          }
        }
        
        export default SocialLoginContainer;

- src/routes/SocialLogin/index.ts

        export { default } from "./SocialLoginContainer";

[http://localhost:3000/phone-login](http://localhost:3000/phone-login)

핸드폰을 통해 로그인 하는 창이 완성했다. 아직 기능은 만들어지지 않았다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952575/tlog/_2019-06-29__3-48031e4f-f526-4d10-8b2e-d319aabe2c33.01.32_s0deef.png)

[http://localhost:3000/social-login](http://localhost:3000/social-login)

페이스북을 통해 로그인 하는 창이 완성했다. 아직 기능은 만들어지지 않았다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952575/tlog/_2019-06-29__3-ee9b3362-6dfb-43f5-bf19-5759403b708c.01.41_gc4x1s.png)

## #2.15 Inputs and Typescript part One

typescript에서 Input을 다룰 예정이다. 로그인을 할때든 인풋을 사용하는 경우는 흔한데, 니콜라스는 Input 컴포넌트 클래스를  공용 클래스로 정의해서 사용한다.

TypeScript 에서는 Prop와 State 모두 인터페이스로 정의해서 사용한다. 귀찮을 수 있지만, 나중에는 헷갈리는 것을 방지 한다.

- src/routes/PhoneLogin/PhoneLoginContainer.tsx

        import React from "react";
        import { RouteComponentProps  } from "react-router-dom";
        import PhoneLoginPresenter from "./PhoneLoginPresenter";
        
        interface IState {
          countryCode: string;
          phoneNumber: string;
        }
        
        class PhoneLoginContainer extends React.Component<
          RouteComponentProps<any>,
          IState
        > {
        
          public state = {
            countryCode: "+82",
            phoneNumber: ""
          };
        
          public render() {
            return <PhoneLoginPresenter/>;
          }
        }
        
        export default PhoneLoginContainer;

- src/components/Input/Input.tsx 에도 Props의 타입을 정의하자.

        import React from "react";
        import styled from "../../typed-components";
        
        const Container = styled.input`
          
        ...
        
        interface IProps {
          placeholder?: string;
          type?: string;
          required?: boolean;
          value: string;
        }
        
        const Input: React.SFC<IProps> = ({ 
          placeholder = "",
          type = "text",
          required = true,
          value
        }) => (
          <Container 
            placeholder={placeholder}
            type={type}
            required={required}
            value={value}
          />
        );
        export default Input;

- src/routes/PhoneLogin/PhoneLoginPresenter.tsx 에도 Props 타입을 정의하고 받은 Props를 값으로 사용하도록 수정하자.

        ...
        
        const Button = styled.button`
         ...
        `;
        
        interface IProps {
          countryCode: string;
          phoneNumber: string;
        }
        
        const PhoneLoginPresenter: React.SFC<IProps> = ({
          countryCode,
          phoneNumber
        }) => (
          <Container>
            <Helmet>
              <title>Phone Login | Number</title>
            </Helmet>
            <BackArrowExtended backTo={"/"}/>
            <Title>Enter your mobile number</Title>
            <CountrySelect value={countryCode}>
              {countries.map((country, index) => (
                <CountryOption key={index} value={country.dial_code}>
                  {country.flag} {country.name} ({country.dial_code})
                </CountryOption>
              ))}
            </CountrySelect>
            <Form>
              <Input placeholder={"053 690 2129"} value={phoneNumber}/>
              <Button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={"white"}
                >
                  <path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z" />
                </svg>
              </Button>
            </Form>
          </Container>
        );
        
        export default PhoneLoginPresenter;

이렇게 수정하면 PhoneLoginContainer.tsx 에서 PhoneLoginPresenter.tsx 로 Props를 제대로 전달하지 않는다고 할 것이다. Presentional 컴포넌트에 필요한 인자는 빠짐 없이 전달하자.

- src/routes/PhoneLogin/PhoneLoginContainer.tsx

        ...
        public render() {
            const { countryCode, phoneNumber } = this.state;
            return <PhoneLoginPresenter
              countryCode={countryCode}
              phoneNumber={phoneNumber}
            />;
          }
        }
        
        export default PhoneLoginContainer;

자 이렇게 하고 브라우저에서 확인하면 default 값이 KR 코드로 뜬다. 아직은 전화번호를 입력해도 값이 변경되지 않는데, 이 값은 onChange 이벤트를 걸어줄 것이다. 다음 강의에서 이어진다.

## #2.16 Inputs and Typescript part Two

저번에 이어서 이제 onChange 이벤트를 달아보자.

Container에서 graphql로 데이터를 가져오고 state를 가지고 조작하는 것은 redux때랑 비슷하다.

- src/routes/PhoneLogin/PhoneLoginContainer.tsx   `onInputChange` 이벤트를 정의하고 Presenter에 넘긴다.

        ...
        public render() {
            const { countryCode, phoneNumber } = this.state;
            return <PhoneLoginPresenter
              countryCode={countryCode}
              phoneNumber={phoneNumber}
              onInputChange={this.onInputChange}
            />;
          }
          
          public onInputChange: React.ChangeEventHandler<
            HTMLInputElement | HTMLSelectElement
          > = event => {
            const {
              target: { name, value }
            } = event;
            this.setState({
              [name]: value
            } as any);
          };
        }
        
        export default PhoneLoginContainer;

이렇게 정의하면 알아서 PhoneLoginPresenter가  `onInputChange`를 받지 않는다고 경고가 뜬다. 

- src/routes/PhoneLogin/PhoneLoginPresenter.tsx onInputChange를 Props 에 추가하고 CountrySelect와 Input 컴포넌트에 넘긴다. 추가적으로 input에 대한 name 속성을 넣었다. 이것은 좀 더 스마트하게 input 을 컨트롤 하기 위한 일반적인 방법이다.

        ...
        
        interface IProps {
          countryCode: string;
          phoneNumber: string;
          onInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
        }
        
        const PhoneLoginPresenter: React.SFC<IProps> = ({
          countryCode,
          phoneNumber,
          onInputChange,
        }) => (
          <Container>
            <Helmet>
              <title>Phone Login | Number</title>
            </Helmet>
            <BackArrowExtended backTo={"/"}/>
            <Title>Enter your mobile number</Title>
            <CountrySelect 
              value={countryCode} 
              onChange={onInputChange}
              name="countryCode"
            >
              {countries.map((country, index) => (
                <CountryOption key={index} value={country.dial_code}>
                  {country.flag} {country.name} ({country.dial_code})
                </CountryOption>
              ))}
            </CountrySelect>
            <Form>
              <Input 
                placeholder={"053 690 2129"} 
                value={phoneNumber} 
                onChange={onInputChange}
                name="phoneNumber"
              />
              <Button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={"white"}
                >
                  <path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z" />
                </svg>
              </Button>
            </Form>
          </Container>
        );
        
        export default PhoneLoginPresenter;

이어서 Input 컴포넌트도 `onChange` 이벤트를 받지 않고 있다고 경고창이 뜬다.

- src/components/Input/Input.tsx

        ...
        
        interface IProps {
          value: string;
          onChange: any;
        	placeholder?: string;
          type?: string;
          required?: boolean;
          name?: string;
        	className?: string;
        }
        
        const Input: React.SFC<IProps> = ({ 
          placeholder = "",
          type = "text",
          required = true,
          value, 
          onChange,
          name = "",
        	className
        }) => (
          <Container 
            placeholder={placeholder}
            type={type}
            required={required}
            value={value}
            onChange={onChange}
            name={name}
        		className={className}
          />
        );
        
        export default Input;

이렇게 하고 클라이언트에서 입력을 해보면 셀렉트되고 입력이 된다. 타입스크립트는 설정할 것들이 좀 더 있지만, 실수를 줄일 수 있을 것이다.

이번엔 onSubmit을 정의하자. 일단 이벤트만 연결하자.

- src/routes/PhoneLogin/PhoneLoginContainer.tsx

        ...
        	public render() {
            const { countryCode, phoneNumber } = this.state;
            return <PhoneLoginPresenter
              countryCode={countryCode}
              phoneNumber={phoneNumber}
              onInputChange={this.onInputChange}
              onSubmit={this.onSubmit}
            />;
          }
        
          ...
        
          public onSubmit: React.FormEventHandler<HTMLFormElement> = event => {
            event.preventDefault();
            const { countryCode, phoneNumber } = this.state;
            // tslint:disable-next-line
            console.log(countryCode, phoneNumber);
          }
        }
        
        export default PhoneLoginContainer;

- src/routes/PhoneLogin/PhoneLoginPresenter.tsx

        ...
        interface IProps {
          countryCode: string;
          phoneNumber: string;
          onInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
        }
        
        const PhoneLoginPresenter: React.SFC<IProps> = ({
          countryCode,
          phoneNumber,
          onInputChange,
          onSubmit,
        }) => (
        
        ...
            <Form onSubmit={onSubmit}>
        ...

국가를 선택하고 인풋에 아무거나 입력하고 버튼을 누르면 콘솔에  값들이 찍히는 것을 확인할 수 있다.

## #2.17 Notifications with React Toastify

이번에는 니콜라스가 소개한 멋진 라이브러를 사용할 것이다. 바로 Toastify 인데 간단하게 앱처럼 토스트 창을 띄우기 좋다. [https://github.com/fkhadra/react-toastify](https://github.com/fkhadra/react-toastify) 

    $ yarn add react-toastify
    $ yarn add @types/react-toastify --dev

- src/routes/PhoneLogin/PhoneLoginContainer.tsx 에 콘솔 띄우는 코드를 지우고 toast 띄우는 코드로 변경하자. 딱 보기에도 간단하다.

        import React from "react";
        import { RouteComponentProps  } from "react-router-dom";
        import { toast } from "react-toastify";
        import PhoneLoginPresenter from "./PhoneLoginPresenter";
        
        ...
        
          public onSubmit: React.FormEventHandler<HTMLFormElement> = event => {
            event.preventDefault();
            const { countryCode, phoneNumber } = this.state;
            toast.error("Please write a valid phone number" + countryCode + phoneNumber);
          }
        }
        
        export default PhoneLoginContainer;

- src/components/App/AppContainer.tsx  위 처럼 사용하면 정말 깔끔하겠지만,,, 해줄 것이 더있다. AppContainer에 ToastContainer 를 포함시켜야 한다.

        import React, { Fragment } from "react";
        import { graphql } from "react-apollo";
        import { ToastContainer } from "react-toastify";
        import "react-toastify/dist/ReactToastify.min.css";
        import { theme } from '../../theme';
        import GlobalStyle from '../../global-styles';
        import { ThemeProvider } from '../../typed-components';
        import AppPresenter from './AppPresenter';
        import { IS_LOGGED_IN } from "./AppQueries";
        
        const AppContainer: any = ({ data }) => (
          <Fragment>
            <GlobalStyle/>
            <ThemeProvider theme={theme}>
              <AppPresenter isLoggedIn={data.auth.isLoggedIn}/>
            </ThemeProvider>
            <ToastContainer draggable={true} position="bottom-center" />
          </Fragment>
        );
        
        export default graphql(IS_LOGGED_IN)(AppContainer);

이렇게 하면 경고창이 예쁘게 뜬다.

![](a3-00f8d829-cdad-43bc-954b-766b661c43b8.png)

- src/routes/PhoneLogin/PhoneLoginContainer.tsx 정규표현식으로 전화번호 형태인지 검사하고 틀린 형태일때 토스트창을 띄우도록 수정하고 이번 강의는 마무리다.

        ...
        public onSubmit: React.FormEventHandler<HTMLFormElement> = event => {
            event.preventDefault();
            const { countryCode, phoneNumber } = this.state;
            const isValid =  /^\+[1-9]{1}[0-9]{7,11}$/.test(
              `${countryCode}${phoneNumber}`
            );
            if(isValid) {
              return;
            } else {
              toast.error("please write a valid phone number!!!");
            }
          }
        }
        
        export default PhoneLoginContainer;