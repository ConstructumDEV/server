// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express";

const port = 8080; //https
const app = express();
import api from "./api.ts";

app.use("/api", api);
app.get("/", (_req, res) => {
  res.send("not set up");
  // res.sendFile(`../pages/landing.html`);
});

Deno.serve((req) => {
  if (req.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 501 });
  }
  const { socket, response } = Deno.upgradeWebSocket(req);
  socket.addEventListener("open", () => {
    console.log("a client connected!");
  });
  socket.addEventListener("message", (event) => {
    if (event.data === "ping") {
      socket.send("pong");
    }
  });
  return response;
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
}); 