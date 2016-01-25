/*
* =====================================================
* API routes
* =====================================================
*/
var express = require('express');

module.exports = (function() {
    'use strict';
    var api = express.Router();

    api.get('/', function(req, res) {
    	res.status(404);
        res.send('Page not found');
    });

    api.get('/somget', function(req, res) {
        res.send('some json');
    });

    return api;
})();