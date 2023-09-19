const express = require('express');
const uuid = require('uuid');
const UserService = require('./src/js/Service/userService.js');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.get('/login', UserService.login);
app.post('/register', UserService.register);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})