import React from 'react'
import { Link } from 'react-router-dom'
import About from '../components/About/About.jsx'
import Service from '../components/Service/Service.jsx'
import hero from "../assets/hero.jpg"



const Home = () => {
  return (
    <>
    <section className="hero_section md:pt-[60px] 2xl:h-[800px]" style={{ backgroundImage: `url(${hero})` }}>
      <div className="container px-4 md:px-[100px] flex items-center justify-center md:justify-end md:h-[75vh]">
        <div className="flex flex-col md:flex-row w-full max-w-[1000px] justify-center items-center">
          {/* Visitor Section */}
          <div className="w-full md:w-1/2 max-w-fit mb-8 md:mb-0">
            <div className="p-4 flex flex-col justify-between">
              <h2 className="text-[28px] md:text-[36px] font-bold text-center md:text-left">
                Are you a <span className="text-[#F3C623]">VISITOR</span>?
              </h2>
              <p className="text-[20px] md:text-[24px] text-center md:text-left">
                Connect to us
              </p>
              <div className="w-full p-4">
                <ul className="list-disc text-[16px] md:text-[18px] pl-5">
                  <li>Search the slot nearby your destination</li>
                  <li>Select the slot for parking</li>
                  <li>Book the slot by payment</li>
                </ul>
              </div>
              <Link
                to="/login"
                className="w-[180px] h-[50px] md:w-[200px] bg-orange-400 btn flex items-center justify-center mx-auto md:mx-0"
              >
                Book a slot
              </Link>
            </div>
          </div>
  
          {/* Divider */}
          <p className="text-[20px] font-bold my-4 md:my-0">OR</p>
  
          {/* Slot Creation Section */}
          <div className="w-full md:w-1/2 max-w-fit">
            <div className="p-4 flex flex-col justify-between">
              <h2 className="text-[28px] md:text-[36px] font-bold text-center md:text-left">
                Want to create a <span className="text-[#F3C623]">SLOT</span>?
              </h2>
              <p className="text-[20px] md:text-[24px] text-center md:text-left">
                Join the business
              </p>
              <div className="w-full p-4">
                <ul className="list-disc text-[16px] md:text-[18px] pl-5">
                  <li>Add your information</li>
                  <li>Add slot details</li>
                  <li>Connect account for payments</li>
                </ul>
              </div>
              <Link
                to="/login"
                className="w-[180px] h-[50px] md:w-[200px] bg-orange-400 btn flex items-center justify-center mx-auto md:mx-0"
              >
                Create a slot
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  
    <section>
      <About />
    </section>
  
    <section>
    </section>
  </>
  
  )
}

export default Home