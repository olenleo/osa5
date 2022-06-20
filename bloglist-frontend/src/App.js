import { useState, useEffect, useRef} from 'react'
import Button from './components/Button'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import './index.css'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [user, setUser] = useState(() => {
    return localStorage.getItem('loggedInUser') || null;
  });
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState('')
  const [notificationType, setNotificationType] = useState('')
  const blogFormRef = useRef()


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
    blogFormRef.current.toggleVisibility()
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      setNotification(`Blog ${newBlog.title} added successfully`)
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
      <Togglable buttonLabel = "New blog" ref = {blogFormRef}>
      <BlogForm addBlog= {submitBlog}/>
      </Togglable>
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
