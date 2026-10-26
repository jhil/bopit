export const actions = ["bop", "pull", "twist"] as const
export type Action = (typeof actions)[number]
export type Game = {
  status: "idle" | "loading" | "playing" | "over"
  command: Action
  score: number
  deadline: number
  message: string
}
export const idleGame: Game = {
  status: "idle",
  command: "bop",
  score: 0,
  deadline: 0,
  message: "Ready when you are.",
}
export function turnDuration(score: number) {
  return Math.max(700, 2400 - score * 45)
}
export function randomAction(random = Math.random): Action {
  return actions[Math.min(2, Math.floor(random() * actions.length))]
}
export function beginGame(command: Action, now: number): Game {
  return {
    status: "playing",
    command,
    score: 0,
    deadline: now + turnDuration(0),
    message: "",
  }
}
export function answer(
  game: Game,
  action: Action,
  now: number,
  next: Action,
): Game {
  if (game.status !== "playing") return game
  if (now >= game.deadline)
    return { ...game, status: "over", message: "Too slow." }
  if (action !== game.command)
    return {
      ...game,
      status: "over",
      message: `That was ${action}. The call was ${game.command}.`,
    }
  const score = game.score + 1
  return { ...game, command: next, score, deadline: now + turnDuration(score) }
}
