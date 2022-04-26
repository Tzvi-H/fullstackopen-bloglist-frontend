import React, { useState, useEffect, useRef } from "react";

import Blog from "./components/Blog";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";

import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();

  const blogsToShow = blogs.slice().sort((a, b) => b.likes - a.likes);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      setNotificationMessage(`Welcome ${user.name}`);
      setTimeout(() => {
        setNotificationMessage(null);
      }, 4000);
    } catch (exception) {
      console.log("wrong credentials");
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem("loggedBlogappUser");
    setNotificationMessage("Logged out successfully");
    setTimeout(() => {
      setNotificationMessage(null);
    }, 4000);
  };

  const addBlog = (blogObject) => {
    blogService.create(blogObject).then((data) => {
      blogFormRef.current.toggleVisiblity();
      data.user = user;
      setBlogs(blogs.concat(data));
      setNotificationMessage(
        `a new blog "${blogObject.title}" by "${blogObject.author}" added`
      );
      setTimeout(() => {
        setNotificationMessage(null);
      }, 4000);
    });
  };

  const updateBlog = (blogObject) => {
    blogService.update(blogObject).then((data) => {
      setBlogs(blogs.map((b) => (b.id !== data.id ? b : data)));
      setNotificationMessage(
        `blog "${blogObject.title}" by "${blogObject.author}" liked`
      );
      setTimeout(() => {
        setNotificationMessage(null);
      }, 4000);
    });
  };

  const deleteBlog = (blogId) => {
    blogService.remove(blogId).then(() => {
      setBlogs(blogs.filter((b) => b.id !== blogId));
      setNotificationMessage("blog successfully deleted");
      setTimeout(() => {
        setNotificationMessage(null);
      }, 4000);
    });
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          id="username"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          id="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit" id="login-button">
        login
      </button>
    </form>
  );

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm addBlog={addBlog} />
    </Togglable>
  );

  if (user === null) {
    return (
      <div>
        <Notification message={notificationMessage} />
        <h2>Log in to Application</h2>
        {loginForm()}
      </div>
    );
  }

  return (
    <div>
      <Notification message={notificationMessage} />
      <h2>blogs</h2>
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>log out</button>
      </p>

      <h2>create new</h2>
      {blogForm()}

      {blogsToShow.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
          isCurrentUser={
            blog.user !== null && blog.user.username === user.username
          }
        />
      ))}
    </div>
  );
};

export default App;
