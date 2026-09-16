import { AuthProvider } from './AuthProvider'
import { NotesProvider } from './NotesProvider'
import { UserProvider } from './UserProvider'

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <UserProvider>
        <NotesProvider>
          {children}
        </NotesProvider>
      </UserProvider> 
    </AuthProvider>
  )
}