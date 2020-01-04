const express = require('express');
const bodyParser = require('body-parser');

const db = require('./config/databaseconfig');
const userRouter = require('./router/user');
const port = 3000;
const app = express();
var cors = require('cors');

app.options('*', cors())

app.use(cors());
app.use(express.static('./public'))
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/user', userRouter);

app.use((err, req, res, next) => {
    console.log(err);
    const status = err.statusCode || 500;
    const message = err.message;
    const data = err.data;
    res.status(status).json({
        status: status,
        message: message,
        data: data
    });
});

app.listen(port, () => {
    console.log('server is on :3000')
});
