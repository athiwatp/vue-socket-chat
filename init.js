var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path')
var Datastore = require('nedb'),
  db = new Datastore({
    filename: 'data/messages.db',
    autoload: true
  });


io.on('connection', function (socket) {
  console.log('a user joined the chat');
  socket.on('chat message', function (message) {
    db.insert(message);
    io.emit('chat message', message);
  });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/main.html'))
})

app.get('/messages', function (req, res) {
  db.find({}, function (err, docs) {
    res.json(docs)
  });
})

http.listen(3000, function () {
  console.log('listening on *:3000');
});