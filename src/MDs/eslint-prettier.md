---
title: eslint & prettier
date: '2020-02-11T08:56:56.263Z'
description: eslint & prettier 설정하기
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952585/tlog/cover/eslint-prettier_vwmdm2.png'
tags:
  - 'Project Setup'
---
#

프로젝트 셋업을 하면 eslint 와 prettier는 필수로 셋업같이 해줘야 한다. 이전에는 TS로 작업할 때 tslint를 썼지만, eslint로 커버가 가능하기 때문에 tslint는 deprecated 될 예정이다.

```bash
$ yarn add eslint eslint-plugin-import @typescript-eslint/parser
```

나는 리액트에서 가장 추천되는 airbnb의 룰셋을 확장하여 셋업했다. 그러기 위해서는 관련된 플러그인을 설치해야 한다.

```bash
$ yarn add eslint-config-airbnb-typescript   \
           eslint-plugin-import              \
           eslint-plugin-jsx-a11y            \
           eslint-plugin-react               \
           eslint-plugin-react-hooks         \
           @typescript-eslint/eslint-plugin
```

- .eslintrc.js

    ```jsx
    module.exports = {
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        quotes: [2, 'single', { avoidEscape: true }],
      },
      extends: [
        'airbnb-typescript',
        'airbnb/hooks',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking'
      ],
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
          modules: true,
        },
        extraFileExtensions: ['ts', 'tsx'],
      },
    };
    ```

    나는 쌍따옴표보다 따옴표를 선호하기에 rules에 quotes 룰을 추가했다.

- .eslintrc.js

    ```jsx
    module.exports = {
      printWidth: 80, // 줄 바꿈 길이
      parser: 'typescript',
      singleQuote: true, // "대신 '를 사용
      useTabs: false, // 탭 대신 스페이스 사용
      tabWidth: 2, // 들여 쓰기 레벨마다 공백 수를 지정
      trailingComma: 'es5', // 후행 쉼표를 항상 추가하면 새로운 배열 요소, 파라메터, 프로퍼티를 자바스크립트 코드에 추가할 때 유용
    };
    ```

내가 ts를 사용하는데 eslint-airbnb 룰셋을 확장하려다 보니 삽질을 했다. 언어별로 확실하게 구분하여 룰셋을 셋업해야 한다.