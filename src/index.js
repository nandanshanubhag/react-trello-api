const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');


const {
    env,
    server
} = require('./config');

const production = env === 'production';

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

// Initialize express app
const app = express();

// Initialize middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'passport-tutorial',
    cookie: {
        maxAge: 60000
    },
    resave: false,
    saveUninitialized: false
}));

// API Routes
// require('./routes')(app);

// Route only for API documentation (disabled in production)
if (!production) {
    app.use('/docs', express.static(path.join(__dirname, './swagger/')));
    app.use(errorHandler());
}


//Configure Mongoose
mongoose.connect('mongodb://localhost/passport-tutorial', {
    useNewUrlParser: true
});
mongoose.set('debug', true);

// Require user schema
require('./models/Users');
require('./config/passport');
app.use(require('./routes'));

/// error handlers
/// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (!production) console.error(err.stack);
    const message = err.message;
    const error = production ? {} : err;

    res.status(err.status || 500).json({
        message,
        error
    });
});

app.listen(server.port, () => {
    console.log(`App is listening on port ${server.port}`);
});
