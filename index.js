const express = require('express');
const UserService = require('./src/js/Service/userService.js');
const TicketService = require('./src/js/Service/ticketService.js');

const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
//userService
app.post('/login', UserService.login);
app.post('/register', UserService.register);
app.put('/changeRole', UserService.changeRole);

//ticketService
app.post('/submit', TicketService.submit);
app.put('/arbitrate', TicketService.arbitrate);
app.get('/viewTickets', TicketService.viewTickets);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})