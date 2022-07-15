const Datastore = require("nedb");
const express = require("express");
const bodyparser = require("body-parser");
var jsonparser = bodyparser.json();
const { request, response } = require("express");
const app = express();
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 5000;
app.use(express.static("public"));
const http = require("http").Server(app);
server = http.listen(3000, function () {
  console.log(`listening at PORT: ${port}`);
});
app.use(bodyparser.json({ limit: "1mb" }));

// Database

const database = new Datastore("database.db");
database.loadDatabase();

app.get("/api", (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      console.log("[SERVER] an error has occurred [Database 1]");
      response.end();
      return;
    }
    response.json(data);
  });
});

app.post("/api", (request, response) => {
  console.log(
    "[SERVER] a request has been received via POST for Database 1 [INSERT Commission]"
  );
  const data = request.body;
  database.insert(data);
  response.json(data);
});

app.put("/api", jsonparser, (request) => {
  console.log(
    "[SERVER] a request has been received via PUT for Database 1 [DELETE Commission]"
  );
  const data = request.body;
  database.remove(data);
  console.log("[SERVER] a item from Database 1 was successfully removed");
});

// SecondDatabase

const SecondDatabase = new Datastore("SecondDatabase.db");
SecondDatabase.loadDatabase();

app.get("/api/deactivated", (request, response) => {
  SecondDatabase.find({}, (err, data) => {
    if (err) {
      console.log("[SERVER] an error has occurred [Database 1]");
      response.end();
      return;
    }
    response.json(data);
  });
});

app.post("/api/deactivated", (request, response) => {
  console.log(
    "[SERVER] a request has been received via POST for Database 2 [MOVE Commission]"
  );
  const data = request.body;
  SecondDatabase.insert(data);
  response.json(data);
});

app.put("/api/deactivated", jsonparser, (request, response) => {
  console.log(
    "[SERVER] a request has been received via PUT for Database 2 [DELETE Commission]"
  );
  const data = request.body;
  SecondDatabase.remove(data);
  console.log("[SERVER] a item from Database 2 was successfully removed");
});

// Socket.io |  Updating the content without refreshing the browser

io.on("connection", (socket) => {
  console.log(`New client connection: ${socket.id}`);
  socket.on("todo-post", (Item) => {
    Item.time = Date();
    socket.broadcast.emit("todo-post", Item);
  });
  socket.on("typing", () => {
    socket.broadcast.emit("typing");
  });
  socket.on("todo-remove", (value) => {
    socket.broadcast.emit("todo-remove", value);
  });
  socket.on("todo-move", (value) => {
    socket.broadcast.emit("todo-move", value);
  });
});

// Error handling

app.use(function (req, res) {
  res.status(404);
  res.sendFile(__dirname + "/public/404.html");
  return;
});
