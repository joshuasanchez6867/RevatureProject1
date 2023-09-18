const service = require('/js/Service/userService.js');
const bodyParser = require('body-parser');
const express = require('express');
var jsonParser = bodyParser.json()

const app = express();
const PORT = 3000;

app.use('/login', jsonParser, (req, res) => {
    service.login(req.body.username, req.body.password);
    
});
app.use('/register', (req, res) =>{
    
});

app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});

modules.exports = app;