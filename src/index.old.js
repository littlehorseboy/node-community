const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello Horse');
});

server.listen('3000', () => {
  console.log('server start on 3000 port');
});
