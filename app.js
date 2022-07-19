var express = require("express");
var app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const { default: mongoose, model } = require("mongoose");
var ObjectId = require("mongodb").ObjectId;
const methodOverride = require("method-override");
var cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const { createTokens, validateToken } = require("./JWT");
console.log(validateToken);

var bodyParser = require("body-parser");
app.use(cors());
const bcrypt = require("bcrypt");
require("dotenv").config;
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));
const path = require("path");
const Model = require("./models/Model");
const User = require("./models/User");
const { format } = require("path");
const { log } = require("console");
require("dotenv").config();

// Pour le path du dossier "public" pour y mettre CSS JS IMG
app.use(express.static(path.join(__dirname, "public")));

const url = process.env.DATABASE_URL;

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(url, connectionParams)
  .then(() => {
    console.log("MongoDB database connected !");
  })
  .catch((err) => console.log(err));

app.get("/", validateToken, function (req, res) {
  Model.find()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => console.log(err));
});

app.get("/rdv", function (req, res) {
  Model.find()
    .then((data) => {
      // res.render("Rdv", { data: data })
      res.json(data);
    })
    .catch((err) => console.log(err));
});

app.post("/submit-rdv", function (req, res) {
  const Data = new Model({
    lastname: req.body.lastname,
    firstname: req.body.firstname,
    email: req.body.email,
    rdv_date: req.body.rdv_date,
    rdv_heure: req.body.rdv_heure,
  });
  Data.save()
    .then(() => {
      console.log("Data saved successfully");
      res.redirect("http://localhost:3000/");
    })
    .catch((err) => console.log(err));
});

// API pour l'authentification
app.post("/api/register", (req, res) => {
  const Data = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10), //crypte le MDP
    admin: false,
  });
  Data.save().then(() => {
    console.log("Signed in");
    res.redirect("/");
  });
});

app.get("/register", (req, res) => {
  res.render("Register");
});

// Se connecter
app.get("/login", (req, res) => {
  res.render("Login");
});

app.post("/api/login", (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send("No user found.");
      }
      console.log(user);
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(404).send("Invalid password");
      }
      const accessToken = createTokens(user);
      console.log(accessToken);
      res.cookie("access-token", accessToken),
        {
          maxAge: 60 * 60 * 24 * 30 * 1000,
          httpOnly: true,
        };
      res.redirect('http://localhost:3000/profile/'+user.username);
    })
    .catch((err) => console.log(err));
});

app.get("/user/:id", (req, res) => {
  User.findOne({
    _id: req.params.id,
  })
    .then((dataUser) => {
      Model.find({ email: dataUser.email }).then((dataRdv) => {
        // res.render("Rdv", { user: dataUser, rdv : dataRdv});
        res.json(dataRdv);
      });
    })
    .catch((err) => console.log(err));
});

app.get("/prv/:id", (req, res) => {
  User.findOne({
    _id: req.params.id,
  })
    .then((dataUser) => {
      res.json(dataUser);
    })
    .catch((err) => console.log(err));
});

app.put("/prv/edit/:email", function (req, res) {
  Model.findOne({
    email: req.params.email,
  })
    .then((dataUser) => {
      (dataUser.rdv_date = req.body.rdv_date),
        (dataUser.rdv_heure = req.body.rdv_heure);
      dataUser
        .save()
        .then(() => {
          console.log("Data modified");
          res.redirect("/");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

// const port = 5001;
const port = process.env.PORT || 5001;

var server = app.listen(port, function () {
  console.log("Node server is running!!");
});
