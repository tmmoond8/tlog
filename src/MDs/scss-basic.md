---
title: SCSS 사용하기
date: '2020-07-11T08:56:56.243Z'
description: SCSS를 사용하도록 프로젝트에 셋팅하기
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1633096943/tlog/ldf7eemhbzzn8ce5ve3n.png'
tags:
  - 'Project Setup'
  - CSS
---

### Sass 관련 모듈 설치 및 셋팅

node-sass 모듈을 설치해서 scss →  css 트랜스 파일 되도록 하자

```rb
$ yarn add node-sass sass-loader
```

아래처럼 webpack 설정에 sass-loader 모듈을 추가하면 된다.

- webpack.config.dev.js
    
    ```js
    ...

    {
      test: /\.scss$/,
      use: [
        require.resolve('style-loader'),
        {
          loader: require.resolve('css-loader'),
          options: {
            importLoaders: 1,
            modules: true,
            localIdentName: '[name]__[local]__[hash:base64:5]'
          },
        },
        {
          loader: require.resolve('postcss-loader'),
          options: {
            // Necessary for external CSS imports to work
            // https://github.com/facebookincubator/create-react-app/issues/2677
            ident: 'postcss',
            plugins: () => [
              require('postcss-flexbugs-fixes'),
              autoprefixer({
                browsers: [
                  '>1%',
                  'last 4 versions',
                  'Firefox ESR',
                  'not ie < 9', // React doesn't support IE8 anyway
                ],
                flexbox: 'no-2009',
              }),
            ],
          },
        },
        {
          loader: require.resolve('sass-loader'),
          options: {
            includePaths: [paths.styles]
          }
        }
      ],
    },

    ...
    ```
    

### SCSS 스타일 관련 파일 구조 및 라이브러리 추가

이 구조는 velopert님께서 잡으신 구조를 따른 구조다. 나도 이 구조는 매우 명확하다고 생각한다.

```text
styles                       # styles 관련된 파일을 포함하는 디렉토리
  ├── base.scss              # normalize.css나 reset.css 등의 내용을 포함
  ├── utils                  
  │   ├── _lib.scss          # open-color, include-media 등의 라이브러리 포함
  │   ├── _mixins.scss       # 공통으로 사용할 mixin 정의
  │   └── _variables.scss    # 공통으로 사용할 변수 정의
  └── utils.scss             # utils 디렉토리 안의 scss을 포함
```

scss를 사용한다면 default로 포함할 라이브러리 몇개가 있다. 

```rb
$ yarn add normalize.css open-color include-media
```

- styles/base.scss    아래 처럼 nomalize.css, 라이브러리의 css, 기본 font 등을 포함한다.
    
    ```scss
    // 전역으로 사용하는 스타일 폰트 설정
    @import '~normalize.css';
    @import '~react-toastify/dist/ReactToastify.min.css';
    @import url('//fonts.googleapis.com/earlyaccess/notosanskr.css');
    
    body {
      margin: 0;
      font-family: 'Note Sans KR', sans-serif;
    }
    
    * {
      padding: 0;
      margin: 0;
      box-sizing: inherit;
    }
    ```
    
- styles/utils/_lib.scss
    
    ```scss
    // https://yeun.github.io/open-color/
    @import '~open-color/open-color';
    // https://include-media.com/
    @import '~include-media/dist/include-media';
    ```
    
- styles/utils/_mixins.scss
    
    ```scss
    // source: https://codepen.io/dbox/pen/RawBEW
    @mixin material-shadow($z-depth: 1, $strength: 1, $color: black) {
      @if $z-depth == 1 {
        box-shadow: 0 1px 3px rgba($color, $strength * 0.14), 0 1px 2px rgba($color, $strength * 0.24);
      }
      @if $z-depth == 2 {
        box-shadow: 0 3px 6px rgba($color, $strength * 0.16), 0 3px 6px rgba($color, $strength * 0.23);
      }  
      @if $z-depth == 3 {
        box-shadow: 0 10px 20px rgba($color, $strength * 0.19), 0 6px 6px rgba($color, $strength * 0.23);
      }    
      @if $z-depth == 4 {
        box-shadow: 0 15px 30px rgba($color, $strength * 0.25), 0 10px 10px rgba($color, $strength * 0.22);    
      }
      @if $z-depth == 5{
        box-shadow: 0 20px 40px rgba($color, $strength * 0.30), 0 15px 12px rgba($color, $strength * 0.22);   
      }
      @if ($z-depth < 1) or ($z-depth > 5) {
        @warn "$z-depth must be between 1 and 5";
      }
    }
    ```
    
- styles/utils/_variables.scss
    
    ```scss
    $breakpoints: (boundary: 768px, mobile: 512px);
    $header-height: 2.7rem;
    ```
    
- styles/utils.scss
    
    ```scss
    /* 컴포넌트를 스타일링 할 때 사용하는 스타일 유틸리티*/
    @import 'utils/lib';
    @import 'utils/mixins';
    @import 'utils/variables';
    ```
    

### 반응형 웹

위에서 styles/utils/_lib.scss 에서 include-media 모듈을 추가 했고, 이 모듈은  `$breakpoints` 변수의 값을 사용한다. 아래처럼 사용할 수 있다.

- example.scss
    
    ```scss
    @include media("<boundary") {
        top: auto;
        right: 0;
        bottom: 0;
    }
    @include media("<mobile") {
        right: 10px;
        bottom: 0;
    }
    ```
    

### sass-lint 사용하기

sass-lint 를 사용하면 정리된 scss 파일을 작성하는데 도움이 된다.

일단 관련 모듈을 먼저 설치하자.

```rb
$ yarn add sass-lint sass-lint-auto-fix
```

.sass-int.yml 에 scss에 작성 규칙이 있다.

- .sass-lint.yml
    
    ```yaml
    # Linter Options
    options:
      # Don't merge default rules
      merge-default-rules: 
      # Set the formatter to 'html'
      formatter: html
      # Output file instead of logging results
      output-file: 'linters/sass-lint.html'
      # Raise an error if more than 50 warnings are generated
      max-warnings: 50
    # File Options
    files:
      include: '**/*.s+(a|c)ss'
      ignore:
        - 'node_modules/**/*.*'
    # Rule Configuration
    rules:
      extends-before-mixins: 2
      extends-before-declarations: 2
      placeholder-in-extend: 2
      mixins-before-declarations:
        - 2
        -
          exclude:
            - breakpoint
            - mq
    
      no-warn: 1
      no-debug: 1
      no-ids: 2
      no-important: 2
      hex-notation:
        - 2
        -
          style: uppercase
      indentation:
        - 2
        -
          size: 2
      property-sort-order:
        - 1
        -
          order:
            # Positioning
            - 'position'
            - 'top'
            - 'right'
            - 'bottom'
            - 'left'
            - 'z-index'
            - # Box model
            - 'display'
            - 'float'
            - 'width'
            - 'height'
            - 'max-width'
            - 'max-height'
            - 'min-width'
            - 'min-height'
            - 'padding'
            - 'padding-top'
            - 'padding-right'
            - 'padding-bottom'
            - 'padding-left'
            - 'margin'
            - 'margin-top'
            - 'margin-right'
            - 'margin-bottom'
            - 'margin-left'
            - 'margin-collapse'
            - 'margin-top-collapse'
            - 'margin-right-collapse'
            - 'margin-bottom-collapse'
            - 'margin-left-collapse'
            - 'overflow'
            - 'overflow-x'
            - 'overflow-y'
            - 'clip'
            - 'clear'
            - # Typographic
            - 'font'
            - 'font-family'
            - 'font-size'
            - 'font-smoothing'
            - 'osx-font-smoothing'
            - 'font-style'
            - 'font-weight'
            - 'hyphens'
            - 'src'
            - 'line-height'
            - 'letter-spacing'
            - 'word-spacing'
            - 'color'
            - 'text-align'
            - 'text-decoration'
            - 'text-indent'
            - 'text-overflow'
            - 'text-rendering'
            - 'text-size-adjust'
            - 'text-shadow'
            - 'text-transform'
            - 'word-break'
            - 'word-wrap'
            - 'white-space'
            - 'vertical-align'
            - 'list-style'
            - 'list-style-type'
            - 'list-style-position'
            - 'list-style-image'
            - 'pointer-events'
            - 'cursor'
            - # Visual
            - 'background'
            - 'background-attachment'
            - 'background-color'
            - 'background-image'
            - 'background-position'
            - 'background-repeat'
            - 'background-size'
            - 'border'
            - 'border-collapse'
            - 'border-top'
            - 'border-right'
            - 'border-bottom'
            - 'border-left'
            - 'border-color'
            - 'border-image'
            - 'border-top-color'
            - 'border-right-color'
            - 'border-bottom-color'
            - 'border-left-color'
            - 'border-spacing'
            - 'border-style'
            - 'border-top-style'
            - 'border-right-style'
            - 'border-bottom-style'
            - 'border-left-style'
            - 'border-width'
            - 'border-top-width'
            - 'border-right-width'
            - 'border-bottom-width'
            - 'border-left-width'
            - 'border-radius'
            - 'border-top-right-radius'
            - 'border-bottom-right-radius'
            - 'border-bottom-left-radius'
            - 'border-top-left-radius'
            - 'border-radius-topright'
            - 'border-radius-bottomright'
            - 'border-radius-bottomleft'
            - 'border-radius-topleft'
            - 'content'
            - 'quotes'
            - 'outline'
            - 'outline-offset'
            - 'opacity'
            - 'filter'
            - 'visibility'
            - 'size'
            - 'zoom'
            - 'transform'
            - 'box-align'
            - 'box-flex'
            - 'box-orient'
            - 'box-pack'
            - 'box-shadow'
            - 'box-sizing'
            - 'table-layout'
            - 'animation'
            - 'animation-delay'
            - 'animation-duration'
            - 'animation-iteration-count'
            - 'animation-name'
            - 'animation-play-state'
            - 'animation-timing-function'
            - 'animation-fill-mode'
            - 'transition'
            - 'transition-delay'
            - 'transition-duration'
            - 'transition-property'
            - 'transition-timing-function'
            - 'background-clip'
            - 'backface-visibility'
            - 'resize'
            - 'appearance'
            - 'user-select'
            - 'interpolation-mode'
            - 'direction'
            - 'marks'
            - 'page'
            - 'set-link-source'
            - 'unicode-bidi'
            - 'speak'
          separate_groups: true
          ignore-custom-properties: true
      variable-for-property:
        - 2
        -
          properties:
            - content
    ```
    

- package.json  에 sasslint 명령어를 추가하자.
    
    ```json
    {
      ...

      "scripts": {
        ...
        "sasslint": "sass-lint -v -c .sass-lint.yml",
        "sasslint:fix": "sass-lint-auto-fix -c .sass-lint.yml",
      },
      
      ...
    }
    ```
    

yarn sasslint:fix 를 하면 scss에 yml에 정리한 순서대로 코드를 정리해준다.