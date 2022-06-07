const Blog = ({blog}) => (
  <div>
    {console.log('blog', blog)}
    {blog.title} {blog.author}
  </div>  
)

export default Blog