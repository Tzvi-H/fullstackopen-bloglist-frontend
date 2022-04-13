import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [ blogs, setBlogs ] = useState([])
  const [ title, setTitle ] = useState('')
  const [ author, setAuthor ] = useState('')
  const [ url, setUrl ] = useState('')
  const [ notificationMessage, setNotificationMessage ] = useState(null)
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ user, setUser ] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotificationMessage(`Welcome ${user.name}`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 4000);
    } catch (exception) {
      console.log('wrong credentials')
    }
  }

  const handleLogout = event => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
    setNotificationMessage(`Logged out successfully`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 4000);
  }

  const addBlog = event => {
    event.preventDefault()

    const newBlogObject = {
      title,
      author,
      url
    }

    blogService
      .create(newBlogObject)
      .then(data => {
        blogFormRef.current.toggleVisiblity()
        setBlogs(blogs.concat(data));
        setNotificationMessage(`a new blog "${title}" by "${author}" added`)
        setTimeout(() => {
          setNotificationMessage(null)
        }, 4000);
        setTitle('')
        setAuthor('')
        setUrl('')
      })
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <form onSubmit={addBlog}>

        <div>
          title <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          author: <input value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <div>
          url: <input value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>

        <button type="submit">create</button>
      </form>
    </Togglable>
  )

  if (user === null) {
    return (
      <div>
        <Notification message={notificationMessage} />
        <h2>Log in to Application</h2>
        {loginForm()}
      </div>
    )
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

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App