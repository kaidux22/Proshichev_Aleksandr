import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import './styles/app.module.less'

import { Users } from "./components/users";
import { Stock } from "./components/stock";
import { Exchange } from "./components/exchenge";
import { Header } from "./components/header";
import { useDispatch, useSelector } from "react-redux";
import { ToUser } from "./components/toUser";
import SocketIO from "./components/socket";

export function App() {
  const [search, setSearch] = useState('')

  const handleChange = (value : string) => {
    setSearch(value)
  } 

  useEffect(() => {
    SocketIO.CreateConnection()
  }, [])
  
  return (
    <div>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <Header Search={handleChange} />

      <BrowserRouter>
          <Routes>
              <Route path='/users' element={<Users input={search}/>}/>
              <Route path='/stock' element={<Stock input={search}/>}/>
              <Route path='/exchange' element={<Exchange />}/>
              <Route path='/' element={<ToUser></ToUser>}/>
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
