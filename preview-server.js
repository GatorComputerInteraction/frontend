var express = require("express");
var app = express();

app.use("/", express.static("dist"));

app.listen(3000, () => {
  console.log("Server Started! http://localhost:3000");
});
