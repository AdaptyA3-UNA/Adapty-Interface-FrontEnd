// App.tsx

import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/home';
import Login from "./pages/login";
import Registro from './pages/registro';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element ={<Login/>}/>
        <Route path="/home" element={<Home />} />
        <Route path="/registro" element={<Registro />} />
      </Routes>
    </BrowserRouter>
  );
}