require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

const app = express();
const port = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost/notes')
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.log('Error during connecting mongoDB', err);
    });

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/notes',
    }),
    // cookie: { maxAge: new Date(Date.now() + (3600000))}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));


app.use(express.static('public'));

app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/auth'));
app.use('/', require('./server/routes/index'));
app.use('/', require('./server/routes/dashboard'));

app.get('*', function (req, res) {
    res.status(404).render('404');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
