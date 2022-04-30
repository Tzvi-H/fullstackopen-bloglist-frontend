import axios from 'axios'

const Blog = ({ blog, updateBlog, isCurrentUser, deleteBlog, addComment }) => {
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

  const submitComment = async event => {
    event.preventDefault();
    const comment = event.target.comment.value

    await addComment(blog.id, comment)
    
    event.target.reset()
  }

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

      <div>
        <h3>comments</h3>

        <form onSubmit={submitComment}>
          <input type="text" name="comment"/>
          <input type="submit" value="add comment"/>
        </form>

        <ul>
          {blog.comments.map(c => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Blog;
