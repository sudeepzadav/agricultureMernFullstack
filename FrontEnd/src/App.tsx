import { Route, Routes } from "react-router"
import {  Hero, Login, Navbar, } from "./components"



const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />}/>
        <Route path="/login" element={<Login type="login" />}/> 
        <Route path="/signUp" element={<Login type="signUp"/>}/> 
      </Routes>
    </div>
  )
}

export default App
