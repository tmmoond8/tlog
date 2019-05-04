import { css } from "styled-components";

const sizes = {
  desktop: 992,
  tablet: 768,
  phone: 576
}

// Iterate through the sizes and create a media template
const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label] / 16}em) {
      ${css(...args)}
    }
  `

  return acc
}, {});

const color = {
  black: "#282C2F",
  lightGrey: "#E5E5E5",
  red: "#D74145",
  grey: "#A8A8A8",
  white: "white"
}

 
const theme = {
  media,
  main: "mediumseagreen",
  color
}

export default theme;