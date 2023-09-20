const express = require('express');
const uuid = require('uuid');
const UserService = require('./src/js/Service/userService.js');
const TicketService = require('./src/js/Service/ticketService.js');

const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.get('/user/login', UserService.login);
app.post('/user/register', UserService.register);
app.post('/ticket/submit', TicketService.submit);
app.put('/ticket/arbitrate', TicketService.arbitrate);
app.get('/ticket/viewTicket', TicketService.getTicketByID);




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})