import './App.css'
import { languages } from './languages'
import { useState } from 'react'
import { clsx } from 'clsx'
import { getFarewellText, word } from './utils'
import Confetti from 'react-confetti'

function App() {
  const [ currentWord, setCurrentWord ] = useState(() => word())
  const [ guessWord, setGuessWord ] = useState([])

  const wrongGuessCount = guessWord.filter(letter => !currentWord.includes(letter)).length
  
  const isGameWon = currentWord.split("").every(letter => guessWord.includes(letter))
  const isGameLost = wrongGuessCount >= languages.length - 1
  const isGameOver = isGameWon || isGameLost
  const lastGussedLetter = guessWord[guessWord.length - 1]
  const isLastGuessIncorrect = lastGussedLetter && !currentWord.includes(lastGussedLetter)
  
  const alphabet = "abcdefghijklmnopqrstuvwxyz"

  const languageElement = languages.map((language, index) => {
    const lost = index < wrongGuessCount

    const className = clsx("chip", lost && "lost")
    const styles = {
      backgroundColor: language.backgroundColor,
      color: language.color
    }
    return (
      <span
        className={className}
        key={index}
        style={styles}
      >
        {language.name}
      </span>
    )
    }
  )

  const letterElement = currentWord.split("").map((word, index) => {
    const shouldRevealLetter = isGameLost || guessWord.includes(word)
    const className = clsx(
      isGameLost && !guessWord.includes(word) && "missed-letter"
    )
    return (
      <span className={className} key={index}>
        {
          shouldRevealLetter
          ? word.toUpperCase()
          : ""
        }
      </span>
    )
  })

  const keyboardElement = alphabet.split("").map((alpha, index) => {
    const isGussed = guessWord.includes(alpha)
    const isCorrect = isGussed && currentWord.includes(alpha)
    const isWrong = isGussed && !currentWord.includes(alpha)
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong
    })

    return (
      <button
        className={className}
        key={index}
        disabled={isGameOver}
        aria-disabled={guessWord.includes(alpha)}
        onClick={() => addGuessWord(alpha)}
      >
        {alpha.toUpperCase()}
      </button>
    )
  })

  function addGuessWord(word) {
    setGuessWord(prevWord => {
      const letterSet = new Set(prevWord)
      letterSet.add(word)
      return Array.from(letterSet)
    })
  }

  function startNewGame() {
    setCurrentWord(word())
    setGuessWord([])
  }

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect
})

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect){
      return (
        <p className="farewell-message">
          {getFarewellText([languages[wrongGuessCount - 1].name])}
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
    if (isGameLost) {
      <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
      </>
    }
    return null
  }
  
  return (
    <main>
      {
        isGameWon && 
          <Confetti
            recycle={false}
            numberOfPieces={1000}
          />
      }
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
      {isGameOver && <button onClick={() => startNewGame()} className='new-game'>
        New Game
      </button>}
    </main>
  )
}

export default App
