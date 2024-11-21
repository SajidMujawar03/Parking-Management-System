import React from 'react'
import { Link } from 'react-router-dom'
import About from '../components/About/About.jsx'
import Service from '../components/Service/Service.jsx'




const Home = () => {
  return (
    <>
    <section className='hero_section md:pt-[60px] 2xl:h-[800px]'>
        <div className='container mb:px-[100px] flex items-center justify-end md:h-[75vh]'>
            <div className='flex flex-col md:flex-row w-[1000px] justify-center items-center '> 
                  <div className='md:w-full max-w-fit'>
                      <div className='p-2 flex flex-col justify-between'>
                          <h2 className='text-[36px] font-bold'>
                            Are you a <span className='text-[#F3C623]'>VISITOR</span>?
                          </h2>
                          <p className='text-[24px]'>Connect to us</p>
                          <div className='w-full p-4 '>
                              <div className='w-full'>
                                  <ul className='list-disc text-[18px]'>
                                      <li>Search the slot nearby your destination</li>
                                      <li>Select the slot for parking</li>
                                      <li>Book the slot by payment</li>
                                  </ul>
                              </div>
                          </div>
                          <Link
                          to='/login' className='w-[200px] h-[50px] bg-orange-400 btn flex items-center justify-center'>Book a slot
                          </Link>
                      </div>
                  </div>

                  <p className='m-[20px] text-[20px] font-bold'>OR</p>
                <div className='md:w-full max-w-fit'>
                  <div className='p-2 flex flex-col justify-between'>
                          <h2 className='text-[36px] font-bold'>
                            Want to create a <span className='text-[#F3C623]'>SLOT</span>?
                          </h2>
                          <p className='text-[24px]'>Join the business</p>
                          <div className='w-full p-4'>
                              <div className='w-full'>
                                  <ul className='list-disc text-[18px]'>
                                      <li>Add your information</li>
                                      <li>Add slot details</li>
                                      <li>Connect account for payments</li>
                                  </ul>
                              </div>
                          </div>
                          <Link
                          to='/login' className='w-[200px] h-[50px] bg-orange-400 btn flex items-center justify-center'>Create a slot</Link>
                      </div></div>
            </div>
        </div>
    </section>


    <section>
            <About/>
    </section>

    <section>
        {/* <Service/> */}
    </section>

</>
  )
}

export default Home