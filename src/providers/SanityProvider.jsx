import { createContext, useContext } from 'react'
import { client } from '../lib/sanity'

const SanityContext = createContext()

export const SanityProvider = ({ children }) => {
  return (
    <SanityContext.Provider value={{ client }}>
      {children}
    </SanityContext.Provider>
  )
}

export const useSanity = () => useContext(SanityContext)
