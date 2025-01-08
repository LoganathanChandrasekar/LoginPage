import React ,{useState} from 'react'

const Login = () => {
    const  [state, setState] = useState('Sign up');
  return (
    <div>
      <img src={assets.logo} alt ="" />
    </div>
  )
}

export default Login
