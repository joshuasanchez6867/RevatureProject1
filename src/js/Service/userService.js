const UserDAO = require('../DAO/userDAO.js')
const login = (username, password) => {
    UserDAO.getUserDAO(username)
    .then((data) => {
        return data.Item;
    })
    .catch((err) => {
        console.log("user not found")
        console.error(err);
    })
}
const register = (username, password, admin) => {
    UserDAO.registerUserDAO(username, password, admin)
    .then(() => {
        return "Succesfully uploaded";
    })
    .catch((err) => {
        if(err.code == 'ConditionalCheckFailedException'){
            return "Duplicate";
        }
        else {
          return "Bad Request";
        }
    })
}
module.exports = {login, register};