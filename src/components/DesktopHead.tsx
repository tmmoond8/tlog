import styled from '@emotion/styled';
import { Content } from 'notion-ui';
import Link from 'next/link';
import Icon from '../components/Icon';

function Left() {
  return (
    <Link href="/">
      <Flex>
        <Logo icon="logo" size="20px" />
        <Content.Text>Tlog</Content.Text>
      </Flex>
    </Link>
  );
}

function Right() {
  return <></>;
}

export default {
  Left,
  Right,
};

const Flex = styled.div`
  display: flex;
  cursor: pointer;
`;

const Logo = styled(Icon)`
  margin-right: 8px;
`;
