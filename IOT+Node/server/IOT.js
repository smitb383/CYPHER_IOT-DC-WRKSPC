var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8080;
var SerialPort = require('serialport');
var serialVal;

var mySerialPort = new SerialPort('/dev/tty.usbmodem14101', {
    parser: new SerialPort.parsers.Readline('\n')
});

const Readline = SerialPort.parsers.Readline;
const parser = mySerialPort.pipe(new Readline());
parser.on('data', function (data) {
    // io.emit('data', {
    //     data: data
    // });
});

mySerialPort.on('data', function (data) {
    console.log('Data: ' + data);
    serialVal = data;
    if (data == 1) {
        console.log("OPEN");

        console.log("emit data", 1);
        io.emit('data', {
            data: 1
        });

    }
    io.emit('serialEvent', serialVal);


});


server.listen(port, function () {
    console.log('Server listening on ' + port);
});

io.on('connection', function (client) {
    console.log('Socket connected...');
    client.on('getSerialVal', function () {
        client.emit('messages', {
            serialValue: serialVal
        });
    });
});

app.get('/', function (req, res) {
    console.log('serving analogRead.html');
    res.sendFile(__dirname + '/analogRead.html');
});

app.use(express.static('assets'))