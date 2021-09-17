module.exports = (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    exportPathMap: async function (defaultPathMap) {
      return defaultPathMap;
    },
  };
  return nextConfig;
};
