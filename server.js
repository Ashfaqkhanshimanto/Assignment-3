import express from "express"
import http from "http"
import { WebSocketServer } from "ws"
import { Hocuspocus } from "@hocuspocus/server"
import fs from "fs"
import path from "path"
import * as Y from "yjs"

const PORT = process.env.PORT || 3000
const ROOM_PASSWORD = process.env.ROOM_PASSWORD || "xamk123"

const app = express()
app.use(express.static("public"))

const server = http.createServer(app)

const dataDir = path.join(process.cwd(), "data")
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir)
}

function getDocPath(documentName) {
  return path.join(dataDir, `${documentName}.bin`)
}

const hocuspocus = new Hocuspocus({
  async onAuthenticate(data) {
    const password = data.requestParameters.get("password") || ""

    console.log("EXPECTED PASSWORD:", ROOM_PASSWORD)
    console.log("RECEIVED PASSWORD:", password)

    if (password !== ROOM_PASSWORD) {
      throw new Error("Unauthorized")
    }

    return true
  },

  async onLoadDocument(data) {
    const filePath = getDocPath(data.documentName)

    if (fs.existsSync(filePath)) {
      const update = fs.readFileSync(filePath)
      const ydoc = new Y.Doc()
      Y.applyUpdate(ydoc, update)
      return ydoc
    }

    return new Y.Doc()
  },

  async onStoreDocument(data) {
    const filePath = getDocPath(data.documentName)
    const update = Y.encodeStateAsUpdate(data.document)
    fs.writeFileSync(filePath, update)
  },
})

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