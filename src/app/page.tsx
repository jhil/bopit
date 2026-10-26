"use client"
import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  actions,
  answer,
  beginGame,
  idleGame,
  randomAction,
  turnDuration,
  type Action,
  type Game,
} from "../lib/game"
import { loadCues } from "../lib/audio"

export default function BopIt() {
  const [game, setGame] = useState<Game>(idleGame)
  const [best, setBest] = useState(0)
  const [sound, setSound] = useState(true)
  const [notice, setNotice] = useState("")
  const context = useRef<AudioContext | null>(null)
  const cues = useRef<Awaited<ReturnType<typeof loadCues>> | null>(null)
  const voice = useRef<AudioBufferSourceNode | null>(null)
  const session = useRef(0)

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem("bopit-best"))
      if (Number.isSafeInteger(saved) && saved >= 0) setBest(saved)
    } catch {
      setNotice("Your high score cannot be saved in this browser.")
    }
    return () => {
      session.current++
      voice.current?.stop()
      void context.current?.close()
    }
  }, [])

  const start = useCallback(async () => {
    const id = ++session.current
    setNotice("")
    setGame({ ...idleGame, status: "loading" })
    if (sound) {
      try {
        context.current ??= new AudioContext()
        await context.current.resume()
        cues.current ??= await loadCues(context.current)
      } catch {
        setNotice("Voice cues unavailable.")
      }
    }
    if (id === session.current)
      setGame(beginGame(randomAction(), performance.now()))
  }, [sound])

  const submit = useCallback((action: Action) => {
    setGame((current) =>
      answer(current, action, performance.now(), randomAction()),
    )
  }, [])

  const stop = useCallback(() => {
    session.current++
    voice.current?.stop()
    voice.current = null
    setGame((current) => ({
      ...current,
      status: "over",
      message: "Round stopped.",
    }))
  }, [])

  useEffect(() => {
    if (game.score <= best) return
    setBest(game.score)
    try {
      localStorage.setItem("bopit-best", String(game.score))
    } catch {
      setNotice("Your high score cannot be saved in this browser.")
    }
  }, [game.score, best])

  useEffect(() => {
    if (game.status !== "playing") return
    const timer = window.setTimeout(
      () =>
        setGame((current) =>
          current.status === "playing" && current.deadline === game.deadline
            ? { ...current, status: "over", message: "Too slow." }
            : current,
        ),
      Math.max(0, game.deadline - performance.now()),
    )
    return () => window.clearTimeout(timer)
  }, [game.status, game.deadline])

  useEffect(() => {
    if (game.status === "playing" && sound && context.current && cues.current) {
      const source = context.current.createBufferSource()
      const gain = context.current.createGain()
      gain.gain.value = 0.6
      source.buffer = cues.current[game.command]
      source.connect(gain).connect(context.current.destination)
      source.start()
      voice.current = source
      return () => {
        source.stop()
        voice.current = null
      }
    }
  }, [game.status, game.deadline, game.command, sound])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return
      const action = { b: "bop", p: "pull", t: "twist" }[
        event.key.toLowerCase()
      ] as Action | undefined
      if (action && game.status === "playing") {
        event.preventDefault()
        submit(action)
      }
      if (
        event.key === "Escape" &&
        (game.status === "playing" || game.status === "loading")
      )
        stop()
    }
    const onVisibility = () => {
      if (
        document.hidden &&
        (game.status === "playing" || game.status === "loading")
      )
        stop()
    }
    window.addEventListener("keydown", onKey)
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      window.removeEventListener("keydown", onKey)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [game.status, submit, stop])

  return (
    <main>
      <header>
        <Link className="wordmark" href="/">
          bop<span>it</span>
        </Link>
        <div className="scores">
          <div>
            score <strong>{game.score}</strong>
          </div>
          <div>
            best <strong>{best}</strong>
          </div>
        </div>
      </header>
      <section className="game" aria-label="Bop It game">
        <div className="call">
          <h1 aria-live="assertive">
            {game.status === "playing"
              ? `${game.command} it!`
              : game.status === "loading"
                ? "Get ready"
                : game.status === "over"
                  ? "Game over"
                  : ""}
          </h1>
          <p role="status">{game.message}</p>
        </div>
        <div className="toy">
          <Image
            src="/images/bopit-toy.svg"
            alt="Bop It"
            width={1380}
            height={420}
            priority
          />
          {actions.map((action) => (
            <button
              className={`toy-control ${action}`}
              key={action}
              aria-label={`${action} it`}
              aria-keyshortcuts={action[0].toUpperCase()}
              disabled={game.status !== "playing"}
              onClick={() => submit(action)}
            />
          ))}
        </div>
        <div className="timer" aria-hidden="true">
          {game.status === "playing" && (
            <div
              key={game.deadline}
              style={{ animationDuration: `${turnDuration(game.score)}ms` }}
            />
          )}
        </div>
        <div className="round-controls">
          {game.status === "playing" || game.status === "loading" ? (
            <button onClick={stop}>Stop</button>
          ) : (
            <button className="start" onClick={() => void start()}>
              {game.status === "over" ? "Play again" : "Start"}
            </button>
          )}
          <button onClick={() => setSound(!sound)} aria-pressed={sound}>
            Sound {sound ? "on" : "off"}
          </button>
        </div>
        {notice && (
          <p className="notice" role="status">
            {notice}
          </p>
        )}
      </section>
    </main>
  )
}
