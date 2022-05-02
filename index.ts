import bodyParser from "body-parser";
import express from "express";
import http from "http";
const cors = require("cors");
const app = express();

const server = http.createServer(app);

import { Server } from "socket.io";
const io = new Server(server);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));// my new api
let customers = [
  {
    id: "1",
    firstName: "George",
    lastName: "Montero",
  },
  {
    id: "2",
    firstName: "Peter",
    lastName: "Pan",
  },

  {
    id: "3",
    firstName: "Juan",
    lastName: "Marichala",
  },

  {
    id: "4",
    firstName: "Pedro",
    lastName: "Navaja",
  },
];

app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/public/chat.html`);
});
app.get("/customers/:id", (request, response) => {
  const customer = customers.find((c) => c.id === request.params.id);
  if (customer) {
    response.json(customers);
  }
  response.status(404).send("Not Found");
});

app.put("/customers/:id", (request, response) => {
  const { firstName, lastName } = request.body;
  const customer = customers.find((c) => c.id === request.params.id);
  if (!customer) {
    response.status(404).send(`Not found`);
  } else {
    customer.firstName = firstName;
    customer.lastName = lastName;
    response.status(201).send(`Name was updated successfully`);
  }
});

app.post("/customers", (request, response) => {
  const { firstName, lastName } = request.body;
  const isAlreadyName = customers.find(
    (customer) =>
      customer.firstName === firstName && customer.lastName === lastName
  );
  if (isAlreadyName) {
    response.status(409).send("Conflict");
  } else if (firstName === "" || lastName === "") {
    response.status(400).send(`Bad request`);
  } else {
    customers.push({ id: `${customers.length + 1}`, firstName, lastName });
    response
      .status(201)
      .send(`Created successfully with the id: ${customers.length}`);
  }
});

app.delete("/customers/:id", (request, response) => {
  const idIndex = request.params.id;
  const customer = customers.find((c) => c.id === idIndex);
  if (!customer) {
    response.status(404).send(`Not found`);
  } else {
    customers = customers.filter((customer) => customer.id != idIndex);
    response.status(201).send(`Deleted successfully with the id: ${idIndex}`);
  }
});

app.get("/clients/:17", (request, response) => {
  response.send(request.params["17"]);
});

io.on("connection", (socket) => {
  console.log("User has been connected");
  socket.on("disconnect", () => {
    console.log("User has been disconnected");
  });
  socket.on("chat message", (msg) => {
    console.log("The message has been sent %s", msg);
    io.emit("chat message", msg);
  });
});
const port = process.env.PORT || 2000;
server.listen(port, () => console.log(`app listening on PORT ${port}`));
