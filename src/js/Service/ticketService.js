const TicketDAO = require('../DAO/ticketDAO.js')
const jwtUtil = require('../../../utility/jwt_util.js');
const uuid = require('uuid');


const submit = (req, res) => {
    let ticketType = req.body.type;
    console.log("Submit");

    if(req.body.amount == null || typeof req.body.amount  !== typeof 0 || req.body.amount == undefined || req.body.amount  <= 0){
        res.status(400).send("Ticket Amount Invalid");
    }
    else if(req.body.description == null || typeof req.body.description  !== typeof 'string'|| req.body.description == undefined){
        res.status(400).send("Ticket Description Invalid");
    }
    else if(req.body.type == null || typeof req.body.type !== typeof 'string'|| req.body.type == undefined){
        res.status(400).send("Ticket Type Invalid");
    }
    else {
        if(ticketType !== 'Travel'&& ticketType !== 'Lodging' && ticketType !== 'Food'){
            ticketType = 'Other';
        }
        const token = req.headers.authorization.split(' ')[1]; // ['Bearer', '<token>'];
        jwtUtil.verifyTokenAndReturnPayload(token)
        .then( (payload) => {
            console.log(payload.admin);
            if(payload.admin === 'employee') {
                let ticketID = uuid.v4();
                TicketDAO.submitTicketDAO(ticketID, payload.username, req.body.description, ticketType, req.body.amount)
                .then(() => {
                    res.status(202).json({message: 'Succesfully uploaded', genTicketID: ticketID});
                })
                .catch((err) => {
                    console.log(err);
                    if(err.code == 'ConditionalCheckFailedException'){
                        res.status(400).send('Duplicate');
                    }
                    else {
                        res.status(400).send('Bad Request');
                    }
                })
            }
            else {
                res.statusCode = 401;
                res.send({
                    message: `You are not an Employee, you are an Administrator`
                })
            }
        }).catch((err) => {
            console.error(err);
            res.statusCode = 401;
            res.send({
                message: "Failed to Authenticate Token"
            })
        })   
    }
}
const arbitrate = (req, res) => {
    if(req.body.ticket_id == null || typeof req.body.ticket_id  !== typeof 'string'|| req.body.ticket_id == undefined){//add for other memebrs too
        res.status(400).send("Ticket ID Invalid");
    }
    const token = req.headers.authorization.split(' ')[1]; // ['Bearer', '<token>'];

    jwtUtil.verifyTokenAndReturnPayload(token)
    .then((payload) => {
        if(payload.admin === 'admin') {
            console.log(payload.username);
            console.log(payload.admin);
            TicketDAO.getTicketByIDDAO(req.body.ticket_id)
            .then((data) => {
                console.log("toicket gotten");
                if(data.Item.status !== 'PENDING'){
                    res.status(403).send('Cannot change tickets that have already been decided on');
                }
                else{
                    TicketDAO.arbitrateTicketDAO(req.body.ticket_id, req.body.decision, payload.username)
                    .then(() => {
                        res.status(200).send('Succesfully updated');
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(400).send('Bad Request');
                    })
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(400).send('Ticket request failed')
            })
        }
        else {
            res.status(403).send({message: `You are not an Administrator, you are an Employee`})
        }
    }).catch((err) => {
        console.error(err);
        res.statusCode(401).send({
            message: "Failed to Authenticate Token"
        })
    }) 
}
const viewTickets = (req, res) => {

    const token = req.headers.authorization.split(' ')[1]; // ['Bearer', '<token>'];

    jwtUtil.verifyTokenAndReturnPayload(token)
    .then( (payload) => {
        if(payload.admin === 'admin') {//get all pending
            TicketDAO.viewTicketsByStatusDAO(payload.username, req.query.status, true)
            .then((data) => {
                console.log(data);
                res.status(202).send(data);
            })
            .catch((err) => {
                console.log(err);
                res.status(401).send({
                    message: "Bad Request"
                });
            })
        }
        else if(payload.admin === 'employee') {//get all of my tickets of a particular kind
            TicketDAO.viewTicketsByStatusDAO(payload.username, req.query.status, false)
            .then((data) => {
                console.log(data);

                res.status(202).send(data);
            })
            .catch((err) => {
                console.log(err);
                res.status(401).send({
                    message: "Bad Request"
                });
            })
        }
        else {
            res.status(401).send({
                message: "Bad Sign In Token at the Admin"})
            }
    })
    .catch((err) => {
        console.error(err);
        res.status(401).send({
            message: "Failed to Authenticate Token"})
    })
}
module.exports = {submit, arbitrate, viewTickets};