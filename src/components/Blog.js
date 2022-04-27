const Blog = ({ blog, updateBlog, isCurrentUser, deleteBlog }) => {
  if (!blog) {
    return null;
  }

  const handleBlogLike = () => {
    const newBlog = { ...blog, likes: blog.likes + 1 };
    updateBlog(newBlog);
  };

  const handleBlogDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id);
    }
  };

  return (
    <div>
      <h1>
        {blog.title} {blog.author}
      </h1>
      <a>{blog.url}</a>
      <br />
      {blog.likes} likes<button onClick={handleBlogLike}>like</button>
      <br />
      added by {blog.user && blog.user.name}
      <br />
      {isCurrentUser ? (
        <button onClick={handleBlogDelete}>remove</button>
      ) : null}
    </div>
  );
};

export default Blog;
