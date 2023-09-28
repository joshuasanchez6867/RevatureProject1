const UserDAO = require('../DAO/userDAO.js')
const jwtUtil = require('../../../utility/jwt_util.js');
const login = (req, res) => {
    if (!req.body.username || typeof req.body.username  !== typeof 'string') {
        res.status(400).send({message: 'Invalid Username'});
    } else {
        UserDAO.getUserDAO(req.body.username)
        .then((data) => {
            if (!data.Item) {
                res.status(400).send({error: 'User Does Not Exist'});
            } else if (data.Item.password !== req.body.password) {
                res.status(403).send({error: 'Wrong Password'});
            } else {
                const token = jwtUtil.createJWT(data.Item.Username, data.Item.role);
                res.status(200).send({
                    message : 'Successfully Authenticated',
                    token : token
                })
            }
        }).catch(() => {
            res.status(400).send({error: 'Bad Request'});
        })
    }
};
const register = (req, res) => {
    if (!req.body.username || typeof req.body.username !== typeof 'string') {
        res.status(400).send({error: 'Invalid Username'});
    }
    else if (!req.body.password || typeof req.body.password !== typeof 'string') {
        res.status(400).send({error: 'Invalid Username'});
    }
    else {
        let userRole = req.body.role;
        if (userRole !== 'employee' && userRole !== 'admin') {
            userRole = 'employee';
        }
        UserDAO.registerUserDAO(req.body.username, req.body.password, userRole)
        .then(() => {
            res.status(201).send({message: 'Succesfully Registered'});
        })
        .catch((err) => {
            if (err.code == 'ConditionalCheckFailedException') {
                res.status(400).send({error: 'Duplicate Username'});
            } else {
                res.status(400).send({error: 'Bad Request'});
            }
        })
    }
};
const changeRole = (req, res) => {
    if (!req.body.username || typeof req.body.username  !== 'string') {
        res.status(400).send({error: 'Username Doesnt Exist'});
    } else {
        const token = req.headers.authorization.split(' ')[1];
        jwtUtil.verifyTokenAndReturnPayload(token)
        .then((payload) => {
            let roleUser = req.body.role;
            if (roleUser !== 'employee' && roleUser !== 'admin') {
                roleUser = 'employee';
            }
            if (payload.admin === 'admin') {
                UserDAO.changeRoleDAO(req.body.username, roleUser)
                .then(() => {
                    res.status(200).send({message:`Changed ${req.body.username} to a/an ${roleUser}`});
                })
                .catch(() => {
                    res.status(400).send({error: 'DAO Failed'});
                })
            } else {
                res.status(403).send({error: 'You are not an Employee, you are an Administrator'});
            }
        }).catch(() => {
            res.status(401).send({error: 'Failed to Authenticate Token'});
        }) 
    }
};
module.exports = {login, register, changeRole}