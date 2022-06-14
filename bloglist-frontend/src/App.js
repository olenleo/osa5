import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Button from './components/Button'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [user, setUser] = useState(() => {
    return localStorage.getItem('loggedInUser') || null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedInUser')
    const loggedTokenJSON = localStorage.getItem('token')
    if (loggedUserJSON) {
      const readToken = JSON.parse(loggedTokenJSON)
      const readName = JSON.parse(loggedUserJSON)
      setUser(readName)
      setToken(readToken)
    }
  }, [])
  
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])
 
  const handleLogin = async (event) => {
    event.preventDefault()
   
    console.log('Log in!')
    try {
      const loggedUser = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(loggedUser.username)
      )
      window.localStorage.setItem(
        'token', JSON.stringify(loggedUser.token)
      )
     
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    setUsername('')
    setPassword('')
    window.location.reload();
  }

  const logout = () => {
    console.log('LOGOUT')
    localStorage.removeItem('loggedInUser')
    localStorage.removeItem('token')
    setUser(null);
    setToken(null);
    
  }

  const loggedIn = () => {
     
    return (
      <LoginForm  handleLogin = {handleLogin}
      username = {username}
      password = { password}
      setUsername = {setUsername}
      setPassword = {setPassword} 
      />
    )
  }

  return (
    <div>
      {user === null ?
         loggedIn()
         :
          <div>
            <p>{user} logged in <Button handleClick={() => {
              logout()
            }} text = 'logout'></Button></p>
            {blogs.map(blog =>
             <Blog key={blog.id} blog={blog} />
            )}
          </div>
      }
    </div>
  )
}

export default App
