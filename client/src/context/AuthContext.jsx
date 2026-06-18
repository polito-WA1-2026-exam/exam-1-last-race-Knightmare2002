import { createContext, useEffect, useState } from 'react'
import authenticationAPI from '../API/authAPI'

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authenticationAPI.getCurrentUser()
        setUser(currentUser)
      } catch {
        setUser(null)
      } finally {
        setAuthReady(true)
      }
    }

    checkAuth()
  }, [])

  const logIn = async (username, password) => {
    setLoading(true)
    try {
      const loggedUser = await authenticationAPI.logIn({ username, password })
      setUser(loggedUser)
      return loggedUser
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true)
    try {
      await authenticationAPI.logOut()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        authReady,
        loading,
        logIn,
        logOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider, AuthContext }