import { addDecorator, configure } from '@storybook/react';
import * as React from 'react';

import { ThemeProvider } from "styled-components";
import theme, { GlobalStyle }  from "../src/styles";

// automatically import all files ending in *.stories.js
const req = require.context('../src/components', true, /\.stories\.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator((story) => (
  <>
    <GlobalStyle/>
    <ThemeProvider theme={theme}>
      {story()}
    </ThemeProvider>
  </>
))

configure(loadStories, module);
