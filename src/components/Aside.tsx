import React from 'react';
import {
  Aside as AsideUI,
  loadTheme,
  toggleTheme,
  Switch,
  Content,
  colors,
  Icon as NoticonIcon,
} from 'notion-ui';
import styled from '@emotion/styled';
import type { Post } from '../types';
import Icon from '../components/Icon';
import { AsideTags } from './Tag';
import AsideRecentViewed from './AsideRecentViewed';

interface AsideProps {
  allPosts: Post[];
}

export default function Aside({ allPosts }: AsideProps) {
  const theme = loadTheme();
  const handleCloseAside = AsideUI.useCloseCallback();
  const [isDark, setIsDark] = React.useState(theme === 'Dark');
  const handleToggleTheme = React.useCallback(() => {
    setIsDark(!isDark);
    toggleTheme();
  }, [setIsDark, isDark]);

  return (
    <Column>
      <Content.Spacing size={20} />
      <AsideRecentViewed />
      <Content.Spacing size={20} />
      <AsideTags allPosts={allPosts} handleCloseAside={handleCloseAside} />
      <Content.Spacing size={20} />
      <BottomMenus>
        <GithubMenu
          title="Github"
          handleClick={() =>
            window.open('https://github.com/tmmoond8/tlog.git', '_blank')
          }
          icon={<Icon icon="github" />}
        />
        <ThemeMenu onClick={handleToggleTheme}>
          <Content.Text as="P" color={colors.grey60}>
            <NoticonIcon icon="halfMoon" />
            <span>Dark Mode</span>
          </Content.Text>
          <Switch switchOn={isDark} />
        </ThemeMenu>
      </BottomMenus>
    </Column>
  );
}

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
`;

const BottomMenus = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
`;

const GithubMenu = styled(AsideUI.Menu)`
  flex-basis: 45px;
  p {
    padding: 0;
  }
  && svg {
    width: 16px;
  }
`;

const ThemeMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 45px;
  padding: 2px 14px;
  cursor: pointer;
  p {
    padding: 0;
  }
  &:hover {
    background-color: ${colors.grey08};
  }
  &:active {
    background-color: ${colors.grey16};
  }
  span {
    padding: 0 0 0 8px;
  }
`;
