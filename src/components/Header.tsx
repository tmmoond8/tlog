import styled from '@emotion/styled';
import * as NotionUI from 'notion-ui';
import Link from 'next/link';
import copy from 'clipboard-copy';
import Icon from './Icon';

function Left() {
  return (
    <Link href="/">
      <Flex>
        <Logo icon="logo" size="20px" />
        <NotionUI.Content.Text>Tlog</NotionUI.Content.Text>
      </Flex>
    </Link>
  );
}

function Right({ title, description }: { title: string; description: string }) {
  const modal = NotionUI.Modal.useModal();
  const windowNavigator = globalThis?.navigator as any;
  const handleClick = () => {
    if (windowNavigator.share) {
      windowNavigator
        .share({
          title: `${title} - Tlog`,
          text: description,
          url: globalThis?.location.href,
        })
        .then(() => console.log('Successful share'))
        .catch((error: unknown) => console.log('Error sharing', error));
    } else {
      // copy(window.location.href);
      const orImageMeta = globalThis?.document.head.querySelector(
        'meta[name="og:image"]'
      ) as HTMLMetaElement;
      modal.open({
        title: '포스팅 공유',
        contents: (
          <ShareContent>
            <article>
              <img src={orImageMeta.content} alt={title} />
              <section>
                <NotionUI.Content.Text as="H3" color={NotionUI.colors.grey60}>
                  {title}
                </NotionUI.Content.Text>
                <NotionUI.Content.Text
                  marginTop={8}
                  color={NotionUI.colors.grey40}
                >
                  {description}
                </NotionUI.Content.Text>
              </section>
              <CopyButton
                buttonSize="Big"
                onClick={() => copy(globalThis?.location.href)}
              >
                <div>
                  <NotionUI.Icon icon="link" /> 포스팅 복사
                </div>
              </CopyButton>
            </article>
          </ShareContent>
        ),
      });
    }
  };
  return (
    <Flex>
      <NotionUI.IconButton
        icon="share"
        color={NotionUI.colors.grey}
        onClick={handleClick}
      />
    </Flex>
  );
}

export default {
  Left,
  Right,
};

const Flex = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 8px;
`;

const Logo = styled(Icon)`
  margin-right: 8px;
`;

const ShareContent = styled.div`
  height: 100%;
  article {
    display: flex;
    flex-direction: column;
    height: 100%;

    img {
      width: 100%;
      height: auto;
    }
    section {
      flex: 1;
      padding: 16px;
      line-height: 1.5;
    }
  }
`;

const CopyButton = styled(NotionUI.Button)`
  margin-bottom: 16px;

  div {
    display: flex;
    align-items: center;
    justify-content: center;

    svg.Icon {
      margin-right: 8px;
    }
  }
`;
