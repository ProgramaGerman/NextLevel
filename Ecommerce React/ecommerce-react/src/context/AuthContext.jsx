import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../env/KeySupabase'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}

/** Hash simple con Web Crypto API (SHA-256) — no requiere librerías externas */
async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar sesión guardada al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('current_user')
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('current_user')
      }
    }
    setIsLoading(false)
  }, [])

  // Persistir sesión
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('current_user', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('current_user')
    }
  }, [currentUser])

  const register = async ({ name, lastname, cedula, password, confirmPassword }) => {
    if (!name || !lastname || !cedula || !password)
      throw new Error('Todos los campos son obligatorios')
    if (password.length < 6)
      throw new Error('La contraseña debe tener al menos 6 caracteres')
    if (password !== confirmPassword)
      throw new Error('Las contraseñas no coinciden')

    // Verificar si ya existe el usuario
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('cedula', cedula)
      .maybeSingle()

    if (existing) throw new Error('Ya existe una cuenta con esta cédula')

    // Hash de la contraseña antes de guardar
    const passwordHash = await hashPassword(password)

    const newUser = {
      id: `user_${Date.now()}`,
      cedula,
      name,
      lastname,
      password_hash: passwordHash,
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('users')
      .insert(newUser)
      .select()
      .single()

    if (error) throw new Error('Error al crear la cuenta: ' + error.message)

    const { password_hash: _, ...userWithoutHash } = data
    return userWithoutHash
  }

  const login = async ({ cedula, password }) => {
    if (!cedula || !password)
      throw new Error('Cédula y contraseña son obligatorios')

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('cedula', cedula)
      .maybeSingle()

    if (error || !user)
      throw new Error('Cédula o contraseña incorrectos')

    // Verificar contraseña hasheada
    const passwordHash = await hashPassword(password)
    if (user.password_hash !== passwordHash)
      throw new Error('Cédula o contraseña incorrectos')

    // Guardar sesión sin el hash
    const { password_hash: _, ...userWithoutHash } = user
    setCurrentUser(userWithoutHash)
    return userWithoutHash
  }

  const logout = () => setCurrentUser(null)

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    register,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
