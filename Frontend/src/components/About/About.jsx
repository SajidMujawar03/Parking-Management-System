import React from 'react'
import about from '../../assets/about.jpg'
const About = () => {
  return (
    <div className='container'>
    
      <h2 className='text-[40px] font-bold text-center text-orange-400'>About Us</h2>
      <p className='text-center'>Connecting drivers with convenient parking and owners with extra income through a simple platform</p>
      <div className='flex items-center justify-center '>
        <div className='flex flex-row gap-5 w-[75%] p-[25px]'>
          <div className='w-full md:w-[50%] flex flex-col justify-between p-[20px] text-justify'>
            <h3 className='text-[18px] '>At <span className='text-[#F3C623] font-bold'>PARKINGO</span>, we make parking easier for everyone! Whether you're a driver looking for a spot or a property owner with extra space, our platform connects you with a hassle-free solution.</h3>

            <p className=''><span className='font-bold text-[18px]'>For Space Owners :</span> Turn your unused parking spots into an opportunity. List your space on our platform and earn while helping drivers find convenient parking.</p>

            <p className=''><span className='font-bold text-[18px] '>For Drivers :</span> No more circling around or worrying about parking fines! Simply search for available spots, book your preferred time slot, and pay securely through our web app. With real-time availability and flexible payment options, parking is now as easy as a few clicks.</p>

            <p className='text-[18px]'>We aim to streamline urban parking, reduce stress, and provide a seamless experience for both space owners and users. Join us in transforming the parking experience with simple, secure, and smart solutions.</p>
          </div>
        <div className='hidden  md:w-[50%] md:flex items-center justify-center '>
        <img src={about} alt="" className='h-[75vh] rounded-lg'/>
        </div>
        </div>
      </div>
    
    </div>
  )
}

export default About