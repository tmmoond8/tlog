import React from 'react';
import styled from 'styled-components';
import profileImage from '../../img/profile.jpeg';

const Wrapper = styled.div``;
const contentSize = '3rem';

const Card = styled.div`
  display: flex;
  padding: 1rem 2rem;
  max-width: 60em;
  
  ${props => props.theme.media.tablet`
    padding: 1rem;
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
  flex: 1;

  ${props => props.theme.media.tablet`
    flex-direction: column;
  `}
`;

const Name = styled.span`
  padding-left: 1rem;
  line-height: ${contentSize};
  color: ${props => props.theme.color.red};
`;

const Introduction = styled.span`
  flex: 1;
  text-align: right;
  line-height: ${contentSize};
  ${props => props.theme.media.tablet`
    text-align: left;
    line-height: 1.5;
  `}
`;

const AuthorCard = () => {
  return (
    <Wrapper>
      <Card>
        <Profile/>
        <Info>
          <Name>tmmoond8</Name>
          <Introduction>자바스크립트 웹 개발 환경을 좋아하고 사람들에게 재미를 주는 것에 관심이 있습니다.</Introduction>
        </Info>
      </Card>
    </Wrapper>
  )
}

export default AuthorCard;