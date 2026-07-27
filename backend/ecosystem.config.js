module.exports = {
  apps: [
    {
      name: 'broker-api',
      script: 'server.js',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5001,
      },
    },
  ],
};
