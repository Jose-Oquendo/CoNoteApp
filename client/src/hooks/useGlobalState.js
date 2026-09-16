import { useContext } from 'react'
import { NotesContext, AuthContext, UserContext } from '../context/GlobalContext'

export function useNotes() {
  const context = useContext(NotesContext)
  if (!context) {
    throw new Error('useNotes debe usarse dentro de un NotesProvider')
  }
  return context
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser debe usarse dentro de un UserProvider')
  }
  return context
}

