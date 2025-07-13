import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import toast from "react-hot-toast"
import { AiOutlineEye ,AiOutlineEyeInvisible} from "react-icons/ai";
export const LoginForm = ({setIsLoggedIn}) => {
    const[formData,setFormData]=useState({email:"",password:""})
    const[showPassword,setShowPassword]=useState(false)
    const navi=useNavigate();
        function changeHandler(event)
        {
            setFormData(prev=>{
                return{
                    ...prev,
                    [event.target.name]:event.target.value
                }
            })
        }
        function submitHandler(event)
        {
            event.preventDefault();
            setIsLoggedIn(true);
            toast.success("Logged In");
            navi("/dashboard");
        }
    return (
    <form onSubmit={submitHandler} className='flex flex-col  w-full gap-y-4 mt-6'>
        <label className='w-full'>
            <p className='text-white text-[0.875rem] mb-1 leading-[1.375rem]'>Email Address<sup className='text-pink-200'>*</sup></p>
            <input 
                type='text'
                onChange={changeHandler}
                placeholder='Enter email address' 
                required
                name='email'
                value={formData.email}
                className='rounded-[0.5rem] bg-gray-700 w-full p-[12px] text-white'
                >
            </input>
        </label>

        <label className='relative w-full'>
            <p className='text-white text-[0.875rem] mb-1 leading-[1.375rem]'> Password<sup className='text-pink-200'>*</sup></p>
            <input 
                type={showPassword?("text"):("password")}
                onChange={changeHandler}
                placeholder='Enter  password' 
                required
                name='password'
                value={formData.password}
                className=' rounded-[0.5rem] bg-gray-700 w-full p-[12px] text-white'
                >
            </input>

            <span className='absolute right-3 top-[38px] cursor-pointer' onClick={()=>setShowPassword(prev=>!prev)}>
                                    {showPassword?(<AiOutlineEyeInvisible  fontSize={24} fill='#AFB2BF'/>):(<AiOutlineEye fontSize={24} fill='#AFB2BF'/>)}
            </span>

            <Link to="#">
                <p className='text-blue-200 text-xs mt=1 max-w-max ml-auto'>Forgot Password</p>
            </Link>
        </label>
        

        <button className='bg-yellow-400 rounded-[8px] font-medium text-black px-[12px] py-[8px] mt-6'>
            Sign In
        </button>
        </form>
  )
}
export default LoginForm;