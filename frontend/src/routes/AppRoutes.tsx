import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import React from 'react'
import UserAuth from "../auth/UserAuth";

const AppRoutes:React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<UserAuth><Home /></UserAuth>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
    </Routes>
  )
}

export default AppRoutes