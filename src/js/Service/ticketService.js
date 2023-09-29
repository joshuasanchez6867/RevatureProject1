const TicketDAO = require('../DAO/ticketDAO.js')
const jwtUtil = require('../../../utility/jwt_util.js');
const uuid = require('uuid');
const submit = (req, res) => {
    let ticketType = req.body.type;
    if (!req.body.amount || typeof req.body.amount !== typeof 0 || req.body.amount <= 0) {
        res.status(400).send({error: 'Ticket Amount Invalid'});
    }
    else if (!req.body.description || typeof req.body.description !== typeof 'string') {
        res.status(400).send({error: 'Ticket Description Invalid'});
    }
    else {
        if (ticketType !== 'Travel' && ticketType !== 'Lodging' && ticketType !== 'Food') {
            ticketType = 'Other';
        }
        const token = req.headers.authorization.split(' ')[1]; // ['Bearer', '<token>'];
        jwtUtil.verifyTokenAndReturnPayload(token)
        .then((payload) => {
            if (payload.admin === 'employee') {
                let ticketID = uuid.v4();
                TicketDAO.submitTicketDAO(ticketID, payload.username, req.body.description, ticketType, req.body.amount)
                .then(() => {
                    res.status(201).json({message: 'Succesfully Uploaded', generatedTicketID: ticketID});
                })
                .catch(() => {
                    res.status(400).send({error: 'Bad Request'});
                })
            } else {
                res.status(403).send({ error: 'You are not an Employee, you are an Administrator'});
            }
        }).catch(() => {
            res.status(401).send({error: 'Failed to Authenticate Token'});
        })   
    }
};
const arbitrate = (req, res) => {
    if (!req.query.ticket_id || typeof req.query.ticket_id  !== typeof 'string') {//add for other memebrs too
        res.status(400).send({error: 'Ticket ID Invalid'});
    } else if (req.body.decision !== 'APPROVED' && req.body.decision !== 'DENIED') {//add for other memebrs too
        res.status(400).send({error: 'Decision Invalid: must be APPROVED or DENIED'});
    } else {
        const token = req.headers.authorization.split(' ')[1]; // ['Bearer', '<token>'];
        jwtUtil.verifyTokenAndReturnPayload(token)
        .then((payload) => {
            if (payload.admin === 'admin') {
                TicketDAO.getTicketByIDDAO(req.query.ticket_id)
                .then((data) => {
                    if (!data.Item) {
                        res.status(400).send({error: 'Ticket Does NOT Exist'});
                    }
                    else if (data.Item.status !== 'PENDING') {
                        res.status(403).send({error: 'Cannot change tickets that have already been decided on'});
                    }
                    else {
                        if(payload.username === data.Item.Username_FK) {
                            res.status(403).send({message: 'You cannot arbitrate your own ticket'});
                        } else {
                            TicketDAO.arbitrateTicketDAO(req.query.ticket_id, req.body.decision, payload.username)
                            .then(() => {
                                res.status(200).send({message: 'Succesfully Updated'});
                            })
                            .catch(() => {
                                res.status(400).send({error: 'Bad Request'});
                            })
                        }
                    }
                })
                .catch(() => {
                    res.status(400).send({error: 'Ticket ID causes DAO error'})
                })
            } else {
                res.status(403).send({error: 'You are not an Administrator, you are an Employee'})
            }
        }).catch(() => {
            res.statusCode(401).send({error: 'Failed to Authenticate Token'});
        }) 
    }
};
const viewTickets = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    let typeCheck = req.query.type;
    if (typeCheck !== 'Travel' && typeCheck !== 'Lodging' && typeCheck !== 'Food' && typeCheck !== 'Other') {
        typeCheck = false;
    }
    jwtUtil.verifyTokenAndReturnPayload(token)
    .then((payload) => {
        if (payload.admin === 'admin') {//get all pending
            TicketDAO.viewTicketsByDAO(payload.username, typeCheck, true)
            .then((data) => {
                res.status(200).send({PendingTickets: data.Items});
            })
            .catch((err) => {
                console.log(err);
                res.status(401).send({error: 'Bad Request'});
            })
        } else if (payload.admin === 'employee') {//get all of my tickets of a particular kind
            TicketDAO.viewTicketsByDAO(payload.username, typeCheck, false)
            .then((data) => {
                res.status(200).send({PreviousTickets: data.Items});
            })
            .catch((err) => {
                console.log(err);
                res.status(401).send({error: 'Bad Request'});
            })
        } else {
            res.status(401).send({error: 'Bad Sign In Token at the Admin'});
        }
    })
    .catch(() => {
        res.status(401).send({error: 'Failed to Authenticate Token'});
    })
};
module.exports = {submit, arbitrate, viewTickets};