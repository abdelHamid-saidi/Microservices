const gateway = require("fast-gateway");

const port = 9001;

const server = gateway({
  routes: [
    {
      prefix: "/api/order",
      target: "http://order:8081/",
    },
    {
      prefix: "/api/payment",
      target: "http://payment:8082/",
    },
  ],
});

server.get("/mytesting", (req, res) => {
  res.send("Gateway Called");
});

server.start(port).then(() => {
  console.log("Gateway is running 9001");
});
