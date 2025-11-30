import server from './server.js';

server.listen(process.env.PORT ?? 3000, () => {
  console.log('Server started');
});
