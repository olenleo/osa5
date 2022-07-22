import { useState } from "react"
import Button from "./Button"

const Blog = ({blog, handleLike, handleDelete}) => {
  const [visible, setVisible] = useState(false)
  const [buttonLabel, setButtonLabel] = useState('show')
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisible = () => {
    setButtonLabel(visible === false ? 'hide' : 'show')
    setVisible(!visible)
  }

  const displayBlog = () => {
    if (!visible)  {
      return ( <p><b>{blog.title}</b>  <Button handleClick={() => {
        toggleVisible() 
      }} text = {buttonLabel}></Button></p>)
    } else {
      return (
      <div>
        
        <p><b>{blog.title}</b> <Button handleClick={() => {toggleVisible()}} text = {buttonLabel}></Button></p>
        <p>Author: {blog.author}</p>
        <p>Likes: {blog.likes}  <Button handleClick={() => {handleLike(blog.id)}} text = 'Like'/> </p>
        <p>Link: <a href = {blog.url}>{blog.url}</a> </p>
        <p><Button handleClick={() => {handleDelete(blog.id)}} text= 'Remove'/></p>
      </div>
      )
    }
  }

  return (
  <div style = {blogStyle}>
     { displayBlog() }
  </div>  
  )
}

export default Blog