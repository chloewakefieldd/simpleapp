const io = require('socket.io')();

function randomColour() {
  return '#'+Math.floor(Math.random()*16777215).toString(16);
}

io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected.`);
  io.emit('chloe', randomColour());

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected.`);
    io.emit('wakefield', randomColour());
  });

  socket.on('test', (clientId) => {
    console.log('received from client: ', clientId);
  });

  socket.on('drawData', (drawData) => {
    console.log('received: ', drawData);
    io.emit('drawOut', drawData);
  });
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);
