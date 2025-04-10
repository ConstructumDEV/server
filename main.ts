// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express";
import { WebSocketServer } from "npm:ws";
const port = 8443; //https
const app = express();
import api from "./api.ts";
import https from "node:https";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { homedir } from "node:os";

const certPath = resolve(homedir(), "Desktop/=key/cert.pem");
const keyPath = resolve(homedir(), "Desktop/=key/key.pem");
let d = "n"
const options = {
  key: readFileSync(keyPath),
  cert: readFileSync(certPath),
}
const server = https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000); 

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

https.createServer(options, app).listen(443, () => {
  console.log("Secure Express server running on port 443");
});