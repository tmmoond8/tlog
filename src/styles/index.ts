import { css, SerializedStyles } from '@emotion/react';

export const BreakPoints = {
  Tablet: 768,
  Desktop: 1024,
};

export const mobile = (style: SerializedStyles): SerializedStyles => css`
  @media (max-width: ${BreakPoints.Tablet}px) {
    ${style};
  }
`;

export const desktop = (style: SerializedStyles): SerializedStyles => css`
  @media (min-width: ${BreakPoints.Desktop}px) {
    ${style};
  }
`;
