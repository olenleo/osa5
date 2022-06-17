import React from "react";
import Blog from "./Blog";
const BlogList = ( {blogs} ) => {
    return (
        <div>
            Moi!
            { blogs.map(blog =>
        // <Togglable key={ blog.id  }blog={ blog  }buttonLabel="show" negativeButtonLable="hide">
        <Blog
          key={ blog.id  }
          blog={ blog  }
        />
        // </Togglable>
      ) }
        </div>
      )
}
export default BlogList