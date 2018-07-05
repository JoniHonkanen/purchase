const express = require('express');
const bodyParser = require('body-parser');



const app = express();
// respond with "hello world" when a GET request is made to the homepage
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./routes/purchase')(app);
require('./routes/action')(app);

const PORT = 9647;
app.listen(PORT, () => {
    console.log('PORTTIA NRO ' + PORT + ' kuunnellaan :)');
});