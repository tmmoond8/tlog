import { css, SerializedStyles } from '@emotion/react';
import { colors } from 'notion-ui';

export const base = css`
  display: block;
  width: 1em;
  height: auto;
  fill: ${colors.grey08};
  flex-shrink: 0;
  backface-visibility: hidden;
`;

export const customStyle = (p: {
  color?: string;
  cursor: string;
}): SerializedStyles => css`
  color: currentColor;
  fill: currentColor;
  ${p.color && `fill: ${p.color};`}
  ${p.color && `color: ${p.color};`}
  cursor: ${p.cursor};
`;

export const size = (size: string): SerializedStyles => css`
  width: ${size};
  max-width: ${size};
  min-height: ${size};
  & > svg {
    width: ${size};
  }
`;

export const iconButton = css`
  &.IconButton.Button {
    width: auto;
    height: 100%;
    &:hover {
      background-color: transparent;
    }
    &:active {
      background-color: transparent;
    }
  }
`;

export const disabled = css`
  opacity: 0.4;
  pointer-events: none;
  cursor: default;
`;
