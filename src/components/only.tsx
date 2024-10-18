import React from 'react'

export const AppOnly = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export const PagesOnly = ({ children }: { children: React.ReactNode }) => {
  return null
}
