'use strict';
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var request = require('request');

var Schema = mongoose.Schema;
var TermQuoteSchema = new Schema({
    gender        : String,
    birthyear     : String,
    state         : String,
    health        : String,
    tobacco       : String,
    coverage      : String,
    ten           : String,
    twenty        : String,
    thirty        : String,
    create_date   : Date
});

var TermQuote = mongoose.model('termquote', TermQuoteSchema);
/* GET all term quotes */
router.get('/cache', function (req, res) {
    TermQuote.find(function (err, quotes) {
        if (err) {return console.error(err); }
        res.json({
            "quotes" : quotes
        });
    });
});

/* GET Term Quote By values */
router.get('/:gender/:birthyear/:state/:health/:tobacco/:coverage', function (req, res) {

    //See if the quote has been looked up before
    TermQuote.find(
        {
            "gender" : req.params.gender,
            "birthyear" : req.params.birthyear,
            "state" : req.params.state,
            "health" : req.params.health,
            "tobacco" : req.params.tobacco,
            "coverage" : req.params.coverage
        },
        function (err, quote) {
            if (err) {return console.error(err); }

            //If its not local we need to call bpfServices
            if (quote.length === 0) {
                //convert birthyear to age for bpfServices
                var age = new Date().getFullYear() - req.params.birthyear,
                    data = {
                        "premiumRequest" : {
                            "benefit": "Term",
                            "preferred": false,
                            "desiredMonthlyPremium": "0",
                            "insuredHealth": req.params.health,
                            "insuredSex": req.params.gender,
                            "postalState": req.params.state,
                            "insuredAge": age,
                            "smoker": req.params.tobacco,
                            "desiredBenefitAmt": req.params.coverage
                        },
                        "app": { "AppCode": "TermQuoteCache", "AppId": "", "AppType": "TermQuoteCache", "SessionId": null, "EventType": null, "IpAddress": "", "Platform": "", "Browser": ""}
                    };
                request({
                    url : 'https://testapps.brightpeakfinancial.com/bpfServices/api/v1/quote',
                    method : 'POST',
                    body : JSON.stringify(data),
                    headers : {
                        'Content-Type' : 'application/json'
                    }
                }, function (err, resreq, body) {
                    if (err) {
                        console.error(err);
                    } else {
                        var arr = JSON.parse(body);
                        TermQuote.create({
                            "gender" : req.params.gender,
                            "birthyear" : req.params.birthyear,
                            "state" : req.params.state,
                            "health" : req.params.health,
                            "tobacco" : req.params.tobacco,
                            "coverage" : req.params.coverage,
                            "ten" : arr[0].totalMonthlyPremium,
                            "twenty" : arr[1].totalMonthlyPremium,
                            "thirty" : arr[2].totalMonthlyPremium,
                            "create_date" : new Date()
                        }, function (err, quote) {
                            if (err) {return console.error(err)}
                            res.json({
                                "quote" : quote
                            });
                        });
                    }
                });
            } else {
                res.json({
                    "quote" : quote
                });
            }
        }
    );
});

router.delete('/cache/clear', function (req, res) {
    TermQuote.remove({}, function (err, removed) {
        if (err) {return console.error(err); }
    });
});

module.exports = router;