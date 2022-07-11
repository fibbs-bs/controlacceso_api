import React from 'react'
import './App.css';
import { AuthProvider } from './Context'
import { BrowserRouter as Router, Route, Routes,} from 'react-router-dom';
import { LoginAdmin, HistorialAccesos, RegistrosUsuarios, ControlAcceso } from './pages'
import { PrivateRoute } from './Components'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path = '/' element = {<RegistrosUsuarios/>}/>
          <Route path = 'loginAdmin' element = {<LoginAdmin/>}/>
          
          <Route element = {<PrivateRoute/>}>
            <Route exact path = 'historialAccesos' element = {<HistorialAccesos/>}/>
            <Route path = 'controlAcceso' element = {<ControlAcceso/>}/>
          </Route>
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
