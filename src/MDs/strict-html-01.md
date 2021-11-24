---
title: HTML 어떻게 공부해야 하는가
date: '2021-11-04T08:56:56.243Z'
description: 견고한 UI 설계를 위한 마크업 가이드 by 정찬명 1강 - HTML 명세를 보는 방법을 알려준다.
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1636033473/tlog/cover/%E1%84%92%E1%85%AA%E1%86%AF%E1%84%89%E1%85%A5%E1%86%BC%E1%84%92%E1%85%AA%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5_r9ymiw.png'
tags:
  - HTML
---


[The RED : 견고한 UI 설계를 위한 마크업 가이드 by 정찬명 | 패스트캠퍼스](https://fastcampus.co.kr/dev_red_jcm)  
> 본 내용은 "견고한 UI 설계를 위한 마크업 가이드 by 정찬명" Part 1 - 01 HTML 어떻게 공부해야 하는가 를 보고 정리한 글 입니다.



우리는 경험적으로 아래의 퀴즈를 풀면 맞출 수는 있다. 그런데 정답이 어디에 있는지 모른다.

`QUIZ 1`

```tsx
<a>Is it valid?</a>
```

- 위 코드가 유효할까 ?
    
    YES. a 태그에 href는 필수 값이 아니다.
    

`QUIZ 2`

```tsx
<a>
	<div>Is it valid?</div>
</a>
```

- 위 코드가 유효할까?
    
    HTML5부터는 `block element`도 담을 수 있다. 사실, HTML5에서는 `inline element`, `block element`라는 용어가 사라졌다. `Flow Content`, `Phrasing Content` 을 사용한다.
    

`QUIZ 3`

```tsx
<p>
	<a>
		<div>Is it valid?</div>
	</a>
</p>

```

- 그렇다면 위 코드는 어떨까? 이 강의를 마치면 정답을 확인할 수있다.
    
    

## 기존에 우리가 학습 하던 자료

---

흔히 HTML을 처음에 학습을 하게 되면 책을 통해 학습을 하거나, 아래와 같은 사이트를 참고하여 익한다. 나도 몇년 째 참고하는 사이트이며, MDN이면 충분하지 라는 생각을 갖고 있었다. 이 강의에서는 이 두 사이트에서도 한계가 있으며, 정확한 정보는 결국 명세라고 한다.

- [W3Schools Online Web Tutorials](https://www.w3schools.com)

- [MDN Web Docs](https://developer.mozilla.org/en-US/)

<aside>
💡 기존에는 W3C에서 웹표준을 관리했지만, 2019년도 부터는 WHATWG 그룹(구글, 애플, MS, 모질라 연합)에서 표준을 관리한다고 한다.
[https://html.spec.whatwg.org](https://html.spec.whatwg.org/)
또 표준이래도 실제 브라우저의 구현 상황을 체킹해야 한다.
[https://caniuse.com](https://caniuse.com/)

</aside>

## 주요 HTML 콘텐츠 카테고리

우리가 기존에 사용했던 `Block Container`라고 불렀던 부류들은 `Flow Content`라 부르고, Inline Container라고 불렀던 것들은 -로 대부분 대체되었다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1636033654/tlog/hq4lplsuvdvnnnkbswr0.png)

어떤 엘리먼트가 어떤 컨텐츠로 1:1로 매핑되는 것이 아니라, 여러 컨텐츠 타입에 포함되어 설명하는 것이다. 아래 a elment를 예로 들면, 아래처럼 `Flow content`, `Phrasing content`, `Palpable content`에 속하며 조건에 따라 `interactive content`도 될 수 있다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1636033655/tlog/fzeylsdnjp5x4dffbyxy.png)

### Flow content

위 콘텐츠 카테고리 이미지 처럼 `Metadata content`의 `<title >` 따위의 일 부분을 제외하면 모두 `Flow content`에 포함된다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1636033655/tlog/dqmojnea6w98x7whxm3z.png)

### Metadata content

콘텐츠와 문서를 구조화하고, 다른 콘텐츠의 동작이나 추가 정보 등을 나타냄

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1636033655/tlog/uw7j4kfxqlmuqmencoqr.png)

### Heading content

문서의 섹션의 헤더로 인지되는 콘텐츠로 암묵적으로 섹션을 형성

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1636033655/tlog/m74e4ofarwwplpqvj9kk.png)

### Sectioning content

문서의 명시적인 개요를 형성

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1636033655/tlog/a44rsbslpounkas6f4rd.png)

### Phrasing content

이전에 `inline`이라고 불렀던 콘텐츠

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1636033656/tlog/lninmzc0fcn1awcjexb9.png)

### Embedded content

외부의 리소스를 참조하는 콘텐츠

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1636033656/tlog/mckdwqk2ctcqianpvcgp.png)

### Interactive content

사용자와 상호 작용을 할 수 있는 콘텐츠

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1636033657/tlog/ok2indday5wvapk3eh1z.png)

 

### 기타 카테고리

- **Palpable content**
    
    볼 수 있거나, 상호 작용(드래그 등)을 할 수 있는 콘텐츠
    
    ![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1636033657/tlog/z102sqn6qbnfyw6veas3.png)
    
- **Script-supporting element**
    
    렌더링을 하지 않고 특정한 기능과 동작을 부여
    
    ![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1636033657/tlog/ll85lk5oyzoog3eykn29.png)
    
- **Transparent content models**
    
    부모의 콘텐츠 모델을 따른다. (투명한 요소를 제거해도 부모와 자식 관계가 문법적으로 유효해야 한다.)
    
    이 콘텐츠가 글 초반에 던진 `QUIZ 3` 대답의 근거가 되는 내용이다.
    
    ![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1636033658/tlog/cioubbhs7nt644us0yo0.png)
    
    ⇒ `a, ins, del, object, video, audio, map, no script, canvas`
    

### 명세에서 카테고리 확인하기

a elment의 명세를 다시 살펴보자.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1636033657/tlog/s8fgxk4cbd1poydsfzqu.png)

`Contexts in which this element can be used` 에 a element가 `Phrasing content`의 자식으로 사용 된다로 나와있는데, 기대된다의 의미 처럼 꼭 지켜야할 내용은 아니고 대체로 그렇게 한다 정도의 의미

<aside>
💡 ***Contexts in which this element can be used***
A *non-normative* description of where the element can be used. This information is redundant with the content models of elements that allow this one as a child, and is provided only as a convenience.

</aside>

`Content model` 는 주로 자손 요소에 대한 설명인다. `Transparent`는 일단 무시하고 자손 콘텐츠가 상호작용이 가능한 콘텐츠면 안된다. 당연히 a 엘리멘트가 상호작용을 하는데, 자손 엘리먼트의 상호작용과 충돌이 날 것이기 때문이다. 같은 이유로 자손으로 a element나 tableindex 값이 정의되는 자손이 오면 안된다.
여기서 `Transparent` 속성은 a element에 대한 설명인데, 위에서 한 번 설명한 내용이라..
`부모의 콘텐츠 모델을 따른다. (투명한 요소를 제거해도 부모와 자식 관계가 문법적으로 유효해야 한다.)` 

여기서 Quiz 3를 다시 보자.

`QUIZ 3`

```html
<p> // Content model: Phrasing content
	<a> // Category: Flow, Phrasing, Interfactive, Palpable
      // Content model: Transparent, so Phrasing		
    <div>
      // Category: Flow, Palpable
      // !! Div element is not Phrasing content.
    </div>
	</a>
</p>
```

이 문제는 `Content model`에 집중하면 된다. `Content model`은 자손에 대한 설명으로 꼭 지켜야 할 명세다. `<p>` 는 span과 같은 `Phrasing content`를 자손으로 갖는다. `<a>` 태그는 `Phrasing Content`라서 `<p>`의 자손이 될 수 있지만, 이 문맥에서 `<a>`의 `Content model`이 `<p>`를 따라야 하므로 `Phrasing content`가 되어야 한다. 그런데. `<div>`는 `Phrasing content`가 아니므로 옳지 않은 DOM 구조가 된 것이다.

 같은 내용이지만 조금 다른 측면에서의 `부모의 콘텐츠 모델을 따른다. (투명한 요소를 제거해도 부모와 자식 관계가 문법적으로 유효해야 한다.)`  이 내용으로 판단해보자. `<a>` 는 `Transparent` 라 제거 되어도 DOM 구조가 유효해야 한다.

```html
<p> // Content model: Phrasing content
  <div>
    // Category: Flow, Palpable
    // Div element is not Phrasing content.
  </div>
</p>
```

*<p> 태그가 <div> 태그를 자손으로 가질 수 없다.*

만약 아래 처럼 상위태그가 div였다면 유효했을 것이다. (Flow Content에서는 별도로 Content model에 대한 설명은 없지만, Flow Content로 유추 된다.)

```html
<div> Content model: Flow
	<a> // Category: Flow, Phrasing, Interfactive, Palpable
      // Content model: Transparent, so Flow
    <div>
      // Category: Flow, Palpable
    </div>
	</a>
</div>
```