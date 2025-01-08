import React from 'react'
import { assets } from '../assets/assets'
const Header = () => {
  return (
    <div class='flex flex-col items-center text-center  px-4 mt-20 text-center text-gray-800'>
      <img src={assets.header_img} alt ="" className='w-36 h-36 rounded-full mb-6'/>
      <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey Developer <img className='w-8 aspect-square' src={assets.hand_wave} alt=""/></h1>
      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to Fun Chat</h2>
      <p className='mb-8 max-w-md'>Let's start with a quick product tour and we will have you up and running in no time!</p>
      <buttom className='border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'>Get Started</buttom>
    </div>
  )
}

export default Header
