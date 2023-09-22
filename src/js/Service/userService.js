const UserDAO = require('../DAO/userDAO.js')
const jwtUtil = require('../../../utility/jwt_util.js');

//tested and done
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
                res.status(403).send('Wrong Password');
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
//tested and done
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
        res.status(201).send('Succesfully uploaded')
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
const changeRole = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; // ['Bearer', '<token>'];
    let roleUser = req.body.role;
    if(req.body.username == null || req.body.username == ''|| typeof req.body.username  !== 'string' || req.body.username == undefined){
        res.status(400).send("Username Doesnt Exist");
    }
    if(roleUser !== 'employee' && roleUser !== 'admin'){
        roleUser = 'employee';

    }
    jwtUtil.verifyTokenAndReturnPayload(token)
    .then((payload) => {
        if(payload.admin === 'admin') {
            UserDAO.changeRoleDAO(req.body.username, roleUser)
            .then((data) => {
                console.log(data);
                res.status(200).send({message: `Changed ${req.body.username} to a ${roleUser}`});
            })
            .catch((err) =>{
                console.log(err);
                res.status(400).send({error: "DAO Failed", data: err});
            })
        }
        else {
            res.status(403).send({message: `You are not an Employee, you are an Administrator`})
        }
    }).catch((err) => {
        console.error(err);
        res.statusCode(401).send({
            message: "Failed to Authenticate Token"
        })
    }) 

}
module.exports = {login, register, changeRole}