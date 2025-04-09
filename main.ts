// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express";
import { WebSocketServer } from "npm:ws";
const wss = new WebSocketServer({ port: 8000 });
const port = 8443; //https
const app = express();
import api from "./api.ts";

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
  ws.on('message', function message(data) {
    console.log('received: %s', data);
    console.log("conn: ", wss.clients.size);
    // Broadcast to all clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        console.log("clientreadystate")
        try {
          client.send(data);
          console.log("packet.sendout");
        } catch (error) {
          console.error("error.packet: ", error);
        }
    }
    });
  });

  ws.send('something');
});

app.use("/api", api);
app.get("/", (_req, res) => {
  res.send("not set up");
  // res.sendFile(`../pages/landing.html`);
});
//let oldwsglobal = "none"


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
}); 