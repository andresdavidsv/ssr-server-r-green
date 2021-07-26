const express = require("express");

const { config } = require("./config");

const app = express();

// body parser
app.use(express.json());

app.post("/auth/sign-in", async function(req, res, next) {

});

app.post("/auth/sign-up", async function(req, res, next) {

});

app.get("/materials", async function(req, res, next) {

});

app.post("/user-materials", async function(req, res, next) {

});

app.delete("/user-materials/:userMaterialId", async function(req, res, next) {

});

app.listen(config.port, function() {
  console.log(`Listening http://localhost:${config.port}`);
});