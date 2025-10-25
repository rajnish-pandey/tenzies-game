import React from 'react'
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'

export default function Celebration() {
  const { width, height } = useWindowSize()
  return (
    <Confetti
      width={width}
      height={height}
    />
  )
}
