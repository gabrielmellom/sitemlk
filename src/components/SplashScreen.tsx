'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface SplashScreenProps {
  onComplete?: () => void
  duration?: number
  logoSrc: string
  logoAlt?: string
  logoWidth?: number
  logoHeight?: number
}

export default function SplashScreen({ 
  onComplete, 
  duration = 1500,
  logoSrc,
  logoAlt = "Logo",
  logoWidth = 200,
  logoHeight = 200
}: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Inicia a animação de saída após o tempo especificado
    const timer = setTimeout(() => {
      setIsAnimating(true)
      
      // Remove o componente após a animação
      setTimeout(() => {
        setIsVisible(false)
        onComplete?.()
      }, 800) // Duração da animação de slide up
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onComplete])

  if (!isVisible) return null

  return (
    <div 
      className={`
        fixed inset-0 z-50 
        bg-orange-500 
        flex items-center justify-center
        transition-transform duration-800 ease-in-out
        ${isAnimating ? '-translate-y-full' : 'translate-y-0'}
      `}
      style={{ backgroundColor: '#FF9400' }} // Cor laranja mais vibrante
    >
      <div className="flex flex-col items-center">
        <div className="animate-bounce">
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={logoWidth}
            height={logoHeight}
            priority
            className="drop-shadow-lg"
          />
        </div>
        
        {/* Opcional: Loading indicator */}
        <div className="mt-8 flex space-x-2">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-pulse delay-75"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  )
}