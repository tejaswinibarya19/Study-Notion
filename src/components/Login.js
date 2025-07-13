import React from 'react'
import loginImg from "../assests/login.png"
import Template from "./Template"
export const Login = ({setIsLoggedIn}) => {
  return (
    <Template
        title="Welcome Back"
        desc1="Build skills for today,tomorrow and beyond"
        desc2="Education to future-proof your career"
        image={loginImg}
        formtype="login"
        setIsLoggedIn={setIsLoggedIn}>
    </Template>
  )
}
export default Login;