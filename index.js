const Express = require('express');
const App = Express();
const Server = require('http').Server(App);
const IO = require('socket.io')(Server);
const {appendFile} = require('fs');

const BodyParser = require('body-parser');

const Secret = require('./services/secret-service')();
const SockPuppet = require('./services/socket-service')();

App.use(Express.static('public'));
App.use(BodyParser.urlencoded({extended: true}));
App.use(BodyParser.json());

IO.on('connection', socket => {
  SockPuppet.init(socket);
});

App.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

App.post('/otv', (req, res) => {
  appendFile("app.log", JSON.stringify(req.body), function(err) {});
  Secret.check(req.body.code, err => {
    let resBody = {};
    let payload = {
      username: req.body.username,
      guess: req.body.code
    };

    if (err) {
      resBody.success = false;
      resBody.message = 'Unauthorized Access.';

      payload.success = false;
      SockPuppet.emit('attempt', payload);

    } else {
      resBody.success = true;
      resBody.message = 'OTV Access Authorized: CHANGING VIDEO ~~~ secret has been randomized';

      payload.success = true;
      payload.video_id = req.body.video_id;
      SockPuppet.emit('video_change', payload);
    }
    return res.json(resBody);
  });
});

const PORT = 8081;

// get network IP to print to terminal
const Interfaces = require('os').networkInterfaces();
const NetworkIP = Object.keys(Interfaces)
  .map(key => {
    return Interfaces[key]
      .filter(connection => {
        return connection.family === 'IPv4' && !connection.internal;
      })[0];
  })
  .filter(x => x)[0].address;

Server.listen(PORT, _ => {

  process.stdout.write(`
    Tubehacked Gibson Version server running @
    http://${NetworkIP}:${PORT}
    passnum: ${Secret.get()}
  \r\n`);
});
