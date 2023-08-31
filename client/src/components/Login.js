import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Login({loggedin,setLoggedin}) {
  const navigate = useNavigate();
  const [clicklogin,setClicklogin]=useState(false)
  const [newUser,setNewUser] = useState(false)
  const [name,setName]=useState("");
  const [passw,setPassw]=useState("");

  const login=async() => {
    try {
      const response = await axios.post('api/v1/login', { username:name,password:passw });
      console.log(response.data)
      localStorage.setItem('token', response.data.token);
      setLoggedin(true)
      setClicklogin(false)
      setName("")
      setPassw("")
      navigate('/');
    } catch (error) {
      alert("invalid username or password")
      console.error('Error creating item:', error);
    }
  }

  const signup=async()=>{
    try {
      await axios.post('api/v1/signup', { username:name,password:passw });
      alert('signup successful')
      setName("")
      setPassw("")
      setNewUser(false);
    } catch (error) {
      alert("username already taken")
      console.error('username already taken', error);
    }
  }
   
  const logOut = async() =>{
    localStorage.removeItem('token');
    setLoggedin(false)
  }

  function stop(e){
    e.preventDefault();
  }
  
  return (
    
    <div >
      {
      loggedin?
        <h3>
        <button className='buttonL' onClick={logOut}>log Out</button>
        </h3> 
        :
        <>
          <button className="buttonL" onClick={()=>setClicklogin(!clicklogin) } >Login</button>
          <button className="buttonL" onClick={()=>{setClicklogin(!clicklogin); setNewUser(true)}} >Sign Up</button>
        </>
        
      }
      <div className='loginDiv' style={clicklogin?{display:"flex"}:{display:"none"}}>

        <div className="loginShade" >

          <form onSubmit={stop} className="login-content" >

            <span className="closeX" onClick={()=>{setClicklogin(!clicklogin); setNewUser(false)}}>&times;</span>
            <b>Username</b>
            <input type="text" className='inputname'  value={name} onChange={(e)=>setName(e.target.value)} placeholder="Enter Username"  required/>
            <b>Password</b>
            <input type="password" className='inputpassword'  value={passw} onChange={(e)=>setPassw(e.target.value)}  placeholder="Enter Password" required/>
            
            {
              newUser?
              <button onClick={signup} className="buttonL">Sign up</button>
              :
              <button onClick={login} className="buttonL">Login</button>
            }


          </form>

        </div> 


      </div>
      
    </div>
  )
}