const http = require('http');

const req = http.get('http://localhost:3000/api/games', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    console.log('DATA:', data.slice(0, 200));
  });
});

req.on('error', (err) => {
  console.error('ERROR:', err.message);
});