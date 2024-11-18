const nextConfig = {
    webpack(config, { isServer }) {
      config.module.rules.push({
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgo: {
                plugins: [{ removeViewBox: false }],
              },
            },
          },
        ],
      });
      
      return config;
    },
    images: {
      domains: ['avatars.githubusercontent.com',"lh3.googleusercontent.com"],
    },
    reactStrictMode: false,
  };
export default nextConfig;
  