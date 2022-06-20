import React, {useState}from 'react'
import loginService from '../services/login'
const LoginForm = ( {handleLogin} ) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  const submitLogin = async( event ) => {
    event.preventDefault()
    try {
      const loggedUser = {
        username : username,
        password : password
      }
      handleLogin(loggedUser)
    } catch (e) {

    } 
  }
  

  return (
    <form onSubmit={submitLogin}>
      <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
      </div>
      <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
      </div>, 
      <button type="submit">login</button>
    </form>      
    )}
  export default LoginForm