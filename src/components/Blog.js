import { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, updateBlog, isCurrentUser, deleteBlog }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleBlogLike = () => {
    const newBlog = { ...blog, likes: blog.likes + 1 };
    updateBlog(newBlog);
  };

  const handleBlogDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id);
    }
  };

  const detailView = () => (
    <>
      <br />
      {blog.url}
      <br />
      likes {blog.likes}
      <button onClick={handleBlogLike}>like</button>
      <br />
      {blog.user && blog.user.name}
      <br />
      {isCurrentUser ? (
        <button onClick={handleBlogDelete}>remove</button>
      ) : null}
    </>
  );

  return (
    <div style={blogStyle} className="blog">
      {blog.title} {blog.author}
      <button onClick={toggleShowDetails}>
        {showDetails ? "hide" : "view"}
      </button>
      {showDetails ? detailView() : null}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  isCurrentUser: PropTypes.bool.isRequired,
};

export default Blog;
