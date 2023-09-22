const TicketDAO = require('../DAO/ticketDAO.js')
const jwtUtil = require('../../../utility/jwt_util.js');
const uuid = require('uuid');


const submit = (req, res) => {
    let ticketType = req.body.type;
    if(req.body.amount == null || typeof req.body.amount  !== typeof 0 || req.body.amount == undefined || req.body.amount  <= 0){
        res.status(400).send("Ticket Amount Invalid");
    }
    else if(req.body.description == null || typeof req.body.description  !== typeof 'string'|| req.body.description == undefined){
        res.status(400).send("Ticket Description Invalid");
    }
    else {
        if(ticketType !== 'Travel' && ticketType !== 'Lodging' && ticketType !== 'Food'){
            ticketType = 'Other';
        }
        const token = req.headers.authorization.split(' ')[1]; // ['Bearer', '<token>'];
        jwtUtil.verifyTokenAndReturnPayload(token)
        .then( (payload) => {
            if(payload.admin === 'employee') {
                let ticketID = uuid.v4();
                TicketDAO.submitTicketDAO(ticketID, payload.username, req.body.description, ticketType, req.body.amount)
                .then(() => {
                    res.status(202).json({message: 'Succesfully Uploaded', genTicketID: ticketID});
                })
                .catch((err) => {
                    console.log(err);
                    res.status(400).send('Bad Request');
                })
            }
            else {
                res.status(403).send({
                    message: `You are not an Employee, you are an Administrator`
                })
            }
        }).catch((err) => {
            console.error(err);
            res.status(401).send({
                message: "Failed to Authenticate Token"
            })
        })   
    }
}
const arbitrate = (req, res) => {
    if(req.body.ticket_id == null || typeof req.body.ticket_id  !== typeof 'string'|| req.body.ticket_id == undefined){//add for other memebrs too
        res.status(400).send("Ticket ID Invalid");
    }
    if( req.body.decision !== "APPROVED" &&  req.body.decision !== "DENIED"){//add for other memebrs too
        res.status(400).send("Decision Invalid: must be APPROVED or DENIED");
    }
    const token = req.headers.authorization.split(' ')[1]; // ['Bearer', '<token>'];

    jwtUtil.verifyTokenAndReturnPayload(token)
    .then((payload) => {
        if(payload.admin === 'admin') {
            TicketDAO.getTicketByIDDAO(req.body.ticket_id)
            .then((data) => {
                if(data.Item.status !== 'PENDING'){
                    res.status(403).send('Cannot change tickets that have already been decided on');
                }
                else{
                    TicketDAO.arbitrateTicketDAO(req.body.ticket_id, req.body.decision, payload.username)
                    .then(() => {
                        res.status(202).send('Succesfully Updated');
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(400).send('Bad Request');
                    })
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(400).send('Ticket Does NOT Exist')
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
    let typeCheck = req.query.type;

    if(typeCheck !== 'Travel'&& typeCheck !== 'Lodging' && typeCheck !== 'Food' && typeCheck !== 'Other'){
        typeCheck = undefined;
    }
    jwtUtil.verifyTokenAndReturnPayload(token)
    .then( (payload) => {
        
        if(payload.admin === 'admin') {//get all pending
            TicketDAO.viewTicketsByDAO(payload.username, req.query.type, true)
            .then((data) => {
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
            
            TicketDAO.viewTicketsByDAO(payload.username, typeCheck, false)
            .then((data) => {
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