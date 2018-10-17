var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var Twitter = require('twitter');
var client = new Twitter({
    consumer_key: 'ZDlB334dL0YQNjFf2JyFn9kd1',
    consumer_secret: 'NDmhOrHXwbnKjj8yBMYiDqPENl7MLbGiHXGOK4ifmpAb6JmLXV',
    access_token_key: '1049279921904910337-XmJHTqQ9cJxqW2baAApa1qKekL6uAf',
    access_token_secret: 'KNSiXWXdc63FGwicyDDfKGE4RtpgY01MtULG7mzlvmhRP'
});

// je déclare mes fichiers statiques
app.use('/app', express.static('./client/app'));
app.use('/css', express.static('./client/css'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/Client/index.html')
});

//ecoute du serveur 
server.listen(3000, function() {
    console.log('listening on 3000');
});
//connexion au socket
io.sockets.on('connection', function (socket) {
    console.log("un client est connecté");
    socket.emit('monsocket', { hello: "world" });

    socket.on('rechercher',function(rechercherTwitt){
        console.log(rechercherTwitt);
        // You can also get the stream in a callback if you prefer.

        client.stream('statuses/filter', {track: rechercherTwitt}, function(stream) {
        
            
            stream.on('data', function(event) {
                //console.log(event& event_text);
                console.log(event);
                io.sockets.emit('newTwit', event);

                
            });
            stream.on('error', function(error) {
                throw error;
            });
            
        });
    });
});




