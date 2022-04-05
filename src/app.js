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
  const evalText = (text) => {
    return text.match(/<[^>]*>/g);
  };
  socket.broadcast.emit('notification');
  socket.emit('log', products);
  socket.emit('messages', messages);
  socket.on('addProduct', (data) => {
    console.log(data);
    data.product.id = products.length;
    if (evalText(data.product.name) !== null)
      data.product.name = 'No seas tonto , no inyectest STYLE in Line ';

    products.push(data.product);
    console.log(products);
    io.emit('log', products);
  });
  socket.on('addMsg', (data) => {
    console.log(evalText(data.msg));
    if (evalText(data.msg) !== null)
      data.msg = 'No seas tonto , no inyectest STYLE in Line ';
    messages.push(data);
    io.emit('logMsg', data);
  });
});
