import test from "node:test"
import assert from "node:assert/strict"
import { loadAudio } from "../src/lib/audio.ts"

function serveAudio(t) {
  t.mock.method(
    globalThis,
    "fetch",
    async (url) =>
      new Response(url.endsWith("/fill.mp3") ? "original beat" : "voice cue"),
  )
}

const context = {
  decodeAudioData: async (bytes) => new TextDecoder().decode(bytes),
}

test("the background beat loads from the original fill recording", async (t) => {
  serveAudio(t)
  const { beat } = await loadAudio(context)
  assert.equal(beat, "original beat")
})

test("all three voice cues remain available alongside the background beat", async (t) => {
  serveAudio(t)
  const { cues } = await loadAudio(context)
  assert.deepEqual(cues, {
    bop: "voice cue",
    pull: "voice cue",
    twist: "voice cue",
  })
})

test("a missing sound rejects loading instead of starting incomplete audio", async (t) => {
  t.mock.method(
    globalThis,
    "fetch",
    async () => new Response(null, { status: 404 }),
  )
  await assert.rejects(loadAudio(context), /Audio could not load/)
})
