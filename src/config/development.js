module.exports = {
    port: 5000,
    jwt: {
      secret: 'key',
      expiresIn: '1h'
    },
    cors: {
      origin: 'https://уралплата.рф/',
      credentials: true
    },
    uploads: {
      path: 'uploads/',
      maxSize: 5 * 1024 * 1024
    }
  };
