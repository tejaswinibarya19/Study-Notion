import React, { useState } from 'react'
import logoImg from '../assests/Logo.svg'
import { Link } from 'react-router-dom'
import {toast} from 'react-hot-toast'
export const Navbar = ({isLoggedIn,setIsLoggedIn}) => {
   
    function logoutHandler()
    {
        setIsLoggedIn(false)
        toast.success("Logged out")
    }
  return (
    <div className='flex justify-between items-center w-11/12 max-w-[1160px] py-4 mx-auto'>
        <Link to="/">
            <img src={logoImg} height={32} width={160} loading='lazy'></img>
        </Link>
        <nav>
            <ul className='flex justify-center items-center gap-x-6 text-white'>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/">About</Link></li>
                <li><Link to="/">Contact</Link></li>
            </ul>
        </nav>

        {/* Button */}
        <div className='flex items-center gap-x-4 '>
            {
                isLoggedIn?(<Link to="/">
                    <button onClick={logoutHandler} className='bg-gray-600 text-white py-[8px] px-[12px] rounded-[8px] border  border-gray-600'>Log out</button>
                    </Link>):( <Link to="/login">
                    <button className='bg-gray-600 text-white py-[8px] px-[12px] rounded-[8px] border  border-gray-600'>Log in</button>
                </Link>)
            }

            {
                !isLoggedIn&&(<Link to="/signup"><button className='bg-gray-600 text-white py-[8px] px-[12px] rounded-[8px] border  border-gray-600'>Sign up</button></Link>)
            }  
            
            {
                isLoggedIn&&(<Link to="/dashboard"><button className='bg-gray-600 text-white py-[8px] px-[12px] rounded-[8px] border  border-gray-600'>Dashboard</button></Link>)
            }
             
        </div>
    </div>
  )
}
export default Navbar;