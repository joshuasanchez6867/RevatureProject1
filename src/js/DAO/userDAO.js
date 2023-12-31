const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});
dynamoDB = new AWS.DynamoDB.DocumentClient();
const getUserDAO = (Username) => {
    const params = {
        TableName: 'UserTable',
        Key: {
            'Username': Username
        }
    };
    return dynamoDB.get(params).promise();
};
const registerUserDAO = (Username, password, role) => {
    const params = {
        TableName: 'UserTable',
        Item: {
            'Username': Username,
            'password': password,
            'role': role
        },
        ConditionExpression: 'attribute_not_exists(Username)'
    };
    return dynamoDB.put(params).promise();
};
const changeRoleDAO = (Username, admin) => {
    const params = {
        TableName: 'UserTable',
        Key: {
            'Username': Username
        },
        UpdateExpression: 'set #r = :r',
        ConditionExpression: 'attribute_exists(Username)',
        ExpressionAttributeValues: {
          ':r': admin
        },
        ExpressionAttributeNames: {
            '#r': 'role'
        }
    };
    return dynamoDB.update(params).promise();
};
module.exports = {registerUserDAO, getUserDAO, changeRoleDAO};