declare module '*.svg' {
  // eslint-disable-next-line import/newline-after-import
  import React = require('react');
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;
  const src: string;
  export default src;
}
