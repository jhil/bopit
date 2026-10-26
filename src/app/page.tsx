"use client"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  actions,
  answer,
  beginGame,
  idleGame,
  randomAction,
  type Action,
  type Game,
} from "../lib/game"
import { loadAudio } from "../lib/audio"

export default function BopIt() {
  const [game, setGame] = useState<Game>(idleGame)
  const [best, setBest] = useState(0)
  const [sound, setSound] = useState(true)
  const [notice, setNotice] = useState("")
  const context = useRef<AudioContext | null>(null)
  const audio = useRef<Awaited<ReturnType<typeof loadAudio>> | null>(null)
  const voice = useRef<AudioBufferSourceNode | null>(null)
  const session = useRef(0)

  useEffect(() => {
    const generation = session
    try {
      const saved = Number(localStorage.getItem("bopit-best"))
      if (Number.isSafeInteger(saved) && saved >= 0) setBest(saved)
    } catch {
      setNotice("Your high score cannot be saved in this browser.")
    }
    return () => {
      generation.current++
      voice.current?.stop()
      void context.current?.close()
    }
  }, [])

  const prepareAudio = useCallback(async () => {
    context.current ??= new AudioContext()
    await context.current.resume()
    audio.current ??= await loadAudio(context.current)
  }, [])

  const toggleSound = async () => {
    if (sound) {
      setSound(false)
      return
    }
    try {
      await prepareAudio()
      setNotice("")
      setSound(true)
    } catch {
      setNotice("Sound unavailable.")
    }
  }

  const start = useCallback(async () => {
    const id = ++session.current
    setNotice("")
    setGame({ ...idleGame, status: "loading" })
    if (sound) {
      try {
        await prepareAudio()
      } catch {
        setSound(false)
        setNotice("Sound unavailable.")
      }
    }
    if (id === session.current)
      setGame(beginGame(randomAction(), performance.now()))
  }, [sound, prepareAudio])

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
    if (
      game.status === "playing" &&
      sound &&
      context.current &&
      audio.current
    ) {
      const source = context.current.createBufferSource()
      const gain = context.current.createGain()
      gain.gain.value = 0.6
      source.buffer = audio.current.cues[game.command]
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
    if (
      game.status !== "playing" ||
      !sound ||
      !context.current ||
      !audio.current
    )
      return
    const source = context.current.createBufferSource()
    const gain = context.current.createGain()
    source.buffer = audio.current.beat
    source.loop = true
    gain.gain.value = 0.3
    source.connect(gain).connect(context.current.destination)
    source.start()
    return () => source.stop()
  }, [game.status, sound])

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
        <h1 className="score" aria-label={`Score ${game.score}, best ${best}`}>
          {game.score}
        </h1>
        <p className="command" role="status" aria-live="assertive">
          {game.status === "playing"
            ? `${game.command} it!`
            : game.status === "loading"
              ? "Get ready"
              : game.message}
        </p>
      </header>
      <section className="game" aria-label="Bop It game">
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
      </section>
      <footer>
        <div className="round-controls">
          {game.status === "playing" || game.status === "loading" ? (
            <button onClick={stop}>Stop</button>
          ) : (
            <button className="start" onClick={() => void start()}>
              {game.status === "over" ? "Play again" : "Start"}
            </button>
          )}
          <button
            onClick={() => void toggleSound()}
            aria-pressed={sound}
            disabled={game.status === "loading"}
          >
            Sound {sound ? "on" : "off"}
          </button>
        </div>
        {notice && (
          <p className="notice" role="status">
            {notice}
          </p>
        )}
      </footer>
    </main>
  )
}
