import express from "express"
import http from "http"
import { WebSocketServer } from "ws"
import { Hocuspocus } from "@hocuspocus/server"

const PORT = process.env.PORT || 3001

const app = express()
app.use(express.static("public"))

const server = http.createServer(app)

const hocuspocus = new Hocuspocus({})

const wss = new WebSocketServer({
  server,
  path: "/collaboration",
})

wss.on("connection", (ws, req) => {
  hocuspocus.handleConnection(ws, req)
})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})