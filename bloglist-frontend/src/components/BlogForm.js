import React from "react";

const BlogForm = ( {
    handleAddNewBlog,
    title, 
    writer, 
    url,
    setTitle,
    setAuthor,
    setURL 
    } ) => (
    <form onSubmit={handleAddNewBlog}>
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
            value={writer}
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
            onChange={({ target }) => setURL(target.value)}
          />
      </div>
      <button type="submit">Add blog!</button>
    </form>      
  )
  export default BlogForm
