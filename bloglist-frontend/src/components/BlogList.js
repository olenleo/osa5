import React from "react";
import Blog from "./Blog";
import PropTypes from 'prop-types'

const BlogList = ( {blogs, handleLike, handleDelete} ) => {
    return (
        <div>
          {blogs.sort((blog1, blog2) => blog2.likes - blog1.likes).map(blog =>
            <Blog
              key={ blog.id  }
              blog={ blog  }
              handleLike = {handleLike}
              handleDelete = {handleDelete}
            />
          )}
        </div>
      )
}
BlogList.propTypes = {
  blogs: PropTypes.array.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired
}
export default BlogList