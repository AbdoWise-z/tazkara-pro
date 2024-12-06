'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Position = 'left' | 'right' | 'top' | 'bottom'

interface FloatingWindowContextType {
  showFloatingWindow: (content: React.ReactNode, position: Position) => void
  hideFloatingWindow: () => void
}

const FloatingWindowContext = createContext<FloatingWindowContextType | undefined>(undefined)

export const useFloatingWindow = () => {
  const context = useContext(FloatingWindowContext)
  if (!context) {
    throw new Error('useFloatingWindow must be used within a FloatingWindowProvider')
  }
  return context
}

interface FloatingWindowProviderProps {
  children: React.ReactNode
}

export default function FloatingWindowProvider({ children }: FloatingWindowProviderProps) {
  const [content, setContent] = useState<React.ReactNode | null>(null)
  const [position, setPosition] = useState<Position>('right')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const showFloatingWindow = (newContent: React.ReactNode, newPosition: Position) => {
    setContent(newContent)
    setPosition(newPosition)
  }

  const hideFloatingWindow = () => {
    setContent(null)
  }

  const getFloatingWindowStyle = (): React.CSSProperties => {
    const offset = 10 // Distance from the cursor
    const style: React.CSSProperties = {
      position: 'fixed',
      zIndex: 1000,
    }

    switch (position) {
      case 'left':
        style.right = `calc(100% - ${mousePosition.x}px + ${offset}px)`
        style.top = `${mousePosition.y}px`
        style.transform = 'translateY(-50%)'
        break
      case 'right':
        style.left = `${mousePosition.x + offset}px`
        style.top = `${mousePosition.y}px`
        style.transform = 'translateY(-50%)'
        break
      case 'top':
        style.left = `${mousePosition.x}px`
        style.bottom = `calc(100% - ${mousePosition.y}px + ${offset}px)`
        style.transform = 'translateX(-50%)'
        break
      case 'bottom':
        style.left = `${mousePosition.x}px`
        style.top = `${mousePosition.y + offset}px`
        style.transform = 'translateX(-50%)'
        break
    }

    return style
  }

  return (
    <FloatingWindowContext.Provider value={{ showFloatingWindow, hideFloatingWindow }}>
      {children}
      {content && (
        <div style={getFloatingWindowStyle()}>
          {content}
        </div>
      )}
    </FloatingWindowContext.Provider>
  )
}