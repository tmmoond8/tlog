import styled from '@emotion/styled';
import { Content } from 'notion-ui';
import Icon from '../components/Icon';

function Left() {
  return (
    <Flex>
      <Logo icon="logo" size="20px" />
      <Content.Text>Tlog</Content.Text>
    </Flex>
  );
}

function Right() {
  return <>{/* Search */}</>;
}

export default {
  Left,
  Right,
};

const Flex = styled.div`
  display: flex;
`;

const Logo = styled(Icon)`
  margin-right: 8px;
`;
