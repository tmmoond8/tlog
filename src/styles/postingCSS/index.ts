import { css } from '@emotion/react';
import { postCSS } from './default';
import dark from './dark';
import light from './light';

export default css`
  ${postCSS}
  ${light}
  ${dark}
`;
