const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});
dynamoDB = new AWS.DynamoDB.DocumentClient();
const submitTicketDAO = (ticket_id, username, description, type, amount) => {
    const params = {
        TableName: 'Ticket_Table',
        Item: {
            'Ticket_ID': ticket_id,
            'Username_FK': username,
            'description': description,
            'type': type,
            'amount': amount,
            'status': 'PENDING'
        },
        ConditionExpression: 'attribute_not_exists(Ticket_ID)'
    };
    return dynamoDB.put(params).promise();
}
const arbitrateTicketDAO = (ticket_id, decision) => {
    const params = {
        TableName: 'Ticket_Table',
        Key: {
            'Ticket_ID': ticket_id,
        },
        UpdateExpression: 'set #s = :r',
        ExpressionAttributeValues: {
          ':r': decision,
        },
        ExpressionAttributeNames: {
            "#s": "status"
        }
    };
    return dynamoDB.update(params).promise();
}
const getTicketByIDDAO = (ticket_id, decision) => {
    const params = {
        TableName: 'Ticket_Table',
        Key: {
            'Ticket_ID': ticket_id,
        }
    }
    return dynamoDB.get(params).promise();
}
module.exports = {submitTicketDAO, arbitrateTicketDAO, getTicketByIDDAO};