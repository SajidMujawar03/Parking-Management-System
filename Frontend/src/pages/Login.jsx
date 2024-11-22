import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HashLoader from 'react-spinners/HashLoader'
import { authContext } from '../context/AuthContext'
import { toast } from 'react-toastify'

const BASE_URL = import.meta.env.VITE_BASE_URL;



const Login = () => {
   
    const [formData,setFormData]=useState({
        email:'',
        password:'',
        role:'user',
      })
    
      const [loading,setLoading]=useState(false)
      const {dispatch}=useContext(authContext)
    
     const navigate=useNavigate()
    
      const handleInputChange=(e)=>{
          setFormData({
            ...formData,
            [e.target.name]:e.target.value,
           
      })
   
      }
    
      
      const submitHandler=async (e)=>{
      
    
        
        e.preventDefault()
      
        setLoading(true)
    
       
        
        try {
          const res =await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/login`,
            {method:'post',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(formData),
            }
          )
    
          const result=await res.json()
          
     
          
          if(!res.ok)
          {
           
            throw new Error(result.message || "something went wrong")
          }
  
            
          dispatch({
            type:"LOGIN_SUCCESS",
            payload:{
              user:result.data,
              role:result.data.role,
              token:result.token
            }
          })

    
     
          setLoading(false)
          toast.success(result.message)
    
          navigate('/')
          
        } catch (error) {
          
          toast.error(error.message)
    
          setLoading(false)
        }
        
      }
  return (
    <>
    <section className='section'>
        <div className='container flex items-center justify-center '>
            <div className=' w-[500px] p-[20px]  card rounded-md'>

                    <h3 className='text-[24px] font-semibold'>Hello <span className='text-[#F3C623]'>
                            Welcome
                        </span> back!!!
                    </h3>
                    <form action="" className="py-4 md:py-0" onSubmit={submitHandler}>
                        <div className="mb-5">
                            <input type="email" placeholder="Enter Your Email" name="email" value={formData.email} onChange={handleInputChange} className="w-full  py-3 border-b border-solid border-orange-400 focus:outline-none focus:border-b-orange-600 text-[16px] leading-7 text-slate-900 placeholder:text-slate-600  cursor-pointer" required autoComplete="username"/>
                        </div>
                        <div className="mb-5">
                            <input type="password" placeholder="Enter Password" name="password" value={formData.password} onChange={handleInputChange} className="w-full  py-3 border-b border-solid border-orange-400 focus:outline-none focus:border-b-orange-600 text-[16px] leading-7 text-slate-900 placeholder:text-slate-600  cursor-pointer" required autoComplete="current-password"/>
                        </div>
                        <div >
                            <p className='text-[18px] font-semibold'>Login As ? </p>
                            <div className='flex flex-row gap-3'> 
                            <div>
                                <input type="radio" id='user' name='role' value='user' checked={formData.role === 'user'} onChange={handleInputChange} />
                                <label htmlFor="user">User</label>
                            </div>
                            <div>
                                <input type="radio" id='owner' name='role' value='owner' checked={formData.role === 'owner'}  onChange={handleInputChange}/>
                                <label htmlFor="owner">Owner</label>
                            </div>
                            </div>

                        </div>

                        <div className="mt-3 w-full flex justify-center items-center">
                            <button
                            type="submit"
                            disabled={loading && true}
                            className=" btn w-[200px] h-[50px] text-white text-[18px] leading-[30px] rounded-lg px-4 py-4 flex justify-center items-center">
                                {loading ? <HashLoader color="#ffffff" size={35}/>:"Login"}
                            </button>
                        </div>

                        <p className="mt-5 text-slate-700 text-center">
                            Don't have an account? 
                            <Link to="/register" className="text-orange-500 font-medium ml-1">
                                Register
                            </Link>
                        </p>

                    </form>

            </div>
        </div>
    </section>
    </>
  )
}

export default Login