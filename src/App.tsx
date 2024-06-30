import { Route, Routes } from 'react-router-dom'
import './App.css'
import React from 'react'

const DashboardPage =  React.lazy(() => import('./pages/dashboard'))

function App() {

  return (
    <>
        <Routes>
          <Route element={<DashboardPage/>} path='/' />
        </Routes> 
    </>
  )
}

export default App
