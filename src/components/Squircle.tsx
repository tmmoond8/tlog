import React from 'react';
import { css } from '@emotion/react';
import cx from 'classnames';
import styled from '@emotion/styled';

interface SquircleProps {
  className?: string;
  src: string;
  size?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export default function Squircle({
  className,
  src,
  size = '1em',
  onClick,
}: SquircleProps) {
  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      if (typeof onClick === 'function') {
        onClick(e);
      }
    },
    [onClick]
  );
  const { shapeSquircle, clipSquircle } = useUUID();
  return (
    <Wrapper
      width={size}
      className={cx('UserProfilePhoto', className)}
      onClick={handleClick}
      clickable={!!onClick}
    >
      <svg viewBox="0 0 88 88">
        <defs>
          <path
            id={shapeSquircle}
            d="M44,0 C76.0948147,0 88,11.9051853 88,44 C88,76.0948147 76.0948147,88 44,88 C11.9051853,88 0,76.0948147 0,44 C0,11.9051853 11.9051853,0 44,0 Z"
          />
          <clipPath id={clipSquircle}>
            <use xlinkHref={`#${shapeSquircle}`} />
          </clipPath>
        </defs>

        <image
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${clipSquircle})`}
          xlinkHref={src}
        />
      </svg>
    </Wrapper>
  );
}

const Wrapper = styled.div<{ width: string; clickable: boolean }>`
  display: flex;
  height: ${(p) => p.width};
  && svg {
    width: ${(p) => p.width};
    height: auto;
  }
  ${(p) =>
    p.clickable &&
    css`
      cursor: pointer;
    `}
`;

function useUUID() {
  const uuid = React.useMemo(() => Math.random().toString(32).substr(4), []);
  return {
    shapeSquircle: `shapeSquircle_${uuid}`,
    clipSquircle: `clipSquircle_${uuid}`,
  };
}
