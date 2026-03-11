import express from "express"
import { Server } from "@hocuspocus/server"

const WEB_PORT = 3000
const WS_PORT = 1234

const app = express()
app.use(express.static("public"))

app.listen(WEB_PORT, () => {
  console.log(`Web page running at http://localhost:${WEB_PORT}`)
})

const server = new Server({
  port: WS_PORT,
})

server.listen()

console.log(`WebSocket server running at ws://localhost:${WS_PORT}`)