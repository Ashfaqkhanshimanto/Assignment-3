import * as Y from "https://esm.sh/yjs"
import { HocuspocusProvider } from "https://esm.sh/@hocuspocus/provider"

const editor = document.getElementById("editor")

const ydoc = new Y.Doc()

const provider = new HocuspocusProvider({
  url: "ws://localhost:1234",
  name: "demo-room",
  document: ydoc,
})

const ytext = ydoc.getText("shared")

let applyingRemoteUpdate = false

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