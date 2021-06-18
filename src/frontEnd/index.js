//config
const config = require("../../config/config.json");

//libraries
const express = require("express");

//express environment
const port = 1025;
const app = express();

//express settings
app.set("view engine", "ejs");
app.set("views", __dirname + "/../../views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/../../public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
