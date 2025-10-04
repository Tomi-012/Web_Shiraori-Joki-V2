import { useState, useEffect, useCallback } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Initialize state with proper SSR handling
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydration effect - only runs on client
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        const parsedItem = JSON.parse(item)
        setStoredValue(parsedItem)
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      // If localStorage is corrupted, clear it and use initial value
      try {
        window.localStorage.removeItem(key)
      } catch (clearError) {
        console.error(`Error clearing localStorage key "${key}":`, clearError)
      }
    } finally {
      setIsHydrated(true)
    }
  }, [key])

  // setValue function with proper error handling
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value

      // Validate value before storing
      if (valueToStore === undefined || valueToStore === null) {
        console.warn(`Attempted to store invalid value for key "${key}"`)
        return
      }

      setStoredValue(valueToStore)

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)

      // Handle quota exceeded error
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded. Attempting to clear old data...')
        try {
          // Try to remove some old data (implement your cleanup strategy here)
          const keys = Object.keys(localStorage)
          if (keys.length > 0) {
            // Remove oldest item (simple strategy)
            const oldestKey = keys[0]
            if (oldestKey !== key) {
              window.localStorage.removeItem(oldestKey)
              // Retry setting the value
              const retryValue = value instanceof Function ? value(storedValue) : value
              window.localStorage.setItem(key, JSON.stringify(retryValue))
            }
          }
        } catch (retryError) {
          console.error('Failed to retry localStorage operation:', retryError)
        }
      }
    }
  }, [key, storedValue])

  // Remove item function
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [isHydrated ? storedValue : initialValue, setValue, removeValue] as const
}

// Hook for session storage (alternative to localStorage)
export function useSessionStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    try {
      const item = window.sessionStorage.getItem(key)
      if (item) {
        const parsedItem = JSON.parse(item)
        setStoredValue(parsedItem)
      }
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error)
    } finally {
      setIsHydrated(true)
    }
  }, [key])

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)

      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [isHydrated ? storedValue : initialValue, setValue] as const
}