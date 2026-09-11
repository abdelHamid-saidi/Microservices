const gateway = require("fast-gateway");

const port = 9001;

const server = gateway({
  routes: [
    {
      prefix: "/api/inventory",
      target: "http://loopback-bookstore:3000/",
    },
    {
      prefix: "/api/order",
      target: "http://loopback-order:3001/",
    },
    {
      prefix: "/api/payment",
      target: "http://loopback-payment:3002/",
    },
  ],
});

server.get("/mytesting", (req, res) => {
  res.send("Gateway Called");
});

server.start(port).then(() => {
  console.log("Gateway is running 9001");
});
