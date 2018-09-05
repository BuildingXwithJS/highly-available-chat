module.exports = {
  publicRuntimeConfig: {
    // Will be available on both server and client
    domain: process.env.DOMAIN || 'http://localhost:3000', // Pass through env variables
  },
};
