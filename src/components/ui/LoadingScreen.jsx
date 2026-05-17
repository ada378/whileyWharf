import React from 'react'
import Spinner from './Spinner'

const LoadingScreen = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Spinner size="lg" />
      <p className="mt-4 text-gray-500 font-medium">{text}</p>
    </div>
  )
}

export default LoadingScreen
