import './App.css';
import { AuthProvider } from './Context'
import { BrowserRouter as Router, Route, Routes,} from 'react-router-dom';
import { LoginAdmin, HistorialAccesos, RegistrosUsuarios } from './pages'
import { PrivateRoute } from './Components'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path = '/' element = {<RegistrosUsuarios/>}/>
          <Route path = 'loginAdmin' element = {<LoginAdmin/>}/>
          <Route element = {<PrivateRoute/>}>
            
          </Route>
          <Route exact path = 'historialAccesos' element = {<HistorialAccesos/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;