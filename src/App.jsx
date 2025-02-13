import { useState, useRef } from 'react';
import './App.css'
import Die from "./components/Die"
import { nanoid } from "nanoid"
import Confetti from 'react-confetti'
import { useEffect } from 'react';

function App() {
  const [dice, setDice] = useState(() => generateAllNewDice())
  function generateAllNewDice() {
    return new Array(10)
                .fill(0)
                .map(() => ({
                  id: nanoid(),
                  // value: Math.ceil(Math.random() * 6),
                  value: 5,
                  isHeld: false
                }));
  }
  
  function rollDice() {
    if (!gameWon) {
      setDice(prevDice =>
        prevDice.map(dice =>
          dice.isHeld
          ? dice
          : { ...dice, value: Math.ceil(Math.random() * 6) }
        )
      )
    }
    else {
      setDice(generateAllNewDice())
    }
  }

  function hold(id) {
    setDice(prevDice => 
      prevDice
      .map(dice => 
            dice.id === id
            ? { ...dice, isHeld: !dice.isHeld }
            : dice
      )
    )
  }

  const diceArr = dice.map(obj => (
    <Die
      key={obj.id}
      value={obj.value}
      isHeld={obj.isHeld}
      hold={() => hold(obj.id)}
    />
  ))

  const gameWon = dice.every(die => die.isHeld) && dice.every(die => die.value === dice[0].value)

  const buttonText = gameWon ? "New Game" : "Roll"
  const buttonRef = useRef(null)

  useEffect(() => {
    if (gameWon) {
        buttonRef.current.focus()
    }
  }, [gameWon])

  return (
    <main>
      {gameWon && <Confetti />}
      <div aria-live='polite' className='sr-only'>
        {gameWon && <p>Congratulations! You won! Press New Game to start again.</p>}
      </div>
      <h1 className='title'>Tenzies</h1>
      <p className='instructions'>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className='dice-container'>
        {diceArr}
      </div>
      <button ref={buttonRef} onClick={rollDice} className='roll-dice'>{buttonText}</button>
    </main>
  )
}

export default App
