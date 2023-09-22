const UserDAO = require('../DAO/userDAO.js')
const jwtUtil = require('../../../utility/jwt_util.js');

const login = (req, res) => {
    if(req.body.username == null || req.body.username == ''|| typeof req.body.username  !== 'string' || req.body.username == undefined){
        res.status(400).send("Invalid Username");
    }
    else{
        UserDAO.getUserDAO(req.body.username)
        .then((data) => {
            if(data.Item == undefined){
                res.status(400).send('User does not exist');
            }
            else if(data.Item.password != req.body.password){
                res.status(400).send('Wrong Password');
            }
            else {
                console.log(data.Item)
                const token = jwtUtil.createJWT(data.Item.Username, data.Item.role);
                res.send({
                    message : "Successfully Authenticated",
                    token : token
                })
                
                res.status(200);

            }
        }).catch((err) => {
            res.status(400).send(err);
        })
    }
}
const register = (req, res) => {
    let userRole = req.body.role;
    if(req.body.username == null || req.body.username == ''|| typeof req.body.username  !== 'string' || req.body.username == undefined){
        res.status(400).send("Invalid Username");
    }
    else if(req.body.password == null || req.body.password == ''|| typeof req.body.password  !== 'string' || req.body.password == undefined){
        res.status(400).send("Invalid Username");
    }
    else if(userRole !== 'employee' && userRole !== 'admin'){
        userRole = 'employee';
    }
    UserDAO.registerUserDAO(req.body.username, req.body.password, userRole)
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
module.exports = {login, register}