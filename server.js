const io = require('socket.io')();

io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected.`);

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected.`);
    io.emit('wakefield');
  });

  socket.on('drawData', (drawData) => {
    io.emit('drawOut', drawData);
  });
});

io.listen(8000);
console.log('listening on port 8000');
