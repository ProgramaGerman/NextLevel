import React from 'react'
import { Link } from 'react-router-dom'

const TestPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Test de Navegación</h1>
        <div className="space-y-4">
          <Link 
            to="/login" 
            className="block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Ir a Login
          </Link>
          <Link 
            to="/register" 
            className="block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Ir a Register
          </Link>
          <Link 
            to="/" 
            className="block px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90"
          >
            Ir a Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TestPage
