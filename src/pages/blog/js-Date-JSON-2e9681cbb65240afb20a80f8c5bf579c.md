---
templateKey: blog-post
title: Date, JSON 객체
date: 2020-06-21T08:56:56.263Z
description: Date, JSON 객체의 이모저모
featuredpost: true
featuredimage: /img/javascript.png
tags:
  - javascript
---

#

[javascript info: Date](https://ko.javascript.info/date)

## 5. 7 Date 객체와 날짜

Date 객체는 UTC 기준(UTC+0) 1970년 1월 1일 0시 0분 0초가 기준이다. 이 시간을 기준으로 흘러간 밀리초를 나타내는 정수를 타임스탬프라고 한다.

날짜는 new Date() 로 생성하고 인자를 넣을 수 있다. 인자를 넣지 않으면 오늘이 기본 값이다.

```tsx
type DateConstructor = {
	(dateString: string) => Date;
	(year: number, month: number, date: number, hours: number, minutes: number, seconds: number, ms: number) => Date
}
```

`getYear()`는 비표준이다. deprecated

```tsx
getDay();
// 0 일요일, 1 월요일 ... 6: 토요일
```

```tsx
let date = new Date(2013, 0, 32); // 2013년 1월 32일은 없지만
alert(date); // 2013년 2월 1일이 출력됩니다.
```

```tsx
new Date().getTime()  <<<< Date.now()
```

```tsx
new Date(null) → Thu Jan 01 1970 09:00:00 GMT+0900 (한국 표준시)

new Date(""), new Date(undefined), new Date("dfsfd") → Invalid Date
```

### 퀴즈 스터디 때 퀴즈

---

다음의 결과를 예측해 보시오.

- `new Date(null)`
- `new Date(undefined)`
- `new Date(NaN)`
- `new Date("")`
- `new Date([])`
- `new Date(true)`
- `new Date(true, true)`

## 5.8 JSON

[javascript info: JSON](https://ko.javascript.info/json)

JSON 객체에는 원하는 프로퍼티만 직렬화 하는 것이 가능하다.

```tsx
let room = {
  number: 23,
};

let meetup = {
  title: "Conference",
  participants: [{ name: "John" }, { name: "Alice" }],
  place: room, // meetup은 room을 참조합니다.
};

room.occupiedBy = meetup; // room references meetup

alert(JSON.stringify(meetup, ["title", "participants"]));
// {"title":"Conference","participants":[{},{}]}
```

`toString`과 마찬가지로 `toJSON`을 통해 객체를 직렬화 하는 방법을 바꿀 수 있다.

`riviver`을 사용하면 JSON 을 파싱할 때 더 강력해 질 수 있다.

```tsx
type JSON.parse = {
	(jsonString: string) => AnyObject
	(jsonString: string, (key: string, value: any) => any) => AnyObject
}

let schedule = `{
  "meetups": [
    {"title":"Conference","date":"2017-11-30T12:00:00.000Z"},
    {"title":"Birthday","date":"2017-04-18T12:00:00.000Z"}
  ]
}`;

schedule = JSON.parse(schedule, function(key, value) {
  if (key == 'date') return new Date(value);
  return value;
});

alert( schedule.meetups[1].date.getDate() ); // 잘 동작합니다!
```
