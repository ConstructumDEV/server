// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express";
import { WebSocketServer } from "npm:ws";
const app = express();
import api from "./api.ts";
import http from "node:http";

let d = "n"
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello  Constructum!',
  }));
});

const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
  console.log("it tried?");
  ws.on('error', console.error);
  ws.on('message', function message(data) {
    console.log('received: %s', data);
    d = data.toString();

    console.log("conn: ", wss.clients.size);
    // Broadcast to all clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        if (client != ws) {
        console.log("clientreadystate")
        try {
          console.log(d);
          client.send(d);
          console.log("packet.sendout");
        } catch (error) {
          console.error("error.packet: ", error);
        }
    } else {
      console.log("prevented duplicate!");
    }
    }
    });
  });

  ws.send('something');
});
wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});

app.use("/api", api);
app.get("/", (_req, res) => {
  res.send("not set up");
  // res.sendFile(`../pages/landing.html`);
});
//let oldwsglobal = "none"

app.listen(8443);
server.listen(8000);
console.log("RUMOR online and ready!");