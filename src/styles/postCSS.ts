import { css } from '@emotion/react';
import { colors } from 'notion-ui';

export const postCSS = css`
  @font-face {
    font-family: octicons-link;
    src: url(data:font/woff;charset=utf-8;base64,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)
      format('woff');
  }

  .post-section {
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    color: ${colors.grey};
    line-height: 1.5;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
      sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
    font-size: 16px;
    line-height: 1.5;
    word-wrap: break-word;
  }

  .post-section .octicon {
    display: inline-block;
    fill: currentColor;
    vertical-align: text-bottom;
  }

  .post-section .anchor {
    float: left;
    line-height: 1;
    margin-left: -20px;
    padding-right: 4px;
  }

  .post-section .anchor:focus {
    outline: none;
  }

  .post-section h1 .octicon-link,
  .post-section h2 .octicon-link,
  .post-section h3 .octicon-link,
  .post-section h4 .octicon-link,
  .post-section h5 .octicon-link,
  .post-section h6 .octicon-link {
    color: ${colors.grey}; // #1b1f23;
    vertical-align: middle;
    visibility: hidden;
  }

  .post-section h1:hover .anchor,
  .post-section h2:hover .anchor,
  .post-section h3:hover .anchor,
  .post-section h4:hover .anchor,
  .post-section h5:hover .anchor,
  .post-section h6:hover .anchor {
    text-decoration: none;
  }

  .post-section h1:hover .anchor .octicon-link,
  .post-section h2:hover .anchor .octicon-link,
  .post-section h3:hover .anchor .octicon-link,
  .post-section h4:hover .anchor .octicon-link,
  .post-section h5:hover .anchor .octicon-link,
  .post-section h6:hover .anchor .octicon-link {
    visibility: visible;
  }

  .post-section .pl-c {
    color: #6a737d;
  }

  .post-section .pl-c1,
  .post-section .pl-s .pl-v {
    color: #005cc5;
  }

  .post-section .pl-e,
  .post-section .pl-en {
    color: #6f42c1;
  }

  .post-section .pl-s .pl-s1,
  .post-section .pl-smi {
    color: #24292e;
  }

  .post-section .pl-ent {
    color: #22863a;
  }

  .post-section .pl-k {
    color: #d73a49;
  }

  .post-section .pl-pds,
  .post-section .pl-s,
  .post-section .pl-s .pl-pse .pl-s1,
  .post-section .pl-sr,
  .post-section .pl-sr .pl-cce,
  .post-section .pl-sr .pl-sra,
  .post-section .pl-sr .pl-sre {
    color: #032f62;
  }

  .post-section .pl-smw,
  .post-section .pl-v {
    color: #e36209;
  }

  .post-section .pl-bu {
    color: #b31d28;
  }

  .post-section .pl-ii {
    background-color: #b31d28;
    color: #fafbfc;
  }

  .post-section .pl-c2 {
    background-color: #d73a49;
    color: #fafbfc;
  }

  .post-section .pl-c2:before {
    content: '^M';
  }

  .post-section .pl-sr .pl-cce {
    color: #22863a;
    font-weight: 700;
  }

  .post-section .pl-ml {
    color: #735c0f;
  }

  .post-section .pl-mh,
  .post-section .pl-mh .pl-en,
  .post-section .pl-ms {
    color: #005cc5;
    font-weight: 700;
  }

  .post-section .pl-mi {
    color: #24292e;
    font-style: italic;
  }

  .post-section .pl-mb {
    color: #24292e;
    font-weight: 700;
  }

  .post-section .pl-md {
    background-color: #ffeef0;
    color: #b31d28;
  }

  .post-section .pl-mi1 {
    background-color: #f0fff4;
    color: #22863a;
  }

  .post-section .pl-mc {
    background-color: #ffebda;
    color: #e36209;
  }

  .post-section .pl-mi2 {
    background-color: #005cc5;
    color: #f6f8fa;
  }

  .post-section .pl-mdr {
    color: #6f42c1;
    font-weight: 700;
  }

  .post-section .pl-ba {
    color: #586069;
  }

  .post-section .pl-sg {
    color: #959da5;
  }

  .post-section .pl-corl {
    color: #032f62;
    text-decoration: underline;
  }

  .post-section details {
    display: block;
  }

  .post-section summary {
    display: list-item;
  }

  .post-section a {
    background-color: transparent;
  }

  .post-section a:active,
  .post-section a:hover {
    outline-width: 0;
  }

  .post-section strong {
    font-weight: inherit;
    font-weight: bolder;
  }

  .post-section h1 {
    font-size: 2em;
    margin: 0.67em 0;
  }

  .post-section img {
    border-style: none;
  }

  .post-section code,
  .post-section kbd,
  .post-section pre {
    font-family: monospace, monospace;
    font-size: 1em;
  }

  .post-section hr {
    box-sizing: content-box;
    height: 0;
    overflow: visible;
  }

  .post-section input {
    font: inherit;
    margin: 0;
  }

  .post-section input {
    overflow: visible;
  }

  .post-section [type='checkbox'] {
    box-sizing: border-box;
    padding: 0;
  }

  .post-section * {
    box-sizing: border-box;
  }

  .post-section input {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  .post-section a {
    color: #0366d6;
    text-decoration: none;
  }

  .post-section a:hover {
    text-decoration: underline;
  }

  .post-section strong {
    font-weight: 600;
  }

  .post-section hr {
    background: transparent;
    border: 0;
    border-bottom: 1px solid #dfe2e5;
    height: 0;
    margin: 15px 0;
    overflow: hidden;
  }

  .post-section hr:before {
    content: '';
    display: table;
  }

  .post-section hr:after {
    clear: both;
    content: '';
    display: table;
  }

  .post-section table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  .post-section td,
  .post-section th {
    padding: 0;
  }

  .post-section details summary {
    cursor: pointer;
  }

  .post-section h1,
  .post-section h2,
  .post-section h3,
  .post-section h4,
  .post-section h5,
  .post-section h6 {
    margin-bottom: 0;
    margin-top: 0;
  }

  .post-section h1 {
    font-size: 32px;
  }

  .post-section h1,
  .post-section h2 {
    font-weight: 600;
  }

  .post-section h2 {
    font-size: 24px;
  }

  .post-section h3 {
    font-size: 20px;
  }

  .post-section h3,
  .post-section h4 {
    font-weight: 600;
  }

  .post-section h4 {
    font-size: 16px;
  }

  .post-section h5 {
    font-size: 14px;
  }

  .post-section h5,
  .post-section h6 {
    font-weight: 600;
  }

  .post-section h6 {
    font-size: 12px;
  }

  .post-section p {
    padding: 6px 0;
  }

  .post-section blockquote {
    margin: 0;
  }

  .post-section ol,
  .post-section ul {
    margin-bottom: 0;
    margin-top: 0;
    padding-left: 0;
  }

  .post-section ol ol,
  .post-section ul ol {
    list-style-type: lower-roman;
  }

  .post-section ol ol ol,
  .post-section ol ul ol,
  .post-section ul ol ol,
  .post-section ul ul ol {
    list-style-type: lower-alpha;
  }

  .post-section dd {
    margin-left: 0;
  }

  .post-section code,
  .post-section pre {
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier,
      monospace;
    font-size: 12px;
  }

  .post-section pre {
    margin-bottom: 0;
    margin-top: 0;
  }

  .post-section input::-webkit-inner-spin-button,
  .post-section input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }

  .post-section .border {
    border: 1px solid #e1e4e8 !important;
  }

  .post-section .border-0 {
    border: 0 !important;
  }

  .post-section .border-bottom {
    border-bottom: 1px solid #e1e4e8 !important;
  }

  .post-section .rounded-1 {
    border-radius: 3px !important;
  }

  .post-section .bg-white {
    background-color: #fff !important;
  }

  .post-section .bg-gray-light {
    background-color: #fafbfc !important;
  }

  .post-section .text-gray-light {
    color: #6a737d !important;
  }

  .post-section .mb-0 {
    margin-bottom: 0 !important;
  }

  .post-section .my-2 {
    margin-bottom: 8px !important;
    margin-top: 8px !important;
  }

  .post-section .pl-0 {
    padding-left: 0 !important;
  }

  .post-section .py-0 {
    padding-bottom: 0 !important;
    padding-top: 0 !important;
  }

  .post-section .pl-1 {
    padding-left: 4px !important;
  }

  .post-section .pl-2 {
    padding-left: 8px !important;
  }

  .post-section .py-2 {
    padding-bottom: 8px !important;
    padding-top: 8px !important;
  }

  .post-section .pl-3,
  .post-section .px-3 {
    padding-left: 16px !important;
  }

  .post-section .px-3 {
    padding-right: 16px !important;
  }

  .post-section .pl-4 {
    padding-left: 24px !important;
  }

  .post-section .pl-5 {
    padding-left: 32px !important;
  }

  .post-section .pl-6 {
    padding-left: 40px !important;
  }

  .post-section .f6 {
    font-size: 12px !important;
  }

  .post-section .lh-condensed {
    line-height: 1.25 !important;
  }

  .post-section .text-bold {
    font-weight: 600 !important;
  }

  .post-section:before {
    content: '';
    display: table;
  }

  .post-section:after {
    clear: both;
    content: '';
    display: table;
  }

  .post-section > :first-child {
    margin-top: 0 !important;
  }

  .post-section > :last-child {
    margin-bottom: 0 !important;
  }

  .post-section a:not([href]) {
    color: inherit;
    text-decoration: none;
  }

  .post-section dl,
  .post-section ol,
  .post-section pre,
  .post-section table,
  .post-section ul {
    margin-bottom: 16px;
    margin-top: 8px;
  }

  .post-section hr {
    background-color: #e1e4e8;
    border: 0;
    height: 0.25em;
    margin: 24px 0;
    padding: 0;
  }

  .post-section blockquote {
    border-left: 0.25em solid ${colors.red};
    color: ${colors.grey60};
    padding: 0 1em;
    margin: 24px auto 32px auto;
  }

  .post-section blockquote > :first-child {
    margin-top: 0;
  }

  .post-section blockquote > :last-child {
    margin-bottom: 0;
  }

  .post-section kbd {
    background-color: #fafbfc;
    border: 1px solid #c6cbd1;
    border-bottom-color: #959da5;
    border-radius: 3px;
    box-shadow: inset 0 -1px 0 #959da5;
    color: #444d56;
    display: inline-block;
    font-size: 11px;
    line-height: 10px;
    padding: 3px 5px;
    vertical-align: middle;
  }

  .post-section h1,
  .post-section h2,
  .post-section h3,
  .post-section h4,
  .post-section h5,
  .post-section h6 {
    font-weight: 600;
    line-height: 1.25;
    margin-top: 36px;
    margin-bottom: 24px;
  }

  .post-section h1 {
    font-size: 2em;
  }

  .post-section h1,
  .post-section h2 {
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
  }

  .post-section h2 {
    font-size: 1.5em;
  }

  .post-section h3 {
    font-size: 1.25em;
  }

  .post-section h4 {
    font-size: 1em;
  }

  .post-section h5 {
    font-size: 0.875em;
  }

  .post-section h6 {
    color: #6a737d;
    font-size: 0.85em;
  }

  .post-section ol,
  .post-section ul {
    padding-left: 2em;
  }

  .post-section ol ol,
  .post-section ol ul,
  .post-section ul ol,
  .post-section ul ul {
    margin-bottom: 0;
    margin-top: 0;
  }

  .post-section li {
    word-wrap: break-all;
    list-style: disc;
  }

  .post-section li > p {
    margin-top: 16px;
  }

  .post-section li + li {
    margin-top: 0.25em;
  }

  .post-section dl {
    padding: 0;
  }

  .post-section dl dt {
    font-size: 1em;
    font-style: italic;
    font-weight: 600;
    margin-top: 16px;
    padding: 0;
  }

  .post-section dl dd {
    margin-bottom: 16px;
    padding: 0 16px;
  }

  .post-section table {
    display: block;
    overflow: auto;
    width: 100%;
  }

  .post-section table th {
    font-weight: 600;
  }

  .post-section table td,
  .post-section table th {
    border: 1px solid #dfe2e5;
    padding: 6px 13px;
  }

  .post-section table tr {
    background-color: #fff;
    border-top: 1px solid #c6cbd1;
  }

  .post-section table tr:nth-child(2n) {
    background-color: #f6f8fa;
  }

  .post-section img {
    display: block;
    background-color: #fff;
    box-sizing: content-box;
    max-width: 100%;
    margin: 16px auto 24px auto;
  }

  .post-section img[align='right'] {
    padding-left: 20px;
  }

  .post-section img[align='left'] {
    padding-right: 20px;
  }

  .post-section code {
    background-color: rgba(27, 31, 35, 0.05);
    border-radius: 3px;
    font-size: 85%;
    margin: 0;
    padding: 0.2em 0.4em;
  }

  .post-section pre {
    word-wrap: normal;
  }

  .post-section pre > code {
    background-color: transparent;
    border: 0;
    font-size: 100%;
    margin: 0;
    padding: 0;
    white-space: pre;
    word-break: normal;
  }

  .post-section .highlight {
    margin-bottom: 16px;
  }

  .post-section .highlight pre {
    margin-bottom: 0;
    word-break: normal;
  }

  .post-section .highlight pre,
  .post-section pre {
    background-color: ${colors.grey08};
    border-radius: 3px;
    font-size: 85%;
    line-height: 1.45;
    overflow: auto;
    padding: 16px;
  }

  .post-section pre code {
    background-color: transparent;
    border: 0;
    display: inline;
    line-height: inherit;
    margin: 0;
    max-width: auto;
    overflow: visible;
    padding: 0;
    word-wrap: normal;
  }

  .post-section .commit-tease-sha {
    color: #444d56;
    display: inline-block;
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier,
      monospace;
    font-size: 90%;
  }

  .post-section .blob-wrapper {
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .post-section .blob-wrapper-embedded {
    max-height: 240px;
    overflow-y: auto;
  }

  .post-section .blob-num {
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
    color: rgba(27, 31, 35, 0.3);
    cursor: pointer;
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier,
      monospace;
    font-size: 12px;
    line-height: 20px;
    min-width: 50px;
    padding-left: 10px;
    padding-right: 10px;
    text-align: right;
    user-select: none;
    vertical-align: top;
    white-space: nowrap;
    width: 1%;
  }

  .post-section .blob-num:hover {
    color: rgba(27, 31, 35, 0.6);
  }

  .post-section .blob-num:before {
    content: attr(data-line-number);
  }

  .post-section .blob-code {
    line-height: 20px;
    padding-left: 10px;
    padding-right: 10px;
    position: relative;
    vertical-align: top;
  }

  .post-section .blob-code-inner {
    color: #24292e;
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier,
      monospace;
    font-size: 12px;
    overflow: visible;
    white-space: pre;
    word-wrap: normal;
  }

  .post-section .pl-token.active,
  .post-section .pl-token:hover {
    background: #ffea7f;
    cursor: pointer;
  }

  .post-section kbd {
    background-color: #fafbfc;
    border: 1px solid #d1d5da;
    border-bottom-color: #c6cbd1;
    border-radius: 3px;
    box-shadow: inset 0 -1px 0 #c6cbd1;
    color: #444d56;
    display: inline-block;
    font: 11px SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier,
      monospace;
    line-height: 10px;
    padding: 3px 5px;
    vertical-align: middle;
  }

  .post-section :checked + .radio-label {
    border-color: #0366d6;
    position: relative;
    z-index: 1;
  }

  .post-section .tab-size[data-tab-size='1'] {
    -moz-tab-size: 1;
    tab-size: 1;
  }

  .post-section .tab-size[data-tab-size='2'] {
    -moz-tab-size: 2;
    tab-size: 2;
  }

  .post-section .tab-size[data-tab-size='3'] {
    -moz-tab-size: 3;
    tab-size: 3;
  }

  .post-section .tab-size[data-tab-size='4'] {
    -moz-tab-size: 4;
    tab-size: 4;
  }

  .post-section .tab-size[data-tab-size='5'] {
    -moz-tab-size: 5;
    tab-size: 5;
  }

  .post-section .tab-size[data-tab-size='6'] {
    -moz-tab-size: 6;
    tab-size: 6;
  }

  .post-section .tab-size[data-tab-size='7'] {
    -moz-tab-size: 7;
    tab-size: 7;
  }

  .post-section .tab-size[data-tab-size='8'] {
    -moz-tab-size: 8;
    tab-size: 8;
  }

  .post-section .tab-size[data-tab-size='9'] {
    -moz-tab-size: 9;
    tab-size: 9;
  }

  .post-section .tab-size[data-tab-size='10'] {
    -moz-tab-size: 10;
    tab-size: 10;
  }

  .post-section .tab-size[data-tab-size='11'] {
    -moz-tab-size: 11;
    tab-size: 11;
  }

  .post-section .tab-size[data-tab-size='12'] {
    -moz-tab-size: 12;
    tab-size: 12;
  }

  .post-section .task-list-item {
    list-style-type: none;
  }

  .post-section .task-list-item + .task-list-item {
    margin-top: 3px;
  }

  .post-section .task-list-item input {
    margin: 0 0.2em 0.25em -1.6em;
    vertical-align: middle;
  }

  .post-section hr {
    border-bottom-color: #eee;
  }

  .post-section .pl-0 {
    padding-left: 0 !important;
  }

  .post-section .pl-1 {
    padding-left: 4px !important;
  }

  .post-section .pl-2 {
    padding-left: 8px !important;
  }

  .post-section .pl-3 {
    padding-left: 16px !important;
  }

  .post-section .pl-4 {
    padding-left: 24px !important;
  }

  .post-section .pl-5 {
    padding-left: 32px !important;
  }

  .post-section .pl-6 {
    padding-left: 40px !important;
  }

  .post-section .pl-7 {
    padding-left: 48px !important;
  }

  .post-section .pl-8 {
    padding-left: 64px !important;
  }

  .post-section .pl-9 {
    padding-left: 80px !important;
  }

  .post-section .pl-10 {
    padding-left: 96px !important;
  }

  .post-section .pl-11 {
    padding-left: 112px !important;
  }

  .post-section .pl-12 {
    padding-left: 128px !important;
  }
`;
