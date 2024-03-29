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

function Right({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  const modal = NotionUI.Modal.useModal();
  const windowNavigator = globalThis?.navigator as any;
  const handleClick = () => {
    if (windowNavigator.share) {
      windowNavigator
        .share({
          title: title ? `${title} - Tlog` : 'Tlog',
          url: globalThis?.location.href,
        })
        .then(() => console.log('Successful share'))
        .catch((error: unknown) => console.log('Error sharing', error));
    } else {
      const orImageMeta = globalThis?.document.head.querySelector(
        'meta[property="og:image"]'
      ) as HTMLMetaElement;
      modal.open({
        title: '포스팅 공유',
        contents: (
          <ShareContent>
            <article
              onClick={() => {
                copy(
                  `${description || "Tamm's dev log - Tlog."} ${
                    globalThis?.location.href
                  }`
                );
                modal.close();
              }}
              aria-hidden
            >
              <img src={orImageMeta.content} alt={title} />
              <section>
                <NotionUI.Content.Text as="H3" color={NotionUI.colors.grey60}>
                  {title || "Tamm's dev log - Tlog"}
                </NotionUI.Content.Text>
                <NotionUI.Content.Text
                  marginTop={8}
                  color={NotionUI.colors.grey40}
                >
                  {description ||
                    '자바스크립트 웹 개발 환경을 좋아하고 사람들에게 재미를 주는 것에 관심이 많은 개발자 입니다.'}
                </NotionUI.Content.Text>
              </section>
            </article>
            <CopyButton
              buttonSize="Big"
              onClick={() => {
                copy(globalThis?.location.href);
                modal.close();
              }}
            >
              <div>
                <NotionUI.Icon icon="link" /> 포스팅 주소 복사
              </div>
            </CopyButton>
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  article {
    margin: 22px 16px 0 16px;
    border: 1px solid ${NotionUI.colors.grey32};
    border-radius: 4px;
    overflow: auto;
    cursor: pointer;

    &:hover {
      border: 1px solid ${NotionUI.colors.grey};
    }

    img {
      width: 100%;
      height: auto;
      min-height: 210px;
    }
    section {
      padding: 16px;
      line-height: 1.5;
    }
  }
`;

const CopyButton = styled(NotionUI.Button)`
  && {
    margin: 16px 0;
  }

  div {
    display: flex;
    align-items: center;
    justify-content: center;

    svg.Icon {
      margin-right: 8px;
    }
  }
`;
