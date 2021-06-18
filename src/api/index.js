//config
const config = require("../../config/config.json");

//libraries
const hasher = require("pbkdf2-password")();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");

//schemas
const User = require("../../schemas/user");
const Store = require("../../schemas/store");

//express environment
const port = 1024;
const app = express();

//express settings
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    key: config.session.key,
    secret: config.session.secret,
    resave: config.session.resave,
    saveUninitialized: config.session.saveUninitialized,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:1026");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

mongoose
  .connect(config.db.uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("hi");
});

app.post("/auth/join", async (req, res) => {
  if (req.body.username && req.body.password) {
    hasher(
      {
        password: req.body.password,
      },
      async (err, pass, salt, hash) => {
        const username = req.body.username.toLowerCase();
        let users = await User.find({
          username: username,
        });
        if (users.length) {
          res.status(400).json({
            result: "failed",
            detail: {
              error: "Exist username",
              description: "이미 존재하는 이름입니다.",
            },
          });
          return;
        }
        const newUser = new User({
          username: username,
          salt: salt,
          hash: hash,
          updated: false,
        });
        newUser
          .save()
          .then(() => {
            res.status(200).json({
              result: "success",
            });
          })
          .catch((err) => {
            res.status(400).json({
              result: "failed",
              detail: err,
            });
            return;
          });
      }
    );
  } else {
    res.status(400).json({
      result: "failed",
      detail: {
        error: "Data format error.",
        description: "잘못 입력된 데이터가 있습니다.",
      },
    });
  }
});

app.post("/auth/login", async (req, res) => {
  if (req.body.username && req.body.password) {
    const username = req.body.username.toLowerCase();
    let users = await User.find({
      username: username,
    });
    if (users.length) {
      hasher(
        {
          password: req.body.password,
          salt: users[0].salt,
        },
        async (err, pass, salt, hash) => {
          if (hash == users[0].hash) {
            req.session.user = users[0].username;
            req.session.save(() => {
              res.status(200).json({
                result: "success",
              });
            });
          } else {
            res.status(400).json({
              result: "failed",
              detail: {
                error: "Password doesn't match",
                description: "비밀번호가 일치하지 않습니다.",
              },
            });
            return;
          }
        }
      );
    } else {
      res.status(400).json({
        result: "failed",
        detail: {
          error: "Username doesn't match",
          description: "존재하지 않는 유저입니다.",
        },
      });
      return;
    }
  } else {
    res.status(400).json({
      result: "failed",
      detail: {
        error: "Data format error.",
        description: "잘못 입력된 데이터가 있습니다.",
      },
    });
  }
});

app.post("/auth/store", async (req, res) => {
  const name = req.body.name;
  const username = req.body.username.toLowerCase();
  const newStore = new Store({
    name: name,
    username: username,
    updated: false,
  });
  newStore
    .save()
    .then(() => {
      res.status(200).json({
        result: "success",
      });
    })
    .catch((err) => {
      res.status(400).json({
        result: "failed",
        detail: err,
      });
      return;
    });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
