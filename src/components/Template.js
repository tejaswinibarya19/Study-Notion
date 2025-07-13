import React from 'react'
import frameImg from "../assests/frame.png"
import SignupForm from './SignupForm'
import LoginForm from "./LoginForm"   
import { FcGoogle } from 'react-icons/fc'
export const Template = ({title,desc1,desc2,image,formtype,setIsLoggedIn}) => {
  return (
    <div className='flex  max-w-[1160px] w-11/12 py-12 mx-auto justify-between'>
        <div className='w-11/12 max-w-[450px]'>
            <h1 className='text-white font-semibold text-[1.87rem] leading-[2.375rem]'>{title}</h1>
            <p className='flex flex-col text-[1.125rem] leading-[1.625rem] mt-4'>
                <span className='text-blue-200 '>{desc1}</  span>
                <span className='text-blue-100 italic'>{desc2}</span>
            </p>
            { 
                formtype==="signup"?(<SignupForm  setIsLoggedIn={setIsLoggedIn}/>):(<LoginForm setIsLoggedIn={setIsLoggedIn}/>)
            }
            <div className='flex w-full items-center my-4 gap-x-2'>
                <div className='h-[1px] bg-white w-full'></div>
                <p className='text-white font-medium leading-[1.375rem]'>Or</p>
                <div className='h-[1px] bg-white w-full'></div>
            </div>
             
            <button className='w-full flex justify-center items-center rounded-[8px] font-medium text-w hite border px-[12px] py-[8px] gap-x-2 mt-6' >
                 <FcGoogle></FcGoogle>
                <p className='text-yellow-50'>Sign in with Google</p>
            </button>
        </div>
        <div className='relative w-11/12 max-w-[450px]'>
            <img src={frameImg} height={504} width={558} loading='lazy'></img>
            <img src={image} height={504} width={558} loading='lazy' className='absolute -top-4 right-4'></img>
        </div>
    </div>
  )
}
export default Template;