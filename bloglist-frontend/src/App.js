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
      setUsername(readName)
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
	  setUsername(JSON.stringify(loggedUser.username))
     
    } catch (exception) {
      setNotification('wrong credentials')
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

  const handleDelete = async (id) => {
    
    const blog = blogs.find(b => b.id === id)
    console.log('User ', user, ' asks to delete ' , blog)
    if (window.confirm(`Remove '${blog.title}' by ${blog.author}?`)) {
      try {
        await blogService.removeItem(blog.id)
		setNotification(`${blog.title} deleted`)
		setNotificationType('success')
        setBlogs(blogs.filter(b => id !== b.id))
      } catch (e) {
        console.log('---->', e)
        setNotification(`${blog.title} already removed from server?`)
        setNotificationType('error')
      }
    setTimeout(() => {
      setNotification(null)
      setNotificationType(null)
    }, 5000)
    }
  }

  const handleLike = async (id) => {
    const blog = blogs.find(b => b.id === id)
    const updatedBlog = {
      user : blog.user.id,
      likes : blog.likes + 1,
      author: blog.author,
      title  :blog.title,
      url : blog.url
    }
    try {
      const ret = await blogService.like(id,updatedBlog)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : ret))
      setNotificationType("success")
      setNotification(`Liked ${blog.title}`)
      setTimeout(() => {
        setNotification(null)
        setNotificationType(null)
      }, 5000)
    } catch (e) {
      setBlogs(blogs.filter(n => n.id !== id))
      setNotificationType("error")
      setNotification(`${blog.title} is probably missing from the server.`)
      setTimeout(() => {
        setNotification(null)
        setNotificationType(null)
      }, 5000)} 
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
  const loggedIn = () => {
    return (  
    <div>
      {console.log('user:', localStorage.loggedInUser)}
      {console.log('username:', username)}
      <p>{username} logged in <Button handleClick={() => {
        logout() 
      }} text = 'logout'></Button></p>
      <h2>Add new blog:</h2>
      <Togglable buttonLabel = "New blog" ref = {blogFormRef}>
      <BlogForm addBlog= {submitBlog}/>
      </Togglable>
      <h2>Blog listing</h2>
      <BlogList blogs = {blogs} handleLike ={handleLike} handleDelete={handleDelete}/>
    </div>
    )
  }
  return (
    <div>
      {user === null ? <div>{loginView()}</div> : loggedIn()}
      <Notification message = {notification} notificationType = {notificationType} />
    </div>
  )
}


export default App
