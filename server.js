const express = require('express');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser')

var application = express();

application.engine('mustache', mustache());

application.set('views', './views');
application.set('view engine', 'mustache');

application.use(session({
    secret: 'secretcookiekey',
    resave: false,
    saveUninitialized: true
}));

application.use(cookieParser());
application.use(bodyParser.urlencoded());


var users = [ { name: 'admin', password: 'password' } ];

application.use(function (request, response, next) {
    if (request.session.isAuthenticated === undefined) {
        request.session.isAuthenticated = false;
    }
    next();
})

application.get('/', (request, response) => {
    response.render('index');
});


application.get('/signin', (request, response) => {
    response.render('signin');
});

application.post('/signin', (request, response) => {
    var name = request.body.name;
    var password = request.body.password;
    var user = users.find(user => { return user.name === name && user.password === password })

    if (user) {
        request.session.isAuthenticated = true;
        request.session.name = user.name;
        response.redirect('/dashboard');
    } else {
        response.render('signin');
    }
});

application.get('/dashboard', (request, response) => {
    if (request.session.isAuthenticated == false) {
        response.redirect('/signin');
    } else {
        var model = {
            name: request.session.name
        }
        response.render('dashboard', model);
    }
})

application.listen(3000);