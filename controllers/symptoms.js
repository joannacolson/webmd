var express = require("express");
var async = require("async");
var router = express.Router();
var db = require("../models");

router.get("/", function(req, res) {
    db.symptom.findAll().then(function(symptoms) {
        res.render("symptoms/all", { symptoms: symptoms });
    });
});

router.post("/", function(req, res) {
    console.log(req.body);
    // res.send("post symptoms is working");
    db.symptom.create(req.body).then(function(symptom) {
        // console.log("yay, the symptom was added");
        // console.log(symptom);
        res.redirect("/symptoms");
    }).catch(function(error) {
        console.log("Error happened", error);
        res.send("ERROR");
    });
});

router.get("/add", function(req, res) {
    res.render("symptoms/add");
});

router.get("/:id", function(req, res) {
    db.symptom.findOne({
        where: { id: req.params.id },
        include: [db.disease]
    }).then(function(symptom) {
        res.render("symptoms/show", { symptom: symptom });
    });
});

module.exports = router;
