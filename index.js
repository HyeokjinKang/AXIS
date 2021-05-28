const app = require('express')();
const port = process.env.PORT || 80;

app.get('/', (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});