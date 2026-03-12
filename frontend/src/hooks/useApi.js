import { useState, useContext } from 'react'
import { AuthContext } from '../context/authContext'

export default function useApi(apiFunction) {
  const { logout } = useContext(AuthContext)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = async (...args) => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiFunction(...args)
      return result
    } catch (err) {
      if (err.status === 401) {
        logout()
      } else {
        setError(err)
      }

      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    request,
    loading,
    error,
  }
}