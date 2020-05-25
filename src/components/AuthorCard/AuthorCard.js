import React from 'react';
import styled from 'styled-components';
import profileImage from '../../img/profile.png';

const Wrapper = styled.div``;
const contentSize = '3rem';

const Card = styled.div`
  display: flex;
  padding: 1rem 2rem;
  max-width: 60em;
  
  ${props => props.theme.media.tablet`
    padding: 0rem;
    height: 6rem;
  `}
`;

const Profile = styled.div`
  width: ${contentSize};
  height: ${contentSize};
  background-image: url(${profileImage});
  background-size: cover;
  border-radius: 1.5rem;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Name = styled.span`
  padding-left: 1rem;
  line-height: ${contentSize};
  color: ${props => props.theme.color.red};
`;

const Introduction = styled.span`
  flex: 1;
  text-align: left;
  color: ${props => props.theme.color.gray};
  font-weight: 300;
  ${props => props.theme.media.tablet`
    line-height: 1.5;
    font-size: .8rem;
  `}
`;

const AuthorCard = () => {
  return (
    <Wrapper>
      <Card>
        <Profile/>
        <Info>
          <Name>Tamm</Name>
          <Introduction>자바스크립트 웹 개발 환경을 좋아하고 사람들에게 재미를 주는 것에 관심이 많은 개발자 입니다.</Introduction>
        </Info>
      </Card>
    </Wrapper>
  )
}

export default AuthorCard;