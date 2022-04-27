import React, { useState, useEffect, useRef } from "react";

import {
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useMatch,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import Blog from "./components/Blog";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";

import blogService from "./services/blogs";
import loginService from "./services/login";
import usersService from "./services/users";

import { notificationChange } from "./reducers/notificationReducer";
import { blogsSet, blogsAdd } from "./reducers/blogReducer";
import { userSet } from "./reducers/userReducer";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);

  const loggedInUser = useSelector((state) => state.user);
  const blogs = useSelector((state) => state.blogs);

  const dispatch = useDispatch();

  const blogFormRef = useRef();

  const match = useMatch("/users/:id");
  const user = match ? users.find((user) => user.id === match.params.id) : null;

  const blogsToShow = blogs.slice().sort((a, b) => b.likes - a.likes);

  useEffect(() => {
    blogService.getAll().then((blogs) => dispatch(blogsSet(blogs)));
  }, []);

  useEffect(() => {
    usersService.getAll().then((users) => {
      setUsers(users);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(userSet(user));
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

      blogService.setToken(user.token);
      dispatch(userSet(user));
      setUsername("");
      setPassword("");
      dispatch(notificationChange(`Welcome ${user.name}`));
      setTimeout(() => {
        dispatch(notificationChange(null));
      }, 4000);
    } catch (exception) {
      console.log("wrong credentials");
    }
  };

  const handleLogout = () => {
    dispatch(userSet(null));
    window.localStorage.removeItem("loggedBlogappUser");
    dispatch(notificationChange("Logged out successfully"));
    setTimeout(() => {
      dispatch(notificationChange(null));
    }, 4000);
  };

  const addBlog = (blogObject) => {
    blogService.create(blogObject).then((data) => {
      blogFormRef.current.toggleVisiblity();
      data.user = loggedInUser;
      dispatch(blogsAdd(data));
      dispatch(
        notificationChange(
          `a new blog "${blogObject.title}" by "${blogObject.author}" added`
        )
      );
      setTimeout(() => {
        dispatch(notificationChange(null));
      }, 4000);
    });
  };

  const updateBlog = (blogObject) => {
    blogService.update(blogObject).then((data) => {
      dispatch(blogsSet(blogs.map((b) => (b.id !== data.id ? b : data))));
      dispatch(
        notificationChange(
          `blog "${blogObject.title}" by "${blogObject.author}" liked`
        )
      );
      setTimeout(() => {
        dispatch(notificationChange(null));
      }, 4000);
    });
  };

  const deleteBlog = (blogId) => {
    blogService.remove(blogId).then(() => {
      dispatch(blogsSet(blogs.filter((b) => b.id !== blogId)));
      dispatch(notificationChange("blog successfully deleted"));
      setTimeout(() => {
        dispatch(notificationChange(null));
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

  const CreateView = () => (
    <>
      <h2>create new</h2>
      {blogForm()}

      {blogsToShow.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
          isCurrentUser={
            blog.user !== null && blog.user.username === loggedInUser.username
          }
        />
      ))}
    </>
  );

  const User = ({ user }) => {
    if (!user) {
      return null;
    }
    return (
      <div>
        <h3>{user.name}</h3>
        <h2>added blogs</h2>
        <ul>
          {user.blogs.map((blog) => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      </div>
    );
  };

  const Users = ({ users }) => {
    return (
      <div>
        <h2>Users</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>blogs created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loggedInUser === null) {
    return (
      <div>
        <Notification />
        <h2>Log in to Application</h2>
        {loginForm()}
      </div>
    );
  }

  return (
    <div>
      <Notification />
      <h2>blogs</h2>
      <p>
        {loggedInUser.name} logged in
        <button onClick={handleLogout}>log out</button>
      </p>

      <Routes>
        <Route path="/users/:id" element={<User user={user} />} />
        <Route path="/users" element={<Users users={users} />} />
        <Route path="/" element={<CreateView />} />
      </Routes>
    </div>
  );
};

export default App;
