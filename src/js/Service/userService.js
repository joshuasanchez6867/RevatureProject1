const UserDAO = require('../DAO/userDAO.js')
const login = (req, res) => {
    UserDAO.getUserDAO(req.body.username)
    .then((data) => {
        if(data.Item.password != req.body.password){
            res.status(400).send('Wrong Password');
        }
        else {
            res.status(200).send('Login Successful');
        }
    }).catch((err) => {
        res.status(400).send(err);
    })
}
const register = (req, res) =>{
    UserDAO.registerUserDAO(req.body.username, req.body.password, req.body.admin)
    .then(() => {
        res.status(200).send('Succesfully uploaded')
    })
    .catch((err) => {
        if(err.code == 'ConditionalCheckFailedException'){
            res.status(400).send('Duplicate')
        }
        else {
            res.status(400).send('Bad Request')
        }
    })
}
module.exports = {login, register};