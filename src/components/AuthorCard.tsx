import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { colors } from 'notion-ui';
import Squircle from '../components/Squircle';
import { desktop } from '../styles';

const AuthorCard = () => {
  return (
    <Wrapper>
      <Card>
        <Squircle
          size="82px"
          src="https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632223629/tlog/profile_tmam_iz4bar.png"
        />
        <Info>
          <Name>Tamm</Name>
          <Introduction>
            자바스크립트 웹 개발 환경을 좋아하고 사람들에게 재미를 주는 것에
            관심이 많은 개발자 입니다.
          </Introduction>
        </Info>
      </Card>
    </Wrapper>
  );
};

export default AuthorCard;

const Wrapper = styled.div`
  margin-top: 64px;
`;
const contentSize = '3rem';

const Card = styled.div`
  display: flex;
  padding: 0rem;
  max-width: 60em;

  ${desktop(css`
    height: 6rem;
  `)}
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-left: 1rem;
`;

const Name = styled.span`
  line-height: ${contentSize};
  color: ${colors.red};
`;

const Introduction = styled.span`
  flex: 1;
  text-align: left;
  color: ${colors.grey};
  font-weight: 300;
  line-height: 1.5rem;
  ${desktop(css`
    line-height: 1.5;
    font-size: 0.8rem;
  `)}
`;
