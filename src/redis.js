const Redis = require('ioredis');

const redisConfig = {
  port: process.env.REDIS_PORT || 6379,
  host: process.env.REDIS_HOST || '127.0.0.1',
};

const redis = new Redis(redisConfig);
const pub = new Redis(redisConfig);

redis.subscribe('chat', (err, count) => {
  if (err) {
    throw err;
  }
  console.log('Subscribed to chat channel:', count);
});

exports.sendMessage = message => pub.publish('chat', message);
exports.redis = redis;
