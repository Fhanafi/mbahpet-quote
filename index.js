const express =  require('express');
const http = require('http');
const socketIo =  require('socket.io');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const server =  http.createServer(app);
const io = socketIo(server);
const port = 3000;

app.use(bodyParser.json());

let data = [];

try {
    const rawData = fs.readFileSync('data.json');
} catch (error) {
   console.log('error baca data', error); 
}

io.on('connection', (socket) => {
    console.log('user conect');

    socket.emit('data', data);

    socket.on('create', (newData) => {
        data.push(newData);
        saveDataToFile();
        io.emit('data', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnect');
    });
 });

 function saveDataToFile() {
    fs.writeFile('data.json', JSON.stringify(data), (error) => {
      if(error) {
        console.log('tidak tersimpan');
      } else {
        console.log('data tersimpan');
      }
    });
 }

 app.get('/api/data', (req,res) => {
    res.json(data);
 });

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
});

 server.listen(port, () => {
    console.log('server run')
 });