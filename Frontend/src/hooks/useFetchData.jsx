import React, { useContext, useEffect, useState } from 'react'
// import { token } from '../config.js'
import { authContext } from '../context/AuthContext.jsx'


const useFetchData = (url) => {

const [data,setData]=useState([])
const [loading,setLoading]=useState(false)
const  [error,setError]=useState(null)
const {token,dispatch}=useContext(authContext)

useEffect(()=>{

    


    const fetchData=async()=>{
        setLoading(true)
        console.log(url,"  ",token)
       try{ const res=await fetch(url,{
            headers:{
                // "Content-Type": "application/json"
                
                Authorization:`Bearer ${token}`}
         })

        const result =await res.json();
     
        if(!res.ok)
        {
            throw new Error(result.message + "😠")
        }

        console.log(result.data)

        setData(result.data)
        setLoading(false)
       


    }
    catch(error){
        
        

        setLoading(false)
        setError(error.message)
    }


    }

    fetchData()
 


},[url]);

  return {data,loading,error}
    
  
}

export default useFetchData