/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/order */
const dotenv = require('dotenv');
const path = require('path');
const Dotenv = require('dotenv-webpack');

dotenv.config();

module.exports = {
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

    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};
