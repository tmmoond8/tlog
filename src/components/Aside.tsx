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
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { desktop } from '../styles';
import type { Post } from '../types';
import Icon from '../components/Icon';

interface AsideProps {
  allPosts: Post[];
}

export default function Aside({ allPosts }: AsideProps) {
  const tags = allPosts.reduce((accum: Record<string, any>, post) => {
    if (post.tags) {
      post.tags.forEach((tag: string) => {
        if (!Array.isArray(accum[tag])) {
          accum[tag] = [];
        }
        accum[tag].push(post);
      });
    }
    return accum;
  }, {} as Record<string, any>);
  console.log('aa;, pageProp', tags);
  const theme = loadTheme();
  const [isDark, setIsDark] = React.useState(theme === 'Dark');
  const handleToggleTheme = React.useCallback(() => {
    setIsDark(!isDark);
    toggleTheme();
  }, [setIsDark, isDark]);

  return (
    <Column>
      <AsideUI.Group title="RECENT VIEWD">
        <AsideUI.Menu
          key="abc"
          title="aaa"
          handleClick={() => console.log('aa')}
          iconUrl="https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631854824/noticon/q4gbwdq0xkik6xiybdmp.png"
        />
      </AsideUI.Group>
      <AsideUI.Group title="RECENT UPDATED">
        <AsideUI.Menu
          key="abc"
          title="aaa"
          handleClick={() => console.log('aa')}
          iconUrl="https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631854824/noticon/q4gbwdq0xkik6xiybdmp.png"
        />
      </AsideUI.Group>
      <AsideUI.Group title="TAG">
        <AsideUI.Menu
          key="abc"
          title="bbb"
          handleClick={() => console.log('aa')}
          iconUrl="https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631854824/noticon/q4gbwdq0xkik6xiybdmp.png"
        />
      </AsideUI.Group>
      <div style={{ flex: 100 }} />
      <BottomMenus>
        {/* <Content.Spacing size={20} /> */}
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
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const GithubMenu = styled(AsideUI.Menu)`
  flex-basis: 45px;
  svg {
    width: 18px;
    ${desktop(css`
      width: 18px;
    `)}
  }
`;

const ThemeMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 45px;
  padding: 2px 14px;
  cursor: pointer;
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
