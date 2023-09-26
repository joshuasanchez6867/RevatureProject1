const express = require('express');
const UserService = require('../Service/userService.js');
const TicketService = require('../Service/ticketService.js');
const router = express.Router();
//userService
router.post('/login', UserService.login);
router.post('/register', UserService.register);
router.put('/changeRole', UserService.changeRole);
//ticketService
router.post('/submit', TicketService.submit);
router.put('/arbitrate', TicketService.arbitrate);
router.get('/viewTickets', TicketService.viewTickets);
module.exports = router;