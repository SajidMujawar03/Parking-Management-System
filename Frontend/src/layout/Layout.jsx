import React from 'react'
import Header from '../components/Header/Header.jsx'
import Footer from '../components/Footer/Footer.jsx'
import Router from '../routes/Router.jsx'

const Layout = () => {
  return (
    <>
    <Header/>

    <main>
       <Router/>
    </main>

    <Footer/>
    </>
  )
}

export default Layout