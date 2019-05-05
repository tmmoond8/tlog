import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import postStyle from "./post-styles";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Maven+Pro');
  ${reset}
  * {
    box-sizing: border-box;
    font-weight: 300;
  }
  body{
      font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
      font-size: 16px;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  input, button {
    &:focus, &:active {
      outline: none;
    }
  }
  h1, h2, h3, h4, h5, h6{
    font-family:'Maven Pro', sans-serif;
  }

  ${postStyle}
`;

export default GlobalStyle;