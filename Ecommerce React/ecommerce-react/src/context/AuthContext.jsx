import React, { createContext, useContext, useState, useEffect } from 'react'
import { useData } from './DataContext'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { createUser, getUserByCedula } = useData()

  // Cargar sesión guardada al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('current_user')
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error al cargar sesión:', error)
        localStorage.removeItem('current_user')
      }
    }
    setIsLoading(false)
  }, [])

  // Guardar sesión cuando cambia el usuario
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('current_user', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('current_user')
    }
  }, [currentUser])

  const register = async ({ name, lastname, cedula, password, confirmPassword }) => {
    // Validaciones
    if (!name || !lastname || !cedula || !password) {
      throw new Error('Todos los campos son obligatorios')
    }

    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres')
    }

    if (password !== confirmPassword) {
      throw new Error('Las contraseñas no coinciden')
    }

    // Verificar si ya existe el usuario
    const existingUser = getUserByCedula(cedula)
    if (existingUser) {
      throw new Error('Ya existe una cuenta con esta cédula')
    }

    // Crear usuario
    const newUser = createUser({
      name,
      lastname,
      cedula,
      password // En producción, esto debería estar encriptado
    })

    return newUser
  }

  const login = async ({ cedula, password }) => {
    // Validaciones
    if (!cedula || !password) {
      throw new Error('Cédula y contraseña son obligatorios')
    }

    // Buscar usuario
    const user = getUserByCedula(cedula)
    
    if (!user || user.password !== password) {
      throw new Error('Cédula o contraseña incorrectos')
    }

    // Guardar sesión (sin la contraseña)
    const { password: _, ...userWithoutPassword } = user
    setCurrentUser(userWithoutPassword)

    return userWithoutPassword
  }

  const logout = () => {
    setCurrentUser(null)
  }

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    register,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
