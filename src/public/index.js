const socket = io();
//const input = document.getElementById('prueba');
const formSocket = document.getElementById('formSocket');
const addMsgBtn = document.getElementById('msgSender');
const msgInput = document.getElementById('msgInput');
const msgEmail = document.getElementById('msgEmail');
const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );
};
const evalText = (text) => {
  return text.match(/<[^>]*>/g);
};

let user;

Swal.fire({
  title: 'Ingrese su nombre',
  input: 'text',
  allowOutsideClick: false,
  inputValidator: (value) => {
    console.log(value);
    return !value && 'Necesitas escribir un nombre de usuario para participar!';
  },
}).then((result) => {
  user = result.value;
});

formSocket.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(formSocket);
  const ioObj = {
    client: socket.id,
    user,
    product: {
      name: data.get('productName'),
      price: data.get('productPrice'),
      url: data.get('productUrl'),
    },
  };
  socket.emit('addProduct', ioObj);
  console.log(ioObj);
});

msgSender.addEventListener('click', (e) => {
  e.preventDefault();
  const msgToSend = {
    mail: msgEmail.value,
    date: new Date(),
    msg: msgInput.value,
    user,
  };
  // if to check email in msgEmail.value
  if (!validateEmail(msgEmail.value)) {
    msgEmail.value = '';
    return Swal.fire('Ingrese un mail Vaildo');
  }
  if (!msgEmail.value || !msgInput.value)
    return Swal.fire('Todos los campos son obligatorios');
  if (evalText(msgInput.value) !== null) {
    return Swal.fire('No se permiten etiquetas HTML');
  }
  //msgToAdd.insertAdjacentHTML(
  //'beforeend',
  //`<li><span style="color: blue;">${msgEmail.value}</span> , <span style="color:red"/>[2/23/2022]</span><span style="color:green"/> ${msgInput.value}</span></li>`,
  //);
  socket.emit('addMsg', msgToSend);
  console.log(msgToSend);
  msgEmail.value = '';
  msgInput.value = '';
});

//SOCKET EVENTS

socket.on('log', (data) => {
  let log = document.getElementById('log');
  let products = '';
  data.forEach((element) => {
    products += `${element.name} | ${element.price} | ${element.url} <br />`;
  });
  log.innerHTML = products;
});

socket.on('messages', (data) => {
  console.log(data);
  data.forEach((element) => {
    let d = new Date(element.date);
    let dformat =
      [d.getDate(), d.getMonth() + 1, d.getFullYear()].join('/') +
      ' ' +
      [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
    msgToAdd.insertAdjacentHTML(
      'beforeend',
      `<li><span style="color: blue;">${element.mail}</span> , <span style="color:red"/>${dformat}</span>,<span style="color:green"/> ${element.msg}</span></li>`,
    );
  });
});
socket.on('logMsg', (data) => {
  let d = new Date(data.date);
  let dformat =
    [d.getDate(), d.getMonth() + 1, d.getFullYear()].join('/') +
    ' ' +
    [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
  msgToAdd.insertAdjacentHTML(
    'beforeend',
    `<li><span style="color: blue;">${data.mail}</span> , <span style="color:red"/>${dformat}</span>,<span style="color:green"/> ${data.msg}</span></li>`,
  );
});

socket.on('notification', (data) => {
  console.log('Alguien se conecto');
});
