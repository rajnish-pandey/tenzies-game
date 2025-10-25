import { useState, useEffect, useRef } from 'react'
import Dice from './components/Dice'
import Celebration from './components/Celebration'
import { nanoid } from "nanoid"
import './App.css'

// Sound imports
import rollSoundFile from './assets/sounds/roll.mp3'
import clickSoundFile from './assets/sounds/click.mp3'
import winSoundFile from './assets/sounds/win.mp3'

function App() {
  // lazy state loading
  const [dice, setDice] = useState(() => generateAllNewDice())

  const gameWon = dice.every(die => die.isHeld) && dice.every(die => die.value === dice[0].value)

  // Audio refs
  const rollSound = useRef(new Audio(rollSoundFile))
  const clickSound = useRef(new Audio(clickSoundFile))
  const winSound = useRef(new Audio(winSoundFile))

  function generateAllNewDice() {
    return new Array(10)
      .fill(0)
      .map(() => (
        {
          value: Math.ceil(Math.random() * 6), 
          isHeld: false,
          id: nanoid()
        }
      )
    )
  }

  function rollDice() {
    if (gameWon) {
      setDice(generateAllNewDice())
    } else {
      rollSound.current.play()
      setDice(oldDice => oldDice.map(item =>
        item.isHeld ? item : { ...item, value: Math.ceil(Math.random() * 6) }
      ))
    }
  }

  function hold(id) {
    clickSound.current.play()
    setDice(oldDice => oldDice.map(item =>
      item.id === id ? 
      {...item, isHeld: !item.isHeld} :
      item
    ))
  }

  useEffect(() => {
    if (gameWon) {
      winSound.current.play()
    }
  }, [gameWon])

  const diceElements = dice.map(item => 
    <Dice 
      value={item.value} 
      isHeld={item.isHeld}
      key={item.id} 
      hold={() => hold(item.id)}
    />
  )

  return (
    <main>
      {gameWon && <Celebration />}
      <div className="game-info">
        <h1 className="title">Tenzies</h1>
        <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      </div>

      <div className='dice-container'>
        {diceElements}
      </div>

      <button className="dice-roll" onClick={rollDice}>
        { gameWon ? "New Game": "Roll"}
      </button>
    </main>
  )
}

export default App
