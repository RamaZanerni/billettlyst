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

// eslint-disable-next-line react-refresh/only-export-components
export const useSanity = () => useContext(SanityContext)
