const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});
const dynamoDB = new AWS.DynamoDB();
function registerUserDAO(Username, password,admin){
    dynamoDB.putItem(params, function(err, data) {
        params = {
            TableName: 'User_Table',
            Key: {
                'Username': {S: `${Username}`},
                'password': {S: `${password}`},
                'admin': {BOOL: admin}
            },
            ConditionExpression: `attribute_not_exists(${Username})`
        };
        if (err) {
            return 1;
        } else {
            return 0;
        }
    });
}
function getUserDAO(Username){
    params = {
        TableName: 'User_Table',
        Key: {
          'Username': {S: `${Username}`}
        }
    };
    dynamoDB.getItem(params, function(err, data) {
        if (err) {
            return "Not a user";
        } else {
            return data.Item;
        }
    }); 
}
module.exports = { getUserDAO, registerUserDAO };