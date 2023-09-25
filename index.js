const express = require('express');
const bodyParser = require('body-parser');
const router = require('./src/js/Router/router.js');
const app = express();
const PORT = 3000;
app.use(bodyParser.json());
app.use(router);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});