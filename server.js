//depenencies
var express = require("express");
var app = express();
var ejs = require("ejs");
var cheerio = require("cheerio");
var request = require("request");

//set view engine to ejs
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("pages/home");
});

//signin page
app.get("/NFL", function(req, res) {
  res.render("pages/NFL");
});

//Select from available sports
app.get("/NBA", function(req, res) {
  res.render("pages/NBA");
});

//pick a game to select desired bet
app.get("/MLB", function(req, res) {
  res.render("pages/MLB");
});

app.listen(3001, function() {
  console.log("listening on 3001");
});
