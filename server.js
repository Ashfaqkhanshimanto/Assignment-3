import express from "express"
import http from "http"
import { WebSocketServer } from "ws"
import { Server } from "@hocuspocus/server"

const PORT = process.env.PORT || 3000

const app = express()
app.use(express.static("public"))

const server = http.createServer(app)

const hocuspocus = new Server({})

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