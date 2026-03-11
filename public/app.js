import * as Y from "https://esm.sh/yjs"
import { HocuspocusProvider } from "https://esm.sh/@hocuspocus/provider"

const editor = document.getElementById("editor")
const roomInfo = document.getElementById("roomInfo")

const room = localStorage.getItem("collab_room")
const password = localStorage.getItem("collab_password")

if (!room || !password) {
  window.location.href = "/"
}

if (roomInfo) {
  roomInfo.textContent = `Room: ${room}`
}

const wsProtocol = location.protocol === "https:" ? "wss" : "ws"
const wsUrl = `${wsProtocol}://${location.host}/collaboration?password=${encodeURIComponent(password)}`

const ydoc = new Y.Doc()

const provider = new HocuspocusProvider({
  url: wsUrl,
  name: room,
  document: ydoc,
})

const ytext = ydoc.getText("shared")

let applyingRemoteUpdate = false

provider.on("authenticationFailed", () => {
  alert("Wrong password.")
  localStorage.removeItem("collab_password")
  window.location.href = "/"
})

ytext.observe(() => {
  applyingRemoteUpdate = true
  editor.value = ytext.toString()
  applyingRemoteUpdate = false
})

editor.addEventListener("input", () => {
  if (applyingRemoteUpdate) return

  const current = ytext.toString()
  const updated = editor.value

  if (current === updated) return

  ydoc.transact(() => {
    ytext.delete(0, current.length)
    ytext.insert(0, updated)
  })
})

editor.value = ytext.toString()