import React from "react";
import Blog from "./Blog";
import PropTypes from 'prop-types'

const BlogList = ( {blogs, handleLike, handleDelete} ) => {
    return (
        <div className="bloglist">
          {blogs.sort((blog1, blog2) => blog2.likes - blog1.likes).map(blog =>
		  <div className="blogListingField" key={blog.id}>
            <Blog
              key={ blog.id }
              blog={ blog }
              handleLike = { handleLike }
              handleDelete = { handleDelete }
            />
		</div>
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