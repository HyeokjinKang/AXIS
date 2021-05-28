const app = require('express')();
const port = 8080;

app.get('/', (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});