const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});
dynamoDB = new AWS.DynamoDB.DocumentClient();
const getUserDAO = (Username) => {
    const params = {
        TableName: 'User_Table',
        Key: {
            'Username': `${Username}`
        }
    };
    return dynamoDB.get(params).promise();
};

const registerUserDAO = (Username, password, role) => {
    const params = {
        TableName: 'User_Table',
        Item: {
            'Username': `${Username}`,
            'password': `${password}`,
            'role': `${role}`
        },
        ConditionExpression: 'attribute_not_exists(Username)'
    };
    return dynamoDB.put(params).promise();
};
const changeRoleDAO = (Username, admin) => {
    const params = {
        TableName: 'User_Table',
        Key: {
            'Username': `${Username}`
        },
        UpdateExpression: 'set #r = :r',
        ExpressionAttributeValues: {
          ':r': admin
        },
        ExpressionAttributeNames: {
            "#r": "role"
        }
    };
    return dynamoDB.update(params).promise();
};

module.exports = {registerUserDAO, getUserDAO, changeRoleDAO};