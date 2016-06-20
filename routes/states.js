'use strict';
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var request = require('request');

var Schema = mongoose.Schema;
var StatesSchema = new Schema({
    code  : String,
    full  : String
});

var State = mongoose.model('state', StatesSchema);
/* GET states */
router.get('/', function (req, res) {
    State.find(function (err, states) {
        if (err) {return console.error(err); }
        res.json({
            "states" : states
        });
    });
});

/* CREATE force refresh of states*/
router.get('/refresh', function (req, res) {
    request({
        url : 'https://testapps.brightpeakfinancial.com/bpfServices/api/v1/States?app=%7B%22AppId%22:%22%22,%22SessionId%22:null,%22EventType%22:null,%22IpAddress%22:%22%22,%22Platform%22:%22%22,%22Browser%22:%22%22%7D&states=',
        method : 'GET'
    }, function (err, resreq, body) {
        if (err) {return console.error(err); }
        var response = JSON.parse(body);

        State.remove({}, function (err, removed) {
            if (err) {return console.error(err); }
            Object.keys(response.states).forEach(function(key, value){
                State.create({"code": key, "full": response.states[key]});
            });

            res.sendStatus(200);
        });
    });
});


module.exports = router;
