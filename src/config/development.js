module.exports = {
    port: 5000,
    jwt: {
      secret: 'key',
      expiresIn: '1h'
    },
    cors: {
      origin: 'http://79.174.80.133:3000/',
      credentials: true
    },
    uploads: {
      path: 'uploads/',
      maxSize: 5 * 1024 * 1024
    }
  };