import { css } from '@emotion/react';

export default css`
  .dark pre code.hljs {
    display: block;
    overflow-x: auto;
    padding: 1em;
  }

  .dark code.hljs {
    padding: 3px 5px;
  }

  /*!
  Theme: GitHub Dark
  Description: Dark theme as seen on github.com
  Author: github.com
  Maintainer: @Hirse
  Updated: 2021-05-15

  Outdated base version: https://github.com/primer/github-syntax-dark
  Current colors taken from GitHub's CSS
*/
  .dark .hljs {
    color: #c9d1d9;
    background: rgba(255, 255, 255, 0);
  }

  .dark .hljs-doctag,
  .dark .hljs-keyword,
  .dark .hljs-meta .hljs-keyword,
  .dark .hljs-template-tag,
  .dark .hljs-template-variable,
  .dark .hljs-type,
  .dark .hljs-variable.language_ {
    color: #ff7b72;
  }

  .dark .hljs-title,
  .dark .hljs-title.class_,
  .dark .hljs-title.class_.inherited__,
  .dark .hljs-title.function_ {
    color: #d2a8ff;
  }

  .dark .hljs-attr,
  .dark .hljs-attribute,
  .dark .hljs-literal,
  .dark .hljs-meta,
  .dark .hljs-number,
  .dark .hljs-operator,
  .dark .hljs-selector-attr,
  .dark .hljs-selector-class,
  .dark .hljs-selector-id,
  .dark .hljs-variable {
    color: #79c0ff;
  }

  .dark .hljs-meta .hljs-string,
  .dark .hljs-regexp,
  .dark .hljs-string {
    color: #a5d6ff;
  }

  .dark .hljs-built_in,
  .dark .hljs-symbol {
    color: #ffa657;
  }

  .dark .hljs-code,
  .dark .hljs-comment,
  .dark .hljs-formula {
    color: #8b949e;
  }

  .dark .hljs-name,
  .dark .hljs-quote,
  .dark .hljs-selector-pseudo,
  .dark .hljs-selector-tag {
    color: #7ee787;
  }

  .dark .hljs-subst {
    color: #c9d1d9;
  }

  .dark .hljs-section {
    color: #1f6feb;
    font-weight: 700;
  }

  .dark .hljs-bullet {
    color: #f2cc60;
  }

  .dark .hljs-emphasis {
    color: #c9d1d9;
    font-style: italic;
  }

  .dark .hljs-strong {
    color: #c9d1d9;
    font-weight: 700;
  }

  .dark .hljs-addition {
    color: #aff5b4;
    background-color: #033a16;
  }

  .dark .hljs-deletion {
    color: #ffdcd7;
    background-color: #67060c;
  }
`;
