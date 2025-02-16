import './App.css'
import { languages } from './languages'
import { useState } from 'react'
import { clsx } from 'clsx'
import { getFarewellText, word } from './utils'
import Confetti from 'react-confetti'

function App() {
  const [ currentWord, setCurrentWord ] = useState(word)
  const [ guessWord, setGuessWord ] = useState([])

  console.log(currentWord)
  const wrongGuessCount = guessWord.filter(letter => !currentWord.includes(letter)).length
  const isGameWon = currentWord.split("").every(letter => guessWord.includes(letter))
  const isGameLost = wrongGuessCount >= languages.length - 1
  const isGameOver = isGameWon || isGameLost
  const lastGussedLetter = guessWord[guessWord.length - 1]
  const isLastGuessIncorrect = lastGussedLetter && !currentWord.includes(lastGussedLetter)

  const alphabet = "abcdefghijklmnopqrstuvwxyz"
  
  const languageElement = languages.map((lang, index) => {
    const lost = index < wrongGuessCount
    const className = clsx('chip', lost && "lost")
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color
    }
    return (
      <span
        key={index}
        className={className}
        style={styles}
      >
        {lang.name}
      </span>
    )
  })

  const letterElement = currentWord.split("").map((letter, index) => {
    const shouldRevealLetter = isGameOver || guessWord.includes(letter)
    const className = clsx(
      isGameLost && !guessWord.includes(letter) && "missed-letter"
    )
    return (
      <span
        key={index}
        className={className}
      >
        {shouldRevealLetter ? letter.toUpperCase() : ""}
      </span>
    )
  })

  const keyboardElement = alphabet.split("").map((letter, index) => {
    const isGussed = guessWord.includes(letter)
    const isCorrect = isGussed && currentWord.includes(letter)
    const isWrong = isGussed && !currentWord.includes(letter)
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong
    })
    return (
      <button
        key={index}
        className={className}
        disabled={isGameOver}
        onClick={() => addGuessWord(letter)}
      >
        {letter.toUpperCase()}
      </button>
    )
  })

  function addGuessWord(letter) {
    setGuessWord(prevWord => ([...prevWord, ...letter]))
  }

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect
  })

  function renderGameStatus() {
    if(!isGameOver && isLastGuessIncorrect) {
      return (
        <p className='farewell-message'>
          {getFarewellText(languages[wrongGuessCount - 1].name)}
        </p>
      )
    }
    if(isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      )
    }
    if(isGameLost) {
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </>
      )
    }
    return null
  }

  function newGame() {
    setCurrentWord(word)
    setGuessWord([])
  }

  return (
    <main>
      {isGameWon && <Confetti
        recycle={false}
        numberOfPieces={1000}
      />}
      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
      </header>
      <section className={gameStatusClass}>
        {renderGameStatus()}
      </section>
      <section className='language-chips'>
        {languageElement}
      </section>
      <section className='word'>
        {letterElement}
      </section>
      <section className='keyboard'>
        {keyboardElement}
      </section>
      {isGameOver && <button onClick={() => newGame()} className='new-game'>
        New Game
      </button>}
    </main>
  )
}

export default App
