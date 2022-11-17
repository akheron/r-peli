import words from './words.json'
import styles from '../styles/Home.module.css'
import { useCallback, useMemo, useState } from 'react'
import classNames from 'classnames'

type GameState = 'start' | 'game'

export default function Home() {
  const [state, setState] = useState<GameState>('start')
  const [key, setKey] = useState(0)
  return (
    <div className={styles.container}>
      {state === 'start' ? (
        <Start onStart={() => setState('game')} />
      ) : (
        <Game key={key} onRestart={() => setKey(key + 1)} />
      )}
    </div>
  )
}

function Start({ onStart }: { onStart: () => void }) {
  return (
    <div className={styles.startContainer}>
      <button className={styles.bigButton} onClick={onStart}>
        Aloita
      </button>
    </div>
  )
}

function Game({ onRestart }: { onRestart: () => void }) {
  const wordList = useMemo(() => getRandomWords(), [])
  const [selected, setSelected] = useState<string[]>([])
  const [done, setDone] = useState(false)

  const toggle = useCallback(
    (word: string) => {
      if (done) return
      if (selected.includes(word)) {
        setSelected(selected.filter((w) => w !== word))
      } else {
        setSelected([...selected, word])
      }
    },
    [done, selected]
  )

  const isSelected = useCallback(
    (word: string) => selected.includes(word),
    [selected]
  )

  return (
    <div className={styles.gameContainer}>
      <div>Valitse sanat joissa on R</div>
      <div className={styles.wordList}>
        {wordList.map((word) => (
          <div
            key={word}
            className={classNames(styles.word, {
              [styles.selectedWord]: !done && isSelected(word),
              [styles.correctWord]: done && isSelected(word) && isCorrect(word),
              [styles.incorrectWord]:
                done && isSelected(word) && !isCorrect(word),
            })}
            onClick={() => toggle(word)}
          >
            {word}
          </div>
        ))}
      </div>
      {!done ? (
        <div className={styles.actions}>
          <button
            className={styles.bigButton}
            disabled={selected.length === 0}
            onClick={() => setDone(true)}
          >
            Valmis
          </button>
        </div>
      ) : (
        <div className={styles.actions}>
          <div className={styles.result}>
            Löysit {selected.filter(isCorrect).length} / {wordList.filter(isCorrect).length}
          </div>
          <button className={styles.bigButton} onClick={onRestart}>
            Uudestaan
          </button>
        </div>
      )}
    </div>
  )
}

function End() {
  return (
    <div>
      <h1>End</h1>
    </div>
  )
}

function isCorrect(word: string) {
  return word.includes('R')
}

function getRandomWords(count = 10) {
  let randomWords: string[] = []
  while (
    randomWords.reduce((acc, word) => acc + (word.includes('R') ? 1 : 0), 0) < 2
  ) {
    randomWords = []
    while (randomWords.length < count) {
      const word = words[Math.floor(Math.random() * words.length)]
      if (!randomWords.includes(word)) {
        randomWords.push(word)
      }
    }
  }
  return randomWords
}
