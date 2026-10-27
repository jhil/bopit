import test from "node:test"
import assert from "node:assert/strict"
import { beginGame, answer, idleGame, turnDuration } from "../src/lib/game.ts"

test("a correct response adds exactly one point and starts the next turn", () => {
  const game = answer(beginGame("bop", 1000), "bop", 1200, "pull")
  assert.equal(game.score, 1)
  assert.equal(game.command, "pull")
  assert.equal(game.deadline, 3555)
})
test("an incorrect response ends the game without adding points", () => {
  const game = answer(beginGame("bop", 1000), "twist", 1200, "pull")
  assert.equal(game.status, "over")
  assert.equal(game.score, 0)
})
test("a late correct response cannot beat a delayed timeout callback", () => {
  const game = answer(beginGame("bop", 1000), "bop", 3400, "pull")
  assert.equal(game.status, "over")
  assert.equal(game.score, 0)
})
test("inputs outside an active game do nothing", () => {
  assert.equal(answer(idleGame, "bop", 1000, "pull"), idleGame)
})
test("difficulty has a playable minimum response window", () => {
  assert.equal(turnDuration(1000), 700)
})
