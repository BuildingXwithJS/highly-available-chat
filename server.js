// Require the framework and instantiate it
const fastify = require('fastify')({logger: true});
const fastifyWs = require('fastify-ws');
const Next = require('next');
const {redis, sendMessage} = require('./src/redis');
const os = require('os');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

fastify.register(fastifyWs, {
  library: 'uws', // Use the uws library instead of the default ws library
});

fastify.register(async (instance, opts, next) => {
  const app = Next({dev});
  await app.prepare();
  if (dev) {
    fastify.get('/_next/*', (req, reply) => {
      return app.handleRequest(req.req, reply.res).then(() => {
        reply.sent = true;
      });
    });
  }

  fastify.get('/id', (req, reply) => {
    reply.send(os.hostname());
  });

  fastify.get('/*', (req, reply) => {
    return app.handleRequest(req.req, reply.res).then(() => {
      reply.sent = true;
    });
  });

  fastify.ws.on('connection', socket => {
    console.log('Client connected.');

    const handleMessage = (_, message) => socket.send(message);
    redis.on('message', handleMessage);

    socket.on('message', msg => sendMessage(msg));

    socket.on('close', () => {
      console.log('Client disconnected.');
      redis.off('message', handleMessage);
    });
  });

  next();
});

fastify.listen(port, '0.0.0.0', err => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${port}`);
});
