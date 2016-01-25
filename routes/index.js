/*
* =====================================================
* Pages routes
* =====================================================
*/
var express = require('express');

module.exports = (function() {
    'use strict';
    var router = express.Router();

    router.get('/page/:name', function (req, res) {
        var name = req.params.name;
        res.send(name);
    });

    return router;    
})();
