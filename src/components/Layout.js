import React, { Fragment } from 'react'
import Navbar from './Navbar';
import styled, { ThemeProvider } from "styled-components";
import theme, { GlobalStyle }  from "../styles";

const Layout = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

const ChildrenWrapper = styled.div`
  flex: 1;
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
