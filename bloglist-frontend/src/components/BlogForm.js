import React from "react";
import { useState } from "react";
const BlogForm = ( {addBlog} ) => {

    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [author, setAuthor] = useState('')

    const submitBlog = async ( event ) => {
      event.preventDefault()
      console.log('submitBlog!')
      try {
        const blogObject = {
          title : title,
          url : url,
          author : author,
        }
        addBlog(blogObject)
        setTitle('')
        setUrl('')
        setAuthor('')
      } catch (exception) {

      }
    
    }
  
return (
    <form onSubmit={submitBlog}>
      <div>
          Title:
          <input
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
      </div>
      <div>
          Writer:
          <input
            type="text"
            value={author}
            name="Password"
            onChange={({ target }) => setAuthor(target.value)}
          />
      </div>
      <div>
          URL:
          <input
            type="text"
            value={url}
            name="Blog URL"
            onChange={({ target }) => setUrl(target.value)}
          />
      </div>
      <button type="submit">Add blog!</button>
    </form>      
)}
  export default BlogForm
