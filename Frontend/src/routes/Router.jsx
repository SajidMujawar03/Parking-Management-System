import React from 'react'
import {Route,Routes} from "react-router-dom"
import Home from '../pages/Home.jsx'
import Login from '../pages/Login.jsx'
import Signup from '../pages/Signup.jsx'
import Services from '../pages/Services.jsx'
import Contact from '../pages/Contact.jsx'



const Router = () => {
  return (
    <Routes>
       
          <Route path="/" element={<Home/>}/>
         <Route path="/home" element={<Home/>}/>
         <Route path="/login" element={<Login/>}/>
         <Route path="/register" element={<Signup/>}/> 
         <Route path="/service" element={<Services/>}/>
         <Route path="/contact" element={<Contact/>}/>
          {/*
       
        <Route path="/about" element={<About/>}/>
        
        
     */}
    </Routes>
  )
}

export default Router