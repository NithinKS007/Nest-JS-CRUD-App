export default () => ({
  db: {
    mongodb: {
      compassUrl: process.env.COMPASS_DATABASE_CONFIG || '',
    },
  },
  app: {
    port: parseInt(process.env.PORT || '3000', 10),
    mode: process.env.MODE || 'DEVELOPMENT',
  }
});
