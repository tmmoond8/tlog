import React from 'react'
import styled from "styled-components";
import { StaticQuery, graphql, Link } from "gatsby";
import Tags from "../Tags";
import logo from "../../img/tlog-logo.svg";

const NavbarWapper = styled.div`
  position: fixed;
  width: 12.67rem;
  min-height: 100%;
  background: ${props => props.theme.color.black};
`;

const BLOGO = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 1.5rem 0;
  color: ${props => props.theme.color.white};
`;

const LOGO = styled(Link)`
  position: relative;
  font-size: 2rem;
  padding-bottom: 1rem;
  &:before {
    content: "";
    position: absolute;
    width: 2rem;
    height: 2rem;
    background-image: url(${logo});
    background-repeat: no-repeat;
    transform: translateX(-150%);
  }
`;

const Contact = styled.p`
  font-size: .8rem;
  &:before {
    content: "✉️";
    padding-right: 0.5rem;
  }
`;


const Navbar = class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
    }
  }

  toggleHamburger = () => {
    // toggle the active boolean in the state
    this.setState(
      {
        active: !this.state.active,
      },
      // after state has been updated,
      () => {
        // set the class in state for the navbar accordingly
        this.state.active
          ? this.setState({
              navBarActiveClass: 'is-active',
            })
          : this.setState({
              navBarActiveClass: '',
            })
      }
    )
  }

  render() {
    const {
      data: {
        allMarkdownRemark: { group },
      }
    } = this.props;
    return (
      <NavbarWapper>
        <BLOGO>
          <LOGO to="/">Tlog</LOGO>
          <Contact>tmmoond8@gmail.com</Contact>
        </BLOGO>
        <Tags data={group}/>
      </NavbarWapper>
    );
  }
};

export default () => (
  <StaticQuery
    query={graphql`
      query GetTags {
        allMarkdownRemark(limit: 1000) {
          group(field: frontmatter___tags) {
            fieldValue
            totalCount
          }
        }
      }
    `}
    render={(data, count) => <Navbar data={data} count={count} />}
  />
)
