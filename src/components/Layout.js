import React, { Fragment } from 'react'
import Navbar from './Navbar';
import styled, { ThemeProvider } from "styled-components";
import theme, { GlobalStyle }  from "../styles";

const Layout = styled.div`
  width: 100vw;
  height: 100vh;
`;

const ChildrenWrapper = styled.div`
  width: calc(100vw - 12.67rem);
  min-height: 100%;
  margin-left: 12.67rem;
  background-color: ${props => props.theme.color.lightGrey};
`;

const TemplateWrapper = ({ children }) => {
  return (
    <Fragment>
      <GlobalStyle/>
      <ThemeProvider theme={theme}>
        <Layout>
          <Navbar />
          <ChildrenWrapper>{children}</ChildrenWrapper>
        </Layout>
      </ThemeProvider>
    </Fragment>
  )
}

export default TemplateWrapper
