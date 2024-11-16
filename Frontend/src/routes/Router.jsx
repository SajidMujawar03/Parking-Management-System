import React from 'react'
import {Route,Routes} from "react-router-dom"
import Home from '../pages/Home.jsx'
import Login from '../pages/Login.jsx'
import Signup from '../pages/Signup.jsx'
import Services from '../pages/Services.jsx'
import Contact from '../pages/Contact.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import MyAccount from '../Dashboard/UserDashboard/MyAccount.jsx'
import DashBoard from '../Dashboard/OwnerDasdboard/DashBoard.jsx'
import BookingPage from '../pages/BookingPage.jsx'
import ConfirmationPage from '../pages/ConfirmationPage.jsx'

const Router = () => {
  return (
    <Routes>
       
          <Route path="/" element={<Home/>}/>
         <Route path="/home" element={<Home/>}/>
         <Route path="/login" element={<Login/>}/>
         <Route path="/users/profile/me" element={<ProtectedRoute allowedRoles={["user"]}> <MyAccount/></ProtectedRoute>  }/>
         <Route path="/owner/profile/me" element={<ProtectedRoute allowedRoles={["owner"]}> <DashBoard/></ProtectedRoute>}/>
         <Route path="/booking/:slotId" element={<ProtectedRoute allowedRoles={["user"]} > <BookingPage/></ProtectedRoute>}/> 
         <Route path="/confirmation" element={<ProtectedRoute allowedRoles={["user"]} > <ConfirmationPage/></ProtectedRoute>}/> 
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