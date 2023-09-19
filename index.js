const express = require('express');
const uuid = require('uuid');
const UserService = require('./src/js/Service/userService.js');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.get('/login', (req, res) => {
    item = UserService.login(req.body.username, req.body.password);
    if(item.password != password){
        console.log("wrong password")
    }
    console.log(data);
});
app.post('/register', (req, res) =>{
    let response = UserService.register(req.body.username, req.body.password, req.body.admin);
    console.log(response)
    switch(response){
        case "Succesfully uploaded":
            break;
        case "Duplicate":
            break;
        case "Bad Request":
            break;
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})