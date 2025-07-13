import React, { useState } from 'react'
import toast from "react-hot-toast"
import { AiOutlineEye ,AiOutlineEyeInvisible} from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
export const SignupForm = ({setIsLoggedIn}) => {
    const navi=useNavigate();
    const[formData,setFormData]=useState({firstname:"",lastname:"",email:"",password:"",confirmPassword:""})
    const[showPassword,setShowPassword]=useState(false) 
    const[showConfirmPassword,setShowConfirmPassword]=useState(false) 
    const[accountType,setAccountType]=useState("student")
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
        if(formData.password!=formData.confirmPassword)
        {
            toast.error("Password not matched")
            return;
        }
       
        setIsLoggedIn(true);
        toast.success("Account Created");
        navi('/dashboard');
    }
  return (
    <div>
        <div className='flex rounded-full max-w-max  bg-gray-900 p-1 gap-x-1 my-6'>
            <button 
            onClick={()=>setAccountType("student")}
            className={`${accountType==="student"?
            "text-white bg-gray-700" :
            "text-gray-400 bg-transparent"} py-2 px-5 rounded-full transition-all duration-200`}>Student</button>
            <button 
            onClick={()=>setAccountType("instructor")} 
            className={`${accountType==="instructor"?
                "text-white bg-gray-700" :
                "text-gray-400 bg-transparent"} py-2 px-5 rounded-full transition-all duration-200`}
            >Instructor</button>
        </div>
        
        <form onSubmit={submitHandler} >
            <div className='flex justify-between mt-[10px]'>
                <label>
                <p className='text-white text-[0.875rem] mb-1 leading-[1.375rem]'>First Name<sup className='text-pink-200'>*</sup></p>
                    <input
                        required
                        type='text'
                        onChange={changeHandler}
                        name="firstname"
                        value={formData.firstname}
                        placeholder='first name'
                        className='rounded-[0.5rem] bg-gray-700 w-full p-[12px] text-white'
                    >
                    </input>
                </label>

                <label>
                <p className='text-white text-[0.875rem] mb-1 leading-[1.375rem]'>Last Name<sup className='text-pink-200'>*</sup></p>
                    <input
                        required
                        type='text'
                        onChange={changeHandler}
                        name="lastname"
                        value={formData.lastname}
                        placeholder='last name'
                        className='rounded-[0.5rem] bg-gray-700 w-full p-[12px] text-white'
                    >
                    </input>
                </label>
            </div>

                <label className='mt-[10px]'>
                <p className='text-white text-[0.875rem] mb-1 leading-[1.375rem]'>Email Address<sup className='text-pink-200'>*</sup></p>
                    <input
                        required
                        type='text'
                        onChange={changeHandler}
                        name="email"
                        value={formData.email}
                        placeholder='Enter email address'
                        className='rounded-[0.5rem] bg-gray-700 w-full p-[12px] text-white'
                    >
                    </input>
                </label>
            
            <div className='flex justify-between mt-[10px]'>
                <label className='relative '>
                    <p className='text-white text-[0.875rem] mb-1 leading-[1.375rem]'>Create Password<sup className='text-pink-200'>*</sup></p>
                    <input
                        required
                        type={showPassword?("text"):("password")}
                        onChange={changeHandler}
                        name="password"
                        value={formData.password}
                        placeholder='Enter Password'
                        className='rounded-[0.5rem] bg-gray-700 w-full p-[12px] text-white'
                    >
                    </input>
                    <span className='absolute right-3 top-[38px] cursor-pointer' onClick={()=>setShowPassword(prev=>!prev)}>
                        {showPassword?(<AiOutlineEyeInvisible  fontSize={24} fill='#AFB2BF'/>):(<AiOutlineEye  fontSize={24} fill='#AFB2BF'/>)}
                    </span>
                </label>

                <label className='relative'>
                    <p className='text-white text-[0.875rem] mb-1 leading-[1.375rem]'>Confirm Password<sup className='text-pink-200'>*</sup></p>
                    <input
                        required
                        type={showConfirmPassword?("text"):("password")}
                        onChange={changeHandler}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        placeholder='Confirm Password'
                        className='rounded-[0.5rem] bg-gray-700 w-full p-[12px] text-white' 
                    >
                    </input>
                    <span className='absolute right-3 top-[38px] cursor-pointer'onClick={()=>setShowConfirmPassword (prev=>!prev)}>
                        {showConfirmPassword?(<AiOutlineEyeInvisible  fontSize={24} fill='#AFB2BF'/>):(<AiOutlineEye  fontSize={24} fill='#AFB2BF'/>)}
                    </span>
                </label>

            </div>

            <button className='bg-yellow-400 rounded-[8px] font-medium text-black px-[12px] py-[8px] mt-6 w-full'>Create Account</button>
        </form>
    </div>
  )
}
export default SignupForm;