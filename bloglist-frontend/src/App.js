import { useState, useEffect } from 'react'
import Button from './components/Button'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [user, setUser] = useState(() => {
    return localStorage.getItem('loggedInUser') || null;
  });
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState('')
  const [notificationType, setNotificationType] = useState('')


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    const loggedTokenJSON = window.localStorage.getItem('token')
    if (loggedUserJSON) {
      const readToken = JSON.parse(loggedTokenJSON)
      const readName = JSON.parse(loggedUserJSON)
      setUser(readName)
      blogService.setToken(readToken)
    }
  }, [])
 
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])
  
  const handleLogin = async (loginObject) => {
    try {
      const loggedUser = await loginService.login(
        loginObject
      )
      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(loggedUser.username)
      )
      window.localStorage.setItem(
        'token', JSON.stringify(loggedUser.token)
      )
      setUser(window.localStorage.getItem('loggedInUser'))
     
    } catch (exception) {
      setNotification('wrong credentials')
      console.log(exception)
      setNotificationType('error')
      setTimeout(() => {
        setNotification(null)
        setNotificationType(null)
      }, 5000)
    }
  } 
  const logout = () => {
    localStorage.removeItem('loggedInUser')
    localStorage.removeItem('token')
    setUser(null);
    setNotification('Logged out')
    setNotificationType('success')
    setTimeout(() => {
      setNotification(null)
      setNotificationType(null)
    }, 5000)
  }

  const submitBlog =  async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      setNotification(`Add ${newBlog.title}`)
      setNotificationType('success')
      setTimeout(() => {
        setNotification(null)
        setNotificationType(null)
      }, 5000)} 
    catch (e) {
      setNotification(`Error in blog upload: ${e}`)
      setNotificationType('error')
      setTimeout(() => {
        setNotification(null)
        setNotificationType(null)
      }, 5000)
    }
  }
  
  const loginView = () => {
    return (
      <div>
      <LoginForm  handleLogin = {handleLogin}
        username = {username}
        password = { password}
        setUsername = {setUsername}
        setPassword = {setPassword} 
      />
    </div>

    )
  }
  const loggedOut = () => {
    return (  
    <div>
      <p>{user} logged in <Button handleClick={() => {
        logout() 
      }} text = 'logout'></Button></p>
      <BlogList blogs = {blogs}/>
      <h2>Add new blog:</h2>
      <BlogForm addBlog= {submitBlog}/>
    </div>
    )
  }
  return (
    <div>
      {user === null ? <div>{loginView()}</div> : loggedOut()}
      <Notification message = {notification} notificationType = {notificationType} />
    </div>
  )
}

export default App
