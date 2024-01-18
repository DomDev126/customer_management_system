import './App.css';
import {
  Routes,
  Route,
} from "react-router-dom";
import AuthProvider from './provider/AuthProvider';
import RequireAuth from './components/RequireAuth';
import Home from './pages/Home';
import Login from './pages/Login';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route 
          element={<RequireAuth />}
        >
          <Route path='/' element={<Home />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
