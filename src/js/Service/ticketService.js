const TicketDAO = require('../DAO/ticketDAO.js')
const submit = (req, res) => {
    if(req.body.ticket_id == null || typeof req.body.ticket_id  !== typeof 0|| req.body.ticket_id == undefined){//add for other memebrs too
        res.status(400).send("Ticket Incorrect");
    }
    else{
        TicketDAO.submitTicketDAO(req.body.ticket_id, req.body.username, req.body.description, req.body.type, req.body.amount)
        .then(() => {
            res.status(200).send('Succesfully uploaded')
        })
        .catch((err) => {
            console.log(err);
            if(err.code == 'ConditionalCheckFailedException'){
                res.status(400).send('Duplicate')
            }
            else {
                res.status(400).send('Bad Request')
            }
        })
    }
}
const arbitrate = (req, res) => {

    if(req.body.ticket_id == null || typeof req.body.ticket_id  !== typeof 0|| req.body.ticket_id == undefined){//add for other memebrs too
        res.status(400).send("Ticket Incorrect");
    }
    else{
        TicketDAO.arbitrateTicketDAO(req.body.ticket_id, req.body.decision)// quality control decsion and tickeit
        .then(() => {
            res.status(200).send('Succesfully updated')
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send('Bad Request')
        })
    }
}
const getTicketByID = (req, res) => {

    if(req.body.ticket_id == null || typeof req.body.ticket_id  !== typeof 0|| req.body.ticket_id == undefined){//add for other memebrs too
        res.status(400).send("Ticket Incorrect");
    }
    else
    {
        TicketDAO.getTicketByIDDAO(req.body.ticket_id, req.body.decision)// quality control decsion and tickeit
        .then((data) => {
            console.log(data.Item);
            res.status(200).send(data.Item);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send('Bad Request');
        })
    }
}
module.exports = {submit, arbitrate, getTicketByID};