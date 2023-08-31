import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  


  
  return (
    <div className="topnav">
      
      
      <Link className='a' to="/">Home</Link>
      <Link className='a' to="/orders">Orders</Link>
      <Link className='a' to="/contact">Contact</Link>
      <Link className='a' to="/about">About</Link>
    </div>
  )
}
