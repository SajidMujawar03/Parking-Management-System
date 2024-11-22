import React, { useContext, useState } from 'react'
import { authContext } from '../../context/AuthContext'


import useFetchData from "../../hooks/useFetchData.jsx"


import MyBookings from './MyBookings'
import MyProfile from './MyProfile'
import Loading from '../../components/Loader/Loading.jsx'
import Error from '../../components/Error/Error.jsx'

import { Link, Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'


const BASE_URL = import.meta.env.VITE_BASE_URL;


const MyAccount = () => {

    const {token,dispatch}=useContext(authContext)

    const [tab,setTab]=useState("settings");

    const {data:userData,loading,error}=useFetchData(`${import.meta.env.VITE_BASE_URL}/api/v1/user/profile/me`)


    const navigate=useNavigate();


    const handleLogout=()=>{
        dispatch({
            type:"LOGOUT"

        })
    }
    const handleDelete = async () => {
        try {
            
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/user/${localStorage.getItem("user")._id}`, {
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
    <section className="p-24">
    <div className="max-w-[1170px] px-5 mx-auto">
      {loading && !error && <Loading />}
  
      {error && !loading && (
        <>
          <Error errorMessage={error} className="block w-full" />
          <Link to="../login" onClick={handleLogout} className="block w-full bg-black">
            Login
          </Link>
        </>
      )}
  
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          <div className="pb-[50px] px-[30px] rounded-md">
            <div className="flex items-center justify-center">
              <figure className="w-[100px] h-[100px] border-2 border-solid border-orange-600 rounded-full">
                <img src={userData.photo} alt="" className="w-full h-full rounded-full" />
              </figure>
            </div>
  
            <div className="text-center mt-4">
              <h3 className="text-[18px] leading-[30px] text-slate-700 font-bold">
                {userData.name}
              </h3>
              <p className="text-slate-700 text-[15px] leading-6 font-medium">{userData.email}</p>
            </div>
  
            <div className="mt-[50px] md:mt-[100px] ">
              <button
                className="bg-[#181A1E] w-full p-3 text-[16px] leading-7 rounded-md text-white"
                onClick={handleLogout}
              >
                Logout
              </button>
              <button
                className="bg-red-600 w-full mt-4 p-3 text-[16px] leading-7 rounded-md text-white"
                onClick={handleDelete}
              >
                Delete Account
              </button>
            </div>
          </div>
  
          <div className="md:col-span-2 md:px-[30px]">
            <div>
              <button
                className={`${tab === 'settings' && 'bg-orange-400 text-white'} py-2 mr-5 px-5 rounded-md text-slate-900 font-semibold text-[16px] leading-7 border border-solid border-b-orange-400`}
                onClick={() => setTab('settings')}
              >
                Profile Settings
              </button>
  
              <button
                className={`${tab === 'bookings' && 'bg-orange-400 text-white'} p-2 px-5 rounded-md text-slate-900 font-semibold text-[16px] leading-7 border border-solid border-b-orange-400`}
                onClick={() => setTab('bookings')}
              >
                My Bookings
              </button>
            </div>
  
            {tab === 'bookings' && <MyBookings />}
            {tab === 'settings' && <MyProfile user={userData} />}
          </div>
        </div>
      )}
    </div>
  </section>
  
  )
}

export default MyAccount