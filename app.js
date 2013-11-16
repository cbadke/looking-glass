
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , settings = require('./settings')
  , routeConfig = require('./server/route-config');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/server/views');
app.set('view engine', 'ejs');
app.use(express.favicon(__dirname + '/client/images/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

// load liveReload script only in development mode
// load before app.router
app.configure('development', function() {
  // live reload script
  var liveReloadPort = settings.liveReload.port || 35729;
  var excludeList = ['.woff', '.flv'];

  app.use(require('connect-livereload')({
    port: liveReloadPort,
    excludeList: excludeList
  }));
});


app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/client' }));
app.use(express.static(path.join(__dirname, 'client')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

routeConfig.configureRoutes(app);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('express server listening on port ' + app.get('port'));
});


//socketio
var io = require('socket.io').listen(server);

var rooms = {};

var idToSocket = function(id) {
    for (room in rooms) {
        var matches = rooms[room].filter( function (member) {
            return id === member.id;
        });

        if (matches.length) return matches[0].socket;
    };

    return null;
};

var socketToId = function(socket) {
    for (room in rooms) {
        var matches = rooms[room].filter( function (member) {
            return socket === member.socket;
        });

        if (matches.length) return matches[0].id
    };

    return null;
};

var broadcastRoomMembers = function(room) {
    var peers = { 
        peers : room.map(function (member){
                    return {
                        id : member.id,
                        name : member.name
                    };
                })
    };

    room.forEach(function (member) {
        member.socket.emit('peers', peers);
    });
};

io.sockets.on('connection', function (socket) {
    socket.on('join', function(data) {

        console.log(data.name + ' is joining ' + data.room + ' as id ' + data.id);

        if (!rooms[data.room]) {
            rooms[data.room] = [];
        }

        rooms[data.room].push({socket : socket, id : data.id, name : data.name});

        broadcastRoomMembers(rooms[data.room]);

        console.log('Request offers from: ' + data.id);

        var id = socketToId(socket);
        var peers = rooms[data.room].map(function (p) {
            return p.id;
        }).filter(function (peerId) {
            return peerId !== id;
        });
        socket.emit('provideOffer', peers);
    });

    socket.on('disconnect', function() {
        for (room in rooms) {
            rooms[room] = rooms[room].filter( function (p) {
                return p.socket !== socket;
            });
            broadcastRoomMembers(rooms[room]);
        }
    });

    socket.on('offer', function(data) {
        var targetSocket = idToSocket(data.to);

        var from = socketToId(socket);
        console.log('forwarding offer from: ' + from + ' to: ' + data.to);

        targetSocket.emit('offer', { offer : data.offer, peerId : socketToId(socket) } );
    });

    socket.on('answer', function(data) {
        var targetSocket = idToSocket(data.to);

        var from = socketToId(socket);
        console.log('forwarding answer from: ' + from + ' to: ' + data.to);

        targetSocket.emit('answer', { answer : data.answer, peerId : socketToId(socket) } );
    });
});
