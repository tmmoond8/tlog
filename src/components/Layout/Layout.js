import React, { Fragment } from 'react'
import Navbar from '../Navbar';
import { Link } from "gatsby";
import styled, { ThemeProvider, keyframes } from "styled-components";
import theme, { GlobalStyle }  from "../../styles";

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-100%);
  }
`;

const Layout = styled.div`
  width: 100vw;
  height: 100vh;
`;

const ChildrenWrapper = styled.div`
  width: calc(100vw - 12.67rem);
  min-height: 100%;
  margin-left: 12.67rem;
  background-color: ${props => props.theme.color.lightGrey};

  ${props => props.theme.media.tablet`
    width: 100vw;
    margin-left: 0;
    padding-top: 3rem;
  `}
`;

const MobileBar = styled.div`
  position: fixed;
  background: ${props => props.theme.color.white};
  width: 100%;
  height: 3rem;
  top: 0;
  z-index: 80;
  text-align: center;
  line-height: 1.5;
  visibility: hidden;
  ${props => props.theme.media.tablet`
    visibility: visible;
  `}
`;

const DrawableNavbar = styled.div`
  display: flex;
  position: fixed;
  height: 100%;
  transform: translateX(0);
  z-index: 100;

  ${props => props.theme.media.tablet`
    width: 140%;
    transform: translateX(${props => props.open ? 0 : '-100%'});
    animation: ${props => props.open ? slideIn : props.initial ? '' : slideOut} .3s ease-out;
  `}
`;

const Dimmed = styled.div`
  flex: 1;
  display: static;
  background: linear-gradient(90deg, rgba(79,78,79,0.7875525210084033) 0%, rgba(79,78,79,0.5578606442577031) 67%, rgba(227,227,227,0.06486344537815125) 100%);
`;

const Hambuger = styled.span`
  display: inline-block;
  position: absolute;
  top: 50%;
  left: 1rem;
  width: 40px;
  height: 40px;
  padding: .5rem;
  transform: translateY(-50%);
  cursor: pointer;
`;

const HomeLink = styled(Link)`
  font-size: 2rem;
`;

class TemplateWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleCloseNav = this.handleCloseNav.bind(this);
  }

  state = {
    open: false,
    initial: true
  }

  render() {
    const { children } = this.props;

    return (
      <Fragment>
        <GlobalStyle/>
        <ThemeProvider theme={theme}>
          <Layout>
            <DrawableNavbar open={this.state.open} initial={this.state.initial}>
              <Navbar/>
              <Dimmed onClick={this.handleCloseNav}/>
            </DrawableNavbar>
            <ChildrenWrapper>
              <MobileBar>
                <Hambuger onClick={this.handleToggle}>
                  <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M24 18v1h-24v-1h24zm0-6v1h-24v-1h24zm0-6v1h-24v-1h24z" fill="#1040e2"/><path d="M24 19h-24v-1h24v1zm0-6h-24v-1h24v1zm0-6h-24v-1h24v1z"/></svg>
                </Hambuger>
                <HomeLink to="/">
                  Tlog
                </HomeLink>
              </MobileBar>
              {children}
            </ChildrenWrapper>
          </Layout>
        </ThemeProvider>
      </Fragment>
    );
  }

  handleToggle() {
    this.setState(state => ({
      open: !this.state.open,
      initial: false
    }));
  }

  handleCloseNav() {
    this.setState(state => ({
      open: false
    }));
  }
}

export default TemplateWrapper
