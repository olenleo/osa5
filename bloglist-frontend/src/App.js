import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Button from './components/Button'
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
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
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
      setToken(readToken)
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

  
   const submitBlog = async ( event ) => {
    try {
      const blogObject = {
        title : blogTitle,
        url : blogURL,
        author : author,
        user: user.id
      }
        
      blogService.create(blogObject)
      .then(response => {
        setBlogs([...blogs, blogObject])
      })
           
      
    } catch (exception) {
      setErrorMessage('Blog upload error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  
  }

  const logout = () => {
    
    localStorage.removeItem('loggedInUser')
    localStorage.removeItem('token')
    setUser(null);
    setToken(null);
    
  }
 
  const getUser = async() => {
    const res = await userService.getUser(user);
    console.log('Got ', res)
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
      {blogs.map(blog =>
       <Blog key={blog.id} blog={blog} />
      )}
     
      <h2>Add new blog:</h2>
     <BlogForm 
      handleAddNewBlog={submitBlog} 
      setTitle = {setBlogTitle} 
      setAuthor = {setAuthor} 
      setURL = {setBlogURL} />
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
