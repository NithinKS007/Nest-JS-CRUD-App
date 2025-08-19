export default () => ({
  db: {
    mongodb: {
      compassUrl: process.env.COMPASS_DATABASE_CONFIG || '',
    },
  },
  app: {
    port: parseInt(process.env.PORT || '3000', 10),
    mode: process.env.MODE || 'DEVELOPMENT',
  },
  jwt:{
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || 'default-access-secret',
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION || '15m',
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || 'default-refresh-secret',
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION || '7d',
  }
});
