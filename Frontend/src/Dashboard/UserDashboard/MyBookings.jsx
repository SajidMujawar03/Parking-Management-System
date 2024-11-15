import React from 'react'
import useFetchData from '../../hooks/useFetchData.jsx'
import { BASE_URL } from '../../config.js'
// import DoctorCard from '../../components/Doctors/DoctorCard.jsx'
import Loading from '../../components/Loader/Loading.jsx'
import Error from '../../components/Error/Error.jsx'


const MyBookings = () => {

  const {data:slots,loading,error}=useFetchData(`${BASE_URL}/user/bookings/my-booking`)

  return (
    <div>
      {loading && !error && <Loading/>}
      {error && !loading && <Error errorMessage={error}/>}
      {
        !loading && !error  &&
        <div className='grid grid-cols-1 lg:grid-cols-2 gap -5'>
            {
              slots.map((doctor)=>{
                // <DoctorCard doctor={doctor} key={doctor.id}/>
              })
            }
        </div>
      }

      {
!loading && !error  && slots.length===0 &&
          <h3 className='mt-5 text-center text-orange-500 leading-7 text-[20px] font-semibold'>
              You did not book any slot
          </h3>
      }
      </div>
  )
}

export default MyBookings