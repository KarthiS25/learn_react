import { nanoid } from "nanoid"
import Dice from "./Dice"
import { useState, useRef, useEffect } from "react"
import Confetti from 'react-confetti'

export default function Main() {
  const [dice, setDice] = useState(() => generateAllNewDice())
  
  function generateAllNewDice() {
    return new Array(10)
                .fill(0)
                .map(() => ({
                  id: nanoid(),
                  value: Math.floor(Math.random() * 6) + 1,
                  isHeld: false
                }))
  }

  function rollDice() {
    if(!gameWon) {
      setDice(prevDice =>
        prevDice.map(die =>
          die.isHeld
          ? die
          : { ...die, value: Math.floor(Math.random() * 6) + 1 }
        )
      )
    }
    else {
      setDice(generateAllNewDice())
    }
  }

  function hold(id) {
    setDice(prevDice => 
      prevDice.map(dice => 
        dice.id === id
        ? { ...dice, isHeld: !dice.isHeld }
        : dice
      )
    )
  }

  const gameWon = dice.every(die => die.isHeld) && dice.every(die => die.value === dice[0].value)
  const buttonFocusRef = useRef(null)

  useEffect(() => {
    if(gameWon){
      buttonFocusRef.current.focus()
    }
  }, [gameWon])

  const diceElement = dice.map(die => (
    <Dice
      key={die.id}
      value={die.value}
      id={die.id}
      isHeld={die.isHeld}
      hold={() => hold(die.id)}
    />
  ))

  return (
    <main>
      <div>
        {gameWon && <Confetti />}
      </div>
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container">
        {diceElement}
      </div>
      <button ref={buttonFocusRef} onClick={rollDice} className="roll-dice">{gameWon ? "New Game" : "Roll"}</button>
    </main>
  )
}