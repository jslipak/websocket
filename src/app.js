import express from 'express';
import { Server } from 'socket.io';
import __dirname from './util.js';

const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.static(__dirname + '/public'));

const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

const io = new Server(server);

//console.log(__dirname);

let products = [];
let messages = [];

io.on('connection', (socket) => {
  socket.broadcast.emit('notification');
  socket.emit('log', products);
  socket.emit('messages', messages);
  socket.on('addProduct', (data) => {
    data.product.id = products.length;
    products.push(data.product);
    console.log(products);
    io.emit('log', products);
  });
  socket.on('addMsg', (data) => {
    messages.push(data);
    io.emit('logMsg', data);
  });
});
