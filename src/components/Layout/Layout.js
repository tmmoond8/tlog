import React, { Fragment } from 'react'
import Navbar from '../Navbar';
import { Link } from "gatsby";
import styled, { ThemeProvider } from "styled-components";
import theme, { GlobalStyle }  from "../../styles";

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
  width: 100%;
  transform: translateX(0);
  z-index: 100;

  ${props => props.theme.media.tablet`
    transform: translateX(${props => props.open ? 0 : '-100%'})
  `}
`;

const Dimmed = styled.div`
  flex: 1;
  ${props => props.theme.media.tablet`
    background-color: rgba(100, 100, 100, .4);
  `}
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
    open: false
  }

  render() {
    const { children } = this.props;

    return (
      <Fragment>
        <GlobalStyle/>
        <ThemeProvider theme={theme}>
          <Layout>
            <DrawableNavbar open={this.state.open}>
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
    this.setState({
      open: !this.state.open
    });
  }

  handleCloseNav() {
    this.setState({
      open: false
    })
  }
}

export default TemplateWrapper
