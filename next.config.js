/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/order */
const dotenv = require('dotenv');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const withSvgr = require('next-plugin-svgr');

dotenv.config();

module.exports = withSvgr({
  webpack: (_config) => {
    const config = _config;
    config.plugins = config.plugins || [];

    config.plugins = [
      ...config.plugins,
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true,
      }),
    ];
    return config;
  },
});
