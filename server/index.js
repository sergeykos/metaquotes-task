const express = require('express');
const precipitationData = require('./data/precipitation');
const temperatureData = require('./data/temperature');

const app = express();

const jsonParser = express.json()

app.post('/precipitation', jsonParser, (req, res) => {
    res.set("Access-Control-Allow-Origin",  "*");
    res.json(precipitationData);
});

app.post('/temperature', jsonParser, (req, res) => {
    res.set("Access-Control-Allow-Origin",  "*");
    res.json(temperatureData);
});

app.listen('3000');
