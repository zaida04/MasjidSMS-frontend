var { Router } = require('express');
var backend = Router();
var request = require('request');

backend.get('/', (req, res) => {
    console.log(res.locals.user);
    res.render('mainpage')
});



module.exports = backend;