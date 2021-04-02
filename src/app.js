const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config();

const connect = require('./models/index');
const gamesRouter = require('./routes/games');

const app = express();

// read url params in request
app.use(express.urlencoded({ extended: false})); 
// read json in body request
app.use(express.json()); 
// read cookie in request
app.use(cookieParser());

// connect mongo
connect();

app.get('/', (req, res) => {
    return res.json({message: 'API OK'});
});

app.use('/games', gamesRouter);

app.listen(3000, () => {
    console.log('Api running on port 3000');
});