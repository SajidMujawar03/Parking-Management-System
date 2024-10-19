import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Signup = () => {
 //formdata that need to besubmitted to backend for login verification
 const [formData,setFormData]=useState({
    name:'',
    email:'',
    password:'',
    role:'',
    address:'',
    phone:'',
    photo:'',

  })

  const [loading,setLoading]=useState(false)
  //const {dispatch}=useContext(authContext)

 // const navigate=useNavigate()

  const handleInputChange=(e)=>{
      setFormData({
        ...formData,
        [e.target.name]:e.target.value,
       
  })

  }

  const handleFileInputChange=async (e)=>{
    const file =e.target.files[0]


      //const data=await uploadImageToCLoudinary(file)
    
      //setPreviewURL(data.url)

      //setSelectedFile(data.url)

      //setFormData({...formData,photo:data.url})
      

}

  
  const submitHandler=async (e)=>{
  

    
    e.preventDefault()
  
    setLoading(true)

   
    
    try {
      const res =await fetch(`${BASE_URL}/auth/login`,
        {method:'post',
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(formData),
        }
      )

      //const result=await res.json()
      
 
      // console.log(res.ok)
    //   if(!res.ok)
    //   {
       
    //     throw new Error(result.message || "something went wrong")
    //   }

        // console.log("hi")
    //   dispatch({
    //     type:"LOGIN_SUCCESS",
    //     payload:{
    //       user:result.data,
    //       role:result.role,
    //       token:result.token
    //     }
    //   })

 
      setLoading(false)
      //toast.success(result.message)

      //navigate('/')
      
    } catch (error) {
      
      //toast.error(err.message)

      setLoading(false)
    }
    
  }
  return (
   <>
    <section className='section'>
        <div className='container flex items-center justify-center '>
            <div className=' w-[500px] p-[20px]  card rounded-md'>

                    <h3 className='text-[24px] font-semibold'>Create <span className='text-[#F3C623]'>
                           Acount
                        </span> & lets Start!!!
                    </h3>
                    <form action="" className="py-4 md:py-0" onSubmit={submitHandler}>
                    <div className="mb-5">
                            <input type="text" placeholder="Enter Your Name" name="name" value={formData.name} onChange={handleInputChange} className="w-full  py-3 border-b border-solid border-orange-400 focus:outline-none focus:border-b-orange-600 text-[16px] leading-7 text-slate-900 placeholder:text-slate-600  cursor-pointer" required autoComplete="username"/>
                        </div>
                        <div className="mb-5">
                            <input type="email" placeholder="Enter Your Email" name="email" value={formData.email} onChange={handleInputChange} className="w-full  py-3 border-b border-solid border-orange-400 focus:outline-none focus:border-b-orange-600 text-[16px] leading-7 text-slate-900 placeholder:text-slate-600  cursor-pointer" required autoComplete="username"/>
                        </div>
                        <div className="mb-5">
                            <input type="password" placeholder="Enter Password" name="password" value={formData.password} onChange={handleInputChange} className="w-full  py-3 border-b border-solid border-orange-400 focus:outline-none focus:border-b-orange-600 text-[16px] leading-7 text-slate-900 placeholder:text-slate-600  cursor-pointer" required autoComplete="current-password"/>
                        </div>
                        <div >
                            <p className='text-[18px] font-semibold'>Create an account as? </p>
                            <div className='flex flex-row gap-3'> 
                            <div>
                                <input type="radio" id='user' name='role' value='user'  onChange={handleInputChange} />
                                <label htmlFor="user">User</label>
                            </div>
                            <div>
                                <input type="radio" id='owner' name='role' value='owner'  onChange={handleInputChange}/>
                                <label htmlFor="owner">Owner</label>
                            </div>
                            </div>
                        </div>
                        {/* <div className="mb-5">
                            <input type="text" placeholder="Enter your Address" name="address" value={formData.address} onChange={handleInputChange} className="w-full  py-3 border-b border-solid border-orange-400 focus:outline-none focus:border-b-orange-600 text-[16px] leading-7 text-slate-900 placeholder:text-slate-600  cursor-pointer" required autoComplete="current-password"/>
                        </div> */}
                        <div className="mb-5">
                        <input type="tel"  name="phone" pattern="[0-9]{10}" placeholder="Enter Your Mobile No. Format(000-000-0000)"value={formData.phone} onChange={handleInputChange} className="w-full  py-3 border-b border-solid border-orange-400 focus:outline-none focus:border-b-orange-600 text-[16px] leading-7 text-slate-900 placeholder:text-slate-600  cursor-pointer" required autoComplete="current-password"/>
                        </div>
                        <div className='relative w-[130px] h-[50px]'>
                        <label 
                        htmlFor="custoFile" 
                        className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-slate-900 font-semibold rounded-lg truncate  cursor-pointer z-0">
                        Upload Photo
                        </label>
                        <input 
                        type="file" 
                        name='photo' 
                        id='customFile' 
                        accept='.jpg , .png , '
                        onChange={handleFileInputChange}
                        className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-99'  
                        />
                        </div>

                        <div className="mt-3 w-full flex justify-center items-center">
                            <button
                            type="submit"
                            disabled={loading && true}
                            className=" btn w-[200px] h-[50px] text-white text-[18px] leading-[30px] rounded-lg px-4 py-4 flex justify-center items-center">
                                {loading ? <HashLoader color="#ffffff" size={35}/>:"Register"}
                            </button>
                        </div>

                        <p className="mt-5 text-slate-700 text-center">
                            Already Have an Account?
                            <Link to="/login" className="text-orange-500 font-medium ml-1">
                                Login
                            </Link>
                        </p>

                    </form>

            </div>
        </div>
    </section>
    </>
  )
}

export default Signup