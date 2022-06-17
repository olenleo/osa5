import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Button from './components/Button'
import BlogList from './components/BlogList'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/user';
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [user, setUser] = useState(() => {
    return localStorage.getItem('loggedInUser') || null;
  });
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [blogTitle, setBlogTitle] = useState('')
  const [author, setAuthor]  = useState('')
  const [blogURL, setBlogURL] = useState('')

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
  
  const handleLogin = async (event) => {
    event.preventDefault()
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
    
    localStorage.removeItem('loggedInUser')
    localStorage.removeItem('token')
    setUser(null);
    
  }

  const submitBlog =  async (blogObject) => {
    console.log('TICK!')
    const newBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(newBlog))
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
      {console.log('Bloglist below recieves', blogs)}
      <BlogList blogs = {blogs}/>
      <h2>Add new blog:</h2>
     <BlogForm addBlog= {submitBlog}/>
    </div>
    )
  }
  return (
    <div>
      {user === null ? <div>{loginView()}</div> : loggedOut()}
    </div>
  )
}

export default App
