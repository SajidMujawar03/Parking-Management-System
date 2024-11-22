import React, { useContext, useState } from 'react'
import { authContext } from '../../context/AuthContext.jsx'


import useFetchData from "../../hooks/useFetchData.jsx"


import MyBookings from './MyBookings.jsx'
import MyProfile from './MyProfile.jsx'
import Loading from '../../components/Loader/Loading.jsx'
import Error from '../../components/Error/Error.jsx'

import { Link, Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const BASE_URL = import.meta.env.VITE_BASE_URL;


const DashBoard = () => {

    const {token,dispatch,user}=useContext(authContext)

    const [tab,setTab]=useState("settings");

    const {data:userData,loading,error}=useFetchData(`${import.meta.env.VITE_BASE_URL}/api/v1/owner/profile/me`)


    const navigate=useNavigate();


    const handleLogout=()=>{
        dispatch({
            type:"LOGOUT"

        })
    }
    const handleDelete = async () => {
        try {
    
            // Make DELETE request to the server
           
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/owner/${user._id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`  
                }
            });

            const result = await res.json();
            // Check if response is ok
            if (!res.ok) {
                
                throw new Error(result.message || 'Failed to delete account');
            }
        
            toast.success(result.message)

            // Dispatch logout and redirect after deletion
            dispatch({
                type: "LOGOUT"
            });
            navigate("/login");  // Redirect to login after account deletion
        } catch (err) {
            console.error("Error deleting account:", err.message);
            alert(`Failed to delete account: ${err.message}`);  // Show error to the user
        }
    };
  return (
    <section className='p-6 md:p-24'>
    <div className='max-w-[1170px] px-5 mx-auto'>
      {loading && !error && <Loading />}
      {error && !loading && (
        <>
          <Error errorMessage={error} className="block w-full" />
          <Link
            to="../login"
            onClick={handleLogout}
            className="block w-full bg-black text-white py-2 text-center mt-4"
          >
            Login
          </Link>
        </>
      )}
  
      {!loading && !error && (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
          {/* User Info Section */}
          <div className='pb-[50px] px-[20px] md:px-[30px] rounded-md'>
            <div className='flex items-center justify-center'>
              <figure className='w-[80px] md:w-[100px] h-[80px] md:h-[100px] border-2 border-orange-600 rounded-full'>
                <img src={userData.photo} alt="" className='w-full h-full rounded-full' />
              </figure>
            </div>
  
            <div className='text-center mt-4'>
              <h3 className="text-[16px] md:text-[18px] font-bold text-slate-700">
                {userData.name}
              </h3>
              <p className="text-slate-700 text-[14px] md:text-[15px] font-medium">
                {userData.email}
              </p>
            </div>
  
            <div className='mt-8'>
              <button
                className='bg-black w-full py-2 text-white rounded-md'
                onClick={handleLogout}
              >
                Logout
              </button>
              <button
                className='bg-red-600 w-full mt-4 py-2 text-white rounded-md'
                onClick={handleDelete}
              >
                Delete Account
              </button>
            </div>
          </div>
  
          {/* Tab and Content Section */}
          <div className='md:col-span-2 px-5 md:px-[30px]'>
            <div className='flex flex-wrap gap-3 mb-5'>
              <button
                className={`py-2 px-4 rounded-md text-slate-900 font-semibold border border-orange-400 ${
                  tab === "settings" && "bg-orange-400 text-white"
                }`}
                onClick={() => setTab("settings")}
              >
                Profile Settings
              </button>
              <button
                className={`py-2 px-4 rounded-md text-slate-900 font-semibold border border-orange-400 ${
                  tab === "bookings" && "bg-orange-400 text-white"
                }`}
                onClick={() => setTab("bookings")}
              >
                My Created Slots
              </button>
            </div>
            {tab === "bookings" && <MyBookings />}
            {tab === "settings" && <MyProfile user={userData} />}
          </div>
        </div>
      )}
    </div>
  </section>
  
  )
}

export default DashBoard