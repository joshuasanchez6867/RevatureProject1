const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});
dynamoDB = new AWS.DynamoDB.DocumentClient(); 
const submitTicketDAO = (ticket_id, username, description, type, amount) => {
    
    const params = {
        TableName: 'TicketTable',
        Item: {
            'TicketID': ticket_id,
            'Username_FK': username,
            'description': description,
            'type': type,
            'amount': amount,
            'status': 'PENDING'
        }
    };
    return dynamoDB.put(params).promise();
}
const arbitrateTicketDAO = (ticket_id, decision, username) => {
    const params = {
        TableName: 'TicketTable',
        Key: {
            'TicketID': ticket_id,
        },
        UpdateExpression: 'set #s = :r, resolver = :p', 
        ExpressionAttributeValues: {
          ':r': decision,
          ':p': username,
        },
        ExpressionAttributeNames: {
            "#s": "status"
        }
    };
    return dynamoDB.update(params).promise();
}
const getTicketByIDDAO = (ticket_id) => {
    const params = {
        TableName: 'TicketTable',
        Key: {
            'TicketID': ticket_id
        }
    }
    return dynamoDB.get(params).promise();
};
const viewTicketsByStatusDAO = (username, statusType, getAllFlag) =>{
    if(getAllFlag === true){
        const params = {
            TableName: 'TicketTable',
            FilterExpression : '#s = :stype',
            ExpressionAttributeValues: {
                ":stype": "PENDING",
            },
            ExpressionAttributeNames: {
                "#s": "status",
            }
        }
        return dynamoDB.scan(params).promise();
    }
    else{
        console.log(username);
        console.log(statusType);
        const params = {
            TableName: 'TicketTable',
            FilterExpression: "#n = :ntype",
            ExpressionAttributeValues: {
                ":ntype": username
            },
            ExpressionAttributeNames: {
                "#n": "Username_FK"
            }
        }
        return dynamoDB.scan(params).promise();
    }
}
module.exports = {submitTicketDAO, arbitrateTicketDAO, getTicketByIDDAO, viewTicketsByStatusDAO};