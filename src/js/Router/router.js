const express = require('express');
const UserService = require('../Service/userService.js');
const TicketService = require('../Service/ticketService.js');
const router = express.Router();
//userService
router.post('/user/login', UserService.login);
router.post('/user/register', UserService.register);
router.put('/user/changeRole', UserService.changeRole);
//ticketService
router.post('/ticket/submit', TicketService.submit);
router.put('/ticket/arbitrate', TicketService.arbitrate);
router.get('/ticket/viewTickets', TicketService.viewTickets);
module.exports = router;