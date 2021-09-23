module.exports = {
  root: true,
  extends: ['airbnb-typescript'],
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: true, classes: true, variables: false },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
        json: 'always',
      },
    ],
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: 'useRecoilCallback',
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
// module.exports = {
//   parser: '@typescript-eslint/parser',
//   plugins: ['@typescript-eslint', 'prettier'],
//   extends: [
//     'airbnb',
//     'plugin:import/errors',
//     'plugin:import/warnings',
//     'plugin:prettier/recommended',
//     'plugin:@typescript-eslint/recommended',
//   ],
//   rules: {
//     quotes: [2, 'single', { avoidEscape: true }],
//     'react/react-in-jsx-scope': 'off',
//     'react/require-default-props': 'off',
//     '@typescript-eslint/explicit-function-return-type': 'off',
//     '@typescript-eslint/explicit-module-boundary-types': 'off',
//     '@typescript-eslint/ban-ts-comment': 'off',
//     'linebreak-style': 0,
//     'import/prefer-default-export': 0,
//     'prettier/prettier': 0,
//     'import/extensions': 0,
//     'no-use-before-define': 0,
//     'import/no-unresolved': 0,
//     'import/no-extraneous-dependencies': 0, // 테스트 또는 개발환경을 구성하는 파일에서는 devDependency 사용을 허용
//     'no-shadow': 0,
//     'react/prop-types': 0,
//     'react/jsx-filename-extension': [
//       2,
//       { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
//     ],
//     'jsx-a11y/no-noninteractive-element-interactions': 0,
//   },
//   parserOptions: {
//     ecmaVersion: 6,
//     sourceType: 'module',
//     ecmaFeatures: {
//       modules: true,
//     },
//   },
// };
