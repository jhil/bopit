import { actions, type Action } from "./game.ts"

async function loadSample(context: AudioContext, name: string) {
  const response = await fetch(`/audio/${name}.mp3`)
  if (!response.ok) throw new Error("Audio could not load")
  return context.decodeAudioData(await response.arrayBuffer())
}

export async function loadAudio(context: AudioContext) {
  const [entries, beat] = await Promise.all([
    Promise.all(
      actions.map(
        async (action) =>
          [action, await loadSample(context, `command-${action}`)] as const,
      ),
    ),
    loadSample(context, "fill"),
  ])
  return {
    cues: Object.fromEntries(entries) as Record<Action, AudioBuffer>,
    beat,
  }
}
