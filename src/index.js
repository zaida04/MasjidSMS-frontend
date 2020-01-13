var express = require('express');
var app = express();
var bodyParser = require("body-parser"); //PARSING POST URL QUERIES
const fs = require("fs");//FILE SYSTEM
var session = require('express-session');
var helmet = require('helmet');
var request = require('request'); //for the captcha and etc

app.set('views', [__dirname + '/routers/views', __dirname + '/routers/application']); //SET THE VIEW FOLDER
app.set('view engine', 'pug'); //SET THE VIEW ENGINE
app.locals.url = "http://localhost:80";
var backendurl = 'http://localhost:80'
//use express session, have login make a session user
//on logout, destroy the session
//session store id and token


//begin of settings for express
app.use(bodyParser.json()); //USE BODYPARSER
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(express.static('routers/public'))
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000
    }
}))
app.use(function (req, res, next) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    //log the ip of a visitor
    try {
        var content = JSON.parse(fs.readFileSync(__dirname + '/data/log.json'));
        content.log.push({ "ip": ip, "webpage": req.path, "time": new Date() });
        fs.writeFileSync(__dirname + "/data/log.json", JSON.stringify(content));
    } catch (e) {
        console.log("error:" + e);
    }
    next();
});

app.use('/backend', (req, res, next) => {
    if (req.session && req.session.user) {
        res.locals.user = {
            "id": req.session.user.id,
            "token": req.session.user.token,
            "firstname": req.session.user.firstname,
            "lastname": req.session.user.lastname
        }
        next();     //If session exists, proceed to page
    } else {
        res.redirect('/login');
    }
});
var backend = require('./routers/application.js')
app.use('/backend', backend)

app.get('/:iname/embed', (req, res) => {
    var lurl = backendurl + '/api/sms/smslist/' + req.params.iname;
    res.render('embed', { "name": req.params.iname })
    /*
    request.get(lurl, (err, response, body) => {
        console.log(body)
        console.log(body.exists)
        if (body.exists == "yes") {
            res.render('embed', { "name": req.params.iname })
        } else {
            res.send("<h3>Sorry, but that SMSList does not exist!</h3>")
        }
    })*/
})


app.post('/login', (req, res, next) => {
    request.post(
        backendurl + '/api/users/login',
        { json: { "email": req.body.email, "password": req.body.password } },
        function (err, response, body) {
            if (err || response.statusCode == 400 || parseInt(body.status) == 400) {
                var e = err || body.error.description;
                if (err) {
                    if (err.errno == 'ECONNREFUSED')
                        e = "API OFFLINE CONTACT DEV"
                }
                console.log(err)
                res.render('login', { errmsg: e });
            } else {
                req.session.user = {
                    "id": body.user.id,
                    "token": body.user.token,
                    "firstname": body.user.firstname,
                    "lastname": body.user.lastname
                }
                res.redirect('/backend');
            }
        }
    );
});

app.use(function (err, req, res, next) {
    if (err) {
        if (err.status) res.status(err.status)
        console.log(err)
        res.render('error', { error: err });
    } else {
        next();
    }
});

app.get('/login', (req, res, next) => {
    res.render('login')
})




app.get('/', (req, res) => {
    res.render('homepage');
})

app.listen('8080', () => {
    console.log("Frontend started");
    if (!fs.existsSync("data")) {
        fs.mkdirSync("data");
    }
    if (!fs.existsSync(__dirname + "/data/log.json")) { //log ip of all pages
        fs.writeFileSync(__dirname + "/data/log.json", JSON.stringify({ "log": [] }));
        console.log("Log created");
    }
})