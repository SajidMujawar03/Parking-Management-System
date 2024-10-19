import React from 'react'
import { FaSearch } from "react-icons/fa";
const Services = () => {

    const handleSerach=(e)=>{

    }
  return (
    <>
        <section className='h-[80vh]' >

            <form onSubmit={handleSerach} className='container flex items-center justify-center '>
                <div className='shadow-custom-shadow w-[60%] rounded-full flex'>                    
                    <input type="text" className='w-3/4 h-[50px] rounded-l-full px-[20px] focus:outline-none'/>
                    <button type="submit" className='bg-orange-400 w-1/4 rounded-r-full font-bold text-white text-[18px] flex items-center justify-center gap-1 '>
                    <FaSearch />
                    <span>Search</span></button>
                    </div>

            </form>
        </section>
        
    
    </>
  )
}

export default Services