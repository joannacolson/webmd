var express = require("express");
var async = require("async");
var router = express.Router();
var db = require("../models");

router.get("/", function(req, res) {
    db.disease.findAll().then(function(diseases) {
        res.render("diseases/all", { diseases: diseases });
    });
});

router.post("/", function(req, res) {
    console.log(req.body);
    // res.send("post worked. Look at the console");

    // 1. insert the disease to the db
    db.disease.create({
        name: req.body.name,
        description: req.body.description,
        severity: req.body.severity,
        transmission: req.body.transmission
    }).then(function(newDisease) {
        var symptoms = [];
        if (req.body.symptoms) {
            symptoms = req.body.symptoms.split(",");
        }

        if (symptoms.length > 0) {
            async.forEachSeries(symptoms, function(s, callback) {
                //functions that runs for each symptom

                // 2. insert one or many symptoms for this one disease
                db.symptom.findOrCreate({
                    where: { name: s.trim() }
                }).spread(function(symptom, wasCreated) {
                    // add the info into the join table

                    // 3. populating the join table for each symptom for that disease
                    newDisease.addSymptom(symptom);
                    callback();
                });
            }, function() {
                //runs when everything is done
                res.redirect("/diseases");
            });
        } else {
            res.redirect("/diseases");
        }
    }).catch(function(error) {
        res.send(error);
    });
});

router.get("/add", function(req, res) {
    res.render("diseases/add");
});

router.get("/:id", function(req, res) {
    db.disease.findOne({
        where: { id: req.params.id },
        include: [db.symptom]
    }).then(function(disease) {
        res.render("diseases/show", { disease: disease });
    });
});

module.exports = router;
