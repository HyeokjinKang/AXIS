const app = require('express')();
const port = 80;

app.get('/', (res, req) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
})