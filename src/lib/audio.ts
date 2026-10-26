import { actions, type Action } from "./game"
export async function loadCues(context: AudioContext) {
  const entries = await Promise.all(
    actions.map(async (action) => {
      const response = await fetch(`/audio/command-${action}.mp3`)
      if (!response.ok) throw new Error("A voice cue could not load")
      return [
        action,
        await context.decodeAudioData(await response.arrayBuffer()),
      ] as const
    }),
  )
  return Object.fromEntries(entries) as Record<Action, AudioBuffer>
}
