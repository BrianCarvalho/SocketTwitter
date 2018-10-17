var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var Twit = require('twit');
var client = new Twit({
    consumer_key: 'ZDlB334dL0YQNjFf2JyFn9kd1',
    consumer_secret: 'NDmhOrHXwbnKjj8yBMYiDqPENl7MLbGiHXGOK4ifmpAb6JmLXV',
    access_token: '1049279921904910337-XmJHTqQ9cJxqW2baAApa1qKekL6uAf',
    access_token_secret: 'KNSiXWXdc63FGwicyDDfKGE4RtpgY01MtULG7mzlvmhRP',
    timeout_ms : 60*100,
    strictSSL: true,
});

var stream = client.stream('statuses/filter', { track: "bonjour"})

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
    socket.on('rechercher', function(rechercherTwitt){
        stream.stop();
        stream = client.stream('statuses/filter', { track: rechercherTwitt });
    
        stream.on('tweet', function (tweet) {
            io.sockets.emit('newTwit', tweet);
            console.log(tweet);
        });
    
        })
});




