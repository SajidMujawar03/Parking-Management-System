import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { uploadToCloudinary } from '../../utils/uploadToCloudinary.js'
// import { BASE_URL } from '../../config.js'
import { toast } from 'react-toastify'
import HashLoader from "react-spinners/HashLoader.js"

const BASE_URL = import.meta.env.VITE_BASE_URL;


const MyProfile = ({ user }) => {

  const [selectedFile, setSelectedFile] = useState('')
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    oldPassword: '',
    password: '',
    photo: null,
    phone: '',
  })

  useEffect(() => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: formData.password || "",
      oldPassword: formData.oldPassword || '',
      photo: user.photo || "",
      phone: user.phone || "",
    })
  }, [user])

  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0]
    const data = await uploadToCloudinary(file)
    setSelectedFile(data.url)
    setFormData({ ...formData, photo: data.url })
    localStorage.setItem('photo', data.url)
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/user/${user._id}`,
        {
          method: 'put',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(formData),
        }
      )

      const { message } = await res.json()

      if (!res.ok) {
        throw new Error(message)
      }

      setLoading(false)
      toast.success(message)
      navigate('/users/profile/me')

    } catch (error) {
      toast.error(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="mt-10">
    <form onSubmit={submitHandler}>
      <div className="mb-5">
        <input
          type="text"
          placeholder="Full Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full py-3 pr-4 border-b border-solid border-orange-400 focus:outline-none focus:border-b-orange-600 text-[16px] leading-7 text-slate-900 placeholder:text-slate-600 cursor-pointer"
          required
        />
      </div>
  
      <div className="mb-5">
        <input
          type="email"
          placeholder="Enter Your Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          readOnly
          className="w-full py-3 pr-4 border-b border-solid border-orange-400 focus:outline-none focus:border-b-orange-600 text-[16px] leading-7 text-slate-900 placeholder:text-slate-600 cursor-pointer"
          required
        />
      </div>
  
      <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="password"
          placeholder="Enter Old Password*"
          name="oldPassword"
          required
          value={formData.oldPassword}
          onChange={handleInputChange}
          className="w-full py-3 pr-4 border-b border-solid border-orange-400 focus:outline-none focus:border-b-orange-600 text-[16px] leading-7 text-slate-900 placeholder:text-slate-600 cursor-pointer"
        />
        <input
          type="password"
          placeholder="Enter New Password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full py-3 pr-4 border-b border-solid border-orange-400 focus:outline-none focus:border-b-orange-600 text-[16px] leading-7 text-slate-900 placeholder:text-slate-600 cursor-pointer"
        />
      </div>
  
      <div className="mb-5">
        <input
          type="tel"
          name="phone"
          pattern="[0-9]{10}"
          placeholder="Enter Your Mobile No. Format(0000000000)"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full py-3 border-b border-solid border-orange-400 focus:outline-none focus:border-b-orange-600 text-[16px] leading-7 text-slate-900 placeholder:text-slate-600 cursor-pointer"
          required
          autoComplete="current-password"
        />
      </div>
  
      <div className="mb-5 flex items-center gap-3">
        {formData.photo && (
          <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-orange-500 flex items-center justify-center">
            <img src={formData.photo} alt="" className="w-full rounded-full" />
          </figure>
        )}
  
        <div className="relative w-[130px] h-[50px]">
          <label
            htmlFor="custoFile"
            className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#ff840046] text-slate-900 font-semibold rounded-lg truncate cursor-pointer z-0"
          >
            {selectedFile ? selectedFile.name : 'Upload Photo'}
          </label>
  
          <input
            type="file"
            name="photo"
            id="customFile"
            accept=".jpg , .png"
            onChange={handleFileInputChange}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-99"
          />
        </div>
      </div>
  
      <div className="mt-7">
        <button
          disabled={loading}
          type="submit"
          className="w-full bg-orange-400 text-white text-[18px] leading-[30px] rounded-lg px-4 py-4"
        >
          {loading ? <HashLoader size={35} color="#ffffff" /> : 'Update'}
        </button>
      </div>
    </form>
  </div>
  
  )
}

export default MyProfile
