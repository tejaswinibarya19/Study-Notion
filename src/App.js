import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import { useState } from "react";
import { Route,Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
function App() {
  const[isLoggedIn,setIsLoggedIn]=useState(false);
  return (
    <div className="w-screen h-screen bg-black flex flex-col overflow-hidden">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}></Navbar>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>}></Route>
        <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn}/>}></Route>
        <Route path="/dashboard" element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <Dashboard/>
            </PrivateRoute>
          }></Route>
      </Routes>
     </div>
  );
}

export default App;
