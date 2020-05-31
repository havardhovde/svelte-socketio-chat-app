let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let numUsers = 0

io.on('connection', (socket) => {
  console.log('user connected');
  numUsers++
   
  socket.on('disconnect', function(){
    console.log('user disconnected');
    numUsers--
  });
  
  socket.on('add-message', (message) => {
    io.emit('message', {type:'new-message', text: message});    
  });
});

http.listen(3000, () => {
  console.log('started on port 3000');
});