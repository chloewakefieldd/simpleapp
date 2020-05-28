const io = require('socket.io')();
const drawHistory = [];

io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected.`);
  io.to(socket.id).emit('drawHistory', drawHistory);

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected.`);
    io.emit('wakefield');
  });

  socket.on('drawData', (drawData) => {
    drawHistory.push(drawData);
    console.log(drawHistory);
    io.emit('drawOut', drawData);
  });

  socket.on('heartbeat', (clientId) => {
    //console.log('heartbeat from: ', clientId);
  });
});

io.listen(8000);
console.log('listening on port 8000');
