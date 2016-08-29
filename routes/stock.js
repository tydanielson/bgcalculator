'use strict';
//var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var request = require('request');
var redis = require('redis');
var client = redis.createClient();

router.get('/ratio/:ticker', function (req, res) {
    client.get(req.params.ticker, function(err, reply) {
        res.json({
            "stock" : reply
        });
    });
});

router.post('/ratio/:ticker', function (req, res) {
    var json = JSON.stringify(req.body.ratios);
    client.set(req.params.ticker, json, function(err, reply) {
        console.log(reply);
        res.sendStatus(200);
    });
    client.expire(req.params.ticker, 2592000);
    
});

router.get('/quote/:ticker', function (req, res) {
    client.get(req.params.ticker + "-quote", function(err, reply) {
        res.json({
            "quote" : reply
        });
    });
});

router.post('/quote/:ticker', function (req, res) {

    var json = JSON.stringify(req.body.quote);
    client.set(req.params.ticker + "-quote", json, function(err, reply) {
        res.sendStatus(200);
    });
    client.expire(req.params.ticker, 86400);
});


module.exports = router;
